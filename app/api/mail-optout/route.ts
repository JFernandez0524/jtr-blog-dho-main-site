import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { tagGHLContact } from "@/lib/ghl";

// Matches the ghlContactId validation in lib/validation.ts — invalid cids are
// dropped silently, never surfaced as errors (fire-and-forget semantics)
const CID_PATTERN = /^[A-Za-z0-9]{15,30}$/;

/**
 * One-click mail opt-out from the update-variant mailer page. Tags the GHL
 * contact `mail:optout`; Jose's GHL workflow/filter removes them from the
 * Thanks.io monthly loop. Always returns ok — the visitor's intent is
 * honored client-side regardless.
 */
export async function POST(request: NextRequest) {
  try {
    const rateLimitKey =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!(await checkRateLimit(rateLimitKey))) {
      return NextResponse.json({ success: true });
    }

    const { cid } = await request.json();
    if (typeof cid === "string" && CID_PATTERN.test(cid)) {
      await tagGHLContact(cid, ["mail:optout"]);
      console.log(`Mail opt-out recorded for GHL contact ${cid}`);
    }
  } catch (error) {
    console.error("Mail opt-out error:", error);
  }
  return NextResponse.json({ success: true });
}
