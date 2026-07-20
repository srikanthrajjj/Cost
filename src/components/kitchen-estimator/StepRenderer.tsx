import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  Square,
  RectangleHorizontal,
  Maximize,
  Paintbrush,
  Wrench,
  HardHat,
  Layers,
  Box,
  Settings,
  Star,
  Gem,
  Mountain,
  Sparkles,
  Crown,
  MoveHorizontal,
  PlusSquare,
  Droplets,
  Zap,
  AppWindow,
  X,
  Calendar,
  Clock,
  AlertCircle,
  TreeDeciduous,
  MapPin,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StepConfig } from "@/lib/kitchen-estimator/config";

// ─── Props ───────────────────────────────────────────────────────────────────

interface StepRendererProps {
  step: StepConfig;
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

// ─── Icon Map ────────────────────────────────────────────────────────────────

const iconMap: Record<string, LucideIcon> = {
  square: Square,
  "rectangle-horizontal": RectangleHorizontal,
  maximize: Maximize,
  paintbrush: Paintbrush,
  wrench: Wrench,
  "hard-hat": HardHat,
  layers: Layers,
  box: Box,
  settings: Settings,
  star: Star,
  check: Check,
  gem: Gem,
  mountain: Mountain,
  sparkles: Sparkles,
  crown: Crown,
  "move-horizontal": MoveHorizontal,
  "plus-square": PlusSquare,
  droplets: Droplets,
  zap: Zap,
  "app-window": AppWindow,
  x: X,
  calendar: Calendar,
  clock: Clock,
  "alert-circle": AlertCircle,
  "tree-deciduous": TreeDeciduous,
  "map-pin": MapPin,
  refrigerator: Box,
};

function OptionIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null;
  const Icon = iconMap[name] ?? Square;
  return <Icon className={className} />;
}

// ─── Single Card Step ────────────────────────────────────────────────────────

