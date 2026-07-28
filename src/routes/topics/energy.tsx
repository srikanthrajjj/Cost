import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/topics/energy")({
  component: EnergyTopicPage,
  head: () => ({
    meta: [
      { title: "Energy and electrification costs | CostReno" },
      {
        name: "description",
        content:
          "Solar, EV charger, and smart thermostat cost guides plus local estimates to plan home electrification projects.",
      },
      { property: "og:title", content: "Energy and electrification costs | CostReno" },
      {
        property: "og:description",
        content:
          "Plan solar, EV charging, and smart thermostat projects with national cost ranges and quote checklists.",
      },
      { property: "og:url", content: "https://www.costreno.com/topics/energy" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/topics/energy" }],
  }),
});

const LINKS = [
  {
    title: "Solar panel cost landing",
    href: "/solar-panel-cost",
    desc: "National solar pricing, per-watt ranges, and FAQs for system planning.",
  },
  {
    title: "Solar panel cost guide",
    href: "/guides/solar-panel-cost",
    desc: "What drives $/W, battery add-ons, roof timing, and quote comparison.",
  },
  {
    title: "EV charger installation cost",
    href: "/guides/ev-charger-installation-cost",
    desc: "Level 2 pricing, panel upgrade risk, permits, and rebate checks.",
  },
  {
    title: "Smart thermostat installation cost",
    href: "/guides/smart-thermostat-installation-cost",
    desc: "Installed ranges, C-wire surprises, and DIY vs pro guidance.",
  },
  {
    title: "Free solar estimate",
    href: "/estimate?project=solar",
    desc: "Answer a few questions for a ZIP-based solar planning range.",
  },
  {
    title: "Costs by city",
    href: "/locations",
    desc: "Browse local renovation and energy-adjacent cost pages near you.",
  },
];

function EnergyTopicPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="guides" />
      <main>
        <section className="py-16 md:py-20 border-b border-border/60">
          <div className="container-x max-w-4xl">
            <p className="text-xs text-muted-foreground mb-3">
              <a href="/guides" className="hover:text-primary">
                Guides
              </a>{" "}
              / Topic hub
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-ink mb-4">
              Energy and electrification costs
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Plan solar, home EV charging, and smarter HVAC controls with clear cost ranges, quote
              checklists, and local estimates before you hire.
            </p>
          </div>
        </section>
        <section className="py-14">
          <div className="container-x max-w-5xl grid md:grid-cols-2 gap-4">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl border border-border/60 bg-white p-5 hover:border-primary/30 hover:shadow-sm transition group"
              >
                <h2 className="font-display text-lg font-bold text-ink group-hover:text-primary transition">
                  {link.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{link.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </a>
            ))}
          </div>
        </section>
        <section className="py-12 bg-muted/20 border-y border-border/60">
          <div className="container-x max-w-4xl flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Start with a local estimate</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Solar planning ranges use your ZIP and basic system choices.
              </p>
            </div>
            <a
              href="/estimate?project=solar"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
            >
              Get a solar estimate
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
