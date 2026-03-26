import { NextRequest, NextResponse } from "next/server";
import { ContactFormSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rateLimit";
import { cookiesClient } from "@/utils/amplify-utils";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const GHL_LAMBDA_FUNCTION_NAME = process.env.GHL_LAMBDA_FUNCTION_NAME;
if (!GHL_LAMBDA_FUNCTION_NAME) {
  console.warn("GHL_LAMBDA_FUNCTION_NAME not set — GHL sync will be skipped");
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) return true;

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });
    const data = await response.json();
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false; // fail closed
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(rateLimitKey)) {
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

    const { name, email, phone, message, serviceType, source, referrer } = validation.data;
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

    if (GHL_LAMBDA_FUNCTION_NAME) {
      try {
        const lambda = new LambdaClient({ region: process.env.AWS_REGION || "us-east-1" });
        const command = new InvokeCommand({
          FunctionName: GHL_LAMBDA_FUNCTION_NAME,
          Payload: JSON.stringify({
            body: JSON.stringify({
              name, email, phone, message, serviceType,
              formType: "CONTACT",
              referrer: referrer || "direct",
              submissionId: submission.data.id,
            }),
          }),
        });

        const response = await lambda.send(command);
        const rawPayload = JSON.parse(Buffer.from(response.Payload!).toString());
        const lambdaResult = rawPayload.body ? JSON.parse(rawPayload.body) : {};

        if (lambdaResult.ghlSynced) {
          await client.models.ContactSubmission.update({
            id: submission.data.id,
            ghlSyncStatus: "SYNCED",
            ghlContactId: lambdaResult.ghlContactId,
          });
          console.log("GHL sync successful:", lambdaResult.ghlContactId);
        } else {
          await client.models.ContactSubmission.update({
            id: submission.data.id,
            ghlSyncStatus: "FAILED",
            ghlErrorMessage: lambdaResult.ghlError || "Unknown error",
          });
          console.error("GHL sync failed:", lambdaResult.ghlError);
        }
      } catch (lambdaError) {
        console.error("Lambda invocation failed:", lambdaError);
        await client.models.ContactSubmission.update({
          id: submission.data.id,
          ghlSyncStatus: "FAILED",
          ghlErrorMessage: lambdaError instanceof Error ? lambdaError.message : "Lambda error",
        });
      }
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
