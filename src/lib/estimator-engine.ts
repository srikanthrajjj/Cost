import { findCityByName, findCityByZip } from "@/lib/city-data";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ProjectType =
  | "roof"
  | "kitchen"
  | "bathroom"
  | "hvac"
  | "windows"
  | "flooring"
  | "painting"
  | "solar"
  | "deck"
  | "plumbing"
  | "electrical";

export interface EstimatorAnswers {
  // Step 1 — Project
  projectType?: ProjectType;

  // Step 2 — Location
  zipCode?: string;
  city?: string;
  state?: string;

  // Step 3 — Property
  propertyType?: "single-family" | "condo" | "townhouse" | "multi-family";
  yearBuilt?: number;
  squareFootage?: number;
  stories?: number;

  // Step 4 — Project Details (dynamic per project)
  // Roof
  roofAction?: "repair" | "replace";
  roofMaterial?: "asphalt" | "metal" | "tile" | "wood" | "slate";
  roofSize?: number;
  roofCondition?: "good" | "fair" | "poor";
  /** Slope. Steeper roofs cost more to walk, stage, and install. */
  roofPitch?: "flat" | "standard" | "steep" | "very_steep" | "low" | "medium";
  /** Number of planes, valleys, hips, and dormers. */
  roofComplexity?: "simple" | "moderate" | "complex" | "average";
  /** Existing shingle layers. Two or more means extra tear-off and disposal. */
  roofLayers?: "one" | "two-plus";
  /** How the roof area used for pricing was determined. */
  roofSizeSource?: "manual" | "trace" | "map" | "estimated";
  /** Plan-view footprint sq ft (before pitch uplift). */
  roofFootprintSqFt?: number;
  /** Geocoded coordinates from satellite trace. */
  roofLat?: number;
  roofLng?: number;
  /** Traced footprint ring(s) from satellite draw. */
  roofFootprintRings?: Array<Array<{ lat: number; lng: number }>>;
  addGutters?: boolean;
  addSkylights?: boolean;

  // Kitchen
  kitchenMethod?: "manual" | "ai";
  kitchenPhotos?: string;
  kitchenScope?: "full" | "partial";
  kitchenCabinets?: "stock" | "semi-custom" | "custom";
  kitchenCountertops?: "laminate" | "quartz" | "granite" | "marble";
  kitchenFlooring?: "tile" | "hardwood" | "vinyl" | "none";
  kitchenAppliances?: boolean;
  kitchenLayout?: "keep" | "minor" | "major";
  kitchenApplianceTier?: "keep" | "standard" | "midrange" | "premium";
  kitchenBacksplash?: "tile" | "glass" | "stone" | "none";
  kitchenFixtures?: "keep" | "standard" | "upgrade";

  // Bathroom
  bathroomScope?: "full" | "partial";
  bathroomFixtures?: "standard" | "mid-range" | "luxury";
  bathroomTile?: boolean;
  bathroomCount?: number;

  // HVAC
  hvacAction?: "repair" | "replace";
  hvacType?: "central-air" | "heat-pump" | "furnace" | "mini-split";
  hvacDuctwork?: "good" | "repair" | "replace" | "none";
  hvacEfficiency?: "standard" | "high";
  hvacIssue?:
    | "not-cooling"
    | "not-heating"
    | "making-noise"
    | "short-cycling"
    | "not-sure";
  hvacSystemAge?: "under-5" | "5-10" | "10-15" | "15-plus" | "not-sure";
  hvacDiagnosed?: "yes" | "no";
  hvacDiagnosisNotes?: string;

  // Windows
  windowCount?: number;
  windowMaterial?: "vinyl" | "wood" | "fiberglass" | "aluminum";
  windowType?: "single" | "double" | "triple";
  windowInstallType?: "retrofit" | "full-frame";
  windowStyle?: "double-hung" | "casement" | "picture" | "mixed";

  // Flooring
  flooringMaterial?: "hardwood" | "laminate" | "tile" | "vinyl" | "carpet";
  flooringArea?: number;
  flooringRemoval?: boolean;
  flooringPrep?: "minimal" | "moderate" | "major";
  flooringQuality?: "basic" | "standard" | "premium";

  // Painting
  paintingScope?: "interior" | "exterior" | "both";
  paintingRooms?: number;
  paintingQuality?: "standard" | "premium";

  // Solar
  solarPanelCount?: number;
  solarBattery?: boolean;

