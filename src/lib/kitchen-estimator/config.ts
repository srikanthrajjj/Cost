import type { KitchenEstimateAnswers } from "./types";

// ─── Configuration Types ─────────────────────────────────────────────────────

export interface CardOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  priceImpact?: string;
}

export interface StepConfig {
  id: string;
  type: "single-card" | "multi-card" | "text-input" | "zip-input";
  title: string;
  subtitle?: string;
  options?: CardOption[];
  autoAdvance: boolean;
  showIf?: (answers: KitchenEstimateAnswers) => boolean;
}

export interface PathOption {
  id: "ai" | "manual";
  title: string;
  description: string;
  icon: string;
  estimatedTime: string;
  features: string[];
  privacyNote?: string;
}

export interface ResultsDisplayConfig {
  showAIObservations: boolean;
  showMaterialRecommendations: boolean;
  showContractorQuestions: boolean;
  showPDFExport: boolean;
  showProjectSave: boolean;
}

export interface CostCalculationConfig {
  baseCosts: Record<string, { low: number; mid: number; high: number }>;
  materialMultipliers: Record<string, number>;
  regionalMultipliers: Record<string, number>;
  scopeFactors: Record<string, number>;
}

export interface EstimatorConfig {
  projectType: "kitchen" | "bathroom" | "roof";
  steps: StepConfig[];
  costParams: CostCalculationConfig;
  aiPromptTemplate: string;
  resultsConfig: ResultsDisplayConfig;
}

// ─── Path Options ────────────────────────────────────────────────────────────

export const kitchenPathOptions: PathOption[] = [
  {
    id: "manual",
    title: "Answer questions",
    description:
      "Best if you don't have photos handy, or already know your materials.",
    icon: "clipboard",
    estimatedTime: "",
    features: [
      "Step-by-step guided questions",
      "Visual card selections",
      "Instant live estimate updates",
      "No photos needed",
    ],
  },
  {
    id: "ai",
    title: "Upload photos (AI)",
    description:
      "Faster if you have clear photos of your kitchen.",
    icon: "camera",
    estimatedTime: "",
    features: [
      "Auto-detect cabinet type & countertops",
      "Estimate kitchen size from photos",
      "Fewer manual questions",
      "AI-powered material recommendations",
    ],
    privacyNote: "Photos are only used to generate your estimate",
  },
];

// ─── Default Kitchen Steps (Manual Path) ─────────────────────────────────────

