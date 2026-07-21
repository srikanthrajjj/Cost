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
import projRoof from "@/assets/proj-roof.jpg";

export const Route = createFileRoute("/guides/roof-replacement")({
  component: RoofReplacementGuide,
  head: () => ({
    meta: [
      { title: "Roof replacement cost in 2026: complete pricing guide — CostReno" },
      {
        name: "description",
        content:
          "How much does roof replacement cost in 2026? Get pricing by roof type, size, and state. Compare asphalt, metal, tile, and slate costs with our complete guide.",
      },
      { property: "og:title", content: "Roof replacement cost in 2026: complete pricing guide — CostReno" },
      {
        property: "og:description",
        content:
          "Complete 2026 roof replacement pricing guide. Costs by material, size, and state. Learn about hidden fees, labor costs, and how to compare contractor quotes.",
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
  { id: "average-cost", label: "Average roof replacement cost" },
  { id: "cost-by-material", label: "Cost by roofing material" },
  { id: "cost-by-size", label: "Cost by roof size" },
  { id: "cost-by-state", label: "Cost by state" },
  { id: "labor-costs", label: "Labor costs explained" },
  { id: "hidden-costs", label: "Hidden costs homeowners miss" },
  { id: "repair-vs-replace", label: "Repair vs replacement" },
  { id: "compare-quotes", label: "How to compare contractor quotes" },
  { id: "costreno-ai", label: "How CostReno AI helps" },
  { id: "faq", label: "Frequently asked questions" },
];

const MATERIAL_COSTS = [
  {
    material: "Asphalt (3-tab)",
    range: "$5,500–$9,000",
    lifespan: "15–20 years",
    best: "Budget-friendly",
  },
  {
    material: "Architectural asphalt",
    range: "$7,000–$12,500",
    lifespan: "25–30 years",
    best: "Best value",
  },
  {
    material: "Standing seam metal",
    range: "$14,000–$28,000",
    lifespan: "40–70 years",
    best: "Longevity & durability",
  },
  {
    material: "Metal shingles",
    range: "$10,000–$20,000",
    lifespan: "30–50 years",
    best: "Metal look, shingle style",
  },
  {
    material: "Clay tiles",
    range: "$15,000–$30,000",
    lifespan: "50–100 years",
    best: "Hot climates",
  },
  {
    material: "Concrete tiles",
    range: "$12,000–$25,000",
    lifespan: "40–50 years",
    best: "Affordable tile option",
  },
  {
    material: "Natural slate",
    range: "$20,000–$45,000+",
    lifespan: "75–150 years",
    best: "Premium longevity",
  },
  {
    material: "Wood shakes",
    range: "$10,000–$20,000",
    lifespan: "25–30 years",
    best: "Aesthetics",
  },
  {
    material: "Synthetic (composite)",
    range: "$9,000–$18,000",
    lifespan: "30–50 years",
    best: "Low maintenance",
  },
];

const SIZE_COSTS = [
  { size: "1,000 sq ft", asphalt: "$4,500–$7,000", metal: "$9,000–$16,000", tile: "$11,000–$22,000" },
  { size: "1,500 sq ft", asphalt: "$6,500–$10,000", metal: "$12,000–$22,000", tile: "$14,000–$28,000" },
  { size: "2,000 sq ft", asphalt: "$8,500–$13,000", metal: "$15,000–$28,000", tile: "$18,000–$35,000" },
  { size: "2,500 sq ft", asphalt: "$10,500–$16,000", metal: "$18,000–$34,000", tile: "$22,000–$42,000" },
  { size: "3,000 sq ft", asphalt: "$12,500–$19,000", metal: "$22,000–$40,000", tile: "$26,000–$50,000" },
];

const STATE_COSTS = [
  { state: "California", range: "$10,000–$28,000", notes: "High labor costs, strict codes" },
  { state: "Texas", range: "$7,500–$22,000", notes: "Storm damage common, competitive market" },
  { state: "Florida", range: "$9,000–$25,000", notes: "Hurricane codes, impact-rated materials" },
  { state: "New York", range: "$9,500–$26,000", notes: "High labor, seasonal demand" },
  { state: "Illinois", range: "$8,000–$22,000", notes: "Weather extremes, ice dam prevention" },
  { state: "Washington", range: "$8,500–$24,000", notes: "Rain-heavy climate, moss prevention" },
  { state: "Colorado", range: "$8,000–$23,000", notes: "Hail damage, altitude considerations" },
  { state: "Georgia", range: "$7,000–$20,000", notes: "Heat resistance important" },
  { state: "Ohio", range: "$7,500–$20,000", notes: "Freeze-thaw cycles" },
  { state: "Arizona", range: "$7,000–$21,000", notes: "UV protection critical, tile popular" },
];



const FAQ_ITEMS = [
  {
    q: "How much does a roof replacement cost in 2026?",
    a: "The national average for a full roof replacement in 2026 is $8,600 to $24,700. Most homeowners with asphalt shingle roofs on standard-sized homes pay between $8,000 and $13,000. Metal, tile, and slate roofs cost significantly more due to material and specialized labor.",
  },
  {
    q: "How long does a roof replacement take?",
    a: "Most residential roof replacements take 3 to 5 days from tear-off to completion. Simple asphalt shingle jobs on smaller homes can finish in 1 to 2 days. Complex roofs with dormers, valleys, or premium materials may take 5 to 7 days.",
  },
  {
    q: "What is the cheapest type of roof to install?",
    a: "3-tab asphalt shingles are the most affordable option at $5,500 to $9,000 for a typical home. They offer a 15 to 20 year lifespan. Architectural asphalt shingles cost slightly more ($7,000 to $12,500) but last 25 to 30 years, making them better value per year.",
  },
  {
    q: "Does homeowners insurance cover roof replacement?",
    a: "Insurance typically covers roof damage from sudden events like storms, hail, or fallen trees. It does not cover normal wear and tear, neglect, or age-related deterioration. File a claim promptly after storm damage and get an independent inspection before accepting the insurer's assessment.",
  },
  {
    q: "How much does a metal roof cost compared to asphalt?",
    a: "Metal roofing costs roughly 2x to 3x more than asphalt upfront ($14,000 to $28,000 vs $7,000 to $12,500). However, metal lasts 40 to 70 years versus 25 to 30 for architectural asphalt. On a cost-per-year basis, metal often wins long-term.",
  },
  {
    q: "How many quotes should I get for roof replacement?",
    a: "Get at least 3 to 5 written quotes from licensed, insured contractors. This gives you enough data to identify fair pricing and spot outliers. Make sure each quote covers the same scope so you can compare apples to apples.",
  },
  {
    q: "What are the hidden costs of roof replacement?",
    a: "Common hidden costs include: rotten decking replacement ($50 to $100 per sheet), permit fees ($100 to $500), structural repairs, chimney flashing, skylight re-sealing, gutter replacement, and dumpster fees. Always ask what is NOT included in the quote.",
  },
  {
    q: "Should I repair or replace my roof?",
    a: "Repair makes sense if damage is isolated, the roof is under 15 years old, and less than 30% of the surface is affected. Replace if the roof is over 20 years old, has widespread damage, you're seeing interior leaks in multiple areas, or repair costs exceed 50% of replacement cost.",
  },
  {
    q: "What's the best time of year to replace a roof?",
    a: "Late spring through early fall offers the best conditions. Shingles need temperatures above 40°F to seal properly. Off-season work (late fall or winter) may come with contractor discounts of 10% to 15% since demand is lower.",
  },
  {
    q: "Can I replace my roof myself to save money?",
    a: "DIY roof replacement is not recommended for most homeowners. It requires specialized tools, proper safety equipment, and knowledge of building codes. Mistakes can void material warranties, create leaks, and create liability issues. Labor typically accounts for 40% to 60% of the total cost.",
  },
  {
    q: "How much does roof replacement labor cost?",
    a: "Labor typically costs $1.50 to $3.50 per square foot, representing 40% to 60% of the total project. Factors that increase labor cost include steep pitch, multiple stories, complex geometry, removal of heavy existing material, and accessibility challenges.",
  },
  {
    q: "Do I need a permit for roof replacement?",
    a: "Yes, most municipalities require a building permit for full roof replacements. Permits typically cost $100 to $500. Your contractor should handle the application. Work done without permits can void warranties and create issues when selling your home.",
  },
  {
    q: "How do I know if my contractor is overcharging?",
    a: "Compare your quote against 3 to 5 other bids and use tools like CostReno's AI quote analyzer to benchmark pricing against local market rates. Red flags include vague line items, unusually low or high totals, pressure to sign immediately, and large upfront payment requests.",
  },
  {
    q: "What should a roof replacement quote include?",
    a: "A detailed quote should include: material type and brand, square footage, tear-off and disposal, underlayment, flashing replacement, ventilation, permit fees, timeline, payment schedule, workmanship warranty, and cleanup. Be wary of quotes missing any of these items.",
  },
];

const RELATED_GUIDES = [
  { title: "Kitchen Remodel Cost Guide", href: "/kitchen-remodel-cost", icon: "/Kitchen.svg" },
  {
    title: "HVAC Installation Guide",
    href: "/hvac-installation-cost",
    icon: "/Air Conditioner.svg",
  },
  { title: "Window Replacement Guide", href: "/window-replacement-cost", icon: "/Window.svg" },
  { title: "Bathroom Remodel Guide", href: "/bathroom-remodel-cost", icon: "/Bathtub.svg" },
  { title: "Solar Panel Installation", href: "/solar-installation-cost", icon: "/Solar Panel.svg" },
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
            headline: "Roof replacement cost in 2026: complete pricing guide by roof type, size & state",
            description:
              "How much does roof replacement cost in 2026? Get pricing by roof type, size, and state. Compare asphalt, metal, tile, and slate costs.",
            author: { "@type": "Organization", name: "CostReno" },
            publisher: {
              "@type": "Organization",
              name: "CostReno",
              logo: { "@type": "ImageObject", url: "https://costreno.com/logo.svg" },
            },
            datePublished: "2026-07-01",
            dateModified: "2026-07-21",
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
              {
                "@type": "ListItem",
                position: 2,
                name: "Renovation Guides",
                item: "https://costreno.com/guides",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Roofing",
                item: "https://costreno.com/guides/roofing",
              },
              { "@type": "ListItem", position: 4, name: "Roof replacement cost 2026" },
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
            Roofing
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
              Roofing Guide
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-[44px] font-extrabold text-ink leading-[1.1] tracking-tight">
              Roof replacement cost in 2026: complete pricing guide by roof type, size & state
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-lg">
              Most homeowners overpay for roof replacement because they don't know what a fair price
              looks like in their area. This guide breaks down real costs by material, roof size, and
              state so you can budget accurately, compare quotes confidently, and avoid overpaying.
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
                $8,600–$24,700
              </div>
              <p className="text-xs text-muted-foreground mt-1">National Average</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Typical Timeline
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">3–5 days</div>
              <p className="text-xs text-muted-foreground mt-1">Most homes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Roof Lifespan
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">20–50 years</div>
              <p className="text-xs text-muted-foreground mt-1">Depending on material</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <FileText className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Permits
                </span>
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

            {/* Section 1: Average roof replacement cost */}
            <section id="average-cost" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Average roof replacement cost
              </h2>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                The national average roof replacement cost in 2026 ranges from <strong className="text-ink">$8,600 to $24,700</strong>, with most homeowners paying around $12,000 to $15,000 for a standard architectural asphalt shingle roof on a 1,700 to 2,000 square foot home.
              </p>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Several factors determine where your project falls within this range: the material you choose, your roof's size and pitch, local labor rates, structural condition of the existing deck, and whether permits and tear-off are included.
              </p>
              <div className="rounded-xl border border-border bg-white overflow-hidden mb-5">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Category</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Cost range</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50"><td className="px-5 py-3 text-sm text-ink">National average</td><td className="px-5 py-3 text-sm font-semibold text-ink">$12,000–$15,000</td></tr>
                    <tr className="border-b border-border/50"><td className="px-5 py-3 text-sm text-ink">Low end (3-tab asphalt, small roof)</td><td className="px-5 py-3 text-sm font-semibold text-ink">$5,500–$8,600</td></tr>
                    <tr className="border-b border-border/50"><td className="px-5 py-3 text-sm text-ink">Mid range (architectural asphalt)</td><td className="px-5 py-3 text-sm font-semibold text-ink">$8,600–$16,000</td></tr>
                    <tr><td className="px-5 py-3 text-sm text-ink">High end (metal, tile, slate)</td><td className="px-5 py-3 text-sm font-semibold text-ink">$16,000–$45,000+</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                These are approximate averages based on regional data. Your actual cost depends on your specific location, roof complexity, chosen materials, and contractor.
              </p>
            </section>

            {/* Section 2: Cost by roofing material */}
            <section id="cost-by-material" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Roof replacement cost by material
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Your choice of roofing material is the single biggest factor in total project cost. Below is a comparison for a typical 1,700 square foot roof including labor and materials:
              </p>
              <div className="rounded-xl border border-border bg-white overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Material</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Cost range</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3 hidden sm:table-cell">Lifespan</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3 hidden md:table-cell">Best for</th>
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
              <div className="mt-5 p-4 rounded-xl bg-accent/5 border border-accent/20">
                <p className="text-xs font-semibold text-accent mb-1">Pro tip</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Calculate cost per year of life rather than just upfront price. A $22,000 standing seam metal roof lasting 60 years costs approximately $367 per year. A $9,000 3-tab asphalt roof lasting 18 years costs $500 per year.
                </p>
              </div>
            </section>

            {/* Section 3: Cost by roof size */}
            <section id="cost-by-size" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Roof replacement cost by size
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Roof size directly impacts total cost. Here's how pricing scales across common home sizes:
              </p>
              <div className="rounded-xl border border-border bg-white overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Roof size</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Asphalt</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3 hidden sm:table-cell">Metal</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3 hidden md:table-cell">Tile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_COSTS.map((row, i) => (
                      <tr key={row.size} className={i < SIZE_COSTS.length - 1 ? "border-b border-border/50" : ""}>
                        <td className="px-5 py-3 text-sm font-medium text-ink">{row.size}</td>
                        <td className="px-5 py-3 text-sm font-semibold text-ink">{row.asphalt}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground hidden sm:table-cell">{row.metal}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground hidden md:table-cell">{row.tile}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                Note that roof square footage is typically 1.2x to 1.5x your home's floor square footage due to pitch and overhangs.
              </p>
            </section>

            {/* Section 4: Cost by state */}
            <section id="cost-by-state" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Roof replacement cost by state
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Where you live significantly impacts roof replacement cost. Labor rates, building codes, climate requirements, and material availability all vary by region:
              </p>
              <div className="rounded-xl border border-border bg-white overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">State</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Cost range</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3 hidden sm:table-cell">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STATE_COSTS.map((row, i) => (
                      <tr key={row.state} className={i < STATE_COSTS.length - 1 ? "border-b border-border/50" : ""}>
                        <td className="px-5 py-3 text-sm font-medium text-ink">{row.state}</td>
                        <td className="px-5 py-3 text-sm font-semibold text-ink">{row.range}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground hidden sm:table-cell">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                Use CostReno's estimator with your ZIP code to get a more precise local estimate based on current regional data.
              </p>
            </section>

            {/* Section 5: Labor costs explained */}
            <section id="labor-costs" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Labor costs explained
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Labor typically accounts for 40% to 60% of the total roof replacement cost, ranging from $1.50 to $3.50 per square foot. Here's what drives labor pricing:
              </p>
              <div className="space-y-3">
                {[
                  { title: "Roof pitch and complexity", desc: "Steeper roofs (8/12 pitch or higher) require safety equipment, increasing labor 20% to 40%." },
                  { title: "Accessibility", desc: "Second and third story roofs or tight lots add cost for scaffolding and material handling." },
                  { title: "Tear-off layers", desc: "Removing multiple existing layers adds labor time and disposal fees." },
                  { title: "Flashing and penetrations", desc: "Chimneys, skylights, vents, and valleys each require custom metalwork." },
                  { title: "Ventilation upgrades", desc: "Adding ridge vents or soffit vents adds labor beyond basic shingle installation." },
                  { title: "Permits and inspections", desc: "Permit fees range from $100 to $500. Some jurisdictions require multiple inspections." },
                  { title: "Waste removal", desc: "Dumpster rental and disposal fees typically add $500 to $1,500." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6: Hidden costs */}
            <section id="hidden-costs" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Hidden costs homeowners miss
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Many homeowners are surprised by costs that weren't in the original quote:
              </p>
              <div className="space-y-3">
                {[
                  "Rotten decking replacement ($50 to $100 per 4x8 sheet)",
                  "Structural repairs for sagging rafters ($500 to $3,000+)",
                  "Water damage remediation discovered after tear-off",
                  "Code-required upgrades (ice and water shield, drip edge, ventilation)",
                  "Chimney flashing and re-sealing ($200 to $500 per chimney)",
                  "Skylight replacement or re-flashing ($300 to $800 per skylight)",
                  "Gutter replacement if damaged during tear-off ($1,000 to $2,500)",
                  "Permit fees not included in contractor's initial estimate",
                  "Insurance deductible if filing a claim ($1,000 to $5,000)",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-white">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-ink">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-ink">How to protect yourself:</strong> Ask your contractor what is NOT included. Request a written clause for unexpected decking damage pricing. Budget an additional 10% to 15% contingency.
                </p>
              </div>
            </section>

            {/* Section 7: Repair vs replacement */}
            <section id="repair-vs-replace" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Repair vs replacement
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Not every roof problem requires full replacement. Here's how to decide:
              </p>
              <div className="rounded-xl border border-border bg-white overflow-hidden mb-5">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Factor</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Repair</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Replace</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { factor: "Roof age", repair: "Under 15 years", replace: "Over 20 years" },
                      { factor: "Damage extent", repair: "Less than 30% of surface", replace: "Widespread or multiple areas" },
                      { factor: "Leak locations", repair: "Single, isolated leak", replace: "Multiple leaks" },
                      { factor: "Cost comparison", repair: "Under 50% of replacement", replace: "Repair exceeds 50% of new roof" },
                      { factor: "Plans to sell", repair: "Not selling soon", replace: "Selling within 5 years" },
                    ].map((row, i) => (
                      <tr key={row.factor} className={i < 4 ? "border-b border-border/50" : ""}>
                        <td className="px-5 py-3 text-sm font-medium text-ink">{row.factor}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">{row.repair}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">{row.replace}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A typical roof repair costs $300 to $1,500 for minor issues and $1,500 to $4,000 for moderate repairs. If repairs would cost more than half the price of a new roof, replacement usually makes more financial sense.
              </p>
            </section>

            {/* Section 8: How to compare contractor quotes */}
            <section id="compare-quotes" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                How to compare contractor quotes
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Comparing roofing quotes isn't just about finding the lowest number. Ensure each quote covers the same scope:
              </p>
              <div className="space-y-3">
                {[
                  "Scope of work: full tear-off or overlay? How many layers removed?",
                  "Material specifications: brand, product line, color, and warranty tier",
                  "Labor breakdown: listed separately from materials",
                  "Tear-off and disposal: dumpster rental and haul-away included?",
                  "Underlayment: synthetic felt vs ice and water shield",
                  "Flashing: all replaced or just repaired?",
                  "Ventilation: ridge vents, soffit vents included?",
                  "Warranty: workmanship warranty length and material warranty tier",
                  "Permits: who pulls them and who pays?",
                  "Payment schedule: percentage upfront vs at completion",
                  "Exclusions: what is explicitly NOT included?",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-white">
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-ink">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 9: How CostReno AI helps */}
            <section id="costreno-ai" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                How CostReno AI helps
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Reading and comparing contractor quotes is time-consuming and confusing. CostReno's AI quote analyzer simplifies the process:
              </p>
              <div className="space-y-3 mb-5">
                {[
                  { title: "Upload your quote", desc: "Take a photo or upload a PDF. The AI reads and extracts every line item automatically." },
                  { title: "Instant analysis", desc: "Within seconds, the AI categorizes costs, identifies what's missing, and flags suspicious items." },
                  { title: "Price benchmarking", desc: "Each line item is compared against local market rates to highlight overpriced work." },
                  { title: "Risk detection", desc: "Flags missing permits, no warranty terms, vague scope, and unusual payment structures." },
                  { title: "Savings opportunities", desc: "Specific recommendations on where costs can be reduced without sacrificing quality." },
                  { title: "Shareable report", desc: "Download a comprehensive analysis to share with family or your contractor." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-border bg-white p-5 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your contractor quote to CostReno and receive an AI-powered analysis showing hidden costs, pricing benchmarks, and opportunities to save before signing.
                </p>
                <a
                  href="/quote-analyzer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-white text-sm font-bold hover:bg-accent/90 transition"
                >
                  Analyze my roofing quote <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </section>

            {/* Section 10: FAQ */}
            <section id="faq" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-5">
                Frequently asked questions
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

            {/* Related Guides */}
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-5">Related guides</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RELATED_GUIDES.map((guide) => (
                  <a
                    key={guide.href}
                    href={guide.href}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border bg-white hover:border-accent/40 hover:shadow-md transition"
                  >
                    <img src={guide.icon} alt={guide.title} className="w-8 h-8 object-contain" />
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
                    Calculate your roof replacement cost
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Get a personalized estimate based on your ZIP code, roof size, and material
                  preferences. Free, no signup required.
                </p>
                <a
                  href="/estimate?project=roof"
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
                    Need help reviewing your roofing quote?
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Upload your roofing quote and get instant analysis on pricing, scope, and
                  potential red flags.
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
                    href="/estimate?project=roof"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition"
                  >
                    <DollarSign className="h-4 w-4 text-accent shrink-0" />
                    <span>Roofing Cost Calculator</span>
                  </a>
                  <a
                    href="/quote-analyzer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition"
                  >
                    <FileText className="h-4 w-4 text-accent shrink-0" />
                    <span>Roof Quote Review</span>
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
