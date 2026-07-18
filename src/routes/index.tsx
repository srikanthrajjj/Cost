import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Search, Home, ChefHat, Bath,
  Calculator, GitCompare, Shield, MapPin, Sparkles, Lock,
  ArrowRight, Star, Check, TrendingUp,
  Facebook, Instagram, Youtube, Linkedin,
  Fan, Sun, Square,
  Send, X, Bot, MessageCircle,
  Maximize2, Minimize2, ThumbsUp, ThumbsDown,
} from "lucide-react";
import { calculateEstimate } from "@/lib/estimator-engine";
import { getActiveSteps } from "@/lib/estimator-steps";
import type { EstimatorAnswers } from "@/lib/estimator-engine";
import type { Question } from "@/lib/estimator-steps";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import heroHome from "@/assets/hero-home.jpg";
import projRoof from "@/assets/proj-roof.jpg";
import projKitchen from "@/assets/proj-kitchen.jpg";
import projBathroom from "@/assets/proj-bathroom.jpg";
import projHvac from "@/assets/proj-hvac.jpg";
import projWindows from "@/assets/proj-windows.jpg";
import projSolar from "@/assets/proj-solar.jpg";
import cmpRoof from "@/assets/cmp-roof.jpg";
import cmpCounter from "@/assets/cmp-counter.jpg";
import cmpHvac from "@/assets/cmp-hvac.jpg";
import cmpWater from "@/assets/cmp-water.jpg";
import blueprint from "@/assets/house-blueprint.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:image", content: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200" },
    ],
  }),
  component: Landing,
});

const trend = [
  { v: 20 },{ v: 24 },{ v: 22 },{ v: 28 },{ v: 26 },{ v: 32 },
  { v: 30 },{ v: 36 },{ v: 34 },{ v: 42 },{ v: 40 },{ v: 48 },
];
const projects = [
  { img: projRoof, icon: Home, name: "Roof Replacement", avgCost: "$16,650", price: "$8,600 – $24,700", time: "3 – 5 Days", roi: "68%", difficulty: "Medium" },
  { img: projKitchen, icon: ChefHat, name: "Kitchen Remodel", avgCost: "$50,000", price: "$25,000 – $75,000", time: "4 – 8 Weeks", roi: "72%", difficulty: "Hard" },
  { img: projBathroom, icon: Bath, name: "Bathroom Remodel", avgCost: "$19,000", price: "$8,000 – $30,000", time: "2 – 4 Weeks", roi: "65%", difficulty: "Medium" },
  { img: projHvac, icon: Fan, name: "HVAC Replacement", avgCost: "$8,250", price: "$4,500 – $12,000", time: "1 – 2 Days", roi: "58%", difficulty: "Easy" },
  { img: projWindows, icon: Square, name: "Window Replacement", avgCost: "$12,500", price: "$6,000 – $21,000", time: "1 – 3 Days", roi: "72%", difficulty: "Medium" },
  { img: projSolar, icon: Sun, name: "Solar Panel Installation", avgCost: "$25,000", price: "$15,000 – $35,000", time: "2 – 3 Days", roi: "80%", difficulty: "Hard" },
];
const steps = [
  { icon: Search, title: "Choose Your Project", desc: "Select from 100+ home improvement projects" },
  { icon: Calculator, title: "Estimate Your Cost", desc: "Get accurate, location-based estimates in seconds" },
  { icon: GitCompare, title: "Compare Your Options", desc: "Materials, styles, and contractors side by side" },
  { icon: Check, title: "Plan With Confidence", desc: "Make the best decision for your home and budget" },
];
const trust = [
  { icon: MapPin, title: "Accurate & Local Data", desc: "Real pricing from thousands of projects in your area." },
  { icon: Sparkles, title: "Unbiased Recommendations", desc: "We don't sell. We help you make the best decision for your home." },
  { icon: TrendingUp, title: "Expert-Backed Insights", desc: "Guidance from industry professionals and building experts." },
  { icon: Lock, title: "Privacy First", desc: "Your data is secure and never shared with contractors." },
];
const comparisons = [
  { img: cmpRoof, title: "Asphalt vs Metal Roofing", desc: "Compare durability, cost, and ROI" },
  { img: cmpCounter, title: "Quartz vs Granite Countertops", desc: "See which is best for your kitchen" },
  { img: cmpHvac, title: "Repair vs Replace HVAC", desc: "Which option saves you more in the long run?" },
  { img: cmpWater, title: "Tank vs Tankless Water Heaters", desc: "Compare upfront costs and long-term savings" },
];

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2">
      <img src="/logo.svg" alt="CostReno" style={{ height: "41px", width: "auto" }} />
    </a>
  );
}

