import type { EstimatorAnswers, ProjectType } from "./estimator-engine";

/** Roof surface area already captured (map or manual entry). */
export function hasRoofArea(a: EstimatorAnswers): boolean {
  return typeof a.roofSize === "number" && a.roofSize > 0;
}

/** Home size is used for non-roof projects and as a roof fallback only when roof area is unknown. */
export function shouldAskHomeSize(a: EstimatorAnswers): boolean {
  return (
    a.projectType !== "kitchen" &&
    a.projectType !== "bathroom" &&
    a.projectType !== "roof"
  );
}

/** Skip duplicate roof size question when map measurement already succeeded. */
export function shouldAskRoofSize(a: EstimatorAnswers): boolean {
  if (a.projectType !== "roof") return false;
  if (hasRoofArea(a) && a.roofSizeSource === "map") return false;
  return true;
}

// ─── Step / Question types ────────────────────────────────────────────────────

export type QuestionType =
  | "cards" // large icon cards
  | "select-grid" // smaller grid of choices
  | "number" // numeric input
  | "text" // text input
  | "toggle" // yes/no
  | "slider" // range slider
  | "budget" // budget input with preset chips
  | "photo-upload"; // AI photo upload for kitchen

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
  /** Plain-language explanation shown in the question info popover */
  info?: string;
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
        title: "ZIP code",
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
        info: "Home size is your total finished living area. We use it to size projects like HVAC, solar, or flooring when you do not enter specific measurements.",
        placeholder: "2,000",
        min: 200,
        max: 15000,
        step: 100,
        unit: "sq ft",
        showIf: shouldAskHomeSize,
      },
      {
        id: "squareFootage",
        type: "number",
        title: "Kitchen size (sq ft)",
        subtitle: "Average kitchen is 100–200 sq ft",
        placeholder: "150",
        min: 40,
        max: 500,
        step: 10,
        unit: "sq ft",
        showIf: (a) => a.projectType === "kitchen",
      },
      {
        id: "squareFootage",
        type: "number",
        title: "Bathroom size (sq ft)",
        subtitle: "Average bathroom is 40–100 sq ft",
        placeholder: "70",
        min: 20,
        max: 300,
        step: 5,
        unit: "sq ft",
        showIf: (a) => a.projectType === "bathroom",
      },
      {
        id: "yearBuilt",
        type: "number",
        title: "Year built",
        info: "The year your home was built helps us factor in older materials, permit rules, and possible asbestos or lead paint. Homes built before 1980 may need extra inspection work.",
        placeholder: "1985",
        min: 1900,
        max: 2026,
        step: 1,
        optional: true,
      },
      {
        id: "stories",
        type: "select-grid",
        title: "Number of stories",
        info: "For roof projects, taller homes need more ladder work and safety setup. That can add labor time compared to a single-story home.",
        optional: true,
        showIf: (a) => a.projectType !== "kitchen" && a.projectType !== "bathroom",
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
        info: "A repair fixes specific damaged areas. A full replacement removes the old roof and installs new materials across the entire surface. Replacement costs more upfront but is often better for roofs older than 15 years.",
        choices: [
          { value: "repair", icon: "🔨", label: "Repair", desc: "Fix specific areas" },
          { value: "replace", icon: "🏠", label: "Full replace", desc: "Entire roof" },
        ],
      },
      {
        id: "roofMaterial",
        type: "select-grid",
        title: "Preferred roofing material",
        info: "Asphalt shingles are the most common and affordable option. Metal, tile, wood, and slate cost more but often last longer and can change how your home looks and performs.",
        choices: [
          { value: "asphalt", icon: "⬛", label: "Asphalt shingles", desc: "Most popular" },
          { value: "metal", icon: "🔩", label: "Metal", desc: "Long-lasting" },
          { value: "tile", icon: "🟫", label: "Clay / tile", desc: "Mediterranean style" },
          { value: "wood", icon: "🪵", label: "Wood shake", desc: "Natural look" },
          { value: "slate", icon: "⬜", label: "Slate", desc: "Premium" },
        ],
      },
      {
        id: "roofSize",
        type: "number",
        title: "Roof size (sq ft)",
        info: "Roof area is measured on the sloped surface, not the floor plan below. Steeper or complex roofs cover more square feet than the footprint of your home.",
        subtitle: "Enter your roof size, or use map measurement on the location step",
        placeholder: "2,200",
        min: 500,
        max: 10000,
        step: 50,
        unit: "sq ft",
        optional: true,
        showIf: shouldAskRoofSize,
      },
      {
        id: "roofPitch",
        type: "select-grid",
        title: "How steep is your roof?",
        info: "Roof pitch is how steep your roof is. Steeper roofs need more material, extra safety equipment for workers, and often take longer to install.",
        subtitle: "Slope changes both the roof area and the labor needed.",
        choices: [
          { value: "low", icon: "📐", label: "Low slope", desc: "Easy to walk on" },
          { value: "medium", icon: "🏠", label: "Medium slope", desc: "Most common" },
          { value: "steep", icon: "⛰️", label: "Steep slope", desc: "Needs extra safety setup" },
        ],
      },
      {
        id: "roofComplexity",
        type: "select-grid",
        title: "How complex is the roof shape?",
        info: "Roof complexity refers to valleys, hips, dormers, and other angles. More cuts and flashing details mean more labor time and cost.",
        subtitle: "Valleys, hips, and dormers add cutting, flashing, and labor time.",
        choices: [
          { value: "simple", icon: "▭", label: "Simple", desc: "One or two flat planes" },
          { value: "average", icon: "🔷", label: "Average", desc: "A few valleys or hips" },
          { value: "complex", icon: "🧩", label: "Complex", desc: "Many angles or dormers" },
        ],
      },
      {
        id: "roofLayers",
        type: "select-grid",
        title: "How many roof layers are on the house?",
        info: "A roof layer is one complete set of shingles over the underlayment. If a second layer is already installed, crews must remove both during replacement, which adds tear-off and disposal cost.",
        subtitle: "Extra layers add tear-off labor and disposal cost.",
        optional: true,
        showIf: (a) => a.roofAction === "replace",
        choices: [
          { value: "one", icon: "1️⃣", label: "One layer", desc: "Standard tear-off" },
          { value: "two-plus", icon: "2️⃣", label: "Two or more", desc: "Extra tear-off cost" },
        ],
      },
      {
        id: "addGutters",
        type: "toggle",
        title: "Add new gutters?",
        info: "Gutters carry rainwater off the roof and away from your foundation. Many homeowners replace gutters during a roof project, especially if the old ones are rusted, sagging, or undersized.",
        optional: true,
      },
      {
        id: "addSkylights",
        type: "toggle",
        title: "Add skylights?",
        info: "Skylights bring natural light into rooms below the roof. Installing them during a roof replacement is often cheaper than adding them later, since crews are already on the roof and can seal around the opening.",
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
        id: "kitchenMethod",
        type: "select-grid",
        title: "How would you like to estimate?",
        info: "Photo upload uses AI to detect cabinets, counters, and layout so you answer fewer questions. Manual mode works well if you prefer not to share photos or want to choose each detail yourself.",
        choices: [
          { value: "manual", icon: "📋", label: "Answer Questions", desc: "No photos needed" },
          { value: "ai", icon: "📸", label: "Upload Photos (AI)", desc: "Fewer questions" },
        ],
      },
      {
        id: "kitchenPhotos" as any,
        type: "photo-upload",
        title: "Upload 2-6 photos of your kitchen",
        info: "Clear photos from a few angles help our AI identify your cabinets, counters, and overall layout. Photos are used only to build your estimate, not for marketing.",
        subtitle: "Our AI will detect materials, size, and condition automatically.",
        showIf: (a: EstimatorAnswers) => (a as any).kitchenMethod === "ai",
      },
      {
        id: "kitchenLayout" as any,
        type: "select-grid",
        title: "Are you changing the kitchen layout?",
        info: "Keeping the layout means plumbing, electrical, and walls stay where they are. Moving an island or removing a wall requires rerouting utilities and often costs significantly more.",
        subtitle: "Layout changes are a major cost driver — moving plumbing, electrical, or walls.",
        choices: [
          {
            value: "keep",
            icon: "✅",
            label: "Keep Current Layout",
            desc: "No structural changes",
          },
          {
            value: "minor",
            icon: "🔄",
            label: "Minor Changes",
            desc: "Move island or add peninsula",
          },
          {
            value: "major",
            icon: "🏗️",
            label: "Major Changes",
            desc: "Remove walls, move plumbing/electrical",
          },
        ],
        showIf: (a: EstimatorAnswers) => (a as any).kitchenMethod === "ai",
      },
      {
        id: "kitchenApplianceTier" as any,
        type: "select-grid",
        title: "What about appliances?",
        info: "Appliance tier covers the range, refrigerator, dishwasher, and similar items. Built-in and premium brands can add thousands compared to keeping what you already own.",
        subtitle: "Appliances can add $3K–$20K+ depending on tier.",
        choices: [
          { value: "keep", icon: "👍", label: "Keep Existing", desc: "No new appliances" },
          { value: "standard", icon: "🔲", label: "Standard", desc: "$3K–$6K" },
          { value: "midrange", icon: "⭐", label: "Mid-Range", desc: "$6K–$12K" },
          { value: "premium", icon: "👑", label: "Premium / Built-in", desc: "$12K–$25K+" },
        ],
        showIf: (a: EstimatorAnswers) => (a as any).kitchenMethod === "ai",
      },
      {
        id: "kitchenScope",
        type: "select-grid",
        title: "Scope of remodel",
        info: "A full remodel replaces cabinets, counters, flooring, and most finishes. A partial update focuses on specific items like counters or cabinets only.",
        showIf: (a: EstimatorAnswers) => (a as any).kitchenMethod !== "ai",
        choices: [
          { value: "full", icon: "🍳", label: "Full Remodel", desc: "Everything" },
          { value: "partial", icon: "🔧", label: "Partial Update", desc: "Select items only" },
        ],
      },
      {
        id: "kitchenCabinets",
        type: "select-grid",
        title: "Cabinet style",
        info: "Stock cabinets come in standard sizes from home stores. Semi-custom offers more sizes and finishes. Custom cabinets are built to fit your exact space and cost the most.",
        showIf: (a: EstimatorAnswers) => (a as any).kitchenMethod !== "ai",
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
        info: "Countertop material affects both price and durability. Laminate is budget-friendly. Quartz and granite are popular mid-range options. Marble is premium but needs more care.",
        showIf: (a: EstimatorAnswers) => (a as any).kitchenMethod !== "ai",
        choices: [
          { value: "laminate", icon: "⬜", label: "Laminate", desc: "Budget" },
          { value: "quartz", icon: "💎", label: "Quartz", desc: "Popular" },
          { value: "granite", icon: "🪨", label: "Granite", desc: "Classic" },
          { value: "marble", icon: "⚪", label: "Marble", desc: "Luxury" },
        ],
      },
      {
        id: "kitchenLayout" as any,
        type: "select-grid",
        title: "Are you changing the kitchen layout?",
        info: "Keeping the layout means plumbing, electrical, and walls stay where they are. Moving an island or removing a wall requires rerouting utilities and often costs significantly more.",
        subtitle: "Layout changes are a major cost driver.",
        showIf: (a: EstimatorAnswers) => (a as any).kitchenMethod !== "ai",
        choices: [
          {
            value: "keep",
            icon: "✅",
            label: "Keep Current Layout",
            desc: "No structural changes",
          },
          {
            value: "minor",
            icon: "🔄",
            label: "Minor Changes",
            desc: "Move island or add peninsula",
          },
          {
            value: "major",
            icon: "🏗️",
            label: "Major Changes",
            desc: "Remove walls, move plumbing/electrical",
          },
        ],
      },
      {
        id: "kitchenApplianceTier" as any,
        type: "select-grid",
        title: "What about appliances?",
        info: "Appliance tier covers the range, refrigerator, dishwasher, and similar items. Built-in and premium brands can add thousands compared to keeping what you already own.",
        showIf: (a: EstimatorAnswers) => (a as any).kitchenMethod !== "ai",
        choices: [
          { value: "keep", icon: "👍", label: "Keep Existing", desc: "No new appliances" },
          { value: "standard", icon: "🔲", label: "Standard", desc: "$3K–$6K" },
          { value: "midrange", icon: "⭐", label: "Mid-Range", desc: "$6K–$12K" },
          { value: "premium", icon: "👑", label: "Premium / Built-in", desc: "$12K–$25K+" },
        ],
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
        info: "A full remodel typically includes new tile, fixtures, vanity, and sometimes layout changes. A refresh updates fixtures and finishes without gutting the room.",
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
        info: "Fixture quality covers faucets, shower heads, toilets, and tubs. Mid-range fixtures balance style and durability. Luxury fixtures use higher-end materials and designer brands.",
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
        info: "Repair fixes a specific problem on your existing system. Replacement installs a new unit, which costs more but may save energy and avoid repeated repair bills.",
        choices: [
          { value: "repair", icon: "🔧", label: "Repair", desc: "Fix existing system" },
          { value: "replace", icon: "❄️", label: "Replace", desc: "Full new system" },
        ],
      },
      {
        id: "hvacType",
        type: "select-grid",
        title: "System type",
        info: "Central air uses ducts to cool the whole home. Heat pumps heat and cool efficiently. Mini-splits work room by room without ducts. Furnaces provide heat only.",
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
        info: "Glazing means how many panes of glass are in each window. Double pane is standard for energy savings. Triple pane adds insulation but costs more.",
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
        info: "Frame material affects price, maintenance, and insulation. Vinyl is low maintenance. Wood looks classic but needs upkeep. Fiberglass is durable and stable.",
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
        info: "Material choice drives both product and install cost. Hardwood and tile cost more per square foot than laminate or vinyl plank.",
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
        info: "Enter the square footage of the rooms getting new flooring, not your whole home. Leave blank if unsure and we will estimate from your home size.",
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
        info: "Panel count depends on your roof space and how much electricity you use. A typical home needs 20 to 25 panels. Leave blank if unsure and we will estimate from your home size.",
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
        info: "Battery storage saves excess solar power for use at night or during outages. It adds significant cost but may qualify for tax credits.",
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
        info: "Pressure-treated wood costs less upfront. Composite and PVC cost more initially but need less staining and sealing over time.",
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
        info: "Repairs fix a specific leak or clog. Repiping replaces old pipes throughout the home. Fixture work covers new sinks, toilets, or faucets.",
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
        info: "A panel upgrade increases your home's electrical capacity. Rewiring replaces old wiring. Adding outlets or circuits extends power to new areas.",
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
        info: "Overall condition tells us how much prep work may be needed before the project starts. Poor condition often means extra demo, repairs, or structural fixes that add cost.",
        choices: [
          { value: "excellent", icon: "✨", label: "Excellent", desc: "Like new" },
          { value: "good", icon: "👍", label: "Good", desc: "Minor wear" },
          { value: "fair", icon: "⚠️", label: "Fair", desc: "Noticeable issues" },
          { value: "poor", icon: "🔴", label: "Poor", desc: "Major problems" },
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
    title: "Insurance eligibility",
    subtitle: "This helps us check if you may be eligible for insurance coverage.",
    questions: [
      {
        id: "causeOfProject",
        type: "select-grid",
        title: "What caused this project for insurance?",
        info: "Insurance usually covers sudden damage from storms, fire, or burst pipes. Wear and tear and planned remodels are typically not covered. Your answer helps us flag possible claim scenarios.",
        choices: [
          { value: "storm", icon: "⛈️", label: "Storm damage", desc: "May be covered" },
          { value: "fire", icon: "🔥", label: "Fire damage", desc: "Likely covered" },
          { value: "water-damage", icon: "💧", label: "Water damage", desc: "Often covered" },
          { value: "wear-tear", icon: "⏳", label: "Wear and tear", desc: "Not covered" },
          { value: "remodeling", icon: "🏗️", label: "Home improvement", desc: "Not covered" },
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
