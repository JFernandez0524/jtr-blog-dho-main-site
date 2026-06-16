"use client";

import { siteConfig } from "@/lib/config";

const telHref = `tel:${siteConfig.contact.phone.replace(/[\s()-]/g, "")}`;

export default function StickyCallButton() {
  return (
    <a
      href={telHref}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-center gap-3 bg-remax-blue text-white py-4 font-semibold text-base shadow-lg"
    >
      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
      </svg>
      Call Jose: {siteConfig.contact.phoneDisplay}
    </a>
  );
}
