import type {
  Material,
  ScopeItem,
  PricingInfo,
  RedFlag,
  ContractorQuestion,
  InsuranceRule,
  BuildingCode,
} from "@/types/knowledge";

export const kitchenMaterials: Material[] = [
  {
    name: "Semi-Custom Cabinets",
    pros: ["80% of custom look", "Faster lead times", "Mid-range price", "Good quality"],
    cons: ["Limited customization", "Fewer finish options", "Lead time 6-8 weeks"],
    cost: "$10,000 – $20,000",
    durability: "15–25 years",
    maintenance: "Regular cleaning, hinge adjustments, soft-close repair",
    roi: "72%",
  },
  {
    name: "Quartz Countertops",
    pros: ["Non-porous", "Stain resistant", "Low maintenance", "Modern look"],
    cons: ["Expensive", "Not heat resistant", "Can't reseal", "Limited edge options"],
    cost: "$5,000 – $15,000",
    durability: "25+ years",
    maintenance: "Soap and water only, avoid extreme heat",
    roi: "70%",
  },
  {
    name: "Granite Countertops",
    pros: ["Natural stone", "Heat resistant", "Luxury look", "Very durable"],
    cons: ["Needs periodic sealing", "Porous (stains possible)", "More maintenance"],
    cost: "$4,000 – $12,000",
    durability: "50+ years",
    maintenance: "Annual sealing, careful care with acidic foods",
    roi: "65%",
  },
];

export const kitchenScopeItems: ScopeItem[] = [
  {
    name: "Cabinet removal & disposal",
    description: "Remove old cabinetry safely",
    timeframe: "1 day",
    included: true,
    optional: false,
  },
  {
    name: "Electrical upgrades",
    description: "Outlets, lighting, appliance circuits",
    timeframe: "2–3 days",
    included: true,
    optional: false,
  },
  {
    name: "Plumbing rough-in",
    description: "Sink, dishwasher connections",
    timeframe: "1–2 days",
    included: true,
    optional: false,
  },
  {
    name: "New cabinets",
    description: "Installation and finishing",
    timeframe: "3–5 days",
    included: true,
    optional: false,
  },
  {
    name: "Countertop installation",
    description: "Cut, seal, mount",
    timeframe: "1–2 days",
    included: true,
    optional: false,
  },
  {
    name: "Backsplash",
    description: "Tile or material installation",
    timeframe: "1–2 days",
    included: false,
    optional: true,
  },
  {
    name: "Island addition",
    description: "New island with seating",
    timeframe: "3–4 days",
    included: false,
    optional: true,
  },
];

export const kitchenPricing: PricingInfo = {
  avgCost: 50000,
  lowEnd: 25000,
  highEnd: 75000,
  breakdown: [
    { category: "Cabinets", percent: 40, amount: 20000 },
    { category: "Labor", percent: 35, amount: 17500 },
    { category: "Countertops", percent: 15, amount: 7500 },
    { category: "Fixtures & Finishes", percent: 10, amount: 5000 },
  ],
  costDrivers: [
    "Cabinet quality",
    "Countertop material",
    "Layout complexity",
    "Appliance upgrades",
    "Electrical/plumbing changes",
    "Hidden water damage",
  ],
};

export const kitchenRedFlags: RedFlag[] = [
  {
    flag: "No structural assessment before renovation",
    severity: "high",
    explanation: "Rotten subflooring or wall issues become expensive surprises",
    howToSpot: "Contractor doesn't inspect walls/floor before quoting",
  },
  {
    flag: "Vague appliance pricing",
    severity: "high",
    explanation: "'Appliances extra' in quote but no breakdown",
    howToSpot: "Quote doesn't specify if appliances included or pricing",
  },
  {
    flag: "No electrical inspection",
    severity: "medium",
    explanation: "Old kitchens often have outdated wiring needing upgrade",
    howToSpot: "Contractor doesn't mention electrical panel check",
  },
  {
    flag: "Cabinet discount from big-box stores",
    severity: "medium",
    explanation: "May not fit properly or have poor quality hinges",
    howToSpot: "Contractor sources from warehouse without inspection",
  },
];

export const kitchenQuestions: ContractorQuestion[] = [
  { question: "Is this a fixed price or cost-plus?", category: "payment" },
  { question: "What's included in 'full remodel'?", category: "scope" },
  { question: "Do you handle permits?", category: "scope" },
  { question: "What's your payment schedule?", category: "payment" },
  { question: "Who's responsible if we discover hidden damage?", category: "protection" },
  { question: "Can I see your kitchen installation portfolio?", category: "warranty" },
  { question: "What warranty covers cabinets vs. installation?", category: "warranty" },
];

export const kitchenInsurance: InsuranceRule[] = [
  {
    rule: "Kitchen remodels usually covered under homeowners",
    coverage: true,
    note: "If not weather-related",
  },
  {
    rule: "Water damage from plumbing work may require inspection",
    coverage: true,
    note: "Document before/after",
  },
  {
    rule: "Some policies cap kitchen claim amounts",
    coverage: false,
    note: "Check your policy limits",
  },
  {
    rule: "Installation defects not covered by homeowners",
    coverage: false,
    note: "Contractor warranty applies",
  },
];

export const kitchenBuildingCodes: BuildingCode[] = [
  {
    code: "Electrical",
    requirement: "Minimum 2 small appliance circuits (20A), 1 refrigerator circuit (dedicated)",
    inspection: true,
  },
  {
    code: "Sink",
    requirement: "Must have hot & cold water, accessible shutoff valves underneath",
    inspection: true,
  },
  {
    code: "Ventilation",
    requirement: "Range hood vented outside or recirculating filter required",
    inspection: true,
  },
  {
    code: "Counter space",
    requirement: "Minimum 24 inches per appliance (local variation)",
    inspection: true,
  },
];

export const kitchenSynonyms: string[] = [
  "kitchen remodel",
  "kitchen renovation",
  "kitchen upgrade",
  "kitchens",
  "cook space",
];

export const kitchenKnowledge = {
  projectType: "kitchen" as const,
  materials: kitchenMaterials,
  scope: kitchenScopeItems,
  pricing: kitchenPricing,
  redFlags: kitchenRedFlags,
  questions: kitchenQuestions,
  insurance: kitchenInsurance,
  buildingCodes: kitchenBuildingCodes,
  synonyms: kitchenSynonyms,
};
