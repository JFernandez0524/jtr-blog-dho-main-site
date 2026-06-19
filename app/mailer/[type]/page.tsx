import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { siteConfig } from "@/lib/config";

const CAMPAIGN_TYPES = {
  "inherited-property": {
    heroHeading: "We know about your inherited property",
    heroSub: "We help NJ families navigate estate sales with confidence — and get the best outcome.",
    ctaHeading: "Get your no-obligation cash offer",
    ctaSub: "No repairs. No showings. Close on your timeline.",
    serviceType: "inherited-property",
  },
  "preforeclosure": {
    heroHeading: "We can help you avoid foreclosure",
    heroSub: "There are more options than most people realize. Let's talk through yours — no pressure.",
    ctaHeading: "See your options — no obligation",
    ctaSub: "Stop the clock. Get a free consultation today.",
    serviceType: "foreclosure",
  },
  "sell-as-is": {
    heroHeading: "Sell your home as-is, hassle-free",
    heroSub: "No repairs, no staging, no waiting. We close on your timeline.",
    ctaHeading: "Get your no-obligation cash offer",
    ctaSub: "No repairs. No showings. Close on your timeline.",
    serviceType: "sell-as-is",
  },
} as const;

type CampaignType = keyof typeof CAMPAIGN_TYPES;

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
  searchParams: Promise<{ cid?: string; addr?: string; city?: string; zest?: string; name?: string }>;
}) {
  const { type } = await params;

  if (!(type in CAMPAIGN_TYPES)) notFound();
  const config = CAMPAIGN_TYPES[type as CampaignType];

  const { addr, city, zest, name: firstName } = await searchParams;
  const zestFormatted = zest ? formatZestimate(zest) : "";
  const hasAddress = Boolean(addr && city);
  const hasZestimate = Boolean(zestFormatted);

  const telHref = `tel:${siteConfig.contact.phone.replace(/[\s()-]/g, "")}`;

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Mini header — logo + phone only */}
      <header className="border-b border-gray-200 bg-white">
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
            {siteConfig.contact.phoneDisplay}
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* Personalized hero */}
        <section className="text-center space-y-4">
          {firstName && (
            <p className="text-remax-blue font-semibold text-lg">Hi {firstName},</p>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {config.heroHeading}
          </h1>
          {hasAddress && (
            <p className="text-xl text-gray-600 font-medium">
              {addr}, {city}, NJ
            </p>
          )}
          <p className="text-gray-500 max-w-xl mx-auto">{config.heroSub}</p>
        </section>

        {/* Zestimate card or soft fallback */}
        {hasZestimate ? (
          <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center space-y-2">
            <p className="text-sm font-medium text-blue-700 uppercase tracking-wide">Estimated home value</p>
            <p className="text-5xl font-bold text-remax-blue">{zestFormatted}</p>
            <p className="text-sm text-gray-500">Based on recent comparable sales in your area</p>
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

        {/* CTA + form */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{config.ctaHeading}</h2>
            <p className="text-gray-500">{config.ctaSub}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <ContactForm defaultServiceType={config.serviceType} />
          </div>
        </section>

        {/* Jose trust card */}
        <section className="border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
          <Image
            src="/jose-profile.jpg"
            alt="Jose Fernandez"
            width={100}
            height={100}
            className="rounded-full object-cover shrink-0"
          />
          <div className="text-center sm:text-left space-y-1">
            <p className="font-bold text-gray-900 text-lg">{siteConfig.contact.name}</p>
            <p className="text-remax-blue font-medium">{siteConfig.business.brokerage} — NJ Real Estate Specialist</p>
            <p className="text-sm text-gray-500">{siteConfig.business.license}</p>
            <a href={telHref} className="inline-block mt-2 text-remax-blue font-semibold hover:underline">
              {siteConfig.contact.phoneDisplay}
            </a>
          </div>
        </section>

      </main>

      {/* Minimal footer */}
      <footer className="border-t border-gray-100 mt-16 py-6 text-center text-xs text-gray-400">
        <p>{siteConfig.business.license} · {siteConfig.business.brokerage}</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} {siteConfig.contact.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
