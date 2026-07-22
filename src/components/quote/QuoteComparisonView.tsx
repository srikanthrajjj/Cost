import { useState, useMemo, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Trophy,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  FileText,
  MessageCircle,
  Download,
  BarChart3,
  Target,
  Zap,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  Wrench,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Star,
  Share2,
} from "lucide-react";
import {
  getComparisonQuotes,
  clearComparisonQuotes,
  type SavedQuote,
} from "@/lib/quote/comparison-store";
import type { QuoteAnalysisResult } from "@/lib/quote";
import { EmailDownloadModal } from "@/components/EmailDownloadModal";
import {
  QuoteFeedbackCard,
  QuoteFeedbackMobileCta,
  QuoteFeedbackSidebarCta,
} from "@/components/quote/QuoteFeedbackCard";
import {
  buildComparisonReportHtml,
  ComparisonAIChatPanel,
  computeComparisonScores,
  getBestComparisonIndex,
  printComparisonReport,
  toComparisonScoreSummary,
} from "@/components/quote/ComparisonExtras";
import { subscribeToNewsletter } from "@/lib/email/subscribe";
import { createComparisonShare } from "@/lib/quote/comparison-share";

interface QuoteComparisonViewProps {
  selectedIds: string[];
  onBack: () => void;
  /** When set, render these quotes instead of reading sessionStorage */
  quotesOverride?: SavedQuote[];
  /** Shared /r/:id view: reuse current URL for share, show visitor CTA */
  isSharedView?: boolean;
}

function valueBadgeColor(badge: string): string {
  if (badge === "Best value" || badge === "Great deal") {
    return "bg-accent/10 text-accent border-accent/20";
  }
  if (badge === "Overpriced") return "bg-red-50 text-red-600 border-red-200";
  return "bg-blue-50 text-blue-600 border-blue-200";
}

function getHealthGrade(score: number) {
  if (score >= 85)
    return {
      label: "Excellent",
      color: "text-accent",
      bg: "bg-accent/10",
      ring: "ring-accent/20",
    };
  if (score >= 70)
    return {
      label: "Good",
      color: "text-blue-600",
      bg: "bg-blue-50",
      ring: "ring-blue-200",
    };
  if (score >= 50)
    return {
      label: "Fair",
      color: "text-amber-600",
      bg: "bg-amber-50",
      ring: "ring-amber-200",
    };
  return {
    label: "Needs review",
    color: "text-red-600",
    bg: "bg-red-50",
    ring: "ring-red-200",
  };
}

// ── Line Item Merging ───────────────────────────────────────────────────────

interface FlatLineItem {
  name: string;
  type: "material" | "scope";
  quantity: number;
  unit: string;
  price: number;
}

function flattenItems(result: QuoteAnalysisResult): FlatLineItem[] {
  const items: FlatLineItem[] = [];
  for (const m of result.extraction.materials) {
    items.push({
      name: m.name,
      type: "material",
      quantity: m.quantity,
      unit: m.unit,
      price: m.totalPrice,
    });
  }
  for (const s of result.extraction.scopeItems) {
    items.push({
      name: s.name,
      type: "scope",
      quantity: s.quantity,
      unit: s.unit,
      price: s.totalPrice,
    });
  }
  return items;
}

interface MergedRow {
  label: string;
  type: "material" | "scope";
  prices: (number | null)[];
  isBest: boolean[];
  difference: number | null;
  hasDifference: boolean;
}

function mergeItems(quotes: SavedQuote[]): MergedRow[] {
  const allItemNames = new Map<string, FlatLineItem[]>();
  const itemLists = quotes.map((q) => flattenItems(q.result));

  for (let i = 0; i < quotes.length; i++) {
    for (const item of itemLists[i]) {
      const normalized = item.name.toLowerCase().trim();
      if (!allItemNames.has(normalized)) allItemNames.set(normalized, []);
      allItemNames.get(normalized)!.push(item);
    }
  }

  const rows: MergedRow[] = [];

  for (const [normalized, items] of allItemNames) {
    const displayName = items[0]?.name || normalized;
    const itemType = items[0]?.type || "material";
    const prices = quotes.map((_, idx) => {
      const match = itemLists[idx]?.find((i) => i.name.toLowerCase().trim() === normalized);
      return match ? match.price : null;
    });
    const validPrices = prices.filter((p): p is number => p !== null);
    const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;
    const isBest = prices.map(
      (p) =>
        p !== null &&
        p === minPrice &&
        minPrice !== null &&
        validPrices.filter((v) => v === minPrice).length === 1,
    );
    const spread =
      validPrices.length >= 2 ? Math.max(...validPrices) - Math.min(...validPrices) : null;
    const difference = spread !== null && spread > 0 ? spread : null;
    const hasDifference = difference !== null;

    rows.push({
      label: displayName,
      type: itemType,
      prices,
      isBest,
      difference,
      hasDifference,
    });
  }

  return rows.sort((a, b) => {
    if (a.type !== b.type) return a.type === "material" ? -1 : 1;
    return a.label.localeCompare(b.label);
  });
}

// ── Missing Scope Grouping ──────────────────────────────────────────────────

