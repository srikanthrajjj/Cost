import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getStorageMode,
  listStoredQuoteFeedback,
  listStoredQuoteUploads,
} from "@/lib/db/store";

/** Internal/debug listing of stored quote uploads (no raw text by default). */
export const listQuoteUploads = createServerFn({ method: "GET" })
  .validator(z.object({ limit: z.number().int().min(1).max(100).optional() }).optional())
  .handler(async ({ data }) => {
    const rows = await listStoredQuoteUploads(data?.limit ?? 50);
    return {
      storage: getStorageMode(),
      items: rows.map(({ rawText, ...rest }) => ({
        ...rest,
        rawTextChars: rawText.length,
      })),
    };
  });

/** Internal/debug listing of stored feedback. */
export const listQuoteFeedbackEntries = createServerFn({ method: "GET" })
  .validator(z.object({ limit: z.number().int().min(1).max(100).optional() }).optional())
  .handler(async ({ data }) => {
    const rows = await listStoredQuoteFeedback(data?.limit ?? 50);
    return {
      storage: getStorageMode(),
      items: rows,
    };
  });
