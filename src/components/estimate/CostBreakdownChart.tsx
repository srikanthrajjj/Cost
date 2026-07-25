import { useEffect, useState } from "react";
import {
  ChevronDown,
  DollarSign,
  FileText,
  Hammer,
  Package,
  Shield,
  Trash2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fmtK = (n: number) => {
  if (n < 1000) return `$${Math.round(n)}`;
  const k = (n / 1000).toFixed(1).replace(/\.0$/, "");
  return `$${k}k`;
};

const fmt = (n: number) => "$" + Math.round(n).toLocaleString();

export const BREAKDOWN_PALETTE = ["#082A4B", "#1e4d7b", "#3d6f9e", "#5a8499", "#7a96a8", "#9aafbd"];
export const LARGEST_ACCENT = "#03A44D";

export type BreakdownItem = {
  label: string;
  amount: number;
  pct: number;
  color: string;
  isLargest?: boolean;
};

export function colorizeBreakdown(
  breakdown: { label: string; amount: number; pct: number }[],
): BreakdownItem[] {
  const largestIdx = breakdown.reduce(
    (best, item, i, arr) => (item.amount > arr[best].amount ? i : best),
    0,
  );
  let paletteIdx = 0;
  return breakdown.map((item, i) => {
    const isLargest = i === largestIdx && item.amount > 0;
    const color = isLargest
      ? LARGEST_ACCENT
      : (BREAKDOWN_PALETTE[paletteIdx++ % BREAKDOWN_PALETTE.length] ?? "#94a3b8");
    return { ...item, color, isLargest };
  });
}

function getBreakdownIcon(label: string): LucideIcon {
  const lower = label.toLowerCase();
  if (lower.includes("labor")) return Wrench;
  if (lower.includes("material")) return Package;
  if (lower.includes("contingenc")) return Shield;
  if (lower.includes("deck") || lower.includes("prep")) return Hammer;
  if (lower.includes("disposal")) return Trash2;
  if (lower.includes("permit")) return FileText;
  return DollarSign;
}

function shortLabel(label: string, maxLen = 10): string {
  if (label.length <= maxLen) return label;
  const words = label.split(/\s+/);
  if (words[0] && words[0].length <= maxLen) return words[0];
  return `${label.slice(0, maxLen - 1)}…`;
}

function VerticalBars({
  items,
  total,
  activeLabel,
  onActiveChange,
  revealed,
  compact,
}: {
  items: BreakdownItem[];
  total: number;
  activeLabel: string | null;
  onActiveChange: (label: string | null) => void;
  revealed: boolean;
  compact: boolean;
}) {
  const activeItem = activeLabel ? items.find((b) => b.label === activeLabel) : null;
  const chartHeight = compact ? 128 : 168;
  const maxPct = Math.max(...items.map((i) => i.pct), 1);

  return (
    <div className={cn("min-w-0", compact ? "w-full shrink-0 sm:w-[42%] sm:max-w-[16rem]" : "w-full shrink-0")}>
      <div
        className={cn(
          "rounded-xl border border-border/60 bg-muted/20 px-3 pt-3 pb-2",
          compact ? "w-full" : "max-w-[min(100%,28rem)]",
        )}
        role="img"
        aria-label={`Cost breakdown bar chart. Total estimate ${fmt(total)}.`}
      >
        <div className="mb-2 min-h-[2.75rem] text-center" aria-live="polite" aria-atomic="true">
          {activeItem ? (
            <>
              <div className="text-[11px] font-medium text-muted-foreground leading-tight line-clamp-1">
                {activeItem.label}
              </div>
              <div
                className={cn(
                  "mt-0.5 font-display font-bold text-primary leading-none tabular-nums",
                  compact ? "text-lg" : "text-xl",
                )}
              >
                {fmtK(activeItem.amount)}
              </div>
              <div className="mt-0.5 text-[11px] font-semibold text-muted-foreground tabular-nums">
                {Math.round(activeItem.pct)}% of total
              </div>
            </>
          ) : (
            <>
              <div className="text-[11px] font-medium text-muted-foreground tracking-wide">
                Total
              </div>
              <div
                className={cn(
                  "mt-0.5 font-display font-bold text-primary leading-none tabular-nums",
                  compact ? "text-xl" : "text-2xl",
                )}
              >
                {fmtK(total)}
              </div>
            </>
          )}
        </div>

        <div
          className="flex items-end gap-1.5 sm:gap-2"
          style={{ height: chartHeight }}
          aria-hidden={false}
        >
          {items.map((item, i) => {
            const isActive = activeLabel === item.label;
            const isDimmed = activeLabel !== null && !isActive;
            const pctRounded = Math.round(item.pct);
            const barHeightPct = (item.pct / maxPct) * 100;
            const displayHeight = revealed ? Math.max(barHeightPct, item.pct > 0 ? 4 : 0) : 0;

            return (
              <button
                key={item.label}
                type="button"
                aria-label={`${item.label}, ${pctRounded} percent, ${fmtK(item.amount)}${item.isLargest ? ", largest share" : ""}`}
                aria-pressed={isActive}
                onMouseEnter={() => onActiveChange(item.label)}
                onMouseLeave={() => onActiveChange(null)}
                onFocus={() => onActiveChange(item.label)}
                onBlur={() => onActiveChange(null)}
                onClick={() => onActiveChange(isActive ? null : item.label)}
                className={cn(
                  "group relative flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5",
                  "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
                  "motion-reduce:transition-none",
                )}
                style={{ height: chartHeight }}
              >
                <div className="flex w-full flex-1 flex-col justify-end" aria-hidden>
                  <div
                    className={cn(
                      "w-full rounded-t-md transition-[height,opacity,transform] duration-300 ease-out",
                      "motion-reduce:transition-none motion-reduce:duration-0",
                      isActive && "ring-2 ring-primary/20 ring-offset-1",
                    )}
                    style={{
                      height: `${displayHeight}%`,
                      backgroundColor: item.color,
                      opacity: isDimmed ? 0.28 : 1,
                      transform: isActive ? "scaleX(1.04)" : "scaleX(1)",
                      transformOrigin: "bottom center",
                      transitionDelay: revealed ? `${i * 35}ms` : "0ms",
                    }}
                  />
                </div>
                <span
                  className={cn(
                    "w-full truncate text-center font-medium leading-none text-primary/70",
                    compact ? "text-[9px] sm:text-[10px]" : "text-[10px] sm:text-[11px]",
                    isActive && "text-primary font-semibold",
                  )}
                  title={item.label}
                >
                  {shortLabel(item.label, compact ? 8 : 12)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BreakdownLegend({
  items,
  activeLabel,
  onActiveChange,
  variant,
  compact,
}: {
  items: BreakdownItem[];
  activeLabel: string | null;
  onActiveChange: (label: string | null) => void;
  variant: "full" | "compact" | "sidebar";
  compact: boolean;
}) {
  const isSidebar = variant === "sidebar";

  return (
    <ul
      className={cn("w-full min-w-0 flex-1", isSidebar || compact ? "space-y-1" : "space-y-1.5")}
      role="list"
    >
      {items.map((item) => {
        const isActive = activeLabel === item.label;
        const isLargest = Boolean(item.isLargest);
        const pctRounded = Math.round(item.pct);
        const Icon = getBreakdownIcon(item.label);

        return (
          <li key={item.label}>
            <button
              type="button"
              aria-pressed={isActive}
              aria-label={`${item.label}, ${pctRounded} percent, ${fmtK(item.amount)}${isLargest ? ", largest share" : ""}`}
              onMouseEnter={() => onActiveChange(item.label)}
              onMouseLeave={() => onActiveChange(null)}
              onFocus={() => onActiveChange(item.label)}
              onBlur={() => onActiveChange(null)}
              onClick={() => onActiveChange(isActive ? null : item.label)}
              className={cn(
                "relative w-full min-w-0 overflow-hidden rounded-lg border text-left",
                "transition-[transform,opacity,box-shadow,background-color,border-color] duration-200 ease-out",
                "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0",
                !isSidebar &&
                  !compact &&
                  "hover:-translate-y-0.5 hover:shadow-sm focus-visible:-translate-y-0.5 focus-visible:shadow-sm rounded-xl",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
                isLargest ? "border-primary/15 bg-primary/[0.03]" : "border-border/70 bg-white",
                isActive && !isLargest && "border-primary/25 bg-primary/[0.04] shadow-sm",
                isActive && isLargest && "border-accent/35 bg-accent/[0.06] shadow-sm",
              )}
            >
              <div className="flex items-stretch">
                <span
                  className="w-1 shrink-0"
                  style={{ backgroundColor: item.color }}
                  aria-hidden
                />
                <div
                  className={cn(
                    "min-w-0 flex-1",
                    isSidebar || compact ? "px-2 py-1.5" : "px-3 py-2.5 sm:px-3.5 sm:py-3",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {!isSidebar && !compact && (
                      <div
                        className={cn(
                          "hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-opacity duration-200 motion-reduce:transition-none",
                          isActive ? "opacity-100" : "opacity-80",
                        )}
                        style={{ backgroundColor: `${item.color}18`, color: item.color }}
                        aria-hidden
                      >
                        <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                        <span
                          className={cn(
                            "font-semibold text-primary leading-snug",
                            isSidebar || compact ? "text-xs" : "text-sm",
                          )}
                        >
                          {item.label}
                        </span>
                        {isLargest && !isSidebar && !compact && (
                          <span className="shrink-0 rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                            Largest share
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                        isLargest ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {pctRounded}%
                    </span>
                    <span
                      className={cn(
                        "shrink-0 font-bold text-primary tabular-nums",
                        isSidebar || compact ? "text-xs" : "text-sm",
                      )}
                    >
                      {fmtK(item.amount)}
                    </span>
                  </div>
                  {isSidebar && (
                    <div
                      className="mt-1 h-0.5 w-full overflow-hidden rounded-full bg-muted/80"
                      role="presentation"
                      aria-hidden
                    >
                      <div
                        className="h-full rounded-full transition-[width,opacity] duration-200 ease-out motion-reduce:transition-none"
                        style={{
                          width: `${Math.max(pctRounded, 2)}%`,
                          backgroundColor: item.color,
                          opacity: isActive ? 1 : 0.75,
                        }}
                      />
                    </div>
                  )}
                  {!isSidebar && !compact && (
                    <div className="mt-2.5">
                      <div
                        className="h-1.5 w-full overflow-hidden rounded-full bg-muted/80"
                        role="presentation"
                        aria-hidden
                      >
                        <div
                          className="h-full rounded-full transition-[width,opacity] duration-200 ease-out motion-reduce:transition-none"
                          style={{
                            width: `${Math.max(pctRounded, 2)}%`,
                            backgroundColor: item.color,
                            opacity: isActive ? 1 : 0.75,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function CostBreakdownChart({
  breakdown,
  total,
  variant = "full",
  compact = false,
}: {
  breakdown: BreakdownItem[];
  total: number;
  variant?: "full" | "sidebar";
  compact?: boolean;
}) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const isSidebar = variant === "sidebar";
  const isCompact = compact;
  const chartVariant = isSidebar ? "sidebar" : isCompact ? "compact" : "full";

  useEffect(() => {
    setRevealed(false);
    setShowAllCategories(false);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setRevealed(true);
      return;
    }
    const id = window.requestAnimationFrame(() => setRevealed(true));
    return () => window.cancelAnimationFrame(id);
  }, [breakdown]);

  const sortedBreakdown = [...breakdown].sort((a, b) => b.amount - a.amount);
  const visibleBreakdown =
    isSidebar && !showAllCategories ? sortedBreakdown.slice(0, 3) : sortedBreakdown;
  const hiddenCount = sortedBreakdown.length - visibleBreakdown.length;

  return (
    <div className="w-full min-w-0">
      <div className={cn(isSidebar ? "mb-2" : isCompact ? "mb-2.5" : "mb-6")}>
        <h3
          className={cn(
            "font-display font-bold text-primary tracking-tight",
            isSidebar ? "text-sm" : isCompact ? "text-base" : "text-lg",
          )}
        >
          Cost breakdown
        </h3>
        {!isSidebar && !isCompact && (
          <p className="mt-1 text-sm text-muted-foreground leading-snug">
            Where a typical project budget goes
          </p>
        )}
      </div>

      <div
        className={cn(
          "flex w-full min-w-0",
          isSidebar
            ? "flex-col gap-2"
            : isCompact
              ? "flex-col gap-3 sm:flex-row sm:items-start sm:gap-4"
              : "flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-8",
        )}
      >
        {!isSidebar && (
          <VerticalBars
            items={sortedBreakdown}
            total={total}
            activeLabel={activeLabel}
            onActiveChange={setActiveLabel}
            revealed={revealed}
            compact={isCompact}
          />
        )}

        <BreakdownLegend
          items={visibleBreakdown}
          activeLabel={activeLabel}
          onActiveChange={setActiveLabel}
          variant={chartVariant}
          compact={isCompact}
        />

        {isSidebar && hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAllCategories(true)}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-muted/30 px-3 py-2 text-xs font-semibold text-primary hover:bg-muted/50 transition duration-200"
          >
            View all {sortedBreakdown.length} categories
            <ChevronDown className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}

        {isSidebar && showAllCategories && sortedBreakdown.length > 3 && (
          <button
            type="button"
            onClick={() => setShowAllCategories(false)}
            className="w-full text-xs font-medium text-muted-foreground hover:text-primary transition duration-200"
          >
            Show top categories
          </button>
        )}
      </div>
    </div>
  );
}
