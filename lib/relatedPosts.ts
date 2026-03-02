import { PostMetadata } from "./mdx";

export function getRelatedPosts(
  currentSlug: string,
  currentTags: string[],
  allPosts: PostMetadata[],
  limit: number = 3
): PostMetadata[] {
  // Filter out current post
  const otherPosts = allPosts.filter((post) => post.slug !== currentSlug);

  // Score posts by number of matching tags
  const scoredPosts = otherPosts.map((post) => {
    const matchingTags = post.tags.filter((tag) => currentTags.includes(tag));
    return {
      post,
      score: matchingTags.length,
    };
  });

  // Sort by score (most matching tags first), then by date
  scoredPosts.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
  });

  // Return top N posts
  return scoredPosts.slice(0, limit).map((item) => item.post);
}
