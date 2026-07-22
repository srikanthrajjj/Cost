import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback, lazy, Suspense } from "react";
import {
  Upload,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Sparkles,
  X,
  Clock,
  DollarSign,
  Search,
  ArrowRight,
  Zap,
  Lock,
  GitCompare,
  Trophy,
} from "lucide-react";
import { type QuoteAnalysisResult, type QuotePipelineStage } from "@/lib/quote";
import { friendlyOpenRouterMessage } from "@/lib/quote/openrouter-client";
import { serverAnalyzeQuoteFull } from "@/lib/quote/quote-server";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import {
  addComparisonQuote,
  clearComparisonQuotes,
} from "@/lib/quote/comparison-store";
import {
  clearSavedQuoteProgress,
  getQuoteFollowUpAction,
  getSavedQuoteProgress,
  saveQuoteProgress,
  type SavedQuoteProgress,
} from "@/lib/quote/progress-store";
import { QuoteFeedbackCard, QuoteFeedbackMobileCta } from "@/components/quote/QuoteFeedbackCard";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

const QuoteComparisonView = lazy(() =>
  import("@/components/quote/QuoteComparisonView").then((m) => ({
    default: m.QuoteComparisonView,
  })),
);

const CompleteView = lazy(() =>
  import("@/components/quote/QuoteAnalyzerComplete").then((m) => ({
    default: m.CompleteView,
  })),
);

export const Route = createFileRoute("/quote-analyzer")({
  head: () => ({
    meta: [
      { title: "Compare contractor quotes (up to 3) | CostReno" },
      {
        name: "description",
        content:
          "Upload up to 3 contractor quotes and get a simple side-by-side review. See which bid looks strongest on price, completeness, and red flags. Free, no signup.",
      },
      {
        name: "keywords",
        content:
          "compare contractor quotes, quote analyzer, contractor bid comparison, roofing quote review, renovation quote analysis, side by side quote comparison",
      },
      {
        property: "og:title",
        content: "Compare contractor quotes (up to 3) | CostReno",
      },
      {
        property: "og:description",
        content:
          "Upload 1 to 3 contractor quotes. Get a clear recommendation with price, missing scope, and red-flag checks.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://costreno.com/quote-analyzer" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Compare contractor quotes (up to 3) | CostReno",
      },
      {
        name: "twitter:description",
        content:
          "Upload up to 3 bids and see which quote looks strongest before you hire.",
      },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://costreno.com/quote-analyzer" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How many quotes can I compare?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "You can upload up to 3 contractor quotes at once. One quote gets a detailed review. Two or three quotes get a side-by-side comparison with a clear recommendation.",
              },
            },
            {
              "@type": "Question",
              name: "How does the contractor quote analyzer work?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Upload PDF or photo quotes. Our AI reads line items, checks common scope gaps and pricing red flags, then shows a simple summary you can use before hiring.",
              },
            },
            {
              "@type": "Question",
              name: "Is the quote analyzer free to use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. It is free to use with no signup required for a standard review.",
              },
            },
            {
              "@type": "Question",
              name: "What types of contractor quotes can I analyze?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "You can analyze home improvement quotes such as roofing, kitchen remodeling, bathroom renovation, HVAC, windows, flooring, and related projects.",
              },
            },
            {
              "@type": "Question",
              name: "Is my contractor quote kept private?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Your files are processed for analysis and are not shared with contractors. Use CostReno only for quotes you are authorized to review.",
              },
            },
            {
              "@type": "Question",
              name: "Why compare three quotes?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Three written quotes help you see market range and scope differences. CostReno highlights the strongest option based on completeness, risk signals, and price context.",
              },
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "CostReno quote analyzer",
          url: "https://costreno.com/quote-analyzer",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description:
            "Free AI tool to review one contractor quote or compare up to three bids side by side.",
        }),
      },
    ],
  }),
  component: QuoteAnalyzerPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────
type AnalysisState = "idle" | "processing" | "complete" | "error";

