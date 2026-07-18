import type { QuoteExtraction, MatchedMaterial, MatchedScopeItem, QuoteAnalysis } from "./types";
import { extractQuote } from "./extractor";
import { matchQuote } from "./matcher";
import { analyzeQuote } from "./analyzer";
import { generateReport } from "./report";

export * from "./types";
export { extractQuote, matchQuote, analyzeQuote, generateReport };

export interface QuoteAnalysisResult {
  extraction: QuoteExtraction;
  matchedMaterials: MatchedMaterial[];
  matchedScopeItems: MatchedScopeItem[];
  analysis: QuoteAnalysis;
  report: string;
}

export async function analyzeQuoteFull(
  rawText: string,
  apiKey: string,
): Promise<QuoteAnalysisResult> {
  const extraction = await extractQuote(rawText, apiKey);
  const { matchedMaterials, matchedScopeItems, unmatchedMaterials, unmatchedScopeItems } =
    await matchQuote(extraction);
  const analysis = await analyzeQuote(
    extraction,
    matchedMaterials,
    matchedScopeItems,
    unmatchedMaterials,
    unmatchedScopeItems,
  );
  const report = await generateReport(analysis, apiKey);

  return {
    extraction,
    matchedMaterials,
    matchedScopeItems,
    analysis,
    report,
  };
}
