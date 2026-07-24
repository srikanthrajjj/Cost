import { knowledgeProvider } from "../knowledge-provider";
import type {
  MatchedMaterial,
  MatchedScopeItem,
  QuoteAnalysis,
  MissingItem,
  RedFlagFinding,
  BuildingCodeFinding,
  InsuranceFinding,
  Finding,
  QuoteExtraction,
} from "./types";
import type { ProjectType } from "../estimator-engine";
import type { ScopeItem, RedFlag } from "@/types/knowledge";
import { detectInstantQuoteFlags, instantFlagsToAnalysisParts } from "./instant-flags";

// ─── Item Status Classification ───────────────────────────────────────────────
// Every knowledge item falls into exactly ONE of these states:
//   ✅ Present — matched in the quote
//   ❌ Missing — required but not found anywhere in the quote
//   ⚠  Needs clarification — present but details are incomplete or ambiguous

export type ItemStatus = "present" | "missing" | "needs_clarification";

export interface ClassifiedItem {
  knowledge: ScopeItem;
  status: ItemStatus;
  /** The name under which the item appeared in the quote */
  matchedAs?: string;
  /** If needs clarification, the specific question to ask */
  clarificationQuestion?: string;
}

// ─── Major System Categories for Weighted Scoring ─────────────────────────────
// Each category gets a weight. A reroof that includes most major systems should
// not receive only 30%. The weights reflect real-world importance.

interface SystemCategory {
  name: string;
  weight: number;
  /** Scope item IDs that belong to this category */
  scopeIds: string[];
}

const ROOFING_SYSTEMS: SystemCategory[] = [
  { name: "Roof Covering", weight: 20, scopeIds: ["starter_strip"] },
  { name: "Underlayment & Protection", weight: 15, scopeIds: ["ice_water_shield"] },
  { name: "Ventilation", weight: 12, scopeIds: ["ridge_vents", "soffit_vents"] },
  { name: "Edge Protection", weight: 12, scopeIds: ["drip_edge"] },
  { name: "Water Management", weight: 12, scopeIds: ["valley_flashing", "flashing_penetrations"] },
  { name: "Tear-off & Cleanup", weight: 12, scopeIds: ["tear_off_layers"] },
  { name: "Structural Inspection", weight: 8, scopeIds: ["deck_inspection"] },
  { name: "Weather Protection", weight: 5, scopeIds: ["weather_protection"] },
  { name: "Warranty & Permits", weight: 4, scopeIds: [] }, // checked via extracted.warranties/permits
];

// ─── Fuzzy Evidence Detection ─────────────────────────────────────────────────
// Checks if a knowledge scope item has ANY related evidence in the quote, even
// if the matcher didn't find an exact match. This prevents marking items as
// "missing" when partial evidence exists.

function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-_&]/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Searches all extracted items (materials + scope + notes) for evidence that
 * a particular knowledge item is addressed in the quote.
 * Returns the matched quote line name if found, null otherwise.
 */
