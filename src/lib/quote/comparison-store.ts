import type { QuoteAnalysisResult } from "./index";

const STORAGE_KEY = "costreno_quote_comparison";
export const COMPARISON_UPDATED_EVENT = "costreno-comparison-updated";

export interface SavedQuote {
  id: string;
  result: QuoteAnalysisResult;
  savedAt: string;
}

function slimResult(result: QuoteAnalysisResult): QuoteAnalysisResult {
  return {
    ...result,
    report: "",
  };
}

function notifyComparisonUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COMPARISON_UPDATED_EVENT));
}

export function getComparisonQuotes(): SavedQuote[] {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedQuote[];
  } catch {
    return [];
  }
}

function quoteFingerprint(result: QuoteAnalysisResult): string {
  const e = result.extraction;
  return [
    e.contractor || "",
    e.projectType || "",
    e.totalPrice || 0,
    e.materials?.length || 0,
    e.scopeItems?.length || 0,
  ].join("|");
}

/** Returns existing entry if this quote was already saved in this browser. */
export function findMatchingComparisonQuote(
  result: QuoteAnalysisResult,
): SavedQuote | undefined {
  const fp = quoteFingerprint(result);
  return getComparisonQuotes().find((q) => quoteFingerprint(q.result) === fp);
}

export function addComparisonQuote(result: QuoteAnalysisResult): SavedQuote {
  const existing = findMatchingComparisonQuote(result);
  if (existing) {
    notifyComparisonUpdated();
    return existing;
  }

  const quotes = getComparisonQuotes();
  const id = `quote_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const entry: SavedQuote = {
    id,
    result: slimResult(result),
    savedAt: new Date().toISOString(),
  };
  quotes.push(entry);

  try {
    if (typeof localStorage === "undefined") {
      throw new Error("Browser storage is not available.");
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch (error) {
    console.warn("[quote-comparison] failed to persist quote", error);
    throw new Error(
      "Could not save this quote for comparison. Try again, or clear older saved quotes.",
    );
  }

  notifyComparisonUpdated();
  return entry;
}

export function removeComparisonQuote(id: string): void {
  const quotes = getComparisonQuotes().filter((q) => q.id !== id);
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    }
  } catch (error) {
    console.warn("[quote-comparison] failed to update saved quotes", error);
  }
  notifyComparisonUpdated();
}

export function clearComparisonQuotes(): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
  notifyComparisonUpdated();
}
