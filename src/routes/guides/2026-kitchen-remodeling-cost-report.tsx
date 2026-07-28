import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { buildTopicGuideHead } from "@/lib/guides/topic-guide-head";

const PATH = "/guides/2026-kitchen-remodeling-cost-report";

const FAQS = [
  {
    q: "What's the average cost to remodel a kitchen in 2026?",
    a: "Around $27,000-$35,000 nationally, with most homeowners spending between $15,000 and $75,000 depending on size and scope. Cosmetic refreshes start near $8,000-$10,000. Full luxury gut renovations regularly exceed $150,000.",
  },
  {
    q: "What adds the most value at resale?",
    a: "A minor kitchen remodel (cabinet refacing, new countertops, updated appliances and lighting) without changing the layout. It is the best-performing interior renovation category in the 2025 Cost vs. Value Report, returning roughly 90-113% of cost.",
  },
  {
    q: "Why are kitchen remodels more expensive in 2026 than in past years?",
    a: "New tariffs on imported cabinets (up to 50%) combined with ongoing skilled-labor shortages are the two biggest drivers of the year-over-year increase. Cabinet-heavy projects have seen about 10-14% increases versus 2024-2025.",
  },
  {
    q: "How much does location affect the price?",
    a: "Significantly. A project can cost 30-40% more in San Francisco or New York than the identical scope in Houston or Phoenix. Budget an extra 10-20% metro premium in high-cost coastal cities.",
  },
  {
    q: "Is $30,000 enough for a kitchen remodel?",
    a: "Often yes for a cosmetic refresh or modest same-footprint remodel with stock or semi-custom cabinets. It usually will not cover a full gut with layout changes or premium finishes. See our dedicated $30k kitchen budget guide for a line-item breakdown.",
  },
];

export const Route = createFileRoute("/guides/2026-kitchen-remodeling-cost-report")({
  component: Kitchen2026CostReport,
  head: () =>
    buildTopicGuideHead({
      path: PATH,
      metaTitle: "2026 kitchen remodeling cost report",
      metaDescription:
        "What Americans are really paying for kitchen remodels in 2026. National averages, cost tiers, cabinets and labor breakdowns, city variation, ROI, and budgeting tips.",
      headline: "2026 kitchen remodeling cost report: what Americans are really paying",
      clusterLabel: "Kitchen costs",
      clusterPath: "/topics/kitchen",
      faqs: FAQS,
    }),
});

