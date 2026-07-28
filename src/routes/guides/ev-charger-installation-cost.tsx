import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { buildTopicGuideHead } from "@/lib/guides/topic-guide-head";

const PATH = "/guides/ev-charger-installation-cost";

const FAQS = [
  {
    q: "How much does a home EV charger cost to install?",
    a: "A typical Level 2 home install runs about $800-$2,800 when your panel has capacity and the wire run is short. Long conduit runs, trenching, or a panel upgrade can push totals to $3,000-$8,000.",
  },
  {
    q: "Do I need a panel upgrade for an EV charger?",
    a: "Not always. Many homes can add a 40-60 amp Level 2 circuit. If the main panel is near capacity, load management hardware ($400-$1,500) can be cheaper than a full service upgrade ($1,500-$5,000+).",
  },
  {
    q: "What rebates or tax credits still apply?",
    a: "Federal EV charger credit windows have tightened. Check your utility and state programs before buying equipment. Ask the electrician to itemize rebate-eligible line items on the invoice.",
  },
  {
    q: "What should an EV charger quote include?",
    a: "Charger model (hardwired vs plug-in), amperage, circuit length, conduit path, permit fees, panel work, load calculation, and whether drywall or landscaping repair is included.",
  },
];

export const Route = createFileRoute("/guides/ev-charger-installation-cost")({
  component: EvChargerCostGuide,
  head: () =>
    buildTopicGuideHead({
      path: PATH,
      metaTitle: "EV charger installation cost guide (2026)",
      metaDescription:
        "Level 2 EV charger install pricing, panel upgrade risk, permits, rebates, and how to compare electrician quotes.",
      headline: "How much does EV charger installation cost?",
      clusterLabel: "Energy costs",
      clusterPath: "/topics/energy",
      faqs: FAQS,
    }),
});

function EvChargerCostGuide() {
  return (
    <GuideArticle
      title="How much does EV charger installation cost?"
      description="Most Level 2 home installs land between $800 and $2,800. Panel upgrades, long runs, and outdoor trenching are the usual budget breakers."
      lastUpdated="July 28, 2026"
      cluster={{ label: "Energy costs", href: "/topics/energy" }}
      faqs={FAQS}
      related={[
        { title: "Solar panel cost guide", href: "/guides/solar-panel-cost" },
        { title: "Electrical estimate", href: "/estimate?project=electrical" },
        { title: "Analyze an electrical quote", href: "/quote-analyzer" },
        { title: "Costs by city", href: "/locations" },
      ]}
    >
      <p className="mb-6">
        Home EV charging is shifting from a specialty add-on to a common electrical project. The
        hardware is only part of the bill. Labor, permits, and panel capacity usually decide whether
        you stay near $1,500 or climb past $4,000.
      </p>

      <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 mb-6">
        <p className="text-xs font-semibold text-accent mb-2">Quick reference</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$800-$2,800</p>
            <p className="text-muted-foreground">typical Level 2</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$350-$800</p>
            <p className="text-muted-foreground">charger hardware</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$1.5k-$5k+</p>
            <p className="text-muted-foreground">panel upgrade</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$60-$280</p>
            <p className="text-muted-foreground">permit range</p>
          </div>
        </div>
      </div>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Cost drivers to watch</h2>
      <ul className="list-disc pl-5 space-y-2 mb-6 text-sm">
        <li>Distance from panel to parking spot and whether walls or ceilings are finished.</li>
        <li>Hardwired vs NEMA plug-in units and required breaker size.</li>
        <li>Main panel capacity and whether load management can avoid an upgrade.</li>
        <li>Outdoor mounts, pedestal bases, and trench work to a detached garage.</li>
        <li>Permit, inspection, and any utility interconnection paperwork.</li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Quote comparison checklist</h2>
      <ol className="list-decimal pl-5 space-y-2 mb-6 text-sm">
        <li>Require a load calculation, not a verbal “your panel is fine.”</li>
        <li>Separate equipment, labor, permit, and contingency on the bid.</li>
        <li>Confirm who pulls the permit and attends inspection.</li>
        <li>Ask about drywall, paint, or landscaping patch after fishing cable.</li>
        <li>Compare net cost after utility rebates with the same charger amperage.</li>
      </ol>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Local next step</h2>
      <p className="mb-4 text-sm">
        Electrician rates vary widely by metro. Use a ZIP estimate for electrical scope, then compare
        written Level 2 quotes against the ranges above.
      </p>
      <p className="text-sm">
        <a href="/estimate?project=electrical" className="font-semibold text-primary hover:underline">
          Get an electrical estimate
        </a>
        {" · "}
        <a href="/locations" className="font-semibold text-primary hover:underline">
          Browse costs near you
        </a>
      </p>
    </GuideArticle>
  );
}
