import Link from "next/link";
import { getAllLocations } from "@/lib/mdx";

/**
 * Internal-linking grid to the town/location pages (server component).
 * These pages are otherwise only reachable via the sitemap — rendering this
 * on the pillar page and each location page gives them real internal links.
 */
export default function TownsServed({
  heading = "Inherited Property Services by Town",
  excludeSlug,
}: {
  heading?: string;
  /** Omit the current page's own slug when rendering on a location page */
  excludeSlug?: string;
}) {
  const locations = getAllLocations()
    .filter((location) => location.slug !== excludeSlug)
    .sort((a, b) => a.town.localeCompare(b.town));

  if (locations.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-remax-blue mb-6 text-center">{heading}</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {locations.map((location) => (
          <li key={location.slug}>
            <Link
              href={`/${location.slug}`}
              className="block border border-remax-slate/15 rounded-lg px-4 py-3 text-sm font-medium text-remax-slate hover:border-remax-blue hover:text-remax-blue transition-colors text-center"
            >
              Inherited Property in {location.town}, NJ
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
