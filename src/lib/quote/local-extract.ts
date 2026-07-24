import type { ExtractedMaterial, ExtractedScopeItem, QuoteExtraction } from "./types";
import { toMoneyNumber } from "./extractor";

/**
 * Instant client-side quote parsing from PDF text.
 * Never waits on AI. Advanced report can refine later.
 */

const MONEY_RE = /\$?\s*([\d]{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?)/g;
const TOTAL_RE =
  /(?:grand\s*total|total\s*amount|quote\s*total|contract\s*total|amount\s*due|project\s*total|invoice\s*total|total\s*quote)\s*[:.]?\s*\$?\s*([\d,]+(?:\.\d{2})?)/i;
const CONTRACTOR_RE =
  /(?:company|contractor|prepared\s*by|bill\s*to|from)\s*[:]\s*([A-Za-z0-9 &.'-]{3,60})/i;
const UNIT_RE = /\b(\d+(?:\.\d+)?)\s*(SQ|SF|SQFT|LF|EA|EACH|SQ\s*FT|SQUARES?|sq|lf)\b/i;
const LINE_ITEM_RE =
  /^(.*?\D)\s+(\d+(?:\.\d+)?)\s*(SQ|SF|SQFT|LF|EA|EACH|SQ\s*FT|SQUARES?|sq|lf)?(?:\s+\$?([\d,]+(?:\.\d{2})?))\s+\$?([\d,]+(?:\.\d{2})?)(?:\s+(.*))?$/i;

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

/** Reject address / date / quote-number rows that get mistaken for priced line items. */
function isJunkLineName(name: string): boolean {
  const n = name.replace(/\s+/g, " ").trim();
  if (n.length < 2) return true;

  // City, ST or City, ST ZIP
  if (/^[A-Za-z .'-]{2,40},\s*[A-Z]{2}(\s+\d{5}(-\d{4})?)?$/i.test(n)) return true;
  if (/^(property|address|location|customer|project)\s*:/i.test(n)) return true;
  if (/\b(property|address|location)\b/i.test(n) && /[A-Z]{2}/.test(n)) return true;

  // Dates / estimate IDs
  if (
    /^(january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(
      n,
    )
  ) {
    return true;
  }
  if (/^(date|estimate\s*#|quote\s*#|invoice\s*#|po\s*#)\b/i.test(n)) return true;
  if (/^[A-Z]{1,4}-?\d{2,4}-?\d{0,6}$/i.test(n.replace(/\s+/g, ""))) return true;
  if (/^(sr|tx|est|inv)[-–]?\d/i.test(n)) return true;

  // Phone / email / page chrome
  if (/@|phone|tel:|www\.|https?:/i.test(n)) return true;
  if (/^page\s*\d/i.test(n)) return true;

  // Bare ZIP
  if (/^\d{5}(-\d{4})?$/.test(n)) return true;

  return false;
}

function isPlausibleLineItem(item: ExtractedScopeItem): boolean {
  if (isJunkLineName(item.name)) return false;

  // Tiny amounts usually come from ZIP fragments (78704 → $4) or page numbers
  if (item.totalPrice > 0 && item.totalPrice < 15 && !/tax|fee|permit/i.test(item.name)) {
    return false;
  }

  // Names that are almost empty after cleanup
  if (/^quoted item$/i.test(item.name)) return false;
  if (/^line item\s*\d+$/i.test(item.name) && item.totalPrice < 25) return false;

  return true;
}

function splitLines(text: string): string[] {
  const withBreaks = text
    .replace(/\r/g, "\n")
    .replace(/([a-z])([A-Z])/g, "$1\n$2")
    .replace(/(\d)\s{2,}([A-Za-z])/g, "$1\n$2")
    .replace(/\s{2,}/g, "\n")
    .replace(
      /((?:\$\s*)?[\d,]+(?:\.\d{2})?)\s+(?=[A-Za-z][A-Za-z/&(),.' -]{4,}\s+\d+(?:\.\d+)?(?:\s+(?:SQ|SF|SQFT|LF|EA|EACH|SQUARES?|sq|lf))?)/g,
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

/**
 * Parse space-collapsed PDF rows like:
 * "Tear-off shingles 32 sq $185 $5,920 Included"
 */
function parseCollapsedTableRow(line: string): ExtractedScopeItem | null {
  const m = line.match(
    /^([A-Za-z][A-Za-z0-9/&()' .+-]{2,60}?)\s+(\d+(?:\.\d+)?)\s*(sq|sf|sqft|lf|ea|each|squares?)?\s+\$?\s*([\d,]+(?:\.\d{2})?)\s+\$?\s*([\d,]+(?:\.\d{2})?)(?:\s+(.*))?$/i,
  );
  if (!m) return null;

  const [, rawName, rawQty, rawUnit, rawUnitPrice, rawTotal, notes] = m;
  const name = rawName.replace(/\s+/g, " ").trim();
  if (isJunkLineName(name)) return null;

  const quantity = Number(rawQty);
  const unit = rawUnit ? rawUnit.replace(/\s+/g, "").toLowerCase() : "each";
  const unitPrice = cleanMoney(rawUnitPrice);
  const totalPrice = cleanMoney(rawTotal);

  const item: ExtractedScopeItem = {
    name,
    description: notes?.trim() || "",
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    unit: unit === "ea" ? "each" : unit,
    unitPrice: unitPrice > 0 && unitPrice !== totalPrice ? unitPrice : 0,
    totalPrice,
    notes: notes?.trim() || "Parsed instantly from quote text",
  };

  return isPlausibleLineItem(item) ? item : null;
}

function parseLine(line: string): ExtractedScopeItem | null {
  if (
    /description\s+qty|item\s+qty|subtotal|sales\s*tax|\btax\b|deposit|balance due|invoice\s*#|estimate\s*#|quote\s*#|page\s*\d|phone|email@|customer:|property:|date:|total\s*quote|payment:|warranty:/i.test(
      line,
    )
  ) {
    return null;
  }

  // Prefer collapsed table parser for PDF text without hard line breaks
  const collapsed = parseCollapsedTableRow(line);
  if (collapsed) return collapsed;

  const tabularMatch = line.match(LINE_ITEM_RE);
  if (tabularMatch) {
    const [, rawName, rawQty, rawUnit, rawUnitPrice, rawTotal] = tabularMatch;
    const quantity = Number(rawQty);
    const unit = rawUnit ? rawUnit.replace(/\s+/g, "").toUpperCase() : "each";
    const unitPrice = cleanMoney(rawUnitPrice);
    const totalPrice = cleanMoney(rawTotal);
    const name = rawName.replace(/[:|-]+$/g, "").replace(/\s+/g, " ").trim();

    if (name.length >= 2 && totalPrice >= 0) {
      const item: ExtractedScopeItem = {
        name,
        description: "",
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        unit: unit === "EA" ? "each" : unit.toLowerCase(),
        unitPrice: unitPrice > 0 && unitPrice !== totalPrice ? unitPrice : 0,
        totalPrice,
        notes: "Parsed instantly from quote text",
      };
      return isPlausibleLineItem(item) ? item : null;
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

  const item: ExtractedScopeItem = {
    name,
    description: "",
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    unit: unit === "EA" ? "each" : unit.toLowerCase(),
    unitPrice: unitPrice > 0 && unitPrice !== totalPrice ? unitPrice : 0,
    totalPrice,
    notes: "Parsed instantly from quote text",
  };

  return isPlausibleLineItem(item) ? item : null;
}

/**
 * Split a single long PDF string into candidate rows using known roofing/reno item starts.
 */
function explodeInlineTable(text: string): string[] {
  const markers =
    /\b(Tear-?off(?:\s+shingles?)?|Synthetic underlayment|Architectural shingles|Ice\s*&\s*water(?:\s+shield)?|Starter shingles|Ridge cap(?:\s+shingles?)?|Ridge vent|Drip edge|Roof vents?|Flashing(?:\s+replacement)?|Dumpster(?:\s*&\s*cleanup)?|Permit|Labor|Underlayment)\b/gi;

  const indexes: number[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(markers.source, "gi");
  while ((match = re.exec(text)) !== null) {
    indexes.push(match.index);
  }
  if (indexes.length < 2) return [];

  const rows: string[] = [];
  for (let i = 0; i < indexes.length; i++) {
    const start = indexes[i];
    let end = i + 1 < indexes.length ? indexes[i + 1] : Math.min(text.length, start + 160);
    let chunk = text.slice(start, end).replace(/\s+/g, " ").trim();

    // Don't let totals / payment / warranty chrome pollute the row
    chunk = chunk
      .split(/\b(?:Total Quote|Grand Total|Subtotal|Payment|Warranty|Purposefully)\b/i)[0]
      .trim();

    if (chunk.length > 8) rows.push(chunk);
  }
  return rows;
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

  const lines = [...splitLines(cleaned), ...explodeInlineTable(cleaned)];
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

  // Permit line with $0 still counts as mentioned; owner-responsible notes are kept for flags
  const permitMentioned =
    /permit/i.test(cleaned) || scopeItems.some((i) => /permit/i.test(i.name));

  return {
    projectType: guessProjectType(cleaned),
    contractor: guessContractor(cleaned),
    materials,
    scopeItems,
    permits: permitMentioned
      ? [
          /owner\s+responsible|permit\s+not\s+included|by\s+owner/i.test(cleaned)
            ? "Permit listed as owner responsible / not included"
            : "Permit mentioned in quote",
        ]
      : [],
    warranties: /warrant/i.test(cleaned) ? ["Warranty mentioned in quote"] : [],
    exclusions: [],
    totalPrice,
    confidence: scopeItems.length >= 3 ? 0.6 : 0.35,
  };
}
