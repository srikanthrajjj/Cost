import type { ExtractedMaterial, ExtractedScopeItem, QuoteExtraction } from "./types";
import { toMoneyNumber } from "./extractor";

/**
 * Instant client-side quote parsing from PDF text.
 * Never waits on AI. Advanced report can refine later.
 */

const MONEY_RE = /\$?\s*([\d]{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?)/g;
const TOTAL_RE =
  /(?:grand\s*total|total\s*amount|quote\s*total|contract\s*total|amount\s*due|project\s*total|invoice\s*total|\btotal\b)\s*[:.]?\s*\$?\s*([\d,]+(?:\.\d{2})?)/i;
const CONTRACTOR_RE =
  /(?:company|contractor|prepared\s*by|bill\s*to|from)\s*[:]\s*([A-Za-z0-9 &.'-]{3,60})/i;
const UNIT_RE = /\b(\d+(?:\.\d+)?)\s*(SQ|SF|SQFT|LF|EA|EACH|SQ\s*FT|SQUARES?)\b/i;
const LINE_ITEM_RE =
  /^(.*?\D)\s+(\d+(?:\.\d+)?)\s*(SQ|SF|SQFT|LF|EA|EACH|SQ\s*FT|SQUARES?)?(?:\s+\$?([\d,]+(?:\.\d{2})?))\s+\$?([\d,]+(?:\.\d{2})?)(?:\s+(.*))?$/i;

function cleanMoney(raw: string): number {
  return toMoneyNumber(raw) ?? 0;
}

function guessProjectType(text: string): string {
  const t = text.toLowerCase();
  if (/roof|shingle|underlayment|tear-?off|ridge\s*vent/.test(t)) return "roof";
  if (/kitchen|cabinet|countertop|backsplash/.test(t)) return "kitchen";
  if (/bathroom|vanity|shower|tub\b/.test(t)) return "bathroom";
  if (/hvac|furnace|heat\s*pump|air\s*condition/.test(t)) return "hvac";
  if (/window/.test(t)) return "windows";
  if (/floor|hardwood|lvp|tile\b/.test(t)) return "flooring";
  if (/solar|pv\b|panel/.test(t)) return "solar";
  if (/deck|railing/.test(t)) return "deck";
  if (/plumb/.test(t)) return "plumbing";
  if (/electric|panel\s*upgrade/.test(t)) return "electrical";
  return "roof";
}

function guessContractor(text: string): string {
  const labeled = text.match(CONTRACTOR_RE);
  if (labeled?.[1]) return labeled[1].trim();

  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  for (const line of lines.slice(0, 12)) {
    if (
      line.length >= 4 &&
      line.length <= 60 &&
      /llc|inc|company|roofing|construction|contracting|services/i.test(line) &&
      !/\$/.test(line)
    ) {
      return line.replace(/\s+/g, " ");
    }
  }
  return "";
}

function splitLines(text: string): string[] {
  const withBreaks = text
    .replace(/\r/g, "\n")
    .replace(/([a-z])([A-Z])/g, "$1\n$2")
    .replace(/(\d)\s{2,}([A-Za-z])/g, "$1\n$2")
    .replace(/\s{2,}/g, "\n")
    .replace(
      /((?:\$\s*)?[\d,]+(?:\.\d{2})?)\s+(?=[A-Za-z][A-Za-z/&(),.' -]{4,}\s+\d+(?:\.\d+)?(?:\s+(?:SQ|SF|SQFT|LF|EA|EACH|SQUARES?))?)/g,
      "$1\n",
    );

  const raw = withBreaks
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 2);

  if (raw.length >= 5) return raw;

  return text
    .split(/(?=\$\s*\d)/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 4);
}

function parseLine(line: string): ExtractedScopeItem | null {
  if (
    /description\s+qty|item\s+qty|subtotal|sales\s*tax|\btax\b|deposit|balance due|invoice\s*#|estimate\s*#|quote\s*#|page\s*\d|phone|email@|customer:|property:|date:/i.test(
      line,
    )
  ) {
    return null;
  }

  const tabularMatch = line.match(LINE_ITEM_RE);
  if (tabularMatch) {
    const [, rawName, rawQty, rawUnit, rawUnitPrice, rawTotal] = tabularMatch;
    const quantity = Number(rawQty);
    const unit = rawUnit ? rawUnit.replace(/\s+/g, "").toUpperCase() : "each";
    const unitPrice = cleanMoney(rawUnitPrice);
    const totalPrice = cleanMoney(rawTotal);
    const name = rawName.replace(/[:|-]+$/g, "").replace(/\s+/g, " ").trim();

    if (name.length >= 2 && totalPrice >= 0) {
      return {
        name,
        description: "",
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        unit: unit === "EA" ? "each" : unit.toLowerCase(),
        unitPrice: unitPrice > 0 && unitPrice !== totalPrice ? unitPrice : 0,
        totalPrice,
        notes: "Parsed instantly from quote text",
      };
    }
  }

  const moneyMatches = [...line.matchAll(MONEY_RE)];
  if (moneyMatches.length < 2) return null;

  const amounts = moneyMatches
    .map((m) => cleanMoney(m[1]))
    .filter((n) => n >= 1 && n < 500000);
  if (amounts.length < 2) return null;

  const totalPrice = amounts[amounts.length - 1];
  const unitPrice = amounts.length >= 2 ? amounts[amounts.length - 2] : 0;

  const unitMatch = line.match(UNIT_RE);
  const quantity = unitMatch ? Number(unitMatch[1]) : 1;
  const unit = unitMatch ? unitMatch[2].replace(/\s+/g, "").toUpperCase() : "each";

  let name = line
    .replace(MONEY_RE, " ")
    .replace(UNIT_RE, " ")
    .replace(/[:|-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (name.length < 2) name = "Quoted item";
  if (name.length > 80) name = name.slice(0, 80).trim();

  return {
    name,
    description: "",
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    unit: unit === "EA" ? "each" : unit.toLowerCase(),
    unitPrice: unitPrice > 0 && unitPrice !== totalPrice ? unitPrice : 0,
    totalPrice,
    notes: "Parsed instantly from quote text",
  };
}

function moneyOnlyFallback(text: string): ExtractedScopeItem[] {
  const amounts = [...text.matchAll(MONEY_RE)]
    .map((m) => cleanMoney(m[1]))
    .filter((n) => n >= 25 && n < 250000);

  const unique = [...new Set(amounts)].slice(0, 12);
  return unique.map((totalPrice, i) => ({
    name: `Line item ${i + 1}`,
    description: "Detected from quote amounts. Advanced report will name these properly.",
    quantity: 1,
    unit: "each",
    unitPrice: 0,
    totalPrice,
    notes: "Amount-only instant parse",
  }));
}

export function extractQuoteLocally(text: string): QuoteExtraction {
  const cleaned = text.replace(/\u0000/g, " ").trim();
  const empty: QuoteExtraction = {
    projectType: "roof",
    contractor: "",
    materials: [],
    scopeItems: [],
    permits: [],
    warranties: [],
    exclusions: [],
    totalPrice: 0,
    confidence: 0.2,
  };

  if (cleaned.length < 20) return empty;

  const lines = splitLines(cleaned);
  const scopeItems: ExtractedScopeItem[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    const item = parseLine(line);
    if (!item) continue;
    const key = `${item.name.toLowerCase()}|${item.totalPrice}`;
    if (seen.has(key)) continue;
    seen.add(key);
    scopeItems.push(item);
    if (scopeItems.length >= 40) break;
  }

  if (scopeItems.length === 0) {
    scopeItems.push(...moneyOnlyFallback(cleaned));
  }

  const totalMatch = cleaned.match(TOTAL_RE);
  let totalPrice = totalMatch ? cleanMoney(totalMatch[1]) : 0;
  if (!(totalPrice > 0)) {
    totalPrice = scopeItems.reduce((sum, i) => sum + (i.totalPrice || 0), 0);
  }

  const materials: ExtractedMaterial[] = [];

  return {
    projectType: guessProjectType(cleaned),
    contractor: guessContractor(cleaned),
    materials,
    scopeItems,
    permits: /permit/i.test(cleaned) ? ["Permit mentioned in quote"] : [],
    warranties: /warrant/i.test(cleaned) ? ["Warranty mentioned in quote"] : [],
    exclusions: [],
    totalPrice,
    confidence: scopeItems.length >= 3 ? 0.6 : 0.35,
  };
}