function Kitchen2026CostReport() {
  return (
    <GuideArticle
      title="2026 kitchen remodeling cost report: what Americans are really paying"
      description="National average kitchen remodel costs land near $27,000-$35,000 in 2026. Most homeowners spend $15,000-$75,000 depending on size, scope, and finish level."
      lastUpdated="July 2026"
      cluster={{ label: "Kitchen costs", href: "/topics/kitchen" }}
      faqs={FAQS}
      related={[
        { title: "Kitchen remodel cost guide", href: "/guides/kitchen-remodel" },
        { title: "Kitchen remodel cost landing", href: "/kitchen-remodel-cost" },
        { title: "Is $30,000 enough for a kitchen remodel?", href: "/guides/is-30k-enough-for-kitchen-remodel" },
        { title: "Quartz countertop cost", href: "/guides/quartz-countertop-cost" },
        { title: "Cabinet install labor cost", href: "/guides/cabinet-install-labor-cost" },
        { title: "Kitchen quote review checklist", href: "/guides/kitchen-quote-review" },
        { title: "Get a kitchen estimate", href: "/estimate?project=kitchen" },
        { title: "Analyze a kitchen quote", href: "/quote-analyzer" },
        { title: "Compare kitchen bids", href: "/compare-quotes" },
        { title: "Browse costs by city", href: "/locations" },
      ]}
    >
      <p className="mb-6">
        Kitchen remodeling remains the single biggest home improvement category in the U.S., and 2026
        pricing reflects a market shaped by three forces at once: persistent skilled-labor shortages,
        new tariffs on imported cabinetry, and a wave of homeowners choosing to renovate rather than
        move. Here is the full cost breakdown, based on industry data from Zonda&apos;s 2025 Cost vs.
        Value Report, the National Association of Home Builders, Houzz, and current contractor pricing
        across major U.S. metros.
      </p>

      <p className="mb-6 text-sm">
        Planning a project? Start with a{" "}
        <a href="/estimate?project=kitchen" className="font-semibold text-primary hover:underline">
          ZIP-based kitchen estimate
        </a>
        , then check bids with the{" "}
        <a href="/quote-analyzer" className="font-semibold text-primary hover:underline">
          quote analyzer
        </a>{" "}
        or{" "}
        <a href="/compare-quotes" className="font-semibold text-primary hover:underline">
          compare quotes
        </a>{" "}
        tool. For more kitchen planning pages, see the{" "}
        <a href="/topics/kitchen" className="font-semibold text-primary hover:underline">
          kitchen costs hub
        </a>
        .
      </p>

      <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 mb-6">
        <p className="text-xs font-semibold text-accent mb-2">Quick reference</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$27k-$35k</p>
            <p className="text-muted-foreground">national average</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$15k-$75k</p>
            <p className="text-muted-foreground">most projects</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$150-$250</p>
            <p className="text-muted-foreground">per sq ft typical</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">90-113%</p>
            <p className="text-muted-foreground">minor remodel ROI</p>
          </div>
        </div>
      </div>

      <h2 className="font-display text-xl font-bold text-ink pt-4">The short answer</h2>
      <p className="mb-4">
        The national average kitchen remodel costs <strong>$27,000-$35,000</strong>, with most
        homeowners spending somewhere in the <strong>$15,000-$75,000</strong> range depending on
        kitchen size, scope, and finish level. Cosmetic refreshes start around $8,000-$10,000. Full
        luxury gut renovations regularly exceed $150,000, and can pass $250,000 in high-cost metros.
      </p>
      <p className="mb-4 text-sm">
        Wondering if a fixed budget works? See{" "}
        <a
          href="/guides/is-30k-enough-for-kitchen-remodel"
          className="font-semibold text-primary hover:underline"
        >
          is $30,000 enough for a kitchen remodel?
        </a>{" "}
        or the broader{" "}
        <a href="/guides/kitchen-remodel" className="font-semibold text-primary hover:underline">
          kitchen remodel cost guide
        </a>
        .
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-border rounded-xl overflow-hidden min-w-[36rem]">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                Tier
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                Typical cost
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                What&apos;s included
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="px-4 py-3 font-medium text-ink">Cosmetic refresh</td>
              <td className="px-4 py-3 text-ink whitespace-nowrap">$8,000-$18,000</td>
              <td className="px-4 py-3 text-muted-foreground">
                Cabinet refacing/painting, new hardware, countertop swap, fixtures
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="px-4 py-3 font-medium text-ink">Minor remodel</td>
              <td className="px-4 py-3 text-ink whitespace-nowrap">$14,600-$30,000</td>
              <td className="px-4 py-3 text-muted-foreground">
                Refacing or budget cabinets, new countertops, flooring, updated appliances. No layout
                change.
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="px-4 py-3 font-medium text-ink">Mid-range / major remodel</td>
              <td className="px-4 py-3 text-ink whitespace-nowrap">$30,000-$82,000</td>
              <td className="px-4 py-3 text-muted-foreground">
                Full cabinet replacement, quartz/granite counters, new flooring, full appliance suite,
                same footprint
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">Luxury / high-end remodel</td>
              <td className="px-4 py-3 text-ink whitespace-nowrap">$80,000-$160,000+</td>
              <td className="px-4 py-3 text-muted-foreground">
                Custom cabinetry, layout changes, structural work, premium appliances (Sub-Zero,
                Wolf), smart tech
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Cost by kitchen size</h2>
      <ul className="list-disc pl-5 space-y-2 mb-4 text-sm">
        <li>
          <strong>Small kitchens (under 100 sq ft):</strong> $9,000-$30,000
        </li>
        <li>
          <strong>Medium kitchens (100-200 sq ft):</strong> $35,000-$70,000 for mid-range work
        </li>
        <li>
          <strong>Large kitchens (200+ sq ft):</strong> $60,000-$200,000
        </li>
      </ul>
      <p className="mb-6">
        On a per-square-foot basis, most standard renovations run <strong>$150-$250/sq ft</strong>,
        with premium metro projects reaching $200-$350/sq ft, and ultra-custom luxury work in markets
        like San Francisco or New York passing $500-$1,200/sq ft. Compare local ranges on{" "}
        <a href="/kitchen-remodel-cost" className="font-semibold text-primary hover:underline">
          kitchen remodel cost
        </a>{" "}
        and{" "}
        <a href="/locations" className="font-semibold text-primary hover:underline">
          costs by city
        </a>
        .
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Where the money actually goes</h2>
      <p className="mb-4">
        Cabinetry is the single largest line item in virtually every budget breakdown:
      </p>
      <ul className="list-disc pl-5 space-y-3 mb-6 text-sm">
        <li>
          <strong>Cabinets &amp; hardware: 25-40%</strong> of total budget. Stock cabinets run
          $100-$500 per linear foot; semi-custom $150-$900/linear foot; full custom $10,000-$25,000+
          for a standard kitchen. See{" "}
          <a
            href="/guides/cabinet-install-labor-cost"
            className="font-semibold text-primary hover:underline"
          >
            cabinet install labor cost
          </a>
          .
        </li>
        <li>
          <strong>Labor: 20-35%</strong>, climbing toward 40-60% on full gut jobs with
          plumbing/electrical moves. Skilled-trade shortages have kept installer rates high
          nationwide, with reliable crews often booked weeks out.
        </li>
        <li>
          <strong>Countertops: 10-15%.</strong> Laminate installed runs $1,500-$4,000; quartz and
          granite typically $3,000-$8,000 depending on slab size, with installed pricing around
          $75-$125/sq ft for mid-tier stone. Deep dive:{" "}
          <a
            href="/guides/quartz-countertop-cost"
            className="font-semibold text-primary hover:underline"
          >
            quartz countertop cost
          </a>
          .
        </li>
        <li>
          <strong>Appliances: 15-20%.</strong> A coordinated mid-range suite (refrigerator, range,
          dishwasher, microwave) from brands like Bosch, KitchenAid, or GE Profile typically runs
          $5,000-$10,000.
        </li>
        <li>
          <strong>Flooring, lighting, backsplash, design/permits:</strong> the remaining 10-20%,
          varying by city permit fees and design complexity.
        </li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">What&apos;s pushing prices up in 2026</h2>
      <p className="mb-4">Two structural factors are new to this year&apos;s numbers:</p>
      <ol className="list-decimal pl-5 space-y-3 mb-4 text-sm">
        <li>
          <strong>Cabinet tariffs.</strong> New U.S. tariffs on imported kitchen cabinets, bathroom
          vanities, and certain wood products started at 25% and have risen to as high as 50% on
          cabinets and vanities in 2026. This has pushed many contractors and homeowners toward
          domestic/American-made cabinet lines to control costs, and has driven 10-14% year-over-year
          increases in cabinet-heavy projects compared to 2024-2025.
        </li>
        <li>
          <strong>Labor shortages.</strong> Skilled trade shortages have kept installation rates
          elevated, with labor now consuming a larger share of the total budget than in past years,
          sometimes 40-60% on complex full remodels.
        </li>
      </ol>
      <p className="mb-6">
        Industry-wide, total U.S. homeowner improvement and repair spending is projected to reach a
        record high of roughly $526 billion by early 2026, with kitchens remaining the most upgraded
        room in the home.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Regional and city-level variation</h2>
      <p className="mb-4">
        Location is one of the biggest cost swings in any kitchen remodel, often a bigger factor than
        material choice.
      </p>
      <h3 className="font-display text-lg font-semibold text-ink pt-2">Highest-cost metros</h3>
      <p className="mb-4 text-sm">
        San Francisco, San Jose, and New York City carry the highest kitchen remodel costs
        nationally, driven by labor wages and material logistics. Luxury projects in these markets
        and Northern Virginia can exceed $500/sq ft. The Washington D.C./Northern Virginia metro
        averages roughly $75,000 per project, about 40% above the national average.
      </p>
      <h3 className="font-display text-lg font-semibold text-ink pt-2">Lower-cost metros</h3>
      <p className="mb-4 text-sm">
        Typically 10-20% below national average: St. Louis, Cincinnati, Kansas City, Indianapolis,
        McAllen, and most Midwest/Southern metros. A comparable project in Houston or Phoenix can run
        30-40% less than the identical scope in San Francisco or New York.
      </p>
      <h3 className="font-display text-lg font-semibold text-ink pt-2">Regional rule of thumb</h3>
      <p className="mb-6">
        Budget an extra 10-20% &quot;metro premium&quot; in high-cost-of-living coastal cities, and
        expect to land at or below national averages in most Midwest and Southern markets. Browse{" "}
        <a href="/locations" className="font-semibold text-primary hover:underline">
          local cost pages
        </a>{" "}
        before you set a hard budget.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">
        Return on investment: what the 2025 Cost vs. Value Report shows
      </h2>
      <p className="mb-4">
        This is the most important number for anyone renovating with resale in mind:
      </p>
      <ul className="list-disc pl-5 space-y-2 mb-4 text-sm">
        <li>
          <strong>Minor kitchen remodels return roughly 90-113% of cost at resale</strong>, the
          single best-performing interior project in the report, and the only interior remodel in the
          national top five for ROI. (Figures vary by source between about 90.7% and 113%, depending
          on methodology, but all agree it is the strongest interior category.)
        </li>
        <li>
          <strong>Major mid-range remodels return around 44-50%</strong> of cost.
        </li>
        <li>
          <strong>Major upscale/luxury remodels return only about 30-38%</strong> of cost.
        </li>
        <li>
          A typical Chicago-area example: a minor remodel costing ~$27,200 returned about $25,700 at
          resale (94% recovery), while a major midrange remodel costing ~$84,200 returned only about
          $37,300 (44% recovery).
        </li>
      </ul>
      <p className="mb-6">
        The takeaway for homeowners: if resale value is the priority, a well-executed minor remodel
        (refacing, new counters, updated hardware and lighting, new appliances) outperforms a full gut
        renovation on a dollar-for-dollar basis. Full remodels are still worthwhile. Just think of the
        extra spend as funding your own enjoyment of the space rather than pure resale return.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">2026 design trends worth knowing</h2>
      <ul className="list-disc pl-5 space-y-2 mb-6 text-sm">
        <li>
          <strong>Warm neutrals are replacing stark white.</strong> Greiges, mushroom taupe, sage,
          terracotta, and rich wood tones are overtaking the all-white kitchen look that dominated the
          last decade.
        </li>
        <li>
          <strong>Two-tone cabinetry:</strong> natural wood islands paired with a painted perimeter
          color.
        </li>
        <li>
          <strong>Stone slab backsplashes</strong> and heavily veined quartz/quartzite are top
          countertop choices. Compare surfaces in{" "}
          <a
            href="/guides/quartz-vs-granite-countertops"
            className="font-semibold text-primary hover:underline"
          >
            quartz vs granite
          </a>
          .
        </li>
        <li>
          <strong>Panel-ready, &quot;invisible&quot; smart appliances:</strong> smart refrigerators
          now appear in a majority of higher-end projects, and panel-ready fridges/dishwashers that
          blend into cabinetry are increasingly standard rather than a luxury add-on.
        </li>
        <li>
          <strong>Wellness-driven features:</strong> powerful vent hoods, steam cooking, induction
          cooktops.
        </li>
        <li>
          <strong>Age-in-place design:</strong> pull-out cabinets, wider drawer pulls, rounded
          countertop edges, and nonslip flooring are showing up in more than half of renovating
          households&apos; plans, reflecting long-term-stay planning.
        </li>
        <li>
          <strong>Sustainability:</strong> low-VOC paints, recycled-content countertops, and
          responsibly sourced/domestic cabinetry, partly trend-driven, partly a practical response to
          import tariffs.
        </li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Budgeting tips</h2>
      <ol className="list-decimal pl-5 space-y-3 mb-6 text-sm">
        <li>
          <strong>Set aside 15-20% contingency</strong> from day one. Hidden water damage, old wiring,
          and uneven subfloors are the most common budget-busters, not material upgrades.
        </li>
        <li>
          <strong>Keep the existing footprint if it works.</strong> Moving plumbing or knocking down
          walls adds design time, permits, and trade costs disproportionate to the visual payoff.
        </li>
        <li>
          <strong>Lock in cabinet pricing early</strong> if you&apos;re planning a late-2026 or 2027
          project. Tariff-driven price shifts can move fast.
        </li>
        <li>
          <strong>Use semi-custom cabinets strategically.</strong> Many semi-custom lines land at
          $150-$700 per linear foot and deliver roughly 90% of the visual result of full custom at a
          fraction of the price.
        </li>
        <li>
          <strong>Spend where it shows and is touched daily</strong> (cabinets and countertops) and
          consider stepping down a tier on appliances, where the visual and functional difference
          between mid-range and premium is often smaller than the price gap suggests.
        </li>
        <li>
          <strong>Get 2-3 local contractor quotes</strong> itemized by cabinets, labor, and trades
          rather than relying on national averages alone. Regional swings of 30-40% are common. Use
          the{" "}
          <a href="/guides/kitchen-quote-review" className="font-semibold text-primary hover:underline">
            kitchen quote review checklist
          </a>
          , then{" "}
          <a href="/quote-analyzer" className="font-semibold text-primary hover:underline">
            analyze
          </a>{" "}
          or{" "}
          <a href="/compare-quotes" className="font-semibold text-primary hover:underline">
            compare
          </a>{" "}
          your bids.
        </li>
      </ol>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Local next step</h2>
      <p className="mb-4 text-sm">
        National averages are a starting point. Your ZIP, kitchen size, and finish level change the
        range. Build an estimate, then pressure-test contractor numbers against local context.
      </p>
      <p className="text-sm mb-6">
        <a href="/estimate?project=kitchen" className="font-semibold text-primary hover:underline">
          Get a kitchen estimate
        </a>
        {" · "}
        <a href="/quote-analyzer" className="font-semibold text-primary hover:underline">
          Analyze a quote
        </a>
        {" · "}
        <a href="/compare-quotes" className="font-semibold text-primary hover:underline">
          Compare quotes
        </a>
        {" · "}
        <a href="/locations" className="font-semibold text-primary hover:underline">
          Browse costs by city
        </a>
      </p>

      <p className="text-xs text-muted-foreground border-t border-border pt-6">
        Sources: Zonda 2025 Cost vs. Value Report, National Association of Home Builders, Houzz 2026
        Renovation Report, NKBA 2026 Kitchen Trends Report, and aggregated 2026 contractor and
        industry pricing data. Figures are planning ranges, not a quote for your home.
      </p>
    </GuideArticle>
  );
}
