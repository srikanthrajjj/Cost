import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { CityCostSnapshot } from "@/components/city/CityCostSnapshot";
import { CityHero } from "@/components/city/CityHero";
import { CityContextBar } from "@/components/city/CityContextBar";
import { CityToolGrid } from "@/components/city/CityToolGrid";
import { CityFAQ } from "@/components/city/CityFAQ";
import { CityMethodologyCallout } from "@/components/city/CityMethodologyCallout";
import { CityRelatedLinks } from "@/components/city/CityRelatedLinks";
import { CityLocalFactors } from "@/components/city/CityLocalFactors";
import { TrustBar } from "@/components/TrustBar";
import {
  getAbsoluteCityCategoryUrl,
  getCityPage,
  getRelatedCategories,
  getRelatedCities,
} from "@/lib/city-data";

export const Route = createFileRoute("/$state/$city/$category")({
  component: CityCategoryPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-ink">Page not found</h1>
        <p className="mt-3 text-muted-foreground">This city page doesn't exist yet.</p>
        <a
          href="/locations"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white text-sm font-semibold"
        >
          Browse city pages
        </a>
      </div>
    </div>
  ),
  head: ({ params }) => {
    const page = getCityPage(params.city, params.category);
    if (!page || page.city.stateSlug !== params.state) {
      return { meta: [{ title: "Page not found | CostReno" }] };
    }
    return {
      meta: [
        { title: page.title },
        { name: "description", content: page.description },
        { property: "og:title", content: page.title },
        { property: "og:description", content: page.description },
        { property: "og:type", content: "article" },
        {
          property: "og:url",
          content: getAbsoluteCityCategoryUrl(page.city, page.category.id),
        },
        { name: "robots", content: page.isIndexable ? "index, follow" : "noindex, follow" },
      ],
      links: [
        {
          rel: "canonical",
          href: getAbsoluteCityCategoryUrl(page.city, page.category.id),
        },
      ],
    };
  },
});

function CityCategoryPage() {
  const { state: stateSlug, city: citySlug, category: categoryId } = Route.useParams();
  const page = getCityPage(citySlug, categoryId);

  if (!page || page.city.stateSlug !== stateSlug) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-ink">Page not found</h1>
          <p className="mt-3 text-muted-foreground">This city page doesn't exist yet.</p>
          <a
            href="/locations"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white text-sm font-semibold"
          >
            Browse city pages
          </a>
        </div>
      </div>
    );
  }

  const { city, category, intro, faq, costRange, methodologyNote, localFactors, lastReviewed, isEnriched } =
    page;
  const relatedCities = getRelatedCities(city, category.id);
  const relatedCategories = getRelatedCategories(category.id, city.slug);
  const absoluteUrl = getAbsoluteCityCategoryUrl(city, category.id);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: absoluteUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "CostReno",
      url: "https://costreno.com",
    },
    about: {
      "@type": "Place",
      name: `${city.city}, ${city.stateAbbr}`,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://costreno.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Locations",
        item: "https://costreno.com/locations",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: city.state,
        item: `https://costreno.com/locations/${city.stateSlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `${category.name} in ${city.city}`,
        item: absoluteUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        <nav aria-label="Breadcrumb" className="container-x pt-6">
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
            <li>
              <a href={`/locations/${city.stateSlug}`} className="hover:text-primary">
                {city.state}
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink">{city.city}</li>
          </ol>
        </nav>

        <CityHero
          categoryName={category.name}
          city={city.city}
          state={city.stateAbbr}
          introParagraph={intro}
        />
        <CityCostSnapshot
          city={city.city}
          stateAbbr={city.stateAbbr}
          categoryName={category.name}
          costRangeLabel={costRange.label}
          laborMultiplier={city.laborCostMultiplier}
          timeframe={category.timeframe}
          roi={category.roi}
          medianHomeValue={city.medianHomeValue}
        />
        <CityLocalFactors
          city={city.city}
          categoryName={category.name}
          factors={localFactors}
          lastReviewed={lastReviewed}
          isEnriched={isEnriched}
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
          estimateProjectType={category.estimateProjectType}
          guidePath={category.guidePath}
        />
        <TrustBar region={`${city.city}, ${city.stateAbbr}`} />
        <CityFAQ items={faq} categoryName={category.name} city={city.city} />
        <CityMethodologyCallout methodologyNote={methodologyNote} />
        <CityRelatedLinks
          city={city}
          category={category}
          relatedCities={relatedCities}
          relatedCategories={relatedCategories}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
