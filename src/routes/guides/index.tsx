import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { GUIDES, TOPIC_HUBS } from "@/lib/guides/catalog";

export const Route = createFileRoute("/guides/")({
  component: GuidesIndexPage,
  head: () => ({
    meta: [
      { title: "Home renovation guides | CostReno" },
      {
        name: "description",
        content:
          "Practical guides on renovation costs, contractor quotes, and project planning for roof, kitchen, bathroom, HVAC, windows, and flooring.",
      },
      { property: "og:title", content: "Home renovation guides | CostReno" },
      {
        property: "og:description",
        content:
          "Browse CostReno guides on renovation costs, quote red flags, and project planning.",
      },
      { property: "og:url", content: "https://www.costreno.com/guides" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/guides" }],
  }),
});

function GuidesIndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <section className="py-16 md:py-20 border-b border-border/60">
          <div className="container-x max-w-4xl">
            <p className="text-sm text-muted-foreground mb-3 inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Guides and planning articles
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-ink mb-4">
              Home renovation guides
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Clear explanations of project costs, quote red flags, and material trade-offs so you
              can plan with better information before you hire.
            </p>
          </div>
        </section>

        <section className="py-10 border-b border-border/60">
          <div className="container-x max-w-5xl">
            <h2 className="font-display text-xl font-bold text-ink mb-4">Topic hubs</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOPIC_HUBS.map((hub) => (
                <a
                  key={hub.href}
                  href={hub.href}
                  className="rounded-xl border border-border/60 bg-white p-5 hover:border-primary/30 hover:shadow-sm transition"
                >
                  <h3 className="font-display text-base font-bold text-ink">{hub.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{hub.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container-x max-w-5xl grid sm:grid-cols-2 gap-4">
            {GUIDES.map((guide) => (
              <a
                key={guide.href}
                href={guide.href}
                className="rounded-xl border border-border/60 bg-white p-5 hover:border-primary/30 hover:shadow-sm transition group"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {guide.tag}
                </p>
                <h2 className="font-display text-lg font-bold text-ink group-hover:text-primary transition">
                  {guide.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{guide.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="py-12 bg-muted/20 border-y border-border/60">
          <div className="container-x max-w-4xl flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Ready to check a quote?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Analyze one bid, or compare two side by side.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/quote-analyzer"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
              >
                Analyze a quote
              </a>
              <a
                href="/compare-quotes"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-muted"
              >
                Compare quotes
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
