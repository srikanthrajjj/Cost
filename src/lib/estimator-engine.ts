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
  hvacSize?: "small" | "medium" | "large";

  // Windows
  windowCount?: number;
  windowMaterial?: "vinyl" | "wood" | "fiberglass" | "aluminum";
  windowType?: "single" | "double" | "triple";

  // Flooring
  flooringMaterial?: "hardwood" | "laminate" | "tile" | "vinyl" | "carpet";
  flooringArea?: number;

  // Painting
  paintingScope?: "interior" | "exterior" | "both";
  paintingRooms?: number;

  // Solar
  solarPanelCount?: number;
  solarBattery?: boolean;

  // Deck
  deckSize?: number;
  deckMaterial?: "wood" | "composite" | "pvc";

  // Plumbing
  plumbingType?: "repair" | "repiping" | "fixture";

  // Electrical
  electricalType?: "panel-upgrade" | "rewiring" | "outlets";

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
    const roofSizeFactor = answers.roofSize ? answers.roofSize / 2000 : sizeFactor;
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
    if (answers.roofMaterial === "slate") {
      low *= 2.0;
      mid *= 2.2;
      high *= 2.5;
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
    if (answers.roofSize) confidence += 10;
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
      low = 300;
      mid = 800;
      high = 2500;
    }
    if (answers.hvacType === "heat-pump") {
      mid += 1500;
      high += 3000;
    }
    if (answers.hvacType === "mini-split") {
      low -= 1000;
      mid -= 500;
    }
    if (answers.hvacAction) confidence += 20;
    if (answers.hvacType) confidence += 15;
  } else if (project === "windows") {
    const count = answers.windowCount ?? 10;
    low = Math.round((low / 10) * count * regionMult);
    mid = Math.round((mid / 10) * count * regionMult);
    high = Math.round((high / 10) * count * regionMult);
    if (answers.windowType === "double") {
      mid *= 1.2;
      high *= 1.2;
    }
    if (answers.windowType === "triple") {
      mid *= 1.4;
      high *= 1.5;
    }
    if (answers.windowMaterial === "wood") {
      mid += count * 200;
      high += count * 400;
    }
    if (answers.windowCount) confidence += 20;
  } else if (project === "flooring") {
    const area = answers.flooringArea ?? sqft * 0.6;
    const perSqft =
      answers.flooringMaterial === "hardwood"
        ? 12
        : answers.flooringMaterial === "tile"
          ? 10
          : answers.flooringMaterial === "carpet"
            ? 4
            : answers.flooringMaterial === "laminate"
              ? 6
              : 5;
    low = Math.round(area * (perSqft * 0.7) * regionMult);
    mid = Math.round(area * perSqft * regionMult);
    high = Math.round(area * (perSqft * 1.4) * regionMult);
    if (answers.flooringMaterial) confidence += 25;
    if (answers.flooringArea) confidence += 15;
  } else if (project === "solar") {
    const panels = answers.solarPanelCount ?? 20;
    low = Math.round((low / 20) * panels * regionMult);
    mid = Math.round((mid / 20) * panels * regionMult);
    high = Math.round((high / 20) * panels * regionMult);
    if (answers.solarBattery) {
      low += 8000;
      mid += 12000;
      high += 15000;
    }
    if (answers.solarPanelCount) confidence += 20;
  } else {
    low = Math.round(low * (sizeFactor * 0.8) * regionMult);
    mid = Math.round(mid * (sizeFactor * 0.9) * regionMult);
    high = Math.round(high * sizeFactor * regionMult);
  }

  // ── Condition adjustments
  if (answers.currentCondition === "poor") {
    low *= 1.15;
    mid *= 1.2;
    high *= 1.3;
    confidence += 5;
  }
  if (answers.currentCondition === "excellent") {
    mid *= 0.9;
    high *= 0.9;
    confidence += 5;
  }
  if (answers.currentCondition) confidence += 5;

  // ── Property details confidence
  if (answers.squareFootage) confidence += 10;
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

  // ── Breakdown
  const breakdown = [
    { label: "Materials", pct: 44, amount: Math.round(mid * 0.44) },
    { label: "Labor", pct: 34, amount: Math.round(mid * 0.34) },
    { label: "Permits", pct: 4, amount: Math.round(mid * 0.04) },
    { label: "Disposal", pct: 3, amount: Math.round(mid * 0.03) },
    { label: "Contingency", pct: 15, amount: Math.round(mid * 0.15) },
  ];

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
