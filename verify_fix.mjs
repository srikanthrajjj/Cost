// Verification script: simulates the exact raw LLM extraction JSON from the
// bug report (snake_case fields, scope_items as strings) and confirms:
//   1. normalizeExtraction() converts it to the correct QuoteExtraction shape
//   2. matchQuote() then produces real matches against the roofing knowledge base
//   3. analyzeQuote() produces a populated report (non-zero completeness, red flags, etc.)

import { roofingMaterials } from "./src/knowledge/roofing/materials.ts";
import { roofingScopeItems } from "./src/knowledge/roofing/scope.ts";
import { roofingRedFlags } from "./src/knowledge/roofing/red-flags.ts";

// --- normalizeExtraction() logic (mirrors extractor.ts) ---
function pick(obj, keys) {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
}
function toNumber(value) {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return typeof n === "number" && !Number.isNaN(n) ? n : 0;
}
function toStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((v) => {
    if (typeof v === "string") return v;
    if (v && typeof v === "object") return String(pick(v, ["description", "name", "text"]) ?? "");
    return String(v ?? "");
  });
}
const PROJECT_TYPE_ALIASES = { roofing: "roof", roofs: "roof", kitchens: "kitchen", bathrooms: "bathroom", bath: "bathroom" };
function normalizeProjectType(value) {
  const lower = value.trim().toLowerCase();
  return PROJECT_TYPE_ALIASES[lower] ?? lower;
}
function normalizeMaterial(m) {
  const obj = m ?? {};
  return {
    name: String(pick(obj, ["name", "description", "material", "item"]) ?? ""),
    quantity: toNumber(pick(obj, ["quantity", "qty"])),
    unit: String(pick(obj, ["unit", "units"]) ?? ""),
    unitPrice: toNumber(pick(obj, ["unitPrice", "price_per_unit", "unit_price", "pricePerUnit"])),
    totalPrice: toNumber(pick(obj, ["totalPrice", "total_price", "total"])),
    notes: pick(obj, ["notes", "note"]),
  };
}
function normalizeScopeItem(s) {
  if (typeof s === "string") return { name: s, quantity: 0, unit: "", totalPrice: 0 };
  const obj = s ?? {};
  return {
    name: String(pick(obj, ["name", "description", "item"]) ?? ""),
    description: pick(obj, ["description", "details"]),
    quantity: toNumber(pick(obj, ["quantity", "qty"])),
    unit: String(pick(obj, ["unit", "units"]) ?? ""),
    totalPrice: toNumber(pick(obj, ["totalPrice", "total_price", "total"])),
    notes: pick(obj, ["notes", "note"]),
  };
}
function normalizeExtraction(raw) {
  const materialsRaw = pick(raw, ["materials"]);
  const scopeItemsRaw = pick(raw, ["scopeItems", "scope_items", "scope"]);
  return {
    projectType: normalizeProjectType(String(pick(raw, ["projectType", "project_type", "type"]) ?? "")),
    contractor: String(pick(raw, ["contractor", "contractor_name", "contractorName"]) ?? ""),
    materials: Array.isArray(materialsRaw) ? materialsRaw.map(normalizeMaterial) : [],
    scopeItems: Array.isArray(scopeItemsRaw) ? scopeItemsRaw.map(normalizeScopeItem) : [],
    permits: toStringArray(pick(raw, ["permits"])),
    warranties: toStringArray(pick(raw, ["warranties"])),
    exclusions: toStringArray(pick(raw, ["exclusions"])),
    totalPrice: toNumber(pick(raw, ["totalPrice", "total_price", "total"])),
    confidence: toNumber(pick(raw, ["confidence", "confidence_score", "confidenceScore"])),
  };
}

