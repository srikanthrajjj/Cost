import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Database,
  FileText,
  LayoutGrid,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Wind,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GUIDES, TOPIC_HUBS, type GuideEntry } from "@/lib/guides/catalog";
import { absoluteUrl, buildBreadcrumbList, buildFaqSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";

const PATH = "/guides";

const PAGE_FAQS = [
  {
    q: "What is included in the CostReno knowledge center?",
    a: "You can browse renovation cost guides, contractor quote advice, topic hubs, and planning resources for projects like roofing, kitchens, bathrooms, HVAC, windows, flooring, and energy upgrades.",
  },
  {
    q: "How often are guides and pricing references updated?",
    a: "CostReno reviews this library monthly and refreshes pricing, planning guidance, and quote review content as new data and editorial updates are published.",
  },
  {
    q: "Can I go from a guide to a planning tool?",
    a: "Yes. The page links directly to CostReno tools for project cost estimates, AI quote analysis, quote comparison, and other planning resources so homeowners can move from research to action.",
  },
] as const;

export const Route = createFileRoute("/guides/")({
  component: GuidesIndexPage,
  head: () => ({
    meta: [
      { title: "Home renovation knowledge center | CostReno" },
      {
        name: "description",
        content:
          "Expert renovation cost guides, contractor advice, quote reviews, and planning resources.",
      },
      { property: "og:title", content: "Home renovation knowledge center | CostReno" },
      {
        property: "og:description",
        content:
          "Browse expert renovation cost guides, AI quote review resources, and planning tools for homeowners.",
      },
      { property: "og:url", content: absoluteUrl(PATH) },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl(PATH) }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Home Renovation Knowledge Center",
          description:
            "Expert renovation cost guides, contractor advice, quote reviews, and planning resources.",
          url: absoluteUrl(PATH),
          isPartOf: {
            "@type": "WebSite",
            name: "CostReno",
            url: absoluteUrl("/"),
          },
          about: {
            "@type": "Thing",
            name: "Home renovation costs and contractor quote planning",
          },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: GUIDES.length,
            itemListElement: GUIDES.map((guide, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteUrl(guide.href),
              name: guide.title,
              description: guide.desc,
            })),
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(buildFaqSchema([...PAGE_FAQS])),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          buildBreadcrumbList([
            { name: "Home", path: "/" },
            { name: "Guides", path: PATH },
          ]),
        ),
      },
    ],
  }),
});

const TAG_ORDER = [
  "Quotes",
  "Roofing",
  "Kitchen",
  "Bathroom",
  "HVAC",
  "Windows",
  "Flooring",
  "Energy",
  "Comparison",
] as const;

type GuideTag = (typeof TAG_ORDER)[number];

const TAG_ICONS: Record<GuideTag, LucideIcon> = {
  Quotes: FileText,
  Roofing: Layers,
  Kitchen: Layers,
  Bathroom: Layers,
  HVAC: Wind,
  Windows: Layers,
  Flooring: Layers,
  Energy: Zap,
  Comparison: Sparkles,
};

/** Soft, brand-safe tints for unselected chips (no purple, no accent green). */
const TAG_TINTS: Record<
  GuideTag | "All",
  { chip: string; iconWrap: string; icon: string; count: string }
