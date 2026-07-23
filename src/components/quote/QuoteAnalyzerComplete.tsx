import { useState, useRef, useEffect, Fragment } from "react";
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
  GitCompare,
  Monitor,
} from "lucide-react";
import {
  resolveMarketRange,
  scoreVendorAgainstMarket,
  formatMarketRange,
} from "@/lib/quote/market-scorecard";
import { looksLikeMisparsedLineTotal } from "@/lib/quote/extractor";
import type { QuoteAnalysisResult } from "@/lib/quote";
import { submitEmailAndDownload } from "@/lib/download-utils";
import { EmailDownloadModal } from "@/components/EmailDownloadModal";
import { subscribeToNewsletter } from "@/lib/email/subscribe";
import type { ChatMessage } from "@/lib/chat-with-knowledge";
import { serverChatWithKnowledge } from "@/lib/chat-server";
import {
  getSavedQuoteProgress,
  updateSavedQuoteChecklist,
} from "@/lib/quote/progress-store";
import type { QuoteAnalysis } from "@/lib/quote/types";
import { addComparisonQuote, findMatchingComparisonQuote } from "@/lib/quote/comparison-store";
import { QuoteComparisonTray } from "@/components/quote/QuoteComparisonTray";
import { SiteFooter } from "@/components/SiteFooter";

function getHealthGrade(score: number): { label: string; color: string; bg: string } {
  if (score >= 85) return { label: "Excellent", color: "text-accent", bg: "bg-accent/10" };
  if (score >= 70) return { label: "Good", color: "text-blue-600", bg: "bg-blue-50" };
  if (score >= 50) return { label: "Needs attention", color: "text-amber-600", bg: "bg-amber-50" };
  return { label: "High risk", color: "text-red-600", bg: "bg-red-50" };
}

// ─── Complete View (Report Page) ──────────────────────────────────────────────

