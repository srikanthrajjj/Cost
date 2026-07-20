import { knowledgeProvider } from "../knowledge-provider";
import type { MatchedMaterial, MatchedScopeItem, QuoteExtraction } from "./types";
import type { ProjectType } from "../estimator-engine";
import type { Material, ScopeItem } from "@/types/knowledge";

// ─── Text Normalization ────────────────────────────────────────────────────

/**
 * Normalizes text for robust comparison:
 * - Unicode NFKC normalization (canonicalizes visually-equivalent characters)
 * - lowercase
 * - hyphens/underscores -> spaces
 * - remove punctuation (except spaces/alphanumerics)
 * - collapse multiple spaces
 * - trim
 */
function normalizeText(text: string | undefined | null): string {
  if (!text) return "";
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[-_]/g, " ") // hyphens/underscores -> spaces
    .replace(/[^\p{L}\p{N}\s]/gu, " ") // strip punctuation (&, —, (), etc.)
    .replace(/\s+/g, " ")
    .trim();
}

/** Light stemming: strips a trailing "s" from words longer than 3 chars so "vents" ~ "vent". */
function stem(word: string): string {
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) {
    return word.slice(0, -1);
  }
  return word;
}

function tokenize(text: string): Set<string> {
  return new Set(normalizeText(text).split(" ").filter(Boolean).map(stem));
}

/**
 * Token overlap similarity using the overlap coefficient
 * (intersection size / size of the smaller set), which rewards a short
 * phrase being fully contained within a longer, more descriptive name —
 * the common case when matching itemized quote lines against knowledge
 * base entries with verbose names (e.g. "Architectural shingles" vs
 * "Asphalt Shingles — Architectural (Dimensional)").
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const set1 = tokenize(str1);
  const set2 = tokenize(str2);
  if (set1.size === 0 || set2.size === 0) return 0;

  let intersection = 0;
  for (const token of set1) {
    if (set2.has(token)) intersection++;
  }
  return intersection / Math.min(set1.size, set2.size);
}

const FUZZY_THRESHOLD = 0.8;

// ─── Candidate Model ───────────────────────────────────────────────────────
// A matching candidate pairs a display name with the knowledge object that
// should be recorded as the match, plus optional synonym strings sourced
// from the knowledge base (brand names, required materials, etc.).

interface Candidate<T> {
  name: string;
  synonyms: string[];
  knowledge: T;
}

function materialCandidates(knowledge: {
  materials: Material[];
  scope: ScopeItem[];
}): Candidate<Material>[] {
  const candidates: Candidate<Material>[] = knowledge.materials.map((m) => ({
    name: m.name,
    synonyms: [],
    knowledge: m,
  }));

  // Bridge: itemized quote "materials" (e.g. drip edge, ice & water shield,
  // ridge vent) often correspond to a scope item's required materials
  // rather than the broad material-type comparison chart. Expose those as
  // additional material candidates so they can still be matched, tagged
  // with a Material-shaped stub so downstream consumers (which only read
  // `.knowledge.name`) keep working.
  for (const scopeItem of knowledge.scope) {
    if (!scopeItem.requiredMaterials?.length) continue;
    const stub: Material = {
      name: scopeItem.name,
      pros: [],
      cons: [],
      cost: scopeItem.typicalCost ?? "",
      durability: "",
      maintenance: "",
      roi: "",
    };
    candidates.push({
      name: scopeItem.name,
      synonyms: scopeItem.requiredMaterials,
      knowledge: stub,
    });
  }

  return candidates;
}

function scopeCandidates(knowledge: { scope: ScopeItem[] }): Candidate<ScopeItem>[] {
  return knowledge.scope.map((s) => ({
    name: s.name,
    synonyms: [...(s.commonContractorNames ?? []), ...(s.requiredMaterials ?? [])],
    knowledge: s,
  }));
}

// ─── Core Matching ──────────────────────────────────────────────────────────

type MatchTier = "exact" | "synonym" | "contains" | "fuzzy";

interface MatchOutcome<T> {
  candidate: Candidate<T> | null;
  confidence: number;
  tier: MatchTier | null;
  reason: string | null;
}

/**
 * Matches a single extracted item name against every candidate, returning
 * the highest-confidence match found across all tiers:
 *   1. exact normalized equality      -> 1.0
 *   2. synonym match                  -> 0.95
 *   3. bidirectional includes()       -> 0.9
 *   4. token overlap / fuzzy (>=80%)  -> calculated similarity
 */
