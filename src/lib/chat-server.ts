import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAiApiKey } from "./ai-config";
import { chatWithKnowledge, type ChatMessage } from "./chat-with-knowledge";
import type { ProjectType } from "./estimator-engine";
import { friendlyOpenRouterMessage } from "./quote/openrouter-client";

export const serverChatWithKnowledge = createServerFn({ method: "POST" })
  .validator(
    z.object({
      messages: z.array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        }),
      ),
      userProjectType: z.string().optional(),
    }),
  )
  .handler(async ({ data }): Promise<string> => {
    try {
      const apiKey = requireAiApiKey();
      return await chatWithKnowledge(
        data.messages as ChatMessage[],
        apiKey,
        data.userProjectType as ProjectType | undefined,
      );
    } catch (error) {
      console.error("serverChatWithKnowledge error:", error);
      throw new Error(friendlyOpenRouterMessage(error));
    }
  });

/**
 * Broader API search for the floating site navigator when catalog matching fails.
 */
export const serverSiteNavigatorBroaderSearch = createServerFn({ method: "POST" })
  .validator(
    z.object({
      query: z.string().min(1).max(500),
    }),
  )
  .handler(async ({ data }): Promise<string> => {
    try {
      const apiKey = requireAiApiKey();
      const wrapped: ChatMessage[] = [
        {
          role: "user",
          content: `The CostReno site catalog found no matching guide articles for this homeowner question: "${data.query}"

Give a short, practical answer for a U.S. homeowner about renovation or repair planning.
Rules:
- Say clearly if CostReno may not have a dedicated article yet.
- Prefer general ranges only when you are confident; otherwise direct them to a ZIP estimate or quote review.
- Keep the answer under 120 words.
- End with 1-2 CostReno tool ACTION tags when useful.`,
        },
      ];
      return await chatWithKnowledge(wrapped, apiKey);
    } catch (error) {
      console.error("serverSiteNavigatorBroaderSearch error:", error);
      throw new Error(friendlyOpenRouterMessage(error));
    }
  });
