import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { KitchenLiveEstimate } from "../../lib/kitchen-estimator/types";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  liveEstimate: KitchenLiveEstimate | null;
}

/** Formats a number as US currency without cents: $XX,XXX */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Hook to animate a numeric value with smooth transitions. */
function useAnimatedValue(target: number, duration = 400): number {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(display);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === display) return;

    startRef.current = display;
    startTimeRef.current = null;

    function animate(timestamp: number) {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(
        startRef.current + (target - startRef.current) * eased
      );

      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration]);

  return display;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  liveEstimate,
}: ProgressIndicatorProps) {
  const percentage = Math.round(((currentStep + 1) / totalSteps) * 100);

  const animatedMid = useAnimatedValue(liveEstimate?.mid ?? 0);
  const animatedLow = useAnimatedValue(liveEstimate?.low ?? 0);
  const animatedHigh = useAnimatedValue(liveEstimate?.high ?? 0);

  return (
    <div
      className="w-full space-y-3 rounded-lg border border-[#082A4B]/10 bg-white px-4 py-3 shadow-sm"
      role="region"
      aria-label="Estimation progress"
    >
      {/* Progress bar and step counter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-body text-xs font-medium text-[#082A4B]/70">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="font-body text-xs font-medium text-[#082A4B]/50">
            {percentage}%
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-[#082A4B]/10"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Step ${currentStep + 1} of ${totalSteps}, ${percentage}% complete`}
        >
          <div
            className="h-full rounded-full bg-[#082A4B] transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Live estimate display - shown after first cost-impacting answer */}
      {liveEstimate && (
        <div
          className={cn(
            "flex items-center justify-between gap-3 border-t border-[#082A4B]/5 pt-2",
            "animate-in fade-in duration-300"
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="font-body text-xs text-[#082A4B]/60">
            Estimated cost
          </span>
          <div className="text-right">
            <span className="font-display text-base font-bold text-[#03A44D]">
              {formatCurrency(animatedMid)}
            </span>
            <span className="ml-2 font-body text-xs text-[#082A4B]/50">
              {formatCurrency(animatedLow)} – {formatCurrency(animatedHigh)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
