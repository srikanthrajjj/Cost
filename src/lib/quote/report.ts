import type { QuoteAnalysis } from "./types";
import { callOpenRouter, type OpenRouterCallOptions } from "./openrouter-client";

export interface GenerateReportOptions {
  signal?: AbortSignal;
  onRetry?: OpenRouterCallOptions["onRetry"];
}

/**
 * Deduplicates questions that are substantially similar by comparing normalized text.
 * If two questions share 60%+ of their words, keep only the more specific one.
 */
function deduplicateQuestions(questions: string[]): string[] {
  const normalize = (q: string) =>
    q
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3);

  const result: string[] = [];
  for (const q of questions) {
    const qWords = new Set(normalize(q));
    const isDuplicate = result.some((existing) => {
      const existingWords = new Set(normalize(existing));
      const overlap = [...qWords].filter((w) => existingWords.has(w)).length;
      const smaller = Math.min(qWords.size, existingWords.size);
      return smaller > 0 && overlap / smaller >= 0.6;
    });
    if (!isDuplicate) {
      result.push(q);
    }
  }
  return result;
}

/**
 * Generates a human-readable explanation of the completeness score
 * based on what's present vs missing vs needing clarification.
 */
function explainScore(analysis: QuoteAnalysis): string {
  const score = analysis.summary.completenessScore;
  const missingNames = analysis.missingScope.map((i) => i.title.replace("Missing: ", ""));
  const clarifyNames = analysis.needsClarification.map((i) => i.name);

  let explanation = `**Completeness Score: ${score}%**\n`;

  if (score >= 85) {
    explanation += "Most primary systems are included in this quote.";
  } else if (score >= 60) {
    explanation += "The quote covers the core work but has notable gaps.";
  } else {
    explanation += "Several major systems appear to be missing from this quote.";
  }

  const gaps: string[] = [];
  if (missingNames.length > 0) gaps.push(`missing ${missingNames.join(", ")}`);
  if (clarifyNames.length > 0) gaps.push(`clarification needed on ${clarifyNames.join(", ")}`);

  if (gaps.length > 0) {
    explanation += ` The remaining ${100 - score}% reflects: ${gaps.join("; ")}.`;
  }

  return explanation;
}

/**
 * Extracts notable "quote facts" — specific statements from the quote that
 * the homeowner should be aware of (not interpretations, actual quote content).
 */
function extractQuoteFacts(analysis: QuoteAnalysis): string[] {
  const facts: string[] = [];

  for (const item of analysis.needsClarification) {
    // Extract the factual part (what the quote says)
    const q = item.question.toLowerCase();
    if (q.includes('"valleys only"')) {
      facts.push(`Ice & Water Shield: Listed as "valleys only"`);
    } else if (q.includes('"reuse existing"')) {
      facts.push(`${item.name}: Listed as "reuse existing"`);
    } else if (q.includes("homeowner")) {
      facts.push(`${item.name}: Responsibility assigned to homeowner`);
    } else if (q.includes("zero quantity")) {
      facts.push(`${item.name}: Listed with zero quantity`);
    }
  }

  return facts;
}

export async function generateReport(
  analysis: QuoteAnalysis,
  apiKey: string,
  options: GenerateReportOptions = {},
): Promise<string> {
  // Pre-format data for the LLM
  const presentList =
    analysis.presentItems.length > 0
      ? analysis.presentItems.map((i) => `- ✅ ${i.name}`).join("\n")
      : "- No items matched.";

  const clarificationList =
    analysis.needsClarification.length > 0
      ? analysis.needsClarification.map((i) => `- ⚠️ ${i.name}: ${i.question}`).join("\n")
      : "";

  const missingList =
    analysis.missingScope.length > 0
      ? analysis.missingScope.map((i) => `- ❌ ${i.title.replace("Missing: ", "")}`).join("\n")
      : "- No critical items missing.";

  const redFlagList =
    analysis.redFlags.length > 0
      ? analysis.redFlags.map((f) => `- 🚩 ${f.title}: ${f.explanation}`).join("\n")
      : ""; // Empty for AI mode

  // Deduplicate questions
  const uniqueQuestions = deduplicateQuestions(analysis.questionsToAsk);

  // Score explanation
  const scoreExplanation = explainScore(analysis);

  // Quote facts vs expert advice
  const quoteFacts = extractQuoteFacts(analysis);
  const quoteFactsFormatted =
    quoteFacts.length > 0 ? quoteFacts.map((f) => `- ${f}`).join("\n") : "";

  const buildingCodesFormatted =
    analysis.buildingCodes.length > 0
      ? analysis.buildingCodes.slice(0, 4).map((c) => `- ${c.title}: ${c.explanation}`).join("\n")
      : "";

  const systemPrompt = `You are an independent renovation consultant writing a final report for a homeowner who received a contractor quote.

CRITICAL RULES:
1. Use ONLY the data provided. Do NOT invent, assume, or fabricate findings.
2. The classification is FINAL. Do not reclassify items between Present/Clarification/Missing.
3. List EVERY present item by name. Never summarize as "X items found."
4. If red flags section is empty, write "No red flags detected." Do NOT invent any.
5. Deduplicate: never repeat the same question or concern twice.
6. CLEARLY SEPARATE quote facts from expert recommendations. Example:
   - "Quote says: Flashing — Reuse existing" (FACT)
   - "Recommendation: Confirm new flashing at penetrations" (ADVICE)
7. Explain the completeness score — why that number, what's missing.
8. End with a concise Overall Assessment verdict.

REPORT STRUCTURE:

## Executive Summary
2-3 sentences. Include the completeness score with explanation.

## ✅ What's Included
List every present item. Use "✅" prefix for each.

## ⚠️ Needs Clarification
For each item, show:
- What the quote says (the fact)
- What to ask the contractor (the recommendation)

## ❌ Missing From Quote
List genuinely absent items. Brief description of why they matter.

## 🚩 Red Flags
Only if evidence exists. Otherwise state "No red flags detected in this quote."

## 📋 Quote Facts vs Expert Recommendations
Two columns of information:
**What the quote says:** (direct facts from the document)
**Expert recommendation:** (what the homeowner should do about it)

## ❓ Questions to Ask Your Contractor
Merged, deduplicated list. Max 6-8 questions. Group related questions.

## 🏁 Overall Assessment
A concise 2-3 sentence verdict. Should the homeowner sign? What must be clarified first?`;

  const userPrompt = `ANALYSIS DATA:

SCORE: ${scoreExplanation}

PRESENT ITEMS (${analysis.presentItems.length}):
${presentList}

NEEDS CLARIFICATION (${analysis.needsClarification.length}):
${clarificationList || "(none)"}

MISSING (${analysis.missingScope.length}):
${missingList}

RED FLAGS:
${redFlagList || "(none detected)"}

QUOTE FACTS (what the document explicitly states):
${quoteFactsFormatted || "(no notable statements extracted)"}

QUESTIONS (deduplicated, max 8):
${uniqueQuestions
  .slice(0, 8)
  .map((q) => `- ${q}`)
  .join("\n")}

RECOMMENDATIONS:
${analysis.recommendations.map((r) => `- ${r}`).join("\n")}

BUILDING CODES (informational context):
${analysis.buildingCodes
  .slice(0, 4)
  .map((c) => `- ${c.title}: ${c.explanation}`)
  .join("\n")}

Write the report now. List every present item by name. Separate facts from advice. End with a verdict.`;

  return callOpenRouter({
    apiKey,
    systemPrompt,
    userPrompt,
    temperature: 0.25,
    maxTokens: 3000,
    signal: options.signal,
    onRetry: options.onRetry,
  });
}
