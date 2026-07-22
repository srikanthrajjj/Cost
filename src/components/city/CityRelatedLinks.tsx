import { getCityCategoryUrl, type Category, type City } from "@/lib/city-data";

interface CityRelatedLinksProps {
  city: City;
  category: Category;
  relatedCities: City[];
  relatedCategories: Category[];
}

export function CityRelatedLinks({
  city,
  category,
  relatedCities,
  relatedCategories,
}: CityRelatedLinksProps) {
  return (
    <section className="py-16 border-t border-border/60">
      <div className="container-x">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-xl font-bold text-ink mb-4">
              More projects in {city.city}
            </h2>
            <ul className="space-y-2">
              {relatedCategories.map((item) => (
                <li key={item.id}>
                  <a
                    href={getCityCategoryUrl(city, item.id)}
                    className="text-sm text-primary hover:underline"
                  >
                    {item.name} cost in {city.city}, {city.stateAbbr}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={category.guidePath}
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  National guide: {category.name.toLowerCase()}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-ink mb-4">
              Nearby and similar cities
            </h2>
            <ul className="space-y-2">
              {relatedCities.map((item) => (
                <li key={`${item.stateSlug}-${item.slug}`}>
                  <a
                    href={getCityCategoryUrl(item, category.id)}
                    className="text-sm text-primary hover:underline"
                  >
                    {category.name} cost in {item.city}, {item.stateAbbr}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`/locations/${city.stateSlug}`}
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  All cities in {city.state}
                </a>
              </li>
              <li>
                <a
                  href="/locations"
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  Browse all city cost pages
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
