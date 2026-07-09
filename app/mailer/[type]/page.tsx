import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import StickyCallButton from "@/components/StickyCallButton";
import FacebookMessenger from "@/components/FacebookMessenger";
import GHLBookingCalendar from "@/components/GHLBookingCalendar";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import ZillowReviews from "@/components/ZillowReviews";
import { siteConfig } from "@/lib/config";
import { MAILER_INHERITED_FAQ, INHERITED_CHALLENGES, WORK_WITH_ME_STEPS } from "@/lib/inheritedContent";

const CAMPAIGN_TYPES = {
  "inherited-property": {
    heroHeading: "Thinking about selling your inherited property?",
    heroSub: "We help NJ families navigate estate sales with confidence — and get the best outcome.",
    heroCta: "Book My Free In-Home Analysis",
    bookingHeading: "Pick a Time for Your Free In-Home Analysis",
    bookingSub: "I'll walk through the property with you, run the numbers both ways, and give you an honest recommendation — no pressure, no obligation.",
    ctaHeading: "Prefer We Reach Out to You?",
    ctaSub: "Tell me a little about the property and I'll personally call you within 24 hours.",
    serviceType: "inherited-property",
  },
  "preforeclosure": {
    heroHeading: "We can help you avoid foreclosure",
    heroSub: "There are more options than most people realize. Let's talk through yours — no pressure.",
    heroCta: "Book My Free Consultation",
    bookingHeading: "Pick a Time to Talk Through Your Options",
    bookingSub: "Stop the clock. Get a free consultation today — no obligation.",
    ctaHeading: "Prefer We Reach Out to You?",
    ctaSub: "Tell me a little about your situation and I'll personally call you within 24 hours.",
    serviceType: "foreclosure",
  },
  "sell-as-is": {
    heroHeading: "Sell your home as-is, hassle-free",
    heroSub: "No repairs, no staging, no waiting. We close on your timeline.",
    heroCta: "Get My No-Obligation Offer",
    bookingHeading: "Pick a Time for Your Free Offer Consultation",
    bookingSub: "No repairs. No showings. Close on your timeline.",
    ctaHeading: "Prefer We Reach Out to You?",
    ctaSub: "Tell me a little about the property and I'll personally call you within 24 hours.",
    serviceType: "sell-as-is",
  },
} as const;

type CampaignType = keyof typeof CAMPAIGN_TYPES;

/**
 * Message-matched hero variants. Postcard/letter templates append &msg=<key>
 * to the QR URL so the first screen echoes the tone of the piece the lead is
 * holding. Only heroHeading/heroSub change — everything else stays on one
 * measured funnel. Unknown or missing msg falls back to the campaign default.
 */
