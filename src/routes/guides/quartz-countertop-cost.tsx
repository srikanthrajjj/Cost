import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, Scale, Shield, HelpCircle } from "lucide-react";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { buildQuoteGuideHead } from "@/lib/guides/quote-guide-head";

const PATH = "/guides/quartz-countertop-cost";

const FAQS = [
  {
    q: "How much do quartz countertops cost per square foot?",
    a: "Installed quartz typically runs $50-$150 per square foot. Material alone is $35-$100/sf; fabrication, edge profiles, and installation add $15-$50/sf. Premium brands (Caesarstone, Silestone, Cambria) land at the top of the range.",
  },
  {
    q: "What is the average total cost for quartz countertops in a kitchen?",
    a: "A typical kitchen (30-40 sf of countertop) costs $2,500-$6,000 installed. Large kitchens with islands, waterfall edges, or complex cuts can reach $8,000-$12,000+.",
  },
  {
    q: "Why do quartz prices vary so much between brands?",
    a: "Resin quality, pigment consistency, slab thickness (2 cm vs 3 cm), warranty length, and brand marketing all affect price. Big-name brands charge a premium for color consistency and lifetime warranties.",
  },
  {
    q: "Are there hidden costs with quartz countertops?",
    a: "Yes. Template/measurement fees ($200-$500), sink cutouts ($100-$300 each), edge profiles beyond standard eased ($10-$30/lf), backsplash material, disposal of old tops, and potential cabinet reinforcement for 3 cm slabs.",
  },
  {
    q: "How does quartz compare to granite on price?",
    a: "Overlapping ranges. Granite: $40-$100/sf installed (exotic stones go higher). Quartz: $50-$150/sf installed. Quartz has tighter price clustering; granite varies more by slab rarity.",
  },
];

export const Route = createFileRoute("/guides/quartz-countertop-cost")({
  component: QuartzCostGuide,
  head: () =>
    buildQuoteGuideHead({
      path: PATH,
      metaTitle: "How much should quartz countertops cost? (2026)",
      metaDescription:
        "Quartz countertop pricing per square foot, installed totals by kitchen size, brand tiers, hidden fees, and how to compare quotes.",
      headline: "How much should quartz countertops cost?",
      faqs: FAQS,
    }),
});

