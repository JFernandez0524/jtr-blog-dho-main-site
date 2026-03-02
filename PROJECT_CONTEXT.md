# Project Context: Jose Fernandez Real Estate Authority Site

## Project Overview
Professional content-led "Resume & Authority" hub for Jose Fernandez, a New Jersey real estate specialist. Built with Next.js 15 and AWS Amplify Gen 2.

**Live Site:** TBD (pending deployment)  
**Tech Stack:** Next.js 15.5.12, React 19, TypeScript, Tailwind CSS 3.4.19, AWS Amplify Gen 2

---

## Core Features

### Content Architecture
- **3 Pillar Pages:** Inherited Property, Foreclosure, Sell-As-Is
- **MDX Blog System:** Flat structure `/blog/[slug]` with local content storage
- **Homepage:** Bento Box grid layout with dynamic content
- **Navigation:** Logo, Home, 3 Pillars, Blog, Contact

### Design System
- **RE/MAX Brand Standards 2025:**
  - Primary Blue: `#003DA5`
  - Primary Red: `#E11B22`
  - Neutral Slate: `#63666A`
  - Fonts: Arial, Gotham, Akzidenz Grotesk
  - Mandatory clear space: `0.5em` around logo
  - No ® symbol usage

### Centralized Configuration
- **Single Source of Truth:** `lib/config.ts`
- **Contains:** Contact info, business details, navigation, social media links, service types
- **Benefits:** Update once, changes apply site-wide
- **Documentation:** `HOW_TO_UPDATE_INFO.md` for easy updates

### Contact Form Integration
- **Architecture:** DynamoDB-first with GHL sync
- **Flow:**
  1. User submits form → `/api/contact`
  2. Write to DynamoDB (ContactSubmission) - ALWAYS succeeds
  3. Call Lambda function → GHL API sync
  4. 3-retry exponential backoff on failures
  5. Update DynamoDB with sync status
- **Admin Panel:** `/admin/leads` for lead management

### SEO & Performance
- Dynamic OG images via Satori (`/api/og`)
- JSON-LD structured data (Person, Article, Service, Organization)
- Dynamic sitemap with priorities
- robots.txt with admin/api exclusions
- Loading states and accessibility features
- Social media integration (Facebook, Instagram, LinkedIn, YouTube, Zillow)

---

## Technical Architecture

### Frontend (Next.js 15)
```
/app
  /page.tsx                    # Homepage with Bento Grid
  /layout.tsx                  # Root layout with Header/Footer
  /blog
    /page.tsx                  # Blog index with tag filtering
    /[slug]/page.tsx           # Dynamic blog posts
  /inherited-property          # Pillar page
  /foreclosure                 # Pillar page
  /sell-as-is                  # Pillar page
  /contact/page.tsx            # Contact form
  /admin/leads/page.tsx        # Lead management
  /api
    /contact/route.ts          # Form submission handler
    /og/route.tsx              # OG image generation
    /env-check/route.ts        # Environment validation

/components
  Header.tsx                   # RE/MAX branded navigation
  Footer.tsx                   # RE/MAX branded footer
  BentoGrid.tsx                # Asymmetric homepage layout
  ContactForm.tsx              # Form with validation
  PillarLayout.tsx             # Reusable pillar page layout
  BlogList.tsx                 # Blog post listing

/lib
  config.ts                    # Centralized site configuration
  mdx.ts                       # MDX utilities (getAllPosts, getPostBySlug)
  relatedPosts.ts              # Tag-based recommendation algorithm
  structuredData.ts            # JSON-LD schema generators

/content/blog
  *.mdx                        # Blog post content files
```

### Backend (AWS Amplify Gen 2)
```
/amplify
  /backend.ts                  # Backend configuration
  /data/resource.ts            # Data models
  /auth/resource.ts            # Cognito auth (default)
  /functions/ghl-contact
    /handler.ts                # Lambda function for GHL sync
    /resource.ts               # Function configuration
```

### Data Models

**ContactSubmission** (Primary)
- name, email, phone, message, serviceType
- source, pageUrl, referrer, submittedAt
- ghlSyncStatus: "PENDING" | "SYNCED" | "FAILED"
- ghlContactId, ghlErrorMessage

