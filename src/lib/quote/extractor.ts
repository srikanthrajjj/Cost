import type { ExtractedMaterial, ExtractedScopeItem, QuoteExtraction } from "./types";
import { callOpenRouter, type OpenRouterCallOptions } from "./openrouter-client";

export interface ExtractQuoteOptions {
  signal?: AbortSignal;
  onRetry?: OpenRouterCallOptions["onRetry"];
}

export async function extractQuote(
  text: string,
  apiKey: string,
  options: ExtractQuoteOptions = {},
): Promise<QuoteExtraction> {
  // Truncate input to avoid overwhelming the model
  const maxInputChars = 5000;
  const truncatedText = text.length > maxInputChars
    ? text.substring(0, maxInputChars) + "\n[...truncated...]"
    : text;

  const systemPrompt = `You are a JSON extraction bot. You read contractor quotes and output structured JSON. NEVER output explanations, safety notes, or anything except valid JSON.

Output this exact JSON structure (fill with data from the quote):
{"projectType":"roof","contractor":"Company Name","materials":[{"name":"Material","quantity":1,"unit":"sq ft","unitPrice":0,"totalPrice":0,"notes":""}],"scopeItems":[{"name":"Work Item","description":"Details","quantity":1,"unit":"each","totalPrice":0,"notes":""}],"permits":["permit info"],"warranties":["warranty info"],"exclusions":["exclusion info"],"totalPrice":0,"confidence":0.8}

RULES:
- Output ONLY the JSON object. Nothing else.
- Extract every line item you can find as either a material or scopeItem.
- projectType: roof, kitchen, bathroom, hvac, windows, flooring, painting, solar, deck, plumbing, or electrical.
- If you cannot determine a value, use 0 or empty string. Never omit fields.`;

  const userPrompt = `CONTRACTOR QUOTE TO EXTRACT:\n\n${truncatedText}\n\nRETURN JSON ONLY:`;

  // Use deepseek-chat which is very cheap ($0.14/M input, $0.28/M output) and reliable for JSON
  const content = await callOpenRouter({
    apiKey,
    systemPrompt,
    userPrompt,
    model: "deepseek/deepseek-chat",
    temperature: 0.05,
    maxTokens: 3000,
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
      "The AI model refused to process this document. Please try uploading again or use a different file format."
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
        throw new Error(`Could not parse AI response as JSON. The model returned: "${content.substring(0, 150)}..."`);
      }
    } else {
      throw new Error(`Could not parse AI response as JSON. The model returned: "${content.substring(0, 150)}..."`);
    }
  }

  // Validate extraction isn't completely empty
  const extraction = normalizeExtraction(raw);
  if (extraction.materials.length === 0 && extraction.scopeItems.length === 0) {
    throw new Error(
      "The AI could not extract any items from this document. The PDF may be scanned/image-based. Try a text-based PDF or paste the quote text directly."
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

  const toNumber = (value: unknown): number => {
    const n = typeof value === "string" ? parseFloat(value) : value;
    return typeof n === "number" && !Number.isNaN(n) ? n : 0;
  };

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
    return {
      name: String(pick(obj, ["name", "description", "material", "item"]) ?? ""),
      quantity: toNumber(pick(obj, ["quantity", "qty"])),
      unit: String(pick(obj, ["unit", "units"]) ?? ""),
      unitPrice: toNumber(pick(obj, ["unitPrice", "price_per_unit", "unit_price", "pricePerUnit"])),
      totalPrice: toNumber(pick(obj, ["totalPrice", "total_price", "total"])),
      notes: pick(obj, ["notes", "note"]) as string | undefined,
    };
  };

  const normalizeScopeItem = (s: unknown): ExtractedScopeItem => {
    // Model may return scope items as plain strings instead of objects
    if (typeof s === "string") {
      return { name: s, quantity: 0, unit: "", totalPrice: 0 };
    }
    const obj = (s ?? {}) as Record<string, unknown>;
    return {
      name: String(pick(obj, ["name", "description", "item"]) ?? ""),
      description: pick(obj, ["description", "details"]) as string | undefined,
      quantity: toNumber(pick(obj, ["quantity", "qty"])),
      unit: String(pick(obj, ["unit", "units"]) ?? ""),
      totalPrice: toNumber(pick(obj, ["totalPrice", "total_price", "total"])),
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
    totalPrice: toNumber(pick(raw, ["totalPrice", "total_price", "total"])),
    confidence: toNumber(pick(raw, ["confidence", "confidence_score", "confidenceScore"])),
  };
}
