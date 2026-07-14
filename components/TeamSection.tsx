import Image from "next/image";
import { Suspense } from "react";
import TeamStats from "./TeamStats";

/**
 * "The Team Behind Your Sale" — Borrero Group awards graphic plus the
 * Zillow-style trust bar. Shared by the mailer landing pages and the
 * inherited-property pillar page.
 */
export default function TeamSection() {
  return (
    <section className="space-y-4 text-center">
      <h2 className="text-2xl font-bold text-gray-900">The Team Behind Your Sale</h2>
      <p className="text-gray-500 max-w-xl mx-auto">
        Eight of us, one process — NJ Realtors<span className="align-super text-[10px]">®</span> Circle of Excellence Platinum performance every year since 2017.
      </p>
      <Image
        src="/TeamDiamond.png"
        alt="The Borrero Group at RE/MAX — NJ Realtors Circle of Excellence Platinum Award winners, every year since 2017"
        width={1672}
        height={941}
        sizes="(max-width: 896px) 100vw, 896px"
        className="rounded-2xl mx-auto w-full h-auto"
      />
      <Image
        src="/sold-homes-map.png"
        alt="Map of homes we've sold across New Jersey — North Jersey, Central Jersey, the Shore, and South Jersey, from $439K starter homes to a $3.2M Colts Neck estate. 750+ homes sold in 28+ cities and towns."
        width={1672}
        height={941}
        sizes="(max-width: 896px) 100vw, 896px"
        className="rounded-2xl mx-auto w-full h-auto"
      />
      <Suspense fallback={null}>
        <TeamStats />
      </Suspense>
    </section>
  );
}
