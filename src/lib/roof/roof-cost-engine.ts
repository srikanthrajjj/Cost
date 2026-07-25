import type { EstimatorAnswers } from "@/lib/estimator-engine";

export type RoofPitchClass = "flat" | "standard" | "steep" | "very_steep";
export type RoofComplexityClass = "simple" | "moderate" | "complex";
export type RoofMeasureMode = "manual" | "trace";
export type RoofMaterialRate = "asphalt" | "architectural" | "metal" | "tile";

export const PITCH_MULTIPLIERS: Record<RoofPitchClass, number> = {
  flat: 1.03,
  standard: 1.1,
  steep: 1.2,
  very_steep: 1.36,
};

export const WASTE_FACTORS: Record<RoofComplexityClass, number> = {
  simple: 1.1,
  moderate: 1.17,
  complex: 1.22,
};

export const OVERHANG_FACTOR = 1.06;

export const MATERIAL_COST_PER_SQUARE: Record<
  RoofMaterialRate,
  { low: number; high: number }
> = {
  asphalt: { low: 90, high: 120 },
  architectural: { low: 150, high: 300 },
  metal: { low: 400, high: 800 },
  tile: { low: 700, high: 1200 },
};

export type RoofCostInput = {
  mode: RoofMeasureMode;
  footprintSqFt: number;
  pitch: RoofPitchClass;
  complexity: RoofComplexityClass;
  material?: RoofMaterialRate;
  regionMultiplier?: number;
};

export type RoofCostResult = {
  planSqFt: number;
  roofAreaSqFt: number;
  roofingSquares: number;
  costLow: number;
  costMid: number;
  costHigh: number;
  tearOffCost: number;
  pitchMultiplier: number;
  wasteFactor: number;
};

export function mapWizardMaterial(
  material?: EstimatorAnswers["roofMaterial"],
): RoofMaterialRate {
  switch (material) {
    case "metal":
      return "metal";
    case "tile":
    case "slate":
      return "tile";
    case "wood":
      return "architectural";
    default:
      return "asphalt";
  }
}

export function calculateRoofCost(input: RoofCostInput): RoofCostResult {
  const pitchMultiplier = PITCH_MULTIPLIERS[input.pitch];
  const wasteFactor = WASTE_FACTORS[input.complexity];
  const planSqFt =
    input.mode === "manual"
      ? input.footprintSqFt * OVERHANG_FACTOR
      : input.footprintSqFt;

  const roofAreaSqFt = Math.round(planSqFt * pitchMultiplier);
  const roofingSquares = (roofAreaSqFt / 100) * wasteFactor;
  const tearOffCost = roofingSquares < 25 ? 1000 : 1500;

  const material = input.material ?? "asphalt";
  const rates = MATERIAL_COST_PER_SQUARE[material];
  const region = input.regionMultiplier ?? 1;

  const materialLow = roofingSquares * rates.low * region;
  const materialHigh = roofingSquares * rates.high * region;

  return {
    planSqFt: Math.round(planSqFt),
    roofAreaSqFt,
    roofingSquares: Math.round(roofingSquares * 10) / 10,
    costLow: Math.round(materialLow + tearOffCost),
    costMid: Math.round((materialLow + materialHigh) / 2 + tearOffCost),
    costHigh: Math.round(materialHigh + tearOffCost),
    tearOffCost,
    pitchMultiplier,
    wasteFactor,
  };
}

export function syncRoofSizeFromMeasure(answers: EstimatorAnswers): number | undefined {
  if (!answers.roofFootprintSqFt || answers.roofFootprintSqFt <= 0) return undefined;
  if (!answers.roofPitch || !answers.roofComplexity) return undefined;

  const pitch = answers.roofPitch as RoofPitchClass;
  const complexity =
    answers.roofComplexity === "average"
      ? "moderate"
      : (answers.roofComplexity as RoofComplexityClass);

  if (!(pitch in PITCH_MULTIPLIERS) || !(complexity in WASTE_FACTORS)) return undefined;

  const mode: RoofMeasureMode = answers.roofSizeSource === "trace" ? "trace" : "manual";
  return calculateRoofCost({
    mode,
    footprintSqFt: answers.roofFootprintSqFt,
    pitch,
    complexity,
  }).roofAreaSqFt;
}
