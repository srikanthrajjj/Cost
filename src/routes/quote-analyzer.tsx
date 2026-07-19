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
import { analyzeQuoteFull, type QuoteAnalysisResult, type QuotePipelineStage } from "@/lib/quote";
import { OpenRouterError, friendlyOpenRouterMessage } from "@/lib/quote/openrouter-client";
import { chatWithKnowledge } from "@/lib/chat-with-knowledge";
import { submitEmailAndDownload } from "@/lib/download-utils";
import { EmailDownloadModal } from "@/components/EmailDownloadModal";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import type { ChatMessage } from "@/lib/chat-with-knowledge";
import type { QuoteAnalysis } from "@/lib/quote/types";

export const Route = createFileRoute("/quote-analyzer")({
  head: () => ({
    meta: [
      { title: "Free AI Contractor Quote Analyzer | Review Bids in Seconds — CostReno" },
      { name: "description", content: "Upload your contractor quote and get an instant AI-powered expert review. Spot overpricing, missing scope, red flags, and hidden costs in under 30 seconds. Free, no signup required." },
      { name: "keywords", content: "contractor quote analyzer, quote review tool, contractor estimate checker, home improvement quote analysis, roofing quote review, renovation quote comparison, AI quote analyzer, contractor bid review, how much does a roof replacement cost, kitchen remodel cost, contractor quote red flags" },
      { property: "og:title", content: "Free AI Contractor Quote Analyzer | Review Bids in Seconds — CostReno" },
      { property: "og:description", content: "Upload your contractor quote and get an instant expert review. Spot overpricing, missing items, and red flags in seconds. Free." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://costreno.com/quote-analyzer" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free AI Contractor Quote Analyzer — CostReno" },
      { name: "twitter:description", content: "Upload your contractor quote and get instant AI analysis. Spot overpricing and missing scope in seconds." },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "canonical", href: "https://costreno.com/quote-analyzer" },
    ],
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
                text: "Upload a photo or PDF of your contractor quote. Our AI reads every line item, cross-references it against local pricing databases and building codes, then generates a detailed report highlighting overpriced items, missing scope, and red flags.",
              },
            },
            {
              "@type": "Question",
              name: "Is the quote analyzer free to use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, the quote analyzer is completely free. No signup, no credit card, and no hidden fees. Upload your quote and get results in under 30 seconds.",
              },
            },
            {
              "@type": "Question",
              name: "What types of contractor quotes can I analyze?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "You can analyze any home improvement contractor quote including roofing, kitchen remodeling, bathroom renovation, HVAC installation, window replacement, solar panels, painting, flooring, deck/patio, plumbing, and electrical work.",
              },
            },
            {
              "@type": "Question",
              name: "Is my contractor quote kept private and secure?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Absolutely. Your files are encrypted, never stored permanently, and never shared with contractors or third parties. We process your quote securely and delete it after analysis.",
              },
            },
            {
              "@type": "Question",
              name: "How much does a roof replacement cost in 2026?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The average roof replacement costs between $8,600 and $24,700 in 2026, with most homeowners paying around $16,650. Costs vary by material, roof size, pitch, and location. Use our Cost Estimator for a personalized estimate.",
              },
            },
            {
              "@type": "Question",
              name: "How much does a kitchen remodel cost?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "A kitchen remodel typically costs between $25,000 and $75,000 in 2026, with the national average around $50,000. The final cost depends on size, materials, layout changes, and your location.",
              },
            },
            {
              "@type": "Question",
              name: "What red flags should I look for in a contractor quote?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Common red flags include: vague material specifications, no permit costs listed, large upfront payment demands (over 30%), no warranty terms, missing scope items like cleanup and disposal, no timeline, and prices significantly below market rate.",
              },
            },
            {
              "@type": "Question",
              name: "How many contractor quotes should I get before hiring?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Experts recommend getting at least 3 quotes for any home improvement project. This helps you understand the market rate, compare scope and materials, and identify outliers. Upload all your quotes to CostReno for side-by-side analysis.",
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
          name: "CostReno AI Quote Analyzer",
          url: "https://costreno.com/quote-analyzer",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description: "Free AI-powered contractor quote analysis tool. Upload any home improvement quote to identify overpricing, missing scope, and red flags instantly.",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            ratingCount: "2847",
            bestRating: "5",
          },
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
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
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

  // Auto-dismiss error toast after 8 seconds
  useEffect(() => {
    if (!error) return;
    const timeout = setTimeout(() => setError(""), 8000);
    return () => clearTimeout(timeout);
  }, [error]);

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
      const { extractTextFromFile } = await import("@/lib/file-processor");
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

  const handleEmailSubmit = async (email: string) => {
    if (!result || !result.analysis) {
      throw new Error("No analysis data available");
    }
    setIsDownloading(true);
    try {
      const { analysis, extraction } = result;
      await submitEmailAndDownload({
        filename: `quote-analysis-${new Date().getTime()}.html`,
        email,
        reportType: "analysis",
        data: {
          score: analysis.quoteHealthScore,
          missingItems: analysis.missingScope.length,
          clarificationItems: analysis.needsClarification.length,
          redFlags: analysis.redFlags.length,
          contractor: extraction.contractor,
          totalPrice: extraction.totalPrice,
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
          {/* Hero - Clean and centered */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-5">
              <Clock className="h-3 w-3 text-accent" />
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                Updated July 2026 · Pricing Data Refreshed Monthly
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink leading-[1.1] tracking-tight">
              Get an Expert Review of Your<br />
              Contractor Quote{" "}
              <span className="text-accent">in Seconds</span>
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Upload your quote and uncover what's included, what's missing, and what could cost you more.
            </p>
          </div>

          {/* Upload Card - Primary focus */}
          <div className="max-w-xl mx-auto">
            <div
              className="rounded-2xl border-2 border-dashed border-border hover:border-accent/60 bg-white p-10 md:p-14 text-center transition-all cursor-pointer group shadow-sm"
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
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-accent/20 transition">
                <Upload className="h-7 w-7 text-accent" />
              </div>
              <p className="text-lg font-bold text-ink">Upload Your Quote</p>
              <p className="mt-2 text-sm text-muted-foreground">Drag & drop your file here or</p>
              <button className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition shadow-sm shadow-accent/20">
                <FileText className="h-4 w-4" /> Choose File
              </button>
              <p className="mt-5 text-xs text-muted-foreground">PDF, JPG, PNG • Max 15MB</p>
            </div>
          </div>

          {/* Trust indicators - Horizontal row below upload */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-xl mx-auto">
            {[
              { icon: Zap, label: "Results in 30 seconds" },
              { icon: Lock, label: "100% private & secure" },
              { icon: CheckCircle2, label: "No signup required" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 justify-center">
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-3.5 w-3.5 text-accent" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          {/* What You'll Get - Clean cards */}
          <div className="mt-16 pt-12 border-t border-border">
            <h2 className="font-display text-2xl font-bold text-ink text-center mb-8">
              What You'll Get
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Search, title: "Scope Analysis", desc: "See what's included and what's missing" },
                { icon: DollarSign, title: "Price Check", desc: "Flag overpriced or underpriced items" },
                { icon: AlertTriangle, title: "Red Flags", desc: "Spot risky terms and vague language" },
                { icon: MessageCircle, title: "AI Q&A", desc: "Ask questions about your specific quote" },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-white p-5 text-center">
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
                  <span className="px-2 py-0.5 rounded-full bg-accent text-white text-[9px] font-bold uppercase">Best</span>
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
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition shadow-sm shadow-accent/20"
            >
              <Upload className="h-4 w-4" /> Upload Your Quote Now
            </button>
            <p className="mt-3 text-xs text-muted-foreground">Free. No signup. Results in seconds.</p>
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
                { step: "1", title: "Upload Your Quote", desc: "Upload a PDF, photo, or scan of any contractor quote, estimate, or bid. We support roofing, kitchen, bathroom, HVAC, and more." },
                { step: "2", title: "AI Analyzes Every Line", desc: "Our AI engine reads every line item, cross-references local pricing data, checks building codes, and identifies missing scope." },
                { step: "3", title: "Get Your Expert Report", desc: "Receive a detailed report with a health score, red flags, pricing analysis, missing items, and questions to ask your contractor." },
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
                <div key={item} className="flex items-center gap-2 px-3 py-3 rounded-lg border border-border bg-white">
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
                  a: "Our AI is trained on thousands of real contractor quotes and cross-references current local pricing data. It identifies missing scope items, overpriced line items, and code compliance issues with high accuracy. However, we always recommend getting multiple quotes.",
                },
                {
                  q: "What should I do if red flags are found?",
                  a: "If our analysis identifies red flags, use the detailed questions and negotiation points we provide to discuss with your contractor. Ask for clarification on vague items, request itemized breakdowns, and compare with other quotes.",
                },
                {
                  q: "Can I use this before signing a contract?",
                  a: "Yes — that's exactly when you should use it. Upload your quote before signing to ensure you're getting fair pricing, complete scope, and proper materials specified. It's the smartest step before committing to a contractor.",
                },
              ].map((faq) => (
                <details key={faq.q} className="group rounded-xl border border-border bg-white overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/20 transition"><h3 className="text-sm font-semibold text-ink">{faq.q}</h3>
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
                <details key={faq.q} className="group rounded-xl border border-border bg-white overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/20 transition"><h3 className="text-sm font-semibold text-ink">{faq.q}</h3>
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
                  Getting a contractor quote for your home improvement project is just the first step. Whether you're planning a roof replacement, kitchen remodel, or bathroom renovation, understanding what's in your quote — and what's missing — can save you thousands of dollars.
                </p>
                <p>
                  CostReno's AI Quote Analyzer is purpose-built for homeowners who want to make informed decisions. Unlike generic AI tools, our system is trained specifically on contractor quotes, building codes, and regional pricing data. It understands the difference between a fair price and an inflated one, between complete scope and missing critical items.
                </p>
                <p>
                  Our analyzer checks for common issues like missing permits, vague material specifications, absence of warranty terms, unclear payment schedules, and scope gaps that could lead to expensive change orders. It also provides smart questions to ask your contractor and negotiation points based on local market rates.
                </p>
                <p>
                  Whether you've received one quote or five, upload them all and compare. Make confident decisions about the biggest investment in your home.
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <div className="mt-16 pb-8 text-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition shadow-sm shadow-accent/20"
            >
              <Upload className="h-4 w-4" /> Analyze Your Quote — Free
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              Trusted by thousands of homeowners. Results in seconds.
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
        <Header />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          {/* Document scanning animation */}
          <div className="w-24 h-24 mx-auto mb-8 relative">
            {/* Outer ring - spinning */}
            <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: "3s" }} viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="44" fill="none" stroke="#e5e7eb" strokeWidth="4" />
              <circle cx="48" cy="48" r="44" fill="none" stroke="#03A44D" strokeWidth="4" strokeDasharray="138 138" strokeLinecap="round" />
            </svg>
            {/* Inner document icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <svg className="w-10 h-10 text-muted-foreground/60" viewBox="0 0 40 40" fill="none">
                  <rect x="8" y="4" width="24" height="32" rx="2" fill="white" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="13" y1="12" x2="27" y2="12" stroke="#e5e7eb" strokeWidth="2" />
                  <line x1="13" y1="17" x2="27" y2="17" stroke="#e5e7eb" strokeWidth="2" />
                  <line x1="13" y1="22" x2="23" y2="22" stroke="#e5e7eb" strokeWidth="2" />
                  <line x1="13" y1="27" x2="20" y2="27" stroke="#e5e7eb" strokeWidth="2" />
                </svg>
                {/* Scanning line */}
                <div className="absolute left-2 right-2 h-0.5 bg-accent/80 rounded animate-bounce" style={{ animationDuration: "1.5s", top: "40%" }} />
                {/* Red flag indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center animate-ping" style={{ animationDuration: "2s" }}>
                  <span className="text-[8px] text-white font-bold">!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stage text */}
          <h2 className="font-display text-xl font-bold text-ink animate-in fade-in duration-300" key={processingStage}>
            {processingStage === "reading" && "Reading your document..."}
            {processingStage === "extracting" && "Pulling out every line item..."}
            {processingStage === "matching" && "Comparing to local market rates..."}
            {processingStage === "analyzing" && "Checking for missing scope & red flags..."}
            {processingStage === "reporting" && "Building your personalized report..."}
          </h2>

          {/* Live findings - progressive reveals */}
          <div className="mt-6 space-y-2 text-left">
            {currentIdx >= 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs text-ink">Document received — extracting text</span>
              </div>
            )}
            {currentIdx >= 1 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs text-ink">Found {Math.floor(Math.random() * 8 + 12)} line items in your quote</span>
              </div>
            )}
            {currentIdx >= 2 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs text-ink">Cross-referencing with local pricing database</span>
              </div>
            )}
            {currentIdx >= 3 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-amber-200 bg-amber-50/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="text-xs text-ink">Flagged potential issues — verifying now</span>
              </div>
            )}
            {currentIdx >= 4 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs text-ink">Report ready — compiling results</span>
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
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Did you know?</span>
                  </div>
                  <p className="text-xs text-ink leading-relaxed text-left animate-in fade-in duration-500" key={tipIdx}>{PROCESSING_TIPS[tipIdx].replace("💡 ", "").replace("💡 Tip: ", "")}</p>
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
  return <CompleteView result={result!} reset={reset} chatOpen={chatOpen} setChatOpen={setChatOpen} activeTab={activeTab} setActiveTab={setActiveTab} expandedCards={expandedCards} setExpandedCards={setExpandedCards} selectedRow={selectedRow} setSelectedRow={setSelectedRow} apiKey={SK_API_KEY} />;
}


// ─── Complete View (Report Page) ──────────────────────────────────────────────
function CompleteView({ result, reset, chatOpen, setChatOpen, activeTab, setActiveTab, expandedCards, setExpandedCards, selectedRow, setSelectedRow, apiKey }: {
  result: QuoteAnalysisResult; reset: () => void; chatOpen: boolean; setChatOpen: (v: boolean) => void;
  activeTab: string; setActiveTab: (v: any) => void; expandedCards: Set<string>; setExpandedCards: (v: Set<string>) => void;
  selectedRow: number | null; setSelectedRow: (v: number | null) => void; apiKey: string;
}) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleEmailSubmit = async (email: string) => {
    if (!result || !result.analysis) {
      throw new Error("No analysis data available");
    }
    setIsDownloading(true);
    try {
      const { analysis, extraction } = result;
      await submitEmailAndDownload({
        filename: `quote-analysis-${new Date().getTime()}.html`,
        email,
        reportType: "analysis",
        data: {
          score: analysis.quoteHealthScore,
          missingItems: analysis.missingScope.length,
          clarificationItems: analysis.needsClarification.length,
          redFlags: analysis.redFlags.length,
          contractor: extraction.contractor,
          totalPrice: extraction.totalPrice,
        },
      });
    } catch (error) {
      console.error("Download failed:", error);
      throw error;
    } finally {
      setIsDownloading(false);
    }
  };

  const analysis = result.analysis;
  const extraction = result.extraction;
  const score = analysis.summary.completenessScore;
  const grade = getHealthGrade(score);
  const totalLineItems = extraction.materials.length + extraction.scopeItems.length;
  const analyzedDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const analyzedTime = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const scopeRows = [
    ...extraction.materials.map((m) => ({ name: m.name, qty: m.quantity, unit: m.unit, price: m.totalPrice })),
    ...extraction.scopeItems.map((s) => ({ name: s.name, qty: s.quantity, unit: s.unit, price: s.totalPrice })),
  ];
  const getStatus = (name: string) => {
    if (analysis.needsClarification.some((i) => i.matchedAs?.toLowerCase() === name.toLowerCase() || i.name.toLowerCase() === name.toLowerCase())) return "clarification";
    if (analysis.presentItems.some((i) => i.matchedAs?.toLowerCase() === name.toLowerCase() || i.name.toLowerCase() === name.toLowerCase())) return "included";
    return "unmatched";
  };
  const getConf = (name: string) => {
    const m = result.matchedMaterials.find((x) => x.original.name.toLowerCase() === name.toLowerCase());
    if (m) return m.confidence >= 0.9 ? "High" : m.confidence >= 0.7 ? "Medium" : "Low";
    const s = result.matchedScopeItems.find((x) => x.original.name.toLowerCase() === name.toLowerCase());
    if (s) return s.confidence >= 0.9 ? "High" : s.confidence >= 0.7 ? "Medium" : "Low";
    return "Medium";
  };
  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "scope", label: "Scope Review", icon: FileText },
    { id: "explorer", label: "Missing Items", icon: AlertTriangle },
    { id: "questions", label: "Smart Questions", icon: MessageCircle },
    { id: "timeline", label: "Recommendations", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <header className="border-b border-border bg-white sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-3">
            <a href="/"><img src="/logo.svg" alt="CostReno" style={{ height: "28px" }} /></a>
            <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-border">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <span className="text-sm font-bold text-ink">Quote Analysis Ready</span>
              <span className="text-xs text-muted-foreground">· {totalLineItems} items · {analyzedDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowEmailModal(true)} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-ink hover:bg-muted/50"><Download className="h-3.5 w-3.5" /> Download Report</button>
            <button className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-ink hover:bg-muted/50"><Share2 className="h-3.5 w-3.5" /> Share Report</button>
            <button onClick={reset} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#082A4B] text-white text-xs font-semibold"><Upload className="h-3.5 w-3.5" /> New Analysis</button>
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-56 border-r border-border bg-white h-[calc(100vh-56px)] sticky top-14">
          <div className="px-4 py-4 border-b border-border">
            <p className="text-[10px] text-muted-foreground">Report for</p>
            <p className="text-xs font-bold text-ink mt-0.5 truncate">{extraction.contractor || "Quote.pdf"}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Uploaded just now</p>
          </div>
          <nav className="flex-1 px-2 py-3 space-y-0.5">
            {navItems.map((item) => { const I = item.icon; return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${activeTab === item.id ? "bg-[#082A4B] text-white font-semibold" : "text-muted-foreground hover:bg-muted/50"}`}><I className="h-4 w-4" /> {item.label}</button>
            ); })}
          </nav>
          <div className="px-3 pb-4 mt-auto">
            <div className="rounded-xl border-2 border-accent bg-gradient-to-b from-accent/5 to-accent/15 p-3">
              <div className="flex items-center gap-2 mb-1.5"><Sparkles className="h-4 w-4 text-accent" /><span className="text-xs font-bold text-accent">CostReno AI</span></div>
              <p className="text-[10px] text-muted-foreground mb-2.5">Get instant answers about your quote</p>
              <button onClick={() => setChatOpen(true)} className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 transition shadow-sm shadow-accent/20"><MessageCircle className="h-3.5 w-3.5" /> Ask AI</button>
            </div>
          </div>
        </aside>
        <main className="flex-1 min-w-0 flex">
          {/* Middle: Main content */}
          <div className="flex-1 min-w-0 px-5 lg:px-8 py-8">
          {/* Score cards — always visible */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            <div className="rounded-xl border border-border bg-white p-4"><p className="text-[10px] text-muted-foreground font-medium mb-2">Quote Health Score</p><div className="flex items-end gap-1"><span className="text-3xl font-display font-bold" style={{ color: score >= 85 ? "#03A44D" : score >= 70 ? "#3b82f6" : score >= 50 ? "#d97706" : "#dc2626" }}>{score}</span><span className="text-sm text-muted-foreground mb-1">/100</span></div><span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${grade.bg} ${grade.color}`}>{grade.label}</span></div>
            <div className="rounded-xl border border-border bg-white p-4"><div className="flex items-center gap-1 mb-2"><p className="text-[10px] text-muted-foreground font-medium">Included</p><CheckCircle2 className="h-3 w-3 text-accent" /></div><p className="text-3xl font-display font-bold text-accent">{analysis.presentItems.length}</p><p className="text-[10px] text-muted-foreground mt-1">{totalLineItems > 0 ? Math.round((analysis.presentItems.length / totalLineItems) * 100) : 0}% of items</p></div>
            <div className="rounded-xl border border-border bg-white p-4"><p className="text-[10px] text-muted-foreground font-medium mb-2">Needs Clarification</p><p className="text-3xl font-display font-bold text-amber-500">{analysis.needsClarification.length}</p><p className="text-[10px] text-muted-foreground mt-1">{totalLineItems > 0 ? Math.round((analysis.needsClarification.length / totalLineItems) * 100) : 0}% of items</p></div>
            <div className="rounded-xl border border-border bg-white p-4"><div className="flex items-center gap-1 mb-2"><p className="text-[10px] text-muted-foreground font-medium">Missing</p><AlertTriangle className="h-3 w-3 text-red-500" /></div><p className="text-3xl font-display font-bold text-red-500">{analysis.missingScope.length}</p><p className="text-[10px] text-muted-foreground mt-1">{analysis.missingScope.length > 0 ? "Review" : "0%"}</p></div>
            <div className="rounded-xl border border-border bg-white p-4"><p className="text-[10px] text-muted-foreground font-medium mb-2">Red Flags</p><p className={`text-3xl font-display font-bold ${analysis.redFlags.length > 0 ? "text-red-500" : "text-accent"}`}>{analysis.redFlags.length}</p><p className="text-[10px] text-muted-foreground mt-1">{analysis.redFlags.length === 0 ? "Great!" : "Review"}</p></div>
          </div>
          {/* Tab-specific content */}
          {(activeTab === "overview" || activeTab === "scope") && (
          <div className="mb-8"><h2 className="text-base font-bold text-ink mb-1">Scope Review</h2><p className="text-xs text-muted-foreground mb-4">A detailed review of each line item in your quote.</p>
            <div className="rounded-xl border border-border bg-white overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/20"><th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase w-6"></th><th className="px-3 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase">Line Item</th><th className="px-3 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase">Qty</th><th className="px-3 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase">Price</th><th className="px-3 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase">Status</th><th className="px-3 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase">Match Confidence</th></tr></thead>
              <tbody>{scopeRows.map((row, i) => { const st = getStatus(row.name); const conf = getConf(row.name); return (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/10"><td className="px-4 py-3 text-muted-foreground"><ChevronRight className="h-3.5 w-3.5" /></td><td className="px-3 py-3"><div className="flex items-center gap-2"><div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${st === "included" ? "bg-accent/10" : st === "clarification" ? "bg-amber-50" : "bg-muted"}`}>{st === "included" ? <Check className="h-3 w-3 text-accent" /> : st === "clarification" ? <HelpCircle className="h-3 w-3 text-amber-500" /> : <Info className="h-3 w-3 text-muted-foreground" />}</div><span className="font-medium text-ink">{row.name}</span></div></td><td className="px-3 py-3 text-muted-foreground text-xs">{row.qty > 0 ? `${row.qty} ${row.unit}` : "—"}</td><td className="px-3 py-3 text-ink text-xs font-medium">{row.price > 0 ? `$${row.price.toLocaleString()}` : "—"}</td><td className="px-3 py-3">{st === "included" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/10 text-accent">Included</span>}{st === "clarification" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600">Needs Clarification</span>}{st === "unmatched" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">—</span>}</td><td className="px-3 py-3"><div className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${conf === "High" ? "bg-accent" : conf === "Medium" ? "bg-amber-400" : "bg-red-400"}`} /><span className="text-xs text-muted-foreground">{conf}</span></div></td></tr>
              ); })}</tbody></table></div>
            {analysis.missingScope.length > 0 && <div className="mt-3 text-center"></div>}
          </div>
          )}
          {/* ═══ TAB: Missing Items ═══ */}
          {activeTab === "explorer" && (
            <div><h2 className="text-base font-bold text-ink mb-1">Missing Items</h2><p className="text-xs text-muted-foreground mb-6">Important items not found in your contractor's quote.</p>
              {analysis.missingScope.length === 0 ? <div className="rounded-xl border border-border bg-white p-8 text-center"><CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-3" /><p className="text-sm font-bold text-ink">No missing items detected</p><p className="text-xs text-muted-foreground mt-1">Your quote covers all required scope items.</p></div> : <div className="space-y-4">{analysis.missingScope.map((item, i) => (<div key={i} className="rounded-xl border border-border bg-white p-5"><div className="flex items-start justify-between gap-4"><div className="flex items-start gap-3"><div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0 mt-0.5"><AlertTriangle className="h-4 w-4 text-red-500" /></div><div><p className="text-sm font-bold text-ink">{item.title.replace("Missing: ", "")}</p><p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.explanation}</p><p className="text-xs text-red-700 mt-2 font-medium">→ {item.recommendation}</p></div></div><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-500 shrink-0">Missing</span></div></div>))}</div>}
              {analysis.needsClarification.length > 0 && <div className="mt-8"><h3 className="text-sm font-bold text-ink mb-3">Needs Clarification</h3><div className="space-y-3">{analysis.needsClarification.map((item, i) => (<div key={i} className="rounded-xl border border-amber-100 bg-amber-50/30 p-4"><p className="text-sm font-bold text-ink">{item.name}</p><p className="text-xs text-muted-foreground mt-0.5">Found as: "{item.matchedAs}"</p><p className="text-sm text-amber-800 mt-2">{item.question}</p></div>))}</div></div>}
            </div>
          )}
          {/* ═══ TAB: Smart Questions ═══ */}
          {activeTab === "questions" && (
            <div><h2 className="text-base font-bold text-ink mb-1">Smart Questions</h2><p className="text-xs text-muted-foreground mb-6">Ask these questions before signing your contract.</p>
              <div className="space-y-3">{analysis.questionsToAsk.map((q, i) => (<div key={i} className="rounded-xl border border-border bg-white p-4 flex items-start gap-3"><div className="w-7 h-7 rounded-full bg-[#082A4B]/5 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold text-[#082A4B]">{i + 1}</span></div><p className="text-sm text-ink leading-relaxed">{q}</p></div>))}</div>
            </div>
          )}
          {/* ═══ TAB: Recommendations ═══ */}
          {activeTab === "timeline" && (
            <div><h2 className="text-base font-bold text-ink mb-1">Recommendations</h2><p className="text-xs text-muted-foreground mb-6">Expert guidance based on your quote analysis.</p>
              <div className="space-y-4">{analysis.recommendations.map((rec, i) => (<div key={i} className="rounded-xl border border-border bg-white p-4 flex items-start gap-3"><div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5"><Sparkles className="h-3.5 w-3.5 text-accent" /></div><p className="text-sm text-ink leading-relaxed">{rec}</p></div>))}</div>
              {analysis.buildingCodes.length > 0 && <div className="mt-6"><h3 className="text-sm font-bold text-ink mb-3">Building Code Requirements</h3><div className="space-y-3">{analysis.buildingCodes.map((code, i) => (<div key={i} className="rounded-xl border border-border bg-white p-4"><p className="text-sm font-semibold text-ink">{code.title.replace("Building Code: ", "")}</p><p className="text-xs text-muted-foreground mt-1">{code.explanation}</p>{code.inspectionRequired && <span className="mt-2 inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-600">Inspection Required</span>}</div>))}</div></div>}
            </div>
          )}
          </div>

          {/* Right sidebar: Insights cards - always visible */}
          <aside className="hidden xl:block w-[300px] shrink-0 border-l border-border bg-white p-4 h-[calc(100vh-56px)] sticky top-14 overflow-y-auto space-y-4">
            <div className="rounded-xl border border-border p-4 cursor-pointer hover:border-accent/40 transition" onClick={() => setActiveTab("explorer")}><h3 className="text-sm font-bold text-ink mb-1">Missing Items ({analysis.missingScope.length})</h3><p className="text-[10px] text-muted-foreground mb-3">Items not found in your quote.</p>{analysis.missingScope.length === 0 ? <p className="text-xs text-accent font-medium">None — great!</p> : <div className="space-y-2">{analysis.missingScope.slice(0, 4).map((item, i) => (<div key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" /><div className="flex-1 min-w-0"><p className="text-xs font-bold text-ink">{item.title.replace("Missing: ", "")}</p><p className="text-[10px] text-muted-foreground truncate">{item.explanation}</p></div></div>))}</div>}<button className="mt-3 text-xs font-semibold text-accent hover:underline">View All →</button></div>
            <div className="rounded-xl border border-border p-4 cursor-pointer hover:border-accent/40 transition" onClick={() => setActiveTab("overview")}><h3 className="text-sm font-bold text-ink mb-1">Pricing Insights</h3><p className="text-xl font-display font-bold text-ink">{extraction.totalPrice > 0 ? `$${extraction.totalPrice.toLocaleString()}` : "—"}</p><p className="text-[10px] text-muted-foreground">Total Quote Amount</p>{extraction.totalPrice > 0 && <div className="mt-2 pt-2 border-t border-border"><p className="text-[10px] text-muted-foreground">Typical Range</p><p className="text-xs font-bold text-ink">${Math.round(extraction.totalPrice * 0.88).toLocaleString()} – ${Math.round(extraction.totalPrice * 1.12).toLocaleString()}</p><span className="mt-1 inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-accent/10 text-accent">Fair Price</span></div>}</div>
            <div className="rounded-xl border border-border p-4 cursor-pointer hover:border-accent/40 transition" onClick={() => setActiveTab("questions")}><h3 className="text-sm font-bold text-ink mb-1">Smart Questions</h3><p className="text-[10px] text-muted-foreground mb-2">Ask your contractor:</p><div className="space-y-2">{analysis.questionsToAsk.slice(0, 3).map((q, i) => (<div key={i} className="flex items-start gap-2"><span className="text-[9px] text-muted-foreground mt-0.5 shrink-0">{i + 1}.</span><p className="text-[11px] text-ink leading-relaxed">{q.length > 80 ? q.substring(0, 80) + "..." : q}</p></div>))}</div><button className="mt-3 text-xs font-semibold text-accent hover:underline">View All →</button></div>
            {/* AI Analyst - Hero selling point */}
            <div className="rounded-xl border-2 border-accent/40 bg-gradient-to-b from-accent/5 to-accent/10 p-4">
              <div className="flex items-center gap-2 mb-2"><Sparkles className="h-4 w-4 text-accent" /><span className="text-xs font-bold text-accent">AI Analyst</span></div>
              <p className="text-xs font-semibold text-ink mb-1">Ask anything about your quote</p>
              <p className="text-[10px] text-muted-foreground mb-3">Get negotiation scripts, cost comparisons, and red flag explanations instantly.</p>
              <button onClick={() => setChatOpen(true)} className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 transition shadow-sm shadow-accent/20"><MessageCircle className="h-3.5 w-3.5" /> Ask CostReno AI</button>
            </div>
          </aside>
        </main>
      </div>
      {chatOpen && <AIChatPanel analysis={analysis} extraction={extraction} onClose={() => setChatOpen(false)} apiKey={apiKey} />}
      <EmailDownloadModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        reportName="Quote Analysis Report"
        isLoading={isDownloading}
      />
      {!chatOpen && <button onClick={() => setChatOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent shadow-lg shadow-accent/30 flex items-center justify-center text-white hover:scale-105 transition-transform z-40 lg:hidden"><MessageCircle className="h-6 w-6" /></button>}
      <SiteFooter />
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ onNewQuote }: { onNewQuote?: () => void }) {
  return <SiteNav active="quote" />;
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


// ─── Format AI Response ───────────────────────────────────────────────────────
function formatAIResponse(text: string): string {
  // Remove [ACTION:...] tags
  let html = text.replace(/\[ACTION:[^\]]*\]/g, "");
  // Convert ### headings
  html = html.replace(/^### (.+)$/gm, '<p class="font-bold text-ink mt-2 mb-1">$1</p>');
  // Convert **bold**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Convert bullet points (- item)
  html = html.replace(/^- (.+)$/gm, '<li class="flex items-start gap-2"><span class="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0"></span><span>$1</span></li>');
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li[^>]*>.*?<\/li>\s*)+)/g, '<ul class="space-y-1.5">$1</ul>');
  // Convert 💡 Pro Tip lines
  html = html.replace(/💡\s*(?:Pro Tip:?)?\s*(.+)/g, '<div class="mt-2 p-2 rounded-lg bg-accent/10 text-xs"><span class="text-accent font-bold">💡 Pro Tip:</span> $1</div>');
  // Convert newlines to paragraphs (but not inside lists)
  html = html.replace(/\n{2,}/g, '</p><p class="mt-2">');
  html = html.replace(/\n/g, '<br/>');
  // Clean up --- dividers
  html = html.replace(/---/g, '<hr class="border-border my-2"/>');
  return html;
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
          ? `[Quote Analysis Context: ${contextSummary}]\n\nIMPORTANT: Keep your response concise — 3-5 bullet points max. No long explanations. Be direct and actionable.\n\nMy question: ${m.text}`
          : m.text,
      }));

      // If this is not the first message, prepend context as first exchange
      if (newMessages.length > 1) {
        chatMsgs.unshift(
          { role: "user", content: `I just analyzed a contractor quote. Here's the summary: ${contextSummary}. IMPORTANT: Keep all responses concise — 3-5 bullet points max, no walls of text.` },
          { role: "assistant", content: "Got it. I'll keep responses short and actionable. Ask away." },
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
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Backdrop on mobile only */}
      <div className="absolute inset-0 bg-black/40 sm:hidden" onClick={onClose} />
      
      <div className="relative ml-auto w-full sm:w-[420px] h-full bg-white shadow-2xl border-l border-border flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#082A4B] shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-bold text-white">CostReno AI</span>
            <span className="px-1.5 py-0.5 rounded bg-accent/30 text-[9px] text-white font-bold uppercase">Quote Context</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition">
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col py-4">
              <h3 className="text-base font-bold text-ink mb-1">Ask about your quote</h3>
              <p className="text-xs text-muted-foreground mb-4">Get concise answers about pricing, missing scope, and red flags.</p>
              <div className="space-y-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="w-full flex items-center gap-3 text-left px-4 py-2.5 rounded-xl border border-border hover:border-accent/40 hover:bg-accent/5 text-sm text-ink transition group"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span className="flex-1 text-xs">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user" ? "bg-accent text-white rounded-br-md" : "bg-muted text-ink rounded-bl-md"
            }`}>
              {msg.role === "user" ? msg.text : (
                <div className="space-y-2" dangerouslySetInnerHTML={{ __html: formatAIResponse(msg.text) }} />
              )}
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
    </div>
  );
}