function findEvidenceInQuote(
  scopeItem: ScopeItem,
  extracted: QuoteExtraction,
): { matchedAs: string; notes?: string } | null {
  const scopeNameLower = normalizeForSearch(scopeItem.name);
  const scopeWords = scopeNameLower.split(" ").filter((w) => w.length > 3);

  // Build search terms from the knowledge item
  const searchTerms: string[] = [
    scopeNameLower,
    ...(scopeItem.commonContractorNames ?? []).map(normalizeForSearch),
    ...(scopeItem.requiredMaterials ?? []).map(normalizeForSearch),
  ];

  // Additional keyword-based matching for common items
  const keywordMap: Record<string, string[]> = {
    tear_off_layers: [
      "tear off",
      "tear-off",
      "tearoff",
      "remove shingles",
      "removal",
      "dumpster",
      "cleanup",
      "clean up",
      "disposal",
    ],
    drip_edge: ["drip edge", "drip-edge", "dripedge"],
    valley_flashing: ["valley flashing", "valley", "flashing"],
    starter_strip: ["starter strip", "starter", "shingles", "architectural"],
    ridge_vents: ["ridge vent", "ridge cap", "ridge"],
    soffit_vents: ["soffit vent", "soffit", "intake vent"],
    flashing_penetrations: ["flashing", "pipe boot", "boot", "penetration"],
    ice_water_shield: ["ice and water", "ice & water", "ice shield", "water shield", "ice water"],
    deck_inspection: ["deck inspect", "deck repair", "plywood", "osb", "sheathing", "deck"],
    weather_protection: ["tarp", "weather protect", "rain protect"],
  };

  const itemKeywords = keywordMap[scopeItem.id ?? ""] ?? [];

  // Search through ALL extracted items
  const allExtractedNames: { name: string; notes?: string }[] = [
    ...extracted.materials.map((m) => ({ name: m.name, notes: m.notes })),
    ...extracted.scopeItems.map((s) => ({ name: s.name, notes: s.notes ?? s.description })),
  ];

  for (const item of allExtractedNames) {
    const itemNameLower = normalizeForSearch(item.name);

    // Direct name match
    if (itemNameLower.includes(scopeNameLower) || scopeNameLower.includes(itemNameLower)) {
      return { matchedAs: item.name, notes: item.notes };
    }

    // Keyword match
    for (const kw of itemKeywords) {
      if (itemNameLower.includes(kw)) {
        return { matchedAs: item.name, notes: item.notes };
      }
    }

    // Search term match
    for (const term of searchTerms) {
      if (term.length > 3 && itemNameLower.includes(term)) {
        return { matchedAs: item.name, notes: item.notes };
      }
    }

    // Word overlap (if 2+ significant words from scope item appear in quote line)
    if (scopeWords.length >= 2) {
      const matchCount = scopeWords.filter((w) => itemNameLower.includes(w)).length;
      if (matchCount >= 2) {
        return { matchedAs: item.name, notes: item.notes };
      }
    }
  }

  return null;
}

// ─── Clarification Detection ──────────────────────────────────────────────────

function detectClarificationNeeded(notes: string | undefined, scopeItem: ScopeItem): string | null {
  const combined = (notes ?? "").toLowerCase().trim();
  if (!combined) return null;

  const scopeNameLower = scopeItem.name.toLowerCase();

  // "Valleys only" on ice & water shield → ask about eaves
  if (
    scopeNameLower.includes("ice") &&
    scopeNameLower.includes("water") &&
    combined.includes("valleys only")
  ) {
    return `Listed as "valleys only." Confirm whether eaves and other vulnerable areas are also covered per local code requirements.`;
  }

  // "Reuse existing" on flashing → ask if new flashing will be installed
  if (scopeNameLower.includes("flashing") && combined.includes("reuse existing")) {
    return `Shows "reuse existing." Confirm whether new flashing will be installed at penetrations and valleys where code requires it.`;
  }

  // Generic "reuse" on any required item
  if (combined.includes("reuse existing") || combined.includes("re-use existing")) {
    return `Indicates reuse of existing materials. Verify whether replacement is needed for code compliance or manufacturer warranty.`;
  }

  // Vague grades / finishes that hide upgrade costs
  if (
    /\bbuilder[\s-]?grade\b/.test(combined) ||
    /\bstandard[\s-]?grade\b/.test(combined) ||
    /\bhigh[\s-]?end\s+finish/.test(combined) ||
    /\bpremium\s+finish/.test(combined)
  ) {
    return `Uses vague grade or finish language. Confirm exact brand, model, and finish so upgrades cannot be billed later.`;
  }

  // "Per homeowner" or "by owner" on permits
  if (
    combined.includes("homeowner") ||
    combined.includes("by owner") ||
    combined.includes("owner responsibility")
  ) {
    return `Responsibility assigned to homeowner. Confirm local permit requirements and factor additional costs.`;
  }

  return null;
}

// ─── Weighted Completeness Scoring ────────────────────────────────────────────

