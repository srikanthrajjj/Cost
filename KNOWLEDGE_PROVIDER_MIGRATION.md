# Knowledge Provider: Migration Guide

## Overview

`KnowledgeProvider` is now the single source of truth for all CostReno project data. The old `knowledge-engine.ts` has been removed.

## What Changed

### Before (Dual Systems)

```
❌ knowledge-engine.ts — chat-centric, formatted strings
❌ knowledge-provider.ts — pure data service
❌ Duplicate project detection logic
❌ Two different data types (KnowledgeContext vs ProjectKnowledge)
❌ knowledge-templates.ts — separate file
```

### After (Single System)

```
✅ knowledge-provider.ts — single source of truth
✅ ProjectKnowledge — only data type used everywhere
✅ detectProjectType() — single source of truth in KnowledgeProvider
✅ Auto-registration via knowledgeProvider.register()
✅ Supabase-ready via KnowledgeAdapter interface
```

## Migration is Complete

No migration needed — the new system is already in place:

- ✅ `knowledge-engine.ts` deleted
- ✅ `knowledge-templates.ts` deleted
- ✅ `chat-with-knowledge.ts.bak` deleted
- ✅ `chat-with-knowledge.ts` updated to use KnowledgeProvider only
- ✅ All consumers use KnowledgeProvider

## Using the New System

### Chatbot (no changes needed)

```typescript
import { chatWithKnowledge, extractProjectTypeFromChat } from "@/lib/chat-with-knowledge";
const response = await chatWithKnowledge(messages, SK_API_KEY, projectType);
```

### Direct Data Access

```typescript
import { knowledgeProvider } from "@/lib/knowledge-provider";
const knowledge = knowledgeProvider.getKnowledge("roof");
const pricing = knowledgeProvider.getPricing("kitchen");
```

### Adding New Projects

```typescript
knowledgeProvider.register("windows", loadWindowsKnowledge);
```

### Migrating to Supabase

```typescript
knowledgeProvider.setAdapter(supabaseAdapter);
```

## Side-by-Side Comparison

| Feature             | Old (deleted)   | New (KnowledgeProvider) |
| ------------------- | --------------- | ----------------------- |
| Data Service        | ✅              | ✅                      |
| Chatbot Support     | ✅              | ✅                      |
| Quote Analyzer      | ❌              | ✅                      |
| Cost Calculator     | ❌              | ✅                      |
| Material Comparison | ❌              | ✅                      |
| Insurance Checker   | ❌              | ✅                      |
| UI Coupling         | ❌ LLM-specific | ✅ None                 |
| Caching             | ❌              | ✅                      |
| Type Safety         | ✅              | ✅                      |
| Project Detection   | ❌ Duplicate    | ✅ Single source        |
| Supabase Ready      | ❌              | ✅                      |

## Timeline

**Completed:**

- KnowledgeProvider established as single source of truth
- Duplicate files deleted
- Chat updated to use KnowledgeProvider only
- Project detection unified

**Future:**

- Add remaining 8 projects via `knowledgeProvider.register()`
- Migrate to Supabase via `knowledgeProvider.setAdapter()`

---

**KnowledgeProvider is the only system. No migration needed — it's already done.**
