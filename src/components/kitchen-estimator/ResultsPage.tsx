import { useState } from "react";
import {
  RotateCcw,
  Download,
  Save,
  Sparkles,
  ArrowUpDown,
  MessageSquare,
  MapPin,
  CalendarDays,
} from "lucide-react";
import type {
  KitchenLiveEstimate,
  KitchenEstimateAnswers,
  AIDetectionResult,
} from "../../lib/kitchen-estimator/types";
import { createProjectStore } from "../../lib/kitchen-estimator/project-store";
import { generatePDF } from "../../lib/kitchen-estimator/pdf-generator";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ResultsPageProps {
  estimate: KitchenLiveEstimate;
  answers: KitchenEstimateAnswers;
  aiDetections?: AIDetectionResult | null;
  onStartOver: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function generateProjectId(): string {
  return `kitchen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Results Page Component ──────────────────────────────────────────────────

export function ResultsPage({
  estimate,
  answers,
  aiDetections,
  onStartOver,
}: ResultsPageProps) {
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saved" | "error"
  >("idle");

  const locationText = [answers.city, answers.state, answers.zipCode]
    .filter(Boolean)
    .join(", ");

  const showAIObservations =
    answers.path === "ai" && aiDetections && aiDetections.observations.length > 0;

  // ─── Handlers ────────────────────────────────────────────────────────────

  function handleDownloadPDF() {
    generatePDF({
      estimate,
      answers,
      aiDetections: aiDetections ?? undefined,
    });
  }

  function handleSaveProject() {
    try {
      const store = createProjectStore();
      store.save({
        id: generateProjectId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        projectType: "kitchen",
        path: answers.path,
        answers,
        aiDetections: aiDetections ?? undefined,
        estimate,
      });
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Headline Estimate */}
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-[#082A4B] sm:text-3xl lg:text-4xl">
          Your Kitchen Remodel Estimate
        </h1>
        <div className="mt-6 rounded-xl border border-[#082A4B]/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-muted-foreground">Estimated Total Cost</p>
          <p className="mt-2 font-display text-4xl font-bold text-[#082A4B] sm:text-5xl">
            {formatCurrency(estimate.mid)}
          </p>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">
            {formatCurrency(estimate.low)} – {formatCurrency(estimate.high)}
          </p>
        </div>
      </div>

      {/* Cost Breakdown */}
      {estimate.breakdown.length > 0 && (
        <div className="mb-8 rounded-xl border border-[#082A4B]/10 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-semibold text-[#082A4B] sm:text-xl">
            <ArrowUpDown className="h-5 w-5" />
            Cost Breakdown
          </h2>
          <div className="space-y-3">
            {estimate.breakdown.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize text-[#082A4B]">
                    {item.category}
                  </span>
                  <span className="font-medium text-[#082A4B]">
                    {formatCurrency(item.amount)}{" "}
                    <span className="text-xs text-muted-foreground">
                      ({item.percentage}%)
                    </span>
                  </span>
                </div>
                {/* Percentage bar */}
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-[#082A4B]/10"
                  role="progressbar"
                  aria-valuenow={item.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.category}: ${item.percentage}%`}
                >
                  <div
                    className="h-full rounded-full bg-[#082A4B] transition-all duration-300"
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Observations (AI path only) */}
      {showAIObservations && (
        <div className="mb-8 rounded-xl border border-[#082A4B]/10 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-semibold text-[#082A4B] sm:text-xl">
            <Sparkles className="h-5 w-5" />
            AI Observations
          </h2>
          <ul className="space-y-2">
            {aiDetections!.observations.map((obs, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-[#082A4B]/80"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#082A4B]/40" />
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Material Recommendations */}
      {estimate.materialRecommendations.length > 0 && (
        <div className="mb-8 rounded-xl border border-[#082A4B]/10 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-semibold text-[#082A4B] sm:text-xl">
            <ArrowUpDown className="h-5 w-5" />
            Material Recommendations
          </h2>
          <div className="space-y-4">
            {estimate.materialRecommendations.map((rec, i) => (
              <div
                key={i}
                className="rounded-lg border border-[#082A4B]/5 bg-[#082A4B]/[0.02] p-4"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#082A4B]">
                      <span className="capitalize">{rec.current}</span>
                      {" → "}
                      <span className="capitalize">{rec.alternative}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {rec.description}
                    </p>
                  </div>
                  <span
                    className={`mt-2 inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold sm:mt-0 ${
                      rec.costDifference > 0
                        ? "bg-red-50 text-red-700"
                        : rec.costDifference < 0
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {rec.costDifference > 0 ? "+" : ""}
                    {formatCurrency(rec.costDifference)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions for Your Contractor */}
      {estimate.contractorQuestions.length > 0 && (
        <div className="mb-8 rounded-xl border border-[#082A4B]/10 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-semibold text-[#082A4B] sm:text-xl">
            <MessageSquare className="h-5 w-5" />
            Questions for Your Contractor
          </h2>
          <ol className="space-y-3">
            {estimate.contractorQuestions.map((question, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#082A4B]/80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#082A4B]/10 text-xs font-semibold text-[#082A4B]">
                  {i + 1}
                </span>
                <span className="pt-0.5">{question}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ZIP-Adjusted Pricing Attribution & Data Date */}
      <div className="mb-8 flex flex-col items-center gap-2 text-center text-xs text-muted-foreground sm:flex-row sm:justify-center sm:gap-4">
        {locationText && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            ZIP-adjusted pricing for {locationText}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          Data as of {formatDate()}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {/* Start Over */}
        <button
          type="button"
          onClick={onStartOver}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#082A4B]/20 px-6 py-3 text-sm font-semibold text-[#082A4B] transition-colors hover:border-[#082A4B]/40 hover:bg-[#082A4B]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
        >
          <RotateCcw className="h-4 w-4" />
          Start Over
        </button>

        {/* Download PDF - Green accent CTA */}
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#028a40] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#028a40]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#028a40] focus-visible:ring-offset-2 sm:w-auto"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>

        {/* Save Project */}
        <button
          type="button"
          onClick={handleSaveProject}
          disabled={saveStatus === "saved"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#082A4B]/20 px-6 py-3 text-sm font-semibold text-[#082A4B] transition-colors hover:border-[#082A4B]/40 hover:bg-[#082A4B]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          aria-label={
            saveStatus === "saved"
              ? "Project saved"
              : "Save project to browser storage"
          }
        >
          <Save className="h-4 w-4" />
          {saveStatus === "saved"
            ? "Saved!"
            : saveStatus === "error"
              ? "Save Failed"
              : "Save Project"}
        </button>
      </div>

      {/* Save error message */}
      {saveStatus === "error" && (
        <p className="mt-3 text-center text-xs text-red-600">
          Unable to save. Try downloading the PDF instead.
        </p>
      )}
    </section>
  );
}
