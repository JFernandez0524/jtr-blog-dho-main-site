import { NextRequest, NextResponse } from "next/server";
import { ContactFormSchema } from "@/lib/validation";
import { cookiesClient } from "@/utils/amplify-utils";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

// Rate limiting: in-memory store
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function getRateLimitKey(request: NextRequest): string {
  return request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  // Clean up old entries
  for (const [k, v] of rateLimitMap.entries()) {
    if (v.resetTime < now) {
      rateLimitMap.delete(k);
    }
  }

  if (!record || record.resetTime < now) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY not configured, skipping verification");
    return true; // Allow submission if reCAPTCHA not configured
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    
    // reCAPTCHA v3 returns a score between 0.0 and 1.0
    // 0.0 is very likely a bot, 1.0 is very likely a human
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return true; // Allow submission if verification fails (fail open)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { 
          status: 429,
          headers: { "Retry-After": "3600" }
        }
      );
    }

    const body = await request.json();

    // Verify reCAPTCHA token
    if (body.recaptchaToken) {
      const isHuman = await verifyRecaptcha(body.recaptchaToken);
      if (!isHuman) {
        return NextResponse.json(
          { error: "Bot detected. Please try again." },
          { status: 400 }
        );
      }
    }

    // Validate request body
    const validation = ContactFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const { name, email, phone, message, serviceType, source, referrer } = validation.data;

    const client = cookiesClient;

    // STEP 1: Save to DynamoDB FIRST (never lose a lead)
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

    if (!submission.data) {
      throw new Error("Failed to save submission to database");
    }

    console.log("Submission saved to DynamoDB:", submission.data.id);

    // STEP 2: Attempt to sync to GHL via Lambda
    try {
      const lambda = new LambdaClient({ region: process.env.AWS_REGION || "us-east-1" });
      const command = new InvokeCommand({
        FunctionName: process.env.GHL_LAMBDA_FUNCTION_NAME!,
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

    // Always return success to user (lead is saved)
    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been received.",
      submissionId: submission.data.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        error: "Failed to process submission",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