export const defaultKitchenSteps: StepConfig[] = [
  {
    id: "zipCode",
    type: "zip-input",
    title: "Where is your kitchen?",
    subtitle: "We'll adjust costs based on your local market rates.",
    autoAdvance: false,
  },
  {
    id: "kitchenSize",
    type: "single-card",
    title: "How big is your kitchen?",
    subtitle: "Select the option that best describes your kitchen size.",
    options: [
      {
        value: "small",
        label: "Small",
        description: "Under 100 sq ft (galley or apartment)",
        icon: "square",
        priceImpact: "Lower cost",
      },
      {
        value: "medium",
        label: "Medium",
        description: "100–200 sq ft (average home)",
        icon: "rectangle-horizontal",
        priceImpact: "Average cost",
      },
      {
        value: "large",
        label: "Large",
        description: "Over 200 sq ft (open concept or luxury)",
        icon: "maximize",
        priceImpact: "Higher cost",
      },
    ],
    autoAdvance: true,
  },
  {
    id: "remodelScope",
    type: "single-card",
    title: "What's the scope of your remodel?",
    subtitle: "This has the biggest impact on your total cost.",
    options: [
      {
        value: "cosmetic",
        label: "Cosmetic Refresh",
        description: "Paint, hardware, lighting, and minor updates",
        icon: "paintbrush",
        priceImpact: "$5K–$15K",
      },
      {
        value: "midrange",
        label: "Mid-Range Remodel",
        description: "New cabinets, countertops, flooring, and appliances",
        icon: "wrench",
        priceImpact: "$20K–$50K",
      },
      {
        value: "full",
        label: "Full Gut Renovation",
        description: "Complete teardown with layout changes and premium finishes",
        icon: "hard-hat",
        priceImpact: "$50K–$100K+",
      },
    ],
    autoAdvance: true,
  },
  {
    id: "cabinetType",
    type: "single-card",
    title: "What type of cabinets do you want?",
    subtitle: "Cabinets typically account for 30–40% of kitchen remodel costs.",
    options: [
      {
        value: "reface",
        label: "Reface Existing",
        description: "Keep cabinet boxes, replace doors and hardware",
        icon: "layers",
        priceImpact: "Lowest cost",
      },
      {
        value: "stock",
        label: "Stock Cabinets",
        description: "Pre-made standard sizes, limited styles",
        icon: "box",
        priceImpact: "Budget-friendly",
      },
      {
        value: "semicustom",
        label: "Semi-Custom",
        description: "Standard sizes with more finish and style options",
        icon: "settings",
        priceImpact: "Mid-range",
      },
      {
        value: "custom",
        label: "Custom Cabinets",
        description: "Fully custom sizes, materials, and finishes",
        icon: "star",
        priceImpact: "Premium",
      },
    ],
    autoAdvance: true,
    showIf: (answers) => answers.remodelScope !== "cosmetic",
  },
  {
    id: "countertopMaterial",
    type: "single-card",
    title: "What countertop material do you prefer?",
    subtitle: "Material choice affects both cost and durability.",
    options: [
      {
        value: "keep",
        label: "Keep Existing",
        description: "No changes to current countertops",
        icon: "check",
        priceImpact: "No cost",
      },
      {
        value: "laminate",
        label: "Laminate",
        description: "Affordable and available in many patterns",
        icon: "layers",
        priceImpact: "$10–$40/sq ft",
      },
      {
        value: "butcherblock",
        label: "Butcher Block",
        description: "Warm wood surface, great for prep areas",
        icon: "tree-deciduous",
        priceImpact: "$40–$80/sq ft",
      },
      {
        value: "quartz",
        label: "Quartz",
        description: "Engineered stone, durable and low-maintenance",
        icon: "gem",
        priceImpact: "$50–$100/sq ft",
      },
      {
        value: "granite",
        label: "Granite",
        description: "Natural stone, unique patterns, heat-resistant",
        icon: "mountain",
        priceImpact: "$60–$120/sq ft",
      },
      {
        value: "marble",
        label: "Marble",
        description: "Luxury natural stone, elegant appearance",
        icon: "sparkles",
        priceImpact: "$75–$150/sq ft",
      },
    ],
    autoAdvance: true,
    showIf: (answers) => answers.remodelScope !== "cosmetic",
  },
  {
    id: "applianceTier",
    type: "single-card",
    title: "What appliance tier are you considering?",
    subtitle: "Appliances can add $3K–$15K+ to your remodel budget.",
    options: [
      {
        value: "keep",
        label: "Keep Existing",
        description: "No new appliances needed",
        icon: "check",
        priceImpact: "No cost",
      },
      {
        value: "midrange",
        label: "Mid-Range",
        description: "Reliable brands like GE, Whirlpool, or LG",
        icon: "refrigerator",
        priceImpact: "$3K–$8K",
      },
      {
        value: "highend",
        label: "High-End",
        description: "Premium brands like Sub-Zero, Wolf, or Thermador",
        icon: "crown",
        priceImpact: "$10K–$20K+",
      },
    ],
    autoAdvance: true,
  },
  {
    id: "structuralChanges",
    type: "multi-card",
    title: "Any structural changes planned?",
    subtitle: "Select all that apply. These require permits and add complexity.",
    options: [
      {
        value: "wall-removal",
        label: "Wall Removal",
        description: "Open up the floor plan",
        icon: "move-horizontal",
        priceImpact: "+$3K–$10K",
      },
      {
        value: "island-addition",
        label: "Add Island",
        description: "New kitchen island with plumbing/electrical",
        icon: "plus-square",
        priceImpact: "+$3K–$8K",
      },
      {
        value: "plumbing-relocation",
        label: "Move Plumbing",
        description: "Relocate sink or dishwasher",
        icon: "droplets",
        priceImpact: "+$2K–$5K",
      },
      {
        value: "electrical-upgrade",
        label: "Electrical Upgrade",
        description: "New circuits, panel upgrade, or rewiring",
        icon: "zap",
        priceImpact: "+$1K–$4K",
      },
      {
        value: "window-changes",
        label: "Window Changes",
        description: "Add, enlarge, or relocate windows",
        icon: "app-window",
        priceImpact: "+$2K–$6K",
      },
      {
        value: "none",
        label: "None",
        description: "No structural changes planned",
        icon: "x",
        priceImpact: "No additional cost",
      },
    ],
    autoAdvance: false,
    showIf: (answers) => answers.remodelScope !== "cosmetic",
  },
  {
    id: "timeline",
    type: "single-card",
    title: "What's your timeline?",
    subtitle: "Flexible timelines can sometimes reduce costs with off-season scheduling.",
    options: [
      {
        value: "flexible",
        label: "Flexible",
        description: "No rush — can wait for the best deal",
        icon: "calendar",
        priceImpact: "May save 5–10%",
      },
      {
        value: "under8weeks",
        label: "Under 8 Weeks",
        description: "Want to start soon, moderate urgency",
        icon: "clock",
        priceImpact: "Standard pricing",
      },
      {
        value: "hard",
        label: "Hard Deadline",
        description: "Must be done by a specific date",
        icon: "alert-circle",
        priceImpact: "May cost 10–15% more",
      },
    ],
    autoAdvance: true,
  },
];

