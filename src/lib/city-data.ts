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

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  avgCost: string;
  costRange: string;
  timeframe: string;
  roi: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  faq: { question: string; answer: string }[];
  methodologyNote: string;
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

export function fillTemplate(template: string, city: string, state: string): string {
  return template.replace(/\{city\}/g, city).replace(/\{state\}/g, state);
}
