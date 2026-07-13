// Foreclosure pillar page content (app/foreclosure). Data only — the page
// owns its own markup, same pattern as lib/inheritedContent.ts.

// NJ foreclosure timeline — lets a visitor self-locate and see that options
// remain at every stage. NJ is a judicial-foreclosure state; the process
// typically runs 12–18+ months from first missed payment.
export const FORECLOSURE_STAGES: {
  stage: string;
  what: string;
  stillOpen: string;
}[] = [
  {
    stage: "Missed payments",
    what: "You've fallen behind, but the bank hasn't filed anything yet. This is where you have the most room to move.",
    stillOpen: "Still open: loan modification, refinance, market sale, cash sale — everything.",
  },
  {
    stage: "Notice of Intention to Foreclose",
    what: "NJ law requires this letter at least 30 days before the bank can file. It feels final — it isn't. Nothing has been filed in court yet.",
    stillOpen: "Still open: modification, reinstatement, short sale, market sale, cash sale.",
  },
  {
    stage: "Lis pendens / foreclosure complaint filed",
    what: "The bank has started the court process. NJ courts move slowly — this stage alone often takes many months, and you can keep living in the home.",
    stillOpen: "Still open: short sale, market sale, cash sale, and often still a modification.",
  },
  {
    stage: "Judgment & sheriff sale scheduled",
    what: "Even now it's not over. NJ allows adjournments of the sheriff sale, and you have a right of redemption. But every option from here requires moving fast.",
    stillOpen: "Still open: fast cash sale, adjournment requests, redemption — call me today, not this week.",
  },
];

export const FORECLOSURE_OPTIONS: { title: string; text: string }[] = [
  {
    title: "Quick Market Sale",
    text: "If you have equity, this is usually the strongest play: a sheriff sale is the worst possible way to give up equity you spent years building. Selling at market value pays off the mortgage, protects what's yours, and you walk away clean.",
  },
  {
    title: "Sell Fast to a Vetted Cash Buyer",
    text: "When the clock is the problem, I bring my own list of vetted cash buyers who pay fair market value — not the lowball 'we buy houses' numbers. Closings in as little as 2–3 weeks, fast enough to stop a sale date.",
  },
  {
    title: "Short Sale",
    text: "If you owe more than the home is worth, selling with lender approval often protects your credit far better than a completed foreclosure — and lenders approve them because it costs them less too.",
  },
  {
    title: "Loan Modification",
    text: "Restructure the payments with your lender and keep the home — sometimes possible even after a default notice. I'll help you understand whether your numbers realistically support it.",
  },
  {
    title: "Deed in Lieu",
    text: "Transfer the property directly to the lender to avoid the full foreclosure process. A last resort — but still better than a foreclosure judgment on your record.",
  },
];

// Anti-scam trust block. Foreclosure-rescue scams are common enough in NJ
// that legitimate help has to actively distinguish itself.
export const FORECLOSURE_TRUST_POINTS: string[] = [
  "I'm a licensed NJ real estate agent with RE/MAX — my license, my team, and 15 years of sales are all public record you can verify on Zillow and RE/MAX before we ever speak.",
  "You will never pay me an upfront fee. Not for the consultation, not for the analysis, not for anything. Anyone who asks for money up front to \"save your home\" is running a scam.",
  "I will never ask you to sign your deed over, sign blank documents, or make your mortgage payments to anyone other than your lender — those are the classic rescue scams NJ officials warn about.",
  "Every decision stays yours. My job is to lay out the real options with real numbers; you choose. No pressure, and no judgment — I've helped hundreds of NJ families through this.",
];

export interface ForeclosureFAQEntry {
  q: string;
  a: string;
}

export const FORECLOSURE_FAQ: ForeclosureFAQEntry[] = [
  {
    q: "Is it too late if I've already received a foreclosure notice?",
    a: "Not necessarily. New Jersey foreclosure is a slow process — it often takes over a year from first missed payment to a sheriff sale. Even after receiving a notice, short sales and other options may still be available. The key is acting now rather than waiting.",
  },
  {
    q: "Will I lose the equity in my home?",
    a: "Only if the process runs all the way to a sheriff sale — that's where equity gets destroyed by fees, interest, and below-market bidding. If you have equity today, selling before the sale date protects it. That's the single biggest reason not to wait.",
  },
  {
    q: "What does your help cost me?",
    a: "Nothing upfront — ever. If we sell the home, I'm paid a commission from the sale like any listing, and in a short sale the lender typically covers it. If the best answer for you is a loan modification and you keep the home, you owe me nothing.",
  },
  {
    q: "Will talking to a real estate agent hurt my foreclosure case?",
    a: "No. A free consultation is just information — you're not committing to anything. Understanding your options early gives you more power, not less.",
  },
  {
    q: "What if I owe more than the home is worth?",
    a: "A short sale may be your best path. Lenders often approve them because they prefer recovering partial payment over absorbing the full cost of a lengthy foreclosure. I've negotiated short sales with NJ lenders many times.",
  },
  {
    q: "Is this conversation completely confidential?",
    a: "Yes. Everything you share with me stays between us. I understand this is a sensitive situation and discretion is something I take seriously with every client.",
  },
];
