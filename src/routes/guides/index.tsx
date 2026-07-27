import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

const TOPIC_HUBS = [
  {
    href: "/topics/quotes",
    title: "Contractor quotes",
    desc: "Read bids, ask better questions, and use quote tools before you hire.",
  },
  {
    href: "/topics/roof",
    title: "Roof costs",
    desc: "National guides, material comparisons, and local roofing pages.",
  },
  {
    href: "/topics/kitchen",
    title: "Kitchen costs",
    desc: "Remodel ranges, countertop comparisons, and local kitchen pages.",
  },
  {
    href: "/topics/windows",
    title: "Window costs",
    desc: "Replacement ranges, energy factors, and local window pages.",
  },
  {
    href: "/topics/flooring",
    title: "Flooring costs",
    desc: "Material comparisons and local flooring installation pages.",
  },
];

const GUIDES = [
  {
    href: "/guides/how-to-read-a-contractor-quote",
    title: "How to read a contractor quote",
    desc: "Line-item checklist for scope, allowances, exclusions, and payment terms.",
    tag: "Quotes",
  },
  {
    href: "/guides/questions-before-signing",
    title: "Questions to ask before signing",
    desc: "Credential, insurance, change-order, and warranty questions to ask.",
    tag: "Quotes",
  },
  {
    href: "/guides/inflated-quote-signs",
    title: "Signs a contractor quote is inflated",
    desc: "Red flags, vague scope, and pricing patterns to watch for.",
    tag: "Quotes",
  },
  {
    href: "/guides/quartz-vs-granite-countertops",
    title: "Quartz vs granite countertops",
    desc: "Cost, maintenance, and durability trade-offs for two popular surfaces.",
    tag: "Comparison",
  },
  {
    href: "/guides/roof-replacement",
    title: "Roof replacement cost guide",
    desc: "Pricing by material, size, and region, plus what quotes often miss.",
    tag: "Roofing",
  },
  {
    href: "/guides/kitchen-remodel",
    title: "Kitchen remodel cost guide",
    desc: "Budget ranges, cost drivers, and how to plan a clearer kitchen scope.",
    tag: "Kitchen",
  },
  {
    href: "/guides/bathroom-remodel",
    title: "Bathroom remodel cost guide",
    desc: "Typical ranges for refreshes and full gut renovations.",
    tag: "Bathroom",
  },
  {
    href: "/guides/hvac-installation",
    title: "HVAC installation cost guide",
    desc: "System sizing, labor factors, and what to check before you buy.",
    tag: "HVAC",
  },
  {
    href: "/guides/window-replacement",
    title: "Window replacement cost guide",
    desc: "Material and labor ranges, plus energy and install considerations.",
    tag: "Windows",
  },
  {
    href: "/guides/flooring",
    title: "Flooring cost guide",
    desc: "Compare common flooring options and install cost drivers.",
    tag: "Flooring",
  },
  {
    href: "/guides/metal-vs-asphalt-roof",
    title: "Metal vs asphalt roof",
    desc: "Cost, lifespan, and trade-offs to help you choose a roofing material.",
    tag: "Comparison",
  },
  {
    href: "/guides/roof-replacement-cost-by-state",
    title: "Roof replacement cost by state",
    desc: "Indicative ranges and labor context for every state we track.",
    tag: "Roofing",
  },
  {
    href: "/guides/roof-replacement-cost-by-city",
    title: "Roof replacement cost by city",
    desc: "Metro-level roof pricing pages with local factors and FAQs.",
    tag: "Roofing",
  },
  {
    href: "/guides/roof-replacement-timeline",
    title: "Roof replacement timeline",
    desc: "Typical phases from inspection through cleanup and final inspection.",
    tag: "Roofing",
  },
  {
    href: "/guides/roof-permits",
    title: "Roof permits",
    desc: "When permits are required, who pulls them, and what to verify on quotes.",
    tag: "Roofing",
  },
  {
    href: "/guides/roof-financing",
    title: "Roof financing",
    desc: "Compare savings, HELOCs, personal loans, and contractor financing.",
    tag: "Roofing",
  },
  {
    href: "/guides/roof-insurance-claims",
    title: "Roof insurance claims",
    desc: "Document storm damage, work with adjusters, and review settlement scope.",
    tag: "Roofing",
  },
  {
    href: "/guides/roof-quote-review",
    title: "Roof quote review",
    desc: "Line-item checklist for tear-off, materials, permits, and warranties.",
    tag: "Roofing",
  },
];

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
