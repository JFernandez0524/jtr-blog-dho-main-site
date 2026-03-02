# Code Architecture & Best Practices

This document explains the architectural decisions, coding patterns, and best practices used in this project.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Patterns](#component-patterns)
3. [Code Organization](#code-organization)
4. [Best Practices Summary](#best-practices-summary)
5. [Function Documentation](#function-documentation)
6. [Page Documentation](#page-documentation)

---

## Architecture Overview

### React Server Components (RSC) Architecture

This project uses Next.js 15's App Router with React Server Components as the default rendering strategy.

**Key Principles:**

1. **Server Components by Default**
   - All components are Server Components unless marked with `"use client"`
   - Server Components can fetch data directly without APIs
   - Better performance and SEO

2. **Client Components Only When Needed**
   - Used for interactivity (forms, buttons with state)
   - Used for browser APIs (window, document)
   - Used for React hooks (useState, useEffect)

3. **Component Composition**
   - Server Components can import Client Components
   - Client Components CANNOT import Server Components
   - Pass Server Components as children to Client Components

**Example:**
```typescript
// ✅ CORRECT: Server Component imports Client Component
// app/page.tsx (Server Component)
import ContactForm from "@/components/ContactForm"; // Client Component

export default function Page() {
  return (
    <div>
      <h1>Contact Us</h1>
      <ContactForm /> {/* Client Component */}
    </div>
  );
}

// ❌ WRONG: Client Component imports Server Component
// components/ClientWrapper.tsx
"use client";
import ServerComponent from "./ServerComponent"; // ERROR!
```

---

## Component Patterns

### 1. Single Responsibility Principle

Each component does ONE thing well.

**✅ Good Example:**
```typescript
// components/BlogPostCard.tsx
interface BlogPostCardProps {
  post: PostMetadata;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="border rounded-lg p-4">
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <time>{post.date}</time>
    </article>
  );
}
```

**❌ Bad Example:**
```typescript
// DON'T DO THIS - Component does too much
export default function BlogSection() {
  // Fetches data
  const posts = getAllPosts();
  
  // Filters data
  const filtered = posts.filter(...);
  
  // Sorts data
  const sorted = filtered.sort(...);
  
  // Renders everything
  return <div>...</div>;
}
```

### 2. Composition Over Configuration

Use `children` prop for flexibility instead of many props.

**✅ Good Example:**
```typescript
// components/PillarLayout.tsx
interface PillarLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function PillarLayout({ title, description, children }: PillarLayoutProps) {
  return (
    <div>
      <header>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <main>{children}</main>
    </div>
  );
}

// Usage:
<PillarLayout title="Title" description="Desc">
  <CustomContent />
  <AnotherComponent />
</PillarLayout>
```

**❌ Bad Example:**
```typescript
// DON'T DO THIS - Too many props
interface PillarLayoutProps {
  title: string;
  description: string;
  content: React.ReactNode;
  sidebar: React.ReactNode;
  footer: React.ReactNode;
  header: React.ReactNode;
  // ... more props
}
```

### 3. Type Safety

Always use TypeScript types and interfaces.

**✅ Good Example:**
```typescript
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
}

function getPost(slug: string): BlogPost {
  // Implementation
}
```

**❌ Bad Example:**
```typescript
// DON'T DO THIS - No types
function getPost(slug) {
  // Implementation
}
```

---

## Code Organization

### 1. Centralized Configuration

All site-wide constants live in `lib/config.ts`.

**Benefits:**
- Single source of truth
- Easy to update
- Type-safe
- No hardcoded values

**Usage:**
```typescript
import { siteConfig } from "@/lib/config";

// Access contact info
const email = siteConfig.contact.email;
const phone = siteConfig.contact.phone;

// Access navigation
const navItems = siteConfig.nav.main;

// Access services
const services = siteConfig.services;
```

### 2. Utility Modules

Shared logic extracted to `lib/` directory.

**Structure:**
```
lib/
├── config.ts           # Site configuration
├── mdx.ts              # Blog post utilities
├── relatedPosts.ts     # Related posts algorithm
└── structuredData.ts   # SEO schema generators
```

**Benefits:**
- DRY (Don't Repeat Yourself)
- Testable
- Reusable
- Maintainable

### 3. Component Organization

Components organized by responsibility.

**Structure:**
```
components/
├── Header.tsx          # Navigation (Server)
├── Footer.tsx          # Footer (Server)
├── BentoGrid.tsx       # Homepage layout (Server)
├── BlogList.tsx        # Blog listing (Server)
├── PillarLayout.tsx    # Page wrapper (Server)
└── ContactForm.tsx     # Form (Client)
```

**Naming Convention:**
- PascalCase for components
- Descriptive names
- One component per file

---

## Best Practices Summary

### ✅ DO

1. **Use Server Components by default**
   ```typescript
   // app/page.tsx
   export default function Page() {
     return <div>Server rendered</div>;
   }
   ```

2. **Mark Client Components explicitly**
   ```typescript
   // components/ContactForm.tsx
   "use client";
   
   export default function ContactForm() {
     const [state, setState] = useState("");
     return <form>...</form>;
   }
   ```

3. **Extract reusable logic to utilities**
   ```typescript
   // lib/formatDate.ts
   export function formatDate(date: string): string {
     return new Date(date).toLocaleDateString();
   }
   ```

4. **Use centralized configuration**
   ```typescript
   import { siteConfig } from "@/lib/config";
   const email = siteConfig.contact.email;
   ```

5. **Type everything**
   ```typescript
   interface Props {
     title: string;
     count: number;
   }
   
   function Component({ title, count }: Props) {
     // ...
   }
   ```

6. **Use async/await for Next.js 15 params**
   ```typescript
   export default async function Page({ 
     params 
   }: { 
     params: Promise<{ slug: string }> 
   }) {
     const { slug } = await params;
     // ...
   }
   ```

### ❌ DON'T

1. **Don't import Server Components into Client Components**
   ```typescript
   // ❌ WRONG
   "use client";
   import ServerComponent from "./ServerComponent";
   ```

2. **Don't use hooks in Server Components**
   ```typescript
   // ❌ WRONG
   export default function ServerComponent() {
     const [state, setState] = useState(""); // ERROR!
   }
   ```

3. **Don't hardcode values**
   ```typescript
   // ❌ WRONG
   const email = "info@example.com";
   
   // ✅ CORRECT
   const email = siteConfig.contact.email;
   ```

4. **Don't repeat code**
   ```typescript
   // ❌ WRONG - Duplicate logic
   function Component1() {
     const formatted = new Date(date).toLocaleDateString();
   }
   function Component2() {
     const formatted = new Date(date).toLocaleDateString();
   }
   
   // ✅ CORRECT - Shared utility
   import { formatDate } from "@/lib/formatDate";
   ```

5. **Don't create components that do too much**
   ```typescript
   // ❌ WRONG - Component does everything
   function BlogPage() {
     // Fetches, filters, sorts, renders
   }
   
   // ✅ CORRECT - Separate concerns
   function BlogPage() {
     const posts = getAllPosts(); // Utility function
     return <BlogList posts={posts} />; // Display component
   }
   ```

---

## Function Documentation

### lib/mdx.ts

#### `getAllPosts()`
Retrieves all blog posts from the content directory.

**Returns:** `PostMetadata[]`

**Behavior:**
- Reads all `.mdx` files from `content/blog/`
- Parses frontmatter with gray-matter
- Calculates reading time
- Sorts by date (newest first)

**Example:**
```typescript
const posts = getAllPosts();
// [{ slug: "post-1", title: "...", date: "2024-01-15", ... }]
```

---

#### `getPostBySlug(slug: string)`
Retrieves a single blog post by its slug.

**Parameters:**
- `slug` (string): Post filename without `.mdx` extension

**Returns:** `Post` (includes content)

**Throws:** Error if post not found

**Example:**
```typescript
const post = getPostBySlug("my-post");
// { slug: "my-post", title: "...", content: "...", ... }
```

---

#### `getPostSlugs()`
Gets all post slugs for static generation.

**Returns:** `string[]`

**Usage:** Used in `generateStaticParams()` for dynamic routes

**Example:**
```typescript
export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}
```

---

### lib/relatedPosts.ts

#### `getRelatedPosts(currentSlug, currentTags, allPosts, limit)`
Finds related blog posts based on tag similarity.

**Parameters:**
- `currentSlug` (string): Current post slug to exclude
- `currentTags` (string[]): Tags of current post
- `allPosts` (PostMetadata[]): All available posts
- `limit` (number): Maximum results (default: 3)

**Returns:** `PostMetadata[]`

**Algorithm:**
1. Filter out current post
2. Score each post by number of matching tags
3. Sort by score (highest first)
4. If scores equal, sort by date (newest first)
5. Return top N posts

**Example:**
```typescript
const related = getRelatedPosts(
  "current-post",
  ["real-estate", "foreclosure"],
  allPosts,
  3
);
// Returns up to 3 posts with matching tags
```

---

### lib/structuredData.ts

#### `generateOrganizationSchema()`
Generates JSON-LD Organization schema for homepage.

**Returns:** JSON-LD object

**Schema Type:** `Organization`

**Includes:**
- Business name
- Contact information
- Address
- Social media profiles

**Example:**
```typescript
const schema = generateOrganizationSchema();
// { "@context": "https://schema.org", "@type": "Organization", ... }
```

---

#### `generateArticleSchema(post)`
Generates JSON-LD Article schema for blog posts.

**Parameters:**
- `post` (Post): Blog post object

**Returns:** JSON-LD object

**Schema Type:** `Article`

**Includes:**
- Headline
- Author
- Publication date
- Description
- Keywords (tags)

**Example:**
```typescript
const schema = generateArticleSchema(post);
// { "@context": "https://schema.org", "@type": "Article", ... }
```

---

#### `generateServiceSchema(service)`
Generates JSON-LD Service schema for pillar pages.

**Parameters:**
- `service` (object): Service details

**Returns:** JSON-LD object

**Schema Type:** `Service`

**Includes:**
- Service name
- Description
- Provider information
- Area served

**Example:**
```typescript
const schema = generateServiceSchema({
  name: "Inherited Property Solutions",
  description: "Expert help with inherited properties in NJ"
});
```

---

### lib/config.ts

#### `siteConfig`
Centralized site configuration object.

**Type:** `const` object (immutable)

**Structure:**
```typescript
{
  name: string;
  title: string;
  description: string;
  url: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    phoneDisplay: string;
    address: { ... }
  };
  business: { ... };
  social: { ... };
  nav: { ... };
  services: [ ... ];
  seo: { ... };
}
```

**Usage:**
```typescript
import { siteConfig } from "@/lib/config";

// Access any site constant
const email = siteConfig.contact.email;
const navItems = siteConfig.nav.main;
```

---

## Page Documentation

### app/page.tsx (Homepage)
**Type:** Server Component  
**Purpose:** Main landing page with hero and blog preview

**Features:**
- Bento grid layout
- Latest blog posts
- Service highlights
- Organization schema

**Data Fetching:**
```typescript
const allPosts = getAllPosts();
const latestPosts = allPosts.slice(0, 2);
```

---

### app/blog/page.tsx (Blog Index)
**Type:** Server Component  
**Purpose:** List all blog posts with tag filtering

**Features:**
- All posts display
- Tag-based filtering
- Reading time
- Responsive grid

**Data Fetching:**
```typescript
const posts = getAllPosts();
```

---

### app/blog/[slug]/page.tsx (Blog Post)
**Type:** Server Component (Dynamic Route)  
**Purpose:** Individual blog post display

**Features:**
- MDX content rendering
- Related posts
- Article schema
- Social sharing metadata

**Data Fetching:**
```typescript
export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const relatedPosts = getRelatedPosts(slug, post.tags, allPosts, 3);
  // ...
}
```

**Static Generation:**
```typescript
export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}
```

---

### app/contact/page.tsx (Contact Page)
**Type:** Server Component (imports Client Component)  
**Purpose:** Contact form page

**Features:**
- Contact form (Client Component)
- Contact information display
- Service schema

**Pattern:**
```typescript
// Server Component
export default function ContactPage() {
  return (
    <div>
      <h1>Contact</h1>
      <ContactForm /> {/* Client Component */}
    </div>
  );
}
```

---

### app/inherited-property/page.tsx (Pillar Page)
**Type:** Server Component  
**Purpose:** Inherited property service page

**Features:**
- Service description
- Benefits list
- Process steps
- CTA section
- Service schema

**Pattern:**
```typescript
export default function InheritedPropertyPage() {
  return (
    <PillarLayout title="..." description="...">
      {/* Page content */}
    </PillarLayout>
  );
}
```

---

### app/api/contact/route.ts (API Route)
**Type:** API Route Handler  
**Purpose:** Handle contact form submissions

**Method:** POST

**Flow:**
1. Validate request body
2. Save to DynamoDB
3. Trigger Lambda for GHL sync
4. Return success/error response

**Request Body:**
```typescript
{
  name: string;
  email: string;
  phone: string;
  message: string;
  serviceType: string;
  source: string;
  referrer: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  submissionId?: string;
  ghlSyncStatus?: string;
  error?: string;
}
```

---

### app/api/og/route.tsx (OG Image Generator)
**Type:** API Route Handler  
**Purpose:** Generate dynamic Open Graph images

**Method:** GET

**Query Parameters:**
- `title` (required): Image title
- `type` (optional): "blog" | "page"

**Returns:** PNG image (1200x630)

**Technology:** @vercel/og (Satori)

---

### app/sitemap.ts (Dynamic Sitemap)
**Type:** Sitemap Generator  
**Purpose:** Generate XML sitemap for SEO

**Includes:**
- Homepage
- Pillar pages
- Blog index
- All blog posts
- Contact page

**Priority Levels:**
- Homepage: 1.0
- Pillar pages: 0.9
- Blog posts: 0.7
- Other pages: 0.5

---

### app/robots.ts (Robots.txt)
**Type:** Robots.txt Generator  
**Purpose:** Control search engine crawling

**Configuration:**
- Allow all user agents
- Disallow `/admin/*`
- Disallow `/api/*`
- Sitemap URL included

---

## Component Documentation

### components/Header.tsx
**Type:** Server Component  
**Purpose:** Site navigation with RE/MAX branding

**Features:**
- RE/MAX logo with brand compliance
- Navigation menu
- Contact CTA button
- Responsive design

**Data Source:** `siteConfig.nav.main`

---

### components/Footer.tsx
**Type:** Server Component  
**Purpose:** Site footer with links and social media

**Features:**
- Service links
- Contact information
- Social media icons
- Copyright notice
- RE/MAX branding

**Data Source:** `siteConfig`

---

### components/ContactForm.tsx
**Type:** Client Component  
**Purpose:** Interactive contact form

**State:**
```typescript
{
  formData: {
    name: string;
    email: string;
    phone: string;
    message: string;
    serviceType: string;
  };
  status: "idle" | "loading" | "success" | "error";
  errorMessage: string;
}
```

**Features:**
- Client-side validation
- Loading states
- Success/error messages
- Form reset on success

**API Integration:** POST `/api/contact`

---

### components/BentoGrid.tsx
**Type:** Server Component  
**Purpose:** Asymmetric grid layout for homepage

**Props:**
```typescript
{
  posts: PostMetadata[];
}
```

**Features:**
- Responsive grid
- Featured blog posts
- Service highlights
- Visual hierarchy

---

### components/BlogList.tsx
**Type:** Server Component  
**Purpose:** Display list of blog posts

**Props:**
```typescript
{
  posts: PostMetadata[];
  selectedTag?: string;
}
```

**Features:**
- Grid layout
- Tag filtering
- Reading time
- Excerpt display

---

### components/PillarLayout.tsx
**Type:** Server Component  
**Purpose:** Reusable layout for pillar pages

**Props:**
```typescript
{
  title: string;
  description: string;
  children: React.ReactNode;
}
```

**Features:**
- Consistent header
- Content wrapper
- CTA section
- Responsive design

---

## Summary

This codebase follows modern React and Next.js best practices:

1. ✅ Server Components by default
2. ✅ Client Components only when needed
3. ✅ Single Responsibility Principle
4. ✅ DRY (Don't Repeat Yourself)
5. ✅ Type Safety with TypeScript
6. ✅ Centralized Configuration
7. ✅ Utility Modules for shared logic
8. ✅ Composition over Configuration
9. ✅ Proper async/await patterns
10. ✅ SEO optimization

All code is production-ready, maintainable, and follows industry standards.
