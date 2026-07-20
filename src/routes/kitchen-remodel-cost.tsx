import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { RotateCcw, Play } from "lucide-react";
import { EstimatorWizard } from "../components/kitchen-estimator/EstimatorWizard";
import { createProjectStore } from "../lib/kitchen-estimator/project-store";

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
  component: KitchenEstimatorPage,
});

// ─── Main Page Component ──────────────────────────────────────────────────────

function KitchenEstimatorPage() {
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [checkedStorage, setCheckedStorage] = useState(false);

  useEffect(() => {
    try {
      const store = createProjectStore();
      if (store.hasExisting()) {
        setShowResumePrompt(true);
      }
    } catch {
      // Storage unavailable — proceed without resume prompt
    }
    setCheckedStorage(true);
  }, []);

  const handleResume = () => {
    // User chose to resume — EstimatorWizard will pick up saved state internally
    setShowResumePrompt(false);
  };

  const handleStartNew = () => {
    // Clear existing projects so we start fresh
    try {
      const store = createProjectStore();
      const projects = store.list();
      for (const project of projects) {
        store.remove(project.id);
      }
    } catch {
      // Ignore storage errors
    }
    setShowResumePrompt(false);
  };

  // Wait for storage check before rendering to avoid flash
  if (!checkedStorage) {
    return null;
  }

  // Resume prompt
  if (showResumePrompt) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#082A4B]/10 bg-white p-8 shadow-sm text-center space-y-6">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#082A4B]/5">
              <RotateCcw className="h-7 w-7 text-[#082A4B]" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-xl font-bold text-[#082A4B]">
              Welcome back!
            </h2>
            <p className="text-sm text-muted-foreground">
              You have a saved kitchen remodel estimate. Would you like to pick up where you left off?
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleResume}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#03A44D] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#03A44D]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Play className="h-4 w-4" />
              Resume My Estimate
            </button>
            <button
              type="button"
              onClick={handleStartNew}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#082A4B]/20 px-6 py-3 text-sm font-semibold text-[#082A4B] transition-colors hover:border-[#082A4B]/40 hover:bg-[#082A4B]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Start a New Estimate
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: render the wizard
  return <EstimatorWizard />;
}
