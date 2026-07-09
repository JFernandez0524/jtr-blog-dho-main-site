import { NextRequest, NextResponse } from "next/server";
import { ContactFormSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rateLimit";
import { cookiesClient } from "@/utils/amplify-utils";
import { syncToGHL } from "@/lib/ghl";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { verifyEmailDeliverability } from "@/lib/emailVerification";

const EMAIL_UNDELIVERABLE_MESSAGE =
  "That email address doesn't appear to work — please double-check it.";

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!await checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "3600" } }
      );
    }

    const body = await request.json();

    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!body.recaptchaToken) {
        return NextResponse.json({ error: "Missing security token." }, { status: 400 });
      }
      const isHuman = await verifyRecaptcha(body.recaptchaToken);
      if (!isHuman) {
        return NextResponse.json({ error: "Bot detected. Please try again." }, { status: 400 });
      }
    }

    const validation = ContactFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, message, serviceType, source, referrer, ghlContactId } = validation.data;

    // Deliverability check (DeBounce). Only hard-invalid emails are rejected —
    // the lead gets an inline error and can fix the typo. Risky results are
    // accepted and tagged in GHL; API failures fail open.
    const emailCheck = await verifyEmailDeliverability(email);
    if (emailCheck.verdict === "undeliverable") {
      return NextResponse.json(
        { error: EMAIL_UNDELIVERABLE_MESSAGE, details: { email: [EMAIL_UNDELIVERABLE_MESSAGE] } },
        { status: 400 }
      );
    }
    if (emailCheck.verdict !== "deliverable") {
      console.log(`Email verification for ${email}: ${emailCheck.verdict}${emailCheck.reason ? ` (${emailCheck.reason})` : ""}`);
    }

    const client = cookiesClient;

    const submission = await client.models.ContactSubmission.create({
      name,
      email,
      phone,
      message,
      serviceType,
      formType: "CONTACT",
      source: source || request.url,
      pageUrl: source || request.url,
      referrer: referrer || "direct",
      submittedAt: new Date().toISOString(),
      ghlSyncStatus: "PENDING",
    });

    if (!submission.data) throw new Error("Failed to save submission to database");

    console.log("Submission saved to DynamoDB:", submission.data.id);

    try {
      const ghlResult = await syncToGHL({
        name, email, phone, message, serviceType,
        formType: "CONTACT",
        source: source || request.url,
        referrer: referrer || "direct",
        submissionId: submission.data.id,
        ghlContactId,
        emailRisky: emailCheck.verdict === "risky",
      });
      await client.models.ContactSubmission.update({
        id: submission.data.id,
        ghlSyncStatus: ghlResult.success ? "SYNCED" : "FAILED",
        ghlContactId: ghlResult.contactId,
        ghlErrorMessage: ghlResult.error,
      });
      if (ghlResult.success) {
        console.log("GHL sync successful:", ghlResult.contactId);
      } else {
        console.error("GHL sync failed:", ghlResult.error);
      }
    } catch (ghlError) {
      console.error("GHL sync error:", ghlError);
      await client.models.ContactSubmission.update({
        id: submission.data.id,
        ghlSyncStatus: "FAILED",
        ghlErrorMessage: ghlError instanceof Error ? ghlError.message : "GHL sync error",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been received.",
      submissionId: submission.data.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
