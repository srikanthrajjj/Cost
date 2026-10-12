export const TOOL_EVENTS = [
  "estimate_started",
  "estimate_completed",
  "quote_review_started",
  "quote_review_completed",
  "quote_review_failed",
  "quote_details_ready",
  "quote_report_ready",
  "quote_report_failed",
  "sample_review_opened",
  "homepage_quote_clicked",
  "homepage_estimate_clicked",
  "nav_quote_clicked",
] as const;

export type ToolEventName = (typeof TOOL_EVENTS)[number];

/** Fixed event names only. Never include user input, documents, or identifiers. */
export function trackToolEvent(name: ToolEventName): void {
  if (typeof window === "undefined" || !(TOOL_EVENTS as readonly string[]).includes(name)) return;

  try {
    window.dispatchEvent(new CustomEvent("costreno:tool-event", { detail: { name } }));
  } catch {
    // Diagnostics must never block a tool or navigation.
  }

  try {
    const analyticsWindow = window as Window & {
      clarity?: (command: "event", event: ToolEventName) => void;
    };
    analyticsWindow.clarity?.("event", name);
  } catch {
    // Tools remain usable when analytics is blocked or unavailable.
  }
}
