import { NextRequest, NextResponse } from "next/server";

// Resolves a Google Place ID to structured address components + coordinates
export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get("placeId");
  if (!placeId) return NextResponse.json({ error: "Missing placeId" }, { status: 400 });

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "address_components,geometry,formatted_address");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  const data = await res.json();
  const result = data.result;
  if (!result) return NextResponse.json({ error: "Place not found" }, { status: 404 });

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
}
