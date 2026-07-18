# Knowledge Provider: Service Layer Documentation

## Overview

`KnowledgeProvider` is the single source of truth for all CostReno project data. It's used by multiple consumers (chatbot, quote analyzer, cost calculator, material comparison, insurance checker) with **zero UI coupling**.

## Architecture

```
KnowledgeProvider (Service Layer)
    ├─ Load roofing data
    ├─ Load kitchen data
    ├─ Load bathroom data
    └─ Merge into structured ProjectKnowledge

Consumers (No UI coupling):
    ├─ Chatbot
    ├─ Quote Analyzer
    ├─ Cost Calculator
    ├─ Material Comparison
    └─ Insurance Checker

Future: Supabase Adapter
    └─ Only requires implementing KnowledgeAdapter interface
```

## Usage

### Basic: Get Complete Knowledge

```typescript
import { knowledgeProvider } from "@/lib/knowledge-provider";

const roofKnowledge = knowledgeProvider.getKnowledge("roof");
console.log(roofKnowledge);
// {
//   projectType: "roof",
//   materials: [...],
//   scope: [...],
//   pricing: {...},
//   redFlags: [...],
//   questions: [...],
//   insurance: [...],
//   buildingCodes: [...],
//   synonyms: [...]
// }
```

### Get Specific Sections

```typescript
// Materials only
const materials = knowledgeProvider.getMaterials("kitchen");
materials.forEach((m) => console.log(`${m.name}: ${m.cost}`));

// Pricing only
const pricing = knowledgeProvider.getPricing("bathroom");
console.log(`Average: $${pricing.avgCost.toLocaleString()}`);

// Red flags only
const flags = knowledgeProvider.getRedFlags("roof");
flags.forEach((f) => console.log(`${f.flag} (${f.severity}): ${f.explanation}`));

// Contractor questions
const questions = knowledgeProvider.getContractorQuestions("kitchen");

// Building codes
const codes = knowledgeProvider.getBuildingCodes("bathroom");

// Insurance rules
const insurance = knowledgeProvider.getInsuranceRules("roof");

// Synonyms (for search/matching)
const synonyms = knowledgeProvider.getSynonyms("kitchen");
```

## Project Type Detection

Project detection is handled by KnowledgeProvider using registered synonyms:

```typescript
const projectType = knowledgeProvider.detectProjectType("How much does a roof replacement cost?");
// Returns: "roof"

// Also works with synonyms
knowledgeProvider.detectProjectType("bath renovation"); // Returns: "bathroom"
knowledgeProvider.detectProjectType("HVAC installation"); // Returns: "hvac"
```

## Consumer Examples

### Chatbot

```typescript
import { chatWithKnowledge, extractProjectTypeFromChat } from "@/lib/chat-with-knowledge";

// Replace direct OpenRouter calls with:
const projectType = extractProjectTypeFromChat(messages);
const response = await chatWithKnowledge(messages, SK_API_KEY, projectType);
```

### Quote Analyzer

```typescript
import { knowledgeProvider } from "@/lib/knowledge-provider";

function analyzeQuote(projectType, quote) {
  const knowledge = knowledgeProvider.getKnowledge(projectType);
  const pricing = knowledge.pricing;
  const redFlags = knowledge.redFlags;

  const analysis = {
    totalQuoted: quote.total,
    expectedRange: `$${pricing.lowEnd} - $${pricing.highEnd}`,
    isWithinRange: quote.total >= pricing.lowEnd && quote.total <= pricing.highEnd,
    flagsFound: [],
  };

  redFlags.forEach((flag) => {
    if (quote.description.toLowerCase().includes(flag.flag.toLowerCase())) {
      analysis.flagsFound.push(flag);
    }
  });

  return analysis;
}
```

### Cost Calculator

```typescript
import { knowledgeProvider } from "@/lib/knowledge-provider";

function calculateEstimate(projectType) {
  const pricing = knowledgeProvider.getPricing(projectType);

  return {
    average: pricing.avgCost,
    lowEnd: pricing.lowEnd,
    highEnd: pricing.highEnd,
    breakdown: pricing.breakdown,
    costDrivers: pricing.costDrivers,
  };
}
```

### Material Comparison

```typescript
import { knowledgeProvider } from "@/lib/knowledge-provider";

function compareMaterials(projectType) {
  const materials = knowledgeProvider.getMaterials(projectType);

  return materials.map((m) => ({
    name: m.name,
    cost: m.cost,
    durability: m.durability,
    maintenance: m.maintenance,
    roi: m.roi,
    pros: m.pros,
    cons: m.cons,
  }));
}
```

### Insurance Checker

```typescript
import { knowledgeProvider } from "@/lib/knowledge-provider";

function checkInsuranceCoverage(projectType) {
  const rules = knowledgeProvider.getInsuranceRules(projectType);

  return {
    covered: rules.filter((r) => r.coverage),
    notCovered: rules.filter((r) => !r.coverage),
  };
}
```

## API Reference

### Main Methods

