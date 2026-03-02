import { Metadata } from "next";
import BentoGrid from "@/components/BentoGrid";
import { getAllPosts } from "@/lib/mdx";
import { generateOrganizationSchema } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "Jose Fernandez | NJ Real Estate Specialist - Inherited Property, Foreclosure & As-Is Sales",
  description: "Expert guidance for inherited property, foreclosure assistance, and as-is home sales in New Jersey. Compassionate, professional service when you need it most.",
  keywords: ["New Jersey real estate", "inherited property", "foreclosure help", "sell as-is", "probate real estate", "NJ real estate specialist"],
  authors: [{ name: "Jose Fernandez" }],
  creator: "Jose Fernandez",
  publisher: "Jose Fernandez",
  formatDetection: {
    telephone: true,
    email: true,
  },
};

export default function Home() {
  const allPosts = getAllPosts();
  const latestPosts = allPosts.slice(0, 2);
  const organizationSchema = generateOrganizationSchema();

  return (
    <main className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Bento Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <BentoGrid latestPosts={latestPosts} />
      </section>

      {/* Trust Indicators */}
      <section className="bg-remax-slate/5 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl font-bold text-remax-blue mb-2">15+</div>
              <div className="text-remax-slate">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-remax-blue mb-2">500+</div>
              <div className="text-remax-slate">Families Helped</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-remax-blue mb-2">100%</div>
              <div className="text-remax-slate">Confidential Service</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Jose */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-center mb-12">Why Work With Me?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl">Specialized Expertise</h3>
            <p className="text-remax-slate/80">
              I focus exclusively on complex real estate situations where homeowners need more than a traditional agent. 
              Whether it's probate, foreclosure, or selling as-is, I have the experience to guide you through.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl">Compassionate Approach</h3>
            <p className="text-remax-slate/80">
              Real estate challenges often come during difficult times. I provide judgment-free guidance with patience 
              and understanding, always putting your needs first.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl">Local Market Knowledge</h3>
            <p className="text-remax-slate/80">
              As a New Jersey specialist, I understand local probate laws, foreclosure timelines, and market conditions 
              that affect your specific situation.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl">No-Pressure Consultation</h3>
            <p className="text-remax-slate/80">
              Every situation is unique. I offer free consultations to understand your needs and explore all options 
              before you make any decisions.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
