import type { QuoteAnalysisResult } from "./index";

const STORAGE_KEY = "costreno_quote_comparison";

export interface SavedQuote {
  id: string;
  result: QuoteAnalysisResult;
  savedAt: string;
}

export function getComparisonQuotes(): SavedQuote[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedQuote[];
  } catch {
    return [];
  }
}

export function addComparisonQuote(result: QuoteAnalysisResult): SavedQuote {
  const quotes = getComparisonQuotes();
  const id = `quote_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const entry: SavedQuote = { id, result, savedAt: new Date().toISOString() };
  quotes.push(entry);
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  return entry;
}

export function removeComparisonQuote(id: string): void {
  const quotes = getComparisonQuotes().filter((q) => q.id !== id);
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

export function clearComparisonQuotes(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
