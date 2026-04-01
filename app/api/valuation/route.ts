import { NextRequest, NextResponse } from "next/server";
import { ValuationFormSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rateLimit";
import { cookiesClient } from "@/utils/amplify-utils";
import { syncToGHL } from "@/lib/ghl";

const BRIDGE_BASE = "https://api.bridgedataoutput.com/api/v2";

function getBridgeHeaders() {
  const apiKey = process.env.BRIDGE_DATA_API_KEY;
  if (!apiKey) {
    console.error("BRIDGE_DATA_API_KEY not configured");
    throw new Error("BRIDGE_DATA_API_KEY not configured");
  }
  console.log("Bridge API Key configured:", apiKey.substring(0, 10) + "...");
  return { Authorization: `Bearer ${apiKey}` };
}

function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function generateAddressVariations(street: string): string[] {
  if (!street) return [street];
  const variations = new Set<string>();
  const title = toTitleCase(street);
  variations.add(title);
  variations.add(street);

  const usps = title
    .replace(/\bNorth\b/gi, "N").replace(/\bSouth\b/gi, "S")
    .replace(/\bEast\b/gi, "E").replace(/\bWest\b/gi, "W")
    .replace(/\bStreet\b/gi, "St").replace(/\bAvenue\b/gi, "Ave")
    .replace(/\bBoulevard\b/gi, "Blvd").replace(/\bDrive\b/gi, "Dr")
    .replace(/\bRoad\b/gi, "Rd").replace(/\bLane\b/gi, "Ln")
    .replace(/\bCourt\b/gi, "Ct").replace(/\bCircle\b/gi, "Cir")
    .replace(/\bPlace\b/gi, "Pl").replace(/\bTerrace\b/gi, "Ter")
    .replace(/\bParkway\b/gi, "Pkwy");
  variations.add(usps);

  return Array.from(variations).filter(Boolean);
}

function cleanCity(city: string) {
  return city
    .replace(/\b(city|town|borough|township|village)\s+of\s+/i, "")
    .replace(/\s+(beach|township|borough|village)$/i, "")
    .trim();
}

function pickBest(bundle: any[]) {
  return bundle.sort((a, b) => {
    if (!a.unitNumber && b.unitNumber) return -1;
    if (a.unitNumber && !b.unitNumber) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  })[0];
}

async function getZestimate(
  street: string, city: string, state: string, zip: string,
  lat?: number, lng?: number
): Promise<number> {
  console.log("=== ZESTIMATE DEBUG START ===");
  console.log("Input parameters:", { street, city, state, zip, lat, lng });
  
  const headers = getBridgeHeaders();
  const cleanedCity = cleanCity(city);
  const zip5 = zip?.split("-")[0];
  const variations = generateAddressVariations(street);
  
  console.log("Processed parameters:", { cleanedCity, zip5, variations });

  for (const addr of variations) {
    console.log(`Trying address variation: "${addr}"`);
    
    const url = new URL(`${BRIDGE_BASE}/zestimates_v2/zestimates`);
    url.searchParams.set("limit", "10");
    url.searchParams.set("address", addr);
    url.searchParams.set("city", cleanedCity);
    url.searchParams.set("state", state);
    url.searchParams.set("postalCode", zip5);

    console.log("API Request URL:", url.toString());
    console.log("API Request Headers:", headers);

    const res = await fetch(url.toString(), { headers });
    console.log("API Response Status:", res.status, res.statusText);
    
    if (!res.ok) {
      console.log("API request failed, trying next variation");
      continue;
    }
    
    const data = await res.json();
    console.log("API Response Data:", JSON.stringify(data, null, 2));
    
    if (data.bundle?.length > 0) {
      const bestResult = pickBest(data.bundle);
      console.log("Best result selected:", bestResult);
      const zestimate = bestResult.zestimate || 0;
      console.log("Final zestimate:", zestimate);
      console.log("=== ZESTIMATE DEBUG END ===");
      return zestimate;
    } else {
      console.log("No results in bundle for this variation");
    }
  }

  console.log("All address variations failed, trying coordinate-based search");
  
  if (lat && lng) {
    for (const radius of ["0.0005", "0.001", "0.002"]) {
      console.log(`Trying coordinate search with radius: ${radius}`);
      
      const url = new URL(`${BRIDGE_BASE}/zestimates_v2/zestimates`);
      url.searchParams.set("limit", "10");
      url.searchParams.set("near", `${lng},${lat}`);
      url.searchParams.set("radius", radius);

      console.log("Coordinate API Request URL:", url.toString());

      const res = await fetch(url.toString(), { headers });
      console.log("Coordinate API Response Status:", res.status, res.statusText);
      
      if (!res.ok) continue;
      
      const data = await res.json();
      console.log("Coordinate API Response Data:", JSON.stringify(data, null, 2));
      
      if (data.bundle?.length > 0) {
        const bestResult = pickBest(data.bundle);
        console.log("Best coordinate result:", bestResult);
        const zestimate = bestResult.zestimate || 0;
        console.log("Final coordinate zestimate:", zestimate);
        console.log("=== ZESTIMATE DEBUG END ===");
        return zestimate;
      }
    }
  }

  console.log("All zestimate attempts failed, returning 0");
  console.log("=== ZESTIMATE DEBUG END ===");
  return 0;
}

export async function POST(request: NextRequest) {
  const rateLimitKey =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(rateLimitKey)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "3600" } }
    );
  }

  const body = await request.json();

  const validation = ValuationFormSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { street, city, state, zip, name, email, phone, lat, lng, address } = validation.data;

  console.log("=== VALUATION REQUEST START ===");
  console.log("Request body:", { street, city, state, zip, name, email, phone });

  // STEP 1: Validate environment and get Zestimate from Bridge API
  let zestimate = 0;
  let zestimateError = null;
  
  try {
    // Check if API key is configured
    if (!process.env.BRIDGE_DATA_API_KEY) {
      throw new Error("BRIDGE_DATA_API_KEY environment variable not configured");
    }
    
    console.log("Calling getZestimate...");
    zestimate = await getZestimate(street, city, state, zip, lat, lng);
    console.log("getZestimate returned:", zestimate);
  } catch (err) {
    console.error("Zestimate lookup failed:", err);
    zestimateError = err instanceof Error ? err.message : "Unknown error";
  }

  const client = cookiesClient;

  // STEP 2: Save to DynamoDB FIRST (never lose a lead)
  const submission = await client.models.ContactSubmission.create({
    name,
    email,
    phone,
    formType: "VALUATION",
    street,
    city,
    state,
    zip,
    zestimate: zestimate.toString(),
    source: "Property Valuation Form",
    referrer: request.headers.get("referer") || "direct",
    submittedAt: new Date().toISOString(),
    ghlSyncStatus: "PENDING",
  });

  if (!submission.data) {
    throw new Error("Failed to save submission to database");
  }

  console.log("Valuation submission saved to DynamoDB:", submission.data.id);

  // STEP 3: Attempt to sync to GHL directly
  try {
    const ghlResult = await syncToGHL({
      name, email, phone,
      formType: "VALUATION",
      street, city, state, zip,
      zestimate: zestimate.toString(),
      referrer: request.headers.get("referer") || "direct",
      submissionId: submission.data.id,
    });
    await client.models.ContactSubmission.update({
      id: submission.data.id,
      ghlSyncStatus: ghlResult.success ? "SYNCED" : "FAILED",
      ghlContactId: ghlResult.contactId,
      ghlErrorMessage: ghlResult.error,
    });
    if (ghlResult.success) {
      console.log("GHL sync successful:", ghlResult.contactId);
    } else {
      console.error("GHL sync failed:", ghlResult.error);
    }
  } catch (error) {
    console.error("GHL sync error:", error);
    await client.models.ContactSubmission.update({
      id: submission.data.id,
      ghlSyncStatus: "FAILED",
      ghlErrorMessage: error instanceof Error ? error.message : "GHL sync error",
    });
  }

  return NextResponse.json({
    success: true,
    valuation: { zestimate, address, city, state, zip },
    ...(zestimateError && { zestimateError })
  });
}
