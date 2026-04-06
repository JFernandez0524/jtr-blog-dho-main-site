import { MetadataRoute } from "next";
import { getAllPosts, getAllLocations } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.josetherealtor.com";
  const posts = getAllPosts();
  const locations = getAllLocations();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date("2026-04-01"), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/inherited-property-new-jersey`, lastModified: new Date("2026-04-01"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/foreclosure`, lastModified: new Date("2026-04-01"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/sell-as-is`, lastModified: new Date("2026-04-01"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date("2026-04-05"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date("2026-03-17"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date("2026-03-17"), changeFrequency: "monthly", priority: 0.7 },
  ];

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const locationPages: MetadataRoute.Sitemap = locations.map((loc) => ({
    url: `${baseUrl}/${loc.slug}`,
    lastModified: new Date("2026-04-05"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...locationPages];
}
