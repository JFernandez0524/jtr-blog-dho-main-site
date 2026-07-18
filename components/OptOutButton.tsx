"use client";

import { useState } from "react";

/**
 * One-click "stop mailing me" for the update-variant mailer page.
 *
 * Direct mail costs real money per piece — an explicit opt-out is a win
 * (list hygiene + postage saved), and the takeaway framing is part of the
 * decision block's close. Renders only for QR visitors (cid present); the
 * API tags the GHL contact `mail:optout` so Jose can pull them from the
 * Thanks.io loop.
 */
export default function OptOutButton({
  cid,
  phoneDisplay,
  telHref,
}: {
  /** GHL contact ID from the QR URL's ?cid= param */
  cid?: string;
  phoneDisplay: string;
  telHref: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  // Organic visitors have no mail to opt out of
  if (!cid) return null;

  if (status === "done") {
    return (
      <p className="text-sm text-white/70 max-w-md mx-auto">
        Done — you won&apos;t get any more mail from me. No hard feelings.
        If you ever change your mind, just call or text{" "}
        <a href={telHref} className="font-semibold text-white underline whitespace-nowrap">
          {phoneDisplay}
        </a>
        .
      </p>
    );
  }

  const handleOptOut = async () => {
    setStatus("loading");
    try {
      await fetch("/api/mail-optout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cid }),
      });
    } catch {
      // Best-effort — still show the confirmation; the lead's intent is clear
    }
    setStatus("done");
  };

  return (
    <button
      onClick={handleOptOut}
      disabled={status === "loading"}
      className="text-sm text-white/50 underline hover:text-white/80 transition-colors disabled:opacity-50"
    >
      {status === "loading"
        ? "Taking you off the list..."
        : "No thanks — take me off your mailing list"}
    </button>
  );
}
