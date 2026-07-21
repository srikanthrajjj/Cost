import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, MessageSquare, Sparkles, X } from "lucide-react";
import { submitQuoteFeedback } from "@/lib/feedback/submit-quote-feedback";
import { cn } from "@/lib/utils";

type Accuracy = "accurate" | "somewhat" | "not_accurate";
type Understandable = "yes" | "somewhat" | "no";
type UseAgain = "yes" | "maybe" | "no";

interface QuoteFeedbackCardProps {
  projectType?: string;
  contractor?: string;
  completenessScore?: number;
  quoteUploadId?: string;
  analysisKey?: string;
  /** Controlled open state from parent (sidebar CTA) */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Fired after successful submit so parent can hide CTAs */
  onSubmitted?: () => void;
  submitted?: boolean;
}

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

function submittedStorageKey(analysisKey: string) {
  return `costreno_feedback_submitted:${analysisKey}`;
}

function wasSubmitted(analysisKey: string): boolean {
  try {
    return sessionStorage.getItem(submittedStorageKey(analysisKey)) === "1";
  } catch {
    return false;
  }
}

function markSubmitted(analysisKey: string) {
  try {
    sessionStorage.setItem(submittedStorageKey(analysisKey), "1");
    sessionStorage.removeItem("costreno_quote_feedback_submitted");
    sessionStorage.removeItem("costreno_quote_feedback_done");
  } catch {
    // ignore
  }
}

const popupOpenAtByKey = new Map<string, number>();

/** Sticky sidebar CTA above Ask AI — attention-seeking but on-brand */
export function QuoteFeedbackSidebarCta({
  onOpen,
  submitted,
}: {
  onOpen: () => void;
  submitted?: boolean;
}) {
  if (submitted) {
    return (
      <div className="mb-3 rounded-xl border border-accent/20 bg-accent/5 px-3 py-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
          <p className="text-xs font-semibold text-ink">Thanks for your feedback</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 relative">
      <div
        className="pointer-events-none absolute -inset-1 rounded-2xl bg-[#082A4B]/10 blur-[2px] animate-pulse motion-reduce:animate-none"
        aria-hidden
      />
      <button
        type="button"
        onClick={onOpen}
        className="relative w-full rounded-xl border-2 border-[#082A4B] bg-[#082A4B] px-3 py-3.5 text-left shadow-md shadow-[#082A4B]/20 hover:bg-[#0a355c] transition"
      >
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-wide text-accent">
                30 seconds
              </span>
            </div>
            <p className="text-sm font-bold text-white leading-snug">Leave feedback</p>
            <p className="text-[11px] text-white/75 mt-0.5 leading-snug">
              Help us improve CostReno for homeowners like you
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

/** Mobile-only floating CTA when sidebar is hidden */
export function QuoteFeedbackMobileCta({
  onOpen,
  submitted,
}: {
  onOpen: () => void;
  submitted?: boolean;
}) {
  if (submitted) return null;
  return (
    <div className="fixed bottom-24 left-4 right-4 z-[80] lg:hidden flex justify-center">
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex items-center gap-2 rounded-full border-2 border-[#082A4B] bg-[#082A4B] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-[#082A4B]/25"
      >
        <MessageSquare className="h-4 w-4 shrink-0" />
        Leave feedback to improve our tool
      </button>
    </div>
  );
}

export function QuoteFeedbackCard({
  projectType,
  contractor,
  completenessScore,
  quoteUploadId,
  analysisKey = "default",
  open,
  onOpenChange,
  onSubmitted,
  submitted = false,
}: QuoteFeedbackCardProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [accuracy, setAccuracy] = useState<Accuracy | "">("");
  const [understandable, setUnderstandable] = useState<Understandable | "">("");
  const [useAgain, setUseAgain] = useState<UseAgain | "">("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Auto-open once per analysis after 5 seconds
  useEffect(() => {
    try {
      sessionStorage.removeItem("costreno_quote_feedback_submitted");
      sessionStorage.removeItem("costreno_quote_feedback_done");
    } catch {
      // ignore
    }

    if (wasSubmitted(analysisKey) || submitted) {
      onSubmitted?.();
      return;
    }

    if (!popupOpenAtByKey.has(analysisKey)) {
      popupOpenAtByKey.set(analysisKey, Date.now() + 5000);
    }
    const openAt = popupOpenAtByKey.get(analysisKey)!;

    let timerId = 0;
    const tick = () => {
      if (wasSubmitted(analysisKey)) return;
      if (Date.now() >= openAt) {
        onOpenChange(true);
        return;
      }
      timerId = window.setTimeout(tick, 200);
    };
    timerId = window.setTimeout(tick, 200);
    return () => window.clearTimeout(timerId);
    // Only re-run when the analysis changes; open handlers are stable enough for this use
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisKey, submitted]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
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
  }, [open, onOpenChange]);

  const canSubmit = Boolean(accuracy || understandable || useAgain || comment.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await submitQuoteFeedback({
        data: {
          accuracy: accuracy || undefined,
          understandable: understandable || undefined,
          useAgain: useAgain || undefined,
          comment: comment.trim() || undefined,
          projectType,
          contractor,
          completenessScore,
          quoteUploadId,
        },
      });
      if (!result.success) {
        setError(result.message);
        return;
      }
      setJustSubmitted(true);
      markSubmitted(analysisKey);
      onSubmitted?.();
      window.setTimeout(() => onOpenChange(false), 1600);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#082A4B]/45"
        aria-label="Close feedback dialog"
        onClick={() => onOpenChange(false)}
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
          onClick={() => onOpenChange(false)}
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
              How did we do?
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Optional. Your answers help us improve quote analysis for homeowners.
            </p>
          </div>
        </div>

        {justSubmitted ? (
          <div className="flex items-center gap-2 rounded-lg bg-accent/5 border border-accent/20 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
            <p className="text-sm text-ink">Thanks. Your feedback helps us improve CostReno.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset>
              <legend className="text-xs font-semibold text-ink mb-2">
                How accurate was this analysis?
              </legend>
              <div className="flex flex-wrap gap-2">
                <OptionPill selected={accuracy === "accurate"} onClick={() => setAccuracy("accurate")}>
                  Accurate
                </OptionPill>
                <OptionPill selected={accuracy === "somewhat"} onClick={() => setAccuracy("somewhat")}>
                  Somewhat accurate
                </OptionPill>
                <OptionPill
                  selected={accuracy === "not_accurate"}
                  onClick={() => setAccuracy("not_accurate")}
                >
                  Not accurate
                </OptionPill>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs font-semibold text-ink mb-2">
                Was the report easy to understand?
              </legend>
              <div className="flex flex-wrap gap-2">
                <OptionPill
                  selected={understandable === "yes"}
                  onClick={() => setUnderstandable("yes")}
                >
                  Yes
                </OptionPill>
                <OptionPill
                  selected={understandable === "somewhat"}
                  onClick={() => setUnderstandable("somewhat")}
                >
                  Somewhat
                </OptionPill>
                <OptionPill selected={understandable === "no"} onClick={() => setUnderstandable("no")}>
                  No
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
                <OptionPill selected={useAgain === "maybe"} onClick={() => setUseAgain("maybe")}>
                  Maybe
                </OptionPill>
                <OptionPill selected={useAgain === "no"} onClick={() => setUseAgain("no")}>
                  No
                </OptionPill>
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="quote-feedback-comment"
                className="text-xs font-semibold text-ink mb-2 block"
              >
                Anything else?{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="quote-feedback-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                maxLength={1000}
                placeholder="What worked well or what should we improve?"
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
                onClick={() => onOpenChange(false)}
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
  );
}
