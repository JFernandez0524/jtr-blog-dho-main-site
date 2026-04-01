import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getPostSlugs, getAllPosts } from "@/lib/mdx";
import { getRelatedPosts } from "@/lib/relatedPosts";
import { generateArticleSchema, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/structuredData";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import BlogCTA from "@/components/BlogCTA";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const allPosts = getAllPosts();
  const relatedPosts = getRelatedPosts(slug, post.tags, allPosts, 3);
  const articleSchema = generateArticleSchema(post);
  
  // Generate FAQ schema for inherited property post
  const faqs = slug === 'what-happens-when-you-inherit-a-house-in-new-jersey' ? [
    {
      question: "What is the probate process in New Jersey?",
      answer: "Probate is a legal process that allows the executor of an estate to settle outstanding debts, manage estate assets, and eventually transfer property to the heirs. During this time, families need to decide what they want to do with the inherited home."
    },
    {
      question: "Should I keep or sell my inherited property?",
      answer: "This depends on your financial situation, family dynamics, and the property condition. Some families keep the property as a residence or investment, while others decide selling may be the best option, especially if maintaining the home becomes difficult or multiple heirs need to split proceeds."
    },
    {
      question: "Can I sell an inherited house as-is?",
      answer: "Yes, you can sell an inherited property as-is to simplify the process. This option offers a quick closing timeline, no repair responsibilities, and reduced stress during probate, though it may result in a lower sale price compared to making repairs first."
    },
    {
      question: "How do I handle multiple heirs who disagree?",
      answer: "Communication between family members is crucial when multiple heirs are involved. Everyone should understand the available options, financial implications, timeline considerations, and legal requirements to agree on the best path forward."
    }
  ] : [];
  
  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null;
  
  // Generate breadcrumb schema
  const breadcrumbs = [
    { name: "Home", url: "https://www.josetherealtor.com" },
    { name: "Blog", url: "https://www.josetherealtor.com/blog" },
    { name: post.title, url: `https://www.josetherealtor.com/blog/${slug}` }
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <article className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header */}
      <header className="bg-gradient-to-b from-remax-blue/5 to-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
            { name: post.title, href: `/blog/${slug}`, current: true }
          ]} />
          <Link href="/blog" className="text-remax-blue hover:opacity-80 mb-6 inline-block mt-4">
            ← Back to Blog
          </Link>
          <h1 className="text-4xl lg:text-5xl font-bold text-balance mb-4 w-full">{post.title}</h1>
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
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-h1:text-4xl prose-h2:text-3xl prose-headings:text-remax-blue prose-a:text-remax-blue prose-strong:text-remax-slate [&>h1]:mb-6 [&>h1]:mt-8 [&>h2]:mb-6 [&>h2]:mt-8 [&>h3]:mb-4 [&>h3]:mt-6 [&>p]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4 [&>li]:mb-2 prose-iframe:h-auto">
          <MDXRemote source={post.content} components={{ YouTubeEmbed }} />
        </div>

        {/* CTA */}
        <BlogCTA />
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
