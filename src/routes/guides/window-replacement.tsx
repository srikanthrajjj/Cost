import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Shield,
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import projWindows from "@/assets/proj-windows.jpg";

export const Route = createFileRoute("/guides/window-replacement")({
  component: WindowReplacementGuide,
  head: () => ({
    meta: [
      { title: "Complete Guide to Window Replacement (2026) — CostReno" },
      {
        name: "description",
        content:
          "Everything you need to know about window replacement costs, materials, timeline, permits, and choosing the right contractor. Updated July 2026.",
      },
      { property: "og:title", content: "Complete Guide to Window Replacement — CostReno" },
      {
        property: "og:description",
        content:
          "Learn about window replacement costs ($6,000–$21,000), best materials, contractor selection, permits, and more.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://www.costreno.com/guides/window-replacement" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/guides/window-replacement" }],
  }),
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const TABLE_OF_CONTENTS = [
  { id: "signs", label: "Signs you need new windows" },
  { id: "costs", label: "Window replacement costs" },
  { id: "materials", label: "Window frame materials" },
  { id: "process", label: "Window replacement process" },
  { id: "contractor", label: "How to choose a contractor" },
  { id: "permits", label: "Permits & inspections" },
  { id: "faq", label: "Frequently asked questions" },
  { id: "related", label: "Related guides" },
];

const SCOPE_COSTS = [
  {
    scope: "Vinyl",
    range: "$400–$800/window",
    timeline: "30–60 min each",
    includes: "Double-pane, Low-E, argon filled",
  },
  {
    scope: "Wood",
    range: "$600–$1,200/window",
    timeline: "45–90 min each",
    includes: "Solid wood frame, custom sizes available",
  },
  {
    scope: "Fiberglass",
    range: "$700–$1,500/window",
    timeline: "45–90 min each",
    includes: "Premium durability, paintable, energy efficient",
  },
  {
    scope: "Aluminum",
    range: "$350–$700/window",
    timeline: "30–60 min each",
    includes: "Slim profile, low maintenance, modern look",
  },
];

const SIGNS_LIST = [
  "Drafts or cold spots near windows even when closed",
  "Condensation or fog between double-pane glass",
  "Difficulty opening, closing, or locking windows",
  "Visible rot, warping, or damage to frames",
  "High energy bills due to poor insulation",
  "Excessive outside noise penetrating through windows",
  "Single-pane glass with no energy efficiency",
  "Paint peeling or water stains around window frames",
];

const PROCESS_STEPS = [
  {
    step: "1",
    title: "Measurement & selection",
    desc: "A technician measures all window openings precisely. You choose frame material, glass type (double/triple pane, Low-E coating), and style (casement, double-hung, sliding). Custom orders take 3–6 weeks.",
  },
  {
    step: "2",
    title: "Preparation",
    desc: "Interior trim and window treatments are carefully removed. Drop cloths protect flooring and furniture. For full-frame replacement, exterior trim and siding around the opening is also removed.",
  },
  {
    step: "3",
    title: "Removal & inspection",
    desc: "Old windows are removed and the rough opening is inspected for water damage, rot, or insulation issues. Any damaged framing is repaired before new window installation.",
  },
  {
    step: "4",
    title: "Installation",
    desc: "New windows are set, leveled, shimmed, and fastened. Proper flashing and waterproofing are applied. Insulation foam fills gaps between the window frame and rough opening.",
  },
  {
    step: "5",
    title: "Finishing & sealing",
    desc: "Interior and exterior trim is installed or replaced. Caulking and weatherstripping ensure a tight seal. Hardware is tested and screens are installed. Final cleanup and debris removal.",
  },
];

const CONTRACTOR_CHECKLIST = [
  "Licensed and insured window installation contractor",
  "Factory-certified installer for the brand you choose",
  "Written, itemized estimate with window specifications",
  "At least 5 years of window replacement experience",
  "References from recent local window projects",
  "Clear warranty coverage (labor and product)",
  "Handles permits if required in your area",
  "Includes proper flashing and waterproofing in scope",
];

const FAQ_ITEMS = [
  {
    q: "How much does window replacement cost in 2026?",
    a: "The national average for a full-home window replacement is $6,000–$21,000 (10–15 windows). Individual windows cost $350–$1,500 each installed, depending on frame material, glass type, and window size. Vinyl is most affordable, while fiberglass and wood are premium options.",
  },
  {
    q: "How long does window replacement take?",
    a: "Most whole-home window replacements (10–15 windows) are completed in 1–3 days. Individual windows take 30–90 minutes each. Custom-sized windows require a 3–6 week lead time for manufacturing before installation day.",
  },
  {
    q: "What is the ROI on new windows?",
    a: "Window replacement typically returns about 72% of the investment at resale. Beyond ROI, new windows reduce energy bills by 12–33%, improve comfort by eliminating drafts, reduce outside noise, and enhance curb appeal significantly.",
  },
  {
    q: "Should I replace all windows at once?",
    a: "Replacing all windows at once is typically more cost-effective per window due to volume pricing and single mobilization costs. However, if budget is a concern, prioritize north-facing windows and any with visible damage or fog between panes.",
  },
  {
    q: "Do I need a permit for window replacement?",
    a: "Permits are sometimes required depending on your municipality. Generally, replacing existing windows with the same size and type doesn't require a permit. However, changing window sizes, adding new openings, or egress requirements for bedrooms may require permits and inspections.",
  },
];

const RELATED_GUIDES = [
  { title: "Kitchen Remodel Guide", href: "/guides/kitchen-remodel", icon: "/Kitchen.svg" },
  { title: "Bathroom Remodel Guide", href: "/guides/bathroom-remodel", icon: "/Bathtub.svg" },
  {
    title: "HVAC Installation Guide",
    href: "/guides/hvac-installation",
    icon: "/Air Conditioner.svg",
  },
  { title: "Roof Replacement Guide", href: "/guides/roof-replacement", icon: "/House.svg" },
  { title: "Flooring Guide", href: "/guides/flooring", icon: "/Floor Tiles.svg" },
];

// ─── Component ────────────────────────────────────────────────────────────────
function WindowReplacementGuide() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Complete Guide to Window Replacement",
            description:
              "Everything you need to know about window replacement costs, materials, timeline, permits, and choosing the right contractor.",
            author: { "@type": "Organization", name: "CostReno" },
            publisher: {
              "@type": "Organization",
              name: "CostReno",
              logo: { "@type": "ImageObject", url: "https://www.costreno.com/logo.svg" },
            },
            datePublished: "2026-07-01",
            dateModified: "2026-07-19",
            mainEntityOfPage: "https://www.costreno.com/guides/window-replacement",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.costreno.com/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Renovation Guides",
                item: "https://www.costreno.com/guides",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Windows",
                item: "https://www.costreno.com/guides/window-replacement",
              },
              { "@type": "ListItem", position: 4, name: "Complete Guide" },
            ],
          }),
        }}
      />

      {/* Header */}
      <SiteNav active="guides" />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <a href="/" className="hover:text-ink transition">
            Home
          </a>
          <span>/</span>
          <a href="/guides" className="hover:text-ink transition">
            Renovation Guides
          </a>
          <span>/</span>
          <a href="/guides" className="hover:text-ink transition">
            Windows
          </a>
          <span>/</span>
          <span className="text-ink font-medium">Complete Guide</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-accent mb-4">
              WINDOWS GUIDE
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-[44px] font-extrabold text-ink leading-[1.1] tracking-tight">
              Complete guide to window replacement
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-lg">
              Everything you need to know about window replacement costs, materials, timeline,
              permits, and choosing the right contractor.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span>9 min read</span>
              <span>·</span>
              <span>Updated July 2026</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 text-accent" />
              </div>
              <span className="text-xs font-medium text-ink">
                Reviewed by Window Industry Experts
              </span>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              src={projWindows}
              alt="New energy-efficient window installation"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Key Takeaways Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm">
          <h2 className="font-display text-lg font-bold text-ink mb-6 text-center">
            Key takeaways
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <DollarSign className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Average Cost
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">
                $6,000–$21,000
              </div>
              <p className="text-xs text-muted-foreground mt-1">Full home (10–15 windows)</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Timeline
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">1–3 days</div>
              <p className="text-xs text-muted-foreground mt-1">Full home replacement</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">ROI</span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">72%</div>
              <p className="text-xs text-muted-foreground mt-1">Average return on investment</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <FileText className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Permits
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">Sometimes</div>
              <p className="text-xs text-muted-foreground mt-1">Depends on scope</p>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Main Content */}
          <div>
            {/* Table of Contents */}
            <div className="rounded-xl border border-border bg-white p-6 mb-10">
              <h2 className="font-display text-lg font-bold text-ink mb-4">Table of contents</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TABLE_OF_CONTENTS.map((item, i) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition py-1"
                  >
                    <span className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent shrink-0">
                      {i + 1}
                    </span>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Section 1: Signs You Need New Windows */}
            <section id="signs" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                1. Signs you need new windows
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Not sure if your windows need replacement? Here are the most common signs that it's
                time for an upgrade:
              </p>
              <div className="space-y-3 mb-6">
                {SIGNS_LIST.map((sign) => (
                  <div key={sign} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-ink">{sign}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl overflow-hidden aspect-[16/9]">
                <img
                  src={projWindows}
                  alt="Old windows showing signs of wear and damage"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </section>

            {/* Section 2: Window Replacement Costs */}
            <section id="costs" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                2. Window replacement costs by material
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Costs vary based on frame material, glass type, and window size. Below is a
                comparison of typical per-window costs (installed):
              </p>
              <div className="rounded-xl border border-border bg-white overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">
                        Material
                      </th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">
                        Cost Range
                      </th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3 hidden sm:table-cell">
                        Timeline
                      </th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3 hidden md:table-cell">
                        Includes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SCOPE_COSTS.map((row, i) => (
                      <tr
                        key={row.scope}
                        className={i < SCOPE_COSTS.length - 1 ? "border-b border-border/50" : ""}
                      >
                        <td className="px-5 py-3 text-sm font-medium text-ink">{row.scope}</td>
                        <td className="px-5 py-3 text-sm font-semibold text-ink">{row.range}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                          {row.timeline}
                        </td>
                        <td className="px-5 py-3 text-sm text-muted-foreground hidden md:table-cell">
                          {row.includes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pro Tip */}
              <div className="mt-5 p-4 rounded-xl bg-accent/5 border border-accent/20">
                <p className="text-xs font-semibold text-accent mb-1">Pro tip</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ask about energy tax credits. ENERGY STAR certified windows may qualify for
                  federal tax credits of up to $600. Many states also offer additional rebates for
                  energy-efficient window upgrades.
                </p>
              </div>
            </section>

            {/* Section 3: Window Frame Materials */}
            <section id="materials" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                3. Window frame materials
              </h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Frame material impacts cost, durability, maintenance, and energy efficiency. Here's
                what to know about each option:
              </p>
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Vinyl</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    The most popular choice for replacement windows due to excellent value. Vinyl
                    frames never need painting, won't rot, and provide good insulation. Available in
                    white and limited colors. Not ideal for very hot climates where frames may warp.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      $400–$800/window
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Lifespan: 20–40 years
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Maintenance: None
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Wood</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Premium choice for traditional and historic homes. Wood frames offer excellent
                    insulation and can be painted any color. Requires regular maintenance
                    (painting/staining every 3–5 years) to prevent rot. Many modern wood windows
                    have aluminum or vinyl cladding on the exterior.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      $600–$1,200/window
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Lifespan: 30–50+ years
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Maintenance: High
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Fiberglass</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    The best all-around performance material. Fiberglass frames are extremely
                    strong, energy efficient, and expand/contract at the same rate as glass
                    (preventing seal failure). Paintable, low-maintenance, and work in all climates.
                    Higher cost but longest-lasting.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      $700–$1,500/window
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Lifespan: 40–50+ years
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Maintenance: Minimal
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Aluminum</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Slim profiles allow maximum glass area for modern architectural styles. Very
                    strong and weather-resistant. Poor insulation compared to other materials
                    (conducts heat), though thermal breaks improve performance. Most affordable
                    option for large or custom windows.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      $350–$700/window
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Lifespan: 20–30 years
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Maintenance: Low
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Window Replacement Process */}
            <section id="process" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                4. Window replacement process: step by step
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Understanding the process helps you prepare your home and set realistic
                expectations. Here's what to expect:
              </p>
              <div className="space-y-4">
                {PROCESS_STEPS.map((s) => (
                  <div
                    key={s.step}
                    className="flex gap-4 p-4 rounded-xl border border-border bg-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-accent">{s.step}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink mb-1">{s.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5: How to Choose a Contractor */}
            <section id="contractor" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                5. How to choose a window contractor
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Proper installation is critical for window performance and warranty coverage. Use
                this checklist to vet candidates:
              </p>
              <div className="space-y-3">
                {CONTRACTOR_CHECKLIST.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border bg-white"
                  >
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-ink">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6: Permits & Inspections */}
            <section id="permits" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                6. Permits & inspections
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Permit requirements for window replacement vary by municipality and scope. Here's
                what you need to know:
              </p>
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">
                    When is a permit required?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Same-size replacement windows (insert or pocket installation) typically don't
                    require permits. Permits are usually required when changing window sizes, adding
                    new window openings, or modifying structural headers. Egress windows for
                    bedrooms may also require permits to verify code compliance.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">Permit costs</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Window permits typically cost $50–$300 depending on your municipality and the
                    scope of work. Full-frame replacements with structural modifications may require
                    higher permit fees and engineering review.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">Inspections</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    When required, inspections verify proper flashing and waterproofing, correct
                    installation methods, egress compliance for bedroom windows, and structural
                    integrity of any modified openings.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">
                        Warning: Improper installation voids warranties
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Most window manufacturers require installation by certified professionals
                        following specific guidelines. Improper flashing or waterproofing can lead
                        to water damage that's not covered by homeowner's insurance if installation
                        wasn't permitted and inspected.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7: FAQ */}
            <section id="faq" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-5">
                7. Frequently asked questions
              </h2>
              <div className="space-y-3">
                {FAQ_ITEMS.map((faq, i) => (
                  <div key={i} className="rounded-xl border border-border bg-white overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-muted/20 transition"
                    >
                      <h3 className="text-sm font-semibold text-ink pr-4">{faq.q}</h3>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Section 8: Related Guides */}
            <section id="related" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-5">8. Related guides</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RELATED_GUIDES.map((guide) => (
                  <a
                    key={guide.href}
                    href={guide.href}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border bg-white hover:border-accent/40 hover:shadow-md transition"
                  >
                    <img src={guide.icon} alt="" className="w-8 h-8 object-contain" />
                    <span className="text-sm font-semibold text-ink">{guide.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                  </a>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* CTA: Calculate Cost */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-5 w-5 text-accent" />
                  <h3 className="font-display text-base font-bold text-ink">
                    Calculate your window replacement cost
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Get a personalized estimate based on your ZIP code, number of windows, and
                  material preferences. Free, no signup required.
                </p>
                <a
                  href="/estimate?project=windows"
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg bg-accent text-white text-sm font-bold hover:bg-accent/90 transition shadow-sm"
                >
                  Get My Estimate <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              {/* Related Guides */}
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-base font-bold text-ink mb-4">Related guides</h3>
                <div className="space-y-3">
                  {RELATED_GUIDES.map((guide) => (
                    <a
                      key={guide.href}
                      href={guide.href}
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition"
                    >
                      <img src={guide.icon} alt="" className="w-5 h-5 object-contain" />
                      <span>{guide.title}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA: Quote Review */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-accent" />
                  <h3 className="font-display text-base font-bold text-ink">
                    Need help reviewing your window quote?
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Upload your window replacement quote and get instant analysis on pricing, scope,
                  and potential red flags.
                </p>
                <a
                  href="/quote-analyzer"
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg border-2 border-accent text-accent text-sm font-bold hover:bg-accent/5 transition"
                >
                  Review My Quote <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              {/* Popular Tools */}
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-base font-bold text-ink mb-4">Popular tools</h3>
                <div className="space-y-3">
                  <a
                    href="/estimate?project=windows"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition"
                  >
                    <DollarSign className="h-4 w-4 text-accent shrink-0" />
                    <span>Window Cost Calculator</span>
                  </a>
                  <a
                    href="/quote-analyzer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition"
                  >
                    <FileText className="h-4 w-4 text-accent shrink-0" />
                    <span>Quote Review Tool</span>
                  </a>
                  <a
                    href="/estimate"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition"
                  >
                    <MapPin className="h-4 w-4 text-accent shrink-0" />
                    <span>Local Price Estimator</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition"
                  >
                    <Shield className="h-4 w-4 text-accent shrink-0" />
                    <span>Insurance Claim Helper</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition"
                  >
                    <Star className="h-4 w-4 text-accent shrink-0" />
                    <span>Contractor Finder</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
