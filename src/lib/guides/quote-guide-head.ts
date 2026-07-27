import {
  DEFAULT_OG_IMAGE,
  absoluteUrl,
  buildArticleSchema,
  buildBreadcrumbList,
  buildFaqSchema,
} from "@/lib/seo";

const DATE = "2026-07-27";

export function buildQuoteGuideHead(input: {
  path: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  faqs?: { q: string; a: string }[];
}) {
  const scripts: { type: "application/ld+json"; children: string }[] = [
    {
      type: "application/ld+json",
      children: JSON.stringify(
        buildArticleSchema({
          headline: input.headline,
          description: input.metaDescription,
          path: input.path,
          datePublished: DATE,
          dateModified: DATE,
        }),
      ),
    },
    {
      type: "application/ld+json",
      children: JSON.stringify(
        buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: "Contractor quotes", path: "/topics/quotes" },
          { name: input.headline, path: input.path },
        ]),
      ),
    },
  ];

  if (input.faqs?.length) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify(buildFaqSchema(input.faqs)),
    });
  }

  return {
    meta: [
      { title: `${input.metaTitle} | CostReno` },
      { name: "description", content: input.metaDescription },
      { property: "og:title", content: `${input.metaTitle} | CostReno` },
      { property: "og:description", content: input.metaDescription },
      { property: "og:type", content: "article" },
      { property: "og:url", content: absoluteUrl(input.path) },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl(input.path) }],
    scripts,
  };
}
