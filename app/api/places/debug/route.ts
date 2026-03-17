import { NextRequest, NextResponse } from "next/server";

// Debug endpoint to check Places API configuration
export async function GET(req: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  
  // Basic security - only show detailed info in development
  if (isProduction) {
    return NextResponse.json({
      environment: "production",
      timestamp: new Date().toISOString(),
      status: "Use server logs for debugging in production"
    });
  }
  
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    config: {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      apiKeyPrefix: apiKey?.substring(0, 10) + "..." || "not set"
    },
    testUrl: "Try: /api/places/autocomplete?input=test"
  });
}
