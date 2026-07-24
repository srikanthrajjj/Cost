import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/topics/roof")({
  component: RoofTopicPage,
  head: () => ({
    meta: [
      { title: "Roof costs topic hub | CostReno" },
      {
        name: "description",
        content:
          "Roof replacement cost guides, material comparisons, and local city pages to help you plan before hiring.",
      },
      { property: "og:title", content: "Roof costs topic hub | CostReno" },
      { property: "og:url", content: "https://www.costreno.com/topics/roof" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/topics/roof" }],
  }),
});

const LINKS = [
  {
    title: "Roof replacement cost landing",
    href: "/roof-replacement-cost",
    desc: "National cost ranges, breakdowns, and FAQs for roof replacement.",
  },
  {
    title: "Roof replacement guide",
    href: "/guides/roof-replacement",
    desc: "Deep guide on materials, hidden costs, and planning a replacement.",
  },
  {
    title: "Metal vs asphalt roof",
    href: "/guides/metal-vs-asphalt-roof",
    desc: "Compare durability, cost, and trade-offs between common roofing materials.",
  },
  {
    title: "Roof costs by city",
    href: "/locations",
    desc: "Browse local roof replacement pages across major U.S. markets.",
  },
];

function RoofTopicPage() {
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
              Roof costs
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Plan a roof replacement with national guides, material comparisons, and city-level
              pricing context.
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
              href="/estimate?project=roof"
              className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
            >
              Estimate a roof project
            </a>
            <a
              href="/quote-analyzer"
              className="inline-flex rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-muted"
            >
              Analyze a roofing quote
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
