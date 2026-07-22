interface CityLocalFactorsProps {
  city: string;
  categoryName: string;
  factors: string[];
  lastReviewed: string;
  isEnriched: boolean;
}

export function CityLocalFactors({
  city,
  categoryName,
  factors,
  lastReviewed,
  isEnriched,
}: CityLocalFactorsProps) {
  if (!isEnriched) {
    return (
      <section className="py-10 border-b border-border/60">
        <div className="container-x">
          <div className="max-w-5xl mx-auto rounded-xl border border-border/60 bg-muted/20 px-5 py-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              This {city} {categoryName.toLowerCase()} page uses regional labor and housing context
              as general planning guidance. Locally reviewed pages include market-specific factors
              and are prioritized for search.{" "}
              <a href="/methodology" className="text-primary hover:underline">
                How estimates work
              </a>
              {" · "}
              <a href="/locations" className="text-primary hover:underline">
                Browse reviewed city pages
              </a>
            </p>
            <p className="text-xs text-muted-foreground mt-2">Updated {lastReviewed}</p>
          </div>
        </div>
      </section>
    );
  }

  if (factors.length === 0) return null;

  return (
    <section className="py-12 border-b border-border/60">
      <div className="container-x">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Local factors for {categoryName.toLowerCase()} in {city}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Details that often change scope, materials, or pricing in this market.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Locally reviewed · Updated {lastReviewed}
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {factors.map((factor) => (
              <li
                key={factor}
                className="rounded-xl border border-border/60 bg-white px-4 py-3 text-sm text-ink leading-relaxed"
              >
                {factor}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
