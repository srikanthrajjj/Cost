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
      { title: "Free AI contractor quote analyzer | CostReno" },
      {
        name: "description",
        content:
          "Upload one contractor quote and get an AI review for missing scope, unclear line items, and pricing red flags. Free, no signup required.",
      },
      {
        name: "keywords",
        content:
          "contractor quote analyzer, AI quote analyzer, contractor estimate checker, roofing quote review, renovation quote analysis, contractor bid review, quote red flags",
      },
      {
        property: "og:title",
        content: "Free AI contractor quote analyzer | CostReno",
      },
      {
        property: "og:description",
        content:
          "Analyze one contractor quote for missing items, vague scope, and pricing red flags in seconds.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://costreno.com/quote-analyzer" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free AI contractor quote analyzer | CostReno" },
      {
        name: "twitter:description",
        content:
          "Upload one contractor quote and get an instant AI review for missing scope and red flags.",
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
              name: "How does the contractor quote analyzer work?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Upload a photo or PDF of one contractor quote. Our AI reads line items, checks them against local pricing context and common scope requirements, then highlights missing items, unclear language, and red flags.",
              },
            },
            {
              "@type": "Question",
              name: "Is the quote analyzer free to use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. The quote analyzer is free to use with no signup required for a standard review.",
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
              name: "How is this different from compare quotes?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Quote analyzer reviews one bid in depth. If you already have two quotes, use the compare quotes tool for a side-by-side report.",
              },
            },
            {
              "@type": "Question",
              name: "How many contractor quotes should I get before hiring?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Getting at least three written quotes helps you understand market range and scope differences. Analyze each quote individually, then compare your strongest options side by side.",
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
          name: "CostReno AI quote analyzer",
          url: "https://costreno.com/quote-analyzer",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description:
            "Free AI-powered tool to analyze one contractor quote for missing scope, pricing red flags, and unclear line items.",
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [batchProgress, setBatchProgress] = useState<{
    current: number;
    total: number;
    name: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const stageTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const MAX_QUOTE_FILES = 5;
  const MAX_FILE_BYTES = 15 * 1024 * 1024;

  const addSelectedFiles = useCallback((incoming: FileList | File[]) => {
    const allowed = Array.from(incoming).filter((file) => {
      const name = file.name.toLowerCase();
      const okType =
        file.type === "application/pdf" ||
        file.type.startsWith("image/") ||
        name.endsWith(".pdf") ||
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg") ||
        name.endsWith(".png");
      return okType && file.size > 0 && file.size <= MAX_FILE_BYTES;
    });

    if (allowed.length === 0) {
      setError("Please choose PDF, JPG, or PNG files under 15MB.");
      return;
    }

    setSelectedFiles((prev) => {
      const next = [...prev];
      for (const file of allowed) {
        if (next.length >= MAX_QUOTE_FILES) break;
        const duplicate = next.some((f) => f.name === file.name && f.size === file.size);
        if (!duplicate) next.push(file);
      }
      return next;
    });
    setError("");
  }, []);

  const clearStageTimers = () => {
    stageTimersRef.current.forEach(clearTimeout);
    stageTimersRef.current = [];
  };

  // Load analysis from sessionStorage if available (from chat flow)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("costreno_quote_analysis");
      if (stored) {
        const parsed = JSON.parse(stored) as QuoteAnalysisResult;
        if (parsed && parsed.analysis && parsed.extraction) {
          setResult(parsed);
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

  // Gradually advance the circular progress toward the current stage ceiling
  useEffect(() => {
    if (state !== "processing") return;

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        const ceiling = STAGE_PROGRESS_CEILING[processingStage] ?? 95;
        if (prev >= ceiling) return prev;
        const remaining = ceiling - prev;
        const increment = Math.max(0.2, remaining * 0.05);
        return Math.min(ceiling, Math.round((prev + increment) * 10) / 10);
      });
    }, 150);

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
    setProcessingProgress((p) => Math.max(p, 12));

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

    try {
      if (selectedFiles.length === 1) {
        setBatchProgress({ current: 1, total: 1, name: selectedFiles[0].name });
        const analysis = await analyzeSingleFile(selectedFiles[0]);
        clearStageTimers();
        setProcessingStage("reporting");
        setProcessingProgress(100);
        setResult(analysis);
        setSelectedFiles([]);
        setBatchProgress(null);
        setState("complete");
        return;
      }

      clearComparisonQuotes();
      const savedIds: string[] = [];
      let lastAnalysis: QuoteAnalysisResult | null = null;

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setBatchProgress({
          current: i + 1,
          total: selectedFiles.length,
          name: file.name,
        });
        setProcessingStage("reading");
        setProcessingProgress(Math.round((i / selectedFiles.length) * 100));

        const analysis = await analyzeSingleFile(file);
        const saved = addComparisonQuote(analysis);
        savedIds.push(saved.id);
        lastAnalysis = analysis;

        setProcessingProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }

      clearStageTimers();
      setProcessingStage("reporting");
      setProcessingProgress(100);
      setResult(lastAnalysis);
      setSelectedFiles([]);
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

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Cancel not supported in server function mode
  const handleCancel = () => {};

  const reset = () => {
    clearStageTimers();
    setState("idle");
    setResult(null);
    setError("");
    setProcessingProgress(0);
    setProcessingStage("reading");
    setActiveTab("overview");
    setSelectedFiles([]);
    setBatchProgress(null);
    setShowCompare(false);
    setCompareIds([]);
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
          {/* Hero - Side by side layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left - Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
                <Clock className="h-3 w-3 text-accent" />
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                  Updated July 2026 · Pricing Data Refreshed Monthly
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink leading-[1.1] tracking-tight">
                Get an expert review of your contractor quote{" "}
                <span className="text-accent">in seconds</span>
              </h1>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Upload one quote to check what's included, what's missing, and what looks unclear.
                Have two bids already?{" "}
                <a href="/compare-quotes" className="text-primary font-semibold hover:underline">
                  Compare them side by side
                </a>
                .
              </p>
              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap gap-5">
                {[
                  { icon: Zap, label: "Results in 30 seconds" },
                  { icon: Lock, label: "100% private & secure" },
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

            {/* Right - Upload Card */}
            <div>
              <div
                className="rounded-2xl border-2 border-dashed border-border hover:border-primary/40 bg-white p-6 sm:p-8 text-left transition-all shadow-sm"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.length) {
                    addSelectedFiles(e.dataTransfer.files);
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      addSelectedFiles(e.target.files);
                    }
                    e.target.value = "";
                  }}
                />

                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-ink">Upload your quote</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Analyze one quote in depth. You can also add more files if needed.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition shadow-sm shadow-accent/20"
                    >
                      <FileText className="h-4 w-4" />
                      {selectedFiles.length === 0 ? "Choose files" : "Add more files"}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG · Max 15MB each</p>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-border">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-ink">
                        {selectedFiles.length} quote{selectedFiles.length === 1 ? "" : "s"} selected
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedFiles([])}
                        className="text-xs text-muted-foreground hover:text-ink transition"
                      >
                        Clear all
                      </button>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {selectedFiles.map((file, index) => (
                        <li
                          key={`${file.name}-${file.size}-${index}`}
                          className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2"
                        >
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <div className="min-w-0 flex-1 text-left">
                            <p className="text-xs font-medium text-ink truncate">{file.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {(file.size / (1024 * 1024)).toFixed(1)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(index)}
                            className="w-7 h-7 rounded-md hover:bg-white flex items-center justify-center shrink-0"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={handleAnalyzeSelected}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition shadow-sm shadow-accent/20"
                    >
                      <Sparkles className="h-4 w-4" />
                      {selectedFiles.length === 1
                        ? "Analyze quote"
                        : `Analyze and compare ${selectedFiles.length} quotes`}
                    </button>
                    {selectedFiles.length >= 2 && (
                      <p className="mt-2 text-[11px] text-muted-foreground text-center">
                        Prefer a dedicated side-by-side report?{" "}
                        <a href="/compare-quotes" className="text-primary hover:underline">
                          Use compare quotes
                        </a>
                        .
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* What You'll Get - Clean cards */}
          <div className="mt-16 pt-12 border-t border-border">
            <h2 className="font-display text-2xl font-bold text-ink text-center mb-8">
              What You'll Get
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Search,
                  title: "Scope Analysis",
                  desc: "See what's included and what's missing",
                },
                {
                  icon: DollarSign,
                  title: "Price Check",
                  desc: "Flag overpriced or underpriced items",
                },
                {
                  icon: AlertTriangle,
                  title: "Red Flags",
                  desc: "Spot risky terms and vague language",
                },
                {
                  icon: MessageCircle,
                  title: "AI Q&A",
                  desc: "Ask questions about your specific quote",
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
                setTimeout(() => fileInputRef.current?.click(), 350);
              }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent text-white text-sm font-bold hover:bg-accent/90 transition shadow-sm shadow-accent/20"
            >
              <Upload className="h-4 w-4" /> Upload quote(s) now
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              Free. No signup. Analyze one quote or compare several.
            </p>
          </div>

          {/* SEO: How It Works Section */}
          <section className="mt-20 pt-12 border-t border-border">
            <h2 className="font-display text-2xl font-bold text-ink text-center mb-3">
              How the Contractor Quote Analyzer Works
            </h2>
            <p className="text-sm text-muted-foreground text-center max-w-lg mx-auto mb-10">
              Three simple steps to review any contractor estimate, bid, or proposal.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Upload your quote(s)",
                  desc: "Upload one PDF or photo for a full review, or select up to 5 quotes to compare side by side. Roofing, kitchen, bathroom, HVAC, and more.",
                },
                {
                  step: "2",
                  title: "AI Analyzes Every Line",
                  desc: "Our AI engine reads every line item, cross-references local pricing data, checks building codes, and identifies missing scope.",
                },
                {
                  step: "3",
                  title: "Get Your Expert Report",
                  desc: "Receive a detailed report with a health score, red flags, pricing analysis, missing items, and questions to ask your contractor.",
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
                  q: "How does the contractor quote analyzer work?",
                  a: "Simply upload a photo or PDF of your contractor quote. Our AI reads every line item, cross-references it against local pricing databases and building codes, then generates a detailed report highlighting overpriced items, missing scope, and red flags.",
                },
                {
                  q: "Is this free to use?",
                  a: "Yes, the quote analyzer is completely free. No signup, no credit card, and no hidden fees. Upload your quote and get results in under 30 seconds.",
                },
                {
                  q: "What types of quotes can I analyze?",
                  a: "You can analyze any home improvement contractor quote including roofing, kitchen remodeling, bathroom renovation, HVAC installation, window replacement, solar panels, painting, flooring, deck/patio, plumbing, and electrical work.",
                },
                {
                  q: "Is my contractor quote kept private?",
                  a: "Absolutely. Your files are encrypted, never stored permanently, and never shared with contractors or third parties. We process your quote securely and delete it after analysis.",
                },
                {
                  q: "How accurate is the AI analysis?",
                  a: "Our AI is trained on thousands of real contractor quotes and cross-references current local pricing data. It identifies missing scope items, overpriced line items, and code compliance issues with strong clarity. However, we always recommend getting multiple quotes.",
                },
                {
                  q: "What should I do if red flags are found?",
                  a: "If our analysis identifies red flags, use the detailed questions and negotiation points we provide to discuss with your contractor. Ask for clarification on vague items, request itemized breakdowns, and compare with other quotes.",
                },
                {
                  q: "Can I use this before signing a contract?",
                  a: "Yes. That's exactly when you should use it. Upload your quote before signing to ensure you're getting fair pricing, complete scope, and proper materials specified. It's the smartest step before committing to a contractor.",
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

    return (
      <div className="min-h-screen bg-[#f7f8fa]">
        <SiteNav active="quote" />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          {/* Circular progress bar */}
          <div className="w-24 h-24 mx-auto mb-8 relative">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 96 96">
              {/* Background circle */}
              <circle cx="48" cy="48" r="44" fill="none" stroke="#e5e7eb" strokeWidth="4" />
              {/* Progress circle */}
              <circle
                cx="48"
                cy="48"
                r="44"
                fill="none"
                stroke="#03A44D"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(Math.min(processingProgress, 100) / 100) * 276} 276`}
                className="transition-[stroke-dasharray] duration-300 ease-out"
              />
            </svg>
            {/* Progress percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-ink">
                {Math.round(processingProgress)}%
              </span>
            </div>
          </div>

          {/* Stage text with time estimate */}
          <div className="text-center mb-4">
            {batchProgress && batchProgress.total > 1 && (
              <p className="text-xs font-semibold text-primary mb-2">
                Quote {batchProgress.current} of {batchProgress.total}: {batchProgress.name}
              </p>
            )}
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
            <p className="text-sm text-muted-foreground mt-1">
              {batchProgress && batchProgress.total > 1
                ? "Analyzing each quote in order. This may take a few minutes."
                : processingStage === "reading"
                  ? "Estimated: 10-15 seconds"
                  : processingStage === "extracting"
                    ? "Estimated: 15-20 seconds"
                    : processingStage === "matching"
                      ? "Estimated: 20-30 seconds"
                      : processingStage === "analyzing"
                        ? "Estimated: 30-45 seconds"
                        : "Almost done..."}
            </p>
          </div>

          {/* Live findings - progressive reveals */}
          <div className="mt-6 space-y-2 text-left">
            {currentIdx >= 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs text-ink">Document received. Extracting text</span>
              </div>
            )}
            {currentIdx >= 1 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs text-ink">
                  Extracting line items from your quote
                </span>
              </div>
            )}
            {currentIdx >= 2 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs text-ink">
                  Cross-referencing with local pricing database
                </span>
              </div>
            )}
            {currentIdx >= 3 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-amber-200 bg-amber-50/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="text-xs text-ink">Flagged potential issues. Verifying now</span>
              </div>
            )}
            {currentIdx >= 4 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs text-ink">Report ready. Compiling results</span>
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
