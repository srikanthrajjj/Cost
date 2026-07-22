import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  countStoredQuoteFeedback,
  countStoredQuoteUploads,
  getStorageMode,
  listStoredQuoteFeedback,
  listStoredQuoteUploads,
} from "@/lib/db/store";
import { getAudienceId, getResendClient } from "@/lib/email/resend";

/** Fallback so /admin works before ADMIN_SECRET is set in env. Override in production. */
const DEFAULT_ADMIN_PASSWORD = "costreno-admin";

function getAdminSecret(): string {
  const secret =
    (typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env as Record<string, string | undefined>).ADMIN_SECRET
      : undefined) ||
    process.env.ADMIN_SECRET ||
    "";
  return secret.trim().length > 0 ? secret.trim() : DEFAULT_ADMIN_PASSWORD;
}

function assertAdminPassword(password: string) {
  if (password !== getAdminSecret()) {
    throw new Error("Invalid admin password.");
  }
}

async function countWaitlistEmails(): Promise<{
  count: number | null;
  error: string | null;
}> {
  try {
    const apiKey =
      (typeof import.meta !== "undefined" && import.meta.env
        ? (import.meta.env as Record<string, string | undefined>).RESEND_API_KEY
        : undefined) || process.env.RESEND_API_KEY;
    const audienceId = getAudienceId();

    if (!apiKey) {
      return { count: null, error: "RESEND_API_KEY is not configured." };
    }

    // Prefer SDK when available
    try {
      const resend = getResendClient();
      let total = 0;
      let after: string | undefined;

      for (let page = 0; page < 50; page++) {
        const result = await resend.contacts.list({
          audienceId,
          limit: 100,
          ...(after ? { after } : {}),
        } as { audienceId: string; limit: number; after?: string });

        if (result.error) {
          throw new Error(result.error.message || "Failed to load waitlist.");
        }

        const items = result.data?.data ?? [];
        total += items.length;

        if (!result.data?.has_more || items.length === 0) break;
        after = items[items.length - 1]?.id;
        if (!after) break;
      }

      return { count: total, error: null };
    } catch {
      // Fallback to REST (audience contacts endpoint)
      let total = 0;
      let after: string | undefined;

      for (let page = 0; page < 50; page++) {
        const url = new URL(`https://api.resend.com/audiences/${audienceId}/contacts`);
        url.searchParams.set("limit", "100");
        if (after) url.searchParams.set("after", after);

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });

        if (!response.ok) {
          const body = await response.text();
          return {
            count: null,
            error: `Waitlist API error (${response.status}): ${body.slice(0, 160)}`,
          };
        }

        const payload = (await response.json()) as {
          data?: Array<{ id: string }>;
          has_more?: boolean;
        };
        const items = payload.data ?? [];
        total += items.length;
        if (!payload.has_more || items.length === 0) break;
        after = items[items.length - 1]?.id;
        if (!after) break;
      }

      return { count: total, error: null };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load waitlist.";
    return { count: null, error: message };
  }
}

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

export const verifyAdminPassword = createServerFn({ method: "POST" })
  .validator(z.object({ password: z.string().min(1) }))
  .handler(async ({ data }) => {
    assertAdminPassword(data.password);
    return { ok: true as const };
  });

export const getAdminDashboardStats = createServerFn({ method: "POST" })
  .validator(
    z.object({
      password: z.string().min(1),
      recentLimit: z.number().int().min(1).max(25).optional(),
    }),
  )
  .handler(async ({ data }) => {
    assertAdminPassword(data.password);
    const recentLimit = data.recentLimit ?? 8;

    const [quotesProcessed, feedbackReceived, waitlist, recentQuotes, recentFeedback] =
      await Promise.all([
        countStoredQuoteUploads(),
        countStoredQuoteFeedback(),
        countWaitlistEmails(),
        listStoredQuoteUploads(recentLimit),
        listStoredQuoteFeedback(recentLimit),
      ]);

    return {
      storage: getStorageMode(),
      quotesProcessed,
      feedbackReceived,
      waitlistEmails: waitlist.count,
      waitlistError: waitlist.error,
      recentQuotes: recentQuotes.map(({ rawText, analysisSummary, ...rest }) => ({
        ...rest,
        rawTextChars: rawText.length,
      })),
      recentFeedback,
    };
  });