> = {
  All: {
    chip: "border-primary/20 bg-primary/[0.06] text-ink hover:border-primary/35 hover:bg-primary/10",
    iconWrap: "bg-primary/12",
    icon: "text-primary",
    count: "text-primary/70 bg-primary/10",
  },
  Quotes: {
    chip: "border-sky-200/80 bg-sky-50 text-ink hover:border-sky-300 hover:bg-sky-100/80",
    iconWrap: "bg-sky-100",
    icon: "text-sky-700",
    count: "text-sky-800/70 bg-sky-100/90",
  },
  Roofing: {
    chip: "border-slate-200/90 bg-slate-50 text-ink hover:border-slate-300 hover:bg-slate-100/80",
    iconWrap: "bg-slate-200/70",
    icon: "text-slate-700",
    count: "text-slate-600 bg-slate-200/60",
  },
  Kitchen: {
    chip: "border-amber-200/80 bg-amber-50 text-ink hover:border-amber-300 hover:bg-amber-100/70",
    iconWrap: "bg-amber-100",
    icon: "text-amber-800",
    count: "text-amber-800/70 bg-amber-100/90",
  },
  Bathroom: {
    chip: "border-cyan-200/80 bg-cyan-50 text-ink hover:border-cyan-300 hover:bg-cyan-100/70",
    iconWrap: "bg-cyan-100",
    icon: "text-cyan-800",
    count: "text-cyan-800/70 bg-cyan-100/90",
  },
  HVAC: {
    chip: "border-blue-200/80 bg-blue-50 text-ink hover:border-blue-300 hover:bg-blue-100/70",
    iconWrap: "bg-blue-100",
    icon: "text-blue-800",
    count: "text-blue-800/70 bg-blue-100/90",
  },
  Windows: {
    chip: "border-teal-200/80 bg-teal-50 text-ink hover:border-teal-300 hover:bg-teal-100/70",
    iconWrap: "bg-teal-100",
    icon: "text-teal-800",
    count: "text-teal-800/70 bg-teal-100/90",
  },
  Flooring: {
    chip: "border-orange-200/70 bg-orange-50 text-ink hover:border-orange-300/80 hover:bg-orange-100/70",
    iconWrap: "bg-orange-100",
    icon: "text-orange-800",
    count: "text-orange-800/70 bg-orange-100/90",
  },
  Energy: {
    chip: "border-yellow-200/80 bg-yellow-50 text-ink hover:border-yellow-300 hover:bg-yellow-100/70",
    iconWrap: "bg-yellow-100",
    icon: "text-yellow-800",
    count: "text-yellow-800/75 bg-yellow-100/90",
  },
  Comparison: {
    chip: "border-primary/15 bg-[#082A4B]/[0.04] text-ink hover:border-primary/30 hover:bg-[#082A4B]/[0.08]",
    iconWrap: "bg-primary/10",
    icon: "text-primary",
    count: "text-primary/70 bg-primary/10",
  },
};

const HUB_ICONS: Record<string, LucideIcon> = {
  "/topics/quotes": FileText,
  "/topics/roof": Layers,
  "/topics/kitchen": Layers,
  "/topics/windows": Layers,
  "/topics/hvac": Wind,
  "/topics/energy": Zap,
  "/topics/flooring": Layers,
};

const FEATURED_HREFS = [
  "/guides/how-to-read-a-contractor-quote",
  "/guides/is-contractor-quote-fair",
  "/guides/roof-replacement",
  "/guides/kitchen-remodel",
] as const;

const RECENTLY_UPDATED_HREFS = [
  "/guides/2026-kitchen-remodeling-cost-report",
  "/guides/roof-insurance-claims",
  "/guides/how-to-read-a-contractor-quote",
] as const;

const HERO_TRUST_METRICS = [
  "34 Expert Guides",
  "Updated Monthly",
  "AI Quote Reviews",
  "Cost Estimators",
] as const;

const TRUST_BAR_ITEMS = [
  { label: "Monthly Pricing Updates", icon: CalendarDays },
  { label: "U.S. Cost Database", icon: Database },
  { label: "AI Quote Analysis", icon: Sparkles },
  { label: "Built for Homeowners", icon: ShieldCheck },
] as const;

const TRENDING_TOPICS = [
  "Roof Replacement",
  "Kitchen Remodel",
  "Insurance Claims",
  "Quartz Countertops",
  "HVAC Costs",
] as const;

