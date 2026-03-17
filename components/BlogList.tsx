"use client";

import { useState } from "react";
import Link from "next/link";
import { PostMetadata } from "@/lib/mdx";

interface BlogListProps {
  posts: PostMetadata[];
}

export default function BlogList({ posts }: BlogListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  // Filter posts by selected tag
  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  return (
    <div className="space-y-8">
      {/* Tag Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedTag === null
              ? "bg-remax-blue text-white"
              : "bg-remax-slate/10 text-remax-slate hover:bg-remax-slate/20"
          }`}
        >
          All Posts
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTag === tag
                ? "bg-remax-blue text-white"
                : "bg-remax-slate/10 text-remax-slate hover:bg-remax-slate/20"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Post Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {filteredPosts.map((post) => (
          <article
            key={post.slug}
            className="border border-remax-slate/10 rounded-lg p-6 hover:border-remax-blue/30 transition-colors"
          >
            <div className="flex gap-2 mb-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-remax-blue/10 text-remax-blue text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl mb-3">
              <Link href={`/blog/${post.slug}`} className="hover:opacity-80">
                {post.title}
              </Link>
            </h2>
            <p className="text-remax-slate/80 mb-4">{post.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-remax-slate/60">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </time>
              <span>{post.readingTime}</span>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <p className="text-center text-remax-slate/60 py-12">
          No posts found with this tag.
        </p>
      )}
    </div>
  );
}
