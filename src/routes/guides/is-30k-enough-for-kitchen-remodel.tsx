import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { buildQuoteGuideHead } from "@/lib/guides/quote-guide-head";

const PATH = "/guides/is-30k-enough-for-kitchen-remodel";

const FAQS = [
  {
    q: "Is $30,000 enough for a kitchen remodel?",
    a: "It depends on scope. $30,000 covers a cosmetic refresh or a small-to-mid-range remodel with stock cabinets and laminate counters. It typically will not cover a full gut renovation with layout changes, custom cabinets, or premium materials.",
  },
  {
    q: "What can you get for $30,000 in a kitchen remodel?",
    a: "Typical scope: refacing or replacing cabinets with stock/semi-custom lines, new laminate or entry-level quartz countertops, mid-range appliances, new flooring (LVP/tile), paint, lighting, and hardware. Layout stays the same; plumbing and electrical move minimally.",
  },
  {
    q: "What pushes a kitchen remodel over $30,000?",
    a: "Custom cabinets, stone countertops (quartz/granite/marble), moving walls or plumbing, structural changes, high-end appliances, premium flooring, and permit/engineering fees. Labor in high-cost metros also adds 15–30% vs. national averages.",
  },
  {
    q: "Should I get multiple quotes for a $30k kitchen budget?",
    a: "Yes. At this budget, line-item comparison is critical. One bid may include demolition and disposal; another may treat them as allowances. Use CostReno's quote analyzer to spot missing scope and compare apples to apples.",
  },
  {
    q: "Can I do a kitchen remodel in phases to stay near $30k?",
    a: "Yes. Common phasing: Phase 1 — cabinets, counters, paint, hardware. Phase 2 — flooring, backsplash, lighting. Phase 3 — appliance upgrades. Keep the footprint fixed to avoid re-permitting.",
  },
];

export const Route = createFileRoute("/guides/is-30k-enough-for-kitchen-remodel")({
  component: Is30kEnoughGuide,
  head: () =>
    buildQuoteGuideHead({
      path: PATH,
      metaTitle: "Is $30,000 enough for a kitchen remodel?",
      metaDescription:
        "Find out what a $30k kitchen budget covers — scope, materials, labor, and hidden costs. Compare against national ranges and local pricing before you hire.",
      headline: "Is $30,000 enough for a kitchen remodel?",
      faqs: FAQS,
    }),
});

