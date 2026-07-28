import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { buildTopicGuideHead } from "@/lib/guides/topic-guide-head";

const PATH = "/guides/smart-thermostat-installation-cost";

const FAQS = [
  {
    q: "How much does smart thermostat installation cost?",
    a: "Most professional installs land between $200 and $500 all-in in 2026, including a mid-range unit. Hardware alone is often $80-$300. Labor is usually $75-$200 when a C-wire is already present.",
  },
  {
    q: "What is a C-wire and why does it matter?",
    a: "A common (C) wire powers the thermostat continuously. Without one, you may need an adapter kit ($50-$200 added) or a new wire run from the air handler ($200-$500). This is the biggest wild card on quotes.",
  },
  {
    q: "Is DIY install worth it?",
    a: "Many straight swaps take 30-60 minutes. Hire a pro if you have a heat pump, multi-zone system, unclear wiring photos, or no C-wire. A bad hookup can damage controls or void equipment warranties.",
  },
  {
    q: "Will a smart thermostat lower my HVAC bills?",
    a: "ENERGY STAR connected thermostats often save around 8% on heating and cooling when schedules and occupancy features are used. Savings depend on your climate, rates, and whether you already set back temperatures manually.",
  },
];

export const Route = createFileRoute("/guides/smart-thermostat-installation-cost")({
  component: SmartThermostatCostGuide,
  head: () =>
    buildTopicGuideHead({
      path: PATH,
      metaTitle: "Smart thermostat installation cost (2026)",
      metaDescription:
        "Smart thermostat install pricing for Nest, Ecobee, and similar models, C-wire costs, DIY vs pro, and how to compare HVAC control quotes.",
      headline: "How much does smart thermostat installation cost?",
      clusterLabel: "HVAC costs",
      clusterPath: "/topics/hvac",
      faqs: FAQS,
    }),
});

function SmartThermostatCostGuide() {
  return (
    <GuideArticle
      title="How much does smart thermostat installation cost?"
      description="Expect $200-$500 installed for most homes. Missing C-wires, multi-zone systems, and premium models push the bill higher."
      lastUpdated="July 28, 2026"
      cluster={{ label: "HVAC costs", href: "/topics/hvac" }}
      faqs={FAQS}
      related={[
        { title: "HVAC installation cost guide", href: "/guides/hvac-installation" },
        { title: "HVAC cost landing", href: "/hvac-installation-cost" },
        { title: "Energy costs hub", href: "/topics/energy" },
        { title: "Get an HVAC estimate", href: "/estimate?project=hvac" },
        { title: "Analyze an HVAC quote", href: "/quote-analyzer" },
      ]}
    >
      <p className="mb-6">
        Smart thermostats are a small ticket next to a full HVAC replacement, but quotes still vary
        a lot. Brand choice matters less than wiring surprises. Know the C-wire situation before you
        compare Nest, Ecobee, Honeywell, or utility-rebate models.
      </p>

      <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 mb-6">
        <p className="text-xs font-semibold text-accent mb-2">Quick reference</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$200-$500</p>
            <p className="text-muted-foreground">typical installed</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$80-$300</p>
            <p className="text-muted-foreground">hardware only</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">$75-$200</p>
            <p className="text-muted-foreground">labor with C-wire</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-ink">+$50-$500</p>
            <p className="text-muted-foreground">no C-wire adders</p>
          </div>
        </div>
      </div>

      <h2 className="font-display text-xl font-bold text-ink pt-4">When to bundle with HVAC work</h2>
      <p className="mb-6 text-sm">
        If you are already replacing a furnace, heat pump, or air handler, ask for the thermostat as
        a line item on the same bid. Bundled install is often cheaper than a standalone service call,
        and the tech can confirm heat-pump-compatible settings on day one.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Quote red flags</h2>
      <ul className="list-disc pl-5 space-y-2 mb-6 text-sm">
        <li>No photo check of existing wiring before the visit.</li>
        <li>Vague “electrical upgrade” fees without C-wire or zone details.</li>
        <li>Missing setup for heat pump, dual fuel, or multi-stage equipment.</li>
        <li>Pressure to buy the highest-tier model when a mid-range unit meets your needs.</li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Local next step</h2>
      <p className="mb-4 text-sm">
        For a full system replacement, run an HVAC estimate. For a thermostat-only job, use these
        ranges to pressure-test service-call quotes in your city.
      </p>
      <p className="text-sm">
        <a href="/estimate?project=hvac" className="font-semibold text-primary hover:underline">
          Get an HVAC estimate
        </a>
        {" · "}
        <a href="/topics/hvac" className="font-semibold text-primary hover:underline">
          HVAC costs hub
        </a>
      </p>
    </GuideArticle>
  );
}
