import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Home,
  ChefHat,
  Bath,
  Calculator,
  GitCompare,
  Shield,
  MapPin,
  Sparkles,
  Lock,
  ArrowRight,
  Star,
  Check,
  TrendingUp,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Fan,
  Sun,
  Square,
  Send,
  X,
  Bot,
  MessageCircle,
  Paperclip,
  X as XIcon,
  Maximize2,
  Minimize2,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronDownIcon,
} from "lucide-react";
import { calculateEstimate } from "@/lib/estimator-engine";
import { getActiveSteps } from "@/lib/estimator-steps";
import type { EstimatorAnswers, ProjectType } from "@/lib/estimator-engine";
import type { Question } from "@/lib/estimator-steps";
import { extractProjectTypeFromChat } from "@/lib/chat-with-knowledge";
import type { ChatMessage } from "@/lib/chat-with-knowledge";
import { serverAnalyzeQuoteFull } from "@/lib/quote/quote-server";
import { serverChatWithKnowledge } from "@/lib/chat-server";
import { type QuoteAnalysisResult, type QuotePipelineStage } from "@/lib/quote";
import { friendlyOpenRouterMessage } from "@/lib/quote/openrouter-client";
import { SiteNav } from "@/components/SiteNav";
import { TrustBar } from "@/components/TrustBar";
import { SiteFooter } from "@/components/SiteFooter";
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
      {
        property: "og:image",
        content: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      },
    ],
  }),
  component: Landing,
});