// ─── Default Kitchen Estimator Configuration ─────────────────────────────────

export const defaultKitchenConfig: EstimatorConfig = {
  projectType: "kitchen",
  steps: defaultKitchenSteps,
  costParams: {
    baseCosts: {
      cabinets: { low: 5000, mid: 12000, high: 25000 },
      countertops: { low: 2000, mid: 5000, high: 12000 },
      flooring: { low: 1500, mid: 3500, high: 7000 },
      labor: { low: 8000, mid: 15000, high: 30000 },
      appliances: { low: 3000, mid: 6000, high: 15000 },
      structural: { low: 0, mid: 5000, high: 15000 },
      permits: { low: 500, mid: 1500, high: 3000 },
      contingency: { low: 2000, mid: 4000, high: 8000 },
    },
    materialMultipliers: {
      laminate: 0.6,
      quartz: 1.0,
      granite: 1.2,
      marble: 1.8,
      butcherblock: 0.8,
      keep: 0.0,
      stock: 0.7,
      semicustom: 1.0,
      custom: 1.8,
      reface: 0.4,
    },
    regionalMultipliers: {
      CA: 1.45,
      NY: 1.4,
      MA: 1.35,
      WA: 1.3,
      CO: 1.2,
      TX: 1.05,
      FL: 1.05,
      GA: 1.0,
      OH: 0.95,
      MI: 0.95,
      IN: 0.9,
      KY: 0.88,
      MS: 0.85,
      AR: 0.85,
      WV: 0.85,
    },
    scopeFactors: {
      cosmetic: 0.3,
      midrange: 1.0,
      full: 1.8,
    },
  },
  aiPromptTemplate: `Analyze the following kitchen photos and provide a structured assessment including:
1. Cabinet type (stock, semi-custom, custom, or refaced)
2. Countertop material (laminate, quartz, granite, marble, butcher block, or other)
3. Flooring material (tile, hardwood, vinyl, or other)
4. Estimated kitchen size (small: under 100 sq ft, medium: 100-200 sq ft, large: over 200 sq ft)
5. Overall condition (excellent, good, fair, or poor)
6. Notable observations about the kitchen's current state

Respond in JSON format with confidence levels (0-100) for each detection.`,
  resultsConfig: {
    showAIObservations: true,
    showMaterialRecommendations: true,
    showContractorQuestions: true,
    showPDFExport: true,
    showProjectSave: true,
  },
};
