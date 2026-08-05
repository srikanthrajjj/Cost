/**
 * Editorial Google Trends watchlist for U.S. home renovation demand.
 * These are content-planning signals, not live Google Trends API values.
 * Official Trends API is still application-gated alpha, so we keep this curated.
 */
export type TrendSignal = "Rising" | "High" | "Seasonal" | "Watch";

export type GoogleTrendWatchItem = {
  term: string;
  signal: TrendSignal;
  why: string;
  costrenoHref: string;
  trendsUrl: string;
};

function trendsUrl(term: string) {
  const q = encodeURIComponent(term);
  return `https://trends.google.com/trends/explore?geo=US&q=${q}&hl=en-US`;
}

export const GOOGLE_TRENDS_WATCHLIST: GoogleTrendWatchItem[] = [
  {
    term: "roof replacement cost",
    signal: "High",
    why: "Evergreen high-intent cost query across storm and insurance seasons.",
    costrenoHref: "/guides/roof-replacement",
    trendsUrl: trendsUrl("roof replacement cost"),
  },
  {
    term: "kitchen remodel cost",
    signal: "High",
    why: "Core renovation planning query with strong year-round U.S. interest.",
    costrenoHref: "/guides/kitchen-remodel",
    trendsUrl: trendsUrl("kitchen remodel cost"),
  },
  {
    term: "bathroom remodel cost",
    signal: "Rising",
    why: "Strong mid-funnel research query for scope and budget planning.",
    costrenoHref: "/guides/bathroom-remodel",
    trendsUrl: trendsUrl("bathroom remodel cost"),
  },
  {
    term: "quartz countertops cost",
    signal: "Rising",
    why: "Material-specific cost query tied to kitchen upgrades.",
    costrenoHref: "/guides/quartz-countertop-cost",
    trendsUrl: trendsUrl("quartz countertops cost"),
  },
  {
    term: "HVAC replacement cost",
    signal: "Seasonal",
    why: "Peaks in heat and cold swings; strong local service intent.",
    costrenoHref: "/guides/hvac-installation",
    trendsUrl: trendsUrl("HVAC replacement cost"),
  },
  {
    term: "EV charger installation cost",
    signal: "Rising",
    why: "Electrification interest is climbing in U.S. homeowner search.",
    costrenoHref: "/guides/ev-charger-installation-cost",
    trendsUrl: trendsUrl("EV charger installation cost"),
  },
  {
    term: "solar panel cost",
    signal: "Rising",
    why: "Energy upgrade demand with rebate and quote comparison intent.",
    costrenoHref: "/guides/solar-panel-cost",
    trendsUrl: trendsUrl("solar panel cost"),
  },
  {
    term: "roof insurance claim",
    signal: "Seasonal",
    why: "Spikes after storms; pairs well with quote and claim guides.",
    costrenoHref: "/guides/roof-insurance-claims",
    trendsUrl: trendsUrl("roof insurance claim"),
  },
];
