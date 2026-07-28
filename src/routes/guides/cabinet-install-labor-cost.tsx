import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { buildQuoteGuideHead } from "@/lib/guides/quote-guide-head";

const PATH = "/guides/cabinet-install-labor-cost";

const FAQS = [
  {
    q: "How much does labor cost to install kitchen cabinets?",
    a: "Professional cabinet installation typically runs $80-$180 per cabinet box (base or wall), or $50-$120 per linear foot. A typical 10x12 kitchen with 20-25 cabinets costs $1,600-$4,500 in labor alone. Rates are higher in major metros and for custom/heavy cabinets.",
  },
  {
    q: "What is included in cabinet installation labor?",
    a: "Standard labor covers: unpacking, assembly (if RTA), leveling and shimming, securing to studs/blocking, attaching doors/drawers, hardware installation, filler strips, crown molding (if simple), and cleanup. Electrical, plumbing, countertop templating, and demolition are usually separate.",
  },
  {
    q: "Does cabinet type affect installation labor cost?",
    a: "Yes. RTA (ready-to-assemble) adds assembly time ($20-$50/box). Custom cabinets are heavier, require more precision, and often need 2-person crews (adding 20-40% labor vs stock). Frameless/Euro boxes need tighter tolerances. Tall pantry and oven cabinets take longer per unit.",
  },
  {
    q: "Are there extra labor charges I should expect?",
    a: "Common adders: demolition/removal of old cabinets ($300-$800), wall repair/prep ($200-$600), shimming uneven floors/walls, custom filler panels, crown/light rail installation ($8-$15/lf), hardware upgrades, and permit fees if structural work is involved.",
  },
  {
    q: "How can I compare cabinet installation quotes fairly?",
    a: "Get line-item bids showing: per-box or per-linear-foot rate, number of boxes, assembly inclusion, demolition, fillers, moldings, hardware, disposal, and timeline. Use CostReno's quote analyzer to benchmark labor rates against your local market.",
  },
];

export const Route = createFileRoute("/guides/cabinet-install-labor-cost")({
  component: CabinetLaborGuide,
  head: () =>
    buildQuoteGuideHead({
      path: PATH,
      metaTitle: "How much does labor cost to install cabinets? (2026)",
      metaDescription:
        "Cabinet installation labor rates per box, per linear foot, and by kitchen size. Includes RTA assembly, custom premiums, hidden fees, and how to compare installer quotes.",
      headline: "How much does labor cost to install cabinets?",
      faqs: FAQS,
    }),
});

