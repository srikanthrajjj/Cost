import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  analyzeQuoteFull,
  extractQuote,
  type QuoteAnalysisResult,
} from "./index";
import type { QuoteExtraction } from "./types";
import { saveQuoteUpload } from "@/lib/db/store";
import { assertServerAdvancedReportAllowed } from "@/lib/quote/advanced-rate-limit";

export type QuoteAnalysisWithUpload = QuoteAnalysisResult & {
  uploadId?: string;
};

export type QuoteDetailsResult = {
  extraction: QuoteExtraction;
};

/** Fast path: extract line items only (one AI call). Advanced scoring happens later. */
export const serverExtractQuoteDetails = createServerFn({ method: "POST" })
  .validator(
    z.object({
      rawText: z.string().min(1),
      fileName: z.string().max(260).optional(),
      fileType: z.string().max(120).optional(),
      fileSize: z.number().int().nonnegative().optional(),
      source: z.string().max(80).optional(),
      sessionId: z.string().max(80).optional(),
    }),
  )
  .handler(async ({ data }): Promise<QuoteDetailsResult> => {
    const apiKey = import.meta.env.VITE_SK_API_KEY || process.env.VITE_SK_API_KEY;
    if (!apiKey) throw new Error("API key not configured.");

    if (data.source === "quote-analyzer-advanced") {
      assertServerAdvancedReportAllowed(data.sessionId);
    }

    const extraction = await extractQuote(data.rawText, apiKey, { mode: "fast" });
    return { extraction };
  });

export const serverAnalyzeQuoteFull = createServerFn({ method: "POST" })
  .validator(
    z.object({
      rawText: z.string().min(1),
      fileName: z.string().max(260).optional(),
      fileType: z.string().max(120).optional(),
      fileSize: z.number().int().nonnegative().optional(),
      source: z.string().max(80).optional(),
      /** When true, runs the slow AI narrative report step. Default false for faster scorecard. */
      includeReport: z.boolean().optional(),
    }),
  )
  .handler(async ({ data }): Promise<QuoteAnalysisWithUpload> => {
    const apiKey = import.meta.env.VITE_SK_API_KEY || process.env.VITE_SK_API_KEY;
    if (!apiKey) throw new Error("API key not configured.");

    const result = await analyzeQuoteFull(data.rawText, apiKey, {
      includeReport: data.includeReport === true,
    });

    let uploadId: string | undefined;
    try {
      const lineItemCount =
        (result.extraction.materials?.length ?? 0) + (result.extraction.scopeItems?.length ?? 0);

      const saved = await saveQuoteUpload({
        fileName: data.fileName,
        fileType: data.fileType,
        fileSize: data.fileSize,
        rawText: data.rawText,
        projectType: result.extraction.projectType,
        contractor: result.extraction.contractor,
        totalPrice: result.extraction.totalPrice,
        completenessScore: result.analysis.summary.completenessScore,
        lineItemCount,
        missingCount: result.analysis.missingScope.length,
        clarificationCount: result.analysis.needsClarification.length,
        redFlagCount: result.analysis.redFlags.length,
        analysisSummary: {
          completenessScore: result.analysis.summary.completenessScore,
          matchedItems: result.analysis.summary.matchedItems,
          unmatchedItems: result.analysis.summary.unmatchedItems,
          totalItems: result.analysis.summary.totalItems,
          recommendations: result.analysis.recommendations.slice(0, 10),
          missingTitles: result.analysis.missingScope.slice(0, 20).map((m) => m.title),
          redFlagTitles: result.analysis.redFlags.slice(0, 20).map((f) => f.title),
        },
        source: data.source ?? "quote-analyzer",
      });
      uploadId = saved.id;
      console.info("[quote-upload] saved", { id: saved.id, storage: saved.storage });
    } catch (error) {
      // Analysis should still succeed even if persistence fails
      console.error("[quote-upload] failed to persist:", error);
    }

    return { ...result, uploadId };
  });
