import { createFileRoute } from "@tanstack/react-router";
import {
  getAllCityCategoryPairs,
  getAllStateSlugs,
  SITE_ORIGIN,
} from "@/lib/city-data";

const STATIC_PATHS = [
  "/",
  "/estimate",
  "/quote-analyzer",
  "/compare-quotes",
  "/methodology",
  "/about",
  "/contact",
  "/locations",
  "/guides/roof-replacement",
  "/guides/kitchen-remodel",
  "/guides/bathroom-remodel",
  "/guides/hvac-installation",
  "/guides/window-replacement",
  "/guides/flooring",
  "/guides/metal-vs-asphalt-roof",
  "/guides/inflated-quote-signs",
  "/kitchen-remodel-cost",
  "/roof-replacement-cost",
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc: string, priority: string, changefreq: string): string {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export function buildSitemapXml(): string {
  const cityCategoryPairs = getAllCityCategoryPairs();
  const states = getAllStateSlugs();

  const entries: string[] = [
    ...STATIC_PATHS.map((path) =>
      urlEntry(`${SITE_ORIGIN}${path === "/" ? "" : path}`, path === "/" ? "1.0" : "0.8", "weekly"),
    ),
    ...states.map((state) =>
      urlEntry(`${SITE_ORIGIN}/locations/${state.stateSlug}`, "0.7", "weekly"),
    ),
    ...cityCategoryPairs.map(({ url }) => urlEntry(`${SITE_ORIGIN}${url}`, "0.7", "weekly")),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(buildSitemapXml(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
