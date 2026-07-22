import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getAllCategories,
  getAllStateSlugs,
  getCitiesByStateSlug,
  getCityCategoryUrl,
  isCityPageIndexable,
} from "@/lib/city-data";

export const Route = createFileRoute("/locations/$state")({
  component: StateLocationsPage,
  head: ({ params }) => {
    const stateMeta = getAllStateSlugs().find((s) => s.stateSlug === params.state);
    if (!stateMeta) return { meta: [{ title: "Page not found | CostReno" }] };
    const title = `Home renovation costs in ${stateMeta.state} | CostReno`;
    const description = `Local roof, kitchen, bathroom, HVAC, window, and flooring cost pages for cities in ${stateMeta.state}. Locally reviewed pages are prioritized for search.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `https://costreno.com/locations/${params.state}` },
      ],
      links: [{ rel: "canonical", href: `https://costreno.com/locations/${params.state}` }],
    };
  },
});

function StateLocationsPage() {
  const { state: stateSlug } = Route.useParams();
  const stateMeta = getAllStateSlugs().find((s) => s.stateSlug === stateSlug);
  const cities = getCitiesByStateSlug(stateSlug);
  const categories = getAllCategories();

  if (!stateMeta || cities.length === 0) {
    throw notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <section className="py-16 md:py-20 border-b border-border/60">
          <div className="container-x max-w-4xl">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <li>
                  <a href="/" className="hover:text-primary">
                    Home
                  </a>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <a href="/locations" className="hover:text-primary">
                    Locations
                  </a>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-ink">{stateMeta.state}</li>
              </ol>
            </nav>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-ink mb-4">
              Renovation costs in {stateMeta.state}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              City-level cost guides for {cities.length} location
              {cities.length === 1 ? "" : "s"} in {stateMeta.state}, covering roof, kitchen,
              bathroom, HVAC, windows, and flooring. Locally reviewed pages include market-specific
              factors.
            </p>
          </div>
        </section>

        <section className="py-14">
          <div className="container-x max-w-5xl space-y-6">
            {cities.map((city) => (
              <article
                key={city.slug}
                className="rounded-xl border border-border/60 bg-white p-6"
              >
                <h2 className="font-display text-xl font-bold text-ink mb-2">
                  {city.city}, {city.stateAbbr}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {city.regionalNotes}
                </p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {categories.map((category) => {
                    const reviewed = isCityPageIndexable(city.slug, category.id);
                    return (
                      <li key={category.id}>
                        <a
                          href={getCityCategoryUrl(city, category.id)}
                          className="text-sm text-primary hover:underline inline-flex items-center gap-2"
                        >
                          {category.name} cost in {city.city}
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
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
