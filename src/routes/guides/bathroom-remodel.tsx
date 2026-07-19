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
import projBathroom from "@/assets/proj-bathroom.jpg";

export const Route = createFileRoute("/guides/bathroom-remodel")({
  component: BathroomRemodelGuide,
  head: () => ({
    meta: [
      { title: "Complete Guide to Bathroom Remodel (2026) — CostReno" },
      {
        name: "description",
        content:
          "Everything you need to know about bathroom remodel costs, materials, timeline, permits, and choosing the right contractor. Updated July 2026.",
      },
      { property: "og:title", content: "Complete Guide to Bathroom Remodel — CostReno" },
      {
        property: "og:description",
        content:
          "Learn about bathroom remodel costs ($8,000–$30,000), best materials, contractor selection, permits, and more.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://costreno.com/guides/bathroom-remodel" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://costreno.com/guides/bathroom-remodel" }],
  }),
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const TABLE_OF_CONTENTS = [
  { id: "signs", label: "Signs You Need a Bathroom Remodel" },
  { id: "costs", label: "Bathroom Remodel Costs" },
  { id: "materials", label: "Best Bathroom Materials" },
  { id: "process", label: "Bathroom Remodel Process" },
  { id: "contractor", label: "How to Choose a Contractor" },
  { id: "permits", label: "Permits & Inspections" },
  { id: "faq", label: "Frequently Asked Questions" },
  { id: "related", label: "Related Guides" },
];

const SCOPE_COSTS = [
  { scope: "Half Bath Update", range: "$3,000–$8,000", timeline: "3–5 days", includes: "New vanity, toilet, paint, fixtures" },
  { scope: "Standard Remodel", range: "$8,000–$20,000", timeline: "2–3 weeks", includes: "New tile, vanity, fixtures, lighting" },
  { scope: "Master Bath Renovation", range: "$20,000–$35,000", timeline: "3–4 weeks", includes: "Layout changes, shower/tub, heated floors" },
  { scope: "Luxury Bath", range: "$35,000+", timeline: "4–6 weeks", includes: "Custom everything, premium finishes, spa features" },
];

const SIGNS_LIST = [
  "Grout is cracked, stained, or showing signs of mold",
  "Fixtures are corroded, leaking, or outdated",
  "Toilet runs constantly or uses excessive water",
  "Vanity is damaged, lacks storage, or looks dated",
  "Ventilation is poor, leading to mold or moisture issues",
  "Tub or shower has cracks, chips, or stains that won't clean",
  "Layout doesn't work for your daily routine",
  "Flooring is peeling, cracked, or water-damaged",
];

const PROCESS_STEPS = [
  { step: "1", title: "Design & Planning", desc: "Finalize layout, select materials (tile, vanity, fixtures), set budget, and determine if plumbing needs to be relocated. This phase takes 1–2 weeks." },
  { step: "2", title: "Demolition", desc: "Existing tile, vanity, tub/shower, and fixtures are removed. Subfloor and walls are inspected for water damage or mold." },
  { step: "3", title: "Plumbing & Electrical", desc: "Rough-in plumbing for new fixture locations. Update electrical for new lighting, exhaust fan, or heated floors." },
  { step: "4", title: "Waterproofing & Tile", desc: "Waterproof membranes are applied to shower and floor areas. Tile installation on walls, floor, and shower surround." },
  { step: "5", title: "Fixture Installation", desc: "Vanity, toilet, shower door, mirrors, lighting, and accessories are installed and connected." },
  { step: "6", title: "Finishing & Cleanup", desc: "Grout sealing, caulking, paint touch-ups, final connections, and thorough cleaning. Final inspection if permits were pulled." },
];

const CONTRACTOR_CHECKLIST = [
  "Licensed and insured in your state",
  "At least 3 years of bathroom remodeling experience",
  "Written, itemized estimate with material specifications",
  "Portfolio of completed bathroom projects to review",
  "References from recent local bathroom remodel clients",
  "Clear payment schedule (never 100% upfront)",
  "Detailed timeline with milestones and completion date",
  "Handles permits and inspections directly",
  "Provides a written contract with full scope of work",
  "Experienced with waterproofing and tile work",
];

const FAQ_ITEMS = [
  {
    q: "How much does a bathroom remodel cost in 2026?",
    a: "The national average for a bathroom remodel is $8,000–$30,000, depending on scope, materials, and location. A half bath update can be done for $3,000–$8,000, while a full master bath renovation typically runs $20,000–$35,000. Luxury bathrooms with spa features can exceed $35,000.",
  },
  {
    q: "How long does a bathroom remodel take?",
    a: "Most standard bathroom remodels take 2–4 weeks from demolition to completion. A half bath update can be done in 3–5 days, while a master bath renovation may take 3–4 weeks. Custom tile work and fixture lead times can extend the timeline.",
  },
  {
    q: "Can I use my bathroom during a remodel?",
    a: "No — your bathroom will be out of commission during the remodel. Plan to use another bathroom in your home. If you only have one bathroom, discuss a phased approach with your contractor to minimize downtime.",
  },
  {
    q: "What gives the best ROI on a bathroom remodel?",
    a: "Mid-range bathroom remodels typically return about 65% at resale. Focus on updated tile, a modern vanity, new fixtures, and good lighting. Avoid over-improving with spa features unless your home's value supports it.",
  },
  {
    q: "Do I need a permit for a bathroom remodel?",
    a: "Permits are required if you're moving plumbing, adding electrical circuits, or making structural changes. Cosmetic updates like new tile, paint, vanity replacement (same location), and fixture swaps typically don't require permits.",
  },
];

const RELATED_GUIDES = [
  { title: "Kitchen Remodel Guide", href: "/guides/kitchen-remodel", icon: "/Kitchen.svg" },
  { title: "Roof Replacement Guide", href: "/guides/roof-replacement", icon: "/House.svg" },
  { title: "HVAC Installation Guide", href: "/guides/hvac-installation", icon: "/Air Conditioner.svg" },
  { title: "Window Replacement Guide", href: "/guides/window-replacement", icon: "/Window.svg" },
  { title: "Flooring Guide", href: "/guides/flooring", icon: "/Floor Tiles.svg" },
];

// ─── Component ────────────────────────────────────────────────────────────────
function BathroomRemodelGuide() {
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
            headline: "Complete Guide to Bathroom Remodel",
            description:
              "Everything you need to know about bathroom remodel costs, materials, timeline, permits, and choosing the right contractor.",
            author: { "@type": "Organization", name: "CostReno" },
            publisher: {
              "@type": "Organization",
              name: "CostReno",
              logo: { "@type": "ImageObject", url: "https://costreno.com/logo.svg" },
            },
            datePublished: "2026-07-01",
            dateModified: "2026-07-19",
            mainEntityOfPage: "https://costreno.com/guides/bathroom-remodel",
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
              { "@type": "ListItem", position: 2, name: "Renovation Guides", item: "https://costreno.com/guides" },
              { "@type": "ListItem", position: 3, name: "Bathroom", item: "https://costreno.com/guides/bathroom" },
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
          <a href="/" className="hover:text-ink transition">Home</a>
          <span>/</span>
          <a href="/guides" className="hover:text-ink transition">Renovation Guides</a>
          <span>/</span>
          <a href="/guides" className="hover:text-ink transition">Bathroom</a>
          <span>/</span>
          <span className="text-ink font-medium">Complete Guide</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-accent mb-4">
              BATHROOM GUIDE
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-[44px] font-extrabold text-ink leading-[1.1] tracking-tight">
              Complete Guide to Bathroom Remodel
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-lg">
              Everything you need to know about bathroom remodel costs, materials, timeline, permits, and choosing the right contractor.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span>10 min read</span>
              <span>·</span>
              <span>Updated July 2026</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 text-accent" />
              </div>
              <span className="text-xs font-medium text-ink">Reviewed by Bathroom Design Experts</span>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              src={projBathroom}
              alt="Modern bathroom remodel with new tile and fixtures"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Key Takeaways Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm">
          <h2 className="font-display text-lg font-bold text-ink mb-6 text-center">Key Takeaways</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <DollarSign className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Average Cost</span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">$8,000–$30,000</div>
              <p className="text-xs text-muted-foreground mt-1">National Average</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Timeline</span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">2–4 weeks</div>
              <p className="text-xs text-muted-foreground mt-1">Most projects</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">ROI</span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">65%</div>
              <p className="text-xs text-muted-foreground mt-1">Average return on investment</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <FileText className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Permits</span>
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

            {/* Section 1: Signs You Need a Bathroom Remodel */}
            <section id="signs" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                1. Signs You Need a Bathroom Remodel
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Not sure if your bathroom needs a full remodel or just a few updates? Here are the most common signs that it's time for a renovation:
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
                  src={projBathroom}
                  alt="Bathroom in need of a remodel"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </section>

            {/* Section 2: Bathroom Remodel Costs */}
            <section id="costs" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                2. Bathroom Remodel Costs by Scope
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Costs vary significantly based on the scope of your project. Below is a comparison of typical bathroom remodel budgets:
              </p>
              <div className="rounded-xl border border-border bg-white overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Scope</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Cost Range</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3 hidden sm:table-cell">Timeline</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3 hidden md:table-cell">Includes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SCOPE_COSTS.map((row, i) => (
                      <tr key={row.scope} className={i < SCOPE_COSTS.length - 1 ? "border-b border-border/50" : ""}>
                        <td className="px-5 py-3 text-sm font-medium text-ink">{row.scope}</td>
                        <td className="px-5 py-3 text-sm font-semibold text-ink">{row.range}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground hidden sm:table-cell">{row.timeline}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground hidden md:table-cell">{row.includes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pro Tip */}
              <div className="mt-5 p-4 rounded-xl bg-accent/5 border border-accent/20">
                <p className="text-xs font-semibold text-accent mb-1">Pro Tip</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Allocate 10–15% of your budget as a contingency fund. Bathroom remodels often uncover hidden water damage or mold behind walls and under flooring that adds to the final cost.
                </p>
              </div>
            </section>

            {/* Section 3: Best Bathroom Materials */}
            <section id="materials" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                3. Best Bathroom Materials
              </h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Material selection drives both the look and the budget of your bathroom remodel. Here's what to know about the three biggest categories:
              </p>
              <div className="space-y-6">
                {/* Tile */}
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Tile</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Tile is the most impactful material in a bathroom remodel. Porcelain and ceramic are the most popular for floors and showers due to their water resistance and durability. Natural stone (marble, travertine) adds luxury but requires more maintenance and sealing.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">Ceramic: $2–$8/sq ft</span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">Porcelain: $3–$12/sq ft</span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">Natural Stone: $10–$30/sq ft</span>
                  </div>
                </div>

                {/* Vanities */}
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Vanities</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Your vanity is the focal point of the bathroom. Options range from stock vanities (pre-built, standard sizes) to semi-custom and fully custom floating or freestanding designs. Consider storage needs, countertop material, and sink style.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">Stock: $200–$1,000</span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">Semi-Custom: $1,000–$3,000</span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">Custom: $3,000–$8,000+</span>
                  </div>
                </div>

                {/* Fixtures */}
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Fixtures</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Fixtures include faucets, showerheads, towel bars, and toilet. Upgrading to modern fixtures can transform a bathroom's look without major construction. Matte black and brushed gold are trending finishes, while chrome remains a classic budget-friendly choice.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">Budget: $500–$1,500</span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">Mid-Range: $1,500–$4,000</span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">Premium: $4,000–$10,000+</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Bathroom Remodel Process */}
            <section id="process" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                4. Bathroom Remodel Process: Step by Step
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Understanding the process helps you plan for disruptions and set realistic expectations. Here's a typical bathroom remodel timeline:
              </p>
              <div className="space-y-4">
                {PROCESS_STEPS.map((s) => (
                  <div key={s.step} className="flex gap-4 p-4 rounded-xl border border-border bg-white">
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
                5. How to Choose a Bathroom Contractor
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                A bathroom remodel involves plumbing, electrical, and waterproofing — all areas where quality matters. Use this checklist to vet candidates:
              </p>
              <div className="space-y-3">
                {CONTRACTOR_CHECKLIST.map((item) => (
                  <div key={item} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-white">
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
                Whether you need a permit depends on the scope of your bathroom remodel. Here's what you need to know:
              </p>
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">When is a permit required?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Permits are required for moving or adding plumbing (relocating toilet, shower, or sink), electrical work (new circuits, GFCI outlets), and structural modifications. Cosmetic updates like new tile, paint, vanity swap (same location), and fixture replacement typically don't require permits.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">Permit costs</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Bathroom remodel permits typically cost $100–$800 depending on your municipality and the scope of work. Plumbing and electrical permits may be separate. Your contractor should include these costs in their estimate.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">Inspections</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Inspections occur after rough-in plumbing and electrical (before walls are closed) and a final inspection after completion. Waterproofing inspections may also be required before tile installation.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">Warning: Skipping permits is risky</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Unpermitted work can void insurance coverage, create problems when selling your home, and result in fines. If a contractor suggests skipping permits to save time or money, consider it a red flag.
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
              <h2 className="font-display text-2xl font-bold text-ink mb-5">
                8. Related Guides
              </h2>
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
                  <h3 className="font-display text-base font-bold text-ink">Calculate Your Bathroom Remodel Cost</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Get a personalized estimate based on your ZIP code, bathroom size, and material preferences. Free, no signup required.
                </p>
                <a
                  href="/estimate?project=bathroom"
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
                  <h3 className="font-display text-base font-bold text-ink">Need Help Reviewing Your Bathroom Quote?</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Upload your bathroom remodel quote and get instant analysis on pricing, scope, and potential red flags.
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
                  <a href="/estimate?project=bathroom" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition">
                    <DollarSign className="h-4 w-4 text-accent shrink-0" />
                    <span>Bathroom Cost Calculator</span>
                  </a>
                  <a href="/quote-analyzer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition">
                    <FileText className="h-4 w-4 text-accent shrink-0" />
                    <span>Quote Review Tool</span>
                  </a>
                  <a href="/estimate" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition">
                    <MapPin className="h-4 w-4 text-accent shrink-0" />
                    <span>Local Price Estimator</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition">
                    <Shield className="h-4 w-4 text-accent shrink-0" />
                    <span>Insurance Claim Helper</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition">
                    <Star className="h-4 w-4 text-accent shrink-0" />
                    <span>Contractor Finder</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
