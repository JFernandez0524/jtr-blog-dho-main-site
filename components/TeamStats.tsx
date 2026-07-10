import { siteConfig } from "@/lib/config";

/**
 * Zillow-style team trust bar (async server component).
 *
 * Sales figures are static config (Bridge doesn't expose agent Past Sales
 * data — refresh siteConfig.business.teamStats occasionally). The review
 * count + rating are pulled live from the Bridge Reviews dataset and cached
 * 24h. On any failure the live tile is simply omitted — never broken.
 */

const BRIDGE_ODATA = "https://api.bridgedataoutput.com/api/v2/OData/reviews";
// David Borrero (team lead) — extracted from the TeamLeadAccountId on the
// team's own Zillow review records
const TEAM_LEAD_ACCOUNT_ID = "13024685";

interface LiveReviewStats {
  count: number;
  rating: string;
}

async function getLiveReviewStats(): Promise<LiveReviewStats | null> {
  const apiKey = process.env.BRIDGE_DATA_API_KEY;
  if (!apiKey) return null;

  try {
    const revalidate = { next: { revalidate: 86400 } };

    const [teamRes, leadRes] = await Promise.all([
      fetch(
        `${BRIDGE_ODATA}/Reviews?access_token=${apiKey}&$filter=${encodeURIComponent(`TeamLeadAccountId eq '${TEAM_LEAD_ACCOUNT_ID}'`)}&$top=1`,
        revalidate
      ),
      fetch(
        `${BRIDGE_ODATA}/Reviewees?access_token=${apiKey}&$filter=${encodeURIComponent(`AccountIdReviewee eq '${TEAM_LEAD_ACCOUNT_ID}'`)}`,
        revalidate
      ),
    ]);

    if (!teamRes.ok || !leadRes.ok) return null;

    const teamData = await teamRes.json();
    const leadData = await leadRes.json();

    const memberReviewCount = Number(teamData?.["@odata.count"] ?? 0);
    const lead = leadData?.value?.[0];
    const leadReviewCount = Number(lead?.ReviewCount ?? 0);
    const leadRating = Number(lead?.AverageReviewRating ?? 0);

    const count = memberReviewCount + leadReviewCount;
    if (!count || !leadRating) return null;

    return { count, rating: leadRating.toFixed(1) };
  } catch (error) {
    console.error("TeamStats: Bridge fetch failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

export default async function TeamStats() {
  const { teamStats } = siteConfig.business;
  const live = await getLiveReviewStats();

  const tiles: { value: string; label: string; href?: string }[] = [
    { value: teamStats.totalSales, label: "Total sales" },
    { value: teamStats.priceRange, label: "Price range" },
    { value: teamStats.averagePrice, label: "Average price" },
  ];

  if (live) {
    tiles.push({
      value: `★ ${live.rating}`,
      label: `${live.count} team reviews`,
      href: siteConfig.social.zillow,
    });
  }

  return (
    <div className={`grid grid-cols-2 ${live ? "sm:grid-cols-4" : "sm:grid-cols-3"} gap-3`}>
      {tiles.map(({ value, label, href }) => {
        const tile = (
          <div className="border border-gray-200 rounded-xl px-3 py-4 text-center h-full">
            <p className="text-xl sm:text-2xl font-bold text-remax-blue [font-variant-numeric:tabular-nums]">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        );
        return href ? (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            {tile}
          </a>
        ) : (
          <div key={label}>{tile}</div>
        );
      })}
    </div>
  );
}
