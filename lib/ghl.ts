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
  /** Existing GHL contact ID (from a mailer ?cid= param) — update that contact instead of creating a new one */
  ghlContactId?: string;
  /** DeBounce flagged the email as risky (catch-all/role/disposable) — tag so follow-up leads with a call */
  emailRisky?: boolean;
  /** Marketing attribution (utm_* + gclid) captured client-side by lib/attribution.ts */
  attribution?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    gclid?: string;
  };
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
  "general": "General Inquiry",
};

// Postcard/letter template variant from the QR URL's &msg= param (e.g. "breakup").
// Sanitized so junk params can't leak into CRM labels.
function getMailerTemplate(source: string): string | null {
  const match = source.match(/[?&]msg=([a-z-]{1,20})(?:&|$)/i);
  return match ? match[1].toLowerCase() : null;
}

// Free-text label used for the contact's top-level `source` property
export function getSourceLabel(source?: string): string {
  if (!source) return "Website";
  // Direct-mail QR landing pages — check before the organic-page substrings below
  if (source.includes("/mailer/")) {
    const template = getMailerTemplate(source);
    const suffix = template ? ` (${template})` : "";
    if (source.includes("inherited-property")) return `Direct Mail — Inherited Property${suffix}`;
    if (source.includes("preforeclosure")) return `Direct Mail — Preforeclosure${suffix}`;
    if (source.includes("sell-as-is")) return `Direct Mail — Sell As-Is${suffix}`;
    return `Direct Mail${suffix}`;
  }
  if (source.includes("/foreclosure")) return "Foreclosure Landing Page";
  if (source.includes("/sell-as-is")) return "Sell As-Is Landing Page";
  if (source.includes("/inherited-property")) return "Inherited Property Landing Page";
  if (source.includes("/contact")) return "Contact Page";
  return "Website";
}

/**
 * Value for the "Contact Type" custom field (pGfgxcdFaYAkdq0Vp53j) — a
 * SINGLE_OPTIONS picklist in GHL. Must return an EXACT picklist option
 * (Phone Contact | Direct Mail | Probate Landing Page | Foreclosure Landing
 * Page | Sell As-Is Landing Page) or null to skip the field entirely;
 * non-matching values pollute or get dropped by the picklist.
 */
export function getContactTypeOption(source?: string): string | null {
  if (!source) return null;
  if (source.includes("/mailer/")) return "Direct Mail";
  if (source.includes("/foreclosure")) return "Foreclosure Landing Page";
  if (source.includes("/sell-as-is")) return "Sell As-Is Landing Page";
  if (source.includes("/inherited-property")) return "Probate Landing Page";
  return null;
}

function getServiceTypeFromSource(source?: string): string {
  if (!source) return "General Inquiry";
  if (source.includes("/mailer/")) {
    if (source.includes("inherited-property")) return "Probate";
    if (source.includes("preforeclosure")) return "Preforeclosure";
    if (source.includes("sell-as-is")) return "Sell As Is";
    return "General Inquiry";
  }
  if (source.includes("/foreclosure")) return "Preforeclosure";
  if (source.includes("/sell-as-is")) return "Sell As Is";
  if (source.includes("/inherited-property")) return "Probate";
  return "General Inquiry";
}

// Human-readable attribution line for the contact's notes, or null when
// there's nothing worth recording
function formatAttributionNote(attr?: ContactData["attribution"]): string | null {
  if (!attr) return null;
  const parts: string[] = [];
  if (attr.utmSource || attr.utmMedium) {
    parts.push(`${attr.utmSource || "?"}/${attr.utmMedium || "?"}`);
  }
  if (attr.utmCampaign) parts.push(`campaign: ${attr.utmCampaign}`);
  if (attr.utmContent) parts.push(`content: ${attr.utmContent}`);
  if (attr.utmTerm) parts.push(`term: ${attr.utmTerm}`);
  if (attr.gclid) parts.push("gclid captured");
  return parts.length ? `Attribution: ${parts.join(" — ")}` : null;
}

function buildCustomFields(data: ContactData): Array<{ id: string; value: string }> {
  const customFields: Array<{ id: string; value: string }> = [];
  const contactType = getContactTypeOption(data.source);

  if (data.formType === "CONTACT") {
    if (data.message) customFields.push({ id: "ZvxM7eN2rOdgdV9OGKY6", value: data.message });
    if (data.referrer) customFields.push({ id: "PBInTgsd2nMCD3Ngmy0a", value: data.referrer });
    if (data.serviceType) {
      customFields.push({ id: "oaf4wCuM3Ub9eGpiddrO", value: SERVICE_TYPE_MAP[data.serviceType] || "General Inquiry" });
    }
    if (contactType) customFields.push({ id: "pGfgxcdFaYAkdq0Vp53j", value: contactType });
  } else if (data.formType === "VALUATION") {
    if (data.street) customFields.push({ id: "p3NOYiInAERYbe0VsLHB", value: data.street });
    if (data.city) customFields.push({ id: "h4UIjKQvFu7oRW4SAY8W", value: data.city });
    if (data.state) customFields.push({ id: "9r9OpQaxYPxqbA6Hvtx7", value: data.state });
    if (data.zip) customFields.push({ id: "hgbjsTVwcyID7umdhm2o", value: data.zip });
    if (data.zestimate) customFields.push({ id: "7wIe1cRbZYXUnc3WOVb2", value: data.zestimate });
    customFields.push({ id: "oaf4wCuM3Ub9eGpiddrO", value: getServiceTypeFromSource(data.source) });
    if (data.referrer) customFields.push({ id: "PBInTgsd2nMCD3Ngmy0a", value: data.referrer });
    if (contactType) customFields.push({ id: "pGfgxcdFaYAkdq0Vp53j", value: contactType });
  }

  return customFields;
}

