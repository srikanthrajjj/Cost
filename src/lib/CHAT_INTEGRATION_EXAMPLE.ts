// ─── EXAMPLE: How to integrate Knowledge Engine into the existing chat ──────
// This shows the exact code replacement needed in src/routes/index.tsx

// ═══════════════════════════════════════════════════════════════════════════════
// BEFORE: Current getAIResponse() function
// ═══════════════════════════════════════════════════════════════════════════════

/*
const getAIResponse = async (messages: { role: "user" | "ai"; text: string }[]): Promise<string> => {
  if (!SK_API_KEY) {
    return "API key not configured. Please set VITE_SK_API_KEY in your environment.";
  }
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SK_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://costreno.com",
        "X-Title": "CostReno AI",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are CostReno AI — the intelligent renovation copilot...` // Original system prompt
          },
          ...messages.map(m => ({
            role: m.role,
            content: m.text,
          })),
        ],
        // ... rest of config
      }),
    });
    // ... response handling
  } catch (error) {
    // ... error handling
  }
};
*/

// ═══════════════════════════════════════════════════════════════════════════════
// AFTER: New getAIResponse() using Knowledge Engine
// ═══════════════════════════════════════════════════════════════════════════════

// ADD THESE IMPORTS at the top of src/routes/index.tsx
import { chatWithKnowledge } from "@/lib/chat-with-knowledge";
import { extractProjectTypeFromChat } from "@/lib/chat-with-knowledge";

// REPLACE getAIResponse function with this:

const getAIResponse = async (
  messages: { role: "user" | "ai"; text: string }[],
): Promise<string> => {
  if (!SK_API_KEY) {
    return "API key not configured. Please set VITE_SK_API_KEY in your environment.";
  }

  try {
    // Extract project type from conversation history
    const projectType = extractProjectTypeFromChat(
      messages.map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
    );

    // Call the Knowledge Engine-enhanced chat
    const response = await chatWithKnowledge(
      messages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      })),
      SK_API_KEY,
      projectType,
    );

    return response;
  } catch (error) {
    console.error("Chat error:", error);
    return "I encountered an error processing your request. Please try again.";
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// THAT'S IT! No other changes needed to the chat component.
// ═══════════════════════════════════════════════════════════════════════════════

// The Knowledge Engine now:
// 1. Analyzes each user query for project type
// 2. Looks up verified data (materials, pricing, red flags, etc.)
// 3. Enriches the system prompt with structured context
// 4. Ensures all responses cite CostReno data

// ═══════════════════════════════════════════════════════════════════════════════
// TESTING
// ═══════════════════════════════════════════════════════════════════════════════

// Test in browser console:
// User: "How much does a kitchen remodel cost?"
// AI: "Based on CostReno data, a kitchen remodel typically costs $50,000 on average,
//      with a range of $25,000–$75,000. The breakdown is: Cabinets (40%), Labor (35%),
//      Countertops (15%), Fixtures & Finishes (10%)..."

// User: "What should I watch out for with a contractor?"
// AI: "Based on CostReno data, here are key red flags:
//      HIGH SEVERITY: No structural assessment before starting...
//      MEDIUM SEVERITY: Vague appliance pricing..."