const TOOL_CARDS = [
  {
    title: "Kitchen cost estimator",
    desc: "Plan a kitchen budget range before you request bids.",
    href: "/estimate?project=kitchen",
    icon: LayoutGrid,
  },
  {
    title: "Bathroom estimator",
    desc: "Check likely bathroom remodel costs by project scope.",
    href: "/estimate?project=bathroom",
    icon: LayoutGrid,
  },
  {
    title: "Roof cost calculator",
    desc: "Estimate roof replacement costs with local pricing context.",
    href: "/estimate?project=roof",
    icon: Layers,
  },
  {
    title: "AI quote review",
    desc: "Upload one contractor quote for line-item analysis.",
    href: "/quote-analyzer",
    icon: Sparkles,
  },
  {
    title: "ROI calculator",
    desc: "Review remodeling return guidance in our 2026 kitchen report.",
    href: "/guides/2026-kitchen-remodeling-cost-report",
    icon: Database,
  },
  {
    title: "Project timeline planner",
    desc: "See the major phases homeowners should plan around.",
    href: "/guides/roof-replacement-timeline",
    icon: Wrench,
  },
] as const;

const HUB_GUIDE_MATCHERS: Record<string, (guide: GuideEntry) => boolean> = {
  "/topics/quotes": (guide) => guide.tag === "Quotes",
  "/topics/roof": (guide) =>
    guide.tag === "Roofing" || guide.href === "/guides/metal-vs-asphalt-roof",
  "/topics/kitchen": (guide) =>
    guide.tag === "Kitchen" || guide.href === "/guides/quartz-vs-granite-countertops",
  "/topics/windows": (guide) => guide.tag === "Windows",
  "/topics/hvac": (guide) => guide.tag === "HVAC",
  "/topics/energy": (guide) => guide.tag === "Energy",
  "/topics/flooring": (guide) => guide.tag === "Flooring",
};

function getHubGuideCount(hubHref: string) {
  const matcher = HUB_GUIDE_MATCHERS[hubHref];
  return matcher ? GUIDES.filter(matcher).length : 0;
}

function isGuideTag(tag: string): tag is GuideTag {
  return (TAG_ORDER as readonly string[]).includes(tag);
}

