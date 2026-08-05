import { useMemo, useState } from "react";
import { ArrowRight, Calculator, MapPin } from "lucide-react";
import { calculateEstimate } from "@/lib/estimator-engine";
import type { EstimatorAnswers } from "@/lib/estimator-engine";
import {
  calculateRoofCost,
  type RoofMaterialRate,
  type RoofPitchClass,
} from "@/lib/roof/roof-cost-engine";

const PITCH_OPTIONS: { id: RoofPitchClass; label: string }[] = [
  { id: "flat", label: "Flat / low" },
  { id: "standard", label: "Standard" },
  { id: "steep", label: "Steep" },
  { id: "very_steep", label: "Very steep" },
];

const MATERIAL_OPTIONS: { id: RoofMaterialRate; label: string; wizard: EstimatorAnswers["roofMaterial"] }[] =
  [
    { id: "asphalt", label: "3-tab asphalt", wizard: "asphalt" },
    { id: "architectural", label: "Architectural", wizard: "asphalt" },
    { id: "metal", label: "Metal", wizard: "metal" },
    { id: "tile", label: "Tile", wizard: "tile" },
  ];

function formatMoney(n: number) {
  return `$${n.toLocaleString()}`;
}

export function RoofMiniCalculator() {
  const [zipCode, setZipCode] = useState("");
  const [footprintSqFt, setFootprintSqFt] = useState("2000");
  const [pitch, setPitch] = useState<RoofPitchClass>("standard");
  const [material, setMaterial] = useState<RoofMaterialRate>("architectural");

  const footprint = Math.max(300, parseInt(footprintSqFt.replace(/,/g, ""), 10) || 0);

  const result = useMemo(() => {
    if (!footprint) return null;

    const materialMeta = MATERIAL_OPTIONS.find((m) => m.id === material) ?? MATERIAL_OPTIONS[1];
    const engine = calculateRoofCost({
      mode: "manual",
      footprintSqFt: footprint,
      pitch,
      complexity: "moderate",
      material,
    });

    const estimate = calculateEstimate({
      projectType: "roof",
      zipCode: zipCode.trim() || undefined,
      squareFootage: footprint,
      roofAction: "replace",
      roofMaterial: materialMeta.wizard,
      roofPitch: pitch,
      roofComplexity: "moderate",
      roofLayers: "one",
      stories: 1,
      roofSize: engine.roofAreaSqFt,
      roofSizeSource: "manual",
    });

    return { engine, estimate };
  }, [footprint, pitch, material, zipCode]);

  const estimateHref = `/estimate?project=roof${zipCode.trim() ? `&zip=${encodeURIComponent(zipCode.trim())}` : ""}`;

  return (
    <div
      id="roof-calculator"
      className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-ink">
            Instant roof cost calculator
          </h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Planning ranges from CostReno&apos;s roof estimate engine. Refine with layers, stories,
            and local factors in the full estimator.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-ink mb-1.5 block" htmlFor="roof-mini-zip">
            ZIP code (optional)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="roof-mini-zip"
              type="text"
              inputMode="numeric"
              maxLength={10}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="90210"
              className="w-full h-11 rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-ink mb-1.5 block" htmlFor="roof-mini-size">
            Home footprint (sq ft)
          </label>
          <input
            id="roof-mini-size"
            type="text"
            inputMode="numeric"
            value={footprintSqFt}
            onChange={(e) => setFootprintSqFt(e.target.value)}
            placeholder="2,000"
            className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink mb-1.5 block" htmlFor="roof-mini-pitch">
            Roof pitch
          </label>
          <select
            id="roof-mini-pitch"
            value={pitch}
            onChange={(e) => setPitch(e.target.value as RoofPitchClass)}
            className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {PITCH_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-ink mb-1.5 block" htmlFor="roof-mini-material">
            Material
          </label>
          <select
            id="roof-mini-material"
            value={material}
            onChange={(e) => setMaterial(e.target.value as RoofMaterialRate)}
            className="w-full h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {MATERIAL_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div className="mt-5 rounded-xl border border-border bg-muted/20 p-4">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">
            Estimated range
          </p>
          <p className="font-display text-2xl sm:text-3xl font-bold text-ink">
            {formatMoney(result.estimate.low)} – {formatMoney(result.estimate.high)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Midpoint {formatMoney(result.estimate.mid)} · ~{result.engine.roofingSquares} squares
            after pitch and waste
          </p>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            Tear-off allowance in this quick model: {formatMoney(result.engine.tearOffCost)}. Add
            decking repairs and multi-layer removal in the full estimate.
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <a
          href={estimateHref}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition"
        >
          Get a ZIP-based roof estimate <ArrowRight className="h-4 w-4" />
        </a>
        <a
          href="/quote-analyzer"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-ink hover:bg-muted/40 transition"
        >
          Analyze a roofing quote
        </a>
      </div>
    </div>
  );
}
