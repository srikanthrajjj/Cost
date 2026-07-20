// ─── AI Kitchen Analysis Server Function ─────────────────────────────────────
// TanStack Start server function that proxies the AI vision API call to
// OpenRouter. Protects the API key on the server side and returns structured
// AIDetectionResult to the client.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AIDetectionResult } from "./types";
import { parseAIResponse } from "./ai-response-parser";

// ─── Input Validation ────────────────────────────────────────────────────────

const analyzeKitchenInputSchema = z.object({
  photos: z
    .array(z.string().min(1))
    .min(1, "At least one photo is required")
    .max(6, "Maximum of 6 photos allowed"),
});

// ─── AI Prompt Template ──────────────────────────────────────────────────────

const AI_PROMPT = `Analyze the following kitchen photos and provide a structured assessment. You MUST respond with ONLY valid JSON (no markdown, no code blocks, no explanation text).

Required JSON format:
{
  "cabinetType": { "value": "<stock|semicustom|custom|reface>", "confidence": <0-100> },
  "countertopMaterial": { "value": "<laminate|quartz|granite|marble|butcherblock>", "confidence": <0-100> },
  "flooringMaterial": { "value": "<tile|hardwood|vinyl|laminate|concrete>", "confidence": <0-100> },
  "estimatedSize": { "value": "<small|medium|large>", "confidence": <0-100> },
  "overallCondition": { "value": "<excellent|good|fair|poor>", "confidence": <0-100> },
  "observations": ["observation 1", "observation 2", ...]
}

Size guide:
- small: under 100 sq ft (galley or apartment kitchen)
- medium: 100-200 sq ft (average home kitchen)
- large: over 200 sq ft (open concept or luxury kitchen)

Provide 3-6 observations about the kitchen's current state, noting any visible wear, upgrades, or features that would affect renovation cost.

Respond with ONLY the JSON object, nothing else.`;

// ─── Constants ───────────────────────────────────────────────────────────────

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const VISION_MODEL = "google/gemini-2.0-flash-001";
const TIMEOUT_MS = 30000;

// ─── Result Type ─────────────────────────────────────────────────────────────

export type AnalyzeKitchenResult =
  | { success: true; data: AIDetectionResult }
  | { success: false; error: string; code: "timeout" | "api_error" | "parse_error" | "auth_error" };

// ─── Server Function ─────────────────────────────────────────────────────────

export const analyzeKitchen = createServerFn({ method: "POST" })
  .validator(analyzeKitchenInputSchema)
  .handler(async ({ data }): Promise<AnalyzeKitchenResult> => {
    const apiKey = import.meta.env.VITE_SK_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: "AI analysis is temporarily unavailable. Use the manual estimate for now.",
        code: "auth_error",
      };
    }

    // Build the message content with text prompt and images
    const content: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } }
    > = [
      { type: "text", text: AI_PROMPT },
      ...data.photos.map((photo) => ({
        type: "image_url" as const,
        image_url: {
          url: photo.startsWith("data:") ? photo : `data:image/jpeg;base64,${photo}`,
        },
      })),
    ];

    // Set up timeout via AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://costreno.com",
          "X-Title": "CostReno AI Kitchen Analyzer",
        },
        body: JSON.stringify({
          model: VISION_MODEL,
          messages: [
            {
              role: "user",
              content,
            },
          ],
          temperature: 0.2,
          max_tokens: 1500,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");

        if (response.status === 401) {
          return {
            success: false,
            error: "AI analysis is temporarily unavailable. Use the manual estimate for now.",
            code: "auth_error",
          };
        }

        return {
          success: false,
          error: "We couldn't analyze your photos. You can try again or switch to the manual estimate.",
          code: "api_error",
        };
      }

      const responseData = await response.json().catch(() => null);

      if (
        !responseData ||
        !responseData.choices ||
        responseData.choices.length === 0
      ) {
        return {
          success: false,
          error: "Something went wrong with the analysis. Please try again.",
          code: "parse_error",
        };
      }

      const messageContent = responseData.choices[0]?.message?.content;

      if (typeof messageContent !== "string" || messageContent.trim().length === 0) {
        return {
          success: false,
          error: "Something went wrong with the analysis. Please try again.",
          code: "parse_error",
        };
      }

      // Strip markdown code fences if present (AI sometimes wraps JSON in ```json ... ```)
      const cleanedContent = messageContent
        .replace(/^```(?:json)?\s*\n?/i, "")
        .replace(/\n?```\s*$/i, "")
        .trim();

      const detectionResult = parseAIResponse(cleanedContent);

      // Verify we got a valid parse (not all "unknown" fallbacks)
      const hasValidDetections =
        detectionResult.cabinetType.value !== "unknown" ||
        detectionResult.countertopMaterial.value !== "unknown" ||
        detectionResult.flooringMaterial.value !== "unknown";

      if (!hasValidDetections) {
        return {
          success: false,
          error: "Something went wrong with the analysis. Please try again.",
          code: "parse_error",
        };
      }

      return { success: true, data: detectionResult };
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      // Check for abort (timeout)
      if (error instanceof Error && error.name === "AbortError") {
        return {
          success: false,
          error: "The analysis is taking longer than expected. Try again or continue with the manual estimate.",
          code: "timeout",
        };
      }

      return {
        success: false,
        error: "We couldn't analyze your photos. You can try again or switch to the manual estimate.",
        code: "api_error",
      };
    }
  });
