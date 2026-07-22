import { ArrowRight, MapPin } from "lucide-react";

interface CityHeroProps {
  categoryName: string;
  city: string;
  state: string;
  introParagraph: string;
}

export function CityHero({ categoryName, city, state, introParagraph }: CityHeroProps) {
  return (
    <section className="bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
      <div className="container-x">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 text-accent" />
            <span>
              {city}, {state}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-ink mb-6">
            {categoryName} cost in {city}, {state}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
            {introParagraph}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/estimate"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-4 text-base font-semibold text-accent-foreground shadow-sm hover:bg-accent/90 transition-all duration-200"
            >
              Calculate my estimate
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="/quote-analyzer"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-8 py-4 text-base font-semibold text-foreground hover:bg-muted transition"
            >
              Analyze a quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
