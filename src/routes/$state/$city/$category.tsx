import { createFileRoute, redirect } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { TrustBar } from "@/components/TrustBar";
import { CityHero } from "@/components/city/CityHero";
import { CityContextBar } from "@/components/city/CityContextBar";
import { CityToolGrid } from "@/components/city/CityToolGrid";
import { CityFAQ } from "@/components/city/CityFAQ";
import { CityMethodologyCallout } from "@/components/city/CityMethodologyCallout";
import {
  getCityBySlug,
  getCategoryById,
  fillTemplate,
  getAllCities,
  getAllCategories,
} from "@/lib/city-data";

function buildSeoMeta(citySlug: string, categoryId: string) {
  const city = getCityBySlug(citySlug);
  const category = getCategoryById(categoryId);
  if (!city || !category) return { title: "Page Not Found — CostReno", description: "" };
  const title = fillTemplate(category.seoTitle, city.city, city.stateAbbr);
  const description = fillTemplate(category.seoDescription, city.city, city.state);
  return { title, description };
}

export const Route = createFileRoute("/$state/$city/$category")({
  component: CityCategoryPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-ink">Page Not Found</h1>
        <p className="mt-3 text-muted-foreground">This city page doesn't exist yet.</p>
        <a
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold"
        >
          Go Home
        </a>
      </div>
    </div>
  ),
  head: ({ params }) => {
    const seo = buildSeoMeta(params.city, params.category);
    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.description },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.description },
        { property: "og:type", content: "website" },
        {
          property: "og:url",
          content: `https://costreno.com/${params.state}/${params.city}/${params.category}`,
        },
        { name: "robots", content: "index, follow" },
      ],
      links: [
        {
          rel: "canonical",
          href: `https://costreno.com/${params.state}/${params.city}/${params.category}`,
        },
      ],
    };
  },
});

function CityCategoryPage() {
  const { state: stateSlug, city: citySlug, category: categoryId } = Route.useParams();
  const city = getCityBySlug(citySlug);
  const category = getCategoryById(categoryId);

  if (!city || !category || city.stateSlug !== stateSlug) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-ink">Page Not Found</h1>
          <p className="mt-3 text-muted-foreground">This city page doesn't exist yet.</p>
          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const introParagraph =
    city.introParagraphs[categoryId] ||
    `Planning a ${category.name.toLowerCase()} in ${city.city}, ${city.stateAbbr}? CostReno helps you estimate costs, compare contractor quotes, and understand local pricing factors specific to your area.`;

  const faqItems = category.faq.map((item) => ({
    question: fillTemplate(item.question, city.city, city.state),
    answer: fillTemplate(item.answer, city.city, city.state),
  }));

  const methodologyNote = fillTemplate(category.methodologyNote, city.city, city.state);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <CityHero
          categoryName={category.name}
          city={city.city}
          state={city.stateAbbr}
          introParagraph={introParagraph}
        />
        <CityContextBar
          city={city.city}
          state={city.state}
          stateAbbr={city.stateAbbr}
          laborCostMultiplier={city.laborCostMultiplier}
          typicalHomeAge={city.typicalHomeAge}
          climateNotes={city.climateNotes}
          regionalNotes={city.regionalNotes}
          categoryName={category.name}
        />
        <CityToolGrid
          city={city.city}
          state={city.stateAbbr}
          categoryName={category.name}
          categoryId={category.id}
        />
        <TrustBar region={`${city.city}, ${city.stateAbbr}`} />
        <CityFAQ items={faqItems} categoryName={category.name} city={city.city} />
        <CityMethodologyCallout methodologyNote={methodologyNote} />
      </main>
      <SiteFooter />
    </div>
  );
}
