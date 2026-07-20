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
  Check,
  X,
  LayoutGrid,
} from "lucide-react";
import type {
  KitchenLiveEstimate,
  KitchenEstimateAnswers,
  AIDetectionResult,
  DetectedFeatures,
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

// ─── Kitchen Details Card ─────────────────────────────────────────────────────

function BoolIcon({ value }: { value?: boolean }) {
  if (value === undefined) return null;
  return value
    ? <Check className="h-3.5 w-3.5 text-green-600" />
    : <X className="h-3.5 w-3.5 text-muted-foreground/50" />;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-[#082A4B] text-right">{children}</span>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1.5">{title}</h4>
      <div className="divide-y divide-[#082A4B]/5">{children}</div>
    </div>
  );
}

function KitchenDetailsCard({ features }: { features: DetectedFeatures }) {
  const hasAny =
    features.kitchenLayout || features.island || features.cabinetDetails ||
    features.countertopDetails || features.backsplash || features.sink ||
    features.faucet || features.appliances || features.lighting ||
    features.windows || features.flooring || features.walls ||
    features.ceiling || features.premiumFeatures?.length ||
    features.qualityIndicator || features.overallStyle ||
    features.generalCondition || features.visibleWear?.length;

  if (!hasAny) return null;

  return (
    <div className="mb-8 rounded-xl border border-[#082A4B]/10 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-semibold text-[#082A4B] sm:text-xl">
        <LayoutGrid className="h-5 w-5" />
        Kitchen Details
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Layout & Island */}
        {(features.kitchenLayout || features.island) && (
          <DetailSection title="Layout">
            {features.kitchenLayout && <DetailRow label="Type">{features.kitchenLayout}</DetailRow>}
            {features.island?.present !== undefined && (
              <DetailRow label="Island">
                <span className="inline-flex items-center gap-1">
                  <BoolIcon value={features.island.present} />
                  {features.island.present ? "Present" : "None"}
                </span>
              </DetailRow>
            )}
            {features.island?.seating !== undefined && <DetailRow label="Island Seating"><BoolIcon value={features.island.seating} /></DetailRow>}
            {features.island?.sink !== undefined && <DetailRow label="Island Sink"><BoolIcon value={features.island.sink} /></DetailRow>}
          </DetailSection>
        )}

        {/* Cabinets */}
        {features.cabinetDetails && (
          <DetailSection title="Cabinets">
            {features.cabinetDetails.style && <DetailRow label="Style">{features.cabinetDetails.style}</DetailRow>}
            {features.cabinetDetails.finish && <DetailRow label="Finish">{features.cabinetDetails.finish}</DetailRow>}
            {features.cabinetDetails.hardwareStyle && <DetailRow label="Hardware">{features.cabinetDetails.hardwareStyle}</DetailRow>}
            {features.cabinetDetails.hardwareFinish && <DetailRow label="Hardware Finish">{features.cabinetDetails.hardwareFinish}</DetailRow>}
            {features.cabinetDetails.crownMolding !== undefined && <DetailRow label="Crown Molding"><BoolIcon value={features.cabinetDetails.crownMolding} /></DetailRow>}
            {features.cabinetDetails.glassFronts !== undefined && <DetailRow label="Glass Fronts"><BoolIcon value={features.cabinetDetails.glassFronts} /></DetailRow>}
            {features.cabinetDetails.openShelving !== undefined && <DetailRow label="Open Shelving"><BoolIcon value={features.cabinetDetails.openShelving} /></DetailRow>}
            {features.cabinetDetails.fullHeight !== undefined && <DetailRow label="Full Height"><BoolIcon value={features.cabinetDetails.fullHeight} /></DetailRow>}
          </DetailSection>
        )}

        {/* Countertops */}
        {features.countertopDetails && (
          <DetailSection title="Countertops">
            {features.countertopDetails.material && <DetailRow label="Material">{features.countertopDetails.material}</DetailRow>}
            {features.countertopDetails.color && <DetailRow label="Color">{features.countertopDetails.color}</DetailRow>}
            {features.countertopDetails.pattern && <DetailRow label="Pattern">{features.countertopDetails.pattern}</DetailRow>}
            {features.countertopDetails.edgeProfile && <DetailRow label="Edge">{features.countertopDetails.edgeProfile}</DetailRow>}
            {features.countertopDetails.thickness && <DetailRow label="Thickness">{features.countertopDetails.thickness}</DetailRow>}
            {features.countertopDetails.waterfallEdge !== undefined && <DetailRow label="Waterfall Edge"><BoolIcon value={features.countertopDetails.waterfallEdge} /></DetailRow>}
            {features.countertopDetails.seams && <DetailRow label="Seams">{features.countertopDetails.seams}</DetailRow>}
          </DetailSection>
        )}

        {/* Backsplash */}
        {features.backsplash && (
          <DetailSection title="Backsplash">
            {features.backsplash.material && <DetailRow label="Material">{features.backsplash.material}</DetailRow>}
            {features.backsplash.pattern && <DetailRow label="Pattern">{features.backsplash.pattern}</DetailRow>}
            {features.backsplash.color && <DetailRow label="Color">{features.backsplash.color}</DetailRow>}
            {features.backsplash.fullHeight !== undefined && <DetailRow label="Full Height"><BoolIcon value={features.backsplash.fullHeight} /></DetailRow>}
          </DetailSection>
        )}

        {/* Sink & Faucet */}
        {(features.sink || features.faucet) && (
          <DetailSection title="Sink & Faucet">
            {features.sink?.type && <DetailRow label="Sink Type">{features.sink.type}</DetailRow>}
            {features.sink?.material && <DetailRow label="Sink Material">{features.sink.material}</DetailRow>}
            {features.sink?.finish && <DetailRow label="Sink Finish">{features.sink.finish}</DetailRow>}
            {features.sink?.farmhouse !== undefined && <DetailRow label="Farmhouse Sink"><BoolIcon value={features.sink.farmhouse} /></DetailRow>}
            {features.faucet?.type && <DetailRow label="Faucet Type">{features.faucet.type}</DetailRow>}
            {features.faucet?.finish && <DetailRow label="Faucet Finish">{features.faucet.finish}</DetailRow>}
            {features.faucet?.handleCount && <DetailRow label="Handles">{features.faucet.handleCount}</DetailRow>}
          </DetailSection>
        )}

        {/* Appliances */}
        {features.appliances && (
          <DetailSection title="Appliances">
            {features.appliances.refrigerator?.type && <DetailRow label="Refrigerator">{features.appliances.refrigerator.type}</DetailRow>}
            {features.appliances.range?.type && <DetailRow label="Range">{features.appliances.range.type} ({features.appliances.range.fuel ?? "N/A"})</DetailRow>}
            {features.appliances.hood?.type && <DetailRow label="Hood">{features.appliances.hood.type}</DetailRow>}
            {features.appliances.dishwasher?.type && <DetailRow label="Dishwasher">{features.appliances.dishwasher.type}</DetailRow>}
            {features.appliances.microwave && <DetailRow label="Microwave">{features.appliances.microwave}</DetailRow>}
            {features.appliances.wineFridge !== undefined && <DetailRow label="Wine Fridge"><BoolIcon value={features.appliances.wineFridge} /></DetailRow>}
          </DetailSection>
        )}

        {/* Lighting */}
        {features.lighting && (
          <DetailSection title="Lighting">
            {features.lighting.naturalLight && <DetailRow label="Natural Light">{features.lighting.naturalLight}</DetailRow>}
            {features.lighting.pendantCount !== undefined && <DetailRow label="Pendants">{features.lighting.pendantCount}</DetailRow>}
            {features.lighting.recessed !== undefined && <DetailRow label="Recessed"><BoolIcon value={features.lighting.recessed} /></DetailRow>}
            {features.lighting.underCabinet !== undefined && <DetailRow label="Under Cabinet"><BoolIcon value={features.lighting.underCabinet} /></DetailRow>}
            {features.lighting.chandelier !== undefined && <DetailRow label="Chandelier"><BoolIcon value={features.lighting.chandelier} /></DetailRow>}
          </DetailSection>
        )}

        {/* Windows */}
        {features.windows && (
          <DetailSection title="Windows">
            {features.windows.count !== undefined && <DetailRow label="Count">{features.windows.count}</DetailRow>}
            {features.windows.size && <DetailRow label="Size">{features.windows.size}</DetailRow>}
            {features.windows.style && <DetailRow label="Style">{features.windows.style}</DetailRow>}
            {features.windows.treatment && <DetailRow label="Treatment">{features.windows.treatment}</DetailRow>}
          </DetailSection>
        )}

        {/* Flooring */}
        {features.flooring && (
          <DetailSection title="Flooring">
            {features.flooring.material && <DetailRow label="Material">{features.flooring.material}</DetailRow>}
            {features.flooring.pattern && <DetailRow label="Pattern">{features.flooring.pattern}</DetailRow>}
            {features.flooring.color && <DetailRow label="Color">{features.flooring.color}</DetailRow>}
          </DetailSection>
        )}

        {/* Walls & Ceiling */}
        {(features.walls || features.ceiling) && (
          <DetailSection title="Walls & Ceiling">
            {features.walls?.finish && <DetailRow label="Wall Finish">{features.walls.finish}</DetailRow>}
            {features.walls?.color && <DetailRow label="Wall Color">{features.walls.color}</DetailRow>}
            {features.ceiling?.type && <DetailRow label="Ceiling Type">{features.ceiling.type}</DetailRow>}
            {features.ceiling?.height && <DetailRow label="Ceiling Height">{features.ceiling.height}</DetailRow>}
          </DetailSection>
        )}

        {/* Quality & Style */}
        {(features.qualityIndicator || features.overallStyle || features.generalCondition) && (
          <DetailSection title="Quality & Style">
            {features.qualityIndicator && <DetailRow label="Quality">{features.qualityIndicator}</DetailRow>}
            {features.overallStyle && <DetailRow label="Style">{features.overallStyle}</DetailRow>}
            {features.generalCondition && <DetailRow label="Condition">{features.generalCondition}</DetailRow>}
          </DetailSection>
        )}
      </div>

      {/* Premium Features */}
      {features.premiumFeatures && features.premiumFeatures.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#082A4B]/10">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">Premium Features</h4>
          <div className="flex flex-wrap gap-1.5">
            {features.premiumFeatures.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full border border-[#082A4B]/15 bg-[#082A4B]/5 px-2.5 py-0.5 text-xs font-medium text-[#082A4B]">
                <Sparkles className="h-3 w-3" />
                {f.replace(/[<>]/g, "")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Visible Wear */}
      {features.visibleWear && features.visibleWear.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#082A4B]/10">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">Visible Wear</h4>
          <div className="flex flex-wrap gap-1.5">
            {features.visibleWear.map((w, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                {w.replace(/[<>]/g, "")}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
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

      {/* Kitchen Details (AI path only) */}
      {aiDetections?.detectedFeatures && (
        <KitchenDetailsCard features={aiDetections.detectedFeatures} />
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
