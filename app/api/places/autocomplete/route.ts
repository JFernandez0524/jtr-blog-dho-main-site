import { NextRequest, NextResponse } from "next/server";

// Returns autocomplete suggestions for a partial address query
export async function GET(req: NextRequest) {
  try {
    const input = req.nextUrl.searchParams.get("input");
    if (!input) return NextResponse.json({ predictions: [] });

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("GOOGLE_MAPS_API_KEY not configured");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
    url.searchParams.set("input", input);
    url.searchParams.set("types", "address");
    url.searchParams.set("components", "country:us");
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString());
    
    if (!res.ok) {
      console.error(`Google API error: ${res.status} ${res.statusText}`);
      return NextResponse.json({ error: "External API error" }, { status: 500 });
    }

    const data = await res.json();

    if (data.error_message) {
      console.error(`Google API error: ${data.error_message}`);
      return NextResponse.json({ error: data.error_message }, { status: 500 });
    }

    return NextResponse.json(
      data.predictions?.map((p: any) => ({
        placeId: p.place_id,
        description: p.description,
      })) ?? []
    );
  } catch (error) {
    console.error("Places API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
