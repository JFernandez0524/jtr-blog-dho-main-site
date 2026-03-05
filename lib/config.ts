/**
 * Site Configuration
 * Central source of truth for site-wide constants
 */

export const siteConfig = {
  // Site Metadata
  name: "Jose Fernandez",
  title: "Jose Fernandez | New Jersey Real Estate Specialist",
  description: "Expert real estate solutions for inherited properties, foreclosures, and as-is sales in New Jersey.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.josetherealtor.com",
  
  // Contact Information
  contact: {
    name: "Jose Fernandez",
    email: "info@josetherealtor.com", // TODO: Update with real email
    phone: "+1 (973) 384-1054", // TODO: Update with real phone
    phoneDisplay: "(973) 384-1054",
    address: {
      street: "83 South st, ste 302",
      city: "Freehold",
      state: "NJ",
      zip: "07728",
      full: "83 South St, STE 302, Freehold, NJ 07728"
    }
  },

  // Business Information
  business: {
    name: "Jose Fernandez Real Estate",
    brokerage: "RE/MAX",
    license: "NJ License #1430283", // TODO: Update with real license
    yearsExperience: 15,
    areasServed: ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison", "Freehold"],
  },

  // Social Media
  social: {
    facebook: "https://www.facebook.com/Josetherealtor/",
    instagram: "http://instagram.com/jose_fernandez_remax_agent",
    linkedin: "https://www.linkedin.com/in/josefernandezremaxagent/",
    twitter: "https://twitter.com/josefernandezre",
    youtube: "https://www.youtube.com/@jose_fernandez_remax_agent",
    zillow: "https://www.zillow.com/profile/Jose%20Fernandez%20NJ",
  },

  // Hero Messaging (easy to swap between versions)
  hero: {
    // Default: Longer version (more comprehensive)
    headline: "Helping New Jersey Families Protect the Wealth in Their Home During Life's Most Difficult Transitions",
    subheadline: "Probate. Foreclosure. Financial hardship.\n\nI help New Jersey homeowners understand their real options and make the best decision for their situation—whether that means selling the property, keeping it, or exploring alternatives.",
    
    // Alternate: Shorter version (for A/B testing)
    headlineAlt: "NJ Resource for Families Facing Probate or Foreclosure",
    subheadlineAlt: "When life changes suddenly, real estate decisions can feel overwhelming. I help families navigate inherited homes, financial hardship, and complex property situations so they can protect their equity and move forward with confidence.",
  },

  // CTA Text
  cta: {
    primary: "Get Guidance",
    secondary: "Explore Your Options",
  },

  // Navigation
  nav: {
    main: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Inherited Property", href: "/inherited-property" },
      { label: "Foreclosure", href: "/foreclosure" },
      { label: "Sell As-Is", href: "/sell-as-is" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    footer: {
      services: [
        { label: "Inherited Property Solutions", href: "/inherited-property" },
        { label: "Foreclosure Prevention", href: "/foreclosure" },
        { label: "Sell Your Home As-Is", href: "/sell-as-is" },
      ],
      resources: [
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
  },

  // Service Types (matches GHL custom fields)
  services: [
    { value: "inherited-property", label: "Inherited Property" },
    { value: "foreclosure", label: "Foreclosure Prevention" },
    { value: "sell-as-is", label: "Sell As-Is" },
    { value: "general", label: "General Inquiry" },
  ],

  // SEO
  seo: {
    keywords: [
      "New Jersey real estate",
      "inherited property NJ",
      "foreclosure help NJ",
      "sell house as-is NJ",
      "Newark real estate",
      "RE/MAX New Jersey",
    ],
    author: "Jose Fernandez",
  },
} as const;

// Type exports for TypeScript
export type NavItem = typeof siteConfig.nav.main[number];
export type ServiceType = typeof siteConfig.services[number];
