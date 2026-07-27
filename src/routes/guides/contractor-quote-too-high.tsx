import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { buildQuoteGuideHead } from "@/lib/guides/quote-guide-head";

const PATH = "/guides/contractor-quote-too-high";

const FAQS = [
  {
    q: "Why is my contractor quote so high?",
    a: "Common causes include incomplete comparison scope, premium materials, difficult access, high local labor, or padded contingencies. Compare itemized bids before assuming overpricing.",
  },
  {
    q: "What percent above market is too high?",
    a: "There is no fixed percent. Focus on line items. If labor or materials sit far above local norms without a clear reason, ask for a rewrite or get another bid.",
  },
  {
    q: "Should I negotiate or walk away?",
    a: "Negotiate when scope is clear and only a few lines look high. Walk away when the bid is vague, payment terms are aggressive, or the contractor will not itemize.",
  },
];

export const Route = createFileRoute("/guides/contractor-quote-too-high")({
  component: QuoteTooHighGuide,
  head: () =>
    buildQuoteGuideHead({
      path: PATH,
      metaTitle: "Contractor quote too high",
      metaDescription:
        "What to do when a contractor quote feels too high. Separate real cost drivers from padding, then negotiate or get another bid.",
      headline: "Contractor quote too high",
      faqs: FAQS,
    }),
});

function QuoteTooHighGuide() {
  return (
    <GuideArticle
      title="Contractor quote too high"
      description="A high quote may be accurate for the scope, or it may be padded. Use this process before you push back or walk away."
      lastUpdated="July 27, 2026"
      cluster={{ label: "Contractor quotes", href: "/topics/quotes" }}
      faqs={FAQS}
      related={[
        { title: "Is this contractor quote fair?", href: "/guides/is-contractor-quote-fair" },
        { title: "Signs a contractor quote is inflated", href: "/guides/inflated-quote-signs" },
        { title: "Analyze a quote with CostReno", href: "/quote-analyzer" },
      ]}
    >
      <p>
        Seeing a number that feels too high is one of the most common homeowner reactions to a
        renovation bid. Before you negotiate or reject it, separate three possibilities: the scope
        is larger than you thought, local labor and materials genuinely cost that much, or the bid
        is padded or incomplete.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">1. Re-read the scope against your request</h2>
      <p>
        Contractors sometimes quote a fuller job than the walkthrough discussion. Check for added
        tear-out, structural repairs, premium finishes, or whole-home work you did not intend. If
        the scope grew, ask for a version that matches your original request.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">2. Isolate the expensive lines</h2>
      <p>
        Ask for itemization if you do not have it. Mark labor, materials, allowances, permits, and
        contingency. One oversized allowance or vague labor block often explains most of the gap.
        Specific lines are easier to negotiate than a single lump sum.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">3. Check local market context</h2>
      <p>
        High-cost metros and busy seasons raise prices. Use CostReno estimates and local city pages
        for a planning band. If the quote sits far above that band with no access, height, or
        material reason, get a second bid before accepting the number.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">4. Negotiate with facts, not feelings</h2>
      <p>
        Bring a written list of questions: material grade, missing competitors on scope, payment
        schedule, and any lines that look high versus other bids. Good contractors can explain or
        revise. Pressure to decide immediately is a reason to pause.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">5. Use AI review before the next conversation</h2>
      <p>
        Upload the quote to the CostReno quote analyzer to flag missing scope and pricing context.
        Bring that report into your follow-up call so the conversation stays on line items, not
        gut feel.
      </p>
    </GuideArticle>
  );
}
