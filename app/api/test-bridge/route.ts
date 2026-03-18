import { NextResponse } from "next/server";

const BRIDGE_BASE = "https://api.bridgedataoutput.com/api/v2";

export async function GET() {
  const apiKey = process.env.BRIDGE_DATA_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({
      error: "BRIDGE_DATA_API_KEY not configured",
      configured: false
    });
  }

  try {
    // Test API key with a simple request
    const testUrl = `${BRIDGE_BASE}/zestimates_v2/zestimates?limit=1&address=123 Main St&city=Newark&state=NJ&postalCode=07102`;
    
    const response = await fetch(testUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    return NextResponse.json({
      configured: true,
      apiKeyPrefix: apiKey.substring(0, 10) + "...",
      testResponse: {
        status: response.status,
        statusText: response.statusText,
        data: data
      }
    });
  } catch (error) {
    return NextResponse.json({
      configured: true,
      apiKeyPrefix: apiKey.substring(0, 10) + "...",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
