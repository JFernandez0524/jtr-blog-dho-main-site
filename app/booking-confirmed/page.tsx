import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

/**
 * Post-booking confirmation page — the GHL calendar's custom "Thank You"
 * redirect points here after an appointment is booked.
 *
 * Why it exists: the booking widget is a cross-origin iframe, so the booking
 * itself is invisible to GTM. Redirecting the iframe to this same-origin page
 * makes the conversion observable — GTM fires on the /booking-confirmed
 * pageview ("Consultation Booked" in Google Ads + GA4), and first-party
 * cookies/sessionStorage attribution carry over.
 *
 * Rendering constraints: usually loads INSIDE the ~700px booking iframe, so
 * keep it compact. Site chrome is suppressed via the x-campaign-page header
 * (middleware), and next.config.js allows frame-ancestors 'self' for this
 * path only.
 */

export const metadata: Metadata = {
  title: "Appointment Confirmed | Jose Fernandez RE/MAX NJ",
  robots: { index: false, follow: false },
};

const telHref = `tel:${siteConfig.contact.phone.replace(/[\s()-]/g, "")}`;

export default function BookingConfirmedPage() {
  return (
    <div className="min-h-[500px] flex items-center justify-center bg-white px-6 py-12">
      <div className="max-w-md text-center space-y-5">
        <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-remax-slate">
          You&apos;re booked — thank you!
        </h1>
        <p className="text-remax-slate/80">
          Your appointment is confirmed. A confirmation with the details is on
          its way to your email and phone.
        </p>
        <p className="text-remax-slate/80">
          Need to reach me sooner? Call{" "}
          <a href={telHref} className="font-semibold text-remax-blue whitespace-nowrap">
            {siteConfig.contact.phoneDisplay}
          </a>
          .
        </p>
        <p className="text-sm text-remax-slate/60">
          — Jose Fernandez, RE/MAX
        </p>
      </div>
    </div>
  );
}
