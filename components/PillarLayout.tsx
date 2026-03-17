import { ReactNode } from "react";
import AsyncHeroImage from "./AsyncHeroImage";

interface PillarLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  compact?: boolean;
  pageType: string;
}

export default function PillarLayout({ title, subtitle, children, compact, pageType }: PillarLayoutProps) {
  return (
    <article className="min-h-screen">
      {/* Hero Section */}
      <AsyncHeroImage
        pageType={pageType}
        className={`bg-gradient-to-b from-remax-blue/5 to-white ${compact ? "py-8" : "py-20"} relative`}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-balance mb-6 text-white">{title}</h1>
          <p className="text-xl text-white/90">{subtitle}</p>
        </div>
      </AsyncHeroImage>

      {/* Content Area */}
      <section className={`max-w-4xl mx-auto px-6 ${compact ? "py-6" : "py-16"}`}>
        <div className="prose prose-lg max-w-none">
          {children}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-remax-blue text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-white/90">
            Let's discuss your situation and find the best solution for you.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-remax-blue font-semibold rounded hover:bg-white/90 transition-colors"
          >
            Contact Jose Today
          </a>
        </div>
      </section>
    </article>
  );
}
