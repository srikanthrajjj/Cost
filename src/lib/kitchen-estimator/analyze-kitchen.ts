// ─── AI Kitchen Analysis (client-side) ───────────────────────────────────────
import type { AIDetectionResult } from "./types";
import { parseAIResponse } from "./ai-response-parser";

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

Respond with ONLY the JSON object, nothing else.`;

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const VISION_MODEL = "openai/gpt-4o-mini";
const TIMEOUT_MS = 30000;

export type AnalyzeKitchenResult =
  | { success: true; data: AIDetectionResult }
  | { success: false; error: string; code: "timeout" | "api_error" | "parse_error" | "auth_error" };

export async function analyzeKitchen(photos: string[]): Promise<AnalyzeKitchenResult> {
  const apiKey = import.meta.env.VITE_SK_API_KEY;
  if (!apiKey) {
    return { success: false, error: "API key not configured.", code: "auth_error" };
  }

  const content = [
    { type: "text" as const, text: AI_PROMPT },
    ...photos.map((p) => ({ type: "image_url" as const, image_url: { url: p } })),
  ];

  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://costreno.com",
        "X-Title": "CostReno Kitchen Analyzer",
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        messages: [{ role: "user", content }],
        temperature: 0.2,
        max_tokens: 1500,
      }),
    });
    clearTimeout(tid);

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[analyzeKitchen] API error:", res.status, body);
      return {
        success: false,
        error: "We couldn't analyze your photos. Try again or skip.",
        code: "api_error",
      };
    }

    const data = await res.json().catch(() => null);
    const msg = data?.choices?.[0]?.message?.content;
    if (typeof msg !== "string" || !msg.trim()) {
      console.error("[analyzeKitchen] No content in response:", JSON.stringify(data).slice(0, 500));
      return { success: false, error: "Analysis failed. Please try again.", code: "parse_error" };
    }

    console.log("[analyzeKitchen] AI response:", msg.slice(0, 300));
    const cleaned = msg
      .replace(/^```(?:json)?\s*\n?/i, "")
      .replace(/\n?```\s*$/i, "")
      .trim();
    const result = parseAIResponse(cleaned);

    if (result.cabinetType.value === "unknown" && result.countertopMaterial.value === "unknown") {
      return {
        success: false,
        error: "Couldn't detect kitchen details. Try again.",
        code: "parse_error",
      };
    }

    return { success: true, data: result };
  } catch (e: any) {
    clearTimeout(tid);
    if (e?.name === "AbortError") {
      return { success: false, error: "Analysis timed out. Try again.", code: "timeout" };
    }
    return { success: false, error: "Analysis failed. Try again or skip.", code: "api_error" };
  }
}
