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
  const materials = result.extraction?.materials ?? [];
  const scopeItems = result.extraction?.scopeItems ?? [];
  const itemCount = materials.length + scopeItems.length;
  return [
    result.extraction?.projectType || "unknown-project",
    result.extraction?.contractor || "unknown-contractor",
    result.extraction?.totalPrice || 0,
    result.analysis?.summary?.completenessScore ?? 0,
    itemCount,
  ].join("|");
}

function slimResultForStorage(result: QuoteAnalysisResult): QuoteAnalysisResult {
  // Keep enough to reopen the report, drop the long AI narrative to stay under localStorage limits.
  return {
    ...result,
    report: "",
  };
}

export function getSavedQuoteProgress(): SavedQuoteProgress | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedQuoteProgress;
    if (!parsed?.result?.analysis || !parsed?.result?.extraction || !parsed.signature) {
      return null;
    }
    return {
      ...parsed,
      completedChecklistIds: Array.isArray(parsed.completedChecklistIds)
        ? parsed.completedChecklistIds
        : [],
    };
  } catch {
    return null;
  }
}

export function saveQuoteProgress(result: QuoteAnalysisResult): SavedQuoteProgress {
  const previous = getSavedQuoteProgress();
  const signature = getQuoteProgressSignature(result);
  const entry: SavedQuoteProgress = {
    signature,
    savedAt: new Date().toISOString(),
    result: slimResultForStorage(result),
    completedChecklistIds:
      previous?.signature === signature ? previous.completedChecklistIds : [],
  };

  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    }
  } catch (error) {
    console.warn("[quote-progress] failed to persist analysis locally", error);
  }

  return entry;
}

export function clearSavedQuoteProgress(): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function updateSavedQuoteChecklist(signature: string, completedChecklistIds: string[]): void {
  const current = getSavedQuoteProgress();
  if (!current || current.signature !== signature) return;
  const next: SavedQuoteProgress = {
    ...current,
    completedChecklistIds,
  };
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  } catch (error) {
    console.warn("[quote-progress] failed to persist checklist", error);
  }
}

export function getQuoteFollowUpAction(saved: SavedQuoteProgress): QuoteFollowUpAction {
  const analysis = saved.result.analysis;
  const redFlags = analysis.redFlags ?? [];
  const missingScope = analysis.missingScope ?? [];
  const needsClarification = analysis.needsClarification ?? [];

  if (redFlags.length > 0) {
    return {
      tone: "urgent",
      title: "Review red flags before signing",
      detail: `${redFlags.length} red flag${redFlags.length === 1 ? "" : "s"} still need attention.`,
    };
  }

  if (missingScope.length > 0) {
    return {
      tone: "review",
      title: "Ask about missing scope",
      detail: `${missingScope.length} missing item${missingScope.length === 1 ? "" : "s"} should be clarified with the contractor.`,
    };
  }

  if (needsClarification.length > 0) {
    return {
      tone: "review",
      title: "Follow up on unclear items",
      detail: `${needsClarification.length} item${needsClarification.length === 1 ? "" : "s"} need more detail from the contractor.`,
    };
  }

  return {
    tone: "good",
    title: "Your quote looks ready for the next step",
    detail: "Resume your checklist to compare bids, confirm permits, and document the project.",
  };
}
