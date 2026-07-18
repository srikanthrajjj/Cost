# CostReno Knowledge Engine

## What Is It?

A modular knowledge service that sits between the chatbot and OpenRouter. It ensures the AI chatbot never relies on general knowledge alone—every answer is backed by verified CostReno data.

**Flow:**

```
User Question
    ↓
Knowledge Engine (analyzes, looks up data)
    ↓
Enriched System Prompt
    ↓
OpenRouter API
    ↓
Data-Backed Response
```

## Files Created

### Core Engine

- **`src/lib/knowledge-engine.ts`** (320+ lines)
  - Structured knowledge database for 3 projects (Roof, Kitchen, Bathroom)
  - Query analysis to detect project type from user input
  - Knowledge context builder with all 8 data types
  - LLM prompt formatter

- **`src/lib/chat-with-knowledge.ts`** (170+ lines)
  - Integration layer for chatbot
  - `chatWithKnowledge()` function — drop-in replacement for direct API calls
  - Project type extraction from chat history
  - Streaming support for real-time responses

### Documentation

- **`KNOWLEDGE_ENGINE_INTEGRATION.md`** — How to integrate into the existing chat
- **`CHAT_INTEGRATION_EXAMPLE.ts`** — Exact code changes needed (3-line replacement)
- **`KNOWLEDGE_ENGINE_README.md`** — This file

## What Data Does It Provide?

For each project, the Knowledge Engine returns:

1. **Materials** — Pros/cons, cost, durability, ROI for each option
2. **Scope Items** — What's included/optional, timeframe for each task
3. **Pricing** — Average, low/high range, cost breakdown, cost drivers
4. **Red Flags** — Contractor scams, quality issues (HIGH/MEDIUM/LOW severity)
5. **Building Codes** — Local compliance requirements
6. **Insurance Rules** — Coverage info, deductibles, claim triggers
7. **Contractor Questions** — Vetted questions homeowners should ask
8. **Synonyms** — Alternative terms for better matching (e.g., "bath" → "bathroom")

## Current Coverage

### Fully Detailed

- ✅ Roof Replacement (14 knowledge points)
- ✅ Kitchen Remodel (12 knowledge points)
- ✅ Bathroom Remodel (11 knowledge points)

### Stubbed (Pricing Only)

- ⏳ HVAC System
- ⏳ Windows
- ⏳ Flooring
- ⏳ Painting
- ⏳ Solar Panels
- ⏳ Deck / Patio
- ⏳ Plumbing
- ⏳ Electrical

## How to Use It

### Step 1: Import

```typescript
import { chatWithKnowledge, extractProjectTypeFromChat } from "@/lib/chat-with-knowledge";
```

### Step 2: Replace getAIResponse()

```typescript
const projectType = extractProjectTypeFromChat(messages);
const response = await chatWithKnowledge(messages, SK_API_KEY, projectType);
```

### Step 3: That's It!

No other changes needed. The engine automatically:

- Detects project type
- Loads knowledge
- Enriches the prompt
- Returns verified answers

## Example Output

**User:** "What are red flags when hiring a roofer?"

**Before (General Knowledge):**

> "You should check for experience and references."

**After (Knowledge Engine):**

> "Based on CostReno data, watch for these red flags:
>
> - **Roofer quotes price per-layer removal** (HIGH): Legitimate roofers quote by square foot
> - **Pressure washing before inspection** (HIGH): Could hide structural damage
> - **No warranty offered** (HIGH): Reputable roofers offer 5–10 year warranties
> - **Below-market pricing** (MEDIUM): May indicate low-quality materials"

## Architecture Benefits

✅ **Modular** — Plugs into existing chat without breaking changes
✅ **Extensible** — Add new projects by editing knowledge-engine.ts
✅ **Verifiable** — All data comes from CostReno, not LLM guesses
✅ **Testable** — Each knowledge function is isolated and can be tested
✅ **Scalable** — Ready to connect to external APIs (building codes, insurance databases)
✅ **Non-Invasive** — Doesn't modify existing chat UI or components

## Next Steps

### Immediate (1-2 hours)

1. Integrate into existing chat (see CHAT_INTEGRATION_EXAMPLE.ts)
2. Test with sample questions
3. Verify responses cite CostReno data

### Short Term (1-2 days)

1. Expand knowledge base (complete HVAC, Windows, Flooring, etc.)
2. Add more red flags and building codes
3. Test with real users

### Medium Term (1 week)

1. Connect to external data sources:
   - Building code APIs (ICC, local databases)
   - Insurance company APIs
   - Material price databases
   - Contractor networks
2. Add knowledge versioning (track changes)
3. Build admin UI for non-technical updates

### Long Term (2+ weeks)

1. Machine learning to improve project detection
2. Contextual knowledge (e.g., climate-specific building codes)
3. Real-time market pricing integration
4. Contractor recommendation engine based on knowledge
5. Integration with quote analysis tools

## Code Quality

- ✅ TypeScript types for all interfaces
- ✅ Zero external dependencies
- ✅ ~500 lines of production code
- ✅ Clean, well-commented structure
- ✅ Follows CostReno naming conventions

## Files to Read First

1. `src/lib/CHAT_INTEGRATION_EXAMPLE.ts` — See the 3-line code change
2. `src/lib/KNOWLEDGE_ENGINE_INTEGRATION.md` — Full integration guide
3. `src/lib/knowledge-engine.ts` — Understand the data structure
4. `src/lib/chat-with-knowledge.ts` — See how it integrates with OpenRouter

## Questions?

The knowledge engine is designed to be self-explanatory. Each function has:

- Clear parameter names
- JSDoc comments explaining purpose
- Type definitions for all data

Browse the code, and it will become clear how to extend it.