function QuickEstimate() {
  const [projectType, setProjectType] = useState("roof");
  const [zipCode, setZipCode] = useState("");
  const [houseSize, setHouseSize] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [estimate, setEstimate] = useState({ cost: 0, range: "", confidence: 0 });
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const projectTypes = [
    { id: "roof", icon: Home, label: "Roof", color: "bg-blue-50 text-blue-600 border-blue-200" },
    { id: "kitchen", icon: ChefHat, label: "Kitchen", color: "bg-orange-50 text-orange-600 border-orange-200" },
    { id: "bathroom", icon: Bath, label: "Bathroom", color: "bg-purple-50 text-purple-600 border-purple-200" },
    { id: "hvac", icon: Fan, label: "HVAC", color: "bg-green-50 text-green-600 border-green-200" },
  ];

  const loadingSteps = [
    "Checking local pricing",
    "Calculating labor costs",
    "Applying regional adjustments",
    "Estimating permits",
  ];

  const calculateEstimate = () => {
    if (!zipCode || !houseSize) return;
    setIsCalculating(true);
    setShowResult(false);
    setCompletedSteps([]);
    
    let step = 0;
    const interval = setInterval(() => {
      if (step < loadingSteps.length) {
        setLoadingText(loadingSteps[step]);
        setCompletedSteps(prev => [...prev, step]);
        step++;
      } else {
        clearInterval(interval);
        setCompletedSteps(prev => [...prev, step]);
        setTimeout(() => {
          const baseCost = projectType === "roof" ? 8 : projectType === "kitchen" ? 25 : projectType === "bathroom" ? 8 : 4;
          const sizeMultiplier = parseInt(houseSize) / 2000;
          const randomVariance = 0.9 + Math.random() * 0.2;
          const cost = Math.round(baseCost * 1000 * sizeMultiplier * randomVariance);
          setEstimate({
            cost,
            range: `$${Math.round(cost * 0.9).toLocaleString()} – $${Math.round(cost * 1.1).toLocaleString()}`,
            confidence: Math.round(85 + Math.random() * 10),
          });
          setIsCalculating(false);
          setShowResult(true);
        }, 300);
      }
    }, 700);
  };

  return (
    <section className="container-x py-10">
      <div className="rounded-2xl border border-border bg-card p-6 md:p-10 max-w-3xl mx-auto">
        {!showResult ? (
          <>
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">Get Your Instant Estimate</h2>
              <p className="mt-2 text-sm text-muted-foreground">Answer 3 quick questions. No signup required.</p>
            </div>

            {/* Project Type Selector */}
            <div>
              <label className="text-xs font-medium text-ink mb-2 block">Project Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {projectTypes.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProjectType(p.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      projectType === p.id 
                        ? `${p.color} border-current shadow-md` 
                        : "border-border hover:border-muted-foreground/30 bg-background"
                    }`}
                  >
                    <p.icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ZIP Code */}
            <div className="mt-6">
              <label className="text-xs font-medium text-ink mb-2 block">ZIP Code</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="90210" 
                  className="w-full h-14 rounded-xl border border-border bg-background pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring transition" 
                />
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground">Used to calculate local labor and material costs</p>
            </div>

            {/* House Size */}
            <div className="mt-5">
              <label className="text-xs font-medium text-ink mb-2 block">House Size (sq ft)</label>
              <div className="relative">
                <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  value={houseSize}
                  onChange={(e) => setHouseSize(e.target.value)}
                  placeholder="2,000" 
                  className="w-full h-14 rounded-xl border border-border bg-background pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring transition" 
                />
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground">Total square footage of your home</p>
            </div>

            {/* CTA */}
            <div className="mt-8 sticky bottom-4 md:static">
              {isCalculating ? (
                <div className="rounded-xl border border-border bg-background p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    <span className="text-sm font-medium text-ink">Calculating your estimate...</span>
                  </div>
                  <div className="space-y-3">
                    {loadingSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          completedSteps.includes(i) 
                            ? 'bg-accent text-accent-foreground' 
                            : 'border border-border'
                        }`}>
                          {completedSteps.includes(i) && <Check className="h-3 w-3" />}
                        </div>
                        <span className={`text-xs transition-colors ${
                          completedSteps.includes(i) ? 'text-ink' : 'text-muted-foreground'
                        }`}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <button 
                    onClick={calculateEstimate}
                    disabled={!zipCode || !houseSize}
                    className="w-full rounded-xl bg-accent py-4 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Get My Free Estimate
                  </button>
                  <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
                    <span>No signup</span>
                    <span>•</span>
                    <span>Free</span>
                    <span>•</span>
                    <span>30 seconds</span>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          /* Result View */
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-3">
                <Check className="h-3 w-3" /> {estimate.confidence}% Confidence
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">Your Estimate</h2>
            </div>

            {/* Main Estimate */}
            <div className="text-center py-6">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Estimated Cost</div>
              <div className="font-display text-6xl md:text-7xl font-bold text-ink">
                ${estimate.cost.toLocaleString()}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">Typical Range: {estimate.range}</div>
              <div className="mt-1 text-[10px] text-muted-foreground">Updated July 2026</div>
            </div>

            {/* Cost Breakdown */}
            <div className="mt-6 space-y-2">
              {[
                { name: "Materials", amount: Math.round(estimate.cost * 0.44), desc: "Quality materials at competitive regional pricing" },
                { name: "Labor", amount: Math.round(estimate.cost * 0.34), desc: "Licensed contractors in your area" },
                { name: "Permits", amount: Math.round(estimate.cost * 0.03), desc: "Required local building permits" },
                { name: "Waste", amount: Math.round(estimate.cost * 0.03), desc: "Debris removal and disposal" },
                { name: "Other", amount: Math.round(estimate.cost * 0.16), desc: "Additional costs and contingencies" },
              ].map((item) => (
                <details key={item.name} className="group rounded-lg border border-border bg-background overflow-hidden">
                  <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-xs hover:bg-muted/30 transition">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium text-ink">${item.amount.toLocaleString()}</span>
                  </summary>
                  <div className="px-4 pb-3 text-[10px] text-muted-foreground">{item.desc}</div>
                </details>
              ))}
            </div>

            {/* Roofing Materials Breakdown */}
            {projectType === "roof" && (
              <div className="mt-6 rounded-xl border border-border p-5 bg-background">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-3">Materials Required</div>
                <div className="text-xs text-ink mb-3">
                  To have 10% buffer would require <span className="font-semibold">{Math.ceil(parseInt(houseSize) / 100 * 1.1 / 100)} roof squares</span>.
                </div>
                <div className="text-xs font-medium text-ink mb-2">By United States standard, your roof will need:</div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                    <span><span className="font-medium text-ink">{Math.ceil(parseInt(houseSize) * 0.11)} bundles</span> of composition shingles (each bundle covers ~33 ft²)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                    <span><span className="font-medium text-ink">{Math.ceil(parseInt(houseSize) * 0.037)} rolls</span> of roll roofing (36 in × 36 ft each)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                    <span><span className="font-medium text-ink">{Math.ceil(parseInt(houseSize) * 0.01)} rolls</span> of #15 felt (36 in × 144 ft each)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                    <span><span className="font-medium text-ink">{Math.ceil(parseInt(houseSize) * 0.018)} rolls</span> of #30 felt (36 in × 72 ft each)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Roofing ceramic tiles do not have a standard size. Consult contractors to determine the amount needed.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendation Card */}
            <div className="mt-6 rounded-xl border border-border p-5 bg-background">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Recommended Material</div>
              <div className="font-display text-lg font-bold text-ink">Architectural Shingles</div>
              <div className="mt-3 text-xs font-medium text-ink mb-2">Why we recommend this:</div>
              <div className="space-y-1.5">
                {["Best ROI for your area", "Lowest long-term maintenance", "Ideal for your climate"].map((reason) => (
                  <div key={reason} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-accent shrink-0" /> {reason}
                  </div>
                ))}
              </div>
            </div>

            {/* How We Calculated - Collapsible */}
            <details className="mt-4 rounded-xl border border-border overflow-hidden">
              <summary className="px-4 py-3 cursor-pointer text-xs font-medium text-muted-foreground hover:bg-muted/30 transition">
                How we calculated this
              </summary>
              <div className="px-4 pb-3 text-[10px] text-muted-foreground space-y-1">
                <p>Local labor rates for {zipCode}</p>
                <p>Current material pricing data</p>
                <p>Permit costs by jurisdiction</p>
                <p>Based on {houseSize} sq ft</p>
                <p>Updated monthly</p>
              </div>
            </details>

            {/* Full Report Preview */}
            <div className="mt-6 rounded-xl border border-border p-4 bg-background">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Your Full Report Includes</div>
              <div className="grid grid-cols-2 gap-1.5">
                {["Detailed Cost Breakdown", "Material Comparison", "ROI Analysis", "Timeline", "Recommendation", "Contractor Checklist"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Check className="h-3 w-3 text-accent shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 space-y-3">
              <button className="w-full rounded-xl bg-accent py-4 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition">
                View Full Report →
              </button>
              <button 
                onClick={() => { setShowResult(false); setZipCode(""); setHouseSize(""); }}
                className="w-full rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground hover:bg-muted/50 transition"
              >
                Start New Estimate
              </button>
            </div>

            {/* Trust Message */}
            <div className="mt-6 text-center text-[10px] text-muted-foreground">
              Powered by regional labor and material pricing data
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Chat Estimator Component (uses SVG icons from estimator-steps.ts) ────────
function ChatEstimator({ onComplete }: { onComplete: (summary: string) => void }) {
  const [answers, setAnswers] = useState<EstimatorAnswers>({});
  const [stepIdx, setStepIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [finished, setFinished] = useState(false);

  const steps = getActiveSteps(answers);
  const currentStep = steps[stepIdx];
  const questions = currentStep?.questions ?? [];
  const currentQuestion: Question | undefined = questions[questionIdx];
  const estimate = calculateEstimate(answers);
  const hasEstimate = estimate.mid > 0;

  const setAnswer = (key: keyof EstimatorAnswers, value: unknown) =>
    setAnswers(prev => ({ ...prev, [key]: value }));

  const advance = () => {
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
    else { setFinished(true); }
  };

  const handleSelect = (key: keyof EstimatorAnswers, value: unknown) => {
    setAnswer(key, value);
    setTimeout(advance, 200);
  };

  useEffect(() => {
    if (finished && hasEstimate) {
      const breakdown = estimate.breakdown.map(b => `${b.label}: $${b.amount.toLocaleString()}`).join(" · ");
      const summary = `Here's your estimate summary:\n\n**Estimated Cost: $${estimate.mid.toLocaleString()}**\nRange: $${estimate.low.toLocaleString()} – $${estimate.high.toLocaleString()}\nConfidence: ${estimate.confidence}%\nTimeline: ${estimate.timeline}\nPermit required: ${estimate.permitRequired ? "Yes" : "No"}\nInsurance eligible: ${estimate.insuranceEligible ? "Possibly — check your policy" : "Not typically"}\n\n${breakdown}\n\nWant me to help you analyze a contractor quote, check insurance coverage, or compare materials?`;
      onComplete(summary);
    }
  }, [finished]);

  const totalSteps = steps.length;
  const progress = Math.round(((stepIdx + (questionIdx + 1) / Math.max(questions.length, 1)) / totalSteps) * 100);

  if (finished) return null;
  if (!currentQuestion) return null;

  return (
    <div className="rounded-2xl border border-accent/20 bg-white overflow-hidden w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#082A4B]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-bold text-white tracking-wide">COST ESTIMATOR</span>
        </div>
        {hasEstimate && (
          <span className="text-xs font-bold text-accent">${estimate.mid.toLocaleString()}</span>
        )}
      </div>
      {/* Progress */}
      <div className="h-1 bg-muted">
        <div className="h-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      {/* Question */}
      <div className="px-4 py-4 space-y-3">
        <div className="text-[10px] font-bold text-accent uppercase tracking-wider">{currentStep?.title}</div>
        <div className="text-sm font-bold text-ink leading-snug">{currentQuestion.title}</div>
        {/* Choices */}
        {(currentQuestion.type === "cards" || currentQuestion.type === "select-grid") && (
          <div className="grid grid-cols-2 gap-2">
            {currentQuestion.choices!.map((c) => {
              const isSelected = answers[currentQuestion.id] === c.value;
              return (
                <button key={c.value} onClick={() => handleSelect(currentQuestion.id, c.value)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left transition-all duration-150 text-xs
                    ${isSelected ? "border-accent bg-accent/8 text-accent" : "border-border bg-muted/20 hover:border-accent/40 hover:bg-accent/4 text-ink"}`}>
                  {c.icon && (
                    c.icon.endsWith('.svg') ? (
                      <img src={c.icon} alt={c.label} className="w-5 h-5 object-contain shrink-0" />
                    ) : (
                      <span className="text-base leading-none shrink-0">{c.icon}</span>
                    )
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{c.label}</div>
                    {c.desc && currentQuestion.type === "cards" && (
                      <div className="text-[10px] text-muted-foreground">{c.desc.replace("Avg", "From")}</div>
                    )}
                  </div>
                  {isSelected && <Check className="h-3 w-3 ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
        {currentQuestion.type === "toggle" && (
          <div className="flex gap-2">
            {[{ v: true, label: "Yes" }, { v: false, label: "No" }].map(({ v, label }) => (
              <button key={label} onClick={() => handleSelect(currentQuestion.id, v)}
                className={`flex-1 h-10 rounded-xl border-2 text-sm font-semibold transition-all
                  ${answers[currentQuestion.id] === v ? "border-accent bg-accent/8 text-accent" : "border-border bg-muted/20 text-ink hover:border-accent/40"}`}>
                {label}
              </button>
            ))}
          </div>
        )}
        {(currentQuestion.type === "number" || currentQuestion.type === "text") && (
          <div className="flex gap-2">
            <input type={currentQuestion.type === "number" ? "number" : "text"}
              placeholder={currentQuestion.placeholder}
              onChange={(e) => setAnswer(currentQuestion.id, currentQuestion.type === "number" ? parseFloat(e.target.value) : e.target.value)}
              className="flex-1 h-10 rounded-xl border-2 border-border bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-accent transition"
            />
            <button onClick={advance}
              className="px-4 h-10 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 transition">
              Next
            </button>
          </div>
        )}
        {currentQuestion.type === "budget" && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input type="number" placeholder="Your budget"
                onChange={(e) => setAnswer(currentQuestion.id, parseFloat(e.target.value))}
                className="flex-1 h-10 rounded-xl border-2 border-border bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-accent transition"
              />
              <button onClick={advance} className="px-4 h-10 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 transition">Next</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[10000, 25000, 50000, 100000].map(p => (
                <button key={p} onClick={() => { setAnswer(currentQuestion.id, p); setTimeout(advance, 200); }}
                  className="px-2.5 py-1 rounded-full border border-border text-[11px] font-semibold text-muted-foreground hover:border-accent hover:text-accent transition">
                  ${(p/1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Skip + live estimate */}
        <div className="flex items-center justify-between pt-1">
          {currentQuestion.optional && (
            <button onClick={advance} className="text-[11px] text-muted-foreground hover:text-ink transition underline underline-offset-2">
              Skip
            </button>
          )}
          {hasEstimate && (
            <div className="ml-auto text-[11px] text-muted-foreground">
              Est. <span className="font-bold text-accent">${estimate.mid.toLocaleString()}</span>
              <span className="ml-1 opacity-60">({estimate.confidence}% conf.)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Landing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{
    role: "user" | "ai" | "widget";
    text: string;
    widgetType?: "estimator";
    widgetDone?: boolean;
  }[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [locationDetected, setLocationDetected] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [manualCity, setManualCity] = useState("");

  const SK_API_KEY = import.meta.env.VITE_SK_API_KEY || "";

  // ─── Platform context the AI knows about ───────────────────────────────────
  const PLATFORM_CONTEXT = `
CostReno Platform Tools & Sections:
- Cost Estimator: enter project type, ZIP, square footage → instant cost breakdown
- AI Quote Analyzer: upload or paste a contractor quote → detect overcharges, red flags
- Material Comparator: compare 2+ materials side-by-side (cost, durability, ROI, maintenance)
- Insurance Coverage Guide: explain what homeowners insurance covers for renovations
- Project Guides & Advice: 100+ step-by-step guides for every home project
- Renovation Plan Generator: create a phased, budgeted renovation roadmap
- Contractor Checklist: vetting questions and red-flag warnings before hiring
- ROI Calculator: estimate resale value increase per project

Projects covered: Roof Replacement ($8,600–$24,700), Kitchen Remodel ($25,000–$75,000),
Bathroom Remodel ($8,000–$30,000), HVAC Replacement ($4,500–$12,000),
Window Replacement ($6,000–$21,000), Solar Panels ($15,000–$35,000),
Flooring ($3,000–$10,000), Deck/Patio ($6,000–$20,000), Garage Door ($1,500–$4,500), Painting ($2,000–$6,000).
`;

  // ─── Action cards the AI can suggest ───────────────────────────────────────
  type ActionCard = {
    icon: string;
    label: string;
    desc: string;
    action: string; // identifier for what happens on click
  };

  // Parse [ACTION:label:desc:action] tags from AI response
  const parseActions = (text: string): { clean: string; actions: ActionCard[] } => {
    const actions: ActionCard[] = [];
    const icons: Record<string, string> = {
      estimate: "🧮", quote: "📋", material: "⚖️", insurance: "🛡️",
      guide: "📖", plan: "🗺️", contractor: "🔍", roi: "📈", chat: "💬",
    };
    const clean = text.replace(/\[ACTION:([^:]+):([^:]+):([^\]]+)\]/g, (_, label, desc, action) => {
      actions.push({ icon: icons[action] || "→", label, desc, action });
      return "";
    });
    return { clean: clean.trim(), actions };
  };

  // ─── Markdown renderer ──────────────────────────────────────────────────────
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    const renderInline = (raw: string): React.ReactNode => {
      const parts = raw.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={idx} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
        }
        return <span key={idx}>{part}</span>;
      });
    };

    while (i < lines.length) {
      const line = lines[i].trim();
      if (!line) { i++; continue; }

      if (line.startsWith("- ") || line.startsWith("• ")) {
        const listItems: React.ReactNode[] = [];
        while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("• "))) {
          const content = lines[i].trim().replace(/^[-•]\s/, "");
          listItems.push(
            <li key={i} className="flex items-start gap-2 text-sm text-ink/80 leading-relaxed">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span>{renderInline(content)}</span>
            </li>
          );
          i++;
        }
        elements.push(<ul key={`ul-${i}`} className="space-y-1.5 my-2">{listItems}</ul>);
        continue;
      }

      if (/^\d+\.\s/.test(line)) {
        const listItems: React.ReactNode[] = [];
        let num = 1;
        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          const content = lines[i].trim().replace(/^\d+\.\s/, "");
          listItems.push(
            <li key={i} className="flex items-start gap-2.5 text-sm text-ink/80 leading-relaxed">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">{num}</span>
              <span>{renderInline(content)}</span>
            </li>
          );
          i++; num++;
        }
        elements.push(<ol key={`ol-${i}`} className="space-y-1.5 my-2">{listItems}</ol>);
        continue;
      }

      if (/\$[\d,]+/.test(line)) {
        elements.push(
          <div key={i} className="my-2 px-3 py-2.5 rounded-xl bg-accent/8 border border-accent/20 text-sm text-ink leading-relaxed">
            {renderInline(line)}
          </div>
        );
        i++; continue;
      }

      elements.push(<p key={i} className="text-sm text-ink/80 leading-relaxed">{renderInline(line)}</p>);
      i++;
    }

    return <div className="space-y-1">{elements}</div>;
  };

  // ─── Render a full AI message (text + action cards) ─────────────────────────
  const renderAIMessage = (rawText: string, onAction: (a: ActionCard) => void) => {
    const { clean, actions } = parseActions(rawText);
    return (
      <div className="space-y-3">
        {renderMarkdown(clean)}
        {actions.length > 0 && (
          <div className="flex flex-col gap-2 pt-1">
            {actions.map((a, idx) => (
              <button
                key={idx}
                onClick={() => onAction(a)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-accent/30 bg-accent/5 hover:bg-accent/10 hover:border-accent/60 transition text-left group"
              >
                <span className="text-lg leading-none">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink group-hover:text-accent transition">{a.label}</div>
                  <div className="text-[11px] text-muted-foreground">{a.desc}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-accent shrink-0 opacity-0 group-hover:opacity-100 transition" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ─── Scrollable ref ──────────────────────────────────────────────────────────
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // ─── AI API call ─────────────────────────────────────────────────────────────
  const getAIResponse = async (messages: { role: "user" | "ai"; text: string }[]): Promise<string> => {
    if (!SK_API_KEY) {
      return "API key not configured. Please set VITE_SK_API_KEY in your environment.";
    }
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SK_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://costreno.com",
          "X-Title": "CostReno AI",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat",
          messages: [
            {
              role: "system",
              content: `You are CostReno AI — the intelligent renovation copilot embedded in the CostReno platform. You are NOT a generic chatbot. You are the navigation layer for an entire home renovation platform.

${PLATFORM_CONTEXT}

YOUR ROLE:
You help homeowners at every stage — from "I have no idea where to start" to "I need to vet a contractor quote." You guide them to the right tool, guide, or action on the platform.

CAPABILITIES YOU CAN INVOKE:
When your answer naturally leads to a platform tool, append one or more ACTION tags at the END of your response (never in the middle). Format exactly:
[ACTION:Button Label:Short description:action_key]

Action keys: estimate, quote, material, insurance, guide, plan, contractor, roi

EXAMPLES:
- User has water damage → answer + [ACTION:Run Bathroom Estimator:Get an instant cost range:estimate][ACTION:Read Water Damage Guide:Step-by-step repair guide:guide][ACTION:Check Insurance Coverage:See what your policy may cover:insurance]
- User wants to compare materials → answer + [ACTION:Compare Materials Side-by-Side:Pick 2 materials to compare:material]
- User got a contractor quote → answer + [ACTION:Analyze My Quote:Detect overcharges and red flags:quote]
- User wants a renovation plan → answer + [ACTION:Build My Renovation Plan:Create a phased roadmap:plan]
- User asks "how much does X cost?" or "estimate my project" → ALWAYS add [ACTION:Run Cost Estimator:Get your personalized estimate in 2 min:estimate]

FORMATTING RULES:
- Use **bold** for key terms and dollar amounts
- Use bullet points for lists (- item)
- Use numbered steps for sequences (1. step)
- Keep answers under 180 words
- Tone: warm, direct, like a knowledgeable friend
- Do NOT use markdown headers (##)
- Always include cost ranges with $ when relevant
- Location context: ${userLocation ? `User is in ${userLocation}` : "Location unknown"}`,
            },
            ...messages.map((m) => ({
              role: (m.role === "ai" ? "assistant" : "user") as "user" | "assistant",
              content: m.text,
            })),
          ],
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("AI API error:", error);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }
  };

  // ─── Handle action card clicks ───────────────────────────────────────────────
  const handleAction = async (action: ActionCard) => {
    if (action.action === "estimate") {
      // Inject inline estimator widget instead of a text prompt
      setChatMessages(prev => [
        ...prev,
        { role: "user", text: "I'd like to run the cost estimator." },
        { role: "widget", text: "", widgetType: "estimator", widgetDone: false },
      ]);
      setTimeout(scrollToBottom, 50);
      return;
    }
    const prompts: Record<string, string> = {
      quote: "I have a contractor quote I'd like you to analyze.",
      material: "Help me compare materials for my project.",
      insurance: "Explain what homeowners insurance typically covers for renovation damage.",
      guide: "Show me a step-by-step guide for my project.",
      plan: "Help me create a renovation plan and budget roadmap.",
      contractor: "Give me a contractor vetting checklist and questions to ask.",
      roi: "Calculate the ROI and resale value impact for my renovation.",
    };
    const prompt = prompts[action.action] || `Tell me more about: ${action.label}`;
    const newMessages = [...chatMessages, { role: "user" as const, text: prompt }];
    setChatMessages(newMessages);
    setIsAiTyping(true);
    setTimeout(scrollToBottom, 50);
    const aiResponse = await getAIResponse(newMessages);
    setChatMessages(prev => [...prev, { role: "ai", text: aiResponse }]);
    setIsAiTyping(false);
    setTimeout(scrollToBottom, 50);
  };

  // ─── Handle estimator widget completion ────────────────────────────────────
  const handleEstimatorComplete = async (summary: string) => {
    // Mark widget as done, then post AI follow-up
    setChatMessages(prev => prev.map(m =>
      m.role === "widget" && m.widgetType === "estimator" && !m.widgetDone
        ? { ...m, widgetDone: true }
        : m
    ));
    const historyMessages = chatMessages
      .filter(m => m.role !== "widget")
      .map(m => ({ role: m.role as "user" | "ai", text: m.text }));
    const withSummary = [...historyMessages, { role: "ai" as const, text: summary }];
    setChatMessages(prev => [...prev, { role: "ai", text: summary }]);
    setIsAiTyping(true);
    setTimeout(scrollToBottom, 50);
    // Ask AI to provide smart next-step guidance based on the estimate
    const followUpMessages = [...withSummary, {
      role: "user" as const,
      text: "Based on this estimate, what should I do next? Give me 2-3 smart recommendations."
    }];
    const followUp = await getAIResponse(followUpMessages);
    setChatMessages(prev => [...prev, { role: "ai", text: followUp }]);
    setIsAiTyping(false);
    setTimeout(scrollToBottom, 50);
  };


  const searchTerms = [
    "kitchen remodels",
    "roof replacement",
    "bathroom renovations",
    "HVAC costs",
    "window replacement",
    "solar panels",
    "flooring options",
    "deck construction",
  ];
  const [termIdx, setTermIdx] = useState(0);
  const [displayTerm, setDisplayTerm] = useState("");
  const phaseRef = useRef<"typing" | "pause" | "erasing">("typing");
  const charIdxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (searchQuery.length > 0) return;
    const full = searchTerms[termIdx];

    const tick = () => {
      if (phaseRef.current === "typing") {
        charIdxRef.current++;
        setDisplayTerm(full.slice(0, charIdxRef.current));
        if (charIdxRef.current === full.length) {
          phaseRef.current = "pause";
          timerRef.current = setTimeout(tick, 2000);
          return;
        }
        timerRef.current = setTimeout(tick, 55);
      } else if (phaseRef.current === "pause") {
        phaseRef.current = "erasing";
        timerRef.current = setTimeout(tick, 55);
      } else {
        charIdxRef.current--;
        setDisplayTerm(full.slice(0, charIdxRef.current));
        if (charIdxRef.current === 0) {
          phaseRef.current = "typing";
          setTermIdx((prev) => (prev + 1) % searchTerms.length);
          timerRef.current = setTimeout(tick, 400);
          return;
        }
        timerRef.current = setTimeout(tick, 35);
      }
    };

    timerRef.current = setTimeout(tick, 400);
    return () => clearTimeout(timerRef.current);
  }, [searchQuery, termIdx]);

  useEffect(() => {
    const savedCity = localStorage.getItem("costreno_city");
    if (savedCity) {
      setUserLocation(savedCity);
      setLocationDetected(true);
      return;
    }
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.city) {
          setUserLocation(data.city);
          setLocationDetected(true);
          localStorage.setItem("costreno_city", data.city);
        } else {
          setShowLocationPrompt(true);
        }
      })
      .catch(() => {
        setShowLocationPrompt(true);
      });
  }, []);
  
  const projectData = [
    { name: "Roof Replacement", avgCost: "$16,650", duration: "3-5 Days", popularity: 95, synonyms: ["new roof", "roofing", "re-roof", "roof repair"], img: projRoof },
    { name: "Kitchen Remodel", avgCost: "$50,000", duration: "4-8 Weeks", popularity: 90, synonyms: ["kitchen renovation", "kitchen upgrade", "new kitchen"], img: projKitchen },
    { name: "Bathroom Remodel", avgCost: "$19,000", duration: "2-4 Weeks", popularity: 85, synonyms: ["bath renovation", "bathroom upgrade", "new bathroom"], img: projBathroom },
    { name: "HVAC Replacement", avgCost: "$8,250", duration: "1-2 Days", popularity: 80, synonyms: ["heating", "cooling", "air conditioning", "furnace", "AC"], img: projHvac },
    { name: "Window Replacement", avgCost: "$12,000", duration: "1-2 Days", popularity: 70, synonyms: ["new windows", "window install", "double pane"], img: projRoof },
    { name: "Solar Installation", avgCost: "$25,000", duration: "2-3 Days", popularity: 65, synonyms: ["solar panels", "photovoltaic", "PV"], img: projRoof },
    { name: "Deck Construction", avgCost: "$8,000", duration: "3-5 Days", popularity: 60, synonyms: ["patio", "deck build", "outdoor deck"], img: projRoof },
    { name: "Garage Door", avgCost: "$2,500", duration: "1 Day", popularity: 55, synonyms: ["garage install", "new garage"], img: projRoof },
    { name: "Flooring", avgCost: "$5,000", duration: "2-3 Days", popularity: 50, synonyms: ["hardwood", "laminate", "tile floor", "vinyl"], img: projRoof },
    { name: "Painting", avgCost: "$3,500", duration: "2-4 Days", popularity: 45, synonyms: ["house painting", "interior paint", "exterior paint"], img: projRoof },
  ];

  const popularProjects = projectData.filter(p => p.popularity >= 80).slice(0, 4);

  const fuzzyMatch = (query: string, project: typeof projectData[0]) => {
    const q = query.toLowerCase();
    const nameMatch = project.name.toLowerCase().includes(q);
    const synonymMatch = project.synonyms.some(s => s.toLowerCase().includes(q));
    return nameMatch || synonymMatch;
  };

  const filteredProjects = searchQuery.length > 0 
    ? projectData.filter(p => fuzzyMatch(searchQuery, p)).sort((a, b) => b.popularity - a.popularity).slice(0, 6)
    : [];

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-accent/20 text-ink rounded px-0.5">$1</mark>');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden lg:flex items-center gap-7 text-sm font-extrabold text-foreground absolute left-1/2 -translate-x-1/2">
            {["Projects","Cost Estimator","AI Quote Analyzer","Insurance Help","Guides & Advice","Tools"].map((l) => (
              <a key={l} href="#" className="hover:text-foreground transition-colors whitespace-nowrap">{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden sm:grid h-9 w-9 place-items-center rounded-full hover:bg-muted">
              <Search color="white" className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowLocationPrompt(true)}
              className="hidden md:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              <MapPin className="h-4 w-4" />
              <span>{userLocation || "Set Location"}</span>
            </button>
            <a href="#" className="hidden sm:inline text-sm font-bold text-foreground hover:text-primary transition">Sign In</a>
            <a href="#" className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-sm hover:bg-accent/90 transition">
              Sign Up
            </a>
          </div>
        </div>
      </header>

      {/* HERO — NerdWallet-inspired */}
      <section className="relative min-h-[520px] md:min-h-[600px] overflow-hidden">
        {/* Full-width background image */}
        <img src="/them.png" alt="" className="absolute inset-0 w-full h-full object-cover" />

        <div className="container-x relative z-10 flex flex-col justify-center min-h-[520px] md:min-h-[600px] py-16">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Smart renovation decisions start with{" "}
              <span className="text-accent">CostReno</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
              Navigate every home project move with guidance that you can trust.
            </p>
          </div>

          {/* AI Chat Input */}
          <div className="mt-10 max-w-2xl w-full">
            <div className="relative rounded-2xl bg-white shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="relative flex-1 min-w-0">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        const query = searchQuery.trim();
                        setChatOpen(true);
                        setShowSuggestions(false);
                        if (query) {
                          const newMessages = [{ role: "user" as const, text: query }];
                          setChatMessages(newMessages);
                          setChatInput("");
                          setSearchQuery("");
                          setIsAiTyping(true);
                          const aiResponse = await getAIResponse(newMessages);
                          setChatMessages([...newMessages, { role: "ai", text: aiResponse }]);
                          setIsAiTyping(false);
                        }
                      }
                    }}
                    className="w-full bg-transparent text-base outline-none text-ink"
                  />
                  {searchQuery.length === 0 && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-base text-muted-foreground/60 whitespace-nowrap">
                      Ask me about{" "}
                      <span className="font-bold text-ink">{displayTerm}</span>
                      <span className="animate-pulse">|</span>
                    </span>
                  )}
                </div>
                <button
                  onClick={async () => {
                    const query = searchQuery.trim();
                    setChatOpen(true);
                    if (query) {
                      const newMessages = [{ role: "user" as const, text: query }];
                      setChatMessages(newMessages);
                      setChatInput("");
                      setSearchQuery("");
                      setIsAiTyping(true);
                      const aiResponse = await getAIResponse(newMessages);
                      setChatMessages([...newMessages, { role: "ai", text: aiResponse }]);
                      setIsAiTyping(false);
                    }
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent text-white hover:bg-accent/90 transition shrink-0"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-card border border-border shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3">
                    {searchQuery.length === 0 ? (
                      <>
                        <div className="px-2 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Popular Projects</div>
                        <div className="grid grid-cols-2 gap-2">
                          {popularProjects.map((project) => (
                            <button
                              key={project.name}
                              className="flex items-center gap-3 p-3 text-left hover:bg-accent/5 rounded-xl transition-all group/item hover:shadow-md"
                              onMouseDown={() => {
                                setSelectedProject(project.name);
                                setSearchQuery(project.name);
                                setShowSuggestions(false);
                              }}
                            >
                              <img src={project.img} alt={project.name} className="w-12 h-12 rounded-lg object-cover" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-ink truncate group-hover/item:text-accent transition-colors">{project.name}</div>
                                <div className="text-[10px] text-muted-foreground">{project.avgCost} • {project.duration}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    ) : filteredProjects.length > 0 ? (
                      <>
                        <div className="px-2 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Projects Matching "{searchQuery}"</div>
                        <div className="space-y-1">
                          {filteredProjects.map((project) => (
                            <button
                              key={project.name}
                              className="w-full flex items-center gap-3 p-3 text-left hover:bg-accent/5 rounded-xl transition-all group/item hover:shadow-md"
                              onMouseDown={() => {
                                setSelectedProject(project.name);
                                setSearchQuery(project.name);
                                setShowSuggestions(false);
                              }}
                            >
                              <img src={project.img} alt={project.name} className="w-12 h-12 rounded-lg object-cover" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-ink truncate" dangerouslySetInnerHTML={{ __html: highlightMatch(project.name, searchQuery) }} />
                                <div className="text-[10px] text-muted-foreground">{project.avgCost} • {project.duration}</div>
                              </div>
                              <span className="text-[10px] text-accent font-medium">Estimate →</span>
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="py-8 text-center">
                        <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                        <div className="text-sm text-muted-foreground">No projects found for "{searchQuery}"</div>
                        <div className="text-[10px] text-muted-foreground mt-1">Try "roof", "kitchen", or "HVAC"</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI Badge bar */}
              <div className="flex items-center gap-2 px-5 py-2.5 bg-accent/10 border-t border-border/30">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded bg-accent flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-bold text-ink tracking-wide">COST<span className="text-accent">RENO</span> AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Interface Modal */}
      {chatOpen && (
        <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center ${isFullScreen ? "!items-stretch !justify-stretch" : ""}`}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setChatOpen(false)} />

          {/* Chat Panel */}
          <div className={`relative flex flex-col bg-white shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden ${
            isFullScreen
              ? "w-full h-full sm:w-full sm:h-full"
              : "w-full sm:w-[720px] sm:mx-4 h-[90vh] sm:h-[85vh] sm:rounded-2xl rounded-t-2xl"
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#082A4B]">
              <div className="flex items-center gap-2.5">
                <span className="font-display text-lg font-extrabold text-white tracking-wide">
                  COST<span className="text-accent">RENO</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-accent text-white text-[9px] font-bold tracking-wider">AI</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition"
                >
                  {isFullScreen ? (
                    <Minimize2 className="h-4 w-4 text-white/80" />
                  ) : (
                    <Maximize2 className="h-4 w-4 text-white/80" />
                  )}
                </button>
                <button
                  onClick={() => setChatOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition"
                >
                  <X className="h-4 w-4 text-white/80" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto py-5 space-y-5 ${isFullScreen ? "px-5" : "px-5"}`}>
              <div className={`mx-auto space-y-5 ${isFullScreen ? "max-w-xl" : ""}`}>
              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#082A4B] flex items-center justify-center mb-5 shadow-lg">
                    <Sparkles className="h-8 w-8 text-accent" />
                  </div>
                  <p className="text-base font-bold text-ink">Your renovation copilot is ready</p>
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
                    Ask anything — I'll answer, estimate costs, compare materials, and guide you to the right tool.
                  </p>

                  {/* Capability pills */}
                  <div className="flex flex-wrap gap-2 mt-5 justify-center max-w-sm">
                    {[
                      { emoji: "🧮", label: "Estimate costs" },
                      { emoji: "📋", label: "Analyze a quote" },
                      { emoji: "⚖️", label: "Compare materials" },
                      { emoji: "🛡️", label: "Insurance coverage" },
                      { emoji: "🗺️", label: "Build a plan" },
                      { emoji: "📖", label: "Project guides" },
                    ].map((pill) => (
                      <span key={pill.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 text-xs text-muted-foreground font-medium border border-border/50">
                        {pill.emoji} {pill.label}
                      </span>
                    ))}
                  </div>

                  {/* Starter questions */}
                  <div className="mt-6 w-full max-w-sm space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium text-left px-1">Try asking</p>
                    {[
                      "I have water damage in my bathroom — what should I do?",
                      "Is my contractor quote of $18,000 for a roof fair?",
                      "What's the best material for a wet bathroom floor?",
                      "Help me plan a full home renovation under $50,000",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={async () => {
                          const isEstimateQ = /how much|cost|estimate|price/i.test(q);
                          if (isEstimateQ) {
                            setChatMessages([
                              { role: "user", text: q },
                              { role: "widget", text: "", widgetType: "estimator", widgetDone: false },
                            ]);
                            setTimeout(scrollToBottom, 50);
                            return;
                          }
                          const newMessages = [{ role: "user" as const, text: q }];
                          setChatMessages(newMessages);
                          setIsAiTyping(true);
                          setTimeout(scrollToBottom, 50);
                          const aiResponse = await getAIResponse(newMessages);
                          setChatMessages(prev => [...prev, { role: "ai", text: aiResponse }]);
                          setIsAiTyping(false);
                          setTimeout(scrollToBottom, 50);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background hover:border-accent/40 hover:bg-accent/5 transition text-left group"
                      >
                        <span className="text-sm text-ink/70 group-hover:text-ink transition leading-snug">{q}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-accent shrink-0 transition" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  {msg.role === "user" ? (
                    <div className="max-w-[75%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm bg-accent text-white">
                      {msg.text}
                    </div>
                  ) : msg.role === "widget" && msg.widgetType === "estimator" ? (
                    <div className="flex items-start gap-2.5 w-full max-w-[90%]">
                      <div className="w-7 h-7 rounded-lg bg-[#082A4B] flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        {!msg.widgetDone ? (
                          <ChatEstimator onComplete={handleEstimatorComplete} />
                        ) : (
                          <div className="px-3 py-2 rounded-xl bg-accent/8 border border-accent/20 text-xs text-accent font-semibold flex items-center gap-2">
                            <Check className="h-3.5 w-3.5" /> Estimate completed — see results below
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2.5 max-w-[85%]">
                      <div className="w-7 h-7 rounded-lg bg-[#082A4B] flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-ink leading-relaxed">{renderAIMessage(msg.text, handleAction)}</div>
                        <div className="flex items-center gap-3 mt-2">
                          <button className="text-muted-foreground/40 hover:text-accent transition">
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </button>
                          <button className="text-muted-foreground/40 hover:text-destructive transition">
                            <ThumbsDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isAiTyping && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#082A4B] flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-md bg-muted">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className={`border-t border-border/50 ${isFullScreen ? "px-5 py-4 max-w-xl mx-auto w-full" : "px-4 pb-4 pt-2"}`}>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-2 focus-within:ring-2 focus-within:ring-accent/30 transition">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && chatInput.trim()) {
                      const newMessages = [...chatMessages, { role: "user" as const, text: chatInput }];
                      setChatMessages(newMessages);
                      setIsAiTyping(true);
                      setChatInput("");
                      setTimeout(scrollToBottom, 50);
                      const aiResponse = await getAIResponse(newMessages);
                      setChatMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
                      setIsAiTyping(false);
                      setTimeout(scrollToBottom, 50);
                    }
                  }}
                  placeholder="Ask me anything — costs, materials, insurance, plans..."
                  className="flex-1 bg-transparent text-sm outline-none px-2 text-ink placeholder:text-muted-foreground/60"
                />
                <button
                  onClick={async () => {
                    if (chatInput.trim()) {
                      const newMessages = [...chatMessages, { role: "user" as const, text: chatInput }];
                      setChatMessages(newMessages);
                      setIsAiTyping(true);
                      setChatInput("");
                      setTimeout(scrollToBottom, 50);
                      const aiResponse = await getAIResponse(newMessages);
                      setChatMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
                      setIsAiTyping(false);
                      setTimeout(scrollToBottom, 50);
                    }
                  }}
                  className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center text-background hover:bg-foreground/90 transition shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-center text-[10px] text-muted-foreground/50 mt-2">
                CostReno AI may produce inaccurate information. Verify important details.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Location Prompt Modal */}
      {showLocationPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLocationPrompt(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-7 w-7 text-accent" />
              </div>
              <h2 className="font-display text-xl font-bold text-ink text-center">Set Your Location</h2>
              <p className="text-sm text-muted-foreground text-center mt-2 leading-relaxed">
                Your location helps us provide <span className="font-semibold text-ink">accurate, local cost estimates</span> for your home projects. Construction costs vary significantly by region due to labor rates, material availability, and local regulations.
              </p>
              <div className="mt-5 space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && manualCity.trim()) {
                        setUserLocation(manualCity.trim());
                        setShowLocationPrompt(false);
                        localStorage.setItem("costreno_city", manualCity.trim());
                      }
                    }}
                    placeholder="Enter your city (e.g. Austin, TX)"
                    className="w-full h-11 rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent/30 transition"
                  />
                </div>
                <button
                  onClick={() => {
                    if (manualCity.trim()) {
                      setUserLocation(manualCity.trim());
                      setShowLocationPrompt(false);
                      localStorage.setItem("costreno_city", manualCity.trim());
                    }
                  }}
                  className="w-full h-11 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition"
                >
                  Save Location
                </button>
                <button
                  onClick={() => setShowLocationPrompt(false)}
                  className="w-full h-11 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted/50 transition"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPULAR PROJECTS */}
      <section className="container-x bg-white py-20 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-[28px] md:text-[32px] font-bold text-ink leading-[1.08] mb-4">
                What project are you planning?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Explore renovation projects, compare local costs, and get expert guidance before you start.
              </p>
            </div>
            <a href="#" className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md border border-border text-sm font-semibold text-primary hover:bg-primary/5 transition">
              View all projects <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 overflow-x-auto pb-6 hide-scrollbar">
              {projects.map((p) => (
                <a
                  key={p.name}
                  href="#"
                  className="group relative min-w-[280px] md:min-w-auto flex flex-col rounded-[18px] border border-[#E7EAF0] bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-accent/30"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-[18px]">
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold">
                      {p.time}
                    </span>
                  </div>

                  <div className="relative flex-1 p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <h3 className="text-[15px] font-semibold text-ink line-clamp-2 pr-2">
                        {p.name}
                      </h3>
                      <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                        <p.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="font-display text-[20px] font-bold text-ink">
                          {p.avgCost}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Typical: {p.price}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border/30">
                        <div className="w-full rounded-md border-2 border-accent px-4 py-2.5 text-xs font-semibold text-accent text-center hover:bg-accent hover:text-white hover:border-accent transition-colors cursor-pointer">
                          <a href="/estimate">Get Estimate</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-1/2 right-3 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex flex-col gap-1.5">
                      <button className="w-7 h-7 rounded-full bg-muted/50 hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors flex items-center justify-center">
                        <div className="text-[9px] font-medium">Quotes</div>
                      </button>
                      <button className="w-7 h-7 rounded-full bg-muted/50 hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors flex items-center justify-center">
                        <div className="text-[9px] font-medium">AI</div>
                      </button>
                      <button className="w-7 h-7 rounded-full bg-muted/50 hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors flex items-center justify-center">
                        <div className="text-[9px] font-medium">Info</div>
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SMART TOOLS */}
      <section className="container-x py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 mb-5">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-bold text-accent tracking-widest uppercase">Smart Tools</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight max-w-3xl mx-auto">
            Everything you need to renovate with confidence
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Powerful tools and AI-driven insights to help you plan, compare, and save on every project.
          </p>
        </div>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Cost Estimator */}
          <div className="group relative flex flex-col rounded-2xl border border-border bg-white p-6 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            <div className="w-14 h-14 rounded-2xl bg-accent/8 flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-colors duration-300">
              <svg className="w-7 h-7 text-accent" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="3" width="20" height="22" rx="3" />
                <rect x="7" y="6" width="14" height="5" rx="1.5" className="group-hover:fill-accent/20 transition-all duration-300" />
                <line x1="8"  y1="22" x2="8"  y2="19" strokeWidth="2.5" className="group-hover:stroke-accent transition-colors duration-300" />
                <line x1="12" y1="22" x2="12" y2="17" strokeWidth="2.5" className="group-hover:stroke-accent transition-colors duration-300 [transition-delay:60ms]" />
                <line x1="16" y1="22" x2="16" y2="20" strokeWidth="2.5" className="group-hover:stroke-accent transition-colors duration-300 [transition-delay:120ms]" />
                <line x1="20" y1="22" x2="20" y2="15" strokeWidth="2.5" className="group-hover:stroke-accent transition-colors duration-300 [transition-delay:180ms]" />
              </svg>
            </div>
            <h3 className="font-display text-base font-bold text-ink mb-1.5">Cost Estimator</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">Get accurate, local cost estimates for your project in minutes.</p>
            <div className="mt-5 flex flex-col gap-2">
              <a href="/estimate" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors">
                Get Estimate <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#" className="flex items-center justify-center w-full py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-ink transition-colors">Learn More</a>
            </div>
          </div>

          {/* Quote Review */}
          <div className="group relative flex flex-col rounded-2xl border border-border bg-white p-6 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            <div className="w-14 h-14 rounded-2xl bg-accent/8 flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-colors duration-300">
              <svg className="w-7 h-7 text-accent" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h11l5 5v17H6V3z" /><path d="M17 3v5h5" />
                <circle cx="13" cy="16" r="4" className="group-hover:stroke-accent transition-colors duration-300" />
                <line x1="16" y1="19" x2="19.5" y2="22.5" strokeWidth="2.2" className="group-hover:stroke-accent transition-colors duration-300" />
              </svg>
            </div>
            <h3 className="font-display text-base font-bold text-ink mb-1.5">Quote Review</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">Upload any contractor quote and get AI-powered analysis, spot overpricing, and missing items.</p>
            <div className="mt-5 flex flex-col gap-2">
              <a href="#" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors">Review a Quote <ArrowRight className="h-4 w-4" /></a>
              <a href="#" className="flex items-center justify-center w-full py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-ink transition-colors">See How It Works</a>
            </div>
          </div>

          {/* Insurance Checker */}
          <div className="group relative flex flex-col rounded-2xl border border-border bg-white p-6 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            <div className="w-14 h-14 rounded-2xl bg-accent/8 flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-colors duration-300">
              <svg className="w-7 h-7 text-accent" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 3L5 7v7c0 5.5 3.9 10.7 9 12 5.1-1.3 9-6.5 9-12V7L14 3z" />
                <path d="M10 14l3 3 5-5" strokeWidth="2" className="group-hover:stroke-accent transition-all duration-500 [stroke-dasharray:14] [stroke-dashoffset:14] group-hover:[stroke-dashoffset:0]" />
              </svg>
            </div>
            <h3 className="font-display text-base font-bold text-ink mb-1.5">Insurance Checker</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">Find out what's covered and maximize your insurance benefits.</p>
            <div className="mt-5 flex flex-col gap-2">
              <a href="#" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors">Check Coverage <ArrowRight className="h-4 w-4" /></a>
              <a href="#" className="flex items-center justify-center w-full py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-ink transition-colors">Learn More</a>
            </div>
          </div>

          {/* Material Compare */}
          <div className="group relative flex flex-col rounded-2xl border border-border bg-white p-6 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            <div className="w-14 h-14 rounded-2xl bg-accent/8 flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-colors duration-300">
              <svg className="w-7 h-7 text-accent" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 3L3 9l11 6 11-6-11-6z" />
                <path d="M3 14l11 6 11-6" className="group-hover:translate-y-0.5 transition-transform duration-300" />
                <path d="M3 19l11 6 11-6" className="group-hover:translate-y-0.5 transition-transform duration-500 [transition-delay:100ms]" />
              </svg>
            </div>
            <h3 className="font-display text-base font-bold text-ink mb-1.5">Material Compare</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">Compare materials side-by-side on cost, durability, lifespan, and more.</p>
            <div className="mt-5 flex flex-col gap-2">
              <a href="#" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors">Compare Materials <ArrowRight className="h-4 w-4" /></a>
              <a href="#" className="flex items-center justify-center w-full py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-ink transition-colors">View Comparisons</a>
            </div>
          </div>

          {/* Budget Planner */}
          <div className="group relative flex flex-col rounded-2xl border border-border bg-white p-6 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            <div className="w-14 h-14 rounded-2xl bg-accent/8 flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-colors duration-300">
              <svg className="w-7 h-7 text-accent" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="14" cy="14" r="10" />
                <path d="M14 14L14 4" strokeWidth="2" className="group-hover:stroke-accent transition-colors duration-200" />
                <path d="M14 14 A10 10 0 0 1 22.7 19" strokeWidth="2.5" className="group-hover:stroke-accent transition-colors duration-300 [transition-delay:100ms]" />
                <circle cx="14" cy="14" r="2.5" className="fill-white group-hover:fill-accent/30 transition-all duration-200" />
              </svg>
            </div>
            <h3 className="font-display text-base font-bold text-ink mb-1.5">Budget Planner</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">Plan your budget, explore options, and stay on track from start to finish.</p>
            <div className="mt-5 flex flex-col gap-2">
              <a href="#" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors">Plan Your Budget <ArrowRight className="h-4 w-4" /></a>
              <a href="#" className="flex items-center justify-center w-full py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-ink transition-colors">Learn More</a>
            </div>
          </div>

          {/* ROI Calculator */}
          <div className="group relative flex flex-col rounded-2xl border border-border bg-white p-6 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            <div className="w-14 h-14 rounded-2xl bg-accent/8 flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-colors duration-300">
              <svg className="w-7 h-7 text-accent" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3,22 9,16 14,19 21,9 25,5" className="group-hover:stroke-accent transition-colors duration-300" />
                <polyline points="21,5 25,5 25,9" strokeWidth="2" className="group-hover:stroke-accent transition-colors duration-300 [transition-delay:150ms]" />
                <line x1="3" y1="25" x2="25" y2="25" className="opacity-25" />
                <line x1="3" y1="4" x2="3" y2="25" className="opacity-25" />
              </svg>
            </div>
            <h3 className="font-display text-base font-bold text-ink mb-1.5">ROI Calculator</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">See the return on investment and increase your home's value.</p>
            <div className="mt-5 flex flex-col gap-2">
              <a href="#" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors">Calculate ROI <ArrowRight className="h-4 w-4" /></a>
              <a href="#" className="flex items-center justify-center w-full py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-ink transition-colors">Learn More</a>
            </div>
          </div>

          {/* Project Timeline */}
          <div className="group relative flex flex-col rounded-2xl border border-border bg-white p-6 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            <div className="w-14 h-14 rounded-2xl bg-accent/8 flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-colors duration-300">
              <svg className="w-7 h-7 text-accent" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="22" height="20" rx="3" />
                <line x1="3" y1="11" x2="25" y2="11" />
                <line x1="9" y1="3" x2="9" y2="8" strokeWidth="2" />
                <line x1="19" y1="3" x2="19" y2="8" strokeWidth="2" />
                <circle cx="9"  cy="17" r="1.5" className="group-hover:fill-accent transition-all duration-200" />
                <circle cx="14" cy="17" r="1.5" className="group-hover:fill-accent transition-all duration-300 [transition-delay:80ms]" />
                <circle cx="19" cy="17" r="1.5" className="group-hover:fill-accent transition-all duration-300 [transition-delay:160ms]" />
                <circle cx="9"  cy="22" r="1.5" className="group-hover:fill-accent transition-all duration-300 [transition-delay:240ms]" />
              </svg>
            </div>
            <h3 className="font-display text-base font-bold text-ink mb-1.5">Project Timeline</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">Get a clear step-by-step timeline for your project from start to finish.</p>
            <div className="mt-5 flex flex-col gap-2">
              <a href="#" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors">View Timeline <ArrowRight className="h-4 w-4" /></a>
              <a href="#" className="flex items-center justify-center w-full py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-ink transition-colors">Sample Timeline</a>
            </div>
          </div>

          {/* Permit Guide */}
          <div className="group relative flex flex-col rounded-2xl border border-border bg-white p-6 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            <div className="w-14 h-14 rounded-2xl bg-accent/8 flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-colors duration-300">
              <svg className="w-7 h-7 text-accent" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h11l5 5v17H6V3z" /><path d="M17 3v5h5" />
                <line x1="10" y1="14"   x2="18" y2="14"   className="group-hover:stroke-accent transition-colors duration-200" />
                <line x1="10" y1="17.5" x2="18" y2="17.5" className="group-hover:stroke-accent transition-colors duration-200 [transition-delay:60ms]" />
                <line x1="10" y1="21"   x2="14" y2="21"   className="group-hover:stroke-accent transition-colors duration-200 [transition-delay:120ms]" />
                <circle cx="20.5" cy="21.5" r="4" className="fill-white group-hover:fill-accent/10 transition-all duration-300" />
                <path d="M18.5 21.5l1.5 1.5 2.5-2.5" strokeWidth="1.5" className="group-hover:stroke-accent transition-colors duration-300 [transition-delay:150ms]" />
              </svg>
            </div>
            <h3 className="font-display text-base font-bold text-ink mb-1.5">Permit Guide</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">Find out which permits you need and estimated costs in your area.</p>
            <div className="mt-5 flex flex-col gap-2">
              <a href="#" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors">Check Permits <ArrowRight className="h-4 w-4" /></a>
              <a href="#" className="flex items-center justify-center w-full py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-ink transition-colors">Guide & Requirements</a>
            </div>
          </div>

        </div>

        {/* Bottom CTA banner */}
        <div className="mt-8 rounded-2xl border border-border/60 bg-gradient-to-r from-muted/50 to-accent/5 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="text-sm font-bold text-ink">Not sure where to start?</div>
              <div className="text-xs text-muted-foreground max-w-sm">Let CostReno AI guide you step-by-step based on your home and goals — get personalized recommendations in seconds.</div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setChatOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition whitespace-nowrap shadow-sm shadow-accent/20"
            >
              <Sparkles className="h-4 w-4" /> Ask CostReno AI <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-white text-sm font-semibold text-ink hover:border-accent/40 transition whitespace-nowrap">
              Explore All Projects <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-x py-10">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
          <h2 className="text-center font-display text-2xl md:text-3xl font-bold text-ink">How CostReno Works</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-2 relative">
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center px-2">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight color="white" className="hidden md:block absolute top-4 -right-2 h-5 w-5 text-muted-foreground/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK ESTIMATE */}
      <QuickEstimate />

      {/* SEO CONTENT */}
      <section className="container-x py-8">
        <h3 className="font-display text-lg font-bold text-ink">Related Topics</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Roof Replacement Cost", "Roof Cost by State", "Roof Cost by ZIP Code",
            "Roof Cost by House Size", "Roof Material Comparison", "Roof Replacement Timeline",
            "Roof ROI", "Roof Insurance Guide"
          ].map((topic) => (
            <a key={topic} href="#" className="px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition">
              {topic}
            </a>
          ))}
        </div>
      </section>

      {/* FEATURED GUIDES */}
      <section className="container-x py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">Latest Homeowner Guides</h2>
            <p className="mt-1 text-sm text-muted-foreground">Expert insights to help you plan smarter</p>
          </div>
          <a href="#" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            View all guides <ArrowRight color="white" className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[
            { img: projRoof, title: "How Much Does Roof Replacement Cost?", tag: "Roofing", read: "8 min read" },
            { img: cmpRoof, title: "Roof Replacement Cost by State", tag: "Roofing", read: "12 min read" },
            { img: cmpCounter, title: "Metal vs Asphalt Roof", tag: "Comparison", read: "6 min read" },
            { img: projKitchen, title: "Kitchen Remodel Cost by ZIP Code", tag: "Kitchen", read: "10 min read" },
            { img: projBathroom, title: "Bathroom Remodel ROI", tag: "Bathroom", read: "5 min read" },
            { img: projHvac, title: "Should You Replace or Repair Your HVAC?", tag: "HVAC", read: "7 min read" },
          ].map((g) => (
            <a key={g.title} href="#" className="group block rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={g.img} alt={g.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-card/90 text-[10px] font-semibold text-ink">
                  {g.tag}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-sm font-bold text-ink group-hover:text-primary transition line-clamp-2">{g.title}</h3>
                <div className="mt-2 text-[10px] text-muted-foreground">{g.read}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* WHY TRUST */}
      <section className="container-x py-10">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
          <h2 className="text-center font-display text-2xl md:text-3xl font-bold text-ink">Why Homeowners Trust CostReno</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trust.map((t) => (
              <div key={t.title} className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-primary">
                  <t.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-ink">{t.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISONS */}
      <section className="container-x py-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">Popular Comparisons</h2>
          <a href="#" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            View all comparisons <ArrowRight color="white" className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {comparisons.map((c) => (
            <article key={c.title} className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={c.img} alt={c.title} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-card text-xs font-bold text-ink shadow-lg">
                  VS
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-base font-bold text-ink">{c.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                <a href="#" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  Compare Now <ArrowRight color="white" className="h-3 w-3" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container-x py-12">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 grid md:grid-cols-[auto_1fr_auto] gap-8 items-center">
          <img src={blueprint} alt="House blueprint" width={1024} height={1024} loading="lazy" className="h-32 w-40 object-contain" />
          <div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-ink">Stay Informed. Plan Smarter.</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get expert tips, cost trends, and project checklists straight to your inbox.</p>
            <form className="mt-4 flex gap-2 max-w-md">
              <input type="email" placeholder="Enter your email" className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <button className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90">Subscribe Free</button>
            </form>
          </div>
          <div className="flex md:flex-col gap-6 md:gap-4 text-center md:text-left md:border-l md:border-border md:pl-8">
            {[["100+","Guides & Articles"],["Weekly","Cost Updates"],["Free","Forever"]].map(([k,v]) => (
              <div key={v}>
                <div className="font-display text-lg font-bold text-ink">{k}</div>
                <div className="text-xs text-muted-foreground">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="container-x py-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center font-display text-2xl md:text-3xl font-bold text-ink">Frequently Asked Questions</h2>
          <p className="text-center text-sm text-muted-foreground mt-2">Everything you need to know about home improvement costs</p>
          
          <div className="mt-8 space-y-3">
            {[
              { q: "How much does roof replacement cost?", a: "The average roof replacement costs between $8,600 and $24,700, with most homeowners spending around $16,650. Costs vary based on roof size, materials, location, and labor rates in your area." },
              { q: "How long does roof replacement take?", a: "A typical roof replacement takes 3 to 5 days from start to finish. However, larger projects or complex roof designs may take up to 2 weeks. Weather conditions can also affect the timeline." },
              { q: "Does insurance cover roof replacement?", a: "Homeowner's insurance typically covers roof damage from covered perils like storms, hail, or fire. It usually doesn't cover damage from age, wear and tear, or lack of maintenance. Check your policy for specific coverage details." },
              { q: "How much is labor for roofing?", a: "Roofing labor costs typically range from $4,000 to $10,000, depending on your location, roof complexity, and contractor rates. Labor usually accounts for 40-60% of the total roof replacement cost." },
              { q: "Do I need permits for roof replacement?", a: "Most jurisdictions require permits for roof replacement. Your contractor typically handles the permitting process. Permit costs vary by location but usually range from $100 to $500." },
              { q: "How many quotes should I get?", a: "We recommend getting at least 3 quotes from different contractors. This gives you a good sense of fair pricing in your area and helps you compare materials, warranties, and timelines." },
              { q: "Can I finance my roof?", a: "Yes, many roofing companies offer financing options. You can also consider home equity loans, personal loans, or credit cards. Some roofing manufacturers also offer financing programs with promotional rates." },
              { q: "What is the cheapest roofing material?", a: "Asphalt shingles are the most affordable roofing material, costing $3.50 to $5.50 per square foot installed. They're durable, easy to install, and come in various colors and styles." },
              { q: "How long does a roof last?", a: "Asphalt shingle roofs last 20-30 years, metal roofs 40-70 years, tile roofs 50+ years, and slate roofs up to 100 years. Lifespan depends on material quality, installation, and maintenance." },
              { q: "When should I replace my roof?", a: "Consider replacing your roof when it's 20+ years old, has visible damage, multiple leaks, missing shingles, or after severe storm damage. Regular inspections help identify issues early." },
              { q: "What's the difference between repair and replacement?", a: "Roof repair fixes specific damaged areas and costs $300-$1,500. Replacement removes the entire roof and starts fresh. If damage covers more than 30% of the roof or it's near end-of-life, replacement is usually more cost-effective." },
              { q: "How do I choose a roofing contractor?", a: "Look for licensed, insured contractors with strong reviews. Verify their credentials, check references, get detailed written estimates, and ensure they offer warranties on both materials and workmanship." },
              { q: "What factors affect roof replacement cost?", a: "Key factors include roof size and slope, material choice, local labor rates, roof complexity, number of layers to remove, structural repairs needed, and your geographic location." },
              { q: "How accurate are online cost estimates?", a: "Online estimates provide a good ballpark figure based on average costs. For precise pricing, get on-site inspections from licensed contractors who can assess your specific situation and requirements." },
              { q: "Should I repair or replace my HVAC system?", a: "Consider replacement if your HVAC is 10-15+ years old, requires frequent repairs, uses R-22 refrigerant, or has rising energy bills. Repairs make sense for newer systems with minor issues." },
              { q: "How much does a kitchen remodel cost?", a: "Kitchen remodels range from $25,000 for minor updates to $75,000+ for major renovations. The average mid-range remodel costs around $50,000, with ROI typically around 72%." },
              { q: "How long does a kitchen remodel take?", a: "Minor kitchen updates take 2-4 weeks. Full remodels typically take 4-8 weeks. Custom cabinetry or structural changes can extend the timeline to 10-12 weeks." },
              { q: "Do bathroom remodels add value to homes?", a: "Yes, bathroom remodels offer excellent ROI, typically 60-70%. Minor bathroom updates have the best return on investment. The average bathroom remodel recoups about 65% of its cost at resale." },
              { q: "How much does a bathroom remodel cost?", a: "Bathroom remodels range from $8,000 for basic updates to $30,000+ for luxury renovations. A mid-range remodel averaging $19,000 offers the best balance of cost and ROI." },
              { q: "What permits are needed for home renovation?", a: "Permits are typically required for structural changes, electrical work, plumbing modifications, HVAC installation, and window/door replacements. Minor cosmetic work usually doesn't require permits." },
              { q: "How can I reduce renovation costs?", a: "Get multiple quotes, choose mid-range materials, do demolition yourself, keep the existing layout, schedule during off-season, and prioritize high-impact, low-cost improvements." },
              { q: "What is the best return on investment for home improvements?", a: "Top ROI projects include garage door replacement (94%), manufactured stone veneer (91%), minor kitchen remodel (72%), and deck addition (65%). Focus on curb appeal and kitchen/bathroom updates." },
              { q: "How do I check if a contractor is licensed?", a: "Verify licenses through your state's contractor licensing board website. Check for valid insurance, bonding, and any complaints or violations. Ask for proof of credentials before signing any contracts." },
              { q: "What should be included in a contractor quote?", a: "A complete quote should include materials, labor costs, timeline, payment schedule, warranty information, permit responsibilities, cleanup details, and scope of work specifications." },
            ].map((faq, i) => (
              <div key={i} className="group/item rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between px-5 py-4 cursor-pointer">
                  <span className="font-display text-sm font-semibold text-ink pr-4">{faq.q}</span>
                  <span className="shrink-0 ml-2 h-5 w-5 flex items-center justify-center text-muted-foreground text-xs group-hover/item:rotate-45 transition-transform duration-300">+</span>
                </div>
                <div className="px-5 pb-0 text-sm text-muted-foreground leading-relaxed max-h-0 group-hover/item:max-h-40 group-hover/item:pb-4 overflow-hidden transition-all duration-300">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-surface">
        <div className="container-x py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-8 text-sm">
            <div className="col-span-2 md:col-span-1">
              <Logo />
              <p className="mt-3 text-xs text-muted-foreground max-w-xs">
                The most trusted home improvement intelligence platform. Know your data. Expert insights. Smarter decisions.
              </p>
              <div className="mt-4 flex gap-3 text-muted-foreground">
                {[Facebook, Instagram, Youtube, Linkedin].map((I, i) => (
                  <a key={i} href="#" className="grid h-8 w-8 place-items-center rounded-full border border-border hover:text-primary hover:border-primary">
                    <I className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-ink">Projects</h4>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                {["Roof","Kitchen","Bathroom","HVAC","Windows","Flooring","Foundation","Solar"].map((item) => (
                  <li key={item}><a href="#" className="hover:text-foreground transition">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-ink">Calculators</h4>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                {["Roof Calculator","Kitchen Calculator","Bathroom Calculator","HVAC Calculator"].map((item) => (
                  <li key={item}><a href="#" className="hover:text-foreground transition">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-ink">Compare</h4>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                {["Roof Materials","Countertops","Windows"].map((item) => (
                  <li key={item}><a href="#" className="hover:text-foreground transition">{item}</a></li>
                ))}
              </ul>
              <h4 className="font-display text-sm font-bold text-ink mt-6">Guides</h4>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-ink">Resources</h4>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Coverage</a></li>
              </ul>
              <h4 className="font-display text-sm font-bold text-ink mt-6">Coverage</h4>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                {["States","Cities","ZIP Codes"].map((item) => (
                  <li key={item}><a href="#" className="hover:text-foreground transition">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="container-x py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <div>© 2025 CostReno. All rights reserved.</div>
            <div className="inline-flex items-center gap-1">Made with <span className="text-red-500">♥</span> for homeowners</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-bold text-ink">{title}</h4>
      <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
        {items.map((i) => (
          <li key={i}><a href="#" className="hover:text-primary">{i}</a></li>
        ))}
      </ul>
    </div>
  );
}
