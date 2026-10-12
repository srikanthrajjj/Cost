import { FileText, HelpCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { trackToolEvent } from "@/lib/analytics/tool-events";

const SAMPLE_FINDINGS = [
  {
    title: "Permit responsibility",
    quoted: "Permits: by owner",
    finding: "The quote does not say who applies or whether fees are included.",
    question: "Who will obtain the required permits, and where are the fees listed?",
  },
  {
    title: "Material specification",
    quoted: "Architectural asphalt shingles",
    finding: "The material type is listed, but the brand and product line are unclear.",
    question: "Can you include the shingle brand, product line, and warranty in writing?",
  },
  {
    title: "Disposal scope",
    quoted: "Remove existing roof",
    finding: "Removal is listed, but hauling away debris and cleanup are not explicit.",
    question: "Does this price include debris disposal and final cleanup?",
  },
] as const;

export function QuoteReviewSample({ compact = false }: { compact?: boolean }) {
  return (
    <article
      aria-label="Illustrative contractor quote review"
      className="rounded-2xl border border-primary/15 bg-white shadow-sm overflow-hidden"
    >
      <div className="border-b border-border bg-primary/[0.04] px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
            <FileText className="h-4 w-4" aria-hidden /> Quote review preview
          </span>
          <span className="rounded-full border border-primary/15 px-2.5 py-1 text-[10px] font-semibold text-primary">
            Illustrative example
          </span>
        </div>
        <h2 className="mt-3 font-display text-xl font-bold text-ink sm:text-2xl">
          Know what to ask next
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A roofing quote, explained in plain English.
        </p>
      </div>

      <div className="divide-y divide-border/70 px-5 sm:px-6">
        {SAMPLE_FINDINGS.map((item) => (
          <div key={item.title} className="py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <HelpCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              {item.title}
              <span className="ml-auto text-[10px] font-medium text-muted-foreground">Clarify</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Quote says: &quot;{item.quoted}&quot;
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink">{item.finding}</p>
            {!compact && (
              <div className="mt-3 rounded-lg bg-muted/40 px-3 py-2.5">
                <p className="text-xs font-semibold text-primary">Ask your contractor</p>
                <p className="mt-1 text-sm leading-relaxed text-ink">{item.question}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-border px-5 py-4 sm:px-6">
        {!compact && (
          <p className="mb-3 flex items-start gap-2 text-sm leading-relaxed text-ink">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            Ask for a revised written scope before comparing the final prices.
          </p>
        )}
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          This is a fictional example to show the review format, not a customer quote, live AI
          analysis, or verified local price. Confirm findings with your contractor.
        </p>
        {compact && (
          <a
            href="/quote-analyzer#sample-review"
            onClick={() => trackToolEvent("sample_review_opened")}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            See the sample questions <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        )}
      </div>
    </article>
  );
}
