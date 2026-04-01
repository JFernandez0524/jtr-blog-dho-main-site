export interface ContactData {
  name: string;
  email: string;
  phone: string;
  formType: "CONTACT" | "VALUATION";
  message?: string;
  serviceType?: string;
  source?: string;
  referrer?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  zestimate?: string;
  submissionId: string;
}

export interface GHLResponse {
  success: boolean;
  contactId?: string;
  error?: string;
}

const SERVICE_TYPE_MAP: Record<string, string> = {
  "inherited-property": "Probate",
  "foreclosure": "Preforeclosure",
  "sell-as-is": "Sell As Is",
};

export async function syncToGHL(data: ContactData): Promise<GHLResponse> {
  const GHL_API_TOKEN = process.env.GHL_API_TOKEN;
  const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

  if (!GHL_API_TOKEN || !GHL_LOCATION_ID) {
    console.error("GHL credentials not configured");
    return { success: false, error: "GHL credentials not configured" };
  }

  const maxRetries = 3;
  let lastError = "";

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`GHL sync attempt ${attempt}/${maxRetries} for submission ${data.submissionId}`);

      const customFields: Array<{ id: string; value: string }> = [];

      if (data.formType === "CONTACT") {
        if (data.message) customFields.push({ id: "ZvxM7eN2rOdgdV9OGKY6", value: data.message });
        if (data.referrer) customFields.push({ id: "PBInTgsd2nMCD3Ngmy0a", value: data.referrer });
        if (data.serviceType) {
          customFields.push({ id: "oaf4wCuM3Ub9eGpiddrO", value: SERVICE_TYPE_MAP[data.serviceType] || "Probate" });
        }
        customFields.push({ id: "pGfgxcdFaYAkdq0Vp53j", value: "Probate Landing Page" });
      } else if (data.formType === "VALUATION") {
        if (data.street) customFields.push({ id: "p3NOYiInAERYbe0VsLHB", value: data.street });
        if (data.city) customFields.push({ id: "h4UIjKQvFu7oRW4SAY8W", value: data.city });
        if (data.state) customFields.push({ id: "9r9OpQaxYPxqbA6Hvtx7", value: data.state });
        if (data.zip) customFields.push({ id: "hgbjsTVwcyID7umdhm2o", value: data.zip });
        if (data.zestimate) customFields.push({ id: "7wIe1cRbZYXUnc3WOVb2", value: data.zestimate });
        customFields.push({ id: "oaf4wCuM3Ub9eGpiddrO", value: "Probate" });
        if (data.referrer) customFields.push({ id: "PBInTgsd2nMCD3Ngmy0a", value: data.referrer });
        customFields.push({ id: "pGfgxcdFaYAkdq0Vp53j", value: "Probate Landing Page" });
      }

      const response = await fetch("https://services.leadconnectorhq.com/contacts/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GHL_API_TOKEN}`,
          "Content-Type": "application/json",
          Version: "2021-07-28",
        },
        body: JSON.stringify({
          locationId: GHL_LOCATION_ID,
          email: data.email,
          phone: data.phone,
          name: data.name,
          source: data.source || "Website Contact Form",
          tags: ["hot-lead"],
          customFields,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`GHL sync successful for ${data.submissionId}:`, result.contact?.id);
        return { success: true, contactId: result.contact?.id };
      }

      lastError = `HTTP ${response.status}: ${await response.text()}`;
      console.error(`GHL sync attempt ${attempt} failed:`, lastError);

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Unknown error";
      console.error(`GHL sync attempt ${attempt} error:`, lastError);
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }

  return { success: false, error: lastError };
}
