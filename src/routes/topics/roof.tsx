import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ROOF_CLUSTER_RELATED } from "@/lib/guides/roof-cluster";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/topics/roof")({
  component: RoofTopicPage,
  head: () => ({
    meta: [
      { title: "Roof costs topic hub | CostReno" },
      {
        name: "description",
        content:
          "Roof replacement cost guides by state and city, material comparisons, permits, financing, insurance claims, and quote review.",
      },
      { property: "og:title", content: "Roof costs topic hub | CostReno" },
      {
        property: "og:description",
        content:
          "Plan a roof replacement with national guides, local pricing pages, and contractor quote tools.",
      },
      { property: "og:url", content: "https://www.costreno.com/topics/roof" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/topics/roof" }],
  }),
});

const PLANNING_LINKS = [
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
    title: "Roof replacement cost by state",
    href: "/guides/roof-replacement-cost-by-state",
    desc: "Compare indicative ranges and labor context across every state we track.",
  },
  {
    title: "Roof replacement cost by city",
    href: "/guides/roof-replacement-cost-by-city",
    desc: "Open metro pages with local labor, climate, and permit starting points.",
  },
];

const DECISION_LINKS = [
  {
    title: "Metal vs asphalt roof",
    href: "/guides/metal-vs-asphalt-roof",
    desc: "Compare durability, cost, and trade-offs between common roofing materials.",
  },
  {
    title: "Roof replacement timeline",
    href: "/guides/roof-replacement-timeline",
    desc: "Typical phases from inspection through final inspection and cleanup.",
  },
  {
    title: "Roof permits",
    href: "/guides/roof-permits",
    desc: "When permits are required, who pulls them, and what inspections to expect.",
  },
];

const HIRE_LINKS = [
  {
    title: "Roof financing",
    href: "/guides/roof-financing",
    desc: "Compare savings, home equity, personal loans, and contractor financing.",
  },
  {
    title: "Roof insurance claims",
    href: "/guides/roof-insurance-claims",
    desc: "Document storm damage, work with adjusters, and review settlement scope.",
  },
  {
    title: "Can insurance cover roof replacement?",
    href: "/guides/can-insurance-cover-roof-replacement",
    desc: "Covered perils, ACV vs RCV, claim process, supplements, and contractor choice.",
  },
  {
    title: "Roof quote review",
    href: "/guides/roof-quote-review",
    desc: "Line-item checklist for tear-off, materials, permits, and warranties.",
  },
];

function LinkGrid({ links }: { links: typeof PLANNING_LINKS }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {links.map((link) => (
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
  );
}

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
              Plan a roof replacement with national guides, state and city pricing pages, material
              comparisons, and quote review tools. This hub links the full roof topic cluster in
              one place.
            </p>
          </div>
        </section>

        <section className="py-14 border-b border-border/60">
          <div className="container-x max-w-5xl">
            <h2 className="font-display text-2xl font-bold text-ink mb-6">Cost and planning</h2>
            <LinkGrid links={PLANNING_LINKS} />
          </div>
        </section>

        <section className="py-14 border-b border-border/60 bg-muted/20">
          <div className="container-x max-w-5xl">
            <h2 className="font-display text-2xl font-bold text-ink mb-6">
              Materials, timeline, and permits
            </h2>
            <LinkGrid links={DECISION_LINKS} />
          </div>
        </section>

        <section className="py-14 border-b border-border/60">
          <div className="container-x max-w-5xl">
            <h2 className="font-display text-2xl font-bold text-ink mb-6">
              Financing, insurance, and quotes
            </h2>
            <LinkGrid links={HIRE_LINKS} />
          </div>
        </section>

        <section className="py-14">
          <div className="container-x max-w-5xl">
            <h2 className="font-display text-2xl font-bold text-ink mb-4">All roof guides</h2>
            <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {ROOF_CLUSTER_RELATED.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium text-primary hover:border-primary/30 transition"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
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
              <a
                href="/locations"
                className="inline-flex rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-muted"
              >
                Browse city pages
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
