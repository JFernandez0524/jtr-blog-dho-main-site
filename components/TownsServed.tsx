import Link from "next/link";
import { getAllLocations, LocationServiceType } from "@/lib/mdx";

const LINK_LABEL: Record<LocationServiceType, string> = {
  "inherited-property": "Inherited Property",
  foreclosure: "Foreclosure Help",
  "sell-as-is": "Sell As-Is",
};

const SECTION_HEADING: Record<LocationServiceType, string> = {
  "inherited-property": "Inherited Property Services by Town",
  foreclosure: "Foreclosure Help by Town",
  "sell-as-is": "Sell As-Is Services by Town",
};

/**
 * Internal-linking grid to the town/location pages (server component).
 * These pages are otherwise only reachable via the sitemap — rendering this
 * on the pillar page and each location page gives them real internal links.
 * Filters to the same serviceType so links stay topically clustered
 * (a foreclosure town page links other foreclosure town pages, not a mix).
 */
export default function TownsServed({
  heading,
  excludeSlug,
  serviceType = "inherited-property",
}: {
  heading?: string;
  /** Omit the current page's own slug when rendering on a location page */
  excludeSlug?: string;
  serviceType?: LocationServiceType;
}) {
  const locations = getAllLocations()
    .filter((location) => location.serviceType === serviceType && location.slug !== excludeSlug)
    .sort((a, b) => a.town.localeCompare(b.town));

  if (locations.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-remax-blue mb-6 text-center">{heading || SECTION_HEADING[serviceType]}</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {locations.map((location) => (
          <li key={location.slug}>
            <Link
              href={`/${location.slug}`}
              className="block border border-remax-slate/15 rounded-lg px-4 py-3 text-sm font-medium text-remax-slate hover:border-remax-blue hover:text-remax-blue transition-colors text-center"
            >
              {LINK_LABEL[serviceType]} in {location.town}, NJ
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
