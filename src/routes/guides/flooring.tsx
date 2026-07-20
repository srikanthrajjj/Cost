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

const flooringImage = "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80";

export const Route = createFileRoute("/guides/flooring")({
  component: FlooringGuide,
  head: () => ({
    meta: [
      { title: "Complete Guide to Flooring Installation (2026) — CostReno" },
      {
        name: "description",
        content:
          "Everything you need to know about flooring installation costs, materials, timeline, permits, and choosing the right contractor. Updated July 2026.",
      },
      { property: "og:title", content: "Complete Guide to Flooring Installation — CostReno" },
      {
        property: "og:description",
        content:
          "Learn about flooring installation costs ($3,000–$15,000), best materials, contractor selection, and more.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://costreno.com/guides/flooring" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://costreno.com/guides/flooring" }],
  }),
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const TABLE_OF_CONTENTS = [
  { id: "signs", label: "Signs You Need New Flooring" },
  { id: "costs", label: "Flooring Installation Costs" },
  { id: "materials", label: "Best Flooring Materials" },
  { id: "process", label: "Flooring Installation Process" },
  { id: "contractor", label: "How to Choose a Contractor" },
  { id: "permits", label: "Permits & Inspections" },
  { id: "faq", label: "Frequently Asked Questions" },
  { id: "related", label: "Related Guides" },
];

const SCOPE_COSTS = [
  {
    scope: "LVP (Luxury Vinyl Plank)",
    range: "$3–$7/sq ft",
    timeline: "1–2 days",
    includes: "Material, underlayment, installation",
  },
  {
    scope: "Hardwood",
    range: "$6–$12/sq ft",
    timeline: "2–4 days",
    includes: "Solid or engineered, sanding, finishing",
  },
  {
    scope: "Tile",
    range: "$5–$15/sq ft",
    timeline: "2–4 days",
    includes: "Porcelain or ceramic, mortar, grout",
  },
  {
    scope: "Carpet",
    range: "$2–$5/sq ft",
    timeline: "1 day",
    includes: "Carpet, padding, tack strips, seaming",
  },
  {
    scope: "Laminate",
    range: "$2–$5/sq ft",
    timeline: "1–2 days",
    includes: "Material, underlayment, transitions",
  },
];

const SIGNS_LIST = [
  "Visible scratches, dents, or gouges that can't be repaired",
  "Warping, buckling, or uneven surfaces creating trip hazards",
  "Water damage stains or soft spots in subfloor",
  "Carpet is stained, worn, or emitting odors despite cleaning",
  "Tile grout is cracked, missing, or permanently stained",
  "Flooring style is severely outdated and hurting home value",
  "Squeaking or creaking that indicates subfloor issues",
  "Allergies worsened by old carpet holding dust and allergens",
];

const PROCESS_STEPS = [
  {
    step: "1",
    title: "Material Selection & Measurement",
    desc: "Choose flooring type based on room usage, moisture exposure, and budget. Professional measurement determines exact square footage needed (typically add 10% for waste and cuts).",
  },
  {
    step: "2",
    title: "Subfloor Preparation",
    desc: "Existing flooring is removed. Subfloor is inspected, leveled, and repaired as needed. Moisture testing is performed for concrete slabs. Underlayment is installed where required.",
  },
  {
    step: "3",
    title: "Acclimation",
    desc: "Hardwood and some other materials need to acclimate to your home's temperature and humidity for 48–72 hours before installation. This prevents expansion or contraction after install.",
  },
  {
    step: "4",
    title: "Installation",
    desc: "Flooring is installed following manufacturer guidelines. This includes proper expansion gaps, staggered seams, and appropriate adhesive or fastening methods for the material type.",
  },
  {
    step: "5",
    title: "Finishing & Transitions",
    desc: "Transition strips between rooms, baseboards, and quarter-round trim are installed. Any sanding and finishing for hardwood. Final cleanup and furniture move-back.",
  },
];

const CONTRACTOR_CHECKLIST = [
  "Licensed and insured flooring installer",
  "Experience with your specific flooring type",
  "Written, itemized estimate with material specifications",
  "References from recent local flooring projects",
  "Includes subfloor preparation in the estimate",
  "Clear timeline with start and completion dates",
  "Provides warranty on labor (minimum 1 year)",
  "Handles furniture moving and old flooring disposal",
];

const FAQ_ITEMS = [
  {
    q: "How much does flooring installation cost in 2026?",
    a: "The national average for flooring installation is $3,000–$15,000 for a typical home (1,000–2,000 sq ft). LVP and laminate are most affordable at $2–$7/sq ft installed, while hardwood runs $6–$12/sq ft and tile $5–$15/sq ft. Total cost depends on material choice, room size, and subfloor condition.",
  },
  {
    q: "How long does flooring installation take?",
    a: "Most flooring installations take 2–5 days for a typical home. A single room can often be done in 1 day. Hardwood that requires acclimation adds 2–3 days to the timeline. Tile takes longest due to mortar and grout drying times. LVP and laminate are fastest to install.",
  },
  {
    q: "What is the best flooring for high-traffic areas?",
    a: "Luxury vinyl plank (LVP) and porcelain tile are the most durable options for high-traffic areas. LVP is waterproof, scratch-resistant, and comfortable underfoot. Porcelain tile is virtually indestructible but harder and colder. Hardwood works well but shows wear over time and needs refinishing.",
  },
  {
    q: "Can I install new flooring over existing flooring?",
    a: "Sometimes. LVP and laminate can often be installed over existing hard surfaces if they're flat and in good condition. Tile can go over tile if the surface is well-bonded. However, installing over old carpet is not recommended, and any moisture issues in the subfloor must be addressed first.",
  },
  {
    q: "What gives the best ROI on flooring?",
    a: "Hardwood flooring offers the best ROI at approximately 70–80% recoup at resale and is the #1 requested feature by home buyers. LVP is a close second with excellent ROI at a lower investment. Avoid overly trendy choices. Classic looks like oak hardwood or neutral LVP appeal to the broadest audience.",
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
  { title: "Window Replacement Guide", href: "/guides/window-replacement", icon: "/Window.svg" },
  { title: "Roof Replacement Guide", href: "/guides/roof-replacement", icon: "/House.svg" },
];

// ─── Component ────────────────────────────────────────────────────────────────
function FlooringGuide() {
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
            headline: "Complete Guide to Flooring Installation",
            description:
              "Everything you need to know about flooring installation costs, materials, timeline, and choosing the right contractor.",
            author: { "@type": "Organization", name: "CostReno" },
            publisher: {
              "@type": "Organization",
              name: "CostReno",
              logo: { "@type": "ImageObject", url: "https://costreno.com/logo.svg" },
            },
            datePublished: "2026-07-01",
            dateModified: "2026-07-19",
            mainEntityOfPage: "https://costreno.com/guides/flooring",
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
                name: "Flooring",
                item: "https://costreno.com/guides/flooring",
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
            Flooring
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
              FLOORING GUIDE
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-[44px] font-extrabold text-ink leading-[1.1] tracking-tight">
              Complete Guide to Flooring Installation
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-lg">
              Everything you need to know about flooring installation costs, materials, timeline,
              and choosing the right contractor.
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
                Reviewed by Flooring Industry Experts
              </span>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              src={flooringImage}
              alt="Beautiful new hardwood flooring installation"
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
                $3,000–$15,000
              </div>
              <p className="text-xs text-muted-foreground mt-1">Whole home (1,000–2,000 sq ft)</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Timeline
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">2–5 days</div>
              <p className="text-xs text-muted-foreground mt-1">Most projects</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">ROI</span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">70%</div>
              <p className="text-xs text-muted-foreground mt-1">Average return on investment</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <FileText className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Permits
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">Rarely</div>
              <p className="text-xs text-muted-foreground mt-1">Not typically required</p>
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

            {/* Section 1: Signs You Need New Flooring */}
            <section id="signs" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                1. Signs You Need New Flooring
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Not sure if your floors need replacement or just a refresh? Here are the most common
                signs that it's time for new flooring:
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
                  src={flooringImage}
                  alt="Worn flooring in need of replacement"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </section>

            {/* Section 2: Flooring Installation Costs */}
            <section id="costs" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                2. Flooring Installation Costs by Material
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Costs vary significantly based on material choice and installation complexity. Below
                is a comparison of typical flooring costs (materials + installation):
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
                <p className="text-xs font-semibold text-accent mb-1">Pro Tip</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Order 10% extra material to account for cuts, waste, and future repairs. Flooring
                  from the same dye lot is essential for color matching. Buy it all at once rather
                  than reordering later.
                </p>
              </div>
            </section>

            {/* Section 3: Best Flooring Materials */}
            <section id="materials" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                3. Best Flooring Materials
              </h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Each flooring material has strengths and ideal use cases. Here's what to know about
                the most popular options:
              </p>
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">
                    Luxury Vinyl (LVP/LVT)
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    The fastest-growing flooring category. Luxury vinyl plank (LVP) is 100%
                    waterproof, extremely durable, and available in realistic wood and stone looks.
                    Easy click-lock installation makes it DIY-friendly. Ideal for kitchens,
                    bathrooms, basements, and high-traffic areas.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      $3–$7/sq ft installed
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Lifespan: 15–25 years
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Best for: Whole home
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Hardwood</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    The gold standard in flooring that never goes out of style. Available in solid
                    (3/4" thick, can be refinished many times) and engineered (plywood core, more
                    stable). Oak, maple, and hickory are most popular. Not recommended for bathrooms
                    or basements due to moisture sensitivity.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      $6–$12/sq ft installed
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Lifespan: 30–100+ years
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Best for: Living areas
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Porcelain Tile</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Virtually indestructible and completely waterproof. Available in endless styles
                    including wood-look, stone-look, and modern patterns. Ideal for bathrooms,
                    kitchens, and entryways. Harder and colder underfoot. Consider radiant heating
                    for comfort.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      $5–$15/sq ft installed
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Lifespan: 50+ years
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Best for: Wet areas
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-2">Carpet</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Soft, warm, and sound-absorbing. Ideal for bedrooms and cozy spaces. Modern
                    carpet is stain-resistant and available in many textures and colors. Not
                    recommended for kitchens, bathrooms, or homes with allergy sufferers.
                    Budget-friendly option that's quick to install.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      $2–$5/sq ft installed
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Lifespan: 5–15 years
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Best for: Bedrooms
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Flooring Installation Process */}
            <section id="process" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                4. Flooring Installation Process: Step by Step
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
                5. How to Choose a Flooring Contractor
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Quality installation is essential for flooring performance and longevity. Use this
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
                Flooring installation rarely requires permits, but there are some exceptions. Here's
                what you need to know:
              </p>
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">
                    When is a permit required?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Standard flooring replacement does not require permits in most areas. However,
                    permits may be required if you're adding radiant floor heating (electrical
                    permit), modifying the subfloor structure, or if the project is part of a larger
                    renovation that requires permits.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">
                    HOA considerations
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If you live in a condo or HOA community, check your bylaws. Many require board
                    approval before changing flooring type (especially from carpet to hard surfaces)
                    and may have sound-rating requirements (STC/IIC ratings) for multi-story
                    buildings.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-display text-base font-bold text-ink mb-2">
                    Asbestos testing
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Homes built before 1980 may have asbestos in vinyl flooring, adhesives, or
                    underlayment. Testing before removal is recommended (and required in some
                    areas). Professional abatement adds $2–$5/sq ft if asbestos is found.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">
                        Warning: Moisture testing is critical
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Installing flooring over a concrete slab without proper moisture testing can
                        lead to mold, adhesive failure, and warping. Ensure your installer performs
                        a calcium chloride or relative humidity test before installation on any
                        concrete surface.
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
                    Calculate Your Flooring Installation Cost
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Get a personalized estimate based on your ZIP code, square footage, and material
                  preferences. Free, no signup required.
                </p>
                <a
                  href="/estimate?project=flooring"
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
                    Need Help Reviewing Your Flooring Quote?
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Upload your flooring installation quote and get instant analysis on pricing,
                  scope, and potential red flags.
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
                    href="/estimate?project=flooring"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition"
                  >
                    <DollarSign className="h-4 w-4 text-accent shrink-0" />
                    <span>Flooring Cost Calculator</span>
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