function findBestMatch<T>(extractedName: string, candidates: Candidate<T>[]): MatchOutcome<T> {
  const normalizedExtracted = normalizeText(extractedName);
  if (!normalizedExtracted) {
    return { candidate: null, confidence: 0, tier: null, reason: "no exact match" };
  }

  let best: MatchOutcome<T> = { candidate: null, confidence: 0, tier: null, reason: null };
  let sawSynonymCandidate = false;

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeText(candidate.name);

    // 1. Exact normalized equality
    if (normalizedExtracted === normalizedCandidate) {
      return { candidate, confidence: 1.0, tier: "exact", reason: null };
    }

    // 2. Synonym matching from the knowledge base
    for (const synonym of candidate.synonyms) {
      sawSynonymCandidate = true;
      const normalizedSynonym = normalizeText(synonym);
      if (!normalizedSynonym) continue;
      if (
        normalizedExtracted === normalizedSynonym ||
        normalizedExtracted.includes(normalizedSynonym) ||
        normalizedSynonym.includes(normalizedExtracted)
      ) {
        if (0.95 > best.confidence) {
          best = { candidate, confidence: 0.95, tier: "synonym", reason: null };
        }
      }
    }

    // 3. Bidirectional includes()
    if (
      normalizedExtracted.includes(normalizedCandidate) ||
      normalizedCandidate.includes(normalizedExtracted)
    ) {
      if (0.9 > best.confidence) {
        best = { candidate, confidence: 0.9, tier: "contains", reason: null };
      }
    }

    // 4. Token overlap / fuzzy matching (minimum 80% similarity)
    const similarity = calculateStringSimilarity(extractedName, candidate.name);
    if (similarity >= FUZZY_THRESHOLD && similarity > best.confidence) {
      best = { candidate, confidence: similarity, tier: "fuzzy", reason: null };
    }
  }

  if (!best.candidate) {
    best.reason = sawSynonymCandidate ? "no synonym" : "similarity below threshold";
  }

  return best;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function matchQuote(extracted: QuoteExtraction): Promise<{
  matchedMaterials: MatchedMaterial[];
  matchedScopeItems: MatchedScopeItem[];
  unmatchedMaterials: string[];
  unmatchedScopeItems: string[];
}> {
  const projectType = extracted.projectType as ProjectType;
  const knowledge = projectType ? await knowledgeProvider.getKnowledge(projectType) : null;

  const matchedMaterials: MatchedMaterial[] = [];
  const matchedScopeItems: MatchedScopeItem[] = [];
  const unmatchedMaterials: string[] = [];
  const unmatchedScopeItems: string[] = [];

  if (!knowledge) {
    return { matchedMaterials, matchedScopeItems, unmatchedMaterials, unmatchedScopeItems };
  }

  const materialPool = materialCandidates(knowledge);
  for (const item of extracted.materials) {
    const outcome = findBestMatch(item.name, materialPool);
    if (outcome.candidate) {
      matchedMaterials.push({
        original: item,
        knowledge: outcome.candidate.knowledge,
        confidence: outcome.confidence,
        status: "matched",
      });
    } else {
      unmatchedMaterials.push(`${item.name} (${outcome.reason ?? "no exact match"})`);
    }
  }

  const scopePool = scopeCandidates(knowledge);
  for (const item of extracted.scopeItems) {
    const outcome = findBestMatch(item.name, scopePool);
    if (outcome.candidate) {
      matchedScopeItems.push({
        original: item,
        knowledge: outcome.candidate.knowledge,
        confidence: outcome.confidence,
        status: "matched",
      });
    } else {
      unmatchedScopeItems.push(`${item.name} (${outcome.reason ?? "no exact match"})`);
    }
  }

  return { matchedMaterials, matchedScopeItems, unmatchedMaterials, unmatchedScopeItems };
}
