import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasGhlToken: !!process.env.GHL_API_TOKEN,
    hasGhlLocationId: !!process.env.GHL_LOCATION_ID,
    tokenLength: process.env.GHL_API_TOKEN?.length || 0,
    // Don't expose actual values!
  });
}
