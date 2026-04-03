import { Metadata } from "next";
import PillarLayout from "@/components/PillarLayout";
import PropertyValuationForm from "@/components/PropertyValuationForm";
import ZillowReviews from "@/components/ZillowReviews";
import { generateServiceSchema, generateBreadcrumbSchema } from "@/lib/structuredData";
import Breadcrumb from "@/components/Breadcrumb";

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
      title="Inherited Property New Jersey Solutions"
      subtitle="You don't have to figure this out alone. Get an instant property valuation and understand all your options — before making any decisions."
      pageType="inherited-property-new-jersey"
      compact
    >
      <div className="space-y-8">
        <section>
          <h2 className="mb-4">Get Your Free Property Valuation</h2>
          <PropertyValuationForm />
        </section>

        <section>
          <h2 className="mb-4 mt-8">You're Not Alone in This Process</h2>
          <p className="text-lg text-remax-slate/80">
            Inheriting property can be overwhelming, especially during a difficult time. Whether you're dealing with probate, 
            coordinating with family members, or deciding what to do with the property, I'm here to help you navigate every step.
          </p>
        </section>

        <section className="my-8">
          <div className="aspect-video w-full max-w-4xl mx-auto relative">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Wl3JPs492iU"
              title="Inherited Property New Jersey Guide"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-lg"
            />
          </div>
        </section>

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

        <section>
          <h3 className="mb-4 mt-6">My Approach</h3>
          <p className="text-remax-slate">
            I work with compassion and patience, understanding that inherited property sales are about more than just real estate. 
            My goal is to make the process as smooth as possible while maximizing value for you and your family.
          </p>
        </section>

        <section className="bg-remax-blue/5 p-8 rounded-lg">
          <h3 className="mb-4">What to Expect</h3>
          <ol className="space-y-3 text-remax-slate list-decimal list-inside">
            <li>Initial consultation to understand your situation and timeline</li>
            <li>Property evaluation and market analysis</li>
            <li>Guidance on probate requirements and documentation</li>
            <li>Strategic marketing plan tailored to your needs</li>
            <li>Support through closing and estate settlement</li>
          </ol>
        </section>
      </div>
    </PillarLayout>
    <ZillowReviews />
    </>
  );
}
