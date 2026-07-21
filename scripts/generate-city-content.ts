/**
 * City Content Generator
 *
 * One-time offline script that:
 * 1. Loops through every city in the data file
 * 2. Calls an LLM API once per city-category pair
 * 3. Writes generated intro paragraphs back into the data file
 *
 * Usage: npx tsx scripts/generate-city-content.ts
 * Run once during data preparation, NOT on every build or live request.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types matching src/data/cities.json
interface City {
  city: string;
  state: string;
  stateAbbr: string;
  slug: string;
  stateSlug: string;
  zipPrefix: string;
  laborCostMultiplier: number;
  typicalHomeAge: string;
  climateNotes: string;
  regionalNotes: string;
  nearestPermitOffice: string;
  population: number;
  medianHomeValue: number;
  introParagraphs: Record<string, string>;
}

interface Category {
  id: string;
  name: string;
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const CITIES_PATH = path.resolve(__dirname, "../src/data/cities.json");
const CATEGORIES_PATH = path.resolve(__dirname, "../src/data/categories.json");

const LLM_API_URL = process.env.LLM_API_URL || "https://api.openai.com/v1/chat/completions";
const LLM_API_KEY = process.env.LLM_API_KEY || "";
const LLM_MODEL = process.env.LLM_MODEL || "gpt-4o-mini";

// If you'd rather generate placeholder text without an API call (for testing),
// set this to true:
const USE_PLACEHOLDER = process.env.USE_PLACEHOLDER === "true";

// ---------------------------------------------------------------------------
// Prompt template for LLM
// ---------------------------------------------------------------------------

function buildPrompt(city: City, category: Category): string {
  return `You are a content writer for CostReno, a home renovation cost-estimation website.

Write a single, flowing introductory paragraph (2-3 sentences, roughly 100-150 words) for the "${category.name}" city landing page for ${city.city}, ${city.state}. The paragraph should:

- Open naturally for someone researching "${category.name.toLowerCase()}" costs.
- Reference specific local climate or housing-stock realities from the city data below.
- Mention how local conditions affect pricing or material choices for this project type.
- End with a natural transition into using CostReno's estimator tool.
- Sound helpful, factual, and professional — not like marketing copy.
- Be unique to this city — no generic statements that could apply anywhere.

City data:
- City: ${city.city}, ${city.state} (${city.stateAbbr})
- Population: ${city.population.toLocaleString()}
- Median home value: $${city.medianHomeValue.toLocaleString()}
- Labor cost multiplier relative to national average: ${city.laborCostMultiplier}x
- Typical housing stock: ${city.typicalHomeAge}
- Climate: ${city.climateNotes}
- Regional notes: ${city.regionalNotes}
- Nearest permit office: ${city.nearestPermitOffice}

Write only the paragraph text — no title, no introduction, no markdown.`;
}

// ---------------------------------------------------------------------------
// LLM caller
// ---------------------------------------------------------------------------

async function callLLM(prompt: string): Promise<string> {
  if (USE_PLACEHOLDER) {
    return `Planning a ${prompt.split('"')[1]?.toLowerCase() || "project"} in this area? Local climate and housing stock factors play a significant role in overall costs. Use CostReno to get a personalized estimate based on real regional data.`;
  }

  const response = await fetch(LLM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM API error (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message?.content?.trim() || "";
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== City Content Generator ===");
  console.log(`Cities file: ${CITIES_PATH}`);
  console.log(`Categories file: ${CATEGORIES_PATH}`);
  console.log(`API: ${LLM_API_URL} | Model: ${LLM_MODEL}`);
  console.log(`Placeholder mode: ${USE_PLACEHOLDER}`);
  console.log("");

  // Read data files
  const cities: City[] = JSON.parse(fs.readFileSync(CITIES_PATH, "utf-8"));
  const categories: Category[] = JSON.parse(fs.readFileSync(CATEGORIES_PATH, "utf-8")).map(
    (c: { id: string; name: string }) => ({ id: c.id, name: c.name }),
  );

  console.log(`Loaded ${cities.length} cities and ${categories.length} categories.`);
  console.log("");

  let totalGenerated = 0;
  let totalSkipped = 0;

  for (const city of cities) {
    if (!city.introParagraphs) {
      city.introParagraphs = {};
    }

    for (const category of categories) {
      const key = category.id;

      // Skip if content already exists
      if (city.introParagraphs[key]) {
        console.log(`  [SKIP] ${city.city}, ${city.state} → ${category.name} (already exists)`);
        totalSkipped++;
        continue;
      }

      console.log(`  [GEN]  ${city.city}, ${city.state} → ${category.name}...`);

      try {
        const prompt = buildPrompt(city, category);
        const paragraph = await callLLM(prompt);
        city.introParagraphs[key] = paragraph;
        totalGenerated++;

        // Brief delay to stay within rate limits
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`  [ERR]  ${city.city}, ${city.state} → ${category.name}:`, error);
      }
    }
  }

  // Write updated data back
  fs.writeFileSync(CITIES_PATH, JSON.stringify(cities, null, 2) + "\n", "utf-8");

  console.log("");
  console.log("=== Complete ===");
  console.log(`Generated: ${totalGenerated} paragraphs`);
  console.log(`Skipped:   ${totalSkipped} paragraphs`);
  console.log(`Updated file: ${CITIES_PATH}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
