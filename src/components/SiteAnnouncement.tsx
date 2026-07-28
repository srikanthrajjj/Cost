import { useCallback, useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";

const STORAGE_KEY = "costreno-announce-kitchen-2026";
const REPORT_HREF = "/guides/2026-kitchen-remodeling-cost-report";
const OFFSET_VAR = "--site-announce-offset";

/**
 * Top-of-site announcement for the 2026 kitchen cost report.
 * Persists dismiss in localStorage; hidden on /admin.
 */
export function SiteAnnouncement() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [visible, setVisible] = useState(false);

  const hideOnAdmin = pathname.startsWith("/admin");

  const clearOffset = useCallback(() => {
    document.documentElement.style.removeProperty(OFFSET_VAR);
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore quota / private mode */
    }
    setVisible(false);
    clearOffset();
  }, [clearOffset]);

  useEffect(() => {
    if (hideOnAdmin) {
      setVisible(false);
      clearOffset();
      return;
    }
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        setVisible(false);
        clearOffset();
        return;
      }
    } catch {
      /* show banner if storage unavailable */
    }
    setVisible(true);
  }, [hideOnAdmin, clearOffset]);

  useEffect(() => {
    if (!visible || hideOnAdmin) {
      clearOffset();
      return;
    }

    const el = document.getElementById("site-announcement");
    if (!el) return;

    const applyOffset = () => {
      document.documentElement.style.setProperty(OFFSET_VAR, `${el.offsetHeight}px`);
    };
    applyOffset();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(applyOffset) : null;
    ro?.observe(el);
    window.addEventListener("resize", applyOffset);

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", applyOffset);
      clearOffset();
    };
  }, [visible, hideOnAdmin, clearOffset]);

  useEffect(() => {
    if (!visible || hideOnAdmin) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, hideOnAdmin, dismiss]);

  if (!visible || hideOnAdmin) return null;

  return (
    <div
      id="site-announcement"
      role="region"
      aria-label="Site announcement"
      className="sticky top-0 z-50 border-b border-primary/20 bg-primary text-primary-foreground"
    >
      <div className="container-x flex items-center justify-between gap-3 py-2.5">
        <p className="text-sm leading-snug min-w-0">
          <span className="font-medium">2026 kitchen remodeling cost report:</span>{" "}
          <span className="text-primary-foreground/90">what Americans are really paying</span>
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={REPORT_HREF}
            className="inline-flex items-center rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent/90 transition-colors"
          >
            Read report
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss announcement"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
