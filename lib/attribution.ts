// Client-side marketing attribution capture.
//
// Captures utm_* params + gclid from the landing URL and persists the
// first touch in sessionStorage so it survives navigation to the contact
// page. Forms read it via getAttribution() and send it with submissions,
// where it's stored on the lead and synced to GHL.
//
// PII rule: these values are campaign labels only — never put personal
// data in URLs or these fields.

const STORAGE_KEY = "jtr_attribution";
const MAX_LENGTH = 200;

export interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
}

const PARAM_MAP: Record<string, keyof Attribution> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
  gclid: "gclid",
};

/**
 * Read attribution params from the current URL and store them for the
 * session. First touch wins: if attribution was already captured this
 * session, later pageviews don't overwrite it. Safe to call on every page
 * load; no-ops on the server and when no params are present.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const attribution: Attribution = {};
    let found = false;
    for (const [param, key] of Object.entries(PARAM_MAP)) {
      const value = params.get(param);
      if (value) {
        attribution[key] = value.slice(0, MAX_LENGTH);
        found = true;
      }
    }
    if (found) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    }
  } catch {
    // sessionStorage unavailable (private mode, etc.) — attribution is
    // best-effort, never block the page
  }
}

/** Return the captured attribution for this session, or null if none. */
export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}
