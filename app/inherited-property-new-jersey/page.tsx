import { Metadata } from "next";
import Image from "next/image";
import PillarLayout from "@/components/PillarLayout";
import PropertyValuationForm from "@/components/PropertyValuationForm";
import ZillowReviews from "@/components/ZillowReviews";
import { generateServiceSchema, generateBreadcrumbSchema } from "@/lib/structuredData";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig } from "@/lib/config";

const telHref = `tel:${siteConfig.contact.phone.replace(/[\s()-]/g, "")}`;

export const metadata: Metadata = {
  title: "Inherited Property New Jersey | Jose Fernandez - NJ Real Estate",
  description: "Expert guidance for selling inherited property in New Jersey. Navigate probate, estate sales, and family decisions with confidence in NJ.",
  alternates: {
    canonical: "https://www.josetherealtor.com/inherited-property-new-jersey",
  },
  openGraph: {
    title: "Inherited Property New Jersey",
    description: "Expert guidance for selling inherited property in New Jersey. Navigate probate, estate sales, and family decisions with confidence.",
    images: [
      {
        url: "/api/og?title=Inherited%20Property%20New%20Jersey&type=pillar",
        width: 1200,
        height: 630,
        alt: "Inherited Property New Jersey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inherited Property New Jersey",
    description: "Expert guidance for selling inherited property in New Jersey.",
    images: ["/api/og?title=Inherited%20Property%20New%20Jersey&type=pillar"],
  },
};

export default function InheritedPropertyPage() {
  const serviceSchema = generateServiceSchema({
    name: "Inherited Property Solutions",
    description: "Expert guidance for selling inherited property in New Jersey. Navigate probate, estate sales, and family decisions with confidence.",
    url: "https://www.josetherealtor.com/inherited-property-new-jersey",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.josetherealtor.com" },
    { name: "Inherited Property", url: "https://www.josetherealtor.com/inherited-property-new-jersey" }
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
          { name: "Inherited Property New Jersey", href: "/inherited-property-new-jersey", current: true }
        ]} />
      </div>

      <PillarLayout
        title="Just Inherited a New Jersey Property? You Have More Options Than You Think."
        subtitle="Most families feel overwhelmed — unsure about probate, repairs, or what the home is even worth. I've helped hundreds of NJ families navigate this, and I can help you understand all your options before making any decisions."
        heroCta={
          <div className="flex flex-wrap gap-3">
            <a
              href="#valuation-form"
              className="px-6 py-3 bg-white text-remax-blue font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              Get My Free Property Valuation
            </a>
            <a
              href={telHref}
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Call {siteConfig.contact.phoneDisplay}
            </a>
          </div>
        }
        pageType="inherited-property-new-jersey"
        compact
        noBottomCta
      >
        {/* Jose + Form */}
        <div id="valuation-form" className="not-prose grid md:grid-cols-2 gap-8 mb-12 scroll-mt-6">
          <div className="flex flex-col gap-4">
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

            <div className="space-y-3 text-remax-slate">
              <p>
                I specialize in helping NJ families navigate inherited properties — from understanding
                what the home is worth to guiding you through probate, family decisions, and the
                right next step for your situation.
              </p>
              <p>
                Whether you decide to sell, keep the property, or need more time to figure it out,
                I'm here to give you honest information — not a sales pitch.
              </p>
            </div>

            <div className="space-y-2 text-sm text-remax-slate">
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Free property valuation with no obligation</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>I'll personally call you — not a call center</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>15+ years navigating NJ probate and estate sales</span>
              </div>
            </div>

            <p className="text-sm text-remax-slate/70">
              Prefer to call?{" "}
              <a href={telHref} className="text-remax-blue font-semibold hover:underline">
                {siteConfig.contact.phoneDisplay}
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-remax-blue mb-4">Get Your Free Property Valuation</h2>
            <PropertyValuationForm />
          </div>
        </div>

        {/* Video */}
        <div className="not-prose mb-12">
          <h2 className="text-2xl font-bold text-remax-blue mb-4">
            Watch: What NJ Families Need to Know About Inherited Properties
          </h2>
          <div className="aspect-video w-full relative rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Wl3JPs492iU"
              title="Inherited Property New Jersey Guide"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* You're Not Alone */}
        <section>
          <h2 className="mb-4">You're Not Alone in This Process</h2>
          <p className="text-lg text-remax-slate/80">
            Inheriting property can be overwhelming, especially during a difficult time. Whether you're
            dealing with probate, coordinating with family members, or deciding what to do with the
            property, I'm here to help you navigate every step.
          </p>
        </section>

        {/* Common Challenges */}
        <section>
          <h3 className="mb-4 mt-6">Common Challenges I Help Solve</h3>
          <ul className="space-y-4 text-remax-slate">
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Probate Navigation:</strong> Understanding the legal process and timeline for estate sales</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Family Coordination:</strong> Managing decisions when multiple heirs are involved</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Property Condition:</strong> Selling as-is or determining necessary repairs</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Tax Implications:</strong> Understanding capital gains and estate tax considerations</span>
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section>
          <h3 className="mb-4 mt-8">Common Questions</h3>
          <div className="not-prose space-y-5">
            {[
              {
                q: "What if the house needs a lot of work?",
                a: "You can sell it as-is. Most buyers in this market factor in renovation costs — you're not required to fix anything before selling. I'll help you understand what the property is worth in its current condition.",
              },
              {
                q: "What if we haven't finished probate yet?",
                a: "We can still talk now. I'll help you understand the timeline and what steps you can start taking before probate is complete — so you're not scrambling later.",
              },
              {
                q: "What if multiple heirs disagree?",
                a: "I've helped many families navigate this. Getting an honest, professional valuation often gives everyone a clearer starting point and takes some of the emotion out of the conversation.",
              },
              {
                q: "How quickly can we close?",
                a: "Most families I work with close in 60–90 days once they're ready to move forward. If you need more time to sort things out, that's completely fine — there's no pressure.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-l-4 border-remax-blue/30 pl-4">
                <p className="font-semibold text-remax-blue mb-1">{q}</p>
                <p className="text-remax-slate text-sm">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What to Expect */}
        <section className="bg-remax-blue/5 p-8 rounded-lg mt-8">
          <h3 className="mb-4">What to Expect When You Work With Me</h3>
          <ol className="space-y-3 text-remax-slate list-decimal list-inside">
            <li>Initial consultation to understand your situation and timeline</li>
            <li>Property evaluation and market analysis</li>
            <li>Guidance on probate requirements and documentation</li>
            <li>Strategic marketing plan tailored to your needs</li>
            <li>Support through closing and estate settlement</li>
          </ol>
        </section>

        {/* Final CTA */}
        <div className="not-prose bg-remax-blue rounded-xl p-8 text-center mt-8 mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to Get Clarity?</h2>
          <p className="text-white/90 mb-6">
            Let's talk through your situation — no pressure, no obligation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#valuation-form"
              className="px-6 py-3 bg-white text-remax-blue font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              Get My Free Valuation
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
