import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  ArrowLeft, ArrowRight, Check, ChevronRight, Download, FileText,
  Shield, TrendingUp, Clock, Wrench, Sparkles, X,
  AlertCircle, Info, MapPin, Building2, Calendar, DollarSign,
  CheckCircle2, HelpCircle,
} from "lucide-react";
import { calculateEstimate } from "@/lib/estimator-engine";
import { getActiveSteps } from "@/lib/estimator-steps";
import type { EstimatorAnswers, LiveEstimate } from "@/lib/estimator-engine";
import type { StepDef, Question } from "@/lib/estimator-steps";
import projRoof from "@/assets/proj-roof.jpg";
import projKitchen from "@/assets/proj-kitchen.jpg";
import projBathroom from "@/assets/proj-bathroom.jpg";
import projHvac from "@/assets/proj-hvac.jpg";
import projWindows from "@/assets/proj-windows.jpg";
import projSolar from "@/assets/proj-solar.jpg";

export const Route = createFileRoute("/estimate")({
  head: () => ({ meta: [{ title: "Cost Estimator — CostReno" }] }),
  component: EstimatorPage,
});

const STORAGE_KEY = "costreno_estimator_v2";
const fmt = (n: number) => "$" + Math.round(n).toLocaleString();
const fmtK = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;

// ─── SVG icon map for project cards ──────────────────────────────────────────
const PROJECT_ICONS: Record<string, string> = {
  roof:       "/House.svg",
  kitchen:    "/Kitchen.svg",
  bathroom:   "/Bathtub.svg",
  hvac:       "/Air Conditioner.svg",
  windows:    "/Window.svg",
  flooring:   "/Floor Tiles.svg",
  painting:   "/Paint Roller.svg",
  solar:      "/Solar Panel.svg",
  deck:       "/Balcony.svg",
  plumbing:   "/Plumbing.svg",
  electrical: "/Electrical Outlet.svg",
};

// ─── Project image map ────────────────────────────────────────────────────────
const PROJECT_IMAGES: Record<string, string> = {
  roof:       projRoof,
  kitchen:    projKitchen,
  bathroom:   projBathroom,
  hvac:       projHvac,
  windows:    projWindows,
  solar:      projSolar,
};

// ─── Project name map ─────────────────────────────────────────────────────────
const PROJECT_NAMES: Record<string, string> = {
  roof: "Roof Replacement",
  kitchen: "Kitchen Remodel",
  bathroom: "Bathroom Remodel",
  hvac: "HVAC System",
  windows: "Windows",
  flooring: "Flooring",
  painting: "Painting",
  solar: "Solar Panels",
  deck: "Deck / Patio",
  plumbing: "Plumbing",
  electrical: "Electrical",
};

// ─── Step label map ───────────────────────────────────────────────────────────
const STEP_LABELS: Record<string, string> = {
  project: "Project", location: "Location", property: "Property",
  "details-roof": "Details", "details-kitchen": "Details", "details-bathroom": "Details",
  "details-hvac": "Details", "details-windows": "Details", "details-flooring": "Details",
  "details-solar": "Details", "details-deck": "Details", "details-plumbing": "Details",
  "details-electrical": "Details", "details-painting": "Details",
  condition: "Condition", budget: "Budget", insurance: "Insurance",
};

// ─── Contextual AI tips per question ─────────────────────────────────────────
const TIPS: Partial<Record<keyof EstimatorAnswers, string>> = {
  roofMaterial:    "Metal roofs last 2× longer than asphalt and may lower your homeowner's insurance premium.",
  roofAction:      "A full replacement is often more cost-effective than repeated repairs on roofs older than 15 years.",
  yearBuilt:       "Homes built before 1980 may require additional permits and asbestos testing.",
  kitchenCabinets: "Semi-custom cabinets offer the best value — 80% of the look for 50% of custom cabinet cost.",
  bathroomFixtures:"Mid-range fixtures offer the best ROI — luxury upgrades rarely return full cost at resale.",
  hvacType:        "Heat pumps are up to 3× more efficient than traditional systems and may qualify for tax credits.",
  windowType:      "Double-pane windows pay back through energy savings within 5–7 years in most climates.",
  solarBattery:    "Battery storage qualifies for the 30% federal ITC (Investment Tax Credit) through 2032.",
  causeOfProject:  "Storm and water damage claims have the highest insurance approval rates — document everything.",
  currentCondition:"Poor condition adds 15–25% to project cost due to extra prep, demo, and repair work.",
};

