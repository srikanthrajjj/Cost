import {
  POPULAR_SEARCHES,
  SEARCH_CATALOG,
  type SearchGroup,
  type SearchItem,
} from "@/lib/search-catalog";

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "and",
  "or",
  "how",
  "much",
  "does",
  "should",
  "is",
  "are",
  "what",
  "with",
  "by",
  "from",
  "my",
  "your",
  "vs",
  "versus",
  "do",
  "can",
  "i",
  "we",
  "me",
  "our",
  "this",
  "that",
  "about",
  "into",
  "near",
  "per",
]);

/** Directed aliases / typo corrections. Forward only. */
const RELATED: Record<string, string[]> = {
  kitch: ["kitchen", "kitchens"],
  kitchen: ["kitchens"],
  kitchens: ["kitchen"],
  remodel: ["renovation", "renovate", "redo", "upgrade", "makeover"],
  renovation: ["remodel", "renovate", "upgrade"],
  roof: ["roofing", "shingle", "shingles", "reroof"],
  roofing: ["roof", "shingle", "shingles"],
  quote: ["quotes", "bid", "bids", "proposal"],
  quotes: ["quote", "bid", "bids"],
  contractor: ["contractors", "builder", "builders"],
  cabnet: ["cabinet", "cabinets"],
  cabinet: ["cabinets", "cupboard"],
  cabinets: ["cabinet", "cupboard"],
  countertop: ["countertops"],
  countertops: ["countertop"],
  quartz: ["countertop", "countertops", "granite"],
  granite: ["countertop", "countertops", "quartz"],
  bathroom: ["bath", "bathrooms", "shower", "vanity"],
  bath: ["bathroom", "bathrooms"],
  hvac: ["heating", "cooling", "furnace"],
  window: ["windows", "glazing"],
  windows: ["window"],
  flooring: ["floor", "floors", "hardwood", "lvp", "tile"],
  floor: ["flooring", "floors"],
  insurence: ["insurance"],
  insurance: ["claim", "claims", "storm", "damage", "acv", "rcv"],
  claim: ["insurance", "claims"],
  claims: ["insurance", "claim"],
  labor: ["labour", "workmanship"],
  install: ["installation", "installed"],
  installation: ["install", "installed"],
  cost: ["price", "pricing", "costs", "budget"],
  price: ["cost", "pricing", "costs"],
  costs: ["cost", "price", "pricing"],
  replacement: ["replace", "replacing"],
  replace: ["replacement", "replacing"],
  compare: ["comparison"],
  financing: ["loan", "finance", "heloc"],
  permit: ["permits", "inspection"],
  permits: ["permit", "inspection"],
  solar: ["panel", "panels", "photovoltaic", "pv", "sun"],
  panel: ["panels", "solar"],
  panels: ["panel", "solar"],
  ev: ["evse", "charger", "charging", "electric", "vehicle"],
  charger: ["charging", "ev", "evse"],
  charging: ["charger", "ev", "evse"],
  thermostat: ["thermostats", "nest", "ecobee", "smart"],
  thermostats: ["thermostat", "nest", "ecobee"],
  nest: ["thermostat", "ecobee", "smart"],
  ecobee: ["thermostat", "nest", "smart"],
  nearby: ["local", "city", "locations"],
  plumbing: ["plumber", "pipe", "pipes", "leak", "drain", "faucet", "water"],
  plumber: ["plumbing", "pipe", "leak"],
  painting: ["paint", "painter", "interior", "exterior"],
  paint: ["painting", "painter"],
  deck: ["patio", "porch", "outdoor"],
  patio: ["deck", "porch"],
  electrical: ["electrician", "wiring", "panel", "breaker", "outlet"],
  electrician: ["electrical", "wiring", "panel"],
  repair: ["fix", "replace", "replacement", "renovation"],
  fence: ["fencing", "yard"],
  siding: ["exterior", "cladding"],
  basement: ["foundation", "waterproofing"],
  garage: ["door", "opener"],
  water: ["heater", "plumbing", "leak"],
  heater: ["water", "furnace", "hvac"],
};

