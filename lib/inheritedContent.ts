// Shared inherited-property content used by both the pillar page
// (app/inherited-property-new-jersey) and the direct-mail landing page
// (app/mailer/[type]). Data only — each page owns its own markup.

export interface FAQEntry {
  q: string;
  a: string;
}

// Q&As identical on both pages. Each page appends its own
// "How quickly can we close?" variant below.
export const SHARED_INHERITED_FAQ: FAQEntry[] = [
  {
    q: "What if the house needs a lot of work?",
    a: "You can sell it as-is. Most buyers in this market factor in renovation costs — you're not required to fix anything before selling. I'll help you understand what the property is worth in its current condition.",
  },
  {
    q: "What if we haven't finished probate yet?",
    a: "We can still talk now. I'll help you understand the timeline and what steps you can start taking before probate is complete — so you're not scrambling later.",
  },
  {
    q: "What if multiple heirs disagree?",
    a: "I've helped many families navigate this. Getting an honest, professional valuation often gives everyone a clearer starting point and takes some of the emotion out of the conversation.",
  },
];

export const PILLAR_INHERITED_FAQ: FAQEntry[] = [
  ...SHARED_INHERITED_FAQ,
  {
    q: "How quickly can we close?",
    a: "Most families I work with close in 60–90 days once they're ready to move forward. If you need more time to sort things out, that's completely fine — there's no pressure.",
  },
];

export const MAILER_INHERITED_FAQ: FAQEntry[] = [
  ...SHARED_INHERITED_FAQ,
  {
    q: "How quickly can we close?",
    a: "Most families I work with close in 60–90 days once they're ready to move forward. If speed is a priority, our cash buyers can close in as little as 2–3 weeks. If you need more time to sort things out, there's no pressure.",
  },
];

export const INHERITED_CHALLENGES: { title: string; text: string }[] = [
  {
    title: "Probate Navigation",
    text: "Understanding the legal process and timeline for estate sales",
  },
  {
    title: "Family Coordination",
    text: "Managing decisions when multiple heirs are involved",
  },
  {
    title: "Property Condition",
    text: "Selling as-is or determining necessary repairs",
  },
  {
    title: "Tax Implications",
    text: "Understanding capital gains and estate tax considerations",
  },
];

// "Two Common Ways Families Sell" — the list-vs-cash comparison.
export const TWO_PATHS_INTRO =
  "Those “cash offer” letters in your mailbox are one buyer hoping you’ll take their number. I maintain a deep list of vetted investors who pay fair market value — and I show you both paths so you choose what nets your family more.";

export const TWO_PATHS: { title: string; text: string; timeline: string }[] = [
  {
    title: "List on the Market",
    text: "Best when the property is in decent shape and you have time — typically the highest price. Full-service: professional photography, paid social ads, open houses, and we handle the town CO and open permits. It’s how our team sells $60M+ every year — we sell houses, not just list them.",
    timeline: "Typical timeline: 60–90 days",
  },
  {
    title: "Sell Off-Market for Cash",
    text: "Best when speed or condition matters more. No showings, no repairs — I bring my own list of vetted cash buyers who pay fair market value, not lowball offers. And because the buyer is already at the table, you save on commission costs.",
    timeline: "Typical timeline: 14–21 days",
  },
];

export const WALKTHROUGH_CALLOUT = {
  headline: "A free in-home walkthrough is the only way to know which path puts more money in your pocket.",
  sub: "I’ll assess the condition, run the numbers both ways, and give you a straight answer.",
};

// Blue panel framing the sample listing-presentation graphic
// (public/listingPresentationLayout.png).
export const PRICING_ANALYSIS_PANEL = {
  heading: "Every Family Gets a Full Pricing Analysis — Not a Guess",
  sub: "Real comps, market trends, and a data-driven plan for top dollar. Here’s what yours will look like:",
  image: "/listingPresentationLayout.png",
  imageAlt:
    "Sample listing presentation from The Borrero Group — market at a glance, comparable sales map, recent comp highlights, and local market trends",
};

export const AGENT_VALUE_QUOTE =
  "The value of your agent is not only what happens when everything goes right — it’s how the transaction is managed when something goes wrong.";

export const WORK_WITH_ME_STEPS: string[] = [
  "Initial consultation to understand your situation, timeline, and probate status",
  "Pre-market walkthrough and local market analysis — plus trusted contractor referrals that save you time and money",
  "Full marketing launch: professional photography, paid social ads, open houses, and just-listed campaigns",
  "We handle the town: CO, open permits, and NJ paperwork requirements",
  "Offer negotiation, inspection issues, attorney review, and timeline management through closing day",
];
