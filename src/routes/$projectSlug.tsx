import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, Star, MapPin, Clock, DollarSign, TrendingUp } from "lucide-react";
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
        { name: "keywords", content: `${project.name} cost, ${project.name} cost 2026, how much does ${project.name.toLowerCase()} cost, ${project.name.toLowerCase()} estimate, ${project.name.toLowerCase()} price` },
        { property: "og:title", content: project.seoTitle },
        { property: "og:description", content: project.seoDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://costreno.com/${project.slug}` },
        { name: "robots", content: "index, follow" },
      ],
      links: [
        { rel: "canonical", href: `https://costreno.com/${project.slug}` },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: project.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${project.name} Cost Estimator`,
            description: project.seoDescription,
            provider: { "@type": "Organization", name: "CostReno", url: "https://costreno.com" },
            areaServed: { "@type": "Country", name: "United States" },
            priceRange: project.costRange,
            aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "1247", bestRating: "5" },
          }),
        },
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
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
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
                  {["Roofing", "Kitchen", "Bathroom", "HVAC", "Windows", "Flooring", "Solar", "Foundation"].map((item) => (
                    <a key={item} href="#" className="block px-3 py-2 text-sm font-medium text-ink hover:bg-muted/50 rounded-lg transition-colors">
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <a href="#" className="hover:text-foreground transition-colors whitespace-nowrap">Renovation Tools</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#" className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-sm hover:bg-accent/90 transition">Start Free</a>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Breadcrumb */}
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
          <img src={project.image} alt={project.name} className="w-full h-full object-cover" loading="eager" />
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