```typescript
// Get complete knowledge object
getKnowledge(projectType: ProjectType): ProjectKnowledge | null

// Get specific sections
getMaterials(projectType): Material[] | null
getScope(projectType): ScopeItem[] | null
getPricing(projectType): PricingInfo | null
getRedFlags(projectType): RedFlag[] | null
getContractorQuestions(projectType): ContractorQuestion[] | null
getInsuranceRules(projectType): InsuranceRule[] | null
getBuildingCodes(projectType): BuildingCode[] | null
getSynonyms(projectType): string[] | null

// Project type detection (single source of truth)
detectProjectType(query: string): ProjectType | null

// Utilities
search(keyword: string): ProjectKnowledge[]
getAvailableProjects(): ProjectType[]
clearCache(): void

// Supabase migration
setAdapter(adapter: KnowledgeAdapter): void
```

## Data Structure

### ProjectKnowledge

```typescript
{
  projectType: ProjectType;
  materials: Material[];           // 3+ material options with comparison data
  scope: ScopeItem[];              // Tasks, timeframes, included/optional
  pricing: PricingInfo;            // Average, range, breakdown, cost drivers
  redFlags: RedFlag[];             // Contractor scams and quality issues
  questions: ContractorQuestion[]; // Vetted questions for homeowners
  insurance: InsuranceRule[];      // Coverage and claim information
  buildingCodes: BuildingCode[];   // Local compliance requirements
  synonyms: string[];              // Alternative keywords for detection
}
```

### Material

```typescript
{
  name: string;       // "Asphalt Shingles"
  pros: string[];     // ["Most affordable", "Easy to repair"]
  cons: string[];     // ["Shortest lifespan"]
  cost: string;       // "$8,000 – $18,000"
  durability: string; // "15–20 years"
  maintenance: string;// "Annual inspections, debris removal"
  roi: string;        // "68%"
}
```

### RedFlag

```typescript
{
  flag: string; // "Roofer quotes price per-layer removal"
  severity: "high" | "medium" | "low";
  explanation: string; // Why this matters
  howToSpot: string; // What to look for
}
```

## Features

✅ **Singleton Pattern** — One instance, shared across app
✅ **Caching** — Load once, use many times
✅ **Type Safety** — Full TypeScript types
✅ **No UI Coupling** — Pure data service
✅ **Modular Loaders** — Easy to add new projects via `register()`
✅ **Search Capability** — Find data by keyword
✅ **Available Projects** — Discover what's loaded
✅ **Supabase Ready** — Implement `KnowledgeAdapter` to migrate

## Adding New Projects

To add a new project (e.g., Windows):

1. Create loader function:

```typescript
function loadWindowsKnowledge(): ProjectKnowledge {
  return {
    projectType: "windows",
    materials: [...],
    scope: [...],
    pricing: {...},
    redFlags: [...],
    questions: [...],
    insurance: [...],
    buildingCodes: [...],
    synonyms: [...],
  };
}
```

2. Register it:

```typescript
knowledgeProvider.register("windows", loadWindowsKnowledge);
```

That's it! Immediately available to all consumers. Auto-extracts synonyms for project detection.

## Caching

Knowledge is cached after first load:

```typescript
const first = knowledgeProvider.getKnowledge("roof"); // Loads from loader
const second = knowledgeProvider.getKnowledge("roof"); // Returns from cache

// Clear if needed
knowledgeProvider.clearCache();
```

## Migrating to Supabase

When ready to move from JSON loaders to Supabase:

```typescript
import { knowledgeProvider } from "@/lib/knowledge-provider";
import type { KnowledgeAdapter } from "@/lib/knowledge-provider";

const supabaseAdapter: KnowledgeAdapter = {
  async fetch(projectType) {
    // Query Supabase
    const { data } = await supabase
      .from("project_knowledge")
      .select("*")
      .eq("project_type", projectType)
      .single();
    return data;
  },

  async search(keyword) {
    // Search across projects
    const { data } = await supabase.from("project_knowledge").textSearch("content", keyword);
    return data;
  },
};

// Switch at startup — only this line changes, no consumer code changes
knowledgeProvider.setAdapter(supabaseAdapter);
```

## Benefits

✅ **Reusability** — Used by chatbot, calculator, analyzer, etc.
✅ **Maintainability** — Single source of truth for all data
✅ **Testability** — Pure data service, no dependencies
✅ **Scalability** — Easy to add new projects
✅ **Performance** — Cached after first load
✅ **Type Safety** — Full TypeScript coverage
✅ **Migration Ready** — Switch to Supabase with one line

## Current Coverage

- ✅ Roofing (complete)
- ✅ Kitchen (complete)
- ✅ Bathroom (complete)
- ⏳ 8 more projects (ready to add via `register()`)

## Next Steps

1. Import in consumers (chatbot, calculator, etc.)
2. Add more projects using `knowledgeProvider.register()`
3. Connect to knowledge search/discovery
4. Build knowledge management UI
5. Migrate to Supabase when ready

---

All data is centralized, type-safe, and ready for use across your application!
