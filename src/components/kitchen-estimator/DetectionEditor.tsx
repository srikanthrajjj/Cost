import { Check, Sparkles, AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIDetectionResult, DetectedAttribute } from "../../lib/kitchen-estimator/types";

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

      <div className="mt-8 flex justify-center">
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
