// Direct-mail landing content for the two preforeclosure letters
// (app/mailer/[type] → /mailer/auction and /mailer/lis-pendens).
// Data only — the page owns its own markup, same pattern as
// lib/inheritedContent.ts and lib/foreclosureContent.ts.
//
// Compliance: informational only — never legal, tax, or financial advice.
// Adjournment copy intentionally gives NO counts, durations, or fees; the
// homeowner is pointed to their county sheriff's office for specifics.

export interface MailerFAQEntry {
  q: string;
  a: string;
}

// Index into FORECLOSURE_STAGES (lib/foreclosureContent.ts) that a lis
// pendens recipient is currently in — "Lis pendens / foreclosure complaint filed".
export const LIS_PENDENS_STAGE_INDEX = 2;

// ── Auction (sheriff sale scheduled) ─────────────────────────────────────

export const AUCTION_OPTIONS: { title: string; text: string }[] = [
  {
    title: "Sell at Market Value Before the Sale",
    text: "If you have equity, a sale before the auction pays off the debt and puts what's left in your pocket — instead of leaving it on the table at a sheriff sale.",
  },
  {
    title: "Sell Fast to a Vetted Cash Buyer",
    text: "When the calendar is tight, I bring my own list of vetted cash buyers who pay fair market value — not lowball 'we buy houses' numbers. Closings can happen in as little as 2–3 weeks.",
  },
  {
    title: "Use Your Adjournments",
    text: "NJ homeowners have adjournments of the sheriff sale they can use — and you can request them yourself, no attorney needed. Contact your county sheriff's office for the details on how to request one. It can buy valuable time to sell.",
  },
  {
    title: "Talk to Your Lender",
    text: "Ask your lender what it would take to reinstate the loan, or whether they'd approve a short sale if you owe more than the home is worth. I'll help you understand what the numbers support.",
  },
];

export const AUCTION_NUMBERS_NOTE =
  "At a sheriff sale, bidding opens at the upset price. The equity above that number is what an auction puts at risk — selling before the sale date is how you protect it.";

export const AUCTION_FAQ: MailerFAQEntry[] = [
  {
    q: "Is it too late now that a sale date is scheduled?",
    a: "Not necessarily. Until the sale actually happens, the home is still yours to sell. A sale date means you need to move quickly — it doesn't mean your options are gone.",
  },
  {
    q: "Can I still sell my house before the sheriff sale?",
    a: "Yes. A closed sale before the auction pays off what's owed and the remaining equity goes to you. My job is to get it done on your timeline — with a market sale or a vetted cash buyer when time is short.",
  },
  {
    q: "What happens to my equity at auction?",
    a: "Sheriff sale buyers are bidding to buy below market. Fees and interest keep adding up until the sale, too. Selling before the sale date is the most reliable way to keep the equity you've built.",
  },
  {
    q: "Can the sale date be postponed?",
    a: "NJ homeowners have adjournments they can use, and you can request them yourself without an attorney. Contact your county sheriff's office — they can tell you exactly how to request one for your sale.",
  },
  {
    q: "What does your help cost me?",
    a: "Nothing upfront — ever. If we sell the home, I'm paid a commission from the sale like any listing. If you decide not to sell, you owe me nothing.",
  },
  {
    q: "Is this conversation confidential?",
    a: "Yes. Everything you share stays between us. I understand how stressful this is, and discretion is something I take seriously.",
  },
];

// ── Lis Pendens (foreclosure complaint filed) ────────────────────────────

export const LIS_PENDENS_NUMBERS_NOTE =
  "These are estimates from public records — your actual payoff may differ. If your home is worth more than you owe, that equity is yours to protect, and right now you have time to do it.";

export const LIS_PENDENS_FAQ: MailerFAQEntry[] = [
  {
    q: "What is a lis pendens?",
    a: "It's a public notice, recorded with the county, that a lawsuit involving the property has been filed — in this case, a foreclosure complaint. It doesn't mean you've lost the home, and you can usually keep living there while the case moves forward.",
  },
  {
    q: "Can I still sell my house?",
    a: "Yes. A lis pendens doesn't stop you from selling. When the home sells, the mortgage is paid off at closing and the remaining equity goes to you.",
  },
  {
    q: "How much time do I have?",
    a: "NJ foreclosures go through the courts and tend to move slowly, but every case is different. The earlier you act, the more options you keep — this stage is where you still have the most room to move.",
  },
  {
    q: "What does your help cost me?",
    a: "Nothing upfront — ever. If we sell the home, I'm paid a commission from the sale like any listing, and in a short sale the lender typically covers it. If you keep the home, you owe me nothing.",
  },
  {
    q: "Will talking to a real estate agent hurt my case?",
    a: "No. A free consultation is just information — you're not committing to anything. Understanding your options early gives you more control, not less.",
  },
  {
    q: "Is this conversation confidential?",
    a: "Yes. Everything you share stays between us. I understand this is a sensitive situation, and discretion is something I take seriously.",
  },
];

export const LIS_PENDENS_GUIDE = {
  href: "/blog/what-is-a-lis-pendens-in-new-jersey",
  label: "Read: What Is a Lis Pendens in New Jersey?",
};

// ── Shared bio copy for all foreclosure mailer pages ─────────────────────

export const FORECLOSURE_BIO = {
  paragraphs: [
    "I help NJ homeowners facing foreclosure understand exactly where they stand — what the home is worth, what's owed, and which options are still open — so they can make a decision with real numbers instead of fear.",
    "Whether the right move is selling, working something out with your lender, or simply buying time, I'll give you honest information — not a sales pitch.",
  ],
  bullets: [
    "Free, confidential consultation — no upfront fees, ever",
    "I'll personally call you — not a call center",
    "15+ years selling NJ homes, including foreclosure and short sales",
  ],
};
