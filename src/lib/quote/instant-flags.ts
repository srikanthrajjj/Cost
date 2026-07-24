import type { QuoteExtraction, RedFlagFinding, MissingItem } from "./types";

/** Instant, deterministic flags (no AI). Safe for the details screen and full analysis. */
export type InstantQuoteFlag = {
  id: string;
  severity: "high" | "medium" | "low";
  kind: "missing_permit" | "vague_grade" | "vague_finish";
  title: string;
  explanation: string;
  recommendation: string;
  evidence?: string;
};

const VAGUE_GRADE_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\bbuilder[\s-]?grade\b/i, label: "builder grade" },
  { re: /\bcontractor[\s-]?grade\b/i, label: "contractor grade" },
  { re: /\bstandard[\s-]?grade\b/i, label: "standard grade" },
  { re: /\bbasic[\s-]?grade\b/i, label: "basic grade" },
  { re: /\beconomy[\s-]?grade\b/i, label: "economy grade" },
  { re: /\bentry[\s-]?level\b/i, label: "entry level" },
  { re: /\bgood\s*\/\s*better\s*\/\s*best\b/i, label: "good/better/best" },
  { re: /\bstandard\s+(shingles?|cabinets?|fixtures?|materials?|paint|tile)\b/i, label: "standard materials" },
  { re: /\bquality\s+(shingles?|cabinets?|fixtures?|materials?)\b/i, label: "quality materials (unspecified)" },
  { re: /\bhigh[\s-]?end\s+finish(es)?\b/i, label: "high-end finish" },
  { re: /\bpremium\s+finish(es)?\b/i, label: "premium finish" },
  { re: /\bupgraded?\s+finish(es)?\b/i, label: "upgraded finish" },
  { re: /\bcustom\s+finish(es)?\b/i, label: "custom finish" },
  { re: /\ballowance\s+(for\s+)?(materials?|cabinets?|fixtures?|tile)\b/i, label: "material allowance" },
];

