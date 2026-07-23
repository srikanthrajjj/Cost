import type { ExtractedMaterial, ExtractedScopeItem, QuoteExtraction } from "./types";
import { callOpenRouter, type OpenRouterCallOptions } from "./openrouter-client";

export interface ExtractQuoteOptions {
  signal?: AbortSignal;
  onRetry?: OpenRouterCallOptions["onRetry"];
  /** Fast details fetch: shorter input, no retries, lower token budget. */
  mode?: "fast" | "full";
}

export async function extractQuote(
  text: string,
  apiKey: string,
  options: ExtractQuoteOptions = {},
): Promise<QuoteExtraction> {
  const mode = options.mode ?? "full";
  const isFast = mode === "fast";

  // Truncate input to avoid overwhelming the model
  const maxInputChars = isFast ? 7000 : 12000;
  const truncatedText =
    text.length > maxInputChars ? text.substring(0, maxInputChars) + "\n[...truncated...]" : text;

  const systemPrompt = isFast
    ? `Extract contractor quote line items as JSON only. No prose.
{"projectType":"roof","contractor":"Name","materials":[{"name":"Item","quantity":1,"unit":"SQ","unitPrice":0,"totalPrice":0,"notes":""}],"scopeItems":[{"name":"Work","description":"","quantity":1,"unit":"LF","unitPrice":0,"totalPrice":0,"notes":""}],"permits":[],"warranties":[],"exclusions":[],"totalPrice":0,"confidence":0.8}
Rules: totalPrice=line total; unitPrice=per-unit rate; numbers only (no $); keep quote units; projectType one of roof|kitchen|bathroom|hvac|windows|flooring|painting|solar|deck|plumbing|electrical; extract every priced line you can.`
    : `You are a JSON extraction bot. You read contractor quotes and output structured JSON. NEVER output explanations, safety notes, or anything except valid JSON.

Output this exact JSON structure (fill with data from the quote):
{"projectType":"roof","contractor":"Company Name","materials":[{"name":"Material","quantity":32,"unit":"SQ","unitPrice":185,"totalPrice":5920,"notes":""}],"scopeItems":[{"name":"Work Item","description":"Details","quantity":140,"unit":"LF","unitPrice":3,"totalPrice":420,"notes":""}],"permits":["permit info"],"warranties":["warranty info"],"exclusions":["exclusion info"],"totalPrice":0,"confidence":0.8}

PRICE RULES (critical):
- unitPrice = price PER UNIT only (e.g. $3.00/LF). Never put the extended/line total in unitPrice.
- totalPrice = EXTENDED LINE TOTAL (quantity × unitPrice), the amount charged for that row.
- If the quote shows both a unit price and an extended/total column, use the extended/total for totalPrice.
- If only a unit rate is shown, set unitPrice to that rate and set totalPrice = quantity × unitPrice.
- NEVER put a unit rate into totalPrice when quantity > 1.
- NEVER use line numbers, row indexes, page numbers, or section numbers as prices.
- Prefer columns labeled Amount, Total, Extended, or Price Total over Unit Price / Rate.
- Preserve original units from the quote (SQ, LF, sq ft, each). Do not invent "each" when a measured unit exists.
- Currency strings like "$1,420.00" must become the number 1420 (no $ or commas).

OTHER RULES:
- Output ONLY the JSON object. Nothing else.
- Extract every line item you can find as either a material or scopeItem.
- projectType: roof, kitchen, bathroom, hvac, windows, flooring, painting, solar, deck, plumbing, or electrical.
- If you cannot determine a value, use 0 or empty string. Never omit fields.`;

  const userPrompt = `CONTRACTOR QUOTE TO EXTRACT:\n\n${truncatedText}\n\nRETURN JSON ONLY:`;

  const content = await callOpenRouter({
    apiKey,
    systemPrompt,
    userPrompt,
    model: "deepseek/deepseek-chat",
    temperature: 0.05,
    maxTokens: isFast ? 1800 : 3000,
    timeoutMs: isFast ? 12000 : 25000,
    maxRetries: isFast ? 0 : 2,
    signal: options.signal,
    onRetry: options.onRetry,
  });

  // Validate the response isn't a safety/moderation message
  const contentLower = content.toLowerCase().trim();
  if (
    contentLower.startsWith("user safety") ||
    contentLower.startsWith("i cannot") ||
    contentLower.startsWith("i'm sorry") ||
    contentLower.startsWith("as an ai") ||
    contentLower.includes("content policy") ||
    (content.length < 20 && !content.includes("{"))
  ) {
    throw new Error(
      "The AI model refused to process this document. Please try uploading again or use a different file format.",
    );
  }

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(stripCodeFences(content));
  } catch {
    // Try to extract JSON from the response if model added text around it
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        raw = JSON.parse(jsonMatch[0]);
      } catch {
        throw new Error(
          `Could not parse AI response as JSON. The model returned: "${content.substring(0, 150)}..."`,
        );
      }
    } else {
      throw new Error(
        `Could not parse AI response as JSON. The model returned: "${content.substring(0, 150)}..."`,
      );
    }
  }

  // Validate extraction isn't completely empty
  const extraction = normalizeExtraction(raw);
  if (extraction.materials.length === 0 && extraction.scopeItems.length === 0) {
    throw new Error(
      "The AI could not extract any items from this document. The PDF may be scanned/image-based. Try a text-based PDF or paste the quote text directly.",
    );
  }

  return extraction;
}

