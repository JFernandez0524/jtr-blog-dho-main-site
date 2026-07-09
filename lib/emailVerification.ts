/**
 * Email deliverability verification via DeBounce.io.
 *
 * Complements Zod's format validation: Zod checks the shape, DeBounce checks
 * whether the mailbox can actually receive mail. Policy (see api routes):
 * only hard-undeliverable emails are rejected; risky results are accepted
 * and tagged in GHL; any API failure fails OPEN — a lead is never lost to
 * a verification outage.
 */

export interface EmailVerdict {
  verdict: "deliverable" | "undeliverable" | "risky" | "unknown";
  reason?: string;
}

// DeBounce result codes:
// 1 = Syntax error / invalid, 2 = Spam-trap, 3 = Disposable, 4 = Accept-all,
// 5 = Deliverable, 6 = Role (info@, admin@ …), 7 = Unknown, 8 = Mailbox disabled
const UNDELIVERABLE_CODES = new Set(["1", "8"]);
const DELIVERABLE_CODES = new Set(["5"]);

export async function verifyEmailDeliverability(email: string): Promise<EmailVerdict> {
  const apiKey = process.env.DEBOUNCE_API_KEY;
  if (!apiKey) {
    return { verdict: "unknown", reason: "DEBOUNCE_API_KEY not configured" };
  }

  try {
    const url = new URL("https://api.debounce.com/v1/");
    url.searchParams.set("api", apiKey);
    url.searchParams.set("email", email);

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) {
      console.error(`DeBounce API error: HTTP ${response.status}`);
      return { verdict: "unknown", reason: `HTTP ${response.status}` };
    }

    const data = await response.json();
    const code = String(data?.debounce?.code ?? "");
    const reason = data?.debounce?.reason || data?.debounce?.result || undefined;

    if (UNDELIVERABLE_CODES.has(code)) return { verdict: "undeliverable", reason };
    if (DELIVERABLE_CODES.has(code)) return { verdict: "deliverable", reason };
    if (code) return { verdict: "risky", reason };

    console.error("DeBounce API returned no result code:", JSON.stringify(data).slice(0, 200));
    return { verdict: "unknown", reason: "no result code" };
  } catch (error) {
    // Timeout or network failure — fail open, never block a lead
    console.error("DeBounce verification failed:", error instanceof Error ? error.message : error);
    return { verdict: "unknown", reason: "verification unavailable" };
  }
}
