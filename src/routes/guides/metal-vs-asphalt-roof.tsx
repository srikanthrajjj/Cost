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
import cmpRoof from "@/assets/cmp-roof.jpg";

export const Route = createFileRoute("/guides/metal-vs-asphalt-roof")({
  component: MetalVsAsphaltGuide,
  head: () => ({
    meta: [
      { title: "Metal vs asphalt roof cost guide | CostReno" },
      {
        name: "description",
        content:
          "Compare metal vs asphalt roofs for cost, lifespan, energy use, and ROI. A 2026 guide to help you choose the right roof.",
      },
      {
        property: "og:title",
        content: "Metal vs asphalt roof cost guide | CostReno",
      },
      {
        property: "og:description",
        content:
          "Metal vs asphalt roof comparison for cost, lifespan, energy savings, and resale value. Updated for 2026.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://www.costreno.com/guides/metal-vs-asphalt-roof" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/guides/metal-vs-asphalt-roof" }],
  }),
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const TABLE_OF_CONTENTS = [
  { id: "quick-comparison", label: "Quick comparison" },
  { id: "cost-comparison", label: "Cost breakdown" },
  { id: "lifespan-durability", label: "Lifespan & durability" },
  { id: "energy-efficiency", label: "Energy efficiency" },
  { id: "resale-value", label: "Resale value & ROI" },
  { id: "pros-cons", label: "Pros & cons" },
  { id: "best-for", label: "Which is best for you" },
  { id: "installation", label: "Installation process" },
  { id: "maintenance", label: "Maintenance requirements" },
  { id: "costreno-ai", label: "How CostReno AI helps" },
  { id: "faq", label: "Frequently asked questions" },
];

const COMPARISON_TABLE = [
  { feature: "Average cost (sq ft)", metal: "$7–$14", asphalt: "$3.50–$5.50" },
  { feature: "Total cost (2,000 sq ft roof)", metal: "$14,000–$28,000", asphalt: "$7,000–$12,500" },
  { feature: "Lifespan", metal: "40–70 years", asphalt: "15–30 years" },
  { feature: "Weight per sq ft", metal: "1–1.5 lbs", asphalt: "2.5–4 lbs" },
  { feature: "Wind resistance", metal: "Up to 140 mph", asphalt: "Up to 110 mph" },
  { feature: "Fire rating", metal: "Class A (best)", asphalt: "Class A to C" },
  { feature: "Energy savings", metal: "Up to 25% cooling", asphalt: "Minimal" },
  { feature: "Noise in rain", metal: "Louder (insulation helps)", asphalt: "Quieter" },
  { feature: "Eco-friendly", metal: "100% recyclable", asphalt: "Not recyclable" },
  { feature: "Maintenance", metal: "Low", asphalt: "Moderate" },
  { feature: "Insurance discount", metal: "Often yes", asphalt: "Rarely" },
  { feature: "Resale value boost", metal: "Higher", asphalt: "Standard" },
];

const PROS_METAL = [
  "Lasts 2 to 3 times longer than asphalt",
  "Withstands winds up to 140 mph",
  "Reflects solar heat, reducing cooling costs by 10% to 25%",
  "100% recyclable at end of life",
  "Class A fire resistance",
  "Lower long-term cost despite higher upfront price",
  "May qualify for insurance discounts",
  "Increases home resale value",
];

const CONS_METAL = [
  "2 to 3 times more expensive upfront",
  "Louder during heavy rain without proper insulation",
  "Dents from hail are possible (standing seam resists better)",
  "Requires specialized contractor for installation",
  "Color fading possible over 15 to 20 years",
  "Expansion and contraction with temperature changes",
];

const PROS_ASPHALT = [
  "Most affordable roofing option",
  "Wide variety of colors and styles",
  "Easy to find contractors",
  "Quick installation (1 to 3 days)",
  "Lightweight, no structural reinforcement needed",
  "Good fire resistance with fiberglass mats",
  "Easy to repair and maintain",
];

const CONS_ASPHALT = [
  "Shortest lifespan of all roofing materials (15 to 30 years)",
  "Susceptible to wind damage and algae growth",
  "Not recyclable, ends up in landfills",
  "Energy inefficient, absorbs heat",
  "Granule loss exposes underlayment over time",
  "May need replacement twice in the life of a metal roof",
];

const FAQ_ITEMS = [
  {
    q: "Is a metal roof worth the extra cost over asphalt?",
    a: "Yes, if you plan to stay in your home for 15+ years. Metal roofs last 40 to 70 years vs 15 to 30 for asphalt. Over that period, you may replace asphalt 2 to 3 times. The total lifetime cost of metal is often lower, and you save 10% to 25% on cooling bills annually.",
  },
  {
    q: "How much more does a metal roof cost compared to asphalt?",
    a: "Metal costs $7 to $14 per square foot installed, while asphalt costs $3.50 to $5.50. For a typical 2,000 sq ft roof, metal runs $14,000 to $28,000 vs $7,000 to $12,500 for asphalt. The premium is 2x to 3x, but the lifespan is also 2x to 3x longer.",
  },
  {
    q: "Does a metal roof increase home value?",
    a: "Yes. Studies show metal roofs can increase home value by 1% to 6%. Buyers recognize the longevity and lower maintenance costs. In areas prone to severe weather, the wind and fire resistance add even more value.",
  },
  {
    q: "Will a metal roof make my house hotter?",
    a: "No, quite the opposite. Metal roofs with reflective coatings reflect solar heat, reducing cooling costs by 10% to 25%. Asphalt absorbs heat, making your attic and home warmer in summer.",
  },
  {
    q: "How long does a metal roof last compared to asphalt?",
    a: "Standing seam metal roofs last 40 to 70 years. Metal shingles last 30 to 50 years. Asphalt 3-tab shingles last 15 to 20 years, while architectural asphalt lasts 25 to 30 years. Metal lasts 2 to 3 times longer.",
  },
  {
    q: "Can I install a metal roof over existing shingles?",
    a: "In many cases, yes. Metal roofing can be installed over one layer of existing shingles with proper underlayment. This saves $1,000 to $3,000 in tear-off costs. However, the roof structure must be sound and local codes must allow it.",
  },
  {
    q: "Is a metal roof noisy in the rain?",
    a: "Metal roofs can be louder than asphalt, but proper insulation and underlayment significantly reduce noise. Most homeowners report the sound is comparable to asphalt once insulation is in place. Standing seam designs also reduce noise better than corrugated metal.",
  },
  {
    q: "Which roof is better for resale value?",
    a: "Metal roofs generally provide better resale value. Buyers recognize the longer lifespan, lower maintenance, and energy savings. In competitive markets, a metal roof can be a selling point that differentiates your home.",
  },
  {
    q: "Do metal roofs need special insurance?",
    a: "Metal roofs often qualify for insurance discounts of 5% to 35% depending on your provider and location. Their fire resistance, wind resistance, and durability make them lower risk for insurers. Ask your agent about discounts.",
  },
  {
    q: "How do I decide between metal and asphalt?",
    a: "Consider your timeline (how long you'll live in the home), budget, local climate, and priorities. If you want the lowest upfront cost and plan to move within 10 years, asphalt is fine. If you want long-term value, durability, and energy savings, metal is the better investment.",
  },
];

const RELATED_GUIDES = [
  { title: "Roof Replacement Cost Guide", href: "/guides/roof-replacement", icon: "/House.svg" },
  {
    title: "Signs Your Quote Is Inflated",
    href: "/guides/inflated-quote-signs",
    icon: "/House.svg",
  },
  { title: "Kitchen Remodel Guide", href: "/guides/kitchen-remodel", icon: "/Kitchen.svg" },
  { title: "Bathroom Remodel Guide", href: "/guides/bathroom-remodel", icon: "/Bathtub.svg" },
];

// ─── Component ────────────────────────────────────────────────────────────────
function MetalVsAsphaltGuide() {
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
            headline: "Metal vs asphalt roof in 2026: cost, lifespan, pros & cons",
            description:
              "Metal vs asphalt roof: compare costs, lifespan, energy efficiency, ROI, and durability. Complete 2026 guide.",
            author: { "@type": "Organization", name: "CostReno" },
            publisher: {
              "@type": "Organization",
              name: "CostReno",
              logo: { "@type": "ImageObject", url: "https://www.costreno.com/logo.svg" },
            },
            datePublished: "2026-07-21",
            dateModified: "2026-07-21",
            mainEntityOfPage: "https://www.costreno.com/guides/metal-vs-asphalt-roof",
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
                name: "Guides",
                item: "https://www.costreno.com/guides",
              },
              { "@type": "ListItem", position: 3, name: "Metal vs asphalt roof" },
            ],
          }),
        }}
      />

      <SiteNav active="guides" />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <a href="/" className="hover:text-ink transition">
            Home
          </a>
          <span>/</span>
          <a href="/guides" className="hover:text-ink transition">
            Guides
          </a>
          <span>/</span>
          <span className="text-ink font-medium">Metal vs asphalt roof</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-accent mb-4">
              Roofing comparison
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-[44px] font-extrabold text-ink leading-[1.1] tracking-tight">
              Metal vs asphalt roof: complete 2026 comparison
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-lg">
              Choosing between metal and asphalt roofing? We break down costs, lifespan, energy
              efficiency, and resale value so you can make the right decision for your home and
              budget.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span>12 min read</span>
              <span>·</span>
              <span>Published July 2026</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 text-accent" />
              </div>
              <span className="text-xs font-medium text-ink">Based on 10,000+ analyzed quotes</span>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              src={cmpRoof}
              alt="Metal vs asphalt roof comparison"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
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
                  Metal cost
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">$14K–$28K</div>
              <p className="text-xs text-muted-foreground mt-1">Typical total</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <DollarSign className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Asphalt cost
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">$7K–$12.5K</div>
              <p className="text-xs text-muted-foreground mt-1">Typical total</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Metal lifespan
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">40–70 yrs</div>
              <p className="text-xs text-muted-foreground mt-1">2–3x longer</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Energy savings
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">10–25%</div>
              <p className="text-xs text-muted-foreground mt-1">Cooling cost reduction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          <div>
            {/* Table of contents */}
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

            {/* Section 1: Quick comparison */}
            <section id="quick-comparison" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Metal vs asphalt: quick comparison
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Here's a side-by-side look at the most important factors when choosing between metal
                and asphalt roofing:
              </p>
              <div className="rounded-xl border border-border bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">
                          Feature
                        </th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">
                          Metal
                        </th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">
                          Asphalt
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON_TABLE.map((row, i) => (
                        <tr
                          key={row.feature}
                          className={
                            i < COMPARISON_TABLE.length - 1 ? "border-b border-border/50" : ""
                          }
                        >
                          <td className="px-5 py-3 text-sm font-medium text-ink">{row.feature}</td>
                          <td className="px-5 py-3 text-sm text-ink">{row.metal}</td>
                          <td className="px-5 py-3 text-sm text-muted-foreground">{row.asphalt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 2: Cost breakdown */}
            <section id="cost-comparison" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Cost breakdown: metal vs asphalt
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Understanding the true cost requires looking at materials, labor, and long-term
                expenses:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="text-sm font-bold text-ink mb-3">Metal roofing</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Materials per sq ft</span>
                      <span className="font-medium text-ink">$4–$8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Labor per sq ft</span>
                      <span className="font-medium text-ink">$3–$6</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="font-medium text-ink">Total per sq ft</span>
                      <span className="font-bold text-ink">$7–$14</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">2,000 sq ft roof</span>
                      <span className="font-bold text-accent">$14,000–$28,000</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="text-sm font-bold text-ink mb-3">Asphalt shingles</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Materials per sq ft</span>
                      <span className="font-medium text-ink">$1.50–$3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Labor per sq ft</span>
                      <span className="font-medium text-ink">$2–$2.50</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="font-medium text-ink">Total per sq ft</span>
                      <span className="font-bold text-ink">$3.50–$5.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">2,000 sq ft roof</span>
                      <span className="font-bold text-accent">$7,000–$12,500</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                <p className="text-xs font-semibold text-accent mb-1">Lifetime cost perspective</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A metal roof costs 2x to 3x more upfront, but lasts 40 to 70 years. An asphalt
                  roof needs replacement every 15 to 30 years. Over 50 years, you might replace
                  asphalt 2 to 3 times ($14,000–$37,500 total) vs once for metal ($14,000–$28,000).
                  Metal often wins on lifetime cost.
                </p>
              </div>
            </section>

            {/* Section 3: Lifespan & durability */}
            <section id="lifespan-durability" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Lifespan and durability
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                How long your roof lasts depends on material quality, climate, and maintenance:
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "Standing seam metal: 40 to 70 years",
                    desc: "The gold standard for metal roofing. Interlocking panels resist wind up to 140 mph and require minimal maintenance. Most manufacturers offer 30 to 50 year warranties.",
                  },
                  {
                    title: "Metal shingles: 30 to 50 years",
                    desc: "Designed to look like asphalt or slate shingles but with metal durability. Slightly less wind resistance than standing seam but still far outlasts asphalt.",
                  },
                  {
                    title: "Architectural asphalt: 25 to 30 years",
                    desc: "The best asphalt option. Thicker than 3-tab shingles with better wind resistance. However, still susceptible to algae, moss, and granule loss over time.",
                  },
                  {
                    title: "3-tab asphalt: 15 to 20 years",
                    desc: "The cheapest option but shortest lived. Prone to wind damage, curling, and granule loss. Many homeowners find they need replacement sooner than expected.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white"
                  >
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Energy efficiency */}
            <section id="energy-efficiency" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">Energy efficiency</h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Your roof significantly impacts your energy bills. Here's how they compare:
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "Metal reflects solar heat",
                    desc: "Cool-roof rated metal roofing reflects up to 70% of solar energy. This can reduce cooling costs by 10% to 25%, saving $100 to $400 per year depending on your climate and home size.",
                  },
                  {
                    title: "Asphalt absorbs heat",
                    desc: "Dark asphalt shingles absorb and transfer heat into your home. This increases air conditioning load and can make your attic 50F to 60F hotter than outside air temperature.",
                  },
                  {
                    title: "Insulation helps both, but metal wins",
                    desc: "Good attic insulation reduces heat transfer for both roof types. However, metal's reflective properties give it an inherent advantage that insulation alone can't match for asphalt.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white"
                  >
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5: Resale value */}
            <section id="resale-value" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Resale value and ROI
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                A new roof is one of the best home improvements for ROI. Here's how each material
                impacts resale:
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "Metal roof ROI: 60% to 85%",
                    desc: "Metal roofs recoup 60% to 85% of their cost at resale. Buyers value the longevity, low maintenance, and energy savings. In storm-prone areas, the wind resistance adds even more appeal.",
                  },
                  {
                    title: "Asphalt roof ROI: 60% to 70%",
                    desc: "Asphalt roofs recoup 60% to 70% at resale. While the ROI percentage is similar, the lower upfront cost means less absolute dollar recovery. However, a new asphalt roof still signals a well-maintained home.",
                  },
                  {
                    title: "Insurance discounts favor metal",
                    desc: "Metal roofs often qualify for 5% to 35% homeowner insurance discounts. This is a tangible annual savings that buyers factor into their decision. Ask your insurer about metal roof discounts.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white"
                  >
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6: Pros & Cons */}
            <section id="pros-cons" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Pros and cons of each
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="text-sm font-bold text-ink mb-3">Metal roof</h3>
                  <div className="space-y-2">
                    {PROS_METAL.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span className="text-ink">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border mt-3 pt-3 space-y-2">
                    {CONS_METAL.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="text-sm font-bold text-ink mb-3">Asphalt roof</h3>
                  <div className="space-y-2">
                    {PROS_ASPHALT.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span className="text-ink">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border mt-3 pt-3 space-y-2">
                    {CONS_ASPHALT.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7: Best for you */}
            <section id="best-for" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Which roof is best for you?
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                The right choice depends on your situation:
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "Choose metal if you plan to stay 15+ years",
                    desc: "The higher upfront cost pays for itself through longevity, energy savings, and minimal maintenance. You'll likely never need another roof.",
                  },
                  {
                    title: "Choose asphalt if you're selling within 10 years",
                    desc: "The lower upfront cost makes more financial sense for shorter timelines. A new asphalt roof still adds value and curb appeal for resale.",
                  },
                  {
                    title: "Choose metal in storm-prone or fire-prone areas",
                    desc: "Wind resistance up to 140 mph and Class A fire rating make metal the safer choice in Florida, Texas, California, and other high-risk regions.",
                  },
                  {
                    title: "Choose metal if energy costs are a concern",
                    desc: "The 10% to 25% reduction in cooling costs adds up significantly over the roof's lifespan, especially in hot climates.",
                  },
                  {
                    title: "Choose asphalt for the lowest upfront cost",
                    desc: "If budget is the primary constraint, asphalt delivers a functional roof at the lowest initial price. Just plan for replacement in 15 to 30 years.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white"
                  >
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 8: Installation */}
            <section id="installation" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Installation process
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Metal and asphalt roofs have very different installation requirements:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="text-sm font-bold text-ink mb-3">Metal installation</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      Requires specialized contractor
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />3 to 7 days for
                      typical home
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      Can often install over existing shingles
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      Proper underlayment critical for performance
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-border bg-white p-5">
                  <h3 className="text-sm font-bold text-ink mb-3">Asphalt installation</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      Widely available contractors
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />1 to 3 days for
                      typical home
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      Usually requires tear-off of old shingles
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      Simpler process, fewer variables
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 9: Maintenance */}
            <section id="maintenance" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Maintenance requirements
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Both roof types require some maintenance, but the frequency and cost differ:
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "Metal: inspect annually, minimal upkeep",
                    desc: "Check for loose fasteners, damaged panels, and sealant gaps once a year. Clean debris from valleys and gutters. Most issues are cosmetic and cost under $200 to repair.",
                  },
                  {
                    title: "Asphalt: inspect twice a year, more repairs",
                    desc: "Check for cracked, curling, or missing shingles after storms. Look for granule loss in gutters. Replace damaged shingles promptly to prevent leaks. Budget $300 to $800 per repair.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white"
                  >
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 10: CostReno AI */}
            <section id="costreno-ai" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                How CostReno AI helps
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Whether you choose metal or asphalt, CostReno helps you get the best deal:
              </p>
              <div className="space-y-3 mb-5">
                {[
                  {
                    title: "Compare contractor quotes instantly",
                    desc: "Upload two or more quotes and see line-by-line price differences, missing scope items, and red flags highlighted by AI.",
                  },
                  {
                    title: "Benchmark against market rates",
                    desc: "Every item is compared against regional pricing data so you know if you're paying fair market value or being overcharged.",
                  },
                  {
                    title: "Spot hidden costs",
                    desc: "AI detects vague scope language, missing permits, and other common tactics that lead to surprise costs after signing.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white"
                  >
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
                  Got quotes for your roof? Upload them and our AI will compare pricing, flag
                  overpriced items, and show you exactly where you can save.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="/quote-analyzer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition"
                  >
                    Analyze my quote <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="/compare-quotes"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-white text-ink text-sm font-bold hover:bg-muted/50 transition"
                  >
                    Compare multiple quotes <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </section>

            {/* Section 11: FAQ */}
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

            {/* Related guides */}
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
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-accent" />
                  <h3 className="font-display text-base font-bold text-ink">
                    Got roofing quotes to compare?
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Upload them and our AI will flag overpriced items, missing scope, and savings
                  opportunities instantly.
                </p>
                <div className="space-y-2">
                  <a
                    href="/quote-analyzer"
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition shadow-sm"
                  >
                    Analyze my quote <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="/compare-quotes"
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl border border-border text-ink text-sm font-bold hover:bg-muted/50 transition"
                  >
                    Compare multiple quotes
                  </a>
                </div>
              </div>

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

              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-base font-bold text-ink mb-4">Popular tools</h3>
                <div className="space-y-3">
                  <a
                    href="/estimate"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition"
                  >
                    <DollarSign className="h-4 w-4 text-accent shrink-0" />
                    <span>Cost Estimator</span>
                  </a>
                  <a
                    href="/quote-analyzer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition"
                  >
                    <FileText className="h-4 w-4 text-accent shrink-0" />
                    <span>Quote Analyzer</span>
                  </a>
                  <a
                    href="/compare-quotes"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition"
                  >
                    <FileText className="h-4 w-4 text-accent shrink-0" />
                    <span>Compare Quotes</span>
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
