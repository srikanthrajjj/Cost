import { Check, Sparkles, AlertTriangle, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIDetectionResult, DetectedAttribute, DetectedFeatures } from "../../lib/kitchen-estimator/types";

interface DetectionEditorProps {
  detections: AIDetectionResult;
  onUpdate: (field: string, value: string) => void;
  onConfirm: () => void;
}

/** Maps each detection field key to a human-readable label. */
const fieldLabels: Record<string, string> = {
  cabinetType: "Cabinet Type",
  countertopMaterial: "Countertop Material",
  flooringMaterial: "Flooring Material",
  kitchenSize: "Kitchen Size",
  overallCondition: "Overall Condition",
};

/** Returns all selectable options for a given detection field. */
function getFieldOptions(field: string, detected: DetectedAttribute): string[] {
  const options = new Set<string>();
  options.add(detected.value);
  detected.alternatives.forEach((alt) => options.add(alt));

  // Supplement with common options if alternatives are sparse
  const commonOptions: Record<string, string[]> = {
    cabinetType: ["stock", "semicustom", "custom", "reface"],
    countertopMaterial: ["laminate", "quartz", "granite", "marble", "butcherblock", "keep"],
    flooringMaterial: ["tile", "hardwood", "vinyl", "keep", "none"],
    kitchenSize: ["small", "medium", "large"],
    overallCondition: ["excellent", "good", "fair", "poor"],
  };

  const defaults = commonOptions[field] ?? [];
  defaults.forEach((opt) => options.add(opt));
  return Array.from(options);
}

/** Formats a raw option value into a display-friendly label. */
function formatLabel(value: string): string {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Confidence badge component with color coding. */
function ConfidenceBadge({ confidence }: { confidence: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    low: "bg-red-100 text-red-800 border-red-200",
  };

  const icons = {
    high: <Sparkles className="h-3 w-3" />,
    medium: <AlertTriangle className="h-3 w-3" />,
    low: <AlertCircle className="h-3 w-3" />,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        styles[confidence]
      )}
      aria-label={`AI confidence: ${confidence}`}
    >
      {icons[confidence]}
      {confidence}
    </span>
  );
}

