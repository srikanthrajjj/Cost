import type {
  Material,
  ScopeItem,
  PricingInfo,
  RedFlag,
  ContractorQuestion,
  InsuranceRule,
  BuildingCode,
} from "@/types/knowledge";

export const bathroomMaterials: Material[] = [
  {
    name: "Porcelain Tile",
    pros: [
      "Durable",
      "Water resistant",
      "Wide variety of designs",
      "Affordable",
      "Easy to replace",
    ],
    cons: ["Grout maintenance", "Cold underfoot", "Can be slippery when wet"],
    cost: "$2,000 – $5,000 (flooring)",
    durability: "20–30 years",
    maintenance: "Annual grout resealing, regular cleaning",
    roi: "65%",
  },
  {
    name: "Acrylic Tub",
    pros: ["Budget friendly", "Lightweight", "Easy to install", "Warm to touch"],
    cons: ["Cracks easily", "Stains over time", "Not luxurious feel"],
    cost: "$400 – $800",
    durability: "10–15 years",
    maintenance: "Regular cleaning, avoid abrasive cleaners",
    roi: "50%",
  },
  {
    name: "Cast Iron Tub",
    pros: ["Very durable", "Superior heat retention", "Luxe feel", "Heavy (stays in place)"],
    cons: ["Heavy (hard to install)", "Expensive", "Requires reinforcement"],
    cost: "$1,500 – $3,500",
    durability: "50+ years",
    maintenance: "Standard cleaning, occasional touch-up on coating",
    roi: "75%",
  },
];

export const bathroomScopeItems: ScopeItem[] = [
  {
    name: "Demolition",
    description: "Remove old fixtures, tile, walls",
    timeframe: "1–2 days",
    included: true,
    optional: false,
  },
  {
    name: "Plumbing rough-in",
    description: "Drain, supply lines, ventilation",
    timeframe: "1–2 days",
    included: true,
    optional: false,
  },
  {
    name: "Tile flooring",
    description: "Substrate, waterproofing, tile, grout",
    timeframe: "2–3 days",
    included: true,
    optional: false,
  },
  {
    name: "Shower/tub surround",
    description: "Walls, tile, waterproofing",
    timeframe: "2–3 days",
    included: true,
    optional: false,
  },
  {
    name: "Fixtures (sink, toilet, tub)",
    description: "Installation and connection",
    timeframe: "1 day",
    included: true,
    optional: false,
  },
  {
    name: "Lighting & exhaust fan",
    description: "Electrical installation",
    timeframe: "0.5 days",
    included: true,
    optional: false,
  },
  {
    name: "Heated floor",
    description: "Radiant heating system",
    timeframe: "1 day",
    included: false,
    optional: true,
  },
];

export const bathroomPricing: PricingInfo = {
  avgCost: 19000,
  lowEnd: 8000,
  highEnd: 30000,
  breakdown: [
    { category: "Labor", percent: 40, amount: 7600 },
    { category: "Tile & Materials", percent: 35, amount: 6650 },
    { category: "Fixtures", percent: 15, amount: 2850 },
    { category: "Permits & Misc", percent: 10, amount: 1900 },
  ],
  costDrivers: [
    "Bathroom size",
    "Tile quality",
    "Fixture type",
    "Plumbing changes",
    "Hidden water damage",
    "Ventilation upgrades",
  ],
};

export const bathroomRedFlags: RedFlag[] = [
  {
    flag: "No waterproofing inspection",
    severity: "high",
    explanation: "Water damage is the #1 cause of bathroom failures and mold",
    howToSpot: "Contractor skips waterproofing membrane discussion",
  },
  {
    flag: "Tile directly on drywall",
    severity: "high",
    explanation: "Should be on cement board or waterproof substrate",
    howToSpot: "Contractor plans tile over existing drywall",
  },
  {
    flag: "No ventilation upgrade",
    severity: "medium",
    explanation: "New bathroom should have proper exhaust fan",
    howToSpot: "Contractor doesn't mention ventilation work",
  },
  {
    flag: "Cutting corners on plumbing venting",
    severity: "high",
    explanation: "Drain line venting is critical for proper function",
    howToSpot: "Contractor doesn't discuss vent routing",
  },
];

export const bathroomQuestions: ContractorQuestion[] = [
  { question: "What waterproofing method are you using?", category: "scope" },
  { question: "Is the exhaust fan vented outside or to attic?", category: "scope" },
  { question: "What if we find mold or rot during demo?", category: "protection" },
  { question: "Are fixtures included or are we buying separately?", category: "scope" },
  { question: "What's your tile warranty (material vs labor)?", category: "warranty" },
  { question: "How do you prevent water leaks around plumbing?", category: "process" },
];

export const bathroomInsurance: InsuranceRule[] = [
  {
    rule: "Bathroom water damage often NOT covered (normal wear)",
    coverage: false,
    note: "Pre-existing conditions excluded",
  },
  {
    rule: "Mold from poor ventilation typically not covered",
    coverage: false,
    note: "Preventable through proper ventilation",
  },
  {
    rule: "Installation defects not covered by homeowners",
    coverage: false,
    note: "Contractor warranty applies",
  },
  {
    rule: "Storm damage to bathrooms is usually covered",
    coverage: true,
    note: "Document damage with photos",
  },
];

export const bathroomBuildingCodes: BuildingCode[] = [
  {
    code: "GFCI protection",
    requirement: "Required for all outlets within 6 feet of sink",
    inspection: true,
  },
  { code: "Exhaust fan", requirement: "Required, vented outside (not to attic)", inspection: true },
  {
    code: "Ventilation",
    requirement: "Minimum 20 CFM per 50 sq ft or hourly air changes",
    inspection: true,
  },
  {
    code: "Blocking",
    requirement: "Required for towel bars, grab bars (in walls during demo)",
    inspection: true,
  },
];

export const bathroomSynonyms: string[] = [
  "bath",
  "bathroom renovation",
  "bathroom remodel",
  "restroom",
  "lavatory",
  "powder room",
];

export const bathroomKnowledge = {
  projectType: "bathroom" as const,
  materials: bathroomMaterials,
  scope: bathroomScopeItems,
  pricing: bathroomPricing,
  redFlags: bathroomRedFlags,
  questions: bathroomQuestions,
  insurance: bathroomInsurance,
  buildingCodes: bathroomBuildingCodes,
  synonyms: bathroomSynonyms,
};
