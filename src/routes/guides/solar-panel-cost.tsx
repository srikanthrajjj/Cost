import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { buildTopicGuideHead } from "@/lib/guides/topic-guide-head";

const PATH = "/guides/solar-panel-cost";

const FAQS = [
  {
    q: "How much do solar panels cost in 2026?",
    a: "Most U.S. homes pay about $2.60-$2.95 per watt installed before incentives, or roughly $18,000-$24,000 for a typical 7-8 kW system. Battery backup often adds $10,000-$15,000.",
  },
  {
    q: "Do I still get a federal solar tax credit?",
    a: "Incentive rules changed around 2025-2026. Confirm current federal, state, and utility programs before you sign. Ask every quote to show net cost after documented incentives, not just a marketing teaser.",
  },
  {
    q: "Should I reroof before installing solar?",
    a: "If your roof has under about 10 years of life left, reroof first. Removing and remounting panels later can erase years of solar savings. Compare a combined roof-plus-solar plan against solar-only.",
  },
  {
    q: "What should a solar quote include?",
    a: "System size (kW), $/W, panel and inverter brands, production estimate, warranty terms, interconnection fees, roof attachment method, battery scope if any, and a clear incentive line with eligibility notes.",
  },
];

export const Route = createFileRoute("/guides/solar-panel-cost")({
  component: SolarPanelCostGuide,
  head: () =>
    buildTopicGuideHead({
      path: PATH,
      metaTitle: "Solar panel installation cost guide (2026)",
      metaDescription:
        "Solar panel cost per watt, typical system totals, battery add-ons, roof timing, and how to compare solar quotes with local estimates.",
      headline: "How much does solar panel installation cost?",
      clusterLabel: "Energy costs",
      clusterPath: "/topics/energy",
      faqs: FAQS,
    }),
});

function SolarPanelCostGuide() {
  return (
    <GuideArticle
      title="How much does solar panel installation cost?"
      description="Most homes land near $2.60-$2.95 per watt installed, or about $18,000-$24,000 for a 7-8 kW system before incentives. Roof condition and battery storage change the real budget."
      lastUpdated="July 28, 2026"
      cluster={{ label: "Energy costs", href: "/topics/energy" }}
      faqs={FAQS}
      related={[
        { title: "Solar installation cost landing", href: "/solar-panel-cost" },
        { title: "Roof replacement cost guide", href: "/guides/roof-replacement" },
        { title: "EV charger installation cost", href: "/guides/ev-charger-installation-cost" },
        { title: "Get a solar estimate", href: "/estimate?project=solar" },
        { title: "Analyze a solar quote", href: "/quote-analyzer" },
      ]}
    >
      <p className="mb-6">
        Solar is one of the largest home energy investments you can make. Pricing looks simple when
        vendors quote a monthly payment, and messy when you compare cash price, incentives, and roof
        work. Use per-watt math and a clear scope checklist before you sign.
      </p>

      <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 mb-6">
        <p className="text-xs font-semibold text-accent mb-2">Quick reference</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$2.60-$2.95</p>
            <p className="text-muted-foreground">per watt installed</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$18k-$24k</p>
            <p className="text-muted-foreground">typical 7-8 kW</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$10k-$15k</p>
            <p className="text-muted-foreground">battery add-on</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">9-15 yrs</p>
            <p className="text-muted-foreground">common payback band</p>
          </div>
        </div>
      </div>

      <h2 className="font-display text-xl font-bold text-ink pt-4">What drives solar cost</h2>
      <ul className="list-disc pl-5 space-y-2 mb-6 text-sm">
        <li>System size in kW and your real usage (EV charging raises need).</li>
        <li>Roof pitch, height, shade, and whether a reroof is due.</li>
        <li>Panel and inverter tier, plus labor and soft costs (permit, interconnection).</li>
        <li>Battery storage, panel upgrades, and utility requirements.</li>
        <li>Local labor rates and remaining state or utility incentives.</li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">How to compare solar quotes</h2>
      <ol className="list-decimal pl-5 space-y-2 mb-6 text-sm">
        <li>Convert every bid to dollars per watt on the same kW size.</li>
        <li>Match production estimates (kWh/year) and warranty length.</li>
        <li>Separate cash price, financing fees, and incentive assumptions.</li>
        <li>Confirm roof attachment, flashings, and who owns leak liability.</li>
        <li>Ask what happens if interconnection or inspection delays the job.</li>
      </ol>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Local next step</h2>
      <p className="mb-4 text-sm">
        Solar pricing moves with labor markets and utility rules. Start with a ZIP-based estimate,
        then review written quotes against national ranges on this page.
      </p>
      <p className="text-sm">
        <a href="/estimate?project=solar" className="font-semibold text-primary hover:underline">
          Get a solar estimate
        </a>
        {" · "}
        <a href="/locations" className="font-semibold text-primary hover:underline">
          Browse costs by city
        </a>
      </p>
    </GuideArticle>
  );
}
