/**
 * Unit-level market rates for common roofing line items.
 * Sourced from CostReno project pricing content (guides, pricing.ts, scope notes).
 * Rates are mid-market installed/material ranges for comparison against vendor quotes.
 */

export type MarketRateUnit = "sq" | "sqft" | "lf" | "each";

export interface LineItemMarketRate {
  id: string;
  label: string;
  keywords: string[];
  unit: MarketRateUnit;
  low: number;
  high: number;
}

export const roofingLineItemMarketRates: LineItemMarketRate[] = [
  {
    id: "architectural_shingles",
    label: "Architectural shingles",
    keywords: [
      "architectural shingle",
      "timberline",
      "dimensional shingle",
      "laminate shingle",
      "asphalt shingle",
      "shingle",
    ],
    unit: "sq",
    low: 180,
    high: 350,
  },
  {
    id: "synthetic_underlayment",
    label: "Synthetic underlayment",
    keywords: ["synthetic underlayment", "underlayment", "synthetic felt", "felt paper"],
    unit: "sq",
    low: 35,
    high: 80,
  },
  {
    id: "tear_off",
    label: "Tear-off and disposal",
    keywords: ["tear-off", "tear off", "tearoff", "tear off and disposal"],
    unit: "sq",
    low: 100,
    high: 300,
  },
  {
    id: "dumpster",
    label: "Dumpster and cleanup",
    keywords: ["dumpster", "cleanup", "clean up", "haul away", "debris removal"],
    unit: "each",
    low: 350,
    high: 900,
  },
  {
    id: "ice_water_shield",
    label: "Ice and water shield",
    keywords: ["ice and water", "ice & water", "ice water shield", "water shield"],
    unit: "sqft",
    low: 1.5,
    high: 3.5,
  },
  {
    id: "drip_edge",
    label: "Drip edge",
    keywords: ["drip edge", "drip-edge", "dripedge"],
    unit: "lf",
    low: 3,
    high: 8,
  },
  {
    id: "valley_flashing",
    label: "Valley flashing",
    keywords: ["valley flashing", "valley metal"],
    unit: "lf",
    low: 8,
    high: 22,
  },
  {
    id: "starter_strip",
    label: "Starter strip",
    keywords: ["starter strip", "starter shingle"],
    unit: "lf",
    low: 1.5,
    high: 3.5,
  },
  {
    id: "ridge_vent",
    label: "Ridge vent",
    keywords: ["ridge vent", "ridgevent", "ridge ventilation"],
    unit: "lf",
    low: 8,
    high: 16,
  },
  {
    id: "ridge_cap",
    label: "Ridge cap",
    keywords: ["ridge cap", "hip and ridge", "ridge shingle"],
    unit: "lf",
    low: 6,
    high: 14,
  },
  {
    id: "pipe_boot",
    label: "Pipe boot / jack",
    keywords: ["pipe boot", "pipe jack", "vent boot", "plumbing boot", "roof jack"],
    unit: "each",
    low: 25,
    high: 75,
  },
  {
    id: "roof_vent",
    label: "Roof vent",
    keywords: ["roof vent", "box vent", "turtle vent", "exhaust vent"],
    unit: "each",
    low: 40,
    high: 120,
  },
  {
    id: "flashing",
    label: "Flashing",
    keywords: ["flashing", "step flashing", "chimney flashing", "flashing replacement"],
    unit: "lf",
    low: 6,
    high: 18,
  },
  {
    id: "deck_repair",
    label: "Deck / sheathing repair",
    keywords: ["deck repair", "sheathing", "plywood", "osb", "decking"],
    unit: "each",
    low: 75,
    high: 150,
  },
  {
    id: "soffit_vent",
    label: "Soffit vent",
    keywords: ["soffit vent", "soffit ventilation"],
    unit: "lf",
    low: 4,
    high: 10,
  },
  {
    id: "permit",
    label: "Permit",
    keywords: ["permit", "inspection fee"],
    unit: "each",
    low: 150,
    high: 500,
  },
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-_]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Whether quote units can be multiplied against a market rate unit. */
export function unitsCompatible(quoteUnit: string, rateUnit: MarketRateUnit): boolean {
  const u = normalize(quoteUnit);
  if (!u) return false;

  if (rateUnit === "each") {
    return (
      u === "each" ||
      u === "ea" ||
      u === "pc" ||
      u.includes("piece") ||
      u.includes("lump") ||
      u.includes("allowance") ||
      u.includes("job")
    );
  }

  if (rateUnit === "lf") {
    return (
      u === "lf" ||
      u === "lin ft" ||
      u === "linear ft" ||
      u.includes("linear") ||
      u === "ft" ||
      u.includes("foot") ||
      u.includes("feet")
    );
  }

  if (rateUnit === "sq") {
    return (
      u === "sq" ||
      u === "square" ||
      u.includes("squares") ||
      u.includes("sq ft") ||
      u === "sf" ||
      u === "sqft" ||
      u.includes("square foot")
    );
  }

  if (rateUnit === "sqft") {
    return (
      u.includes("sq ft") ||
      u === "sf" ||
      u === "sqft" ||
      u === "sq" ||
      u.includes("square")
    );
  }

  return false;
}

