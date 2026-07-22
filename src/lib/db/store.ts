import { count, desc, eq, sql } from "drizzle-orm";
import { getDb, getStorageMode } from "./client";
import { comparisonReports, pageVisits, quoteFeedback, quoteUploads } from "./schema";
import {
  fileCountPageVisits,
  fileCountQuoteFeedback,
  fileCountQuoteUploads,
  fileCountUniqueVisitors,
  fileGetComparisonReport,
  fileListPageVisits,
  fileListQuoteFeedback,
  fileListQuoteUploads,
  fileSaveComparisonReport,
  fileSavePageVisit,
  fileSaveQuoteFeedback,
  fileSaveQuoteUpload,
  fileTopVisitLocations,
  fileUpdateQuoteUpload,
  type StoredComparisonReport,
  type StoredPageVisit,
  type StoredQuoteFeedback,
  type StoredQuoteUpload,
} from "./file-store";

const MAX_RAW_TEXT_CHARS = 100_000;

export type SaveQuoteUploadInput = {
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  rawText: string;
  projectType?: string;
  contractor?: string;
  totalPrice?: number;
  actualPaid?: number;
  completenessScore?: number;
  lineItemCount?: number;
  missingCount?: number;
  clarificationCount?: number;
  redFlagCount?: number;
  analysisSummary?: unknown;
  source?: string;
};

export type SaveQuoteFeedbackInput = {
  quoteUploadId?: string;
  accuracy?: string;
  understandable?: string;
  useAgain?: string;
  amountPaid?: number;
  comment?: string;
  projectType?: string;
  contractor?: string;
  completenessScore?: number;
};

export type SaveComparisonReportInput = {
  snapshot: unknown;
  quoteCount: number;
  projectType?: string;
  recommendedContractor?: string;
  source?: string;
  /** Days until the share link expires. Defaults to 90. */
  expiresInDays?: number;
};

function newId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function truncateText(text: string) {
  if (text.length <= MAX_RAW_TEXT_CHARS) return text;
  return `${text.slice(0, MAX_RAW_TEXT_CHARS)}\n\n[...truncated for storage...]`;
}

export async function saveQuoteUpload(input: SaveQuoteUploadInput): Promise<{
  id: string;
  storage: "postgres" | "file";
}> {
  const id = newId("quote");
  const createdAt = new Date();
  const row: StoredQuoteUpload = {
    id,
    createdAt: createdAt.toISOString(),
    fileName: input.fileName ?? null,
    fileType: input.fileType ?? null,
    fileSize: input.fileSize ?? null,
    rawText: truncateText(input.rawText),
    projectType: input.projectType ?? null,
    contractor: input.contractor ?? null,
    totalPrice: input.totalPrice ?? null,
    actualPaid: input.actualPaid ?? null,
    completenessScore: input.completenessScore ?? null,
    lineItemCount: input.lineItemCount ?? null,
    missingCount: input.missingCount ?? null,
    clarificationCount: input.clarificationCount ?? null,
    redFlagCount: input.redFlagCount ?? null,
    analysisSummary: input.analysisSummary ?? null,
    source: input.source ?? "quote-analyzer",
  };

  const db = getDb();
  if (db) {
    await db.insert(quoteUploads).values({
      id: row.id,
      createdAt,
      fileName: row.fileName,
      fileType: row.fileType,
      fileSize: row.fileSize,
      rawText: row.rawText,
      projectType: row.projectType,
      contractor: row.contractor,
      totalPrice: row.totalPrice,
      actualPaid: row.actualPaid,
      completenessScore: row.completenessScore,
      lineItemCount: row.lineItemCount,
      missingCount: row.missingCount,
      clarificationCount: row.clarificationCount,
      redFlagCount: row.redFlagCount,
      analysisSummary: row.analysisSummary,
      source: row.source,
    });
    return { id, storage: "postgres" };
  }

  await fileSaveQuoteUpload(row);
  return { id, storage: "file" };
}

async function updateQuoteUploadActualPaid(
  quoteUploadId: string,
  amountPaid: number,
): Promise<void> {
  const db = getDb();
  if (db) {
    await db
      .update(quoteUploads)
      .set({ actualPaid: amountPaid })
      .where(eq(quoteUploads.id, quoteUploadId));
    return;
  }

  const uploads = await fileListQuoteUploads(500);
  const match = uploads.find((row) => row.id === quoteUploadId);
  if (!match) return;
  await fileUpdateQuoteUpload({
    ...match,
    actualPaid: amountPaid,
  });
}