**Lead** (Legacy)
- name, email, phone, serviceType enum

**Project** (Portfolio - Future Use)
- title, description, imageUrl, projectUrl
- tags, startDate, endDate

---

## Environment Variables

### Required for GHL Integration
```env
GHL_API_TOKEN=<your_ghl_api_token>
GHL_LOCATION_ID=<your_ghl_location_id>
```

### Optional
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Setup Locations
- **Local Development:** `.env.local` (gitignored)
- **Amplify Sandbox:** `amplify/.env`
- **Production:** AWS Systems Manager Parameter Store

---

## GoHighLevel API Integration

### Endpoint
```
POST https://services.leadconnectorhq.com/contacts/
```

### Headers
```
Authorization: Bearer {GHL_API_TOKEN}
Version: 2021-07-28
Content-Type: application/json
```

### Payload
```json
{
  "locationId": "{GHL_LOCATION_ID}",
  "email": "user@example.com",
  "phone": "+1234567890",
  "name": "John Doe",
  "customFields": [
    {
      "key": "service_interest",
      "field_value": "Inherited Property"
    },
    {
      "key": "message",
      "field_value": "User's message"
    },
    {
      "key": "page_url",
      "field_value": "https://example.com/contact"
    },
    {
      "key": "referrer",
      "field_value": "https://google.com"
    }
  ]
}
```

### Retry Logic
- 3 attempts with exponential backoff (1s, 2s, 4s)
- Errors logged to DynamoDB
- Manual retry available in admin panel

---

## Blog System

### MDX Features
- **Parser:** next-mdx-remote
- **Metadata:** gray-matter for frontmatter
- **Reading Time:** reading-time package
- **Related Posts:** Tag-based scoring algorithm

### Frontmatter Schema
```yaml
---
title: "Post Title"
description: "Post description for SEO"
date: "2024-01-15"
author: "Jose Fernandez"
tags: ["tag1", "tag2"]
image: "/images/post-image.jpg"
---
```

### Content Storage
- Location: `/content/blog/*.mdx`
- Flat structure (no nested folders)
- File naming: `kebab-case-slug.mdx`

---

## Deployment

### Local Development
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### Amplify Sandbox
```bash
npx ampx sandbox --identifier jtr
# Creates DynamoDB tables, Lambda functions
# Generates amplify_outputs.json
```

### Production Deployment
1. Push to GitHub
2. Connect to AWS Amplify Console
3. Configure build settings for Next.js 15 SSG
4. Set environment variables
5. Deploy
6. Submit sitemap to Google Search Console

---

## Key Dependencies

### Core
- `next@15.5.12` - Framework
- `react@19` - UI library
- `typescript@5` - Type safety
- `tailwindcss@3.4.19` - Styling

### Content
- `next-mdx-remote` - MDX rendering
- `gray-matter` - Frontmatter parsing
- `reading-time` - Reading time calculation

### SEO
- `@vercel/og` - Dynamic OG images
- Built-in Next.js metadata API

### Backend
- `@aws-amplify/backend` - Amplify Gen 2
- AWS SDK (included in Lambda runtime)

---

## Brand Compliance Checklist

### RE/MAX Logo Usage
- ✅ Clear space: 0.5em on all sides
- ✅ No ® symbol
- ✅ Proper color usage (blue or red on white)
- ✅ Minimum size maintained
- ✅ No distortion or modification

