import type { QuoteExtraction, MatchedMaterial, MatchedScopeItem, QuoteAnalysis } from "./types";

export * from "./types";
export { extractQuote } from "./extractor";
export { matchQuote } from "./matcher";
export { analyzeQuote } from "./analyzer";
export { generateReport } from "./report";

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
