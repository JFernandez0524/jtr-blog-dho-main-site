import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "About Jose Fernandez | Trusted NJ Real Estate Advisor",
  description: "Learn about Jose Fernandez's mission to help New Jersey families protect their home equity during probate, foreclosure, and financial hardship.",
  alternates: {
    canonical: "https://www.josetherealtor.com/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-remax-blue/5 to-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="mb-4">About Jose Fernandez</h1>
        </div>
      </section>

      {/* My Mission */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl mb-8 text-remax-blue">My Mission</h2>
        <div className="prose prose-lg max-w-none text-remax-slate space-y-6">
          <p className="text-xl font-semibold text-remax-blue">
            To help homeowners and families protect the wealth tied to their home during life's most difficult transitions.
          </p>
          <p>
            For many families, a home is their largest financial asset. But during times of loss or financial hardship, 
            making the right decisions about that asset can feel overwhelming.
          </p>
          <p>
            Whether a family has inherited a property or is facing the stress of foreclosure, the choices they make 
            during this time can have a lasting impact on their financial future.
          </p>
          <p>
            My goal is simple: to provide clear guidance, real options, and honest advice so families can make the 
            best decision for their situation.
          </p>
        </div>
      </section>

      {/* Why I Focus on Probate and Foreclosure */}
      <section className="bg-remax-slate/5 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl mb-8 text-remax-blue">Why I Focus on Probate and Foreclosure</h2>
          <div className="prose prose-lg max-w-none text-remax-slate space-y-6">
            <p>
              Most real estate agents focus on traditional home sales.
            </p>
            <p className="font-semibold">
              I focus on situations where people need guidance the most.
            </p>
            <p>
              When a loved one passes away and a property is inherited, families suddenly find themselves responsible 
              for managing an asset that may involve legal, financial, and emotional challenges.
            </p>
            <p>
              When homeowners face financial hardship and the threat of foreclosure, many don't realize how quickly 
              fees and penalties can begin to reduce the equity they worked years to build.
            </p>
            <p>
              In both situations, the wrong advice—or no advice at all—can cost families tens or even hundreds of 
              thousands of dollars.
            </p>
            <p className="font-semibold">
              That's why I've dedicated my work to helping homeowners understand their options before making a decision.
            </p>
          </div>
        </div>
      </section>

      {/* A Different Approach */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl mb-8 text-remax-blue">A Different Approach</h2>
        <div className="prose prose-lg max-w-none text-remax-slate space-y-6">
          <p className="font-semibold">
            You won't find high-pressure tactics here.
          </p>
          <p>
            Every situation is different, and there is no one-size-fits-all solution.
          </p>
          <p>
            Depending on the circumstances, the best path forward might be:
          </p>
          <ul className="space-y-3">
            <li>Selling the property on the market to maximize value</li>
            <li>Selling the home as-is for a faster resolution</li>
            <li>Keeping the property and exploring other financial options</li>
            <li>Working with the lender to pursue a loan modification</li>
            <li>Considering a short sale if the property is underwater</li>
          </ul>
          <p className="font-semibold">
            My role is to help you understand these options clearly so you can choose the path that best protects 
            your financial future.
          </p>
        </div>
      </section>

      {/* Experience You Can Trust */}
      <section className="bg-remax-slate/5 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl mb-8 text-remax-blue">Experience You Can Trust</h2>
          <div className="prose prose-lg max-w-none text-remax-slate space-y-6">
            <p>
              Jose Fernandez is a licensed real estate professional with RE/MAX Homeland Realtors, helping New Jersey 
              homeowners navigate complex real estate situations for over a decade.
            </p>
            <p>He specializes in:</p>
            <ul className="space-y-3">
              <li>Inherited property sales</li>
              <li>Probate real estate</li>
              <li>Pre-foreclosure situations</li>
              <li>Distressed property solutions</li>
              <li>Helping families maximize the value of their home</li>
            </ul>
            <p>
              His focus is not just on selling property—but on helping families make informed decisions during 
              challenging times.
            </p>
          </div>
        </div>
      </section>

      {/* When You Need a Trusted Resource */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl mb-8 text-remax-blue">When You Need a Trusted Resource</h2>
        <div className="prose prose-lg max-w-none text-remax-slate space-y-6">
          <p>
            If you're dealing with an inherited home, financial hardship, or a complicated property situation, 
            you don't have to navigate it alone.
          </p>
          <p>
            Having the right guidance early can make a significant difference in the outcome.
          </p>
          <p className="font-semibold">
            My goal is to make sure you understand your options and feel confident about the decision you make 
            moving forward.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-remax-blue/5 to-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl mb-4">Need Guidance for Your Situation?</h2>
          <p className="text-xl text-remax-slate/80 mb-8">
            If you're dealing with an inherited property or financial hardship, understanding your options early 
            can make a significant difference.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-remax-blue text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            {siteConfig.cta.primary}
          </Link>
        </div>
      </section>
    </main>
  );
}
