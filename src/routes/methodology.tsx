import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Database, MapPin, TrendingUp, RefreshCw, Shield, Brain } from "lucide-react";

export const Route = createFileRoute("/methodology")({
  component: MethodologyPage,
  head: () => ({
    meta: [
      { title: "Our methodology | CostReno" },
      {
        name: "description",
        content:
          "How CostReno calculates home renovation cost estimates. Learn about our data sources, regional adjustments, and pricing approach.",
      },
      { property: "og:title", content: "Our methodology | CostReno" },
      {
        property: "og:description",
        content:
          "See how CostReno builds renovation cost estimates from regional data and transparent assumptions.",
      },
      { property: "og:url", content: "https://www.costreno.com/methodology" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/methodology" }],
  }),
});

function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="container-x py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="font-display text-3xl md:text-4xl lg:text-[44px] font-bold text-ink mb-4">
              Our methodology
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Transparency matters. Here's how CostReno calculates renovation cost estimates, what
              data we use, and how to interpret the results.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {/* Data Sources */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                  <Database className="h-4.5 w-4.5 text-accent" />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">Data sources</h2>
              </div>
              <div className="pl-12 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  The estimator calculates planning ranges from built-in base costs, project
                  details, and regional multipliers. Public datasets and market references inform
                  the methodology, but the estimator does not make live lookups to every source
                  listed here:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-ink">Bureau of Labor Statistics (BLS)</strong>{" "}
                    <a
                      href="https://www.bls.gov/oes/current/oessrcma.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2 hover:no-underline"
                    >
                      metro-level wage data
                    </a>{" "}
                    for construction occupations, published periodically by the U.S. Department of
                    Labor. This describes BLS publication cadence, not CostReno refresh timing.
                  </li>
                  <li>
                    <strong className="text-ink">Producer Price Index (PPI)</strong>{" "}
                    <a
                      href="https://www.bls.gov/ppi/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2 hover:no-underline"
                    >
                      material price trends
                    </a>{" "}
                    for construction inputs such as lumber, roofing, concrete, and metals.
                  </li>
                  <li>
                    <strong className="text-ink">Census Building Permits Survey</strong>{" "}
                    <a
                      href="https://www.census.gov/construction/bps/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2 hover:no-underline"
                    >
                      residential permit activity
                    </a>{" "}
                    that helps contextualize local construction demand.
                  </li>
                  <li>
                    <strong className="text-ink">Industry cost databases</strong> from construction
                    research organizations that track regional material and labor pricing.
                  </li>
                  <li>
                    <strong className="text-ink">User-submitted contractor quotes</strong> that may
                    be used to help train and improve estimation models, as described in our{" "}
                    <a
                      href="/privacy"
                      className="text-primary underline underline-offset-2 hover:no-underline"
                    >
                      privacy policy
                    </a>
                    .
                  </li>
                  <li>
                    <strong className="text-ink">Permit fee schedules</strong> from local
                    municipalities across the US.
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground/90 pt-1">
                  Outbound links point to primary public sources. CostReno does not claim
                  affiliation with BLS or the U.S. Census Bureau. Estimates remain ranges, not bids.
                </p>
              </div>
            </section>

            {/* Regional Adjustments */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                  <MapPin className="h-4.5 w-4.5 text-accent" />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">Regional adjustments</h2>
              </div>
              <div className="pl-12 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  The ZIP code is used to select a built-in regional multiplier when available. If
                  the ZIP does not resolve to a metro entry, the calculator falls back to a state or
                  national multiplier. It does not make a live lookup of every local cost factor.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-ink">Regional multiplier</strong> selected from built-in
                    metro values when available, with a state or national fallback.
                  </li>
                  <li>
                    <strong className="text-ink">Project-specific rules</strong> apply relevant
                    details you provide, such as size, material selections, and scope.
                  </li>
                  <li>
                    <strong className="text-ink">Local factors outside the calculator</strong> such
                    as site access, local code, permit fees, contractor availability, and market
                    conditions can affect final pricing and should be confirmed with local
                    contractors.
                  </li>
                </ul>
              </div>
            </section>

            {/* Cost calculator and quote analysis */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                  <Brain className="h-4.5 w-4.5 text-accent" />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">
                  Cost calculator and quote analysis
                </h2>
              </div>
              <div className="pl-12 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  The estimator uses project details and rules to calculate planning ranges.
                  AI-assisted analysis is used for contractor quotes and photo detection:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-ink">Cost estimation</strong> applies project-specific
                    rules to the project type, details you provide, and built-in regional
                    multipliers to output a low/mid/high range.
                  </li>
                  <li>
                    <strong className="text-ink">Quote analysis</strong> uses AI-assisted processing
                    to organize contractor bid line items.
                  </li>
                  <li>
                    <strong className="text-ink">Structured checks</strong> compare item details
                    with available market references when a comparison is available and flag items
                    for review. A flag is not independent validation or confirmation of an error.
                  </li>
                  <li>
                    <strong className="text-ink">Detail score</strong> reflects the project
                    information supplied. It is not a measure of historical estimate accuracy or a
                    guarantee of the final price.
                  </li>
                </ul>
              </div>
            </section>

            {/* Source publication and timing */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                  <RefreshCw className="h-4.5 w-4.5 text-accent" />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">
                  Source publication and timing
                </h2>
              </div>
              <div className="pl-12 text-sm text-muted-foreground leading-relaxed">
                <div className="rounded-xl border border-border bg-white overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">
                          Data source
                        </th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">
                          Publication or availability
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="px-5 py-3 text-sm text-ink">BLS labor data</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">
                          Published periodically by BLS; this does not specify CostReno refresh
                          timing
                        </td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="px-5 py-3 text-sm text-ink">Material indices</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">
                          Publication schedules vary by source
                        </td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="px-5 py-3 text-sm text-ink">User-submitted quotes</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">
                          Submitted by users; use is described in our privacy policy
                        </td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="px-5 py-3 text-sm text-ink">Permit fee schedules</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">
                          Schedules vary by municipality
                        </td>
                      </tr>
                      <tr>
                        <td className="px-5 py-3 text-sm text-ink">Regional demand factors</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">
                          Methodology input; refresh timing is not specified
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* What We Don't Do */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                  <Shield className="h-4.5 w-4.5 text-accent" />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">What we don't do</h2>
              </div>
              <div className="pl-12 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>Transparency also means being clear about limitations:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>We do not fabricate pricing data or invent statistics.</li>
                  <li>
                    We do not guarantee any specific price. Estimates are ranges for planning
                    purposes.
                  </li>
                  <li>
                    We do not replace professional contractor quotes for actual purchasing
                    decisions.
                  </li>
                  <li>
                    We clearly label when data is limited for a specific project type or location.
                  </li>
                  <li>
                    Third-party AI providers process photos and documents to provide requested
                    analyses. Submitted information may also be used to help train and improve
                    estimation models. We do not sell personal information to marketing companies.
                    See our{" "}
                    <a
                      href="/privacy"
                      className="text-primary underline underline-offset-2 hover:no-underline"
                    >
                      privacy policy
                    </a>{" "}
                    for details about data use, retention, and sharing.
                  </li>
                </ul>
              </div>
            </section>

            {/* Estimate detail */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-4.5 w-4.5 text-accent" />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">
                  Understanding estimate detail
                </h2>
              </div>
              <div className="pl-12 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Estimates are planning ranges, not contractor bids. The detail score increases as
                  project information is supplied, but it does not measure historical accuracy or
                  the likelihood that final costs will fall within the range.
                </p>
                <p>
                  Final pricing depends on site conditions, access, material choices, local
                  requirements, and contractor scope. Review bids from qualified contractors before
                  making a purchasing decision.
                </p>
                <p>
                  If you have a question about an estimate or our data approach, please contact us.
                </p>
              </div>
            </section>
          </div>

          {/* Bottom note */}
          <div className="mt-14 pt-8 border-t border-border text-center">
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Last updated: July 2026. This page reflects our current methodology and will be
              updated as our data sources and estimation rules change.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
