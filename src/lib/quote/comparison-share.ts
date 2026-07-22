import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getComparisonReport, saveComparisonReport } from "@/lib/db/store";
import type { SavedQuote } from "@/lib/quote/comparison-store";

const SHARE_ID_RE = /^cmp_[0-9a-f-]{36}$/i;

const savedQuoteSchema = z.object({
  id: z.string().min(1).max(120),
  savedAt: z.string().min(1).max(64),
  result: z.any(),
});

export type ComparisonShareSnapshot = {
  version: 1;
  quotes: SavedQuote[];
};

function sanitizeQuotes(
  quotes: Array<{ id: string; savedAt: string; result: SavedQuote["result"] }>,
): SavedQuote[] {
  return quotes.map((q) => ({
    id: q.id,
    savedAt: q.savedAt,
    result: {
      ...q.result,
      // Full AI narrative is not needed for the comparison UI and keeps payloads smaller
      report: "",
    },
  }));
}

function isExpired(expiresAt?: string | null): boolean {
  if (!expiresAt) return false;
  const ts = Date.parse(expiresAt);
  if (Number.isNaN(ts)) return false;
  return ts < Date.now();
}

/** Persist a comparison snapshot and return a shareable report id. */
export const createComparisonShare = createServerFn({ method: "POST" })
  .validator(
    z.object({
      quotes: z.array(savedQuoteSchema).min(2).max(3),
      projectType: z.string().max(120).optional(),
      recommendedContractor: z.string().max(200).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const quotes = sanitizeQuotes(
      data.quotes.map((q) => ({
        id: q.id,
        savedAt: q.savedAt,
        result: q.result as SavedQuote["result"],
      })),
    );
    const snapshot: ComparisonShareSnapshot = { version: 1, quotes };
    const saved = await saveComparisonReport({
      snapshot,
      quoteCount: quotes.length,
      projectType: data.projectType,
      recommendedContractor: data.recommendedContractor,
      source: "quote-comparison-share",
    });
    return { id: saved.id, storage: saved.storage };
  });

/** Load a public comparison share by id. Returns null when missing or expired. */
export const loadComparisonShare = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(1).max(80) }))
  .handler(async ({ data }) => {
    if (!SHARE_ID_RE.test(data.id)) return null;
    const row = await getComparisonReport(data.id);
    if (!row) return null;
    if (isExpired(row.expiresAt)) return null;

    const snapshot = row.snapshot as ComparisonShareSnapshot | null;
    if (!snapshot || snapshot.version !== 1 || !Array.isArray(snapshot.quotes)) {
      return null;
    }
    if (snapshot.quotes.length < 2 || snapshot.quotes.length > 3) return null;

    return {
      id: row.id,
      createdAt: row.createdAt,
      expiresAt: row.expiresAt ?? null,
      projectType: row.projectType ?? null,
      recommendedContractor: row.recommendedContractor ?? null,
      quotes: snapshot.quotes as SavedQuote[],
    };
  });
