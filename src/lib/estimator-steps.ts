import type { EstimatorAnswers, ProjectType } from "./estimator-engine";

// ─── Step / Question types ────────────────────────────────────────────────────

export type QuestionType =
  | "cards" // large icon cards
  | "select-grid" // smaller grid of choices
  | "number" // numeric input
  | "text" // text input
  | "toggle" // yes/no
  | "slider" // range slider
  | "budget"; // budget input with preset chips

export interface Choice {
  value: string;
  label: string;
  icon?: string; // emoji
  desc?: string;
  image?: string;
}

export interface Question {
  id: keyof EstimatorAnswers;
  type: QuestionType;
  title: string;
  subtitle?: string;
  choices?: Choice[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
  optional?: boolean;
  /** if provided, this question only appears when condition is true */
  showIf?: (a: EstimatorAnswers) => boolean;
}

export interface StepDef {
  id: string;
  title: string;
  subtitle?: string;
  questions: Question[];
  /** Only include this step when condition is true */
  showIf?: (a: EstimatorAnswers) => boolean;
}

// ─── All steps ────────────────────────────────────────────────────────────────

export const ALL_STEPS: StepDef[] = [
  // ── Step 1: Project type
  {
    id: "project",
    title: "What project are you planning?",
    subtitle: "Select the type of renovation you want to estimate.",
    questions: [
      {
        id: "projectType",
        type: "cards",
        title: "What project are you planning?",
        choices: [
          { value: "roof", icon: "/House.svg", label: "Roof Replacement", desc: "Avg $16,650" },
          { value: "kitchen", icon: "/Kitchen.svg", label: "Kitchen Remodel", desc: "Avg $50,000" },
          {
            value: "bathroom",
            icon: "/Bathtub.svg",
            label: "Bathroom Remodel",
            desc: "Avg $19,000",
          },
          { value: "hvac", icon: "/Air Conditioner.svg", label: "HVAC System", desc: "Avg $8,250" },
          { value: "windows", icon: "/Window.svg", label: "Windows", desc: "Avg $12,500" },
          { value: "flooring", icon: "/Floor Tiles.svg", label: "Flooring", desc: "Avg $7,500" },
          { value: "painting", icon: "/Paint Roller.svg", label: "Painting", desc: "Avg $4,500" },
          { value: "solar", icon: "/Solar Panel.svg", label: "Solar Panels", desc: "Avg $25,000" },
          { value: "deck", icon: "/Balcony.svg", label: "Deck / Patio", desc: "Avg $13,000" },
          { value: "plumbing", icon: "/Plumbing.svg", label: "Plumbing", desc: "Avg $6,000" },
          {
            value: "electrical",
            icon: "/Electrical Outlet.svg",
            label: "Electrical",
            desc: "Avg $8,000",
          },
        ],
      },
    ],
  },

  // ── Step 2: Location
  {
    id: "location",
    title: "Where is your property located?",
    subtitle: "We use your location to apply local labor and material rates.",
    questions: [
      {
        id: "zipCode",
        type: "text",
        title: "ZIP Code",
        placeholder: "e.g. 90210",
      },
    ],
  },

  // ── Step 3: Property details
  {
    id: "property",
    title: "Tell us about your property",
    subtitle: "This helps us size the estimate correctly.",
    questions: [
      {
        id: "propertyType",
        type: "select-grid",
        title: "Property type",
        choices: [
          { value: "single-family", icon: "🏡", label: "Single Family" },
          { value: "condo", icon: "🏢", label: "Condo" },
          { value: "townhouse", icon: "🏘️", label: "Townhouse" },
          { value: "multi-family", icon: "🏗️", label: "Multi-Family" },
        ],
      },
      {
        id: "squareFootage",
        type: "number",
        title: "Home size (sq ft)",
        placeholder: "2,000",
        min: 200,
        max: 15000,
        step: 100,
        unit: "sq ft",
      },
      {
        id: "yearBuilt",
        type: "number",
        title: "Year built",
        placeholder: "1985",
        min: 1900,
        max: 2024,
        step: 1,
        optional: true,
      },
      {
        id: "stories",
        type: "select-grid",
        title: "Number of stories",
        optional: true,
        choices: [
          { value: "1", label: "1 story", icon: "1️⃣" },
          { value: "2", label: "2 stories", icon: "2️⃣" },
          { value: "3", label: "3+ stories", icon: "🏗️" },
        ],
      },
    ],
  },

  // ── Step 4a: Roof details
  {
    id: "details-roof",
    title: "Let's get into the details",
    subtitle: "A few more questions about your roof project.",
    showIf: (a) => a.projectType === "roof",
    questions: [
      {
        id: "roofAction",
        type: "select-grid",
        title: "Repair or full replacement?",
        choices: [
          { value: "repair", icon: "🔨", label: "Repair", desc: "Fix specific areas" },
          { value: "replace", icon: "🏠", label: "Full Replace", desc: "Entire roof" },
        ],
      },
      {
        id: "roofMaterial",
        type: "select-grid",
        title: "Preferred roofing material",
        choices: [
          { value: "asphalt", icon: "⬛", label: "Asphalt Shingles", desc: "Most popular" },
          { value: "metal", icon: "🔩", label: "Metal", desc: "Long-lasting" },
          { value: "tile", icon: "🟫", label: "Clay / Tile", desc: "Mediterranean style" },
          { value: "wood", icon: "🪵", label: "Wood Shake", desc: "Natural look" },
          { value: "slate", icon: "⬜", label: "Slate", desc: "Premium" },
        ],
      },
      {
        id: "roofSize",
        type: "number",
        title: "Roof size (sq ft)",
        subtitle: "Leave blank to estimate from your home size",
        placeholder: "2,200",
        min: 500,
        max: 10000,
        step: 50,
        unit: "sq ft",
        optional: true,
      },
      {
        id: "addGutters",
        type: "toggle",
        title: "Add new gutters?",
        optional: true,
      },
      {
        id: "addSkylights",
        type: "toggle",
        title: "Add skylights?",
        optional: true,
      },
    ],
  },

  // ── Step 4b: Kitchen details
  {
    id: "details-kitchen",
    title: "About your kitchen remodel",
    showIf: (a) => a.projectType === "kitchen",
    questions: [
      {
        id: "kitchenScope",
        type: "select-grid",
        title: "Scope of remodel",
        choices: [
          { value: "full", icon: "🍳", label: "Full Remodel", desc: "Everything" },
          { value: "partial", icon: "🔧", label: "Partial Update", desc: "Select items only" },
        ],
      },
      {
        id: "kitchenCabinets",
        type: "select-grid",
        title: "Cabinet style",
        choices: [
          { value: "stock", icon: "📦", label: "Stock", desc: "Budget-friendly" },
          { value: "semi-custom", icon: "🪚", label: "Semi-Custom", desc: "Most popular" },
          { value: "custom", icon: "✨", label: "Custom", desc: "Premium" },
        ],
      },
      {
        id: "kitchenCountertops",
        type: "select-grid",
        title: "Countertop material",
        choices: [
          { value: "laminate", icon: "⬜", label: "Laminate", desc: "Budget" },
          { value: "quartz", icon: "💎", label: "Quartz", desc: "Popular" },
          { value: "granite", icon: "🪨", label: "Granite", desc: "Classic" },
          { value: "marble", icon: "⚪", label: "Marble", desc: "Luxury" },
        ],
      },
      {
        id: "kitchenAppliances",
        type: "toggle",
        title: "Include new appliances?",
      },
    ],
  },

  // ── Step 4c: Bathroom details
  {
    id: "details-bathroom",
    title: "About your bathroom remodel",
    showIf: (a) => a.projectType === "bathroom",
    questions: [
      {
        id: "bathroomScope",
        type: "select-grid",
        title: "Scope of remodel",
        choices: [
          { value: "full", icon: "🚿", label: "Full Remodel", desc: "Gut and rebuild" },
          { value: "partial", icon: "🔧", label: "Refresh", desc: "Update fixtures" },
        ],
      },
      {
        id: "bathroomCount",
        type: "select-grid",
        title: "How many bathrooms?",
        choices: [
          { value: "1", label: "1", icon: "1️⃣" },
          { value: "2", label: "2", icon: "2️⃣" },
          { value: "3", label: "3+", icon: "3️⃣" },
        ],
      },
      {
        id: "bathroomFixtures",
        type: "select-grid",
        title: "Fixture quality",
        choices: [
          { value: "standard", icon: "🔧", label: "Standard", desc: "Functional & clean" },
          { value: "mid-range", icon: "⭐", label: "Mid-Range", desc: "Popular choice" },
          { value: "luxury", icon: "💎", label: "Luxury", desc: "Spa-quality" },
        ],
      },
    ],
  },

  // ── Step 4d: HVAC details
  {
    id: "details-hvac",
    title: "About your HVAC project",
    showIf: (a) => a.projectType === "hvac",
    questions: [
      {
        id: "hvacAction",
        type: "select-grid",
        title: "Repair or replace?",
        choices: [
          { value: "repair", icon: "🔧", label: "Repair", desc: "Fix existing system" },
          { value: "replace", icon: "❄️", label: "Replace", desc: "Full new system" },
        ],
      },
      {
        id: "hvacType",
        type: "select-grid",
        title: "System type",
        choices: [
          { value: "central-air", icon: "❄️", label: "Central Air", desc: "Most common" },
          { value: "heat-pump", icon: "♻️", label: "Heat Pump", desc: "Energy-efficient" },
          { value: "furnace", icon: "🔥", label: "Furnace", desc: "Heating only" },
          { value: "mini-split", icon: "🌬️", label: "Mini-Split", desc: "Ductless" },
        ],
      },
    ],
  },

  // ── Step 4e: Windows
  {
    id: "details-windows",
    title: "About your window replacement",
    showIf: (a) => a.projectType === "windows",
    questions: [
      {
        id: "windowCount",
        type: "number",
        title: "Number of windows",
        placeholder: "10",
        min: 1,
        max: 60,
        step: 1,
        unit: "windows",
      },
      {
        id: "windowType",
        type: "select-grid",
        title: "Glazing type",
        choices: [
          { value: "single", icon: "🪟", label: "Single Pane", desc: "Basic" },
          { value: "double", icon: "🪟", label: "Double Pane", desc: "Most popular" },
          { value: "triple", icon: "🪟", label: "Triple Pane", desc: "Best insulation" },
        ],
      },
      {
        id: "windowMaterial",
        type: "select-grid",
        title: "Frame material",
        choices: [
          { value: "vinyl", icon: "⬜", label: "Vinyl", desc: "Low maintenance" },
          { value: "fiberglass", icon: "🔲", label: "Fiberglass", desc: "Durable" },
          { value: "wood", icon: "🪵", label: "Wood", desc: "Classic look" },
          { value: "aluminum", icon: "⚙️", label: "Aluminum", desc: "Commercial style" },
        ],
      },
    ],
  },

  // ── Step 4f: Flooring
  {
    id: "details-flooring",
    title: "About your flooring project",
    showIf: (a) => a.projectType === "flooring",
    questions: [
      {
        id: "flooringMaterial",
        type: "select-grid",
        title: "Flooring material",
        choices: [
          { value: "hardwood", icon: "🪵", label: "Hardwood", desc: "$8–$14/sq ft" },
          { value: "laminate", icon: "⬜", label: "Laminate", desc: "$4–$8/sq ft" },
          { value: "tile", icon: "🔲", label: "Tile", desc: "$7–$12/sq ft" },
          { value: "vinyl", icon: "⬛", label: "Vinyl/LVP", desc: "$3–$7/sq ft" },
          { value: "carpet", icon: "🟫", label: "Carpet", desc: "$2–$6/sq ft" },
        ],
      },
      {
        id: "flooringArea",
        type: "number",
        title: "Area to be floored (sq ft)",
        placeholder: "800",
        min: 50,
        max: 8000,
        step: 50,
        unit: "sq ft",
        optional: true,
      },
    ],
  },

  // ── Step 4g: Solar
  {
    id: "details-solar",
    title: "About your solar installation",
    showIf: (a) => a.projectType === "solar",
    questions: [
      {
        id: "solarPanelCount",
        type: "number",
        title: "Estimated number of panels",
        subtitle: "A typical home needs 20–25 panels",
        placeholder: "20",
        min: 5,
        max: 80,
        step: 1,
        unit: "panels",
        optional: true,
      },
      {
        id: "solarBattery",
        type: "toggle",
        title: "Add battery storage?",
        subtitle: "e.g. Tesla Powerwall (+$10,000–$15,000)",
      },
    ],
  },

  // ── Step 4h: Deck
  {
    id: "details-deck",
    title: "About your deck or patio",
    showIf: (a) => a.projectType === "deck",
    questions: [
      {
        id: "deckMaterial",
        type: "select-grid",
        title: "Deck material",
        choices: [
          { value: "wood", icon: "🪵", label: "Pressure Treated Wood", desc: "Budget-friendly" },
          { value: "composite", icon: "⬜", label: "Composite", desc: "Low maintenance" },
          { value: "pvc", icon: "⬛", label: "PVC", desc: "Premium durability" },
        ],
      },
      {
        id: "deckSize",
        type: "number",
        title: "Deck size (sq ft)",
        placeholder: "300",
        min: 50,
        max: 3000,
        step: 25,
        unit: "sq ft",
      },
    ],
  },

  // ── Step 4i: Plumbing
  {
    id: "details-plumbing",
    title: "About your plumbing project",
    showIf: (a) => a.projectType === "plumbing",
    questions: [
      {
        id: "plumbingType",
        type: "select-grid",
        title: "What type of plumbing work?",
        choices: [
          { value: "repair", icon: "🔧", label: "Repairs", desc: "Fix leaks/clogs" },
          { value: "repiping", icon: "🔩", label: "Repiping", desc: "Replace pipes" },
          { value: "fixture", icon: "🚰", label: "Fixtures", desc: "New sinks, toilets" },
        ],
      },
    ],
  },

  // ── Step 4j: Electrical
  {
    id: "details-electrical",
    title: "About your electrical project",
    showIf: (a) => a.projectType === "electrical",
    questions: [
      {
        id: "electricalType",
        type: "select-grid",
        title: "What type of electrical work?",
        choices: [
          { value: "panel-upgrade", icon: "⚡", label: "Panel Upgrade", desc: "200-amp service" },
          { value: "rewiring", icon: "🔌", label: "Rewiring", desc: "Replace wiring" },
          { value: "outlets", icon: "🔲", label: "Outlets/Lights", desc: "Add circuits" },
        ],
      },
    ],
  },

  // ── Step 4k: Painting
  {
    id: "details-painting",
    title: "About your painting project",
    showIf: (a) => a.projectType === "painting",
    questions: [
      {
        id: "paintingScope",
        type: "select-grid",
        title: "Interior, exterior, or both?",
        choices: [
          { value: "interior", icon: "🏠", label: "Interior", desc: "Inside only" },
          { value: "exterior", icon: "🌤️", label: "Exterior", desc: "Outside only" },
          { value: "both", icon: "🎨", label: "Both", desc: "Full project" },
        ],
      },
      {
        id: "paintingRooms",
        type: "number",
        title: "Number of rooms",
        placeholder: "5",
        min: 1,
        max: 30,
        step: 1,
        unit: "rooms",
        optional: true,
      },
    ],
  },

  // ── Step 5: Condition
  {
    id: "condition",
    title: "What's the current condition?",
    subtitle: "This helps us factor in any extra preparation work.",
    questions: [
      {
        id: "currentCondition",
        type: "select-grid",
        title: "Overall condition",
        choices: [
          { value: "excellent", icon: "✨", label: "Excellent", desc: "Like new" },
          { value: "good", icon: "👍", label: "Good", desc: "Minor wear" },
          { value: "fair", icon: "⚠️", label: "Fair", desc: "Noticeable issues" },
          { value: "poor", icon: "🔴", label: "Poor", desc: "Major problems" },
        ],
      },
      {
        id: "damageType",
        type: "select-grid",
        title: "Any specific damage?",
        optional: true,
        choices: [
          { value: "none", icon: "✅", label: "No damage", desc: "" },
          { value: "storm", icon: "⛈️", label: "Storm damage", desc: "" },
          { value: "water", icon: "💧", label: "Water damage", desc: "" },
          { value: "fire", icon: "🔥", label: "Fire damage", desc: "" },
          { value: "structural", icon: "🏗️", label: "Structural issue", desc: "" },
        ],
      },
    ],
  },

  // ── Step 6: Budget & Timeline
  {
    id: "budget",
    title: "Budget & timeline",
    subtitle: "Help us tailor the estimate to your plans.",
    questions: [
      {
        id: "desiredBudget",
        type: "budget",
        title: "What's your target budget?",
        optional: true,
        min: 1000,
        max: 200000,
        step: 500,
      },
      {
        id: "startTimeline",
        type: "select-grid",
        title: "When do you want to start?",
        optional: true,
        choices: [
          { value: "asap", icon: "🚀", label: "ASAP", desc: "Within weeks" },
          { value: "1-3months", icon: "📅", label: "1–3 months", desc: "" },
          { value: "3-6months", icon: "📆", label: "3–6 months", desc: "" },
          { value: "6-12months", icon: "🗓️", label: "6–12 months", desc: "" },
          { value: "planning", icon: "💭", label: "Just planning", desc: "No rush" },
        ],
      },
    ],
  },

  // ── Step 7: Insurance
  {
    id: "insurance",
    title: "What's driving this project?",
    subtitle: "This helps us check if you may be eligible for insurance coverage.",
    questions: [
      {
        id: "causeOfProject",
        type: "select-grid",
        title: "What caused this project?",
        choices: [
          { value: "storm", icon: "⛈️", label: "Storm Damage", desc: "May be covered" },
          { value: "fire", icon: "🔥", label: "Fire Damage", desc: "Likely covered" },
          { value: "water-damage", icon: "💧", label: "Water Damage", desc: "Often covered" },
          { value: "wear-tear", icon: "⏳", label: "Wear & Tear", desc: "Not covered" },
          { value: "remodeling", icon: "🏗️", label: "Home Improvement", desc: "Not covered" },
          { value: "other", icon: "❓", label: "Other", desc: "" },
        ],
      },
    ],
  },
];

// ─── Get the active steps for current answers ─────────────────────────────────
export function getActiveSteps(answers: EstimatorAnswers): StepDef[] {
  return ALL_STEPS.filter((s) => !s.showIf || s.showIf(answers));
}
