"use client";

import { siteConfig } from "@/lib/config";

const messengerUrl = "https://m.me/66616433431419";

const PhoneIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const MessengerIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.31.27.52l.05 1.63c.04.52.55.86 1.04.65l1.82-.8c.17-.08.36-.09.53-.04.7.19 1.43.29 2.15.29 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm5.98 7.68-2.93 4.65c-.46.74-1.46.92-2.13.4L10.86 13c-.26-.2-.62-.2-.88 0l-2.74 2.08c-.37.28-.84-.13-.59-.53l2.93-4.65c.46-.74 1.46-.92 2.13-.4l2.06 1.73c.26.2.62.2.88 0l2.74-2.08c.37-.28.84.13.59.53z" />
  </svg>
);

export default function StickyCallButton({
  phone = siteConfig.contact.phone,
}: {
  /** Override the call target (e.g. the mail-campaign tracking number on /mailer/* pages) */
  phone?: string;
}) {
  const telHref = `tel:${phone.replace(/[\s()-]/g, "")}`;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex border-t border-white/20">
      <a
        href={telHref}
        className="flex-1 bg-remax-blue text-white py-4 font-semibold text-sm flex items-center justify-center gap-2"
      >
        <PhoneIcon />
        Call Jose
      </a>
      <div className="w-px bg-white/20" />
      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-[#0084ff] text-white py-4 font-semibold text-sm flex items-center justify-center gap-2"
      >
        <MessengerIcon />
        Message Us
      </a>
    </div>
  );
}
