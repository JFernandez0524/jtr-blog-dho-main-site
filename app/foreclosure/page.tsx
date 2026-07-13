import { Metadata } from "next";
import Image from "next/image";
import PillarLayout from "@/components/PillarLayout";
import ContactForm from "@/components/ContactForm";
import ZillowReviews from "@/components/ZillowReviews";
import { generateServiceSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/structuredData";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import TeamSection from "@/components/TeamSection";
import { siteConfig } from "@/lib/config";
import {
  FORECLOSURE_STAGES,
  FORECLOSURE_OPTIONS,
  FORECLOSURE_TRUST_POINTS,
  FORECLOSURE_FAQ,
} from "@/lib/foreclosureContent";

const telHref = `tel:${siteConfig.contact.phone.replace(/[\s()-]/g, "")}`;

export const metadata: Metadata = {
  title: "Stop Foreclosure in NJ | Sell Before the Sheriff Sale — Jose Fernandez",
  description: "Facing foreclosure in New Jersey? Protect your equity before the sheriff sale. Short sales, fast market sales, vetted cash buyers, loan modifications — free, confidential consultation with a licensed NJ agent.",
  alternates: {
    canonical: "https://www.josetherealtor.com/foreclosure",
  },
  openGraph: {
    title: "Foreclosure Assistance New Jersey",
    description: "Facing foreclosure in New Jersey? Explore your options including short sales, loan modifications, and strategic solutions to protect your credit.",
    images: [
      {
        url: "/api/og?title=Foreclosure%20Assistance&type=pillar",
        width: 1200,
        height: 630,
        alt: "Foreclosure Assistance New Jersey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foreclosure Assistance New Jersey",
    description: "Facing foreclosure in New Jersey? You have more options than you think.",
    images: ["/api/og?title=Foreclosure%20Assistance&type=pillar"],
  },
};

export default function ForeclosurePage() {
  const serviceSchema = generateServiceSchema({
    name: "Foreclosure Assistance",
    description: "Helping New Jersey homeowners facing foreclosure explore all options — short sales, loan modifications, and strategic solutions to protect credit.",
    url: "https://www.josetherealtor.com/foreclosure",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.josetherealtor.com" },
    { name: "Foreclosure Help", url: "https://www.josetherealtor.com/foreclosure" },
  ]);

  const faqSchema = generateFAQSchema(
    FORECLOSURE_FAQ.map(({ q, a }) => ({ question: q, answer: a }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb items={[
          { name: "Home", href: "/" },
          { name: "Foreclosure Help", href: "/foreclosure", current: true },
        ]} />
      </div>

      <PillarLayout
        title="Facing Foreclosure in New Jersey? There Are More Options Than Your Bank Is Telling You."
        subtitle="Most homeowners wait too long because they feel ashamed or aren't sure who to trust. And if you have equity in your home, a sheriff sale is the worst possible way to lose it. A free, confidential conversation can open doors you didn't know existed — even if you've already received a notice."
        heroCta={
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <a
              href="#contact-form"
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-remax-blue font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm sm:text-base text-center"
            >
              Get a Free Confidential Consultation
            </a>
            <a
              href={telHref}
              className="px-5 py-2.5 sm:px-6 sm:py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-sm sm:text-base text-center"
            >
              Call {siteConfig.contact.phoneDisplay}
            </a>
          </div>
        }
        pageType="foreclosure"
        compact
        noBottomCta
      >
        {/* Jose + Contact Form */}
        <div id="contact-form" className="not-prose grid md:grid-cols-2 gap-8 mb-12 scroll-mt-20">
          <div className="flex flex-col gap-4 order-2 md:order-1">
            <div className="flex items-center gap-4">
              <Image
                src="/jose-profile.jpg"
                alt="Jose Fernandez, NJ Real Estate Agent"
                width={80}
                height={80}
                className="rounded-full object-cover w-20 h-20 shrink-0"
              />
              <div>
                <p className="font-bold text-remax-blue text-lg leading-tight">Jose Fernandez</p>
                <p className="text-remax-slate text-sm">Partner, The Borrero Group at RE/MAX · $60M+ Sold Every Year</p>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-remax-slate/60 ml-1">on Zillow</span>
                </div>
              </div>
            </div>

            <div className="hidden md:block space-y-3 text-remax-slate">
              <p>
                I specialize in helping NJ homeowners navigate foreclosure before it damages
                their credit or their family. I've worked through this with hundreds of families
                — and I've never judged a single one.
              </p>
              <p>
                Whether the solution is a short sale, a quick market listing, or negotiating
                with your lender, I'll help you understand every option clearly so you can
                make the best decision for your situation.
              </p>
            </div>

            <div className="space-y-2 text-sm text-remax-slate">
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Free, completely confidential consultation</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>I'll personally reach out — not a call center</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>15 years navigating NJ foreclosure and short sales</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>No judgment — this happens to more families than you know</span>
              </div>
            </div>

            <p className="text-sm text-remax-slate/70">
              Prefer to call?{" "}
              <a href={telHref} className="text-remax-blue font-semibold hover:underline">
                {siteConfig.contact.phoneDisplay}
              </a>
              {" "}· or{" "}
              <a
                href={siteConfig.social.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="text-remax-blue font-semibold hover:underline"
              >
                message me privately on Facebook
              </a>
            </p>
          </div>

          <div className="order-1 md:order-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-remax-blue mb-1">Talk to Jose — Free & Confidential</h2>
            <p className="text-remax-slate text-sm mb-4">Tell me where things stand and I'll help you understand your options.</p>
            <ContactForm defaultServiceType="foreclosure" />
          </div>
        </div>

        {/* Time sensitivity — framed as hope, not doom */}
        <div className="not-prose bg-amber-50 border-l-4 border-amber-400 p-6 rounded mb-8">
          <p className="font-semibold text-amber-800 mb-1">The earlier you reach out, the more options you have</p>
          <p className="text-amber-700 text-sm">
            New Jersey foreclosure typically takes 12–18 months from first missed payment.
            Even if you've already received a notice, a short sale, loan modification, or
            quick market sale may still be on the table. Time matters — but you likely have
            more of it than you think.
          </p>
        </div>

        {/* Where are you in the process? — NJ stages, options remain at each */}
        <section className="not-prose mb-10">
          <h2 className="text-2xl font-bold text-remax-blue mb-2">Where Are You in the Process?</h2>
          <p className="text-remax-slate/80 mb-5">
            New Jersey foreclosure moves in stages, and your stage determines your options — not the scary letters. Find yourself below:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {FORECLOSURE_STAGES.map(({ stage, what, stillOpen }, i) => (
              <div key={stage} className="border border-gray-200 rounded-2xl p-5 space-y-2">
                <p className="font-bold text-remax-blue">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-remax-blue text-white text-xs font-bold mr-2 align-middle">{i + 1}</span>
                  {stage}
                </p>
                <p className="text-sm text-remax-slate/80">{what}</p>
                <p className="text-sm font-medium text-green-700">{stillOpen}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center font-semibold text-remax-blue">
            Wherever you are, there&apos;s a move available — the only losing move is waiting.
          </p>
        </section>

        {/* Options */}
        <section>
          <h2 className="mb-4">Your Options</h2>
          <ul className="space-y-4 text-remax-slate">
            {FORECLOSURE_OPTIONS.map(({ title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="text-remax-blue font-bold">→</span>
                <span><strong>{title}:</strong> {text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Anti-scam trust block */}
        <section className="not-prose mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-remax-blue mb-2">How to Know You&apos;re Dealing With a Professional</h2>
          <p className="text-remax-slate/80 mb-4 text-sm">
            Homeowners in foreclosure get targeted by &ldquo;rescue&rdquo; scams — and you should be suspicious of anyone who contacts you. Here&apos;s how legitimate help looks:
          </p>
          <ul className="space-y-3">
            {FORECLOSURE_TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-remax-slate">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-remax-slate/60">{siteConfig.business.license} · The Borrero Group at RE/MAX</p>
        </section>

        {/* FAQ */}
        <section>
          <h3 className="mb-4 mt-8">Common Questions</h3>
          <div className="not-prose space-y-5">
            {FORECLOSURE_FAQ.map(({ q, a }) => (
              <div key={q} className="border-l-4 border-remax-blue/30 pl-4">
                <p className="font-semibold text-remax-blue mb-1">{q}</p>
                <p className="text-remax-slate text-sm">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Video */}
        <div className="not-prose my-10">
          <h2 className="text-2xl font-bold text-remax-blue mb-4">
            Watch: What NJ Homeowners Need to Know About Foreclosure
          </h2>
          <div className="aspect-video w-full relative rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/oFggswHSPdE"
              title="Foreclosure Prevention Guide"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* How I can help */}
        <section className="bg-remax-blue/5 p-8 rounded-lg">
          <h3 className="mb-4">How I Can Help</h3>
          <ul className="space-y-3 text-remax-slate">
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span>Reviewing your situation and explaining your real options — in plain language</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span>Communicating directly with your lender on short sales and modifications</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span>Managing timelines so you don't accidentally miss a window</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span>Pricing and listing your home fast if a quick market sale is your best path</span>
            </li>
          </ul>
        </section>

        {/* Foreclosure guides — topic-cluster links to the blog */}
        <section className="not-prose mt-10">
          <h2 className="text-2xl font-bold text-remax-blue mb-2">Foreclosure Guides for NJ Homeowners</h2>
          <p className="text-remax-slate/80 mb-5 text-sm">
            Want to understand the process in more depth before reaching out? These guides cover the questions I hear most:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                href: "/blog/how-to-stop-a-sheriff-sale-in-nj",
                title: "How to Stop a Sheriff Sale in NJ",
                desc: "Adjournments, redemption, and selling before the date — what still works.",
              },
              {
                href: "/blog/can-i-sell-my-house-during-foreclosure-in-nj",
                title: "Can I Sell My House During Foreclosure?",
                desc: "Yes — and if you have equity, it's usually the smartest move. Here's how.",
              },
              {
                href: "/blog/foreclosure-timeline-new-jersey",
                title: "The NJ Foreclosure Timeline, Step by Step",
                desc: "How long the process really takes and what happens at each stage.",
              },
              {
                href: "/blog/facing-foreclosure-in-new-jersey-your-options",
                title: "Facing Foreclosure in NJ? Your Options",
                desc: "Every path available to you, explained in plain language.",
              },
              {
                href: "/blog/short-sale-vs-foreclosure",
                title: "Short Sale vs. Foreclosure",
                desc: "What each one does to your credit, your equity, and your future.",
              },
              {
                href: "/blog/what-is-a-lis-pendens-in-new-jersey",
                title: "What Is a Lis Pendens in New Jersey?",
                desc: "What that court filing actually means — and what it doesn't.",
              },
            ].map(({ href, title, desc }) => (
              <Link
                key={href}
                href={href}
                className="block border border-gray-200 rounded-2xl p-5 hover:border-remax-blue/40 hover:shadow-sm transition-all"
              >
                <p className="font-semibold text-remax-blue mb-1">{title}</p>
                <p className="text-sm text-remax-slate/70">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Team + awards graphic and Zillow-style trust bar */}
        <div className="not-prose mt-10">
          <TeamSection />
        </div>

        {/* Final CTA */}
        <div className="not-prose bg-remax-blue rounded-xl p-8 text-center mt-8 mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">Every Day Matters — Let's Talk Today</h2>
          <p className="text-white/90 mb-6">
            Free, confidential, no pressure. Just an honest conversation about where you stand and what you can do.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#contact-form"
              className="px-6 py-3 bg-white text-remax-blue font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              Get a Free Consultation
            </a>
            <a
              href={telHref}
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Call {siteConfig.contact.phoneDisplay}
            </a>
          </div>
        </div>
      </PillarLayout>

      <ZillowReviews />
    </>
  );
}
