import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import {
  ROOF_CLUSTER_RELATED,
  ROOF_TOPIC,
  getReviewedRoofCityLinks,
  getRoofCityLinks,
} from "@/lib/guides/roof-cluster";
import { buildRoofGuideHead } from "@/lib/guides/roof-guide-head";

const PATH = "/guides/roof-replacement-cost-by-city";

const FAQS = [
  {
    q: "How accurate are city roof cost pages?",
    a: "Locally reviewed city pages include market-specific labor, climate, and permit context. Other city pages use regional labor multipliers and general guidance. Both are planning tools, not fixed bids.",
  },
  {
    q: "What if my city is not listed?",
    a: "Use the closest metro in your state or run our roof estimator with your ZIP code. We expand city coverage over time.",
  },
  {
    q: "Should I still get three contractor quotes?",
    a: "Yes. City ranges help you set a budget. Contractor quotes reflect your roof size, pitch, access, and material selections after a site visit.",
  },
];

export const Route = createFileRoute("/guides/roof-replacement-cost-by-city")({
  component: RoofCostByCityGuide,
  head: () =>
    buildRoofGuideHead({
      path: PATH,
      metaTitle: "Roof replacement cost by city",
      metaDescription:
        "Browse roof replacement cost ranges for major U.S. cities. Open local pages for labor context, permits, and material guidance before you hire.",
      headline: "Roof replacement cost by city",
      breadcrumbTitle: "Roof replacement cost by city",
      faqs: FAQS,
    }),
});

function RoofCostByCityGuide() {
  const cities = getRoofCityLinks();
  const reviewed = getReviewedRoofCityLinks();

  return (
    <GuideArticle
      title="Roof replacement cost by city"
      description="Local labor, climate, and housing stock change roof quotes block by block. Start with your metro, then compare contractor bids."
      lastUpdated="July 27, 2026"
      cluster={ROOF_TOPIC}
      faqs={FAQS}
      related={ROOF_CLUSTER_RELATED.filter((g) => g.href !== PATH).slice(0, 6)}
    >
      <p>
        National averages hide real differences between metros. A roof in Austin faces different
        labor pressure and hail exposure than one in Cleveland or Seattle. CostReno publishes city
        pages that translate regional data into planning ranges you can use before requesting bids.
      </p>

      {reviewed.length > 0 && (
        <>
          <h2 className="font-display text-xl font-bold text-ink pt-2">
            Locally reviewed city pages
          </h2>
          <p>
            These pages include hand-reviewed local factors and appear in our sitemap for search.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 not-prose">
            {reviewed.map((city) => (
              <li key={city.href}>
                <a
                  href={city.href}
                  className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3 text-sm hover:border-primary/30 transition"
                >
                  <span className="font-medium text-ink">{city.label}</span>
                  <span className="text-muted-foreground text-xs">{city.range}</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="font-display text-xl font-bold text-ink pt-4">Major U.S. metros</h2>
      <p>
        Indicative ranges below use regional labor multipliers on national material baselines. Open
        any city for FAQs, permit notes, and links to related guides.
      </p>

      <div className="overflow-x-auto rounded-xl border border-border bg-white not-prose">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left">
              <th className="px-4 py-3 font-semibold text-ink">City</th>
              <th className="px-4 py-3 font-semibold text-ink">Indicative range</th>
              <th className="px-4 py-3 font-semibold text-ink">Status</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((row) => (
              <tr key={row.href} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3">
                  <a href={row.href} className="font-medium text-primary hover:underline">
                    {row.label}
                  </a>
                </td>
                <td className="px-4 py-3 text-ink whitespace-nowrap">{row.range}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.reviewed ? "Locally reviewed" : "Regional guidance"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Next steps</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Run a{" "}
          <a href="/estimate?project=roof" className="text-primary hover:underline">
            ZIP-based roof estimate
          </a>{" "}
          for a range tied to your address.
        </li>
        <li>
          Compare state trends in our{" "}
          <a href="/guides/roof-replacement-cost-by-state" className="text-primary hover:underline">
            roof cost by state guide
          </a>
          .
        </li>
        <li>
          When quotes arrive, use our{" "}
          <a href="/guides/roof-quote-review" className="text-primary hover:underline">
            roof quote review checklist
          </a>{" "}
          or{" "}
          <a href="/quote-analyzer" className="text-primary hover:underline">
            quote analyzer
          </a>
          .
        </li>
      </ul>
    </GuideArticle>
  );
}
