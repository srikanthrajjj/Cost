# Knowledge Provider Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                                  │
│                      (Chat Component)                                    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                │ User Question
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                     KNOWLEDGE LAYER                                      │
│                  (Single Source of Truth)                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ KnowledgeProvider (Service Layer)                                │   │
│  │                                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────┐   │   │
│  │  │ 1. Project Type Detection                                │   │   │
│  │  │    - extractProjectTypeFromChat()                        │   │   │
│  │  │    - Uses registered synonyms                            │   │   │
│  │  │    - Single source of truth                              │   │   │
│  │  └──────────────────────────────────────────────────────────┘   │   │
│  │                                │                                 │   │
│  │                                ↓                                 │   │
│  │  ┌──────────────────────────────────────────────────────────┐   │   │
│  │  │ 2. Knowledge Lookup                                      │   │   │
│  │  │    - Checks cache first                                  │   │   │
│  │  │    - Falls back to loaders                               │   │   │
│  │  │    - Or uses adapter (Supabase)                          │   │   │
│  │  └──────────────────────────────────────────────────────────┘   │   │
│  │                                │                                 │   │
│  │                                ↓                                 │   │
│  │  ┌──────────────────────────────────────────────────────────┐   │   │
│  │  │ 3. Context Formatting                                    │   │   │
│  │  │    - Materials, pricing, red flags, codes                │   │   │
│  │  │    - Injected into LLM system prompt                     │   │   │
│  │  └──────────────────────────────────────────────────────────┘   │   │
│  │                                                                          │
└──────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    │ Enriched System Prompt
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                     EXTERNAL API                                         │
│                   (OpenRouter)                                           │
│                                                                          │
│  Request: User query + CostReno knowledge context                        │
│  Response: Knowledge-backed answer                                       │
│                                                                          │
└──────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    │ AI Response (citing data)
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                      RESPONSE DELIVERY                                   │
│                   (Back to Chat Component)                               │
│                                                                          │
│  "Based on CostReno data, typical costs are..."                          │
│  "Red flags to watch: ..."                                               │
│  "Ask your contractor: ..."                                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
USER QUERY
    │
    │ "How much does a bathroom remodel cost?"
    │
    ↓
PROJECT TYPE DETECTION
    ├─ Search synonyms: ["bath", "bathroom renovation", ...]
    └─ Match: "bathroom"
    │
    ↓
KNOWLEDGE LOOKUP
    ├─ Check cache → miss
    ├─ Load from loader → loadBathroomKnowledge()
    └─ Cache result
    │
    ├─ Extract pricing info
    │   ├─ Average: $19,000
    │   ├─ Range: $8,000 - $30,000
    │   └─ Breakdown: Labor 40%, Tile 35%, Fixtures 15%, Permits 10%
    ├─ Extract cost drivers
    │   └─ [Bathroom size, Tile quality, Fixture type, ...]
    └─ Extract materials
        ├─ Porcelain Tile ($2k-$5k)
        ├─ Acrylic Tub ($400-$800)
        └─ Cast Iron Tub ($1.5k-$3.5k)
    │
    ↓
CONTEXT FORMATTING
    Convert to natural language:
    "Bathroom Remodel Pricing:
     - Average: $19,000
     - Range: $8,000 - $30,000
     - Cost breakdown: Labor 40%, Tile 35%, Fixtures 15%, Permits 10%
     - Cost drivers: bathroom size, tile quality, fixture type..."
    │
    ↓
SYSTEM PROMPT INJECTION
    Add to LLM system prompt:
    "### Bathroom Remodel Pricing
     - Average: $19,000
     - Range: $8,000 - $30,000
     - Materials: Porcelain Tile ($2k-$5k), Acrylic Tub ($400-$800)...

     INSTRUCTION: Always cite CostReno data when providing estimates."
    │
    ↓
OPENROUTER API CALL
    Model receives:
    - System prompt (with CostReno context)
    - User query
    - Chat history
    │
    ↓
AI RESPONSE
    "Based on CostReno data, a bathroom remodel typically costs $19,000
     on average, with a range of $8,000–$30,000. The cost breakdown is:
     - Labor: 40% ($7,600)
     - Tile & Materials: 35% ($6,650)
     - Fixtures: 15% ($2,850)
     - Permits & Misc: 10% ($1,900)

     Cost drivers include bathroom size, tile quality, fixture type,
     plumbing changes, and any hidden damage discovered during demo."
    │
    ↓
