import type { AIDetectionResult, DetectedAttribute } from "./types";

/**
 * The raw structured response expected from the AI vision API.
 */
interface AIVisionResponse {
  cabinetType: { value: string; confidence: number };
  countertopMaterial: { value: string; confidence: number };
  flooringMaterial: { value: string; confidence: number };
  estimatedSize: { value: string; confidence: number };
  overallCondition: { value: string; confidence: number };
  observations: string[];
}

/**
 * Known alternatives for each detection field, used to populate
 * the `alternatives` array on each DetectedAttribute.
 */
const ALTERNATIVES: Record<string, string[]> = {
  cabinetType: ["stock", "semicustom", "custom", "reface"],
  countertopMaterial: [
    "laminate",
    "quartz",
    "granite",
    "marble",
    "butcherblock",
  ],
  flooringMaterial: ["tile", "hardwood", "vinyl", "laminate", "concrete"],
  estimatedSize: ["small", "medium", "large"],
  overallCondition: ["excellent", "good", "fair", "poor"],
};

/**
 * Maps a numeric confidence score (0-100) to a categorical level.
 *  - 80-100 → "high"
 *  - 50-79  → "medium"
 *  - below 50 → "low"
 */
function mapConfidence(score: number): "high" | "medium" | "low" {
  if (score >= 80) return "high";
  if (score >= 50) return "medium";
  return "low";
}

/**
 * Builds a DetectedAttribute from a raw field value, filtering out
 * the detected value from the alternatives list.
 */
function buildAttribute(
  field: { value: string; confidence: number } | undefined,
  fieldKey: string
): DetectedAttribute {
  const value = field?.value ?? "unknown";
  const confidence = mapConfidence(field?.confidence ?? 0);
  const allAlternatives = ALTERNATIVES[fieldKey] ?? [];
  const alternatives = allAlternatives.filter(
    (alt) => alt.toLowerCase() !== value.toLowerCase()
  );

  return { value, confidence, alternatives };
}

/**
 * Returns a fallback AIDetectionResult with "unknown" values
 * and "low" confidence across all fields. Used when parsing fails.
 */
function getFallbackResult(): AIDetectionResult {
  return {
    cabinetType: { value: "unknown", confidence: "low", alternatives: ALTERNATIVES.cabinetType },
    countertopMaterial: { value: "unknown", confidence: "low", alternatives: ALTERNATIVES.countertopMaterial },
    flooringMaterial: { value: "unknown", confidence: "low", alternatives: ALTERNATIVES.flooringMaterial },
    kitchenSize: { value: "unknown", confidence: "low", alternatives: ALTERNATIVES.estimatedSize },
    overallCondition: { value: "unknown", confidence: "low", alternatives: ALTERNATIVES.overallCondition },
    observations: [],
  };
}

/**
 * Parses a raw AI response string (JSON) into a structured AIDetectionResult.
 *
 * The parser:
 * 1. Attempts to JSON.parse the response
 * 2. Maps each field to a DetectedAttribute with confidence mapped to "high"/"medium"/"low"
 * 3. Generates alternatives for each detected attribute
 * 4. If parsing fails, returns a fallback AIDetectionResult with low confidence values
 */
export function parseAIResponse(rawResponse: string): AIDetectionResult {
  try {
    const parsed: AIVisionResponse = JSON.parse(rawResponse);

    // Validate that we have a valid object to work with
    if (!parsed || typeof parsed !== "object") {
      return getFallbackResult();
    }

    const observations: string[] = Array.isArray(parsed.observations)
      ? parsed.observations.filter(
          (obs): obs is string => typeof obs === "string"
        )
      : [];

    return {
      cabinetType: buildAttribute(parsed.cabinetType, "cabinetType"),
      countertopMaterial: buildAttribute(
        parsed.countertopMaterial,
        "countertopMaterial"
      ),
      flooringMaterial: buildAttribute(
        parsed.flooringMaterial,
        "flooringMaterial"
      ),
      kitchenSize: buildAttribute(parsed.estimatedSize, "estimatedSize"),
      overallCondition: buildAttribute(
        parsed.overallCondition,
        "overallCondition"
      ),
      observations,
    };
  } catch {
    // JSON parse failed or any other unexpected error
    return getFallbackResult();
  }
}
