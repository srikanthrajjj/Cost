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
        { property: "og:url", content: `https://www.costreno.com/locations/${params.state}` },
      ],
      links: [{ rel: "canonical", href: `https://www.costreno.com/locations/${params.state}` }],
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
              factors such as labor rates, climate, and typical housing stock.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Use these pages to set a planning range before you request contractor quotes. Costs
              vary by city within {stateMeta.state}, so a metro with higher labor demand can price
              differently from a nearby market even for the same project type.
            </p>
          </div>
        </section>

        <section className="py-14 border-b border-border/60">
          <div className="container-x max-w-5xl">
            <h2 className="font-display text-2xl font-bold text-ink mb-3">
              How to use {stateMeta.state} cost pages
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
              Start with the city closest to your property, then open the project type you are
              planning. Reviewed pages are hand-checked for local context. Other pages stay live for
              navigation and planning, and may show a broader range until they are enriched.
            </p>
            <ul className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <li className="rounded-xl border border-border bg-white p-5 leading-relaxed">
                Compare roof, kitchen, bathroom, HVAC, window, and flooring ranges for the same city
                so you can sequence projects against one budget.
              </li>
              <li className="rounded-xl border border-border bg-white p-5 leading-relaxed">
                After you have bids, run them through CostReno quote tools to check line items
                against local market context before you sign.
              </li>
            </ul>
          </div>
        </section>

        <section className="py-14">
          <div className="container-x max-w-5xl space-y-6">
            <h2 className="font-display text-2xl font-bold text-ink">
              Cities in {stateMeta.state}
            </h2>
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
