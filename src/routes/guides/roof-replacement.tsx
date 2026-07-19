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
import projRoof from "@/assets/proj-roof.jpg";

export const Route = createFileRoute("/guides/roof-replacement")({
  component: RoofReplacementGuide,
  head: () => ({
    meta: [
      { title: "Complete Guide to Roof Replacement (2026) — CostReno" },
      {
        name: "description",
        content:
          "Everything you need to know about roof replacement costs, materials, timeline, permits, and choosing the right contractor. Updated July 2026.",
      },
      { property: "og:title", content: "Complete Guide to Roof Replacement — CostReno" },
      {
        property: "og:description",
        content:
          "Learn about roof replacement costs ($8,600–$24,700), best materials, contractor selection, permits, and more.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://costreno.com/guides/roof-replacement" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://costreno.com/guides/roof-replacement" }],
  }),
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const TABLE_OF_CONTENTS = [
  { id: "signs", label: "Signs You Need a New Roof" },
  { id: "costs", label: "Roof Replacement Costs" },
  { id: "materials", label: "Best Roofing Materials" },
  { id: "process", label: "Roof Replacement Process" },
  { id: "contractor", label: "How to Choose a Contractor" },
  { id: "permits", label: "Permits & Inspections" },
  { id: "faq", label: "Frequently Asked Questions" },
  { id: "related", label: "Related Guides" },
];

const MATERIAL_COSTS = [
  { material: "Asphalt Shingles", range: "$5,707–$10,772", lifespan: "20–30 years", best: "Budget-friendly" },
  { material: "Metal Roofing", range: "$12,000–$24,000", lifespan: "40–70 years", best: "Longevity" },
  { material: "Wood Shakes", range: "$10,000–$18,000", lifespan: "25–30 years", best: "Aesthetics" },
  { material: "Clay/Concrete Tiles", range: "$15,000–$30,000", lifespan: "50+ years", best: "Durability" },
  { material: "Slate", range: "$20,000–$40,000+", lifespan: "75–100 years", best: "Premium longevity" },
];

const SIGNS_LIST = [
  "Shingles are curling, cracking, or missing",
  "Roof is over 20 years old",
  "Daylight visible through the attic boards",
  "Sagging areas on the roofline",
  "Granules accumulating in gutters",
  "Water stains on interior ceilings or walls",
  "Moss or algae growth spreading across the surface",
  "Rising energy bills due to poor insulation",
];

const PROCESS_STEPS = [
  { step: "1", title: "Initial Inspection & Estimate", desc: "A licensed roofer inspects your roof, identifies damage, measures the area, and provides a detailed written estimate with material options." },
  { step: "2", title: "Material Selection", desc: "Choose your roofing material based on budget, climate, aesthetics, and longevity. Your contractor should provide samples and warranty information." },
  { step: "3", title: "Permits & Scheduling", desc: "Your contractor pulls necessary permits from the local building department. Most municipalities require a permit for full roof replacements." },
  { step: "4", title: "Tear-Off & Preparation", desc: "The old roofing material is removed down to the decking. Any rotted or damaged decking is replaced. Ice & water shield and underlayment are installed." },
  { step: "5", title: "Installation", desc: "New roofing material is installed following manufacturer specifications. Flashing is replaced around chimneys, vents, and valleys." },
  { step: "6", title: "Cleanup & Final Inspection", desc: "Debris is removed, a magnetic sweep catches stray nails, and a final inspection ensures everything meets code and manufacturer standards." },
];

const CONTRACTOR_CHECKLIST = [
  "Licensed and insured in your state",
  "At least 5 years of local roofing experience",
  "Written, itemized estimate (not verbal)",
  "Manufacturer certifications (GAF, CertainTeed, etc.)",
  "Workmanship warranty in addition to material warranty",
  "References from recent local projects",
  "Clear payment schedule (never 100% upfront)",
  "Pulls permits themselves (not asking you to)",
  "Provides a written contract with scope of work",
  "Has a physical business address (not just a PO box)",
];

const FAQ_ITEMS = [
  {
    q: "How much does a roof replacement cost in 2026?",
    a: "The national average for a full roof replacement is $8,600–$24,700, depending on materials, roof size, pitch, and location. Asphalt shingle roofs on average-sized homes typically fall in the $8,000–$12,000 range, while metal or slate can be $20,000+.",
  },
  {
    q: "How long does a roof replacement take?",
    a: "Most residential roof replacements take 3–5 days from tear-off to completion. Simple asphalt shingle jobs on smaller homes can be done in 1–2 days, while complex roofs with multiple valleys, dormers, or premium materials may take 5–7 days.",
  },
  {
    q: "Can I stay in my home during a roof replacement?",
    a: "Yes, in most cases you can remain in your home. Expect significant noise during working hours (typically 7am–6pm), some dust, and vibrations. If you have infants, pets sensitive to noise, or work from home, you may want to plan accordingly.",
  },
  {
    q: "Does homeowners insurance cover roof replacement?",
    a: "Insurance typically covers roof damage from sudden events like storms, hail, or fallen trees. It does not cover wear and tear, neglect, or age-related deterioration. File a claim promptly after storm damage and get an independent inspection before accepting the insurer's assessment.",
  },
  {
    q: "What's the best time of year to replace a roof?",
    a: "Late spring through early fall offers the best conditions for roof installation. Shingles need temperatures above 40°F to seal properly. However, off-season work (late fall/winter) may come with contractor discounts of 10–15% since demand is lower.",
  },
];

const RELATED_GUIDES = [
  { title: "Kitchen Remodel Cost Guide", href: "/kitchen-remodel-cost", icon: "🍳" },
  { title: "HVAC Installation Guide", href: "/hvac-installation-cost", icon: "❄️" },
  { title: "Window Replacement Guide", href: "/window-replacement-cost", icon: "🪟" },
  { title: "Bathroom Remodel Guide", href: "/bathroom-remodel-cost", icon: "🚿" },
  { title: "Solar Panel Installation", href: "/solar-installation-cost", icon: "☀️" },
];

// ─── Component ────────────────────────────────────────────────────────────────
function RoofReplacementGuide() {
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
            headline: "Complete Guide to Roof Replacement",
            description:
              "Everything you need to know about roof replacement costs, materials, timeline, permits, and choosing the right contractor.",
            author: { "@type": "Organization", name: "CostReno" },
            publisher: {
              "@type": "Organization",
              name: "CostReno",
              logo: { "@type": "ImageObject", url: "https://costreno.com/logo.svg" },
            },
            datePublished: "2026-07-01",
            dateModified: "2026-07-19",
            mainEntityOfPage: "https://costreno.com/guides/roof-replacement",
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
              { "@type": "ListItem", position: 3, name: "Roofing", item: "https://costreno.com/guides/roofing" },
              { "@type": "ListItem", position: 4, name: "Complete Guide" },
            ],
          }),
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <a href="/" className="shrink-0">
            <img src="/logo.svg" alt="CostReno" style={{ height: "32px", width: "auto" }} />
          </a>
          <nav className="hidden lg:flex items-center gap-7 text-sm font-extrabold text-foreground absolute left-1/2 -translate-x-1/2">
            <a href="/" className="hover:text-foreground transition-colors whitespace-nowrap">Home</a>
            <a href="/estimate" className="hover:text-foreground transition-colors whitespace-nowrap">Cost Estimator</a>
            <a href="/quote-analyzer" className="hover:text-foreground transition-colors whitespace-nowrap">Quote Review</a>
            <a href="#" className="hover:text-foreground transition-colors whitespace-nowrap">Insurance Claims</a>
            <div className="relative group">
              <button className="hover:text-foreground transition-colors whitespace-nowrap flex items-center gap-1 text-accent">
                Renovation Guides
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="w-44 rounded-xl border border-border bg-white shadow-xl p-2">
                  {[
                    { name: "Roofing", href: "/guides/roof-replacement" },
                    { name: "Kitchen", href: "/kitchen-remodel-cost" },
                    { name: "Bathroom", href: "/bathroom-remodel-cost" },
                    { name: "HVAC", href: "/hvac-installation-cost" },
                    { name: "Windows", href: "/window-replacement-cost" },
                    { name: "Flooring", href: "/flooring-cost" },
                    { name: "Solar", href: "#" },
                    { name: "Foundation", href: "#" },
                  ].map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 text-sm font-medium text-ink hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <a href="#" className="hover:text-foreground transition-colors whitespace-nowrap">Renovation Tools</a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-sm hover:bg-accent/90 transition"
            >
              Start Free
            </a>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <a href="/" className="hover:text-ink transition">Home</a>
          <span>/</span>
          <a href="/guides" className="hover:text-ink transition">Renovation Guides</a>
          <span>/</span>
          <a href="/guides" className="hover:text-ink transition">Roofing</a>
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
              Roofing Guide
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-[44px] font-extrabold text-ink leading-[1.1] tracking-tight">
              Complete Guide to Roof Replacement
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-lg">
              Everything you need to know about roof replacement costs, materials, timeline, permits, and choosing the right contractor.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span>15 min read</span>
              <span>·</span>
              <span>Updated July 2026</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 text-accent" />
              </div>
              <span className="text-xs font-medium text-ink">Reviewed by Roofing Experts</span>
            </div>
          </div>
          {/* Right Image */}
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              src={projRoof}
              alt="Professional roof replacement in progress on a residential home"
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
              <div className="font-display text-xl md:text-2xl font-bold text-ink">$8,600–$24,700</div>
              <p className="text-xs text-muted-foreground mt-1">National Average</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Typical Timeline</span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">3–5 days</div>
              <p className="text-xs text-muted-foreground mt-1">Most homes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Roof Lifespan</span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">20–50 years</div>
              <p className="text-xs text-muted-foreground mt-1">Depending on material</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <FileText className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Permits</span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">Yes</div>
              <p className="text-xs text-muted-foreground mt-1">Most locations</p>
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

            {/* Section 1: Signs You Need a New Roof */}
            <section id="signs" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                1. Signs You Need a New Roof
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Not sure if you need a full replacement or just repairs? Here are the most common warning signs that indicate your roof has reached the end of its useful life:
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
                  src={projRoof}
                  alt="Damaged roof shingles showing signs of wear and age"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </section>

            {/* Section 2: Roof Replacement Costs */}
            <section id="costs" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                2. Roof Replacement Costs by Material
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Costs vary significantly based on the material you choose. Below is a comparison of the most popular roofing materials for a typical 1,700 sq ft roof:
              </p>
              <div className="rounded-xl border border-border bg-white overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Material</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Cost Range</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3 hidden sm:table-cell">Lifespan</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3 hidden md:table-cell">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MATERIAL_COSTS.map((row, i) => (
                      <tr key={row.material} className={i < MATERIAL_COSTS.length - 1 ? "border-b border-border/50" : ""}>
                        <td className="px-5 py-3 text-sm font-medium text-ink">{row.material}</td>
                        <td className="px-5 py-3 text-sm font-semibold text-ink">{row.range}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground hidden sm:table-cell">{row.lifespan}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground hidden md:table-cell">{row.best}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pro Tip */}
              <div className="mt-5 p-4 rounded-xl bg-accent/5 border border-accent/20">
                <p className="text-xs font-semibold text-accent mb-1">Pro Tip</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Don't just compare upfront cost — calculate the cost per year of life. A $20,000 metal roof lasting 50 years ($400/year) is cheaper long-term than a $9,000 asphalt roof lasting 20 years ($450/year).
                </p>
              </div>
            </section>

            {/* Section 3: Best Roofing Materials */}
            <section id="materials" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                3. Best Roofing Materials Compared
              </h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Each roofing material has distinct advantages. Here's a deeper look at your options:
              </p>
              <div className="space-y-6">
                {/* Asphalt Shingles */}
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Asphalt Shingles</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    The most popular choice in the US (80% of homes). Available in 3-tab and architectural styles. Easy to install, widely available, and comes in many colors. Best for homeowners on a budget who plan to stay 15–20 years.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">20–30 year lifespan</span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">$5,707–$10,772</span>
                  </div>
                </div>

                {/* Metal Roofing */}
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Metal Roofing</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Standing seam and metal shingle options. Extremely durable, energy-efficient (reflects solar heat), and resistant to wind, fire, and impact. Ideal for harsh climates and homeowners who want a "last roof" solution.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">40–70 year lifespan</span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">$12,000–$24,000</span>
                  </div>
                </div>

                {/* Wood Shakes */}
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Wood Shakes</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Cedar or redwood shakes offer a beautiful, natural aesthetic. They require more maintenance (periodic treatment) and may not be allowed in fire-prone areas. Best for homeowners prioritizing curb appeal.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">25–30 year lifespan</span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">$10,000–$18,000</span>
                  </div>
                </div>

                {/* Clay/Concrete */}
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Clay & Concrete Tiles</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Extremely durable and fire-resistant. Common in Mediterranean, Spanish, and Southwestern-style homes. Heavy — your roof structure may need reinforcement. Best for warm, dry climates.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">50+ year lifespan</span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">$15,000–$30,000</span>
                  </div>
                </div>

                {/* Slate */}
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Slate</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    The premium option — natural stone that can last over 100 years. Fireproof, incredibly beautiful, and adds significant home value. Very heavy and requires specialized installers. Best for high-end homes where longevity and aesthetics justify the investment.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">75–100 year lifespan</span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">$20,000–$40,000+</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Roof Replacement Process */}
            <section id="process" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                4. Roof Replacement Process: Step by Step
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Understanding the process helps you plan around disruptions and know what to expect. Here's a typical roof replacement timeline:
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
                5. How to Choose a Roofing Contractor
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Your roof is one of the most important components of your home. Use this checklist to vet contractors before signing:
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
                Most municipalities require a building permit for a full roof replacement. Here's what you need to know:
              </p>
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">When is a permit required?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Almost always for full replacements. Minor repairs (replacing a few shingles) typically don't require one. Your contractor should know local requirements and handle the application.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">Permit costs</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Typically $100–$500 depending on your municipality. This should be included in your contractor's quote — not an add-on surprise.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">Inspections</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Most jurisdictions require at least one inspection (usually after installation). Some require two: one after tear-off/decking repair and one after final installation. Your contractor coordinates these.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">Warning: Skipping permits is risky</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Work done without permits can void warranties, create problems when selling your home, and result in fines. Always insist your contractor pulls proper permits.
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
                    <span className="text-2xl">{guide.icon}</span>
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
                  <h3 className="font-display text-base font-bold text-ink">Calculate Your Roof Replacement Cost</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Get a personalized estimate based on your ZIP code, roof size, and material preferences. Free, no signup required.
                </p>
                <a
                  href="/estimate?project=roof"
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
                      <span className="text-base">{guide.icon}</span>
                      <span>{guide.title}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA: Quote Review */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-accent" />
                  <h3 className="font-display text-base font-bold text-ink">Need Help Reviewing Your Roofing Quote?</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Upload your roofing quote and get instant analysis on pricing, scope, and potential red flags.
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
                  <a href="/estimate?project=roof" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition">
                    <DollarSign className="h-4 w-4 text-accent shrink-0" />
                    <span>Roofing Cost Calculator</span>
                  </a>
                  <a href="/quote-analyzer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition">
                    <FileText className="h-4 w-4 text-accent shrink-0" />
                    <span>Roof Quote Review</span>
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