export async function saveQuoteFeedback(input: SaveQuoteFeedbackInput): Promise<{
  id: string;
  storage: "postgres" | "file";
}> {
  const id = newId("feedback");
  const createdAt = new Date();
  const row: StoredQuoteFeedback = {
    id,
    createdAt: createdAt.toISOString(),
    quoteUploadId: input.quoteUploadId ?? null,
    accuracy: input.accuracy ?? null,
    understandable: input.understandable ?? null,
    useAgain: input.useAgain ?? null,
    amountPaid: input.amountPaid ?? null,
    comment: input.comment?.trim() || null,
    projectType: input.projectType ?? null,
    contractor: input.contractor ?? null,
    completenessScore: input.completenessScore ?? null,
  };

  const db = getDb();
  if (db) {
    await db.insert(quoteFeedback).values({
      id: row.id,
      createdAt,
      quoteUploadId: row.quoteUploadId,
      accuracy: row.accuracy,
      understandable: row.understandable,
      useAgain: row.useAgain,
      amountPaid: row.amountPaid,
      comment: row.comment,
      projectType: row.projectType,
      contractor: row.contractor,
      completenessScore: row.completenessScore,
    });
    if (row.quoteUploadId && typeof row.amountPaid === "number") {
      await updateQuoteUploadActualPaid(row.quoteUploadId, row.amountPaid);
    }
    return { id, storage: "postgres" };
  }

  await fileSaveQuoteFeedback(row);
  if (row.quoteUploadId && typeof row.amountPaid === "number") {
    await updateQuoteUploadActualPaid(row.quoteUploadId, row.amountPaid);
  }
  return { id, storage: "file" };
}

export async function listStoredQuoteUploads(limit = 50): Promise<StoredQuoteUpload[]> {
  const db = getDb();
  if (db) {
    const rows = await db.select().from(quoteUploads).orderBy(desc(quoteUploads.createdAt)).limit(limit);
    return rows.map((r) => ({
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      fileName: r.fileName,
      fileType: r.fileType,
      fileSize: r.fileSize,
      rawText: r.rawText,
      projectType: r.projectType,
      contractor: r.contractor,
      totalPrice: r.totalPrice,
      actualPaid: r.actualPaid,
      completenessScore: r.completenessScore,
      lineItemCount: r.lineItemCount,
      missingCount: r.missingCount,
      clarificationCount: r.clarificationCount,
      redFlagCount: r.redFlagCount,
      analysisSummary: r.analysisSummary,
      source: r.source,
    }));
  }
  return fileListQuoteUploads(limit);
}

export async function listStoredQuoteFeedback(limit = 50): Promise<StoredQuoteFeedback[]> {
  const db = getDb();
  if (db) {
    const rows = await db
      .select()
      .from(quoteFeedback)
      .orderBy(desc(quoteFeedback.createdAt))
      .limit(limit);
    return rows.map((r) => ({
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      quoteUploadId: r.quoteUploadId,
      accuracy: r.accuracy,
      understandable: r.understandable,
      useAgain: r.useAgain,
      amountPaid: r.amountPaid,
      comment: r.comment,
      projectType: r.projectType,
      contractor: r.contractor,
      completenessScore: r.completenessScore,
    }));
  }
  return fileListQuoteFeedback(limit);
}

export async function countStoredQuoteUploads(): Promise<number> {
  const db = getDb();
  if (db) {
    const rows = await db.select({ value: count() }).from(quoteUploads);
    return Number(rows[0]?.value ?? 0);
  }
  return fileCountQuoteUploads();
}

export async function countStoredQuoteFeedback(): Promise<number> {
  const db = getDb();
  if (db) {
    const rows = await db.select({ value: count() }).from(quoteFeedback);
    return Number(rows[0]?.value ?? 0);
  }
  return fileCountQuoteFeedback();
}

