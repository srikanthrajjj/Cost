// ─── Kitchen Cost Parameters ────────────────────────────────────────────────
// Configuration-driven cost calculation parameters for kitchen remodel estimates.
// Base costs represent typical US remodeling costs (2024 national averages).
// Validates: Requirement 10.4

/**
 * Kitchen cost calculation configuration.
 * Defines base costs, material multipliers, regional adjustments, and scope factors.
 */
export interface KitchenCostParams {
  baseCosts: Record<string, { low: number; mid: number; high: number }>;
  materialMultipliers: Record<string, number>;
  regionalMultipliers: Record<string, number>;
  scopeFactors: Record<string, number>;
}

/**
 * Default kitchen cost parameters based on 2024 US national averages.
 *
 * Base costs are per-category estimates for a medium-sized kitchen (~120 sq ft).
 * Material multipliers adjust countertop/cabinet costs based on material choice.
 * Regional multipliers adjust total cost based on geographic location.
 * Scope factors scale the overall estimate based on remodel extent.
 */
export const defaultKitchenCostParams: KitchenCostParams = {
  // ─── Base costs per category (national averages for medium kitchen) ────────
  baseCosts: {
    cabinets: { low: 4000, mid: 8000, high: 18000 },
    countertops: { low: 1500, mid: 3500, high: 8000 },
    flooring: { low: 1200, mid: 2800, high: 5500 },
    labor: { low: 5000, mid: 12000, high: 22000 },
    appliances: { low: 2000, mid: 5000, high: 15000 },
    structural: { low: 0, mid: 3000, high: 12000 },
    permits: { low: 500, mid: 1500, high: 3000 },
  },

  // ─── Material multipliers (relative to baseline = 1.0) ────────────────────
  materialMultipliers: {
    // Cabinets
    stock: 0.7,
    semicustom: 1.0,
    custom: 1.8,
    reface: 0.5,

    // Countertops
    laminate: 0.5,
    quartz: 1.0,
    granite: 1.2,
    marble: 1.8,
    butcherblock: 0.7,

    // Flooring
    vinyl: 0.5,
    tile: 1.0,
    hardwood: 1.4,

    // Appliances
    keep: 0.0,
    midrange: 1.0,
    highend: 2.2,
  },

  // ─── Regional multipliers by state ────────────────────────────────────────
  regionalMultipliers: {
    CA: 1.45,
    NY: 1.40,
    MA: 1.35,
    CT: 1.32,
    NJ: 1.30,
    WA: 1.30,
    HI: 1.50,
    AK: 1.40,
    DC: 1.35,
    MD: 1.25,
    CO: 1.20,
    OR: 1.18,
    IL: 1.15,
    MN: 1.12,
    VA: 1.10,
    AZ: 1.08,
    FL: 1.05,
    TX: 1.05,
    NC: 1.02,
    GA: 1.00,
    PA: 1.00,
    OH: 0.95,
    MI: 0.95,
    TN: 0.92,
    IN: 0.90,
    MO: 0.90,
    WI: 0.92,
    KY: 0.88,
    AL: 0.87,
    SC: 0.90,
    LA: 0.88,
    OK: 0.85,
    MS: 0.85,
    AR: 0.85,
    WV: 0.83,
  },

  // ─── Scope factors (overall project scaling) ──────────────────────────────
  scopeFactors: {
    cosmetic: 0.45,
    midrange: 1.0,
    full: 1.6,
  },
};
