# How to Update Your Contact Information

All site-wide contact information, navigation, and business details are centralized in one file:

**`/lib/config.ts`**

## Quick Updates

### 1. Contact Information
```typescript
contact: {
  name: "Jose Fernandez",           // ← Update your name
  email: "jose@example.com",         // ← Update your email
  phone: "+1 (555) 123-4567",        // ← Update your phone (full format)
  phoneDisplay: "(555) 123-4567",    // ← Update display format
  address: {
    street: "123 Main Street",       // ← Update street address
    city: "Newark",                  // ← Update city
    state: "NJ",                     // ← Update state
    zip: "07102",                    // ← Update ZIP
  }
}
```

### 2. Business Information
```typescript
business: {
  name: "Jose Fernandez Real Estate",
  brokerage: "RE/MAX",
  license: "NJ License #12345678",   // ← Update your license number
  yearsExperience: 15,               // ← Update years
  areasServed: ["Newark", ...],      // ← Update cities you serve
}
```

### 3. Social Media Links
```typescript
social: {
  facebook: "https://facebook.com/...",    // ← Update your links
  instagram: "https://instagram.com/...",
  linkedin: "https://linkedin.com/...",
  twitter: "https://twitter.com/...",
}
```

### 4. Navigation Links
```typescript
nav: {
  main: [
    { label: "Home", href: "/" },          // ← Change labels if needed
    { label: "Inherited Property", href: "/inherited-property" },
    // Add or remove items as needed
  ]
}
```

### 5. Service Types (for contact form)
```typescript
services: [
  { value: "inherited-property", label: "Inherited Property" },
  { value: "foreclosure", label: "Foreclosure Prevention" },
  // Add or modify services
]
```

## What Gets Updated Automatically

When you change `lib/config.ts`, these components automatically update:

✅ **Header** - Logo, name, navigation links  
✅ **Footer** - Name, contact info, service links  
✅ **Contact Form** - Service dropdown options  
✅ **Structured Data** - SEO schema with your info  
✅ **All Pages** - Any reference to contact info

## Example: Updating Your Email

**Before:**
```typescript
email: "jose@example.com",
```

**After:**
```typescript
email: "jose@remaxnj.com",
```

**Result:** Email updates in:
- Footer contact section
- Structured data (SEO)
- Any other component that references it

## No Need to Touch

You don't need to edit these files anymore:
- ❌ `components/Header.tsx`
- ❌ `components/Footer.tsx`
- ❌ `components/ContactForm.tsx`
- ❌ `lib/structuredData.ts`

Everything pulls from `lib/config.ts` automatically!

## Testing Your Changes

After updating `lib/config.ts`:

1. Save the file
2. Check your dev server (should auto-reload)
3. Visit http://localhost:3000
4. Verify:
   - Header shows correct name
   - Footer shows correct contact info
   - Contact form has correct service options

## Need to Add Something New?

Just add it to `lib/config.ts` and reference it in your components:

```typescript
// In lib/config.ts
export const siteConfig = {
  // ... existing config
  office: {
    hours: "Mon-Fri 9am-6pm",
    timezone: "EST",
  }
}

// In any component
import { siteConfig } from "@/lib/config";

<p>{siteConfig.office.hours}</p>
```
