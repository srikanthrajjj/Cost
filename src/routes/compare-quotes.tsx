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
  ChevronDown,
  Shield,
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
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/compare-quotes")({
  head: () => ({
    meta: [
      { title: "Compare two contractor quotes side by side | CostReno" },
      {
        name: "description",
        content:
          "Upload two contractor quotes and compare pricing, scope, and red flags side by side. Free tool to help you choose with clearer information.",
      },
      { property: "og:title", content: "Compare two contractor quotes side by side | CostReno" },
      {
        property: "og:description",
        content:
          "Compare two contractor quotes side by side. Spot pricing and scope differences before you hire.",
      },
      { property: "og:url", content: "https://www.costreno.com/compare-quotes" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/compare-quotes" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How does the quote comparison tool work?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Upload two contractor quotes (PDF, JPG, or PNG). Our AI reads every line item from both quotes, compares pricing, identifies missing scope, detects red flags, and generates a side-by-side report with a composite score for each quote.",
              },
            },
            {
              "@type": "Question",
              name: "Is the quote comparison tool free?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, comparing two contractor quotes is completely free. No signup, no credit card, and no hidden fees. Upload both quotes and get results in under 60 seconds.",
              },
            },
            {
              "@type": "Question",
              name: "How many quotes can I compare at once?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "You can compare exactly 2 quotes side by side. This gives you a focused comparison of pricing, scope, materials, and overall value between two contractors.",
              },
            },
            {
              "@type": "Question",
              name: "Is my contractor quote kept private?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Absolutely. Your files are encrypted, never stored permanently, and never shared with contractors or third parties. We process your quotes securely and delete them after analysis.",
              },
            },
            {
              "@type": "Question",
              name: "What does the comparison report include?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The report includes composite scores for each quote, pricing comparison, missing scope detection, red flag identification, material comparison, market rate benchmarks, savings analysis, AI insights, and personalized questions to ask each contractor.",
              },
            },
            {
              "@type": "Question",
              name: "What are common red flags when comparing contractor quotes?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Watch for: one quote missing items the other includes, significantly lower pricing that may indicate cut corners, vague material descriptions, missing permit costs, no warranty terms, and large differences in labor rates between the two quotes.",
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
          name: "CostReno Quote Comparison Tool",
          url: "https://www.costreno.com/compare-quotes",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description:
            "Free AI-powered tool to compare two contractor quotes side by side. Spot pricing differences, missing scope, and unclear terms.",
        }),
      },
    ],
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
      const result1 = await serverAnalyzeQuoteFull({
        data: {
          rawText: combined1,
          fileName: quote1.fileName,
          fileType: quote1.file.type || undefined,
          fileSize: quote1.file.size,
          source: "compare-quotes",
        },
      });
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
      const result2 = await serverAnalyzeQuoteFull({
        data: {
          rawText: combined2,
          fileName: quote2.fileName,
          fileType: quote2.file.type || undefined,
          fileSize: quote2.file.size,
          source: "compare-quotes",
        },
      });
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
                            : "border-gray-300 hover:border-accent hover:bg-accent/5"
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
                        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:scale-105 transition-all">
                          <Upload className="h-6 w-6 text-accent group-hover:text-white transition" />
                        </div>
                        <p className="text-base font-bold text-ink mb-1">Upload quote {slot}</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Drag & drop or click to choose
                        </p>
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-bold group-hover:bg-accent/90 transition shadow-sm shadow-accent/20">
                          <FileText className="h-4 w-4" /> Choose file
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-3">
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

        {/* ═══ SEO CONTENT — only show when not analyzing ═══ */}
        {state === "upload" && (
          <>
            {/* SEO: How It Works */}
            <section className="mt-20 pt-12 border-t border-border">
              <h2 className="font-display text-2xl font-bold text-ink text-center mb-3">
                How the Quote Comparison Tool Works
              </h2>
              <p className="text-sm text-muted-foreground text-center max-w-lg mx-auto mb-10">
                Compare two contractor quotes in three simple steps and pick the best value.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    step: "1",
                    title: "Upload Both Quotes",
                    desc: "Upload a PDF, photo, or scan from each contractor. We support all major home improvement quote formats.",
                  },
                  {
                    step: "2",
                    title: "AI Compares Everything",
                    desc: "Our AI reads every line item from both quotes, compares pricing against local market rates, and identifies missing scope and red flags.",
                  },
                  {
                    step: "3",
                    title: "Pick the Best Value",
                    desc: "Get a side-by-side report with composite scores, pricing breakdowns, savings analysis, and smart questions to ask each contractor.",
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

            {/* SEO: What You Get */}
            <section className="mt-16 pt-12 border-t border-border">
              <h2 className="font-display text-2xl font-bold text-ink text-center mb-3">
                What Your Comparison Report Includes
              </h2>
              <p className="text-xs text-muted-foreground text-center mb-8">
                Every comparison gives you a complete picture of both quotes
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  {
                    title: "Composite Scores",
                    desc: "0-100 score for each quote based on pricing, scope completeness, and material quality",
                  },
                  {
                    title: "Pricing Comparison",
                    desc: "Line-by-line pricing breakdown showing which contractor charges more for each item",
                  },
                  {
                    title: "Missing Scope Detection",
                    desc: "Items one quote includes that the other omits, so nothing catches you off guard",
                  },
                  {
                    title: "Red Flag Alerts",
                    desc: "AI-powered detection of vague terms, missing permits, and suspicious pricing patterns",
                  },
                  {
                    title: "Market Rate Benchmarks",
                    desc: "How each quote compares to typical pricing in your area for this project type",
                  },
                  {
                    title: "Savings Analysis",
                    desc: "Clear breakdown of potential savings and where each contractor differs most",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white"
                  >
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-ink mb-0.5">{item.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SEO: Use Cases */}
            <section className="mt-16 pt-12 border-t border-border">
              <h2 className="font-display text-2xl font-bold text-ink text-center mb-8">
                Compare Any Two Home Improvement Quotes
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "Roofing Quotes",
                  "Kitchen Remodel Bids",
                  "Bathroom Renovation",
                  "HVAC Proposals",
                  "Window Installation",
                  "Solar Panel Estimates",
                  "Deck & Patio Bids",
                  "Flooring Quotes",
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

            {/* SEO: FAQ */}
            <section className="mt-16 pt-12 border-t border-border">
              <h2 className="font-display text-2xl font-bold text-ink text-center mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-muted-foreground text-center mb-8">
                Last updated: July 2026
              </p>
              <div className="max-w-2xl mx-auto space-y-3">
                {[
                  {
                    q: "How does the quote comparison tool work?",
                    a: "Upload two contractor quotes (PDF, JPG, or PNG). Our AI reads every line item from both quotes, compares pricing against local market rates, and generates a side-by-side report with composite scores, red flags, missing scope, and savings analysis.",
                  },
                  {
                    q: "Is comparing quotes free?",
                    a: "Yes, comparing two contractor quotes is completely free. No signup, no credit card, and no hidden fees. Upload both quotes and get results in under 60 seconds.",
                  },
                  {
                    q: "How many quotes can I compare at once?",
                    a: "You can compare exactly 2 quotes side by side. This gives you a focused comparison of pricing, scope, materials, and overall value between two contractors. If you have more than 2 quotes, run multiple comparisons.",
                  },
                  {
                    q: "What file types are supported?",
                    a: "We accept PDF, JPG, and PNG files up to 15 MB each. Take a photo of a paper quote, screenshot a digital one, or upload the original PDF from your contractor.",
                  },
                  {
                    q: "Is my contractor quote kept private?",
                    a: "Absolutely. Your files are encrypted, never stored permanently, and never shared with contractors or third parties. We process your quotes securely and delete them after analysis.",
                  },
                  {
                    q: "What does the comparison report include?",
                    a: "The report includes composite scores for each quote, line-by-line pricing comparison, missing scope detection, red flag identification, material quality assessment, market rate benchmarks, savings analysis, AI insights, and personalized questions to ask each contractor.",
                  },
                  {
                    q: "What are common red flags when comparing quotes?",
                    a: "Watch for: one quote missing items the other includes, significantly lower pricing that may indicate cut corners, vague material descriptions, missing permit costs, no warranty terms, and large differences in labor rates.",
                  },
                  {
                    q: "Should I always choose the cheaper quote?",
                    a: "Not necessarily. A lower price may mean missing scope, lower-quality materials, or no warranty. Our comparison tool helps you understand what you get for each price so you can choose the best overall value, not just the cheapest option.",
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

            {/* SEO: People Also Ask */}
            <section className="mt-16 pt-12 border-t border-border">
              <h2 className="font-display text-2xl font-bold text-ink text-center mb-3">
                People Also Ask
              </h2>
              <p className="text-xs text-muted-foreground text-center mb-8">
                Common questions homeowners have about contractor quotes
              </p>
              <div className="max-w-2xl mx-auto space-y-3">
                {[
                  {
                    q: "How many contractor quotes should I get before hiring?",
                    a: "Get at least 3 quotes for any home improvement project over $5,000. For major renovations ($50,000+), consider getting 4-5 quotes. This helps you understand the market rate, evaluate different approaches, and identify outliers.",
                  },
                  {
                    q: "What should a contractor quote include?",
                    a: "A complete contractor quote should include: itemized materials with brand/model, labor costs broken down by task, permit fees, demolition and disposal costs, project timeline with start/end dates, payment schedule, warranty terms, and insurance/licensing information.",
                  },
                  {
                    q: "How do I know if my contractor quote is too high?",
                    a: "Compare your quote against the typical range for your project type and location. Watch for vague line items, unusually high markups on materials, or labor rates significantly above the local average. Getting 2-3 competing quotes is the best way to benchmark pricing.",
                  },
                  {
                    q: "What are common red flags in contractor quotes?",
                    a: "Watch for: requesting more than 30% upfront payment, no written warranty, vague material descriptions (e.g., 'standard grade'), missing permit costs, no timeline specified, price significantly lower than competitors, and pressure to sign immediately.",
                  },
                  {
                    q: "Can I use this before signing a contract?",
                    a: "Yes. That's exactly when you should use it. Upload both quotes before signing to ensure you're getting fair pricing, complete scope, and proper materials specified. It's the smartest step before committing to a contractor.",
                  },
                  {
                    q: "How much does a roof replacement cost in 2026?",
                    a: "The average roof replacement costs between $8,600 and $24,700 in 2026, with most homeowners paying around $16,650. Costs vary significantly based on roofing material, roof size, pitch complexity, and your geographic location.",
                  },
                  {
                    q: "How much does a kitchen remodel cost?",
                    a: "A kitchen remodel typically costs between $25,000 and $75,000 in 2026, with the national average around $50,000. Minor cosmetic updates may cost $10,000-$15,000, while a full gut renovation with custom cabinets and appliances can exceed $100,000.",
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
                  The Smartest Way to Choose Between Contractor Quotes
                </h2>
                <p className="text-xs text-muted-foreground mb-6">Updated July 2026</p>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-4 text-left">
                  <p>
                    Receiving two contractor quotes for your home improvement project is a great
                    start, but choosing between them isn't always straightforward. One quote might
                    be lower on paper but miss critical items like permits, warranty, or proper
                    material specifications. The other might be more expensive but include
                    everything you need.
                  </p>
                  <p>
                    CostReno's Quote Comparison Tool is purpose-built for homeowners who want to
                    make confident decisions between competing bids. Unlike generic comparison
                    tools, our AI is trained specifically on contractor quotes, building codes, and
                    regional pricing data. It understands the real difference between value and
                    cutting corners.
                  </p>
                  <p>
                    Our comparison engine analyzes every line item from both quotes,
                    cross-references pricing against local market rates, and flags scope gaps that
                    could lead to expensive change orders. You'll see exactly where each contractor
                    differs, what one includes that the other doesn't, and which quote offers the
                    best overall value for your investment.
                  </p>
                  <p>
                    Whether you're comparing roofing bids, kitchen remodel estimates, or HVAC
                    replacement proposals, upload both quotes and let AI do the heavy lifting. Make
                    confident decisions about the biggest investment in your home.
                  </p>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <div className="mt-16 pb-8 text-center">
              <h2 className="font-display text-xl font-bold text-ink mb-2">
                Ready to compare your quotes?
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Upload both quotes above and get a detailed comparison in seconds.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { icon: Zap, label: "Results in 60 seconds" },
                  { icon: Shield, label: "100% private & secure" },
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
          </>
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
