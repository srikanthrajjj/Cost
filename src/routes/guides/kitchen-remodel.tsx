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
import projKitchen from "@/assets/proj-kitchen.jpg";

export const Route = createFileRoute("/guides/kitchen-remodel")({
  component: KitchenRemodelGuide,
  head: () => ({
    meta: [
      { title: "Complete Guide to Kitchen Remodel (2026) — CostReno" },
      {
        name: "description",
        content:
          "Everything you need to know about kitchen remodel costs, materials, timeline, permits, and choosing the right contractor. Updated July 2026.",
      },
      { property: "og:title", content: "Complete Guide to Kitchen Remodel — CostReno" },
      {
        property: "og:description",
        content:
          "Learn about kitchen remodel costs ($25,000–$75,000), best materials, contractor selection, permits, and more.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://costreno.com/guides/kitchen-remodel" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://costreno.com/guides/kitchen-remodel" }],
  }),
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const TABLE_OF_CONTENTS = [
  { id: "signs", label: "Signs You Need a Kitchen Remodel" },
  { id: "costs", label: "Kitchen Remodel Costs" },
  { id: "materials", label: "Best Kitchen Materials" },
  { id: "process", label: "Kitchen Remodel Process" },
  { id: "contractor", label: "How to Choose a Contractor" },
  { id: "permits", label: "Permits & Inspections" },
  { id: "faq", label: "Frequently Asked Questions" },
  { id: "related", label: "Related Guides" },
];

const SCOPE_COSTS = [
  {
    scope: "Cosmetic Refresh",
    range: "$8,000–$18,000",
    timeline: "1–2 weeks",
    includes: "Paint, hardware, backsplash",
  },
  {
    scope: "Mid-Range Remodel",
    range: "$25,000–$55,000",
    timeline: "4–6 weeks",
    includes: "New cabinets, counters, appliances",
  },
  {
    scope: "Full Gut Renovation",
    range: "$45,000–$90,000+",
    timeline: "8–12 weeks",
    includes: "Layout changes, plumbing, electrical",
  },
  {
    scope: "Luxury Kitchen",
    range: "$100,000+",
    timeline: "12–16 weeks",
    includes: "Custom everything, premium finishes",
  },
];

const SIGNS_LIST = [
  "Cabinets are peeling, warped, or falling apart",
  "Countertops are cracked, stained, or outdated",
  "Appliances are over 15 years old and inefficient",
  "Layout doesn't work for how you cook and entertain",
  "Insufficient storage space for your needs",
  "Outdated electrical that can't handle modern appliances",
  "Plumbing issues like leaks or low water pressure",
  "Flooring is damaged, uneven, or impossible to clean",
];

const PROCESS_STEPS = [
  {
    step: "1",
    title: "Planning & Design",
    desc: "Work with a designer or contractor to create a layout, select materials, establish a budget, and define the scope of work. This phase typically takes 2–4 weeks.",
  },
  {
    step: "2",
    title: "Permits & Ordering",
    desc: "Pull necessary permits for plumbing, electrical, or structural changes. Order cabinets, countertops, and appliances. Lead times can be 4–8 weeks for custom items.",
  },
  {
    step: "3",
    title: "Demolition",
    desc: "Existing cabinets, countertops, flooring, and fixtures are removed. Any hidden issues (water damage, outdated wiring) are identified and addressed.",
  },
  {
    step: "4",
    title: "Rough-In Work",
    desc: "Plumbing, electrical, and HVAC are rerouted or updated to match the new layout. Walls are framed or moved if the floor plan is changing.",
  },
  {
    step: "5",
    title: "Installation",
    desc: "Cabinets, countertops, flooring, backsplash, and appliances are installed. This is the most visible transformation phase.",
  },
  {
    step: "6",
    title: "Finishing & Inspection",
    desc: "Final connections, paint touch-ups, hardware installation, and cleanup. A final inspection ensures all work meets code requirements.",
  },
];

const CONTRACTOR_CHECKLIST = [
  "Licensed and insured in your state",
  "At least 5 years of kitchen remodeling experience",
  "Written, itemized estimate with material specifications",
  "Portfolio of completed kitchen projects to review",
  "References from recent local kitchen remodel clients",
  "Clear payment schedule (never 100% upfront)",
  "Detailed timeline with milestones and completion date",
  "Handles permits and inspections directly",
  "Provides a written contract with full scope of work",
  "Has a physical business address and showroom",
];

const FAQ_ITEMS = [
  {
    q: "How much does a kitchen remodel cost in 2026?",
    a: "The national average for a kitchen remodel is $25,000–$75,000, depending on scope, materials, and location. A cosmetic refresh can be done for $8,000–$18,000, while a full gut renovation with layout changes typically runs $45,000–$90,000+. Luxury kitchens with custom cabinetry and premium appliances can exceed $100,000.",
  },
  {
    q: "How long does a kitchen remodel take?",
    a: "Most mid-range kitchen remodels take 4–8 weeks from demolition to completion. A cosmetic refresh can be done in 1–2 weeks, while a full gut renovation with layout changes may take 8–12 weeks. Custom cabinetry lead times can add 4–8 weeks to the planning phase before work begins.",
  },
  {
    q: "Can I live in my home during a kitchen remodel?",
    a: "Yes, but plan for significant disruption. Set up a temporary kitchen space with a microwave, mini-fridge, and access to water. During demolition and rough-in phases, expect dust, noise, and limited access. Most homeowners find the first 2 weeks most challenging.",
  },
  {
    q: "What gives the best ROI on a kitchen remodel?",
    a: "Mid-range remodels typically offer the best ROI at around 72%. Focus on refacing or replacing cabinets, upgrading countertops to quartz or granite, new appliances, and updated flooring. Avoid over-improving beyond your neighborhood's value ceiling.",
  },
  {
    q: "Should I remodel my kitchen before selling my home?",
    a: "A minor to mid-range kitchen update often helps sell homes faster and closer to asking price. However, a full luxury remodel rarely recoups its cost at sale. Focus on cosmetic updates that make the kitchen feel modern: new hardware, countertops, paint, and updated appliances.",
  },
];

const RELATED_GUIDES = [
  { title: "Roof Replacement Guide", href: "/guides/roof-replacement", icon: "/House.svg" },
  { title: "Bathroom Remodel Guide", href: "/guides/bathroom-remodel", icon: "/Bathtub.svg" },
  {
    title: "HVAC Installation Guide",
    href: "/hvac-installation-cost",
    icon: "/Air Conditioner.svg",
  },
  { title: "Window Replacement Guide", href: "/window-replacement-cost", icon: "/Window.svg" },
  { title: "Flooring Guide", href: "/flooring-cost", icon: "/Floor Tiles.svg" },
];

// ─── Component ────────────────────────────────────────────────────────────────
function KitchenRemodelGuide() {
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
            headline: "Complete Guide to Kitchen Remodel",
            description:
              "Everything you need to know about kitchen remodel costs, materials, timeline, permits, and choosing the right contractor.",
            author: { "@type": "Organization", name: "CostReno" },
            publisher: {
              "@type": "Organization",
              name: "CostReno",
              logo: { "@type": "ImageObject", url: "https://costreno.com/logo.svg" },
            },
            datePublished: "2026-07-01",
            dateModified: "2026-07-19",
            mainEntityOfPage: "https://costreno.com/guides/kitchen-remodel",
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
              { "@type": "ListItem", position: 1, name: "Home", item: "https://costreno.com/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Renovation Guides",
                item: "https://costreno.com/guides",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Kitchen",
                item: "https://costreno.com/guides/kitchen",
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
            Kitchen
          </a>
          <span>/</span>
          <span className="text-ink font-medium">Complete Guide</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-accent mb-4">
              Kitchen Guide
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-[44px] font-extrabold text-ink leading-[1.1] tracking-tight">
              Complete Guide to Kitchen Remodel
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-lg">
              Everything you need to know about kitchen remodel costs, materials, timeline, permits,
              and choosing the right contractor.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span>12 min read</span>
              <span>·</span>
              <span>Updated July 2026</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 text-accent" />
              </div>
              <span className="text-xs font-medium text-ink">
                Reviewed by Kitchen Design Experts
              </span>
            </div>
          </div>
          {/* Right Image */}
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              src={projKitchen}
              alt="Modern kitchen remodel with new cabinets and countertops"
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
            Key Takeaways
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
                $25,000–$75,000
              </div>
              <p className="text-xs text-muted-foreground mt-1">National Average</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Timeline
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">4–8 weeks</div>
              <p className="text-xs text-muted-foreground mt-1">Most projects</p>
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
              <h2 className="font-display text-lg font-bold text-ink mb-4">Table of Contents</h2>
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

            {/* Section 1: Signs You Need a Kitchen Remodel */}
            <section id="signs" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                1. Signs You Need a Kitchen Remodel
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Not sure if your kitchen needs a full remodel or just a few updates? Here are the
                most common signs that it's time for a renovation:
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
                  src={projKitchen}
                  alt="Outdated kitchen in need of a remodel"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </section>

            {/* Section 2: Kitchen Remodel Costs by Scope */}
            <section id="costs" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                2. Kitchen Remodel Costs by Scope
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Costs vary significantly based on the scope of your project. Below is a comparison
                of typical kitchen remodel budgets:
              </p>
              <div className="rounded-xl border border-border bg-white overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">
                        Scope
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
                <p className="text-xs font-semibold text-accent mb-1">Pro Tip</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Allocate 15–20% of your budget as a contingency fund. Kitchen remodels frequently
                  uncover hidden issues (water damage, outdated wiring, asbestos) that add to the
                  final cost.
                </p>
              </div>
            </section>

            {/* Section 3: Best Kitchen Materials */}
            <section id="materials" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                3. Best Kitchen Materials
              </h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Material selection drives both the look and the budget of your kitchen remodel.
                Here's what to know about the three biggest categories:
              </p>
              <div className="space-y-6">
                {/* Cabinets */}
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Cabinets</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Cabinets account for 30–40% of your total kitchen budget. Options range from
                    stock cabinets (pre-built, limited sizes) to semi-custom and fully custom.
                    Refacing existing cabinet boxes with new doors and hardware is a cost-effective
                    middle ground for structurally sound cabinets.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      Stock: $3,000–$8,000
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Semi-Custom: $8,000–$20,000
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Custom: $20,000–$50,000+
                    </span>
                  </div>
                </div>

                {/* Countertops */}
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Countertops</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Countertops set the tone for your kitchen's style. Quartz and granite remain the
                    most popular choices for durability and aesthetics. Butcher block offers warmth,
                    while marble delivers luxury at a premium price and maintenance requirement.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      Quartz: $50–$150/sq ft
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Granite: $40–$100/sq ft
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Marble: $75–$200/sq ft
                    </span>
                  </div>
                </div>

                {/* Flooring */}
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Flooring</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Kitchen flooring must handle moisture, spills, and heavy foot traffic. Luxury
                    vinyl plank (LVP) has become the most popular choice for its durability and
                    water resistance. Porcelain tile offers premium durability, while hardwood adds
                    warmth but requires more maintenance.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      LVP: $3–$7/sq ft
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Porcelain Tile: $5–$15/sq ft
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Hardwood: $8–$15/sq ft
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Kitchen Remodel Process */}
            <section id="process" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                4. Kitchen Remodel Process: Step by Step
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Understanding the process helps you plan for disruptions and set realistic
                expectations. Here's a typical kitchen remodel timeline:
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

            {/* Section 5: How to Choose a Kitchen Contractor */}
            <section id="contractor" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                5. How to Choose a Kitchen Contractor
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Your kitchen remodel contractor will be in your home for weeks. Use this checklist
                to vet candidates before signing:
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
                6. Permits & Inspections
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Whether you need a permit depends on the scope of your kitchen remodel. Here's what
                you need to know:
              </p>
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">
                    When is a permit required?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Permits are required for plumbing changes (moving sinks or adding gas lines),
                    electrical work (new circuits or panel upgrades), structural modifications
                    (removing walls), and HVAC changes. Cosmetic updates like painting, new
                    countertops, or cabinet refacing typically don't require permits.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">Permit costs</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Kitchen remodel permits typically cost $200–$1,500 depending on your
                    municipality and the scope of work. Electrical and plumbing permits may be
                    separate. Your contractor should include these costs in their estimate.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">Inspections</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Inspections occur at multiple stages: after rough-in plumbing and electrical
                    (before walls are closed), and a final inspection after completion. Your
                    contractor coordinates these with the local building department.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">
                        Warning: Skipping permits is risky
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Unpermitted work can void insurance coverage, create problems when selling
                        your home, and result in fines. If a contractor suggests skipping permits to
                        save time or money, consider it a red flag.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7: FAQ */}
            <section id="faq" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-5">
                7. Frequently Asked Questions
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
              <h2 className="font-display text-2xl font-bold text-ink mb-5">8. Related Guides</h2>
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
                    Calculate Your Kitchen Remodel Cost
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Get a personalized estimate based on your ZIP code, kitchen size, and material
                  preferences. Free, no signup required.
                </p>
                <a
                  href="/kitchen-remodel-cost"
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition shadow-sm"
                >
                  Get My Estimate <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              {/* Related Guides */}
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-base font-bold text-ink mb-4">Related Guides</h3>
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
                    Need Help Reviewing Your Kitchen Quote?
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Upload your kitchen remodel quote and get instant analysis on pricing, scope, and
                  potential red flags.
                </p>
                <a
                  href="/quote-analyzer"
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl border-2 border-accent text-accent text-sm font-bold hover:bg-accent/5 transition"
                >
                  Review My Quote <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              {/* Popular Tools */}
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-base font-bold text-ink mb-4">Popular Tools</h3>
                <div className="space-y-3">
                  <a
                    href="/kitchen-remodel-cost"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition"
                  >
                    <DollarSign className="h-4 w-4 text-accent shrink-0" />
                    <span>Kitchen Cost Calculator</span>
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
