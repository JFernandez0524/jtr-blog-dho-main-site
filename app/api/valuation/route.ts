import { NextRequest, NextResponse } from "next/server";

const BRIDGE_BASE = "https://api.bridgedataoutput.com/api/v2";

const GHL_HEADERS = (token: string) => ({
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json",
  "Version": "2021-07-28",
});

function getBridgeHeaders() {
  const apiKey = process.env.BRIDGE_DATA_API_KEY;
  if (!apiKey) throw new Error("BRIDGE_DATA_API_KEY not configured");
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
  const headers = getBridgeHeaders();
  const cleanedCity = cleanCity(city);
  const zip5 = zip?.split("-")[0];
  const variations = generateAddressVariations(street);

  for (const addr of variations) {
    const url = new URL(`${BRIDGE_BASE}/zestimates_v2/zestimates`);
    url.searchParams.set("limit", "10");
    url.searchParams.set("address", addr);
    url.searchParams.set("city", cleanedCity);
    url.searchParams.set("state", state);
    url.searchParams.set("postalCode", zip5);

    const res = await fetch(url.toString(), { headers });
    if (!res.ok) continue;
    const data = await res.json();
    if (data.bundle?.length > 0) return pickBest(data.bundle).zestimate || 0;
  }

  if (lat && lng) {
    for (const radius of ["0.0005", "0.001", "0.002"]) {
      const url = new URL(`${BRIDGE_BASE}/zestimates_v2/zestimates`);
      url.searchParams.set("limit", "10");
      url.searchParams.set("near", `${lng},${lat}`);
      url.searchParams.set("radius", radius);

      const res = await fetch(url.toString(), { headers });
      if (!res.ok) continue;
      const data = await res.json();
      if (data.bundle?.length > 0) return pickBest(data.bundle).zestimate || 0;
    }
  }

  return 0;
}

async function syncToGHL(body: any, zestimate: number) {
  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) throw new Error("GHL credentials not configured");

  const nameParts = (body.name || "").trim().split(" ");
  const firstName = nameParts[0] || "Unknown";
  const lastName = nameParts.slice(1).join(" ") || "Lead";

  const customFields = [
    { id: "p3NOYiInAERYbe0VsLHB", value: body.street },
    { id: "h4UIjKQvFu7oRW4SAY8W", value: body.city },
    { id: "9r9OpQaxYPxqbA6Hvtx7", value: body.state },
    { id: "hgbjsTVwcyID7umdhm2o", value: body.zip },
    { id: "7wIe1cRbZYXUnc3WOVb2", value: zestimate.toString() },
    { id: "oaf4wCuM3Ub9eGpiddrO", value: "INHERITED PROPERTY" },
    { id: "pGfgxcdFaYAkdq0Vp53j", value: "Property Valuation Form" },
  ];

  const res = await fetch("https://services.leadconnectorhq.com/contacts/", {
    method: "POST",
    headers: GHL_HEADERS(token),
    body: JSON.stringify({
      locationId,
      firstName,
      lastName,
      email: body.email,
      phone: body.phone,
      source: "Property Valuation Form",
      tags: ["valuation-lead", "inherited-property"],
      customFields,
    }),
  });

  const result = await res.json();

  if (res.status === 400 && result.meta?.contactId) {
    await fetch(`https://services.leadconnectorhq.com/contacts/${result.meta.contactId}`, {
      method: "PUT",
      headers: GHL_HEADERS(token),
      body: JSON.stringify({ tags: ["valuation-lead", "inherited-property"], customFields }),
    });
  } else if (!res.ok) {
    const errBody = await res.text();
    console.error("GHL error body:", errBody);
    throw new Error(`GHL error: ${res.status}`);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { street, city, state, zip } = body;

  let zestimate = 0;
  try {
    zestimate = await getZestimate(street, city, state, zip, body.lat, body.lng);
  } catch (err) {
    console.error("Zestimate lookup failed:", err);
  }

  try {
    await syncToGHL(body, zestimate);
  } catch (err) {
    console.error("GHL sync failed:", err);
  }

  return NextResponse.json({
    success: true,
    valuation: { zestimate, address: body.address, city, state, zip },
  });
}
