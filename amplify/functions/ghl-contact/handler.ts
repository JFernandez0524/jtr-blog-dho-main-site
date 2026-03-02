import type { Handler } from "aws-lambda";

interface ContactData {
  name: string;
  email: string;
  phone: string;
  message: string;
  serviceType: string;
  source?: string;
  pageUrl?: string;
  referrer?: string;
  submissionId: string;
}

interface GHLResponse {
  success: boolean;
  contactId?: string;
  error?: string;
}

async function syncToGHL(data: ContactData): Promise<GHLResponse> {
  const GHL_API_TOKEN = process.env.GHL_API_TOKEN;
  const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

  if (!GHL_API_TOKEN || !GHL_LOCATION_ID) {
    console.error("GHL credentials not configured");
    return { success: false, error: "GHL credentials not configured" };
  }

  const maxRetries = 3;
  let lastError: string = "";

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`GHL sync attempt ${attempt}/${maxRetries} for submission ${data.submissionId}`);

      const response = await fetch("https://services.leadconnectorhq.com/contacts/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GHL_API_TOKEN}`,
          "Content-Type": "application/json",
          "Version": "2021-07-28",
        },
        body: JSON.stringify({
          locationId: GHL_LOCATION_ID,
          email: data.email,
          phone: data.phone,
          name: data.name,
          source: data.source || "Website Contact Form",
          customFields: [
            {
              key: "service_interest",
              value: data.serviceType,
            },
            {
              key: "message",
              value: data.message,
            },
            {
              key: "page_url",
              value: data.pageUrl || "",
            },
            {
              key: "referrer",
              value: data.referrer || "direct",
            },
          ],
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`GHL sync successful for ${data.submissionId}:`, result.contact?.id);
        return { success: true, contactId: result.contact?.id };
      }

      lastError = `HTTP ${response.status}: ${await response.text()}`;
      console.error(`GHL sync attempt ${attempt} failed:`, lastError);

      // Exponential backoff: 1s, 2s, 4s
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

export const handler: Handler = async (event) => {
  console.log("GHL Contact Function invoked:", JSON.stringify(event, null, 2));

  try {
    const data: ContactData = JSON.parse(event.body || "{}");

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.message || !data.submissionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Attempt to sync to GHL
    const ghlResult = await syncToGHL(data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        ghlSynced: ghlResult.success,
        ghlContactId: ghlResult.contactId,
        ghlError: ghlResult.error,
        message: ghlResult.success
          ? "Contact saved and synced to GHL"
          : "Contact saved, GHL sync will be retried",
      }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