// ─── Donut chart ──────────────────────────────────────────────────────────────
function DonutChart({ breakdown, total }: { breakdown: { label: string; amount: number; pct: number; color: string }[]; total: number }) {
  let cumulative = 0;
  const r = 54; const cx = 64; const cy = 64; const circumference = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0">
        <svg width="128" height="128" viewBox="0 0 128 128">
          {breakdown.map((item, i) => {
            const dash = (item.pct / 100) * circumference;
            const offset = -cumulative * circumference / 100;
            cumulative += item.pct;
            return (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                stroke={item.color} strokeWidth="16"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={offset - circumference * 0.25}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[10px] text-muted-foreground">Total</div>
          <div className="text-sm font-bold text-ink">{fmtK(total)}</div>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {breakdown.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
            <div className="flex-1 flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="text-xs font-semibold text-ink">{fmtK(item.amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Cards Question ───────────────────────────────────────────────────────────
function CardsQuestion({ q, value, onChange }: { q: Question; value: string | undefined; onChange: (v: string) => void }) {
  const [flash, setFlash] = useState<string | null>(null);
  const handleClick = (v: string) => { setFlash(v); setTimeout(() => { setFlash(null); onChange(v); }, 180); };
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {q.choices!.map((c) => {
        const iconSrc = PROJECT_ICONS[c.value];
        const isSelected = value === c.value;
        const isFlashing = flash === c.value;
        const amount = c.desc ? c.desc.replace("Avg ", "").replace("Avg", "") : "";
        return (
          <button key={c.value} onClick={() => handleClick(c.value)}
            className={`group relative flex flex-col items-center text-center gap-2 px-3 pt-5 pb-4 rounded-2xl border-2 transition-all duration-200
              ${isSelected
                ? "border-accent bg-accent/[0.06] shadow-lg shadow-accent/10"
                : "border-border bg-white hover:border-accent/40 hover:shadow-md hover:-translate-y-0.5"
              } ${isFlashing ? "scale-95" : "scale-100"}`}
          >
            {/* Selected checkmark */}
            {isSelected && (
              <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center animate-in zoom-in duration-150">
                <Check className="h-3 w-3 text-white" />
              </span>
            )}

            {/* SVG Icon — large, centered */}
            <div className="w-full flex items-center justify-center h-20 mb-1">
              {iconSrc
                ? <img src={iconSrc} alt={c.label} className="h-16 w-16 object-contain" />
                : <Sparkles className="h-10 w-10 text-muted-foreground" />
              }
            </div>

            {/* Project name */}
            <span className={`text-sm font-semibold leading-tight ${isSelected ? "text-ink" : "text-ink/75"}`}>
              {c.label}
            </span>

            {/* Amount */}
            {amount && (
              <span className={`text-sm font-bold leading-none ${isSelected ? "text-accent" : "text-ink/60"}`}>
                {amount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Select Grid Question ─────────────────────────────────────────────────────
function SelectGridQuestion({ q, value, onChange }: { q: Question; value: string | undefined; onChange: (v: string) => void }) {
  const [flash, setFlash] = useState<string | null>(null);
  const handleClick = (v: string) => { setFlash(v); setTimeout(() => { setFlash(null); onChange(v); }, 160); };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl">
      {q.choices!.map((c) => {
        const isSelected = value === c.value;
        return (
          <button key={c.value} onClick={() => handleClick(c.value)}
            className={`group flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200
              ${isSelected
                ? "border-accent bg-accent/[0.06] shadow-md shadow-accent/8"
                : "border-border bg-white hover:border-accent/40 hover:bg-muted/20 hover:shadow-sm"
              } ${flash === c.value ? "scale-95" : "scale-100"}`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all
              ${isSelected ? "bg-accent text-white" : "bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"}`}>
              {/* Use Lucide icon if mapped, else text icon fallback */}
              {c.icon && !/\p{Emoji}/u.test(c.icon)
                ? <span className="text-base">{c.icon}</span>
                : <span className="text-base leading-none">{c.icon}</span>}
            </div>
            <div className="min-w-0 flex-1">
              <div className={`text-sm font-semibold leading-tight ${isSelected ? "text-accent" : "text-ink"}`}>{c.label}</div>
              {c.desc && <div className="text-[11px] text-muted-foreground mt-0.5">{c.desc}</div>}
            </div>
            {isSelected && <Check className="h-4 w-4 text-accent shrink-0 animate-in zoom-in duration-150" />}
          </button>
        );
      })}
    </div>
  );
}

// ─── Number Question ──────────────────────────────────────────────────────────
function NumberQuestion({ q, value, onChange }: { q: Question; value: number | undefined; onChange: (v: number) => void }) {
  const [raw, setRaw] = useState(value?.toString() ?? "");
  return (
    <div className="max-w-sm space-y-2">
      <div className="relative">
        <input type="number" value={raw} placeholder={q.placeholder}
          min={q.min} max={q.max} step={q.step}
          onChange={(e) => { setRaw(e.target.value); const n = parseFloat(e.target.value); if (!isNaN(n)) onChange(n); }}
          className="w-full h-14 rounded-xl border-2 border-border bg-white px-5 pr-20 text-lg font-semibold text-ink outline-none focus:border-accent transition-colors"
        />
        {q.unit && <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">{q.unit}</span>}
      </div>
      {q.subtitle && <p className="text-xs text-muted-foreground">{q.subtitle}</p>}
    </div>
  );
}

// ─── Text Question ────────────────────────────────────────────────────────────
function TextQuestion({ q, value, onChange }: { q: Question; value: string | undefined; onChange: (v: string) => void }) {
  return (
    <div className="max-w-sm">
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={value ?? ""} placeholder={q.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-14 rounded-xl border-2 border-border bg-white pl-11 pr-5 text-lg font-semibold text-ink outline-none focus:border-accent transition-colors"
        />
      </div>
    </div>
  );
}

// ─── Toggle Question ──────────────────────────────────────────────────────────
function ToggleQuestion({ q, value, onChange }: { q: Question; value: boolean | undefined; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-3 max-w-xs">
      {[{ v: true, label: "Yes" }, { v: false, label: "No" }].map(({ v, label }) => (
        <button key={label} onClick={() => onChange(v)}
          className={`flex-1 h-14 rounded-xl border-2 font-semibold text-sm transition-all duration-200
            ${value === v ? "border-accent bg-accent/[0.06] text-accent shadow-md" : "border-border bg-white text-ink hover:border-accent/40 hover:bg-muted/20"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Budget Question ──────────────────────────────────────────────────────────
function BudgetQuestion({ q, value, onChange }: { q: Question; value: number | undefined; onChange: (v: number) => void }) {
  const presets = [10000, 25000, 50000, 75000, 100000];
  const [raw, setRaw] = useState(value?.toString() ?? "");
  return (
    <div className="max-w-sm space-y-4">
      <div className="relative">
        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input type="number" value={raw} placeholder="Enter your budget"
          onChange={(e) => { setRaw(e.target.value); const n = parseFloat(e.target.value); if (!isNaN(n)) onChange(n); }}
          className="w-full h-14 rounded-xl border-2 border-border bg-white pl-11 pr-5 text-lg font-semibold text-ink outline-none focus:border-accent transition-colors"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button key={p} onClick={() => { onChange(p); setRaw(p.toString()); }}
            className={`px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all
              ${value === p ? "border-accent bg-accent/10 text-accent" : "border-border bg-white text-muted-foreground hover:border-accent/40"}`}
          >{fmt(p)}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Live Estimate Panel ──────────────────────────────────────────────────────
const BREAKDOWN_COLORS = ["#03A44D", "#082A4B", "#60a5fa", "#f59e0b", "#a78bfa"];

function EstimatePanel({ estimate, prevMid }: { estimate: LiveEstimate; prevMid: number }) {
  const hasData = estimate.mid > 0;
  const delta = hasData && prevMid > 0 ? estimate.mid - prevMid : 0;
  const [showDelta, setShowDelta] = useState(false);

  useEffect(() => {
    if (delta !== 0) { setShowDelta(true); const t = setTimeout(() => setShowDelta(false), 2000); return () => clearTimeout(t); }
  }, [estimate.mid]);

  const stepsLeft = Math.max(0, Math.ceil((95 - estimate.confidence) / 10));
  const insuranceStatus = estimate.insuranceEligible
    ? { label: "Likely Covered", color: "text-accent", bg: "bg-accent/10", dot: "bg-accent" }
    : { label: "Not Covered", color: "text-muted-foreground", bg: "bg-muted/50", dot: "bg-muted-foreground/40" };

  const breakdownWithColors = estimate.breakdown.map((b, i) => ({ ...b, color: BREAKDOWN_COLORS[i] ?? "#e5e7eb" }));

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      {/* Main cost card */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm overflow-hidden relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Live Estimate</span>
          </div>
          {hasData && showDelta && delta !== 0 && (
            <div className={`text-xs font-bold px-2 py-1 rounded-full animate-in fade-in zoom-in duration-200
              ${delta > 0 ? "text-red-500 bg-red-50" : "text-accent bg-accent/10"}`}>
              {delta > 0 ? "+" : ""}{fmt(delta)}
            </div>
          )}
        </div>

        {hasData ? (
          <>
            <div className="text-[42px] font-display font-bold text-ink leading-none transition-all duration-500">
              {fmt(estimate.mid)}
            </div>
            <div className="text-sm text-muted-foreground mt-1.5">
              Range: <span className="font-medium text-ink">{fmt(estimate.low)} – {fmt(estimate.high)}</span>
            </div>

            {/* Confidence */}
            <div className="mt-5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Accuracy</span>
                <span className="text-xs font-bold text-ink">{estimate.confidence}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-accent transition-all duration-700 ease-out" style={{ width: `${estimate.confidence}%` }} />
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {stepsLeft > 0 ? `Answer ${stepsLeft} more question${stepsLeft > 1 ? "s" : ""} to reach 95% accuracy.` : "High confidence estimate."}
              </p>
            </div>
          </>
        ) : (
          <div className="py-4 text-sm text-muted-foreground">Select a project to see your estimate.</div>
        )}
      </div>

      {/* Project snapshot */}
      {hasData && (
        <div className="rounded-2xl border border-border bg-white p-5 space-y-3">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Project Snapshot</div>
          <div className="divide-y divide-border/50">
            {[
              { icon: Clock,   label: "Timeline",  value: estimate.timeline },
              { icon: Wrench,  label: "Permit",    value: estimate.permitRequired ? "Required" : "Not required",
                highlight: estimate.permitRequired },
            ].map(({ icon: Icon, label, value, highlight }) => (
              <div key={label} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />{label}
                </div>
                <span className={`text-xs font-semibold ${highlight ? "text-amber-600" : "text-ink"}`}>{value}</span>
              </div>
            ))}
            {/* Insurance status badge */}
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />Insurance
              </div>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${insuranceStatus.bg} ${insuranceStatus.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${insuranceStatus.dot}`} />
                {insuranceStatus.label}
              </div>
            </div>
          </div>
          {estimate.insuranceEligible && (
            <button className="w-full text-xs text-accent font-semibold flex items-center justify-between px-3 py-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition">
              Why? Check Coverage <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Donut breakdown */}
      {hasData && (
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Cost Breakdown</div>
          <DonutChart breakdown={breakdownWithColors} total={estimate.mid} />
        </div>
      )}
    </div>
  );
}

// ─── AI Tip Card ──────────────────────────────────────────────────────────────
function AiTip({ tip }: { tip: string }) {
  return (
    <div className="mt-6 flex items-start gap-3 px-4 py-3.5 rounded-xl bg-[#082A4B]/4 border border-[#082A4B]/10 animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="w-7 h-7 rounded-lg bg-[#082A4B] flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
      </div>
      <div>
        <div className="text-[11px] font-bold text-[#082A4B]/60 uppercase tracking-wider mb-0.5">CostReno AI Tip</div>
        <p className="text-sm text-ink/80 leading-relaxed">{tip}</p>
      </div>
    </div>
  );
}

// ─── Labeled Step Stepper ─────────────────────────────────────────────────────
function StepStepper({ steps, currentIdx }: { steps: StepDef[]; currentIdx: number }) {
  // Collapse to dots on small screens, show labels on md+
  return (
    <div className="w-full mb-8">
      {/* Mobile: simple dots */}
      <div className="flex items-center gap-1.5 md:hidden">
        {steps.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIdx ? "w-6 bg-accent" : i < currentIdx ? "w-4 bg-accent/50" : "w-4 bg-border"}`} />
        ))}
        <span className="ml-2 text-xs text-muted-foreground">{currentIdx + 1}/{steps.length}</span>
      </div>
      {/* Desktop: labeled steps */}
      <div className="hidden md:flex items-center">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${i < currentIdx ? "bg-accent text-white" : i === currentIdx ? "bg-[#082A4B] text-white ring-4 ring-[#082A4B]/10" : "bg-muted text-muted-foreground"}`}>
                {i < currentIdx ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-[10px] font-semibold whitespace-nowrap transition-colors ${i === currentIdx ? "text-ink" : i < currentIdx ? "text-accent" : "text-muted-foreground"}`}>
                {STEP_LABELS[s.id] ?? s.id}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-4 transition-colors duration-500 ${i < currentIdx ? "bg-accent" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Question Renderer ────────────────────────────────────────────────────────
function QuestionRenderer({ question, answers, onChange }: {
  question: Question; answers: EstimatorAnswers;
  onChange: (key: keyof EstimatorAnswers, value: unknown) => void;
}) {
  const val = answers[question.id];
  const h = (v: unknown) => onChange(question.id, v);
  if (question.type === "cards")       return <CardsQuestion       q={question} value={val as string}  onChange={h} />;
  if (question.type === "select-grid") return <SelectGridQuestion   q={question} value={val as string}  onChange={h} />;
  if (question.type === "number")      return <NumberQuestion       q={question} value={val as number}  onChange={h} />;
  if (question.type === "text")        return <TextQuestion         q={question} value={val as string}  onChange={h} />;
  if (question.type === "toggle")      return <ToggleQuestion       q={question} value={val as boolean} onChange={h} />;
  if (question.type === "budget")      return <BudgetQuestion       q={question} value={val as number}  onChange={h} />;
  return null;
}

// ─── Final Report ─────────────────────────────────────────────────────────────
function FinalReport({ answers, estimate, onRestart }: { answers: EstimatorAnswers; estimate: LiveEstimate; onRestart: () => void }) {
  const projectLabel: Record<string, string> = {
    roof: "Roof Replacement", kitchen: "Kitchen Remodel", bathroom: "Bathroom Remodel",
    hvac: "HVAC Replacement", windows: "Window Replacement", flooring: "Flooring",
    painting: "Painting", solar: "Solar Installation", deck: "Deck / Patio",
    plumbing: "Plumbing", electrical: "Electrical",
  };
  const insuranceBadge = estimate.insuranceEligible
    ? { label: "🟢 Likely Covered",  color: "bg-accent/10 text-accent border-accent/20" }
    : { label: "🔴 Not Covered",     color: "bg-red-50 text-red-500 border-red-100" };
  const breakdownWithColors = estimate.breakdown.map((b, i) => ({ ...b, color: BREAKDOWN_COLORS[i] ?? "#e5e7eb" }));
  const nextSteps = [
    { icon: FileText,   label: "Upload Contractor Quote", desc: "AI detects overcharges & red flags" },
    { icon: Download,   label: "Download PDF Report",     desc: "Save your full estimate" },
    { icon: TrendingUp, label: "Compare Quotes",          desc: "Side-by-side quote comparison" },
    { icon: Shield,     label: "Check Insurance",         desc: "See what your policy may cover" },
  ];
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Hero card */}
      <div className="rounded-2xl bg-[#082A4B] p-8 md:p-10 text-white">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold mb-5">
          <CheckCircle2 className="h-3.5 w-3.5" /> {estimate.confidence}% Confidence Score
        </div>
        <div className="text-sm text-white/50 mb-2">{projectLabel[answers.projectType ?? ""] ?? "Your Project"}</div>
        <div className="font-display text-5xl md:text-6xl font-bold">{fmt(estimate.mid)}</div>
        <div className="mt-2 text-white/50 text-sm">Typical range: {fmt(estimate.low)} – {fmt(estimate.high)}</div>
        {answers.city && <div className="mt-1 text-white/30 text-xs">Pricing based on {answers.city}{answers.state ? `, ${answers.state}` : ""}</div>}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Timeline", val: estimate.timeline },
            { label: "Permit",   val: estimate.permitRequired ? "Required" : "Not needed" },
            { label: "Start",    val: answers.startTimeline === "asap" ? "ASAP" : answers.startTimeline?.replace("-", "–") ?? "TBD" },
          ].map(({ label, val }) => (
            <div key={label} className="rounded-xl bg-white/10 px-3 py-2.5">
              <div className="text-[10px] text-white/40 mb-0.5">{label}</div>
              <div className="text-sm font-semibold text-white">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown + Summary row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-5">Cost Breakdown</div>
          <DonutChart breakdown={breakdownWithColors} total={estimate.mid} />
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 space-y-1">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Project Summary</div>
          {[
            { label: "Property Size",  val: answers.squareFootage ? `${answers.squareFootage.toLocaleString()} sq ft` : "—" },
            { label: "Property Type",  val: answers.propertyType?.replace("-", " ") ?? "—" },
            { label: "Condition",      val: answers.currentCondition ?? "—" },
            { label: "Cause",          val: answers.causeOfProject?.replace("-", " ") ?? "—" },
          ].map(({ label, val }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0 text-sm">
              <span className="text-muted-foreground capitalize">{label}</span>
              <span className="font-semibold text-ink capitalize">{val}</span>
            </div>
          ))}
          {/* Insurance badge */}
          <div className={`mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold w-full justify-center ${insuranceBadge.color}`}>
            {insuranceBadge.label}
          </div>
          {estimate.insuranceEligible && (
            <button className="w-full flex items-center justify-center gap-2 text-xs text-accent font-semibold py-2 hover:underline">
              Why? Check Coverage <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Next steps */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Recommended Next Steps</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {nextSteps.map((s) => (
            <button key={s.label} className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-accent/40 hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-all">
                <s.icon className="h-5 w-5 text-accent group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-accent transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onRestart} className="flex-1 py-3.5 rounded-xl border-2 border-border text-sm font-semibold text-muted-foreground hover:bg-muted/40 transition">
          Start New Estimate
        </button>
        <a href="/" className="flex-1 py-3.5 rounded-xl bg-accent text-white text-sm font-bold text-center hover:bg-accent/90 transition">
          Back to CostReno
        </a>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function EstimatorPage() {
  const [answers, setAnswers] = useState<EstimatorAnswers>(() => {
    try { 
      // Check for preselected project from chat
      const preselected = sessionStorage.getItem('costreno_preselected_project');
      const stored = localStorage.getItem(STORAGE_KEY);
      const baseAnswers = stored ? JSON.parse(stored) : {};
      if (preselected && !baseAnswers.projectType) {
        return { ...baseAnswers, projectType: preselected as any };
      }
      return baseAnswers;
    } catch { return {}; }
  });
  const [stepIdx, setStepIdx] = useState(() => {
    // If project was preselected from chat, start at step 1 (location), not step 0 (project)
    const preselected = sessionStorage.getItem('costreno_preselected_project');
    if (preselected) {
      sessionStorage.removeItem('costreno_preselected_project'); // Clear it
      return 1; // Start at Location step
    }
    return 0;
  });
  const [questionIdx, setQuestionIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [estimate, setEstimate] = useState<LiveEstimate>(() => calculateEstimate({}));
  const prevMidRef = useRef(0);

  // Persist + recalculate
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    const newEst = calculateEstimate(answers);
    prevMidRef.current = estimate.mid;
    setEstimate(newEst);
  }, [answers]);

  // ZIP → city
  useEffect(() => {
    if (answers.zipCode?.length === 5 && !answers.city) {
      fetch(`https://api.zippopotam.us/us/${answers.zipCode}`)
        .then(r => r.json()).then(d => {
          if (d?.places?.[0]) {
            const p = d.places[0];
            setAnswers(prev => ({ ...prev, city: p["place name"], state: p["state abbreviation"] }));
          }
        }).catch(() => {});
    }
  }, [answers.zipCode]);

  const steps = getActiveSteps(answers);
  const totalSteps = steps.length;
  const currentStep = steps[stepIdx];
  const questions = currentStep?.questions ?? [];
  const currentQuestion = questions[questionIdx];
  const overallProgress = Math.round(((stepIdx + (questionIdx + 1) / Math.max(questions.length, 1)) / totalSteps) * 100);
  // ~2 min per step average
  const minsLeft = Math.max(1, Math.round((totalSteps - stepIdx) * 0.4));

  const setAnswer = useCallback((key: keyof EstimatorAnswers, value: unknown) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }, []);

  const isAnswered = (q: Question) => {
    if (q.optional) return true;
    const v = answers[q.id];
    return v !== undefined && v !== null && v !== "";
  };

  const advance = useCallback(() => {
    let nextQ = questionIdx + 1;
    while (nextQ < questions.length) {
      if (!questions[nextQ].showIf || questions[nextQ].showIf!(answers)) break;
      nextQ++;
    }
    if (nextQ < questions.length) { setQuestionIdx(nextQ); return; }
    let nextS = stepIdx + 1;
    const newSteps = getActiveSteps({ ...answers });
    while (nextS < newSteps.length) {
      if (!newSteps[nextS].showIf || newSteps[nextS].showIf!(answers)) break;
      nextS++;
    }
    if (nextS < newSteps.length) { setStepIdx(nextS); setQuestionIdx(0); }
    else setDone(true);
  }, [questionIdx, questions, stepIdx, answers]);

  const back = () => {
    if (questionIdx > 0) { setQuestionIdx(questionIdx - 1); return; }
    if (stepIdx > 0) { const ps = steps[stepIdx - 1]; setStepIdx(stepIdx - 1); setQuestionIdx(ps.questions.length - 1); }
  };

  const restart = () => { setAnswers({}); setStepIdx(0); setQuestionIdx(0); setDone(false); localStorage.removeItem(STORAGE_KEY); };

  const handleAnswerChange = (key: keyof EstimatorAnswers, value: unknown) => {
    setAnswer(key, value);
    const q = currentQuestion;
    if (q && (q.type === "cards" || q.type === "select-grid" || q.type === "toggle")) {
      setTimeout(advance, 240);
    }
  };

  const tip = currentQuestion ? TIPS[currentQuestion.id] : undefined;
  const isLast = stepIdx === totalSteps - 1 && questionIdx === questions.length - 1;

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <a href="/" className="shrink-0"><img src="/logo.svg" alt="CostReno" style={{ height: "32px", width: "auto" }} /></a>
          {!done && (
            <div className="flex-1 hidden sm:flex items-center gap-3">
              <div className="flex-1 max-w-sm h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${overallProgress}%` }} />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">~{minsLeft} min left</span>
            </div>
          )}
          <div className="flex items-center gap-3 ml-auto">
            {!done && (
              <span className="hidden sm:inline text-xs text-muted-foreground">
                Progress auto-saved
              </span>
            )}
            <button onClick={restart} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-ink transition">
              <X className="h-3.5 w-3.5" /> Start over
            </button>
          </div>
        </div>
        {!done && <div className="sm:hidden h-1 bg-muted"><div className="h-full bg-accent transition-all duration-500" style={{ width: `${overallProgress}%` }} /></div>}
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {done ? (
          <FinalReport answers={answers} estimate={estimate} onRestart={restart} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
            {/* Left: questions */}
            <div className="flex-1 min-w-0">
              <StepStepper steps={steps} currentIdx={stepIdx} />

              {/* Selected Project Display (when on step 2+) */}
              {stepIdx > 0 && answers.projectType && (
                <div className="mb-8 group rounded-2xl overflow-hidden border-2 border-accent/20 bg-gradient-to-r from-accent/5 to-transparent hover:border-accent/40 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-stretch">
                    {/* Project Image */}
                    <div className="relative w-full sm:w-48 h-40 sm:h-auto overflow-hidden shrink-0">
                      <img
                        src={PROJECT_IMAGES[answers.projectType] || projRoof}
                        alt={PROJECT_NAMES[answers.projectType]}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                    </div>

                    {/* Project Info */}
                    <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xs font-bold text-accent uppercase tracking-widest">Project Selected</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-ink mb-4">
                        {PROJECT_NAMES[answers.projectType] || answers.projectType}
                      </h3>
                      <button
                        onClick={() => setStepIdx(0)}
                        className="w-fit text-sm font-semibold text-accent hover:text-accent/80 transition px-4 py-2 hover:bg-accent/10 rounded-lg"
                      >
                        ← Change Project
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentQuestion && (
                <div key={`${stepIdx}-${questionIdx}`} className="animate-in fade-in slide-in-from-bottom-4 duration-350">
                  {/* Question header */}
                  <div className="mb-7">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider">{currentStep?.title}</span>
                      {currentQuestion.optional && (
                        <span className="px-2.5 py-1 rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">Optional</span>
                      )}
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-ink leading-snug">{currentQuestion.title}</h2>
                    {currentQuestion.subtitle && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{currentQuestion.subtitle}</p>}
                  </div>

                  <QuestionRenderer question={currentQuestion} answers={answers} onChange={handleAnswerChange} />

                  {/* ZIP detected badge */}
                  {currentQuestion.id === "zipCode" && answers.city && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/10 text-accent text-xs font-semibold">
                      <CheckCircle2 className="h-4 w-4" /> Detected: {answers.city}, {answers.state}
                    </div>
                  )}

                  {/* AI Tip */}
                  {tip && <AiTip tip={tip} />}

                  {/* Navigation */}
                  <div className="flex items-center gap-3 mt-8">
                    {(stepIdx > 0 || questionIdx > 0) && (
                      <button onClick={back} className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-border text-sm font-semibold text-muted-foreground hover:bg-muted/40 hover:border-border/80 transition">
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                    )}
                    {(currentQuestion.type === "number" || currentQuestion.type === "text" || currentQuestion.type === "budget") && (
                      <button onClick={advance} disabled={!isAnswered(currentQuestion)}
                        className="flex items-center gap-2 px-7 py-3 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-accent/20">
                        {isLast ? "See My Estimate" : "Continue"} <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                    {currentQuestion.optional && (
                      <button onClick={advance} className="text-xs text-muted-foreground hover:text-ink transition ml-1 underline underline-offset-2">
                        Skip this question
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: live estimate sidebar */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0">
              <EstimatePanel estimate={estimate} prevMid={prevMidRef.current} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
