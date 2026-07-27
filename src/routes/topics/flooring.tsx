import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/topics/flooring")({
  component: FlooringTopicPage,
  head: () => ({
    meta: [
      { title: "Flooring costs topic hub | CostReno" },
      {
        name: "description",
        content:
          "Flooring installation cost guides and local city pages to help you compare materials before hiring.",
      },
      { property: "og:title", content: "Flooring costs topic hub | CostReno" },
      { property: "og:url", content: "https://www.costreno.com/topics/flooring" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/topics/flooring" }],
  }),
});

const LINKS = [
  {
    title: "Flooring cost landing",
    href: "/flooring-cost",
    desc: "National flooring ranges by material, with breakdowns and FAQs.",
  },
  {
    title: "Flooring cost guide",
    href: "/guides/flooring",
    desc: "Compare hardwood, LVP, tile, and install cost drivers.",
  },
  {
    title: "Free flooring estimate",
    href: "/estimate?project=flooring",
    desc: "Choose material, area, tear-out, and subfloor prep for a ZIP-based range.",
  },
  {
    title: "Flooring costs by city",
    href: "/locations",
    desc: "Browse locally reviewed flooring pages across major U.S. markets.",
  },
];

const COST_DRIVERS = [
  {
    title: "Material choice",
    desc: "Hardwood and tile usually cost more per square foot than laminate or vinyl plank. Product line quality also moves price inside each category.",
  },
  {
    title: "Area and layout",
    desc: "Price by the rooms you are flooring, not whole-home square footage. Stairs, transitions, and odd shapes add labor.",
  },
  {
    title: "Tear-out",
    desc: "Removing old flooring and hauling debris adds labor and disposal fees. Glue-down and tile take longer than floating floors or carpet.",
  },
  {
    title: "Subfloor prep",
    desc: "Uneven, soft, or damaged subfloors need leveling or patching before install. Skipping prep is a common cause of early floor failure.",
  },
];

function FlooringTopicPage() {
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
              Flooring costs
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Plan a flooring project with national guides and city-level pricing context. Compare
              materials, estimate tear-out and prep, then check contractor quotes against local
              labor rates before you commit.
            </p>
          </div>
        </section>

        <section className="py-14 border-b border-border/60">
          <div className="container-x max-w-5xl">
            <h2 className="font-display text-2xl font-bold text-ink mb-3">
              What usually drives flooring cost
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-3xl">
              Installed price depends on more than the material sample. Tear-out, subfloor work,
              stairs, and transitions often explain why two quotes for the same room look different.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {COST_DRIVERS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-white p-5"
                >
                  <h3 className="font-display text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container-x max-w-5xl">
            <h2 className="font-display text-2xl font-bold text-ink mb-3">Flooring planning links</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-3xl">
              Start with a national range, then use city pages and the free estimator to tighten
              your budget before comparing installers.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-xl border border-border bg-white p-5 hover:border-primary/30 hover:shadow-sm transition"
                >
                  <h2 className="font-display text-lg font-bold text-ink">{link.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{link.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </a>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="/estimate?project=flooring"
                className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
              >
                Estimate a flooring project
              </a>
              <a
                href="/flooring-cost"
                className="inline-flex rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-muted"
              >
                Flooring cost overview
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
