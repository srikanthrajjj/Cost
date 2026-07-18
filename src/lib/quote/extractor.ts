import type { QuoteExtraction } from "./types";

export async function extractQuote(text: string, apiKey: string): Promise<QuoteExtraction> {
  const systemPrompt = `You are a construction quote extraction specialist. Extract structured data from the provided quote text and return ONLY valid JSON matching the exact schema.

Extract:
- Contractor name
- Project type (roofing, kitchen, bathroom, etc.)
- Materials with quantities, units, prices
- Scope items with descriptions
- Permits mentioned
- Warranties mentioned
- Exclusions noted
- Total price
- Confidence score (0-1)

Return JSON only, no explanations.`;

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
          content: text,
        },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Extraction API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";

  try {
    return JSON.parse(content) as QuoteExtraction;
  } catch {
    throw new Error(`Invalid JSON response from extraction API: ${content.substring(0, 200)}`);
  }
}
