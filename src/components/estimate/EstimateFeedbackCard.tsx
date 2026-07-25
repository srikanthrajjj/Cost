import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Star, X } from "lucide-react";
import { submitQuoteFeedback } from "@/lib/feedback/submit-quote-feedback";
import { cn } from "@/lib/utils";

type Helpful = "yes" | "somewhat" | "no";
type UseAgain = "yes" | "maybe" | "no";

interface EstimateFeedbackCardProps {
  /** Stable key per estimate so the card only opens once per result. */
  estimateKey: string;
  projectType?: string;
  confidence?: number;
}

/** Stars map onto the existing accuracy field so no schema change is needed. */
function accuracyFromRating(rating: number): "accurate" | "somewhat" | "not_accurate" | undefined {
  if (rating >= 4) return "accurate";
  if (rating === 3) return "somewhat";
  if (rating >= 1) return "not_accurate";
  return undefined;
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
      aria-pressed={selected}
      className={cn(
        "px-3 py-1.5 rounded-lg text-xs font-medium border transition duration-200",
        selected
          ? "border-[#082A4B] bg-[#082A4B] text-white"
          : "border-border bg-white text-muted-foreground hover:bg-muted/40 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function dismissedKey(estimateKey: string) {
  return `costreno_estimate_feedback:${estimateKey}`;
}

function alreadyHandled(estimateKey: string): boolean {
  try {
    return sessionStorage.getItem(dismissedKey(estimateKey)) === "1";
  } catch {
    return false;
  }
}

function markHandled(estimateKey: string) {
  try {
    sessionStorage.setItem(dismissedKey(estimateKey), "1");
  } catch {
    // Session storage can be unavailable in private mode; not critical.
  }
}

const EMOJIS = [
  { emoji: "⭐", delay: "0ms" },
  { emoji: "💬", delay: "120ms" },
  { emoji: "🏠", delay: "240ms" },
] as const;

export function EstimateFeedbackCard({
  estimateKey,
  projectType,
  confidence,
}: EstimateFeedbackCardProps) {
  const titleId = useId();
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [helpful, setHelpful] = useState<Helpful | "">("");
  const [useAgain, setUseAgain] = useState<UseAgain | "">("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Show once per estimate, shortly after the results render.
  useEffect(() => {
    if (alreadyHandled(estimateKey)) return;
    const timer = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(timer);
  }, [estimateKey]);

  const close = () => {
    markHandled(estimateKey);
    setVisible(false);
  };

  const canSubmit =
    rating > 0 || Boolean(helpful) || Boolean(useAgain) || comment.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError("");

    const ratingNote = rating > 0 ? `Rating: ${rating}/5` : "";
    const trimmedComment = comment.trim();
    const combinedComment = [ratingNote, trimmedComment].filter(Boolean).join(". ");

    try {
      const result = await submitQuoteFeedback({
        data: {
          accuracy: accuracyFromRating(rating),
          understandable: helpful || undefined,
          useAgain: useAgain || undefined,
          comment: combinedComment || undefined,
          projectType: `estimate:${projectType || "unknown"}`,
          completenessScore: confidence,
        },
      });
      if (!result.success) {
        setError(result.message);
        return;
      }
      setJustSubmitted(true);
      markHandled(estimateKey);
      window.setTimeout(() => setVisible(false), 1600);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible || typeof document === "undefined") return null;

  const activeRating = hoverRating || rating;

  return createPortal(
    <aside
      role="complementary"
      aria-labelledby={titleId}
      className={cn(
        "fixed bottom-4 right-4 z-[80] w-[min(100vw-2rem,22rem)] max-sm:left-4",
        "rounded-2xl border border-[#082A4B]/12 bg-white p-5",
        "shadow-xl shadow-[#082A4B]/12 outline-none",
        "animate-in fade-in slide-in-from-bottom-4 duration-200",
      )}
    >
      <button
        type="button"
        onClick={close}
        className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-ink transition duration-200"
        aria-label="Close feedback"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center justify-center gap-2 mb-3 pr-6" aria-hidden>
        {EMOJIS.map(({ emoji, delay }) => (
          <span
            key={emoji}
            className="inline-block text-3xl leading-none select-none animate-feedback-emoji"
            style={{ animationDelay: delay }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="mb-4 text-center pr-2">
        <h2 id={titleId} className="text-base font-bold text-[#082A4B]">
          How did we do?
        </h2>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Tap a star and share a quick thought. Your feedback helps us improve CostReno for
          homeowners like you.
        </p>
      </div>

      {justSubmitted ? (
        <div className="flex items-center gap-2 rounded-lg bg-accent/5 border border-accent/20 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
          <p className="text-sm text-ink">Thanks. Your feedback helps us improve CostReno.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset>
            <legend className="sr-only">Rate this estimate</legend>
            <div
              className="flex items-center justify-center gap-0.5"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onFocus={() => setHoverRating(value)}
                  onBlur={() => setHoverRating(0)}
                  aria-label={`${value} of 5 stars`}
                  aria-pressed={rating === value}
                  className="p-1 rounded-md transition duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#082A4B]/30"
                >
                  <Star
                    className={cn(
                      "h-10 w-10 transition-colors duration-200",
                      value <= activeRating
                        ? "fill-[#f59e0b] text-[#f59e0b]"
                        : "fill-transparent text-[#082A4B]/30",
                    )}
                    strokeWidth={1.75}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-1.5 text-center text-xs font-semibold text-[#082A4B]">
                {rating} of 5
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend className="text-xs font-semibold text-[#082A4B] mb-2">
              Was this price range helpful?
            </legend>
            <div className="flex flex-wrap gap-2">
              <OptionPill selected={helpful === "yes"} onClick={() => setHelpful("yes")}>
                Yes
              </OptionPill>
              <OptionPill selected={helpful === "somewhat"} onClick={() => setHelpful("somewhat")}>
                Somewhat
              </OptionPill>
              <OptionPill selected={helpful === "no"} onClick={() => setHelpful("no")}>
                No
              </OptionPill>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-semibold text-[#082A4B] mb-2">
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
              htmlFor="estimate-feedback-comment"
              className="text-xs font-semibold text-[#082A4B] mb-2 block"
            >
              Anything else? <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="estimate-feedback-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              maxLength={1000}
              placeholder="What would make this estimate more useful?"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-[#082A4B]/30"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex flex-wrap items-center gap-3 pt-0.5">
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Sending..." : "Submit feedback"}
            </button>
            <button
              type="button"
              onClick={close}
              className="text-xs font-medium text-muted-foreground hover:text-ink transition duration-200"
            >
              Maybe later
            </button>
          </div>
        </form>
      )}
    </aside>,
    document.body,
  );
}
