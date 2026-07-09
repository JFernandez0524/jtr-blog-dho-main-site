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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google.com https://www.gstatic.com https://connect.facebook.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://*.amazonaws.com https://*.amazoncognito.com https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com https://graph.facebook.com",
              `frame-src https://www.youtube.com https://www.google.com https://www.facebook.com ${GHL_FRAME_ORIGINS.join(" ")}`,
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
