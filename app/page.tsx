import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BentoGrid from "@/components/BentoGrid";
import ZillowReviews from "@/components/ZillowReviews";
import { getAllPosts } from "@/lib/mdx";
import { generateOrganizationSchema, generateLocalBusinessSchema } from "@/lib/structuredData";
import { siteConfig } from "@/lib/config";

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
  alternates: {
    canonical: "https://www.josetherealtor.com",
  },
  openGraph: {
    title: "Jose Fernandez | NJ Real Estate Specialist",
    description: "Expert guidance for inherited property, foreclosure assistance, and as-is home sales in New Jersey.",
    url: "https://www.josetherealtor.com",
    siteName: "Jose Fernandez Real Estate",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og?title=Jose%20Fernandez%20-%20NJ%20Real%20Estate%20Specialist",
        width: 1200,
        height: 630,
        alt: "Jose Fernandez - New Jersey Real Estate Specialist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jose Fernandez | NJ Real Estate Specialist",
    description: "Expert guidance for inherited property, foreclosure assistance, and as-is home sales in New Jersey.",
    images: ["/api/og?title=Jose%20Fernandez%20-%20NJ%20Real%20Estate%20Specialist"],
  },
};

export default function Home() {
  const allPosts = getAllPosts();
  const latestPosts = allPosts.slice(0, 2);
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <main className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-remax-blue/5 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="mb-6">New Jersey Real Estate Specialist</h1>
              <p className="text-xl text-remax-slate/80 mb-8">
                Expert guidance for inherited property, foreclosure assistance, and as-is home sales. 
                Compassionate, professional service when you need it most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  aria-label="Get free consultation with Jose Fernandez"
                  className="px-8 py-4 bg-remax-blue text-white rounded-lg hover:opacity-90 transition-opacity text-center font-semibold"
                >
                  Get Free Consultation
                </Link>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  aria-label={`Call Jose Fernandez at ${siteConfig.contact.phoneDisplay}`}
                  className="px-8 py-4 border-2 border-remax-blue text-remax-blue rounded-lg hover:bg-remax-blue/5 transition-colors text-center font-semibold"
                >
                  {siteConfig.contact.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/jose-profile.jpg"
                alt={siteConfig.contact.name}
                width={500}
                height={500}
                className="rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <BentoGrid latestPosts={latestPosts} />
      </section>

      {/* About Jose */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center mb-12">About Jose Fernandez</h2>
          <div className="prose prose-lg max-w-none text-remax-slate space-y-6">
            <p>
              Jose Fernandez is an experienced and highly skilled real estate agent specializing in helping 
              homeowners navigate unique situations. With a decade of expertise under his belt, Jose focuses 
              on assisting clients who have inherited houses and those facing foreclosure, ensuring they 
              achieve the best possible outcomes.
            </p>
            <p>
              When it comes to inherited properties, Jose understands the emotional and financial challenges 
              involved. His extensive knowledge of the inherited house market enables him to guide clients 
              through the process of selling these properties for maximum value, even in their current condition. 
              Whether it's settling an estate or maximizing return on investment, Jose provides tailored 
              solutions to meet the specific needs of his clients.
            </p>
            <p>
              In the realm of foreclosure, Jose is a compassionate advocate for homeowners facing the 
              distressing prospect of losing their homes. Utilizing his vast network and employing creative 
              strategies, he works tirelessly to protect his clients' interests and minimize their losses. 
              With exceptional negotiation skills and a commitment to client satisfaction, Jose ensures that 
              individuals in these difficult situations receive the support, information, and empowerment 
              they need.
            </p>
            <p className="text-center font-semibold text-remax-blue text-xl mt-8">
              If you're in a situation where you've inherited a house or facing the challenges of foreclosure, 
              Jose Fernandez is the trusted professional to guide you.
            </p>
          </div>
        </div>
      </section>

      {/* Zillow Reviews */}
      <ZillowReviews />

      {/* Trust Indicators */}
      <section className="bg-remax-slate/5 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl font-bold text-remax-blue mb-2">10+</div>
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