  // Deck
  deckSize?: number;
  deckMaterial?: "wood" | "composite" | "pvc";
  deckHeight?: "ground" | "elevated";
  deckRailing?: boolean;

  // Plumbing
  plumbingType?: "repair" | "repiping" | "fixture";
  plumbingScope?: "localized" | "whole-home";

  // Electrical
  electricalType?: "panel-upgrade" | "rewiring" | "outlets";
  electricalScope?: "limited" | "whole-home";

  // Step 5 — Condition
  currentCondition?: "excellent" | "good" | "fair" | "poor";
  hasDamage?: boolean;
  damageType?: "storm" | "water" | "fire" | "structural" | "none";

  // Step 6 — Budget & Timeline
  desiredBudget?: number;
  startTimeline?: "asap" | "1-3months" | "3-6months" | "6-12months" | "planning";

  // Step 7 — Insurance
  causeOfProject?: "storm" | "fire" | "water-damage" | "wear-tear" | "remodeling" | "other";
}

export interface LiveEstimate {
  low: number;
  mid: number;
  high: number;
  confidence: number; // 0-100
  timeline: string;
  permitRequired: boolean;
  insuranceEligible: boolean;
  breakdown: { label: string; amount: number; pct: number }[];
}

// ─── Regional cost multipliers by state (ZIP prefix → multiplier) ─────────────
const STATE_MULTIPLIERS: Record<string, number> = {
  // High cost
  HI: 1.55,
  CA: 1.45,
  NY: 1.4,
  MA: 1.35,
  CT: 1.32,
  NJ: 1.3,
  WA: 1.3,
  AK: 1.28,
  DC: 1.35,
  // Above average
  MD: 1.25,
  NH: 1.22,
  VT: 1.2,
  CO: 1.2,
  OR: 1.18,
  RI: 1.2,
  IL: 1.15,
  MN: 1.12,
  DE: 1.15,
  ME: 1.12,
  // Average
  VA: 1.1,
  AZ: 1.08,
  PA: 1.05,
  TX: 1.05,
  FL: 1.05,
  NV: 1.05,
  NC: 1.02,
  GA: 1.0,
  UT: 1.0,
  WI: 1.0,
  // Below average
  OH: 0.95,
  MI: 0.95,
  IA: 0.93,
  SC: 0.93,
  NE: 0.92,
  TN: 0.92,
  MO: 0.9,
  IN: 0.9,
  LA: 0.9,
  NM: 0.9,
  KS: 0.9,
  ID: 0.9,
  MT: 0.9,
  ND: 0.88,
  SD: 0.88,
  KY: 0.88,
  OK: 0.87,
  AL: 0.87,
  AR: 0.85,
  MS: 0.85,
  WV: 0.83,
  WY: 0.88,
};

// ─── Base costs per project (national average mid-point) ─────────────────────
const BASE_COSTS: Record<ProjectType, { low: number; mid: number; high: number }> = {
  roof: { low: 8600, mid: 16650, high: 24700 },
  kitchen: { low: 25000, mid: 50000, high: 75000 },
  bathroom: { low: 8000, mid: 19000, high: 30000 },
  hvac: { low: 4500, mid: 8250, high: 12000 },
  windows: { low: 6000, mid: 12500, high: 21000 },
  flooring: { low: 3000, mid: 7500, high: 14000 },
  painting: { low: 2000, mid: 4500, high: 8000 },
  solar: { low: 15000, mid: 25000, high: 35000 },
  deck: { low: 6000, mid: 13000, high: 22000 },
  plumbing: { low: 1500, mid: 6000, high: 15000 },
  electrical: { low: 2000, mid: 8000, high: 18000 },
};

const TIMELINES: Record<ProjectType, string> = {
  roof: "3–5 days",
  kitchen: "4–8 weeks",
  bathroom: "2–4 weeks",
  hvac: "1–2 days",
  windows: "1–3 days",
  flooring: "2–4 days",
  painting: "3–7 days",
  solar: "2–3 days",
  deck: "3–7 days",
  plumbing: "1–5 days",
  electrical: "1–5 days",
};

const PERMIT_REQUIRED: Record<ProjectType, boolean> = {
  roof: true,
  kitchen: true,
  bathroom: true,
  hvac: true,
  windows: false,
  flooring: false,
  painting: false,
  solar: true,
  deck: true,
  plumbing: true,
  electrical: true,
};

