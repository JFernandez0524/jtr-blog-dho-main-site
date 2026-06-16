const messengerUrl = "https://m.me/66616433431419";

const MessengerIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.31.27.52l.05 1.63c.04.52.55.86 1.04.65l1.82-.8c.17-.08.36-.09.53-.04.7.19 1.43.29 2.15.29 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm5.98 7.68-2.93 4.65c-.46.74-1.46.92-2.13.4L10.86 13c-.26-.2-.62-.2-.88 0l-2.74 2.08c-.37.28-.84-.13-.59-.53l2.93-4.65c.46-.74 1.46-.92 2.13-.4l2.06 1.73c.26.2.62.2.88 0l2.74-2.08c.37-.28.84.13.59.53z" />
  </svg>
);

// Desktop floating button — on mobile, Messenger is inside StickyCallButton
export default function FacebookMessenger() {
  return (
    <a
      href={messengerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2 bg-[#0084ff] text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
      aria-label="Chat on Messenger"
    >
      <MessengerIcon />
      <span className="font-semibold text-sm">Message Us</span>
    </a>
  );
}
