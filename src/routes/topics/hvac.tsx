import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/topics/hvac")({
  component: HvacTopicPage,
  head: () => ({
    meta: [
      { title: "HVAC costs topic hub | CostReno" },
      {
        name: "description",
        content:
          "HVAC installation and replacement cost guides, system comparisons, and local city pages to help you plan before hiring.",
      },
      { property: "og:title", content: "HVAC costs topic hub | CostReno" },
      {
        property: "og:description",
        content:
          "Plan an HVAC project with national cost ranges, repair vs replace guidance, and city-level pricing context.",
      },
      { property: "og:url", content: "https://www.costreno.com/topics/hvac" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/topics/hvac" }],
  }),
});

const LINKS = [
  {
    title: "HVAC installation cost landing",
    href: "/hvac-installation-cost",
    desc: "National HVAC cost ranges, breakdowns, and FAQs for repair and replacement.",
  },
  {
    title: "HVAC installation guide",
    href: "/guides/hvac-installation",
    desc: "System sizing, labor factors, and what to check before you buy.",
  },
  {
    title: "HVAC costs by city",
    href: "/locations",
    desc: "Browse locally reviewed HVAC pages across major U.S. markets.",
  },
  {
    title: "Free HVAC estimate",
    href: "/estimate?project=hvac",
    desc: "Answer a few questions about system type, size, and ductwork for a ZIP-based range.",
  },
];

function HvacTopicPage() {
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
              HVAC costs
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Plan a repair or full system replacement with national guides, local pricing pages,
              and a free estimate wizard that asks about system type, capacity, ductwork, and
              efficiency.
            </p>
          </div>
        </section>
        <section className="py-14">
          <div className="container-x max-w-5xl grid md:grid-cols-2 gap-4">
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
          <div className="container-x max-w-5xl mt-10 flex flex-wrap gap-3">
            <a
              href="/estimate?project=hvac"
              className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
            >
              Estimate an HVAC project
            </a>
            <a
              href="/hvac-installation-cost"
              className="inline-flex rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-muted"
            >
              HVAC cost overview
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
