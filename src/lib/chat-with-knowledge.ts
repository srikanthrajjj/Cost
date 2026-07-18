// ─── Chat Integration Layer: Routes queries through Knowledge Provider ───────
// This layer sits between the chatbot UI and the OpenRouter API.
// It enriches all LLM requests with verified CostReno data.
//
// Flow:
//   Chat UI → extractProjectTypeFromChat() → knowledgeProvider → OpenRouter

import { knowledgeProvider } from "./knowledge-provider";
import type { ProjectType } from "./estimator-engine";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── Helper: Format Knowledge for LLM Prompt ───────────────────────────────────
async function formatContextForLLM(knowledgeType: ProjectType | null): Promise<string> {
  const knowledgeData = knowledgeType ? await knowledgeProvider.getKnowledge(knowledgeType) : null;
  if (!knowledgeData) return "";

  let prompt = "";

  prompt += `\n## ${knowledgeData.projectType.toUpperCase()} PROJECT KNOWLEDGE\n`;

  if (knowledgeData.materials.length > 0) {
    prompt += `\n### Materials:\n`;
    knowledgeData.materials.forEach((m) => {
      prompt += `- **${m.name}**: ${m.cost} (${m.durability} durability, ROI: ${m.roi})\n`;
      prompt += `  Pros: ${m.pros.join(", ")}\n`;
      prompt += `  Cons: ${m.cons.join(", ")}\n`;
    });
  }

  if (knowledgeData.redFlags.length > 0) {
    prompt += `\n### Red Flags to Watch:\n`;
    knowledgeData.redFlags.forEach((flag) => {
      prompt += `- **${flag.flag}** (${flag.severity}): ${flag.explanation}\n`;
    });
  }

  if (knowledgeData.questions.length > 0) {
    prompt += `\n### Questions to Ask Contractors:\n`;
    knowledgeData.questions.forEach((q) => {
      prompt += `- ${q.question}\n`;
    });
  }

  if (knowledgeData.scope.length > 0) {
    prompt += `\n### Scope Items:\n`;
    knowledgeData.scope.forEach((item) => {
      prompt += `- **${item.name}** (${item.category ?? "General"}): ${item.description}\n`;
      if (item.typicalUnit) prompt += `  Unit: ${item.typicalUnit}\n`;
      if (item.typicalCost) prompt += `  Typical Cost: ${item.typicalCost}\n`;
      if (item.required) prompt += `  Required\n`;
      if (item.commonContractorNames && item.commonContractorNames.length > 0)
        prompt += `  Common contractors: ${item.commonContractorNames.join(", ")}\n`;
      if (item.requiredMaterials && item.requiredMaterials.length > 0)
        prompt += `  Required materials: ${item.requiredMaterials.join(", ")}\n`;
      if (item.commonOmissions && item.commonOmissions.length > 0)
        prompt += `  Common omissions: ${item.commonOmissions.join(", ")}\n`;
      if (item.relatedRedFlags && item.relatedRedFlags.length > 0)
        prompt += `  Related red flags: ${item.relatedRedFlags.join(", ")}\n`;
      if (item.contractorQuestions && item.contractorQuestions.length > 0)
        prompt += `  Contractor questions: ${item.contractorQuestions.join(", ")}\n`;
    });
  }

  if (knowledgeData.buildingCodes.length > 0) {
    prompt += `\n### Building Code Requirements:\n`;
    knowledgeData.buildingCodes.forEach((code) => {
      prompt += `- ${code.code}: ${code.requirement}\n`;
    });
  }

  if (knowledgeData.pricing) {
    prompt += `\n### Pricing:\n`;
    prompt += `- Average: $${knowledgeData.pricing.avgCost.toLocaleString()}\n`;
    prompt += `- Range: $${knowledgeData.pricing.lowEnd.toLocaleString()} – $${knowledgeData.pricing.highEnd.toLocaleString()}\n`;
    if (knowledgeData.pricing.costDrivers.length > 0) {
      prompt += `- Cost Drivers: ${knowledgeData.pricing.costDrivers.join(", ")}\n`;
    }
  }

  return prompt;
}

// ─── Project Type Detection (single source of truth via KnowledgeProvider) ─────
export function extractProjectTypeFromChat(messages: ChatMessage[]): ProjectType | null {
  const allText = messages.map((m) => m.content).join(" ");
  return knowledgeProvider.detectProjectType(allText);
}