interface ScopeCard {
  name: string;
  status: "present" | "clarification" | "missing";
  matchedAs?: string;
  question?: string;
  description?: string;
  recommendation?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PROCESSING_TIPS = [
  "💡 Tip: Always get 3 quotes minimum before committing to a contractor.",
  "💡 40% of roofing quotes omit critical items like drip edge or ice shield.",
  "💡 A good contractor warranty should be 5-10 years on workmanship.",
  "💡 Ask if permit costs are included. They often aren't.",
  "💡 Material quality accounts for 44% of your total project cost.",
  "💡 Check contractor licensing at your state's licensing board website.",
  "💡 Insurance may cover storm damage. Document everything with photos.",
  '💡 "Cost-plus" contracts can spiral. Always prefer fixed-price quotes.',
];

const STAGE_LABELS: Record<QuotePipelineStage | "reading", { label: string; icon: string }> = {
  reading: { label: "Reading your document", icon: "📄" },
  extracting: { label: "Extracting line items with AI", icon: "🔍" },
  matching: { label: "Cross-referencing knowledge base", icon: "🏠" },
  analyzing: { label: "Classifying scope & detecting gaps", icon: "⚡" },
  reporting: { label: "Generating your report", icon: "📝" },
};

/** Soft ceilings so progress keeps moving within each stage, but never hits 100% until done */
const STAGE_PROGRESS_CEILING: Record<string, number> = {
  reading: 14,
  extracting: 42,
  matching: 58,
  analyzing: 82,
  reporting: 95,
};

/** Map a 0-100 stage percent into overall progress across N quotes. */
function mapStageToOverall(
  stagePercent: number,
  batchCurrent: number,
  batchTotal: number,
): number {
  const total = Math.max(1, batchTotal);
  const current = Math.min(Math.max(1, batchCurrent), total);
  const span = 100 / total;
  const base = (current - 1) * span;
  return Math.min(99.5, Math.round((base + (stagePercent / 100) * span) * 10) / 10);
}

// ─── Main Page Component ──────────────────────────────────────────────────────
function QuoteAnalyzerPage() {
  const [state, setState] = useState<AnalysisState>("idle");
  const [result, setResult] = useState<QuoteAnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const [processingStage, setProcessingStage] = useState<string>("reading");
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [tipIdx, setTipIdx] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<
    "overview" | "explorer" | "questions" | "timeline"
  >("overview");
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [quoteSlots, setQuoteSlots] = useState<(File | null)[]>([null, null, null]);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [savedProgress, setSavedProgress] = useState<SavedQuoteProgress | null>(null);
  const [batchProgress, setBatchProgress] = useState<{
    current: number;
    total: number;
    name: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const stageTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const batchRef = useRef({ current: 1, total: 1 });

  const MAX_QUOTE_SLOTS = 3;
  const MAX_FILE_BYTES = 15 * 1024 * 1024;
  const selectedFiles = quoteSlots.filter((f): f is File => Boolean(f));
  const filledCount = selectedFiles.length;

  const isAllowedFile = (file: File) => {
    const name = file.name.toLowerCase();
    const okType =
      file.type === "application/pdf" ||
      file.type.startsWith("image/") ||
      name.endsWith(".pdf") ||
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg") ||
      name.endsWith(".png");
    return okType && file.size > 0 && file.size <= MAX_FILE_BYTES;
  };

  const setSlotFile = useCallback((slotIndex: number, file: File | null) => {
    setQuoteSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = file;
      return next;
    });
    setError("");
  }, []);

  const addFilesToSlots = useCallback(
    (incoming: FileList | File[], startSlot?: number) => {
      const allowed = Array.from(incoming).filter(isAllowedFile);
      if (allowed.length === 0) {
        setError("Please choose PDF, JPG, or PNG files under 15MB.");
        return;
      }

      setQuoteSlots((prev) => {
        const next = [...prev];
        let fileIdx = 0;

        if (typeof startSlot === "number" && startSlot >= 0 && startSlot < MAX_QUOTE_SLOTS) {
          if (!next[startSlot] && allowed[fileIdx]) {
            next[startSlot] = allowed[fileIdx++];
          } else if (allowed[fileIdx]) {
            next[startSlot] = allowed[fileIdx++];
          }
        }

        for (let slot = 0; slot < MAX_QUOTE_SLOTS && fileIdx < allowed.length; slot++) {
          if (!next[slot]) {
            next[slot] = allowed[fileIdx++];
          }
        }
        return next;
      });
      setError("");
    },
    [],
  );

  const openSlotPicker = (slotIndex: number) => {
    setActiveSlot(slotIndex);
    fileInputRef.current?.click();
  };

  const clearStageTimers = () => {
    stageTimersRef.current.forEach(clearTimeout);
    stageTimersRef.current = [];
  };

