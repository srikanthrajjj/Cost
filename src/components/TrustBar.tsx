import { MapPin, Receipt, FileStack, TrendingUp, X, Database, RefreshCw, Shield, Brain } from "lucide-react";
import { useState } from "react";

interface TrustBarProps {
  region?: string;
}

const TRUST_CARDS = [
  {
    icon: MapPin,
    title: "Regional labor cost index",
    body: "Our labor estimates are anchored to BLS metro-level wage data for construction occupations, not a single national average.",
    badge: "Updated monthly",
  },
  {
    icon: Receipt,
    title: "Material cost benchmarks",
    body: "Material pricing uses published supplier and industry indices, refreshed periodically to reflect market movement in your region.",
    badge: "Updated regularly",
  },
  {
    icon: FileStack,
    title: "Growing from real quotes",
    body: "Every user-shared quote improves our models. More quotes means tighter, more reliable ranges.",
    badge: "Continuously learning",
  },
  {
    icon: TrendingUp,
    title: "Local market factors",
    body: "We factor in regional demand, permitting costs, seasonality, and project complexity to personalize every estimate.",
    badge: "Regionally adjusted",
  },
] as const;

export function TrustBar({ region = "your area" }: TrustBarProps) {
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <section className="bg-white border-b border-border/50 overflow-hidden">
      <div className="container-x py-14 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-[44px] font-bold text-ink max-w-2xl mx-auto leading-[1.15]">
            Regionally adjusted,<br />
            <span className="underline decoration-accent/60 decoration-[3px] underline-offset-[6px]">not</span> a flat national number
          </h2>
          <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            We combine trusted data sources and real market insights to deliver accurate, up-to-date estimates for {region}.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <style>{`
            @keyframes flowDash {
              0% { stroke-dashoffset: 16; }
              100% { stroke-dashoffset: 0; }
            }
            .trust-dash {
              stroke-dasharray: 6 4;
              animation: flowDash 1.2s linear infinite;
            }
          `}</style>

          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block"
            viewBox="0 0 1000 400"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <path d="M 230 100 C 320 100, 380 180, 440 195" stroke="rgba(3,164,77,0.3)" strokeWidth="2" fill="none" className="trust-dash" />
            <path d="M 230 300 C 320 300, 380 220, 440 205" stroke="rgba(3,164,77,0.3)" strokeWidth="2" fill="none" className="trust-dash" style={{ animationDelay: "0.3s" }} />
            <path d="M 770 100 C 680 100, 620 180, 560 195" stroke="rgba(3,164,77,0.3)" strokeWidth="2" fill="none" className="trust-dash" style={{ animationDelay: "0.5s" }} />
            <path d="M 770 300 C 680 300, 620 220, 560 205" stroke="rgba(3,164,77,0.3)" strokeWidth="2" fill="none" className="trust-dash" style={{ animationDelay: "0.7s" }} />
            <circle cx="230" cy="100" r="4" fill="rgba(3,164,77,0.5)" />
            <circle cx="230" cy="300" r="4" fill="rgba(3,164,77,0.5)" />
            <circle cx="770" cy="100" r="4" fill="rgba(3,164,77,0.5)" />
            <circle cx="770" cy="300" r="4" fill="rgba(3,164,77,0.5)" />
          </svg>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_180px_1fr] lg:grid-rows-2 gap-4 lg:gap-6 items-center">
            <div className="lg:col-start-1 lg:row-start-1">
              <TrustCard {...TRUST_CARDS[0]} />
            </div>
            <div className="lg:col-start-1 lg:row-start-2">
              <TrustCard {...TRUST_CARDS[1]} />
            </div>

            <div className="hidden lg:flex lg:col-start-2 lg:row-start-1 lg:row-span-2 flex-col items-center justify-center py-8">
              <div className="w-[120px] h-[120px] rounded-full border border-black/50 bg-white flex flex-col items-center justify-center">
                <svg className="w-10 h-10 text-[#082A4B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9.5 2a3.5 3.5 0 0 0-3.4 4.4A3.5 3.5 0 0 0 4 10a3.5 3.5 0 0 0 1.8 3.1A3.5 3.5 0 0 0 8 17h1v4h6v-4h1a3.5 3.5 0 0 0 2.2-3.9A3.5 3.5 0 0 0 20 10a3.5 3.5 0 0 0-2.1-3.6A3.5 3.5 0 0 0 14.5 2a3.5 3.5 0 0 0-2.5 1 3.5 3.5 0 0 0-2.5-1z" />
                  <path d="M12 2v8" />
                  <path d="M8 10h8" />
                </svg>
              </div>
              <span className="mt-3 text-[10px] font-bold text-ink uppercase tracking-wider text-center leading-tight">
                AI Pricing<br />Engine
              </span>
              <span className="mt-1.5 text-[11px] text-muted-foreground font-medium italic">Analyzes & learns</span>
            </div>

            <div className="lg:col-start-3 lg:row-start-1">
              <TrustCard {...TRUST_CARDS[2]} />
            </div>
            <div className="lg:col-start-3 lg:row-start-2">
              <TrustCard {...TRUST_CARDS[3]} />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-6 py-5 max-w-3xl mx-auto">
          <div>
            <p className="text-sm font-semibold text-ink">Want the full breakdown?</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              We document every data source, refresh cadence, and methodology decision.
            </p>
          </div>
          <button
            onClick={() => setShowMethodology(true)}
            className="shrink-0 rounded-lg bg-accent px-5 py-2.5 text-xs font-semibold text-white hover:bg-accent/90 transition whitespace-nowrap cursor-pointer"
          >
            See our methodology
          </button>
        </div>
      </div>

      {showMethodology && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowMethodology(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="font-display text-lg font-bold text-ink">Our methodology</h2>
              <button
                onClick={() => setShowMethodology(false)}
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-8">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Transparency matters. Here's exactly how CostReno calculates renovation cost estimates, what data we use, and how we keep it accurate.
              </p>

              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <Database className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-bold text-ink">Data sources</h3>
                </div>
                <ul className="text-xs text-muted-foreground leading-relaxed space-y-2 pl-6 list-disc">
                  <li><strong className="text-ink">Bureau of Labor Statistics (BLS)</strong> metro-level wage data for construction occupations, updated monthly.</li>
                  <li><strong className="text-ink">Published supplier indices</strong> for materials like lumber, roofing, concrete, copper, and other commodities.</li>
                  <li><strong className="text-ink">Industry cost databases</strong> from construction research organizations that track regional pricing.</li>
                  <li><strong className="text-ink">User-submitted contractor quotes</strong> that help validate and refine pricing in specific markets.</li>
                  <li><strong className="text-ink">Permit fee schedules</strong> from local municipalities across the US.</li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <MapPin className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-bold text-ink">Regional adjustments</h3>
                </div>
                <ul className="text-xs text-muted-foreground leading-relaxed space-y-2 pl-6 list-disc">
                  <li><strong className="text-ink">Labor cost index</strong> based on local construction wages relative to the national median.</li>
                  <li><strong className="text-ink">Material availability</strong> and regional supplier pricing differences.</li>
                  <li><strong className="text-ink">Permit and code requirements</strong> that vary by state and municipality.</li>
                  <li><strong className="text-ink">Seasonal demand</strong> patterns affecting contractor availability and pricing.</li>
                  <li><strong className="text-ink">Market competitiveness</strong> since areas with more contractors tend to have better pricing.</li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <Brain className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-bold text-ink">AI pricing engine</h3>
                </div>
                <ul className="text-xs text-muted-foreground leading-relaxed space-y-2 pl-6 list-disc">
                  <li><strong className="text-ink">Cost estimation</strong> uses weighted models factoring property size, materials, complexity, and regional pricing.</li>
                  <li><strong className="text-ink">Quote analysis</strong> reads contractor bids line-by-line, benchmarks against market rates, and flags anomalies.</li>
                  <li><strong className="text-ink">Continuous learning</strong> from every quote uploaded improves accuracy over time.</li>
                  <li><strong className="text-ink">Confidence scoring</strong> communicates reliability based on data density for that project type and location.</li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <RefreshCw className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-bold text-ink">Refresh cadence</h3>
                </div>
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase px-4 py-2">Source</th>
                        <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase px-4 py-2">Frequency</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      <tr className="border-b border-border/50"><td className="px-4 py-2 text-ink">BLS labor data</td><td className="px-4 py-2 text-muted-foreground">Monthly</td></tr>
                      <tr className="border-b border-border/50"><td className="px-4 py-2 text-ink">Material indices</td><td className="px-4 py-2 text-muted-foreground">Weekly to monthly</td></tr>
                      <tr className="border-b border-border/50"><td className="px-4 py-2 text-ink">User-submitted quotes</td><td className="px-4 py-2 text-muted-foreground">Continuous</td></tr>
                      <tr className="border-b border-border/50"><td className="px-4 py-2 text-ink">Permit fee schedules</td><td className="px-4 py-2 text-muted-foreground">Quarterly</td></tr>
                      <tr><td className="px-4 py-2 text-ink">Regional demand factors</td><td className="px-4 py-2 text-muted-foreground">Monthly</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <Shield className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-bold text-ink">What we don't do</h3>
                </div>
                <ul className="text-xs text-muted-foreground leading-relaxed space-y-2 pl-6 list-disc">
                  <li>We do not fabricate pricing data or invent statistics.</li>
                  <li>We do not guarantee any specific price. Estimates are ranges for planning.</li>
                  <li>We do not replace professional contractor quotes for purchasing decisions.</li>
                  <li>We clearly label when data is limited for a specific project type or location.</li>
                  <li>We never sell user data or share uploaded quotes with third parties.</li>
                </ul>
              </div>

              <p className="text-[10px] text-muted-foreground/60 text-center pt-4 border-t border-border">
                Last updated: July 2026. This reflects our current methodology and will be updated as our models evolve.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function TrustCard({
  icon: Icon,
  title,
  body,
  badge,
}: {
  icon: typeof MapPin;
  title: string;
  body: string;
  badge: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 hover:shadow-md transition-shadow duration-200 h-full">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-lg bg-accent/8 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-bold text-ink mb-1">{title}</h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{body}</p>
          <div className="mt-2.5 flex items-center gap-1.5">
            <svg className="w-3 h-3 text-accent shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="2 6 5 9 10 3" />
            </svg>
            <span className="text-[10px] font-semibold text-accent">{badge}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
