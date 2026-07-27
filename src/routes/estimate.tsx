import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  ChevronDown,
  Download,
  FileText,
  Shield,
  Clock,
  Wrench,
  Sparkles,
  X,
  AlertCircle,
  MapPin,
  DollarSign,
  CheckCircle2,
  Lock,
  Loader2,
} from "lucide-react";
import {
  calculateEstimate,
  resolveRegionalMultiplier,
  resolveRoofArea,
} from "@/lib/estimator-engine";
import { getActiveSteps, hasRoofArea } from "@/lib/estimator-steps";
import { submitEmailAndDownload } from "@/lib/download-utils";
import { EmailDownloadModal } from "@/components/EmailDownloadModal";
import { EstimateFeedbackCard } from "@/components/estimate/EstimateFeedbackCard";
import { CostBreakdownChart, colorizeBreakdown } from "@/components/estimate/CostBreakdownChart";
import { RoofMeasureStep } from "@/components/estimate/RoofMeasureStep";
import { EstimateSeoSection, ESTIMATOR_FAQS } from "@/components/estimate/EstimateSeoSection";
import { QuestionInfo } from "@/components/estimate/QuestionInfo";
import { buildFaqSchema } from "@/lib/seo";
import { subscribeToNewsletter } from "@/lib/email/subscribe";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { cn } from "@/lib/utils";
import type { EstimatorAnswers, LiveEstimate } from "@/lib/estimator-engine";
import type { StepDef, Question } from "@/lib/estimator-steps";
import projRoof from "@/assets/proj-roof.jpg";
import projKitchen from "@/assets/proj-kitchen.jpg";
import projBathroom from "@/assets/proj-bathroom.jpg";
import projHvac from "@/assets/proj-hvac.jpg";
import projWindows from "@/assets/proj-windows.jpg";
import projSolar from "@/assets/proj-solar.jpg";

export const Route = createFileRoute("/estimate")({
  validateSearch: (search: Record<string, unknown>) => ({
    project: (search.project as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Home renovation cost estimator | CostReno" },
      {
        name: "description",
        content:
          "Get a ZIP-based home renovation cost estimate for roof, kitchen, bathroom, HVAC, windows, flooring, and more. Free planning tool with no signup required.",
      },
      { property: "og:title", content: "Home renovation cost estimator | CostReno" },
      {
        property: "og:description",
        content:
          "Estimate renovation costs with local pricing context before you request contractor quotes.",
      },
      { property: "og:url", content: "https://www.costreno.com/estimate" },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/estimate" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          buildFaqSchema(ESTIMATOR_FAQS.map((faq) => ({ q: faq.q, a: faq.a }))),
        ),
      },
    ],
  }),
  component: EstimatorPage,
});

const STORAGE_KEY = "costreno_estimator_v2";
const fmt = (n: number) => "$" + Math.round(n).toLocaleString();

// ─── SVG icon map for project cards ──────────────────────────────────────────
const PROJECT_ICONS: Record<string, string> = {
  roof: "/House.svg",
  kitchen: "/Kitchen.svg",
  bathroom: "/Bathtub.svg",
  hvac: "/Air Conditioner.svg",
  windows: "/Window.svg",
  flooring: "/Floor Tiles.svg",
  painting: "/Paint Roller.svg",
  solar: "/Solar Panel.svg",
  deck: "/Balcony.svg",
  plumbing: "/Plumbing.svg",
  electrical: "/Electrical Outlet.svg",
};