export function CompleteView({
  result,
  progressSignature,
  reset,
  chatOpen,
  setChatOpen,
  activeTab,
  setActiveTab,
  expandedCards,
  setExpandedCards,
  selectedRow,
  setSelectedRow,
  expandedRow,
  setExpandedRow,
  onCompare,
}: {
  result: QuoteAnalysisResult;
  progressSignature?: string;
  reset: () => void;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  activeTab: string;
  setActiveTab: (v: any) => void;
  expandedCards: Set<string>;
  setExpandedCards: (v: Set<string>) => void;
  selectedRow: number | null;
  setSelectedRow: (v: number | null) => void;
  expandedRow: number | null;
  setExpandedRow: (v: number | null) => void;
  onCompare: (ids: string[]) => void;
}) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [saveCompareStatus, setSaveCompareStatus] = useState<"idle" | "saved" | "error">("idle");
  const [saveCompareMessage, setSaveCompareMessage] = useState("");

  const handleSaveToCompare = () => {
    try {
      const existing = findMatchingComparisonQuote(result);
      addComparisonQuote(result);
      setSaveCompareStatus("saved");
      setSaveCompareMessage(existing ? "Already saved" : "Saved to compare");
      window.setTimeout(() => {
        setSaveCompareStatus("idle");
        setSaveCompareMessage("");
      }, 2200);
    } catch (error) {
      setSaveCompareStatus("error");
      setSaveCompareMessage(
        error instanceof Error ? error.message : "Could not save quote for comparison.",
      );
      window.setTimeout(() => {
        setSaveCompareStatus("idle");
        setSaveCompareMessage("");
      }, 4000);
    }
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

      const summaryText = `Completeness Score: ${analysis.summary.completenessScore}% | ${analysis.summary.matchedItems} items matched | ${analysis.summary.unmatchedItems} items unmatched | Total: ${analysis.summary.totalItems} items`;

      // Use the same market range scorecard as the dashboard
      const lineItemsWithMarket = [
        ...extraction.materials.map((item) => {
          const vendorPrice = item.totalPrice || 0;
          const matchedMaterial = result.matchedMaterials.find(
            (x) => x.original.name.toLowerCase() === item.name.toLowerCase(),
          );
          const matchedScope = result.matchedScopeItems.find(
            (x) => x.original.name.toLowerCase() === item.name.toLowerCase(),
          );
          const range = resolveMarketRange(item.name, item.quantity, item.unit, [
            matchedMaterial?.knowledge?.cost,
            matchedScope?.knowledge?.typicalCost,
          ]);
          const score = scoreVendorAgainstMarket(vendorPrice, range);
          return {
            name: item.name,
            quantity: item.quantity,
            qty: item.quantity,
            unit: item.unit,
            price: vendorPrice,
            totalPrice: vendorPrice,
            marketPrice: score.marketComparable ? score.marketMid : 0,
            marketLow: score.marketComparable ? score.marketLow : 0,
            marketMid: score.marketComparable ? score.marketMid : 0,
            marketHigh: score.marketComparable ? score.marketHigh : 0,
            marketComparable: score.marketComparable,
            marketStatus: score.label,
          };
        }),
        ...extraction.scopeItems.map((item) => {
          const vendorPrice = item.totalPrice || 0;
          const matchedMaterial = result.matchedMaterials.find(
            (x) => x.original.name.toLowerCase() === item.name.toLowerCase(),
          );
          const matchedScope = result.matchedScopeItems.find(
            (x) => x.original.name.toLowerCase() === item.name.toLowerCase(),
          );
          const range = resolveMarketRange(item.name, item.quantity, item.unit, [
            matchedMaterial?.knowledge?.cost,
            matchedScope?.knowledge?.typicalCost,
          ]);
          const score = scoreVendorAgainstMarket(vendorPrice, range);
          return {
            name: item.name,
            quantity: item.quantity,
            qty: item.quantity,
            unit: item.unit,
            price: vendorPrice,
            totalPrice: vendorPrice,
            marketPrice: score.marketComparable ? score.marketMid : 0,
            marketLow: score.marketComparable ? score.marketLow : 0,
            marketMid: score.marketComparable ? score.marketMid : 0,
            marketHigh: score.marketComparable ? score.marketHigh : 0,
            marketComparable: score.marketComparable,
            marketStatus: score.label,
          };
        }),
      ];

      await submitEmailAndDownload({
        filename: `quote-analysis-${new Date().getTime()}.html`,
        email,
        reportType: "analysis",
        data: {
          score: analysis.summary.completenessScore,
          matchedItems: analysis.summary.matchedItems,
          unmatchedItems: analysis.summary.unmatchedItems,
          totalItems: analysis.summary.totalItems,
          missingItems: analysis.missingScope.length,
          clarificationItems: analysis.needsClarification.length,
          redFlags: analysis.redFlags.length,
          contractor: extraction.contractor,
          totalPrice: extraction.totalPrice,
          projectType: extraction.projectType,
          missingScope: analysis.missingScope,
          needsClarification: analysis.needsClarification,
          redFlagsList: analysis.redFlags,
          lineItems: lineItemsWithMarket,
          presentItems: analysis.presentItems,
          summary: summaryText,
          recommendations: analysis.recommendations,
          questionsToAsk: analysis.questionsToAsk,
          buildingCodes: analysis.buildingCodes,
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
  const analyzedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const analyzedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const knowledgeCostsFor = (name: string): Array<string | undefined> => {
    const matchedMaterial = result.matchedMaterials.find(
      (x) => x.original.name.toLowerCase() === name.toLowerCase(),
    );
    const matchedScope = result.matchedScopeItems.find(
      (x) => x.original.name.toLowerCase() === name.toLowerCase(),
    );
    return [matchedMaterial?.knowledge?.cost, matchedScope?.knowledge?.typicalCost];
  };
  const scopeRows = [
    ...extraction.materials.map((m) => {
      const priceUnreliable = looksLikeMisparsedLineTotal(m.totalPrice, m.quantity, m.unitPrice);
      const vendorPrice = priceUnreliable ? 0 : m.totalPrice;
      const range = resolveMarketRange(m.name, m.quantity, m.unit, knowledgeCostsFor(m.name));
      const score = scoreVendorAgainstMarket(vendorPrice, range, { priceUnreliable });
      return {
        name: m.name,
        qty: m.quantity,
        unit: m.unit,
        unitPrice: m.unitPrice,
        price: vendorPrice,
        rawPrice: m.totalPrice,
        priceUnreliable,
        marketPrice: score.marketMid,
        marketLow: score.marketLow,
        marketMid: score.marketMid,
        marketHigh: score.marketHigh,
        marketComparable: score.marketComparable,
        marketLabel: score.label,
        marketTone: score.tone,
        marketClassName: score.className,
      };
    }),
    ...extraction.scopeItems.map((s) => {
      const unitPrice = s.unitPrice ?? 0;
      const priceUnreliable = looksLikeMisparsedLineTotal(s.totalPrice, s.quantity, unitPrice);
      const vendorPrice = priceUnreliable ? 0 : s.totalPrice;
      const range = resolveMarketRange(s.name, s.quantity, s.unit, knowledgeCostsFor(s.name));
      const score = scoreVendorAgainstMarket(vendorPrice, range, { priceUnreliable });
      return {
        name: s.name,
        qty: s.quantity,
        unit: s.unit,
        unitPrice,
        price: vendorPrice,
        rawPrice: s.totalPrice,
        priceUnreliable,
        marketPrice: score.marketMid,
        marketLow: score.marketLow,
        marketMid: score.marketMid,
        marketHigh: score.marketHigh,
        marketComparable: score.marketComparable,
        marketLabel: score.label,
        marketTone: score.tone,
        marketClassName: score.className,
      };
    }),
  ];
  const scorecardSummary = {
    within: scopeRows.filter((r) => r.marketLabel === "Within range").length,
    above: scopeRows.filter((r) => r.marketLabel === "Above market").length,
    below: scopeRows.filter((r) => r.marketLabel === "Below market").length,
    scored: scopeRows.filter((r) => r.marketComparable).length,
  };
  const getPriceRecommendation = (row: (typeof scopeRows)[number]) => {
    if (row.priceUnreliable) {
      return { label: "Verify price", className: "bg-amber-50 text-amber-600" };
    }
    if (row.price <= 0) {
      return { label: "—", className: "bg-muted text-muted-foreground" };
    }
    if (row.marketComparable) {
      return { label: row.marketLabel, className: row.marketClassName };
    }
    return { label: "—", className: "bg-muted text-muted-foreground" };
  };
  const getStatus = (name: string) => {
    if (
      analysis.needsClarification.some(
        (i) =>
          i.matchedAs?.toLowerCase() === name.toLowerCase() ||
          i.name.toLowerCase() === name.toLowerCase(),
      )
    )
      return "clarification";
    if (
      analysis.presentItems.some(
        (i) =>
          i.matchedAs?.toLowerCase() === name.toLowerCase() ||
          i.name.toLowerCase() === name.toLowerCase(),
      )
    )
      return "included";
    return "unmatched";
  };
  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "explorer", label: "Missing Items", icon: AlertTriangle },
    { id: "questions", label: "Smart Questions", icon: MessageCircle },
    { id: "timeline", label: "Recommendations", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <header className="border-b border-border bg-white sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-3">
            <a href="/">
              <img src="/logo.svg" alt="CostReno" style={{ height: "28px" }} />
            </a>
            <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-border">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <span className="text-sm font-bold text-ink">Quote Analysis Ready</span>
              <span className="text-xs text-muted-foreground">
                · {totalLineItems} items · {analyzedDate}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEmailModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-ink hover:bg-muted/50"
            >
              <Download className="h-3.5 w-3.5" /> Download Report
            </button>
            <button onClick={() => setShowShareModal(true)} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-ink hover:bg-muted/50">
              <Share2 className="h-3.5 w-3.5" /> Share Report
            </button>
            <button
              type="button"
              onClick={handleSaveToCompare}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
                saveCompareStatus === "saved"
                  ? "border-accent bg-accent/10 text-accent"
                  : saveCompareStatus === "error"
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-accent text-accent hover:bg-accent/5"
              }`}
            >
              {saveCompareStatus === "saved" ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> {saveCompareMessage || "Saved"}
                </>
              ) : saveCompareStatus === "error" ? (
                <>
                  <AlertTriangle className="h-3.5 w-3.5" /> Save failed
                </>
              ) : (
                <>
                  <GitCompare className="h-3.5 w-3.5" /> Save to compare
                </>
              )}
            </button>
            <QuoteComparisonTray onCompare={onCompare} onUploadAnother={reset} />
            {saveCompareStatus === "error" && saveCompareMessage && (
              <span className="hidden sm:inline max-w-[180px] text-[10px] text-red-600 leading-snug">
                {saveCompareMessage}
              </span>
            )}
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#082A4B] text-white text-xs font-semibold"
            >
              <Upload className="h-3.5 w-3.5" /> New Analysis
            </button>
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-56 border-r border-border bg-white h-[calc(100vh-56px)] sticky top-14">
          <div className="px-4 py-4 border-b border-border">
            <p className="text-[10px] text-muted-foreground">Report for</p>
            <p className="text-xs font-bold text-ink mt-0.5 truncate">
              {extraction.contractor || "Quote.pdf"}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Uploaded just now</p>
          </div>
          <nav className="flex-1 px-2 py-3 space-y-0.5">
            {navItems.map((item) => {
              const I = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${activeTab === item.id ? "bg-[#082A4B] text-white font-semibold" : "text-muted-foreground hover:bg-muted/50"}`}
                >
                  <I className="h-4 w-4" /> {item.label}
                </button>
              );
            })}
          </nav>
          <div className="px-3 pb-4 mt-auto">
            <div className="rounded-xl border-2 border-accent bg-gradient-to-b from-accent/5 to-accent/15 p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-xs font-bold text-accent">CostReno AI</span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2.5">
                Get instant answers about your quote
              </p>
              <button
                onClick={() => setChatOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 transition shadow-sm shadow-accent/20"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Ask AI
              </button>
            </div>
          </div>
        </aside>
        <main className="flex-1 min-w-0 flex">
          {/* Middle: Main content */}
          <div className="flex-1 min-w-0 px-5 lg:px-8 py-8">
            {/* Score cards — always visible */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8 sticky top-14 z-10 bg-[#f8f9fb] py-4 -mx-5 px-5">
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-[10px] text-muted-foreground font-medium mb-2">
                  Quote Health Score
                </p>
                <div className="flex items-end gap-1">
                  <span
                    className="text-3xl font-display font-bold"
                    style={{
                      color:
                        score >= 85
                          ? "#03A44D"
                          : score >= 70
                            ? "#3b82f6"
                            : score >= 50
                              ? "#d97706"
                              : "#dc2626",
                    }}
                  >
                    {score}
                  </span>
                  <span className="text-sm text-muted-foreground mb-1">/100</span>
                </div>
                <span
                  className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${grade.bg} ${grade.color}`}
                >
                  {grade.label}
                </span>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <div className="flex items-center gap-1 mb-2">
                  <p className="text-[10px] text-muted-foreground font-medium">Included</p>
                  <CheckCircle2 className="h-3 w-3 text-accent" />
                </div>
                <p className="text-3xl font-display font-bold text-accent">
                  {analysis.presentItems.length}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {totalLineItems > 0
                    ? Math.round((analysis.presentItems.length / totalLineItems) * 100)
                    : 0}
                  % of items
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-[10px] text-muted-foreground font-medium mb-2">
                  Needs Clarification
                </p>
                <p className="text-3xl font-display font-bold text-amber-500">
                  {analysis.needsClarification.length}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {totalLineItems > 0
                    ? Math.round((analysis.needsClarification.length / totalLineItems) * 100)
                    : 0}
                  % of items
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <div className="flex items-center gap-1 mb-2">
                  <p className="text-[10px] text-muted-foreground font-medium">Missing</p>
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                </div>
                <p className="text-3xl font-display font-bold text-red-500">
                  {analysis.missingScope.length}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {analysis.missingScope.length > 0 ? "Review" : "0%"}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-[10px] text-muted-foreground font-medium mb-2">Red Flags</p>
                <p
                  className={`text-3xl font-display font-bold ${analysis.redFlags.length > 0 ? "text-red-500" : "text-accent"}`}
                >
                  {analysis.redFlags.length}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {analysis.redFlags.length === 0 ? "Great!" : "Review"}
                </p>
              </div>
            </div>
            {/* Tab-specific content */}
            {activeTab === "overview" && (
              <div className="mb-8">
                <h2 className="text-base font-bold text-ink mb-1">Market scorecard</h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Quoted price vs local market low / mid / high. Not a single AI guess.
                </p>
                {scorecardSummary.scored > 0 && (
                  <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="rounded-lg border border-border bg-white px-3 py-2">
                      <p className="text-[10px] text-muted-foreground font-medium">Scored lines</p>
                      <p className="text-lg font-display font-bold text-ink">
                        {scorecardSummary.scored}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-white px-3 py-2">
                      <p className="text-[10px] text-muted-foreground font-medium">Within range</p>
                      <p className="text-lg font-display font-bold text-accent">
                        {scorecardSummary.within}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-white px-3 py-2">
                      <p className="text-[10px] text-muted-foreground font-medium">Above market</p>
                      <p className="text-lg font-display font-bold text-red-500">
                        {scorecardSummary.above}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-white px-3 py-2">
                      <p className="text-[10px] text-muted-foreground font-medium">Below market</p>
                      <p className="text-lg font-display font-bold text-amber-600">
                        {scorecardSummary.below}
                      </p>
                    </div>
                  </div>
                )}
                {/* Quick Filters */}
                <div className="hidden sm:flex flex-wrap gap-2 mb-4">
                  {["Missing", "Red Flags"].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() =>
                        setActiveTab(filter === "Missing" ? "explorer" : "overview")
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition border border-border hover:bg-muted/50 text-muted-foreground"
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="rounded-xl border border-border bg-white overflow-hidden">
                  {/* Desktop Table View */}
                  <table className="hidden sm:table w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/20">
                        <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase w-6"></th>
                        <th className="px-3 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase">
                          Line item
                        </th>
                        <th className="px-3 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase">
                          Qty
                        </th>
                        <th className="px-3 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase">
                          Quoted
                        </th>
                        <th className="px-3 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase">
                          Market low
                        </th>
                        <th className="px-3 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase">
                          Market mid
                        </th>
                        <th className="px-3 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase">
                          Market high
                        </th>
                        <th className="px-3 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase">
                          Score
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scopeRows.map((row, i) => {
                        const st = getStatus(row.name);
                        const recommendation = getPriceRecommendation(row);
                        const showMarket = row.marketComparable && row.marketMid > 0;
                        return (
                          <Fragment key={`${row.name}-${i}`}>
                            <tr className={`border-b border-border/50 hover:bg-muted/10 ${row.priceUnreliable ? "bg-amber-50/20" : row.marketTone === "high" ? "bg-red-50/20" : row.marketTone === "low" ? "bg-amber-50/20" : ""}`}>
                              <td className="px-4 py-4 text-muted-foreground cursor-pointer" onClick={() => setExpandedRow(expandedRow === i ? null : i)}>
                                {expandedRow === i ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                              </td>
                              <td className="px-3 py-4">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${st === "included" ? "bg-accent/10" : st === "clarification" ? "bg-amber-50" : "bg-muted"}`}
                                  >
                                    {st === "included" ? (
                                      <Check className="h-3 w-3 text-accent" />
                                    ) : st === "clarification" ? (
                                      <HelpCircle className="h-3 w-3 text-amber-500" />
                                    ) : (
                                      <Info className="h-3 w-3 text-muted-foreground" />
                                    )}
                                  </div>
                                  <span className="font-medium text-ink">{row.name}</span>
                                </div>
                              </td>
                              <td className="px-3 py-4 text-muted-foreground text-xs">
                                {row.qty > 0 ? `${row.qty} ${row.unit}` : "—"}
                              </td>
                              <td className="px-3 py-4">
                                {row.price > 0 ? (
                                  <span className={`text-xs font-semibold ${
                                    row.marketTone === "high" ? "text-red-600" : row.marketTone === "low" ? "text-amber-600" : "text-ink"
                                  }`}>
                                    ${row.price.toLocaleString()}
                                  </span>
                                ) : row.priceUnreliable && row.rawPrice > 0 ? (
                                  <span className="text-xs font-medium text-amber-600" title="Extracted amount looks like a unit rate or fragment, not a line total">
                                    Unclear
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground text-xs">—</span>
                                )}
                              </td>
                              <td className="px-3 py-4 text-xs text-muted-foreground">
                                {showMarket ? `$${Math.round(row.marketLow).toLocaleString()}` : "—"}
                              </td>
                              <td className="px-3 py-4 text-xs font-medium text-ink">
                                {showMarket ? `$${Math.round(row.marketMid).toLocaleString()}` : "—"}
                              </td>
                              <td className="px-3 py-4 text-xs text-muted-foreground">
                                {showMarket ? `$${Math.round(row.marketHigh).toLocaleString()}` : "—"}
                              </td>
                              <td className="px-3 py-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${recommendation.className}`}>
                                  {recommendation.label}
                                </span>
                              </td>
                            </tr>
                            {expandedRow === i && (
                              <tr className={`border-b border-border/50 ${row.priceUnreliable ? "bg-amber-50/30" : row.marketTone === "high" ? "bg-red-50/30" : row.marketTone === "low" ? "bg-amber-50/30" : "bg-muted/30"}`}>
                                <td colSpan={8} className="px-4 py-4">
                                  <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                      <span className="text-[10px] font-bold text-muted-foreground shrink-0 mt-0.5">Why it matters:</span>
                                      <p className="text-xs text-muted-foreground">
                                        {st === "included" ? "This item is included in your quote and contributes to the total cost." : st === "clarification" ? "This item needs clarification to ensure it meets your requirements." : "This item was not matched to standard scope items."}
                                      </p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-[10px] font-bold text-muted-foreground shrink-0 mt-0.5">Price analysis:</span>
                                      <p className="text-xs text-muted-foreground">
                                        {row.priceUnreliable
                                          ? `The extracted amount ($${row.rawPrice.toLocaleString()}) looks like a unit rate, line number, or incomplete fragment rather than a full line total. Ask your contractor to confirm the extended price for this item.`
                                          : showMarket
                                            ? row.marketLabel === "Above market"
                                              ? `Quoted $${row.price.toLocaleString()} is above the market high of $${Math.round(row.marketHigh).toLocaleString()} (range ${formatMarketRange(row.marketLow, row.marketMid, row.marketHigh)}). Ask for a breakdown or negotiate.`
                                              : row.marketLabel === "Below market"
                                                ? `Quoted $${row.price.toLocaleString()} is below the market low of $${Math.round(row.marketLow).toLocaleString()} (range ${formatMarketRange(row.marketLow, row.marketMid, row.marketHigh)}). Verify scope and material quality are complete.`
                                                : `Quoted $${row.price.toLocaleString()} falls within the market range ${formatMarketRange(row.marketLow, row.marketMid, row.marketHigh)}.`
                                            : row.price > 0
                                              ? "Not enough reliable quantity or unit data to compare this line against market rates yet."
                                              : "No line total was found for this item in the quote."}
                                      </p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-[10px] font-bold text-muted-foreground shrink-0 mt-0.5">Recommendation:</span>
                                      <p className="text-xs text-muted-foreground">
                                        {row.priceUnreliable
                                          ? "Do not treat this line as a bargain or overcharge until the contractor confirms the total."
                                          : row.marketLabel === "Above market"
                                            ? "Review carefully with your contractor. Ask for itemized details and comparable bids."
                                            : row.marketLabel === "Below market"
                                              ? "Confirm materials, labor, and exclusions before treating this as a deal."
                                              : row.marketLabel === "Within range"
                                                ? "This looks fair against current market ranges for this line item."
                                                : st === "clarification"
                                                  ? "Ask your contractor for specific details about this item."
                                                  : "Confirm quantity and unit pricing with your contractor before drawing conclusions."}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                  
                  {/* Mobile Card View */}
                  <div className="sm:hidden space-y-3">
                    {scopeRows.slice(0, 5).map((row, i) => {
                      const st = getStatus(row.name);
                      const recommendation = getPriceRecommendation(row);
                      return (
                        <div key={i} className={`rounded-xl border p-4 ${row.priceUnreliable ? "border-amber-200 bg-amber-50/20" : row.marketTone === "high" ? "border-red-200 bg-red-50/20" : row.marketTone === "low" ? "border-amber-200 bg-amber-50/20" : "border-border bg-white"}`}>
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 ${st === "included" ? "bg-accent/10" : st === "clarification" ? "bg-amber-50" : "bg-muted"}`}
                            >
                              {st === "included" ? (
                                <Check className="h-3 w-3 text-accent" />
                              ) : st === "clarification" ? (
                                <HelpCircle className="h-3 w-3 text-amber-500" />
                              ) : (
                                <Info className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-ink">{row.name}</p>
                              <div className="flex items-center gap-3 mt-2 flex-wrap">
                                {row.price > 0 && (
                                  <span className={`text-sm font-bold ${
                                    row.marketTone === "high" ? "text-red-600" : row.marketTone === "low" ? "text-amber-600" : "text-ink"
                                  }`}>
                                    ${row.price.toLocaleString()}
                                  </span>
                                )}
                                {row.priceUnreliable && (
                                  <span className="text-xs font-medium text-amber-600">Price unclear</span>
                                )}
                                {row.marketComparable && row.marketMid > 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    Market {formatMarketRange(row.marketLow, row.marketMid, row.marketHigh)}
                                  </span>
                                )}
                                {recommendation.label !== "—" && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${recommendation.className}`}>
                                    {recommendation.label}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Desktop CTA for Mobile */}
                    <div className="rounded-xl border-2 border-accent/30 bg-gradient-to-b from-accent/5 to-accent/10 p-5 text-center">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                        <Monitor className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="text-sm font-bold text-ink mb-1">View full scorecard</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        For low / mid / high market ranges and expandable line details, open this report on desktop.
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold">
                        <Monitor className="h-3.5 w-3.5" /> Desktop required
                      </div>
                    </div>
                  </div>
                </div>
                {analysis.missingScope.length > 0 && <div className="mt-3 text-center"></div>}
              </div>
            )}
            {/* ═══ TAB: Missing Items ═══ */}
            {activeTab === "explorer" && (
              <div>
                <h2 className="text-base font-bold text-ink mb-1">Missing Items</h2>
                <p className="text-xs text-muted-foreground mb-6">
                  Important items not found in your contractor's quote.
                </p>
                {analysis.missingScope.length === 0 ? (
                  <div className="rounded-xl border border-border bg-white p-8 text-center">
                    <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-3" />
                    <p className="text-sm font-bold text-ink">No missing items detected</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your quote covers all required scope items.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analysis.missingScope.map((item, i) => (
                      <div key={i} className="rounded-xl border border-border bg-white p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-ink">
                                {item.title.replace("Missing: ", "")}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {item.explanation}
                              </p>
                              <p className="text-xs text-red-700 mt-2 font-medium">
                                → {item.recommendation}
                              </p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-500 shrink-0">
                            Missing
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {analysis.needsClarification.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-sm font-bold text-ink mb-3">Needs Clarification</h3>
                    <div className="space-y-3">
                      {analysis.needsClarification.map((item, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-amber-100 bg-amber-50/30 p-4"
                        >
                          <p className="text-sm font-bold text-ink">{item.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Found as: "{item.matchedAs}"
                          </p>
                          <p className="text-sm text-amber-800 mt-2">{item.question}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* ═══ TAB: Smart Questions ═══ */}
            {activeTab === "questions" && (
              <div>
                <h2 className="text-base font-bold text-ink mb-1">Smart Questions</h2>
                <p className="text-xs text-muted-foreground mb-6">
                  Ask these questions before signing your contract.
                </p>
                <div className="space-y-3">
                  {analysis.questionsToAsk.map((q, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border bg-white p-4 flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#082A4B]/5 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-[#082A4B]">{i + 1}</span>
                      </div>
                      <p className="text-sm text-ink leading-relaxed">{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* ═══ TAB: Recommendations ═══ */}
            {activeTab === "timeline" && (
              <div>
                <h2 className="text-base font-bold text-ink mb-1">Recommendations</h2>
                <p className="text-xs text-muted-foreground mb-6">
                  Expert guidance based on your quote analysis.
                </p>
                <div className="space-y-4">
                  {analysis.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border bg-white p-4 flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                      </div>
                      <p className="text-sm text-ink leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
                {analysis.buildingCodes.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-ink mb-3">Building Code Requirements</h3>
                    <div className="space-y-3">
                      {analysis.buildingCodes.map((code, i) => (
                        <div key={i} className="rounded-xl border border-border bg-white p-4">
                          <p className="text-sm font-semibold text-ink">
                            {code.title.replace("Building Code: ", "")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{code.explanation}</p>
                          {code.inspectionRequired && (
                            <span className="mt-2 inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-600">
                              Inspection Required
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-8">
                  <h3 className="text-sm font-bold text-ink mb-1">Follow-up checklist</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Saved locally so you can come back later without logging in.
                  </p>
                  <TimelineTab progressSignature={progressSignature} />
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar: Insights cards - always visible */}
          <aside className="hidden xl:block w-[300px] shrink-0 border-l border-border bg-white p-4 h-[calc(100vh-56px)] sticky top-14 overflow-y-auto space-y-4">
            <div
              className="rounded-xl border border-border p-4 cursor-pointer hover:border-accent/40 transition"
              onClick={() => setActiveTab("explorer")}
            >
              <h3 className="text-sm font-bold text-ink mb-1">
                Missing Items ({analysis.missingScope.length})
              </h3>
              <p className="text-[10px] text-muted-foreground mb-3">
                Items not found in your quote.
              </p>
              {analysis.missingScope.length === 0 ? (
                <p className="text-xs text-accent font-medium">None. Great!</p>
              ) : (
                <div className="space-y-2">
                  {analysis.missingScope.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-ink">
                          {item.title.replace("Missing: ", "")}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className="mt-3 text-xs font-semibold text-accent hover:underline">
                View All →
              </button>
            </div>
            <div
              className="rounded-xl border border-border p-4 cursor-pointer hover:border-accent/40 transition"
              onClick={() => setActiveTab("overview")}
            >
              <h3 className="text-sm font-bold text-ink mb-1">Market scorecard</h3>
              <p className="text-xl font-display font-bold text-ink">
                {extraction.totalPrice > 0 ? `$${extraction.totalPrice.toLocaleString()}` : "—"}
              </p>
              <p className="text-[10px] text-muted-foreground">Total quote amount</p>
              {scorecardSummary.scored > 0 ? (
                <div className="mt-2 pt-2 border-t border-border space-y-1.5">
                  <p className="text-[10px] text-muted-foreground">
                    {scorecardSummary.scored} line{scorecardSummary.scored === 1 ? "" : "s"} scored
                    vs market ranges
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-accent/10 text-accent">
                      {scorecardSummary.within} within range
                    </span>
                    {scorecardSummary.above > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-600">
                        {scorecardSummary.above} above market
                      </span>
                    )}
                    {scorecardSummary.below > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700">
                        {scorecardSummary.below} below market
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                extraction.totalPrice > 0 && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground">
                      Add clear quantities and units on the quote to unlock line-item market ranges.
                    </p>
                  </div>
                )
              )}
            </div>
            <div
              className="rounded-xl border border-border p-4 cursor-pointer hover:border-accent/40 transition"
              onClick={() => setActiveTab("questions")}
            >
              <h3 className="text-sm font-bold text-ink mb-1">Smart Questions</h3>
              <p className="text-[10px] text-muted-foreground mb-2">Ask your contractor:</p>
              <div className="space-y-2">
                {analysis.questionsToAsk.slice(0, 3).map((q, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[9px] text-muted-foreground mt-0.5 shrink-0">
                      {i + 1}.
                    </span>
                    <p className="text-[11px] text-ink leading-relaxed">
                      {q.length > 80 ? q.substring(0, 80) + "..." : q}
                    </p>
                  </div>
                ))}
              </div>
              <button className="mt-3 text-xs font-semibold text-accent hover:underline">
                View All →
              </button>
            </div>
            {/* AI Analyst - Hero selling point */}
            <div className="rounded-xl border-2 border-accent/40 bg-gradient-to-b from-accent/5 to-accent/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-xs font-bold text-accent">AI Analyst</span>
              </div>
              <p className="text-xs font-semibold text-ink mb-1">Ask anything about your quote</p>
              <p className="text-[10px] text-muted-foreground mb-3">
                Get negotiation scripts, cost comparisons, and red flag explanations instantly.
              </p>
              <button
                onClick={() => setChatOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 transition shadow-sm shadow-accent/20"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Ask CostReno AI
              </button>
            </div>
          </aside>
        </main>
      </div>
      {chatOpen && (
        <AIChatPanel
          analysis={analysis}
          extraction={extraction}
          onClose={() => setChatOpen(false)}
        />
      )}
      <EmailDownloadModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        reportName="Quote Analysis Report"
        isLoading={isDownloading}
      />
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink">Share Report</h3>
              <button onClick={() => setShowShareModal(false)} className="text-muted-foreground hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Share this quote analysis with friends, family, or contractors via WhatsApp, email, or any messaging app.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/quote-analyzer`}
                  className="flex-1 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground bg-muted/30"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/quote-analyzer`);
                  }}
                  className="px-3 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent/90"
                >
                  Copy
                </button>
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out this quote analysis: ${window.location.origin}/quote-analyzer`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600"
                >
                  <Share2 className="h-3.5 w-3.5" /> WhatsApp
                </a>
                <a
                  href={`mailto:?subject=Quote Analysis Report&body=${encodeURIComponent(`Check out this quote analysis: ${window.location.origin}/quote-analyzer`)}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600"
                >
                  <Share2 className="h-3.5 w-3.5" /> Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent shadow-lg shadow-accent/30 flex items-center justify-center text-white hover:scale-105 transition-transform z-40 lg:hidden"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
      <SiteFooter />
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function OverviewTab({
  analysis,
  extraction,
}: {
  analysis: QuoteAnalysis;
  extraction: QuoteAnalysisResult["extraction"];
}) {
  const cards = [
    {
      label: "Included",
      count: analysis.presentItems.length,
      icon: CheckCircle2,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Clarification",
      count: analysis.needsClarification.length,
      icon: HelpCircle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Missing",
      count: analysis.missingScope.length,
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "Red Flags",
      count: analysis.redFlags.length,
      icon: Shield,
      color: analysis.redFlags.length > 0 ? "text-red-500" : "text-accent",
      bg: analysis.redFlags.length > 0 ? "bg-red-50" : "bg-accent/10",
    },
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Found as: "{item.matchedAs}"
                    </p>
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
                <p className="text-sm font-semibold text-ink">
                  {item.title.replace("Missing: ", "")}
                </p>
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
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-bold text-red-600 shrink-0 mt-0.5">Why flagged:</span>
                    <p className="text-xs text-red-600">{flag.explanation}</p>
                  </div>
                  {flag.recommendation && (
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-red-600 shrink-0 mt-0.5">What to do:</span>
                      <p className="text-xs text-red-700 font-medium">{flag.recommendation}</p>
                    </div>
                  )}
                </div>
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
function ScopeReviewTab({
  analysis,
  expandedCards,
  setExpandedCards,
  onAskAI,
}: {
  analysis: QuoteAnalysis;
  expandedCards: Set<string>;
  setExpandedCards: (s: Set<string>) => void;
  onAskAI: () => void;
}) {
  const allItems: ScopeCard[] = [
    ...analysis.presentItems.map((i) => ({
      name: i.name,
      status: "present" as const,
      matchedAs: i.matchedAs,
    })),
    ...analysis.needsClarification.map((i) => ({
      name: i.name,
      status: "clarification" as const,
      matchedAs: i.matchedAs,
      question: i.question,
    })),
    ...analysis.missingScope.map((i) => ({
      name: i.title.replace("Missing: ", ""),
      status: "missing" as const,
      description: i.explanation,
      recommendation: i.recommendation,
    })),
  ];

  const toggle = (name: string) => {
    const next = new Set(expandedCards);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setExpandedCards(next);
  };

  const statusBadge = (status: string) => {
    if (status === "present")
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/10 text-accent">
          ✅ Present
        </span>
      );
    if (status === "clarification")
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600">
          ⚠ Clarify
        </span>
      );
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-500">
        ❌ Missing
      </span>
    );
  };

  return (
    <div className="max-w-3xl space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        {allItems.length} scope items reviewed. Click to expand.
      </p>
      {allItems.map((item) => {
        const isOpen = expandedCards.has(item.name);
        return (
          <div
            key={item.name}
            className="rounded-xl border border-border bg-white overflow-hidden transition-shadow hover:shadow-sm"
          >
            <button
              onClick={() => toggle(item.name)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                {statusBadge(item.status)}
                <span className="text-sm font-semibold text-ink">{item.name}</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 pt-0 border-t border-border/50 animate-in fade-in duration-200">
                {item.matchedAs && item.matchedAs !== item.name && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Found in quote as: "{item.matchedAs}"
                  </p>
                )}
                {item.question && <p className="text-sm text-amber-700 mb-2">{item.question}</p>}
                {item.description && <p className="text-sm text-ink/70 mb-2">{item.description}</p>}
                {item.recommendation && (
                  <p className="text-sm text-red-700 mb-2">→ {item.recommendation}</p>
                )}
                <button
                  onClick={onAskAI}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                >
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
function QuoteExplorerTab({
  extraction,
  analysis,
  selectedRow,
  setSelectedRow,
}: {
  extraction: QuoteAnalysisResult["extraction"];
  analysis: QuoteAnalysis;
  selectedRow: number | null;
  setSelectedRow: (r: number | null) => void;
}) {
  const allItems = [
    ...extraction.materials.map((m) => ({
      name: m.name,
      qty: m.quantity,
      unit: m.unit,
      price: m.totalPrice,
      type: "material" as const,
    })),
    ...extraction.scopeItems.map((s) => ({
      name: s.name,
      qty: s.quantity,
      unit: s.unit,
      price: s.totalPrice,
      type: "scope" as const,
    })),
  ];

  const getStatus = (name: string) => {
    if (
      analysis.presentItems.some(
        (i) =>
          i.matchedAs?.toLowerCase() === name.toLowerCase() ||
          i.name.toLowerCase() === name.toLowerCase(),
      )
    )
      return "matched";
    if (analysis.needsClarification.some((i) => i.matchedAs?.toLowerCase() === name.toLowerCase()))
      return "clarify";
    return "unmatched";
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {allItems.length} line items extracted from quote
        </p>
        {extraction.totalPrice > 0 && (
          <span className="text-sm font-bold text-ink">
            Total: ${extraction.totalPrice.toLocaleString()}
          </span>
        )}
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Item
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Qty
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Status
                </th>
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
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.qty > 0 ? `${item.qty} ${item.unit}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-ink">
                      {item.price > 0 ? `$${item.price.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {status === "matched" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/10 text-accent">
                          Matched
                        </span>
                      )}
                      {status === "clarify" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600">
                          Clarify
                        </span>
                      )}
                      {status === "unmatched" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
                          Unmatched
                        </span>
                      )}
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
            <button
              onClick={() => setSelectedRow(null)}
              className="text-muted-foreground hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-muted/30">
              <span className="text-muted-foreground">Type</span>
              <br />
              <span className="font-medium text-ink">{allItems[selectedRow].type}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30">
              <span className="text-muted-foreground">Quantity</span>
              <br />
              <span className="font-medium text-ink">
                {allItems[selectedRow].qty || "—"} {allItems[selectedRow].unit}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30">
              <span className="text-muted-foreground">Price</span>
              <br />
              <span className="font-medium text-ink">
                {allItems[selectedRow].price > 0
                  ? `$${allItems[selectedRow].price.toLocaleString()}`
                  : "—"}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30">
              <span className="text-muted-foreground">Status</span>
              <br />
              <span className="font-medium text-ink capitalize">
                {getStatus(allItems[selectedRow].name)}
              </span>
            </div>
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
    if (ql.includes("material") || ql.includes("shingle") || ql.includes("underlayment"))
      return "Materials";
    if (ql.includes("permit") || ql.includes("inspection") || ql.includes("code"))
      return "Permits & Codes";
    if (
      ql.includes("install") ||
      ql.includes("weather") ||
      ql.includes("protect") ||
      ql.includes("timeline")
    )
      return "Installation";
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
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
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
function TimelineTab({
  progressSignature,
}: {
  progressSignature?: string;
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!progressSignature) return;
    const saved = getSavedQuoteProgress();
    if (!saved || saved.signature !== progressSignature) {
      setChecked(new Set());
      return;
    }
    setChecked(new Set(saved.completedChecklistIds));
  }, [progressSignature]);

  useEffect(() => {
    if (!progressSignature) return;
    updateSavedQuoteChecklist(progressSignature, Array.from(checked));
  }, [checked, progressSignature]);

  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
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
                <p className="text-[10px] text-muted-foreground">
                  {done}/{phase.tasks.length} completed
                </p>
              </div>
              {/* Progress bar */}
              <div className="flex-1 h-1.5 rounded-full bg-border ml-4">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${(done / phase.tasks.length) * 100}%` }}
                />
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
                  <span
                    className={`text-sm ${checked.has(task.id) ? "line-through text-muted-foreground" : "text-ink"}`}
                  >
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
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Convert bullet points (- item)
  html = html.replace(
    /^- (.+)$/gm,
    '<li class="flex items-start gap-2"><span class="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0"></span><span>$1</span></li>',
  );
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li[^>]*>.*?<\/li>\s*)+)/g, '<ul class="space-y-1.5">$1</ul>');
  // Convert 💡 Pro Tip lines
  html = html.replace(
    /💡\s*(?:Pro Tip:?)?\s*(.+)/g,
    '<div class="mt-2 p-2 rounded-lg bg-accent/10 text-xs"><span class="text-accent font-bold">💡 Pro Tip:</span> $1</div>',
  );
  // Convert newlines to paragraphs (but not inside lists)
  html = html.replace(/\n{2,}/g, '</p><p class="mt-2">');
  html = html.replace(/\n/g, "<br/>");
  // Clean up --- dividers
  html = html.replace(/---/g, '<hr class="border-border my-2"/>');
  return html;
}

// ─── AI Chat Panel ────────────────────────────────────────────────────────────
function AIChatPanel({
  analysis,
  extraction,
  onClose,
}: {
  analysis: QuoteAnalysis;
  extraction: QuoteAnalysisResult["extraction"];
  onClose: () => void;
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
        analysis.needsClarification.length > 0
          ? `Needs clarification: ${analysis.needsClarification.map((i) => i.name).join(", ")}`
          : "",
        analysis.missingScope.length > 0
          ? `Missing: ${analysis.missingScope.map((i) => i.title.replace("Missing: ", "")).join(", ")}`
          : "",
        extraction.totalPrice > 0 ? `Total price: $${extraction.totalPrice.toLocaleString()}` : "",
        analysis.redFlags.length > 0
          ? `Red flags: ${analysis.redFlags.map((f) => f.title).join(", ")}`
          : "No red flags",
      ]
        .filter(Boolean)
        .join(". ");

      // Convert conversation history to ChatMessage format
      // First message includes context, subsequent messages are just the conversation
      const chatMsgs: ChatMessage[] = newMessages.map((m, idx) => ({
        role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
        content:
          idx === 0 && newMessages.length === 1
            ? `[Quote Analysis Context: ${contextSummary}]\n\nIMPORTANT: Keep your response concise — 3-5 bullet points max. No long explanations. Be direct and actionable.\n\nMy question: ${m.text}`
            : m.text,
      }));

      // If this is not the first message, prepend context as first exchange
      if (newMessages.length > 1) {
        chatMsgs.unshift(
          {
            role: "user",
            content: `I just analyzed a contractor quote. Here's the summary: ${contextSummary}. IMPORTANT: Keep all responses concise — 3-5 bullet points max, no walls of text.`,
          },
          {
            role: "assistant",
            content: "Got it. I'll keep responses short and actionable. Ask away.",
          },
        );
      }

      const projectType = extraction.projectType as any;
      const response = await serverChatWithKnowledge({
        data: { messages: chatMsgs, userProjectType: projectType || undefined },
      });
      setMessages((prev) => [...prev, { role: "ai", text: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I encountered an error. Please try again." },
      ]);
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
            <span className="px-1.5 py-0.5 rounded bg-accent/30 text-[9px] text-white font-bold uppercase">
              Quote Context
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col py-4">
              <h3 className="text-base font-bold text-ink mb-1">Ask about your quote</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Get concise answers about pricing, missing scope, and red flags.
              </p>
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
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent text-white rounded-br-md"
                    : "bg-muted text-ink rounded-bl-md"
                }`}
              >
                {msg.role === "user" ? (
                  msg.text
                ) : (
                  <div
                    className="space-y-2"
                    dangerouslySetInnerHTML={{ __html: formatAIResponse(msg.text) }}
                  />
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) sendMessage(input);
              }}
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
