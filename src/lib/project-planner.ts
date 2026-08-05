import type { ProjectType } from "@/lib/estimator-engine";
import { calculateEstimate } from "@/lib/estimator-engine";

export type PlannerProject = {
  id: ProjectType;
  name: string;
  shortDesc: string;
  /** Lower runs earlier in a whole-home sequence */
  sequenceRank: number;
  nationalLow: number;
  nationalMid: number;
  nationalHigh: number;
  timeline: string;
  permitLikely: boolean;
  disruptDays: string;
  checklist: string[];
  guideHref?: string;
  costLandingHref?: string;
  topicHref?: string;
};

export const PLANNER_PROJECTS: PlannerProject[] = [
  {
    id: "roof",
    name: "Roof replacement",
    shortDesc: "Shingles, metal, tile, tear-off, and flashing",
    sequenceRank: 10,
    nationalLow: 8600,
    nationalMid: 16650,
    nationalHigh: 24700,
    timeline: "3–5 days",
    permitLikely: true,
    disruptDays: "Medium outdoor noise",
    checklist: [
      "Confirm roof size, pitch, and layers",
      "Decide material and warranty goals",
      "Ask about decking contingency pricing",
      "Pull permit and schedule inspection",
    ],
    guideHref: "/guides/roof-replacement",
    costLandingHref: "/roof-replacement-cost",
    topicHref: "/topics/roof",
  },
  {
    id: "windows",
    name: "Window replacement",
    shortDesc: "Energy upgrades, frames, and install type",
    sequenceRank: 20,
    nationalLow: 6000,
    nationalMid: 12500,
    nationalHigh: 21000,
    timeline: "1–3 days",
    permitLikely: false,
    disruptDays: "Low to medium",
    checklist: [
      "Count windows by size and style",
      "Choose material and U-factor goals",
      "Confirm insert vs full-frame install",
      "Plan interior trim touch-up",
    ],
    guideHref: "/guides/window-replacement",
    costLandingHref: "/window-replacement-cost",
    topicHref: "/topics/windows",
  },
  {
    id: "hvac",
    name: "HVAC replacement",
    shortDesc: "Furnace, AC, heat pump, or full system",
    sequenceRank: 30,
    nationalLow: 4500,
    nationalMid: 8250,
    nationalHigh: 12000,
    timeline: "1–2 days",
    permitLikely: true,
    disruptDays: "Low after install day",
    checklist: [
      "Get a load calculation, not just a like-for-like swap",
      "Compare SEER2 / HSPF2 efficiency options",
      "Confirm duct condition and thermostat plan",
      "Ask about rebate and permit handling",
    ],
    guideHref: "/guides/hvac-installation",
    costLandingHref: "/hvac-installation-cost",
    topicHref: "/topics/hvac",
  },
  {
    id: "plumbing",
    name: "Plumbing",
    shortDesc: "Repipes, fixtures, water heater, and leaks",
    sequenceRank: 35,
    nationalLow: 1500,
    nationalMid: 6000,
    nationalHigh: 15000,
    timeline: "1–5 days",
    permitLikely: true,
    disruptDays: "Water shutoffs possible",
    checklist: [
      "List fixtures and known leak areas",
      "Decide repair vs partial repipe",
      "Confirm water heater type and location",
      "Schedule rough-in before finishes",
    ],
  },
  {
    id: "electrical",
    name: "Electrical",
    shortDesc: "Panel, circuits, rewiring, and lighting",
    sequenceRank: 36,
    nationalLow: 2000,
    nationalMid: 8000,
    nationalHigh: 18000,
    timeline: "1–5 days",
    permitLikely: true,
    disruptDays: "Power interruptions",
    checklist: [
      "Review panel capacity and age",
      "List new circuits (kitchen, EV, HVAC)",
      "Plan lighting and outlet layout",
      "Pull permit before opening walls",
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen remodel",
    shortDesc: "Cabinets, counters, appliances, and layout",
    sequenceRank: 50,
    nationalLow: 25000,
    nationalMid: 50000,
    nationalHigh: 75000,
    timeline: "4–8 weeks",
    permitLikely: true,
    disruptDays: "High. Limited cooking access",
    checklist: [
      "Set a hard budget and allowance list",
      "Finalize layout before ordering cabinets",
      "Confirm plumbing and electrical rough-in",
      "Choose counters and lead times early",
    ],
    guideHref: "/guides/kitchen-remodel",
    costLandingHref: "/kitchen-remodel-cost",
    topicHref: "/topics/kitchen",
  },
  {
    id: "bathroom",
    name: "Bathroom remodel",
    shortDesc: "Vanity, shower, tile, and waterproofing",
    sequenceRank: 55,
    nationalLow: 8000,
    nationalMid: 19000,
    nationalHigh: 30000,
    timeline: "2–4 weeks",
    permitLikely: true,
    disruptDays: "High for full gut",
    checklist: [
      "Decide cosmetic refresh vs full gut",
      "Confirm waterproofing and ventilation",
      "Pick tile and fixtures with lead times",
      "Plan temporary bathroom access",
    ],
    guideHref: "/guides/bathroom-remodel",
    costLandingHref: "/bathroom-remodel-cost",
  },
  {
    id: "flooring",
    name: "Flooring",
    shortDesc: "Hardwood, LVP, tile, carpet, and prep",
    sequenceRank: 70,
    nationalLow: 3000,
    nationalMid: 7500,
    nationalHigh: 14000,
    timeline: "2–4 days",
    permitLikely: false,
    disruptDays: "Medium. Room-by-room access",
    checklist: [
      "Measure net area after cabinets and stairs",
      "Confirm subfloor repairs",
      "Choose material for traffic and moisture",
      "Schedule after wet trades and painting prep",
    ],
    guideHref: "/guides/flooring",
    costLandingHref: "/flooring-cost",
    topicHref: "/topics/flooring",
  },
  {
    id: "painting",
    name: "Painting",
    shortDesc: "Interior, exterior, or both",
    sequenceRank: 75,
    nationalLow: 2000,
    nationalMid: 4500,
    nationalHigh: 8000,
    timeline: "3–7 days",
    permitLikely: false,
    disruptDays: "Low to medium",
    checklist: [
      "Decide interior, exterior, or both",
      "Count rooms and surface condition",
      "Plan after drywall and before flooring when possible",
      "Confirm paint quality and prep scope in writing",
    ],
  },
  {
    id: "deck",
    name: "Deck",
    shortDesc: "Wood, composite, railing, and stairs",
    sequenceRank: 80,
    nationalLow: 6000,
    nationalMid: 13000,
    nationalHigh: 22000,
    timeline: "3–7 days",
    permitLikely: true,
    disruptDays: "Outdoor only",
    checklist: [
      "Confirm size, height, and railing needs",
      "Choose wood vs composite",
      "Check setbacks and permit rules",
      "Plan after major exterior envelope work",
    ],
  },
  {
    id: "solar",
    name: "Solar panels",
    shortDesc: "Rooftop solar and optional battery",
    sequenceRank: 90,
    nationalLow: 15000,
    nationalMid: 25000,
    nationalHigh: 35000,
    timeline: "2–3 days install",
    permitLikely: true,
    disruptDays: "Low after roof is ready",
    checklist: [
      "Confirm roof age and remaining life first",
      "Review usage and utility interconnection",
      "Compare cash, loan, and lease carefully",
      "Ask about battery and panel layout",
    ],
    guideHref: "/guides/solar-panel-cost",
    costLandingHref: "/solar-panel-cost",
    topicHref: "/topics/energy",
  },
];

export const PLANNER_BY_ID: Record<ProjectType, PlannerProject> = Object.fromEntries(
  PLANNER_PROJECTS.map((p) => [p.id, p]),
) as Record<ProjectType, PlannerProject>;

export type PlannerPriority = "budget" | "timeline" | "quality";
export type PlannerStart = "asap" | "1-3-months" | "3-6-months" | "exploring";

export type PlannerInput = {
  projects: ProjectType[];
  zipCode?: string;
  squareFootage?: number;
  priority: PlannerPriority;
  start: PlannerStart;
};

export type PlannedProjectLine = {
  project: PlannerProject;
  low: number;
  mid: number;
  high: number;
  estimateHref: string;
};

export type PlannerResult = {
  lines: PlannedProjectLine[];
  totalLow: number;
  totalMid: number;
  totalHigh: number;
  sequencingNotes: string[];
  nextSteps: string[];
  regionLabel?: string;
};

function money(n: number) {
  return Math.max(0, Math.round(n));
}

export function buildPlannerResult(input: PlannerInput): PlannerResult {
  const selected = PLANNER_PROJECTS.filter((p) => input.projects.includes(p.id)).sort(
    (a, b) => a.sequenceRank - b.sequenceRank,
  );

  const sqft = input.squareFootage && input.squareFootage > 0 ? input.squareFootage : 2000;
  const zip = input.zipCode?.replace(/\D/g, "").slice(0, 5);

  const lines: PlannedProjectLine[] = selected.map((project) => {
    const est = calculateEstimate({
      projectType: project.id,
      zipCode: zip && zip.length === 5 ? zip : undefined,
      squareFootage: sqft,
      ...(project.id === "roof"
        ? {
            roofAction: "replace" as const,
            roofMaterial: "asphalt" as const,
            roofPitch: "standard" as const,
            stories: 1,
          }
        : {}),
    });

    // Prefer live engine when ZIP or size is present; otherwise national band.
    const useLive = Boolean(zip && zip.length === 5) || Boolean(input.squareFootage);
    const low = useLive ? est.low : project.nationalLow;
    const mid = useLive ? est.mid : project.nationalMid;
    const high = useLive ? est.high : project.nationalHigh;

    return {
      project,
      low: money(low),
      mid: money(mid),
      high: money(high),
      estimateHref: `/estimate?project=${project.id}`,
    };
  });

  let totalLow = lines.reduce((s, l) => s + l.low, 0);
  let totalMid = lines.reduce((s, l) => s + l.mid, 0);
  let totalHigh = lines.reduce((s, l) => s + l.high, 0);

  // Multi-project contingency for overlapping unknowns.
  if (lines.length >= 2) {
    totalLow = money(totalLow * 1.05);
    totalMid = money(totalMid * 1.08);
    totalHigh = money(totalHigh * 1.12);
  }

  const sequencingNotes: string[] = [];
  const ids = new Set(selected.map((p) => p.id));

  if (ids.has("roof") && ids.has("solar")) {
    sequencingNotes.push(
      "Complete or confirm roof condition before solar. Installing panels on a roof near end-of-life usually means paying twice.",
    );
  }
  if (ids.has("roof") && ids.has("painting")) {
    sequencingNotes.push("Finish roof work before exterior painting so new paint is not damaged by tear-off.");
  }
  if ((ids.has("kitchen") || ids.has("bathroom")) && ids.has("flooring")) {
    sequencingNotes.push(
      "Schedule flooring after cabinetry and wet-area work so new floors are not cut around unfinished trades.",
    );
  }
  if ((ids.has("plumbing") || ids.has("electrical")) && (ids.has("kitchen") || ids.has("bathroom"))) {
    sequencingNotes.push(
      "Run plumbing and electrical rough-in before final kitchen or bathroom finishes.",
    );
  }
  if (ids.has("hvac") && ids.has("painting")) {
    sequencingNotes.push("Replace HVAC before final interior paint when possible to reduce dust on fresh walls.");
  }
  if (sequencingNotes.length === 0) {
    sequencingNotes.push(
      "Work envelope and systems first (roof, windows, HVAC, plumbing, electrical), then kitchens and baths, then finishes.",
    );
  }

  if (input.priority === "budget") {
    sequencingNotes.push(
      "You prioritized budget. Phase projects over seasons if needed, and get at least three written quotes per trade.",
    );
  } else if (input.priority === "timeline") {
    sequencingNotes.push(
      "You prioritized timeline. Lock material lead times early and avoid stacking disruptive trades in the same week.",
    );
  } else {
    sequencingNotes.push(
      "You prioritized quality. Spend decision time on waterproofing, ventilation, and warranties, not just finish materials.",
    );
  }

  const nextSteps = [
    "Run a ZIP-based estimate for each project to refine local ranges",
    "Collect 3 written contractor quotes with matching scope",
    "Upload quotes to the quote analyzer before you sign",
    "Keep a 10% to 15% contingency for hidden conditions",
  ];

  if (input.start === "asap") {
    nextSteps.unshift("Confirm permit timelines in your city this week");
  } else if (input.start === "exploring") {
    nextSteps.unshift("Save this plan and revisit once your priority project is clearer");
  }

  return {
    lines,
    totalLow,
    totalMid,
    totalHigh,
    sequencingNotes,
    nextSteps,
  };
}

export const PLANNER_FAQS = [
  {
    q: "What is a home renovation project planner?",
    a: "A project planner helps you pick renovation projects, estimate a planning budget, put work in a sensible order, and know what to do next before you hire contractors.",
  },
  {
    q: "Which renovations can I plan in CostReno?",
    a: "You can plan roof replacement, windows, HVAC, plumbing, electrical, kitchen remodel, bathroom remodel, flooring, painting, deck, and solar.",
  },
  {
    q: "Is the planner the same as a contractor bid?",
    a: "No. Planner ranges are for budgeting and sequencing. A contractor bid reflects a site visit, exact materials, and labor. Use the planner first, then compare written quotes.",
  },
  {
    q: "What order should I renovate my home?",
    a: "A common sequence is envelope and systems first (roof, windows, HVAC, plumbing, electrical), then kitchens and bathrooms, then flooring and paint, then deck or solar. CostReno orders selected projects with those dependencies in mind.",
  },
  {
    q: "Do I need a ZIP code?",
    a: "ZIP is optional for a first pass, but adding it applies local labor and material multipliers so your planning range is closer to your market.",
  },
] as const;

export function formatMoneyRange(low: number, high: number) {
  return `$${low.toLocaleString()} – $${high.toLocaleString()}`;
}
