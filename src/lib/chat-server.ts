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
