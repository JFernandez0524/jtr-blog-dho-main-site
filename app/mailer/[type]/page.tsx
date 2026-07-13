import fs from "fs";
import path from "path";
import { Suspense } from "react";
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
import TeamStats from "@/components/TeamStats";
import { siteConfig } from "@/lib/config";
import { MAILER_INHERITED_FAQ, INHERITED_CHALLENGES, WORK_WITH_ME_STEPS } from "@/lib/inheritedContent";

const CAMPAIGN_TYPES = {
  "inherited-property": {
    heroHeading: "Thinking about selling your inherited property?",
    heroSub: "We help NJ families navigate estate sales with confidence — and get the best outcome.",
    heroCta: "Book My Free In-Home Analysis",
    bookingHeading: "Pick a Time for Your Free In-Home Analysis",
    bookingSub: "I'll walk the property with you and build a side-by-side of what you'd actually net — a full-service listing vs. a cash sale — so you decide with real numbers. No pressure, no obligation.",
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

// Team/award graphic — the image renders automatically once the file exists
const TEAM_GRAPHIC = "/TeamDiamond.png";
const hasTeamGraphic = fs.existsSync(path.join(process.cwd(), "public", TEAM_GRAPHIC));

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

          {/* Proof strip — team numbers, not generic agent claims */}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 pt-3 text-sm text-gray-600 font-medium">
            <span>The Borrero Group at RE/MAX</span>
            <span className="text-gray-300">·</span>
            <span><strong className="text-remax-blue">$60M+</strong> sold every year</span>
            <span className="text-gray-300">·</span>
            <span>NJ Realtors<span className="align-super text-[10px]">®</span> Circle of Excellence <strong className="text-remax-blue">Platinum</strong> — every year since 2017</span>
          </div>
        </section>

        {/* Zestimate card or soft fallback */}
        {hasZestimate ? (
          <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-3">
            <p className="text-sm font-medium text-blue-700 uppercase tracking-wide text-center">Estimated Starting Value</p>
            <p className="text-5xl font-bold text-remax-blue text-center">{zestFormatted}</p>
            {/* Zillow branding requirement: logo adjacent to Zestimate data */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-gray-500">Zestimate® by</span>
              <Image src="/zillow-icon.svg" alt="Zillow" width={60} height={24} className="h-5 w-auto" />
            </div>
            {isInheritedProperty ? (
              <div className="border-t border-blue-200 pt-3 space-y-1 text-sm text-blue-900">
                <p className="font-semibold">This is a Zestimate® — a starting point, not the final word.</p>
                <p className="text-blue-800">Automated estimates don&apos;t account for interior condition, updates, or what a buyer will actually pay. A free in-home walkthrough is the only way to get a real number.</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center">Based on recent comparable sales in your area</p>
            )}
            <p className="text-xs text-gray-400 text-center">
              {hasAddress && (
                <>
                  <a
                    href={`https://www.zillow.com/homes/${encodeURIComponent([addr, city, "NJ"].filter(Boolean).join(" "))}_rb/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-remax-blue"
                  >
                    See more details for {addr} on Zillow
                  </a>
                  {" · "}
                </>
              )}
              Data provided &quot;as is&quot; via the Zestimate API.
            </p>
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
                <p className="text-gray-500">Those &quot;cash offer&quot; letters in your mailbox are one buyer hoping you&apos;ll take their number. I maintain a deep list of vetted investors who pay fair market value — and I show you both paths so you choose what nets your family more.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-2xl p-6 space-y-3">
                  <p className="font-bold text-remax-blue text-base">List on the Market</p>
                  <p className="text-gray-600 text-sm">Best when the property is in decent shape and you have time — typically the highest price. Full-service: professional photography, paid social ads, open houses, and we handle the town CO and open permits. It&apos;s how our team sells $60M+ every year — we sell houses, not just list them.</p>
                  <p className="text-xs text-gray-400 font-medium">Typical timeline: 60–90 days</p>
                </div>
                <div className="border border-gray-200 rounded-2xl p-6 space-y-3">
                  <p className="font-bold text-remax-blue text-base">Sell Off-Market for Cash</p>
                  <p className="text-gray-600 text-sm">Best when speed or condition matters more. No showings, no repairs — I bring my own list of vetted cash buyers who pay fair market value, not lowball offers. And because the buyer is already at the table, you save on commission costs.</p>
                  <p className="text-xs text-gray-400 font-medium">Typical timeline: 14–21 days</p>
                </div>
              </div>

              <figure className="bg-remax-blue rounded-2xl p-5 sm:p-8 space-y-5 shadow-lg">
                <figcaption className="text-center space-y-1">
                  <p className="text-white font-bold text-xl sm:text-2xl">Every Family Gets a Full Pricing Analysis — Not a Guess</p>
                  <p className="text-white/80 text-sm sm:text-base">Real comps, market trends, and a data-driven plan for top dollar. Here&apos;s what yours will look like:</p>
                </figcaption>
                <Image
                  src="/listingPresentationLayout.png"
                  alt="Sample listing presentation from The Borrero Group — market at a glance, comparable sales map, recent comp highlights, and local market trends"
                  width={1672}
                  height={941}
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="rounded-xl w-full h-auto shadow-md"
                />
              </figure>

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
              <blockquote className="border-l-4 border-remax-blue bg-gray-50 rounded-r-xl p-5 max-w-2xl mx-auto">
                <p className="text-gray-700 italic">
                  &ldquo;The value of your agent is not only what happens when everything goes right — it&apos;s how the transaction is managed when something goes wrong.&rdquo;
                </p>
                <footer className="mt-2 text-sm text-gray-500">— Jose Fernandez</footer>
              </blockquote>
            </section>
          </>
        )}
      </main>

      {/* Real Zillow reviews — full-bleed band, same treatment as the pillar page */}
      <ZillowReviews />

      <div className="max-w-4xl mx-auto px-4 py-10 pb-24 md:pb-10 space-y-10">

        {/* Team + awards graphic and Zillow-style trust bar */}
        <section className="space-y-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">The Team Behind Your Sale</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Eight of us, one process — NJ Realtors<span className="align-super text-[10px]">®</span> Circle of Excellence Platinum performance every year since 2017.
          </p>
          {hasTeamGraphic && (
            <Image
              src={TEAM_GRAPHIC}
              alt="The Borrero Group at RE/MAX — NJ Realtors Circle of Excellence Platinum Award winners, every year since 2017"
              width={1672}
              height={941}
              sizes="(max-width: 896px) 100vw, 896px"
              className="rounded-2xl mx-auto w-full h-auto"
            />
          )}
          <Suspense fallback={null}>
            <TeamStats />
          </Suspense>
        </section>
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
              <p className="text-remax-blue font-medium">Partner, The Borrero Group at RE/MAX · $60M+ Sold Every Year · Circle of Excellence Platinum</p>
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
        {/* Zillow branding requirement — this page displays Zestimate + review data */}
        <p className="mt-1">
          &copy; Zillow, Inc., 2006-2023. Use is subject to{" "}
          <a href="https://www.zillow.com/z/corp/terms/" target="_blank" rel="noopener noreferrer" className="underline">
            Terms of Use
          </a>
        </p>
      </footer>

      <StickyCallButton phone={siteConfig.contact.mailerTrackingPhone} />
      <FacebookMessenger />
    </div>
  );
}