// ─── Project image map ────────────────────────────────────────────────────────
const PROJECT_IMAGES: Record<string, string> = {
  roof: projRoof,
  kitchen: projKitchen,
  bathroom: projBathroom,
  hvac: projHvac,
  windows: projWindows,
  solar: projSolar,
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

// ─── Option icons for AI detection review ─────────────────────────────────────
const OPTION_ICONS: Record<string, string> = {
  // Cabinets
  "kitchenCabinets:stock": "📦",
  "kitchenCabinets:semi-custom": "🪚",
  "kitchenCabinets:custom": "✨",
  // Countertops
  "kitchenCountertops:laminate": "⬜",
  "kitchenCountertops:quartz": "💎",
  "kitchenCountertops:granite": "🪨",
  "kitchenCountertops:marble": "⚪",
  // Flooring
  "kitchenFlooring:tile": "🔲",
  "kitchenFlooring:hardwood": "🪵",
  "kitchenFlooring:vinyl": "📐",
  "kitchenFlooring:none": "✅",
  // Backsplash
  "kitchenBacksplash:tile": "🧱",
  "kitchenBacksplash:glass": "🪟",
  "kitchenBacksplash:stone": "🪨",
  "kitchenBacksplash:none": "❌",
  // Fixtures
  "kitchenFixtures:keep": "👍",
  "kitchenFixtures:standard": "🚰",
  "kitchenFixtures:upgrade": "✨",
  // Condition
  "currentCondition:excellent": "🌟",
  "currentCondition:good": "👍",
  "currentCondition:fair": "⚠️",
  "currentCondition:poor": "🔧",
};

// ─── Step label map ───────────────────────────────────────────────────────────
const STEP_LABELS: Record<string, string> = {
  project: "Project",
  location: "Location",
  "roof-measure": "Roof size",
  property: "Property",
  "details-roof": "Details",
  "details-kitchen": "Kitchen",
  "details-bathroom": "Details",
  "details-hvac": "Details",
  "details-windows": "Details",
  "details-flooring": "Details",
  "details-solar": "Details",
  "details-deck": "Details",
  "details-plumbing": "Details",
  "details-electrical": "Details",
  "details-painting": "Details",
  condition: "Condition",
  budget: "Budget",
  insurance: "Insurance",
};

// ─── Contextual AI tips per question ─────────────────────────────────────────
const TIPS: Partial<Record<keyof EstimatorAnswers, string>> = {
  roofMaterial:
    "Metal roofs last 2× longer than asphalt and may lower your homeowner's insurance premium.",
  roofAction:
    "A full replacement is often more cost-effective than repeated repairs on roofs older than 15 years.",
  roofPitch:
    "A steep roof needs more material than the floor area below it, plus safety staging for crews.",
  roofComplexity:
    "Valleys, hips, and dormers need extra flashing and cutting, which adds labor hours.",
  roofLayers:
    "Most codes allow two layers maximum. Removing a second layer adds tear-off and disposal cost.",
  yearBuilt: "Homes built before 1980 may require additional permits and asbestos testing.",
  kitchenCabinets:
    "Semi-custom cabinets offer the best value. 80% of the look for 50% of custom cabinet cost.",
  bathroomFixtures:
    "Mid-range fixtures offer the best ROI. Luxury upgrades rarely return full cost at resale.",
  hvacType:
    "Heat pumps are up to 3× more efficient than traditional systems and may qualify for tax credits.",
  hvacDuctwork:
    "Leaky ducts can waste 20–30% of heated or cooled air. Sealing or replacing ducts often improves comfort more than a bigger unit alone.",
  windowType:
    "Double-pane windows pay back through energy savings within 5–7 years in most climates.",
  windowInstallType:
    "Full-frame replacement costs more but fixes rot and air leaks that insert windows can leave behind.",
  flooringPrep:
    "Skipping subfloor prep is a common reason new floors squeak or fail early. Ask contractors what prep is included.",
  flooringRemoval:
    "Glue-down and tile tear-out take longer than carpet or floating floors. Confirm disposal is in the quote.",
  solarBattery:
    "Battery storage qualifies for the 30% federal ITC (Investment Tax Credit) through 2032.",
  deckHeight:
    "Elevated decks need deeper footings and code-compliant railings, which raises both material and labor cost.",
  causeOfProject:
    "Sudden damage from storms, fire, or water may be eligible for an insurance claim. Photos and notes help.",
  currentCondition:
    "Poor condition adds 15–25% to project cost due to extra prep, demo, and repair work.",
};

// ─── Cards Question ───────────────────────────────────────────────────────────
function CardsQuestion({
  q,
  value,
  onChange,
}: {
  q: Question;
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  const [flash, setFlash] = useState<string | null>(null);
  const [notifyOpen, setNotifyOpen] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySuccess, setNotifySuccess] = useState<string | null>(null);

  const handleClick = (v: string) => {
    setFlash(v);
    setTimeout(() => {
      setFlash(null);
      onChange(v);
    }, 180);
  };

  const handleNotifySubmit = async (projectValue: string) => {
    if (!notifyEmail.trim()) return;

    try {
      // TODO: Send email to backend for notification list
      console.log(`Notifying ${notifyEmail} for project: ${projectValue}`);
      setNotifySuccess(projectValue);
      setNotifyEmail("");
      setTimeout(() => setNotifySuccess(null), 2000);
      setNotifyOpen(null);
    } catch (error) {
      console.error("Error subscribing to notifications:", error);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {q.choices!.map((c) => {
        const iconSrc = PROJECT_ICONS[c.value];
        const isSelected = value === c.value;
        const isFlashing = flash === c.value;
        const amount = c.desc ? c.desc.replace("Avg ", "").replace("Avg", "") : "";
        const isDisabled = Boolean(c.comingSoon);
        const isNotifyOpen = notifyOpen === c.value;
        const isNotifySuccess = notifySuccess === c.value;

        return (
          <div key={c.value} className="relative">
            {isDisabled ? (
              <div
                className={`relative flex flex-col items-center text-center gap-2 px-4 pt-6 pb-5 rounded-2xl border-2 border-border bg-white transition-all duration-200 h-full ${
                  isNotifyOpen ? "ring-2 ring-accent/30" : ""
                }`}
                style={{ opacity: 0.75 }}
              >
                {/* Coming Soon Badge - absolute positioned */}
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[9px] font-semibold text-accent">
                  Coming soon
                </span>

                {/* SVG Icon */}
                <div className="w-full flex items-center justify-center h-16">
                  {iconSrc ? (
                    <img src={iconSrc} alt={c.label} className="h-14 w-14 object-contain" />
                  ) : (
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>

                {/* Project name */}
                <span className="text-sm font-semibold leading-tight text-ink">{c.label}</span>

                {/* Amount */}
                {amount && (
                  <span className="text-xs font-bold leading-none text-muted-foreground">
                    {amount}
                  </span>
                )}

                {/* Notify Button or Success State */}
                <div className="mt-auto pt-2 w-full">
                  {isNotifySuccess ? (
                    <div className="w-full py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-semibold flex items-center justify-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Thanks!
                    </div>
                  ) : isNotifyOpen ? (
                    <div className="w-full flex flex-col gap-2">
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleNotifySubmit(c.value);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-xs placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleNotifySubmit(c.value)}
                          disabled={!notifyEmail.trim()}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          Notify
                        </button>
                        <button
                          onClick={() => {
                            setNotifyOpen(null);
                            setNotifyEmail("");
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted/30 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setNotifyOpen(c.value)}
                      className="w-full py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:border-accent/40 hover:text-accent transition"
                    >
                      Notify me
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleClick(c.value)}
                className={`w-full h-full relative flex flex-col items-center text-center gap-2 px-4 pt-6 pb-5 rounded-2xl border-2 transition-all duration-200
                  ${
                    isSelected
                      ? "border-accent bg-accent/[0.06] shadow-lg shadow-accent/10"
                      : "border-border bg-white hover:border-accent/40 hover:shadow-md hover:-translate-y-0.5"
                  } ${isFlashing ? "scale-95" : "scale-100"}`}
              >
                {/* Selected checkmark */}
                {isSelected && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center animate-in zoom-in duration-150">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}

                {/* SVG Icon */}
                <div className="w-full flex items-center justify-center h-16">
                  {iconSrc ? (
                    <img src={iconSrc} alt={c.label} className="h-14 w-14 object-contain" />
                  ) : (
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>

                {/* Project name */}
                <span
                  className={`text-sm font-semibold leading-tight ${isSelected ? "text-ink" : "text-ink/75"}`}
                >
                  {c.label}
                </span>

                {/* Amount */}
                {amount && (
                  <span
                    className={`text-xs font-bold leading-none ${isSelected ? "text-accent" : "text-ink/60"}`}
                  >
                    {amount}
                  </span>
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Select Grid Question ─────────────────────────────────────────────────────
function SelectGridQuestion({
  q,
  value,
  onChange,
}: {
  q: Question;
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  const [flash, setFlash] = useState<string | null>(null);
  const handleClick = (v: string) => {
    setFlash(v);
    setTimeout(() => {
      setFlash(null);
      onChange(v);
    }, 160);
  };
  const isKitchenMethod = q.id === "kitchenMethod";

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.choices!.map((c) => {
          const isSelected = value === c.value;
          return (
            <div key={c.value} className="flex flex-col">
              <button
                onClick={() => handleClick(c.value)}
                className={`group flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200
                ${
                  isSelected
                    ? "border-accent bg-accent/[0.06] shadow-md shadow-accent/8"
                    : "border-border bg-white hover:border-accent/40 hover:bg-muted/20 hover:shadow-sm"
                } ${flash === c.value ? "scale-95" : "scale-100"}`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all
                ${isSelected ? "bg-accent text-white" : "bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"}`}
                >
                  {/* Use Lucide icon if mapped, else text icon fallback */}
                  {c.icon && !/\p{Emoji}/u.test(c.icon) ? (
                    <span className="text-base">{c.icon}</span>
                  ) : (
                    <span className="text-base leading-none">{c.icon}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-sm font-semibold leading-tight ${isSelected ? "text-accent" : "text-ink"}`}
                  >
                    {c.label}
                  </div>
                  {c.desc && <div className="text-[11px] text-muted-foreground mt-0.5">{c.desc}</div>}
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 text-accent shrink-0 animate-in zoom-in duration-150" />
                )}
              </button>
              {c.value === "ai" && q.choices!.some((ch) => ch.value === "manual") && (
                <p className="mt-1.5 ml-1 flex items-center gap-1 text-[10px] text-muted-foreground/70">
                  <Lock className="h-2.5 w-2.5 shrink-0" />
                  Photos are only used to generate your estimate
                </p>
              )}
            </div>
          );
        })}
      </div>

      {isKitchenMethod && (
        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <p className="text-sm font-semibold text-ink mb-2">How photos improve your estimate</p>
          <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              <span>
                AI reads your photos and prefills cabinet type, countertops, flooring, backsplash,
                kitchen size, and condition.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              <span>
                You review and edit anything the AI detected before we calculate, so the estimate
                reflects your actual kitchen.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              <span>
                Fewer blank guesses means a tighter cost range and less back-and-forth when you
                compare contractor quotes.
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Number Question ──────────────────────────────────────────────────────────
function NumberQuestion({
  q,
  value,
  onChange,
  inputId,
}: {
  q: Question;
  value: number | undefined;
  onChange: (v: number) => void;
  inputId?: string;
}) {
  const [raw, setRaw] = useState(value?.toString() ?? "");
  const [touched, setTouched] = useState(false);

  const numVal = parseFloat(raw);
  const isEmpty = raw.trim() === "";
  const isInvalid =
    !isEmpty &&
    (isNaN(numVal) ||
      (q.min !== undefined && numVal < q.min) ||
      (q.max !== undefined && numVal > q.max));

  const errorMsg =
    touched && isEmpty && !q.optional
      ? "This field is required"
      : touched && isInvalid
        ? q.min !== undefined && q.max !== undefined
          ? `Enter a value between ${q.min.toLocaleString()} and ${q.max.toLocaleString()}`
          : q.min !== undefined && numVal < q.min
            ? `Minimum is ${q.min.toLocaleString()}`
            : `Maximum is ${q.max?.toLocaleString()}`
        : null;

  return (
    <div className="max-w-sm space-y-2">
      <div className="relative">
        <input
          id={inputId}
          type="number"
          value={raw}
          placeholder={q.placeholder}
          min={q.min}
          max={q.max}
          step={q.step}
          onBlur={() => setTouched(true)}
          onChange={(e) => {
            setRaw(e.target.value);
            const n = parseFloat(e.target.value);
            if (!isNaN(n)) onChange(n);
          }}
          className={`w-full h-14 rounded-xl border-2 bg-white px-5 pr-20 text-lg font-semibold text-ink outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent/30 ${
            errorMsg ? "border-red-400 focus:border-red-500" : "border-border focus:border-accent"
          }`}
        />
        {q.unit && (
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
            {q.unit}
          </span>
        )}
      </div>
      {errorMsg && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errorMsg}
        </p>
      )}
      {!errorMsg && q.subtitle && <p className="text-xs text-muted-foreground">{q.subtitle}</p>}
    </div>
  );
}

// ─── Text Question ────────────────────────────────────────────────────────────
function TextQuestion({
  q,
  value,
  onChange,
}: {
  q: Question;
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  const [touched, setTouched] = useState(false);
  const isZip = q.id === "zipCode";
  const isEmpty = !value || value.trim() === "";
  const isInvalidZip = isZip && value && !/^\d{5}$/.test(value.trim());

  const errorMsg =
    touched && isEmpty && !q.optional
      ? "This field is required"
      : touched && isInvalidZip
        ? "Enter a valid 5-digit ZIP code"
        : null;

  return (
    <div className="max-w-sm space-y-2">
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={value ?? ""}
          placeholder={q.placeholder}
          maxLength={isZip ? 5 : undefined}
          inputMode={isZip ? "numeric" : undefined}
          onBlur={() => setTouched(true)}
          onChange={(e) => {
            const val = isZip ? e.target.value.replace(/\D/g, "").slice(0, 5) : e.target.value;
            onChange(val);
          }}
          className={`w-full h-14 rounded-xl border-2 bg-white pl-11 pr-5 text-lg font-semibold text-ink outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent/30 ${
            errorMsg ? "border-red-400 focus:border-red-500" : "border-border focus:border-accent"
          }`}
        />
      </div>
      {errorMsg && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errorMsg}
        </p>
      )}
    </div>
  );
}

// ─── Toggle Question ──────────────────────────────────────────────────────────
function ToggleQuestion({
  q,
  value,
  onChange,
}: {
  q: Question;
  value: boolean | undefined;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-3 max-w-xs">
      {[
        { v: true, label: "Yes" },
        { v: false, label: "No" },
      ].map(({ v, label }) => (
        <button
          key={label}
          onClick={() => onChange(v)}
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
function BudgetQuestion({
  q,
  value,
  onChange,
}: {
  q: Question;
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const presets = [10000, 25000, 50000, 75000, 100000];
  const [raw, setRaw] = useState(value?.toString() ?? "");
  return (
    <div className="max-w-sm space-y-4">
      <div className="relative">
        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="number"
          value={raw}
          placeholder="Enter your budget"
          onChange={(e) => {
            setRaw(e.target.value);
            const n = parseFloat(e.target.value);
            if (!isNaN(n)) onChange(n);
          }}
          className="w-full h-14 rounded-xl border-2 border-border bg-white pl-11 pr-5 text-lg font-semibold text-ink outline-none focus:border-accent transition-colors"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => {
              onChange(p);
              setRaw(p.toString());
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all
              ${value === p ? "border-accent bg-accent/10 text-accent" : "border-border bg-white text-muted-foreground hover:border-accent/40"}`}
          >
            {fmt(p)}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Live Estimate Panel ──────────────────────────────────────────────────────
function EstimatePanel({ estimate, prevMid }: { estimate: LiveEstimate; prevMid: number }) {
  const hasData = estimate.mid > 0;
  const delta = hasData && prevMid > 0 ? estimate.mid - prevMid : 0;
  const [showDelta, setShowDelta] = useState(false);
  const [snapshotOpen, setSnapshotOpen] = useState(false);

  useEffect(() => {
    if (delta !== 0) {
      setShowDelta(true);
      const t = setTimeout(() => setShowDelta(false), 2000);
      return () => clearTimeout(t);
    }
  }, [estimate.mid]);

  const stepsLeft = Math.max(0, Math.ceil((95 - estimate.confidence) / 10));
  const insuranceStatus = estimate.insuranceEligible
    ? { label: "Likely covered", color: "text-accent", bg: "bg-accent/10", dot: "bg-accent" }
    : {
        label: "Not covered",
        color: "text-muted-foreground",
        bg: "bg-muted/50",
        dot: "bg-muted-foreground/40",
      };

  const breakdownWithColors = colorizeBreakdown(estimate.breakdown);
  const snapshotSummary = [
    estimate.timeline,
    estimate.permitRequired ? "Permit required" : "No permit",
  ].join(" · ");

  return (
    <div className="flex flex-col gap-2">
      {/* Main cost card */}
      <div className="rounded-2xl border border-border bg-white p-3 shadow-sm overflow-hidden relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-[11px] font-semibold text-accent">Live estimate</span>
          </div>
          {hasData && showDelta && delta !== 0 && (
            <div
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full animate-in fade-in zoom-in duration-200
              ${delta > 0 ? "text-red-500 bg-red-50" : "text-accent bg-accent/10"}`}
            >
              {delta > 0 ? "+" : ""}
              {fmt(delta)}
            </div>
          )}
        </div>

        {hasData ? (
          <>
            <div className="text-[26px] font-display font-bold text-ink leading-none transition-all duration-500">
              {fmt(estimate.mid)}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Range:{" "}
              <span className="font-medium text-ink">
                {fmt(estimate.low)} – {fmt(estimate.high)}
              </span>
            </div>

            {/* Confidence */}
            <div className="mt-2 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Accuracy</span>
                <span className="text-[11px] font-bold text-ink">{estimate.confidence}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
                  style={{ width: `${estimate.confidence}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground leading-snug">
                {stepsLeft > 0
                  ? `${stepsLeft} more question${stepsLeft > 1 ? "s" : ""} to reach 95% accuracy.`
                  : "High confidence estimate."}
              </p>
            </div>
          </>
        ) : (
          <div className="py-2 text-sm text-muted-foreground">
            Select a project to see your estimate.
          </div>
        )}
      </div>

      {/* Project snapshot — collapsed by default to keep breakdown visible */}
      {hasData && (
        <div className="rounded-2xl border border-border bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setSnapshotOpen((open) => !open)}
            aria-expanded={snapshotOpen}
            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-muted/20 transition duration-200"
          >
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-muted-foreground">
                Project snapshot
              </div>
              {!snapshotOpen && (
                <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
                  {snapshotSummary}
                </p>
              )}
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                snapshotOpen && "rotate-180",
              )}
              aria-hidden
            />
          </button>
          {snapshotOpen && (
            <div className="px-4 pb-3 space-y-0 border-t border-border/50">
              <div className="divide-y divide-border/50">
                {[
                  { icon: Clock, label: "Timeline", value: estimate.timeline },
                  {
                    icon: Wrench,
                    label: "Permit",
                    value: estimate.permitRequired ? "Required" : "Not required",
                    highlight: estimate.permitRequired,
                  },
                ].map(({ icon: Icon, label, value, highlight }) => (
                  <div key={label} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${highlight ? "text-amber-600" : "text-ink"}`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Shield className="h-3.5 w-3.5" />
                    Insurance
                  </div>
                  <div
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${insuranceStatus.bg} ${insuranceStatus.color}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${insuranceStatus.dot}`} />
                    {insuranceStatus.label}
                  </div>
                </div>
              </div>
              {estimate.insuranceEligible && (
                <button className="w-full text-[11px] text-accent font-semibold flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-accent/5 hover:bg-accent/10 transition">
                  Why? Check coverage <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Cost breakdown */}
      {hasData && (
        <div className="rounded-2xl border border-border bg-white p-3">
          <CostBreakdownChart
            breakdown={breakdownWithColors}
            total={estimate.mid}
            variant="sidebar"
          />
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
        <div className="text-[11px] font-semibold text-[#082A4B]/60 mb-0.5">CostReno AI tip</div>
        <p className="text-sm text-ink/80 leading-relaxed">{tip}</p>
      </div>
    </div>
  );
}

// ─── Labeled Step Stepper ─────────────────────────────────────────────────────
function StepStepper({
  steps,
  currentIdx,
  selectedProject,
  projectImage,
  onChangeProject,
}: {
  steps: StepDef[];
  currentIdx: number;
  selectedProject?: string;
  projectImage?: string;
  onChangeProject?: () => void;
}) {
  // Collapse to dots on small screens, show labels on md+
  return (
    <div className="w-full mb-5 md:mb-6">
      {/* Selected Project Compact Bar */}
      {currentIdx > 0 && selectedProject && (
        <div className="mb-3 flex items-center gap-2.5 px-3 py-2 rounded-lg bg-accent/8 border border-accent/20">
          {projectImage && (
            <div className="w-8 h-8 rounded overflow-hidden shrink-0">
              <img
                src={projectImage}
                alt={selectedProject}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <Check className="h-3.5 w-3.5 text-accent shrink-0" />
          <span className="text-xs font-semibold text-accent">Selected</span>
          <span className="text-sm font-semibold text-ink truncate">{selectedProject}</span>
          {onChangeProject && (
            <button
              onClick={onChangeProject}
              className="ml-auto text-[11px] font-semibold text-accent hover:text-accent/80 transition px-2 py-1 hover:bg-accent/10 rounded shrink-0"
            >
              Change
            </button>
          )}
        </div>
      )}
      {/* Mobile: simple dots */}
      <div className="flex items-center gap-1.5 md:hidden">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIdx ? "w-6 bg-accent" : i < currentIdx ? "w-4 bg-accent/50" : "w-4 bg-border"}`}
          />
        ))}
        <span className="ml-2 text-xs text-muted-foreground">
          {currentIdx + 1}/{steps.length}
        </span>
      </div>
      {/* Desktop: labeled steps */}
      <div className="hidden md:flex items-center">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${i < currentIdx ? "bg-accent text-white" : i === currentIdx ? "bg-[#082A4B] text-white ring-4 ring-[#082A4B]/10" : "bg-muted text-muted-foreground"}`}
              >
                {i < currentIdx ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-[10px] font-semibold whitespace-nowrap transition-colors ${i === currentIdx ? "text-ink" : i < currentIdx ? "text-accent" : "text-muted-foreground"}`}
              >
                {STEP_LABELS[s.id] ?? s.id}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-2 mb-4 transition-colors duration-500 ${i < currentIdx ? "bg-accent" : "bg-border"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Photo Upload Question (AI Kitchen Analysis) ─────────────────────────────
function PhotoUploadQuestion({
  answers,
  onChange,
  onAdvance,
}: {
  answers: EstimatorAnswers;
  onChange: (key: keyof EstimatorAnswers, value: unknown) => void;
  onAdvance: (photoStatus?: "analyzed" | "skipped") => void;
}) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detections, setDetections] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);

  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).slice(0, 6 - photos.length);
    const valid = arr.filter(
      (f) =>
        ["image/jpeg", "image/png", "image/webp"].includes(f.type) && f.size <= 10 * 1024 * 1024,
    );
    if (valid.length === 0) return;
    const newPhotos = [...photos, ...valid].slice(0, 6);
    setPhotos(newPhotos);
    const newPreviews = await Promise.all(
      newPhotos.map(
        (f) =>
          new Promise<string>((res) => {
            const r = new FileReader();
            r.onloadend = () => res(r.result as string);
            r.readAsDataURL(f);
          }),
      ),
    );
    setPreviews(newPreviews);
  };

  const handleAnalyze = async () => {
    if (photos.length < 2) return;
    cancelledRef.current = false;
    setIsAnalyzing(true);
    setError(null);
    try {
      const base64Photos = await Promise.all(
        photos.map(
          (f) =>
            new Promise<string>((res) => {
              const r = new FileReader();
              r.onloadend = () => res(r.result as string);
              r.readAsDataURL(f);
            }),
        ),
      );
      const { analyzeKitchen } = await import("@/lib/kitchen-estimator/analyze-kitchen");
      const result = await analyzeKitchen({ data: { photos: base64Photos } });
      if (cancelledRef.current) return;
      if (result.success) {
        setDetections(result.data);
        // Pre-fill answers
        const d = result.data;
        const cabinetMap: Record<string, string> = {
          stock: "stock",
          semicustom: "semi-custom",
          custom: "custom",
          reface: "stock",
        };
        const counterMap: Record<string, string> = {
          laminate: "laminate",
          quartz: "quartz",
          granite: "granite",
          marble: "marble",
          butcherblock: "laminate",
        };
        if (d.cabinetType.value && cabinetMap[d.cabinetType.value])
          onChange("kitchenCabinets" as any, cabinetMap[d.cabinetType.value]);
        if (d.countertopMaterial.value && counterMap[d.countertopMaterial.value])
          onChange("kitchenCountertops" as any, counterMap[d.countertopMaterial.value]);
        onChange("kitchenScope" as any, "full");
      } else {
        setError(result.error);
      }
    } catch {
      if (!cancelledRef.current) {
        setError("Analysis failed. You can continue with manual questions instead.");
      }
    } finally {
      if (!cancelledRef.current) {
        setIsAnalyzing(false);
      }
    }
  };

  const handleSkip = () => {
    cancelledRef.current = true;
    setIsAnalyzing(false);
    setError(null);
    setDetections(null);
    onChange("kitchenMethod" as any, "manual");
    // Wait for answersRef to pick up kitchenMethod=manual so advance
    // skips AI-only follow-up questions and lands on the manual path.
    onAdvance("skipped");
  };

  const handleConfirm = () => {
    onAdvance("analyzed");
  };

  // ─── POST-ANALYSIS: Show detections as editable cards ─────────────────────
  if (detections) {
    const confidenceColor = (c: string) =>
      c === "high"
        ? "text-green-600 bg-green-50 border-green-200"
        : c === "medium"
          ? "text-amber-600 bg-amber-50 border-amber-200"
          : "text-red-600 bg-red-50 border-red-200";

    // Fix confidence: condition always medium (can't assess hidden issues from photos),
    // kitchen size stays at whatever the AI returned (usually medium/low)
    const conditionConfidence = "medium";
    const sizeConfidence =
      detections.kitchenSize.confidence === "high" ? "medium" : detections.kitchenSize.confidence;

    const detectionItems = [
      {
        label: "Cabinets",
        value: detections.cabinetType.value,
        confidence: detections.cabinetType.confidence,
        field: "kitchenCabinets",
        options: ["stock", "semi-custom", "custom"],
      },
      {
        label: "Countertops",
        value: detections.countertopMaterial.value,
        confidence: detections.countertopMaterial.confidence,
        field: "kitchenCountertops",
        options: ["laminate", "quartz", "granite", "marble"],
      },
      {
        label: "Flooring",
        value: detections.flooringMaterial.value,
        confidence: detections.flooringMaterial.confidence,
        field: "kitchenFlooring",
        options: ["tile", "hardwood", "vinyl", "none"],
      },
      {
        label: "Backsplash",
        value: detections.observations?.find((o: string) => /backsplash|tile wall|subway/i.test(o))
          ? "tile"
          : "none",
        confidence: "medium",
        field: "kitchenBacksplash",
        options: ["tile", "glass", "stone", "none"],
      },
      {
        label: "Fixtures",
        value: "keep",
        confidence: "low",
        field: "kitchenFixtures",
        options: ["keep", "standard", "upgrade"],
      },
      {
        label: "Kitchen Size",
        value: detections.kitchenSize.value,
        confidence: sizeConfidence,
        field: null,
        options: [],
      },
      {
        label: "Condition",
        value: detections.overallCondition.value,
        confidence: conditionConfidence,
        field: "currentCondition",
        options: ["excellent", "good", "fair", "poor"],
      },
    ];

    return (
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Success header */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">We prefilled your kitchen details</p>
            <p className="text-xs text-muted-foreground">
              Review each item below. Tap to change anything before we calculate your estimate.
            </p>
          </div>
        </div>

        {/* Detection cards with image-backed selectors */}
        <div className="space-y-4">
          {detectionItems.map((item) => (
            <div key={item.label} className="p-4 rounded-xl border border-border bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-ink">{item.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${confidenceColor(item.confidence)}`}
                >
                  {item.confidence}
                </span>
              </div>
              {item.field && item.options.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {item.options.map((o) => {
                    const isSelected = ((answers as any)[item.field] || item.value) === o;
                    const icon = OPTION_ICONS[`${item.field}:${o}`];
                    return (
                      <button
                        key={o}
                        onClick={() => onChange(item.field as any, o)}
                        className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-accent bg-accent/5 shadow-sm"
                            : "border-border bg-white hover:border-accent/40"
                        }`}
                      >
                        {icon && <span className="text-xl">{icon}</span>}
                        <span
                          className={`text-[11px] font-medium capitalize ${isSelected ? "text-accent" : "text-muted-foreground"}`}
                        >
                          {o.replace("-", " ")}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 text-white" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-1 text-sm font-semibold text-ink capitalize">{item.value}</div>
              )}
            </div>
          ))}
        </div>

        {/* Observations */}
        {detections.observations?.length > 0 && (
          <div className="p-4 rounded-xl border border-border bg-muted/20">
            <p className="text-xs font-semibold text-ink mb-2">AI observations</p>
            <ul className="space-y-1">
              {detections.observations.map((obs: string, i: number) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {obs}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          className="w-full rounded-lg bg-accent py-3.5 text-sm font-semibold text-white hover:bg-accent/90 transition"
        >
          Continue with these selections →
        </button>
      </div>
    );
  }

  // ─── PRE-ANALYSIS: Upload UI ──────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="rounded-xl border border-border bg-white p-4">
        <p className="text-sm font-semibold text-ink mb-2">What we detect from your photos</p>
        <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          {[
            "Cabinet type (stock, semi-custom, custom)",
            "Countertop material",
            "Flooring and backsplash",
            "Approximate kitchen size",
            "Visible wear and overall condition",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
          These details prefill your estimate so you skip most manual questions. You confirm or
          change each item after analysis.
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-6 cursor-pointer hover:border-accent/40 hover:bg-muted/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
      >
        <span className="text-2xl">📸</span>
        <div className="text-center">
          <p className="text-sm font-medium text-ink">Click to upload kitchen photos</p>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WebP • 2-6 photos • Max 10 MB each
          </p>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 max-h-[160px] overflow-y-auto rounded-lg">
          {previews.map((src, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border">
              <img
                src={src}
                alt={`Kitchen photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
      <div className="text-xs text-muted-foreground text-center">
        {photos.length}/6 photos uploaded{photos.length < 2 && " (need at least 2)"}
      </div>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 text-center">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-2 sticky bottom-4 bg-white/95 backdrop-blur-sm pt-3 pb-1 rounded-xl z-10">
        <button
          onClick={handleAnalyze}
          disabled={photos.length < 2 || isAnalyzing}
          aria-busy={isAnalyzing}
          className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze my kitchen"}
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="w-full rounded-lg border border-border py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/30 transition"
        >
          Skip, answer manually instead
        </button>
      </div>
    </div>
  );
}


// ─── Question Renderer ────────────────────────────────────────────────────────
function QuestionRenderer({
  question,
  answers,
  onChange,
  onAdvance,
}: {
  question: Question;
  answers: EstimatorAnswers;
  onChange: (key: keyof EstimatorAnswers, value: unknown) => void;
  onAdvance?: () => void;
}) {
  const val = answers[question.id];
  const h = (v: unknown) => onChange(question.id, v);
  if (question.type === "cards")
    return <CardsQuestion q={question} value={val as string} onChange={h} />;
  if (question.type === "select-grid")
    return <SelectGridQuestion q={question} value={val as string} onChange={h} />;
  if (question.type === "roof-measure")
    return <RoofMeasureStep answers={answers} onChange={onChange} />;
  if (question.type === "number")
    return <NumberQuestion q={question} value={val as number} onChange={h} />;
  if (question.type === "text")
    return <TextQuestion q={question} value={val as string} onChange={h} />;
  if (question.type === "toggle")
    return <ToggleQuestion q={question} value={val as boolean} onChange={h} />;
  if (question.type === "budget")
    return <BudgetQuestion q={question} value={val as number} onChange={h} />;
  if (question.type === "photo-upload")
    return (
      <PhotoUploadQuestion
        answers={answers}
        onChange={onChange}
        onAdvance={(photoStatus = "analyzed") => {
          onChange("kitchenPhotos" as any, photoStatus);
          if (onAdvance) setTimeout(onAdvance, 250);
        }}
      />
    );
  return null;
}

// ─── Final Report ─────────────────────────────────────────────────────────────
function FinalReport({
  answers,
  estimate,
  onRestart,
}: {
  answers: EstimatorAnswers;
  estimate: LiveEstimate;
  onRestart: () => void;
}) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const roofArea = answers.projectType === "roof" ? resolveRoofArea(answers) : null;
  const roofSizeSourceLabel: Record<"manual" | "trace" | "map" | "estimated", string> = {
    trace: "traced on satellite imagery",
    map: "measured from map building data",
    manual: "from your footprint entry",
    estimated: "estimated from your home size and roof slope",
  };

  const projectLabel: Record<string, string> = {
    roof: "Roof Replacement",
    kitchen: "Kitchen Remodel",
    bathroom: "Bathroom Remodel",
    hvac: "HVAC Replacement",
    windows: "Window Replacement",
    flooring: "Flooring",
    painting: "Painting",
    solar: "Solar Installation",
    deck: "Deck / Patio",
    plumbing: "Plumbing",
    electrical: "Electrical",
  };

  const handleEmailSubmit = async (email: string) => {
    setIsDownloading(true);
    try {
      subscribeToNewsletter({ data: { email, source: "estimate-download" } }).catch(() => {});

      const details: Record<string, string> = {};
      if (answers.zipCode)
        details["Location"] =
          `${answers.city || ""} ${answers.state || ""} ${answers.zipCode}`.trim();
      if (answers.propertyType) details["Property type"] = answers.propertyType.replace("-", " ");
      if (answers.squareFootage && answers.projectType !== "roof")
        details[answers.projectType === "kitchen" ? "Kitchen size" : "Home size"] =
          `${answers.squareFootage.toLocaleString()} sq ft`;
      if (answers.yearBuilt) details["Year built"] = String(answers.yearBuilt);
      if (answers.kitchenCabinets) details["Cabinets"] = answers.kitchenCabinets.replace("-", " ");
      if (answers.kitchenCountertops) details["Countertops"] = answers.kitchenCountertops;
      if (answers.kitchenFlooring) details["Flooring"] = answers.kitchenFlooring;
      if ((answers as any).kitchenLayout)
        details["Layout changes"] = (answers as any).kitchenLayout;
      if ((answers as any).kitchenApplianceTier)
        details["Appliances"] = (answers as any).kitchenApplianceTier;
      if ((answers as any).kitchenBacksplash)
        details["Backsplash"] = (answers as any).kitchenBacksplash;
      if (answers.roofAction) details["Action"] = answers.roofAction;
      if (answers.roofMaterial) details["Material"] = answers.roofMaterial;
      if (answers.projectType === "roof") {
        const area = resolveRoofArea(answers);
        details["Roof area"] =
          `${area.sqFt.toLocaleString()} sq ft (${roofSizeSourceLabel[area.source]})`;
      }
      if (answers.roofPitch) details["Roof slope"] = answers.roofPitch;
      if (answers.roofComplexity) details["Roof shape"] = answers.roofComplexity;
      if (answers.roofLayers)
        details["Existing layers"] = answers.roofLayers === "two-plus" ? "Two or more" : "One";
      if (answers.hvacAction) details["HVAC action"] = answers.hvacAction;
      if (answers.hvacType) details["System type"] = answers.hvacType.replace("-", " ");
      if (answers.hvacDuctwork) details["Ductwork"] = answers.hvacDuctwork;
      if (answers.hvacEfficiency) details["Efficiency"] = answers.hvacEfficiency;
      if (answers.hvacIssue)
        details["Repair symptom"] = answers.hvacIssue.replace("-", " ");
      if (answers.hvacSystemAge)
        details["System age"] =
          answers.hvacSystemAge === "under-5"
            ? "Under 5 years"
            : answers.hvacSystemAge === "5-10"
              ? "5 to 10 years"
              : answers.hvacSystemAge === "10-15"
                ? "10 to 15 years"
                : answers.hvacSystemAge === "15-plus"
                  ? "15+ years"
                  : "Not sure";
      if (answers.hvacDiagnosed)
        details["Technician diagnosis"] = answers.hvacDiagnosed === "yes" ? "Yes" : "No";
      if (answers.hvacDiagnosisNotes?.trim())
        details["Diagnosis notes"] = answers.hvacDiagnosisNotes.trim();
      if (answers.windowCount) details["Windows"] = String(answers.windowCount);
      if (answers.windowType) details["Glazing"] = `${answers.windowType} pane`;
      if (answers.windowMaterial) details["Frame"] = answers.windowMaterial;
      if (answers.windowInstallType)
        details["Install method"] = answers.windowInstallType.replace("-", " ");
      if (answers.windowStyle) details["Window style"] = answers.windowStyle.replace("-", " ");
      if (answers.flooringMaterial) details["Flooring"] = answers.flooringMaterial;
      if (answers.flooringArea)
        details["Flooring area"] = `${answers.flooringArea.toLocaleString()} sq ft`;
      if (answers.flooringPrep) details["Subfloor prep"] = answers.flooringPrep;
      if (answers.flooringQuality) details["Flooring quality"] = answers.flooringQuality;
      if (answers.flooringRemoval) details["Remove existing"] = "Yes";
      if (answers.paintingScope) details["Paint scope"] = answers.paintingScope;
      if (answers.deckMaterial) details["Deck material"] = answers.deckMaterial;
      if (answers.deckSize) details["Deck size"] = `${answers.deckSize.toLocaleString()} sq ft`;
      if (answers.plumbingType) details["Plumbing work"] = answers.plumbingType;
      if (answers.electricalType)
        details["Electrical work"] = answers.electricalType.replace("-", " ");
      if (answers.projectType !== "hvac" && answers.currentCondition)
        details["Current condition"] = answers.currentCondition;
      if (answers.startTimeline) details["Timeline"] = answers.startTimeline.replace("-", " ");

      await submitEmailAndDownload({
        filename: `costreno-estimate-${answers.projectType || "project"}-${Date.now()}.html`,
        email,
        reportType: "estimate",
        data: {
          projectType: projectLabel[answers.projectType ?? ""] ?? "Your project",
          estimate: fmt(estimate.mid),
          range: `${fmt(estimate.low)} to ${fmt(estimate.high)}`,
          confidence: estimate.confidence,
          location:
            answers.city && answers.state
              ? `${answers.city}, ${answers.state} ${answers.zipCode || ""}`.trim()
              : answers.zipCode || "",
          timeline: estimate.timeline,
          permitRequired: estimate.permitRequired,
          breakdown: estimate.breakdown,
          details,
        },
      });
    } catch (error) {
      console.error("Download failed:", error);
      throw error;
    } finally {
      setIsDownloading(false);
    }
  };

  const breakdownWithColors = colorizeBreakdown(estimate.breakdown);
  const region = resolveRegionalMultiplier(answers);
  const feedbackKey = `${answers.projectType ?? "project"}-${answers.zipCode ?? "nozip"}-${estimate.mid}`;

  const summaryRows = [
    ...(answers.projectType !== "roof"
      ? [
          {
            label: "Property size",
            val: answers.squareFootage ? `${answers.squareFootage.toLocaleString()} sq ft` : "-",
          },
        ]
      : []),
    { label: "Property type", val: answers.propertyType?.replace("-", " ") ?? "-" },
    ...(roofArea
      ? [
          { label: "Roof area", val: `${roofArea.sqFt.toLocaleString()} sq ft` },
          { label: "Roof slope", val: answers.roofPitch ?? "-" },
          { label: "Roof shape", val: answers.roofComplexity ?? "-" },
          {
            label: "Existing layers",
            val:
              answers.roofLayers === "two-plus"
                ? "Two or more"
                : answers.roofLayers === "one"
                  ? "One"
                  : "-",
          },
        ]
      : []),
    ...(answers.projectType !== "hvac"
      ? [
          { label: "Condition", val: answers.currentCondition ?? "-" },
          { label: "Cause", val: answers.causeOfProject?.replace("-", " ") ?? "-" },
        ]
      : []),
  ];

  const metaPills = [
    { label: "Timeline", val: estimate.timeline },
    { label: "Permit", val: estimate.permitRequired ? "Required" : "Not needed" },
    {
      label: "Start",
      val:
        answers.startTimeline === "asap"
          ? "ASAP"
          : (answers.startTimeline?.replace("-", " to ") ?? "TBD"),
    },
  ];

  return (
    <div className="w-full space-y-4 lg:space-y-3 pb-12 animate-in fade-in duration-500">
      {/* Compact hero */}
      <div className="rounded-2xl bg-[#082A4B] p-5 lg:px-6 lg:py-5 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-2">
              <span className="text-xs text-white/50">
                {projectLabel[answers.projectType ?? ""] ?? "Your project"}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-bold">
                <CheckCircle2 className="h-3 w-3" aria-hidden />
                {estimate.confidence}% confidence
              </span>
            </div>
            <h1 className="font-display text-4xl lg:text-[2.75rem] font-bold leading-none tabular-nums">
              <span className="sr-only">
                Your {projectLabel[answers.projectType ?? ""] ?? "renovation"} estimate:{" "}
              </span>
              {fmt(estimate.mid)}
            </h1>
            <div className="mt-1.5 text-white/50 text-sm">
              Typical range: {fmt(estimate.low)} to {fmt(estimate.high)}
            </div>
            <p className="mt-1 text-white/30 text-xs leading-snug">
              Instant lookup for {region.label}
              {region.source === "city"
                ? " (metro rate)"
                : region.source === "state"
                  ? " (state rate)"
                  : " (national average)"}
              {roofArea &&
                `. Priced on ${roofArea.sqFt.toLocaleString()} sq ft of roof, ${roofSizeSourceLabel[roofArea.source]}.`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:gap-2.5 shrink-0 lg:max-w-sm">
            {metaPills.map(({ label, val }) => (
              <div
                key={label}
                className="rounded-xl bg-white/10 px-3 py-2 min-w-[5.5rem] flex-1 lg:flex-none"
              >
                <div className="text-[10px] text-white/40 mb-0.5">{label}</div>
                <div className="text-sm font-semibold text-white leading-tight">{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown + summary above the fold on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-border bg-white p-4 lg:p-5">
          <CostBreakdownChart breakdown={breakdownWithColors} total={estimate.mid} compact />
        </div>
        <div className="lg:col-span-5 rounded-2xl border border-border bg-white p-4 lg:p-5 flex flex-col">
          <div className="text-sm font-bold text-primary mb-3 shrink-0">Project summary</div>
          <div className="min-h-0 lg:overflow-y-auto lg:max-h-[min(22rem,calc(100vh-22rem))]">
            {summaryRows.map(({ label, val }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 py-1.5 border-b border-border/40 last:border-0 text-sm"
              >
                <span className="text-muted-foreground shrink-0">{label}</span>
                <span className="font-semibold text-ink capitalize text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        This is a planning estimate based on your answers and local labor rates, not a contractor
        bid. Final pricing depends on site access, material choices, and what crews find once work
        starts.
        {roofArea?.source === "estimated" &&
          " Adding your measured roof footprint improves the range."}
      </p>

      {/* Next steps — live actions only */}
      <div className="rounded-2xl border border-border bg-white p-5 lg:p-6">
        <div className="text-sm font-bold text-primary mb-4">Recommended next steps</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="/quote-analyzer"
            className="group flex items-center gap-3 p-4 rounded-xl border border-accent/60 shadow-[0_0_0_1px_rgba(3,164,77,0.15)] hover:shadow-[0_0_0_3px_rgba(3,164,77,0.2)] hover:border-accent hover:-translate-y-0.5 bg-accent/[0.03] transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-accent/15 group-hover:bg-accent transition-all">
              <FileText className="h-5 w-5 text-accent group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-accent">Upload contractor quote</div>
              <div className="text-xs text-muted-foreground">
                AI detects overcharges and red flags
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-accent transition-all shrink-0" />
          </a>
          <button
            type="button"
            onClick={() => setShowEmailModal(true)}
            className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-accent/40 hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 group-hover:bg-accent transition-all">
              <Download className="h-5 w-5 text-accent group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">
                Download PDF report
              </div>
              <div className="text-xs text-muted-foreground">Save your full estimate</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-accent transition-all shrink-0" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRestart}
          className="flex-1 py-3.5 rounded-lg border-2 border-border text-sm font-semibold text-muted-foreground hover:bg-muted/40 transition"
        >
          Start new estimate
        </button>
        <a
          href="/"
          className="flex-1 py-3.5 rounded-lg bg-accent text-white text-sm font-bold text-center hover:bg-accent/90 transition"
        >
          Back to CostReno
        </a>
      </div>

      <EmailDownloadModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        reportName="Estimate report"
        isLoading={isDownloading}
      />

      <EstimateFeedbackCard
        estimateKey={feedbackKey}
        projectType={answers.projectType}
        confidence={estimate.confidence}
      />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function EstimatorPage() {
  const { project: urlProject } = Route.useSearch();
  const [answers, setAnswers] = useState<EstimatorAnswers>({});
  const answersRef = useRef<EstimatorAnswers>({});
  const [stepIdx, setStepIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [estimate, setEstimate] = useState<LiveEstimate>(() => calculateEstimate({}));
  const [zipError, setZipError] = useState<string | null>(null);
  const prevMidRef = useRef(0);

  // Hydrate from storage after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const baseAnswers: Record<string, unknown> = stored ? JSON.parse(stored) : {};
    const savedZip = localStorage.getItem("costreno_zip");
    if (savedZip && /^\d{5}$/.test(savedZip) && !baseAnswers.zipCode) {
      baseAnswers.zipCode = savedZip;
    }
    const preselected = urlProject || sessionStorage.getItem("costreno_preselected_project");
    if (preselected) {
      sessionStorage.removeItem("costreno_preselected_project");
      if (!baseAnswers.projectType) {
        baseAnswers.projectType = preselected;
      }
      setStepIdx(1);
    }
    if (Object.keys(baseAnswers).length > 0) {
      setAnswers(baseAnswers as EstimatorAnswers);
    }
  }, []);

  // Persist + recalculate
  useEffect(() => {
    answersRef.current = answers;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    const newEst = calculateEstimate(answers);
    prevMidRef.current = estimate.mid;
    setEstimate(newEst);
  }, [answers]);

  // ZIP → city/state lookup
  useEffect(() => {
    if (answers.zipCode?.length === 5) {
      setZipError(null);
      fetch(`https://api.zippopotam.us/us/${answers.zipCode}`)
        .then((r) => {
          if (!r.ok) throw new Error("Invalid ZIP");
          return r.json();
        })
        .then((d) => {
          if (d?.places?.[0]) {
            const p = d.places[0];
            setAnswers((prev) => ({
              ...prev,
              city: p["place name"],
              state: p["state abbreviation"],
            }));
            setZipError(null);
          } else {
            throw new Error("No results");
          }
        })
        .catch(() => {
          setAnswers((prev) => ({ ...prev, city: undefined, state: undefined }));
          setZipError("ZIP code not found. Please enter a valid US ZIP code.");
        });
    } else if (answers.zipCode && answers.zipCode.length < 5) {
      // Clear while typing
      if (answers.city) {
        setAnswers((prev) => ({ ...prev, city: undefined, state: undefined }));
      }
    }
  }, [answers.zipCode]);

  const steps = getActiveSteps(answers);
  const totalSteps = steps.length;
  const currentStep = steps[stepIdx];
  const questions = currentStep?.questions ?? [];
  const currentQuestion = questions[questionIdx];
  const overallProgress = Math.round(
    ((stepIdx + (questionIdx + 1) / Math.max(questions.length, 1)) / totalSteps) * 100,
  );
  // ~2 min per step average
  const minsLeft = Math.max(1, Math.round((totalSteps - stepIdx) * 0.4));

  const setAnswer = useCallback((key: keyof EstimatorAnswers, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const isAnswered = (q: Question) => {
    if (q.type === "roof-measure") {
      return (
        hasRoofArea(answers) &&
        Boolean(answers.roofPitch) &&
        Boolean(answers.roofComplexity)
      );
    }
    if (q.optional) return true;
    const v = answers[q.id];
    if (v === undefined || v === null || v === "") return false;
    // Validate number fields are within range
    if (q.type === "number" && typeof v === "number") {
      if (q.min !== undefined && v < q.min) return false;
      if (q.max !== undefined && v > q.max) return false;
    }
    // Validate ZIP code format
    if (q.id === "zipCode" && typeof v === "string") {
      if (!/^\d{5}$/.test(v.trim())) return false;
      // Must have resolved to a city (valid ZIP)
      if (!answers.city) return false;
    }
    return true;
  };

  const advance = useCallback(() => {
    const currentAnswers = answersRef.current;
    let nextQ = questionIdx + 1;
    while (nextQ < questions.length) {
      if (!questions[nextQ].showIf || questions[nextQ].showIf!(currentAnswers)) break;
      nextQ++;
    }
    if (nextQ < questions.length) {
      setQuestionIdx(nextQ);
      return;
    }
    let nextS = stepIdx + 1;
    const newSteps = getActiveSteps(currentAnswers);
    while (nextS < newSteps.length) {
      if (!newSteps[nextS].showIf || newSteps[nextS].showIf!(currentAnswers)) break;
      nextS++;
    }
    if (nextS < newSteps.length) {
      setStepIdx(nextS);
      setQuestionIdx(0);
    } else setDone(true);
  }, [questionIdx, questions, stepIdx]);

  const back = () => {
    if (questionIdx > 0) {
      // Find the previous visible question
      let prevQ = questionIdx - 1;
      while (prevQ >= 0) {
        const q = questions[prevQ];
        if (!q.showIf || q.showIf(answers)) break;
        prevQ--;
      }
      if (prevQ >= 0) {
        setQuestionIdx(prevQ);
        return;
      }
    }
    if (stepIdx > 0) {
      const ps = steps[stepIdx - 1];
      setStepIdx(stepIdx - 1);
      // Find the last visible question in the previous step
      let lastQ = ps.questions.length - 1;
      while (lastQ >= 0) {
        const q = ps.questions[lastQ];
        if (!q.showIf || q.showIf(answers)) break;
        lastQ--;
      }
      setQuestionIdx(Math.max(0, lastQ));
    }
  };

  const restart = () => {
    setAnswers({});
    setStepIdx(0);
    setQuestionIdx(0);
    setDone(false);
    localStorage.removeItem(STORAGE_KEY);
  };

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
      {/* Header - Same as landing page */}
      <SiteNav active="estimator" />

      <main
        className={cn(
          "max-w-6xl mx-auto px-4 sm:px-6",
          done ? "pt-2 pb-6 md:pt-3 md:pb-8" : "pt-4 pb-8 md:pt-5 md:pb-10",
        )}
      >
        {!done && (
          <h1 className="sr-only">Home renovation cost estimator</h1>
        )}

        {/* Progress bar + Start over */}
        {!done && (
          <div className="mb-4 md:mb-5">
            <div className="flex items-center justify-end gap-3 mb-2">
              <span className="hidden sm:inline text-xs text-muted-foreground">
                Progress auto-saved
              </span>
              <button
                onClick={restart}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-ink transition"
              >
                <X className="h-3.5 w-3.5" /> Start over
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex-1 h-2 rounded-full bg-muted overflow-hidden"
                role="progressbar"
                aria-valuenow={overallProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Estimate progress"
              >
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                ~{minsLeft} min left
              </span>
            </div>
          </div>
        )}

        {done ? (
          <FinalReport answers={answers} estimate={estimate} onRestart={restart} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start">
            {/* Left: questions */}
            <div className="flex-1 min-w-0">
              <StepStepper
                steps={steps}
                currentIdx={stepIdx}
                selectedProject={
                  answers.projectType
                    ? PROJECT_NAMES[answers.projectType] || answers.projectType
                    : undefined
                }
                projectImage={answers.projectType ? PROJECT_IMAGES[answers.projectType] : undefined}
                onChangeProject={() => setStepIdx(0)}
              />

              {currentQuestion && (
                <div
                  key={`${stepIdx}-${questionIdx}`}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-350"
                >
                  {/* Question header */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="text-xs font-semibold text-accent">{currentStep?.title}</span>
                      {currentQuestion.optional && (
                        <span className="px-2.5 py-1 rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                          Optional
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-ink leading-snug flex items-start gap-1">
                      <span className="min-w-0">{currentQuestion.title}</span>
                      {currentQuestion.info && (
                        <QuestionInfo topic={currentQuestion.title} info={currentQuestion.info} />
                      )}
                    </h2>
                    {currentQuestion.subtitle && (
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {currentQuestion.subtitle}
                      </p>
                    )}
                  </div>

                  <QuestionRenderer
                    question={currentQuestion}
                    answers={answers}
                    onChange={handleAnswerChange}
                    onAdvance={advance}
                  />

                  {/* ZIP detected badge */}
                  {currentQuestion.id === "zipCode" && answers.city && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/10 text-accent text-xs font-semibold">
                      <CheckCircle2 className="h-4 w-4" /> Detected: {answers.city}, {answers.state}
                      {(() => {
                        const region = resolveRegionalMultiplier(answers);
                        return region.source === "city"
                          ? ` · Instant metro rate for ${region.label}`
                          : region.source === "state"
                            ? ` · Instant state rate (${region.label})`
                            : "";
                      })()}
                    </div>
                  )}
                  {currentQuestion.id === "zipCode" && zipError && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                      <AlertCircle className="h-4 w-4" /> {zipError}
                    </div>
                  )}

                  {/* AI Tip */}
                  {tip && <AiTip tip={tip} />}

                  {/* Navigation */}
                  <div className="flex items-center gap-3 mt-8">
                    {(stepIdx > 0 || questionIdx > 0) && (
                      <button
                        onClick={back}
                        className="flex items-center gap-2 px-5 py-3 rounded-lg border-2 border-border text-sm font-semibold text-muted-foreground hover:bg-muted/40 hover:border-border/80 transition"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                    )}
                    {(currentQuestion.type === "number" ||
                      currentQuestion.type === "text" ||
                      currentQuestion.type === "budget" ||
                      currentQuestion.type === "roof-measure") && (
                      <button
                        onClick={advance}
                        disabled={!isAnswered(currentQuestion)}
                        className="flex items-center gap-2 px-7 py-3 rounded-lg bg-accent text-white text-sm font-bold hover:bg-accent/90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-accent/20"
                      >
                        {isLast ? "See my estimate" : "Continue"} <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                    {currentQuestion.optional && (
                      <button
                        onClick={advance}
                        className="text-xs text-muted-foreground hover:text-ink transition ml-1 underline underline-offset-2"
                      >
                        Skip this question
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: live estimate sidebar */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-[4.25rem] lg:self-start lg:max-h-[calc(100dvh-4.5rem)] lg:overflow-y-auto lg:overscroll-y-contain [scrollbar-gutter:stable]">
              <EstimatePanel estimate={estimate} prevMid={prevMidRef.current} />
            </div>
          </div>
        )}

        <EstimateSeoSection projectType={answers.projectType} />
      </main>
      <SiteFooter />
    </div>
  );
}
