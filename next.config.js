const path = require("path");

// GHL booking calendar origins for frame-src. Include the origin of the
// configured calendar URL so white-labeled calendar domains work too.
const GHL_FRAME_ORIGINS = [
  "https://api.leadconnectorhq.com",
  "https://link.gohighlevel.com",
  "https://link.msgsndr.com",
];
try {
  if (process.env.GHL_BOOKING_CALENDAR_URL) {
    const origin = new URL(process.env.GHL_BOOKING_CALENDAR_URL).origin;
    if (!GHL_FRAME_ORIGINS.includes(origin)) GHL_FRAME_ORIGINS.push(origin);
  }
} catch {
  // Malformed URL — ignore, defaults above still apply
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: path.join(__dirname),
  },
  // Consolidate the apex host onto www — GSC was indexing both hosts as
  // separate pages, splitting ranking signals across duplicates.
  async redirects() {
    // Town pages pruned to Jose's real footprint (2026-07) — indexed URLs
    // 301 to their pillar so search equity flows back instead of 404ing
    const removedInheritedTowns = ["cherry-hill", "princeton", "trenton", "hamilton", "toms-river", "paterson"];
    const removedForeclosureTowns = ["toms-river", "paterson"];
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "josetherealtor.com" }],
        destination: "https://www.josetherealtor.com/:path*",
        permanent: true,
      },
      ...removedInheritedTowns.map((town) => ({
        source: `/inherited-property-${town}-nj`,
        destination: "/inherited-property-new-jersey",
        permanent: true,
      })),
      ...removedForeclosureTowns.map((town) => ({
        source: `/foreclosure-${town}-nj`,
        destination: "/foreclosure",
        permanent: true,
      })),
    ];
  },
  async headers() {
    // frameAncestors: 'none' everywhere EXCEPT /booking-confirmed, which must
    // render inside the GHL booking iframe on our own pages (the calendar's
    // post-booking redirect points there) — so it allows 'self' framing.
    const securityHeaders = (frameAncestors) => [
      // X-Frame-Options can't express "same origin ancestors only" reliably
      // across browsers — omit it where framing is allowed; CSP governs.
      ...(frameAncestors === "'none'" ? [{ key: "X-Frame-Options", value: "DENY" }] : []),
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google.com https://www.gstatic.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://connect.facebook.net",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: blob: https:",
          "connect-src 'self' https://*.amazonaws.com https://*.amazoncognito.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com https://www.googleadservices.com https://*.g.doubleclick.net https://www.facebook.com https://graph.facebook.com",
          `frame-src https://www.youtube.com https://www.google.com https://td.doubleclick.net https://www.googletagmanager.com https://www.facebook.com ${GHL_FRAME_ORIGINS.join(" ")}`,
          `frame-ancestors ${frameAncestors}`,
        ].join("; "),
      },
    ];

    return [
      {
        // Everything except /booking-confirmed
        source: "/((?!booking-confirmed$).*)",
        headers: securityHeaders("'none'"),
      },
      {
        source: "/booking-confirmed",
        headers: securityHeaders("'self'"),
      },
    ];
  },
};

module.exports = nextConfig;