function isHotSouthernClimate(state?: string): boolean {
  return Boolean(
    state &&
      new Set(["AZ", "FL", "TX", "LA", "MS", "AL", "GA", "SC", "NC", "NV"]).has(
        state.toUpperCase(),
      ),
  );
}

function estimateHvacTonnage(squareFootage: number, state?: string): number {
  const sqftPerTon = isHotSouthernClimate(state) ? 450 : 550;
  const rawTons = squareFootage / sqftPerTon;
  return Math.max(1.5, Math.round(rawTons * 4) / 4);
}

export function resolveRegionalMultiplier(answers: {
  zipCode?: string;
  city?: string;
  state?: string;
}): {
  multiplier: number;
  source: "city" | "state" | "national";
  label: string;
} {
  const zip = answers.zipCode?.replace(/\D/g, "");
  if (zip && zip.length >= 3) {
    const metro = findCityByZip(zip);
    if (metro) {
      return {
        multiplier: metro.laborCostMultiplier,
        source: "city",
        label: `${metro.city}, ${metro.stateAbbr}`,
      };
    }
  }

  if (answers.city) {
    const metro = findCityByName(answers.city, answers.state);
    if (metro) {
      return {
        multiplier: metro.laborCostMultiplier,
        source: "city",
        label: `${metro.city}, ${metro.stateAbbr}`,
      };
    }
  }

  const state = answers.state?.toUpperCase();
  if (state && STATE_MULTIPLIERS[state]) {
    return {
      multiplier: STATE_MULTIPLIERS[state],
      source: "state",
      label: state,
    };
  }

  return { multiplier: 1, source: "national", label: "US average" };
}

/**
 * Instant local estimate from in-code base costs + regional multipliers.
 * No LLM and no database lookup.
 */
export function lookupInstantEstimate(answers: EstimatorAnswers): LiveEstimate {
  return calculateEstimate(answers);
}

/**
 * Roof surface area is larger than the floor plan below it because of slope.
 * Typical multipliers against the building footprint (plan view).
 * Used by the estimator and by OpenStreetMap footprint → roof surface conversion.
 */
export const ROOF_PITCH_FACTORS: Record<string, number> = {
  flat: 1.03,
  low: 1.03,
  standard: 1.1,
  medium: 1.1,
  steep: 1.2,
  very_steep: 1.36,
};

/** Pitch multiplier for footprint → roof surface. Defaults to standard (~1.10). */
export function resolveRoofPitchFactor(
  pitch?: EstimatorAnswers["roofPitch"] | null,
): number {
  if (!pitch) return ROOF_PITCH_FACTORS.standard;
  return ROOF_PITCH_FACTORS[pitch] ?? ROOF_PITCH_FACTORS.standard;
}

export interface RoofAreaResult {
  /** Roof surface area in sq ft used for pricing. */
  sqFt: number;
  source: "manual" | "trace" | "map" | "estimated";
  pitchFactor: number;
}

/** Stories is captured as a string by the select grid, so normalize it here. */
function parseStories(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(3, Math.round(parsed));
}

/**
 * Resolves the roof area to price against.
 *
 * A measured value (typed by the homeowner or returned by the map lookup)
 * always wins. Otherwise we derive it from the building footprint
 * (home size divided by stories) and the roof slope, because floor area alone
 * overstates single-story roofs and understates nothing on taller homes.
 */
export function resolveRoofArea(answers: EstimatorAnswers): RoofAreaResult {
  const pitchFactor = resolveRoofPitchFactor(answers.roofPitch);

  if (answers.roofSize && answers.roofSize > 0) {
    return {
      sqFt: answers.roofSize,
      source:
        answers.roofSizeSource === "trace" || answers.roofSizeSource === "map"
          ? answers.roofSizeSource
          : "manual",
      pitchFactor,
    };
  }

  const homeSqFt = answers.squareFootage ?? 2000;
  const footprint = homeSqFt / parseStories(answers.stories);
  return {
    sqFt: Math.max(300, Math.round(footprint * pitchFactor)),
    source: "estimated",
    pitchFactor,
  };
}

