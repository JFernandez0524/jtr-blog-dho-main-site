import { NextRequest, NextResponse } from "next/server";

interface ApiResponse {
  predictions: Array<{
    placeId: string;
    description: string;
  }>;
  error?: string;
}

// Returns autocomplete suggestions for a partial address query
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const input = req.nextUrl.searchParams.get("input");
    if (!input) {
      console.log("Places API: Empty input provided");
      return NextResponse.json({ predictions: [] });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Places API: GOOGLE_MAPS_API_KEY not configured");
      return NextResponse.json({ 
        predictions: [], 
        error: "API key not configured" 
      }, { status: 500 });
    }

    const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
    url.searchParams.set("input", input);
    url.searchParams.set("types", "address");
    url.searchParams.set("components", "country:us");
    url.searchParams.set("key", apiKey);

    console.log(`Places API: Requesting ${input} (${Date.now() - startTime}ms)`);
    
    const res = await fetch(url.toString());
    const data = await res.json();
    
    console.log(`Places API: Response status ${res.status}, data:`, {
      status: data.status,
      error_message: data.error_message,
      predictions_count: data.predictions?.length || 0,
      duration: Date.now() - startTime
    });
    
    if (!res.ok) {
      console.error(`Places API: HTTP error ${res.status} ${res.statusText}`);
      return NextResponse.json({ 
        predictions: [], 
        error: "External API error" 
      }, { status: 500 });
    }

    if (data.error_message) {
      console.error(`Places API: Google error - ${data.error_message}`);
      return NextResponse.json({ 
        predictions: [], 
        error: data.error_message 
      }, { status: 500 });
    }

    const predictions = data.predictions?.map((p: any) => ({
      placeId: p.place_id,
      description: p.description,
    })) ?? [];

    return NextResponse.json({ predictions });
    
  } catch (error) {
    console.error("Places API: Unexpected error:", error);
    return NextResponse.json({ 
      predictions: [], 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