function GuidesIndexPage() {
  const [activeTag, setActiveTag] = useState<string>("All");
  const [query, setQuery] = useState("");

  const availableTags = useMemo(() => {
    const present = new Set(GUIDES.map((g) => g.tag));
    return TAG_ORDER.filter((tag) => present.has(tag));
  }, []);

  const featuredGuides = useMemo(
    () =>
      FEATURED_HREFS.map((href) => GUIDES.find((g) => g.href === href)).filter(
        (g): g is GuideEntry => Boolean(g),
      ),
    [],
  );

  const recentlyUpdatedGuides = useMemo(
    () =>
      RECENTLY_UPDATED_HREFS.map((href) => GUIDES.find((g) => g.href === href)).filter(
        (g): g is GuideEntry => Boolean(g),
      ),
    [],
  );

  const filteredGuides = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GUIDES.filter((guide) => {
      if (activeTag !== "All" && guide.tag !== activeTag) return false;
      if (!q) return true;
      return (
        guide.title.toLowerCase().includes(q) ||
        guide.desc.toLowerCase().includes(q) ||
        guide.tag.toLowerCase().includes(q)
      );
    });
  }, [activeTag, query]);

  const clearFilters = () => {
    setActiveTag("All");
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="guides" />
      <main>
        <header className="relative overflow-hidden border-b border-primary/10 bg-background">
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,#EDF4FB_0%,#F6FAFD_40%,#FFFFFF_100%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -top-28 right-[-12%] h-[24rem] w-[24rem] rounded-full bg-[#082A4B]/[0.12] blur-3xl motion-reduce:hidden"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-[14%] left-[-8%] h-72 w-72 rounded-full bg-[#082A4B]/[0.08] blur-3xl motion-reduce:hidden"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-[-34%] left-[24%] h-72 w-72 rounded-full bg-[#082A4B]/[0.06] blur-3xl motion-reduce:hidden"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/80 to-transparent"
            aria-hidden="true"
          />

          <div className="relative container-x max-w-5xl pt-14 pb-16 md:pt-20 md:pb-24">
            <Breadcrumb className="mb-8 flex justify-center">
              <BreadcrumbList className="text-xs text-primary/70">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Guides</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <p className="mb-5 inline-flex items-center rounded-full border border-primary/10 bg-white/90 px-3 py-1 text-sm text-primary shadow-sm">
                Reviewed by CostReno editorial team
              </p>
              <h1 className="mb-5 font-display text-4xl font-bold tracking-tight text-ink md:text-6xl">
                Home Renovation Knowledge Center
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                Expert renovation cost guides, contractor advice, quote reviews, and planning
                resources.
              </p>
              <ul className="mt-7 flex flex-wrap justify-center gap-2.5 text-sm text-muted-foreground">
                {HERO_TRUST_METRICS.map((metric) => (
                  <li
                    key={metric}
                    className="inline-flex items-center rounded-full border border-primary/10 bg-white/90 px-3 py-1 shadow-sm"
                  >
                    {metric}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <a
                  href="#browse-guides"
                  className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Browse guides
                </a>
                <a
                  href="/estimate"
                  className="inline-flex items-center justify-center rounded-lg border border-primary/20 bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-[transform,background-color,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Estimate project cost
                </a>
                <a
                  href="/quote-analyzer"
                  className="inline-flex items-center justify-center rounded-lg border border-primary/20 bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-[transform,background-color,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Analyze a quote
                </a>
              </div>
            </div>
          </div>
        </header>

        <section
          aria-labelledby="guides-trust-bar"
          className="border-b border-border/60 bg-[#F7F8FA] py-7"
        >
          <div className="container-x max-w-5xl">
            <h2 id="guides-trust-bar" className="sr-only">
              Knowledge center trust signals
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST_BAR_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold leading-5 text-ink">{item.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="most-popular-guides"
          className="border-b border-border/60 bg-white py-12 md:py-14"
        >
          <div className="container-x max-w-5xl">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Expert guides
                </p>
                <h2 id="most-popular-guides" className="font-display text-2xl font-bold text-ink">
                  Most popular guides
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  High-intent reads homeowners use first when planning scope, pricing, and quote
                  review.
                </p>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {featuredGuides.map((guide, i) => {
                return (
                  <a
                    key={guide.href}
                    href={guide.href}
                    className={cn(
                      "group relative rounded-2xl border border-border/40 bg-[#FBFBFC] p-7 shadow-sm",
                      "transition-[transform,box-shadow,border-color] duration-200 ease-out",
                      "hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5",
                      "motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    <span className="absolute top-5 right-5 text-[10px] font-semibold tabular-nums text-muted-foreground/55">
                      0{i + 1}
                    </span>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                        Popular
                      </span>
                      <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        {guide.tag}
                      </span>
                    </div>
                    <h3 className="pr-6 font-display text-xl font-bold leading-7 text-ink group-hover:text-primary transition-colors duration-200">
                      {guide.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground line-clamp-2">
                      {guide.desc}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground/80">
                      <span>{guide.readingTime}</span>
                      <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
                      <span>Updated {guide.lastUpdated}</span>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Read guide
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="topic-hubs"
          aria-labelledby="topic-hubs-heading"
          className="scroll-mt-28 border-b border-border/60 bg-[#FAFBFC] py-12 md:py-14"
        >
          <div className="container-x max-w-5xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Pricing database
            </p>
            <h2 id="topic-hubs-heading" className="mb-1 font-display text-2xl font-bold text-ink">
              Topic hubs
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Jump into a project area, then dig into the guides below.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TOPIC_HUBS.map((hub) => {
                const Icon = HUB_ICONS[hub.href] ?? BookOpen;
                const guideCount = getHubGuideCount(hub.href);
                return (
                  <a
                    key={hub.href}
                    href={hub.href}
                    className={cn(
                      "group flex gap-3.5 rounded-xl border border-border/40 bg-white p-5 shadow-sm",
                      "transition-[transform,box-shadow,border-color] duration-200 ease-out",
                      "hover:-translate-y-1 hover:border-primary/20 hover:shadow-md",
                      "motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary transition-colors duration-200 group-hover:bg-primary/12">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <h3 className="font-display text-lg font-bold text-ink group-hover:text-primary transition-colors duration-200">
                        {hub.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{hub.desc}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground/80">
                        <span>{guideCount} Guides</span>
                        <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
                        <span>{hub.readingTime}</span>
                        <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
                        <span>Updated {hub.lastUpdated}</span>
                      </div>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="popular-tools-heading"
          className="border-b border-border/60 bg-[#F4F8FB] py-12 md:py-14"
        >
          <div className="container-x max-w-5xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Planning tools
            </p>
            <h2 id="popular-tools-heading" className="mb-1 font-display text-2xl font-bold text-ink">
              Popular tools
            </h2>
            <p className="mb-5 text-sm text-muted-foreground">
              Move from research to action with estimators, quote review, and planning resources.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TOOL_CARDS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <a
                    key={tool.title}
                    href={tool.href}
                    className={cn(
                      "group rounded-xl border border-border/30 bg-white/95 p-5 shadow-sm",
                      "transition-[transform,box-shadow,border-color] duration-200 ease-out",
                      "hover:-translate-y-1 hover:border-primary/20 hover:shadow-md",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        Tool
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-ink transition-colors duration-200 group-hover:text-primary">
                      {tool.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Open tool
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="browse-guides"
          aria-labelledby="browse-guides-heading"
          className="scroll-mt-28 bg-white"
        >
          <div className="sticky top-16 z-30 border-b border-border/60 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/85">
            <div className="container-x max-w-5xl py-3.5 space-y-3">
              <div className="relative max-w-xl">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search guides, costs, contractors, permits, or quote reviews..."
                  aria-label="Search guides"
                  className={cn(
                    "flex h-11 w-full rounded-xl border border-border/70 bg-white pl-9 pr-9 text-sm text-ink",
                    "placeholder:text-muted-foreground/80 shadow-sm",
                    "transition-[border-color,box-shadow] duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/35 focus-visible:shadow-md",
                  )}
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-ink hover:bg-muted transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>

              <TopicChipsRow>
                <FilterChip
                  label="All"
                  tintKey="All"
                  count={GUIDES.length}
                  active={activeTag === "All"}
                  icon={LayoutGrid}
                  onClick={() => setActiveTag("All")}
                />
                {availableTags.map((tag) => {
                  const count = GUIDES.filter((g) => g.tag === tag).length;
                  const Icon = TAG_ICONS[tag];
                  return (
                    <FilterChip
                      key={tag}
                      label={tag}
                      tintKey={tag}
                      count={count}
                      active={activeTag === tag}
                      icon={Icon}
                      onClick={() => setActiveTag(tag)}
                    />
                  );
                })}
              </TopicChipsRow>
            </div>
          </div>

          <div className="container-x max-w-5xl py-12 md:py-14">
            <div className="mb-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Updated monthly
              </p>
              <h2 id="browse-guides-heading" className="font-display text-2xl font-bold text-ink">
                Browse all guides
              </h2>
            </div>

            <section aria-labelledby="recently-updated-heading" className="mb-10">
              <div className="mb-4">
                <h3 id="recently-updated-heading" className="font-display text-xl font-bold text-ink">
                  Recently updated
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fresh planning reads reviewed by the CostReno editorial team.
                </p>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {recentlyUpdatedGuides.map((guide) => (
                  <a
                    key={guide.href}
                    href={guide.href}
                    className={cn(
                      "group rounded-xl border border-border/40 bg-white px-5 py-4 shadow-sm",
                      "transition-[transform,box-shadow,border-color] duration-200 ease-out",
                      "hover:-translate-y-1 hover:border-primary/20 hover:shadow-md",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-800">
                            Recently updated
                          </span>
                          <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                            {guide.tag}
                          </span>
                        </div>
                        <h4 className="font-display text-base font-bold text-ink transition-colors duration-200 group-hover:text-primary">
                          {guide.title}
                        </h4>
                        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {guide.desc}
                        </p>
                      </div>
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground/80">
                      <span>{guide.readingTime}</span>
                      <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
                      <span>Updated {guide.lastUpdated}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            <section aria-labelledby="trending-guides-heading" className="mb-10">
              <h3 id="trending-guides-heading" className="font-display text-xl font-bold text-ink">
                Trending This Month
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {TRENDING_TOPICS.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center rounded-full border border-border/70 bg-muted/35 px-3 py-1 text-sm text-ink"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </section>

            <div className="mb-6 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {filteredGuides.length === 0
                  ? "No guides match"
                  : `${filteredGuides.length} guide${filteredGuides.length === 1 ? "" : "s"}`}
                {activeTag !== "All" ? (
                  <>
                    {" "}
                    in <span className="font-medium text-ink">{activeTag}</span>
                  </>
                ) : null}
                {query.trim() ? (
                  <>
                    {" "}
                    for <span className="font-medium text-ink">&ldquo;{query.trim()}&rdquo;</span>
                  </>
                ) : null}
              </p>
              {(activeTag !== "All" || query.trim()) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {filteredGuides.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
                <p className="font-display text-lg font-bold text-ink mb-2">No matching guides</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Try another topic chip or a shorter search term.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-muted transition-colors"
                >
                  Show all guides
                </button>
              </div>
            ) : (
              <div
                key={`${activeTag}-${query}`}
                className="grid gap-5 sm:grid-cols-2 animate-in fade-in duration-200 motion-reduce:animate-none"
              >
                {filteredGuides.map((guide) => {
                  return (
                    <a
                      key={guide.href}
                      href={guide.href}
                      className={cn(
                        "group flex flex-col rounded-xl border border-border/35 bg-white p-6 shadow-sm",
                        "transition-[transform,box-shadow,border-color] duration-200 ease-out",
                        "hover:-translate-y-1 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5",
                        "motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      )}
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                            {guide.tag}
                          </span>
                          {guide.popular ? (
                            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                              Popular
                            </span>
                          ) : null}
                          {guide.recentlyUpdated ? (
                            <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-800">
                              Recently updated
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <h3 className="font-display text-xl font-bold leading-7 text-ink group-hover:text-primary transition-colors duration-200">
                        {guide.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                        {guide.desc}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground/80">
                        <span>{guide.readingTime}</span>
                        <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
                        <span>Updated {guide.lastUpdated}</span>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        Read guide
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
                      </span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="border-y border-border/60 bg-[#F8FAFC] py-14">
          <div className="container-x max-w-5xl">
            <div className="rounded-3xl border border-border/40 bg-white px-7 py-10 shadow-sm md:px-10 md:py-12">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-2xl">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    U.S. cost data
                  </p>
                  <h2 className="font-display text-3xl font-bold text-ink">
                    Ready to plan your renovation?
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Move from reading to action with CostReno pricing tools and AI quote review.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/estimate"
                    className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Estimate My Project
                  </a>
                  <a
                    href="/quote-analyzer"
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Upload Contractor Quote
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function TopicChipsRow({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filter guides by topic"
    >
      {children}
    </div>
  );
}

function FilterChip({
  label,
  tintKey,
  count,
  active,
  icon: Icon,
  onClick,
}: {
  label: string;
  tintKey: GuideTag | "All";
  count: number;
  active: boolean;
  icon?: LucideIcon;
  onClick: () => void;
}) {
  const tint = TAG_TINTS[tintKey];

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium",
        "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out",
        "hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        active
          ? "border-primary bg-primary text-white shadow-sm ring-2 ring-primary/25 ring-offset-1 ring-offset-background"
          : tint.chip,
      )}
    >
      {Icon ? (
        <span
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-150",
            active ? "bg-white/15 text-white" : cn(tint.iconWrap, tint.icon),
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.25} />
        </span>
      ) : null}
      <span>{label}</span>
      <span
        className={cn(
          "min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold tabular-nums leading-none",
          active ? "bg-white/20 text-white/90" : tint.count,
        )}
      >
        {count}
      </span>
    </button>
  );
}