export async function syncToGHL(data: ContactData): Promise<GHLResponse> {
  const GHL_API_TOKEN = process.env.GHL_API_TOKEN;
  const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

  if (!GHL_API_TOKEN || !GHL_LOCATION_ID) {
    console.error("GHL credentials not configured");
    return { success: false, error: "GHL credentials not configured" };
  }

  // Known contact (mailer QR ?cid=): update it instead of creating a duplicate.
  // On failure (bad cid, email conflict) fall through to the create path so no lead is lost.
  if (data.ghlContactId) {
    const updateResult = await updateGHLContact(data, GHL_API_TOKEN);
    if (updateResult.success) return updateResult;
    console.warn(`GHL update of contact ${data.ghlContactId} failed (${updateResult.error}) — falling back to create`);
  }

  const maxRetries = 3;
  let lastError = "";

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`GHL sync attempt ${attempt}/${maxRetries} for submission ${data.submissionId}`);

      const customFields = buildCustomFields(data);

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
          source: getSourceLabel(data.source),
          tags: [
            "hot-lead",
            ...(data.emailRisky ? ["email:risky"] : []),
            ...(data.attribution?.gclid ? ["ad:google"] : []),
          ],
          customFields,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`GHL sync successful for ${data.submissionId}:`, result.contact?.id);
        const attributionNote = formatAttributionNote(data.attribution);
        if (attributionNote && result.contact?.id) {
          await addGHLContactNote(result.contact.id, attributionNote);
        }
        return { success: true, contactId: result.contact?.id };
      }

      lastError = `HTTP ${response.status}: ${await response.text()}`;
      console.error(`GHL sync attempt ${attempt} failed:`, lastError);

      // GHL blocks duplicate emails but hands back the existing contact's ID —
      // a repeat inquiry from a known lead. Update that contact instead of
      // losing the submission.
      if (response.status === 400 && lastError.includes("duplicated contacts")) {
        const dupId = lastError.match(/"contactId"\s*:\s*"([A-Za-z0-9]+)"/)?.[1];
        if (dupId && dupId !== data.ghlContactId) {
          console.warn(`GHL reports existing contact ${dupId} for this email — updating it instead`);
          return updateGHLContact({ ...data, ghlContactId: dupId }, GHL_API_TOKEN);
        }
        break; // same contact already failed to update — retrying the create won't help
      }

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

/**
 * Update an existing GHL contact (mailer form submissions with a known ?cid=).
 * Deliberately omits `tags` (PUT replaces the whole array — would wipe "mail:scanned")
 * and `locationId` (rejected by GHL on update). Tags are appended separately via
 * tagGHLContact, and the message is preserved as a note.
 */
async function updateGHLContact(data: ContactData, apiToken: string): Promise<GHLResponse> {
  const contactId = data.ghlContactId!;
  const maxRetries = 3;
  let lastError = "";

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`GHL update attempt ${attempt}/${maxRetries} for contact ${contactId} (submission ${data.submissionId})`);

      const response = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
          Version: "2021-07-28",
        },
        body: JSON.stringify({
          email: data.email,
          phone: data.phone,
          name: data.name,
          source: getSourceLabel(data.source),
          customFields: buildCustomFields(data),
        }),
      });

      if (response.ok) {
        console.log(`GHL update successful for contact ${contactId}`);
        // mail:converted only for mailer QR conversions; duplicate-email
        // recoveries from other pages are repeat inquiries
        const isMailer = Boolean(data.source?.includes("/mailer/"));
        await tagGHLContact(contactId, [
          "hot-lead",
          isMailer ? "mail:converted" : "repeat-inquiry",
          ...(data.emailRisky ? ["email:risky"] : []),
          ...(data.attribution?.gclid ? ["ad:google"] : []),
        ]);
        const attributionNote = formatAttributionNote(data.attribution);
        if (data.message || attributionNote) {
          const noteBody = [
            data.message
              ? `${isMailer ? "Mailer form submission" : "Repeat form submission"} (${getSourceLabel(data.source)}): ${data.message}`
              : null,
            attributionNote,
          ]
            .filter(Boolean)
            .join("\n");
          await addGHLContactNote(contactId, noteBody);
        }
        return { success: true, contactId };
      }

      lastError = `HTTP ${response.status}: ${await response.text()}`;
      console.error(`GHL update attempt ${attempt} failed:`, lastError);

      // Bad cid or conflicting data — retrying won't help; let caller fall back to create
      if (response.status === 400 || response.status === 404) break;

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Unknown error";
      console.error(`GHL update attempt ${attempt} error:`, lastError);
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }

  return { success: false, error: lastError };
}

async function addGHLContactNote(contactId: string, body: string): Promise<void> {
  const GHL_API_TOKEN = process.env.GHL_API_TOKEN;
  if (!GHL_API_TOKEN) return;
  try {
    await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GHL_API_TOKEN}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify({ body }),
    });
  } catch {
    // Non-critical — note failure must not block anything
  }
}

export async function tagGHLContact(contactId: string, tags: string[]): Promise<void> {
  const GHL_API_TOKEN = process.env.GHL_API_TOKEN;
  if (!GHL_API_TOKEN) return;
  try {
    await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GHL_API_TOKEN}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify({ tags }),
    });
  } catch {
    // Non-critical — tagging failure must not block anything
  }
}
