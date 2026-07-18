import type { PricingInfo } from "@/types/knowledge";

export const roofingPricing: PricingInfo = {
  avgCost: 16650,
  lowEnd: 8600,
  highEnd: 24700,
  breakdown: [
    { category: "Materials (shingles, underlayment, flashing, vents)", percent: 35, amount: 5828 },
    { category: "Labor (tear-off, installation, cleanup)", percent: 40, amount: 6660 },
    { category: "Deck repair and prep", percent: 8, amount: 1332 },
    { category: "Permits and inspections", percent: 3, amount: 499 },
    { category: "Disposal and hauling", percent: 4, amount: 666 },
    { category: "Contingency (structural surprises, code upgrades)", percent: 10, amount: 1665 },
  ],
  costDrivers: [
    "Roof size (total squares — 1 square = 100 sq ft)",
    "Material type (asphalt vs metal vs tile vs slate)",
    "Roof pitch and complexity (steep, multiple valleys, hips)",
    "Number of existing layers (single tear-off vs multi-layer)",
    "Deck/sheathing condition (hidden rot repair costs)",
    "Height and accessibility (2+ stories, tight lot access)",
    "Local labor rates and contractor demand",
    "Removal of old materials (2+ layers adds $1–$3/sq ft)",
    "Ventilation upgrades required by code",
    "Season and timing (emergency repairs cost 20–30% more)",
  ],
};