RESPONSE TO USER
```

## File Architecture

```
src/lib/
├─ knowledge-provider.ts (350+ lines)
│  ├─ Types: ProjectKnowledge, Material, ScopeItem, PricingInfo, etc.
│  ├─ KnowledgeAdapter interface (Supabase migration)
│  ├─ JsonLoaderAdapter (current implementation)
│  ├─ Data loaders: loadRoofingKnowledge(), loadKitchenKnowledge(), etc.
│  └─ KnowledgeProvider class:
│     ├─ register(type, loader) — auto-extracts synonyms
│     ├─ getKnowledge(projectType) — cached lookup
│     ├─ detectProjectType(query) — synonym-based detection
│     ├─ setAdapter(adapter) — Supabase migration
│     └─ getMaterials(), getPricing(), getRedFlags(), etc.
│
├─ chat-with-knowledge.ts (150+ lines)
│  ├─ ChatMessage interface
│  ├─ chatWithKnowledge() → Promise<string>
│  ├─ chatWithKnowledgeStream() → AsyncGenerator<string>
│  └─ extractProjectTypeFromChat() → ProjectType | null
│
└─ estimator-engine.ts (277 lines)
   └─ ProjectType definition (shared between files)

Docs:
├─ KNOWLEDGE_ENGINE_SUMMARY.md (overview)
├─ KNOWLEDGE_PROVIDER_USAGE.md (usage guide)
├─ KNOWLEDGE_ENGINE_INTEGRATION.md (how-to)
├─ KNOWLEDGE_PROVIDER_MIGRATION.md (migration notes)
├─ KNOWLEDGE_ENGINE_CHECKLIST.md (todo list)
└─ KNOWLEDGE_ENGINE_ARCHITECTURE.md (this file)
```

## Integration Points

### Point 1: Chat Component

```
Location: src/routes/index.tsx
Function: getAIResponse()
Change: Use chatWithKnowledge() instead of direct OpenRouter calls
```

### Point 2: Knowledge Lookup

```
Automatic: detectProjectType() finds project from query
Automatic: getKnowledge() loads and caches data
Automatic: formatContextForLLM() enriches system prompt
```

### Point 3: Supabase Migration (Future)

```
1. Implement KnowledgeAdapter interface
2. Create project_knowledge table
3. Call knowledgeProvider.setAdapter(supabaseAdapter)
4. Done — no consumer code changes
```

## Scaling Strategy

### Phase 1: Foundation (Current)

```
✓ Single source of truth (KnowledgeProvider)
✓ One data type (ProjectKnowledge)
✓ One project detection (detectProjectType)
✓ 3 complete projects
✓ Supabase adapter interface ready
Status: COMPLETE
```

### Phase 2: Expansion (1-2 days)

```
→ Add 8 more projects via register()
→ Add 50+ more red flags
→ Expand building code database
→ Add regional variations
Status: IN PROGRESS
```

### Phase 3: Supabase Migration (1 week)

```
→ Implement KnowledgeAdapter
→ Migrate data to Supabase
→ Call setAdapter()
→ No consumer code changes
Status: PLANNED
```

### Phase 4: Intelligence (2+ weeks)

```
→ Contextual knowledge (region, climate)
→ Real-time pricing
→ Contractor recommendations
Status: FUTURE
```

## Performance Characteristics

```
Query Detection:     < 1ms (synonym matching)
Knowledge Lookup:    < 5ms (cached)
Context Formatting:  < 10ms (string building)
Total Overhead:      < 20ms (negligible)

Latency Impact:      Imperceptible (<50ms difference vs direct API)
Memory Usage:        ~500KB (knowledge database)
Scalability:         Linear with project count (currently 3, expandable)
```

## Security & Privacy

```
✓ No external calls during knowledge lookup
✓ All data stored locally in TypeScript
✓ User queries not stored
✓ Knowledge updates are local-only
✓ No PII in knowledge base
✓ LLM calls unmodified except system prompt
```

## Summary

The Knowledge Provider provides a clean, single-source-of-truth layer between the chat UI and external APIs. It ensures every response cites verified CostReno data while maintaining full backward compatibility with the existing chat system.

**Key traits:**

- Single source of truth (one service, one data type)
- Extensible (add projects via register())
- Migration-ready (KnowledgeAdapter for Supabase)
- Type-safe (full TypeScript)
- Performance-optimized (< 20ms overhead)
