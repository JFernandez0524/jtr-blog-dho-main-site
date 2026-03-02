import { NextRequest, NextResponse } from "next/server";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs, { ssr: true });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, serviceType, source, referrer } = body;

    // Validate required fields
    if (!name || !email || !phone || !message || !serviceType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = generateClient<Schema>();

    // STEP 1: Save to DynamoDB FIRST (never lose a lead)
    const submission = await client.models.ContactSubmission.create({
      name,
      email,
      phone,
      message,
      serviceType,
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
      const lambdaResponse = await fetch(
        `${process.env.NEXT_PUBLIC_AMPLIFY_FUNCTION_URL || "http://localhost:3000"}/ghl-contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...body,
            submissionId: submission.data.id,
          }),
        }
      );

      const lambdaResult = await lambdaResponse.json();

      // Update sync status based on Lambda result
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
      // Lambda failed, but we still have the lead in DynamoDB
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
