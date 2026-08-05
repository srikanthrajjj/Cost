import { useEffect, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Calculator, ShieldCheck, X } from "lucide-react";

const STORAGE_KEY = "costreno_welcome_seen";

const MESSAGES = [
  "Welcome to CostReno.",
  "Contractor and vendor quotes are hard to judge alone. Some bids pad line items or leave gaps that raise the final bill.",
  "Our ZIP-based estimate uses local labor and material ranges so you can compare quotes against a clear market baseline before you sign, and avoid overpaying.",
];

function locationFlowPending(pathname: string) {
  if (pathname !== "/") return false;
  if (typeof window === "undefined") return false;
  const confirmed = localStorage.getItem("costreno_location_confirmed") === "1";
  const dismissed = localStorage.getItem("costreno_location_dismissed") === "1";
  return !confirmed && !dismissed;
}

function shouldSkipPath(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/estimate") ||
    pathname.startsWith("/login")
  );
}

export function WelcomeEstimatePrompt() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) === "1") return;
    if (shouldSkipPath(pathname)) {
      setOpen(false);
      return;
    }

    let cancelled = false;
    let scheduled = false;

    const tryOpen = () => {
      if (cancelled || scheduled) return;
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
      if (shouldSkipPath(window.location.pathname)) return;
      if (locationFlowPending(window.location.pathname)) return;
      scheduled = true;
      window.clearInterval(interval);
      window.setTimeout(() => {
        if (!cancelled) setOpen(true);
      }, 350);
    };

    tryOpen();
    const interval = window.setInterval(tryOpen, 700);
    const onLocationDone = () => tryOpen();
    window.addEventListener("costreno:location-done", onLocationDone);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("costreno:location-done", onLocationDone);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      setVisibleCount(0);
      return;
    }

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setVisibleCount(MESSAGES.length);
      return;
    }

    setVisibleCount(1);
    const timers = MESSAGES.slice(1).map((_, i) =>
      window.setTimeout(() => setVisibleCount(i + 2), (i + 1) * 900),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [open]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const startEstimate = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
    void navigate({ to: "/estimate", search: {} });
  };

  if (!open) return null;

  const showActions = visibleCount >= MESSAGES.length;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-estimate-title"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss welcome"
          className="absolute right-3 top-3 z-10 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 pt-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h2
            id="welcome-estimate-title"
            className="font-display text-xl font-bold text-ink pr-8"
          >
            Plan with clearer pricing
          </h2>

          <div className="mt-5 space-y-3 min-h-[9.5rem]" aria-live="polite">
            {MESSAGES.slice(0, visibleCount).map((text, i) => (
              <div
                key={i}
                className="rounded-xl rounded-tl-sm bg-muted/40 border border-border px-3.5 py-2.5 text-sm text-ink leading-relaxed animate-in fade-in slide-in-from-bottom-1 duration-200"
              >
                {text}
              </div>
            ))}
            {visibleCount < MESSAGES.length && (
              <div className="flex gap-1 px-1 py-1" aria-hidden>
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse [animation-delay:300ms]" />
              </div>
            )}
          </div>

          {showActions && (
            <div className="mt-6 space-y-2.5 animate-in fade-in duration-200">
              <button
                type="button"
                onClick={startEstimate}
                className="w-full h-11 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition inline-flex items-center justify-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                Start my estimate
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="w-full h-11 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted/50 transition"
              >
                Maybe later
              </button>
              <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                Planning ranges only. Always compare multiple written contractor quotes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
