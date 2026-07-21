import { Calculator, FileSearch, Shield, ArrowRight } from "lucide-react";

interface CityToolGridProps {
  city: string;
  state: string;
  categoryName: string;
  categoryId: string;
}

export function CityToolGrid({ city, state, categoryName, categoryId }: CityToolGridProps) {
  const tools = [
    {
      icon: Calculator,
      title: `${categoryName} cost estimator`,
      description: `Get an instant AI-powered estimate for ${categoryName.toLowerCase()} in ${city}, ${state} based on your home details and regional pricing data.`,
      href: `/estimate?project=${categoryId}`,
      cta: "Calculate Cost",
    },
    {
      icon: FileSearch,
      title: "Quote Analyzer",
      description: `Upload a contractor quote for ${categoryName.toLowerCase()} and our AI will compare it against regional benchmarks for ${city}.`,
      href: "/quote-analyzer",
      cta: "Analyze Quote",
    },
    {
      icon: Shield,
      title: `Guide: ${categoryName}`,
      description: `Learn what to look for when hiring a contractor in ${city}, including permit requirements, material choices, and typical timelines.`,
      href: `/guides/${categoryId}`,
      cta: "Read Guide",
    },
  ];

  return (
    <section className="py-16">
      <div className="container-x">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-4 text-center">
            Tools for your {categoryName} project in {city}
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Everything you need to estimate, compare, and plan your project with confidence.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.title}
                className="bg-white rounded-xl border border-border/60 p-6 hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <tool.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">{tool.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-grow">{tool.description}</p>
                <a
                  href={tool.href}
                  className="inline-flex items-center text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
                >
                  {tool.cta}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
