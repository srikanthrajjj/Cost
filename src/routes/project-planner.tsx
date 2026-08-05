import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Sparkles,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import type { ProjectType } from "@/lib/estimator-engine";
import {
  PLANNER_FAQS,
  PLANNER_PROJECTS,
  buildPlannerResult,
  formatMoneyRange,
  type PlannerPriority,
  type PlannerStart,
} from "@/lib/project-planner";
import {
  DEFAULT_OG_IMAGE,
  absoluteUrl,
  buildBreadcrumbList,
  buildFaqSchema,
} from "@/lib/seo";

const PATH = "/project-planner";

export const Route = createFileRoute("/project-planner")({
  validateSearch: (search: Record<string, unknown>) => ({
    project: typeof search.project === "string" ? search.project : undefined,
  }),
  component: ProjectPlannerPage,
  head: () => ({
    meta: [
      {
        title: "Home renovation project planner (2026) | CostReno",
      },
      {
        name: "description",
        content:
          "Plan any home renovation in a few steps. Pick roof, kitchen, bathroom, HVAC, and more. Get a budget range, suggested order, and checklist before you hire.",
      },
      {
        property: "og:title",
        content: "Home renovation project planner (2026) | CostReno",
      },
      {
        property: "og:description",
        content:
          "A simple planner for homeowners. Choose projects, set priorities, and get sequencing plus local planning ranges.",
      },
      { property: "og:url", content: absoluteUrl(PATH) },
      { property: "og:type", content: "website" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl(PATH) }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "CostReno home renovation project planner",
          url: absoluteUrl(PATH),
          applicationCategory: "LifestyleApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description:
            "Plan home renovations with project selection, budget ranges, sequencing, and next steps.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          buildBreadcrumbList([
            { name: "Home", path: "/" },
            { name: "Project planner", path: PATH },
          ]),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(buildFaqSchema([...PLANNER_FAQS])),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to plan a home renovation with CostReno",
          description:
            "Select renovation projects, add ZIP and priorities, then review budget order and next steps.",
          step: [
            {
              "@type": "HowToStep",
              name: "Choose projects",
              text: "Select one or more renovations such as roof, kitchen, bathroom, HVAC, windows, flooring, painting, deck, plumbing, electrical, or solar.",
            },
            {
              "@type": "HowToStep",
              name: "Add details",
              text: "Optionally enter ZIP and home size, then choose budget, timeline, or quality priority.",
            },
            {
              "@type": "HowToStep",
              name: "Review your plan",
              text: "See planning cost ranges, suggested project order, checklist items, and links to estimates and quote tools.",
            },
          ],
        }),
      },
    ],
  }),
});

const STEPS = ["Projects", "Details", "Your plan"] as const;

