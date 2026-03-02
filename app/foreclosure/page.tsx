import { Metadata } from "next";
import PillarLayout from "@/components/PillarLayout";
import { generateServiceSchema } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "Foreclosure Help & Prevention | Jose Fernandez - NJ Real Estate",
  description: "Facing foreclosure in New Jersey? Explore your options including short sales, loan modifications, and strategic solutions to protect your credit.",
  openGraph: {
    title: "Foreclosure Assistance",
    description: "Facing foreclosure in New Jersey? Explore your options including short sales, loan modifications, and strategic solutions to protect your credit.",
    images: [
      {
        url: "/api/og?title=Foreclosure%20Assistance&type=pillar",
        width: 1200,
        height: 630,
        alt: "Foreclosure Assistance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foreclosure Assistance",
    description: "Facing foreclosure in New Jersey? Explore your options.",
    images: ["/api/og?title=Foreclosure%20Assistance&type=pillar"],
  },
};

export default function ForeclosurePage() {
  const serviceSchema = generateServiceSchema({
    name: "Foreclosure Assistance",
    description: "Facing foreclosure in New Jersey? Explore your options including short sales, loan modifications, and strategic solutions to protect your credit.",
    url: "https://josefernandez.com/foreclosure",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <PillarLayout
      title="Foreclosure Assistance"
      subtitle="Protect your credit and explore all options before it's too late"
    >
      <div className="space-y-8">
        <section>
          <h2>Time-Sensitive Solutions</h2>
          <p className="text-lg text-remax-slate/80">
            If you're facing foreclosure, acting quickly can save your credit and give you more options. 
            I specialize in helping New Jersey homeowners navigate this challenging situation with dignity and strategic planning.
          </p>
        </section>

        <section className="bg-remax-red/5 border-l-4 border-remax-red p-6 rounded">
          <h3 className="text-remax-red">Don't Wait Until It's Too Late</h3>
          <p className="text-remax-slate">
            The earlier you reach out, the more options you have. Even if you've received a foreclosure notice, 
            there are still strategies we can explore together.
          </p>
        </section>

        <section>
          <h3>Your Options</h3>
          <ul className="space-y-4 text-remax-slate">
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Short Sale:</strong> Sell your home for less than you owe with lender approval</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Loan Modification:</strong> Work with your lender to adjust payment terms</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Deed in Lieu:</strong> Transfer property to lender to avoid foreclosure</span>
            </li>
            <li className="flex gap-3">
              <span className="text-remax-blue font-bold">→</span>
              <span><strong>Quick Sale:</strong> Sell fast to pay off the mortgage before foreclosure</span>
            </li>
          </ul>
        </section>

        <section>
          <h3>How I Can Help</h3>
          <p className="text-remax-slate mb-4">
            I have experience negotiating with lenders and understanding New Jersey foreclosure laws. 
            My approach is confidential, non-judgmental, and focused on finding the best path forward for your situation.
          </p>
          <ul className="space-y-2 text-remax-slate">
            <li>• Free consultation to review your options</li>
            <li>• Direct communication with your lender</li>
            <li>• Timeline management to maximize your choices</li>
            <li>• Credit impact minimization strategies</li>
          </ul>
        </section>

        <section className="bg-remax-blue/5 p-8 rounded-lg">
          <h3>Take Action Today</h3>
          <p className="text-remax-slate">
            Every day matters when facing foreclosure. Let's discuss your situation in a confidential, 
            pressure-free conversation and create a plan that works for you.
          </p>
        </section>
      </div>
    </PillarLayout>
    </>
  );
}
