import { NextRequest, NextResponse } from "next/server";

// Debug endpoint to check Places API configuration
export async function GET(req: NextRequest) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    config: {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      apiKeyPrefix: apiKey?.substring(0, 10) + "..." || "not set"
    },
    allEnvKeys: Object.keys(process.env).filter(key =>
      key.includes('GOOGLE') || key.includes('MAPS') || key.includes('PLACES')
    ),
    testUrl: "Try: /api/places/autocomplete?input=test"
  });
}