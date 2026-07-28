import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import {
  getAllCities,
  getCityCategoryUrl,
  isCityPageIndexable,
} from "@/lib/city-data";

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
    title: "2026 kitchen remodeling cost report",
    href: "/guides/2026-kitchen-remodeling-cost-report",
    desc: "What Americans are really paying: averages, tiers, ROI, and 2026 cost drivers.",
  },
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
    title: "Kitchen remodel quote review",
    href: "/guides/kitchen-quote-review",
    desc: "Line-item checklist for cabinets, layout work, and allowances.",
  },
  {
    title: "Is $30,000 enough for a kitchen remodel?",
    href: "/guides/is-30k-enough-for-kitchen-remodel",
    desc: "Budget breakdown, scope options, and cost-saving strategies for a $30k kitchen.",
  },
  {
    title: "How much should quartz countertops cost?",
    href: "/guides/quartz-countertop-cost",
    desc: "Installed pricing by brand tier, hidden fees, and quote comparison checklist.",
  },
  {
    title: "How much does labor cost to install cabinets?",
    href: "/guides/cabinet-install-labor-cost",
    desc: "Per-box and per-linear-foot rates, RTA vs custom, hidden fees, and quote comparison.",
  },
  {
    title: "Quartz vs granite countertops",
    href: "/guides/quartz-vs-granite-countertops",
    desc: "Compare cost, maintenance, and durability for two popular surfaces.",
  },
];

const COST_DRIVERS = [
  {
    title: "Cabinets",
    desc: "Often the largest line item. Stock, semi-custom, and custom options can change the budget by tens of thousands.",
  },
  {
    title: "Countertops",
    desc: "Laminate, quartz, granite, and marble trade price for durability and maintenance. Confirm edge profiles and sink cutouts in writing.",
  },
  {
    title: "Layout changes",
    desc: "Moving plumbing, electrical, or walls usually costs more than a same-footprint refresh. Ask for a clear scope before comparing bids.",
  },
  {
    title: "Appliances",
    desc: "Keeping existing units lowers cost. Mid-range and built-in packages can add several thousand dollars beyond cabinets and counters.",
  },
];

function KitchenTopicPage() {
  const kitchenCities = getAllCities()
    .filter((city) => isCityPageIndexable(city.slug, "kitchen-remodel"))
    .sort((a, b) => a.city.localeCompare(b.city));

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
              context across {kitchenCities.length} metro pages. Use these pages to set a realistic
              range before you request contractor quotes, then check bids against local labor and
              material pricing.
            </p>
          </div>
        </section>

        <section className="py-14 border-b border-border/60">
          <div className="container-x max-w-5xl">
            <h2 className="font-display text-2xl font-bold text-ink mb-3">
              What usually drives kitchen remodel cost
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-3xl">
              Most kitchen budgets swing on cabinets, counters, layout work, and appliances.
              Cosmetic updates stay closer to the low end. Full gut renovations with plumbing or
              electrical moves land higher and take longer.
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

        <section className="py-14 border-b border-border/60">
          <div className="container-x max-w-5xl">
            <h2 className="font-display text-2xl font-bold text-ink mb-3">Kitchen planning links</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-3xl">
              Start with a national range, then dig into guides and quote-review tools before you
              compare bids.
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
                href="/estimate?project=kitchen"
                className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
              >
                Estimate a kitchen project
              </a>
              <a
                href="/quote-analyzer"
                className="inline-flex rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-muted"
              >
                Analyze a kitchen quote
              </a>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container-x max-w-5xl">
            <h2 className="font-display text-2xl font-bold text-ink mb-3">
              Kitchen remodel cost by city
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-3xl">
              Each city page uses metro labor context, local housing and climate notes, and a
              planning cost range. Open your market before you compare contractor quotes.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {kitchenCities.map((city) => (
                <a
                  key={city.slug}
                  href={getCityCategoryUrl(city, "kitchen-remodel")}
                  className="rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold text-ink hover:border-primary/30 hover:shadow-sm transition"
                >
                  {city.city}, {city.stateAbbr}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