function calculateWeightedScore(
  classifiedItems: ClassifiedItem[],
  extracted: QuoteExtraction,
  projectType: string,
): number {
  // For roofing, use the weighted system
  if (projectType === "roof") {
    let earnedWeight = 0;
    let totalWeight = 0;

    for (const system of ROOFING_SYSTEMS) {
      totalWeight += system.weight;

      if (system.name === "Warranty & Permits") {
        // Special handling: check extracted warranties and permits
        const hasWarranty = extracted.warranties.length > 0;
        const hasPermits = extracted.permits.length > 0;
        if (hasWarranty && hasPermits) earnedWeight += system.weight;
        else if (hasWarranty || hasPermits) earnedWeight += system.weight * 0.5;
        continue;
      }

      // Check if any scope item in this category is present
      const categoryItems = classifiedItems.filter((i) =>
        system.scopeIds.includes(i.knowledge.id ?? ""),
      );

      if (categoryItems.length === 0) {
        // No items in this category in the knowledge base — skip
        totalWeight -= system.weight;
        continue;
      }

      const presentInCategory = categoryItems.filter((i) => i.status === "present").length;
      const clarifyInCategory = categoryItems.filter(
        (i) => i.status === "needs_clarification",
      ).length;
      const totalInCategory = categoryItems.length;

      // Weighted: present = full, clarification = 75%, missing = 0
      const categoryScore = (presentInCategory + clarifyInCategory * 0.75) / totalInCategory;
      earnedWeight += system.weight * categoryScore;
    }

    // Also give credit for materials matching (shingles, underlayment, etc.)
    // If the quote has shingle materials, that covers "Roof Covering"
    const hasRoofCovering = extracted.materials.some((m) => {
      const n = m.name.toLowerCase();
      return (
        n.includes("shingle") ||
        n.includes("architectural") ||
        n.includes("asphalt") ||
        n.includes("metal") ||
        n.includes("tile") ||
        n.includes("slate")
      );
    });
    if (hasRoofCovering) {
      // Find "Roof Covering" system and ensure it gets full weight
      const roofCoveringSystem = ROOFING_SYSTEMS.find((s) => s.name === "Roof Covering");
      if (roofCoveringSystem) {
        const categoryItems = classifiedItems.filter((i) =>
          roofCoveringSystem.scopeIds.includes(i.knowledge.id ?? ""),
        );
        const alreadyCounted = categoryItems.some((i) => i.status === "present");
        if (!alreadyCounted) {
          earnedWeight += roofCoveringSystem.weight;
        }
      }
    }

    // Check for underlayment in materials
    const hasUnderlayment = extracted.materials.some((m) => {
      const n = m.name.toLowerCase();
      return n.includes("underlayment") || n.includes("synthetic") || n.includes("felt");
    });
    if (hasUnderlayment) {
      const underlaymentSystem = ROOFING_SYSTEMS.find(
        (s) => s.name === "Underlayment & Protection",
      );
      if (underlaymentSystem) {
        const categoryItems = classifiedItems.filter((i) =>
          underlaymentSystem.scopeIds.includes(i.knowledge.id ?? ""),
        );
        const alreadyCounted = categoryItems.some((i) => i.status === "present");
        if (!alreadyCounted) {
          earnedWeight += underlaymentSystem.weight * 0.8; // partial credit
        }
      }
    }

    return totalWeight > 0 ? Math.min(100, Math.round((earnedWeight / totalWeight) * 100)) : 0;
  }

  // Default scoring for non-roofing projects
  const totalRequired = classifiedItems.length;
  if (totalRequired === 0) return 100;
  const presentCount = classifiedItems.filter((i) => i.status === "present").length;
  const clarifyCount = classifiedItems.filter((i) => i.status === "needs_clarification").length;
  return Math.round(((presentCount + clarifyCount * 0.75) / totalRequired) * 100);
}

// ─── Core Analyzer ────────────────────────────────────────────────────────────