function ProjectPlannerPage() {
  const { project: urlProject } = Route.useSearch();
  const initial =
    urlProject && PLANNER_PROJECTS.some((p) => p.id === urlProject)
      ? ([urlProject] as ProjectType[])
      : ([] as ProjectType[]);

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<ProjectType[]>(initial);
  const [zipCode, setZipCode] = useState("");
  const [houseSize, setHouseSize] = useState("");
  const [priority, setPriority] = useState<PlannerPriority>("budget");
  const [start, setStart] = useState<PlannerStart>("1-3-months");

  const result = useMemo(() => {
    if (selected.length === 0) return null;
    const sqft = parseInt(houseSize.replace(/,/g, ""), 10);
    return buildPlannerResult({
      projects: selected,
      zipCode,
      squareFootage: Number.isFinite(sqft) && sqft > 0 ? sqft : undefined,
      priority,
      start,
    });
  }, [selected, zipCode, houseSize, priority, start]);

  const toggleProject = (id: ProjectType) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const canNext =
    step === 0 ? selected.length > 0 : step === 1 ? true : false;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="planner" />

      <main>
        <section className="border-b border-border/60 bg-gradient-to-b from-primary/[0.03] to-transparent">
          <div className="container-x py-10 md:py-14 max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              Free planning tool
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
              Home renovation project planner
            </h1>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Pick the work you are considering. In a few steps, get a planning budget, a sensible
              order of work, and clear next steps so contractor quotes are easier to judge.
            </p>
          </div>
        </section>

        <section className="container-x py-8 md:py-10 max-w-3xl mx-auto">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8" aria-label="Planner steps">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex items-center gap-2 min-w-0 ${
                    i <= step ? "text-ink" : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i < step
                        ? "bg-accent text-accent-foreground"
                        : i === step
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className="text-xs font-semibold truncate hidden sm:inline">{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-px flex-1 ${i < step ? "bg-accent/40" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 sm:p-8 shadow-sm">
            {step === 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-ink mb-1">
                  What are you planning?
                </h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Select one or more projects. You can refine costs later in the estimator.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PLANNER_PROJECTS.map((p) => {
                    const on = selected.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProject(p.id)}
                        className={`text-left rounded-xl border-2 p-4 transition ${
                          on
                            ? "border-primary bg-primary/[0.04] shadow-sm"
                            : "border-border hover:border-primary/30 bg-background"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-ink">{p.name}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {p.shortDesc}
                            </p>
                            <p className="text-xs text-ink mt-2 font-medium">
                              {formatMoneyRange(p.nationalLow, p.nationalHigh)}
                            </p>
                          </div>
                          <span
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                              on
                                ? "bg-accent border-accent text-accent-foreground"
                                : "border-border"
                            }`}
                          >
                            {on && <Check className="h-3 w-3" />}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-xl font-bold text-ink mb-1">
                    A few details
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    ZIP and size improve local ranges. Priority shapes sequencing tips.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-ink mb-1.5 block" htmlFor="plan-zip">
                    ZIP code (optional)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="plan-zip"
                      inputMode="numeric"
                      maxLength={10}
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="90210"
                      className="w-full h-12 rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-ink mb-1.5 block" htmlFor="plan-size">
                    Home size, sq ft (optional)
                  </label>
                  <input
                    id="plan-size"
                    inputMode="numeric"
                    value={houseSize}
                    onChange={(e) => setHouseSize(e.target.value)}
                    placeholder="2,000"
                    className="w-full h-12 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <p className="text-xs font-medium text-ink mb-2">What matters most?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(
                      [
                        { id: "budget", label: "Stay on budget" },
                        { id: "timeline", label: "Finish faster" },
                        { id: "quality", label: "Prioritize quality" },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPriority(opt.id)}
                        className={`rounded-xl border-2 px-3 py-3 text-sm font-medium transition ${
                          priority === opt.id
                            ? "border-primary bg-primary/[0.04] text-ink"
                            : "border-border text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-ink mb-2">When do you want to start?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { id: "asap", label: "As soon as possible" },
                        { id: "1-3-months", label: "In 1–3 months" },
                        { id: "3-6-months", label: "In 3–6 months" },
                        { id: "exploring", label: "Just exploring" },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setStart(opt.id)}
                        className={`rounded-xl border-2 px-3 py-3 text-sm font-medium transition text-left ${
                          start === opt.id
                            ? "border-primary bg-primary/[0.04] text-ink"
                            : "border-border text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && result && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent mb-2">
                    <Sparkles className="h-3.5 w-3.5" /> Your renovation plan
                  </div>
                  <h2 className="font-display text-xl font-bold text-ink mb-1">
                    Planning budget
                  </h2>
                  <p className="font-display text-3xl md:text-4xl font-bold text-ink">
                    {formatMoneyRange(result.totalLow, result.totalHigh)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Midpoint about ${result.totalMid.toLocaleString()}
                    {zipCode.replace(/\D/g, "").length === 5
                      ? ` for ZIP ${zipCode.replace(/\D/g, "").slice(0, 5)}`
                      : " (national planning band)"}
                    . Not a contractor bid.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-ink mb-3">Suggested order</h3>
                  <ol className="space-y-3">
                    {result.lines.map((line, i) => (
                      <li
                        key={line.project.id}
                        className="rounded-xl border border-border p-4 bg-background"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <p className="text-sm font-semibold text-ink">{line.project.name}</p>
                              <p className="text-sm font-semibold text-ink">
                                {formatMoneyRange(line.low, line.high)}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Typical duration {line.project.timeline}
                              {line.project.permitLikely ? " · Permit often required" : ""}
                            </p>
                            <ul className="mt-3 space-y-1.5">
                              {line.project.checklist.slice(0, 3).map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2 text-xs text-muted-foreground"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <a
                                href={line.estimateHref}
                                className="text-xs font-semibold text-primary hover:underline"
                              >
                                Get detailed estimate
                              </a>
                              {line.project.guideHref && (
                                <a
                                  href={line.project.guideHref}
                                  className="text-xs font-semibold text-muted-foreground hover:text-primary hover:underline"
                                >
                                  Read guide
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <h3 className="text-sm font-semibold text-ink mb-2 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-primary" />
                    Sequencing tips
                  </h3>
                  <ul className="space-y-2">
                    {result.sequencingNotes.map((note) => (
                      <li key={note} className="text-sm text-muted-foreground leading-relaxed">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-ink mb-3">Next steps</h3>
                  <ol className="space-y-2 list-decimal pl-5">
                    {result.nextSteps.map((s) => (
                      <li key={s} className="text-sm text-muted-foreground leading-relaxed">
                        {s}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <a
                      href={
                        result.lines[0]
                          ? result.lines[0].estimateHref
                          : "/estimate"
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition"
                    >
                      Open cost estimator <ArrowRight className="h-4 w-4" />
                    </a>
                    <a
                      href="/quote-analyzer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-ink hover:bg-muted/40 transition"
                    >
                      Analyze a contractor quote
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className="mt-8 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-ink hover:bg-muted/40 transition"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              ) : (
                <span />
              )}
              {step < 2 && (
                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => setStep((s) => s + 1)}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition disabled:opacity-50"
                >
                  {step === 1 ? "Build my plan" : "Continue"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => {
                    setStep(0);
                    setSelected([]);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/40 transition"
                >
                  Start over
                </button>
              )}
            </div>
          </div>
        </section>

        {/* SEO content */}
        <section className="border-t border-border/60 bg-muted/20">
          <div className="container-x py-12 md:py-16 max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-ink mb-4">
              How homeowners use this planner
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Most renovation stress comes from unclear scope and surprise pricing. This planner
                keeps the first conversation simple: which projects you care about, roughly what they
                cost together, and which order reduces rework.
              </p>
              <p>
                After you have a plan, run a{" "}
                <a href="/estimate" className="text-primary underline-offset-2 hover:underline">
                  ZIP-based cost estimate
                </a>{" "}
                for each trade, then upload bids to the{" "}
                <a
                  href="/quote-analyzer"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  quote analyzer
                </a>
                . For deeper reading, start with our{" "}
                <a
                  href="/guides/home-renovation-project-planner"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  renovation planning guide
                </a>
                .
              </p>
            </div>

            <h2 className="font-display text-2xl font-bold text-ink mt-10 mb-4">
              Popular renovation paths
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: "/guides/roof-replacement", label: "Roof replacement cost guide" },
                { href: "/guides/kitchen-remodel", label: "Kitchen remodel cost guide" },
                { href: "/guides/bathroom-remodel", label: "Bathroom remodel cost guide" },
                { href: "/guides/hvac-installation", label: "HVAC installation cost guide" },
                { href: "/topics/roof", label: "Roof costs hub" },
                { href: "/locations", label: "Costs by city" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-ink hover:border-primary/40 transition"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <h2 className="font-display text-2xl font-bold text-ink mt-10 mb-4">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {PLANNER_FAQS.map((faq) => (
                <div key={faq.q} className="rounded-xl border border-border bg-white p-5">
                  <h3 className="text-sm font-semibold text-ink mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