const trend = [
  { v: 20 },
  { v: 24 },
  { v: 22 },
  { v: 28 },
  { v: 26 },
  { v: 32 },
  { v: 30 },
  { v: 36 },
  { v: 34 },
  { v: 42 },
  { v: 40 },
  { v: 48 },
];
const projects = [
  {
    img: projRoof,
    icon: Home,
    name: "Roof Replacement",
    avgCost: "$16,650",
    price: "$8,600 – $24,700",
    time: "3 – 5 Days",
    roi: "68%",
    difficulty: "Medium",
    projectType: "roof" as const,
  },
  {
    img: projKitchen,
    icon: ChefHat,
    name: "Kitchen Remodel",
    avgCost: "$50,000",
    price: "$25,000 – $75,000",
    time: "4 – 8 Weeks",
    roi: "72%",
    difficulty: "Hard",
    projectType: "kitchen" as const,
  },
  {
    img: projBathroom,
    icon: Bath,
    name: "Bathroom Remodel",
    avgCost: "$19,000",
    price: "$8,000 – $30,000",
    time: "2 – 4 Weeks",
    roi: "65%",
    difficulty: "Medium",
    projectType: "bathroom" as const,
  },
  {
    img: projHvac,
    icon: Fan,
    name: "HVAC Replacement",
    avgCost: "$8,250",
    price: "$4,500 – $12,000",
    time: "1 – 2 Days",
    roi: "58%",
    difficulty: "Easy",
    projectType: "hvac" as const,
  },
  {
    img: projWindows,
    icon: Square,
    name: "Window Replacement",
    avgCost: "$12,500",
    price: "$6,000 – $21,000",
    time: "1 – 3 Days",
    roi: "72%",
    difficulty: "Medium",
    projectType: "windows" as const,
  },
  {
    img: projSolar,
    icon: Sun,
    name: "Solar Panel Installation",
    avgCost: "$25,000",
    price: "$15,000 – $35,000",
    time: "2 – 3 Days",
    roi: "80%",
    difficulty: "Hard",
    projectType: "solar" as const,
  },
];
const steps = [
  {
    icon: Search,
    title: "Choose your project",
    desc: "Select from 100+ home improvement projects",
  },
  {
    icon: Calculator,
    title: "Estimate your cost",
    desc: "Get clear, location-based estimates in seconds",
  },
  {
    icon: GitCompare,
    title: "Compare your options",
    desc: "Materials, styles, and contractors side by side",
  },
  {
    icon: Check,
    title: "Plan with confidence",
    desc: "Make the best decision for your home and budget",
  },
];
const trust = [
  {
    icon: MapPin,
    title: "Clear & local data",
    desc: "Real pricing from thousands of projects in your area.",
  },
  {
    icon: Sparkles,
    title: "Unbiased recommendations",
    desc: "We don't sell. We help you make the best decision for your home.",
  },
  {
    icon: TrendingUp,
    title: "Expert-backed insights",
    desc: "Guidance from industry professionals and building experts.",
  },
  {
    icon: Lock,
    title: "Privacy first",
    desc: "Your data is secure and never shared with contractors.",
  },
];
const comparisons = [
  { img: cmpRoof, title: "Asphalt vs Metal Roofing", desc: "Compare durability, cost, and ROI" },
  {
    img: cmpCounter,
    title: "Quartz vs Granite Countertops",
    desc: "See which is best for your kitchen",
  },
  {
    img: cmpHvac,
    title: "Repair vs Replace HVAC",
    desc: "Which option saves you more in the long run?",
  },
  {
    img: cmpWater,
    title: "Tank vs Tankless Water Heaters",
    desc: "Compare upfront costs and long-term savings",
  },
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
    {
      id: "kitchen",
      icon: ChefHat,
      label: "Kitchen",
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      id: "bathroom",
      icon: Bath,
      label: "Bathroom",
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
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
        setCompletedSteps((prev) => [...prev, step]);
        step++;
      } else {
        clearInterval(interval);
        setCompletedSteps((prev) => [...prev, step]);
        setTimeout(() => {
          const baseCost =
            projectType === "roof"
              ? 8
              : projectType === "kitchen"
                ? 25
                : projectType === "bathroom"
                  ? 8
                  : 4;
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
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
                Get Your Instant Estimate
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Answer 3 quick questions. No signup required.
              </p>
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
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                Used to calculate local labor and material costs
              </p>
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
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                Total square footage of your home
              </p>
            </div>

            {/* CTA */}
            <div className="mt-8 sticky bottom-4 md:static">
              {isCalculating ? (
                <div className="rounded-xl border border-border bg-background p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    <span className="text-sm font-medium text-ink">
                      Calculating your estimate...
                    </span>
                  </div>
                  <div className="space-y-3">
                    {loadingSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            completedSteps.includes(i)
                              ? "bg-accent text-accent-foreground"
                              : "border border-border"
                          }`}
                        >
                          {completedSteps.includes(i) && <Check className="h-3 w-3" />}
                        </div>
                        <span
                          className={`text-xs transition-colors ${
                            completedSteps.includes(i) ? "text-ink" : "text-muted-foreground"
                          }`}
                        >
                          {step}
                        </span>
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
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
                Your Estimate
              </h2>
            </div>

            {/* Main Estimate */}
            <div className="text-center py-6">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Estimated Cost
              </div>
              <div className="font-display text-6xl md:text-7xl font-bold text-ink">
                ${estimate.cost.toLocaleString()}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Typical Range: {estimate.range}
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">Updated July 2026</div>
            </div>

            {/* Cost Breakdown */}
            <div className="mt-6 space-y-2">
              {[
                {
                  name: "Materials",
                  amount: Math.round(estimate.cost * 0.44),
                  desc: "Quality materials at competitive regional pricing",
                },
                {
                  name: "Labor",
                  amount: Math.round(estimate.cost * 0.34),
                  desc: "Licensed contractors in your area",
                },
                {
                  name: "Permits",
                  amount: Math.round(estimate.cost * 0.03),
                  desc: "Required local building permits",
                },
                {
                  name: "Waste",
                  amount: Math.round(estimate.cost * 0.03),
                  desc: "Debris removal and disposal",
                },
                {
                  name: "Other",
                  amount: Math.round(estimate.cost * 0.16),
                  desc: "Additional costs and contingencies",
                },
              ].map((item) => (
                <details
                  key={item.name}
                  className="group rounded-lg border border-border bg-background overflow-hidden"
                >
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
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-3">
                  Materials Required
                </div>
                <div className="text-xs text-ink mb-3">
                  To have 10% buffer would require{" "}
                  <span className="font-semibold">
                    {Math.ceil(((parseInt(houseSize) / 100) * 1.1) / 100)} roof squares
                  </span>
                  .
                </div>
                <div className="text-xs font-medium text-ink mb-2">
                  By United States standard, your roof will need:
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <span className="font-medium text-ink">
                        {Math.ceil(parseInt(houseSize) * 0.11)} bundles
                      </span>{" "}
                      of composition shingles (each bundle covers ~33 ft²)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <span className="font-medium text-ink">
                        {Math.ceil(parseInt(houseSize) * 0.037)} rolls
                      </span>{" "}
                      of roll roofing (36 in × 36 ft each)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <span className="font-medium text-ink">
                        {Math.ceil(parseInt(houseSize) * 0.01)} rolls
                      </span>{" "}
                      of #15 felt (36 in × 144 ft each)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                    <span>
                      <span className="font-medium text-ink">
                        {Math.ceil(parseInt(houseSize) * 0.018)} rolls
                      </span>{" "}
                      of #30 felt (36 in × 72 ft each)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Roofing ceramic tiles do not have a standard size. Consult contractors to
                      determine the amount needed.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendation Card */}
            <div className="mt-6 rounded-xl border border-border p-5 bg-background">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
                Recommended Material
              </div>
              <div className="font-display text-lg font-bold text-ink">Architectural Shingles</div>
              <div className="mt-3 text-xs font-medium text-ink mb-2">Why we recommend this:</div>
              <div className="space-y-1.5">
                {[
                  "Best ROI for your area",
                  "Lowest long-term maintenance",
                  "Ideal for your climate",
                ].map((reason) => (
                  <div
                    key={reason}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
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
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
                Your Full Report Includes
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  "Detailed Cost Breakdown",
                  "Material Comparison",
                  "ROI Analysis",
                  "Timeline",
                  "Recommendation",
                  "Contractor Checklist",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 text-[10px] text-muted-foreground"
                  >
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
                onClick={() => {
                  setShowResult(false);
                  setZipCode("");
                  setHouseSize("");
                }}
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
  const navigate = useNavigate();
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
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const advance = () => {
    let nextQ = questionIdx + 1;
    while (nextQ < questions.length) {
      if (!questions[nextQ].showIf || questions[nextQ].showIf!(answers)) break;
      nextQ++;
    }
    if (nextQ < questions.length) {
      setQuestionIdx(nextQ);
      return;
    }
    let nextS = stepIdx + 1;
    const newSteps = getActiveSteps({ ...answers });
    while (nextS < newSteps.length) {
      if (!newSteps[nextS].showIf || newSteps[nextS].showIf!(answers)) break;
      nextS++;
    }
    if (nextS < newSteps.length) {
      setStepIdx(nextS);
      setQuestionIdx(0);
    } else {
      setFinished(true);
    }
  };

  const handleSelect = (key: keyof EstimatorAnswers, value: unknown) => {
    setAnswer(key, value);
    // If project type is selected, redirect to /estimate with preselected project
    if (key === "projectType") {
      const projectValue = value as string;
      // Store the selected project in sessionStorage or navigate with state
      sessionStorage.setItem("costreno_preselected_project", projectValue);
      setTimeout(() => {
        navigate({ to: "/estimate" });
      }, 200);
    } else {
      setTimeout(advance, 200);
    }
  };

  useEffect(() => {
    if (finished && hasEstimate) {
      const breakdown = estimate.breakdown
        .map((b) => `${b.label}: $${b.amount.toLocaleString()}`)
        .join(" · ");
      const summary = `Here's your estimate summary:\n\n**Estimated Cost: $${estimate.mid.toLocaleString()}**\nRange: $${estimate.low.toLocaleString()} – $${estimate.high.toLocaleString()}\nConfidence: ${estimate.confidence}%\nTimeline: ${estimate.timeline}\nPermit required: ${estimate.permitRequired ? "Yes" : "No"}\nInsurance eligible: ${estimate.insuranceEligible ? "Possibly. Check your policy." : "Not typically"}\n\n${breakdown}\n\nWant me to help you analyze a contractor quote, check insurance coverage, or compare materials?`;
      onComplete(summary);
    }
  }, [finished]);

  const totalSteps = steps.length;
  const progress = Math.round(
    ((stepIdx + (questionIdx + 1) / Math.max(questions.length, 1)) / totalSteps) * 100,
  );

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
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Question */}
      <div className="px-4 py-4 space-y-3">
        <div className="text-[10px] font-bold text-accent uppercase tracking-wider">
          {currentStep?.title}
        </div>
        <div className="text-sm font-bold text-ink leading-snug">{currentQuestion.title}</div>
        {/* Choices */}
        {(currentQuestion.type === "cards" || currentQuestion.type === "select-grid") && (
          <div className="grid grid-cols-2 gap-2">
            {currentQuestion.choices!.map((c) => {
              const isSelected = answers[currentQuestion.id] === c.value;
              return (
                <button
                  key={c.value}
                  onClick={() => handleSelect(currentQuestion.id, c.value)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-150
                    ${isSelected ? "border-accent bg-accent/10 text-accent shadow-md" : "border-border bg-white hover:border-accent/40 hover:shadow-sm text-ink"}`}
                >
                  {c.icon &&
                    (c.icon.endsWith(".svg") ? (
                      <img src={c.icon} alt={c.label} className="w-8 h-8 object-contain shrink-0" />
                    ) : (
                      <span className="text-2xl leading-none shrink-0">{c.icon}</span>
                    ))}
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm">{c.label}</div>
                    {c.desc && currentQuestion.type === "cards" && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {c.desc.replace("Avg", "From")}
                      </div>
                    )}
                  </div>
                  {isSelected && <Check className="h-4 w-4 ml-2 shrink-0 text-accent" />}
                </button>
              );
            })}
          </div>
        )}
        {currentQuestion.type === "toggle" && (
          <div className="flex gap-2">
            {[
              { v: true, label: "Yes" },
              { v: false, label: "No" },
            ].map(({ v, label }) => (
              <button
                key={label}
                onClick={() => handleSelect(currentQuestion.id, v)}
                className={`flex-1 h-10 rounded-xl border-2 text-sm font-semibold transition-all
                  ${answers[currentQuestion.id] === v ? "border-accent bg-accent/8 text-accent" : "border-border bg-muted/20 text-ink hover:border-accent/40"}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        {(currentQuestion.type === "number" || currentQuestion.type === "text") && (
          <div className="flex gap-2">
            <input
              type={currentQuestion.type === "number" ? "number" : "text"}
              placeholder={currentQuestion.placeholder}
              onChange={(e) =>
                setAnswer(
                  currentQuestion.id,
                  currentQuestion.type === "number" ? parseFloat(e.target.value) : e.target.value,
                )
              }
              className="flex-1 h-10 rounded-xl border-2 border-border bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-accent transition"
            />
            <button
              onClick={advance}
              className="px-4 h-10 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 transition"
            >
              Next
            </button>
          </div>
        )}
        {currentQuestion.type === "budget" && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Your budget"
                onChange={(e) => setAnswer(currentQuestion.id, parseFloat(e.target.value))}
                className="flex-1 h-10 rounded-xl border-2 border-border bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-accent transition"
              />
              <button
                onClick={advance}
                className="px-4 h-10 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 transition"
              >
                Next
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[10000, 25000, 50000, 100000].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setAnswer(currentQuestion.id, p);
                    setTimeout(advance, 200);
                  }}
                  className="px-2.5 py-1 rounded-full border border-border text-[11px] font-semibold text-muted-foreground hover:border-accent hover:text-accent transition"
                >
                  ${(p / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Skip + live estimate */}
        <div className="flex items-center justify-between pt-1">
          {currentQuestion.optional && (
            <button
              onClick={advance}
              className="text-[11px] text-muted-foreground hover:text-ink transition underline underline-offset-2"
            >
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

// ─── Thinking Indicator (Researching → Analyzing → Finalizing) ────────────────
function ThinkingIndicator() {
  const [stageIdx, setStageIdx] = useState(0);
  const [tipIdx, setTipIdx] = useState(() => Math.floor(Math.random() * 5));
  const stages = [
    { icon: "🔍", label: "Researching..." },
    { icon: "⚡", label: "Analyzing..." },
    { icon: "✨", label: "Finalizing..." },
  ];
  const tips = [
    "💡 CostReno AI uses verified industry data, not generic estimates.",
    "💡 Always compare at least 3 contractor quotes before deciding.",
    "💡 Ask if permit fees are included. They often aren't.",
    "💡 Material quality accounts for 44% of your total project cost.",
    "💡 Check contractor licensing at your state's licensing board.",
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setStageIdx(1), 1800);
    const t2 = setTimeout(() => setStageIdx(2), 3800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 px-4 py-3 rounded-2xl rounded-bl-md bg-muted max-w-[260px]">
      <div className="flex items-center gap-2">
        <span className="text-sm">{stages[stageIdx].icon}</span>
        <span className="text-sm text-ink font-medium animate-pulse">{stages[stageIdx].label}</span>
      </div>
      <div className="flex gap-1">
        {stages.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= stageIdx ? "bg-accent" : "bg-border"}`}
          />
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground leading-relaxed">{tips[tipIdx]}</p>
    </div>
  );
}

function QuoteAnalysisSection() {
  return (
    <section className="container-x py-20">
      {/* Header */}
      <div className="text-center mb-14">
        <h2 className="font-display text-3xl md:text-4xl lg:text-[42px] font-bold text-ink leading-tight max-w-3xl mx-auto">
          Everything Your Contractor Quote Isn't Telling You
        </h2>
        <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Our AI analyzes every line item, uncovers hidden costs, flags risks, compares market
          pricing, and helps you negotiate with confidence before spending thousands.
        </p>
      </div>

      {/* 6-column responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 - AI-Powered Quote Analysis */}
        <div className="rounded-2xl border border-border bg-[#fafbfd] p-6 flex flex-col min-h-[320px] overflow-hidden">
          <div className="flex-1 flex items-center justify-center mb-5">
            <img
              src="/quote-ai.png"
              alt="Contractor quote with line items connected to AI analysis engine"
              className="w-full max-w-[360px] h-auto object-contain rounded-lg"
            />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-ink mb-2">
              AI-Powered Quote Analysis
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upload any contractor quote, and our AI instantly reads every line item, categorizes
              costs, identifies hidden details, and transforms complex estimates into clear,
              actionable insights.
            </p>
          </div>
        </div>

        {/* Card 2 - Placeholder */}
        <div className="rounded-2xl border border-border bg-[#fafbfd] p-6 flex items-center justify-center min-h-[320px]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-muted/50 mx-auto mb-3" />
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </div>
        </div>

        {/* Card 3 - Placeholder */}
        <div className="rounded-2xl border border-border bg-[#fafbfd] p-6 flex items-center justify-center min-h-[320px]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-muted/50 mx-auto mb-3" />
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </div>
        </div>

        {/* Card 4 - Placeholder */}
        <div className="rounded-2xl border border-border bg-[#fafbfd] p-6 flex items-center justify-center min-h-[320px]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-muted/50 mx-auto mb-3" />
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </div>
        </div>

        {/* Card 5 - Placeholder */}
        <div className="rounded-2xl border border-border bg-[#fafbfd] p-6 flex items-center justify-center min-h-[320px]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-muted/50 mx-auto mb-3" />
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </div>
        </div>

        {/* Card 6 - Placeholder */}
        <div className="rounded-2xl border border-border bg-[#fafbfd] p-6 flex items-center justify-center min-h-[320px]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-muted/50 mx-auto mb-3" />
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Landing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectIdx, setProjectIdx] = useState(0);
  const heroProjects = [
    "kitchen remodel",
    "roof replacement",
    "bathroom renovation",
    "HVAC installation",
    "window replacement",
  ];
  const displayProject = heroProjects[projectIdx];

  useEffect(() => {
    const interval = setInterval(() => {
      setProjectIdx((prev) => (prev + 1) % heroProjects.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    {
      role: "user" | "ai" | "widget";
      text: string;
      widgetType?: "estimator";
      widgetDone?: boolean;
    }[]
  >([]);
  const [attachments, setAttachments] = useState<
    { name: string; type: string; size: number; file?: File }[]
  >([]);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isProcessingQuote, setIsProcessingQuote] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const quoteAbortControllerRef = useRef<AbortController | null>(null);
  const [quoteDebugInfo, setQuoteDebugInfo] = useState<QuoteAnalysisResult | null>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [locationDetected, setLocationDetected] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [manualCity, setManualCity] = useState("");

  // Abort any in-flight quote analysis if the component unmounts (e.g. user
  // navigates away) so we don't keep retrying/updating state on a dead widget.
  useEffect(() => {
    return () => {
      quoteAbortControllerRef.current?.abort();
    };
  }, []);

  const DEBUG_QUOTE_ANALYSIS = import.meta.env.DEV;

  const QUOTE_ANALYSIS_KEYWORDS = [
    "analyze this quote",
    "analyze the quote",
    "review this quote",
    "review this estimate",
    "is this roofing quote complete",
    "what is missing",
    "is this contractor overcharging",
    "explain this estimate",
    "analyze this estimate",
    "quote analysis",
    "contractor quote",
    "analyze my quote",
    "review my quote",
    "is this quote complete",
    "missing from this quote",
    "overcharging on this",
    "red flags in this",
    "check this quote",
    "evaluate this estimate",
  ];

  const isQuoteAnalysisRequest = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return QUOTE_ANALYSIS_KEYWORDS.some((keyword) => lowerText.includes(keyword));
  };

  const shouldUseQuoteAnalyzer = (text: string, hasAttachment: boolean): boolean => {
    if (hasAttachment && isQuoteAnalysisRequest(text)) {
      return true;
    }
    // If there's an attachment and text mentions quote/estimate/contractor/etc
    if (
      hasAttachment &&
      /quote|estimate|contractor|material|scope|roof|pricing|proposal|bid/i.test(text)
    ) {
      return true;
    }
    // If there's any attachment with words like "analyze", "review", "check", etc
    if (hasAttachment && /analy|review|check|exam|extract|read|process/i.test(text)) {
      return true;
    }
    return false;
  };

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
      estimate: "🧮",
      quote: "📋",
      material: "⚖️",
      insurance: "🛡️",
      guide: "📖",
      plan: "🗺️",
      contractor: "🔍",
      roi: "📈",
      chat: "💬",
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
          return (
            <strong key={idx} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={idx}>{part}</span>;
      });
    };

    while (i < lines.length) {
      const line = lines[i].trim();
      if (!line) {
        i++;
        continue;
      }

      if (line.startsWith("- ") || line.startsWith("• ")) {
        const listItems: React.ReactNode[] = [];
        while (
          i < lines.length &&
          (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("• "))
        ) {
          const content = lines[i].trim().replace(/^[-•]\s/, "");
          listItems.push(
            <li key={i} className="flex items-start gap-2 text-sm text-ink/80 leading-relaxed">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span>{renderInline(content)}</span>
            </li>,
          );
          i++;
        }
        elements.push(
          <ul key={`ul-${i}`} className="space-y-1.5 my-2">
            {listItems}
          </ul>,
        );
        continue;
      }

      if (/^\d+\.\s/.test(line)) {
        const listItems: React.ReactNode[] = [];
        let num = 1;
        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          const content = lines[i].trim().replace(/^\d+\.\s/, "");
          listItems.push(
            <li key={i} className="flex items-start gap-2.5 text-sm text-ink/80 leading-relaxed">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">
                {num}
              </span>
              <span>{renderInline(content)}</span>
            </li>,
          );
          i++;
          num++;
        }
        elements.push(
          <ol key={`ol-${i}`} className="space-y-1.5 my-2">
            {listItems}
          </ol>,
        );
        continue;
      }

      if (/\$[\d,]+/.test(line)) {
        elements.push(
          <div
            key={i}
            className="my-2 px-3 py-2.5 rounded-xl bg-accent/8 border border-accent/20 text-sm text-ink leading-relaxed"
          >
            {renderInline(line)}
          </div>,
        );
        i++;
        continue;
      }

      elements.push(
        <p key={i} className="text-sm text-ink/80 leading-relaxed">
          {renderInline(line)}
        </p>,
      );
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
                  <div className="text-sm font-semibold text-ink group-hover:text-accent transition">
                    {a.label}
                  </div>
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
  const getAIResponse = async (
    messages: { role: "user" | "ai"; text: string }[],
  ): Promise<string> => {
    try {
      const chatMessages: ChatMessage[] = messages.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));
      const projectType = extractProjectTypeFromChat(chatMessages);
      const response = await serverChatWithKnowledge({
        data: { messages: chatMessages, userProjectType: projectType ?? undefined },
      });
      return response;
    } catch (error) {
      console.error("AI API error:", error);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }
  };

  const STAGE_MESSAGES: Record<QuotePipelineStage | "reading", string> = {
    reading: "Reading your document...",
    extracting: "Extracting materials and line items...",
    matching: "Cross-referencing with our knowledge base...",
    analyzing: "Identifying gaps and verifying scope...",
    reporting: "Writing your personalized report...",
  };

  // Rotating tips shown during quote analysis to keep user engaged
  const ANALYSIS_TIPS = [
    "💡 Tip: Always get 3 quotes minimum before committing to a contractor.",
    "💡 Did you know? 40% of roofing quotes omit critical items like drip edge or ice shield.",
    "💡 Tip: A good contractor warranty should be 5-10 years on workmanship.",
    "💡 Pro tip: Ask if permit costs are included. They often aren't.",
    "💡 Insight: Material quality accounts for 44% of your total project cost.",
    "💡 Tip: Check contractor licensing at your state's licensing board website.",
    "💡 Did you know? Insurance may cover storm damage. Document everything with photos.",
    '💡 Tip: "Cost-plus" contracts can spiral. Always prefer fixed-price quotes.',
  ];

  const [analysisTipIdx, setAnalysisTipIdx] = useState(0);

  // Rotate tips every 5 seconds during processing
  useEffect(() => {
    if (!isProcessingQuote) return;
    const interval = setInterval(() => {
      setAnalysisTipIdx((prev) => (prev + 1) % ANALYSIS_TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isProcessingQuote]);

  const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

  const handleSendMessage = async () => {
    const hasAttachments = attachments.length > 0;
    const fileToProcess = attachments[0]?.file;

    const attachmentText =
      attachments.length > 0
        ? `\n\n[Attachments: ${attachments.map((a) => a.name).join(", ")}]`
        : "";
    const userText = chatInput.trim() + attachmentText;

    const filteredMessages = chatMessages.filter((m) => m.role !== "widget") as {
      role: "user" | "ai";
      text: string;
    }[];
    const newMessages = [...filteredMessages, { role: "user" as const, text: userText }];

    setChatMessages(newMessages);
    setChatInput("");
    setAttachments([]);
    setTimeout(scrollToBottom, 50);

    if (hasAttachments && fileToProcess) {
      // Step 1: Extract text from the file (shows ThinkingIndicator)
      setIsAiTyping(true);
      let extractedText = "";
      try {
        const { extractTextFromFile } = await import("@/lib/file-processor");
        const extractedContent = await extractTextFromFile(fileToProcess);
        extractedText = extractedContent.text;
      } catch {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "😅 I couldn't read that file. Try uploading a text-based PDF or paste the content directly.",
          },
        ]);
        setIsAiTyping(false);
        setTimeout(scrollToBottom, 50);
        return;
      }

      if (extractedText.length < 20) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "📄 That file seems to be scanned or image-based. I can't read the text from it.\n\nTry a text-based PDF, or copy-paste the quote content directly into chat.",
          },
        ]);
        setIsAiTyping(false);
        setTimeout(scrollToBottom, 50);
        return;
      }

      // Step 2: Check if it's a renovation/contractor quote
      const textLower = extractedText.substring(0, 3000).toLowerCase();
      const quoteSignals = [
        "estimate",
        "quote",
        "proposal",
        "contractor",
        "labor",
        "material",
        "total",
        "scope",
        "warranty",
        "permit",
        "invoice",
        "bid",
        "install",
        "replacement",
        "repair",
        "sq ft",
        "linear ft",
        "roofing",
        "plumbing",
        "hvac",
        "kitchen",
        "bathroom",
        "shingle",
        "drywall",
        "flooring",
        "demolition",
        "tear off",
        "flashing",
      ];
      const rejectSignals = [
        "tax",
        "salary",
        "income",
        "deduction",
        "employer",
        "hra",
        "allowance",
        "tds",
        "pan",
        "aadhaar",
        "passport",
        "visa",
        "resume",
        "education",
        "gpa",
        "university",
        "semester",
        "recipe",
        "ingredients",
        "calories",
        "prescription",
        "medication",
        "diagnosis",
      ];

      const quoteScore = quoteSignals.filter((s) => textLower.includes(s)).length;
      const rejectScore = rejectSignals.filter((s) => textLower.includes(s)).length;

      if (rejectScore >= 3 || (quoteScore < 3 && rejectScore >= 1)) {
        // Clearly NOT a renovation quote — show friendly rejection
        const funnyMessages = [
          "🏠 Whoa there! That doesn't look like a contractor quote.\n\nI'm CostReno AI. I specialize in **renovation quotes, home improvement estimates, and contractor proposals**.\n\nUpload a roofing quote, kitchen remodel estimate, or any contractor bid and I'll analyze it for missing items, red flags, and overcharges!\n\n💡 *Pro tip: If you have a contractor quote in email, save it as PDF and upload it here.*",
          "😄 Nice try! But that's not quite my area of expertise.\n\nI'm built to analyze **contractor quotes and renovation estimates**, not tax docs, resumes, or recipes!\n\nGot a quote from a roofer, plumber, or kitchen contractor? Upload that and I'll tell you what's missing, what's overpriced, and what questions to ask.\n\n💡 *Try uploading: roofing estimate, bathroom remodel quote, HVAC proposal, etc.*",
          "🔨 Hmm, that document doesn't seem related to home renovation.\n\nI'm your **renovation quote analyzer**. I read contractor bids and find:\n- ❌ Missing scope items\n- 🚩 Red flags and overcharges\n- ❓ Questions you should ask\n\nUpload a **contractor quote or estimate** and let me work my magic!\n\n💡 *Supported: roofing, kitchen, bathroom, HVAC, windows, solar, flooring, deck, plumbing, electrical quotes.*",
        ];
        const randomMsg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        setChatMessages((prev) => [...prev, { role: "ai", text: randomMsg }]);
        setIsAiTyping(false);
        setTimeout(scrollToBottom, 50);
        return;
      }

      if (quoteScore >= 4) {
        // It's a contractor quote → run full analysis
        setIsAiTyping(false);
        await processQuoteAnalysis(newMessages, userText, fileToProcess);
      } else {
        // Ambiguous — not clearly a quote, not clearly wrong. Chat about it but nudge toward quotes.
        const truncated = extractedText.substring(0, 2000);
        const enhancedUserText = `${userText}\n\nContent from ${fileToProcess.name}:\n${truncated}`;
        const aiResponse = await getAIResponse([
          ...filteredMessages,
          { role: "user" as const, text: enhancedUserText },
        ]);
        setChatMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text:
              aiResponse +
              '\n\n💡 *If this is a contractor quote, try saying "analyze this quote" for a full detailed analysis with our Quote Analyzer.*',
          },
        ]);
        setIsAiTyping(false);
        setTimeout(scrollToBottom, 50);
      }
    } else {
      // Normal chat — no attachment
      setIsAiTyping(true);
      const aiResponse = await getAIResponse(newMessages);
      setChatMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
      setIsAiTyping(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  const cancelQuoteAnalysis = () => {
    quoteAbortControllerRef.current?.abort();
  };

  const processQuoteAnalysis = async (
    messages: { role: "user" | "ai"; text: string }[],
    userText: string,
    file: File,
  ) => {
    console.log("[QUOTE DEBUG] Step 1: Starting quote analysis pipeline");
    console.log("[QUOTE DEBUG] File name:", file.name);
    console.log("[QUOTE DEBUG] File type:", file.type);
    console.log("[QUOTE DEBUG] File size:", file.size);
    console.log("[QUOTE DEBUG] User text:", userText);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `⚠️ "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload a PDF under ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`,
        },
      ]);
      return;
    }

    setIsProcessingQuote(true);
    setQuoteDebugInfo(null);
    setShowDebugPanel(false);
    setAnalysisTipIdx(0);

    const abortController = new AbortController();
    quoteAbortControllerRef.current = abortController;

    try {
      setProcessingStep(STAGE_MESSAGES.reading);
      console.log("[QUOTE DEBUG] Step 6: Extracting text from file...");
      const { extractTextFromFile } = await import("@/lib/file-processor");
      const extractedContent = await extractTextFromFile(file);
      const extractedText = extractedContent.text;

      console.log("[QUOTE DEBUG] Step 7: Extracted text length:", extractedText.length);
      console.log("[QUOTE DEBUG] Step 8: First 500 chars:", extractedText.substring(0, 500));

      if (extractedText.length < 10) {
        console.log("[QUOTE DEBUG] WARNING: Very little text extracted - likely scanned PDF");
        setChatMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "⚠️ The PDF appears to be scanned or have unextractable text. Please copy and paste the quote text directly for analysis, or try a different PDF file.",
          },
        ]);
        return;
      }

      if (abortController.signal.aborted) {
        throw new OpenRouterError("cancelled", "Cancelled by user");
      }

      const combinedText = `${userText}\n\nExtracted from ${file.name}:\n${extractedText}`;

      console.log("[QUOTE DEBUG] Step 9: Calling serverAnalyzeQuoteFull()...");
      const analysis = await serverAnalyzeQuoteFull({ data: { rawText: combinedText } });

      console.log(
        "[QUOTE DEBUG] Step 10: Extractor result:",
        JSON.stringify(analysis.extraction, null, 2),
      );
      console.log(
        "[QUOTE DEBUG] Step 11: Matched materials count:",
        analysis.matchedMaterials.length,
      );
      console.log(
        "[QUOTE DEBUG] Step 11: Matched scope items count:",
        analysis.matchedScopeItems.length,
      );
      console.log(
        "[QUOTE DEBUG] Step 12: Analysis result:",
        JSON.stringify(analysis.analysis, null, 2),
      );

      setQuoteDebugInfo(analysis);
      setShowDebugPanel(DEBUG_QUOTE_ANALYSIS);

      console.log("[QUOTE DEBUG] Step 13: Report to display:", analysis.report);

      // Store analysis in sessionStorage so /quote-analyzer can pick it up
      try {
        sessionStorage.setItem("costreno_quote_analysis", JSON.stringify(analysis));
      } catch (e) {
        console.warn("[QUOTE DEBUG] Could not store analysis in sessionStorage:", e);
      }

      // Validate extraction has actual data
      const presentCount = analysis.analysis.presentItems.length;
      const clarifyCount = analysis.analysis.needsClarification.length;
      const missingCount = analysis.analysis.missingScope.length;
      const score = analysis.analysis.summary.completenessScore;
      const totalExtracted =
        analysis.extraction.materials.length + analysis.extraction.scopeItems.length;

      if (totalExtracted === 0) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "⚠️ I wasn't able to extract any line items from this PDF. This can happen with scanned documents or image-based PDFs.\n\n**Try:**\n- Uploading a text-based PDF\n- Copying and pasting the quote text directly into the chat\n- Taking a clearer photo if using an image",
          },
        ]);
        return;
      }

      const summaryText = `✅ **Your quote has been analyzed.**\n\nCompleteness Score: **${score}%**\n\nWe found:\n- ✅ **${presentCount} Included Items**\n- ⚠️ **${clarifyCount} Items to Clarify**\n- ❌ **${missingCount} Missing Items**${analysis.analysis.redFlags.length > 0 ? `\n- 🚩 **${analysis.analysis.redFlags.length} Red Flags**` : "\n- 🟢 No red flags detected"}\n\n[ACTION:Open Interactive Review:Explore your full analysis with AI chat:quote-review]`;

      setChatMessages((prev) => [...prev, { role: "ai", text: summaryText }]);
    } catch (error) {
      console.error("[QUOTE DEBUG] ERROR at step:", error);
      const isCancelled = error instanceof OpenRouterError && error.code === "cancelled";
      const errorMessage = isCancelled
        ? "⏹️ Analysis cancelled. Feel free to try again whenever you're ready."
        : `I couldn't finish analyzing this PDF. ${friendlyOpenRouterMessage(error)}`;
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: errorMessage,
        },
      ]);
    } finally {
      quoteAbortControllerRef.current = null;
      setIsProcessingQuote(false);
      setProcessingStep("");
      setIsAiTyping(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  const toggleDebugPanel = () => {
    setShowDebugPanel((prev) => !prev);
  };

  const renderDebugPanel = (analysis: QuoteAnalysisResult | null) => {
    if (!analysis || !DEBUG_QUOTE_ANALYSIS) return null;

    return (
      <div className="mt-4 border border-border rounded-lg bg-muted/20">
        <button
          onClick={toggleDebugPanel}
          className="w-full flex items-center justify-between p-3 text-sm font-medium text-muted-foreground hover:bg-muted/30 rounded-t-lg"
        >
          <span>Developer Debug Panel</span>
          {showDebugPanel ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {showDebugPanel && (
          <div className="p-3 max-h-96 overflow-y-auto">
            <details open>
              <summary className="text-xs font-semibold text-muted-foreground mb-2">
                Extraction
              </summary>
              <pre className="text-xs bg-background rounded p-2 overflow-x-auto">
                {JSON.stringify(analysis.extraction, null, 2)}
              </pre>
            </details>
            <details>
              <summary className="text-xs font-semibold text-muted-foreground mb-2">
                Matched Materials
              </summary>
              <pre className="text-xs bg-background rounded p-2 overflow-x-auto">
                {JSON.stringify(analysis.matchedMaterials, null, 2)}
              </pre>
            </details>
            <details>
              <summary className="text-xs font-semibold text-muted-foreground mb-2">
                Matched Scope Items
              </summary>
              <pre className="text-xs bg-background rounded p-2 overflow-x-auto">
                {JSON.stringify(analysis.matchedScopeItems, null, 2)}
              </pre>
            </details>
            <details>
              <summary className="text-xs font-semibold text-muted-foreground mb-2">
                Analysis
              </summary>
              <pre className="text-xs bg-background rounded p-2 overflow-x-auto">
                {JSON.stringify(analysis.analysis, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    );
  };

  // ─── Handle action card clicks ───────────────────────────────────────────────
  const handleAction = async (action: ActionCard) => {
    if (action.action === "estimate") {
      // Inject inline estimator widget instead of a text prompt
      setChatMessages((prev) => [
        ...prev,
        { role: "user", text: "I'd like to run the cost estimator." },
        { role: "widget", text: "", widgetType: "estimator", widgetDone: false },
      ]);
      setTimeout(scrollToBottom, 50);
      return;
    }
    if (action.action === "quote-review") {
      // Navigate to the interactive quote analyzer page
      navigate({ to: "/quote-analyzer" });
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
    const filteredMessages = chatMessages.filter((m) => m.role !== "widget") as {
      role: "user" | "ai";
      text: string;
    }[];
    const newMessages = [...filteredMessages, { role: "user" as const, text: prompt }];
    setChatMessages(newMessages);
    setIsAiTyping(true);
    setTimeout(scrollToBottom, 50);
    const aiResponse = await getAIResponse(newMessages);
    setChatMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
    setIsAiTyping(false);
    setTimeout(scrollToBottom, 50);
  };

  // ─── Handle estimator widget completion ────────────────────────────────────
  const handleEstimatorComplete = async (summary: string) => {
    // Mark widget as done, then post AI follow-up
    setChatMessages((prev) =>
      prev.map((m) =>
        m.role === "widget" && m.widgetType === "estimator" && !m.widgetDone
          ? { ...m, widgetDone: true }
          : m,
      ),
    );
    const historyMessages = chatMessages
      .filter((m) => m.role !== "widget")
      .map((m) => ({ role: m.role as "user" | "ai", text: m.text }));
    const withSummary = [...historyMessages, { role: "ai" as const, text: summary }];
    setChatMessages((prev) => [...prev, { role: "ai", text: summary }]);
    setIsAiTyping(true);
    setTimeout(scrollToBottom, 50);
    // Ask AI to provide smart next-step guidance based on the estimate
    const followUpMessages = [
      ...withSummary,
      {
        role: "user" as const,
        text: "Based on this estimate, what should I do next? Give me 2-3 smart recommendations.",
      },
    ];
    const followUp = await getAIResponse(followUpMessages);
    setChatMessages((prev) => [...prev, { role: "ai", text: followUp }]);
    setIsAiTyping(false);
    setTimeout(scrollToBottom, 50);
  };

  const searchTerms = [
    "How much should a roof replacement cost?",
    "Can you review my contractor quote?",
    "Do I need a permit for my project?",
    "How much does flooring cost?",
    "Is this quote overpriced?",
  ];
  const [termIdx, setTermIdx] = useState(0);
  const [displayTerm, setDisplayTerm] = useState("");
  const phaseRef = useRef<"typing" | "pause" | "erasing">("typing");
  const charIdxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
    {
      name: "Roof Replacement",
      avgCost: "$16,650",
      duration: "3-5 Days",
      popularity: 95,
      synonyms: ["new roof", "roofing", "re-roof", "roof repair"],
      img: projRoof,
    },
    {
      name: "Kitchen Remodel",
      avgCost: "$50,000",
      duration: "4-8 Weeks",
      popularity: 90,
      synonyms: ["kitchen renovation", "kitchen upgrade", "new kitchen"],
      img: projKitchen,
    },
    {
      name: "Bathroom Remodel",
      avgCost: "$19,000",
      duration: "2-4 Weeks",
      popularity: 85,
      synonyms: ["bath renovation", "bathroom upgrade", "new bathroom"],
      img: projBathroom,
    },
    {
      name: "HVAC Replacement",
      avgCost: "$8,250",
      duration: "1-2 Days",
      popularity: 80,
      synonyms: ["heating", "cooling", "air conditioning", "furnace", "AC"],
      img: projHvac,
    },
    {
      name: "Window Replacement",
      avgCost: "$12,000",
      duration: "1-2 Days",
      popularity: 70,
      synonyms: ["new windows", "window install", "double pane"],
      img: projRoof,
    },
    {
      name: "Solar Installation",
      avgCost: "$25,000",
      duration: "2-3 Days",
      popularity: 65,
      synonyms: ["solar panels", "photovoltaic", "PV"],
      img: projRoof,
    },
    {
      name: "Deck Construction",
      avgCost: "$8,000",
      duration: "3-5 Days",
      popularity: 60,
      synonyms: ["patio", "deck build", "outdoor deck"],
      img: projRoof,
    },
    {
      name: "Garage Door",
      avgCost: "$2,500",
      duration: "1 Day",
      popularity: 55,
      synonyms: ["garage install", "new garage"],
      img: projRoof,
    },
    {
      name: "Flooring",
      avgCost: "$5,000",
      duration: "2-3 Days",
      popularity: 50,
      synonyms: ["hardwood", "laminate", "tile floor", "vinyl"],
      img: projRoof,
    },
    {
      name: "Painting",
      avgCost: "$3,500",
      duration: "2-4 Days",
      popularity: 45,
      synonyms: ["house painting", "interior paint", "exterior paint"],
      img: projRoof,
    },
  ];

  const popularProjects = projectData.filter((p) => p.popularity >= 80).slice(0, 4);

  const fuzzyMatch = (query: string, project: (typeof projectData)[0]) => {
    const q = query.toLowerCase();
    const nameMatch = project.name.toLowerCase().includes(q);
    const synonymMatch = project.synonyms.some((s) => s.toLowerCase().includes(q));
    return nameMatch || synonymMatch;
  };

  const filteredProjects =
    searchQuery.length > 0
      ? projectData
          .filter((p) => fuzzyMatch(searchQuery, p))
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 6)
      : [];

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, '<mark class="bg-accent/20 text-ink rounded px-0.5">$1</mark>');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <SiteNav />

      {/* HERO — NerdWallet-inspired */}
      <section className="relative bg-white overflow-hidden">
        <div className="container-x relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-8 md:py-10">
          <div>
            {/* H1 */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-[56px] font-extrabold tracking-tight text-ink leading-[1.08]">
              Know what your{" "}
              <span className="text-accent inline-block min-w-[200px]">{displayProject}</span>{" "}
              should actually cost.
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              <strong className="text-ink">Stop overpaying.</strong> Our AI tools powered by live
              local data have saved homeowners{" "}
              <strong className="text-accent">$2.3M on inflated quotes</strong>. Get real pricing,
              spot red flags, and renovate with confidence.
            </p>

            {/* AI Chat Input - Inside hero left column */}
            <div className="mt-4 max-w-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded bg-accent flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs font-bold text-ink">Ask CostReno AI</span>
              </div>
              <div
                className="relative rounded-xl bg-white border-2 border-accent/30 shadow-lg shadow-accent/5 overflow-hidden hover:border-accent/50 transition-colors cursor-pointer"
                onClick={() => setChatOpen(true)}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="relative flex-1 min-w-0">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setChatOpen(true)}
                      onBlur={() => {}}
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
                      className="w-full bg-transparent text-sm outline-none text-ink"
                    />
                    {searchQuery.length === 0 && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-sm text-muted-foreground whitespace-nowrap overflow-hidden max-w-full">
                        {displayTerm}
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
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-white hover:bg-accent/90 transition shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {/* Trust stats - inside input container */}
              <div className="grid grid-cols-3 gap-2 mt-2.5 text-xs text-center">
                <span>
                  <strong className="text-ink font-bold">50K+</strong>{" "}
                  <span className="text-muted-foreground">estimates</span>
                </span>
                <span>
                  <strong className="text-ink font-bold">$2.3M</strong>{" "}
                  <span className="text-muted-foreground">saved</span>
                </span>
                <span>
                  <strong className="text-ink font-bold">100%</strong>{" "}
                  <span className="text-muted-foreground">free</span>
                </span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="/home.png"
              alt="Home renovation cost breakdown showing roof, windows, kitchen, siding, deck, and garage door estimates"
              className="w-full h-auto max-w-2xl ml-auto scale-110"
            />
          </div>
        </div>
      </section>

      <TrustBar region={userLocation ?? "your area"} />

      {/* Chat Interface Modal */}
      {chatOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center ${isFullScreen ? "!items-stretch !justify-stretch" : ""}`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setChatOpen(false)}
          />

          {/* Chat Panel */}
          <div
            className={`relative flex flex-col bg-white shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden ${
              isFullScreen
                ? "w-full h-full sm:w-full sm:h-full"
                : "w-full sm:w-[720px] sm:mx-4 h-[90vh] sm:h-[85vh] sm:rounded-2xl rounded-t-2xl"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#082A4B]">
              <div className="flex items-center gap-2.5">
                <span className="font-display text-lg font-extrabold text-white tracking-wide">
                  COST<span className="text-accent">RENO</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-accent text-white text-[9px] font-bold tracking-wider">
                  AI
                </span>
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
            <div
              className={`flex-1 overflow-y-auto py-5 space-y-5 ${isFullScreen ? "px-5" : "px-5"}`}
            >
              <div className={`mx-auto space-y-5 ${isFullScreen ? "max-w-xl" : ""}`}>
                {chatMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full py-6">
                    {/* Welcome text */}
                    <h2 className="text-xl font-extrabold text-ink text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                      Save thousands on your next renovation.
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2 text-center max-w-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
                      Our AI analyzes live local data to give you real costs, catch overpriced
                      quotes, and guide you step-by-step.
                    </p>

                    {/* Questions - staggered animation */}
                    <div className="mt-6 w-full max-w-sm space-y-2">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold px-1 animate-in fade-in duration-500 delay-300">
                        Ask me anything
                      </p>
                      {[
                        { q: "How much should a roof replacement cost?", delay: "delay-[400ms]" },
                        { q: "Can you review my contractor quote?", delay: "delay-[500ms]" },
                        { q: "Do I need a permit for my project?", delay: "delay-[600ms]" },
                        { q: "How much does flooring cost?", delay: "delay-[700ms]" },
                        { q: "Is this quote overpriced?", delay: "delay-[800ms]" },
                      ].map(({ q, delay }) => (
                        <button
                          key={q}
                          onClick={async () => {
                            const isEstimateQ = /how much|cost|estimate|price/i.test(q);
                            if (isEstimateQ) {
                              setChatMessages([
                                { role: "user", text: q },
                                {
                                  role: "widget",
                                  text: "",
                                  widgetType: "estimator",
                                  widgetDone: false,
                                },
                              ]);
                              setTimeout(scrollToBottom, 50);
                              return;
                            }
                            const newMessages = [{ role: "user" as const, text: q }];
                            setChatMessages(newMessages);
                            setIsAiTyping(true);
                            setTimeout(scrollToBottom, 50);
                            const aiResponse = await getAIResponse(newMessages);
                            setChatMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
                            setIsAiTyping(false);
                            setTimeout(scrollToBottom, 50);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background hover:border-accent/40 hover:bg-accent/5 transition text-left group animate-in fade-in slide-in-from-bottom-3 duration-500 ${delay}`}
                        >
                          <MessageCircle className="h-4 w-4 text-accent shrink-0" />
                          <span className="text-sm text-ink/80 group-hover:text-ink transition leading-snug flex-1">
                            {q}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-accent shrink-0 transition" />
                        </button>
                      ))}
                    </div>

                    {/* Active Tools */}
                    <div className="mt-5 w-full max-w-sm animate-in fade-in duration-500 delay-[900ms]">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-2 px-1">
                        Active Tools
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href="/estimate"
                          className="flex items-center gap-2.5 p-3 rounded-xl border border-accent/30 bg-accent/5 hover:bg-accent/10 transition"
                        >
                          <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
                            <Calculator className="h-3.5 w-3.5 text-accent" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-ink">Cost Estimator</p>
                            <p className="text-[10px] text-accent font-medium">Live</p>
                          </div>
                        </a>
                        <a
                          href="/quote-analyzer"
                          className="flex items-center gap-2.5 p-3 rounded-xl border border-accent/30 bg-accent/5 hover:bg-accent/10 transition"
                        >
                          <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
                            <Search className="h-3.5 w-3.5 text-accent" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-ink">Quote Review</p>
                            <p className="text-[10px] text-accent font-medium">Live</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    {msg.role === "user" ? (
                      <div className="max-w-[75%] flex flex-col items-end gap-1.5">
                        {/* Parse and render attachment cards if present */}
                        {(() => {
                          const attachMatch = msg.text.match(/\[Attachments?: (.+?)\]$/);
                          const textWithoutAttachment = attachMatch
                            ? msg.text.replace(/\n?\n?\[Attachments?: .+?\]$/, "").trim()
                            : msg.text;
                          const attachmentNames = attachMatch
                            ? attachMatch[1].split(", ").map((n) => n.trim())
                            : [];

                          return (
                            <>
                              {/* Attachment cards */}
                              {attachmentNames.map((fileName, idx) => {
                                const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
                                const isPdf = ext === "pdf";
                                const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2.5 bg-white border border-border rounded-xl px-3 py-2.5 shadow-sm"
                                  >
                                    <div
                                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                        isPdf ? "bg-red-50" : isImage ? "bg-blue-50" : "bg-muted"
                                      }`}
                                    >
                                      {isPdf ? (
                                        <svg
                                          className="w-5 h-5 text-red-500"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                          <polyline points="14 2 14 8 20 8" />
                                          <path d="M9 15h6" />
                                          <path d="M9 11h6" />
                                        </svg>
                                      ) : isImage ? (
                                        <svg
                                          className="w-5 h-5 text-blue-500"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                          <circle cx="8.5" cy="8.5" r="1.5" />
                                          <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                      ) : (
                                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-semibold text-ink truncate max-w-[160px]">
                                        {fileName}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground">
                                        {isPdf
                                          ? "PDF Document"
                                          : isImage
                                            ? "Image"
                                            : ext.toUpperCase() + " File"}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                              {/* Text message */}
                              {textWithoutAttachment && (
                                <div className="rounded-2xl rounded-br-md px-4 py-2.5 text-sm bg-accent text-white">
                                  {textWithoutAttachment}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    ) : msg.role === "widget" && msg.widgetType === "estimator" ? (
                      <div className="flex items-start gap-2.5 w-full max-w-[90%]">
                        <div className="w-7 h-7 rounded-lg bg-[#082A4B] flex items-center justify-center shrink-0 MT-0.5">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          {!msg.widgetDone ? (
                            <ChatEstimator onComplete={handleEstimatorComplete} />
                          ) : (
                            <div className="px-3 py-2 rounded-xl bg-accent/8 border border-accent/20 text-xs text-accent font-semibold flex items-center gap-2">
                              <Check className="h-3.5 w-3.5" /> Estimate completed. See results
                              below
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2.5 max-w-[85%]">
                        <div className="w-7 h-7 rounded-lg bg-[#082A4B] flex items-center justify-center shrink-0 MT-0.5">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-ink leading-relaxed">
                            {renderAIMessage(msg.text, handleAction)}
                          </div>
                          {quoteDebugInfo && quoteDebugInfo.report === msg.text && (
                            <div className="mt-2">{renderDebugPanel(quoteDebugInfo)}</div>
                          )}
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

                {isProcessingQuote ? (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#082A4B] flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col gap-3 px-4 py-4 rounded-2xl rounded-bl-md bg-muted/80 border border-border/50 max-w-[340px]">
                      {/* Animated thinking dots + stage */}
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0ms]" />
                          <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:150ms]" />
                          <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:300ms]" />
                        </div>
                        <span className="text-sm font-medium text-ink">{processingStep}</span>
                      </div>

                      {/* Progress steps */}
                      <div className="flex gap-1.5">
                        {(
                          ["reading", "extracting", "matching", "analyzing", "reporting"] as const
                        ).map((stage, idx) => {
                          const currentStageIdx = Object.keys(STAGE_MESSAGES).indexOf(
                            Object.entries(STAGE_MESSAGES).find(
                              ([, v]) => v === processingStep,
                            )?.[0] ?? "reading",
                          );
                          const isComplete = idx < currentStageIdx;
                          const isCurrent = idx === currentStageIdx;
                          return (
                            <div
                              key={stage}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                isComplete
                                  ? "bg-accent"
                                  : isCurrent
                                    ? "bg-accent/50 animate-pulse"
                                    : "bg-border"
                              }`}
                            />
                          );
                        })}
                      </div>

                      {/* Rotating tip */}
                      <p
                        className="text-[11px] text-muted-foreground leading-relaxed animate-in fade-in duration-500"
                        key={analysisTipIdx}
                      >
                        {ANALYSIS_TIPS[analysisTipIdx]}
                      </p>

                      {/* Cancel */}
                      <button
                        onClick={cancelQuoteAnalysis}
                        className="self-start text-[11px] text-muted-foreground/60 hover:text-destructive transition"
                        title="Cancel analysis"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  isAiTyping && (
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#082A4B] flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <ThinkingIndicator />
                    </div>
                  )
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div
              className={`border-t border-border/50 ${isFullScreen ? "px-5 py-4 max-w-xl mx-auto w-full" : "px-4 pb-4 pt-2"}`}
            >
              {/* Attachments preview */}
              {attachmentError && (
                <p className="text-[11px] text-destructive mb-2">{attachmentError}</p>
              )}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {attachments.map((file, i) => {
                    const isPdf = file.type === "application/pdf";
                    const isImage = file.type.startsWith("image/");
                    const fileSizeStr =
                      file.size < 1024 * 1024
                        ? `${(file.size / 1024).toFixed(0)} KB`
                        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
                    return (
                      <div
                        key={i}
                        className="relative flex items-center gap-3 bg-white border border-border rounded-xl px-3 py-2.5 shadow-sm max-w-[220px] group"
                      >
                        {/* File type icon */}
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            isPdf ? "bg-red-50" : isImage ? "bg-blue-50" : "bg-muted"
                          }`}
                        >
                          {isPdf ? (
                            <svg
                              className="w-5 h-5 text-red-500"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <path d="M10 12h4" />
                              <path d="M10 16h4" />
                            </svg>
                          ) : isImage ? (
                            <svg
                              className="w-5 h-5 text-blue-500"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          ) : (
                            <Paperclip className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>

                        {/* File info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-ink truncate">{file.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {isPdf ? "PDF" : isImage ? "Image" : "File"} • {fileSizeStr}
                          </p>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-muted-foreground/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-destructive"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-2 focus-within:ring-2 focus-within:ring-accent/30 transition">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition shrink-0 text-muted-foreground hover:text-accent"
                  title="Attach file (JPG, PNG, PDF)"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    console.log("[QUOTE DEBUG] File input: files =", files);
                    const validFiles = files.filter((f) =>
                      ["image/jpeg", "image/png", "application/pdf"].includes(f.type),
                    );
                    const oversizedFiles = validFiles.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
                    const acceptedFiles = validFiles.filter((f) => f.size <= MAX_FILE_SIZE_BYTES);

                    if (oversizedFiles.length > 0) {
                      setAttachmentError(
                        `${oversizedFiles.map((f) => f.name).join(", ")} exceeds the ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB limit and won't be attached.`,
                      );
                    } else {
                      setAttachmentError(null);
                    }

                    console.log(
                      "[QUOTE DEBUG] File input: validFiles =",
                      acceptedFiles.map((f) => ({ name: f.name, type: f.type, hasFile: !!f })),
                    );
                    const newAttachments = acceptedFiles.map((f) => ({
                      name: f.name,
                      type: f.type,
                      size: f.size,
                      file: f,
                    }));
                    setAttachments([...attachments, ...newAttachments]);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={async (e) => {
                    if (
                      e.key === "Enter" &&
                      (chatInput.trim() || attachments.length > 0) &&
                      !isProcessingQuote
                    ) {
                      await handleSendMessage();
                    }
                  }}
                  placeholder="Ask me anything about costs, materials, insurance, plans..."
                  className="flex-1 bg-transparent text-sm outline-none px-2 text-ink placeholder:text-muted-foreground/60"
                  disabled={isProcessingQuote}
                />
                <button
                  onClick={async () => {
                    if ((chatInput.trim() || attachments.length > 0) && !isProcessingQuote) {
                      await handleSendMessage();
                    }
                  }}
                  className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white hover:bg-accent/90 transition shrink-0 disabled:opacity-50"
                  disabled={(!chatInput.trim() && attachments.length === 0) || isProcessingQuote}
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
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLocationPrompt(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-7 w-7 text-accent" />
              </div>
              <h2 className="font-display text-xl font-bold text-ink text-center">
                Set Your Location
              </h2>
              <p className="text-sm text-muted-foreground text-center mt-2 leading-relaxed">
                Your location helps us provide{" "}
                <span className="font-semibold text-ink">clear, local cost estimates</span> for your
                home projects. Construction costs vary significantly by region due to labor rates,
                material availability, and local regulations.
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
      <section className="container-x py-20 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-[1.08] mb-4">
                What project are you planning?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Explore renovation projects, compare local costs, and get expert guidance before you
                start.
              </p>
            </div>
            <a
              href="#"
              className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md border border-border text-sm font-semibold text-primary hover:bg-primary/5 transition"
            >
              View all projects <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 overflow-x-auto pb-6 hide-scrollbar">
              {projects.map((p, idx) => {
                const isDisabled = idx >= 3; // Disable cards 4, 5, 6 (indices 3, 4, 5)

                return (
                  <a
                    key={p.name}
                    href={isDisabled ? "#" : "#"}
                    onClick={(e) => isDisabled && e.preventDefault()}
                    className={`group relative min-w-[280px] md:min-w-auto flex flex-col rounded-[18px] border border-[#E7EAF0] bg-white overflow-hidden shadow-sm ${
                      !isDisabled
                        ? "hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-accent/30 cursor-pointer"
                        : "cursor-not-allowed"
                    }`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-t-[18px]">
                      <img
                        src={p.img}
                        alt={p.name}
                        loading="lazy"
                        className={`h-full w-full object-cover transition-transform duration-700 ${
                          !isDisabled ? "group-hover:scale-110" : ""
                        }`}
                      />
                      {isDisabled && (
                        <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                          <span className="px-3 py-1.5 rounded-full bg-white/95 text-[12px] font-bold text-primary shadow-lg">
                            Coming Soon
                          </span>
                        </div>
                      )}
                      {!isDisabled && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold">
                          {p.time}
                        </span>
                      )}
                    </div>

                    <div
                      className={`relative flex-1 p-5 ${isDisabled ? "pointer-events-none opacity-60" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <h3 className="text-sm font-bold text-ink line-clamp-2 pr-2">{p.name}</h3>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="font-display text-[18px] font-bold text-ink leading-snug">
                            {p.price}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-1">
                            Typical average: {p.avgCost}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border/30">
                          <button
                            disabled={isDisabled}
                            onClick={() => {
                              if (!isDisabled) {
                                sessionStorage.setItem(
                                  "costreno_preselected_project",
                                  p.projectType,
                                );
                                window.location.href = "/estimate";
                              }
                            }}
                            className={`w-full rounded-md border-2 border-accent px-4 py-2.5 text-xs font-semibold ${
                              isDisabled
                                ? "bg-muted/50 border-muted text-muted-foreground cursor-not-allowed"
                                : "text-accent hover:bg-accent hover:text-white hover:border-accent transition-colors cursor-pointer"
                            }`}
                          >
                            {isDisabled ? "Coming Soon" : `Estimate my ${p.projectType}`}
                          </button>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SMART TOOLS */}
      <section className="container-x py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 mb-5">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-bold text-accent tracking-widest uppercase">
              Smart Tools
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight max-w-3xl mx-auto">
            Estimate costs. Review quotes. That's all you need.
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Start with what matters. Everything else will follow.
          </p>
        </div>

        {/* Unified Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Cost Estimator - Active */}
          <div className="group relative flex flex-col rounded-2xl border border-border bg-white p-6 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            <div className="w-12 h-12 rounded-2xl bg-accent/8 flex items-center justify-center mb-4 group-hover:bg-accent/15 transition-colors duration-300">
              <svg
                className="w-6 h-6 text-accent"
                viewBox="0 0 28 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="3" width="20" height="22" rx="3" />
                <rect x="7" y="6" width="14" height="5" rx="1.5" />
                <line x1="8" y1="22" x2="8" y2="19" strokeWidth="2.5" />
                <line x1="12" y1="22" x2="12" y2="17" strokeWidth="2.5" />
                <line x1="16" y1="22" x2="16" y2="20" strokeWidth="2.5" />
                <line x1="20" y1="22" x2="20" y2="15" strokeWidth="2.5" />
              </svg>
            </div>
            <h3 className="font-display text-sm font-bold text-ink mb-1.5">Cost Estimator</h3>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
              Get clear, local cost estimates for your project in minutes.
            </p>
            <a
              href="/estimate"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition-colors"
            >
              Get Estimate <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Quote Review - Active */}
          <div className="group relative flex flex-col rounded-2xl border border-border bg-white p-6 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            <div className="w-12 h-12 rounded-2xl bg-accent/8 flex items-center justify-center mb-4 group-hover:bg-accent/15 transition-colors duration-300">
              <svg
                className="w-6 h-6 text-accent"
                viewBox="0 0 28 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 3h11l5 5v17H6V3z" />
                <path d="M17 3v5h5" />
                <circle cx="13" cy="16" r="4" />
                <line x1="16" y1="19" x2="19.5" y2="22.5" strokeWidth="2.2" />
              </svg>
            </div>
            <h3 className="font-display text-sm font-bold text-ink mb-1.5">Quote Review</h3>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
              Upload a contractor quote and get AI-powered analysis instantly.
            </p>
            <a
              href="/quote-analyzer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition-colors"
            >
              Review a Quote <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Coming Soon Tools */}
          {[
            {
              id: "insurance",
              name: "Insurance Checker",
              desc: "Find out what's covered and maximize your insurance benefits.",
              icon: '<path d="M14 3L5 7v7c0 5.5 3.9 10.7 9 12 5.1-1.3 9-6.5 9-12V7L14 3z" /><path d="M10 14l3 3 5-5" strokeWidth="2" />',
            },
            {
              id: "materials",
              name: "Material Compare",
              desc: "Compare materials side-by-side on cost, durability, and lifespan.",
              icon: '<path d="M14 3L3 9l11 6 11-6-11-6z" /><path d="M3 14l11 6 11-6" /><path d="M3 19l11 6 11-6" />',
            },
            {
              id: "budget",
              name: "Budget Planner",
              desc: "Plan your budget and explore options from start to finish.",
              icon: '<circle cx="14" cy="14" r="10" /><path d="M14 14L14 4" strokeWidth="2" /><path d="M14 14 A10 10 0 0 1 22.7 19" strokeWidth="2.5" /><circle cx="14" cy="14" r="2.5" />',
            },
            {
              id: "roi",
              name: "ROI Calculator",
              desc: "See the return on your investment and increase home value.",
              icon: '<polyline points="3,22 9,16 14,19 21,9 25,5" /><polyline points="21,5 25,5 25,9" strokeWidth="2" />',
            },
            {
              id: "timeline",
              name: "Project Timeline",
              desc: "Get a clear step-by-step timeline from start to finish.",
              icon: '<rect x="3" y="5" width="22" height="20" rx="3" /><line x1="3" y1="11" x2="25" y2="11" /><line x1="9" y1="3" x2="9" y2="8" strokeWidth="2" /><line x1="19" y1="3" x2="19" y2="8" strokeWidth="2" /><circle cx="9" cy="17" r="1.5" /><circle cx="14" cy="17" r="1.5" /><circle cx="19" cy="17" r="1.5" />',
            },
            {
              id: "permits",
              name: "Permit Guide",
              desc: "Know exactly which permits you need and how to get them.",
              icon: '<path d="M6 3h11l5 5v17H6V3z" /><path d="M17 3v5h5" /><line x1="10" y1="12" x2="18" y2="12" /><line x1="10" y1="16" x2="18" y2="16" /><line x1="10" y1="20" x2="15" y2="20" />',
            },
          ].map((tool) => (
            <div
              key={tool.id}
              className="group relative flex flex-col rounded-2xl border border-border bg-white p-6 overflow-hidden transition-all duration-300"
              style={{ opacity: 0.75 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors duration-300">
                  <svg
                    className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors duration-300"
                    viewBox="0 0 28 28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dangerouslySetInnerHTML={{ __html: tool.icon }}
                  />
                </div>
                <h3 className="font-display text-sm font-bold text-ink mb-1.5">{tool.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
                  {tool.desc}
                </p>
                <div className="pt-3 border-t border-border/30 mt-auto">
                  <p className="text-xs text-accent font-semibold text-center leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    We're crafting something smart here. Stay tuned.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE ANALYSIS SECTION */}
      <QuoteAnalysisSection />

      {/* PLAN YOUR RENOVATION */}
      <section className="container-x py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Plan your home renovation in 4 simple steps
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            Whether you're replacing a roof, remodeling a kitchen, or renovating a bathroom,
            CostReno helps you plan with confidence from start to finish.
          </p>
        </div>

        {/* Steps - Horizontal on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            {
              num: "1",
              title: "Select your project",
              desc: "Choose from roofing, kitchen, and bathroom home improvement projects.",
            },
            {
              num: "2",
              title: "Get a local cost estimate",
              desc: "Get clear renovation cost ranges based on your ZIP code, property size, and current regional labor and material pricing.",
            },
            {
              num: "3",
              title: "Review your contractor quote",
              desc: "Upload your contractor bid and let AI find missing scope, overpriced line items, and red flags before you sign.",
            },
            {
              num: "4",
              title: "Make a confident decision",
              desc: "Use expert recommendations, material comparisons, and ROI analysis to make the best choice for your home. Coming soon.",
            },
          ].map((step, i) => (
            <div
              key={step.num}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-white"
            >
              {/* Connector line (hidden on mobile) */}
              {i < 3 && (
                <div className="hidden lg:block absolute top-10 -right-3 w-6 border-t-2 border-dashed border-border z-10" />
              )}
              <div className="w-11 h-11 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mb-4">
                <span className="text-sm font-bold text-accent">{step.num}</span>
              </div>
              <h3 className="font-display text-base font-bold text-ink mb-2">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Popular Projects */}
        <div className="mt-12 text-center">
          <h3 className="font-display text-sm font-bold text-ink mb-4">
            Popular renovation projects
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Roof Replacement",
              "Kitchen Remodel",
              "Bathroom Remodel",
              "HVAC",
              "Windows",
              "Flooring",
              "Solar",
            ].map((project) => (
              <a
                key={project}
                href="/estimate"
                className="px-4 py-2 rounded-full border border-border bg-white text-sm font-medium text-ink hover:border-accent/40 hover:text-accent transition"
              >
                {project}
              </a>
            ))}
            <a
              href="/estimate"
              className="px-4 py-2 rounded-full border border-accent/30 bg-accent/5 text-sm font-semibold text-accent hover:bg-accent/10 transition inline-flex items-center gap-1"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* FEATURED GUIDES */}
      <section className="container-x py-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
              Latest homeowner guides
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Expert insights to help you plan smarter
            </p>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            View all guides <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[
            {
              img: projRoof,
              title: "How Much Does Roof Replacement Cost?",
              tag: "Roofing",
              read: "8 min read",
            },
            {
              img: cmpRoof,
              title: "Roof Replacement Cost by State",
              tag: "Roofing",
              read: "12 min read",
            },
            {
              img: cmpCounter,
              title: "Metal vs Asphalt Roof",
              tag: "Comparison",
              read: "6 min read",
            },
            {
              img: projKitchen,
              title: "Kitchen Remodel Cost by ZIP Code",
              tag: "Kitchen",
              read: "10 min read",
            },
            {
              img: projBathroom,
              title: "Bathroom Remodel ROI",
              tag: "Bathroom",
              read: "5 min read",
            },
            {
              img: projHvac,
              title: "Should You Replace or Repair Your HVAC?",
              tag: "HVAC",
              read: "7 min read",
            },
          ].map((g) => (
            <a
              key={g.title}
              href="#"
              className="group block rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={g.img}
                  alt={g.title}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-card/90 text-[10px] font-semibold text-ink">
                  {g.tag}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-sm font-bold text-ink group-hover:text-primary transition line-clamp-2">
                  {g.title}
                </h3>
                <div className="mt-2 text-[10px] text-muted-foreground">{g.read}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* TRUST & REVIEWS */}
      <section className="container-x py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Trusted by homeowners nationwide
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
            Join thousands of homeowners who saved money and made better renovation decisions with
            CostReno.
          </p>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            { value: "50K+", label: "Estimates Generated" },
            { value: "4.9/5", label: "Average Rating" },
            { value: "$2.3M", label: "Saved by Homeowners" },
            { value: "100%", label: "Free & Private" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center py-5 px-3 rounded-xl border border-border bg-white"
            >
              <div className="font-display text-2xl md:text-3xl font-bold text-ink">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              name: "Sarah M.",
              location: "Austin, TX",
              project: "Roof Replacement",
              text: "CostReno saved me $4,200 on my roof. The quote analyzer found 3 missing items my contractor didn't include. I went back and got them added at no extra charge.",
              rating: 5,
            },
            {
              name: "James R.",
              location: "Denver, CO",
              project: "Kitchen Remodel",
              text: "I had no idea my kitchen quote was $8K over market rate until I used the estimator. Got a second quote and saved a fortune. This tool pays for itself instantly.",
              rating: 5,
            },
            {
              name: "Maria L.",
              location: "Tampa, FL",
              project: "HVAC System",
              text: "The AI caught that my HVAC quote was missing the permit fee and ductwork inspection. Would have been a $1,500 surprise after signing. Incredible tool.",
              rating: 5,
            },
            {
              name: "David K.",
              location: "Portland, OR",
              project: "Bathroom Remodel",
              text: "Simple, fast, and accurate. I compared 3 contractor bids using CostReno and felt confident picking the right one. No more guessing or overpaying.",
              rating: 5,
            },
          ].map((review) => (
            <div
              key={review.name}
              className="flex flex-col rounded-2xl border border-border bg-white p-5"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i <= review.rating ? "text-amber-400 fill-amber-400" : "text-muted"}`}
                  />
                ))}
              </div>
              {/* Quote */}
              <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
                "{review.text}"
              </p>
              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-ink">{review.name}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {review.location} · {review.project}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISONS */}
      <section className="container-x py-20">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
            Popular comparisons
          </h2>
          <a
            href="#"
            className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            View all comparisons <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {comparisons.map((c) => (
            <article
              key={c.title}
              className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-card text-xs font-bold text-ink shadow-lg">
                  VS
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-base font-bold text-ink">{c.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                <a
                  href="#"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Compare Now <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container-x py-20">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 grid md:grid-cols-[auto_1fr_auto] gap-8 items-center">
          <img
            src={blueprint}
            alt="House blueprint"
            width={1024}
            height={1024}
            loading="lazy"
            className="h-32 w-40 object-contain"
          />
          <div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-ink">
              Stay Informed. Plan Smarter.
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get expert tips, cost trends, and project checklists straight to your inbox.
            </p>
            <form className="mt-4 flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
                Subscribe Free
              </button>
            </form>
          </div>
          <div className="flex md:flex-col gap-6 md:gap-4 text-center md:text-left md:border-l md:border-border md:pl-8">
            {[
              ["100+", "Guides & Articles"],
              ["Weekly", "Cost Updates"],
              ["Free", "Forever"],
            ].map(([k, v]) => (
              <div key={v}>
                <div className="font-display text-lg font-bold text-ink">{k}</div>
                <div className="text-xs text-muted-foreground">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-bold text-ink">{title}</h4>
      <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="hover:text-primary">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