export function calculateEstimate(answers: EstimatorAnswers): LiveEstimate {
  const project = answers.projectType;
  if (!project) {
    return {
      low: 0,
      mid: 0,
      high: 0,
      confidence: 5,
      timeline: "—",
      permitRequired: false,
      insuranceEligible: false,
      breakdown: [],
    };
  }

  let { low, mid, high } = { ...BASE_COSTS[project] };
  let confidence = 20;

  // ── Location multiplier (city ZIP when available, else state, else national)
  const region = resolveRegionalMultiplier(answers);
  const regionMult = region.multiplier;
  if (answers.zipCode || answers.city || answers.state) confidence += 10;
  if (region.source === "city") confidence += 8;
  else if (region.source === "state") confidence += 4;

  // ── Square footage scaling
  const sqft = answers.squareFootage ?? 2000;
  const sizeFactor = sqft / 2000;

  if (project === "roof") {
    // Base bands assume a 2,000 sq ft roof surface.
    const roofArea = resolveRoofArea(answers);
    const roofSizeFactor = roofArea.sqFt / 2000;
    low = Math.round(low * roofSizeFactor * regionMult);
    mid = Math.round(mid * roofSizeFactor * regionMult);
    high = Math.round(high * roofSizeFactor * regionMult);
    if (answers.roofAction === "repair") {
      low *= 0.25;
      mid *= 0.3;
      high *= 0.35;
    }
    if (answers.roofMaterial === "metal") {
      low *= 1.4;
      mid *= 1.5;
      high *= 1.6;
    }
    if (answers.roofMaterial === "tile") {
      low *= 1.3;
      mid *= 1.4;
      high *= 1.5;
    }
    if (answers.roofMaterial === "wood") {
      low *= 1.15;
      mid *= 1.25;
      high *= 1.35;
    }
    if (answers.roofMaterial === "slate") {
      low *= 2.0;
      mid *= 2.2;
      high *= 2.5;
    }

    // Slope drives staging and safety labor even when the area is already known.
    if (answers.roofPitch === "very_steep" || answers.roofPitch === "steep") {
      low *= 1.06;
      mid *= 1.08;
      high *= 1.12;
    } else if (answers.roofPitch === "flat" || answers.roofPitch === "low") {
      mid *= 0.98;
      high *= 0.98;
    }

    if (answers.roofComplexity === "simple") {
      low *= 0.95;
      mid *= 0.95;
      high *= 0.97;
    } else if (answers.roofComplexity === "complex") {
      low *= 1.08;
      mid *= 1.12;
      high *= 1.18;
    } else if (answers.roofComplexity === "moderate" || answers.roofComplexity === "average") {
      mid *= 1.03;
      high *= 1.05;
    }

    // Height and access.
    const stories = parseStories(answers.stories);
    if (stories === 2) {
      low *= 1.04;
      mid *= 1.06;
      high *= 1.08;
    } else if (stories >= 3) {
      low *= 1.08;
      mid *= 1.12;
      high *= 1.15;
    }

    // Removing a second layer typically runs $1 to $3 per sq ft.
    if (answers.roofAction === "replace" && answers.roofLayers === "two-plus") {
      low += Math.round(roofArea.sqFt * 0.9);
      mid += Math.round(roofArea.sqFt * 1.5);
      high += Math.round(roofArea.sqFt * 2.5);
    }

    if (answers.addGutters) {
      low += 1200;
      mid += 1800;
      high += 2500;
    }
    if (answers.addSkylights) {
      low += 800;
      mid += 1500;
      high += 2500;
    }
    if (answers.roofCondition === "poor") {
      low *= 1.1;
      mid *= 1.15;
      high *= 1.2;
    }
    if (answers.roofAction) confidence += 15;
    if (answers.roofMaterial) confidence += 15;
    if (roofArea.source === "map") confidence += 12;
    else if (roofArea.source === "manual") confidence += 10;
    else confidence += 3;
    if (answers.roofPitch) confidence += 5;
    if (answers.roofComplexity) confidence += 5;
    if (answers.roofLayers) confidence += 3;
    if (answers.stories) confidence += 3;
    if (answers.roofCondition) confidence += 5;
  } else if (project === "kitchen") {
    // Kitchen size factor — cap at reasonable range
    // If user entered home size (>500), assume kitchen is ~10% of that
    const rawSqft = sqft || 150;
    const kitchenSqft = rawSqft > 500 ? rawSqft * 0.1 : rawSqft;
    const kitchenSizeFactor = Math.max(0.6, Math.min(2.0, kitchenSqft / 150));

    low = Math.round(low * kitchenSizeFactor * regionMult);
    mid = Math.round(mid * kitchenSizeFactor * regionMult);
    high = Math.round(high * kitchenSizeFactor * regionMult);

    // Scope — partial remodel significantly reduces cost
    if (answers.kitchenScope === "partial") {
      low *= 0.4;
      mid *= 0.45;
      high *= 0.5;
    }

    // Cabinets (adjustments relative to base which assumes mid-range)
    if (answers.kitchenCabinets === "stock") {
      low *= 0.85;
      mid *= 0.85;
      high *= 0.9;
    }
    if (answers.kitchenCabinets === "semi-custom") {
      mid *= 1.1;
      high *= 1.15;
    }
    if (answers.kitchenCabinets === "custom") {
      low *= 1.15;
      mid *= 1.3;
      high *= 1.4;
    }

    // Countertops (relative adjustments)
    if (answers.kitchenCountertops === "laminate") {
      low *= 0.92;
      mid *= 0.92;
    }
    if (answers.kitchenCountertops === "quartz") {
      mid *= 1.05;
      high *= 1.08;
    }
    if (answers.kitchenCountertops === "granite") {
      mid *= 1.08;
      high *= 1.12;
    }
    if (answers.kitchenCountertops === "marble") {
      mid *= 1.12;
      high *= 1.18;
    }

    // Flooring (additive — smaller impact)
    if (answers.kitchenFlooring === "hardwood") {
      mid += 1500;
      high += 2500;
    }
    if (answers.kitchenFlooring === "tile") {
      mid += 800;
      high += 1500;
    }

    // Backsplash
    if ((answers as any).kitchenBacksplash === "tile") {
      mid += 1200;
      high += 2000;
    }
    if ((answers as any).kitchenBacksplash === "glass") {
      mid += 2000;
      high += 3000;
    }
    if ((answers as any).kitchenBacksplash === "stone") {
      mid += 2500;
      high += 4000;
    }

    // Fixtures
    if ((answers as any).kitchenFixtures === "standard") {
      mid += 1000;
      high += 2000;
    }
    if ((answers as any).kitchenFixtures === "upgrade") {
      mid += 2500;
      high += 4500;
    }

    // Layout changes (major cost driver — percentage based)
    if ((answers as any).kitchenLayout === "minor") {
      low *= 1.1;
      mid *= 1.15;
      high *= 1.2;
    }
    if ((answers as any).kitchenLayout === "major") {
      low *= 1.25;
      mid *= 1.35;
      high *= 1.5;
    }

    // Appliance tier
    if ((answers as any).kitchenApplianceTier === "standard") {
      low += 3000;
      mid += 4500;
      high += 6000;
    }
    if ((answers as any).kitchenApplianceTier === "midrange") {
      low += 5000;
      mid += 8000;
      high += 11000;
    }
    if ((answers as any).kitchenApplianceTier === "premium") {
      low += 10000;
      mid += 16000;
      high += 22000;
    }
    // Legacy boolean support
    if (answers.kitchenAppliances && !(answers as any).kitchenApplianceTier) {
      low += 3000;
      mid += 6000;
      high += 10000;
    }

    // Confidence
    if (answers.kitchenScope || (answers as any).kitchenMethod === "ai") confidence += 15;
    if (answers.kitchenCabinets) confidence += 10;
    if (answers.kitchenCountertops) confidence += 8;
    if ((answers as any).kitchenLayout) confidence += 10;
    if ((answers as any).kitchenApplianceTier) confidence += 8;
    if (answers.kitchenFlooring) confidence += 5;
  } else if (project === "bathroom") {
    const count = answers.bathroomCount ?? 1;
    low = Math.round(low * count * regionMult);
    mid = Math.round(mid * count * regionMult);
    high = Math.round(high * count * regionMult);
    if (answers.bathroomScope === "partial") {
      low *= 0.4;
      mid *= 0.45;
      high *= 0.5;
    }
    if (answers.bathroomFixtures === "mid-range") {
      mid += 2000;
      high += 4000;
    }
    if (answers.bathroomFixtures === "luxury") {
      low += 3000;
      mid += 8000;
      high += 15000;
    }
    if (answers.bathroomScope) confidence += 15;
    if (answers.bathroomFixtures) confidence += 10;
  } else if (project === "hvac") {
    low = Math.round(low * regionMult);
    mid = Math.round(mid * regionMult);
    high = Math.round(high * regionMult);

    if (answers.hvacAction === "repair") {
      const repairBase =
        answers.hvacIssue === "not-heating"
          ? { low: 250, mid: 700, high: 2200 }
          : answers.hvacIssue === "making-noise"
            ? { low: 200, mid: 550, high: 1600 }
            : answers.hvacIssue === "short-cycling"
              ? { low: 300, mid: 850, high: 2400 }
              : answers.hvacIssue === "not-sure"
                ? { low: 250, mid: 650, high: 2600 }
                : { low: 300, mid: 800, high: 2500 };
      low = Math.round(repairBase.low * regionMult);
      mid = Math.round(repairBase.mid * regionMult);
      high = Math.round(repairBase.high * regionMult);

      if (answers.hvacSystemAge === "10-15") {
        low = Math.round(low * 1.08);
        mid = Math.round(mid * 1.12);
        high = Math.round(high * 1.18);
      }
      if (answers.hvacSystemAge === "15-plus") {
        low = Math.round(low * 1.15);
        mid = Math.round(mid * 1.25);
        high = Math.round(high * 1.4);
      }
      if (answers.hvacDiagnosed === "no") {
        high = Math.round(high * 1.12);
      }
    } else {
      const tons = estimateHvacTonnage(sqft, answers.state);
      const tonFactor = tons / 3;
      low = Math.round(low * tonFactor);
      mid = Math.round(mid * tonFactor);
      high = Math.round(high * tonFactor);

      if (answers.hvacType === "heat-pump") {
        mid += Math.round(1800 * regionMult);
        high += Math.round(3500 * regionMult);
      }
      if (answers.hvacType === "furnace") {
        low = Math.round(low * 0.72);
        mid = Math.round(mid * 0.78);
        high = Math.round(high * 0.85);
      }
      if (answers.hvacType === "mini-split") {
        low = Math.round(low * 0.7);
        mid = Math.round(mid * 0.8);
        high = Math.round(high * 0.95);
      }
      if (answers.hvacEfficiency === "high") {
        low = Math.round(low * 1.12);
        mid = Math.round(mid * 1.18);
        high = Math.round(high * 1.25);
      }
      if (answers.hvacType !== "mini-split" && answers.hvacDuctwork === "repair") {
        low += Math.round(1200 * regionMult);
        mid += Math.round(2200 * regionMult);
        high += Math.round(3500 * regionMult);
      }
      if (answers.hvacType !== "mini-split" && answers.hvacDuctwork === "replace") {
        low += Math.round(3500 * regionMult);
        mid += Math.round(6000 * regionMult);
        high += Math.round(10000 * regionMult);
      }
      if (answers.hvacType !== "mini-split" && answers.hvacDuctwork === "none") {
        low += Math.round(2500 * regionMult);
        mid += Math.round(4800 * regionMult);
        high += Math.round(8500 * regionMult);
      }
    }

    if (answers.hvacAction) confidence += 15;
    if (answers.hvacAction === "repair") {
      if (answers.hvacIssue) confidence += 12;
      if (answers.hvacSystemAge) confidence += 8;
      if (answers.hvacDiagnosed) confidence += 8;
      if (answers.hvacDiagnosisNotes?.trim()) confidence += 10;
    } else {
      if (answers.squareFootage) confidence += 12;
      if (answers.hvacType) confidence += 12;
      if (answers.hvacDuctwork) confidence += 8;
      if (answers.hvacEfficiency) confidence += 5;
    }
  } else if (project === "windows") {
    const count = answers.windowCount ?? 10;
    low = Math.round((low / 10) * count * regionMult);
    mid = Math.round((mid / 10) * count * regionMult);
    high = Math.round((high / 10) * count * regionMult);
    if (answers.windowType === "double") {
      mid *= 1.15;
      high *= 1.2;
    }
    if (answers.windowType === "triple") {
      mid *= 1.35;
      high *= 1.45;
    }
    if (answers.windowMaterial === "wood") {
      mid += count * 220;
      high += count * 420;
    }
    if (answers.windowMaterial === "fiberglass") {
      mid += count * 150;
      high += count * 280;
    }
    if (answers.windowMaterial === "aluminum") {
      mid = Math.round(mid * 0.92);
      high = Math.round(high * 0.95);
    }
    if (answers.windowInstallType === "full-frame") {
      low = Math.round(low * 1.2);
      mid = Math.round(mid * 1.28);
      high = Math.round(high * 1.35);
    }
    if (answers.windowStyle === "casement") {
      mid = Math.round(mid * 1.08);
      high = Math.round(high * 1.1);
    }
    if (answers.windowStyle === "mixed") {
      mid = Math.round(mid * 1.05);
      high = Math.round(high * 1.08);
    }
    if (answers.windowCount) confidence += 18;
    if (answers.windowType) confidence += 8;
    if (answers.windowMaterial) confidence += 8;
    if (answers.windowInstallType) confidence += 8;
  } else if (project === "flooring") {
    const area = answers.flooringArea ?? sqft * 0.6;
    let perSqft =
      answers.flooringMaterial === "hardwood"
        ? 12
        : answers.flooringMaterial === "tile"
          ? 10
          : answers.flooringMaterial === "carpet"
            ? 4
            : answers.flooringMaterial === "laminate"
              ? 6
              : 5;
    if (answers.flooringQuality === "basic") perSqft *= 0.85;
    if (answers.flooringQuality === "premium") perSqft *= 1.28;
    if (answers.flooringRemoval) perSqft += 2;
    if (answers.flooringPrep === "moderate") perSqft += 1.5;
    if (answers.flooringPrep === "major") perSqft += 3.5;
    low = Math.round(area * (perSqft * 0.7) * regionMult);
    mid = Math.round(area * perSqft * regionMult);
    high = Math.round(area * (perSqft * 1.4) * regionMult);
    if (answers.flooringMaterial) confidence += 18;
    if (answers.flooringArea) confidence += 12;
    if (answers.flooringPrep) confidence += 6;
    if (answers.flooringQuality) confidence += 5;
  } else if (project === "solar") {
    const panels = answers.solarPanelCount ?? Math.max(12, Math.round(sqft / 100));
    low = Math.round((low / 20) * panels * regionMult);
    mid = Math.round((mid / 20) * panels * regionMult);
    high = Math.round((high / 20) * panels * regionMult);
    if (answers.solarBattery) {
      low += 8000;
      mid += 12000;
      high += 15000;
    }
    if (answers.solarPanelCount) confidence += 20;
  } else if (project === "painting") {
    const rooms = answers.paintingRooms ?? Math.max(3, Math.round(sqft / 400));
    const qualityMult = answers.paintingQuality === "premium" ? 1.2 : 1;
    if (answers.paintingScope === "interior") {
      low = Math.round(rooms * 350 * qualityMult * regionMult);
      mid = Math.round(rooms * 550 * qualityMult * regionMult);
      high = Math.round(rooms * 850 * qualityMult * regionMult);
    } else if (answers.paintingScope === "exterior") {
      const storyMult = (answers.stories ?? 1) >= 2 ? 1.25 : 1;
      low = Math.round(sqft * 1.2 * storyMult * qualityMult * regionMult);
      mid = Math.round(sqft * 2.0 * storyMult * qualityMult * regionMult);
      high = Math.round(sqft * 3.2 * storyMult * qualityMult * regionMult);
    } else {
      // both
      const interiorMid = rooms * 550 * qualityMult;
      const exteriorMid = sqft * 2.0 * ((answers.stories ?? 1) >= 2 ? 1.25 : 1) * qualityMult;
      low = Math.round((interiorMid * 0.7 + exteriorMid * 0.7) * regionMult);
      mid = Math.round((interiorMid + exteriorMid) * regionMult);
      high = Math.round((interiorMid * 1.4 + exteriorMid * 1.4) * regionMult);
    }
    if (answers.paintingScope) confidence += 15;
    if (answers.paintingRooms) confidence += 10;
    if (answers.paintingQuality) confidence += 5;
  } else if (project === "deck") {
    const area = answers.deckSize ?? 300;
    const perSqft =
      answers.deckMaterial === "pvc" ? 45 : answers.deckMaterial === "composite" ? 35 : 22;
    let heightMult = answers.deckHeight === "elevated" ? 1.3 : 1;
    let railingAdd = answers.deckRailing || answers.deckHeight === "elevated" ? 18 : 0;
    low = Math.round(area * (perSqft * 0.75 + railingAdd * 0.7) * heightMult * regionMult);
    mid = Math.round(area * (perSqft + railingAdd) * heightMult * regionMult);
    high = Math.round(area * (perSqft * 1.4 + railingAdd * 1.3) * heightMult * regionMult);
    if (answers.deckMaterial) confidence += 15;
    if (answers.deckSize) confidence += 15;
    if (answers.deckHeight) confidence += 8;
  } else if (project === "plumbing") {
    if (answers.plumbingType === "repair") {
      low = Math.round(250 * regionMult);
      mid = Math.round(750 * regionMult);
      high = Math.round(2200 * regionMult);
    } else if (answers.plumbingType === "fixture") {
      const scopeMult = answers.plumbingScope === "whole-home" ? 3.2 : 1;
      low = Math.round(800 * scopeMult * regionMult);
      mid = Math.round(2200 * scopeMult * regionMult);
      high = Math.round(5000 * scopeMult * regionMult);
    } else {
      // repiping
      const scopeMult = answers.plumbingScope === "localized" ? 0.35 : 1;
      low = Math.round(4000 * scopeMult * sizeFactor * regionMult);
      mid = Math.round(10000 * scopeMult * sizeFactor * regionMult);
      high = Math.round(22000 * scopeMult * sizeFactor * regionMult);
    }
    if (answers.plumbingType) confidence += 18;
    if (answers.plumbingScope) confidence += 10;
  } else if (project === "electrical") {
    if (answers.electricalType === "outlets") {
      const scopeMult = answers.electricalScope === "whole-home" ? 4 : 1;
      low = Math.round(400 * scopeMult * regionMult);
      mid = Math.round(1200 * scopeMult * regionMult);
      high = Math.round(3500 * scopeMult * regionMult);
    } else if (answers.electricalType === "panel-upgrade") {
      low = Math.round(1800 * regionMult);
      mid = Math.round(3500 * regionMult);
      high = Math.round(6500 * regionMult);
      if (answers.electricalScope === "whole-home") {
        mid += Math.round(2500 * regionMult);
        high += Math.round(5000 * regionMult);
      }
    } else {
      // rewiring
      const scopeMult = answers.electricalScope === "limited" ? 0.4 : 1;
      low = Math.round(5000 * scopeMult * sizeFactor * regionMult);
      mid = Math.round(12000 * scopeMult * sizeFactor * regionMult);
      high = Math.round(25000 * scopeMult * sizeFactor * regionMult);
    }
    if (answers.electricalType) confidence += 18;
    if (answers.electricalScope) confidence += 10;
  } else {
    low = Math.round(low * (sizeFactor * 0.8) * regionMult);
    mid = Math.round(mid * (sizeFactor * 0.9) * regionMult);
    high = Math.round(high * sizeFactor * regionMult);
  }

  // ── Condition adjustments
  if (project !== "hvac" && answers.currentCondition === "poor") {
    low *= 1.15;
    mid *= 1.2;
    high *= 1.3;
    confidence += 5;
  }
  if (project !== "hvac" && answers.currentCondition === "excellent") {
    mid *= 0.9;
    high *= 0.9;
    confidence += 5;
  }
  if (project !== "hvac" && answers.currentCondition) confidence += 5;

  // ── Property details confidence
  if (answers.squareFootage && project !== "roof") confidence += 10;
  if (answers.yearBuilt) confidence += 5;
  if (answers.propertyType) confidence += 5;

  // ── Budget constraint
  if (answers.desiredBudget) {
    if (answers.desiredBudget < mid) high = Math.min(high, answers.desiredBudget * 1.1);
    confidence += 5;
  }

  // ── Timeline
  if (answers.startTimeline) confidence += 5;

  // ── Insurance eligibility
  const insuranceCauses = ["storm", "fire", "water-damage"];
  const insuranceEligible =
    insuranceCauses.includes(answers.causeOfProject ?? "") ||
    ["storm", "water", "fire"].includes(answers.damageType ?? "");
  if (answers.causeOfProject) confidence += 5;

  // Clamp
  low = Math.max(500, Math.round(low));
  mid = Math.max(low, Math.round(mid));
  high = Math.max(mid, Math.round(high));
  confidence = Math.min(95, Math.round(confidence));

  // ── Breakdown (roof uses the roofing knowledge base mix)
  const breakdownShares =
    project === "roof"
      ? [
          { label: "Materials", pct: 35 },
          { label: "Labor", pct: 40 },
          { label: "Deck repair and prep", pct: 8 },
          { label: "Disposal", pct: 4 },
          { label: "Permits", pct: 3 },
          { label: "Contingency", pct: 10 },
        ]
      : [
          { label: "Materials", pct: 44 },
          { label: "Labor", pct: 34 },
          { label: "Permits", pct: 4 },
          { label: "Disposal", pct: 3 },
          { label: "Contingency", pct: 15 },
        ];

  const breakdown = breakdownShares.map(({ label, pct }) => ({
    label,
    pct,
    amount: Math.round((mid * pct) / 100),
  }));

  return {
    low,
    mid,
    high,
    confidence,
    timeline: TIMELINES[project],
    permitRequired: PERMIT_REQUIRED[project],
    insuranceEligible,
    breakdown,
  };
}
