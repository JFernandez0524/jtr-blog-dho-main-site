import { NextRequest, NextResponse } from "next/server";

// Returns autocomplete suggestions for a partial address query
export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("input");
  if (!input) return NextResponse.json({ predictions: [] });

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  url.searchParams.set("input", input);
  url.searchParams.set("types", "address");
  url.searchParams.set("components", "country:us");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  const data = await res.json();

  return NextResponse.json(
    data.predictions?.map((p: any) => ({
      placeId: p.place_id,
      description: p.description,
    })) ?? []
  );
}
