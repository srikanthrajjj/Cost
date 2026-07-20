// ─── Kitchen Cost Engine ─────────────────────────────────────────────────────
// Pure function that computes kitchen remodel estimates from collected answers.
// Applies regional multipliers, material cost adjustments, and scope factors.
// Validates: Requirements 6.3, 6.4, 10.4

import type {
  KitchenEstimateAnswers,
  KitchenLiveEstimate,
  CostBreakdownItem,
  MaterialRecommendation,
} from "./types";
import type { KitchenCostParams } from "./cost-params";

// ─── Constants ───────────────────────────────────────────────────────────────

const MIN_ESTIMATE = 5000;
const MAX_ESTIMATE = 250000;

// Kitchen size multipliers (base costs assume medium kitchen)
const SIZE_MULTIPLIERS: Record<string, number> = {
  small: 0.7,
  medium: 1.0,
  large: 1.5,
};

// Timeline urgency premiums
const TIMELINE_MULTIPLIERS: Record<string, number> = {
  flexible: 1.0,
  under8weeks: 1.1,
  hard: 1.2,
};

// Condition discount/premium (affects labor and structural)
const CONDITION_MULTIPLIERS: Record<string, number> = {
  excellent: 0.85,
  good: 1.0,
  fair: 1.15,
  poor: 1.35,
};

// ─── ZIP-to-State Mapping (first 3 digits of ZIP) ───────────────────────────

const ZIP_PREFIX_TO_STATE: Record<string, string> = {
  "900": "CA", "901": "CA", "902": "CA", "903": "CA", "904": "CA",
  "905": "CA", "906": "CA", "907": "CA", "908": "CA", "910": "CA",
  "911": "CA", "912": "CA", "913": "CA", "914": "CA", "915": "CA",
  "916": "CA", "917": "CA", "918": "CA", "919": "CA", "920": "CA",
  "921": "CA", "922": "CA", "923": "CA", "924": "CA", "925": "CA",
  "926": "CA", "927": "CA", "928": "CA", "930": "CA", "931": "CA",
  "932": "CA", "933": "CA", "934": "CA", "935": "CA", "936": "CA",
  "937": "CA", "938": "CA", "939": "CA", "940": "CA", "941": "CA",
  "942": "CA", "943": "CA", "944": "CA", "945": "CA", "946": "CA",
  "947": "CA", "948": "CA", "949": "CA", "950": "CA", "951": "CA",
  "952": "CA", "953": "CA", "954": "CA", "955": "CA", "956": "CA",
  "957": "CA", "958": "CA", "959": "CA", "960": "CA", "961": "CA",
  "100": "NY", "101": "NY", "102": "NY", "103": "NY", "104": "NY",
  "105": "NY", "106": "NY", "107": "NY", "108": "NY", "109": "NY",
  "110": "NY", "111": "NY", "112": "NY", "113": "NY", "114": "NY",
  "115": "NY", "116": "NY", "117": "NY", "118": "NY", "119": "NY",
  "120": "NY", "121": "NY", "122": "NY", "123": "NY", "124": "NY",
  "125": "NY", "126": "NY", "127": "NY", "128": "NY", "129": "NY",
  "130": "NY", "131": "NY", "132": "NY", "133": "NY", "134": "NY",
  "135": "NY", "136": "NY", "137": "NY", "138": "NY", "139": "NY",
  "140": "NY", "141": "NY", "142": "NY", "143": "NY", "144": "NY",
  "145": "NY", "146": "NY", "147": "NY", "148": "NY", "149": "NY",
  "750": "TX", "751": "TX", "752": "TX", "753": "TX", "754": "TX",
  "755": "TX", "756": "TX", "757": "TX", "758": "TX", "759": "TX",
  "760": "TX", "761": "TX", "762": "TX", "763": "TX", "764": "TX",
  "765": "TX", "766": "TX", "767": "TX", "768": "TX", "769": "TX",
  "770": "TX", "771": "TX", "772": "TX", "773": "TX", "774": "TX",
  "775": "TX", "776": "TX", "777": "TX", "778": "TX", "779": "TX",
  "780": "TX", "781": "TX", "782": "TX", "783": "TX", "784": "TX",
  "785": "TX", "786": "TX", "787": "TX", "788": "TX", "789": "TX",
  "790": "TX", "791": "TX", "792": "TX", "793": "TX", "794": "TX",
  "795": "TX", "796": "TX", "797": "TX", "798": "TX", "799": "TX",
  "320": "FL", "321": "FL", "322": "FL", "323": "FL", "324": "FL",
  "325": "FL", "326": "FL", "327": "FL", "328": "FL", "329": "FL",
  "330": "FL", "331": "FL", "332": "FL", "333": "FL", "334": "FL",
  "335": "FL", "336": "FL", "337": "FL", "338": "FL", "339": "FL",
  "010": "MA", "011": "MA", "012": "MA", "013": "MA", "014": "MA",
  "015": "MA", "016": "MA", "017": "MA", "018": "MA", "019": "MA",
  "020": "MA", "021": "MA", "022": "MA", "023": "MA", "024": "MA",
  "025": "MA", "026": "MA", "027": "MA",
  "980": "WA", "981": "WA", "982": "WA", "983": "WA", "984": "WA",
  "985": "WA", "986": "WA", "990": "WA", "991": "WA", "992": "WA",
  "993": "WA", "994": "WA",
  "800": "CO", "801": "CO", "802": "CO", "803": "CO", "804": "CO",
  "805": "CO", "806": "CO", "807": "CO", "808": "CO", "809": "CO",
  "810": "CO", "811": "CO", "812": "CO", "813": "CO", "814": "CO",
  "815": "CO", "816": "CO",
  "300": "GA", "301": "GA", "302": "GA", "303": "GA", "304": "GA",
  "305": "GA", "306": "GA", "307": "GA", "308": "GA", "309": "GA",
  "310": "GA", "311": "GA", "312": "GA", "313": "GA", "314": "GA",
  "315": "GA", "316": "GA", "317": "GA", "318": "GA", "319": "GA",
  "430": "OH", "431": "OH", "432": "OH", "433": "OH", "434": "OH",
  "435": "OH", "436": "OH", "437": "OH", "438": "OH", "439": "OH",
  "440": "OH", "441": "OH", "442": "OH", "443": "OH", "444": "OH",
  "445": "OH", "446": "OH", "447": "OH", "448": "OH", "449": "OH",
  "450": "OH", "451": "OH", "452": "OH", "453": "OH", "454": "OH",
  "455": "OH", "456": "OH", "457": "OH", "458": "OH",
  "967": "HI", "968": "HI",
  "995": "AK", "996": "AK", "997": "AK", "998": "AK", "999": "AK",
};

