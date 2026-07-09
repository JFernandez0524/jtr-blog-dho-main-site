/**
 * Embeds the GoHighLevel booking calendar (server component).
 *
 * Reads GHL_BOOKING_CALENDAR_URL — returns null when unset so callers can
 * render a fallback CTA instead. The calendar origin must be allowed in the
 * frame-src CSP directive (next.config.js derives it from this env var).
 *
 * No GHL form_embed.js auto-resize script: a fixed responsive height with
 * internal scrolling avoids adding a third-party script to script-src.
 */
export default function GHLBookingCalendar({
  firstName,
}: {
  /** Prefill the booking widget's first-name field (from the mailer ?name= param) */
  firstName?: string;
}) {
  const baseUrl = process.env.GHL_BOOKING_CALENDAR_URL;
  if (!baseUrl) return null;

  let src = baseUrl;
  if (firstName) {
    try {
      const url = new URL(baseUrl);
      url.searchParams.set("first_name", firstName);
      src = url.toString();
    } catch {
      // Malformed env URL — fall back to using it verbatim
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
      <iframe
        src={src}
        loading="lazy"
        title="Book your free in-home analysis"
        className="w-full h-[700px] md:h-[800px] border-0"
      />
    </div>
  );
}
