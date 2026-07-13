import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getLocationBySlug, getLocationSlugs, LocationServiceType } from "@/lib/mdx";
import { notFound } from "next/navigation";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import BlogCTA from "@/components/BlogCTA";
import Breadcrumb from "@/components/Breadcrumb";
import TownsServed from "@/components/TownsServed";
import { generateServiceSchema, generateBreadcrumbSchema } from "@/lib/structuredData";

const LOCATION_SERVICE_CONFIG: Record<
  LocationServiceType,
  { pillarHref: string; pillarLabel: string; serviceName: string; ogType: string }
> = {
  "inherited-property": {
    pillarHref: "/inherited-property-new-jersey",
    pillarLabel: "Inherited Property",
    serviceName: "Inherited Property Solutions",
    ogType: "Inherited Property",
  },
  foreclosure: {
    pillarHref: "/foreclosure",
    pillarLabel: "Foreclosure Help",
    serviceName: "Foreclosure Assistance",
    ogType: "Foreclosure Help",
  },
  "sell-as-is": {
    pillarHref: "/sell-as-is",
    pillarLabel: "Sell As-Is",
    serviceName: "As-Is Home Sales",
    ogType: "Sell As-Is",
  },
};

export async function generateStaticParams() {
  return getLocationSlugs().map((slug) => ({ locationSlug: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locationSlug: string }> }): Promise<Metadata> {
  const { locationSlug } = await params;
  if (!getLocationSlugs().includes(locationSlug)) return {};
  const location = getLocationBySlug(locationSlug);
  const config = LOCATION_SERVICE_CONFIG[location.serviceType];
  const ogImageUrl = `/api/og?title=${encodeURIComponent(`${config.ogType} in ${location.town}, NJ`)}&type=pillar`;
  return {
    title: location.title,
    description: location.metaDescription,
    alternates: {
      canonical: `https://www.josetherealtor.com/${locationSlug}`,
    },
    openGraph: {
      title: location.title,
      description: location.metaDescription,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: location.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: location.title,
      description: location.metaDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ locationSlug: string }> }) {
  const { locationSlug } = await params;
  if (!getLocationSlugs().includes(locationSlug)) notFound();
  const location = getLocationBySlug(locationSlug);
  const config = LOCATION_SERVICE_CONFIG[location.serviceType];

  const serviceSchema = generateServiceSchema({
    name: `${config.serviceName} — ${location.town}, NJ`,
    description: location.metaDescription,
    url: `https://www.josetherealtor.com/${locationSlug}`,
    areaServed: { type: "City", name: location.town },
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.josetherealtor.com" },
    { name: config.pillarLabel, url: `https://www.josetherealtor.com${config.pillarHref}` },
    { name: location.town, url: `https://www.josetherealtor.com/${locationSlug}` },
  ]);

  return (
    <article className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <header className="bg-gradient-to-b from-remax-blue/5 to-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { name: "Home", href: "/" },
            { name: config.pillarLabel, href: config.pillarHref },
            { name: location.town, href: `/${locationSlug}`, current: true },
          ]} />
          <h1 className="text-4xl lg:text-5xl font-bold text-balance mt-6 mb-4">{location.heroHeading}</h1>
          <p className="text-xl text-remax-slate/80">{location.heroSubtext}</p>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {location.youtubeId && (
          <div className="mb-10">
            <YouTubeEmbed id={location.youtubeId} title={location.heroHeading} />
          </div>
        )}
        <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-h1:text-4xl prose-h2:text-3xl prose-headings:text-remax-blue prose-a:text-remax-blue prose-strong:text-remax-slate [&>h1]:mb-6 [&>h1]:mt-8 [&>h2]:mb-6 [&>h2]:mt-8 [&>h3]:mb-4 [&>h3]:mt-6 [&>p]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4 [&>li]:mb-2">
          <MDXRemote source={location.content} components={{ YouTubeEmbed }} />
        </div>
        <BlogCTA />
      </section>

      <TownsServed excludeSlug={locationSlug} serviceType={location.serviceType} />
    </article>
  );
}
