import { Sun, Home, DollarSign, Thermometer } from "lucide-react";

interface CityContextBarProps {
  city: string;
  state: string;
  stateAbbr: string;
  laborCostMultiplier: number;
  typicalHomeAge: string;
  climateNotes: string;
  regionalNotes: string;
  categoryName: string;
}

export function CityContextBar({
  city,
  state,
  stateAbbr,
  laborCostMultiplier,
  typicalHomeAge,
  climateNotes,
  regionalNotes,
  categoryName,
}: CityContextBarProps) {
  const multiplierLabel =
    laborCostMultiplier > 1.1
      ? `${Math.round((laborCostMultiplier - 1) * 100)}% above national average`
      : laborCostMultiplier < 0.9
        ? `${Math.round((1 - laborCostMultiplier) * 100)}% below national average`
        : "Near national average";

  return (
    <section className="py-12 border-b border-border/60">
      <div className="container-x">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-ink mb-8">
            {categoryName} in {city}, {state}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-border/60 p-5">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-bold text-sm mb-1">Labor Cost Index</h3>
              <p className="text-2xl font-bold text-ink">{laborCostMultiplier.toFixed(2)}x</p>
              <p className="text-xs text-muted-foreground mt-1">{multiplierLabel}</p>
            </div>

            <div className="bg-white rounded-xl border border-border/60 p-5">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                <Home className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-bold text-sm mb-1">Typical Housing Stock</h3>
              <p className="text-sm text-ink leading-relaxed">{typicalHomeAge}</p>
            </div>

            <div className="bg-white rounded-xl border border-border/60 p-5">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                <Sun className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-bold text-sm mb-1">Climate</h3>
              <p className="text-sm text-ink leading-relaxed">{climateNotes}</p>
            </div>

            <div className="bg-white rounded-xl border border-border/60 p-5">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                <Thermometer className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-bold text-sm mb-1">Regional Context</h3>
              <p className="text-sm text-ink leading-relaxed">{regionalNotes}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
