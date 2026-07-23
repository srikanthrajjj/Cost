/** Client + server helpers to limit free advanced-report AI usage during early access. */

export const ADVANCED_REPORT_SESSION_LIMIT = 8;
const CLIENT_KEY = "costreno_advanced_report_runs";

export function getAdvancedReportSessionId(): string {
  try {
    const existing = localStorage.getItem("costreno_visitor_id");
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("costreno_visitor_id", id);
    return id;
  } catch {
    return `v_${Date.now()}`;
  }
}

export function getClientAdvancedReportCount(): number {
  try {
    const raw = sessionStorage.getItem(CLIENT_KEY);
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function canRunAdvancedReportClient(): { ok: true } | { ok: false; message: string } {
  const count = getClientAdvancedReportCount();
  if (count >= ADVANCED_REPORT_SESSION_LIMIT) {
    return {
      ok: false,
      message: `You've reached the early-access limit of ${ADVANCED_REPORT_SESSION_LIMIT} advanced reports in this browser session. Try again later, or upload fewer quotes.`,
    };
  }
  return { ok: true };
}

export function recordClientAdvancedReportRun(): void {
  try {
    const next = getClientAdvancedReportCount() + 1;
    sessionStorage.setItem(CLIENT_KEY, String(next));
  } catch {
    // ignore
  }
}

type Bucket = { count: number; resetAt: number };

const serverBuckets = new Map<string, Bucket>();
const SERVER_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const SERVER_LIMIT = 20;

export function assertServerAdvancedReportAllowed(sessionId?: string): void {
  const key = (sessionId || "anonymous").slice(0, 80);
  const now = Date.now();
  const existing = serverBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    serverBuckets.set(key, { count: 1, resetAt: now + SERVER_WINDOW_MS });
    return;
  }

  if (existing.count >= SERVER_LIMIT) {
    throw new Error(
      "Too many advanced reports from this session. Please wait a bit and try again.",
    );
  }

  existing.count += 1;
  serverBuckets.set(key, existing);

  // Soft cleanup to avoid unbounded growth in long-lived processes
  if (serverBuckets.size > 5000) {
    for (const [k, v] of serverBuckets) {
      if (v.resetAt <= now) serverBuckets.delete(k);
    }
  }
}
