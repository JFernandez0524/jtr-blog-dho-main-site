import { siteConfig } from "./config";

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.contact.name,
    jobTitle: "Real Estate Specialist",
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.state,
      postalCode: siteConfig.contact.address.zip,
      addressCountry: "US",
    },
    sameAs: Object.values(siteConfig.social),
    knowsAbout: [
      "Inherited Property Sales",
      "Foreclosure Prevention",
      "As-Is Home Sales",
      "Probate Real Estate",
      "Short Sales",
    ],
  };
}

export function generateLocalBusinessSchema(reviewCount?: number, averageRating?: number) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.contact.name,
    image: `${siteConfig.url}/jose-profile.jpg`,
    "@id": siteConfig.url,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.state,
      postalCode: siteConfig.contact.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.2607,
      longitude: -74.2743,
    },
    areaServed: siteConfig.business.areasServed.map((area) => ({
      "@type": "City",
      name: area,
    })),
    ...(reviewCount && averageRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating.toString(),
        reviewCount: reviewCount.toString(),
      },
    }),
    sameAs: Object.values(siteConfig.social).filter(Boolean),
  };
}

export function generateArticleSchema(article: {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  slug: string;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Person",
      name: "Jose Fernandez",
    },
    url: `${siteConfig.url}/blog/${article.slug}`,
    keywords: article.tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${article.slug}`,
    },
  };
}

export function generateServiceSchema(service: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Person",
      name: "Jose Fernandez",
      address: {
        "@type": "PostalAddress",
        addressRegion: "NJ",
        addressCountry: "US",
      },
    },
    areaServed: {
      "@type": "State",
      name: "New Jersey",
    },
    url: service.url,
    serviceType: "Real Estate Services",
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Jose Fernandez - NJ Real Estate Specialist",
    description: "Expert guidance for inherited property, foreclosure assistance, and as-is home sales in New Jersey.",
    url: siteConfig.url,
    areaServed: {
      "@type": "State",
      name: "New Jersey",
    },
    knowsAbout: [
      "Inherited Property",
      "Foreclosure Prevention",
      "As-Is Home Sales",
      "Probate Real Estate",
    ],
  };
}
