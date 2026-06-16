import { Metadata } from "next";
import Image from "next/image";
import PillarLayout from "@/components/PillarLayout";
import ContactForm from "@/components/ContactForm";
import ZillowReviews from "@/components/ZillowReviews";
import { generateServiceSchema, generateBreadcrumbSchema } from "@/lib/structuredData";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig } from "@/lib/config";

const telHref = `tel:${siteConfig.contact.phone.replace(/[\s()-]/g, "")}`;

export const metadata: Metadata = {
  title: "Foreclosure Help & Prevention | Jose Fernandez - NJ Real Estate",
  description: "Facing foreclosure in New Jersey? Explore your options including short sales, loan modifications, and strategic solutions to protect your credit.",
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb items={[
          { name: "Home", href: "/" },
          { name: "Foreclosure Help", href: "/foreclosure", current: true },
        ]} />
      </div>

      <PillarLayout
        title="Facing Foreclosure in New Jersey? There Are More Options Than Your Bank Is Telling You."
        subtitle="Most homeowners wait too long because they feel ashamed or aren't sure who to trust. A free, confidential conversation can open doors you didn't know existed — even if you've already received a notice."
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
                <p className="text-remax-slate text-sm">RE/MAX Agent · 15 Years in NJ Real Estate</p>
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

        {/* Options */}
        <section>
          <h2 className="mb-4">Your Options</h2>
          <ul className="space-y-4 text-remax-slate">
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Short Sale:</strong> Sell for less than you owe with lender approval — often the best way to protect your credit and avoid a foreclosure on your record</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Loan Modification:</strong> Work with your lender to restructure your payments — sometimes possible even after a default notice</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Quick Market Sale:</strong> Sell at market value fast enough to pay off the mortgage and walk away clean, if there's enough equity</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Deed in Lieu:</strong> Transfer the property directly to the lender to avoid the full foreclosure process — a last resort but better than foreclosure on your record</span>
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section>
          <h3 className="mb-4 mt-8">Common Questions</h3>
          <div className="not-prose space-y-5">
            {[
              {
                q: "Is it too late if I've already received a foreclosure notice?",
                a: "Not necessarily. New Jersey foreclosure is a slow process — it often takes over a year from first missed payment to a sheriff sale. Even after receiving a notice, short sales and other options may still be available. The key is acting now rather than waiting.",
              },
              {
                q: "Will talking to a real estate agent hurt my foreclosure case?",
                a: "No. A free consultation is just information — you're not committing to anything. Understanding your options early gives you more power, not less.",
              },
              {
                q: "What if I owe more than the home is worth?",
                a: "A short sale may be your best path. Lenders often approve them because they prefer recovering partial payment over absorbing the full cost of a lengthy foreclosure. I've negotiated short sales with NJ lenders many times.",
              },
              {
                q: "Is this conversation completely confidential?",
                a: "Yes. Everything you share with me stays between us. I understand this is a sensitive situation and discretion is something I take seriously with every client.",
              },
            ].map(({ q, a }) => (
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