### Color Usage
- ✅ Primary Blue (#003DA5) for trust/authority
- ✅ Primary Red (#E11B22) for CTAs/urgency
- ✅ Neutral Slate (#63666A) for body text
- ✅ Sufficient contrast ratios (WCAG AA)

### Typography
- ✅ Arial as primary font (RE/MAX standard)
- ✅ Inter as fallback for web readability
- ✅ Consistent hierarchy (h1-h6)

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

### Post-Sandbox Deployment
- [ ] Contact form submits to DynamoDB
- [ ] GHL sync completes successfully
- [ ] Admin panel shows submissions
- [ ] Retry logic works for failed syncs
- [ ] Environment variables loaded correctly

### Production
- [ ] All routes accessible
- [ ] OG images generate correctly
- [ ] Sitemap accessible at /sitemap.xml
- [ ] robots.txt configured properly
- [ ] Performance metrics acceptable (Lighthouse)
- [ ] SEO metadata correct on all pages

---

## Known Issues & Limitations

### Current
- ✅ All TypeScript errors resolved
- ✅ Amplify Gen 2 enum limitations handled (using strings)
- ✅ Environment variables configured
- ✅ Centralized configuration system implemented
- ✅ Social media integration complete

### Recent Updates (2026-03-02)
- ✅ Created `lib/config.ts` for centralized site configuration
- ✅ Updated all components to use config (Header, Footer, ContactForm, structured data)
- ✅ Added social media icons to footer (Facebook, Instagram, LinkedIn, YouTube, Zillow)
- ✅ Created `HOW_TO_UPDATE_INFO.md` documentation
- ✅ Fixed Amplify backend deployment errors

### Future Enhancements
- [ ] Add blog post pagination (currently shows all)
- [ ] Implement blog search functionality
- [ ] Add blog categories (in addition to tags)
- [ ] Create portfolio section using Project model
- [ ] Add testimonials section
- [ ] Implement newsletter signup
- [ ] Add Google Analytics/tracking
- [ ] Create custom 404 page
- [ ] Add blog RSS feed

---

## File Locations Reference

### Configuration
- `tailwind.config.ts` - Design system
- `next.config.ts` - Next.js config
- `tsconfig.json` - TypeScript config
- `.env.local` - Local environment variables
- `amplify/.env` - Amplify environment variables

### Key Components
- `components/Header.tsx` - Navigation
- `components/Footer.tsx` - Footer
- `components/BentoGrid.tsx` - Homepage layout
- `components/ContactForm.tsx` - Contact form

### API Routes
- `app/api/contact/route.ts` - Form submission
- `app/api/og/route.tsx` - OG images
- `app/api/env-check/route.ts` - Environment validation

### Lambda Functions
- `amplify/functions/ghl-contact/handler.ts` - GHL sync

### Utilities
- `lib/config.ts` - Centralized site configuration
- `lib/mdx.ts` - Blog post utilities
- `lib/relatedPosts.ts` - Recommendation engine
- `lib/structuredData.ts` - SEO schemas

### Documentation
- `PROJECT_CONTEXT.md` - Complete project documentation
- `HOW_TO_UPDATE_INFO.md` - Guide for updating contact info
- `README.md` - AWS Amplify starter template info

---

## Support & Resources

### Documentation
- [Next.js 15 Docs](https://nextjs.org/docs)
- [AWS Amplify Gen 2 Docs](https://docs.amplify.aws/)
- [RE/MAX Brand Standards](https://www.remax.com/brand-standards)
- [GoHighLevel API Docs](https://highlevel.stoplight.io/)

### Commands
```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Amplify
npx ampx sandbox         # Deploy sandbox
npx ampx sandbox delete  # Delete sandbox
npx ampx generate        # Generate client code

# Utilities
npm run lint             # Run ESLint
npm run type-check       # TypeScript validation
```

---

## Project Status

**Current Phase:** Backend Deployment (Sandbox)  
**Last Updated:** 2026-03-02  
**Version:** 1.0.0

### Completed
- ✅ All 17 core tasks complete
- ✅ Frontend fully functional
- ✅ Backend code written
- ✅ Environment variables configured
- ✅ TypeScript errors resolved
- ✅ Centralized configuration system
- ✅ Social media integration

### In Progress
- 🔄 Amplify sandbox deployment

### Next Steps
1. Complete sandbox deployment
2. Test contact form end-to-end
3. Verify admin panel functionality
4. Production deployment to AWS Amplify Console
5. Domain configuration
6. Google Search Console setup

---

## Contact & Ownership

**Project Owner:** Jose Fernandez  
**Real Estate Specialist:** New Jersey  
**Brokerage:** RE/MAX

**Developer Notes:**
- This is a content-first authority site
- Focus on SEO and lead generation
- RE/MAX brand compliance is mandatory
- GHL integration is critical for lead management
