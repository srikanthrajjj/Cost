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
    keywords: ["tear-off", "tear off", "tearoff", "removal", "disposal", "dumpster"],
    unit: "sq",
    low: 100,
    high: 300,
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
    keywords: ["valley flashing", "valley metal", "valley"],
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
    id: "flashing",
    label: "Flashing",
    keywords: ["flashing", "step flashing", "chimney flashing", "penetration"],
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

function normalizeQtyToRateUnit(
  qty: number,
  quoteUnit: string,
  rateUnit: MarketRateUnit,
): number {
  if (!qty || qty <= 0) return 0;
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

  if (rateUnit === "lf") {
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
 * Estimate a comparable market total for a line item.
 * Uses qty × mid unit rate when quantity is available.
 */
export function estimateRoofingMarketPrice(
  itemName: string,
  qty: number,
  unit: string,
): number {
  const rate = findRoofingMarketRate(itemName);
  if (!rate) return 0;

  const mid = (rate.low + rate.high) / 2;
  const normalizedQty = normalizeQtyToRateUnit(qty, unit, rate.unit);

  if (normalizedQty > 0) {
    return normalizedQty * mid;
  }

  // No qty: return mid unit rate as a reference point
  return mid;
}
