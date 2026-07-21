import type { QuoteExtraction, MatchedMaterial, MatchedScopeItem, QuoteAnalysis } from "./types";
import { extractQuote } from "./extractor";
import { matchQuote } from "./matcher";
import { analyzeQuote } from "./analyzer";
import { generateReport } from "./report";
import { OpenRouterError, type OpenRouterCallOptions } from "./openrouter-client";

export * from "./types";
export { extractQuote, matchQuote, analyzeQuote, generateReport };
export {
  toMoneyNumber,
  repairLinePrices,
  looksLikeMisparsedLineTotal,
} from "./extractor";
export { OpenRouterError };

export interface QuoteAnalysisResult {
  extraction: QuoteExtraction;
  matchedMaterials: MatchedMaterial[];
  matchedScopeItems: MatchedScopeItem[];
  analysis: QuoteAnalysis;
  report: string;
}

export type QuotePipelineStage = "extracting" | "matching" | "analyzing" | "reporting";

export interface AnalyzeQuoteFullOptions {
  /** Allows the caller (UI) to cancel in-flight AI calls. */
  signal?: AbortSignal;
  /** Fired when the pipeline moves to a new stage, for accurate progress UI. */
  onStageChange?: (stage: QuotePipelineStage) => void;
  /** Fired when an AI call is being retried after a transient failure. */
  onRetry?: OpenRouterCallOptions["onRetry"];
}

export async function analyzeQuoteFull(
  rawText: string,
  apiKey: string,
  options: AnalyzeQuoteFullOptions = {},
): Promise<QuoteAnalysisResult> {
  const { signal, onStageChange, onRetry } = options;

  onStageChange?.("extracting");
  const extraction = await extractQuote(rawText, apiKey, { signal, onRetry });

  onStageChange?.("matching");
  const { matchedMaterials, matchedScopeItems, unmatchedMaterials, unmatchedScopeItems } =
    await matchQuote(extraction);

  onStageChange?.("analyzing");
  const analysis = await analyzeQuote(
    extraction,
    matchedMaterials,
    matchedScopeItems,
    unmatchedMaterials,
    unmatchedScopeItems,
  );

  onStageChange?.("reporting");
  const report = await generateReport(analysis, apiKey, { signal, onRetry });

  return {
    extraction,
    matchedMaterials,
    matchedScopeItems,
    analysis,
    report,
  };
}
