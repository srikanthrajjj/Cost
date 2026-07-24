import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

interface TopicHubProps {
  title: string;
  description: string;
  links: { title: string; href: string; desc: string }[];
  tools: { title: string; href: string }[];
}

function TopicHubLayout({ title, description, links, tools }: TopicHubProps) {
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
            <h1 className="font-display text-3xl md:text-5xl font-bold text-ink mb-4">{title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </section>
        <section className="py-14">
          <div className="container-x max-w-5xl grid md:grid-cols-2 gap-4">
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
          <div className="container-x max-w-5xl mt-10 flex flex-wrap gap-3">
            {tools.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="inline-flex rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-muted"
              >
                {tool.title}
              </a>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export const Route = createFileRoute("/topics/quotes")({
  component: QuotesTopicPage,
  head: () => ({
    meta: [
      { title: "Contractor quotes topic hub | CostReno" },
      {
        name: "description",
        content:
          "Guides and tools for reading, analyzing, and comparing contractor quotes before you hire.",
      },
      { property: "og:title", content: "Contractor quotes topic hub | CostReno" },
      { property: "og:url", content: "https://www.costreno.com/topics/quotes" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/topics/quotes" }],
  }),
});

function QuotesTopicPage() {
  return (
    <TopicHubLayout
      title="Contractor quotes"
      description="Learn how to read bids, spot inflated pricing, ask better questions, and use CostReno tools before you sign."
      links={[
        {
          title: "How to read a contractor quote",
          href: "/guides/how-to-read-a-contractor-quote",
          desc: "Line-item checklist for scope, allowances, exclusions, and payment terms.",
        },
        {
          title: "Questions before signing",
          href: "/guides/questions-before-signing",
          desc: "Credential, insurance, change-order, and warranty questions to ask.",
        },
        {
          title: "Signs a quote is inflated",
          href: "/guides/inflated-quote-signs",
          desc: "Common red flags in overpriced or incomplete renovation bids.",
        },
        {
          title: "Quote analyzer",
          href: "/quote-analyzer",
          desc: "Upload one contractor quote for an AI scope and red-flag review.",
        },
      ]}
      tools={[
        { title: "Analyze a quote", href: "/quote-analyzer" },
        { title: "Compare quotes", href: "/compare-quotes" },
        { title: "All guides", href: "/guides" },
      ]}
    />
  );
}
