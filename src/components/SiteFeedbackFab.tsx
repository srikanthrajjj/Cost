import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouterState } from "@tanstack/react-router";
import { CheckCircle2, MessageSquare, X } from "lucide-react";
import { submitQuoteFeedback } from "@/lib/feedback/submit-quote-feedback";
import { cn } from "@/lib/utils";

type Experience = "good" | "okay" | "poor";
type UseAgain = "yes" | "maybe" | "no";

function OptionPill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-xs font-medium border transition",
        selected
          ? "border-[#082A4B] bg-[#082A4B] text-white"
          : "border-border bg-white text-muted-foreground hover:bg-muted/40 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function mapExperienceToAccuracy(v: Experience): "accurate" | "somewhat" | "not_accurate" {
  if (v === "good") return "accurate";
  if (v === "okay") return "somewhat";
  return "not_accurate";
}

/**
 * Site-wide floating feedback control. Saves into the same quote_feedback store
 * shown in admin (projectType starts with "site:").
 */
export function SiteFeedbackFab() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [experience, setExperience] = useState<Experience | "">("");
  const [useAgain, setUseAgain] = useState<UseAgain | "">("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [dismissed, setDismissed] = useState(false);

  const hideOnAdmin = pathname.startsWith("/admin");
  const isQuoteAnalyzer = pathname.startsWith("/quote-analyzer");

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  if (hideOnAdmin || dismissed) return null;

  const canSubmit = Boolean(experience || useAgain || comment.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await submitQuoteFeedback({
        data: {
          accuracy: experience ? mapExperienceToAccuracy(experience) : undefined,
          useAgain: useAgain || undefined,
          comment: comment.trim() || undefined,
          projectType: `site:${pathname || "/"}`,
          contractor: "site-feedback",
        },
      });
      if (!result.success) {
        setError(result.message);
        return;
      }
      setJustSubmitted(true);
      window.setTimeout(() => {
        setOpen(false);
        setDismissed(true);
      }, 1600);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setJustSubmitted(false);
          setError("");
          setOpen(true);
        }}
        className={cn(
          "fixed z-[70] inline-flex items-center gap-2 rounded-full border border-[#082A4B]/15 bg-[#082A4B] px-3.5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#082A4B]/20 hover:bg-[#0a355c] transition",
          // Keep clear of the quote sidebar Ask AI card (left) and mobile Ask AI FAB (right)
          isQuoteAnalyzer ? "bottom-24 right-4 lg:bottom-5" : "bottom-5 right-4",
        )}
        aria-label="Leave feedback"
      >
        <MessageSquare className="h-4 w-4 shrink-0" aria-hidden />
        <span>Leave feedback</span>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4">
            <button
              type="button"
              className="absolute inset-0 bg-[#082A4B]/45"
              aria-label="Close feedback dialog"
              onClick={() => setOpen(false)}
            />
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              className="relative w-full max-w-md rounded-2xl border border-border bg-white p-5 shadow-2xl outline-none"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-ink transition"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-start gap-3 mb-4 pr-8">
                <div className="w-9 h-9 rounded-lg bg-[#082A4B]/5 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-4 w-4 text-[#082A4B]" />
                </div>
                <div>
                  <h2 id={titleId} className="text-sm font-bold text-ink">
                    Leave feedback
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tell us what worked and what we should improve. Takes about 30 seconds.
                  </p>
                </div>
              </div>

              {justSubmitted ? (
                <div className="flex items-center gap-2 rounded-lg bg-accent/5 border border-accent/20 px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <p className="text-sm text-ink">
                    Thanks. Your feedback helps us improve CostReno.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <fieldset>
                    <legend className="text-xs font-semibold text-ink mb-2">
                      How has CostReno been for you?
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      <OptionPill
                        selected={experience === "good"}
                        onClick={() => setExperience("good")}
                      >
                        Good
                      </OptionPill>
                      <OptionPill
                        selected={experience === "okay"}
                        onClick={() => setExperience("okay")}
                      >
                        Okay
                      </OptionPill>
                      <OptionPill
                        selected={experience === "poor"}
                        onClick={() => setExperience("poor")}
                      >
                        Needs work
                      </OptionPill>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-xs font-semibold text-ink mb-2">
                      Would you use CostReno again?
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      <OptionPill selected={useAgain === "yes"} onClick={() => setUseAgain("yes")}>
                        Yes
                      </OptionPill>
                      <OptionPill
                        selected={useAgain === "maybe"}
                        onClick={() => setUseAgain("maybe")}
                      >
                        Maybe
                      </OptionPill>
                      <OptionPill selected={useAgain === "no"} onClick={() => setUseAgain("no")}>
                        No
                      </OptionPill>
                    </div>
                  </fieldset>

                  <div>
                    <label
                      htmlFor="site-feedback-comment"
                      className="text-xs font-semibold text-ink mb-2 block"
                    >
                      Anything else?{" "}
                      <span className="font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <textarea
                      id="site-feedback-comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      maxLength={1000}
                      placeholder="What should we improve for homeowners like you?"
                      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-[#082A4B]/30"
                    />
                  </div>

                  {error && <p className="text-xs text-red-600">{error}</p>}

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={!canSubmit || submitting}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Sending..." : "Send feedback"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="text-xs font-medium text-muted-foreground hover:text-ink transition"
                    >
                      Maybe later
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