/** A single field editor row with card-based option selection. */
function FieldEditor({
  field,
  attribute,
  selectedValue,
  onSelect,
}: {
  field: string;
  attribute: DetectedAttribute;
  selectedValue: string;
  onSelect: (value: string) => void;
}) {
  const options = getFieldOptions(field, attribute);
  const label = fieldLabels[field] ?? field;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="font-display text-sm font-semibold text-[#082A4B]">
          {label}
        </label>
        <ConfidenceBadge confidence={attribute.confidence} />
      </div>
      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
        role="radiogroup"
        aria-label={`Select ${label}`}
      >
        {options.map((option) => {
          const isSelected = option === selectedValue;
          const isAiDetected = option === attribute.value;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(option)}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-lg border-2 px-3 py-3 text-center text-sm font-medium transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "border-[#082A4B] bg-[#082A4B]/5 text-[#082A4B] shadow-sm"
                  : "border-border bg-white text-muted-foreground hover:border-[#082A4B]/40 hover:bg-[#082A4B]/[0.02]"
              )}
            >
              {isSelected && (
                <span className="absolute top-1.5 right-1.5">
                  <Check className="h-3.5 w-3.5 text-[#082A4B]" />
                </span>
              )}
              <span className="text-sm">{formatLabel(option)}</span>
              {isAiDetected && !isSelected && (
                <span className="mt-1 text-[10px] text-muted-foreground">AI pick</span>
              )}
              {isAiDetected && isSelected && (
                <span className="mt-1 text-[10px] text-[#082A4B]/60">AI pick</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DetectionEditor({
  detections,
  onUpdate,
  onConfirm,
}: DetectionEditorProps) {
  // Track current selected values (AI values are pre-filled)
  const fields: Array<{ key: string; attribute: DetectedAttribute }> = [
    { key: "cabinetType", attribute: detections.cabinetType },
    { key: "countertopMaterial", attribute: detections.countertopMaterial },
    { key: "flooringMaterial", attribute: detections.flooringMaterial },
    { key: "kitchenSize", attribute: detections.kitchenSize },
    { key: "overallCondition", attribute: detections.overallCondition },
  ];

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6 text-center">
        <h2 className="font-display text-2xl font-bold text-[#082A4B] sm:text-3xl">
          Review AI Detections
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Our AI analyzed your photos. Review each detection below and adjust if needed.
        </p>
      </div>

      {detections.observations.length > 0 && (
        <div className="mb-6 rounded-lg border border-[#082A4B]/10 bg-[#082A4B]/[0.02] p-4">
          <h3 className="font-display mb-2 text-sm font-semibold text-[#082A4B]">
            AI Observations
          </h3>
          <ul className="space-y-1">
            {detections.observations.map((obs, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#082A4B]/50" />
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {fields.map(({ key, attribute }) => (
          <FieldEditor
            key={key}
            field={key}
            attribute={attribute}
            selectedValue={attribute.value}
            onSelect={(value) => onUpdate(key, value)}
          />
        ))}
      </div>

      {/* Detailed Features (collapsible, read-only) */}
      {detections.detectedFeatures && (
        <details className="group mt-8 rounded-lg border border-[#082A4B]/10 bg-[#082A4B]/[0.02]">
          <summary className="flex cursor-pointer items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-[#082A4B] select-none">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Detailed Features ({countFeatures(detections.detectedFeatures)} detected)
            </span>
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-[#082A4B]/10 px-4 py-3">
            <KitchenDetailsInline features={detections.detectedFeatures} />
          </div>
        </details>
      )}

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#028a40] px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-[#028a40]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#028a40] focus-visible:ring-offset-2"
          aria-label="Confirm detections and continue"
        >
          <Check className="h-5 w-5" />
          Confirm &amp; Continue
        </button>
      </div>
    </section>
  );
}

// ─── Inline Kitchen Details (compact read-only) ──────────────────────────────

function countFeatures(features: DetectedFeatures): number {
  let count = 0;
  if (features.kitchenLayout) count++;
  if (features.island?.present !== undefined) count++;
  if (features.cabinetDetails?.style) count++;
  if (features.countertopDetails?.material) count++;
  if (features.backsplash?.material) count++;
  if (features.sink?.type) count++;
  if (features.faucet?.type) count++;
  if (features.appliances?.refrigerator?.type) count++;
  if (features.lighting?.naturalLight) count++;
  if (features.flooring?.material) count++;
  if (features.walls?.finish) count++;
  if (features.ceiling?.type) count++;
  if (features.qualityIndicator) count++;
  if (features.overallStyle) count++;
  if (features.premiumFeatures?.length) count += features.premiumFeatures.length;
  if (features.visibleWear?.length) count += features.visibleWear.length;
  return count;
}

function KitchenDetailsInline({ features }: { features: DetectedFeatures }) {
  const rows: { label: string; value: React.ReactNode }[] = [];

  if (features.kitchenLayout) rows.push({ label: "Layout", value: features.kitchenLayout });

  if (features.island) {
    const parts: string[] = [];
    if (features.island.present) parts.push("Present");
    if (features.island.seating) parts.push("Seating");
    if (features.island.sink) parts.push("Sink");
    if (features.island.electrical) parts.push("Electrical");
    if (parts.length) rows.push({ label: "Island", value: parts.join(", ") });
  }

  if (features.cabinetDetails?.style) {
    let v = features.cabinetDetails.style;
    if (features.cabinetDetails.finish) v += ` (${features.cabinetDetails.finish})`;
    rows.push({ label: "Cabinets", value: v });
  }

  if (features.countertopDetails?.material) {
    let v = features.countertopDetails.material;
    if (features.countertopDetails.edgeProfile) v += ` · ${features.countertopDetails.edgeProfile}`;
    rows.push({ label: "Countertops", value: v });
  }

  if (features.backsplash?.material) {
    let v = features.backsplash.material;
    if (features.backsplash.pattern) v += ` (${features.backsplash.pattern})`;
    rows.push({ label: "Backsplash", value: v });
  }

  if (features.sink?.type) {
    let v = features.sink.type;
    if (features.sink.material) v += ` · ${features.sink.material}`;
    rows.push({ label: "Sink", value: v });
  }

  if (features.faucet?.type) {
    let v = features.faucet.type;
    if (features.faucet.finish) v += ` · ${features.faucet.finish}`;
    rows.push({ label: "Faucet", value: v });
  }

  if (features.appliances?.refrigerator?.type) rows.push({ label: "Refrigerator", value: features.appliances.refrigerator.type });
  if (features.appliances?.range?.type) rows.push({ label: "Range", value: `${features.appliances.range.type} (${features.appliances.range.fuel ?? "N/A"})` });

  if (features.lighting) {
    const parts: string[] = [];
    if (features.lighting.naturalLight) parts.push(`Natural: ${features.lighting.naturalLight}`);
    if (features.lighting.pendantCount) parts.push(`${features.lighting.pendantCount} pendants`);
    if (features.lighting.recessed) parts.push("Recessed");
    if (features.lighting.underCabinet) parts.push("Under-cabinet");
    if (parts.length) rows.push({ label: "Lighting", value: parts.join(", ") });
  }

  if (features.flooring?.material) rows.push({ label: "Flooring", value: features.flooring.material });
  if (features.walls?.finish) rows.push({ label: "Walls", value: features.walls.finish });
  if (features.ceiling?.type) rows.push({ label: "Ceiling", value: features.ceiling.type });
  if (features.qualityIndicator) rows.push({ label: "Quality", value: features.qualityIndicator });
  if (features.overallStyle) rows.push({ label: "Style", value: features.overallStyle });

  if (features.premiumFeatures?.length) {
    rows.push({ label: "Premium", value: features.premiumFeatures.map(f => f.replace(/[<>]/g, "")).join(", ") });
  }

  if (features.visibleWear?.length) {
    rows.push({ label: "Wear", value: features.visibleWear.map(w => w.replace(/[<>]/g, "")).join(", ") });
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
      {rows.map((r, i) => (
        <div key={i} className="col-span-2 sm:col-span-1 flex items-baseline gap-1.5">
          <span className="shrink-0 text-xs font-medium text-muted-foreground">{r.label}:</span>
          <span className="text-[#082A4B]">{r.value}</span>
        </div>
      ))}
    </div>
  );
}