  // Load analysis from sessionStorage if available (from chat flow)
  useEffect(() => {
    try {
      const lastSaved = getSavedQuoteProgress();
      if (lastSaved) {
        setSavedProgress(lastSaved);
      }

      const stored = sessionStorage.getItem("costreno_quote_analysis");
      if (stored) {
        const parsed = JSON.parse(stored) as QuoteAnalysisResult;
        if (parsed && parsed.analysis && parsed.extraction) {
          const saved = saveQuoteProgress(parsed);
          setResult(parsed);
          setSavedProgress(saved);
          setState("complete");
          sessionStorage.removeItem("costreno_quote_analysis");
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Rotate tips during processing
  useEffect(() => {
    if (state !== "processing") return;
    const interval = setInterval(() => setTipIdx((p) => (p + 1) % PROCESSING_TIPS.length), 5000);
    return () => clearInterval(interval);
  }, [state]);

  // Gradually advance overall progress toward the current stage ceiling (batched across quotes)
  useEffect(() => {
    if (state !== "processing") return;

    const interval = setInterval(() => {
      const { current, total } = batchRef.current;
      const stageCeiling = STAGE_PROGRESS_CEILING[processingStage] ?? 95;
      const overallCeiling = mapStageToOverall(stageCeiling, current, total);

      setProcessingProgress((prev) => {
        if (prev >= overallCeiling) return prev;
        const remaining = overallCeiling - prev;
        const increment = Math.max(0.15, remaining * 0.06);
        return Math.min(overallCeiling, Math.round((prev + increment) * 10) / 10);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [state, processingStage]);

  // Auto-dismiss error toast after 8 seconds
  useEffect(() => {
    if (!error) return;
    const timeout = setTimeout(() => setError(""), 8000);
    return () => clearTimeout(timeout);
  }, [error]);

  const analyzeSingleFile = async (file: File): Promise<QuoteAnalysisResult> => {
    const { extractTextFromFile } = await import("@/lib/file-processor");
    const extracted = await extractTextFromFile(file);

    if (extracted.text.length < 10) {
      throw new Error(
        `Could not extract text from ${file.name}. Try a different PDF or a clearer photo.`,
      );
    }

    setProcessingStage("extracting");
    setProcessingProgress((p) => {
      const floor = mapStageToOverall(12, batchRef.current.current, batchRef.current.total);
      return Math.max(p, floor);
    });

    const combinedText = `Analyze this contractor quote:\n\n${extracted.text}`;

    clearStageTimers();
    stageTimersRef.current = [
      setTimeout(() => setProcessingStage("matching"), 6000),
      setTimeout(() => setProcessingStage("analyzing"), 14000),
      setTimeout(() => setProcessingStage("reporting"), 28000),
    ];

    return serverAnalyzeQuoteFull({
      data: {
        rawText: combinedText,
        fileName: file.name,
        fileType: file.type || undefined,
        fileSize: file.size,
        source: "quote-analyzer",
      },
    });
  };

  const handleAnalyzeSelected = async () => {
    if (selectedFiles.length === 0) return;

    clearStageTimers();
    setState("processing");
    setError("");
    setResult(null);
    setProcessingProgress(0);
    setProcessingStage("reading");
    setFeedbackOpen(false);
    setFeedbackSubmitted(false);
    setShowCompare(false);
    setCompareIds([]);
    setBatchProgress(null);
    batchRef.current = { current: 1, total: selectedFiles.length };

    try {
      if (selectedFiles.length === 1) {
        setBatchProgress({ current: 1, total: 1, name: selectedFiles[0].name });
        batchRef.current = { current: 1, total: 1 };
        const analysis = await analyzeSingleFile(selectedFiles[0]);
        const saved = saveQuoteProgress(analysis);
        clearStageTimers();
        setProcessingStage("reporting");
        setProcessingProgress(100);
        setResult(analysis);
        setSavedProgress(saved);
        setQuoteSlots([null, null, null]);
        setBatchProgress(null);
        setState("complete");
        return;
      }

      clearComparisonQuotes();
      const savedIds: string[] = [];
      let lastAnalysis: QuoteAnalysisResult | null = null;
      const total = selectedFiles.length;

      for (let i = 0; i < total; i++) {
        const file = selectedFiles[i];
        batchRef.current = { current: i + 1, total };
        setBatchProgress({
          current: i + 1,
          total,
          name: file.name,
        });
        setProcessingStage("reading");
        setProcessingProgress(mapStageToOverall(0, i + 1, total));

        const analysis = await analyzeSingleFile(file);
        const saved = addComparisonQuote(analysis);
        savedIds.push(saved.id);
        lastAnalysis = analysis;

        setProcessingProgress(mapStageToOverall(100, i + 1, total));
      }

      clearStageTimers();
      setProcessingStage("reporting");
      setProcessingProgress(100);
      if (lastAnalysis) {
        const saved = saveQuoteProgress(lastAnalysis);
        setSavedProgress(saved);
        setResult(lastAnalysis);
      }
      setQuoteSlots([null, null, null]);
      setBatchProgress(null);
      setCompareIds(savedIds);
      setShowCompare(true);
      setState("complete");
    } catch (err) {
      clearStageTimers();
      setBatchProgress(null);
      setError(friendlyOpenRouterMessage(err));
      setState("error");
    } finally {
      abortRef.current = null;
    }
  };

  const clearAllSlots = () => setQuoteSlots([null, null, null]);

  // Cancel not supported in server function mode
  const handleCancel = () => {};

  const reset = () => {
    clearStageTimers();
    setSavedProgress(getSavedQuoteProgress());
    setState("idle");
    setResult(null);
    setError("");
    setProcessingProgress(0);
    setProcessingStage("reading");
    setActiveTab("overview");
    setQuoteSlots([null, null, null]);
    setBatchProgress(null);
    setShowCompare(false);
    setCompareIds([]);
  };

  const handleResumeSavedProgress = () => {
    const latest = getSavedQuoteProgress();
    if (!latest) return;
    clearStageTimers();
    setSavedProgress(latest);
    setResult(latest.result);
    setState("complete");
    setError("");
    setProcessingProgress(0);
    setProcessingStage("reading");
    setActiveTab("overview");
    setSelectedRow(null);
    setExpandedRow(null);
    setShowCompare(false);
    setCompareIds([]);
    setQuoteSlots([null, null, null]);
    setBatchProgress(null);
  };

  const handleEmailSubmit = async (email: string) => {
    if (!result || !result.analysis) {
      throw new Error("No analysis data available");
    }
    setIsDownloading(true);
    try {
      const { analysis, extraction } = result;

      // Subscribe to newsletter (fire and forget)
      subscribeToNewsletter({ data: { email, source: "quote-download" } }).catch(() => {});

      await submitEmailAndDownload({
        filename: `quote-analysis-${new Date().getTime()}.html`,
        email,
        reportType: "analysis",
        data: {
          score: analysis.summary.completenessScore,
          missingItems: analysis.missingScope.length,
          clarificationItems: analysis.needsClarification.length,
          redFlags: analysis.redFlags.length,
          contractor: extraction.contractor,
          totalPrice: extraction.totalPrice,
          projectType: extraction.projectType,
          missingScope: analysis.missingScope,
          needsClarification: analysis.needsClarification,
          redFlagsList: analysis.redFlags,
          lineItems: extraction.scopeItems || [],
          summary: analysis.summary?.toString() || "",
        },
      });
    } catch (error) {
      console.error("Download failed:", error);
      throw error;
    } finally {
      setIsDownloading(false);
    }
  };

  // ─── IDLE STATE: Upload Interface ───────────────────────────────────────────
  if (state === "idle" || state === "error") {
    const lastAnalysis = savedProgress?.result.analysis ?? null;
    const lastExtraction = savedProgress?.result.extraction ?? null;
    const followUp = savedProgress ? getQuoteFollowUpAction(savedProgress) : null;
    const savedAtLabel = savedProgress
      ? new Date(savedProgress.savedAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "";

    return (
      <div className="min-h-screen bg-[#f7f8fa]">
        {/* Error Toast */}
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 w-full max-w-md px-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-red-200 shadow-lg shadow-red-100/50">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">Analysis failed</p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="shrink-0 w-6 h-6 rounded-full hover:bg-muted/50 flex items-center justify-center transition"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <SiteNav active="quote" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16">
          {savedProgress && lastAnalysis && lastExtraction && followUp && (
            <div className="max-w-4xl mx-auto mb-6 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[11px] font-semibold text-primary">Welcome back</span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold text-ink">Your last quote analysis is saved</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {lastExtraction.contractor || "Your contractor quote"} ·{" "}
                    {lastExtraction.projectType || "Project quote"} · Score{" "}
                    {lastAnalysis.summary.completenessScore}/100
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Last updated {savedAtLabel}</p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleResumeSavedProgress}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/95 transition"
                  >
                    Open last analysis
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearSavedQuoteProgress();
                      setSavedProgress(null);
                    }}
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-muted transition"
                  >
                    Clear saved progress
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-[10px] font-medium text-muted-foreground">Missing items</p>
                  <p className="mt-1 text-lg font-bold text-ink">{lastAnalysis.missingScope.length}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-[10px] font-medium text-muted-foreground">Needs clarification</p>
                  <p className="mt-1 text-lg font-bold text-ink">
                    {lastAnalysis.needsClarification.length}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-[10px] font-medium text-muted-foreground">Red flags</p>
                  <p className="mt-1 text-lg font-bold text-ink">{lastAnalysis.redFlags.length}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-[10px] font-medium text-muted-foreground">Checklist saved</p>
                  <p className="mt-1 text-lg font-bold text-ink">
                    {savedProgress.completedChecklistIds.length}
                  </p>
                </div>
              </div>

              <div
                className={`mt-4 flex items-start gap-3 rounded-xl border p-4 ${
                  followUp.tone === "urgent"
                    ? "border-red-200 bg-red-50/60"
                    : followUp.tone === "review"
                      ? "border-amber-200 bg-amber-50/60"
                      : "border-accent/20 bg-accent/5"
                }`}
              >
                {followUp.tone === "urgent" ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                ) : followUp.tone === "review" ? (
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                ) : (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                )}
                <div>
                  <p className="text-sm font-semibold text-ink">{followUp.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{followUp.detail}</p>
                </div>
              </div>
            </div>
          )}

          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <GitCompare className="h-3 w-3 text-accent" />
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                Compare up to 3 quotes
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink leading-[1.1] tracking-tight">
              Which contractor quote should you pick?
            </h1>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Add your bids below. We check price, missing items, and red flags, then show a plain
              English recommendation. One quote works too if you only have a single bid.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-5">
              {[
                { icon: Zap, label: "About 30 seconds per quote" },
                { icon: Lock, label: "Private and secure" },
                { icon: CheckCircle2, label: "No signup required" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3-slot uploader */}
          <div className="rounded-2xl border border-border bg-white p-5 sm:p-8 shadow-sm">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) {
                  addFilesToSlots(e.target.files, activeSlot);
                }
                e.target.value = "";
              }}
            />

            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="text-left">
                <p className="text-sm font-bold text-ink">Your quotes</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  PDF, JPG, or PNG · Max 15MB each · Up to 3 bids
                </p>
              </div>
              {filledCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllSlots}
                  className="text-xs text-muted-foreground hover:text-ink transition"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quoteSlots.map((file, index) => {
                const label = `Quote ${index + 1}`;
                const hint =
                  index === 0 ? "Required to start" : index === 1 ? "Add to compare" : "Best practice";
                return (
                  <div
                    key={label}
                    className={`rounded-xl border-2 border-dashed p-4 min-h-[168px] flex flex-col transition ${
                      file
                        ? "border-primary/30 bg-primary/[0.03]"
                        : "border-border hover:border-primary/40 bg-muted/20"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files?.length) {
                        addFilesToSlots(e.dataTransfer.files, index);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-bold text-ink">{label}</p>
                        <p className="text-[10px] text-muted-foreground">{hint}</p>
                      </div>
                      {file ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-accent">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Empty
                        </span>
                      )}
                    </div>

                    {file ? (
                      <div className="mt-auto space-y-3">
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-ink truncate">{file.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {(file.size / (1024 * 1024)).toFixed(1)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openSlotPicker(index)}
                            className="flex-1 rounded-lg border border-border bg-white px-2 py-2 text-xs font-semibold text-ink hover:bg-muted transition"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => setSlotFile(index, null)}
                            className="rounded-lg border border-border bg-white px-2 py-2 text-xs font-semibold text-muted-foreground hover:text-ink hover:bg-muted transition"
                            aria-label={`Remove ${label}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openSlotPicker(index)}
                        className="mt-auto w-full rounded-lg border border-border bg-white px-3 py-3 text-sm font-semibold text-ink hover:border-primary/40 hover:bg-white transition"
                      >
                        <span className="inline-flex items-center justify-center gap-2">
                          <Upload className="h-4 w-4 text-primary" />
                          Add quote
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleAnalyzeSelected}
                disabled={filledCount === 0}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition shadow-sm shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent"
              >
                <Sparkles className="h-4 w-4" />
                {filledCount === 0
                  ? "Add at least one quote"
                  : filledCount === 1
                    ? "Review this quote"
                    : `Compare my ${filledCount} quotes`}
              </button>
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                {filledCount < 2
                  ? "Tip: add a second and third quote for a clearer recommendation."
                  : filledCount === 2
                    ? "Nice. Add a third quote if you have one. Three bids give the clearest picture."
                    : "Great. We'll rank all three and explain which looks strongest."}
              </p>
            </div>
          </div>

          {/* How compare works */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Add your bids",
                desc: "Drop Quote 1, 2, and 3 into the slots. One file is enough to start.",
              },
              {
                step: "2",
                title: "We review each quote",
                desc: "AI checks line items, missing scope, warranties, permits, and red flags.",
              },
              {
                step: "3",
                title: "See the easy answer",
                desc: "Get a recommended quote plus a simple scorecard you can understand in seconds.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-border bg-white p-5">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center mb-3">
                  {item.step}
                </div>
                <p className="text-sm font-bold text-ink">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* What you'll get */}
          <div className="mt-16 pt-12 border-t border-border">
            <h2 className="font-display text-2xl font-bold text-ink text-center mb-8">
              What you'll get
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Trophy,
                  title: "Clear recommendation",
                  desc: "See which quote looks strongest overall",
                },
                {
                  icon: DollarSign,
                  title: "Price context",
                  desc: "Spot bids that look high or unusually low",
                },
                {
                  icon: AlertTriangle,
                  title: "Red flags",
                  desc: "Catch vague terms and risky gaps",
                },
                {
                  icon: Search,
                  title: "Missing scope",
                  desc: "Find items that should usually be included",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-white p-5 text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/8 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <p className="text-sm font-bold text-ink">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CostReno vs Others - Simplified */}
          <div className="mt-16 pt-12 border-t border-border">
            <h2 className="font-display text-2xl font-bold text-ink text-center mb-3">
              Why CostReno vs. Generic AI?
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-8 max-w-md mx-auto">
              Built specifically for contractor quotes. Not general chat.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {/* CostReno */}
              <div className="rounded-2xl border-2 border-accent/30 bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <img src="/logo.svg" alt="CostReno" style={{ height: "20px" }} />
                  <span className="px-2 py-0.5 rounded-full bg-accent text-white text-[9px] font-bold uppercase">
                    Best
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    "Trained on thousands of real quotes",
                    "Understands building codes & best practices",
                    "Detects overpriced line items",
                    "Gives negotiation points & next steps",
                    "Built for homeowners, not developers",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-xs text-ink">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Others */}
              <div className="rounded-2xl border border-border bg-white/60 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-bold text-ink">ChatGPT & Others</span>
                </div>
                <div className="space-y-3">
                  {[
                    "General knowledge, not quote-specific",
                    "May miss code requirements",
                    "No pricing intelligence",
                    "Generic suggestions only",
                    "You have to ask the right questions",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <X className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => openSlotPicker(filledCount < 3 ? filledCount : 0), 350);
              }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent text-white text-sm font-bold hover:bg-accent/90 transition shadow-sm shadow-accent/20"
            >
              <Upload className="h-4 w-4" /> Add your quotes
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              Free. No signup. Review one quote or compare up to three.
            </p>
          </div>

          {/* SEO: How It Works Section */}
          <section className="mt-20 pt-12 border-t border-border">
            <h2 className="font-display text-2xl font-bold text-ink text-center mb-3">
              How the quote analyzer works
            </h2>
            <p className="text-sm text-muted-foreground text-center max-w-lg mx-auto mb-10">
              Built for homeowners who want a clear answer before they hire.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Upload up to 3 quotes",
                  desc: "Add Quote 1, Quote 2, and Quote 3 as PDF or photos. One file is enough for a single review.",
                },
                {
                  step: "2",
                  title: "AI reviews every line",
                  desc: "We check line items, missing scope, warranties, permits, and common red flags.",
                },
                {
                  step: "3",
                  title: "Get a plain English answer",
                  desc: "See which bid looks strongest, why, and what questions to ask before you sign.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-bold text-sm flex items-center justify-center mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="text-sm font-bold text-ink mb-1.5">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SEO: Use Cases */}
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="font-display text-2xl font-bold text-ink text-center mb-8">
              Analyze Any Home Improvement Quote
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Roofing Quotes",
                "Kitchen Remodel Bids",
                "Bathroom Renovation Estimates",
                "HVAC Replacement Proposals",
                "Window Installation Quotes",
                "Solar Panel Estimates",
                "Painting Contractor Bids",
                "Flooring Installation Quotes",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 px-3 py-3 rounded-lg border border-border bg-white"
                >
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span className="text-xs font-medium text-ink">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SEO: FAQ Section with Schema-ready structure */}
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="font-display text-2xl font-bold text-ink text-center mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-muted-foreground text-center mb-8">
              Last updated: July 2026 · Pricing data refreshed monthly
            </p>
            <div className="max-w-2xl mx-auto space-y-3">
              {[
                {
                  q: "How many quotes can I compare at once?",
                  a: "Up to 3. Add Quote 1, Quote 2, and Quote 3 in the slots. One quote gets a detailed review. Two or three quotes get a side-by-side recommendation.",
                },
                {
                  q: "How does the contractor quote analyzer work?",
                  a: "Upload a PDF or photo of each bid. Our AI reads line items, looks for missing scope and red flags, then shows a simple summary you can use before hiring.",
                },
                {
                  q: "Is this free to use?",
                  a: "Yes. No signup and no credit card are required for a standard review.",
                },
                {
                  q: "What types of quotes can I analyze?",
                  a: "Home improvement bids such as roofing, kitchen, bathroom, HVAC, windows, flooring, and related projects.",
                },
                {
                  q: "Is my contractor quote kept private?",
                  a: "Your files are processed for analysis and are not shared with contractors. Only upload quotes you are authorized to review.",
                },
                {
                  q: "What if I only have one quote?",
                  a: "Upload Quote 1 only and choose Review this quote. You still get missing-scope and red-flag checks. Add more bids later for a clearer comparison.",
                },
                {
                  q: "Can I use this before signing a contract?",
                  a: "Yes. That is the best time. Review or compare bids before you sign so you can ask clearer questions and avoid incomplete scope.",
                },
              ].map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border border-border bg-white overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/20 transition">
                    <h3 className="text-sm font-semibold text-ink">{faq.q}</h3>
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform shrink-0 ml-3" />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* People Also Ask — Broader informational traffic */}
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="font-display text-2xl font-bold text-ink text-center mb-3">
              People Also Ask
            </h2>
            <p className="text-xs text-muted-foreground text-center mb-8">
              Common questions homeowners have about renovation costs and contractor quotes
            </p>
            <div className="max-w-2xl mx-auto space-y-3">
              {[
                {
                  q: "How much does a roof replacement cost in 2026?",
                  a: "The average roof replacement costs between $8,600 and $24,700 in 2026, with most homeowners paying around $16,650. Costs vary significantly based on roofing material (asphalt shingles vs. metal vs. tile), roof size, pitch complexity, and your geographic location. Labor costs alone can range from $4,000 to $10,000 depending on the market.",
                },
                {
                  q: "How much does a kitchen remodel cost?",
                  a: "A kitchen remodel typically costs between $25,000 and $75,000 in 2026, with the national average around $50,000. Minor cosmetic updates may cost $10,000–$15,000, while a full gut renovation with custom cabinets and appliances can exceed $100,000. The biggest cost drivers are cabinets (30-40%), labor (20-30%), and countertops (10-15%).",
                },
                {
                  q: "How do I know if my contractor quote is too high?",
                  a: "Compare your quote against the typical range for your project type and location. Get at least 3 quotes to establish a baseline. Watch for vague line items, unusually high markups on materials, or labor rates significantly above the local average. CostReno's AI analyzer can identify overpriced items instantly.",
                },
                {
                  q: "What should a contractor quote include?",
                  a: "A complete contractor quote should include: itemized materials with brand/model, labor costs broken down by task, permit fees, demolition and disposal costs, project timeline with start/end dates, payment schedule, warranty terms, change order process, and insurance/licensing information.",
                },
                {
                  q: "How many quotes should I get for a home renovation?",
                  a: "Get at least 3 quotes for any home improvement project over $5,000. For major renovations ($50,000+), consider getting 4-5 quotes. This helps you understand the market rate, evaluate different approaches, and identify contractors who may be cutting corners or overcharging.",
                },
                {
                  q: "What are common red flags in contractor quotes?",
                  a: "Watch for: requesting more than 30% upfront payment, no written warranty, vague material descriptions (e.g., 'standard grade'), missing permit costs, no timeline specified, price significantly lower than competitors (could mean cutting corners), and pressure to sign immediately.",
                },
                {
                  q: "How much does a bathroom remodel cost in 2026?",
                  a: "A bathroom remodel typically costs $8,000 to $30,000 in 2026, with most homeowners spending around $19,000. A basic refresh (new fixtures, paint, flooring) may cost $5,000–$10,000, while a full renovation with tile work, new plumbing, and layout changes can exceed $30,000.",
                },
                {
                  q: "Should I get a permit for my home renovation?",
                  a: "Most structural, electrical, plumbing, and HVAC work requires permits. Roofing, window replacement, and additions almost always need them. Cosmetic updates like painting and flooring typically don't. Skipping required permits can result in fines, difficulty selling your home, and voided insurance coverage.",
                },
              ].map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border border-border bg-white overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/20 transition">
                    <h3 className="text-sm font-semibold text-ink">{faq.q}</h3>
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform shrink-0 ml-3" />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* SEO: Long-tail keyword content */}
          <section className="mt-16 pt-12 border-t border-border">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">
                The Smartest Way to Review Contractor Quotes
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Updated July 2026 · Based on 10,000+ analyzed quotes
              </p>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-4 text-left">
                <p>
                  Getting a contractor quote for your home improvement project is just the first
                  step. Whether you're planning a roof replacement, kitchen remodel, or bathroom
                  renovation, understanding what's in your quote, and what's missing, can save you
                  thousands of dollars.
                </p>
                <p>
                  CostReno's AI Quote Analyzer is purpose-built for homeowners who want to make
                  informed decisions. Unlike generic AI tools, our system is trained specifically on
                  contractor quotes, building codes, and regional pricing data. It understands the
                  difference between a fair price and an inflated one, between complete scope and
                  missing critical items.
                </p>
                <p>
                  Our analyzer checks for common issues like missing permits, vague material
                  specifications, absence of warranty terms, unclear payment schedules, and scope
                  gaps that could lead to expensive change orders. It also provides smart questions
                  to ask your contractor and negotiation points based on local market rates.
                </p>
                <p>
                  Whether you've received one quote or five, upload them all and compare. Make
                  confident decisions about the biggest investment in your home.
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <div className="mt-16 pb-8 text-center">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => fileInputRef.current?.click(), 350);
              }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent text-white text-sm font-bold hover:bg-accent/90 transition shadow-sm shadow-accent/20"
            >
              <Upload className="h-4 w-4" /> Analyze your quote. Free
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              Trusted by thousands of homeowners. One quote or several.
            </p>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  // ─── PROCESSING STATE ───────────────────────────────────────────────────────
  if (state === "processing") {
    const stageKeys = Object.keys(STAGE_LABELS) as (QuotePipelineStage | "reading")[];
    const currentIdx = stageKeys.indexOf(processingStage as any);
    const pct = Math.min(processingProgress, 100);
    const radius = 46;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (pct / 100) * circumference;
    const completedQuotes = Math.max(0, (batchProgress?.current ?? 1) - 1);
    const tipAngle = (pct / 100) * 360 - 90;
    const tipX = 56 + radius * Math.cos((tipAngle * Math.PI) / 180);
    const tipY = 56 + radius * Math.sin((tipAngle * Math.PI) / 180);

    return (
      <div className="min-h-screen bg-[#f7f8fa]">
        <SiteNav active="quote" />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="relative w-36 h-36 mx-auto mb-8">
            <div className="absolute inset-3 rounded-full bg-accent/10 animate-progress-breathe" />
            <div className="absolute inset-0 rounded-full animate-pulse-glow" />

            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 112 112">
              <defs>
                <linearGradient id="qaProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#03A44D" />
                  <stop offset="55%" stopColor="#1bbf66" />
                  <stop offset="100%" stopColor="#082A4B" />
                </linearGradient>
                <filter id="qaProgressGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="2.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <circle cx="56" cy="56" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="7" />

              <circle
                cx="56"
                cy="56"
                r={radius}
                fill="none"
                stroke="url(#qaProgressGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 56 56)"
                filter="url(#qaProgressGlow)"
                className="transition-[stroke-dashoffset] duration-300 ease-out"
              />

              <circle
                cx="56"
                cy="56"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="18 240"
                transform="rotate(-90 56 56)"
                className="animate-progress-sweep pointer-events-none"
                style={{ opacity: pct > 2 && pct < 99 ? 1 : 0 }}
              />

              {pct > 1 && pct < 99.5 && (
                <circle
                  cx={tipX}
                  cy={tipY}
                  r="5"
                  fill="#03A44D"
                  stroke="#fff"
                  strokeWidth="2"
                  className="transition-all duration-300 ease-out"
                />
              )}
            </svg>

            <svg
              className="absolute inset-0 w-full h-full animate-progress-orbit pointer-events-none"
              viewBox="0 0 112 112"
              aria-hidden
            >
              <circle
                cx="56"
                cy="56"
                r="52"
                fill="none"
                stroke="#03A44D"
                strokeOpacity="0.28"
                strokeWidth="1.5"
                strokeDasharray="3 9"
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-ink tabular-nums tracking-tight">
                {Math.round(pct)}%
              </span>
            </div>
          </div>

          <div className="text-center mb-4">
            <h2
              className="font-display text-xl font-bold text-ink animate-in fade-in duration-300"
              key={`${processingStage}-${batchProgress?.current ?? 0}`}
            >
              {processingStage === "reading" && "Reading your document..."}
              {processingStage === "extracting" && "Pulling out every line item..."}
              {processingStage === "matching" && "Comparing to local market rates..."}
              {processingStage === "analyzing" && "Checking for missing scope & red flags..."}
              {processingStage === "reporting" && "Building your personalized report..."}
            </h2>
            {batchProgress?.name && (
              <p className="text-sm text-muted-foreground mt-2 truncate max-w-sm mx-auto">
                {batchProgress.name}
              </p>
            )}
          </div>

          <div className="mt-6 space-y-2 text-left">
            {(completedQuotes > 0 || currentIdx >= 0) && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs text-ink">Document received</span>
              </div>
            )}
            {(completedQuotes > 0 || currentIdx >= 1) && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs text-ink">Extracting line items</span>
              </div>
            )}
            {(completedQuotes > 0 || currentIdx >= 2) && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs text-ink">Checking local market rates</span>
              </div>
            )}
            {(completedQuotes > 0 || currentIdx >= 3) && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-amber-200 bg-amber-50/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="text-xs text-ink">Reviewing red flags</span>
              </div>
            )}
            {(completedQuotes > 0 || currentIdx >= 4) && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs text-ink">Preparing your report</span>
              </div>
            )}
          </div>

          {/* Tip - chat bubble from bottom right */}
          <div className="fixed bottom-6 right-6 max-w-[280px] z-50">
            <div className="flex items-end gap-2.5">
              <div className="flex-1 relative">
                <div className="p-4 rounded-2xl rounded-br-sm bg-white border border-accent/20 shadow-xl shadow-accent/5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-amber-500 text-sm">💡</span>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                      Did you know?
                    </span>
                  </div>
                  <p
                    className="text-xs text-ink leading-relaxed text-left animate-in fade-in duration-500"
                    key={tipIdx}
                  >
                    {PROCESSING_TIPS[tipIdx].replace("💡 ", "").replace("💡 Tip: ", "")}
                  </p>
                </div>
                {/* Bubble tail */}
                <div className="absolute -bottom-1 right-3 w-3 h-3 bg-white border-r border-b border-accent/20 transform rotate-45" />
              </div>
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0 shadow-lg shadow-accent/30">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          <button
            onClick={handleCancel}
            className="mt-6 text-sm text-muted-foreground hover:text-destructive transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ─── COMPLETE STATE ──────────────────────────────────────────────────────────
  if (showCompare) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center text-sm text-muted-foreground">
            Loading comparison...
          </div>
        }
      >
        <QuoteComparisonView
          selectedIds={compareIds}
          onBack={() => {
            setShowCompare(false);
            setCompareIds([]);
          }}
        />
      </Suspense>
    );
  }

  const feedbackAnalysisKey =
    (result as { uploadId?: string } | null)?.uploadId ||
    (result
      ? `${result.extraction.contractor || "quote"}-${result.analysis.summary.completenessScore}-${result.extraction.materials.length + result.extraction.scopeItems.length}`
      : "none");

  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center text-sm text-muted-foreground">
            Loading your report...
          </div>
        }
      >
        <CompleteView
          result={result!}
          progressSignature={savedProgress?.signature}
          reset={reset}
          chatOpen={chatOpen}
          setChatOpen={setChatOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          expandedCards={expandedCards}
          setExpandedCards={setExpandedCards}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          expandedRow={expandedRow}
          setExpandedRow={setExpandedRow}
          onCompare={(ids: string[]) => {
            setCompareIds(ids);
            setShowCompare(true);
          }}
          feedbackSubmitted={feedbackSubmitted}
          onOpenFeedback={() => setFeedbackOpen(true)}
        />
      </Suspense>
      {!feedbackOpen && (
        <QuoteFeedbackMobileCta
          onOpen={() => setFeedbackOpen(true)}
          submitted={feedbackSubmitted}
        />
      )}
      <QuoteFeedbackCard
        key={feedbackAnalysisKey}
        analysisKey={feedbackAnalysisKey}
        projectType={result!.extraction.projectType}
        contractor={result!.extraction.contractor}
        completenessScore={result!.analysis.summary.completenessScore}
        quoteUploadId={(result as { uploadId?: string }).uploadId}
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        submitted={feedbackSubmitted}
        onSubmitted={() => setFeedbackSubmitted(true)}
      />
    </>
  );
}
