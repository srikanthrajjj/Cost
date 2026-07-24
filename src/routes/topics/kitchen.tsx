import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/topics/kitchen")({
  component: KitchenTopicPage,
  head: () => ({
    meta: [
      { title: "Kitchen costs topic hub | CostReno" },
      {
        name: "description",
        content:
          "Kitchen remodel cost guides, countertop comparisons, and local city pages to help you plan before hiring.",
      },
      { property: "og:title", content: "Kitchen costs topic hub | CostReno" },
      { property: "og:url", content: "https://www.costreno.com/topics/kitchen" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/topics/kitchen" }],
  }),
});

const LINKS = [
  {
    title: "Kitchen remodel cost landing",
    href: "/kitchen-remodel-cost",
    desc: "National kitchen remodel ranges, breakdowns, and FAQs.",
  },
  {
    title: "Kitchen remodel guide",
    href: "/guides/kitchen-remodel",
    desc: "Plan scope, budget drivers, and common remodel pitfalls.",
  },
  {
    title: "Quartz vs granite countertops",
    href: "/guides/quartz-vs-granite-countertops",
    desc: "Compare cost, maintenance, and durability for two popular surfaces.",
  },
  {
    title: "Kitchen costs by city",
    href: "/locations",
    desc: "Browse local kitchen remodel pages across major U.S. markets.",
  },
];

function KitchenTopicPage() {
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
              Kitchen costs
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Plan a kitchen remodel with cost landings, material comparisons, and local pricing
              context.
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
              href="/estimate?project=kitchen"
              className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
            >
              Estimate a kitchen project
            </a>
            <a
              href="/kitchen-remodel-cost"
              className="inline-flex rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-muted"
            >
              Kitchen cost overview
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
