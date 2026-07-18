import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Download,
  Share2,
  MessageCircle,
  Sparkles,
  X,
  Send,
  TrendingUp,
  Clock,
  DollarSign,
  Search,
  BarChart3,
  ArrowRight,
  Check,
  Info,
  Wrench,
  Bot,
  Paperclip,
  Eye,
  Zap,
  Star,
  Lock,
} from "lucide-react";
import { extractTextFromFile } from "@/lib/file-processor";
import { analyzeQuoteFull, type QuoteAnalysisResult, type QuotePipelineStage } from "@/lib/quote";
import { OpenRouterError, friendlyOpenRouterMessage } from "@/lib/quote/openrouter-client";
import { chatWithKnowledge } from "@/lib/chat-with-knowledge";
import type { ChatMessage } from "@/lib/chat-with-knowledge";
import type { QuoteAnalysis } from "@/lib/quote/types";

export const Route = createFileRoute("/quote-analyzer")({
  head: () => ({ meta: [{ title: "AI Quote Analyzer — CostReno" }] }),
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
  "💡 Ask if permit costs are included — they often aren't.",
  "💡 Material quality accounts for 44% of your total project cost.",
  "💡 Check contractor licensing at your state's licensing board website.",
  "💡 Insurance may cover storm damage — document everything with photos.",
  "💡 \"Cost-plus\" contracts can spiral. Always prefer fixed-price quotes.",
];

const STAGE_LABELS: Record<QuotePipelineStage | "reading", { label: string; icon: string }> = {
  reading: { label: "Reading your document", icon: "📄" },
  extracting: { label: "Extracting line items with AI", icon: "🔍" },
  matching: { label: "Cross-referencing knowledge base", icon: "🏠" },
  analyzing: { label: "Classifying scope & detecting gaps", icon: "⚡" },
  reporting: { label: "Generating your report", icon: "📝" },
};

function getHealthGrade(score: number): { label: string; color: string; bg: string } {
  if (score >= 85) return { label: "Excellent", color: "text-accent", bg: "bg-accent/10" };
  if (score >= 70) return { label: "Good", color: "text-blue-600", bg: "bg-blue-50" };
  if (score >= 50) return { label: "Needs Attention", color: "text-amber-600", bg: "bg-amber-50" };
  return { label: "High Risk", color: "text-red-600", bg: "bg-red-50" };
}

// ─── Main Page Component ──────────────────────────────────────────────────────
function QuoteAnalyzerPage() {
  const [state, setState] = useState<AnalysisState>("idle");
  const [result, setResult] = useState<QuoteAnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const [processingStage, setProcessingStage] = useState<string>("reading");
  const [tipIdx, setTipIdx] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"overview" | "scope" | "explorer" | "questions" | "timeline">("overview");
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const SK_API_KEY = import.meta.env.VITE_SK_API_KEY || "";

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

  const handleFileUpload = async (file: File) => {
    if (!SK_API_KEY) {
      setError("API key not configured. Set VITE_SK_API_KEY in your environment.");
      setState("error");
      return;
    }
    setState("processing");
    setError("");
    setResult(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setProcessingStage("reading");
      const extracted = await extractTextFromFile(file);
      if (extracted.text.length < 10) {
        setError("Could not extract text from this file. Try a different PDF or paste text directly.");
        setState("error");
        return;
      }

      const combinedText = `Analyze this contractor quote:\n\n${extracted.text}`;
      const analysis = await analyzeQuoteFull(combinedText, SK_API_KEY, {
        signal: controller.signal,
        onStageChange: (stage) => setProcessingStage(stage),
      });

      setResult(analysis);
      setState("complete");
    } catch (err) {
      if (err instanceof OpenRouterError && err.code === "cancelled") {
        setState("idle");
      } else {
        setError(friendlyOpenRouterMessage(err));
        setState("error");
      }
    } finally {
      abortRef.current = null;
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
  };

  const reset = () => {
    setState("idle");
    setResult(null);
    setError("");
    setActiveTab("overview");
  };

  // ─── IDLE STATE: Upload Interface ───────────────────────────────────────────
  if (state === "idle" || state === "error") {
    return (
      <div className="min-h-screen bg-[#f8faf9]">
        {/* Header */}
        <header className="border-b border-border/60 bg-white">
          <div className="container-x flex h-14 items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="CostReno" style={{ height: "32px" }} />
            </a>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              <span className="font-medium">100% Private & Secure</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container-x py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left: Copy */}
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-ink leading-[1.1] tracking-tight">
                Get an Expert Review of Your Contractor Quote{" "}
                <span className="text-accent">in Under 30 Seconds</span>
              </h1>
              <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-md">
                Upload your quote and uncover what's <strong className="text-ink">included</strong>, what's <strong className="text-ink">missing</strong>, and what could <strong className="text-ink">cost you more</strong>.
              </p>
            </div>

            {/* Right: Floating badges */}
            <div className="relative hidden md:block h-[260px]">
              <div className="absolute top-4 left-8 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white shadow-lg border border-border">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">AI-Powered</p>
                  <p className="text-[10px] text-muted-foreground">Analysis</p>
                </div>
              </div>
              <div className="absolute top-20 right-4 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white shadow-lg border border-border">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">Instant</p>
                  <p className="text-[10px] text-muted-foreground">Results</p>
                </div>
              </div>
              <div className="absolute bottom-8 right-12 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white shadow-lg border border-border">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">Expert</p>
                  <p className="text-[10px] text-muted-foreground">Accuracy</p>
                </div>
              </div>
              {/* Decorative quote card */}
              <div className="absolute top-6 right-20 w-44 h-56 rounded-xl bg-white shadow-md border border-border p-4 rotate-3">
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Contractor Quote</div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className={`h-2 rounded bg-muted ${i === 1 ? "w-20" : i === 3 ? "w-16" : "w-24"}`} />
                      <div className="text-[9px] font-medium text-accent">$</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="container-x pb-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-start">
              {/* Upload card */}
              <div
                className="rounded-2xl border-2 border-dashed border-border hover:border-accent/60 bg-white p-10 text-center transition-all cursor-pointer group shadow-sm"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileUpload(file);
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                    e.target.value = "";
                  }}
                />
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition">
                  <Upload className="h-6 w-6 text-accent" />
                </div>
                <p className="text-base font-bold text-ink">Upload Your Quote</p>
                <p className="mt-1.5 text-sm text-muted-foreground">Drag & drop your file here or</p>
                <button className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#082A4B] text-white text-sm font-semibold hover:bg-[#082A4B]/90 transition">
                  <FileText className="h-4 w-4" /> Choose File
                </button>
                <p className="mt-4 text-xs text-muted-foreground">PDF, JPG, PNG • Max 15MB</p>
              </div>

              {/* Security badge */}
              <div className="rounded-xl border border-border bg-white p-5 shadow-sm md:w-52">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <p className="text-sm font-bold text-ink text-center">Your data is 100% secure</p>
                <p className="text-xs text-muted-foreground text-center mt-1.5 leading-relaxed">
                  We never share your files or information. Ever.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="container-x pb-6">
            <div className="max-w-4xl mx-auto flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Analysis failed</p>
                <p className="mt-1 text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Trust Bar */}
        <section className="container-x py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-t border-b border-border">
              {[
                { icon: Zap, title: "Results in under 30 seconds", desc: "Save time. Make confident decisions." },
                { icon: Lock, title: "Bank-level security", desc: "Your data is encrypted & protected." },
                { icon: CheckCircle2, title: "No signup required", desc: "100% free to try." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why CostReno is Superior - Comparison */}
        <section className="container-x py-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2">Why CostReno is Superior</p>
              <h2 className="font-display text-3xl font-extrabold text-ink">Smarter. Deeper. More Accurate.</h2>
              <p className="mt-2 text-sm text-muted-foreground">Built for homeowner decisions, not generic answers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* CostReno column */}
              <div className="rounded-2xl border-2 border-accent/30 bg-white p-6 relative">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display text-base font-extrabold text-ink">CostReno</span>
                  <span className="px-2 py-0.5 rounded-full bg-accent text-white text-[9px] font-bold uppercase">Best</span>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Contractor quote intelligence", desc: "Trained on thousands of real quotes & industry data" },
                    { title: "Scope & code-aware analysis", desc: "Understands building codes, best practices & local requirements" },
                    { title: "Pricing insights", desc: "Identifies overpriced items and market comparisons" },
                    { title: "Actionable recommendations", desc: "Gives you smart questions, negotiation points & next steps" },
                    { title: "Built for homeowners", desc: "Explains everything in plain English with expert context" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-ink">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-accent/20 text-center">
                  <p className="text-xs font-bold text-accent">Purpose-built for quotes.</p>
                  <p className="text-[10px] text-muted-foreground">Designed for better decisions.</p>
                </div>
              </div>

              {/* ChatGPT column */}
              <div className="rounded-2xl border border-border bg-white p-6">
                <div className="mb-5">
                  <span className="font-display text-base font-extrabold text-ink">ChatGPT & Other AI</span>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "General knowledge only", desc: "Not trained specifically on contractor quotes" },
                    { title: "Limited code understanding", desc: "May miss local code requirements and scope details" },
                    { title: "No pricing context", desc: "Can't detect overpriced or unrealistic line items" },
                    { title: "Generic suggestions", desc: "Responses are broad, not tailored to your quote" },
                    { title: "Not built for this use case", desc: "Requires you to ask the right questions" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-2.5">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-ink">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-border text-center">
                  <p className="text-xs text-muted-foreground">General AI. General answers.</p>
                  <p className="text-[10px] text-muted-foreground">Not built for your biggest investment.</p>
                </div>
              </div>

              {/* Manual column */}
              <div className="rounded-2xl border border-border bg-white p-6">
                <div className="mb-5">
                  <span className="font-display text-base font-extrabold text-ink">Spreadsheets & Manual</span>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Time-consuming", desc: "Hours of manual line-by-line review" },
                    { title: "Easy to miss important items", desc: "Human error leads to costly oversights" },
                    { title: "No code or pricing validation", desc: "Hard to verify compliance or market pricing" },
                    { title: "No expert guidance", desc: "No recommendations or negotiation leverage" },
                    { title: "Outdated fast", desc: "Can't keep up with changes in codes & pricing" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-2.5">
                      <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-ink">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-border text-center">
                  <p className="text-xs text-red-500 font-medium">Outdated. Risky.</p>
                  <p className="text-[10px] text-muted-foreground">Leaves money on the table.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="container-x py-10">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-6 rounded-2xl bg-white border border-border shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">We analyze deeper, compare smarter, and find what others miss.</p>
                <p className="text-xs text-muted-foreground mt-0.5">So you can sign with confidence.</p>
              </div>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <div className="flex items-center gap-0.5 justify-center sm:justify-end">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Rated 4.9/5 by homeowners</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ─── PROCESSING STATE ───────────────────────────────────────────────────────
  if (state === "processing") {
    const stageKeys = Object.keys(STAGE_LABELS) as (QuotePipelineStage | "reading")[];
    const currentIdx = stageKeys.indexOf(processingStage as any);

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-x py-20 max-w-lg mx-auto text-center">
          {/* Animated spinner */}
          <div className="w-20 h-20 mx-auto mb-8 relative">
            <div className="absolute inset-0 rounded-full border-4 border-border" />
            <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              {STAGE_LABELS[processingStage as keyof typeof STAGE_LABELS]?.icon ?? "🔍"}
            </div>
          </div>

          <h2 className="font-display text-xl font-bold text-ink">
            Analyzing your quote...
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {STAGE_LABELS[processingStage as keyof typeof STAGE_LABELS]?.label ?? "Processing..."}
          </p>

          {/* Progress steps */}
          <div className="mt-8 flex justify-center gap-2">
            {stageKeys.map((stage, idx) => (
              <div
                key={stage}
                className={`h-2 w-10 rounded-full transition-all duration-500 ${
                  idx < currentIdx ? "bg-accent" : idx === currentIdx ? "bg-accent/50 animate-pulse" : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* Tip */}
          <div className="mt-10 p-4 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground leading-relaxed animate-in fade-in duration-300" key={tipIdx}>
            {PROCESSING_TIPS[tipIdx]}
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

  // ─── COMPLETE STATE: Interactive Results ────────────────────────────────────
  const analysis = result!.analysis;
  const extraction = result!.extraction;
  const score = analysis.summary.completenessScore;
  const grade = getHealthGrade(score);

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Header onNewQuote={reset} />

      {/* Hero Score Section */}
      <section className="bg-white border-b border-border">
        <div className="container-x py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Score Ring */}
            <div className="relative shrink-0">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke={score >= 85 ? "#03A44D" : score >= 70 ? "#3b82f6" : score >= 50 ? "#d97706" : "#dc2626"}
                  strokeWidth="8"
                  strokeDasharray={`${(score / 100) * 327} 327`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-display font-bold text-ink">{score}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</span>
              </div>
            </div>

            {/* Summary */}
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${grade.bg} ${grade.color}`}>
                  {grade.label}
                </span>
                {extraction.contractor && (
                  <span className="text-xs text-muted-foreground">by {extraction.contractor}</span>
                )}
              </div>
              <h1 className="font-display text-2xl font-bold text-ink">
                {extraction.projectType ? `${extraction.projectType.charAt(0).toUpperCase() + extraction.projectType.slice(1)} Quote Analysis` : "Quote Analysis"}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">
                {analysis.presentItems.length} items confirmed, {analysis.needsClarification.length} need clarification, {analysis.missingScope.length} missing.
                {extraction.totalPrice > 0 && ` Total quoted: $${extraction.totalPrice.toLocaleString()}.`}
              </p>

              {/* Quick actions */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-medium text-ink hover:border-accent/50 transition">
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-medium text-ink hover:border-accent/50 transition">
                  <Share2 className="h-3.5 w-3.5" /> Share Report
                </button>
                <button onClick={reset} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-medium text-ink hover:border-accent/50 transition">
                  <Upload className="h-3.5 w-3.5" /> Compare Another
                </button>
                <button onClick={() => setChatOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent/90 transition">
                  <MessageCircle className="h-3.5 w-3.5" /> Ask CostReno AI
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-border sticky top-0 z-30">
        <div className="container-x">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {([
              { id: "overview", label: "Overview" },
              { id: "scope", label: "Scope Review" },
              { id: "explorer", label: "Quote Explorer" },
              { id: "questions", label: "Smart Questions" },
              { id: "timeline", label: "Timeline" },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "bg-[#082A4B] text-white"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container-x py-8">
        {activeTab === "overview" && <OverviewTab analysis={analysis} extraction={extraction} />}
        {activeTab === "scope" && <ScopeReviewTab analysis={analysis} expandedCards={expandedCards} setExpandedCards={setExpandedCards} onAskAI={() => setChatOpen(true)} />}
        {activeTab === "explorer" && <QuoteExplorerTab extraction={extraction} analysis={analysis} selectedRow={selectedRow} setSelectedRow={setSelectedRow} />}
        {activeTab === "questions" && <QuestionsTab analysis={analysis} />}
        {activeTab === "timeline" && <TimelineTab analysis={analysis} />}
      </div>

      {/* AI Chat Panel */}
      {chatOpen && (
        <AIChatPanel
          analysis={analysis}
          extraction={extraction}
          onClose={() => setChatOpen(false)}
          apiKey={SK_API_KEY}
        />
      )}

      {/* Floating AI button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent shadow-lg shadow-accent/30 flex items-center justify-center text-white hover:scale-105 transition-transform z-40"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}


// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ onNewQuote }: { onNewQuote?: () => void }) {
  return (
    <header className="border-b border-border bg-white">
      <div className="container-x flex h-14 items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="CostReno" style={{ height: "32px" }} />
        </a>
        <div className="flex items-center gap-3">
          {onNewQuote && (
            <button onClick={onNewQuote} className="text-sm font-medium text-muted-foreground hover:text-ink transition">
              New Analysis
            </button>
          )}
          <a href="/" className="text-sm font-medium text-muted-foreground hover:text-ink transition">
            Home
          </a>
        </div>
      </div>
    </header>
  );
}


// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ analysis, extraction }: { analysis: QuoteAnalysis; extraction: QuoteAnalysisResult["extraction"] }) {
  const cards = [
    { label: "Included", count: analysis.presentItems.length, icon: CheckCircle2, color: "text-accent", bg: "bg-accent/10" },
    { label: "Clarification", count: analysis.needsClarification.length, icon: HelpCircle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Missing", count: analysis.missingScope.length, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
    { label: "Red Flags", count: analysis.redFlags.length, icon: Shield, color: analysis.redFlags.length > 0 ? "text-red-500" : "text-accent", bg: analysis.redFlags.length > 0 ? "bg-red-50" : "bg-accent/10" },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-white p-5">
            <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
              <c.icon className={`h-4.5 w-4.5 ${c.color}`} />
            </div>
            <p className="text-2xl font-display font-bold text-ink">{c.count}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Present Items */}
      <div className="rounded-xl border border-border bg-white p-6">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-4 w-4 text-accent" /> What's Included
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {analysis.presentItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/5">
              <Check className="h-3.5 w-3.5 text-accent shrink-0" />
              <span className="text-sm text-ink">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Needs Clarification */}
      {analysis.needsClarification.length > 0 && (
        <div className="rounded-xl border border-border bg-white p-6">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2 mb-4">
            <HelpCircle className="h-4 w-4 text-amber-500" /> Needs Clarification
          </h3>
          <div className="space-y-3">
            {analysis.needsClarification.map((item, i) => (
              <div key={i} className="p-4 rounded-lg border border-amber-100 bg-amber-50/50">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-amber-600 text-xs font-bold">⚠</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Found as: "{item.matchedAs}"</p>
                    <p className="text-sm text-amber-800 mt-2">{item.question}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Items */}
      {analysis.missingScope.length > 0 && (
        <div className="rounded-xl border border-border bg-white p-6">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-red-500" /> Missing From Quote
          </h3>
          <div className="space-y-3">
            {analysis.missingScope.map((item, i) => (
              <div key={i} className="p-4 rounded-lg border border-red-100 bg-red-50/50">
                <p className="text-sm font-semibold text-ink">{item.title.replace("Missing: ", "")}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.explanation}</p>
                <p className="text-xs text-red-700 mt-2 font-medium">→ {item.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags */}
      <div className="rounded-xl border border-border bg-white p-6">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-[#082A4B]" /> Red Flags
        </h3>
        {analysis.redFlags.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/5">
            <CheckCircle2 className="h-5 w-5 text-accent" />
            <p className="text-sm text-ink">No red flags detected in this quote.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {analysis.redFlags.map((flag, i) => (
              <div key={i} className="p-4 rounded-lg border border-red-100 bg-red-50/50">
                <p className="text-sm font-semibold text-red-700">{flag.title}</p>
                <p className="text-xs text-red-600 mt-1">{flag.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="rounded-xl border border-border bg-white p-6">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent" /> Expert Recommendations
          </h3>
          <div className="space-y-2">
            {analysis.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-ink/80">
                <ArrowRight className="h-3.5 w-3.5 text-accent mt-1 shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Scope Review Tab ─────────────────────────────────────────────────────────
function ScopeReviewTab({ analysis, expandedCards, setExpandedCards, onAskAI }: {
  analysis: QuoteAnalysis;
  expandedCards: Set<string>;
  setExpandedCards: (s: Set<string>) => void;
  onAskAI: () => void;
}) {
  const allItems: ScopeCard[] = [
    ...analysis.presentItems.map((i) => ({ name: i.name, status: "present" as const, matchedAs: i.matchedAs })),
    ...analysis.needsClarification.map((i) => ({ name: i.name, status: "clarification" as const, matchedAs: i.matchedAs, question: i.question })),
    ...analysis.missingScope.map((i) => ({ name: i.title.replace("Missing: ", ""), status: "missing" as const, description: i.explanation, recommendation: i.recommendation })),
  ];

  const toggle = (name: string) => {
    const next = new Set(expandedCards);
    if (next.has(name)) next.delete(name); else next.add(name);
    setExpandedCards(next);
  };

  const statusBadge = (status: string) => {
    if (status === "present") return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/10 text-accent">✅ Present</span>;
    if (status === "clarification") return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600">⚠ Clarify</span>;
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-500">❌ Missing</span>;
  };

  return (
    <div className="max-w-3xl space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        {allItems.length} scope items reviewed. Click to expand.
      </p>
      {allItems.map((item) => {
        const isOpen = expandedCards.has(item.name);
        return (
          <div key={item.name} className="rounded-xl border border-border bg-white overflow-hidden transition-shadow hover:shadow-sm">
            <button
              onClick={() => toggle(item.name)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                {statusBadge(item.status)}
                <span className="text-sm font-semibold text-ink">{item.name}</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 pt-0 border-t border-border/50 animate-in fade-in duration-200">
                {item.matchedAs && item.matchedAs !== item.name && (
                  <p className="text-xs text-muted-foreground mb-2">Found in quote as: "{item.matchedAs}"</p>
                )}
                {item.question && <p className="text-sm text-amber-700 mb-2">{item.question}</p>}
                {item.description && <p className="text-sm text-ink/70 mb-2">{item.description}</p>}
                {item.recommendation && <p className="text-sm text-red-700 mb-2">→ {item.recommendation}</p>}
                <button onClick={onAskAI} className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline">
                  <MessageCircle className="h-3 w-3" /> Ask AI about this
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ─── Quote Explorer Tab ───────────────────────────────────────────────────────
function QuoteExplorerTab({ extraction, analysis, selectedRow, setSelectedRow }: {
  extraction: QuoteAnalysisResult["extraction"];
  analysis: QuoteAnalysis;
  selectedRow: number | null;
  setSelectedRow: (r: number | null) => void;
}) {
  const allItems = [
    ...extraction.materials.map((m) => ({ name: m.name, qty: m.quantity, unit: m.unit, price: m.totalPrice, type: "material" as const })),
    ...extraction.scopeItems.map((s) => ({ name: s.name, qty: s.quantity, unit: s.unit, price: s.totalPrice, type: "scope" as const })),
  ];

  const getStatus = (name: string) => {
    if (analysis.presentItems.some((i) => i.matchedAs?.toLowerCase() === name.toLowerCase() || i.name.toLowerCase() === name.toLowerCase())) return "matched";
    if (analysis.needsClarification.some((i) => i.matchedAs?.toLowerCase() === name.toLowerCase())) return "clarify";
    return "unmatched";
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{allItems.length} line items extracted from quote</p>
        {extraction.totalPrice > 0 && (
          <span className="text-sm font-bold text-ink">Total: ${extraction.totalPrice.toLocaleString()}</span>
        )}
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Item</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Qty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {allItems.map((item, i) => {
                const status = getStatus(item.name);
                return (
                  <tr
                    key={i}
                    onClick={() => setSelectedRow(selectedRow === i ? null : i)}
                    className={`border-b border-border/50 cursor-pointer transition ${selectedRow === i ? "bg-accent/5" : "hover:bg-muted/20"}`}
                  >
                    <td className="px-4 py-3 font-medium text-ink">{item.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.qty > 0 ? `${item.qty} ${item.unit}` : "—"}</td>
                    <td className="px-4 py-3 text-ink">{item.price > 0 ? `$${item.price.toLocaleString()}` : "—"}</td>
                    <td className="px-4 py-3">
                      {status === "matched" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/10 text-accent">Matched</span>}
                      {status === "clarify" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600">Clarify</span>}
                      {status === "unmatched" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">Unmatched</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {selectedRow !== null && allItems[selectedRow] && (
        <div className="mt-4 rounded-xl border border-border bg-white p-5 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-ink">{allItems[selectedRow].name}</h4>
            <button onClick={() => setSelectedRow(null)} className="text-muted-foreground hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-muted/30"><span className="text-muted-foreground">Type</span><br /><span className="font-medium text-ink">{allItems[selectedRow].type}</span></div>
            <div className="p-2.5 rounded-lg bg-muted/30"><span className="text-muted-foreground">Quantity</span><br /><span className="font-medium text-ink">{allItems[selectedRow].qty || "—"} {allItems[selectedRow].unit}</span></div>
            <div className="p-2.5 rounded-lg bg-muted/30"><span className="text-muted-foreground">Price</span><br /><span className="font-medium text-ink">{allItems[selectedRow].price > 0 ? `$${allItems[selectedRow].price.toLocaleString()}` : "—"}</span></div>
            <div className="p-2.5 rounded-lg bg-muted/30"><span className="text-muted-foreground">Status</span><br /><span className="font-medium text-ink capitalize">{getStatus(allItems[selectedRow].name)}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Questions Tab ────────────────────────────────────────────────────────────
function QuestionsTab({ analysis }: { analysis: QuoteAnalysis }) {
  const [openCat, setOpenCat] = useState<string | null>(null);

  // Group questions by category keywords
  const categorize = (q: string): string => {
    const ql = q.toLowerCase();
    if (ql.includes("warranty") || ql.includes("guarantee")) return "Warranty";
    if (ql.includes("flash") || ql.includes("penetration")) return "Flashing";
    if (ql.includes("vent") || ql.includes("soffit") || ql.includes("ridge")) return "Ventilation";
    if (ql.includes("material") || ql.includes("shingle") || ql.includes("underlayment")) return "Materials";
    if (ql.includes("permit") || ql.includes("inspection") || ql.includes("code")) return "Permits & Codes";
    if (ql.includes("install") || ql.includes("weather") || ql.includes("protect") || ql.includes("timeline")) return "Installation";
    return "General";
  };

  const grouped: Record<string, string[]> = {};
  for (const q of analysis.questionsToAsk) {
    const cat = categorize(q);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(q);
  }

  const categoryIcons: Record<string, typeof Shield> = {
    Warranty: Shield,
    Flashing: Wrench,
    Ventilation: TrendingUp,
    Materials: Star,
    "Permits & Codes": FileText,
    Installation: Clock,
    General: HelpCircle,
  };

  return (
    <div className="max-w-3xl space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        {analysis.questionsToAsk.length} questions organized by category. Ask these before signing.
      </p>
      {Object.entries(grouped).map(([cat, questions]) => {
        const Icon = categoryIcons[cat] ?? HelpCircle;
        const isOpen = openCat === cat;
        return (
          <div key={cat} className="rounded-xl border border-border bg-white overflow-hidden">
            <button
              onClick={() => setOpenCat(isOpen ? null : cat)}
              className="w-full flex items-center justify-between px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#082A4B]/5 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-[#082A4B]" />
                </div>
                <span className="text-sm font-semibold text-ink">{cat}</span>
                <span className="text-xs text-muted-foreground">{questions.length} questions</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 space-y-2.5 border-t border-border/50 pt-3 animate-in fade-in duration-200">
                {questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-ink/80">
                    <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ─── Timeline Tab ─────────────────────────────────────────────────────────────
function TimelineTab({ analysis }: { analysis: QuoteAnalysis }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id); else next.add(id);
    setChecked(next);
  };

  const phases = [
    {
      title: "Before Signing",
      icon: FileText,
      tasks: [
        { id: "q1", label: "Get clarification on all ⚠ items" },
        { id: "q2", label: "Ask all contractor questions" },
        { id: "q3", label: "Confirm permit responsibility" },
        { id: "q4", label: "Get workmanship warranty in writing" },
        { id: "q5", label: "Verify contractor license & insurance" },
        { id: "q6", label: "Compare with at least 2 other quotes" },
      ],
    },
    {
      title: "During Installation",
      icon: Wrench,
      tasks: [
        { id: "d1", label: "Document existing condition with photos" },
        { id: "d2", label: "Confirm deck inspection after tear-off" },
        { id: "d3", label: "Verify weather protection if work spans multiple days" },
        { id: "d4", label: "Check materials match what was quoted" },
        { id: "d5", label: "Request progress photos at each phase" },
      ],
    },
    {
      title: "After Completion",
      icon: CheckCircle2,
      tasks: [
        { id: "a1", label: "Walk through final inspection with contractor" },
        { id: "a2", label: "Obtain warranty documentation" },
        { id: "a3", label: "File permit close-out if applicable" },
        { id: "a4", label: "Notify insurance of completed work" },
        { id: "a5", label: "Save all receipts and documentation" },
      ],
    },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      {phases.map((phase) => {
        const Icon = phase.icon;
        const done = phase.tasks.filter((t) => checked.has(t.id)).length;
        return (
          <div key={phase.title} className="rounded-xl border border-border bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#082A4B]/5 flex items-center justify-center">
                <Icon className="h-4.5 w-4.5 text-[#082A4B]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">{phase.title}</h3>
                <p className="text-[10px] text-muted-foreground">{done}/{phase.tasks.length} completed</p>
              </div>
              {/* Progress bar */}
              <div className="flex-1 h-1.5 rounded-full bg-border ml-4">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(done / phase.tasks.length) * 100}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              {phase.tasks.map((task) => (
                <label
                  key={task.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${checked.has(task.id) ? "bg-accent/5" : "hover:bg-muted/30"}`}
                >
                  <input
                    type="checkbox"
                    checked={checked.has(task.id)}
                    onChange={() => toggle(task.id)}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <span className={`text-sm ${checked.has(task.id) ? "line-through text-muted-foreground" : "text-ink"}`}>
                    {task.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}


// ─── AI Chat Panel ────────────────────────────────────────────────────────────
function AIChatPanel({ analysis, extraction, onClose, apiKey }: {
  analysis: QuoteAnalysis;
  extraction: QuoteAnalysisResult["extraction"];
  onClose: () => void;
  apiKey: string;
}) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => endRef.current?.scrollIntoView({ behavior: "smooth" });

  const suggestions = [
    "Is this price fair for my area?",
    "Explain the missing items",
    "What should I negotiate?",
    "Generate a contractor email",
    "Explain the building codes",
    "Compare with industry average",
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = { role: "user" as const, text: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);
    setTimeout(scrollToBottom, 50);

    try {
      // Build a concise context summary to prepend to the user's actual question
      const contextSummary = [
        `Project: ${extraction.projectType} quote`,
        extraction.contractor ? `Contractor: ${extraction.contractor}` : "",
        `Score: ${analysis.summary.completenessScore}%`,
        `Included: ${analysis.presentItems.map((i) => i.name).join(", ")}`,
        analysis.needsClarification.length > 0 ? `Needs clarification: ${analysis.needsClarification.map((i) => i.name).join(", ")}` : "",
        analysis.missingScope.length > 0 ? `Missing: ${analysis.missingScope.map((i) => i.title.replace("Missing: ", "")).join(", ")}` : "",
        extraction.totalPrice > 0 ? `Total price: $${extraction.totalPrice.toLocaleString()}` : "",
        analysis.redFlags.length > 0 ? `Red flags: ${analysis.redFlags.map((f) => f.title).join(", ")}` : "No red flags",
      ].filter(Boolean).join(". ");

      // Convert conversation history to ChatMessage format
      // First message includes context, subsequent messages are just the conversation
      const chatMsgs: ChatMessage[] = newMessages.map((m, idx) => ({
        role: m.role === "ai" ? "assistant" as const : "user" as const,
        content: idx === 0 && newMessages.length === 1
          ? `[Quote Analysis Context: ${contextSummary}]\n\nMy question: ${m.text}`
          : m.text,
      }));

      // If this is not the first message, prepend context as first exchange
      if (newMessages.length > 1) {
        chatMsgs.unshift(
          { role: "user", content: `I just analyzed a contractor quote. Here's the summary: ${contextSummary}` },
          { role: "assistant", content: "I have your quote analysis context. Ask me anything about it." },
        );
      }

      const projectType = extraction.projectType as any;
      const response = await chatWithKnowledge(chatMsgs, apiKey, projectType || undefined);
      setMessages((prev) => [...prev, { role: "ai", text: response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#082A4B]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-bold text-white">CostReno AI</span>
          <span className="px-1.5 py-0.5 rounded bg-accent/30 text-[9px] text-white font-bold">QUOTE CONTEXT</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center">
          <X className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-4">Ask follow-up questions about your quote analysis.</p>
            <div className="space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="w-full text-left px-4 py-2.5 rounded-xl border border-border hover:border-accent/40 hover:bg-accent/5 text-sm text-ink transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === "user" ? "bg-accent text-white rounded-br-md" : "bg-muted text-ink rounded-bl-md"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-muted">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-border p-2 focus-within:ring-2 focus-within:ring-accent/30">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) sendMessage(input); }}
            placeholder="Ask about your quote..."
            className="flex-1 bg-transparent text-sm outline-none px-2 text-ink"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white hover:bg-accent/90 disabled:opacity-50 transition"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
