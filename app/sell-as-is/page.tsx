import { Metadata } from "next";
import PillarLayout from "@/components/PillarLayout";
import { generateServiceSchema } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "Sell Your House As-Is | Jose Fernandez - NJ Real Estate",
  description: "Sell your New Jersey home as-is without repairs, cleaning, or staging. Fast, hassle-free solutions for any property condition.",
  alternates: {
    canonical: "https://www.josetherealtor.com/sell-as-is",
  },
  openGraph: {
    title: "Sell Your House As-Is",
    description: "Sell your New Jersey home as-is without repairs, cleaning, or staging. Fast, hassle-free solutions for any property condition.",
    images: [
      {
        url: "/api/og?title=Sell%20Your%20House%20As-Is&type=pillar",
        width: 1200,
        height: 630,
        alt: "Sell Your House As-Is",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Your House As-Is",
    description: "Sell your New Jersey home as-is without repairs, cleaning, or staging.",
    images: ["/api/og?title=Sell%20Your%20House%20As-Is&type=pillar"],
  },
};

export default function SellAsIsPage() {
  const serviceSchema = generateServiceSchema({
    name: "Sell Your House As-Is",
    description: "Sell your New Jersey home as-is without repairs, cleaning, or staging. Fast, hassle-free solutions for any property condition.",
    url: "https://josefernandez.com/sell-as-is",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <PillarLayout
      title="Sell Your House As-Is"
      subtitle="No repairs, no staging, no hassle—sell your property in any condition"
      pageType="sell-as-is"
    >
      <div className="space-y-8">
        <section>
          <h2 className="!mb-4 !mt-8">Sell Without the Stress</h2>
          <p className="text-lg text-remax-slate/80">
            Not every homeowner has the time, money, or energy to prepare a house for the traditional market. 
            If your property needs work, you're dealing with tenant issues, or you simply want a fast sale, 
            selling as-is might be your best option.
          </p>
        </section>

        <section>
          <h3 className="!mb-4 !mt-6">Perfect For These Situations</h3>
          <ul className="space-y-4 text-remax-slate">
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Major Repairs Needed:</strong> Foundation issues, roof damage, outdated systems</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Inherited Property:</strong> Don't want to invest in a property you didn't choose</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Relocation:</strong> Moving quickly for work or family reasons</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Tenant Issues:</strong> Occupied property or difficult rental situation</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Financial Hardship:</strong> Can't afford repairs or carrying costs</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-4 mt-6">What "As-Is" Really Means</h3>
          <p className="text-remax-slate mb-4">
            Selling as-is means the buyer accepts the property in its current condition. You won't need to:
          </p>
          <ul className="space-y-2 text-remax-slate">
            <li>• Make any repairs or improvements</li>
            <li>• Clean out or stage the property</li>
            <li>• Deal with inspection negotiations</li>
            <li>• Worry about appraisal repair requirements</li>
          </ul>
        </section>

        <section className="bg-remax-blue/5 p-8 rounded-lg">
          <h3 className="mb-4 mt-6">My As-Is Selling Process</h3>
          <ol className="space-y-3 text-remax-slate list-decimal list-inside">
            <li>Property walkthrough to understand current condition</li>
            <li>Market analysis for realistic as-is pricing</li>
            <li>Target marketing to investors and as-is buyers</li>
            <li>Full disclosure documentation to protect you legally</li>
            <li>Smooth closing with minimal requirements</li>
          </ol>
        </section>

        <section>
          <h3 className="mb-4 mt-6">Maximize Your As-Is Sale</h3>
          <p className="text-remax-slate">
            While you won't make repairs, strategic pricing and marketing can still get you competitive offers. 
            I have a network of investors and buyers specifically looking for as-is properties in New Jersey, 
            which means faster sales and fewer contingencies.
          </p>
        </section>
      </div>
    </PillarLayout>
    </>
  );
}