function CabinetLaborGuide() {
  return (
    <GuideArticle
      title="How much does labor cost to install cabinets?"
      description="Professional cabinet installation runs $80-$180 per box ($50-$120/linear foot). A typical kitchen totals $1,600-$4,500 in labor. Custom, RTA assembly, and local labor rates move the needle."
      lastUpdated="July 28, 2026"
      cluster={{ label: "Kitchen costs", href: "/topics/kitchen" }}
      faqs={FAQS}
      related={[
        { title: "Kitchen remodel cost guide", href: "/guides/kitchen-remodel" },
        { title: "Kitchen quote review checklist", href: "/guides/kitchen-quote-review" },
        {
          title: "Is $30,000 enough for a kitchen remodel?",
          href: "/guides/is-30k-enough-for-kitchen-remodel",
        },
        {
          title: "How much should quartz countertops cost?",
          href: "/guides/quartz-countertop-cost",
        },
        { title: "Analyze your kitchen quote", href: "/quote-analyzer" },
        { title: "Compare cabinet bids side by side", href: "/compare-quotes" },
      ]}
    >
      <p className="mb-6">
        Cabinet installation is one of the most labor-sensitive line items in a kitchen remodel.
        Labor typically represents <strong>15-25% of total cabinet cost</strong> (or 8-15% of the
        full project budget). Rates vary by cabinet type, kitchen complexity, and your metro area&apos;s
        labor index.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">
        Quick reference: labor rates (2026 national)
      </h2>
      <table className="w-full text-sm mb-6 border border-border rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-muted/30 border-b border-border">
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Pricing method
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Low
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Mid
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              High
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Per cabinet box</td>
            <td className="px-4 py-3 text-muted-foreground">$60</td>
            <td className="px-4 py-3 text-ink">$110</td>
            <td className="px-4 py-3 text-muted-foreground">$180</td>
            <td className="px-4 py-3 text-muted-foreground">Stock/semi-custom, standard install</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Per linear foot</td>
            <td className="px-4 py-3 text-muted-foreground">$40</td>
            <td className="px-4 py-3 text-ink">$75</td>
            <td className="px-4 py-3 text-muted-foreground">$120</td>
            <td className="px-4 py-3 text-muted-foreground">Includes base + wall run</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">RTA assembly + install</td>
            <td className="px-4 py-3 text-muted-foreground">$90</td>
            <td className="px-4 py-3 text-ink">$140</td>
            <td className="px-4 py-3 text-muted-foreground">$220</td>
            <td className="px-4 py-3 text-muted-foreground">Adds $20-$50/box for assembly</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Custom / frameless</td>
            <td className="px-4 py-3 text-muted-foreground">$130</td>
            <td className="px-4 py-3 text-ink">$190</td>
            <td className="px-4 py-3 text-muted-foreground">$300+</td>
            <td className="px-4 py-3 text-muted-foreground">Heavier, tighter tolerances, 2-person</td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium text-ink">Full kitchen (20-25 boxes)</td>
            <td className="px-4 py-3 text-muted-foreground">$1,600</td>
            <td className="px-4 py-3 text-ink">$2,800</td>
            <td className="px-4 py-3 text-muted-foreground">$5,000+</td>
            <td className="px-4 py-3 text-muted-foreground">Labor only, no demo</td>
          </tr>
        </tbody>
      </table>

      <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 mb-6">
        <p className="text-xs font-semibold text-accent mb-2">Pro tip</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Many cabinet suppliers offer &quot;delivered and installed&quot; pricing. Ask for the
          install portion broken out separately so you can benchmark it. A supplier&apos;s installer
          may not be the best value. Third-party installers often charge less for the same work.
        </p>
      </div>

      <h2 className="font-display text-xl font-bold text-ink pt-4">
        What drives cabinet labor cost up or down
      </h2>
      <ul className="space-y-3 text-sm text-muted-foreground mb-6 list-disc list-inside">
        <li>
          <strong>Cabinet type:</strong> RTA assembly adds time. Custom/heavy boxes need 2-person
          crews. Frameless requires precise alignment.
        </li>
        <li>
          <strong>Kitchen layout complexity:</strong> Islands, peninsula, tall pantry cabinets, oven
          towers, and angled corners take longer per box.
        </li>
        <li>
          <strong>Wall/floor condition:</strong> Uneven floors, bowed walls, or missing blocking
          require shimming, scribing, and repair (often $200-$600 extra).
        </li>
        <li>
          <strong>Finish work:</strong> Crown molding ($8-$15/lf), light rail, custom fillers, and
          decorative end panels add skilled trim time.
        </li>
        <li>
          <strong>Demo and disposal:</strong> Removing old cabinets: $300-$800 depending on volume
          and dump fees.
        </li>
        <li>
          <strong>Location:</strong> Labor multipliers from CostReno city data: NYC/SF ~1.35x,
          Dallas/Houston ~1.0x, Midwest ~0.9x national baseline.
        </li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">
        Typical labor scope checklist (verify each line item)
      </h2>
      <table className="w-full text-sm mb-6 border border-border rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-muted/30 border-b border-border">
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Task
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Usually included
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Often extra
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Unpack and inspect</td>
            <td className="px-4 py-3 text-muted-foreground">Yes</td>
            <td className="px-4 py-3 text-muted-foreground">n/a</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">RTA assembly</td>
            <td className="px-4 py-3 text-muted-foreground">Sometimes</td>
            <td className="px-4 py-3 text-muted-foreground">Often $20-$50/box</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Level, shim, secure</td>
            <td className="px-4 py-3 text-muted-foreground">Yes</td>
            <td className="px-4 py-3 text-muted-foreground">n/a</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Door/drawer install and adjust</td>
            <td className="px-4 py-3 text-muted-foreground">Yes</td>
            <td className="px-4 py-3 text-muted-foreground">n/a</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Hardware (knobs/pulls)</td>
            <td className="px-4 py-3 text-muted-foreground">Basic</td>
            <td className="px-4 py-3 text-muted-foreground">Premium hardware</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Filler strips</td>
            <td className="px-4 py-3 text-muted-foreground">Standard</td>
            <td className="px-4 py-3 text-muted-foreground">Custom/scribe</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Crown molding / light rail</td>
            <td className="px-4 py-3 text-muted-foreground">n/a</td>
            <td className="px-4 py-3 text-muted-foreground">$8-$15/lf</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Demo old cabinets</td>
            <td className="px-4 py-3 text-muted-foreground">n/a</td>
            <td className="px-4 py-3 text-muted-foreground">$300-$800</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Wall repair / blocking</td>
            <td className="px-4 py-3 text-muted-foreground">n/a</td>
            <td className="px-4 py-3 text-muted-foreground">$200-$600</td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium text-ink">Disposal / dump fees</td>
            <td className="px-4 py-3 text-muted-foreground">n/a</td>
            <td className="px-4 py-3 text-muted-foreground">$100-$300</td>
          </tr>
        </tbody>
      </table>

      <h2 className="font-display text-xl font-bold text-ink pt-4">
        How to compare cabinet installation quotes
      </h2>
      <ol className="space-y-3 text-sm text-muted-foreground mb-6 list-decimal list-inside">
        <li>Request per-box and per-linear-foot rates in writing.</li>
        <li>Confirm RTA assembly is included or listed separately.</li>
        <li>Ask for line items: demo, fillers, crown, hardware, disposal, wall prep.</li>
        <li>Verify crew size and timeline (1-day vs 2-day affects labor hours).</li>
        <li>Check licensing, insurance, and references for cabinet-specific work.</li>
        <li>
          Run each quote through{" "}
          <a href="/quote-analyzer" className="text-primary underline">
            CostReno quote analyzer
          </a>{" "}
          for local labor benchmarking.
        </li>
      </ol>

      <h2 className="font-display text-xl font-bold text-ink pt-4">DIY vs pro: when to hire</h2>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        Competent DIYers can install stock cabinets if walls are flat, floors level, and they have
        helpers for uppers. Risks: misaligned doors, sagging uppers, damaged boxes, voided
        manufacturer warranties. For custom, frameless, or heavy cabinets, hire a pro. The 20-40%
        labor premium buys alignment, warranty protection, and single-day completion.
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        <a
          href="/quote-analyzer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition shadow-sm"
        >
          Analyze a cabinet install quote
        </a>
        <a
          href="/compare-quotes"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-muted transition"
        >
          Compare installer bids
        </a>
        <a
          href="/guides/kitchen-quote-review"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-muted transition"
        >
          Full kitchen quote review checklist
        </a>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Have a cabinet quote in hand? Upload it to the{" "}
        <a href="/quote-analyzer" className="text-primary underline">
          quote analyzer
        </a>{" "}
        for a line-by-line review against local market rates, or use the{" "}
        <a href="/guides/kitchen-quote-review" className="text-primary underline">
          kitchen quote review checklist
        </a>{" "}
        to verify scope completeness before you sign.
      </p>
    </GuideArticle>
  );
}
