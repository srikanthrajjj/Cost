import citiesData from "@/data/cities.json";
import categoriesData from "@/data/categories.json";

export interface City {
  city: string;
  state: string;
  stateAbbr: string;
  slug: string;
  stateSlug: string;
  zipPrefix: string;
  laborCostMultiplier: number;
  typicalHomeAge: string;
  climateNotes: string;
  regionalNotes: string;
  nearestPermitOffice: string;
  population: number;
  medianHomeValue: number;
  introParagraphs: Record<string, string>;
}

export interface CategoryFaq {
  question: string;
  answer: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  avgCost: string;
  costRange: string;
  timeframe: string;
  roi: string;
  estimateProjectType: string;
  guidePath: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  introTemplate: string;
  faq: CategoryFaq[];
  methodologyNote: string;
}

export interface CityCategoryPage {
  city: City;
  category: Category;
  url: string;
  title: string;
  description: string;
  intro: string;
  costRange: { low: number; high: number; label: string };
  faq: CategoryFaq[];
  methodologyNote: string;
}

const SITE_ORIGIN = "https://costreno.com";

function parseMoneyRange(range: string): { low: number; high: number } | null {
  const matches = range.match(/\$[\d,]+/g);
  if (!matches || matches.length < 2) return null;
  const low = Number(matches[0].replace(/[$,]/g, ""));
  const high = Number(matches[1].replace(/[$,]/g, ""));
  if (!Number.isFinite(low) || !Number.isFinite(high)) return null;
  return { low, high };
}

function formatMoney(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function laborLabel(multiplier: number): string {
  if (multiplier >= 1.15) {
    return `${Math.round((multiplier - 1) * 100)}% above the national average`;
  }
  if (multiplier <= 0.95) {
    return `${Math.round((1 - multiplier) * 100)}% below the national average`;
  }
  return "near the national average";
}

function climateShort(notes: string): string {
  const first = notes.split(/[.!?]/)[0]?.trim();
  return first ? first.toLowerCase() : "local climate conditions";
}

export function getCityBySlug(slug: string): City | undefined {
  return (citiesData as City[]).find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return (categoriesData as Category[]).find((c) => c.id === id);
}

export function getAllCities(): City[] {
  return citiesData as City[];
}

export function getAllCategories(): Category[] {
  return categoriesData as Category[];
}

export function getCitiesByStateSlug(stateSlug: string): City[] {
  return getAllCities()
    .filter((c) => c.stateSlug === stateSlug)
    .sort((a, b) => a.city.localeCompare(b.city));
}

export function getAllStateSlugs(): { stateSlug: string; state: string; stateAbbr: string }[] {
  const map = new Map<string, { stateSlug: string; state: string; stateAbbr: string }>();
  for (const city of getAllCities()) {
    if (!map.has(city.stateSlug)) {
      map.set(city.stateSlug, {
        stateSlug: city.stateSlug,
        state: city.state,
        stateAbbr: city.stateAbbr,
      });
    }
  }
  return [...map.values()].sort((a, b) => a.state.localeCompare(b.state));
}

export function getCityCategoryUrl(city: City, categoryId: string): string {
  return `/${city.stateSlug}/${city.slug}/${categoryId}`;
}

export function getAbsoluteCityCategoryUrl(city: City, categoryId: string): string {
  return `${SITE_ORIGIN}${getCityCategoryUrl(city, categoryId)}`;
}

export function getAdjustedCostRange(
  category: Category,
  city: City,
): { low: number; high: number; label: string } {
  const parsed = parseMoneyRange(category.costRange);
  if (!parsed) {
    return { low: 0, high: 0, label: category.costRange };
  }
  const low = parsed.low * city.laborCostMultiplier;
  const high = parsed.high * city.laborCostMultiplier;
  return {
    low,
    high,
    label: `${formatMoney(low)} - ${formatMoney(high)}`,
  };
}

export function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

export function buildTemplateValues(city: City, category: Category): Record<string, string> {
  const costs = getAdjustedCostRange(category, city);
  return {
    city: city.city,
    state: city.state,
    stateAbbr: city.stateAbbr,
    laborMultiplier: city.laborCostMultiplier.toFixed(2),
    laborLabel: laborLabel(city.laborCostMultiplier),
    homeAgeShort: city.typicalHomeAge.replace(/\.$/, "").toLowerCase(),
    climateShort: climateShort(city.climateNotes),
    climateNotes: city.climateNotes,
    regionalShort: city.regionalNotes.replace(/\.$/, ""),
    regionalNotes: city.regionalNotes,
    permitOffice: city.nearestPermitOffice,
    costLow: formatMoney(costs.low),
    costHigh: formatMoney(costs.high),
    costRange: costs.label,
    categoryName: category.name,
    avgCost: category.avgCost,
    timeframe: category.timeframe,
    roi: category.roi,
  };
}

export function getCityIntro(city: City, category: Category): string {
  const stored = city.introParagraphs?.[category.id];
  if (stored?.trim()) return stored;
  const values = buildTemplateValues(city, category);
  return fillTemplate(category.introTemplate, values);
}

export function getCityFaqs(city: City, category: Category): CategoryFaq[] {
  const values = buildTemplateValues(city, category);
  return category.faq.map((item) => ({
    question: fillTemplate(item.question, values),
    answer: fillTemplate(item.answer, values),
  }));
}

export function getCityPage(citySlug: string, categoryId: string): CityCategoryPage | null {
  const city = getCityBySlug(citySlug);
  const category = getCategoryById(categoryId);
  if (!city || !category) return null;

  const values = buildTemplateValues(city, category);
  return {
    city,
    category,
    url: getCityCategoryUrl(city, category.id),
    title: fillTemplate(category.seoTitle, values),
    description: fillTemplate(category.seoDescription, values),
    intro: getCityIntro(city, category),
    costRange: getAdjustedCostRange(category, city),
    faq: getCityFaqs(city, category),
    methodologyNote: fillTemplate(category.methodologyNote, values),
  };
}

export function getAllCityCategoryPairs(): { city: City; category: Category; url: string }[] {
  const pairs: { city: City; category: Category; url: string }[] = [];
  for (const city of getAllCities()) {
    for (const category of getAllCategories()) {
      pairs.push({
        city,
        category,
        url: getCityCategoryUrl(city, category.id),
      });
    }
  }
  return pairs;
}

export function getRelatedCities(city: City, limit = 4): City[] {
  const sameState = getAllCities().filter(
    (c) => c.stateSlug === city.stateSlug && c.slug !== city.slug,
  );
  if (sameState.length >= limit) {
    return sameState.slice(0, limit);
  }
  const others = getAllCities()
    .filter((c) => c.slug !== city.slug && c.stateSlug !== city.stateSlug)
    .sort(
      (a, b) =>
        Math.abs(a.laborCostMultiplier - city.laborCostMultiplier) -
        Math.abs(b.laborCostMultiplier - city.laborCostMultiplier),
    );
  return [...sameState, ...others].slice(0, limit);
}

export function getRelatedCategories(categoryId: string): Category[] {
  return getAllCategories().filter((c) => c.id !== categoryId);
}

export { SITE_ORIGIN };
