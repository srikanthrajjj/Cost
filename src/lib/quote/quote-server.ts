import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { analyzeQuoteFull, type QuoteAnalysisResult } from "./index";

export const serverAnalyzeQuoteFull = createServerFn({ method: "POST" })
  .validator(
    z.object({
      rawText: z.string().min(1),
    }),
  )
  .handler(async ({ data }): Promise<QuoteAnalysisResult> => {
    const apiKey = process.env.VITE_SK_API_KEY;
    if (!apiKey) throw new Error("API key not configured.");
    return analyzeQuoteFull(data.rawText, apiKey);
  });
