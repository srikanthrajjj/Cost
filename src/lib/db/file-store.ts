import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export interface StoredQuoteUpload {
  id: string;
  createdAt: string;
  fileName?: string | null;
  fileType?: string | null;
  fileSize?: number | null;
  rawText: string;
  projectType?: string | null;
  contractor?: string | null;
  totalPrice?: number | null;
  completenessScore?: number | null;
  lineItemCount?: number | null;
  missingCount?: number | null;
  clarificationCount?: number | null;
  redFlagCount?: number | null;
  analysisSummary?: unknown;
  source?: string | null;
}

export interface StoredQuoteFeedback {
  id: string;
  createdAt: string;
  quoteUploadId?: string | null;
  accuracy?: string | null;
  understandable?: string | null;
  useAgain?: string | null;
  comment?: string | null;
  projectType?: string | null;
  contractor?: string | null;
  completenessScore?: number | null;
}

interface FileStoreShape {
  quoteUploads: StoredQuoteUpload[];
  quoteFeedback: StoredQuoteFeedback[];
  comparisonReports: StoredComparisonReport[];
}

export interface StoredComparisonReport {
  id: string;
  createdAt: string;
  snapshot: unknown;
  quoteCount: number;
  projectType?: string | null;
  recommendedContractor?: string | null;
  source?: string | null;
  expiresAt?: string | null;
}

const EMPTY_STORE: FileStoreShape = {
  quoteUploads: [],
  quoteFeedback: [],
  comparisonReports: [],
};

function storePath() {
  return path.join(process.cwd(), "data", "costreno-store.json");
}

async function ensureStore(): Promise<FileStoreShape> {
  const file = storePath();
  await mkdir(path.dirname(file), { recursive: true });
  try {
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as FileStoreShape;
    return {
      quoteUploads: Array.isArray(parsed.quoteUploads) ? parsed.quoteUploads : [],
      quoteFeedback: Array.isArray(parsed.quoteFeedback) ? parsed.quoteFeedback : [],
      comparisonReports: Array.isArray(parsed.comparisonReports) ? parsed.comparisonReports : [],
    };
  } catch {
    await writeFile(file, JSON.stringify(EMPTY_STORE, null, 2), "utf8");
    return {
      ...EMPTY_STORE,
      quoteUploads: [],
      quoteFeedback: [],
      comparisonReports: [],
    };
  }
}

async function writeStore(store: FileStoreShape) {
  const file = storePath();
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(store, null, 2), "utf8");
}

export async function fileSaveQuoteUpload(
  row: StoredQuoteUpload,
): Promise<StoredQuoteUpload> {
  const store = await ensureStore();
  store.quoteUploads.unshift(row);
  // Keep local file from growing without bound during development
  store.quoteUploads = store.quoteUploads.slice(0, 500);
  await writeStore(store);
  return row;
}

export async function fileSaveQuoteFeedback(
  row: StoredQuoteFeedback,
): Promise<StoredQuoteFeedback> {
  const store = await ensureStore();
  store.quoteFeedback.unshift(row);
  store.quoteFeedback = store.quoteFeedback.slice(0, 1000);
  await writeStore(store);
  return row;
}

export async function fileListQuoteUploads(limit = 50): Promise<StoredQuoteUpload[]> {
  const store = await ensureStore();
  return store.quoteUploads.slice(0, limit);
}

export async function fileListQuoteFeedback(limit = 50): Promise<StoredQuoteFeedback[]> {
  const store = await ensureStore();
  return store.quoteFeedback.slice(0, limit);
}

export async function fileSaveComparisonReport(
  row: StoredComparisonReport,
): Promise<StoredComparisonReport> {
  const store = await ensureStore();
  store.comparisonReports.unshift(row);
  store.comparisonReports = store.comparisonReports.slice(0, 300);
  await writeStore(store);
  return row;
}

export async function fileGetComparisonReport(
  id: string,
): Promise<StoredComparisonReport | null> {
  const store = await ensureStore();
  return store.comparisonReports.find((r) => r.id === id) ?? null;
}
