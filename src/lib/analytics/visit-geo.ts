/** Countries excluded from visitor analytics (recording + reporting). */
export function isExcludedVisitGeo(
  country?: string | null,
  countryCode?: string | null,
): boolean {
  const code = (countryCode || "").trim().toUpperCase();
  const name = (country || "").trim().toLowerCase();
  return code === "IN" || name === "india";
}
