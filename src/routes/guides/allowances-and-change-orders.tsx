import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { buildQuoteGuideHead } from "@/lib/guides/quote-guide-head";

const PATH = "/guides/allowances-and-change-orders";

const FAQS = [
  {
    q: "What is an allowance on a contractor quote?",
    a: "An allowance is a placeholder budget for a finish or fixture that is not fully selected yet. If the actual product costs more, you usually pay the difference.",
  },
  {
    q: "When are change orders fair?",
    a: "Change orders are fair when the work was unknown, excluded, or requested after signing, and the price and schedule impact are written before the extra work starts.",
  },
  {
    q: "How can I reduce allowance risk?",
    a: "Select materials before signing when possible, set realistic allowances with named product tiers, and require written approval for overages.",
  },
];

export const Route = createFileRoute("/guides/allowances-and-change-orders")({
  component: AllowancesGuide,
  head: () =>
    buildQuoteGuideHead({
      path: PATH,
      metaTitle: "Allowances and change orders",
      metaDescription:
        "Understand allowances and change orders on contractor quotes so surprise costs do not blow your renovation budget.",
      headline: "Allowances and change orders",
      faqs: FAQS,
    }),
});

function AllowancesGuide() {
  return (
    <GuideArticle
      title="Allowances and change orders"
      description="These two line types cause most budget surprises. Learn how to read them before you sign."
      lastUpdated="July 27, 2026"
      cluster={{ label: "Contractor quotes", href: "/topics/quotes" }}
      faqs={FAQS}
      related={[
        { title: "How to read a contractor quote", href: "/guides/how-to-read-a-contractor-quote" },
        { title: "Questions before signing", href: "/guides/questions-before-signing" },
        { title: "Analyze a quote with CostReno", href: "/quote-analyzer" },
      ]}
    >
      <p>
        Allowances and change orders are not automatically bad. They become expensive when they are
        vague, undersized, or approved casually after demolition starts. Treat both as risk tools
        that need clear rules in the quote.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">What an allowance really means</h2>
      <p>
        An allowance holds space for a product you have not finalized, such as tile, lighting, or
        faucets. The contractor is not promising that product at that price forever. If you choose
        a higher grade later, the overage is usually yours.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">How to size allowances fairly</h2>
      <p>
        Ask what product tier the allowance assumes. A $20 per square foot tile allowance is not
        comparable to a $60 designer tile selection. Prefer allowances tied to a named series or a
        showroom quote so both sides share the same expectation.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">When change orders are legitimate</h2>
      <p>
        Hidden rot, outdated wiring, or owner-requested upgrades are common legitimate extras. The
        process matters: written description, price, and schedule impact before work continues. Oral
        approvals are how budgets drift.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Red flags to catch early</h2>
      <p>
        Tiny allowances on major finishes, large unspecified contingency percentages, and contracts
        that let the contractor proceed without signed change orders all raise risk. Fix the
        language before deposits leave your account.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Review the quote before you sign</h2>
      <p>
        Upload the bid to the CostReno quote analyzer and specifically check allowance and exclusion
        language. Clarify every soft number while you still have leverage.
      </p>
    </GuideArticle>
  );
}
