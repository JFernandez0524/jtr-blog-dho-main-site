/**
 * "Homes We've Sold Across New Jersey" — self-contained SVG map (no external
 * map tiles: keeps the strict CSP intact and avoids Google/Zillow branding
 * terms). Markers are Jose's actual sold towns (see project memory
 * user_anchor_towns); price callouts are real standout sales he supplied.
 * Coordinates are a simple equirectangular projection of each town's lat/lng
 * onto a stylized NJ silhouette — add a marker here whenever he closes in a
 * new town.
 */

const SOLD_TOWNS: { name: string; x: number; y: number }[] = [
  { name: "Nutley", x: 227, y: 121 },
  { name: "Belleville", x: 228, y: 126 },
  { name: "Bloomfield", x: 223, y: 124 },
  { name: "West Orange", x: 215, y: 125 },
  { name: "East Orange", x: 220, y: 132 },
  { name: "Irvington", x: 216, y: 138 },
  { name: "Passaic", x: 231, y: 114 },
  { name: "Woodland Park", x: 222, y: 108 },
  { name: "Teaneck", x: 248, y: 106 },
  { name: "Carlstadt", x: 237, y: 118 },
  { name: "Garfield", x: 234, y: 110 },
  { name: "Jersey City", x: 239, y: 139 },
  { name: "Bayonne", x: 234, y: 150 },
  { name: "West New York", x: 248, y: 128 },
  { name: "Union City", x: 247, y: 129 },
  { name: "Union Township", x: 212, y: 145 },
  { name: "Cranford", x: 206, y: 152 },
  { name: "Rahway", x: 209, y: 162 },
  { name: "Westfield", x: 199, y: 152 },
  { name: "Hillside", x: 216, y: 144 },
  { name: "Clark", x: 205, y: 156 },
  { name: "Garwood", x: 203, y: 154 },
  { name: "Perth Amboy", x: 211, y: 181 },
  { name: "Parlin", x: 205, y: 191 },
  { name: "Manalapan", x: 201, y: 224 },
  { name: "Somerset", x: 178, y: 183 },
  { name: "Boonton Township", x: 188, y: 99 },
];

// Standout sale prices (Jose's numbers) — placed near clusters, not tied to
// a specific named town on purpose.
const PRICE_PILLS: { label: string; x: number; y: number; toX: number; toY: number }[] = [
  { label: "$1.3M", x: 170, y: 92, toX: 244, toY: 106 },
  { label: "$850K", x: 148, y: 150, toX: 195, toY: 152 },
  { label: "$439K", x: 152, y: 196, toX: 207, toY: 181 },
  { label: "$3.2M", x: 145, y: 232, toX: 197, toY: 224 },
];

// Simplified NJ silhouette (equirectangular projection, same scale as markers)
const NJ_OUTLINE =
  "M147,18 L84,93 L74,146 L137,237 L86,288 L34,333 L22,384 L88,432 L112,482 " +
  "L188,402 L236,325 L246,262 L253,190 L212,183 L221,156 L246,144 L262,83 Z";

export default function SoldMap() {
  return (
    <figure className="max-w-sm mx-auto">
      <svg
        viewBox="0 0 280 500"
        role="img"
        aria-label={`Map of New Jersey showing towns where The Borrero Group has sold homes: ${SOLD_TOWNS.map((t) => t.name).join(", ")}`}
        className="w-full h-auto"
      >
        <path
          d={NJ_OUTLINE}
          fill="#EBF1F8"
          stroke="#003DA5"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {PRICE_PILLS.map(({ label, x, y, toX, toY }) => (
          <g key={label}>
            <line x1={x + 24} y1={y} x2={toX} y2={toY} stroke="#DC1C2E" strokeWidth="1" strokeDasharray="2 2" />
            <rect x={x - 26} y={y - 10} width="52" height="20" rx="10" fill="#DC1C2E" />
            <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff">
              {label}
            </text>
          </g>
        ))}
        {SOLD_TOWNS.map(({ name, x, y }) => (
          <circle key={name} cx={x} cy={y} r="4.5" fill="#003DA5" stroke="#ffffff" strokeWidth="1.5">
            <title>{`Sold in ${name}, NJ`}</title>
          </circle>
        ))}
      </svg>
      <figcaption className="text-center text-sm text-remax-slate/70 mt-3">
        Homes we&apos;ve sold across New Jersey — from <strong className="text-remax-slate">$439K</strong> starters to{" "}
        <strong className="text-remax-slate">$3.2M</strong> estates. We sell everything.
      </figcaption>
    </figure>
  );
}