// ─── Enhanced LLM Call with Knowledge Context ──────────────────────────────────
export async function chatWithKnowledge(
  messages: ChatMessage[],
  apiKey: string,
  userProjectType?: ProjectType,
): Promise<string> {
  const userMessage = messages[messages.length - 1]?.content || "";
  const projectType = userProjectType || extractProjectTypeFromChat(messages);
  const knowledgePrompt = await formatContextForLLM(projectType);
  const projectKnowledge = projectType ? await knowledgeProvider.getKnowledge(projectType) : null;
  const conversationHistory =
    messages
      .slice(0, -1)
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n") || "(No prior conversation history)";

  const structuredKnowledge =
    knowledgePrompt.trim() || "(No project-specific knowledge detected for this query.)";
  const lowerUserMessage = userMessage.toLowerCase();
  const matchedScopeItem = projectKnowledge?.scope.find((item) => {
    const name = item.name.toLowerCase();
    const words = name.split(/\s+/).filter((w) => w.length > 3);
    return lowerUserMessage.includes(name) || words.some((w) => lowerUserMessage.includes(w));
  });

  const matchedBuildingCode = matchedScopeItem
    ? projectKnowledge?.buildingCodes.find((code) => {
        const itemName = matchedScopeItem.name.toLowerCase();
        const codeText = code.code.toLowerCase();
        const reqText = code.requirement.toLowerCase();
        return codeText.includes(itemName) || reqText.includes(itemName);
      })
    : undefined;

  const focusedStructuredKnowledge = matchedScopeItem
    ? `FOCUSED ITEM (MATCHED)
Name: ${matchedScopeItem.name}
Category: ${matchedScopeItem.category ?? "General"}
Description: ${matchedScopeItem.description}
Typical Unit: ${matchedScopeItem.typicalUnit ?? "(not provided)"}
Typical Cost: ${matchedScopeItem.typicalCost ?? "(not provided)"}
Required Materials: ${(matchedScopeItem.requiredMaterials ?? []).join(", ") || "(not provided)"}
Required: ${matchedScopeItem.required ? "Yes" : "No"}
Common Omissions: ${(matchedScopeItem.commonOmissions ?? []).join(", ") || "(not provided)"}
Related Red Flags: ${(matchedScopeItem.relatedRedFlags ?? []).join(", ") || "(not provided)"}
Contractor Questions: ${(matchedScopeItem.contractorQuestions ?? []).join(" | ") || "(not provided)"}
Building Code: ${matchedBuildingCode ? `${matchedBuildingCode.code}: ${matchedBuildingCode.requirement}` : "(not provided)"}`
    : "FOCUSED ITEM (MATCHED)\n(no direct scope-item match found)";

  const systemPrompt = `INSTRUCTIONS
You have been provided with project-specific structured knowledge.

Treat this knowledge as the authoritative source.

When answering questions about this project, always use the provided values instead of your own general knowledge.

Do not substitute costs, materials, building codes, or recommendations unless the provided knowledge is missing that information.

If a value exists in the structured knowledge, quote that exact value.

When the user asks about a specific scope item (for example: drip edge, valley flashing, ridge vents), you must:
1) identify that exact scope item from STRUCTURED KNOWLEDGE,
2) include its Typical Cost line verbatim if present,
3) base replacement guidance on the provided Required flag and related omissions/red flags.

Never replace a provided numeric value or range with a different value from prior knowledge.

If information is missing, explicitly say it is not present in the provided knowledge before using general guidance.

Use a warm, direct, practical tone for homeowners.

CONVERSATION HISTORY
${conversationHistory}

STRUCTURED KNOWLEDGE
${structuredKnowledge}

${focusedStructuredKnowledge}

USER MESSAGE
${userMessage}`;

  const messagesForLLM: ChatMessage[] = [
    {
      role: "user",
      content: userMessage,
    },
  ];
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://costreno.com",
        "X-Title": "CostReno AI",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messagesForLLM.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenRouter error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from AI - empty choices");
    }
    return data.choices?.[0]?.message?.content || "Unable to generate response.";
  } catch (error) {
    console.error("Chat with knowledge error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
      return "API key invalid or expired. Please check your VITE_SK_API_KEY.";
    }
    if (errorMessage.includes("429") || errorMessage.includes("rate limit")) {
      return "Rate limit exceeded. Please wait a moment and try again.";
    }
    if (errorMessage.includes("404") || errorMessage.includes("not found")) {
      return "Model not found. Please check the model configuration.";
    }
    return `Error: ${errorMessage}. Please try again.`;
  }
}

// ─── Streaming Version (for real-time responses) ──────────────────────────────
export async function* chatWithKnowledgeStream(
  messages: ChatMessage[],
  apiKey: string,
  userProjectType?: ProjectType,
) {
  const userMessage = messages[messages.length - 1]?.content || "";
  const projectType = userProjectType || extractProjectTypeFromChat(messages);
  const knowledgePrompt = await formatContextForLLM(projectType);

  const systemPrompt = `You are CostReno AI — the intelligent renovation copilot.

CRITICAL: Always use the CostReno knowledge provided below for accurate information.

${knowledgePrompt}`;

  const messagesForLLM = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://costreno.com",
        "X-Title": "CostReno AI",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messagesForLLM,
        ],
        temperature: 0.7,
        max_tokens: 1500,
        stream: true,
      }),
    });

    if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((line) => line.trim());

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const json = line.slice(6);
          if (json === "[DONE]") continue;

          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) yield content;
          } catch (e) {
            // Skip parsing errors in stream
          }
        }
      }
    }
  } catch (error) {
    console.error("Streaming chat error:", error);
    yield "Error generating response. Please try again.";
  }
}
