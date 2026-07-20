import { MapPin, Receipt, FileStack } from "lucide-react";

interface TrustBarProps {
  region?: string;
}

const cards = [
  {
    icon: MapPin,
    title: "Regional labor cost index",
    body: "Our labor estimates are anchored to BLS metro-level wage data for construction occupations, not a single national average.",
  },
  {
    icon: Receipt,
    title: "Material cost benchmarks",
    body: "Material pricing uses published supplier and industry indices, refreshed periodically to reflect market movement in your region.",
  },
  {
    icon: FileStack,
    title: "Growing from real quotes",
    body: "Every user-shared quote improves our models. More quotes means tighter, more reliable ranges.",
  },
];

export function TrustBar({ region = "your area" }: TrustBarProps) {
  return (
    <section className="bg-white border-b border-border/50">
      <div className="container-x py-12 md:py-16">
        <div className="text-center mb-8">
          <span className="inline-block text-[10px] font-bold text-accent tracking-[0.15em] uppercase mb-3">
            How Our Estimates Work
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink max-w-xl mx-auto leading-tight">
            Regionally adjusted,
            <br /> not a flat national number
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="flex flex-col items-center md:items-start text-center md:text-left rounded-xl border border-border bg-white p-6 h-full"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/8 flex items-center justify-center mb-4 shrink-0">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-sm font-bold text-ink mb-2">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-ink">Want the full breakdown?</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              We document every data source, refresh cadence, and methodology decision.
            </p>
          </div>
          <a
            href="/methodology"
            className="shrink-0 rounded-xl bg-accent px-5 py-2.5 text-xs font-semibold text-white hover:bg-accent/90 transition whitespace-nowrap"
          >
            See our methodology
          </a>
        </div>

        <p className="mt-6 text-center text-[10px] text-muted-foreground/60 max-w-lg mx-auto">
          Estimates are general guidance based on regional data, not a guaranteed quote.
        </p>
      </div>
    </section>
  );
}
