/**
 * Market-anchored line-item scorecard helpers.
 * Prefers deterministic roofing unit rates; falls back to knowledge cost strings.
 */

import {
  estimateRoofingMarketRange,
  isPriceComparisonReliable,
} from "@/knowledge/roofing/market-rates";

export type MarketRangeTotals = {
  low: number;
  mid: number;
  high: number;
};

export type MarketScoreLabel =
  | "Above market"
  | "Within range"
  | "Below market"
  | "Verify price"
  | "No market data";

export type MarketScoreTone = "high" | "fair" | "low" | "warn" | "muted";

export type LineItemMarketScore = {
  marketLow: number;
  marketMid: number;
  marketHigh: number;
  marketComparable: boolean;
  label: MarketScoreLabel;
  tone: MarketScoreTone;
  className: string;
};

const SCORE_STYLES: Record<MarketScoreTone, string> = {
  high: "bg-red-50 text-red-600",
  fair: "bg-accent/10 text-accent",
  low: "bg-amber-50 text-amber-700",
  warn: "bg-amber-50 text-amber-600",
  muted: "bg-muted text-muted-foreground",
};

/** Parse "$3 – $8 / lf" style strings into unit bounds. */
export function parseCostStringBounds(costString?: string): { low: number; high: number } | null {
  if (!costString) return null;
  const numbers = costString.match(/\$[\d,.]+/g);
  if (!numbers || numbers.length === 0) return null;
  const values = numbers.map((n) => Number(n.replace(/[$,]/g, "")));
  if (values.some((v) => !Number.isFinite(v) || v <= 0)) return null;
  if (values.length === 1) return { low: values[0], high: values[0] };
  return { low: Math.min(...values), high: Math.max(...values) };
}

function isUnitCostString(cost: string): boolean {
  return /\/\s*(lf|sq|sq\s*ft|each|square)/i.test(cost);
}

export function resolveMarketRange(
  name: string,
  qty: number,
  unit: string,
  knowledgeCosts: Array<string | undefined> = [],
): MarketRangeTotals | null {
  const fromRates = estimateRoofingMarketRange(name, qty, unit);
  if (fromRates) {
    return { low: fromRates.low, mid: fromRates.mid, high: fromRates.high };
  }

  if (!(qty > 0)) return null;

  for (const cost of knowledgeCosts) {
    if (!cost || !isUnitCostString(cost)) continue;
    const bounds = parseCostStringBounds(cost);
    if (!bounds) continue;
    return {
      low: bounds.low * qty,
      mid: ((bounds.low + bounds.high) / 2) * qty,
      high: bounds.high * qty,
    };
  }

  return null;
}

export function scoreVendorAgainstMarket(
  vendorPrice: number,
  range: MarketRangeTotals | null,
  opts?: { priceUnreliable?: boolean },
): LineItemMarketScore {
  if (opts?.priceUnreliable) {
    return {
      marketLow: 0,
      marketMid: 0,
      marketHigh: 0,
      marketComparable: false,
      label: "Verify price",
      tone: "warn",
      className: SCORE_STYLES.warn,
    };
  }

  if (!(vendorPrice > 0) || !range || range.mid <= 0) {
    return {
      marketLow: range?.low ?? 0,
      marketMid: range?.mid ?? 0,
      marketHigh: range?.high ?? 0,
      marketComparable: false,
      label: "No market data",
      tone: "muted",
      className: SCORE_STYLES.muted,
    };
  }

  const comparable = isPriceComparisonReliable(vendorPrice, range.mid);
  if (!comparable) {
    return {
      marketLow: range.low,
      marketMid: range.mid,
      marketHigh: range.high,
      marketComparable: false,
      label: "No market data",
      tone: "muted",
      className: SCORE_STYLES.muted,
    };
  }

  if (vendorPrice > range.high) {
    return {
      marketLow: range.low,
      marketMid: range.mid,
      marketHigh: range.high,
      marketComparable: true,
      label: "Above market",
      tone: "high",
      className: SCORE_STYLES.high,
    };
  }

  if (vendorPrice < range.low) {
    return {
      marketLow: range.low,
      marketMid: range.mid,
      marketHigh: range.high,
      marketComparable: true,
      label: "Below market",
      tone: "low",
      className: SCORE_STYLES.low,
    };
  }

  return {
    marketLow: range.low,
    marketMid: range.mid,
    marketHigh: range.high,
    marketComparable: true,
    label: "Within range",
    tone: "fair",
    className: SCORE_STYLES.fair,
  };
}

export function formatMarketRange(low: number, mid: number, high: number): string {
  if (!(mid > 0)) return "—";
  const l = Math.round(low).toLocaleString();
  const m = Math.round(mid).toLocaleString();
  const h = Math.round(high).toLocaleString();
  if (low > 0 && high > 0 && low !== high) return `$${l} – $${h}`;
  return `$${m}`;
}
