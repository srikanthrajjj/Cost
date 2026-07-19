import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, Star, MapPin, Clock, DollarSign, TrendingUp } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { PROJECT_CONFIGS, getProjectBySlug } from "@/lib/project-config";

export const Route = createFileRoute("/$projectSlug")({
  component: ProjectLandingPage,
  head: ({ params }) => {
    const project = getProjectBySlug(params.projectSlug);
    if (!project) return { meta: [{ title: "Page Not Found — CostReno" }] };
    return {
      meta: [
        { title: project.seoTitle },
        { name: "description", content: project.seoDescription },
        { property: "og:title", content: project.seoTitle },
        { property: "og:description", content: project.seoDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://costreno.com/${project.slug}` },
        { name: "robots", content: "index, follow" },
      ],
      links: [
        { rel: "canonical", href: `https://costreno.com/${project.slug}` },
      ],
    };
  },
});

function ProjectLandingPage() {
  const { projectSlug } = Route.useParams();
  const project = getProjectBySlug(projectSlug);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-ink">Page Not Found</h1>
          <p className="mt-3 text-muted-foreground">This project page doesn't exist.</p>
          <a href="/" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const relatedProjects = project.relatedProjects
    .map((slug) => PROJECT_CONFIGS.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Header */}
      <SiteNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Inline JSON-LD structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: project.h1,
          description: project.seoDescription,
          author: { "@type": "Organization", name: "CostReno" },
          publisher: { "@type": "Organization", name: "CostReno", logo: { "@type": "ImageObject", url: "https://costreno.com/logo.svg" } },
          datePublished: "2026-07-19",
          dateModified: "2026-07-19",
          mainEntityOfPage: `https://costreno.com/${project.slug}`,
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: project.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: `${project.name} Cost Estimator`,
          description: project.seoDescription,
          provider: { "@type": "Organization", name: "CostReno", url: "https://costreno.com" },
          areaServed: { "@type": "Country", name: "United States" },
          priceRange: project.costRange,
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "1247", bestRating: "5" },
        }) }} />
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <a href="/" className="hover:text-ink transition">Home</a>
          <span>/</span>
          <a href="/estimate" className="hover:text-ink transition">Cost Estimator</a>
          <span>/</span>
          <span className="text-ink font-medium">{project.name}</span>
        </nav>

        {/* Hero - Centered */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl md:text-[42px] font-extrabold text-ink leading-[1.1] tracking-tight">
            {project.h1}
          </h1>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {project.intro}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Updated July 2026 · Based on local pricing data
          </p>
        </div>

        {/* Hero Image */}
        <div className="rounded-2xl overflow-hidden mb-10 aspect-[21/9]">
          <img src={project.image} alt={`${project.name} project in progress — typical residential home improvement work`} className="w-full h-full object-cover" loading="eager" />
        </div>

        {/* Cost Summary Card */}
        <div className="rounded-2xl border border-border bg-white p-6 md:p-8 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <DollarSign className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Average Cost</span>
              </div>
              <div className="font-display text-2xl md:text-3xl font-bold text-ink">{project.avgCost}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Typical Range</span>
              </div>
              <div className="font-display text-lg font-bold text-ink">{project.costRange}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Timeline</span>
              </div>
              <div className="font-display text-lg font-bold text-ink">{project.timeline}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">ROI</span>
              </div>
              <div className="font-display text-lg font-bold text-ink">{project.roi}</div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <a
              href={`/estimate?project=${project.projectType}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition shadow-sm shadow-accent/20"
            >
              Get Your Instant Estimate <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-3 text-xs text-muted-foreground">Free. No signup. Personalized to your ZIP code.</p>
          </div>
        </div>

        {/* Cost Breakdown Table */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-ink mb-5">
            {project.name} Cost Breakdown
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Understanding where your money goes helps you evaluate quotes and negotiate with contractors. Here's how a typical {project.name.toLowerCase()} budget breaks down:
          </p>
          <div className="rounded-xl border border-border bg-white overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Category</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase px-5 py-3">% of Budget</th>
                </tr>
              </thead>
              <tbody>
                {project.costBreakdown.map((row, i) => (
                  <tr key={row.item} className={i < project.costBreakdown.length - 1 ? "border-b border-border/50" : ""}>
                    <td className="px-5 py-3 text-sm text-ink">{row.item}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-ink text-right">{row.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-xs font-semibold text-accent mb-1">Pro Tip</p>
            <p className="text-sm text-muted-foreground">Any contractor quote that doesn't break costs down into at least these categories is a red flag. An itemized quote protects you from hidden charges and makes it possible to compare bids apples-to-apples.</p>
          </div>
        </section>

        {/* How It Works / Process */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-ink mb-5">
            How {project.name} Works: Step by Step
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Knowing the process helps you plan around disruptions, ask better questions, and catch problems early. Here's what to expect from start to finish:
          </p>
          <div className="space-y-4">
            {[
              { step: "1", title: "Initial Assessment", desc: `A licensed contractor inspects your property, takes measurements, and discusses your goals. They should provide a written, itemized estimate within 2-3 days — not a verbal ballpark on the spot.` },
              { step: "2", title: "Material Selection & Permits", desc: `You choose materials based on budget, durability, and aesthetics. Your contractor handles permit applications. This stage takes 1-2 weeks depending on your municipality.` },
              { step: "3", title: "Preparation & Demolition", desc: `The work area is protected and old materials are removed. This is when hidden issues (rot, water damage, structural problems) typically surface — expect a potential change order here.` },
              { step: "4", title: "Installation", desc: `New materials are installed according to manufacturer specifications and local building codes. Quality contractors document their work with photos at each stage.` },
              { step: "5", title: "Inspection & Walkthrough", desc: `A final inspection ensures everything meets code. You walk the completed project with your contractor against the original written scope before releasing final payment.` },
            ].map((s) => (
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

        {/* Red Flags */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-ink mb-5">
            Red Flags in a {project.name} Quote
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            These are the most common ways a contractor quote quietly costs you more than it should. If you spot any of these, ask questions before signing:
          </p>
          <div className="space-y-3">
            {[
              { flag: "No itemized breakdown", desc: "A single lump-sum number makes it impossible to compare quotes or know what you're paying for." },
              { flag: "Large upfront deposit (50%+)", desc: "Reputable contractors ask for 10-30% down, not half the project cost before work begins." },
              { flag: "No mention of permits", desc: "If the quote is silent on permits, ask who's responsible. It should be the contractor." },
              { flag: "Pressure to sign today", desc: "Legitimate professionals don't need you to commit on the spot. Take time to compare." },
              { flag: "Vague material specifications", desc: "\"Standard grade\" or \"builder quality\" means nothing. Demand specific brands and model numbers." },
            ].map((item) => (
              <div key={item.flag} className="flex items-start gap-3 p-4 rounded-xl border border-red-100 bg-red-50/50">
                <span className="text-red-500 text-lg leading-none mt-0.5">⚠</span>
                <div>
                  <p className="text-sm font-bold text-ink">{item.flag}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-xs font-semibold text-accent mb-1">Save Money Tip</p>
            <p className="text-sm text-muted-foreground">Get at least 3 written quotes from licensed, insured contractors. Upload them to our <a href="/quote-analyzer" className="text-accent font-semibold underline">Quote Analyzer</a> to instantly flag missing scope, overpricing, and red flags.</p>
          </div>
        </section>

        {/* Cost Factors */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-ink mb-5">
            What Affects {project.name} Cost?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.costFactors.map((factor) => (
              <div key={factor} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-white">
                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-ink">{factor}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-ink mb-5">
            What Homeowners Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.reviews.map((review) => (
              <div key={review.name} className="flex flex-col rounded-xl border border-border bg-white p-5">
                <div className="flex items-center gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i <= review.rating ? "text-amber-400 fill-amber-400" : "text-muted"}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">"{review.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink">{review.name}</div>
                    <div className="text-[10px] text-muted-foreground">{review.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-ink mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {project.faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-border bg-white overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/20 transition">
                  <h3 className="text-sm font-semibold text-ink">{faq.q}</h3>
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform shrink-0 ml-3" />
                </summary>
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-ink mb-5">
              Related Project Guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProjects.map((rp) => rp && (
                <a
                  key={rp.slug}
                  href={`/${rp.slug}`}
                  className="flex flex-col rounded-xl border border-border bg-white p-5 hover:border-accent/40 hover:shadow-md transition"
                >
                  <h3 className="text-sm font-bold text-ink mb-1">{rp.name}</h3>
                  <p className="text-xs text-muted-foreground flex-1">Average: {rp.avgCost}</p>
                  <span className="mt-3 text-xs font-semibold text-accent inline-flex items-center gap-1">
                    View Guide <ArrowRight className="h-3 w-3" />
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Internal Links */}
        <section className="mb-12 pt-8 border-t border-border">
          <h3 className="font-display text-lg font-bold text-ink mb-4">Explore More</h3>
          <div className="flex flex-wrap gap-2">
            <a href="/quote-analyzer" className="px-4 py-2 rounded-full border border-border bg-white text-sm font-medium text-ink hover:border-accent/40 hover:text-accent transition">
              Quote Review
            </a>
            <a href="/estimate" className="px-4 py-2 rounded-full border border-border bg-white text-sm font-medium text-ink hover:border-accent/40 hover:text-accent transition">
              Cost Estimator
            </a>
            {PROJECT_CONFIGS.filter((p) => p.slug !== project.slug).slice(0, 4).map((p) => (
              <a key={p.slug} href={`/${p.slug}`} className="px-4 py-2 rounded-full border border-border bg-white text-sm font-medium text-ink hover:border-accent/40 hover:text-accent transition">
                {p.name} Cost
              </a>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div className="text-center py-10 rounded-2xl border border-border bg-white">
          <h2 className="font-display text-2xl font-bold text-ink mb-3">
            Ready to Get Your {project.name} Estimate?
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Answer a few questions about your project and get an accurate, location-based cost estimate in under 2 minutes.
          </p>
          <a
            href={`/estimate?project=${project.projectType}`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition shadow-sm shadow-accent/20"
          >
            Get Instant Estimate — Free <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