/** Common verbs/nouns that should not dominate ranking alone. */
const WEAK_TOPIC = new Set([
  "replacement",
  "replace",
  "replacing",
  "install",
  "installation",
  "installed",
  "labor",
  "labour",
  "compare",
  "comparison",
  "guide",
  "cost",
  "costs",
  "price",
  "pricing",
]);

const STATE_ALIASES = new Set([
  "alabama",
  "alaska",
  "arizona",
  "arkansas",
  "california",
  "colorado",
  "connecticut",
  "delaware",
  "florida",
  "georgia",
  "hawaii",
  "idaho",
  "illinois",
  "indiana",
  "iowa",
  "kansas",
  "kentucky",
  "louisiana",
  "maine",
  "maryland",
  "massachusetts",
  "michigan",
  "minnesota",
  "mississippi",
  "missouri",
  "montana",
  "nebraska",
  "nevada",
  "ohio",
  "oklahoma",
  "oregon",
  "pennsylvania",
  "tennessee",
  "texas",
  "utah",
  "vermont",
  "virginia",
  "washington",
  "wisconsin",
  "wyoming",
  "ca",
  "tx",
  "fl",
  "ny",
  "wa",
  "az",
]);

const GENERIC_TOKENS = new Set([
  "cost",
  "costs",
  "price",
  "pricing",
  "estimate",
  "average",
  "new",
  "home",
  "house",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9$\s-]/g, " ")
    .split(/[\s-]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    let prev = i;
    row[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cur = row[j + 1];
      const cost = a[i] === b[j] ? 0 : 1;
      row[j + 1] = Math.min(row[j + 1] + 1, row[j] + 1, prev + cost);
      prev = cur;
    }
  }
  return row[b.length];
}

function maxEditDistance(token: string): number {
  if (token.length <= 3) return 0;
  if (token.length <= 5) return 1;
  return 2;
}

function tokenSimilarity(queryToken: string, catalogToken: string): number {
  if (!queryToken || !catalogToken) return 0;
  if (queryToken === catalogToken) return 1;
  if (catalogToken.startsWith(queryToken) && queryToken.length >= 3) return 0.94;
  if (queryToken.startsWith(catalogToken) && catalogToken.length >= 4) return 0.86;
  if (catalogToken.includes(queryToken) && queryToken.length >= 4) return 0.78;
  if (queryToken.includes(catalogToken) && catalogToken.length >= 4) return 0.72;
  const dist = levenshtein(queryToken, catalogToken);
  const allowed = maxEditDistance(queryToken);
  if (dist > 0 && dist <= allowed && Math.abs(queryToken.length - catalogToken.length) <= allowed) {
    return Math.max(0.58, 1 - dist / Math.max(queryToken.length, catalogToken.length));
  }
  return 0;
}

/** Expand typos/aliases without pulling in an entire topic cluster. */
function expandToken(token: string): string[] {
  const out = new Set<string>([token]);
  const related = RELATED[token];
  if (related) {
    for (const r of related) out.add(r);
  }
  // Fuzzy-correct against known keys only (e.g. insurence -> insurance, cabnet already listed)
  for (const key of Object.keys(RELATED)) {
    if (tokenSimilarity(token, key) >= 0.85) {
      out.add(key);
      for (const r of RELATED[key] ?? []) out.add(r);
    }
  }
  return [...out];
}

function bestTokenScore(queryToken: string, catalogTokens: string[]): number {
  const variants = expandToken(queryToken);
  let best = 0;
  for (const variant of variants) {
    for (const catalogToken of catalogTokens) {
      // Prefer direct similarity of the original token, then aliases
      const direct = tokenSimilarity(queryToken, catalogToken);
      const viaAlias = variant === queryToken ? 0 : tokenSimilarity(variant, catalogToken) * 0.98;
      best = Math.max(best, direct, viaAlias);
      if (best >= 1) return 1;
    }
  }
  return best;
}