interface GroupedMissing {
  common: { title: string; explanation: string }[];
  perQuote: { quoteIdx: number; items: { title: string; explanation: string }[] }[];
}

function groupMissing(quotes: SavedQuote[]): GroupedMissing {
  const allMissing = quotes.map((q) => q.result.analysis.missingScope);
  const commonSet = new Set<string>();
  const perQuoteMap = new Map<number, Set<string>>();

  // Find common items (appear in ALL quotes)
  if (allMissing.length >= 2) {
    const firstMissing = allMissing[0].map((m) => m.title.toLowerCase().trim());
    const secondMissing = allMissing[1].map((m) => m.title.toLowerCase().trim());

    for (const title of firstMissing) {
      if (secondMissing.includes(title)) commonSet.add(title);
    }
  }

  const common: { title: string; explanation: string }[] = [];
  const perQuote: {
    quoteIdx: number;
    items: { title: string; explanation: string }[];
  }[] = [];

  for (let qi = 0; qi < allMissing.length; qi++) {
    const unique: { title: string; explanation: string }[] = [];
    for (const m of allMissing[qi]) {
      const norm = m.title.toLowerCase().trim();
      if (commonSet.has(norm)) {
        if (qi === 0) {
          common.push({ title: m.title, explanation: m.explanation });
        }
      } else {
        unique.push({ title: m.title, explanation: m.explanation });
      }
    }
    if (unique.length > 0) {
      perQuote.push({ quoteIdx: qi, items: unique });
    }
  }

  return { common, perQuote };
}

// ── Animated Counter Hook ───────────────────────────────────────────────────

function useAnimatedValue(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = value;
    const from = fromRef.current;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}

// ── Circular Score Component ────────────────────────────────────────────────

function CircularScore({
  score,
  size = 64,
  strokeWidth = 5,
  label,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "#03A44D" : score >= 60 ? "#3b82f6" : score >= 40 ? "#d97706" : "#dc2626";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border/60"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-ink leading-none">{score}</span>
        {label && <span className="text-[8px] text-muted-foreground mt-0.5">{label}</span>}
      </div>
    </div>
  );
}

// ── Risk Badge Component ────────────────────────────────────────────────────

