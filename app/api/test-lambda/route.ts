import { NextResponse } from "next/server";

export async function GET() {
  const functionUrl = process.env.NEXT_PUBLIC_AMPLIFY_FUNCTION_URL;
  
  if (!functionUrl) {
    return NextResponse.json({
      error: "NEXT_PUBLIC_AMPLIFY_FUNCTION_URL not configured",
      configured: false
    });
  }

  try {
    // Test Lambda function connectivity
    const testPayload = {
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      formType: "CONTACT",
      message: "Test connection",
      submissionId: "test-connection"
    };

    const response = await fetch(`${functionUrl}/ghl-contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
    });

    const data = await response.json();

    return NextResponse.json({
      configured: true,
      functionUrl: functionUrl,
      testResponse: {
        status: response.status,
        statusText: response.statusText,
        data: data
      }
    });
  } catch (error) {
    return NextResponse.json({
      configured: true,
      functionUrl: functionUrl,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
