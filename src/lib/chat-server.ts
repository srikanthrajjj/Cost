import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { chatWithKnowledge, type ChatMessage } from "./chat-with-knowledge";

export const serverChatWithKnowledge = createServerFn({ method: "POST" })
  .validator(z.object({
    messages: z.array(z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })),
    userProjectType: z.string().optional(),
  }))
  .handler(async ({ data }): Promise<string> => {
    const apiKey = process.env.VITE_SK_API_KEY;
    if (!apiKey) return "API key not configured.";
    return chatWithKnowledge(data.messages as ChatMessage[], apiKey, data.userProjectType);
  });
