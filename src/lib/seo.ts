/** Shared SEO constants for CostReno. */

export const SITE_ORIGIN = "https://costreno.com";

export const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200";

export function absoluteUrl(path: string): string {
  if (!path || path === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
