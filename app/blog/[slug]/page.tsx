import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getPostSlugs, getAllPosts } from "@/lib/mdx";
import { getRelatedPosts } from "@/lib/relatedPosts";
import { generateArticleSchema } from "@/lib/structuredData";
import Link from "next/link";

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  const ogImageUrl = `/api/og?title=${encodeURIComponent(post.title)}&type=blog`;
  
  return {
    title: `${post.title} | Jose Fernandez`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  const allPosts = getAllPosts();
  const relatedPosts = getRelatedPosts(params.slug, post.tags, allPosts, 3);
  const articleSchema = generateArticleSchema(post);

  return (
    <article className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Header */}
      <header className="bg-gradient-to-b from-remax-blue/5 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/blog" className="text-remax-blue hover:opacity-80 mb-6 inline-block">
            ← Back to Blog
          </Link>
          <h1 className="text-balance mb-4">{post.title}</h1>
          <div className="flex items-center gap-6 text-remax-slate/80">
            <span>{post.author}</span>
            <span>•</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>•</span>
            <span>{post.readingTime}</span>
          </div>
          <div className="flex gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-remax-blue/10 text-remax-blue text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none prose-headings:text-remax-blue prose-a:text-remax-blue prose-strong:text-remax-slate">
          <MDXRemote source={post.content} />
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-12 border-t border-remax-slate/10">
          <h2 className="text-3xl mb-8">Related Articles</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <article
                key={relatedPost.slug}
                className="border border-remax-slate/10 rounded-lg p-4 hover:border-remax-blue/30 transition-colors"
              >
                <div className="flex gap-2 mb-2 flex-wrap">
                  {relatedPost.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-remax-blue/10 text-remax-blue text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg mb-2">
                  <Link href={`/blog/${relatedPost.slug}`} className="hover:opacity-80">
                    {relatedPost.title}
                  </Link>
                </h3>
                <p className="text-sm text-remax-slate/80 mb-3 line-clamp-2">
                  {relatedPost.excerpt}
                </p>
                <div className="text-xs text-remax-slate/60">
                  {relatedPost.readingTime}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-remax-blue text-white py-16 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-white">Need Help With Your Real Estate Situation?</h2>
          <p className="text-xl text-white/90">
            Let's discuss your specific needs in a free, no-pressure consultation.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-remax-blue font-semibold rounded hover:bg-white/90 transition-colors"
          >
            Contact Jose Today
          </Link>
        </div>
      </section>
    </article>
  );
}
