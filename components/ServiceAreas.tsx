import Link from "next/link";

/**
 * Homepage "areas served" section — county-clustered links to the town
 * pages. Core towns only (towns Jose actually services; never the
 * retired South Jersey/Mercer pages). Slugs must match files in
 * content/locations/. Anchor notes are real E-E-A-T claims — don't
 * invent presence for towns not in project memory's anchor list.
 */
const COUNTY_CLUSTERS: {
  county: string;
  towns: { name: string; slug: string; note?: string }[];
}[] = [
  {
    county: "Monmouth County",
    towns: [{ name: "Freehold", slug: "inherited-property-freehold-nj", note: "my office" }],
  },
  {
    county: "Essex County",
    towns: [
      { name: "Nutley", slug: "inherited-property-nutley-nj", note: "where I live" },
      { name: "Belleville", slug: "inherited-property-belleville-nj", note: "property owner here" },
      { name: "Newark", slug: "inherited-property-newark-nj" },
    ],
  },
  {
    county: "Union County",
    towns: [{ name: "Elizabeth", slug: "inherited-property-elizabeth-nj", note: "property owner here" }],
  },
  {
    county: "Hudson County",
    towns: [
      { name: "Jersey City", slug: "inherited-property-jersey-city-nj", note: "here weekly" },
      { name: "Bayonne", slug: "inherited-property-bayonne-nj", note: "here weekly" },
    ],
  },
  {
    county: "Middlesex County",
    towns: [
      { name: "Edison", slug: "inherited-property-edison-nj" },
      { name: "Woodbridge", slug: "inherited-property-woodbridge-nj" },
      { name: "Perth Amboy", slug: "inherited-property-perth-amboy-nj", note: "recent sale" },
    ],
  },
  {
    county: "Ocean County",
    towns: [
      { name: "Brick", slug: "inherited-property-brick-nj" },
      { name: "Toms River", slug: "inherited-property-toms-river-nj" },
    ],
  },
  {
    county: "Passaic County",
    towns: [{ name: "Paterson", slug: "inherited-property-paterson-nj" }],
  },
];

export default function ServiceAreas() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center mb-4">Serving Central &amp; North Jersey</h2>
        <p className="text-center text-remax-slate/80 max-w-3xl mx-auto mb-10">
          This isn&apos;t a territory on a map to me — my office is in Freehold, I live in Nutley,
          I own property in Belleville and Elizabeth, and I&apos;m in Hudson County every week.
          These are the communities where I work:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COUNTY_CLUSTERS.map(({ county, towns }) => (
            <div key={county} className="border border-remax-slate/15 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-remax-slate/60 uppercase tracking-wide mb-3">{county}</h3>
              <ul className="space-y-2">
                {towns.map(({ name, slug, note }) => (
                  <li key={slug}>
                    <Link
                      href={`/${slug}`}
                      className="text-remax-blue font-medium hover:underline"
                    >
                      {name}
                    </Link>
                    {note && <span className="text-xs text-remax-slate/50 ml-2">· {note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-remax-slate/60 mt-8">
          Don&apos;t see your town? I work throughout Central and North Jersey —{" "}
          <Link href="/contact" className="text-remax-blue font-semibold hover:underline">
            reach out
          </Link>{" "}
          and I&apos;ll tell you honestly if I&apos;m the right fit for your area.
        </p>
      </div>
    </section>
  );
}
