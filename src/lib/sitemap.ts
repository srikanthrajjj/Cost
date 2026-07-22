import {
  getAllStateSlugs,
  getIndexableCityCategoryPairs,
} from "@/lib/city-data";
import { PROJECT_CONFIGS } from "@/lib/project-config";
import { absoluteUrl } from "@/lib/seo";

const STATIC_PATHS: { path: string; priority: string }[] = [
  { path: "/", priority: "1.0" },
  { path: "/estimate", priority: "0.9" },
  { path: "/quote-analyzer", priority: "0.9" },
  { path: "/compare-quotes", priority: "0.9" },
  { path: "/methodology", priority: "0.6" },
  { path: "/about", priority: "0.5" },
  { path: "/contact", priority: "0.5" },
  { path: "/locations", priority: "0.8" },
  { path: "/guides", priority: "0.8" },
  { path: "/topics/quotes", priority: "0.8" },
  { path: "/topics/roof", priority: "0.8" },
  { path: "/topics/kitchen", priority: "0.8" },
  { path: "/topics/windows", priority: "0.75" },
  { path: "/topics/flooring", priority: "0.75" },
  { path: "/guides/how-to-read-a-contractor-quote", priority: "0.85" },
  { path: "/guides/questions-before-signing", priority: "0.85" },
  { path: "/guides/quartz-vs-granite-countertops", priority: "0.8" },
  { path: "/guides/roof-replacement", priority: "0.8" },
  { path: "/guides/kitchen-remodel", priority: "0.8" },
  { path: "/guides/bathroom-remodel", priority: "0.8" },
  { path: "/guides/hvac-installation", priority: "0.8" },
  { path: "/guides/window-replacement", priority: "0.7" },
  { path: "/guides/flooring", priority: "0.7" },
  { path: "/guides/metal-vs-asphalt-roof", priority: "0.7" },
  { path: "/guides/inflated-quote-signs", priority: "0.8" },
  { path: "/privacy", priority: "0.3" },
  { path: "/terms", priority: "0.3" },
  { path: "/disclaimer", priority: "0.3" },
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc: string, priority: string, changefreq: string, lastmod: string): string {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/** Build the XML sitemap. Prefer regenerating public/sitemap.xml before deploy. */
export function buildSitemapXml(): string {
  const lastmod = new Date().toISOString().slice(0, 10);
  const cityCategoryPairs = getIndexableCityCategoryPairs();
  const states = getAllStateSlugs();
  const projectPaths = PROJECT_CONFIGS.map((p) => `/${p.slug}`);

  const entries: string[] = [
    ...STATIC_PATHS.map(({ path, priority }) =>
      urlEntry(absoluteUrl(path), priority, "weekly", lastmod),
    ),
    ...projectPaths.map((path) =>
      urlEntry(absoluteUrl(path), "0.85", "weekly", lastmod),
    ),
    ...states.map((state) =>
      urlEntry(absoluteUrl(`/locations/${state.stateSlug}`), "0.7", "weekly", lastmod),
    ),
    ...cityCategoryPairs.map(({ url }) =>
      urlEntry(absoluteUrl(url), "0.75", "weekly", lastmod),
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;
}