function tokenWeight(token: string): number {
  if (GENERIC_TOKENS.has(token) || STATE_ALIASES.has(token)) return 0.35;
  if (WEAK_TOPIC.has(token)) return 0.55;
  return 1.35;
}

export type RankedSearchItem = SearchItem & { score: number };

/** Detect local / near-me phrasing before stop-word stripping. */
export function detectNearMeIntent(raw: string): boolean {
  const q = raw.toLowerCase();
  return /\bnear\s*me\b/.test(q) || /\bnearby\b/.test(q) || /\bclose\s+to\s+me\b/.test(q);
}

function locationBrowseResults(limit: number, topicHint?: string): RankedSearchItem[] {
  const topicTokens = topicHint ? tokenize(topicHint) : [];
  const scored: RankedSearchItem[] = [];

  for (const item of SEARCH_CATALOG) {
    let score = 0;
    if (item.href === "/locations") score += 20;
    if (item.href.includes("by-city") || item.href.includes("by-state")) score += 12;
    if (item.group === "Projects") score += 8;
    if (item.group === "Topics") score += 5;
    if (item.href === "/estimate") score += 10;

    if (topicTokens.length) {
      const hay = tokenize(`${item.title} ${item.description} ${item.keywords}`);
      let topicHits = 0;
      for (const token of topicTokens) {
        if (bestTokenScore(token, hay) >= 0.7) topicHits += 1;
      }
      if (topicHits === 0 && item.href !== "/locations" && item.href !== "/estimate") continue;
      score += topicHits * 8;
    }

    if (score >= 5) scored.push({ ...item, score });
  }

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return scored.slice(0, limit);
}

export function rankSearchResults(
  query: string,
  limit = 16,
  options?: { loose?: boolean },
): RankedSearchItem[] {
  const loose = Boolean(options?.loose);
  const nearMe = detectNearMeIntent(query);
  const tokens = tokenize(query);

  // Pure near-me (or near-me + weak tokens) → local cost navigator results
  if (nearMe && tokens.filter((t) => !GENERIC_TOKENS.has(t) && !WEAK_TOPIC.has(t)).length === 0) {
    return locationBrowseResults(limit);
  }
  if (!tokens.length) {
    return nearMe ? locationBrowseResults(limit) : [];
  }

  // "solar near me" / "roof cost near me" → topic results with local boosts
  if (nearMe && tokens.length > 0) {
    const topical = rankSearchResultsCore(tokens, true, limit, loose);
    const local = locationBrowseResults(Math.min(4, limit), query);
    const merged = new Map<string, RankedSearchItem>();
    for (const item of [...topical, ...local]) {
      const prev = merged.get(item.href);
      if (!prev || item.score > prev.score) merged.set(item.href, item);
    }
    return [...merged.values()]
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, limit);
  }

  return rankSearchResultsCore(tokens, false, limit, loose);
}

