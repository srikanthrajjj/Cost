import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getAllCategories,
  getAllCities,
  getAllStateSlugs,
  getCityCategoryUrl,
  isCityPageIndexable,
} from "@/lib/city-data";

export const Route = createFileRoute("/locations/")({
  component: LocationsIndexPage,
  head: () => ({
    meta: [
      {
        title: "Home renovation costs by city | CostReno",
      },
      {
        name: "description",
        content:
          "Browse local roof, kitchen, bathroom, HVAC, window, and flooring cost pages for major U.S. cities. Locally reviewed pages are prioritized for search.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Home renovation costs by city | CostReno" },
      {
        property: "og:description",
        content:
          "Browse local renovation cost pages across major U.S. cities for roof, kitchen, bathroom, HVAC, windows, and flooring.",
      },
      { property: "og:url", content: "https://costreno.com/locations" },
      {
        property: "og:image",
        content: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      },
    ],
    links: [{ rel: "canonical", href: "https://costreno.com/locations" }],
  }),
});

function LocationsIndexPage() {
  const states = getAllStateSlugs();
  const cities = getAllCities().sort((a, b) => a.city.localeCompare(b.city));
  const categories = getAllCategories();
  const featured = cities.slice(0, 12);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="locations" />
      <main>
        <section className="py-16 md:py-20 border-b border-border/60">
          <div className="container-x max-w-4xl">
            <p className="text-sm text-muted-foreground mb-3 inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Local renovation cost guides
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-ink mb-4">
              Home renovation costs by city
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore local cost pages for roof, kitchen, bathroom, HVAC, windows, and flooring
              across {cities.length} U.S. cities. Locally reviewed pages include market-specific
              factors and appear in our sitemap. Other pages stay available for planning with
              general regional guidance.
            </p>
          </div>
        </section>

        <section className="py-14">
          <div className="container-x max-w-5xl">
            <h2 className="font-display text-2xl font-bold text-ink mb-6">Browse by state</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {states.map((state) => (
                <a
                  key={state.stateSlug}
                  href={`/locations/${state.stateSlug}`}
                  className="rounded-xl border border-border/60 bg-white px-4 py-3 text-sm font-medium text-ink hover:border-primary/30 hover:shadow-sm transition"
                >
                  {state.state}
                  <span className="text-muted-foreground font-normal"> ({state.stateAbbr})</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 bg-muted/20 border-y border-border/60">
          <div className="container-x max-w-5xl">
            <h2 className="font-display text-2xl font-bold text-ink mb-6">Popular city pages</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {featured.map((city) => (
                <div
                  key={`${city.stateSlug}-${city.slug}`}
                  className="rounded-xl border border-border/60 bg-white p-5"
                >
                  <h3 className="font-semibold text-ink mb-3">
                    {city.city}, {city.stateAbbr}
                  </h3>
                  <ul className="space-y-1.5">
                    {categories.map((category) => {
                      const reviewed = isCityPageIndexable(city.slug, category.id);
                      return (
                        <li key={category.id}>
                          <a
                            href={getCityCategoryUrl(city, category.id)}
                            className="text-sm text-primary hover:underline inline-flex items-center gap-2"
                          >
                            {category.name} cost
                            {reviewed && (
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Reviewed
                              </span>
                            )}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Looking for another city? Open a state page above to see every city currently
              covered.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