export async function analyzeQuote(
  extracted: QuoteExtraction,
  matchedMaterials: MatchedMaterial[],
  matchedScopeItems: MatchedScopeItem[],
  unmatchedMaterials: string[],
  unmatchedScopeItems: string[],
): Promise<QuoteAnalysis> {
  const projectType = extracted.projectType as ProjectType;
  const knowledge = projectType ? await knowledgeProvider.getKnowledge(projectType) : null;

  const presentItems: { name: string; matchedAs: string; clarification?: string }[] = [];
  const needsClarification: { name: string; matchedAs: string; question: string }[] = [];
  const missingScope: MissingItem[] = [];
  const missingMaterials: MissingItem[] = [];
  const commonOmissions: Finding[] = [];
  const redFlags: RedFlagFinding[] = [];
  const buildingCodes: BuildingCodeFinding[] = [];
  const insuranceConsiderations: InsuranceFinding[] = [];
  const questionsToAsk: string[] = [];
  const recommendations: string[] = [];

  if (!knowledge) {
    const instant = instantFlagsToAnalysisParts(detectInstantQuoteFlags(extracted));
    return {
      summary: {
        totalItems:
          matchedMaterials.length +
          matchedScopeItems.length +
          unmatchedMaterials.length +
          unmatchedScopeItems.length,
        matchedItems: matchedMaterials.length + matchedScopeItems.length,
        unmatchedItems: unmatchedMaterials.length + unmatchedScopeItems.length,
        completenessScore: 0,
        quoteHealthScore: 0,
      },
      presentItems,
      needsClarification: instant.needsClarification,
      missingScope: instant.missingScope,
      missingMaterials,
      commonOmissions,
      redFlags: instant.redFlags,
      buildingCodes,
      insuranceConsiderations,
      questionsToAsk: instant.questionsToAsk,
      recommendations: instant.recommendations,
      confidence: extracted.confidence || 0.5,
    };
  }

  // ─── STEP 1: Classify each required scope item ──────────────────────────────
  // Uses THREE levels of matching:
  //   1. Direct scope item match from matcher
  //   2. Material bridge match (scope item matched as a material)
  //   3. Fuzzy evidence search (keywords, related names in extracted data)
  const classifiedItems: ClassifiedItem[] = [];

  for (const scopeItem of knowledge.scope) {
    if (!scopeItem.required) continue;

    // Level 1: Direct match from matcher pipeline
    const directMatch = matchedScopeItems.find((m) => m.knowledge.id === scopeItem.id);

    if (directMatch) {
      const notes = directMatch.original.notes ?? directMatch.original.description;
      const clarification = detectClarificationNeeded(notes, scopeItem);
      if (clarification) {
        classifiedItems.push({
          knowledge: scopeItem,
          status: "needs_clarification",
          matchedAs: directMatch.original.name,
          clarificationQuestion: clarification,
        });
      } else {
        classifiedItems.push({
          knowledge: scopeItem,
          status: "present",
          matchedAs: directMatch.original.name,
        });
      }
      continue;
    }

    // Level 2: Material bridge match
    const materialBridge = matchedMaterials.find(
      (m) => m.knowledge.name.toLowerCase() === scopeItem.name.toLowerCase(),
    );
    if (materialBridge) {
      const notes = materialBridge.original.notes;
      const clarification = detectClarificationNeeded(notes, scopeItem);
      if (clarification) {
        classifiedItems.push({
          knowledge: scopeItem,
          status: "needs_clarification",
          matchedAs: materialBridge.original.name,
          clarificationQuestion: clarification,
        });
      } else {
        classifiedItems.push({
          knowledge: scopeItem,
          status: "present",
          matchedAs: materialBridge.original.name,
        });
      }
      continue;
    }

    // Level 3: Fuzzy evidence search across all extracted items
    const evidence = findEvidenceInQuote(scopeItem, extracted);
    if (evidence) {
      const clarification = detectClarificationNeeded(evidence.notes, scopeItem);
      if (clarification) {
        classifiedItems.push({
          knowledge: scopeItem,
          status: "needs_clarification",
          matchedAs: evidence.matchedAs,
          clarificationQuestion: clarification,
        });
      } else {
        classifiedItems.push({
          knowledge: scopeItem,
          status: "present",
          matchedAs: evidence.matchedAs,
        });
      }
      continue;
    }

    // No evidence found — genuinely missing
    classifiedItems.push({ knowledge: scopeItem, status: "missing" });
  }

  // ─── STEP 2: Populate presentItems list (explicit names) ────────────────────
  // Include: (a) classified knowledge items that are present, (b) matched materials
  // and scope items that aren't already tracked via knowledge classification.
  const presentNamesSet = new Set<string>();

  for (const item of classifiedItems) {
    if (item.status === "present") {
      const name = item.knowledge.name;
      presentItems.push({
        name,
        matchedAs: item.matchedAs ?? name,
      });
      presentNamesSet.add(name.toLowerCase());
      if (item.matchedAs) presentNamesSet.add(item.matchedAs.toLowerCase());
    }
  }

  // Also add matched materials not already in presentItems
  for (const mat of matchedMaterials) {
    const matName = mat.original.name;
    if (
      !presentNamesSet.has(matName.toLowerCase()) &&
      !presentNamesSet.has(mat.knowledge.name.toLowerCase())
    ) {
      presentItems.push({
        name: mat.original.name,
        matchedAs: mat.original.name,
      });
      presentNamesSet.add(matName.toLowerCase());
    }
  }

  // Also add matched scope items not already in presentItems
  for (const scope of matchedScopeItems) {
    const scopeName = scope.original.name;
    if (
      !presentNamesSet.has(scopeName.toLowerCase()) &&
      !presentNamesSet.has(scope.knowledge.name.toLowerCase())
    ) {
      presentItems.push({
        name: scope.original.name,
        matchedAs: scope.original.name,
      });
      presentNamesSet.add(scopeName.toLowerCase());
    }
  }

  // Add notable unmatched items from the quote that represent real work (e.g. "Labor")
  const importantUnmatchedKeywords = [
    "labor",
    "installation",
    "cleanup",
    "dumpster",
    "disposal",
    "delivery",
  ];
  for (const item of extracted.scopeItems) {
    const nameLower = item.name.toLowerCase();
    if (
      !presentNamesSet.has(nameLower) &&
      importantUnmatchedKeywords.some((kw) => nameLower.includes(kw))
    ) {
      presentItems.push({ name: item.name, matchedAs: item.name });
      presentNamesSet.add(nameLower);
    }
  }
  for (const item of extracted.materials) {
    const nameLower = item.name.toLowerCase();
    if (
      !presentNamesSet.has(nameLower) &&
      importantUnmatchedKeywords.some((kw) => nameLower.includes(kw))
    ) {
      presentItems.push({ name: item.name, matchedAs: item.name });
      presentNamesSet.add(nameLower);
    }
  }

  // ─── STEP 3: Populate needsClarification list ───────────────────────────────
  for (const item of classifiedItems) {
    if (item.status === "needs_clarification") {
      needsClarification.push({
        name: item.knowledge.name,
        matchedAs: item.matchedAs ?? item.knowledge.name,
        question: item.clarificationQuestion!,
      });
      // Also add to commonOmissions for backward compat
      commonOmissions.push({
        id: `clarify-${item.knowledge.id}`,
        severity: "medium",
        title: `Needs Clarification: ${item.knowledge.name}`,
        explanation: item.clarificationQuestion!,
        recommendation: item.clarificationQuestion!,
      });
    }
  }

  // ─── STEP 4: Report ONLY truly missing items ───────────────────────────────
  for (const item of classifiedItems) {
    if (item.status === "missing") {
      missingScope.push({
        id: `missing-scope-${item.knowledge.id}`,
        severity: "high",
        title: `Missing: ${item.knowledge.name}`,
        explanation: item.knowledge.description,
        recommendation: `Ask contractor whether ${item.knowledge.name} is included in the scope of work.`,
      });
    }
  }

  // ─── STEP 5: Red flags — ONLY when supported by quote evidence ──────────────
  const quoteTextLower = buildQuoteSearchText(extracted);

  for (const flag of knowledge.redFlags) {
    const evidence = findRedFlagEvidence(flag, extracted, quoteTextLower);
    if (evidence) {
      redFlags.push({
        id: `redflag-${flag.flag.substring(0, 20).replace(/\s/g, "-")}`,
        severity: flag.severity,
        title: flag.flag,
        explanation: `Evidence in quote: ${evidence}`,
        howToSpot: flag.howToSpot,
        recommendation: `Verify with contractor: ${flag.explanation}`,
      });
    }
  }

  // ─── STEP 6: Building codes — informational ─────────────────────────────────
  for (const code of knowledge.buildingCodes) {
    buildingCodes.push({
      id: `code-${code.code.substring(0, 20).replace(/\s/g, "-")}`,
      severity: "low",
      title: `Building Code: ${code.code}`,
      explanation: code.requirement,
      codeReference: code.code,
      inspectionRequired: code.inspection,
      recommendation: code.inspection
        ? "Requires inspection — confirm contractor handles permit and scheduling."
        : "Verify compliance with local building department.",
    });
  }

  // ─── STEP 7: Insurance — factual ───────────────────────────────────────────
  for (const rule of knowledge.insurance) {
    insuranceConsiderations.push({
      id: `insurance-${rule.rule.substring(0, 20).replace(/\s/g, "-")}`,
      severity: "low",
      title: rule.rule,
      explanation: rule.note,
      coverage: rule.coverage,
      recommendation: rule.coverage
        ? "Document for potential insurance claim."
        : "Not typically covered — plan for out-of-pocket cost.",
    });
  }

  // ─── STEP 8: Contractor questions ───────────────────────────────────────────
  // Questions from clarification items
  for (const item of classifiedItems) {
    if (item.status === "needs_clarification" && item.clarificationQuestion) {
      questionsToAsk.push(item.clarificationQuestion);
    }
  }
  // Questions from missing items
  for (const item of classifiedItems) {
    if (item.status === "missing" && item.knowledge.contractorQuestions) {
      for (const q of item.knowledge.contractorQuestions) {
        questionsToAsk.push(q);
      }
    }
  }
  // General contractor questions (limit 4)
  for (const q of knowledge.questions.slice(0, 4)) {
    questionsToAsk.push(`${q.question} (${q.category})`);
  }

  // ─── STEP 9: Recommendations ───────────────────────────────────────────────
  if (extracted.permits.length === 0) {
    recommendations.push(
      "No permits mentioned in the quote. Confirm who is responsible for obtaining required building permits.",
    );
  } else {
    const permitText = extracted.permits.join(" ").toLowerCase();
    if (permitText.includes("owner") || permitText.includes("homeowner")) {
      recommendations.push(
        "Quote states permits are homeowner's responsibility. Confirm local requirements and factor permit costs into your budget.",
      );
    }
  }
  if (extracted.warranties.length === 0) {
    recommendations.push(
      "No warranty information found. Ask contractor for workmanship warranty terms in writing.",
    );
  }

  // Instant field checks: missing permits + vague grade/finish language
  const instant = instantFlagsToAnalysisParts(detectInstantQuoteFlags(extracted));
  const seenTitles = new Set(redFlags.map((f) => f.title.toLowerCase()));
  for (const flag of instant.redFlags) {
    if (!seenTitles.has(flag.title.toLowerCase())) {
      redFlags.push(flag);
      seenTitles.add(flag.title.toLowerCase());
    }
  }
  const seenMissing = new Set(missingScope.map((m) => m.title.toLowerCase()));
  for (const miss of instant.missingScope) {
    if (!seenMissing.has(miss.title.toLowerCase())) {
      missingScope.push(miss);
      seenMissing.add(miss.title.toLowerCase());
    }
  }
  for (const c of instant.needsClarification) {
    if (!needsClarification.some((x) => x.question === c.question)) {
      needsClarification.push(c);
    }
  }
  for (const q of instant.questionsToAsk) {
    if (!questionsToAsk.includes(q)) questionsToAsk.push(q);
  }
  for (const r of instant.recommendations) {
    if (!recommendations.includes(r)) recommendations.push(r);
  }

  // ─── STEP 10: Weighted completeness score ──────────────────────────────────
  const completenessScore = calculateWeightedScore(classifiedItems, extracted, projectType);

  return {
    summary: {
      totalItems:
        matchedMaterials.length +
        matchedScopeItems.length +
        unmatchedMaterials.length +
        unmatchedScopeItems.length,
      matchedItems: matchedMaterials.length + matchedScopeItems.length,
      unmatchedItems: unmatchedMaterials.length + unmatchedScopeItems.length,
      completenessScore,
      quoteHealthScore: completenessScore,
    },
    presentItems,
    needsClarification,
    missingScope,
    missingMaterials,
    commonOmissions,
    redFlags,
    buildingCodes,
    insuranceConsiderations,
    questionsToAsk,
    recommendations,
    confidence: extracted.confidence || 0.8,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildQuoteSearchText(extracted: QuoteExtraction): string {
  const parts: string[] = [];
  for (const m of extracted.materials) {
    parts.push(m.name);
    if (m.notes) parts.push(m.notes);
  }
  for (const s of extracted.scopeItems) {
    parts.push(s.name);
    if (s.description) parts.push(s.description);
    if (s.notes) parts.push(s.notes);
  }
  for (const p of extracted.permits) parts.push(p);
  for (const w of extracted.warranties) parts.push(w);
  for (const e of extracted.exclusions) parts.push(e);
  return parts.join(" ").toLowerCase();
}

function findRedFlagEvidence(
  flag: RedFlag,
  extracted: QuoteExtraction,
  quoteTextLower: string,
): string | null {
  const flagLower = flag.flag.toLowerCase();

  // Payment/deposit red flags
  if (flagLower.includes("payment") || flagLower.includes("deposit")) {
    if (
      quoteTextLower.includes("full payment upfront") ||
      quoteTextLower.includes("100% deposit") ||
      quoteTextLower.includes("full payment before")
    ) {
      return "Quote requests full payment before work begins.";
    }
    const depositMatch = quoteTextLower.match(/(\d+)%?\s*deposit/);
    if (depositMatch) {
      const pct = parseInt(depositMatch[1]);
      if (pct >= 60) {
        return `Quote requires ${pct}% deposit — above industry norm of 10-30%.`;
      }
    }
  }

  // Warranty red flags
  if (flagLower.includes("no warranty") || flagLower.includes("warranty")) {
    if (
      quoteTextLower.includes("no warranty") ||
      quoteTextLower.includes("as-is") ||
      quoteTextLower.includes("no guarantee")
    ) {
      return "Quote explicitly states no warranty or as-is terms.";
    }
  }

  // License/insurance red flags
  if (flagLower.includes("license") || flagLower.includes("insurance")) {
    if (
      quoteTextLower.includes("not licensed") ||
      quoteTextLower.includes("no license") ||
      quoteTextLower.includes("not insured") ||
      quoteTextLower.includes("no insurance")
    ) {
      return "Quote or contractor information indicates missing license/insurance.";
    }
  }

  // Pressure tactics
  if (flagLower.includes("pressure") || flagLower.includes("same-day")) {
    if (
      quoteTextLower.includes("today only") ||
      quoteTextLower.includes("expires today") ||
      quoteTextLower.includes("sign today") ||
      quoteTextLower.includes("same day") ||
      quoteTextLower.includes("limited time")
    ) {
      return "Quote uses pressure language suggesting urgency to sign.";
    }
  }

  // Storm chaser indicators
  if (flagLower.includes("storm") && flagLower.includes("chaser")) {
    if (
      quoteTextLower.includes("storm damage specialist") ||
      quoteTextLower.includes("insurance claim") ||
      quoteTextLower.includes("we handle your claim")
    ) {
      return "Quote mentions handling insurance claims — potential storm chaser tactic.";
    }
  }

  // Per-layer removal
  if (flagLower.includes("per-layer") || flagLower.includes("per layer")) {
    if (
      quoteTextLower.includes("per layer") ||
      quoteTextLower.includes("per-layer") ||
      quoteTextLower.includes("2-layer removal fee") ||
      quoteTextLower.includes("multi-layer fee")
    ) {
      return "Quote charges per-layer removal fee instead of flat project price.";
    }
  }

  // Vague material grade / finish language
  if (
    flagLower.includes("vague material") ||
    flagLower.includes("builder grade") ||
    (flagLower.includes("grade") && flagLower.includes("finish"))
  ) {
    if (
      quoteTextLower.includes("builder grade") ||
      quoteTextLower.includes("builder-grade") ||
      quoteTextLower.includes("standard grade") ||
      quoteTextLower.includes("high-end finish") ||
      quoteTextLower.includes("high end finish") ||
      quoteTextLower.includes("premium finish") ||
      quoteTextLower.includes("contractor grade")
    ) {
      return "Quote uses vague grade or finish language without locking product specs.";
    }
  }

  // Permit skip / "no permit needed"
  if (flagLower.includes("permit")) {
    if (
      quoteTextLower.includes("no permit") ||
      quoteTextLower.includes("permit not needed") ||
      quoteTextLower.includes("permits aren't needed") ||
      quoteTextLower.includes("skip the permit") ||
      quoteTextLower.includes("permit not included")
    ) {
      return "Quote downplays or excludes permit requirements.";
    }
  }

  // Below-market and structural assessment — cannot determine from quote alone
  if (flagLower.includes("below-market") || flagLower.includes("structural assessment")) {
    return null;
  }

  return null;
}
