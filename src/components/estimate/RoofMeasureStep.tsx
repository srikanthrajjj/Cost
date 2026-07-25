import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { EstimatorAnswers } from "@/lib/estimator-engine";
import { resolveRegionalMultiplier } from "@/lib/estimator-engine";
import {
  calculateRoofCost,
  type RoofComplexityClass,
  type RoofPitchClass,
} from "@/lib/roof/roof-cost-engine";

const PITCH_OPTIONS: { value: RoofPitchClass; label: string; desc: string }[] = [
  { value: "flat", label: "Flat", desc: "Low slope, ~1.03×" },
  { value: "standard", label: "Standard", desc: "Typical home, ~1.10×" },
  { value: "steep", label: "Steep", desc: "Harder to walk, ~1.20×" },
  { value: "very_steep", label: "Very steep", desc: "Extra safety setup, ~1.36×" },
];

const COMPLEXITY_OPTIONS: { value: RoofComplexityClass; label: string; desc: string }[] = [
  { value: "simple", label: "Simple", desc: "10% waste buffer" },
  { value: "moderate", label: "Moderate", desc: "17% waste buffer" },
  { value: "complex", label: "Complex", desc: "22% waste buffer" },
];

function normalizeComplexity(value?: string): RoofComplexityClass {
  if (value === "average") return "moderate";
  if (value === "simple" || value === "moderate" || value === "complex") return value;
  return "moderate";
}

function normalizePitch(value?: string): RoofPitchClass {
  if (value === "low") return "flat";
  if (value === "medium") return "standard";
  if (value === "steep" || value === "very_steep") return value as RoofPitchClass;
  if (value === "flat" || value === "standard") return value;
  return "standard";
}

export function RoofMeasureStep({
  answers,
  onChange,
}: {
  answers: EstimatorAnswers;
  onChange: (key: keyof EstimatorAnswers, value: unknown) => void;
}) {
  const [footprintInput, setFootprintInput] = useState(
    answers.roofFootprintSqFt?.toString() ?? "",
  );
  const [pitch, setPitch] = useState<RoofPitchClass>(normalizePitch(answers.roofPitch));
  const [complexity, setComplexity] = useState<RoofComplexityClass>(
    normalizeComplexity(answers.roofComplexity),
  );

  const parsedFootprint = parseFloat(footprintInput.replace(/,/g, ""));
  const hasFootprint = Number.isFinite(parsedFootprint) && parsedFootprint > 0;

  useEffect(() => {
    onChange("roofPitch", pitch);
    onChange("roofComplexity", complexity);
  }, [pitch, complexity, onChange]);

  useEffect(() => {
    if (!hasFootprint) return;

    const regionMultiplier = resolveRegionalMultiplier(answers).multiplier;
    const result = calculateRoofCost({
      mode: "manual",
      footprintSqFt: parsedFootprint,
      pitch,
      complexity,
      regionMultiplier,
    });
    const nextFootprint = Math.round(parsedFootprint);

    if (
      answers.roofSize === result.roofAreaSqFt &&
      answers.roofFootprintSqFt === nextFootprint &&
      answers.roofSizeSource === "manual"
    ) {
      return;
    }

    onChange("roofFootprintSqFt", nextFootprint);
    onChange("roofSize", result.roofAreaSqFt);
    onChange("roofSizeSource", "manual");
  }, [
    parsedFootprint,
    pitch,
    complexity,
    hasFootprint,
    answers.roofSize,
    answers.roofFootprintSqFt,
    answers.roofSizeSource,
    answers.zipCode,
    answers.city,
    answers.state,
    onChange,
  ]);

  const preview = hasFootprint
    ? calculateRoofCost({
        mode: "manual",
        footprintSqFt: parsedFootprint,
        pitch,
        complexity,
        regionMultiplier: resolveRegionalMultiplier(answers).multiplier,
      })
    : null;

  return (
    <div className="max-w-lg space-y-4">
      <div className="space-y-2">
        <label htmlFor="roof-footprint" className="text-xs font-semibold text-primary block">
          Footprint (sq ft)
        </label>
        <input
          id="roof-footprint"
          type="number"
          min={200}
          max={15000}
          step={50}
          value={footprintInput}
          onChange={(e) => setFootprintInput(e.target.value)}
          placeholder="e.g. 1,800"
          className="w-full h-12 rounded-xl border-2 border-border bg-white px-4 text-base font-semibold text-ink outline-none focus:border-accent transition"
        />
        <p className="text-[11px] text-muted-foreground">
          Plan-view ground footprint, not sloped roof surface. We add a 6% overhang factor for
          manual entry.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <fieldset className="space-y-1.5">
          <legend className="text-xs font-semibold text-primary">Pitch</legend>
          <div className="space-y-1">
            {PITCH_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  "flex items-start gap-2 rounded-lg border px-2.5 py-2 cursor-pointer transition",
                  pitch === opt.value
                    ? "border-accent/40 bg-accent/[0.05]"
                    : "border-border/70 hover:bg-muted/20",
                )}
              >
                <input
                  type="radio"
                  name="roof-pitch"
                  value={opt.value}
                  checked={pitch === opt.value}
                  onChange={() => setPitch(opt.value)}
                  className="mt-0.5 accent-accent"
                />
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-ink">{opt.label}</span>
                  <span className="block text-[10px] text-muted-foreground">{opt.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-1.5">
          <legend className="text-xs font-semibold text-primary">Complexity</legend>
          <div className="space-y-1">
            {COMPLEXITY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  "flex items-start gap-2 rounded-lg border px-2.5 py-2 cursor-pointer transition",
                  complexity === opt.value
                    ? "border-accent/40 bg-accent/[0.05]"
                    : "border-border/70 hover:bg-muted/20",
                )}
              >
                <input
                  type="radio"
                  name="roof-complexity"
                  value={opt.value}
                  checked={complexity === opt.value}
                  onChange={() => setComplexity(opt.value)}
                  className="mt-0.5 accent-accent"
                />
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-ink">{opt.label}</span>
                  <span className="block text-[10px] text-muted-foreground">{opt.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {preview && (
        <div className="rounded-xl border border-border bg-[#082A4B]/[0.03] p-4 space-y-2">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Roof area
              </div>
              <div className="font-display font-bold text-primary tabular-nums">
                {preview.roofAreaSqFt.toLocaleString()} sq ft
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Squares
              </div>
              <div className="font-display font-bold text-primary tabular-nums">
                {preview.roofingSquares}
              </div>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
              Material + tear-off range (planning)
            </div>
            <div className="text-lg font-display font-bold text-primary tabular-nums">
              ${preview.costLow.toLocaleString()} – ${preview.costHigh.toLocaleString()}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground leading-snug">
            Includes waste factor and tear-off (${preview.tearOffCost.toLocaleString()}). Full
            installed cost in your report also reflects local labor, permits, and project details.
            {resolveRegionalMultiplier(answers).source !== "national" &&
              ` Adjusted for ${resolveRegionalMultiplier(answers).label}.`}
          </p>
        </div>
      )}
    </div>
  );
}