function Is30kEnoughGuide() {
  return (
    <GuideArticle
      title="Is $30,000 enough for a kitchen remodel?"
      description="A $30k budget works for cosmetic refreshes and modest mid-range remodels with stock cabinets. It falls short for full gut renovations, layout changes, or premium materials."
      lastUpdated="July 28, 2026"
      cluster={{ label: "Kitchen costs", href: "/topics/kitchen" }}
      faqs={FAQS}
      related={[
        { title: "Kitchen remodel cost guide", href: "/guides/kitchen-remodel" },
        { title: "Kitchen quote review checklist", href: "/guides/kitchen-quote-review" },
        { title: "Quartz vs granite countertops", href: "/guides/quartz-vs-granite-countertops" },
        { title: "Analyze your kitchen quote", href: "/quote-analyzer" },
        { title: "Compare multiple kitchen bids", href: "/compare-quotes" },
      ]}
    >
      <p className="mb-6">
        The short answer: <strong>it depends on scope and location.</strong> A $30,000 budget can deliver a
        solid cosmetic refresh or a modest mid-range remodel if you keep the existing layout. It typically
        will not cover a full gut renovation with structural changes, custom cabinetry, or premium stone
        surfaces — especially in high-cost metros where labor runs 15–30% above national averages.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">What $30,000 typically covers</h2>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        Based on national remodeling data (CostReno kitchen category range: $15,000–$55,000), here is
        where a $30k budget lands:
      </p>
      <ul className="space-y-3 text-sm text-muted-foreground mb-6 list-disc list-inside">
        <li><strong>Cosmetic refresh ($8k–$18k):</strong> Paint, hardware, backsplash, lighting, countertop resurfacing, appliance facelift.</li>
        <li><strong>Mid-range remodel with stock cabinets ($20k–$35k):</strong> New stock/semi-custom cabinets, laminate or entry-level quartz counters, mid-range appliances, LVP/tile flooring, paint, fixtures.</li>
        <li><strong>Full gut renovation ($45k–$90k+):</strong> Layout changes, custom cabinets, premium counters, high-end appliances, plumbing/electrical moves — exceeds $30k in most markets.</li>
      </ul>

      <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 mb-6">
        <p className="text-xs font-semibold text-accent mb-2">Pro tip</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Allocate 15–20% of your budget ($4,500–$6,000) as a contingency. Kitchen remodels frequently
          uncover hidden issues — water damage, outdated wiring, asbestos — that must be addressed before
          close-in.
        </p>
      </div>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Where the money goes (typical mid-range split)</h2>
      <table className="w-full text-sm mb-6 border border-border rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-muted/30 border-b border-border">
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Category</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">% of Budget</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">At $30k</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Cabinets</td>
            <td className="px-4 py-3 text-muted-foreground">30–40%</td>
            <td className="px-4 py-3 text-ink">$9,000–$12,000</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Countertops</td>
            <td className="px-4 py-3 text-muted-foreground">10–15%</td>
            <td className="px-4 py-3 text-ink">$3,000–$4,500</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Appliances</td>
            <td className="px-4 py-3 text-muted-foreground">10–15%</td>
            <td className="px-4 py-3 text-ink">$3,000–$4,500</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Labor (install, demo, trades)</td>
            <td className="px-4 py-3 text-muted-foreground">20–30%</td>
            <td className="px-4 py-3 text-ink">$6,000–$9,000</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Flooring</td>
            <td className="px-4 py-3 text-muted-foreground">5–8%</td>
            <td className="px-4 py-3 text-ink">$1,500–$2,400</td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium text-ink">Other (permits, design, contingency)</td>
            <td className="px-4 py-3 text-muted-foreground">5–10%</td>
            <td className="px-4 py-3 text-ink">$1,500–$3,000</td>
          </tr>
        </tbody>
      </table>

      <h2 className="font-display text-xl font-bold text-ink pt-4">How to stretch a $30k budget</h2>
      <ul className="space-y-3 text-sm text-muted-foreground mb-6 list-disc list-inside">
        <li><strong>Keep the footprint:</strong> Moving plumbing or walls adds $5k–$15k+ in labor and permits.</li>
        <li><strong>Choose stock or semi-custom cabinets:</strong> Custom cabinets alone can exceed a $30k total budget.</li>
        <li><strong>Pick entry-level quartz or quality laminate:</strong> Saves $2k–$5k vs. premium stone.</li>
        <li><strong>Buy appliances on sale / package deals:</strong> Holiday weekends often yield 10–20% off.</li>
        <li><strong>DIY demo, paint, or hardware install:</strong> Can free $2k–$4k for materials.</li>
        <li><strong>Phase non-essentials:</strong> Backsplash, lighting, and flooring can wait.</li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Local labor matters</h2>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        Labor multipliers shift the same scope significantly. A $30k project in a low-cost metro may
        equate to a $22k scope in San Francisco or New York. Use the
        <a href="/estimate?project=kitchen" className="text-primary underline hover:no-underline">CostReno kitchen estimator</a>
        with your ZIP code to see a localized range before collecting bids.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Next step: validate your quotes</h2>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        Once you have bids, run them through CostReno tools to catch missing scope and benchmark pricing:
      </p>
      <div className="flex flex-wrap gap-3 mb-6">
        <a
          href="/quote-analyzer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition shadow-sm"
        >
          Analyze a kitchen quote
        </a>
        <a
          href="/compare-quotes"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-muted transition"
        >
          Compare kitchen bids
        </a>
        <a
          href="/estimate?project=kitchen"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-muted transition"
        >
          Get local cost range
        </a>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Have a contractor quote in hand? Upload it to the <a href="/quote-analyzer" className="text-primary underline">quote analyzer</a>
        for a line-by-line review against local market ranges, or use <a href="/compare-quotes" className="text-primary underline">compare quotes</a>
        to see two bids side by side with composite scores and red-flag detection.
      </p>
    </GuideArticle>
  );
}