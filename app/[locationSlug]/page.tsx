import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getLocationBySlug, getLocationSlugs } from "@/lib/mdx";
import { notFound } from "next/navigation";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import BlogCTA from "@/components/BlogCTA";
import Breadcrumb from "@/components/Breadcrumb";

export async function generateStaticParams() {
  return getLocationSlugs().map((slug) => ({ locationSlug: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locationSlug: string }> }): Promise<Metadata> {
  const { locationSlug } = await params;
  if (!getLocationSlugs().includes(locationSlug)) return {};
  const location = getLocationBySlug(locationSlug);
  return {
    title: location.title,
    description: location.metaDescription,
    alternates: {
      canonical: `https://www.josetherealtor.com/${locationSlug}`,
    },
    openGraph: { title: location.title, description: location.metaDescription },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ locationSlug: string }> }) {
  const { locationSlug } = await params;
  if (!getLocationSlugs().includes(locationSlug)) notFound();
  const location = getLocationBySlug(locationSlug);

  return (
    <article className="min-h-screen">
      <header className="bg-gradient-to-b from-remax-blue/5 to-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { name: "Home", href: "/" },
            { name: "Inherited Property", href: "/inherited-property-new-jersey" },
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
    </article>
  );
}