// ─── Helper Functions ────────────────────────────────────────────────────────

/**
 * Resolves the regional multiplier from state or ZIP code.
 * Falls back to 1.0 if no match is found.
 */
function getRegionalMultiplier(
  answers: KitchenEstimateAnswers,
  regionalMultipliers: Record<string, number>
): number {
  // Try state first
  if (answers.state && regionalMultipliers[answers.state] !== undefined) {
    return regionalMultipliers[answers.state];
  }

  // Try ZIP prefix lookup
  if (answers.zipCode && answers.zipCode.length >= 3) {
    const prefix = answers.zipCode.substring(0, 3);
    const state = ZIP_PREFIX_TO_STATE[prefix];
    if (state && regionalMultipliers[state] !== undefined) {
      return regionalMultipliers[state];
    }
  }

  return 1.0;
}

/**
 * Computes category costs by applying size, scope, material, and regional multipliers.
 */
function computeCategoryCosts(
  answers: KitchenEstimateAnswers,
  params: KitchenCostParams,
  regionalMultiplier: number
): { low: Record<string, number>; mid: Record<string, number>; high: Record<string, number> } {
  const sizeMultiplier = SIZE_MULTIPLIERS[answers.kitchenSize] ?? 1.0;
  const scopeFactor = params.scopeFactors[answers.remodelScope] ?? 1.0;
  const timelineMultiplier = TIMELINE_MULTIPLIERS[answers.timeline] ?? 1.0;
  const conditionMultiplier = CONDITION_MULTIPLIERS[answers.overallCondition ?? "good"] ?? 1.0;

  const low: Record<string, number> = {};
  const mid: Record<string, number> = {};
  const high: Record<string, number> = {};

  for (const [category, baseCost] of Object.entries(params.baseCosts)) {
    let categoryLow = baseCost.low;
    let categoryMid = baseCost.mid;
    let categoryHigh = baseCost.high;

    // Apply size multiplier
    categoryLow *= sizeMultiplier;
    categoryMid *= sizeMultiplier;
    categoryHigh *= sizeMultiplier;

    // Apply scope factor
    categoryLow *= scopeFactor;
    categoryMid *= scopeFactor;
    categoryHigh *= scopeFactor;

    // Apply material multipliers per category
    if (category === "cabinets") {
      const cabinetMult = params.materialMultipliers[answers.cabinetType] ?? 1.0;
      categoryLow *= cabinetMult;
      categoryMid *= cabinetMult;
      categoryHigh *= cabinetMult;
    }

    if (category === "countertops") {
      if (answers.countertopMaterial === "keep") {
        // No countertop cost if keeping existing
        categoryLow = 0;
        categoryMid = 0;
        categoryHigh = 0;
      } else {
        const counterMult = params.materialMultipliers[answers.countertopMaterial] ?? 1.0;
        categoryLow *= counterMult;
        categoryMid *= counterMult;
        categoryHigh *= counterMult;
      }
    }

    if (category === "flooring") {
      if (answers.flooringChoice === "keep" || answers.flooringChoice === "none") {
        categoryLow = 0;
        categoryMid = 0;
        categoryHigh = 0;
      } else {
        const floorMult = params.materialMultipliers[answers.flooringChoice] ?? 1.0;
        categoryLow *= floorMult;
        categoryMid *= floorMult;
        categoryHigh *= floorMult;
      }
    }

    if (category === "appliances") {
      if (answers.applianceTier === "keep") {
        categoryLow = 0;
        categoryMid = 0;
        categoryHigh = 0;
      } else {
        const applianceMult = params.materialMultipliers[answers.applianceTier] ?? 1.0;
        categoryLow *= applianceMult;
        categoryMid *= applianceMult;
        categoryHigh *= applianceMult;
      }
    }

    // Apply condition multiplier to labor and structural categories
    if (category === "labor" || category === "structural") {
      categoryLow *= conditionMultiplier;
      categoryMid *= conditionMultiplier;
      categoryHigh *= conditionMultiplier;
    }

    // Structural changes boost
    if (category === "structural" && answers.structuralChanges.length > 0) {
      const structuralBoost = 1 + answers.structuralChanges.length * 0.3;
      categoryLow *= structuralBoost;
      categoryMid *= structuralBoost;
      categoryHigh *= structuralBoost;
    } else if (category === "structural" && answers.structuralChanges.length === 0) {
      // No structural work needed
      categoryLow = 0;
      categoryMid = 0;
      categoryHigh = 0;
    }

    // Apply regional multiplier
    categoryLow *= regionalMultiplier;
    categoryMid *= regionalMultiplier;
    categoryHigh *= regionalMultiplier;

    // Apply timeline multiplier
    categoryLow *= timelineMultiplier;
    categoryMid *= timelineMultiplier;
    categoryHigh *= timelineMultiplier;

    low[category] = Math.round(categoryLow);
    mid[category] = Math.round(categoryMid);
    high[category] = Math.round(categoryHigh);
  }

  // Add contingency (10-15% of total)
  const midTotal = Object.values(mid).reduce((sum, v) => sum + v, 0);
  low["contingency"] = Math.round(midTotal * 0.08);
  mid["contingency"] = Math.round(midTotal * 0.12);
  high["contingency"] = Math.round(midTotal * 0.15);

  return { low, mid, high };
}

