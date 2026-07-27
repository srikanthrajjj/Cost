import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import {
  ROOF_CLUSTER_RELATED,
  ROOF_TOPIC,
  getRoofStateSummaries,
} from "@/lib/guides/roof-cluster";
import { buildRoofGuideHead } from "@/lib/guides/roof-guide-head";

const PATH = "/guides/roof-replacement-cost-by-state";

const FAQS = [
  {
    q: "Why does roof replacement cost vary by state?",
    a: "Labor rates, permit fees, climate-driven material choices, and local demand all shift pricing. Coastal and high-cost metros often run above national averages, while some inland markets sit closer to baseline.",
  },
  {
    q: "Are these state ranges exact quotes?",
    a: "No. They are planning ranges based on national material baselines adjusted for typical labor multipliers in each state. Your roof size, pitch, tear-off needs, and material choice will move the final number.",
  },
  {
    q: "Where can I see city-level roof costs?",
    a: "Open a state page below or use our roof replacement cost by city guide for direct links to major metro pages.",
  },
];

export const Route = createFileRoute("/guides/roof-replacement-cost-by-state")({
  component: RoofCostByStateGuide,
  head: () =>
    buildRoofGuideHead({
      path: PATH,
      metaTitle: "Roof replacement cost by state",
      metaDescription:
        "Compare roof replacement cost ranges by U.S. state. See labor context, browse state location hubs, and link to city-level roof pricing pages.",
      headline: "Roof replacement cost by state",
      breadcrumbTitle: "Roof replacement cost by state",
      faqs: FAQS,
    }),
});

function RoofCostByStateGuide() {
  const states = getRoofStateSummaries();

  return (
    <GuideArticle
      title="Roof replacement cost by state"
      description="Roof pricing follows local labor, climate, and permit patterns. Use this state overview to set expectations before you collect bids."
      lastUpdated="July 27, 2026"
      cluster={ROOF_TOPIC}
      faqs={FAQS}
      related={ROOF_CLUSTER_RELATED.filter((g) => g.href !== PATH).slice(0, 6)}
    >
      <p>
        A full roof replacement rarely prices the same in every state. Labor is the biggest swing
        factor, but climate also pushes material choices (impact-rated shingles, ventilation, ice
        and water shield) that change totals. CostReno adjusts national baselines using labor
        multipliers from metros we track, then links you to deeper city and state pages.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-2">How to use this table</h2>
      <p>
        Indicative ranges reflect a typical asphalt shingle replacement on a mid-size home in each
        state&apos;s largest tracked metro, with labor adjusted for that market. They are planning
        ranges, not contractor bids. For your home, run our{" "}
        <a href="/estimate?project=roof" className="text-primary hover:underline">
          roof estimator
        </a>{" "}
        or open a city page for locally reviewed detail.
      </p>

      <div className="overflow-x-auto rounded-xl border border-border bg-white not-prose">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left">
              <th className="px-4 py-3 font-semibold text-ink">State</th>
              <th className="px-4 py-3 font-semibold text-ink">Indicative range</th>
              <th className="px-4 py-3 font-semibold text-ink">Labor context</th>
              <th className="px-4 py-3 font-semibold text-ink">Cities</th>
            </tr>
          </thead>
          <tbody>
            {states.map((row) => (
              <tr key={row.stateSlug} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3">
                  <a href={row.locationsHref} className="font-medium text-primary hover:underline">
                    {row.state}
                  </a>
                  <span className="text-muted-foreground"> ({row.stateAbbr})</span>
                </td>
                <td className="px-4 py-3 text-ink whitespace-nowrap">{row.indicativeRange}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.laborSummary}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.cityCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-xl font-bold text-ink pt-4">What drives state-level differences</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong className="text-ink">Labor and demand:</strong> Busy markets with limited crews
          often quote higher, especially after storm seasons.
        </li>
        <li>
          <strong className="text-ink">Climate and code:</strong> Wind, hail, and snow regions may
          require upgraded underlayment, fastening patterns, or ventilation that add cost.
        </li>
        <li>
          <strong className="text-ink">Permits and inspections:</strong> Permit fees and inspection
          timelines vary by municipality. See our{" "}
          <a href="/guides/roof-permits" className="text-primary hover:underline">
            roof permits guide
          </a>{" "}
          for what to confirm before work starts.
        </li>
        <li>
          <strong className="text-ink">Material choice:</strong> Asphalt, metal, and tile sit at
          different price tiers. Compare options in our{" "}
          <a href="/guides/metal-vs-asphalt-roof" className="text-primary hover:underline">
            metal vs asphalt guide
          </a>
          .
        </li>
      </ul>

      <p>
        Need metro-level detail? Browse{" "}
        <a href="/guides/roof-replacement-cost-by-city" className="text-primary hover:underline">
          roof replacement cost by city
        </a>{" "}
        or open{" "}
        <a href="/locations" className="text-primary hover:underline">
          all location pages
        </a>
        .
      </p>
    </GuideArticle>
  );
}
