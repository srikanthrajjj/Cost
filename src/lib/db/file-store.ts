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
  actualPaid?: number | null;
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
  amountPaid?: number | null;
  comment?: string | null;
  projectType?: string | null;
  contractor?: string | null;
  completenessScore?: number | null;
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

export interface StoredPageVisit {
  id: string;
  createdAt: string;
  path: string;
  sessionId: string;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  countryCode?: string | null;
  referrer?: string | null;
}

interface FileStoreShape {
  quoteUploads: StoredQuoteUpload[];
  quoteFeedback: StoredQuoteFeedback[];
  comparisonReports: StoredComparisonReport[];
  pageVisits: StoredPageVisit[];
}

const EMPTY_STORE: FileStoreShape = {
  quoteUploads: [],
  quoteFeedback: [],
  comparisonReports: [],
  pageVisits: [],
};

/** In-memory fallback when the filesystem is read-only (e.g. Vercel /var/task). */
let memoryStore: FileStoreShape | null = null;
let useMemoryOnly = false;

function isServerlessRuntime() {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.NETLIFY,
  );
}

function storePath() {
  // Vercel/Lambda only allow writes under /tmp
  if (isServerlessRuntime()) {
    return path.join("/tmp", "costreno-data", "costreno-store.json");
  }
  return path.join(process.cwd(), "data", "costreno-store.json");
}

function cloneEmptyStore(): FileStoreShape {
  return {
    quoteUploads: [],
    quoteFeedback: [],
    comparisonReports: [],
    pageVisits: [],
  };
}

async function ensureStore(): Promise<FileStoreShape> {
  if (useMemoryOnly && memoryStore) {
    return memoryStore;
  }

  const file = storePath();
  try {
    await mkdir(path.dirname(file), { recursive: true });
    try {
      const raw = await readFile(file, "utf8");
      const parsed = JSON.parse(raw) as FileStoreShape;
      const store: FileStoreShape = {
        quoteUploads: Array.isArray(parsed.quoteUploads) ? parsed.quoteUploads : [],
        quoteFeedback: Array.isArray(parsed.quoteFeedback) ? parsed.quoteFeedback : [],
        comparisonReports: Array.isArray(parsed.comparisonReports) ? parsed.comparisonReports : [],
        pageVisits: Array.isArray(parsed.pageVisits) ? parsed.pageVisits : [],
      };
      memoryStore = store;
      return store;
    } catch {
      const empty = cloneEmptyStore();
      try {
        await writeFile(file, JSON.stringify(EMPTY_STORE, null, 2), "utf8");
      } catch {
        // Writable path unavailable — stay in memory
        useMemoryOnly = true;
      }
      memoryStore = empty;
      return empty;
    }
  } catch {
    // Read-only filesystem (common on Vercel without /tmp access edge cases)
    useMemoryOnly = true;
    memoryStore = memoryStore ?? cloneEmptyStore();
    return memoryStore;
  }
}

async function writeStore(store: FileStoreShape) {
  memoryStore = store;
  if (useMemoryOnly) return;

  const file = storePath();
  try {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(store, null, 2), "utf8");
  } catch {
    useMemoryOnly = true;
  }
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

export async function fileUpdateQuoteUpload(
  row: StoredQuoteUpload,
): Promise<StoredQuoteUpload> {
  const store = await ensureStore();
  const index = store.quoteUploads.findIndex((entry) => entry.id === row.id);
  if (index === -1) {
    store.quoteUploads.unshift(row);
  } else {
    store.quoteUploads[index] = row;
  }
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

export async function fileCountQuoteUploads(): Promise<number> {
  const store = await ensureStore();
  return store.quoteUploads.length;
}

export async function fileCountQuoteFeedback(): Promise<number> {
  const store = await ensureStore();
  return store.quoteFeedback.length;
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

export async function fileSavePageVisit(row: StoredPageVisit): Promise<StoredPageVisit> {
  const store = await ensureStore();
  store.pageVisits.unshift(row);
  store.pageVisits = store.pageVisits.slice(0, 5000);
  await writeStore(store);
  return row;
}

export async function fileListPageVisits(limit = 50): Promise<StoredPageVisit[]> {
  const store = await ensureStore();
  return store.pageVisits.slice(0, limit);
}

export async function fileCountPageVisits(): Promise<number> {
  const store = await ensureStore();
  return store.pageVisits.length;
}

export async function fileCountUniqueVisitors(): Promise<number> {
  const store = await ensureStore();
  return new Set(store.pageVisits.map((v) => v.sessionId).filter(Boolean)).size;
}

export async function fileTopVisitLocations(limit = 8): Promise<
  { label: string; count: number }[]
> {
  const store = await ensureStore();
  const counts = new Map<string, number>();
  for (const visit of store.pageVisits) {
    const city = visit.city?.trim();
    const country = visit.country?.trim();
    const label = city && country ? `${city}, ${country}` : country || city || "Unknown";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
