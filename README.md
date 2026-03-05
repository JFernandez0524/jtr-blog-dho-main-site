# Jose Fernandez Real Estate Authority Site

Professional content-led real estate authority website for Jose Fernandez, a New Jersey real estate specialist focusing on inherited properties, foreclosures, and as-is home sales.

**Live Site:** [Coming Soon]  
**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, AWS Amplify Gen 2

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Component Documentation](#component-documentation)
- [Best Practices](#best-practices)

---

## Features

### Core Functionality
- **3 Pillar Service Pages:** Inherited Property, Foreclosure Prevention, Sell As-Is
- **MDX Blog System:** SEO-optimized blog with tag-based filtering and related posts
- **Lead Capture:** Contact form with DynamoDB storage and GoHighLevel CRM sync
- **Admin Dashboard:** Lead management interface at `/admin/leads`
- **SEO Optimization:** Dynamic OG images, JSON-LD structured data, sitemap, robots.txt

### Technical Features
- **Server-Side Rendering:** Next.js 15 App Router with React Server Components
- **Type Safety:** Full TypeScript implementation
- **Centralized Config:** Single source of truth for site-wide constants
- **AWS Integration:** Amplify Gen 2 backend with DynamoDB and Lambda
- **Brand Compliance:** RE/MAX 2025 brand standards implementation

---

## Architecture

### Design Principles

1. **Server Components First:** All pages are React Server Components by default
2. **Client Components Only When Needed:** Interactive components marked with `"use client"`
3. **Single Responsibility:** Each component/function does one thing well
4. **DRY (Don't Repeat Yourself):** Shared logic extracted to utility modules
5. **Configuration Over Code:** Site constants in `lib/config.ts`

### Tech Stack

```
Frontend:
├── Next.js 15.5.12 (App Router)
├── React 19 (Server Components)
├── TypeScript 5
└── Tailwind CSS 3.4.19

Backend:
├── AWS Amplify Gen 2
├── Amazon DynamoDB
├── AWS Lambda
└── Amazon Cognito (Auth)

Content:
├── MDX (next-mdx-remote)
├── Gray Matter (frontmatter)
└── Reading Time
```

---

## Getting Started

### Prerequisites

- Node.js 20+ (required for AWS SDK v3)
- npm 9+
- AWS Account (for deployment)
- GoHighLevel Account (for CRM integration)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd jtr-blog-dho-main-site

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables

Create `.env.local`:

```env
# Required for GoHighLevel integration
GHL_API_TOKEN=your_ghl_api_token
GHL_LOCATION_ID=your_ghl_location_id

# Required for Google OAuth (Admin Authentication)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Google OAuth Setup for Admin Panel

The admin panel at `/admin/leads` uses Google OAuth for authentication via AWS Cognito.

**Step 1: Deploy Amplify Backend**
```bash
npx ampx sandbox
```

**Step 2: Get Cognito Domain**
1. Go to AWS Console → Amazon Cognito → User Pools
2. Find your user pool (will have "amplify" in the name)
3. Go to "App integration" tab → "Domain" section
4. Note the Cognito domain (format: `https://amplifyxxxxx.auth.us-east-1.amazoncognito.com`)

**Step 3: Create Google OAuth Credentials**
1. Navigate to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select a project
3. Enable Google+ API (if not enabled)
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Application type: "Web application"
6. Authorized JavaScript origins: `https://<your-cognito-domain>.auth.<region>.amazoncognito.com`
7. Authorized redirect URIs: `https://<your-cognito-domain>.auth.<region>.amazoncognito.com/oauth2/idpresponse`
8. Save Client ID and Client Secret

**Step 4: Update Environment Variables**
Add the Google credentials to `.env.local`:
```env
GOOGLE_CLIENT_ID=your_client_id_from_google
GOOGLE_CLIENT_SECRET=your_client_secret_from_google
```

**Step 5: Redeploy Backend**
```bash
npx ampx sandbox
```

**Troubleshooting:**
- **"Invalid redirect URI"**: Ensure the redirect URI in Google Console exactly matches your Cognito domain
- **"Client ID not found"**: Verify environment variables are set correctly and backend is redeployed
- **"Access denied"**: Check that the Google OAuth app is not in testing mode or add your email to test users

---

## Project Structure

```
jtr-blog-dho-main-site/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Server Component)
│   ├── page.tsx                  # Homepage (Server Component)
│   ├── loading.tsx               # Loading UI
│   ├── globals.css               # Global styles
│   │
│   ├── blog/                     # Blog section
│   │   ├── page.tsx              # Blog index (Server Component)
│   │   ├── [slug]/page.tsx       # Dynamic blog post (Server Component)
│   │   └── loading.tsx           # Blog loading state
│   │
│   ├── inherited-property/       # Pillar page
│   │   └── page.tsx              # (Server Component)
│   ├── foreclosure/              # Pillar page
│   │   └── page.tsx              # (Server Component)
│   ├── sell-as-is/               # Pillar page
│   │   └── page.tsx              # (Server Component)
│   │
│   ├── contact/                  # Contact page
│   │   └── page.tsx              # (Server Component with Client Form)
│   │
│   ├── admin/                    # Admin section
│   │   └── leads/page.tsx        # Lead management (Client Component)
│   │
│   ├── api/                      # API routes
│   │   ├── contact/route.ts      # Form submission handler
│   │   ├── og/route.tsx          # Dynamic OG image generation
│   │   └── env-check/route.ts   # Environment validation
│   │
│   ├── robots.ts                 # Dynamic robots.txt
│   └── sitemap.ts                # Dynamic sitemap.xml
│
├── components/                   # React components
│   ├── Header.tsx                # Navigation (Server Component)
│   ├── Footer.tsx                # Footer (Server Component)
│   ├── BentoGrid.tsx             # Homepage layout (Server Component)
│   ├── BlogList.tsx              # Blog listing (Server Component)
│   ├── PillarLayout.tsx          # Pillar page wrapper (Server Component)
│   └── ContactForm.tsx           # Contact form (Client Component)
│
├── lib/                          # Utility modules
│   ├── config.ts                 # Site configuration (single source of truth)
│   ├── mdx.ts                    # MDX utilities (getAllPosts, getPostBySlug)
│   ├── relatedPosts.ts           # Related posts algorithm
│   └── structuredData.ts         # JSON-LD schema generators
│
├── content/                      # Content files
│   └── blog/                     # MDX blog posts
│       ├── *.mdx                 # Blog post files
│
├── amplify/                      # AWS Amplify backend
│   ├── backend.ts                # Backend configuration
│   ├── data/resource.ts          # DynamoDB models
│   ├── auth/resource.ts          # Cognito auth
│   └── functions/                # Lambda functions
│       └── ghl-contact/          # GoHighLevel sync function
│           ├── handler.ts        # Lambda handler
│           └── resource.ts       # Function config
│
├── public/                       # Static assets
├── .env.local                    # Local environment variables (gitignored)
├── amplify_outputs.json          # Amplify config (auto-generated)
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
└── next.config.js                # Next.js config
```

---

## Configuration

### Centralized Site Configuration

All site-wide constants are in `lib/config.ts`:

```typescript
import { siteConfig } from "@/lib/config";

// Access contact info
siteConfig.contact.email
siteConfig.contact.phone

// Access navigation
siteConfig.nav.main

// Access services
siteConfig.services
```

**To update site information:** Edit `lib/config.ts` - changes apply everywhere automatically.

See `HOW_TO_UPDATE_INFO.md` for detailed instructions.

---

## Development Guide

### Adding a New Page

1. Create page in `app/` directory
2. Use Server Component by default
3. Add client interactivity only when needed

```typescript
// app/new-page/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
};

export default function NewPage() {
  return <div>Content</div>;
}
```

### Adding a New Blog Post

1. Create MDX file in `content/blog/`
2. Add frontmatter:

```yaml
---
title: "Post Title"
description: "SEO description"
date: "2024-01-15"
author: "Jose Fernandez"
tags: ["tag1", "tag2"]
image: "/images/post-image.jpg"
---

Your content here...
```

3. File automatically appears in blog index

### Creating a New Component

**Server Component (default):**
```typescript
// components/MyComponent.tsx
export default function MyComponent() {
  return <div>Server-rendered content</div>;
}
```

**Client Component (when needed):**
```typescript
// components/MyClientComponent.tsx
"use client";

import { useState } from "react";

export default function MyClientComponent() {
  const [state, setState] = useState("");
  return <div>Interactive content</div>;
}
```

### Adding a New Utility Function

```typescript
// lib/myUtility.ts

/**
 * Description of what this function does
 * @param param1 - Description
 * @returns Description
 */
export function myUtility(param1: string): string {
  // Implementation
  return result;
}
```

---

## Deployment

### Local Development

```bash
npm run dev
```

### Amplify Sandbox (Backend Testing)

```bash
# Deploy backend to AWS sandbox
npx ampx sandbox --identifier jtr

# This creates:
# - DynamoDB tables
# - Lambda functions
# - Generates amplify_outputs.json

# Delete sandbox when done
npx ampx sandbox delete --identifier jtr
```

### Production Deployment

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push
   ```

2. **AWS Amplify Console:**
   - Connect GitHub repository
   - Configure build settings (auto-detected)
   - Add environment variables:
     - `GHL_API_TOKEN`
     - `GHL_LOCATION_ID`
   - Deploy

3. **Post-Deployment:**
   - Configure custom domain
   - Submit sitemap to Google Search Console
   - Test contact form end-to-end

---

## API Documentation

### POST /api/contact

Submit contact form data.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I need help with...",
  "serviceType": "inherited-property",
  "source": "https://example.com/contact",
  "referrer": "https://google.com"
}
```

**Response:**
```json
{
  "success": true,
  "submissionId": "abc123",
  "ghlSyncStatus": "SYNCED"
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

### GET /api/og

Generate dynamic Open Graph images.

**Query Parameters:**
- `title` (required): Image title
- `type` (optional): "blog" | "page"

**Response:** PNG image (1200x630)

### GET /api/env-check

Validate environment variables.

**Response:**
```json
{
  "ghlConfigured": true,
  "siteUrl": "https://example.com"
}
```

---

## Component Documentation

### Server Components

#### Header
**Location:** `components/Header.tsx`  
**Purpose:** Site navigation with RE/MAX branding  
**Props:** None (uses `siteConfig`)

#### Footer
**Location:** `components/Footer.tsx`  
**Purpose:** Site footer with links and social media  
**Props:** None (uses `siteConfig`)

#### BentoGrid
**Location:** `components/BentoGrid.tsx`  
**Purpose:** Asymmetric grid layout for homepage  
**Props:**
- `posts`: Array of blog posts to display

#### BlogList
**Location:** `components/BlogList.tsx`  
**Purpose:** Display list of blog posts with filtering  
**Props:**
- `posts`: Array of blog posts
- `selectedTag`: Optional tag filter

#### PillarLayout
**Location:** `components/PillarLayout.tsx`  
**Purpose:** Reusable layout for pillar pages  
**Props:**
- `title`: Page title
- `description`: Page description
- `children`: Page content

### Client Components

#### ContactForm
**Location:** `components/ContactForm.tsx`  
**Purpose:** Interactive contact form with validation  
**Props:** None  
**State:**
- Form data (name, email, phone, message, serviceType)
- Submission status (idle, loading, success, error)

**Features:**
- Client-side validation
- Loading states
- Error handling
- Success feedback

---

## Utility Modules

### lib/config.ts
**Purpose:** Centralized site configuration  
**Exports:**
- `siteConfig`: Site-wide constants
- Type definitions for config objects

**Usage:**
```typescript
import { siteConfig } from "@/lib/config";
console.log(siteConfig.contact.email);
```

### lib/mdx.ts
**Purpose:** MDX blog post utilities  
**Functions:**

#### `getAllPosts()`
Returns all blog posts sorted by date (newest first).

**Returns:** `BlogPost[]`

#### `getPostBySlug(slug: string)`
Get single blog post by slug.

**Parameters:**
- `slug`: Post filename without extension

**Returns:** `BlogPost`

#### `getPostSlugs()`
Get all post slugs for static generation.

**Returns:** `string[]`

### lib/relatedPosts.ts
**Purpose:** Related posts recommendation algorithm  
**Functions:**

#### `getRelatedPosts(currentSlug, tags, allPosts, limit)`
Find related posts based on tag similarity.

**Parameters:**
- `currentSlug`: Current post slug
- `tags`: Current post tags
- `allPosts`: All available posts
- `limit`: Max number of results

**Returns:** `BlogPost[]`

**Algorithm:**
- Scores posts by shared tags
- Excludes current post
- Returns top N by score

### lib/structuredData.ts
**Purpose:** JSON-LD structured data generators  
**Functions:**

#### `generateOrganizationSchema()`
Generate Organization schema for homepage.

**Returns:** JSON-LD object

#### `generatePersonSchema()`
Generate Person schema for about/contact pages.

**Returns:** JSON-LD object

#### `generateArticleSchema(post)`
Generate Article schema for blog posts.

**Parameters:**
- `post`: Blog post object

**Returns:** JSON-LD object

#### `generateServiceSchema(service)`
Generate Service schema for pillar pages.

**Parameters:**
- `service`: Service details object

**Returns:** JSON-LD object

---

## Best Practices

### React Server Components

✅ **DO:**
- Use Server Components by default
- Fetch data directly in Server Components
- Import Client Components into Server Components
- Keep interactive logic in Client Components

❌ **DON'T:**
- Import Server Components into Client Components
- Use hooks in Server Components
- Add event handlers to Server Components

### Component Design

✅ **Single Responsibility:**
```typescript
// Good: Component does one thing
function BlogPostCard({ post }) {
  return <article>...</article>;
}

// Bad: Component does too much
function BlogSection() {
  // Fetches data, filters, sorts, renders...
}
```

✅ **Composition Over Props:**
```typescript
// Good: Use children for flexibility
<PillarLayout title="Title">
  <CustomContent />
</PillarLayout>

// Bad: Too many props
<PillarLayout title="Title" content={...} sidebar={...} />
```

### Code Organization

✅ **Extract Utilities:**
```typescript
// Good: Reusable utility
// lib/formatDate.ts
export function formatDate(date: string) { ... }

// Bad: Duplicate logic in components
function Component1() {
  const formatted = new Date(date).toLocaleDateString(...);
}
function Component2() {
  const formatted = new Date(date).toLocaleDateString(...);
}
```

✅ **Centralize Configuration:**
```typescript
// Good: Use config
import { siteConfig } from "@/lib/config";
const email = siteConfig.contact.email;

// Bad: Hardcode values
const email = "info@example.com";
```

### TypeScript

✅ **Type Everything:**
```typescript
// Good: Explicit types
interface BlogPost {
  title: string;
  slug: string;
  date: string;
}

function getPost(slug: string): BlogPost { ... }

// Bad: Implicit any
function getPost(slug) { ... }
```

### Performance

✅ **Optimize Images:**
```typescript
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={isAboveFold}
/>
```

✅ **Use Loading States:**
```typescript
// app/page/loading.tsx
export default function Loading() {
  return <Skeleton />;
}
```

---

## Testing Checklist

### Pre-Deployment
- [ ] All pages render without errors
- [ ] Navigation works across all routes
- [ ] Blog posts display correctly
- [ ] Contact form validation works
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Keyboard navigation functional
- [ ] Screen reader compatibility
- [ ] TypeScript compiles without errors
- [ ] No console errors in browser

### Post-Deployment
- [ ] Contact form submits to DynamoDB
- [ ] GoHighLevel sync completes
- [ ] Admin panel shows submissions
- [ ] OG images generate correctly
- [ ] Sitemap accessible
- [ ] Robots.txt configured
- [ ] Performance metrics acceptable (Lighthouse)
- [ ] SEO metadata correct

---

## Troubleshooting

### Build Errors

**"Module not found"**
```bash
npm install
```

**"Type error in params"**
- Ensure Next.js 15 async params pattern:
```typescript
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
}
```

### Runtime Errors

**"Cannot read property of undefined"**
- Check `amplify_outputs.json` exists
- Run `npx ampx sandbox` to generate

**"GHL sync failed"**
- Verify environment variables set
- Check Lambda function logs in AWS CloudWatch

---

## Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [AWS Amplify Gen 2 Documentation](https://docs.amplify.aws/)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [RE/MAX Brand Standards](https://www.remax.com/brand-standards)
- [GoHighLevel API Documentation](https://highlevel.stoplight.io/)

---

## License

MIT-0 License - See LICENSE file

---

## Support

For questions or issues, contact the development team or refer to `PROJECT_CONTEXT.md` for detailed technical documentation.
