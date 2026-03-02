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
    url: `https://josefernandez.com/blog/${article.slug}`,
    keywords: article.tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://josefernandez.com/blog/${article.slug}`,
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
    url: "https://josefernandez.com",
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