function normalizeQtyToRateUnit(
  qty: number,
  quoteUnit: string,
  rateUnit: MarketRateUnit,
): number {
  if (!qty || qty <= 0) return 0;
  if (!unitsCompatible(quoteUnit, rateUnit)) return 0;

  const u = normalize(quoteUnit);

  if (rateUnit === "sq") {
    if (u.includes("sq ft") || u === "sf" || u === "sqft" || u.includes("square foot")) {
      return qty / 100;
    }
    return qty;
  }

  if (rateUnit === "sqft") {
    if (u === "sq" || (u.includes("square") && !u.includes("foot") && !u.includes("ft"))) {
      return qty * 100;
    }
    return qty;
  }

  return qty;
}

/** Find the best market rate entry for a quote line item name. */
export function findRoofingMarketRate(itemName: string): LineItemMarketRate | null {
  const name = normalize(itemName);
  if (!name) return null;

  let best: LineItemMarketRate | null = null;
  let bestScore = 0;

  for (const rate of roofingLineItemMarketRates) {
    for (const keyword of rate.keywords) {
      const kw = normalize(keyword);
      if (!kw) continue;
      if (name === kw || name.includes(kw) || kw.includes(name)) {
        const score = kw.length;
        if (score > bestScore) {
          bestScore = score;
          best = rate;
        }
      }
    }
  }

  return best;
}

/**
 * Estimate a comparable market TOTAL for a line item.
 * Returns 0 when qty/unit are missing or incompatible so we never show a
 * bare unit rate (e.g. $3) as if it were a line total.
 */
export function estimateRoofingMarketPrice(
  itemName: string,
  qty: number,
  unit: string,
): number {
  return estimateRoofingMarketRange(itemName, qty, unit)?.mid ?? 0;
}

export type MarketPriceRange = {
  low: number;
  mid: number;
  high: number;
  rateId: string;
  label: string;
};

/**
 * Estimate market low / mid / high totals for a line item.
 * Returns null when qty/unit are missing or incompatible.
 */
export function estimateRoofingMarketRange(
  itemName: string,
  qty: number,
  unit: string,
): MarketPriceRange | null {
  const rate = findRoofingMarketRate(itemName);
  if (!rate) return null;

  const normalizedQty = normalizeQtyToRateUnit(qty, unit, rate.unit);
  if (!(normalizedQty > 0)) return null;

  const low = normalizedQty * rate.low;
  const high = normalizedQty * rate.high;
  const mid = (low + high) / 2;

  return {
    low,
    mid,
    high,
    rateId: rate.id,
    label: rate.label,
  };
}

/** Vendor vs market totals are only comparable within a sane magnitude band. */
export function isPriceComparisonReliable(vendorPrice: number, marketPrice: number): boolean {
  if (vendorPrice <= 0 || marketPrice <= 0) return false;
  const ratio = vendorPrice / marketPrice;
  // More than ~8× either direction usually means bad qty/unit or misparsed price
  return ratio >= 0.125 && ratio <= 8;
}