function SingleCardStep({
  step,
  value,
  onChange,
  onNext,
}: {
  step: StepConfig;
  value: string | undefined;
  onChange: (value: string) => void;
  onNext: () => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      // Auto-advance after 250ms
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onNext();
      }, 250);
    },
    [onChange, onNext]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const options = step.options;
      if (!options || options.length === 0) return;

      const buttons = groupRef.current?.querySelectorAll<HTMLElement>('[role="radio"]');
      if (!buttons) return;

      const currentIndex = Array.from(buttons).findIndex(
        (btn) => btn === document.activeElement
      );

      let nextIndex: number | null = null;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
      }

      if (nextIndex !== null) {
        buttons[nextIndex].focus();
        // Select on arrow key navigation (standard radiogroup pattern)
        if (options[nextIndex]) {
          handleSelect(options[nextIndex].value);
        }
      }
    },
    [step.options, handleSelect]
  );

  return (
    <div
      ref={groupRef}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      role="radiogroup"
      aria-label={step.title}
      onKeyDown={handleKeyDown}
    >
      {step.options?.map((option, index) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected || (!value && index === 0) ? 0 : -1}
            onClick={() => handleSelect(option.value)}
            className={cn(
              "group relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-center transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isSelected
                ? "border-[#082A4B] bg-[#082A4B]/5 shadow-md"
                : "border-border bg-white hover:border-[#082A4B]/40 hover:shadow-sm"
            )}
          >
            {isSelected && (
              <span className="absolute top-2.5 right-2.5" aria-hidden="true">
                <Check className="h-4 w-4 text-[#082A4B]" />
              </span>
            )}
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
                isSelected
                  ? "bg-[#082A4B]/10 text-[#082A4B]"
                  : "bg-muted text-muted-foreground group-hover:bg-[#082A4B]/5 group-hover:text-[#082A4B]/80"
              )}
              aria-hidden="true"
            >
              <OptionIcon name={option.icon} className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="font-display text-sm font-semibold text-[#082A4B]">
                {option.label}
              </span>
              {option.description && (
                <p className="text-xs text-muted-foreground">{option.description}</p>
              )}
            </div>
            {option.priceImpact && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground" aria-label={`Price impact: ${option.priceImpact}`}>
                {option.priceImpact}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Multi Card Step ─────────────────────────────────────────────────────────

function MultiCardStep({
  step,
  value,
  onChange,
}: {
  step: StepConfig;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}) {
  const selected = value ?? [];

  const handleToggle = useCallback(
    (optionValue: string) => {
      // If "none" is selected, clear everything else
      if (optionValue === "none") {
        onChange(["none"]);
        return;
      }
      // If selecting a real option, remove "none"
      const withoutNone = selected.filter((v) => v !== "none");
      if (withoutNone.includes(optionValue)) {
        onChange(withoutNone.filter((v) => v !== optionValue));
      } else {
        onChange([...withoutNone, optionValue]);
      }
    },
    [selected, onChange]
  );

  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      role="group"
      aria-label={step.title}
    >
      {step.options?.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            onClick={() => handleToggle(option.value)}
            className={cn(
              "group relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-center transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isSelected
                ? "border-[#082A4B] bg-[#082A4B]/5 shadow-md"
                : "border-border bg-white hover:border-[#082A4B]/40 hover:shadow-sm"
            )}
          >
            {isSelected && (
              <span className="absolute top-2.5 right-2.5">
                <Check className="h-4 w-4 text-[#082A4B]" />
              </span>
            )}
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
                isSelected
                  ? "bg-[#082A4B]/10 text-[#082A4B]"
                  : "bg-muted text-muted-foreground group-hover:bg-[#082A4B]/5 group-hover:text-[#082A4B]/80"
              )}
            >
              <OptionIcon name={option.icon} className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="font-display text-sm font-semibold text-[#082A4B]">
                {option.label}
              </span>
              {option.description && (
                <p className="text-xs text-muted-foreground">{option.description}</p>
              )}
            </div>
            {option.priceImpact && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {option.priceImpact}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Text Input Step ─────────────────────────────────────────────────────────

function TextInputStep({
  step,
  value,
  onChange,
}: {
  step: StepConfig;
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-md">
      <label htmlFor={`input-${step.id}`} className="sr-only">
        {step.title}
      </label>
      <input
        id={`input-${step.id}`}
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer..."
        className="w-full rounded-lg border-2 border-border bg-white px-4 py-3 text-base text-[#082A4B] placeholder:text-muted-foreground focus:border-[#082A4B] focus:outline-none focus:ring-2 focus:ring-[#082A4B]/20 transition-colors"
        aria-label={step.title}
      />
    </div>
  );
}

// ─── ZIP Input Step ──────────────────────────────────────────────────────────

function ZipInputStep({
  step,
  value,
  onChange,
}: {
  step: StepConfig;
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Only allow digits, max 5
      const cleaned = e.target.value.replace(/\D/g, "").slice(0, 5);
      onChange(cleaned);
    },
    [onChange]
  );

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative">
        <MapPin className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <label htmlFor={`zip-${step.id}`} className="sr-only">
          {step.title}
        </label>
        <input
          id={`zip-${step.id}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={5}
          value={value ?? ""}
          onChange={handleChange}
          placeholder="Enter ZIP code"
          className="w-full rounded-lg border-2 border-border bg-white py-3 pl-11 pr-4 text-center text-lg font-medium tracking-wider text-[#082A4B] placeholder:text-muted-foreground focus:border-[#082A4B] focus:outline-none focus:ring-2 focus:ring-[#082A4B]/20 transition-colors"
          aria-label="ZIP code"
        />
      </div>
      {value && value.length === 5 && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          We'll adjust costs based on your local market rates.
        </p>
      )}
    </div>
  );
}

// ─── Continue Button ─────────────────────────────────────────────────────────

function ContinueButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-semibold shadow-sm transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#028a40] focus-visible:ring-offset-2",
        disabled
          ? "cursor-not-allowed bg-muted text-muted-foreground"
          : "bg-[#028a40] text-white hover:bg-[#028a40]/90"
      )}
      aria-label="Continue to next step"
    >
      Continue
    </button>
  );
}

// ─── Step Renderer (Main Export) ─────────────────────────────────────────────

export function StepRenderer({
  step,
  value,
  onChange,
  onNext,
  onBack,
}: StepRendererProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger enter animation on mount / step change
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 20);
    return () => clearTimeout(timer);
  }, [step.id]);

  const canContinue = (() => {
    switch (step.type) {
      case "multi-card":
        return Array.isArray(value) && value.length > 0;
      case "text-input":
        return typeof value === "string" && value.trim().length > 0;
      case "zip-input":
        return typeof value === "string" && value.length === 5;
      default:
        return false;
    }
  })();

  return (
    <section
      className={cn(
        "mx-auto w-full max-w-3xl px-4 py-8 transition-all duration-300 ease-out",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-3 opacity-0"
      )}
      aria-labelledby={`step-title-${step.id}`}
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <h2
          id={`step-title-${step.id}`}
          className="font-display text-2xl font-bold text-[#082A4B] sm:text-3xl"
        >
          {step.title}
        </h2>
        {step.subtitle && (
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {step.subtitle}
          </p>
        )}
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {step.type === "single-card" && (
          <SingleCardStep
            step={step}
            value={value as string | undefined}
            onChange={onChange}
            onNext={onNext}
          />
        )}
        {step.type === "multi-card" && (
          <MultiCardStep
            step={step}
            value={value as string[] | undefined}
            onChange={onChange}
          />
        )}
        {step.type === "text-input" && (
          <TextInputStep
            step={step}
            value={value as string | undefined}
            onChange={onChange}
          />
        )}
        {step.type === "zip-input" && (
          <ZipInputStep
            step={step}
            value={value as string | undefined}
            onChange={onChange}
          />
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-[#082A4B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Go back to previous step"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Show Continue button for non-auto-advance steps */}
        {!step.autoAdvance && (
          <ContinueButton disabled={!canContinue} onClick={onNext} />
        )}
      </div>
    </section>
  );
}
