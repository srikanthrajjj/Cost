import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  BarChart3,
  FileText,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  RefreshCw,
  Shield,
} from "lucide-react";
import { getAdminDashboardStats, verifyAdminPassword } from "@/lib/db/admin";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin | CostReno" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Internal CostReno admin dashboard." },
    ],
  }),
});

const SESSION_KEY = "costreno_admin_password";

type DashboardStats = Awaited<ReturnType<typeof getAdminDashboardStats>>;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function AdminPage() {
  const [password, setPassword] = useState("");
  const [authedPassword, setAuthedPassword] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const loadStats = async (pwd: string) => {
    setIsLoadingStats(true);
    setStatsError(null);
    try {
      const data = await getAdminDashboardStats({
        data: { password: pwd, recentLimit: 8 },
      });
      setStats(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load admin stats.";
      setStatsError(message);
      if (/invalid admin password/i.test(message)) {
        sessionStorage.removeItem(SESSION_KEY);
        setAuthedPassword(null);
        setStats(null);
      }
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (!saved) return;
    setAuthedPassword(saved);
    void loadStats(saved);
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await verifyAdminPassword({ data: { password } });
      sessionStorage.setItem(SESSION_KEY, password);
      setAuthedPassword(password);
      setPassword("");
      await loadStats(password);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed.";
      setLoginError(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthedPassword(null);
    setStats(null);
    setStatsError(null);
    setLoginError(null);
  };

  if (!authedPassword) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#082A4B] flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-ink">Admin</h1>
              <p className="text-xs text-muted-foreground">CostReno internal dashboard</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <label className="block">
              <span className="text-xs font-semibold text-ink">Password</span>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full h-11 rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="Enter admin password"
                />
              </div>
            </label>
            {loginError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={isLoggingIn || !password.trim()}
              className="w-full h-11 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition disabled:opacity-50"
            >
              {isLoggingIn ? "Checking..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <header className="border-b border-border bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#082A4B] flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold text-ink">Admin dashboard</h1>
              <p className="text-[11px] text-muted-foreground">
                Storage: {stats?.storage ?? "…"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void loadStats(authedPassword)}
              disabled={isLoadingStats}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-xs font-semibold text-ink hover:bg-muted/40 transition disabled:opacity-50"
            >
              {isLoadingStats ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted/40 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {statsError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {statsError}
          </p>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            icon={FileText}
            label="Quotes processed"
            value={stats?.quotesProcessed}
            loading={isLoadingStats && !stats}
          />
          <MetricCard
            icon={MessageSquare}
            label="Feedback received"
            value={stats?.feedbackReceived}
            loading={isLoadingStats && !stats}
          />
          <MetricCard
            icon={Mail}
            label="Waitlist emails"
            value={stats?.waitlistEmails}
            loading={isLoadingStats && !stats}
            footnote={stats?.waitlistError ?? undefined}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="text-sm font-bold text-ink mb-4">Recent quotes</h2>
            {!stats?.recentQuotes?.length ? (
              <p className="text-sm text-muted-foreground">No quotes yet.</p>
            ) : (
              <ul className="space-y-3">
                {stats.recentQuotes.map((q) => (
                  <li
                    key={q.id}
                    className="rounded-xl border border-border/70 px-3 py-2.5 text-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink truncate">
                          {q.contractor || q.fileName || "Untitled quote"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {q.projectType || "Unknown project"}
                          {typeof q.completenessScore === "number"
                            ? ` · Score ${Math.round(q.completenessScore)}`
                            : ""}
                        </p>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {formatDate(q.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="text-sm font-bold text-ink mb-4">Recent feedback</h2>
            {!stats?.recentFeedback?.length ? (
              <p className="text-sm text-muted-foreground">No feedback yet.</p>
            ) : (
              <ul className="space-y-3">
                {stats.recentFeedback.map((f) => (
                  <li
                    key={f.id}
                    className="rounded-xl border border-border/70 px-3 py-2.5 text-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">
                          {f.accuracy || "—"} accuracy · use again {f.useAgain || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {f.comment || f.projectType || "No comment"}
                        </p>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {formatDate(f.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  loading,
  footnote,
}: {
  icon: typeof FileText;
  label: string;
  value: number | null | undefined;
  loading?: boolean;
  footnote?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-accent" />
        </div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="font-display text-3xl font-bold text-ink">
        {loading ? "…" : value == null ? "—" : value.toLocaleString()}
      </p>
      {footnote && <p className="mt-2 text-[11px] text-amber-700 leading-snug">{footnote}</p>}
    </div>
  );
}