/** Strips markdown code fences some models wrap JSON in, e.g. ```json ... ``` */
function stripCodeFences(content: string): string {
  return content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

/** Maps common project-type aliases the LLM might return to the exact ProjectType values the knowledge base registers under (see estimator-engine.ts). */
const PROJECT_TYPE_ALIASES: Record<string, string> = {
  roofing: "roof",
  roofs: "roof",
  kitchens: "kitchen",
  bathrooms: "bathroom",
  bath: "bathroom",
};

function normalizeProjectType(value: string): string {
  const lower = value.trim().toLowerCase();
  return PROJECT_TYPE_ALIASES[lower] ?? lower;
}

/** Parse money-like values safely: "$1,420.00" → 1420, "3.00/LF" → 3 */
export function toMoneyNumber(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value !== "string") return 0;
  const cleaned = value
    .trim()
    .replace(/[$\s]/g, "")
    .replace(/,/g, "")
    .replace(/\/.*$/, ""); // drop trailing unit suffixes like /LF
  if (!cleaned) return 0;
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function roughlyEqual(a: number, b: number, tolerance = 0.02): boolean {
  if (a === 0 && b === 0) return true;
  const denom = Math.max(Math.abs(a), Math.abs(b), 1);
  return Math.abs(a - b) / denom <= tolerance;
}

/**
 * Repair common LLM price mistakes:
 * - unit rate copied into totalPrice
 * - missing total when qty × unitPrice is known
 */
export function repairLinePrices(input: {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}): { quantity: number; unitPrice: number; totalPrice: number; priceUnreliable: boolean } {
  let { quantity, unitPrice, totalPrice } = input;
  let priceUnreliable = false;

  if (quantity > 1 && unitPrice > 0) {
    const expected = quantity * unitPrice;
    // total equals unit price → model put the rate in totalPrice
    if (totalPrice === 0 || roughlyEqual(totalPrice, unitPrice)) {
      totalPrice = expected;
    } else if (totalPrice < expected * 0.4 && totalPrice < unitPrice * 2) {
      // total looks like a fragment / wrong column; prefer qty × unit
      totalPrice = expected;
    }
  }

  // qty > 1 but tiny total and no usable unit price → likely misread fragment
  if (quantity > 1 && totalPrice > 0 && totalPrice < 25 && unitPrice === 0) {
    priceUnreliable = true;
  }

  // Suspiciously tiny "total" with qty of 1 may still be a unit rate; leave value but flag
  if (quantity <= 1 && totalPrice > 0 && totalPrice < 15 && unitPrice === 0) {
    // Could be a real cheap item; only flag if also looks like a line number pattern later
  }

  return { quantity, unitPrice, totalPrice, priceUnreliable };
}

/**
 * True when a displayed vendor total looks like a unit rate or parse fragment,
 * not a real extended line amount.
 */
export function looksLikeMisparsedLineTotal(
  totalPrice: number,
  quantity: number,
  unitPrice = 0,
): boolean {
  if (totalPrice <= 0) return false;
  if (quantity > 1 && unitPrice > 0 && roughlyEqual(totalPrice, unitPrice)) return true;
  if (quantity > 1 && totalPrice < 25) return true;
  if (quantity > 1 && unitPrice > 0) {
    const expected = quantity * unitPrice;
    if (expected > 0 && totalPrice < expected * 0.4) return true;
  }
  return false;
}

/**
 * Defensively normalizes raw LLM extraction output into the exact QuoteExtraction
 * shape, regardless of whether the model used camelCase, snake_case, or slightly
 * different field names. This guards against silent schema drift breaking matchQuote().
 */
function normalizeExtraction(raw: Record<string, unknown>): QuoteExtraction {
  const pick = (obj: Record<string, unknown>, keys: string[]): unknown => {
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null) return obj[key];
    }
    return undefined;
  };

  const toNumber = toMoneyNumber;

  const toStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value.map((v) => {
      if (typeof v === "string") return v;
      if (v && typeof v === "object") {
        const obj = v as Record<string, unknown>;
        return String(pick(obj, ["description", "name", "text"]) ?? "");
      }
      return String(v ?? "");
    });
  };

  const normalizeMaterial = (m: unknown): ExtractedMaterial => {
    const obj = (m ?? {}) as Record<string, unknown>;
    const quantity = toNumber(pick(obj, ["quantity", "qty"]));
    let unitPrice = toNumber(
      pick(obj, ["unitPrice", "price_per_unit", "unit_price", "pricePerUnit", "rate", "unitRate"]),
    );
    let totalPrice = toNumber(
      pick(obj, [
        "totalPrice",
        "total_price",
        "extendedPrice",
        "extended_price",
        "lineTotal",
        "line_total",
        "amount",
        "total",
      ]),
    );

    // If model only returned a generic "price", treat it carefully
    const genericPrice = toNumber(pick(obj, ["price", "cost"]));
    if (totalPrice === 0 && unitPrice === 0 && genericPrice > 0) {
      if (quantity > 1) {
        // Prefer treating lone price as unit rate when qty > 1
        unitPrice = genericPrice;
        totalPrice = genericPrice * quantity;
      } else {
        totalPrice = genericPrice;
      }
    }

    const repaired = repairLinePrices({ quantity, unitPrice, totalPrice });
    return {
      name: String(pick(obj, ["name", "description", "material", "item"]) ?? ""),
      quantity: repaired.quantity,
      unit: String(pick(obj, ["unit", "units"]) ?? ""),
      unitPrice: repaired.unitPrice,
      totalPrice: repaired.priceUnreliable ? 0 : repaired.totalPrice,
      notes: pick(obj, ["notes", "note"]) as string | undefined,
    };
  };

  const normalizeScopeItem = (s: unknown): ExtractedScopeItem => {
    // Model may return scope items as plain strings instead of objects
    if (typeof s === "string") {
      return { name: s, quantity: 0, unit: "", unitPrice: 0, totalPrice: 0 };
    }
    const obj = (s ?? {}) as Record<string, unknown>;
    const quantity = toNumber(pick(obj, ["quantity", "qty"]));
    let unitPrice = toNumber(
      pick(obj, ["unitPrice", "price_per_unit", "unit_price", "pricePerUnit", "rate", "unitRate"]),
    );
    let totalPrice = toNumber(
      pick(obj, [
        "totalPrice",
        "total_price",
        "extendedPrice",
        "extended_price",
        "lineTotal",
        "line_total",
        "amount",
        "total",
      ]),
    );

    const genericPrice = toNumber(pick(obj, ["price", "cost"]));
    if (totalPrice === 0 && unitPrice === 0 && genericPrice > 0) {
      if (quantity > 1) {
        unitPrice = genericPrice;
        totalPrice = genericPrice * quantity;
      } else {
        totalPrice = genericPrice;
      }
    }

    const repaired = repairLinePrices({ quantity, unitPrice, totalPrice });
    return {
      name: String(pick(obj, ["name", "description", "item"]) ?? ""),
      description: pick(obj, ["description", "details"]) as string | undefined,
      quantity: repaired.quantity,
      unit: String(pick(obj, ["unit", "units"]) ?? ""),
      unitPrice: repaired.unitPrice,
      totalPrice: repaired.priceUnreliable ? 0 : repaired.totalPrice,
      notes: pick(obj, ["notes", "note"]) as string | undefined,
    };
  };

  const materialsRaw = pick(raw, ["materials"]);
  const scopeItemsRaw = pick(raw, ["scopeItems", "scope_items", "scope"]);
  const permitsRaw = pick(raw, ["permits"]);
  const warrantiesRaw = pick(raw, ["warranties"]);
  const exclusionsRaw = pick(raw, ["exclusions"]);

  return {
    projectType: normalizeProjectType(
      String(pick(raw, ["projectType", "project_type", "type"]) ?? ""),
    ),
    contractor: String(pick(raw, ["contractor", "contractor_name", "contractorName"]) ?? ""),
    materials: Array.isArray(materialsRaw) ? materialsRaw.map(normalizeMaterial) : [],
    scopeItems: Array.isArray(scopeItemsRaw) ? scopeItemsRaw.map(normalizeScopeItem) : [],
    permits: toStringArray(permitsRaw),
    warranties: toStringArray(warrantiesRaw),
    exclusions: toStringArray(exclusionsRaw),
    totalPrice: toNumber(pick(raw, ["totalPrice", "total_price", "grandTotal", "grand_total", "total"])),
    confidence: toNumber(pick(raw, ["confidence", "confidence_score", "confidenceScore"])),
  };
}