export async function saveComparisonReport(input: SaveComparisonReportInput): Promise<{
  id: string;
  storage: "postgres" | "file";
}> {
  const id = newId("cmp");
  const createdAt = new Date();
  const expiresInDays = input.expiresInDays ?? 90;
  const expiresAt = new Date(createdAt.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
  const row: StoredComparisonReport = {
    id,
    createdAt: createdAt.toISOString(),
    snapshot: input.snapshot,
    quoteCount: input.quoteCount,
    projectType: input.projectType ?? null,
    recommendedContractor: input.recommendedContractor ?? null,
    source: input.source ?? "quote-comparison",
    expiresAt: expiresAt.toISOString(),
  };

  const db = getDb();
  if (db) {
    await db.insert(comparisonReports).values({
      id: row.id,
      createdAt,
      snapshot: row.snapshot,
      quoteCount: row.quoteCount,
      projectType: row.projectType,
      recommendedContractor: row.recommendedContractor,
      source: row.source,
      expiresAt,
    });
    return { id, storage: "postgres" };
  }

  await fileSaveComparisonReport(row);
  return { id, storage: "file" };
}

export async function getComparisonReport(id: string): Promise<StoredComparisonReport | null> {
  const db = getDb();
  if (db) {
    const rows = await db
      .select()
      .from(comparisonReports)
      .where(eq(comparisonReports.id, id))
      .limit(1);
    const r = rows[0];
    if (!r) return null;
    return {
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      snapshot: r.snapshot,
      quoteCount: r.quoteCount,
      projectType: r.projectType,
      recommendedContractor: r.recommendedContractor,
      source: r.source,
      expiresAt: r.expiresAt?.toISOString() ?? null,
    };
  }
  return fileGetComparisonReport(id);
}

export type SavePageVisitInput = {
  path: string;
  sessionId: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  referrer?: string;
};

export async function savePageVisit(input: SavePageVisitInput): Promise<{
  id: string;
  storage: "postgres" | "file";
}> {
  const id = newId("visit");
  const createdAt = new Date();
  const row: StoredPageVisit = {
    id,
    createdAt: createdAt.toISOString(),
    path: input.path.slice(0, 300),
    sessionId: input.sessionId.slice(0, 80),
    city: input.city?.slice(0, 80) || null,
    region: input.region?.slice(0, 80) || null,
    country: input.country?.slice(0, 80) || null,
    countryCode: input.countryCode?.slice(0, 8) || null,
    referrer: input.referrer?.slice(0, 400) || null,
  };

  const db = getDb();
  if (db) {
    await db.insert(pageVisits).values({
      id: row.id,
      createdAt,
      path: row.path,
      sessionId: row.sessionId,
      city: row.city,
      region: row.region,
      country: row.country,
      countryCode: row.countryCode,
      referrer: row.referrer,
    });
    return { id, storage: "postgres" };
  }

  await fileSavePageVisit(row);
  return { id, storage: "file" };
}

export async function listStoredPageVisits(limit = 50): Promise<StoredPageVisit[]> {
  const db = getDb();
  if (db) {
    const rows = await db.select().from(pageVisits).orderBy(desc(pageVisits.createdAt)).limit(limit);
    return rows.map((r) => ({
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      path: r.path,
      sessionId: r.sessionId,
      city: r.city,
      region: r.region,
      country: r.country,
      countryCode: r.countryCode,
      referrer: r.referrer,
    }));
  }
  return fileListPageVisits(limit);
}

export async function countStoredPageVisits(): Promise<number> {
  const db = getDb();
  if (db) {
    const rows = await db.select({ value: count() }).from(pageVisits);
    return Number(rows[0]?.value ?? 0);
  }
  return fileCountPageVisits();
}

export async function countStoredUniqueVisitors(): Promise<number> {
  const db = getDb();
  if (db) {
    const rows = await db
      .select({ value: sql<number>`count(distinct ${pageVisits.sessionId})` })
      .from(pageVisits);
    return Number(rows[0]?.value ?? 0);
  }
  return fileCountUniqueVisitors();
}

export async function topStoredVisitLocations(limit = 8): Promise<{ label: string; count: number }[]> {
  const db = getDb();
  if (db) {
    const rows = await db
      .select({
        city: pageVisits.city,
        country: pageVisits.country,
        value: count(),
      })
      .from(pageVisits)
      .groupBy(pageVisits.city, pageVisits.country)
      .orderBy(desc(count()))
      .limit(limit);

    return rows.map((r) => {
      const city = r.city?.trim();
      const country = r.country?.trim();
      const label = city && country ? `${city}, ${country}` : country || city || "Unknown";
      return { label, count: Number(r.value ?? 0) };
    });
  }
  return fileTopVisitLocations(limit);
}

export { getStorageMode };
