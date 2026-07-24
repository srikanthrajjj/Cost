/** Shared SEO constants and helpers for CostReno. */

/** Preferred public host (Vercel redirects apex → www). */
export const SITE_ORIGIN = "https://www.costreno.com";

export const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200";

/** IndexNow key (must match public/{key}.txt contents). */
export const INDEXNOW_KEY = "costreno-indexnow-7f3a9c2e8b14";

export function absoluteUrl(path: string): string {
  if (!path || path === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Normalize any CostReno URL to the preferred www origin. */
export function canonicalUrl(urlOrPath: string): string {
  if (!urlOrPath) return absoluteUrl("/");
  if (urlOrPath.startsWith("/")) return absoluteUrl(urlOrPath);
  try {
    const u = new URL(urlOrPath);
    if (u.hostname === "costreno.com" || u.hostname === "www.costreno.com") {
      return absoluteUrl(`${u.pathname}${u.search}${u.hash}`);
    }
    return urlOrPath;
  } catch {
    return absoluteUrl(urlOrPath);
  }
}

export type BreadcrumbItem = { name: string; path?: string };

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

export function buildArticleSchema(input: {
  headline: string;
  description?: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: url,
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    author: {
      "@type": "Organization",
      name: "CostReno",
      url: SITE_ORIGIN,
    },
    publisher: {
      "@type": "Organization",
      name: "CostReno",
      url: SITE_ORIGIN,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.svg"),
      },
    },
    about: {
      "@type": "Thing",
      name: "Home renovation costs and contractor quotes",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "CostReno",
      url: SITE_ORIGIN,
    },
  };
}

export function buildFaqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

/** Full robots.txt body (single source of truth for the /robots.txt route). */
export function buildRobotsTxt(): string {
  return `# CostReno robots.txt
# ${SITE_ORIGIN}
#
# Goal: allow search engines and AI assistants to crawl and cite public pages.
# Private / admin paths stay blocked.

User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /r/

User-agent: Googlebot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: bingbot
Allow: /

User-agent: BingPreview
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: CCBot
Allow: /

User-agent: AhrefsBot
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
}

/**
 * Notify IndexNow endpoints that URLs changed (Bing, Yandex, Seznam, Naver).
 * Safe to call from deploy scripts or admin actions.
 */
export async function submitIndexNow(urls: string[]): Promise<{
  ok: boolean;
  status?: number;
  message: string;
}> {
  const host = "www.costreno.com";
  const keyLocation = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;
  const normalized = [...new Set(urls.map((u) => canonicalUrl(u)))].slice(0, 10000);

  if (normalized.length === 0) {
    return { ok: false, message: "No URLs to submit." };
  }

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList: normalized,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    if (res.status === 200 || res.status === 202) {
      return { ok: true, status: res.status, message: `IndexNow accepted ${normalized.length} URL(s).` };
    }

    return {
      ok: false,
      status: res.status,
      message: `IndexNow returned ${res.status}.`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "IndexNow request failed.",
    };
  }
}
