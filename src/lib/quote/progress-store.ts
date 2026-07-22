import type { QuoteAnalysisResult } from "./index";

const STORAGE_KEY = "costreno_quote_progress_v1";

export interface SavedQuoteProgress {
  signature: string;
  savedAt: string;
  result: QuoteAnalysisResult;
  completedChecklistIds: string[];
}

export interface QuoteFollowUpAction {
  tone: "urgent" | "review" | "good";
  title: string;
  detail: string;
}

export function getQuoteProgressSignature(result: QuoteAnalysisResult): string {
  const itemCount = result.extraction.materials.length + result.extraction.scopeItems.length;
  return [
    result.extraction.projectType || "unknown-project",
    result.extraction.contractor || "unknown-contractor",
    result.extraction.totalPrice || 0,
    result.analysis.summary.completenessScore,
    itemCount,
  ].join("|");
}

export function getSavedQuoteProgress(): SavedQuoteProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedQuoteProgress;
    if (!parsed?.result?.analysis || !parsed?.result?.extraction || !parsed.signature) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveQuoteProgress(result: QuoteAnalysisResult): SavedQuoteProgress {
  const entry: SavedQuoteProgress = {
    signature: getQuoteProgressSignature(result),
    savedAt: new Date().toISOString(),
    result,
    completedChecklistIds: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  return entry;
}

export function clearSavedQuoteProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function updateSavedQuoteChecklist(signature: string, completedChecklistIds: string[]): void {
  const current = getSavedQuoteProgress();
  if (!current || current.signature !== signature) return;
  const next: SavedQuoteProgress = {
    ...current,
    completedChecklistIds,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function getQuoteFollowUpAction(saved: SavedQuoteProgress): QuoteFollowUpAction {
  const { analysis } = saved.result;

  if (analysis.redFlags.length > 0) {
    return {
      tone: "urgent",
      title: "Review red flags before signing",
      detail: `${analysis.redFlags.length} red flag${analysis.redFlags.length === 1 ? "" : "s"} still need attention.`,
    };
  }

  if (analysis.missingScope.length > 0) {
    return {
      tone: "review",
      title: "Ask about missing scope",
      detail: `${analysis.missingScope.length} missing item${analysis.missingScope.length === 1 ? "" : "s"} should be clarified with the contractor.`,
    };
  }

  if (analysis.needsClarification.length > 0) {
    return {
      tone: "review",
      title: "Follow up on unclear items",
      detail: `${analysis.needsClarification.length} item${analysis.needsClarification.length === 1 ? "" : "s"} need more detail from the contractor.`,
    };
  }

  return {
    tone: "good",
    title: "Your quote looks ready for the next step",
    detail: "Resume your checklist to compare bids, confirm permits, and document the project.",
  };
}