function RiskBadge({ level }: { level: "Low" | "Medium" | "High" }) {
  const config = {
    Low: {
      icon: ShieldCheck,
      color: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/20",
    },
    Medium: {
      icon: Shield,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    High: {
      icon: ShieldAlert,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
  };
  const c = config[level];
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${c.bg} ${c.color} border ${c.border}`}
    >
      <Icon className="h-3 w-3" />
      {level} risk
    </span>
  );
}

// ── Filter Tabs ─────────────────────────────────────────────────────────────

type FilterType = "differences" | "missing" | "redflags" | "all";

function FilterTabs({
  active,
  onChange,
  counts,
}: {
  active: FilterType;
  onChange: (f: FilterType) => void;
  counts: Record<FilterType, number>;
}) {
  const tabs: { key: FilterType; label: string }[] = [
    { key: "differences", label: "Only differences" },
    { key: "all", label: "Show all" },
    { key: "missing", label: "Missing items" },
    { key: "redflags", label: "Red flags" },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
            active === t.key
              ? "bg-ink text-white shadow-sm"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-ink"
          }`}
        >
          {t.label}
          {counts[t.key] > 0 && (
            <span
              className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
                active === t.key ? "bg-white/20 text-white" : "bg-border text-muted-foreground"
              }`}
            >
              {counts[t.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export function QuoteComparisonView({
  selectedIds,
  onBack,
  quotesOverride,
  isSharedView = false,
}: QuoteComparisonViewProps) {
  const quotes =
    quotesOverride ?? getComparisonQuotes().filter((q) => selectedIds.includes(q.id));
  const [filter, setFilter] = useState<FilterType>("differences");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareCreating, setShareCreating] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (isSharedView && typeof window !== "undefined") {
      setShareLink(window.location.href.split("?")[0]);
    }
  }, [isSharedView]);

  const scores = useMemo(() => computeComparisonScores(quotes), [quotes]);
  const bestIdx = useMemo(() => getBestComparisonIndex(scores), [scores]);
  const rows = useMemo(() => mergeItems(quotes), [quotes]);
  const groupedMissing = useMemo(() => groupMissing(quotes), [quotes]);
  const analysisKey = useMemo(
    () => `compare:${selectedIds.slice().sort().join("|")}`,
    [selectedIds],
  );

  const animatedSavings = useAnimatedValue(
    scores.length > 0
      ? Math.abs(
          scores
            .filter((s) => s.savingsVsOther > 0)
            .reduce((max, s) => Math.max(max, s.savingsVsOther), 0),
        )
      : 0,
  );

  if (quotes.length < 2) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No quotes selected for comparison.</p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted/50 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Go back
          </button>
        </div>
      </div>
    );
  }

  const best = scores[bestIdx];
  const bestQuote = quotes[bestIdx];
  const bestExtraction = bestQuote.result.extraction;
  const bestAnalysis = bestQuote.result.analysis;
  const allRedFlags = quotes.map((q) => q.result.analysis.redFlags);
  const maxPrice = Math.max(...quotes.map((q) => q.result.extraction.totalPrice));
  const avgPrice = quotes.reduce((s, q) => s + q.result.extraction.totalPrice, 0) / quotes.length;

  const handleEmailDownload = async (email: string) => {
    setIsDownloading(true);
    try {
      subscribeToNewsletter({ data: { email, source: "quote-comparison-download" } }).catch(
        () => {},
      );
      const html = buildComparisonReportHtml({
        quotes,
        scores,
        bestIdx,
      });
      printComparisonReport(html);
    } finally {
      setIsDownloading(false);
    }
  };

  const ensureShareLink = async (): Promise<string | null> => {
    if (shareLink) return shareLink;
    if (isSharedView) {
      const url = window.location.href.split("?")[0];
      setShareLink(url);
      return url;
    }
    setShareCreating(true);
    setShareError(null);
    try {
      const saved = await createComparisonShare({
        data: {
          quotes,
          projectType: bestExtraction.projectType || undefined,
          recommendedContractor: bestExtraction.contractor || undefined,
        },
      });
      const url = `${window.location.origin}/r/${saved.id}`;
      setShareLink(url);
      return url;
    } catch (error) {
      console.error("[comparison-share] failed:", error);
      setShareError("Could not create a share link. Try again, or use download instead.");
      return null;
    } finally {
      setShareCreating(false);
    }
  };

  const openShareModal = async () => {
    setShowShareModal(true);
    setShareCopied(false);
    await ensureShareLink();
  };

  const copyShareLink = async () => {
    const url = await ensureShareLink();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      setShareError("Could not copy. Select the link and copy manually.");
    }
  };

  // Filter counts
  const diffRows = rows.filter((r) => r.hasDifference);
  const filterCounts: Record<FilterType, number> = {
    differences: diffRows.length,
    all: rows.length,
    missing:
      groupedMissing.common.length +
      groupedMissing.perQuote.reduce((s, p) => s + p.items.length, 0),
    redflags: allRedFlags.reduce((s, f) => s + f.length, 0),
  };

  // Apply filter to rows
  const visibleRows =
    filter === "differences" ? rows.filter((r) => r.hasDifference) : filter === "all" ? rows : [];

  // Generate AI insights
  const insights: string[] = [];
  const quoteWord = quotes.length === 2 ? "the other quote" : "the highest quote";
  if (best.savingsVsOther > 0) {
    insights.push(
      `${bestQuote.result.extraction.contractor || "The recommended quote"} saves you $${best.savingsVsOther.toLocaleString()} compared to ${quoteWord}.`,
    );
  }
  if (bestExtraction.totalPrice < avgPrice) {
    insights.push(
      `This quote is ${Math.abs(best.marketDiffPercent)}% ${best.marketDiff > 0 ? "below" : "above"} the average of your ${quotes.length} quotes.`,
    );
  }
  const overpricedIdx = scores.findIndex((s) => s.valueBadge === "Overpriced");
  if (overpricedIdx >= 0) {
    const overQ = quotes[overpricedIdx];
    insights.push(
      `${overQ.result.extraction.contractor || "One quote"} appears overpriced relative to scope and market benchmarks.`,
    );
  }
  if (bestAnalysis.redFlags.length === 0) {
    insights.push("The recommended quote has no red flags.");
  }
  if (best.completeness >= 80) {
    insights.push("Scope completeness is strong at " + best.completeness + "%.");
  }
  const negotiationAmount = Math.abs(best.savingsVsOther);
  if (negotiationAmount > 500) {
    insights.push(
      `Potential negotiation opportunity: up to $${negotiationAmount.toLocaleString()} based on price differences.`,
    );
  }

  // Generate questions per quote
  function getQuestionsForQuote(qIdx: number): string[] {
    const q = quotes[qIdx];
    const e = q.result.extraction;
    const a = q.result.analysis;
    const s = scores[qIdx];
    const questions: string[] = [];

    if (s.valueBadge === "Overpriced") {
      const cheaper = quotes.find((_, i) => i !== qIdx && scores[i].composite > s.composite);
      if (cheaper) {
        const diff = cheaper.result.extraction.totalPrice - e.totalPrice;
        if (diff > 0) {
          questions.push(
            `Your quote is $${Math.abs(diff).toLocaleString()} higher. Can you match or explain the difference?`,
          );
        }
      }
    }

    if (a.missingScope.length > 0) {
      const topMissing = a.missingScope[0];
      questions.push(`Why isn't "${topMissing.title}" included in your scope?`);
    }

    if (e.warranties.length === 0) {
      questions.push("What warranty do you provide on workmanship and materials?");
    }

    if (e.permits.length === 0) {
      questions.push("Are permit costs included in your quote?");
    }

    for (const flag of a.redFlags.slice(0, 2)) {
      questions.push(`Regarding "${flag.title}": ${flag.recommendation}`);
    }

    return questions.slice(0, 4);
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-lg hover:bg-muted/50 flex items-center justify-center transition"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-bold text-ink hidden sm:inline">AI comparison</span>
              <span className="text-xs text-muted-foreground">{quotes.length} quotes</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-ink hover:bg-muted/50 transition"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </button>
            <button
              type="button"
              onClick={() => void openShareModal()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-ink hover:bg-muted/50 transition"
            >
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition shadow-sm shadow-accent/20"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Ask AI
            </button>
            {isSharedView ? (
              <a
                href="/quote-analyzer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-ink hover:bg-muted/50 transition"
              >
                Analyze my quotes
              </a>
            ) : (
              <button
                onClick={() => {
                  clearComparisonQuotes();
                  onBack();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted/50 transition"
              >
                <X className="h-3.5 w-3.5" /> Start over
              </button>
            )}
          </div>
        </div>
      </header>

      {isSharedView && (
        <div className="border-b border-border bg-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-ink">
              You are viewing a shared CostReno comparison. Want the same clarity on your quotes?
            </p>
            <a
              href="/quote-analyzer"
              className="inline-flex self-start items-center justify-center px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent/90"
            >
              Compare my quotes free
            </a>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        {/* Page Title */}
        <div className="mb-8 max-w-2xl">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink mb-2">
            Which quote should you choose?
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our AI compared pricing, materials, labor, warranties, permits, and project scope to
            help you choose the best contractor.
          </p>
        </div>

        {/* ── AI Recommendation Card ─────────────────────────────── */}
        <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.03] to-white p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Trophy className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-accent uppercase tracking-wider">
                AI recommendation
              </p>
              <h2 className="font-display text-xl md:text-2xl font-bold text-ink mt-1">
                {bestExtraction.contractor || "Recommended contractor"}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl bg-white border border-border p-4 text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                AI score
              </p>
              <p className="text-3xl font-bold text-ink">{best.composite}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">/100</p>
            </div>
            <div className="rounded-xl bg-white border border-border p-4 text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Confidence
              </p>
              <p className="text-3xl font-bold text-ink">
                {Math.round(bestExtraction.confidence * 100)}%
              </p>
            </div>
            <div className="rounded-xl bg-white border border-border p-4 text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Estimated savings
              </p>
              <p className="text-3xl font-bold text-accent">${animatedSavings.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-white border border-border p-4 text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Total price
              </p>
              <p className="text-3xl font-bold text-ink">
                ${bestExtraction.totalPrice.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Why this quote */}
          {best.reasons.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-ink mb-2">Why this quote?</p>
              <div className="flex flex-wrap gap-2">
                {best.reasons.map((reason) => (
                  <span
                    key={reason}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/5 border border-accent/10 text-xs font-medium text-accent"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick summary */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            Based on our analysis of scope completeness, pricing, red flags, and coverage,{" "}
            {bestExtraction.contractor || "this contractor"} offers the best overall value for your
            project.
          </p>
        </div>

        {/* ── Contractor Cards ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {quotes.map((q, idx) => {
            const e = q.result.extraction;
            const s = scores[idx];
            const grade = getHealthGrade(s.completeness);
            const isBest = idx === bestIdx;

            return (
              <div
                key={q.id}
                className={`rounded-2xl bg-white p-5 md:p-6 transition-all duration-200 ${
                  isBest
                    ? "border-2 border-accent/30 shadow-md ring-1 ring-accent/10"
                    : "border border-border shadow-sm hover:shadow-md"
                }`}
              >
                {isBest && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wider">
                      <Trophy className="h-3 w-3" /> Recommended
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base text-ink">
                      {e.contractor || "Contractor " + (idx + 1)}
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mt-0.5">
                      {e.projectType}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${valueBadgeColor(s.valueBadge)}`}
                  >
                    {s.valueBadge}
                  </span>
                </div>

                <p className="text-3xl font-bold text-ink mb-4">${e.totalPrice.toLocaleString()}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <CircularScore score={s.composite} size={72} strokeWidth={6} label="score" />
                  </div>
                  <div className="text-center">
                    <CircularScore
                      score={s.qualityScore}
                      size={72}
                      strokeWidth={6}
                      label="quality"
                    />
                  </div>
                  <div className="text-center">
                    <RiskBadge level={s.riskLevel} />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Scope completeness</span>
                    <span className="font-semibold text-ink">{s.completeness}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-700"
                      style={{ width: `${s.completeness}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="flex items-center gap-1.5">
                    {e.warranties.length > 0 ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-red-400" />
                    )}
                    <span
                      className={e.warranties.length > 0 ? "text-ink" : "text-muted-foreground"}
                    >
                      Warranty
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {e.permits.length > 0 ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-red-400" />
                    )}
                    <span className={e.permits.length > 0 ? "text-ink" : "text-muted-foreground"}>
                      Permits ({e.permits.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {allRedFlags[idx].length === 0 ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                    )}
                    <span className={allRedFlags[idx].length === 0 ? "text-ink" : "text-red-600"}>
                      {allRedFlags[idx].length === 0
                        ? "No red flags"
                        : `${allRedFlags[idx].length} red flag${allRedFlags[idx].length > 1 ? "s" : ""}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-ink">
                      {e.materials.length + e.scopeItems.length} items
                    </span>
                  </div>
                </div>

                {s.savingsVsOther !== 0 && (
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                      s.savingsVsOther > 0 ? "bg-accent/5 text-accent" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {s.savingsVsOther > 0 ? (
                      <TrendingDown className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingUp className="h-3.5 w-3.5" />
                    )}
                    {s.savingsVsOther > 0
                      ? `$${s.savingsVsOther.toLocaleString()} cheaper`
                      : `$${Math.abs(s.savingsVsOther).toLocaleString()} more expensive`}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Savings Visualization ──────────────────────────────── */}
        <div className="rounded-2xl bg-white border border-border p-6 mb-8">
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink mb-5">
            <DollarSign className="h-4 w-4 text-accent" />
            Savings at a glance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Potential savings
              </p>
              <p className="text-4xl font-bold text-accent">${animatedSavings.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                by choosing {bestExtraction.contractor || "the recommended quote"}
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Percent cheaper
              </p>
              <p className="text-4xl font-bold text-ink">
                {best.savingsPercent > 0 ? best.savingsPercent : 0}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">than the other quote</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Price comparison
              </p>
              <div className="space-y-3">
                {quotes.map((q, idx) => {
                  const price = q.result.extraction.totalPrice;
                  const pct = maxPrice > 0 ? (price / maxPrice) * 100 : 0;
                  const isBestPrice = idx === bestIdx;
                  return (
                    <div key={q.id}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-ink truncate max-w-[140px]">
                          {q.result.extraction.contractor || "Quote " + (idx + 1)}
                        </span>
                        <span className="font-bold text-ink">${price.toLocaleString()}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isBestPrice ? "bg-accent" : "bg-muted-foreground/30"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Market Comparison ──────────────────────────────────── */}
        <div className="rounded-2xl bg-white border border-border p-6 mb-8">
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink mb-5">
            <BarChart3 className="h-4 w-4 text-accent" />
            Market comparison
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-muted/30 border border-border">
              <div className="flex-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Market average
                </p>
                <p className="text-xl font-bold text-ink mt-0.5">
                  ${Math.round(avgPrice).toLocaleString()}
                </p>
              </div>
              <Target className="h-5 w-5 text-muted-foreground/40" />
            </div>
            {quotes.map((q, idx) => {
              const price = q.result.extraction.totalPrice;
              const diff = avgPrice - price;
              const diffPct = avgPrice > 0 ? Math.round((diff / avgPrice) * 100) : 0;
              const isBelow = diff > 0;
              return (
                <div
                  key={q.id}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink truncate">
                      {q.result.extraction.contractor || "Quote " + (idx + 1)}
                    </p>
                    <p className="text-lg font-bold text-ink mt-0.5">${price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isBelow ? "bg-accent/10 text-accent" : "bg-red-50 text-red-600"
                      }`}
                    >
                      {isBelow ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <TrendingUp className="h-3 w-3" />
                      )}
                      {Math.abs(diffPct)}% {isBelow ? "below" : "above"} market
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Line Item Comparison ───────────────────────────────── */}
        <div className="rounded-2xl bg-white border border-border p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
              <Wrench className="h-4 w-4 text-accent" />
              Line item breakdown
            </h3>
            <FilterTabs active={filter} onChange={setFilter} counts={filterCounts} />
          </div>

          {filter === "missing" ? (
            /* Missing items view */
            <div className="space-y-4">
              {groupedMissing.common.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-ink mb-3">Missing from both quotes</p>
                  <div className="space-y-2">
                    {groupedMissing.common.map((m) => (
                      <div
                        key={m.title}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/50 border border-amber-100"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-amber-700">{m.title}</p>
                          <p className="text-[10px] text-amber-600/80 mt-0.5">{m.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {groupedMissing.perQuote.map((pq) => (
                <div key={pq.quoteIdx}>
                  <p className="text-xs font-bold text-ink mb-3">
                    Only missing from{" "}
                    {quotes[pq.quoteIdx].result.extraction.contractor ||
                      "Quote " + (pq.quoteIdx + 1)}
                  </p>
                  <div className="space-y-2">
                    {pq.items.map((m) => (
                      <div
                        key={m.title}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/50 border border-amber-100"
                      >
                        <Search className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-amber-700">{m.title}</p>
                          <p className="text-[10px] text-amber-600/80 mt-0.5">{m.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {groupedMissing.common.length === 0 && groupedMissing.perQuote.length === 0 && (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No missing scope items detected in either quote.
                </p>
              )}
            </div>
          ) : filter === "redflags" ? (
            /* Red flags view */
            <div className="space-y-4">
              {allRedFlags.every((f) => f.length === 0) ? (
                <div className="text-center py-8">
                  <ShieldCheck className="h-8 w-8 text-accent mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No red flags detected in either quote.
                  </p>
                </div>
              ) : (
                quotes.map((q, idx) => {
                  const flags = allRedFlags[idx];
                  if (flags.length === 0) return null;
                  return (
                    <div key={q.id}>
                      <p className="text-xs font-bold text-ink mb-2">
                        {q.result.extraction.contractor || "Quote " + (idx + 1)}{" "}
                        <span className="text-red-500">({flags.length})</span>
                      </p>
                      <div className="space-y-2">
                        {flags.map((f) => (
                          <div
                            key={f.id}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/50 border border-red-100"
                          >
                            <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-red-700">{f.title}</p>
                              <p className="text-[10px] text-red-600/80 mt-0.5">{f.explanation}</p>
                              {f.recommendation && (
                                <p className="text-[10px] text-red-500 mt-1 italic">
                                  {f.recommendation}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Table view (differences or all) */
            <div className="overflow-x-auto -mx-6 px-6">
              <div className="min-w-[500px]">
                {/* Table header */}
                <div
                  className="grid gap-3 px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border mb-1"
                  style={{
                    gridTemplateColumns: `1fr ${quotes.map(() => "1fr").join(" ")} auto`,
                  }}
                >
                  <span>Line item</span>
                  {quotes.map((q, idx) => (
                    <span key={q.id} className="text-right">
                      {q.result.extraction.contractor || "Quote " + (idx + 1)}
                    </span>
                  ))}
                  <span className="w-20 text-right">Diff</span>
                </div>

                {/* Rows */}
                {visibleRows.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-8 text-center">
                    No differences found. Try "Show all" to see every line item.
                  </p>
                ) : (
                  visibleRows.map((row) => (
                    <div
                      key={row.label}
                      className={`grid gap-3 px-4 py-3 rounded-xl text-sm transition ${
                        row.hasDifference ? "bg-accent/[0.02]" : "hover:bg-muted/20"
                      }`}
                      style={{
                        gridTemplateColumns: `1fr ${quotes.map(() => "1fr").join(" ")} auto`,
                      }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="truncate text-ink font-medium text-xs">{row.label}</span>
                        <span
                          className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            row.type === "material"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-purple-50 text-purple-600"
                          }`}
                        >
                          {row.type === "material" ? "M" : "S"}
                        </span>
                      </div>
                      {row.prices.map((price, idx) => {
                        const validPrices = row.prices.filter((p): p is number => p !== null);
                        const avgPrice = validPrices.length > 0 ? validPrices.reduce((a, b) => a + b, 0) / validPrices.length : 0;
                        const isFair = price !== null && Math.abs(price - avgPrice) / avgPrice < 0.1;
                        const isBelow = price !== null && price < avgPrice * 0.9;
                        const isAbove = price !== null && price > avgPrice * 1.1;
                        
                        return (
                          <div key={idx} className="text-right flex flex-col items-end gap-0.5">
                            <div className="flex items-center justify-end gap-1.5">
                              <span
                                className={`text-xs ${
                                  row.isBest[idx]
                                    ? "font-bold text-accent"
                                    : price === null
                                      ? "text-muted-foreground/40"
                                      : "text-ink"
                                }`}
                              >
                                {price !== null ? `$${price.toLocaleString()}` : "—"}
                              </span>
                              {row.isBest[idx] && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                              )}
                            </div>
                            {price !== null && (
                              <span
                                className={`text-[9px] font-medium ${
                                  isFair ? "text-green-600" : isBelow ? "text-green-600" : isAbove ? "text-red-600" : "text-muted-foreground"
                                }`}
                              >
                                {isFair ? "Fair" : isBelow ? "Below avg" : isAbove ? "Above avg" : "—"}
                              </span>
                            )}
                          </div>
                        );
                      })}
                      <div className="w-20 text-right">
                        {row.difference !== null && row.difference > 0 ? (
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-[10px] font-bold text-amber-600">
                              ${row.difference.toLocaleString()}
                            </span>
                            {row.prices.some((p, i) => {
                              const validPrices = row.prices.filter((pr): pr is number => pr !== null);
                              const avgPrice = validPrices.length > 0 ? validPrices.reduce((a, b) => a + b, 0) / validPrices.length : 0;
                              return p !== null && p > avgPrice * 1.1;
                            }) && (
                              <span className="text-[9px] text-green-600 font-medium">
                                Save ${Math.round(row.difference * 0.5).toLocaleString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/40">—</span>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* Total row */}
                {visibleRows.length > 0 && (
                  <div
                    className="grid gap-3 px-4 py-3 rounded-xl bg-accent/5 border-t border-accent/20 mt-1 text-sm font-bold"
                    style={{
                      gridTemplateColumns: `1fr ${quotes.map(() => "1fr").join(" ")} auto`,
                    }}
                  >
                    <span className="text-ink text-xs">Total</span>
                    {quotes.map((q, idx) => {
                      const total = q.result.extraction.totalPrice;
                      const isBestTotal = idx === bestIdx;
                      return (
                        <div key={q.id} className="text-right">
                          <span className={`text-xs ${isBestTotal ? "text-accent" : "text-ink"}`}>
                            ${total.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                    <div className="w-20 text-right">
                      <span className="text-xs font-bold text-amber-600">
                        $
                        {Math.abs(
                          quotes[0].result.extraction.totalPrice -
                            quotes[1].result.extraction.totalPrice,
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── AI Insights ────────────────────────────────────────── */}
        <div className="rounded-2xl bg-white border border-border p-6 mb-8">
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink mb-4">
            <Sparkles className="h-4 w-4 text-accent" />
            AI insights
          </h3>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 rounded-xl bg-accent/[0.03] border border-accent/10"
              >
                <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-ink leading-relaxed">{insight}</p>
              </div>
            ))}
            {negotiationAmount > 500 && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-accent/5 border border-accent/20">
                <DollarSign className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-ink">Potential negotiation</p>
                  <p className="text-lg font-bold text-accent mt-0.5">
                    ${negotiationAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Questions to Ask ───────────────────────────────────── */}
        <div className="rounded-2xl bg-white border border-border p-6 mb-8">
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink mb-5">
            <MessageCircle className="h-4 w-4 text-accent" />
            Questions to ask each contractor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quotes.map((q, idx) => {
              const questions = getQuestionsForQuote(idx);
              if (questions.length === 0) return null;
              return (
                <div key={q.id}>
                  <p className="text-xs font-bold text-ink mb-3">
                    Ask {q.result.extraction.contractor || "Quote " + (idx + 1)}
                    {idx === bestIdx && (
                      <span className="ml-1.5 text-[9px] text-accent font-normal">
                        (recommended)
                      </span>
                    )}
                  </p>
                  <div className="space-y-2">
                    {questions.map((question, qi) => (
                      <div
                        key={qi}
                        className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-muted/30 border border-border"
                      >
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-xs text-ink leading-relaxed">{question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Scope Completeness ─────────────────────────────────── */}
        <div className="rounded-2xl bg-white border border-border p-6 mb-8">
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink mb-5">
            <Target className="h-4 w-4 text-accent" />
            Scope completeness
          </h3>
          <div className="space-y-6">
            {quotes.map((q, idx) => {
              const a = q.result.analysis;
              const s = scores[idx];
              const presentCount = a.presentItems.length;
              const missingCount = a.missingScope.length;
              const clarifyCount = a.needsClarification.length;
              const total = presentCount + missingCount + clarifyCount;
              const pct = total > 0 ? Math.round((presentCount / total) * 100) : s.completeness;

              return (
                <div key={q.id}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-ink">
                      {q.result.extraction.contractor || "Quote " + (idx + 1)}
                      {idx === bestIdx && (
                        <span className="ml-1.5 text-[9px] text-accent font-normal">
                          (recommended)
                        </span>
                      )}
                    </p>
                    <span className="text-xs font-bold text-ink">{pct}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted/50 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-accent" /> {presentCount} confirmed
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-500" /> {clarifyCount} needs detail
                    </span>
                    <span className="flex items-center gap-1">
                      <X className="h-3 w-3 text-red-400" /> {missingCount} missing
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Risk Score ─────────────────────────────────────────── */}
        <div className="rounded-2xl bg-white border border-border p-6 mb-8">
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink mb-5">
            <Shield className="h-4 w-4 text-accent" />
            Risk assessment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quotes.map((q, idx) => {
              const s = scores[idx];
              const a = q.result.analysis;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border p-5 ${
                    idx === bestIdx ? "border-accent/20 bg-accent/[0.02]" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-ink">
                      {q.result.extraction.contractor || "Quote " + (idx + 1)}
                    </p>
                    <RiskBadge level={s.riskLevel} />
                  </div>
                  <div className="flex items-center justify-center mb-4">
                    <CircularScore
                      score={Math.max(0, 100 - s.riskScore)}
                      size={80}
                      strokeWidth={6}
                      label="safety"
                    />
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Red flags</span>
                      <span
                        className={
                          a.redFlags.length === 0
                            ? "text-accent font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {a.redFlags.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Missing items</span>
                      <span
                        className={
                          a.missingScope.length === 0
                            ? "text-accent font-medium"
                            : "text-amber-600 font-medium"
                        }
                      >
                        {a.missingScope.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Warranty</span>
                      <span
                        className={
                          q.result.extraction.warranties.length > 0
                            ? "text-accent font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {q.result.extraction.warranties.length > 0 ? "Included" : "Not included"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Permits</span>
                      <span
                        className={
                          q.result.extraction.permits.length > 0
                            ? "text-accent font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {q.result.extraction.permits.length > 0
                          ? `${q.result.extraction.permits.length} listed`
                          : "Not listed"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Missing Scope (Grouped) ────────────────────────────── */}
        {(groupedMissing.common.length > 0 || groupedMissing.perQuote.length > 0) && (
          <div className="rounded-2xl bg-white border border-border p-6 mb-8">
            <h3 className="flex items-center gap-2 text-sm font-bold text-ink mb-5">
              <Search className="h-4 w-4 text-amber-500" />
              Missing scope items
            </h3>

            {groupedMissing.common.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold text-ink mb-3">Missing from both quotes</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {groupedMissing.common.map((m) => (
                    <div
                      key={m.title}
                      className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-50/50 border border-amber-100"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-amber-700">{m.title}</p>
                        <p className="text-[10px] text-amber-600/80 mt-0.5 line-clamp-2">
                          {m.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {groupedMissing.perQuote.map((pq) => (
              <div key={pq.quoteIdx} className="mb-4 last:mb-0">
                <p className="text-xs font-bold text-ink mb-3">
                  Only missing from{" "}
                  {quotes[pq.quoteIdx].result.extraction.contractor || "Quote " + (pq.quoteIdx + 1)}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {pq.items.map((m) => (
                    <div
                      key={m.title}
                      className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-50/50 border border-amber-100"
                    >
                      <Search className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-amber-700">{m.title}</p>
                        <p className="text-[10px] text-amber-600/80 mt-0.5 line-clamp-2">
                          {m.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Download & CTA ─────────────────────────────────────── */}
        <div className="rounded-2xl bg-gradient-to-br from-[#082A4B] to-[#0a3660] p-6 md:p-8 text-center">
          <h3 className="font-display text-lg md:text-xl font-bold text-white mb-2">
            Ready to make a decision?
          </h3>
          <p className="text-sm text-white/60 mb-6 max-w-md mx-auto">
            Save this comparison, ask a follow-up question, or go back to upload different bids.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white text-sm font-bold hover:bg-accent/90 transition shadow-lg shadow-accent/20"
            >
              <Download className="h-4 w-4" /> Download comparison
            </button>
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition border border-white/10"
            >
              <MessageCircle className="h-4 w-4" /> Ask AI about these quotes
            </button>
            <button
              onClick={() => {
                clearComparisonQuotes();
                onBack();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition border border-white/10"
            >
              <ArrowLeft className="h-4 w-4" /> Compare new quotes
            </button>
          </div>
        </div>

        {/* ── Disclaimer ─────────────────────────────────────────── */}
        <div className="mt-8 px-4 py-5 rounded-xl bg-muted/30 border border-border">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground/70">Disclaimer:</span> CostReno uses
            artificial intelligence to analyze contractor quotes. AI-generated insights are provided
            for informational purposes only and may contain inaccuracies, omissions, or
            misinterpretations. Always verify pricing, scope, permits, licensing, and insurance
            requirements directly with your contractor and relevant local authorities before making
            any hiring or payment decisions. CostReno is not a licensed contractor, engineer, or
            legal advisor and does not guarantee the accuracy of any analysis. Use of this tool does
            not constitute professional advice. CostReno assumes no liability for any decisions made
            or actions taken based on the information provided through this comparison.
          </p>
        </div>
      </div>

      {!chatOpen && (
        <>
          <div className="fixed bottom-24 right-5 z-40 lg:bottom-6 lg:right-6 flex flex-col items-end gap-3">
            <div className="hidden lg:block w-[220px]">
              <QuoteFeedbackSidebarCta
                onOpen={() => setFeedbackOpen(true)}
                submitted={feedbackSubmitted}
              />
              <div className="mt-3 rounded-xl border-2 border-accent bg-white p-3 shadow-lg">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-xs font-bold text-accent">CostReno AI</span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-2.5">
                  Ask which quote is stronger and what to negotiate.
                </p>
                <button
                  type="button"
                  onClick={() => setChatOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 transition"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Ask AI
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="lg:hidden w-14 h-14 rounded-full bg-accent shadow-lg shadow-accent/30 flex items-center justify-center text-white hover:scale-105 transition-transform"
              aria-label="Ask AI"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
          </div>
          <QuoteFeedbackMobileCta
            onOpen={() => setFeedbackOpen(true)}
            submitted={feedbackSubmitted}
          />
        </>
      )}

      {chatOpen && (
        <ComparisonAIChatPanel
          quotes={quotes}
          scores={toComparisonScoreSummary(scores)}
          bestIdx={bestIdx}
          onClose={() => setChatOpen(false)}
        />
      )}

      <EmailDownloadModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailDownload}
        reportName="Quote comparison"
        isLoading={isDownloading}
      />

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white border border-border p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-ink">Share comparison</h3>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-muted-foreground hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Send a link to this full comparison. Anyone with the link can view it (no PDF needed).
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={
                    shareCreating
                      ? "Creating link…"
                      : shareLink || "Link will appear here"
                  }
                  className="flex-1 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground bg-muted/30"
                />
                <button
                  type="button"
                  onClick={() => void copyShareLink()}
                  disabled={shareCreating || (!shareLink && !isSharedView)}
                  className="px-3 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent/90 disabled:opacity-50"
                >
                  {shareCopied ? "Copied" : "Copy"}
                </button>
              </div>
              {shareError && <p className="text-xs text-red-600">{shareError}</p>}
              <div className="flex gap-2">
                <a
                  href={
                    shareLink
                      ? `https://wa.me/?text=${encodeURIComponent(`Here's our CostReno quote comparison: ${shareLink}`)}`
                      : undefined
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!shareLink) e.preventDefault();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 ${!shareLink ? "pointer-events-none opacity-50" : ""}`}
                >
                  <Share2 className="h-3.5 w-3.5" /> WhatsApp
                </a>
                <a
                  href={
                    shareLink
                      ? `mailto:?subject=${encodeURIComponent("CostReno quote comparison")}&body=${encodeURIComponent(`Here's our CostReno quote comparison: ${shareLink}`)}`
                      : undefined
                  }
                  onClick={(e) => {
                    if (!shareLink) e.preventDefault();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 ${!shareLink ? "pointer-events-none opacity-50" : ""}`}
                >
                  <Share2 className="h-3.5 w-3.5" /> Email
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                Links expire after 90 days. Original quote files are not included.
              </p>
            </div>
          </div>
        </div>
      )}

      <QuoteFeedbackCard
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        projectType={bestExtraction.projectType}
        contractor={bestExtraction.contractor}
        completenessScore={bestAnalysis.summary.completenessScore}
        analysisKey={analysisKey}
        submitted={feedbackSubmitted}
        onSubmitted={() => setFeedbackSubmitted(true)}
      />
    </div>
  );
}
