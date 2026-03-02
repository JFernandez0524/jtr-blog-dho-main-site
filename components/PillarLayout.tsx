import { ReactNode } from "react";

interface PillarLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function PillarLayout({ title, subtitle, children }: PillarLayoutProps) {
  return (
    <article className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-remax-blue/5 to-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-balance mb-4">{title}</h1>
          <p className="text-xl text-remax-slate/80">{subtitle}</p>
        </div>
      </section>

      {/* Content Area */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-lg max-w-none">
          {children}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-remax-blue text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-white">Ready to Get Started?</h2>
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
