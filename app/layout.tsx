import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import "@aws-amplify/ui-react/styles.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SafeRecaptchaProvider from "@/components/SafeRecaptchaProvider";
import ConfigureAmplifyClientSide from "@/components/ConfigureAmplifyClientSide";
import StickyCallButton from "@/components/StickyCallButton";
import FacebookMessenger from "@/components/FacebookMessenger";
import { siteConfig } from "@/lib/config";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const defaultOgImage = "/api/og?title=NJ%20Real%20Estate%20Specialist";

export const metadata: Metadata = {
  // Resolves all relative OG/twitter image URLs (/api/og?...) to absolute URLs for crawlers
  metadataBase: new URL(siteConfig.url),
  title: "Jose Fernandez | NJ Real Estate Specialist",
  description: "Expert guidance for inherited property, foreclosure, and as-is home sales in New Jersey.",
  openGraph: {
    type: "website",
    siteName: "Jose Fernandez | NJ Real Estate",
    title: "Jose Fernandez | NJ Real Estate Specialist",
    description: "Expert guidance for inherited property, foreclosure, and as-is home sales in New Jersey.",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: "Jose Fernandez | NJ Real Estate Specialist" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jose Fernandez | NJ Real Estate Specialist",
    description: "Expert guidance for inherited property, foreclosure, and as-is home sales in New Jersey.",
    images: [defaultOgImage],
  },
};

const GTM_ID = "GTM-53SVHBKB";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const h = await headers();
  const isCampaign = h.get("x-campaign-page") === "1";
  // Admin pages: no GTM/analytics — lead PII (page titles) must not reach GA4/Meta
  const isAdmin = h.get("x-admin-page") === "1";

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="geo.region" content="US-NJ" />
        <meta name="geo.placename" content="New Jersey" />
        {!isAdmin && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}
      </head>
      <body className={`${inter.variable} overflow-x-hidden`}>
        <ConfigureAmplifyClientSide />
        {!isAdmin && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {!isCampaign && (
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-remax-blue focus:text-white focus:rounded">
            Skip to main content
          </a>
        )}
        <SafeRecaptchaProvider siteKey={recaptchaSiteKey}>
          {!isCampaign && <Header />}
          <main id="main-content" className={isCampaign ? "" : "pb-16 md:pb-0"}>
            {children}
          </main>
          {!isCampaign && <Footer />}
          {!isCampaign && <StickyCallButton />}
          {!isCampaign && <FacebookMessenger />}
        </SafeRecaptchaProvider>
      </body>
    </html>
  );
}