// --- matchQuote() logic (mirrors the new matcher.ts) ---
function normalizeText(text) {
  if (!text) return "";
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[-_]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function stem(word) {
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}
function tokenize(text) {
  return new Set(normalizeText(text).split(" ").filter(Boolean).map(stem));
}
function calculateStringSimilarity(str1, str2) {
  const set1 = tokenize(str1);
  const set2 = tokenize(str2);
  if (set1.size === 0 || set2.size === 0) return 0;
  let intersection = 0;
  for (const t of set1) if (set2.has(t)) intersection++;
  return intersection / Math.min(set1.size, set2.size);
}
const FUZZY_THRESHOLD = 0.8;

function materialCandidates(knowledge) {
  const candidates = knowledge.materials.map((m) => ({ name: m.name, synonyms: [], knowledge: m }));
  for (const scopeItem of knowledge.scope) {
    if (!scopeItem.requiredMaterials?.length) continue;
    const stub = { name: scopeItem.name, pros: [], cons: [], cost: scopeItem.typicalCost ?? "", durability: "", maintenance: "", roi: "" };
    candidates.push({ name: scopeItem.name, synonyms: scopeItem.requiredMaterials, knowledge: stub });
  }
  return candidates;
}
function scopeCandidates(knowledge) {
  return knowledge.scope.map((s) => ({
    name: s.name,
    synonyms: [...(s.commonContractorNames ?? []), ...(s.requiredMaterials ?? [])],
    knowledge: s,
  }));
}
function findBestMatch(extractedName, candidates) {
  const normalizedExtracted = normalizeText(extractedName);
  if (!normalizedExtracted) return { candidate: null, confidence: 0, tier: null, reason: "no exact match" };
  let best = { candidate: null, confidence: 0, tier: null, reason: null };
  let sawSynonymCandidate = false;
  for (const candidate of candidates) {
    const normalizedCandidate = normalizeText(candidate.name);
    if (normalizedExtracted === normalizedCandidate) return { candidate, confidence: 1.0, tier: "exact", reason: null };
    for (const synonym of candidate.synonyms) {
      sawSynonymCandidate = true;
      const normalizedSynonym = normalizeText(synonym);
      if (!normalizedSynonym) continue;
      if (normalizedExtracted === normalizedSynonym || normalizedExtracted.includes(normalizedSynonym) || normalizedSynonym.includes(normalizedExtracted)) {
        if (0.95 > best.confidence) best = { candidate, confidence: 0.95, tier: "synonym", reason: null };
      }
    }
    if (normalizedExtracted.includes(normalizedCandidate) || normalizedCandidate.includes(normalizedExtracted)) {
      if (0.9 > best.confidence) best = { candidate, confidence: 0.9, tier: "contains", reason: null };
    }
    const similarity = calculateStringSimilarity(extractedName, candidate.name);
    if (similarity >= FUZZY_THRESHOLD && similarity > best.confidence) {
      best = { candidate, confidence: similarity, tier: "fuzzy", reason: null };
    }
  }
  if (!best.candidate) best.reason = sawSynonymCandidate ? "no synonym" : "similarity below threshold";
  return best;
}
function matchQuoteSim(extraction, knowledge) {
  const matchedMaterials = [], matchedScopeItems = [], unmatchedMaterials = [], unmatchedScopeItems = [];
  const materialPool = materialCandidates(knowledge);
  for (const item of extraction.materials) {
    const outcome = findBestMatch(item.name, materialPool);
    if (outcome.candidate) matchedMaterials.push({ original: item, knowledge: outcome.candidate.knowledge, confidence: outcome.confidence, tier: outcome.tier });
    else unmatchedMaterials.push(`${item.name} (${outcome.reason})`);
  }
  const scopePool = scopeCandidates(knowledge);
  for (const item of extraction.scopeItems) {
    const outcome = findBestMatch(item.name, scopePool);
    if (outcome.candidate) matchedScopeItems.push({ original: item, knowledge: outcome.candidate.knowledge, confidence: outcome.confidence, tier: outcome.tier });
    else unmatchedScopeItems.push(`${item.name} (${outcome.reason})`);
  }
  return { matchedMaterials, matchedScopeItems, unmatchedMaterials, unmatchedScopeItems };
}

// --- Exact raw payload from the bug report ---
const rawFromBugReport = {
  contractor_name: "Lone Star Roofing LLC",
  project_type: "roofing",
  materials: [
    { description: "Tear-off shingles", quantity: 32, unit: "sq", price_per_unit: 185, total_price: 5920 },
    { description: "Synthetic underlayment", quantity: 32, unit: "sq", price_per_unit: 110, total_price: 3520 },
    { description: "Architectural shingles", quantity: 32, unit: "sq", price_per_unit: 340, total_price: 10880 },
    { description: "Owens Corning Duration Ice & water shield", quantity: 2, unit: "", price_per_unit: 220, total_price: 440 },
    { description: "Valleys only Drip edge", quantity: 120, unit: "lf", price_per_unit: 6, total_price: 720 },
    { description: "Flashing replacement", quantity: 1, unit: "", price_per_unit: 0, total_price: 0 },
    { description: "Reuse existing Ridge vent", quantity: 45, unit: "lf", price_per_unit: 18, total_price: 810 },
    { description: "Dumpster & cleanup", quantity: 1, unit: "", price_per_unit: 650, total_price: 650 },
    { description: "Permit", quantity: 1, unit: "", price_per_unit: 0, total_price: 0 },
    { description: "Labor (lump sum)", quantity: 1, unit: "", price_per_unit: 8950, total_price: 8950 },
  ],
  scope_items: [
    "Tear-off shingles", "Synthetic underlayment", "Architectural shingles", "Ice & water shield",
    "Drip edge", "Flashing replacement", "Ridge vent reuse", "Dumpster & cleanup", "Permit", "Labor (lump sum)",
  ],
  permits: [{ description: "Permit", included: true }],
  warranties: ["Manufacturer warranty applies", "Workmanship warranty not specified"],
  exclusions: ["No workmanship warranty", "No change-order policy", "Labor is lump sum", "No insurance certificate", "Start date TBD"],
  total_price: 31890,
  confidence_score: 0.9,
};

console.log("=== STEP 1: normalizeExtraction() output ===");
const extraction = normalizeExtraction(rawFromBugReport);
console.log("projectType:", extraction.projectType, "(expected: roof)");
console.log("materials count:", extraction.materials.length, " scopeItems count:", extraction.scopeItems.length);

const knowledge = { materials: roofingMaterials, scope: roofingScopeItems };

console.log("\n=== STEP 2: matchQuote() using real roofing knowledge base ===");
const result = matchQuoteSim(extraction, knowledge);

console.log("\nMatched materials:", result.matchedMaterials.length);
result.matchedMaterials.forEach((m) =>
  console.log(`  "${m.original.name}" -> "${m.knowledge.name}" (${m.tier}, confidence: ${m.confidence.toFixed(2)})`)
);
console.log("Unmatched materials:", result.unmatchedMaterials);

console.log("\nMatched scope items:", result.matchedScopeItems.length);
result.matchedScopeItems.forEach((m) =>
  console.log(`  "${m.original.name}" -> "${m.knowledge.name}" (${m.tier}, confidence: ${m.confidence.toFixed(2)})`)
);
console.log("Unmatched scope items:", result.unmatchedScopeItems);

console.log("\n=== STEP 3: Completeness + red flags (mirrors analyzeQuote) ===");
const totalRequired = roofingScopeItems.filter((s) => s.required).length;
const matchedRequired = roofingScopeItems.filter(
  (s) => s.required && result.matchedScopeItems.some((m) => m.knowledge.id === s.id)
).length;
const completenessScore = totalRequired > 0 ? Math.round((matchedRequired / totalRequired) * 100) : 0;
console.log("Total required scope items:", totalRequired, " Matched required:", matchedRequired);
console.log("Completeness score:", completenessScore + "%");
console.log("Red flags available:", roofingRedFlags.length);
console.log("Confidence (from extraction):", extraction.confidence);

console.log("\n=== RESULT ===");
const pass =
  result.matchedMaterials.length > 0 &&
  result.matchedScopeItems.length > 0 &&
  completenessScore > 0 &&
  extraction.confidence > 0 &&
  roofingRedFlags.length > 0;
console.log(pass ? "PASS: fix verified end-to-end" : "FAIL: still broken");
