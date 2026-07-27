import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { buildQuoteGuideHead } from "@/lib/guides/quote-guide-head";

const PATH = "/guides/contractor-payment-schedules";

const FAQS = [
  {
    q: "What is a fair contractor payment schedule?",
    a: "A fair schedule ties payments to completed milestones such as materials ordered, rough-in finished, and final punch list. Avoid large upfront payments for work not yet done.",
  },
  {
    q: "How much deposit is normal?",
    a: "Deposits vary by project and state rules, but a modest deposit to secure scheduling and order materials is common. Be cautious with demands for most of the job cost before work starts.",
  },
  {
    q: "Should I pay cash to get a discount?",
    a: "Be careful. Cash-only requests can weaken paperwork, permits, and insurance protection. Prefer documented payments tied to the written contract.",
  },
];

export const Route = createFileRoute("/guides/contractor-payment-schedules")({
  component: PaymentScheduleGuide,
  head: () =>
    buildQuoteGuideHead({
      path: PATH,
      metaTitle: "Contractor payment schedules",
      metaDescription:
        "Learn what a fair contractor payment schedule looks like, how deposits should work, and which payment terms are red flags.",
      headline: "Contractor payment schedules",
      faqs: FAQS,
    }),
});

function PaymentScheduleGuide() {
  return (
    <GuideArticle
      title="Contractor payment schedules"
      description="Payment terms can protect both sides or leave you exposed. Review the schedule as carefully as the total."
      lastUpdated="July 27, 2026"
      cluster={{ label: "Contractor quotes", href: "/topics/quotes" }}
      faqs={FAQS}
      related={[
        { title: "Questions before signing", href: "/guides/questions-before-signing" },
        { title: "Signs a contractor quote is inflated", href: "/guides/inflated-quote-signs" },
        { title: "Analyze a quote with CostReno", href: "/quote-analyzer" },
      ]}
    >
      <p>
        A renovation quote is incomplete without a payment schedule. The schedule decides how much
        risk you carry if work slows, quality slips, or the relationship ends early. Treat payment
        terms as part of the bid, not fine print.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Prefer milestone payments</h2>
      <p>
        Strong schedules link money to visible progress: deposit, materials on site, rough-in
        complete, finishes installed, and final payment after punch list. That structure keeps
        leverage in place until the job is done.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Watch front-loaded deposits</h2>
      <p>
        Large upfront payments fund the contractor more than the project. Ask what the deposit
        covers, when materials are ordered, and what happens if the start date slips. If the answer
        is vague, renegotiate before signing.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Hold a meaningful final payment</h2>
      <p>
        Keep a final amount until inspections pass and remaining items are finished. Paying 100%
        before punch list work is complete makes small defects harder to resolve.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Document every payment</h2>
      <p>
        Use checks, cards, or transfers that create a record. Match each payment to a contract
        milestone. If change orders add cost, update the schedule in writing instead of stacking
        informal transfers.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Review payment language in the quote</h2>
      <p>
        Upload your bid to the CostReno quote analyzer and confirm the payment schedule is explicit.
        Unclear payment terms are a reason to revise the contract before work begins.
      </p>
    </GuideArticle>
  );
}