/** Brand / model cues that make a material line specific enough. */
const SPECIFICITY_HINT =
  /\b(owens\s*corning|gaf|certainteed|iko|tamko|malarkey|atlas|james\s*hardie|kohler|moen|delta|ge|samsung|whirlpool|bosch|subway|quartz|silestone|caesarstone|cambria|wilsonart|formica|pella|anderson|andersen|marvin|milgard|#\s*\d|[A-Z]{2,}\d{2,}|\d{2,}[A-Z]{2,}|architectural|laminate\s+class|r[- ]?\d{1,2})\b/i;

function lineTexts(extraction: QuoteExtraction): { name: string; notes: string }[] {
  return [
    ...extraction.materials.map((m) => ({ name: m.name, notes: m.notes || "" })),
    ...extraction.scopeItems.map((s) => ({
      name: s.name,
      notes: [s.description, s.notes].filter(Boolean).join(" "),
    })),
  ];
}

function collectSearchBlob(extraction: QuoteExtraction, rawText?: string): string {
  const parts = [
    rawText || "",
    ...lineTexts(extraction).flatMap((l) => [l.name, l.notes]),
    ...extraction.permits,
    ...extraction.warranties,
    ...extraction.exclusions,
  ];
  return parts.join("\n");
}

function mentionsPermit(blob: string): boolean {
  return /\bpermits?\b|\bbuilding\s+department\b|\binspection\s+fee\b|\bpermit\s+(fee|cost|included|required)\b/i.test(
    blob,
  );
}

function permitExcludedOrOwnerPaid(blob: string): boolean {
  return (
    /\bpermit(s)?\s+(not\s+included|excluded|by\s+owner|by\s+homeowner|owner'?s?\s+responsibility)\b/i.test(
      blob,
    ) ||
    /\b(homeowner|owner)\s+(to\s+)?(pull|obtain|pay\s+for)\s+permits?\b/i.test(blob) ||
    /\bno\s+permit(s)?\s+(needed|required|included)\b/i.test(blob)
  );
}

/**
 * Instant checks for the two biggest homeowner traps called out in the field:
 * missing permit costs, and vague material/finish grades that hide change orders.
 */
export function detectInstantQuoteFlags(
  extraction: QuoteExtraction,
  rawText?: string,
): InstantQuoteFlag[] {
  const flags: InstantQuoteFlag[] = [];
  const blob = collectSearchBlob(extraction, rawText);
  const blobLower = blob.toLowerCase();

  // ── Permits ───────────────────────────────────────────────────────────────
  const hasPermitField = extraction.permits.length > 0;
  const hasPermitMention = hasPermitField || mentionsPermit(blob);
  const permitShifted = permitExcludedOrOwnerPaid(blob);
  const permitLine = [...extraction.materials, ...extraction.scopeItems].find((i) =>
    /\bpermits?\b/i.test(i.name),
  );
  const permitFeeMissing =
    Boolean(permitLine) && !(permitLine && permitLine.totalPrice > 0);

  if (!hasPermitMention && !permitLine) {
    flags.push({
      id: "instant-missing-permit",
      severity: "high",
      kind: "missing_permit",
      title: "Permit costs not listed",
      explanation:
        "This quote does not mention building permits or permit fees. Missing permit line items often turn into change orders or leave the homeowner stuck with unexpected city fees.",
      recommendation:
        "Ask who pulls the permit, whether the fee is included, and what happens if inspection fails.",
    });
  } else if (permitShifted || permitFeeMissing) {
    flags.push({
      id: "instant-permit-owner",
      severity: "high",
      kind: "missing_permit",
      title: permitFeeMissing
        ? "Permit listed without a fee"
        : "Permit responsibility pushed to you",
      explanation: permitFeeMissing
        ? "A permit line appears, but no dollar amount is included. That usually means the city fee (and sometimes filing) will be billed later or left to you."
        : "The quote shifts permit work or cost to the homeowner, or says permits are not included. That is a common place surprise costs show up.",
      recommendation:
        "Confirm the exact permit fee, who files it, and whether inspection scheduling is included.",
      evidence: permitLine
        ? `${permitLine.name}${permitLine.totalPrice ? ` ($${permitLine.totalPrice})` : " ($0)"}`
        : extraction.permits[0] || "Permit language found in quote text",
    });
  }

  // ── Vague grades / finishes ───────────────────────────────────────────────
  const seenLabels = new Set<string>();
  for (const line of lineTexts(extraction)) {
    const combined = `${line.name} ${line.notes}`.trim();
    if (!combined) continue;

    for (const pattern of VAGUE_GRADE_PATTERNS) {
      const match = combined.match(pattern.re);
      if (!match) continue;
      const label = pattern.label;
      if (seenLabels.has(label)) continue;
      seenLabels.add(label);

      const specific = SPECIFICITY_HINT.test(combined);
      flags.push({
        id: `instant-vague-${label.replace(/\W+/g, "-")}`,
        severity: specific ? "medium" : "high",
        kind: label.includes("finish") ? "vague_finish" : "vague_grade",
        title: specific
          ? `Vague grade language: "${label}"`
          : `Vague material language: "${label}"`,
        explanation: specific
          ? `Line item uses "${label}" even though some product detail appears nearby. Confirm the exact brand, model, and finish so upgrades cannot be billed later.`
          : `Line item says "${label}" without a clear brand, model, or product spec. That is where extra costs often sneak in when you expect one quality level and get another.`,
        recommendation:
          'Ask for the exact brand, model/SKU, color/finish, and whether substitutions require a written change order before work starts.',
        evidence: combined.slice(0, 140),
      });
    }
  }

  // Also scan full raw text for vague grades not captured as line names
  if (rawText && rawText.length > 20) {
    for (const pattern of VAGUE_GRADE_PATTERNS) {
      const match = rawText.match(pattern.re);
      if (!match) continue;
      const label = pattern.label;
      if (seenLabels.has(label)) continue;
      seenLabels.add(label);
      flags.push({
        id: `instant-vague-raw-${label.replace(/\W+/g, "-")}`,
        severity: "high",
        kind: label.includes("finish") ? "vague_finish" : "vague_grade",
        title: `Vague language found: "${label}"`,
        explanation: `The quote text uses "${label}" without tying it to a specific product. Vague grades and finishes are a common source of change orders.`,
        recommendation:
          "Get the brand, model, and finish in writing before you sign.",
        evidence: match[0],
      });
    }
  }

  // Soft check: material lines with no brand and very generic names
  for (const m of extraction.materials) {
    const name = m.name.trim();
    if (name.length < 4) continue;
    if (SPECIFICITY_HINT.test(name)) continue;
    if (
      /\b(shingle|cabinet|fixture|countertop|tile|paint|window|door|appliance|underlayment|felt)\b/i.test(
        name,
      ) &&
      /\b(standard|basic|misc|material|allowance|as\s+needed|tbd|owner\s+select)\b/i.test(name)
    ) {
      const key = `generic-${name.toLowerCase()}`;
      if (seenLabels.has(key)) continue;
      seenLabels.add(key);
      flags.push({
        id: `instant-generic-${name.slice(0, 24).replace(/\W+/g, "-")}`,
        severity: "medium",
        kind: "vague_grade",
        title: `Unspecified material: "${name}"`,
        explanation:
          "This material line is too generic to lock quality or price. Without brand and grade, the contractor can substitute cheaper products later.",
        recommendation: "Ask for brand, model, and grade in writing for this line item.",
        evidence: name,
      });
    }
  }

  // Deduplicate by title
  const byTitle = new Map<string, InstantQuoteFlag>();
  for (const f of flags) {
    if (!byTitle.has(f.title)) byTitle.set(f.title, f);
  }

  // Prefer high severity first
  return [...byTitle.values()].sort((a, b) => {
    const rank = { high: 0, medium: 1, low: 2 };
    return rank[a.severity] - rank[b.severity];
  });
}

/** Map instant flags into analyzer finding shapes. */
export function instantFlagsToAnalysisParts(flags: InstantQuoteFlag[]): {
  redFlags: RedFlagFinding[];
  missingScope: MissingItem[];
  needsClarification: { name: string; matchedAs: string; question: string }[];
  questionsToAsk: string[];
  recommendations: string[];
} {
  const redFlags: RedFlagFinding[] = [];
  const missingScope: MissingItem[] = [];
  const needsClarification: { name: string; matchedAs: string; question: string }[] = [];
  const questionsToAsk: string[] = [];
  const recommendations: string[] = [];

  for (const flag of flags) {
    if (flag.kind === "missing_permit" && flag.id.includes("missing-permit")) {
      missingScope.push({
        id: flag.id,
        severity: flag.severity,
        title: `Missing: ${flag.title}`,
        explanation: flag.explanation,
        recommendation: flag.recommendation,
        expectedItem: "Building permit / permit fee",
      });
    } else {
      redFlags.push({
        id: flag.id,
        severity: flag.severity,
        title: flag.title,
        explanation: flag.evidence
          ? `${flag.explanation} Evidence: "${flag.evidence}".`
          : flag.explanation,
        recommendation: flag.recommendation,
        howToSpot: flag.evidence,
      });
    }

    if (flag.kind === "vague_grade" || flag.kind === "vague_finish") {
      needsClarification.push({
        name: flag.title,
        matchedAs: flag.evidence || flag.title,
        question: flag.recommendation,
      });
    }

    questionsToAsk.push(flag.recommendation);
    recommendations.push(flag.recommendation);
  }

  return { redFlags, missingScope, needsClarification, questionsToAsk, recommendations };
}