const MESSAGE_VARIANTS: Partial<Record<CampaignType, Record<string, { heroHeading: string; heroSub: string }>>> = {
  "inherited-property": {
    breakup: {
      heroHeading: "Before you file this away — here's where the property stands today.",
      heroSub: "No pressure, and no more mail unless you want it. Just the honest numbers, whenever you're ready.",
    },
    intro: {
      heroHeading: "Thinking about selling your inherited property?",
      heroSub: "The Borrero Group at RE/MAX has helped NJ families sell 750+ properties — from fixer-uppers to million-dollar estates. Let's find the right path for yours.",
    },
    update: {
      heroHeading: "Here's your updated market picture.",
      heroSub: "Values shift month to month. Here's where the property stands right now — and I'm a call away whenever the timing feels right.",
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  if (!(type in CAMPAIGN_TYPES)) return { title: "Not Found" };
  return {
    title: "Your Property | Jose Fernandez RE/MAX NJ",
    robots: { index: false, follow: false },
  };
}

function formatZestimate(zest: string): string {
  const num = parseInt(zest, 10);
  if (isNaN(num) || num <= 0) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(num);
}

export default async function MailerPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ cid?: string; addr?: string; city?: string; zest?: string; name?: string; msg?: string }>;
}) {
  const { type } = await params;

  if (!(type in CAMPAIGN_TYPES)) notFound();
  const config = CAMPAIGN_TYPES[type as CampaignType];
  const isInheritedProperty = type === "inherited-property";

  const { cid, addr, city, zest, name: firstName, msg } = await searchParams;
  const variant = (msg && MESSAGE_VARIANTS[type as CampaignType]?.[msg]) || null;
  const heroHeading = variant?.heroHeading ?? config.heroHeading;
  const heroSub = variant?.heroSub ?? config.heroSub;

  const zestFormatted = zest ? formatZestimate(zest) : "";
  const hasAddress = Boolean(addr && city);
  const hasZestimate = Boolean(zestFormatted);
  const hasBookingCalendar = Boolean(process.env.GHL_BOOKING_CALENDAR_URL);

  // Mail-campaign tracking line — matches the number printed on postcards/letters
  const phoneDisplay = siteConfig.contact.mailerTrackingPhoneDisplay;
  const telHref = `tel:${siteConfig.contact.mailerTrackingPhone.replace(/[\s()-]/g, "")}`;

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Mini header — logo + phone only */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/remax-logo.svg" alt="RE/MAX" width={90} height={36} className="h-8 w-auto" priority />
            <div className="h-6 w-px bg-gray-200" />
            <span className="text-sm font-semibold text-gray-700">{siteConfig.contact.name}</span>
          </Link>
          <a
            href={telHref}
            className="flex items-center gap-2 bg-remax-blue text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            {phoneDisplay}
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* Personalized hero */}
        <section className="text-center space-y-4">
          {firstName && (
            <p className="text-remax-blue font-bold text-3xl sm:text-4xl">Hi {firstName},</p>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {heroHeading}
          </h1>
          {hasAddress && (
            <p className="text-xl text-gray-600 font-medium">
              {addr}, {city}, NJ
            </p>
          )}
          <p className="text-gray-500 max-w-xl mx-auto">{heroSub}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <a
              href="#book"
              className="px-6 py-3 bg-remax-blue text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-center"
            >
              {config.heroCta}
            </a>
            <a
              href={telHref}
              className="px-6 py-3 border-2 border-remax-blue text-remax-blue font-semibold rounded-lg hover:bg-remax-blue/5 transition-colors text-center"
            >
              Call {phoneDisplay}
            </a>
          </div>
          <p className="text-sm text-gray-500">
            Prefer to chat?{" "}
            <a
              href={siteConfig.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-remax-blue hover:underline"
            >
              Message me on Facebook
            </a>{" "}
            — I reply personally.
          </p>
        </section>

        {/* Zestimate card or soft fallback */}
        {hasZestimate ? (
          <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-3">
            <p className="text-sm font-medium text-blue-700 uppercase tracking-wide text-center">Estimated Starting Value</p>
            <p className="text-5xl font-bold text-remax-blue text-center">{zestFormatted}</p>
            {isInheritedProperty ? (
              <div className="border-t border-blue-200 pt-3 space-y-1 text-sm text-blue-900">
                <p className="font-semibold">This is a Zestimate® — a starting point, not the final word.</p>
                <p className="text-blue-800">Automated estimates don&apos;t account for interior condition, updates, or what a buyer will actually pay. A free in-home walkthrough is the only way to get a real number.</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center">Based on recent comparable sales in your area</p>
            )}
          </section>
        ) : (
          <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-3">
            <p className="text-lg font-semibold text-amber-800">
              We had a little trouble pulling an automatic estimate for{hasAddress ? ` your home at ${addr}` : " your property"}.
            </p>
            <p className="text-amber-700">
              Fill out the form below and we&apos;ll get you a real number within 24 hours — no obligation.
            </p>
          </section>
        )}

        {/* Inherited property — two paths + FAQ + video */}
        {isInheritedProperty && (
          <>
            {/* Two paths */}
            <section className="space-y-5">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Two Common Ways Families Sell an Inherited Property</h2>
                <p className="text-gray-500">The right path depends on condition, timeline, and your goals — here&apos;s how I help you decide.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-2xl p-6 space-y-3">
                  <p className="font-bold text-remax-blue text-base">List on the Market</p>
                  <p className="text-gray-600 text-sm">Best when the property is in decent shape and you have time. We market to qualified buyers and typically get the highest price.</p>
                  <p className="text-xs text-gray-400 font-medium">Typical timeline: 60–90 days</p>
                </div>
                <div className="border border-gray-200 rounded-2xl p-6 space-y-3">
                  <p className="font-bold text-remax-blue text-base">Sell Off-Market for Cash</p>
                  <p className="text-gray-600 text-sm">Best when speed or condition matters more. No showings, no repairs — we work with serious cash buyers who can close fast.</p>
                  <p className="text-xs text-gray-400 font-medium">Typical timeline: 14–21 days</p>
                </div>
              </div>

              <div className="bg-remax-blue/5 border border-remax-blue/20 rounded-xl p-5 text-center space-y-1">
                <p className="font-semibold text-remax-blue">A free in-home walkthrough is the only way to know which path puts more money in your pocket.</p>
                <p className="text-sm text-gray-500">I&apos;ll assess the condition, run the numbers both ways, and give you a straight answer.</p>
              </div>
            </section>
          </>
        )}

        {/* Booking calendar — the primary conversion action */}
        <section id="book" className="space-y-6 scroll-mt-20">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{config.bookingHeading}</h2>
            <p className="text-gray-500">{config.bookingSub}</p>
          </div>
          {hasBookingCalendar ? (
            <GHLBookingCalendar firstName={firstName} />
          ) : (
            <div className="bg-remax-blue rounded-2xl p-8 text-center space-y-4">
              <p className="text-white text-lg font-semibold">Call, text, or message me directly — I&apos;ll personally pick up.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href={telHref}
                  className="inline-block px-8 py-4 bg-white text-remax-blue font-bold rounded-lg hover:bg-white/90 transition-colors"
                >
                  Call {phoneDisplay}
                </a>
                <a
                  href={siteConfig.social.messenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-[#0084ff] text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Message on Facebook
                </a>
              </div>
              <p className="text-white/80 text-sm">
                Or use the{" "}
                <a href="#contact-form" className="text-white underline font-semibold">
                  form below
                </a>{" "}
                and I&apos;ll reach out within 24 hours.
              </p>
            </div>
          )}
        </section>

        {isInheritedProperty && (
          <>
            {/* Common challenges */}
            <section className="space-y-5">
              <h2 className="text-2xl font-bold text-gray-900 text-center">Common Challenges I Help Solve</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {INHERITED_CHALLENGES.map(({ title, text }) => (
                  <div key={title} className="flex gap-3 border border-gray-200 rounded-2xl p-5">
                    <span className="text-remax-blue font-bold">→</span>
                    <p className="text-sm text-gray-600">
                      <strong className="text-gray-900 block mb-0.5">{title}</strong>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Real Zillow reviews — full-bleed band, same treatment as the pillar page */}
      <ZillowReviews />

      <div className="max-w-4xl mx-auto px-4 py-10 pb-24 md:pb-10 space-y-10">
        {isInheritedProperty && (
          <>
            {/* Video */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">What NJ Families Need to Know About Inherited Properties</h2>
              <YouTubeEmbed id="Wl3JPs492iU" title="Inherited Property New Jersey Guide" />
            </section>

            {/* FAQ */}
            <section className="space-y-5">
              <h2 className="text-2xl font-bold text-gray-900">Common Questions</h2>
              <div className="space-y-5">
                {MAILER_INHERITED_FAQ.map(({ q, a }) => (
                  <div key={q} className="border-l-4 border-remax-blue/30 pl-4">
                    <p className="font-semibold text-remax-blue mb-1">{q}</p>
                    <p className="text-gray-600 text-sm">{a}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* CTA + form — the alternative path for leads who'd rather be contacted */}
        <section id="contact-form" className="space-y-6 scroll-mt-20">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{config.ctaHeading}</h2>
            <p className="text-gray-500">{config.ctaSub}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <ContactForm
              defaultServiceType={config.serviceType}
              ghlContactId={cid}
              campaign={type}
              submitLabel="Request My Free Analysis"
            />
          </div>
        </section>

        {/* Jose bio / trust */}
        <section className="border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <Image
              src="/jose-profile.jpg"
              alt="Jose Fernandez"
              width={100}
              height={100}
              className="rounded-full object-cover shrink-0"
            />
            <div className="text-center sm:text-left space-y-1">
              <p className="font-bold text-gray-900 text-xl">Jose Fernandez, NJ Real Estate Agent</p>
              <p className="text-remax-blue font-medium">RE/MAX Agent · 15 Years in NJ Real Estate</p>
              <a
                href={siteConfig.social.zillow}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[#006AFF] font-semibold hover:underline"
              >
                on Zillow
              </a>
            </div>
          </div>

          <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
            <p>I specialize in helping NJ families navigate inherited properties — from understanding what the home is worth to guiding you through probate, family decisions, and the right next step for your situation.</p>
            <p>Whether you decide to sell, keep the property, or need more time to figure it out, I&apos;m here to give you honest information — not a sales pitch.</p>
          </div>

          <ul className="space-y-2">
            {[
              "Free property valuation with no obligation",
              "I'll personally call you — not a call center",
              "15+ years navigating NJ probate and estate sales",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-600 font-bold mt-px">✓</span>
                {item}
              </li>
            ))}
          </ul>

          {isInheritedProperty && (
            <div className="bg-remax-blue/5 rounded-xl p-5 space-y-3">
              <p className="font-semibold text-gray-900">What Happens Next</p>
              <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                {WORK_WITH_ME_STEPS.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="text-sm text-remax-blue font-medium">
                It all starts with a conversation —{" "}
                <a href="#book" className="underline font-semibold">
                  pick a time that works for you
                </a>
                .
              </p>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Prefer to call?{" "}
            <a href={telHref} className="font-semibold text-remax-blue hover:underline">
              {phoneDisplay}
            </a>
            {" "}· or{" "}
            <a
              href={siteConfig.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-remax-blue hover:underline"
            >
              message me on Facebook
            </a>
          </p>
        </section>

      </div>

      {/* Minimal footer */}
      <footer className="border-t border-gray-100 mt-16 py-6 text-center text-xs text-gray-400">
        <p>{siteConfig.business.license} · {siteConfig.business.brokerage}</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} {siteConfig.contact.name}. All rights reserved.</p>
      </footer>

      <StickyCallButton phone={siteConfig.contact.mailerTrackingPhone} />
      <FacebookMessenger />
    </div>
  );
}
