import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentDirectory = path.join(process.cwd(), "content/blog");

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  author: string;
  readingTime: string;
}

export interface Post extends PostMetadata {
  content: string;
}

export function getAllPosts(): PostMetadata[] {
  const files = fs.readdirSync(contentDirectory);
  
  const posts = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const fullPath = path.join(contentDirectory, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const stats = readingTime(content);

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt || data.description || "",
        tags: data.tags || [],
        author: data.author || "Jose Fernandez",
        readingTime: stats.text,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(contentDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt || data.description || "",
    tags: data.tags || [],
    author: data.author || "Jose Fernandez",
    readingTime: stats.text,
    content,
  };
}

export function getPostSlugs(): string[] {
  const files = fs.readdirSync(contentDirectory);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

const locationsDirectory = path.join(process.cwd(), "content/locations");

export interface LocationMetadata {
  slug: string;
  town: string;
  county: string;
  title: string;
  metaDescription: string;
  heroHeading: string;
  heroSubtext: string;
  youtubeId?: string;
}

export interface Location extends LocationMetadata {
  content: string;
}

export function getAllLocations(): LocationMetadata[] {
  const files = fs.readdirSync(locationsDirectory);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { data } = matter(fs.readFileSync(path.join(locationsDirectory, file), "utf8"));
      return { slug, town: data.town, county: data.county, title: data.title, metaDescription: data.metaDescription, heroHeading: data.heroHeading, heroSubtext: data.heroSubtext, youtubeId: data.youtubeId };
    });
}

export function getLocationBySlug(slug: string): Location {
  const fullPath = path.join(locationsDirectory, `${slug}.mdx`);
  const { data, content } = matter(fs.readFileSync(fullPath, "utf8"));
  return { slug, town: data.town, county: data.county, title: data.title, metaDescription: data.metaDescription, heroHeading: data.heroHeading, heroSubtext: data.heroSubtext, youtubeId: data.youtubeId, content };
}

export function getLocationSlugs(): string[] {
  if (!fs.existsSync(locationsDirectory)) return [];
  return fs.readdirSync(locationsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}
