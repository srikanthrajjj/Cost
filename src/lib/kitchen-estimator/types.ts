// ─── Kitchen Estimator Types ─────────────────────────────────────────────────
// Shared TypeScript interfaces for the AI Kitchen Estimator feature.
// These types are used across both the AI and manual estimation paths.

// ─── AI Detection Types ──────────────────────────────────────────────────────

/**
 * A single attribute detected by the AI vision analysis,
 * with a confidence level and possible alternative values.
 */
export interface DetectedAttribute {
  value: string;
  confidence: "high" | "medium" | "low";
  alternatives: string[];
}

/**
 * The structured result returned from the AI photo analysis,
 * containing all detected kitchen attributes.
 */
export interface AIDetectionResult {
  cabinetType: DetectedAttribute;
  countertopMaterial: DetectedAttribute;
  flooringMaterial: DetectedAttribute;
  kitchenSize: DetectedAttribute;
  overallCondition: DetectedAttribute;
  observations: string[];
}

// ─── Estimation Answers ──────────────────────────────────────────────────────

/**
 * Unified source of truth for all collected data from either path (AI or manual).
 * Represents the complete set of user inputs that drive cost calculation.
 */
export interface KitchenEstimateAnswers {
  // Source path
  path: "ai" | "manual";

  // Location (both paths)
  zipCode: string;
  city?: string;
  state?: string;

  // Kitchen attributes (AI-detected or manually selected)
  kitchenSize: "small" | "medium" | "large";
  remodelScope: "cosmetic" | "midrange" | "full";
  cabinetType: "stock" | "semicustom" | "custom" | "reface";
  countertopMaterial:
    | "laminate"
    | "quartz"
    | "granite"
    | "marble"
    | "butcherblock"
    | "keep";
  flooringChoice: "tile" | "hardwood" | "vinyl" | "keep" | "none";
  applianceTier: "keep" | "midrange" | "highend";

  // Structural (manual path + optional follow-up on AI path)
  structuralChanges: string[];

  // Timeline
  timeline: "flexible" | "under8weeks" | "hard";

  // AI-specific
  overallCondition?: "excellent" | "good" | "fair" | "poor";
  aiObservations?: string[];
}

// ─── Cost Estimate Types ─────────────────────────────────────────────────────

/**
 * A single line item in the cost breakdown.
 */
export interface CostBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
}

/**
 * A material recommendation showing an alternative option
 * and its cost impact relative to the user's current selection.
 */
export interface MaterialRecommendation {
  current: string;
  alternative: string;
  costDifference: number; // positive = more expensive
  description: string;
}

/**
 * The full live estimate produced by the Cost_Engine,
 * including the price range, breakdown, and recommendations.
 */
export interface KitchenLiveEstimate {
  low: number;
  mid: number;
  high: number;
  confidence: number; // 0-100
  breakdown: CostBreakdownItem[];
  materialRecommendations: MaterialRecommendation[];
  contractorQuestions: string[];
}

// ─── Project Persistence ─────────────────────────────────────────────────────

/**
 * A saved project stored in localStorage for resuming later.
 */
export interface SavedProject {
  id: string;
  createdAt: string;
  updatedAt: string;
  projectType: "kitchen";
  path: "ai" | "manual";
  answers: KitchenEstimateAnswers;
  aiDetections?: AIDetectionResult;
  estimate?: KitchenLiveEstimate;
}
