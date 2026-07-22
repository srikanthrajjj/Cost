import type { QuoteAnalysisResult } from "./index";

const STORAGE_KEY = "costreno_quote_comparison";

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

export function addComparisonQuote(result: QuoteAnalysisResult): SavedQuote {
  const quotes = getComparisonQuotes();
  const id = `quote_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const entry: SavedQuote = {
    id,
    result: slimResult(result),
    savedAt: new Date().toISOString(),
  };
  quotes.push(entry);
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    }
  } catch (error) {
    console.warn("[quote-comparison] failed to persist quote", error);
  }
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
}

export function clearComparisonQuotes(): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}
