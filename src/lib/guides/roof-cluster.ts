import {
  getAdjustedCostRange,
  getAllCities,
  getAllStateSlugs,
  getCategoryById,
  getCityCategoryUrl,
  isCityPageIndexable,
} from "@/lib/city-data";

export const ROOF_CATEGORY_ID = "roof-replacement";

export const ROOF_TOPIC = { label: "Roof costs", href: "/topics/roof" };

export const ROOF_CLUSTER_RELATED = [
  { title: "Roof replacement cost guide", href: "/guides/roof-replacement" },
  { title: "Cost by roof pitch", href: "/guides/roof-replacement#cost-by-pitch" },
  { title: "Labor vs materials", href: "/guides/roof-replacement#labor-vs-materials" },
  { title: "Roof replacement cost by state", href: "/guides/roof-replacement-cost-by-state" },
  { title: "Roof replacement cost by city", href: "/guides/roof-replacement-cost-by-city" },
  { title: "Metal vs asphalt roof", href: "/guides/metal-vs-asphalt-roof" },
  { title: "Roof replacement timeline", href: "/guides/roof-replacement-timeline" },
  { title: "Roof permits", href: "/guides/roof-permits" },
  { title: "Roof financing", href: "/guides/roof-financing" },
  { title: "Roof insurance claims", href: "/guides/roof-insurance-claims" },
  { title: "Can insurance cover roof replacement?", href: "/guides/can-insurance-cover-roof-replacement" },
  { title: "Roof quote review", href: "/guides/roof-quote-review" },
] as const;

function laborSummary(multiplier: number): string {
  if (multiplier >= 1.1) return "Above average labor";
  if (multiplier <= 0.97) return "Below average labor";
  return "Near national average labor";
}

export function getRoofStateSummaries() {
  const category = getCategoryById(ROOF_CATEGORY_ID);
  if (!category) return [];

  return getAllStateSlugs()
    .map((state) => {
      const cities = getAllCities().filter((c) => c.stateSlug === state.stateSlug);
      const avgMult =
        cities.reduce((sum, c) => sum + c.laborCostMultiplier, 0) / Math.max(cities.length, 1);
      const representative = [...cities].sort((a, b) => b.population - a.population)[0];
      const range = representative
        ? getAdjustedCostRange(category, representative)
        : { label: category.costRange, low: 0, high: 0 };

      return {
        state: state.state,
        stateAbbr: state.stateAbbr,
        stateSlug: state.stateSlug,
        cityCount: cities.length,
        avgLaborMultiplier: avgMult,
        laborSummary: laborSummary(avgMult),
        indicativeRange: range.label,
        locationsHref: `/locations/${state.stateSlug}`,
      };
    })
    .sort((a, b) => a.state.localeCompare(b.state));
}

export function getRoofCityLinks(limit = 32) {
  const category = getCategoryById(ROOF_CATEGORY_ID);
  if (!category) return [];

  return getAllCities()
    .sort((a, b) => b.population - a.population)
    .slice(0, limit)
    .map((city) => ({
      label: `${city.city}, ${city.stateAbbr}`,
      href: getCityCategoryUrl(city, ROOF_CATEGORY_ID),
      range: getAdjustedCostRange(category, city).label,
      reviewed: isCityPageIndexable(city.slug, ROOF_CATEGORY_ID),
    }));
}

export function getReviewedRoofCityLinks() {
  const category = getCategoryById(ROOF_CATEGORY_ID);
  if (!category) return [];

  return getAllCities()
    .filter((city) => isCityPageIndexable(city.slug, ROOF_CATEGORY_ID))
    .sort((a, b) => b.population - a.population)
    .map((city) => ({
      label: `${city.city}, ${city.stateAbbr}`,
      href: getCityCategoryUrl(city, ROOF_CATEGORY_ID),
      range: getAdjustedCostRange(category, city).label,
    }));
}
