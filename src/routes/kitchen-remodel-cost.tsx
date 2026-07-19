import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, MapPin, ChevronDown, Star, DollarSign } from "lucide-react";

export const Route = createFileRoute("/kitchen-remodel-cost")({
  head: () => ({
    meta: [
      { title: "Kitchen Remodel Cost Estimator 2026 — Get Your Estimate | CostReno" },
      { name: "description", content: "Calculate your kitchen remodel cost in under 90 seconds. ZIP-adjusted pricing, material comparisons, and a detailed cost breakdown. Free, no signup." },
      { property: "og:title", content: "Kitchen Remodel Cost Estimator 2026 — CostReno" },
      { property: "og:description", content: "Get a personalized kitchen remodel estimate based on your ZIP, size, scope, and materials. Results in 90 seconds." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://costreno.com/kitchen-remodel-cost" }],
  }),
  component: KitchenEstimator,
});

// ─── Types ────────────────────────────────────────────────────────────────────
interface KitchenAnswers {
  zip?: string;
  city?: string;
  state?: string;
  size?: "small" | "medium" | "large";
  scope?: "cosmetic" | "midrange" | "full";
  cabinets?: "stock" | "semicustom" | "custom";
  refaceCabinets?: boolean;
  countertop?: "laminate" | "quartz" | "granite" | "butcherblock" | "keep";
  appliances?: "keep" | "midrange" | "highend";
  structural?: string[];
  timeline?: "flexible" | "under8weeks" | "hard";
}

// ─── Cost Logic ───────────────────────────────────────────────────────────────
const LABOR_MULTIPLIERS: Record<string, number> = {
  // Metro areas with higher labor costs
  "90": 1.35, "91": 1.35, "94": 1.30, "95": 1.30, "10": 1.40, "11": 1.35,
  "20": 1.25, "21": 1.20, "60": 1.20, "98": 1.25, "02": 1.25, "33": 1.10,
  "77": 1.05, "30": 1.05, "85": 1.00, "48": 1.05, "55": 1.10,
};

function getLaborMultiplier(zip: string): number {
  const prefix = zip.substring(0, 2);
  return LABOR_MULTIPLIERS[prefix] || 1.0;
}

function calculateKitchenCost(answers: KitchenAnswers) {
  const laborMult = answers.zip ? getLaborMultiplier(answers.zip) : 1.0;

  // Base costs by scope
  let baseLow = 0, baseHigh = 0;
  if (answers.scope === "cosmetic") { baseLow = 8000; baseHigh = 18000; }
  else if (answers.scope === "midrange") { baseLow = 25000; baseHigh = 55000; }
  else { baseLow = 45000; baseHigh = 90000; }

  // Size multiplier
  let sizeMult = 1.0;
  if (answers.size === "small") sizeMult = 0.75;
  else if (answers.size === "large") sizeMult = 1.35;

  // Cabinet costs
  let cabinetAdd = 0;
  if (answers.refaceCabinets) { cabinetAdd = 4000; }
  else if (answers.cabinets === "stock") { cabinetAdd = 6000; }
  else if (answers.cabinets === "semicustom") { cabinetAdd = 14000; }
  else if (answers.cabinets === "custom") { cabinetAdd = 28000; }

  // Countertop costs
  let counterAdd = 0;
  if (answers.countertop === "laminate") counterAdd = 1500;
  else if (answers.countertop === "quartz") counterAdd = 5000;
  else if (answers.countertop === "granite") counterAdd = 4500;
  else if (answers.countertop === "butcherblock") counterAdd = 2500;

  // Appliance costs
  let applianceAdd = 0;
  if (answers.appliances === "midrange") applianceAdd = 5000;
  else if (answers.appliances === "highend") applianceAdd = 15000;

  // Structural add-ons
  let structuralAdd = 0;
  if (answers.structural?.includes("plumbing")) structuralAdd += 3500;
  if (answers.structural?.includes("wall")) structuralAdd += 6000;
  if (answers.structural?.includes("electrical")) structuralAdd += 2500;
  if (answers.structural?.includes("island")) structuralAdd += 5000;
  if (answers.structural?.includes("flooring")) structuralAdd += 4000;

  // Timeline premium
  let timelineMult = 1.0;
  if (answers.timeline === "under8weeks") timelineMult = 1.10;
  else if (answers.timeline === "hard") timelineMult = 1.18;

  const totalLow = Math.round((baseLow * sizeMult + cabinetAdd + counterAdd + applianceAdd + structuralAdd) * laborMult * timelineMult);
  const totalHigh = Math.round((baseHigh * sizeMult + cabinetAdd + counterAdd + applianceAdd + structuralAdd) * laborMult * timelineMult);
  const mid = Math.round((totalLow + totalHigh) / 2);

  return {
    low: totalLow,
    high: totalHigh,
    mid,
    breakdown: {
      cabinets: answers.refaceCabinets ? Math.round(cabinetAdd * laborMult) : Math.round(cabinetAdd * laborMult),
      countertops: Math.round(counterAdd * laborMult),
      appliances: applianceAdd,
      labor: Math.round(mid * 0.3),
      structural: Math.round(structuralAdd * laborMult),
      permits: Math.round(mid * 0.03),
      design: Math.round(mid * 0.05),
    },
  };
}

// ─── Metro Lookup ─────────────────────────────────────────────────────────────
const METRO_MEDIANS: Record<string, { city: string; median: string }> = {
  "90": { city: "Los Angeles", median: "$55,000–$85,000" },
  "10": { city: "New York City", median: "$60,000–$95,000" },
  "60": { city: "Chicago", median: "$42,000–$68,000" },
  "77": { city: "Houston", median: "$35,000–$58,000" },
  "85": { city: "Phoenix", median: "$32,000–$52,000" },
  "33": { city: "Miami", median: "$40,000–$65,000" },
  "98": { city: "Seattle", median: "$48,000–$75,000" },
  "20": { city: "Washington DC", median: "$50,000–$80,000" },
  "30": { city: "Atlanta", median: "$38,000–$60,000" },
  "02": { city: "Boston", median: "$52,000–$82,000" },
};

// ─── Main Component ───────────────────────────────────────────────────────────
function KitchenEstimator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<KitchenAnswers>({});
  const [done, setDone] = useState(false);

  const totalSteps = answers.scope === "cosmetic" ? 6 : 7;
  const progress = Math.round(((step + 1) / (totalSteps + 1)) * 100);

  const setAnswer = (key: keyof KitchenAnswers, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => {
    // Skip structural step if cosmetic
    if (step === 5 && answers.scope === "cosmetic") {
      setStep(6);
    } else if (step >= totalSteps - 1) {
      setDone(true);
    } else {
      setStep(step + 1);
    }
  };

  const back = () => {
    if (step === 6 && answers.scope === "cosmetic") setStep(4);
    else if (step > 0) setStep(step - 1);
  };

  const autoAdvance = (key: keyof KitchenAnswers, value: any) => {
    setAnswer(key, value);
    setTimeout(next, 250);
  };

  // ZIP lookup
  useEffect(() => {
    if (answers.zip?.length === 5 && !answers.city) {
      fetch(`https://api.zippopotam.us/us/${answers.zip}`)
        .then((r) => r.json())
        .then((d) => {
          if (d?.places?.[0]) {
            setAnswers((prev) => ({ ...prev, city: d.places[0]["place name"], state: d.places[0]["state abbreviation"] }));
          }
        })
        .catch(() => {});
    }
  }, [answers.zip]);

  const estimate = calculateKitchenCost(answers);
  const metro = answers.zip ? METRO_MEDIANS[answers.zip.substring(0, 2)] : null;

  if (done) {
    return <ResultsScreen answers={answers} estimate={estimate} onRestart={() => { setStep(0); setAnswers({}); setDone(false); }} />;
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <a href="/" className="shrink-0">
            <img src="/logo.svg" alt="CostReno" style={{ height: "32px", width: "auto" }} />
          </a>
          <span className="text-xs text-muted-foreground">Kitchen Remodel Estimator</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Step {step + 1} of {totalSteps}</span>
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Back button */}
        {step > 0 && (
          <button onClick={back} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-ink transition mb-6">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}

        {/* Steps */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300" key={step}>
          {step === 0 && <Step1 answers={answers} setAnswer={setAnswer} next={next} metro={metro} />}
          {step === 1 && <Step2 answers={answers} autoAdvance={autoAdvance} />}
          {step === 2 && <Step3 answers={answers} autoAdvance={autoAdvance} />}
          {step === 3 && <Step4 answers={answers} setAnswer={setAnswer} autoAdvance={autoAdvance} next={next} />}
          {step === 4 && <Step5 answers={answers} setAnswer={setAnswer} next={next} />}
          {step === 5 && <Step6 answers={answers} setAnswer={setAnswer} next={next} />}
          {step === 6 && <Step7 answers={answers} autoAdvance={autoAdvance} />}
        </div>

        {/* Live estimate */}
        {step > 0 && estimate.mid > 0 && (
          <div className="mt-8 p-4 rounded-xl border border-accent/20 bg-accent/5 text-center">
            <p className="text-xs text-muted-foreground mb-1">Running Estimate</p>
            <p className="font-display text-2xl font-bold text-ink">${estimate.mid.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step Components ──────────────────────────────────────────────────────────

function Step1({ answers, setAnswer, next, metro }: { answers: KitchenAnswers; setAnswer: any; next: () => void; metro: any }) {
  return (
    <div>
      <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Location</p>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-2">What's your ZIP code?</h2>
      <p className="text-sm text-muted-foreground mb-6">Labor rates vary 20-40% by metro. This adjusts every number in your estimate.</p>
      <div className="relative mb-4">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          value={answers.zip || ""}
          onChange={(e) => setAnswer("zip", e.target.value.replace(/\D/g, ""))}
          placeholder="90210"
          className="w-full h-14 rounded-xl border border-border bg-white pl-11 pr-4 text-lg font-medium outline-none focus:ring-2 focus:ring-accent/30 transition"
        />
      </div>
      {answers.city && (
        <p className="text-sm text-accent font-medium mb-4 flex items-center gap-2">
          <Check className="h-4 w-4" /> {answers.city}, {answers.state}
        </p>
      )}
      {metro && (
        <div className="p-4 rounded-lg border border-border bg-white mb-6">
          <p className="text-xs text-muted-foreground">Homeowners in <strong className="text-ink">{metro.city}</strong> typically spend</p>
          <p className="font-display text-lg font-bold text-ink">{metro.median}</p>
          <p className="text-xs text-muted-foreground">on a mid-range kitchen remodel</p>
        </div>
      )}
      <button
        onClick={next}
        disabled={!answers.zip || answers.zip.length < 5}
        className="w-full py-3.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        Continue <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Step2({ answers, autoAdvance }: { answers: KitchenAnswers; autoAdvance: any }) {
  const sizes = [
    { value: "small", label: "Small", desc: "Under 100 sq ft", detail: "Galley or apartment kitchen" },
    { value: "medium", label: "Medium", desc: "100–200 sq ft", detail: "Standard suburban kitchen" },
    { value: "large", label: "Large", desc: "200+ sq ft", detail: "Open-concept or chef's kitchen" },
  ];
  return (
    <div>
      <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Kitchen Size</p>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-2">How big is your kitchen?</h2>
      <p className="text-sm text-muted-foreground mb-6">Don't worry about exact numbers — a size tier is enough for an accurate estimate.</p>
      <div className="space-y-3">
        {sizes.map((s) => (
          <button
            key={s.value}
            onClick={() => autoAdvance("size", s.value)}
            className={`w-full flex items-center justify-between p-5 rounded-xl border-2 text-left transition-all ${
              answers.size === s.value ? "border-accent bg-accent/5 shadow-md" : "border-border bg-white hover:border-accent/40"
            }`}
          >
            <div>
              <p className="text-sm font-bold text-ink">{s.label} <span className="font-normal text-muted-foreground">— {s.desc}</span></p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p>
            </div>
            {answers.size === s.value && <Check className="h-5 w-5 text-accent shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function Step3({ answers, autoAdvance }: { answers: KitchenAnswers; autoAdvance: any }) {
  const scopes = [
    { value: "cosmetic", label: "Cosmetic Refresh", desc: "Paint, hardware, backsplash only", price: "$8K–$18K" },
    { value: "midrange", label: "Mid-Range Remodel", desc: "New cabinets, counters, appliances — same layout", price: "$25K–$55K" },
    { value: "full", label: "Full Gut Renovation", desc: "Layout changes, plumbing/electrical moved", price: "$45K–$90K+" },
  ];
  return (
    <div>
      <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Scope of Work</p>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-2">What are you planning?</h2>
      <p className="text-sm text-muted-foreground mb-6">This determines which cost model applies and which questions we'll ask next.</p>
      <div className="space-y-3">
        {scopes.map((s) => (
          <button
            key={s.value}
            onClick={() => autoAdvance("scope", s.value)}
            className={`w-full flex items-center justify-between p-5 rounded-xl border-2 text-left transition-all ${
              answers.scope === s.value ? "border-accent bg-accent/5 shadow-md" : "border-border bg-white hover:border-accent/40"
            }`}
          >
            <div>
              <p className="text-sm font-bold text-ink">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
            </div>
            <span className="text-xs font-mono font-semibold text-accent shrink-0">{s.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step4({ answers, setAnswer, autoAdvance, next }: { answers: KitchenAnswers; setAnswer: any; autoAdvance: any; next: () => void }) {
  const cabinets = [
    { value: "stock", label: "Stock Cabinets", desc: "Big-box store, standard sizes", price: "+$6,000" },
    { value: "semicustom", label: "Semi-Custom", desc: "More finish/size options", price: "+$14,000" },
    { value: "custom", label: "Full Custom", desc: "Built to your exact specs", price: "+$28,000" },
  ];
  return (
    <div>
      <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Cabinets</p>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-2">What kind of cabinets?</h2>
      <p className="text-sm text-muted-foreground mb-6">Cabinets are 30-40% of a kitchen remodel budget — the single biggest line item.</p>
      
      {/* Reface option */}
      <div className="mb-5 p-4 rounded-xl border border-border bg-white">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={answers.refaceCabinets || false}
            onChange={(e) => setAnswer("refaceCabinets", e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
          />
          <div>
            <p className="text-sm font-bold text-ink">Keep existing boxes, just reface?</p>
            <p className="text-xs text-muted-foreground mt-0.5">New doors and drawer fronts on existing cabinet frames. Saves 30-40% vs full replacement. Cost: ~$4,000.</p>
          </div>
        </label>
      </div>

      {!answers.refaceCabinets && (
        <div className="space-y-3">
          {cabinets.map((c) => (
            <button
              key={c.value}
              onClick={() => autoAdvance("cabinets", c.value)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                answers.cabinets === c.value ? "border-accent bg-accent/5" : "border-border bg-white hover:border-accent/40"
              }`}
            >
              <div>
                <p className="text-sm font-bold text-ink">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </div>
              <span className="text-xs font-mono font-semibold text-muted-foreground shrink-0">{c.price}</span>
            </button>
          ))}
        </div>
      )}

      {answers.refaceCabinets && (
        <button onClick={next} className="mt-4 w-full py-3.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition flex items-center justify-center gap-2">
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function Step5({ answers, setAnswer, next }: { answers: KitchenAnswers; setAnswer: any; next: () => void }) {
  const countertops = [
    { value: "keep", label: "Keep Existing", price: "$0" },
    { value: "laminate", label: "Laminate", price: "+$1,500" },
    { value: "butcherblock", label: "Butcher Block", price: "+$2,500" },
    { value: "granite", label: "Granite", price: "+$4,500" },
    { value: "quartz", label: "Quartz", price: "+$5,000" },
  ];
  const appliances = [
    { value: "keep", label: "Keep Existing", price: "$0" },
    { value: "midrange", label: "Mid-Range New", desc: "Stainless, standard brands", price: "+$5,000" },
    { value: "highend", label: "High-End New", desc: "Built-in, premium brands", price: "+$15,000" },
  ];
  return (
    <div>
      <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Countertops & Appliances</p>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-6">Materials & appliances</h2>
      
      <h3 className="text-sm font-bold text-ink mb-3">Countertop Material</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
        {countertops.map((c) => (
          <button
            key={c.value}
            onClick={() => setAnswer("countertop", c.value)}
            className={`p-3 rounded-lg border-2 text-center transition-all ${
              answers.countertop === c.value ? "border-accent bg-accent/5" : "border-border bg-white hover:border-accent/40"
            }`}
          >
            <p className="text-xs font-bold text-ink">{c.label}</p>
            <p className="text-[10px] font-mono text-accent mt-1">{c.price}</p>
          </button>
        ))}
      </div>

      <h3 className="text-sm font-bold text-ink mb-3">Appliance Package</h3>
      <div className="space-y-2 mb-6">
        {appliances.map((a) => (
          <button
            key={a.value}
            onClick={() => setAnswer("appliances", a.value)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
              answers.appliances === a.value ? "border-accent bg-accent/5" : "border-border bg-white hover:border-accent/40"
            }`}
          >
            <div>
              <p className="text-sm font-bold text-ink">{a.label}</p>
              {a.desc && <p className="text-xs text-muted-foreground">{a.desc}</p>}
            </div>
            <span className="text-xs font-mono font-semibold text-muted-foreground shrink-0">{a.price}</span>
          </button>
        ))}
      </div>

      <button
        onClick={next}
        disabled={!answers.countertop || !answers.appliances}
        className="w-full py-3.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        Continue <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Step6({ answers, setAnswer, next }: { answers: KitchenAnswers; setAnswer: any; next: () => void }) {
  const items = [
    { value: "plumbing", label: "Moving plumbing (sink/dishwasher)", price: "+$3,500" },
    { value: "wall", label: "Removing a wall", price: "+$6,000" },
    { value: "electrical", label: "Adding/moving electrical circuits", price: "+$2,500" },
    { value: "island", label: "Adding a kitchen island", price: "+$5,000" },
    { value: "flooring", label: "New flooring", price: "+$4,000" },
  ];
  const selected = answers.structural || [];
  const toggle = (v: string) => {
    const next = selected.includes(v) ? selected.filter((i) => i !== v) : [...selected, v];
    setAnswer("structural", next);
  };
  return (
    <div>
      <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Layout & Structural</p>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-2">Any structural changes?</h2>
      <p className="text-sm text-muted-foreground mb-6">These are the items that most often turn into "surprise" costs. Select all that apply.</p>
      <div className="space-y-2 mb-6">
        {items.map((item) => (
          <label
            key={item.value}
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selected.includes(item.value) ? "border-accent bg-accent/5" : "border-border bg-white hover:border-accent/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selected.includes(item.value)}
                onChange={() => toggle(item.value)}
                className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
              />
              <span className="text-sm font-medium text-ink">{item.label}</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground shrink-0">{item.price}</span>
          </label>
        ))}
      </div>
      <button onClick={next} className="w-full py-3.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition flex items-center justify-center gap-2">
        Continue <ArrowRight className="h-4 w-4" />
      </button>
      <button onClick={next} className="w-full mt-2 py-2 text-xs text-muted-foreground hover:text-ink transition">
        Skip — no structural changes
      </button>
    </div>
  );
}

function Step7({ answers, autoAdvance }: { answers: KitchenAnswers; autoAdvance: any }) {
  const timelines = [
    { value: "flexible", label: "Flexible", desc: "No rush — get the best price", price: "No premium" },
    { value: "under8weeks", label: "Under 8 Weeks", desc: "Faster scheduling needed", price: "+10% labor" },
    { value: "hard", label: "Hard Deadline", desc: "Must be done by a specific date", price: "+18% labor" },
  ];
  return (
    <div>
      <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Timeline</p>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-2">How flexible is your timeline?</h2>
      <p className="text-sm text-muted-foreground mb-6">Rushed timelines carry a labor premium — contractors reprioritize crews at a cost.</p>
      <div className="space-y-3">
        {timelines.map((t) => (
          <button
            key={t.value}
            onClick={() => autoAdvance("timeline", t.value)}
            className={`w-full flex items-center justify-between p-5 rounded-xl border-2 text-left transition-all ${
              answers.timeline === t.value ? "border-accent bg-accent/5 shadow-md" : "border-border bg-white hover:border-accent/40"
            }`}
          >
            <div>
              <p className="text-sm font-bold text-ink">{t.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
            </div>
            <span className="text-xs font-mono font-semibold text-muted-foreground shrink-0">{t.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────
function ResultsScreen({ answers, estimate, onRestart }: { answers: KitchenAnswers; estimate: ReturnType<typeof calculateKitchenCost>; onRestart: () => void }) {
  const bd = estimate.breakdown;
  const breakdownItems = [
    { label: "Cabinets", amount: bd.cabinets, pct: Math.round((bd.cabinets / estimate.mid) * 100) },
    { label: "Labor & Installation", amount: bd.labor, pct: Math.round((bd.labor / estimate.mid) * 100) },
    { label: "Countertops", amount: bd.countertops, pct: Math.round((bd.countertops / estimate.mid) * 100) },
    { label: "Appliances", amount: bd.appliances, pct: Math.round((bd.appliances / estimate.mid) * 100) },
    { label: "Structural Changes", amount: bd.structural, pct: Math.round((bd.structural / estimate.mid) * 100) },
    { label: "Permits & Fees", amount: bd.permits, pct: Math.round((bd.permits / estimate.mid) * 100) },
    { label: "Design & Contingency", amount: bd.design, pct: Math.round((bd.design / estimate.mid) * 100) },
  ].filter((item) => item.amount > 0);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <a href="/" className="shrink-0">
            <img src="/logo.svg" alt="CostReno" style={{ height: "32px", width: "auto" }} />
          </a>
          <button onClick={onRestart} className="text-xs text-muted-foreground hover:text-ink transition">Start Over</button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero result */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4">
            <Check className="h-3.5 w-3.5" /> Your Estimate is Ready
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mb-2">
            Kitchen Remodel Estimate
          </h1>
          {answers.city && (
            <p className="text-sm text-muted-foreground">{answers.city}, {answers.state}</p>
          )}
        </div>

        {/* Main number */}
        <div className="rounded-2xl border border-border bg-white p-8 text-center mb-8">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Estimated Cost</p>
          <p className="font-display text-5xl md:text-6xl font-bold text-ink">${estimate.mid.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-2">Range: ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Updated July 2026 · ZIP-adjusted</p>
        </div>

        {/* Breakdown */}
        <div className="rounded-2xl border border-border bg-white p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-ink mb-4">Cost Breakdown</h2>
          <div className="space-y-3">
            {breakdownItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm text-ink">{item.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden max-w-[120px]">
                    <div className="h-full rounded-full bg-accent/60" style={{ width: `${Math.min(item.pct, 100)}%` }} />
                  </div>
                </div>
                <span className="text-sm font-mono font-semibold text-ink">${item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Your Selections */}
        <div className="rounded-2xl border border-border bg-white p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-ink mb-4">Your Selections</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Size:</span> <span className="font-medium text-ink capitalize">{answers.size}</span></div>
            <div><span className="text-muted-foreground">Scope:</span> <span className="font-medium text-ink capitalize">{answers.scope}</span></div>
            <div><span className="text-muted-foreground">Cabinets:</span> <span className="font-medium text-ink capitalize">{answers.refaceCabinets ? "Reface" : answers.cabinets}</span></div>
            <div><span className="text-muted-foreground">Countertop:</span> <span className="font-medium text-ink capitalize">{answers.countertop}</span></div>
            <div><span className="text-muted-foreground">Appliances:</span> <span className="font-medium text-ink capitalize">{answers.appliances}</span></div>
            <div><span className="text-muted-foreground">Timeline:</span> <span className="font-medium text-ink capitalize">{answers.timeline}</span></div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <a
            href="/quote-analyzer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition"
          >
            Review a Contractor Quote <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="/estimate?project=kitchen"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-border text-sm font-semibold text-ink hover:border-accent/40 transition"
          >
            Get a More Detailed Estimate
          </a>
          <button
            onClick={onRestart}
            className="w-full py-2 text-xs text-muted-foreground hover:text-ink transition"
          >
            Start New Estimate
          </button>
        </div>

        {/* Pro tips */}
        <div className="mt-10 p-5 rounded-xl border border-accent/20 bg-accent/5">
          <p className="text-xs font-bold text-accent mb-2">💡 What to Do Next</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Get at least 3 quotes from licensed contractors</li>
            <li>• Upload your quote to our <a href="/quote-analyzer" className="text-accent font-semibold underline">AI Quote Analyzer</a> to spot red flags</li>
            <li>• Ask for itemized breakdowns — not lump-sum totals</li>
            <li>• Verify permits will be pulled by the contractor, not you</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
