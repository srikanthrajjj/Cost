import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bath,
  BookOpen,
  FileText,
  Home,
  LayoutGrid,
  Layers,
  Scale,
  Search,
  Square,
  Thermometer,
  UtensilsCrossed,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { GUIDES, TOPIC_HUBS, type GuideEntry } from "@/lib/guides/catalog";
import { cn } from "@/lib/utils";

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
  Roofing: Home,
  Kitchen: UtensilsCrossed,
  Bathroom: Bath,
  HVAC: Thermometer,
  Windows: Square,
  Flooring: Layers,
  Energy: Zap,
  Comparison: Scale,
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
  "/topics/roof": Home,
  "/topics/kitchen": UtensilsCrossed,
  "/topics/windows": Square,
  "/topics/hvac": Wind,
  "/topics/energy": Zap,
  "/topics/flooring": Layers,
};

const FEATURED_HREFS = [
  "/guides/how-to-read-a-contractor-quote",
  "/guides/is-contractor-quote-fair",
  "/guides/roof-replacement",
] as const;

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
        {/* Hero: light cream/cool wash, soft navy + warm blobs (no blueprint grid) */}
        <section className="relative overflow-hidden border-b border-border/60 bg-[#F7F5F1]">
          <div
            className="absolute inset-0 bg-[linear-gradient(165deg,#F7F5F1_0%,#EEF2F6_42%,#F4F7FA_72%,#F8F6F2_100%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -top-28 right-[-12%] h-[22rem] w-[22rem] rounded-full bg-[#082A4B]/[0.07] blur-3xl motion-reduce:hidden"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-[18%] left-[-10%] h-64 w-64 rounded-full bg-[#C4A574]/[0.14] blur-3xl motion-reduce:hidden"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-[-30%] right-[18%] h-72 w-72 rounded-full bg-[#082A4B]/[0.05] blur-3xl motion-reduce:hidden"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/80 to-transparent"
            aria-hidden="true"
          />

          <div className="relative container-x max-w-5xl pt-14 pb-12 md:pt-20 md:pb-16">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-sm text-primary shadow-sm">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                {GUIDES.length} guides across {availableTags.length} topics
              </p>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-ink mb-4 tracking-tight">
                Home renovation guides
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Clear explanations of project costs, quote red flags, and material trade-offs so you
                can plan with better information before you hire.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#browse-guides"
                  className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors duration-200"
                >
                  Browse guides
                </a>
                <a
                  href="#topic-hubs"
                  className="inline-flex items-center justify-center rounded-lg border border-primary/20 bg-white px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors duration-200"
                >
                  Explore topics
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Start here */}
        <section className="py-10 md:py-12 border-b border-border/60 bg-surface/60">
          <div className="container-x max-w-5xl">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <h2 className="font-display text-xl font-bold text-ink">Start here</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  High-intent reads most homeowners open first.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {featuredGuides.map((guide, i) => {
                const Icon = isGuideTag(guide.tag) ? TAG_ICONS[guide.tag] : BookOpen;
                return (
                  <a
                    key={guide.href}
                    href={guide.href}
                    className={cn(
                      "group relative rounded-xl border border-border/60 bg-white p-5",
                      "transition-[transform,box-shadow,border-color] duration-200 ease-out",
                      "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md",
                      "motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    <span className="absolute top-4 right-4 text-[10px] font-semibold tabular-nums text-muted-foreground/70">
                      0{i + 1}
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 text-primary mb-3 transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      {guide.tag}
                    </p>
                    <h3 className="font-display text-base font-bold text-ink group-hover:text-primary transition-colors duration-200 pr-6">
                      {guide.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {guide.desc}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Read guide
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Topic hubs */}
        <section id="topic-hubs" className="py-10 md:py-12 border-b border-border/60 scroll-mt-28">
          <div className="container-x max-w-5xl">
            <h2 className="font-display text-xl font-bold text-ink mb-1">Topic hubs</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Jump into a project area, then dig into the guides below.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TOPIC_HUBS.map((hub) => {
                const Icon = HUB_ICONS[hub.href] ?? BookOpen;
                return (
                  <a
                    key={hub.href}
                    href={hub.href}
                    className={cn(
                      "group flex gap-3.5 rounded-xl border border-border/60 bg-white p-4",
                      "transition-[transform,box-shadow,border-color] duration-200 ease-out",
                      "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md",
                      "motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <h3 className="font-display text-base font-bold text-ink group-hover:text-primary transition-colors duration-200">
                        {hub.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{hub.desc}</p>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sticky filters + guide grid */}
        <section id="browse-guides" className="scroll-mt-28">
          <div className="sticky top-16 z-30 border-b border-border/60 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/85">
            <div className="container-x max-w-5xl py-3.5 space-y-3">
              <div className="relative max-w-md">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search guides…"
                  aria-label="Search guides"
                  className={cn(
                    "flex h-10 w-full rounded-lg border border-border bg-white pl-9 pr-9 text-sm text-ink",
                    "placeholder:text-muted-foreground shadow-sm",
                    "transition-[border-color,box-shadow] duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary/40",
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

          <div className="container-x max-w-5xl py-10 md:py-12">
            <div className="flex items-center justify-between gap-3 mb-5">
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
                className="grid sm:grid-cols-2 gap-4 animate-in fade-in duration-200 motion-reduce:animate-none"
              >
                {filteredGuides.map((guide) => {
                  const Icon = isGuideTag(guide.tag) ? TAG_ICONS[guide.tag] : BookOpen;
                  return (
                    <a
                      key={guide.href}
                      href={guide.href}
                      className={cn(
                        "group flex flex-col rounded-xl border border-border/60 bg-white p-5",
                        "transition-[transform,box-shadow,border-color] duration-200 ease-out",
                        "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md",
                        "motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      )}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                          {guide.tag}
                        </span>
                      </div>
                      <h2 className="font-display text-lg font-bold text-ink group-hover:text-primary transition-colors duration-200">
                        {guide.title}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                        {guide.desc}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        Read guide
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" />
                      </span>
                    </a>
                  );
                })}
              </div>
            )}
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
                className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
              >
                Analyze a quote
              </a>
              <a
                href="/compare-quotes"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-muted transition-colors"
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
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium",
        "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out",
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
