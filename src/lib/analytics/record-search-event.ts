import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { saveSearchEvent } from "@/lib/db/store";

export const recordSearchEvent = createServerFn({ method: "POST" })
  .validator(
    z.object({
      query: z.string().min(1).max(200),
      resultHref: z.string().min(1).max(300),
      resultTitle: z.string().max(200).optional(),
      resultGroup: z.string().max(80).optional(),
      sessionId: z.string().min(8).max(80).optional(),
    }),
  )
  .handler(async ({ data }) => {
    await saveSearchEvent({
      query: data.query,
      resultHref: data.resultHref,
      resultTitle: data.resultTitle,
      resultGroup: data.resultGroup,
      sessionId: data.sessionId,
    });
    return { ok: true as const };
  });
