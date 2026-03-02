import { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import BlogList from "@/components/BlogList";

export const metadata: Metadata = {
  title: "Real Estate Insights & Guides | Jose Fernandez Blog",
  description: "Expert advice on inherited property, foreclosure prevention, and selling homes as-is in New Jersey.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-remax-blue/5 to-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-balance mb-4">Real Estate Insights</h1>
          <p className="text-xl text-remax-slate/80 max-w-2xl">
            Expert guidance on inherited property, foreclosure prevention, and navigating complex real estate situations in New Jersey.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <BlogList posts={posts} />
      </section>
    </main>
  );
}
