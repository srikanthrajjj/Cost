# Knowledge Provider: Integration Guide

## Overview

The Knowledge Provider is the single source of truth for all CostReno project data. It supplies verified renovation data to the chatbot and any other consumer (quote analyzer, cost calculator, etc.).

**Architecture:**

```
Consumer (chat, calculator, analyzer)
    ↓
KnowledgeProvider (cache, loaders, detection)
    ↓
OpenRouter API (with enriched knowledge context)
```

## Current Integration

The chatbot uses `chatWithKnowledge()` which automatically:

1. Detects project type from the user's message
2. Loads knowledge via KnowledgeProvider
3. Formats knowledge into the system prompt
4. Calls OpenRouter with enriched context

## Using KnowledgeProvider Directly

```typescript
import { knowledgeProvider } from "@/lib/knowledge-provider";

// Get full knowledge for a project
const knowledge = knowledgeProvider.getKnowledge("roof");

// Get specific sections
const pricing = knowledgeProvider.getPricing("kitchen");
const redFlags = knowledgeProvider.getRedFlags("bathroom");
const materials = knowledgeProvider.getMaterials("roof");

// Detect project type from a query
const projectType = knowledgeProvider.detectProjectType("How much does a roof cost?");
// Returns: "roof"

// Search across projects
const results = knowledgeProvider.search("waterproofing");

// Get available projects
const projects = knowledgeProvider.getAvailableProjects();
// Returns: ["roof", "kitchen", "bathroom", ...]
```

## Adding New Project Knowledge

To add a new project (e.g., Windows):

```typescript
import { knowledgeProvider } from "@/lib/knowledge-provider";

function loadWindowsKnowledge() {
  return {
    projectType: "windows",
    materials: [
      {
        name: "Double-Pane Low-E",
        pros: ["Energy efficient", "Reduces heating/cooling costs"],
        cons: ["Higher upfront cost"],
        cost: "$300 – $600 per window",
        durability: "20–30 years",
        maintenance: "Standard cleaning",
        roi: "72%",
      },
    ],
    scope: [
      {
        name: "Old window removal",
        description: "Careful extraction",
        timeframe: "0.5 hours per window",
        included: true,
        optional: false,
      },
      {
        name: "New window installation",
        description: "Proper sealing and flashing",
        timeframe: "1 hour per window",
        included: true,
        optional: false,
      },
    ],
    pricing: {
      avgCost: 12500,
      lowEnd: 6000,
      highEnd: 21000,
      breakdown: [
        { category: "Windows", percent: 60, amount: 7500 },
        { category: "Labor", percent: 25, amount: 3125 },
        { category: "Permits", percent: 15, amount: 1875 },
      ],
      costDrivers: ["Number of windows", "Window type/quality", "Frame condition"],
    },
    redFlags: [
      {
        flag: "Skip sealing old frame before new installation",
        severity: "high",
        explanation: "Leads to water infiltration and mold",
        howToSpot: "Contractor doesn't mention frame inspection",
      },
    ],
    questions: [
      { question: "What NFRC rating are you recommending?", category: "scope" },
      { question: "How do you handle old frame issues?", category: "process" },
    ],
    insurance: [
      { rule: "Usually not covered (upgrades)", coverage: false, note: "Unless storm damage" },
      { rule: "Covered if storm damage", coverage: true, note: "Document with photos" },
    ],
    buildingCodes: [
      {
        code: "Egress",
        requirement: "Bedroom windows must meet egress size requirements",
        inspection: true,
      },
    ],
    synonyms: ["window", "windows", "window replacement", "new windows"],
  };
}

// Register it — auto-extracts synonyms for project detection
knowledgeProvider.register("windows", loadWindowsKnowledge);
```

That's it. The project is immediately available to all consumers.

## Migrating to Supabase

When ready to move from JSON loaders to Supabase:

```typescript
import { knowledgeProvider } from "@/lib/knowledge-provider";
import type { KnowledgeAdapter } from "@/lib/knowledge-provider";

const supabaseAdapter: KnowledgeAdapter = {
  async fetch(projectType) {
    const { data } = await supabase
      .from("project_knowledge")
      .select("*")
      .eq("project_type", projectType)
      .single();
    return data;
  },

  async search(keyword) {
    const { data } = await supabase
      .from("project_knowledge")
      .select("*")
      .textSearch("content", keyword);
    return data;
  },
};

// Switch at startup — only this line changes
knowledgeProvider.setAdapter(supabaseAdapter);
```

No consumer code changes needed. The adapter interface is the only thing that changes.

## Files

- `src/lib/knowledge-provider.ts` — Single source of truth (data + service + adapter interface)
- `src/lib/chat-with-knowledge.ts` — Chat integration layer (uses KnowledgeProvider only)
- `src/lib/estimator-engine.ts` — ProjectType definition (shared)

## Next Steps

1. ✅ Knowledge Provider established as single source of truth
2. ✅ Duplicate project detection removed (now in KnowledgeProvider only)
3. ✅ KnowledgeContext removed (using ProjectKnowledge everywhere)
4. ✅ Unused files deleted (knowledge-engine.ts, knowledge-templates.ts)
5. ⏳ Add remaining projects using `knowledgeProvider.register()`
6. ⏳ Migrate to Supabase when ready (just implement KnowledgeAdapter)
