import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { buildQuoteGuideHead } from "@/lib/guides/quote-guide-head";

const PATH = "/guides/how-to-compare-contractor-quotes";

const FAQS = [
  {
    q: "How many contractor quotes should I get?",
    a: "Three is a practical target for most renovations. Two can work if scopes match. One quote leaves you without a fairness check.",
  },
  {
    q: "How do I compare quotes with different scopes?",
    a: "Build a shared checklist of inclusions and exclusions. Ask each contractor to price the same checklist before you compare totals.",
  },
  {
    q: "Should I always pick the middle bid?",
    a: "Not automatically. Pick the clearest complete scope with realistic pricing and strong credentials, whether that is the middle or another bid.",
  },
];

export const Route = createFileRoute("/guides/how-to-compare-contractor-quotes")({
  component: CompareQuotesGuide,
  head: () =>
    buildQuoteGuideHead({
      path: PATH,
      metaTitle: "How to compare contractor quotes",
      metaDescription:
        "Compare contractor quotes side by side. Align scope, materials, allowances, and warranties before you choose a bid.",
      headline: "How to compare contractor quotes",
      faqs: FAQS,
    }),
});

function CompareQuotesGuide() {
  return (
    <GuideArticle
      title="How to compare contractor quotes"
      description="Side-by-side comparison only works when every bid prices the same job. Use this method before you hire."
      lastUpdated="July 27, 2026"
      cluster={{ label: "Contractor quotes", href: "/topics/quotes" }}
      faqs={FAQS}
      related={[
        { title: "How to read a contractor quote", href: "/guides/how-to-read-a-contractor-quote" },
        { title: "Is this contractor quote fair?", href: "/guides/is-contractor-quote-fair" },
        { title: "Compare quotes in CostReno", href: "/compare-quotes" },
      ]}
    >
      <p>
        Comparing quotes is where homeowners either protect their budget or accidentally pick an
        incomplete bid. The goal is not to average three numbers. The goal is to force every
        contractor to price the same scope, then judge price, clarity, and risk.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">1. Create one shared scope sheet</h2>
      <p>
        List rooms, materials, tear-out, disposal, permits, protections, and cleanup. Send the same
        sheet to each contractor. If a bid ignores a line, treat it as missing until it is priced
        or excluded in writing.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">2. Normalize materials and allowances</h2>
      <p>
        Convert vague material language into named products or allowance amounts. If one bid
        includes quartz and another includes laminate, the totals are not comparable until you
        adjust for the finish level.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">3. Compare risk terms, not just price</h2>
      <p>
        Payment schedule, change-order rules, warranty length, and insurance certificates can make
        a slightly higher bid safer. A low bid with a large deposit and weak exclusions is often
        the riskier choice.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">4. Score each bid the same way</h2>
      <p>
        Use a simple scorecard: scope completeness, itemization quality, material clarity, local
        price realism, timeline, and credentials. The highest score usually beats the lowest total.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">5. Use CostReno compare quotes</h2>
      <p>
        Upload two or more bids to compare quotes for a faster side-by-side view of pricing and
        gaps. For a single PDF, start with the quote analyzer, then request a second bid using the
        same scope sheet.
      </p>
    </GuideArticle>
  );
}