/**
 * Generates the cost breakdown from mid-point category costs.
 */
function generateBreakdown(midCosts: Record<string, number>): CostBreakdownItem[] {
  const total = Object.values(midCosts).reduce((sum, v) => sum + v, 0);
  if (total === 0) return [];

  return Object.entries(midCosts)
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: Math.round((amount / total) * 100),
    }));
}

/**
 * Generates material recommendations with alternative options and cost impact.
 */
function generateMaterialRecommendations(
  answers: KitchenEstimateAnswers,
  params: KitchenCostParams
): MaterialRecommendation[] {
  const recommendations: MaterialRecommendation[] = [];

  // Countertop recommendations
  if (answers.countertopMaterial !== "keep") {
    const currentMult = params.materialMultipliers[answers.countertopMaterial] ?? 1.0;
    const counterBase = params.baseCosts["countertops"]?.mid ?? 3500;

    const counterAlternatives: Record<string, string> = {
      laminate: "Budget-friendly surface with modern laminate designs that mimic stone",
      quartz: "Engineered stone that's durable, non-porous, and low-maintenance",
      granite: "Natural stone with unique patterns; requires periodic sealing",
      marble: "Premium natural stone with elegant veining; higher maintenance",
      butcherblock: "Warm wood surface ideal for prep areas; needs regular oiling",
    };

    for (const [material, description] of Object.entries(counterAlternatives)) {
      if (material === answers.countertopMaterial) continue;
      if (recommendations.length >= 3) break;

      const altMult = params.materialMultipliers[material] ?? 1.0;
      const costDifference = Math.round((altMult - currentMult) * counterBase);

      recommendations.push({
        current: answers.countertopMaterial,
        alternative: material,
        costDifference,
        description,
      });
    }
  }

  // Cabinet recommendations (if we haven't already hit 3)
  if (recommendations.length < 3 && answers.cabinetType !== "reface") {
    const currentMult = params.materialMultipliers[answers.cabinetType] ?? 1.0;
    const cabinetBase = params.baseCosts["cabinets"]?.mid ?? 8000;

    const cabinetAlternatives: Record<string, string> = {
      stock: "Pre-made cabinets in standard sizes; most affordable option",
      semicustom: "Customizable sizes and finishes with moderate lead time",
      custom: "Fully bespoke cabinets built to exact specifications",
      reface: "Keep existing cabinet boxes and replace doors/fronts for a fresh look",
    };

    for (const [material, description] of Object.entries(cabinetAlternatives)) {
      if (material === answers.cabinetType) continue;
      if (recommendations.length >= 3) break;

      const altMult = params.materialMultipliers[material] ?? 1.0;
      const costDifference = Math.round((altMult - currentMult) * cabinetBase);

      recommendations.push({
        current: answers.cabinetType,
        alternative: material,
        costDifference,
        description,
      });
    }
  }

  // Return 2-3 recommendations
  return recommendations.slice(0, 3);
}

