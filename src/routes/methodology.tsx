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
              Transparency matters. Here's exactly how CostReno calculates renovation cost
              estimates, what data we use, and how we keep it accurate.
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
                  CostReno estimates are built from multiple data layers, not a single national
                  average. Our primary sources include:
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
                    Labor.
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
                    <strong className="text-ink">User-submitted contractor quotes</strong> that help
                    us validate and refine pricing in specific markets.
                  </li>
                  <li>
                    <strong className="text-ink">Permit fee schedules</strong> from local
                    municipalities across the US.
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground/90 pt-1">
                  Outbound links point to primary public sources. CostReno does not claim affiliation
                  with BLS or the U.S. Census Bureau. Estimates remain ranges, not bids.
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
                  Every estimate is adjusted to your specific location using your ZIP code. We
                  account for:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-ink">Labor cost index</strong> based on local
                    construction wages relative to the national median.
                  </li>
                  <li>
                    <strong className="text-ink">Material availability</strong> and regional
                    supplier pricing differences.
                  </li>
                  <li>
                    <strong className="text-ink">Permit and code requirements</strong> that vary by
                    state and municipality (e.g., hurricane codes in Florida, seismic in California).
                  </li>
                  <li>
                    <strong className="text-ink">Seasonal demand</strong> patterns that affect
                    contractor availability and pricing.
                  </li>
                  <li>
                    <strong className="text-ink">Market competitiveness</strong> since areas with
                    more contractors tend to have more competitive pricing.
                  </li>
                </ul>
              </div>
            </section>

            {/* AI Pricing Engine */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                  <Brain className="h-4.5 w-4.5 text-accent" />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">AI pricing engine</h2>
              </div>
              <div className="pl-12 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Our AI engine combines all data sources to produce estimates and power the quote
                  analyzer:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-ink">Cost estimation</strong> uses weighted models that
                    factor property size, material selections, project complexity, and regional
                    pricing to output a low/mid/high range.
                  </li>
                  <li>
                    <strong className="text-ink">Quote analysis</strong> reads contractor bids
                    line-by-line, categorizes items, benchmarks each against market rates, and flags
                    anomalies.
                  </li>
                  <li>
                    <strong className="text-ink">Continuous learning</strong> from every quote
                    uploaded. More data points mean tighter ranges and better anomaly detection.
                  </li>
                  <li>
                    <strong className="text-ink">Confidence scoring</strong> communicates how
                    reliable a given estimate is based on data density for that project type and
                    location.
                  </li>
                </ul>
              </div>
            </section>

            {/* Refresh Cadence */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                  <RefreshCw className="h-4.5 w-4.5 text-accent" />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">Refresh cadence</h2>
              </div>
              <div className="pl-12 text-sm text-muted-foreground leading-relaxed">
                <div className="rounded-xl border border-border bg-white overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Data source</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase px-5 py-3">Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="px-5 py-3 text-sm text-ink">BLS labor data</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">Monthly</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="px-5 py-3 text-sm text-ink">Material indices</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">Weekly to monthly</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="px-5 py-3 text-sm text-ink">User-submitted quotes</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">Continuous</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="px-5 py-3 text-sm text-ink">Permit fee schedules</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">Quarterly</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-3 text-sm text-ink">Regional demand factors</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">Monthly</td>
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
                  <li>We do not guarantee any specific price. Estimates are ranges for planning purposes.</li>
                  <li>We do not replace professional contractor quotes for actual purchasing decisions.</li>
                  <li>We clearly label when data is limited for a specific project type or location.</li>
                  <li>We never sell user data or share uploaded quotes with third parties.</li>
                </ul>
              </div>
            </section>

            {/* Accuracy Commitment */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-4.5 w-4.5 text-accent" />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">Accuracy commitment</h2>
              </div>
              <div className="pl-12 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  We measure ourselves against real-world outcomes. Our goal is for the majority of
                  actual project costs to fall within our estimated ranges when users provide
                  accurate project details.
                </p>
                <p>
                  When costs fall outside our ranges, we analyze why and update our models. Every
                  user-submitted quote makes the system smarter for the next homeowner.
                </p>
                <p>
                  If you believe an estimate was significantly off, we'd appreciate hearing about it.
                  Your feedback directly improves accuracy for everyone.
                </p>
              </div>
            </section>
          </div>

          {/* Bottom note */}
          <div className="mt-14 pt-8 border-t border-border text-center">
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Last updated: July 2026. This page reflects our current methodology and will be
              updated as our data sources and models evolve.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
