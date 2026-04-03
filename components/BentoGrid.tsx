import Link from "next/link";
import { ReactNode } from "react";
import { PostMetadata } from "@/lib/mdx";

interface BentoCardProps {
  title: string;
  description: string;
  href: string;
  className?: string;
  icon?: ReactNode;
}

function BentoCard({ title, description, href, className = "", icon }: BentoCardProps) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl border border-remax-slate/10 bg-white p-4 md:p-8 hover:border-remax-blue/30 transition-all hover:shadow-lg ${className}`}
    >
      {icon && <div className="mb-2 md:mb-4 text-remax-blue">{icon}</div>}
      <h3 className="text-xl md:text-2xl mb-2 md:mb-3 group-hover:text-remax-blue transition-colors">
        {title}
      </h3>
      <p className="text-remax-slate/80 text-sm md:text-base">{description}</p>
      <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 text-remax-blue opacity-0 group-hover:opacity-100 transition-opacity">
        →
      </div>
    </Link>
  );
}

interface BentoGridProps {
  latestPosts: PostMetadata[];
}

export default function BentoGrid({ latestPosts }: BentoGridProps) {
  const [post1, post2] = latestPosts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Hero Card - Large */}
      <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 rounded-2xl bg-gradient-to-br from-remax-blue to-remax-blue/80 text-white p-6 md:p-12 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
            Your Trusted NJ Real Estate Partner
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8">
            Specializing in complex situations: inherited property, foreclosure assistance, and as-is home sales.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-block px-8 py-4 bg-white text-remax-blue font-semibold rounded-lg hover:bg-white/90 transition-colors w-fit"
        >
          Get Your Free Consultation
        </Link>
      </div>

      {/* Pillar 1 - Inherited Property */}
      <BentoCard
        title="Inherited Property"
        description="Navigate probate and estate sales with compassionate, expert guidance."
        href="/inherited-property-new-jersey"
        className="lg:row-span-1"
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        }
      />

      {/* Pillar 2 - Foreclosure */}
      <BentoCard
        title="Foreclosure Help"
        description="Protect your credit and explore all options before it's too late."
        href="/foreclosure"
        className="lg:row-span-1"
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
      />

      {/* Blog Preview 1 - Dynamic */}
      {post1 && (
        <BentoCard
          title="Latest Insights"
          description={post1.title}
          href={`/blog/${post1.slug}`}
          className="md:col-span-1"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
      )}

      {/* Pillar 3 - Sell As-Is */}
      <BentoCard
        title="Sell As-Is"
        description="No repairs, no staging, no hassle. Sell your property in any condition."
        href="/sell-as-is"
        className="md:col-span-1"
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        }
      />

      {/* Blog Preview 2 - Dynamic */}
      {post2 && (
        <BentoCard
          title="Expert Advice"
          description={post2.title}
          href={`/blog/${post2.slug}`}
          className="md:col-span-1"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      )}

      {/* CTA Card */}
      <div className="md:col-span-2 lg:col-span-1 rounded-2xl bg-remax-red text-white p-4 md:p-8 flex flex-col justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3 text-white">Time-Sensitive?</h3>
          <p className="text-white/90 mb-4 md:mb-6 text-sm md:text-base">
            Facing foreclosure or need to sell quickly? Every day matters.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-block px-6 py-3 bg-white text-remax-red font-semibold rounded-lg hover:bg-white/90 transition-colors text-center"
        >
          Get Immediate Help
        </Link>
      </div>
    </div>
  );
}
