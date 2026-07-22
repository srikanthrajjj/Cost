interface CityCostSnapshotProps {
  city: string;
  stateAbbr: string;
  categoryName: string;
  costRangeLabel: string;
  laborMultiplier: number;
  timeframe: string;
  roi: string;
  medianHomeValue: number;
}

export function CityCostSnapshot({
  city,
  stateAbbr,
  categoryName,
  costRangeLabel,
  laborMultiplier,
  timeframe,
  roi,
  medianHomeValue,
}: CityCostSnapshotProps) {
  return (
    <section className="py-12 bg-muted/20 border-y border-border/60">
      <div className="container-x">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-ink mb-2 text-center">
            Typical {categoryName.toLowerCase()} range in {city}
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Local planning range adjusted for {city}, {stateAbbr} labor costs. Final quotes vary by
            scope, materials, and contractor.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border/60 bg-white p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Local cost range
              </p>
              <p className="text-lg font-bold text-ink">{costRangeLabel}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-white p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Labor index
              </p>
              <p className="text-lg font-bold text-ink">{laborMultiplier.toFixed(2)}x</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-white p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Typical timeline
              </p>
              <p className="text-lg font-bold text-ink">{timeframe}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-white p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Median home value
              </p>
              <p className="text-lg font-bold text-ink">
                ${medianHomeValue.toLocaleString("en-US")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">ROI context: {roi}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
