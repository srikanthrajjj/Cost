import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Lock,
  GitCompare,
  Trash2,
  Sparkles,
  Zap,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getComparisonQuotes,
  addComparisonQuote,
  clearComparisonQuotes,
} from "@/lib/quote/comparison-store";
import { friendlyOpenRouterMessage } from "@/lib/quote/openrouter-client";
import { serverAnalyzeQuoteFull } from "@/lib/quote/quote-server";
import { QuoteComparisonView } from "@/components/quote/QuoteComparisonView";
import { extractTextFromFile } from "@/lib/file-processor";

export const Route = createFileRoute("/compare-quotes")({
  head: () => ({
    meta: [
      { title: "Compare 2 Contractor Quotes Side by Side — CostReno" },
      {
        name: "description",
        content:
          "Upload 2 contractor quotes and compare them side by side. Spot pricing differences, missing scope, and choose the best value. Free, no signup.",
      },
      { property: "og:title", content: "Compare 2 Contractor Quotes Side by Side — CostReno" },
      {
        property: "og:description",
        content:
          "Upload 2 contractor quotes. Find the best value, spot missing items, and choose with confidence.",
      },
      { property: "og:url", content: "https://costreno.com/compare-quotes" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://costreno.com/compare-quotes" }],
  }),
  component: CompareQuotesPage,
});

type PageState = "upload" | "analyzing" | "complete";

interface PendingQuote {
  file: File;
  fileName: string;
}

interface AnalyzingQuote {
  fileName: string;
  stage: string;
}

const stageLabels: Record<string, { label: string; icon: string }> = {
  reading: { label: "Reading your document", icon: "📄" },
  extracting: { label: "Extracting line items with AI", icon: "🔍" },
  matching: { label: "Cross-referencing knowledge base", icon: "🏠" },
  analyzing: { label: "Classifying scope & detecting gaps", icon: "⚡" },
  reporting: { label: "Generating your report", icon: "📝" },
};

function getHealthGrade(score: number) {
  if (score >= 85) return { label: "Excellent", color: "text-accent", bg: "bg-accent/10" };
  if (score >= 70) return { label: "Good", color: "text-blue-600", bg: "bg-blue-50" };
  if (score >= 50) return { label: "Needs Attention", color: "text-amber-600", bg: "bg-amber-50" };
  return { label: "High Risk", color: "text-red-600", bg: "bg-red-50" };
}

function CompareQuotesPage() {
  const [state, setState] = useState<PageState>("upload");
  const [error, setError] = useState("");
  const [quote1, setQuote1] = useState<PendingQuote | null>(null);
  const [quote2, setQuote2] = useState<PendingQuote | null>(null);
  const [analyzingQuote1, setAnalyzingQuote1] = useState<AnalyzingQuote | null>(null);
  const [analyzingQuote2, setAnalyzingQuote2] = useState<AnalyzingQuote | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [tipIdx, setTipIdx] = useState(0);
  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);
  const [dragOverSlot, setDragOverSlot] = useState<1 | 2 | null>(null);

  useEffect(() => {
    clearComparisonQuotes();
  }, []);

  useEffect(() => {
    if (state !== "analyzing") return;
    const interval = setInterval(() => setTipIdx((p) => (p + 1) % PROCESSING_TIPS.length), 5000);
    return () => clearInterval(interval);
  }, [state]);

  useEffect(() => {
    if (!error) return;
    const timeout = setTimeout(() => setError(""), 8000);
    return () => clearTimeout(timeout);
  }, [error]);

  const handleFileSelect = useCallback((file: File, slot: 1 | 2) => {
    const entry: PendingQuote = { file, fileName: file.name };
    if (slot === 1) {
      setQuote1(entry);
    } else {
      setQuote2(entry);
    }
  }, []);

  const handleRemovePending = useCallback((slot: 1 | 2) => {
    if (slot === 1) setQuote1(null);
    else setQuote2(null);
  }, []);

  const bothUploaded = quote1 !== null && quote2 !== null;

  const analyzeBoth = async () => {
    if (!quote1 || !quote2) return;
    setState("analyzing");
    setError("");
    clearComparisonQuotes();

    try {
      setAnalyzingQuote1({ fileName: quote1.fileName, stage: "reading" });
      const extracted1 = await extractTextFromFile(quote1.file);
      if (extracted1.text.length < 10) {
        setError("Could not extract text from Quote 1. Try a different file.");
        setState("upload");
        setQuote1(null);
        setAnalyzingQuote1(null);
        return;
      }
      setAnalyzingQuote1((prev) => (prev ? { ...prev, stage: "extracting" } : null));
      const combined1 = `Analyze this contractor quote:\n\n${extracted1.text}`;
      const result1 = await serverAnalyzeQuoteFull({ data: { rawText: combined1 } });
      addComparisonQuote(result1);
      setAnalyzingQuote1(null);

      setAnalyzingQuote2({ fileName: quote2.fileName, stage: "reading" });
      const extracted2 = await extractTextFromFile(quote2.file);
      if (extracted2.text.length < 10) {
        setError("Could not extract text from Quote 2. Try a different file.");
        setState("upload");
        setQuote2(null);
        setAnalyzingQuote2(null);
        return;
      }
      setAnalyzingQuote2((prev) => (prev ? { ...prev, stage: "extracting" } : null));
      const combined2 = `Analyze this contractor quote:\n\n${extracted2.text}`;
      const result2 = await serverAnalyzeQuoteFull({ data: { rawText: combined2 } });
      addComparisonQuote(result2);
      setAnalyzingQuote2(null);

      const saved = getComparisonQuotes();
      const ids = saved.map((q) => q.id);
      setCompareIds(ids);
      setShowCompare(true);
      setState("complete");
    } catch (err) {
      setError(friendlyOpenRouterMessage(err));
      setState("upload");
      setAnalyzingQuote1(null);
      setAnalyzingQuote2(null);
    }
  };

  if (showCompare && compareIds.length >= 2) {
    return (
      <QuoteComparisonView
        selectedIds={compareIds}
        onBack={() => {
          setShowCompare(false);
          setCompareIds([]);
          clearComparisonQuotes();
          setQuote1(null);
          setQuote2(null);
          setState("upload");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <SiteNav />

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-ink transition mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <GitCompare className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-ink">
                Compare two quotes
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Upload 2 contractor quotes and compare them side by side.
              </p>
            </div>
          </div>
        </div>

        {state === "upload" && (
          <>
            {/* Side-by-side upload slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[1, 2].map((slot) => {
                const pending = slot === 1 ? quote1 : quote2;
                const inputRef = slot === 1 ? fileInput1Ref : fileInput2Ref;
                const isDragOver = dragOverSlot === slot;

                return (
                  <div key={slot}>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                      Quote {slot}
                    </p>
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file, slot);
                        e.target.value = "";
                      }}
                    />

                    {pending ? (
                      <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                              <FileText className="h-5 w-5 text-accent" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-ink truncate">
                                {pending.fileName}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                Ready to analyze
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemovePending(slot)}
                            className="shrink-0 w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                          <span className="text-xs text-accent font-medium">File selected</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`rounded-xl border-2 border-dashed bg-white p-8 text-center transition-all cursor-pointer group shadow-sm min-h-[180px] flex flex-col items-center justify-center ${
                          isDragOver
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/40 hover:bg-accent/5"
                        }`}
                        onClick={() => inputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDragOverSlot(slot);
                        }}
                        onDragLeave={() => setDragOverSlot(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDragOverSlot(null);
                          const file = e.dataTransfer.files[0];
                          if (file) handleFileSelect(file, slot);
                        }}
                      >
                        <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-3 group-hover:bg-accent/10 transition">
                          <Upload className="h-5 w-5 text-muted-foreground group-hover:text-accent transition" />
                        </div>
                        <p className="text-sm font-semibold text-ink mb-1">Upload quote {slot}</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Drag & drop or click to choose
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 text-xs font-medium text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition">
                          <FileText className="h-3.5 w-3.5" /> Choose file
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-3">
                          PDF, JPG, PNG (max 15 MB)
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Compare button — only active when both uploaded */}
            <div className="text-center">
              <button
                onClick={analyzeBoth}
                disabled={!bothUploaded}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent text-white text-sm font-bold hover:bg-accent/90 transition shadow-sm shadow-accent/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-accent"
              >
                <GitCompare className="h-4 w-4" />
                {bothUploaded ? "Compare both quotes" : "Upload both quotes to compare"}
              </button>
              {!bothUploaded && (
                <p className="text-xs text-muted-foreground mt-3">
                  {!quote1 && !quote2 && "Upload Quote 1 and Quote 2 to get started"}
                  {quote1 && !quote2 && "Now upload Quote 2"}
                  {!quote1 && quote2 && "Now upload Quote 1"}
                </p>
              )}
            </div>
          </>
        )}

        {state === "analyzing" && (
          <div className="text-center py-12">
            <div className="relative inline-flex mb-6">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-accent/30 flex items-center justify-center shadow-lg shadow-accent/5">
                <svg
                  className="w-10 h-10 text-accent animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </div>
            </div>

            <h2 className="font-display text-xl font-bold text-ink mb-2">Analyzing your quotes</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Both quotes are being analyzed. This takes about 30 seconds each.
            </p>

            <div className="max-w-lg mx-auto space-y-4">
              {/* Quote 1 progress */}
              {analyzingQuote1 && (
                <div className="rounded-xl border border-border bg-white p-4 text-left">
                  <p className="text-xs font-bold text-ink mb-3">
                    Quote 1: {analyzingQuote1.fileName}
                  </p>
                  <div className="space-y-1.5">
                    {["reading", "extracting", "matching", "analyzing", "reporting"].map(
                      (stage, i) => {
                        const stages = [
                          "reading",
                          "extracting",
                          "matching",
                          "analyzing",
                          "reporting",
                        ];
                        const currentIdx = stages.indexOf(analyzingQuote1.stage);
                        const isDone = i < currentIdx;
                        const isActive = i === currentIdx;
                        if (i > currentIdx) return null;
                        return (
                          <div
                            key={stage}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/20 animate-in fade-in slide-in-from-bottom-1 duration-300"
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                            ) : (
                              <div className="h-3.5 w-3.5 rounded-full border-2 border-accent/30 border-t-accent animate-spin shrink-0" />
                            )}
                            <span className="text-xs text-ink">{stageLabels[stage]?.label}</span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}

              {/* Quote 2 progress */}
              {analyzingQuote2 && (
                <div className="rounded-xl border border-border bg-white p-4 text-left">
                  <p className="text-xs font-bold text-ink mb-3">
                    Quote 2: {analyzingQuote2.fileName}
                  </p>
                  <div className="space-y-1.5">
                    {["reading", "extracting", "matching", "analyzing", "reporting"].map(
                      (stage, i) => {
                        const stages = [
                          "reading",
                          "extracting",
                          "matching",
                          "analyzing",
                          "reporting",
                        ];
                        const currentIdx = stages.indexOf(analyzingQuote2.stage);
                        const isDone = i < currentIdx;
                        const isActive = i === currentIdx;
                        if (i > currentIdx) return null;
                        return (
                          <div
                            key={stage}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/20 animate-in fade-in slide-in-from-bottom-1 duration-300"
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                            ) : (
                              <div className="h-3.5 w-3.5 rounded-full border-2 border-accent/30 border-t-accent animate-spin shrink-0" />
                            )}
                            <span className="text-xs text-ink">{stageLabels[stage]?.label}</span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}

              {/* Waiting state for quote 2 */}
              {!analyzingQuote1 && !analyzingQuote2 && (
                <div className="rounded-xl border border-border bg-white p-4 text-left">
                  <p className="text-xs text-muted-foreground">Preparing analysis...</p>
                </div>
              )}
            </div>

            {/* Tip */}
            <div className="fixed bottom-6 right-6 max-w-[280px] z-50">
              <div className="flex items-end gap-2.5">
                <div className="flex-1 relative">
                  <div className="p-4 rounded-2xl rounded-br-sm bg-white border border-accent/20 shadow-xl shadow-accent/5">
                    <p
                      className="text-xs text-ink leading-relaxed animate-in fade-in duration-500"
                      key={tipIdx}
                    >
                      {PROCESSING_TIPS[tipIdx]}
                    </p>
                  </div>
                  <div className="absolute -bottom-1 right-3 w-3 h-3 bg-white border-r border-b border-accent/20 transform rotate-45" />
                </div>
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0 shadow-lg shadow-accent/30">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {state !== "analyzing" && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap justify-center gap-6">
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
        )}
      </div>

      <SiteFooter />
    </div>
  );
}

const PROCESSING_TIPS = [
  "Always get 3 quotes minimum before committing to a contractor.",
  "40% of roofing quotes omit critical items like drip edge or ice shield.",
  "A good contractor warranty should be 5-10 years on workmanship.",
  "Ask if permit costs are included. They often aren't.",
  "Material quality accounts for 44% of your total project cost.",
  "Check contractor licensing at your state's licensing board website.",
  "Insurance may cover storm damage. Document everything with photos.",
  "Cost-plus contracts can spiral. Always prefer fixed-price quotes.",
];