function rankSearchResultsCore(
  tokens: string[],
  hasNearMe: boolean,
  limit: number,
  loose = false,
): RankedSearchItem[] {
  const strongTokens = tokens.filter(
    (t) => !STATE_ALIASES.has(t) && !GENERIC_TOKENS.has(t) && !WEAK_TOPIC.has(t),
  );
  const topicTokens = tokens.filter((t) => !STATE_ALIASES.has(t) && !GENERIC_TOKENS.has(t));
  const hasLocationIntent =
    hasNearMe ||
    tokens.some((t) => STATE_ALIASES.has(t) || t === "local" || t === "city" || t === "cities");

  const scored: RankedSearchItem[] = [];
  const minField = loose ? 0.42 : 0.55;
  const minScore = loose ? 2 : 3.5;
  const minStrong = loose ? 0.55 : 0.7;

  for (const item of SEARCH_CATALOG) {
    const titleTokens = tokenize(item.title);
    const descTokens = tokenize(item.description);
    const keywordTokens = tokenize(item.keywords);
    const haystack = `${item.title} ${item.description} ${item.keywords}`.toLowerCase();

    let score = 0;
    let strongHits = 0;
    let topicHits = 0;
    let bestStrong = 0;

    for (const token of tokens) {
      const weight = tokenWeight(token);
      const titleScore = bestTokenScore(token, titleTokens);
      const keywordScore = bestTokenScore(token, keywordTokens);
      const descScore = bestTokenScore(token, descTokens);
      let fieldScore = Math.max(titleScore * 1.35, keywordScore * 1.05, descScore * 0.7);

      // Loose mode: also accept plain substring hits in the full catalog text
      if (loose && fieldScore < minField && token.length >= 3 && haystack.includes(token)) {
        fieldScore = Math.max(fieldScore, 0.62);
      }

      if (fieldScore < minField) continue;

      score += fieldScore * weight * 4;
      if (!GENERIC_TOKENS.has(token) && !STATE_ALIASES.has(token)) {
        topicHits += 1;
      }
      if (strongTokens.includes(token)) {
        strongHits += fieldScore >= minStrong ? 1 : 0;
        bestStrong = Math.max(bestStrong, fieldScore);
        if (titleScore >= minStrong) score += 6;
      }
    }

    if (topicTokens.length > 0 && topicHits === 0) continue;
    if (strongTokens.length > 0 && bestStrong < minStrong) continue;

    if (hasLocationIntent) {
      if (item.href === "/locations" || item.href.includes("by-state") || item.href.includes("by-city")) {
        score += 3;
      } else if (item.href.startsWith("/estimate")) {
        score += 2.5;
      } else if (item.group === "Projects") {
        score += 1;
      }
    }

    if (score >= minScore) {
      scored.push({ ...item, score: score + strongHits * 2 });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return scored.slice(0, limit);
}

/** Distinctive query phrases for multi-pass catalog search. */
export function extractSearchPasses(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const tokens = tokenize(trimmed);
  const strong = tokens.filter(
    (t) => !STATE_ALIASES.has(t) && !GENERIC_TOKENS.has(t) && !WEAK_TOPIC.has(t),
  );
  const passes = [trimmed];
  if (strong.length) passes.push(strong.join(" "));
  if (strong.length >= 2) passes.push(strong.slice(0, 2).join(" "));
  if (strong[0]) passes.push(strong[0]);
  return [...new Set(passes)];
}

export function rankSuggestions(query: string, limit = 5): string[] {
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  const q = query.trim().toLowerCase();
  const strongTokens = tokens.filter(
    (t) => !STATE_ALIASES.has(t) && !GENERIC_TOKENS.has(t) && !WEAK_TOPIC.has(t),
  );

  return POPULAR_SEARCHES.map((term) => {
    const termTokens = tokenize(term);
    let score = 0;
    if (term.includes(q) || q.includes(term)) score += 3;
    for (const token of tokens) {
      score += bestTokenScore(token, termTokens) * tokenWeight(token) * 2;
    }
    // Require a hit on distinctive words when present (kitchen, quartz, roof…)
    if (strongTokens.length > 0) {
      const strongHit = strongTokens.some((token) => bestTokenScore(token, termTokens) >= 0.7);
      if (!strongHit) score *= 0.15;
      else score += 4;
    }
    return { term, score };
  })
    .filter((row) => row.score >= 1.5 && row.term !== q)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.term);
}

export function groupRankedResults(items: RankedSearchItem[]): Map<SearchGroup, RankedSearchItem[]> {
  const map = new Map<SearchGroup, RankedSearchItem[]>();
  for (const item of items) {
    const list = map.get(item.group) ?? [];
    list.push(item);
    map.set(item.group, list);
  }
  return map;
}
