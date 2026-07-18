import type { QuoteAnalysis } from "./types";

export async function generateReport(analysis: QuoteAnalysis, apiKey: string): Promise<string> {
  const systemPrompt = `You are a renovation analysis report generator. Convert the structured analysis into a homeowner-friendly report.

DO NOT invent new findings. Use ONLY the provided analysis data.

Structure the report:
1. Executive Summary
2. Quote Completeness Assessment
3. Missing Items
4. Potential Red Flags
5. Questions to Ask Your Contractor
6. Recommended Actions

Use clear headings, bullet points, and a professional tone.`;

  const userPrompt = `Analysis Data:
${JSON.stringify(analysis, null, 2)}

Generate a homeowner-friendly report.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://costreno.com",
      "X-Title": "CostReno AI",
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Report API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  if (!data.choices || data.choices.length === 0) {
    throw new Error("No response from AI - empty choices");
  }
  return data.choices?.[0]?.message?.content || "Unable to generate report.";
}
