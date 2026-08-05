import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { PLANNER_FAQS, PLANNER_PROJECTS, formatMoneyRange } from "@/lib/project-planner";
import {
  DEFAULT_OG_IMAGE,
  absoluteUrl,
  buildArticleSchema,
  buildBreadcrumbList,
  buildFaqSchema,
} from "@/lib/seo";

const PATH = "/guides/home-renovation-project-planner";
const DATE = "2026-08-05";

const RELATED = [
  { title: "Open the project planner tool", href: "/project-planner" },
  { title: "Cost estimator", href: "/estimate" },
  { title: "Quote analyzer", href: "/quote-analyzer" },
  { title: "Roof replacement cost guide", href: "/guides/roof-replacement" },
  { title: "Kitchen remodel cost guide", href: "/guides/kitchen-remodel" },
  { title: "How to compare contractor quotes", href: "/guides/how-to-compare-contractor-quotes" },
];

export const Route = createFileRoute("/guides/home-renovation-project-planner")({
  component: HomeRenovationPlannerGuide,
  head: () => ({
    meta: [
      {
        title: "Home renovation project planner guide (2026) | CostReno",
      },
      {
        name: "description",
        content:
          "Learn how to plan a home renovation in the right order. Budget ranges for roof, kitchen, bathroom, HVAC, and more, plus a free interactive planner.",
      },
      {
        property: "og:title",
        content: "Home renovation project planner guide (2026) | CostReno",
      },
      {
        property: "og:description",
        content:
          "A homeowner guide to sequencing renovations, setting a planning budget, and avoiding rework before you hire.",
      },
      { property: "og:url", content: absoluteUrl(PATH) },
      { property: "og:type", content: "article" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl(PATH) }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          buildArticleSchema({
            headline: "Home renovation project planner guide",
            description:
              "How to plan renovations in the right order with budget ranges and next steps.",
            path: PATH,
            datePublished: DATE,
            dateModified: DATE,
          }),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          buildBreadcrumbList([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: "Home renovation project planner", path: PATH },
          ]),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(buildFaqSchema([...PLANNER_FAQS])),
      },
    ],
  }),
});

function HomeRenovationPlannerGuide() {
  return (
    <GuideArticle
      title="Home renovation project planner"
      description="A practical order of work, planning budgets, and checklist for homeowners who want fewer surprises before hiring contractors."
      lastUpdated="August 5, 2026"
      faqs={[...PLANNER_FAQS]}
      related={RELATED}
    >
      <p>
        A strong renovation plan answers three questions early: what work you need, roughly what it
        costs, and which order avoids tearing out finished work. CostReno&apos;s{" "}
        <a href="/project-planner" className="text-primary underline-offset-2 hover:underline">
          free project planner
        </a>{" "}
        walks through those steps in minutes.
      </p>

      <div className="not-prose rounded-xl border border-border bg-white p-5 my-2">
        <p className="text-sm font-semibold text-ink mb-1">Start with the interactive tool</p>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Select projects, add optional ZIP details, and get a planning budget with suggested order.
        </p>
        <a
          href="/project-planner"
          className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition"
        >
          Open project planner
        </a>
      </div>

      <h2 className="font-display text-xl font-bold text-ink pt-2">
        Suggested renovation order
      </h2>
      <ol className="list-decimal pl-5 space-y-3">
        <li>
          <strong className="text-ink">Protect the building envelope.</strong> Roof and windows
          first when those systems are failing. Leaks destroy interior finishes.
        </li>
        <li>
          <strong className="text-ink">Update major systems.</strong> HVAC, plumbing, and electrical
          rough-in before closing walls or installing final cabinetry.
        </li>
        <li>
          <strong className="text-ink">Remodel kitchens and baths.</strong> These are high-disruption
          rooms with long material lead times.
        </li>
        <li>
          <strong className="text-ink">Finish surfaces.</strong> Flooring and paint last (or nearly
          last) so new finishes stay clean.
        </li>
        <li>
          <strong className="text-ink">Add outdoor and energy upgrades.</strong> Decks and solar
          usually follow after the roof and exterior plan are clear.
        </li>
      </ol>

      <h2 className="font-display text-xl font-bold text-ink pt-2">
        National planning ranges by project
      </h2>
      <p>
        These are planning bands, not bids. Local labor, material choices, and scope move the
        number. Use the{" "}
        <a href="/estimate" className="text-primary underline-offset-2 hover:underline">
          cost estimator
        </a>{" "}
        with your ZIP for a tighter range.
      </p>
      <div className="not-prose overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left">
              <th className="px-4 py-3 font-semibold text-muted-foreground">Project</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Typical range</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {PLANNER_PROJECTS.map((p) => (
              <tr key={p.id} className="border-b border-border/50 last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                <td className="px-4 py-3 text-ink">
                  {formatMoneyRange(p.nationalLow, p.nationalHigh)}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                  {p.timeline}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-xl font-bold text-ink pt-2">
        Checklist before you hire
      </h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Write one scope list so every contractor bids the same work</li>
        <li>Get at least three written quotes</li>
        <li>Confirm permits, warranties, and payment schedule in writing</li>
        <li>
          Run quotes through the{" "}
          <a href="/quote-analyzer" className="text-primary underline-offset-2 hover:underline">
            quote analyzer
          </a>{" "}
          to spot missing line items
        </li>
        <li>Keep a 10% to 15% contingency for hidden conditions</li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-2">Related CostReno tools</h2>
      <p>
        Plan first with the{" "}
        <a href="/project-planner" className="text-primary underline-offset-2 hover:underline">
          project planner
        </a>
        , refine with the{" "}
        <a href="/estimate" className="text-primary underline-offset-2 hover:underline">
          estimator
        </a>
        , then verify bids with{" "}
        <a href="/compare-quotes" className="text-primary underline-offset-2 hover:underline">
          compare quotes
        </a>
        . Browse local pricing in{" "}
        <a href="/locations" className="text-primary underline-offset-2 hover:underline">
          costs by city
        </a>
        .
      </p>
    </GuideArticle>
  );
}