/**
 * Generates project-relevant contractor questions based on the user's selections.
 * Always returns between 5 and 7 questions.
 */
function generateContractorQuestions(answers: KitchenEstimateAnswers): string[] {
  const questions: string[] = [];

  // Always relevant (core questions)
  questions.push("What is the estimated timeline for this project from start to completion?");
  questions.push("Are permits included in your quote, and who handles the permit process?");
  questions.push("What warranties do you offer on labor and materials?");

  // Scope-specific
  if (answers.remodelScope === "full") {
    questions.push("Will we need to arrange temporary kitchen facilities during the remodel?");
    questions.push("How do you handle unexpected issues found during demolition (e.g., mold, outdated wiring)?");
  }

  // Structural
  if (answers.structuralChanges.length > 0) {
    questions.push("Has a structural engineer reviewed the planned wall removals or modifications?");
  }

  // Material-specific
  if (answers.countertopMaterial === "marble" || answers.countertopMaterial === "granite") {
    questions.push(`What is the lead time for ${answers.countertopMaterial} fabrication and installation?`);
  }

  if (answers.cabinetType === "custom") {
    questions.push("What is the typical lead time for custom cabinet fabrication?");
  }

  // Appliance-specific
  if (answers.applianceTier === "highend") {
    questions.push("Do you coordinate appliance delivery and installation, or is that separate?");
  }

  // Timeline-specific
  if (answers.timeline === "hard") {
    questions.push("What contingencies do you have in place if the project falls behind schedule?");
  }

  // Fill up to at least 5 questions with general best-practice questions
  const fillerQuestions = [
    "Can you provide references from recent kitchen remodel projects?",
    "How do you handle change orders or scope adjustments during the project?",
    "What is your payment schedule, and do you require a deposit upfront?",
    "Will you provide a detailed written quote breaking down material and labor costs?",
    "Do you carry liability insurance and workers' compensation coverage?",
  ];

  for (const q of fillerQuestions) {
    if (questions.length >= 7) break;
    if (!questions.includes(q)) {
      questions.push(q);
    }
  }

  // Return 5-7 questions
  return questions.slice(0, 7);
}