function QuartzCostGuide() {
  return (
    <GuideArticle
      title="How much should quartz countertops cost?"
      description="Installed quartz runs $50-$150/sf. A typical kitchen totals $2,500-$6,000. Brand, thickness, edge profile, and local labor drive the final price."
      lastUpdated="July 28, 2026"
      cluster={{ label: "Kitchen costs", href: "/topics/kitchen" }}
      faqs={FAQS}
      related={[
        { title: "Quartz vs granite countertops", href: "/guides/quartz-vs-granite-countertops" },
        { title: "Kitchen remodel cost guide", href: "/guides/kitchen-remodel" },
        { title: "Kitchen quote review checklist", href: "/guides/kitchen-quote-review" },
        { title: "Analyze your countertop quote", href: "/quote-analyzer" },
        { title: "Compare countertop bids", href: "/compare-quotes" },
      ]}
    >
      <p className="mb-6">
        Quartz is the most popular kitchen countertop material in the U.S. for good reason:
        durability, low maintenance, and consistent patterning. But pricing is opaque. Here is what
        you should expect to pay in 2026, broken down by component.
      </p>

      <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 mb-6">
        <p className="text-xs font-semibold text-accent mb-2">Quick reference</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$50-$150</p>
            <p className="text-muted-foreground">per sf installed</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$35-$100</p>
            <p className="text-muted-foreground">material only / sf</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$2,500-$6,000</p>
            <p className="text-muted-foreground">typical kitchen total</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">15-20%</p>
            <p className="text-muted-foreground">contingency recommended</p>
          </div>
        </div>
      </div>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Price tiers by brand level</h2>
      <table className="w-full text-sm mb-6 border border-border rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-muted/30 border-b border-border">
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Tier
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Brands
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Material / sf
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Installed / sf
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Typical kitchen (35 sf)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Budget / builder grade</td>
            <td className="px-4 py-3 text-muted-foreground">Store brands, generic importers</td>
            <td className="px-4 py-3 text-ink">$35-$55</td>
            <td className="px-4 py-3 text-ink">$50-$75</td>
            <td className="px-4 py-3 text-ink">$1,750-$2,600</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Mid-range</td>
            <td className="px-4 py-3 text-muted-foreground">MSI, Vicostone, HanStone, LG Viatera</td>
            <td className="px-4 py-3 text-ink">$55-$85</td>
            <td className="px-4 py-3 text-ink">$75-$110</td>
            <td className="px-4 py-3 text-ink">$2,600-$3,850</td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Premium</td>
            <td className="px-4 py-3 text-muted-foreground">
              Caesarstone, Silestone, Cambria, Q Premium
            </td>
            <td className="px-4 py-3 text-ink">$85-$120</td>
            <td className="px-4 py-3 text-ink">$110-$150</td>
            <td className="px-4 py-3 text-ink">$3,850-$5,250</td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium text-ink">Designer / specialty</td>
            <td className="px-4 py-3 text-muted-foreground">Dekton, Neolith, custom colors</td>
            <td className="px-4 py-3 text-ink">$100-$150+</td>
            <td className="px-4 py-3 text-ink">$130-$180+</td>
            <td className="px-4 py-3 text-ink">$4,550-$6,300+</td>
          </tr>
        </tbody>
      </table>

      <h2 className="font-display text-xl font-bold text-ink pt-4">What drives the final price</h2>
      <div className="space-y-3 text-sm text-muted-foreground mb-6">
        <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white">
          <Scale className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-ink">Slab thickness</p>
            <p>
              3 cm (1-1/4&quot;) is standard; 2 cm (3/4&quot;) saves ~10-15% on material but may need
              plywood sub-top and extra support (labor often offsets savings).
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white">
          <DollarSign className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-ink">Edge profile</p>
            <p>
              Standard eased edge included. Ogee, waterfall, mitered, or chiseled edges add $10-$30
              per linear foot. A 10-ft island with waterfall ends can add $600-$1,200.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white">
          <Shield className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-ink">Cutouts and complexity</p>
            <p>
              Each sink cutout: $100-$300. Cooktop cutout: $100-$200. Undermount sinks require more
              precision. Multiple cutouts or complex shapes (radius corners) increase fabrication
              time.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white">
          <HelpCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-ink">Backsplash</p>
            <p>
              Full-height quartz backsplash (4-6&quot; standard, or full wall) adds material and
              labor. 4&quot; splash: ~$15-$25/lf. Full wall: priced as additional countertop sf.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white">
          <Scale className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-ink">Cabinet reinforcement</p>
            <p>
              3 cm slabs weigh ~18-20 lbs/sf. Older cabinets may need plywood sub-top or frame
              reinforcement ($200-$800), often overlooked in quotes.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white">
          <DollarSign className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-ink">Template and installation</p>
            <p>
              Digital templating: $200-$500 (sometimes bundled). Installation crew (2-3 people):
              $500-$1,500 depending on access, floor level, and complexity.
            </p>
          </div>
        </div>
      </div>

      <h2 className="font-display text-xl font-bold text-ink pt-4">
        Quartz vs granite vs marble: installed price comparison
      </h2>
      <table className="w-full text-sm mb-6 border border-border rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-muted/30 border-b border-border">
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Material
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Installed / sf
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Typical kitchen (35 sf)
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Key difference
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Quartz</td>
            <td className="px-4 py-3 text-ink">$50-$150</td>
            <td className="px-4 py-3 text-ink">$1,750-$5,250</td>
            <td className="px-4 py-3 text-muted-foreground">
              Non-porous, consistent color, low maintenance
            </td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Granite</td>
            <td className="px-4 py-3 text-ink">$40-$100 (exotics $150+)</td>
            <td className="px-4 py-3 text-ink">$1,400-$3,500</td>
            <td className="px-4 py-3 text-muted-foreground">
              Natural variation, needs sealing, heat resistant
            </td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 font-medium text-ink">Marble</td>
            <td className="px-4 py-3 text-ink">$75-$200</td>
            <td className="px-4 py-3 text-ink">$2,600-$7,000</td>
            <td className="px-4 py-3 text-muted-foreground">
              Luxury look, etches/stains easily, high maintenance
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium text-ink">Quartzite</td>
            <td className="px-4 py-3 text-ink">$80-$180</td>
            <td className="px-4 py-3 text-ink">$2,800-$6,300</td>
            <td className="px-4 py-3 text-muted-foreground">
              Harder than granite, natural look, some etching risk
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="font-display text-xl font-bold text-ink pt-4">
        How to compare quartz quotes apples-to-apples
      </h2>
      <ul className="space-y-3 text-sm text-muted-foreground mb-6 list-disc list-inside">
        <li>
          Confirm <strong>brand, color name, and slab thickness</strong> (2 cm vs 3 cm) are written
          on every bid.
        </li>
        <li>
          Verify <strong>edge profile</strong> included. Get the specific profile name (eased,
          bullnose, ogee, waterfall).
        </li>
        <li>
          Count <strong>cutouts</strong> (sink, cooktop, faucet holes) and confirm each is priced or
          included.
        </li>
        <li>
          Ask if <strong>template/measurement, disposal of old tops, and backsplash</strong> are
          included or extra.
        </li>
        <li>
          Check <strong>warranty terms</strong> (lifetime vs 10-15 year, transferability, and what
          voids it).
        </li>
        <li>
          Confirm <strong>seam placement</strong>. Good fabricators minimize seams and place them at
          sinks/cooktops.
        </li>
      </ul>

      <div className="rounded-xl border border-border bg-white p-5 mb-6">
        <p className="text-xs font-semibold text-accent mb-2">
          Pro tip: Use CostReno to analyze your countertop quote
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Upload your quartz quote to the analyzer. It checks for missing cutouts, edge profile
          clarity, seam count, and benchmarks the per-sf price against your local market.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/quote-analyzer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition shadow-sm"
          >
            Analyze countertop quote
          </a>
          <a
            href="/compare-quotes"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-muted transition"
          >
            Compare countertop bids
          </a>
        </div>
      </div>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Regional labor impact</h2>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        Fabrication and installation labor varies by metro. High-cost areas (SF, NYC, LA, Seattle)
        run 20-35% above national average; lower-cost metros (TX, Midwest, Southeast) run 5-15%
        below. Use the{" "}
        <a href="/estimate?project=kitchen" className="text-primary underline hover:no-underline">
          CostReno kitchen estimator
        </a>{" "}
        with your ZIP code to see a localized installed range before you collect bids.
      </p>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Ready to check a quote?{" "}
        <a href="/quote-analyzer" className="text-primary underline">
          Analyze one bid
        </a>{" "}
        or{" "}
        <a href="/compare-quotes" className="text-primary underline">
          compare two side by side
        </a>{" "}
        with composite scoring, missing-scope detection, and market-rate benchmarks.
      </p>
    </GuideArticle>
  );
}
