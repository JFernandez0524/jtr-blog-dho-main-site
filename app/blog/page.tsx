import { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import BlogList from "@/components/BlogList";
import AsyncHeroImage from "@/components/AsyncHeroImage";

export const metadata: Metadata = {
  title: "Real Estate Insights & Guides | Jose Fernandez Blog",
  description: "Expert advice on inherited property, foreclosure prevention, and selling homes as-is in New Jersey.",
  alternates: {
    canonical: "https://www.josetherealtor.com/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <AsyncHeroImage
        pageType="blog"
        className="bg-gradient-to-b from-remax-blue/5 to-white py-20 relative"
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <h1 className="text-balance mb-4 text-white">Real Estate Insights</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Expert guidance on inherited property, foreclosure prevention, and navigating complex real estate situations in New Jersey.
          </p>
        </div>
      </AsyncHeroImage>

      {/* Blog Posts */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <BlogList posts={posts} />
      </section>
    </main>
  );
}
