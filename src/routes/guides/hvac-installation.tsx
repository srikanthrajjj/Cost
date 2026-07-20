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
import projHvac from "@/assets/proj-hvac.jpg";

export const Route = createFileRoute("/guides/hvac-installation")({
  component: HvacInstallationGuide,
  head: () => ({
    meta: [
      { title: "Complete Guide to HVAC Installation (2026) — CostReno" },
      {
        name: "description",
        content:
          "Everything you need to know about HVAC installation costs, system types, timeline, permits, and choosing the right contractor. Updated July 2026.",
      },
      { property: "og:title", content: "Complete Guide to HVAC Installation — CostReno" },
      {
        property: "og:description",
        content:
          "Learn about HVAC installation costs ($4,500–$12,000), system types, contractor selection, permits, and more.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://costreno.com/guides/hvac-installation" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://costreno.com/guides/hvac-installation" }],
  }),
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const TABLE_OF_CONTENTS = [
  { id: "signs", label: "Signs You Need a New HVAC System" },
  { id: "costs", label: "HVAC Installation Costs" },
  { id: "materials", label: "HVAC System Types" },
  { id: "process", label: "HVAC Installation Process" },
  { id: "contractor", label: "How to Choose a Contractor" },
  { id: "permits", label: "Permits & Inspections" },
  { id: "faq", label: "Frequently Asked Questions" },
  { id: "related", label: "Related Guides" },
];

const SCOPE_COSTS = [
  {
    scope: "Central AC",
    range: "$4,000–$8,000",
    timeline: "1 day",
    includes: "Condenser, evaporator coil, refrigerant lines",
  },
  {
    scope: "Furnace",
    range: "$3,000–$7,000",
    timeline: "1 day",
    includes: "Gas or electric furnace, venting, thermostat",
  },
  {
    scope: "Heat Pump",
    range: "$5,000–$12,000",
    timeline: "1–2 days",
    includes: "Heat pump unit, air handler, refrigerant",
  },
  {
    scope: "Full System",
    range: "$8,000–$15,000",
    timeline: "2–3 days",
    includes: "AC + furnace, ductwork modifications, thermostat",
  },
];

const SIGNS_LIST = [
  "System is over 15 years old and losing efficiency",
  "Energy bills have increased significantly year over year",
  "Frequent repairs costing more than half of a new unit",
  "Uneven temperatures between rooms or floors",
  "Excessive noise, rattling, or grinding sounds",
  "Poor air quality, excess dust, or humidity issues",
  "System runs constantly but doesn't reach set temperature",
  "R-22 refrigerant system (phased out, expensive to refill)",
];

const PROCESS_STEPS = [
  {
    step: "1",
    title: "Assessment & Sizing",
    desc: "A qualified technician performs a Manual J load calculation to determine the correct system size for your home based on square footage, insulation, windows, and climate zone. Oversizing or undersizing both cause problems.",
  },
  {
    step: "2",
    title: "System Selection",
    desc: "Choose between central AC, heat pump, furnace, or a complete system based on your climate, existing infrastructure, and budget. Discuss SEER/AFUE ratings for energy efficiency.",
  },
  {
    step: "3",
    title: "Permits & Scheduling",
    desc: "Your contractor pulls mechanical permits required by your municipality. Installation is scheduled, typically 1–3 days depending on the system type and any ductwork modifications needed.",
  },
  {
    step: "4",
    title: "Installation",
    desc: "Old equipment is removed. New system is installed including indoor and outdoor units, refrigerant lines, electrical connections, and thermostat. Ductwork is modified or sealed as needed.",
  },
  {
    step: "5",
    title: "Testing & Commissioning",
    desc: "System is charged with refrigerant, airflow is measured at each register, thermostat operation is verified, and a final inspection is scheduled. You receive warranty documentation and maintenance instructions.",
  },
];

const CONTRACTOR_CHECKLIST = [
  "Licensed HVAC contractor in your state",
  "EPA 608 certified for refrigerant handling",
  "Performs Manual J load calculation (not rules of thumb)",
  "Written, itemized estimate with equipment model numbers",
  "At least 5 years of HVAC installation experience",
  "Clear payment schedule (never 100% upfront)",
  "Provides manufacturer warranty registration",
  "Includes post-installation inspection and testing",
];

const FAQ_ITEMS = [
  {
    q: "How much does HVAC installation cost in 2026?",
    a: "The national average for HVAC installation is $4,500–$12,000, depending on system type, home size, and complexity. A central AC replacement costs $4,000–$8,000, while a complete heating and cooling system replacement typically runs $8,000–$15,000. Ductwork modifications or new duct runs add $1,000–$5,000.",
  },
  {
    q: "How long does HVAC installation take?",
    a: "Most HVAC installations take 1–2 days for a straightforward replacement. If ductwork needs modification or a new system type is being installed (e.g., switching from a furnace to a heat pump), it may take 2–3 days. A complete system with new ductwork can take up to a week.",
  },
  {
    q: "How long does an HVAC system last?",
    a: "A well-maintained HVAC system lasts 15–20 years. Air conditioners average 15–20 years, furnaces 15–25 years, and heat pumps 12–15 years. Annual maintenance extends lifespan significantly. When repair costs exceed 50% of replacement cost, it's time for a new system.",
  },
  {
    q: "What size HVAC system do I need?",
    a: "System size depends on your home's square footage, insulation quality, number of windows, ceiling height, and local climate. A proper Manual J load calculation is essential. Never accept a quote based solely on square footage rules of thumb. An oversized system short-cycles and wastes energy.",
  },
  {
    q: "Do I need a permit for HVAC installation?",
    a: "Yes. Almost all HVAC installations require a mechanical permit. This ensures the work meets building codes for safety, venting, electrical connections, and refrigerant handling. Your contractor should pull the permit and schedule the required inspection.",
  },
];

const RELATED_GUIDES = [
  { title: "Kitchen Remodel Guide", href: "/guides/kitchen-remodel", icon: "/Kitchen.svg" },
  { title: "Bathroom Remodel Guide", href: "/guides/bathroom-remodel", icon: "/Bathtub.svg" },
  { title: "Roof Replacement Guide", href: "/guides/roof-replacement", icon: "/House.svg" },
  { title: "Window Replacement Guide", href: "/guides/window-replacement", icon: "/Window.svg" },
  { title: "Flooring Guide", href: "/guides/flooring", icon: "/Floor Tiles.svg" },
];

// ─── Component ────────────────────────────────────────────────────────────────
function HvacInstallationGuide() {
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
            headline: "Complete Guide to HVAC Installation",
            description:
              "Everything you need to know about HVAC installation costs, system types, timeline, permits, and choosing the right contractor.",
            author: { "@type": "Organization", name: "CostReno" },
            publisher: {
              "@type": "Organization",
              name: "CostReno",
              logo: { "@type": "ImageObject", url: "https://costreno.com/logo.svg" },
            },
            datePublished: "2026-07-01",
            dateModified: "2026-07-19",
            mainEntityOfPage: "https://costreno.com/guides/hvac-installation",
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
                name: "HVAC",
                item: "https://costreno.com/guides/hvac",
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
            HVAC
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
              HVAC GUIDE
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-[44px] font-extrabold text-ink leading-[1.1] tracking-tight">
              Complete Guide to HVAC Installation
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-lg">
              Everything you need to know about HVAC installation costs, system types, timeline,
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
                Reviewed by HVAC Industry Experts
              </span>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              src={projHvac}
              alt="Professional HVAC installation with new condenser unit"
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
                $4,500–$12,000
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
              <div className="font-display text-xl md:text-2xl font-bold text-ink">1–2 days</div>
              <p className="text-xs text-muted-foreground mt-1">Most installations</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Lifespan
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">15–20 years</div>
              <p className="text-xs text-muted-foreground mt-1">With proper maintenance</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <FileText className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Permits
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">Yes</div>
              <p className="text-xs text-muted-foreground mt-1">Required in most areas</p>
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

            {/* Section 1: Signs You Need a New HVAC System */}
            <section id="signs" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                1. Signs You Need a New HVAC System
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Not sure if your HVAC system needs replacement or just a repair? Here are the most
                common signs that it's time for a new system:
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
                  src={projHvac}
                  alt="Aging HVAC system in need of replacement"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </section>

            {/* Section 2: HVAC Installation Costs */}
            <section id="costs" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                2. HVAC Installation Costs by System Type
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Costs vary based on the type of system and complexity of installation. Below is a
                comparison of typical HVAC installation budgets:
              </p>
              <div className="rounded-xl border border-border bg-white overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">
                        System
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
                  Ask about available rebates and tax credits. Many utility companies offer rebates
                  for high-efficiency systems, and federal tax credits of up to $2,000 are available
                  for qualifying heat pumps and energy-efficient equipment.
                </p>
              </div>
            </section>

            {/* Section 3: HVAC System Types */}
            <section id="materials" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                3. HVAC System Types
              </h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Choosing the right system type depends on your climate, existing infrastructure, and
                energy goals. Here are the main options:
              </p>
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Central Air</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    The most common cooling system in American homes. Uses ductwork to distribute
                    cooled air throughout the house. Best for homes with existing ductwork. Modern
                    units achieve SEER ratings of 15–22+ for excellent efficiency.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      Cost: $4,000–$8,000
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Lifespan: 15–20 years
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Best for: Hot climates
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Heat Pumps</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Heat pumps provide both heating and cooling in one system by transferring heat
                    rather than generating it. Highly efficient in moderate climates and
                    increasingly effective in cold climates with modern cold-climate models.
                    Eligible for significant federal tax credits.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      Cost: $5,000–$12,000
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Lifespan: 12–15 years
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Best for: Moderate climates
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Furnaces</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Gas furnaces remain the primary heating system in colder regions. Modern
                    condensing furnaces achieve 95–98% AFUE ratings, meaning nearly all fuel is
                    converted to heat. Electric furnaces are cheaper to install but more expensive
                    to operate in most markets.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      Cost: $3,000–$7,000
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Lifespan: 15–25 years
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Best for: Cold climates
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">
                    Ductless Mini-Splits
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Individual wall-mounted units that provide heating and cooling without ductwork.
                    Ideal for room additions, older homes without ducts, or zoned comfort. Each
                    indoor unit operates independently for precise temperature control.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      Cost: $3,000–$8,000/zone
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Lifespan: 15–20 years
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Best for: No-duct homes
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: HVAC Installation Process */}
            <section id="process" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                4. HVAC Installation Process: Step by Step
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Understanding the process helps you prepare and ensures you get a quality
                installation. Here's what to expect:
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
                5. How to Choose an HVAC Contractor
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                HVAC installation quality directly impacts system efficiency and lifespan. Use this
                checklist to vet candidates:
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
                HVAC installations almost always require permits. Here's what you need to know:
              </p>
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">
                    When is a permit required?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Mechanical permits are required for virtually all HVAC installations: replacing
                    equipment, adding new systems, modifying ductwork, or changing fuel types. Only
                    minor repairs and filter replacements are exempt. Your contractor should pull
                    the permit before starting work.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">Permit costs</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    HVAC permits typically cost $100–$500 depending on your municipality. The permit
                    ensures proper installation, safe gas/electrical connections, and correct
                    venting. Your contractor should include permit costs in their estimate.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">Inspections</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A mechanical inspection verifies proper equipment sizing, safe gas line
                    connections, correct electrical wiring, proper venting and exhaust, and adequate
                    clearances. This typically happens within a few days of installation completion.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">
                        Warning: Unpermitted HVAC work voids warranties
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Most manufacturers require permitted installation to honor equipment
                        warranties. Unpermitted work also creates liability issues and can
                        complicate home sales. Always verify your contractor pulls the required
                        permits.
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
                    Calculate Your HVAC Installation Cost
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Get a personalized estimate based on your ZIP code, home size, and system
                  preferences. Free, no signup required.
                </p>
                <a
                  href="/estimate?project=hvac"
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
                    Need Help Reviewing Your HVAC Quote?
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Upload your HVAC installation quote and get instant analysis on pricing, scope,
                  and potential red flags.
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
                    href="/estimate?project=hvac"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition"
                  >
                    <DollarSign className="h-4 w-4 text-accent shrink-0" />
                    <span>HVAC Cost Calculator</span>
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
