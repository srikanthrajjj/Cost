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
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import cmpRoof from "@/assets/cmp-roof.jpg";

export const Route = createFileRoute("/guides/inflated-quote-signs")({
  component: InflatedQuoteSignsGuide,
  head: () => ({
    meta: [
      { title: "Signs a contractor quote is inflated: how to spot overpriced bids — CostReno" },
      {
        name: "description",
        content:
          "Learn how to identify inflated contractor quotes. 12 red flags that signal overpricing, hidden fees, and scope manipulation in renovation bids.",
      },
      { property: "og:title", content: "Signs a contractor quote is inflated — CostReno" },
      {
        property: "og:description",
        content:
          "12 warning signs your contractor quote is inflated. Learn to spot overpriced labor, padded materials, vague scope, and hidden fees before signing.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://costreno.com/guides/inflated-quote-signs" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://costreno.com/guides/inflated-quote-signs" }],
  }),
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const TABLE_OF_CONTENTS = [
  { id: "why-quotes-inflated", label: "Why contractors inflate quotes" },
  { id: "red-flags", label: "12 red flags of an inflated quote" },
  { id: "pricing-comparison", label: "How to compare pricing" },
  { id: "common-tactics", label: "Common inflation tactics" },
  { id: "what-fair-quote-looks-like", label: "What a fair quote looks like" },
  { id: "how-to-negotiate", label: "How to negotiate effectively" },
  { id: "costreno-ai", label: "How CostReno AI detects inflation" },
  { id: "faq", label: "Frequently asked questions" },
];

const RED_FLAGS = [
  {
    title: "No itemized breakdown",
    desc: "A single lump-sum price with no line items makes it impossible to verify what you're paying for. Legitimate contractors provide detailed breakdowns of labor, materials, permits, and disposal.",
  },
  {
    title: "Labor costs above 60% of total",
    desc: "Labor typically accounts for 40% to 60% of a renovation project. If labor exceeds 60% to 65% without a clear reason (complex access, specialty work), the quote may be padded.",
  },
  {
    title: "Vague material descriptions",
    desc: "Generic terms like 'standard materials' or 'quality fixtures' without brand names, model numbers, or specifications are a sign the contractor is leaving room to use cheaper products.",
  },
  {
    title: "Unusually high material markup",
    desc: "Contractors typically mark up materials 15% to 25% over wholesale. If material costs seem 40% to 50% above retail pricing you can find online, the markup is excessive.",
  },
  {
    title: "Missing scope items",
    desc: "Key items left out of the quote (permits, cleanup, disposal, protection of existing surfaces) often get added later as expensive change orders.",
  },
  {
    title: "Pressure to sign immediately",
    desc: "High-pressure tactics like 'this price is only good today' or 'I have another client waiting' are classic signs of a contractor who knows their price won't survive comparison.",
  },
  {
    title: "No written warranty",
    desc: "Reputable contractors stand behind their work with a written workmanship warranty (1 to 5 years minimum). No warranty often means no accountability.",
  },
  {
    title: "Large upfront payment",
    desc: "Requesting more than 10% to 30% upfront (or the full amount before starting) is a major red flag. Standard payment schedules tie payments to project milestones.",
  },
  {
    title: "Round numbers everywhere",
    desc: "A detailed, honest estimate has specific numbers ($4,287 for materials, $6,430 for labor). Quotes full of round numbers ($5,000 materials, $7,000 labor) suggest estimates were guessed, not calculated.",
  },
  {
    title: "Significantly higher than other bids",
    desc: "If one quote is 30% to 50% or more above other comparable bids for the same scope of work, it's likely inflated. Get 3 to 5 quotes to establish a fair market range.",
  },
  {
    title: "Scope creep language",
    desc: "Watch for phrases like 'as needed,' 'to be determined,' or 'allowance of.' These open-ended terms let the contractor add costs without your approval during the project.",
  },
  {
    title: "No permit mention",
    desc: "If your project requires permits and the quote doesn't mention them, the contractor either plans to skip them (risky) or will add the cost later as a surprise fee.",
  },
];

const COMMON_TACTICS = [
  {
    tactic: "Material padding",
    how: "Quoting premium materials but installing mid-grade, or ordering 30%+ excess material and keeping the surplus.",
    defense: "Specify exact brands and quantities. Ask for material receipts.",
  },
  {
    tactic: "Labor hour inflation",
    how: "Estimating 3 days of work for a 1-day job, or billing for a full crew when only 2 workers show up.",
    defense: "Compare labor hours with other bids. Ask how many workers and days are planned.",
  },
  {
    tactic: "Hidden change orders",
    how: "Quoting low initially then 'discovering' issues that require expensive additions once work starts.",
    defense: "Include contingency clauses. Require written approval for any additions over $500.",
  },
  {
    tactic: "Double-charging",
    how: "Charging separately for items already included in another line (e.g., charging for 'prep work' and 'surface preparation').",
    defense: "Review each line item and ask what exactly it covers. Flag duplicates.",
  },
  {
    tactic: "Inflated disposal fees",
    how: "Charging $2,000+ for disposal when a dumpster rental costs $400 to $600.",
    defense: "Research local dumpster rental rates. Ask for the disposal company name.",
  },
  {
    tactic: "Permit fee markup",
    how: "Charging $800 to $1,500 for permits that actually cost $150 to $300 from the municipality.",
    defense: "Call your local building department and ask what permits cost for your project type.",
  },
];

const FAQ_ITEMS = [
  {
    q: "How do I know if a contractor quote is too high?",
    a: "Get 3 to 5 quotes for the same scope of work. If one quote is more than 25% to 30% above the average of the others, it's likely inflated. Use CostReno's estimator to check if the total falls within typical market ranges for your area.",
  },
  {
    q: "Is the cheapest quote always the best?",
    a: "No. The cheapest quote may indicate missing scope, inferior materials, unlicensed work, or a contractor who will add costs via change orders. Focus on finding fair market value, not the absolute lowest price. A quote 10% to 15% below average is fine. More than 30% below is suspicious.",
  },
  {
    q: "What percentage should labor be in a renovation quote?",
    a: "Labor typically accounts for 40% to 60% of total project cost, varying by project type. Roofing is often 40% to 50% labor. Kitchen remodels can be 35% to 45% labor since materials (cabinets, counters) are expensive. If labor exceeds 65%, ask for justification.",
  },
  {
    q: "Should I tell contractors what other quotes I received?",
    a: "You can mention you're getting multiple bids without sharing exact numbers. Saying 'I'm comparing 3 to 4 quotes' is fine. Sharing exact prices can lead to contractors just underbidding without providing the same scope.",
  },
  {
    q: "What should I do if I already signed an inflated contract?",
    a: "Check your state's contractor cancellation laws (many allow 3-day right of rescission). If past that window, negotiate specific line items you've identified as overpriced. Document everything in writing. As a last resort, consult a construction attorney.",
  },
  {
    q: "How much profit margin is normal for contractors?",
    a: "Reputable contractors typically have a 10% to 20% profit margin built into their quotes, on top of their overhead costs. This is standard and expected. Profit margins above 30% to 40% on top of costs suggest inflation.",
  },
  {
    q: "Can I negotiate a contractor quote down?",
    a: "Yes. Contractors expect some negotiation. You can negotiate by reducing scope, choosing different materials, adjusting timeline (off-season work), combining multiple projects, or simply presenting comparable lower bids. Most contractors will reduce 5% to 15% rather than lose the job.",
  },
  {
    q: "What is a fair material markup for contractors?",
    a: "Contractors typically mark up materials 15% to 25% over their wholesale cost to cover procurement time, delivery coordination, and the risk of damage or defects. Markups above 35% to 40% over retail (not wholesale) are excessive.",
  },
  {
    q: "How can AI help me evaluate a contractor quote?",
    a: "AI tools like CostReno's quote analyzer can read your quote line by line, compare each item against regional market rates, flag overpriced items, identify missing scope, and highlight vague language that could lead to change orders. It provides an objective second opinion in seconds.",
  },
  {
    q: "Should I always get the quote in writing?",
    a: "Always. Never accept a verbal quote. A written, itemized quote protects both parties and gives you something to compare against other bids, verify scope, and hold the contractor accountable. If a contractor won't put it in writing, find someone else.",
  },
];

const RELATED_GUIDES = [
  { title: "Roof Replacement Cost Guide", href: "/guides/roof-replacement", icon: "/House.svg" },
  { title: "Kitchen Remodel Guide", href: "/guides/kitchen-remodel", icon: "/Kitchen.svg" },
  { title: "Bathroom Remodel Guide", href: "/guides/bathroom-remodel", icon: "/Bathtub.svg" },
  {
    title: "HVAC Installation Guide",
    href: "/guides/hvac-installation",
    icon: "/Air Conditioner.svg",
  },
  { title: "Window Replacement Guide", href: "/guides/window-replacement", icon: "/Window.svg" },
];

// ─── Component ────────────────────────────────────────────────────────────────
function InflatedQuoteSignsGuide() {
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
            headline: "Signs a contractor quote is inflated: how to spot overpriced bids",
            description:
              "Learn how to identify inflated contractor quotes. 12 red flags that signal overpricing, hidden fees, and scope manipulation.",
            author: { "@type": "Organization", name: "CostReno" },
            publisher: {
              "@type": "Organization",
              name: "CostReno",
              logo: { "@type": "ImageObject", url: "https://costreno.com/logo.svg" },
            },
            datePublished: "2026-07-21",
            dateModified: "2026-07-21",
            mainEntityOfPage: "https://costreno.com/guides/inflated-quote-signs",
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
                name: "Guides",
                item: "https://costreno.com/guides",
              },
              { "@type": "ListItem", position: 3, name: "Signs a contractor quote is inflated" },
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
          <span className="text-ink font-medium">Inflated quote signs</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-accent mb-4">
              Quote tips
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-[44px] font-extrabold text-ink leading-[1.1] tracking-tight">
              Signs a contractor quote is inflated
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-lg">
              Not every high quote means you're being overcharged. But certain patterns consistently
              signal that a contractor is padding their numbers. Learn to spot them before you sign.
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
              alt="Contractor reviewing a renovation quote"
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
                <AlertTriangle className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Red flags
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">12</div>
              <p className="text-xs text-muted-foreground mt-1">Key warning signs</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <DollarSign className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Typical markup
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">15–25%</div>
              <p className="text-xs text-muted-foreground mt-1">Fair material markup</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <FileText className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Quotes needed
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">3–5</div>
              <p className="text-xs text-muted-foreground mt-1">Minimum to compare</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Labor share
                </span>
              </div>
              <div className="font-display text-xl md:text-2xl font-bold text-ink">40–60%</div>
              <p className="text-xs text-muted-foreground mt-1">Normal range</p>
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

            {/* Section 1: Why contractors inflate quotes */}
            <section id="why-quotes-inflated" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Why contractors inflate quotes
              </h2>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Most contractors are honest professionals. But the industry's lack of pricing
                transparency creates opportunities for those who aren't. Here's why inflation
                happens:
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "No standard pricing",
                    desc: "Unlike retail products, renovation services have no published price list. Each contractor sets their own rates, making it hard for homeowners to know what's fair.",
                  },
                  {
                    title: "Information asymmetry",
                    desc: "Contractors know material costs, labor rates, and project timelines. Most homeowners don't. This gap makes it easy to pad numbers without detection.",
                  },
                  {
                    title: "Fear-based selling",
                    desc: "Some contractors inflate quotes after 'discovering' urgent problems during inspection, creating pressure to approve expensive solutions immediately.",
                  },
                  {
                    title: "Low accountability",
                    desc: "Homeowners rarely compare their final costs against what was fair market value. Without feedback loops, inflated pricing goes unchallenged.",
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

            {/* Section 2: 12 red flags */}
            <section id="red-flags" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                12 red flags of an inflated quote
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Look for these warning signs in any contractor quote you receive. The more flags
                present, the more likely the quote is inflated:
              </p>
              <div className="space-y-3">
                {RED_FLAGS.map((flag, i) => (
                  <div
                    key={flag.title}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-amber-700">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">{flag.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{flag.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: How to compare pricing */}
            <section id="pricing-comparison" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                How to compare pricing
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                The most reliable way to identify an inflated quote is to compare it against other
                bids and market data:
              </p>
              <div className="space-y-3">
                {[
                  "Get 3 to 5 written quotes for the exact same scope of work",
                  "Ensure each quote specifies the same materials, brands, and quality tier",
                  "Compare labor costs as a percentage of total (should be 40% to 60%)",
                  "Check material costs against retail pricing at home improvement stores",
                  "Research permit fees directly with your local building department",
                  "Use CostReno's estimator to benchmark total project cost for your ZIP code",
                  "Ask each contractor to break down their quote into the same categories",
                  "Look at the price per square foot and compare across all bids",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border bg-white"
                  >
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-ink">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-4 rounded-xl bg-accent/5 border border-accent/20">
                <p className="text-xs font-semibold text-accent mb-1">Pro tip</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Create a simple spreadsheet with columns for each bid. List every line item down
                  the rows. This makes it immediately obvious when one contractor is charging 2x to
                  3x what others charge for the same item.
                </p>
              </div>
            </section>

            {/* Section 4: Common inflation tactics */}
            <section id="common-tactics" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                Common inflation tactics
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Understanding how inflation happens helps you spot it. Here are the most common
                tactics and how to defend against them:
              </p>
              <div className="rounded-xl border border-border bg-white overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">
                        Tactic
                      </th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3 hidden sm:table-cell">
                        How it works
                      </th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">
                        Defense
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMMON_TACTICS.map((row, i) => (
                      <tr
                        key={row.tactic}
                        className={i < COMMON_TACTICS.length - 1 ? "border-b border-border/50" : ""}
                      >
                        <td className="px-5 py-3 text-sm font-medium text-ink align-top">
                          {row.tactic}
                        </td>
                        <td className="px-5 py-3 text-sm text-muted-foreground hidden sm:table-cell align-top">
                          {row.how}
                        </td>
                        <td className="px-5 py-3 text-sm text-muted-foreground align-top">
                          {row.defense}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 5: What a fair quote looks like */}
            <section id="what-fair-quote-looks-like" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                What a fair quote looks like
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                A legitimate, fairly-priced contractor quote should include all of the following:
              </p>
              <div className="space-y-3">
                {[
                  "Itemized breakdown of labor, materials, permits, and disposal separately",
                  "Specific material brands, model numbers, and quantities",
                  "Labor broken down by task or trade (plumbing, electrical, carpentry)",
                  "Clear start date, estimated completion date, and daily work hours",
                  "Written workmanship warranty (minimum 1 to 2 years)",
                  "Payment schedule tied to milestones (not front-loaded)",
                  "Explicit list of what is NOT included (exclusions)",
                  "Contractor's license number and insurance details",
                  "Process for handling unexpected issues (written change order policy)",
                  "Total that falls within 15% of average comparable bids",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border bg-white"
                  >
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-ink">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6: How to negotiate */}
            <section id="how-to-negotiate" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                How to negotiate effectively
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                If you've identified inflation in a quote, here's how to approach the conversation:
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "Lead with data, not emotions",
                    desc: "Show specific comparable prices from other bids or market research. 'I received two other quotes at $X for the same scope' is more effective than 'your price is too high.'",
                  },
                  {
                    title: "Negotiate line items, not the total",
                    desc: "Instead of asking for a blanket discount, identify specific overpriced items. 'I see labor at $85/hour when the local average is $55 to $65. Can we discuss this line?'",
                  },
                  {
                    title: "Offer trade-offs",
                    desc: "Suggest reducing scope, choosing alternative materials, scheduling in the off-season, or bundling multiple projects. Give the contractor a way to reduce price without feeling they're losing.",
                  },
                  {
                    title: "Be willing to walk away",
                    desc: "The strongest negotiating position is genuine willingness to choose another contractor. Don't bluff. Actually have backup options ready.",
                  },
                  {
                    title: "Get the revised quote in writing",
                    desc: "Any agreed-upon price changes must be documented in the updated written quote before you sign. Verbal promises have no weight.",
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

            {/* Section 7: How CostReno AI detects inflation */}
            <section id="costreno-ai" className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                How CostReno AI detects inflation
              </h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                CostReno's AI quote analyzer automates the detection of inflated pricing:
              </p>
              <div className="space-y-3 mb-5">
                {[
                  {
                    title: "Line-by-line benchmarking",
                    desc: "Every item in your quote is compared against regional market rates to highlight anything priced above fair range.",
                  },
                  {
                    title: "Labor ratio analysis",
                    desc: "Flags quotes where labor exceeds normal percentages for that project type without justification.",
                  },
                  {
                    title: "Missing scope detection",
                    desc: "Identifies common items that should be in the quote but aren't, predicting likely change orders.",
                  },
                  {
                    title: "Vague language flagging",
                    desc: "Highlights open-ended phrases like 'as needed' or 'allowance' that can lead to cost overruns.",
                  },
                  {
                    title: "Savings calculation",
                    desc: "Shows the dollar amount you could save by negotiating overpriced items down to fair market value.",
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
                  Upload your contractor quote to CostReno and get an instant analysis showing which
                  items are overpriced, what's missing, and how much you could save.
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

            {/* Section 8: FAQ */}
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
                    Got a quote you're unsure about?
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Upload it and our AI will flag overpriced items, missing scope, and savings
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
                  <a
                    href="/estimate"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition"
                  >
                    <MapPin className="h-4 w-4 text-accent shrink-0" />
                    <span>Local Price Estimator</span>
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
