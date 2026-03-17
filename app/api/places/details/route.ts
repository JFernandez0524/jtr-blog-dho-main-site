import { NextRequest, NextResponse } from "next/server";

// Resolves a Google Place ID to structured address components + coordinates
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const placeId = req.nextUrl.searchParams.get("placeId");
    if (!placeId) {
      console.log("Places Details API: Missing placeId");
      return NextResponse.json({ error: "Missing placeId" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Places Details API: GOOGLE_MAPS_API_KEY not configured");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "address_components,geometry,formatted_address");
    url.searchParams.set("key", apiKey);

    console.log(`Places Details API: Requesting ${placeId} (${Date.now() - startTime}ms)`);

    const res = await fetch(url.toString());
    const data = await res.json();
    
    console.log(`Places Details API: Response status ${res.status}`, {
      status: data.status,
      error_message: data.error_message,
      has_result: !!data.result,
      duration: Date.now() - startTime
    });

    if (!res.ok) {
      console.error(`Places Details API: HTTP error ${res.status} ${res.statusText}`);
      return NextResponse.json({ error: "External API error" }, { status: 500 });
    }

    if (data.error_message) {
      console.error(`Places Details API: Google error - ${data.error_message}`);
      return NextResponse.json({ error: data.error_message }, { status: 500 });
    }

    const result = data.result;
    if (!result) {
      console.log("Places Details API: Place not found");
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    const get = (type: string) =>
      result.address_components?.find((c: any) => c.types.includes(type))?.long_name || "";
    const getShort = (type: string) =>
      result.address_components?.find((c: any) => c.types.includes(type))?.short_name || "";

    return NextResponse.json({
      street: `${get("street_number")} ${get("route")}`.trim(),
      city: get("locality"),
      state: getShort("administrative_area_level_1"),
      zip: get("postal_code"),
      lat: result.geometry?.location?.lat,
      lng: result.geometry?.location?.lng,
      address: result.formatted_address,
    });
  } catch (error) {
    console.error("Places Details API: Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
