import { desc } from "drizzle-orm";
import { getDb, getStorageMode } from "./client";
import { quoteFeedback, quoteUploads } from "./schema";
import {
  fileListQuoteFeedback,
  fileListQuoteUploads,
  fileSaveQuoteFeedback,
  fileSaveQuoteUpload,
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
  comment?: string;
  projectType?: string;
  contractor?: string;
  completenessScore?: number;
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
      comment: row.comment,
      projectType: row.projectType,
      contractor: row.contractor,
      completenessScore: row.completenessScore,
    });
    return { id, storage: "postgres" };
  }

  await fileSaveQuoteFeedback(row);
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
      comment: r.comment,
      projectType: r.projectType,
      contractor: r.contractor,
      completenessScore: r.completenessScore,
    }));
  }
  return fileListQuoteFeedback(limit);
}

export { getStorageMode };