/**
 * Calculates the confidence score based on how much information is available.
 */
function calculateConfidence(answers: KitchenEstimateAnswers): number {
  let confidence = 30; // Base confidence

  if (answers.zipCode) confidence += 10;
  if (answers.state) confidence += 5;
  if (answers.kitchenSize) confidence += 10;
  if (answers.remodelScope) confidence += 10;
  if (answers.cabinetType) confidence += 8;
  if (answers.countertopMaterial) confidence += 8;
  if (answers.flooringChoice) confidence += 5;
  if (answers.applianceTier) confidence += 5;
  if (answers.timeline) confidence += 4;
  if (answers.overallCondition) confidence += 5;
  if (answers.path === "ai") confidence += 5; // AI detection adds confidence

  return Math.min(95, confidence);
}

// ─── Main Export ─────────────────────────────────────────────────────────────

/**
 * Calculates a kitchen remodel cost estimate.
 *
 * This is a pure function with no side effects. It accepts the user's answers
 * and cost configuration parameters, then returns a complete estimate including
 * the price range, itemized breakdown, material recommendations, and contractor questions.
 *
 * Invariants:
 * - low ≤ mid ≤ high
 * - All values clamped to [$5,000, $250,000]
 * - Breakdown percentages sum to ~100% (±2% for rounding)
 *
 * @param answers - The collected kitchen estimate answers from user input
 * @param params - Cost calculation parameters (base costs, multipliers, etc.)
 * @returns A complete KitchenLiveEstimate with range, breakdown, and recommendations
 */
export function calculateKitchenEstimate(
  answers: KitchenEstimateAnswers,
  params: KitchenCostParams
): KitchenLiveEstimate {
  // Get regional multiplier
  const regionalMultiplier = getRegionalMultiplier(answers, params.regionalMultipliers);

  // Compute per-category costs
  const categoryCosts = computeCategoryCosts(answers, params, regionalMultiplier);

  // Sum totals
  let totalLow = Object.values(categoryCosts.low).reduce((sum, v) => sum + v, 0);
  let totalMid = Object.values(categoryCosts.mid).reduce((sum, v) => sum + v, 0);
  let totalHigh = Object.values(categoryCosts.high).reduce((sum, v) => sum + v, 0);

  // Clamp to min/max bounds
  totalLow = Math.max(MIN_ESTIMATE, Math.min(MAX_ESTIMATE, totalLow));
  totalMid = Math.max(MIN_ESTIMATE, Math.min(MAX_ESTIMATE, totalMid));
  totalHigh = Math.max(MIN_ESTIMATE, Math.min(MAX_ESTIMATE, totalHigh));

  // Enforce low ≤ mid ≤ high invariant
  totalMid = Math.max(totalLow, totalMid);
  totalHigh = Math.max(totalMid, totalHigh);

  // Generate breakdown from mid-point costs
  const breakdown = generateBreakdown(categoryCosts.mid);

  // Generate material recommendations
  const materialRecommendations = generateMaterialRecommendations(answers, params);

  // Generate contractor questions
  const contractorQuestions = generateContractorQuestions(answers);

  // Calculate confidence
  const confidence = calculateConfidence(answers);

  return {
    low: totalLow,
    mid: totalMid,
    high: totalHigh,
    confidence,
    breakdown,
    materialRecommendations,
    contractorQuestions,
  };
}
