import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { ROOF_CLUSTER_RELATED, ROOF_TOPIC } from "@/lib/guides/roof-cluster";
import { buildRoofGuideHead } from "@/lib/guides/roof-guide-head";

const PATH = "/guides/roof-financing";

const FAQS = [
  {
    q: "What is the most common way to finance a roof replacement?",
    a: "Many homeowners use savings, a home equity line or loan, or a personal loan. Contractor financing and credit cards are also used for smaller projects or short-term gaps.",
  },
  {
    q: "Is contractor financing a good deal?",
    a: "It can be convenient, but compare APR, fees, and deferred-interest terms against bank or credit union options. Promotional 0% periods may charge retroactive interest if not paid in full.",
  },
  {
    q: "Can insurance pay for a new roof?",
    a: "Insurance may cover storm or sudden damage, not routine wear. If damage is storm-related, review our roof insurance claims guide before you sign a financing agreement.",
  },
];

export const Route = createFileRoute("/guides/roof-financing")({
  component: RoofFinancingGuide,
  head: () =>
    buildRoofGuideHead({
      path: PATH,
      metaTitle: "Roof financing options",
      metaDescription:
        "Compare roof financing options including savings, HELOCs, personal loans, and contractor plans. Learn what to check before you borrow for a replacement.",
      headline: "Roof financing options",
      breadcrumbTitle: "Roof financing",
      faqs: FAQS,
    }),
});

function RoofFinancingGuide() {
  return (
    <GuideArticle
      title="Roof financing"
      description="A roof is often a four-figure or five-figure expense. Compare financing paths by cost, speed, and risk before you commit."
      lastUpdated="July 27, 2026"
      cluster={ROOF_TOPIC}
      faqs={FAQS}
      related={ROOF_CLUSTER_RELATED.filter((g) => g.href !== PATH).slice(0, 6)}
    >
      <p>
        Financing should follow a clear scope and a vetted quote. Borrowing before you understand
        tear-off, materials, and warranty terms locks you into a payment for work you have not fully
        evaluated. Start with a budget range from our{" "}
        <a href="/estimate?project=roof" className="text-primary hover:underline">
          roof estimator
        </a>
        , then compare bids using our{" "}
        <a href="/guides/roof-quote-review" className="text-primary hover:underline">
          quote review guide
        </a>
        .
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-2">Common financing options</h2>

      <h3 className="font-semibold text-ink pt-2">Cash or savings</h3>
      <p>
        Paying cash avoids interest and simplifies contractor negotiations. If you have partial
        savings, you can combine cash with a smaller loan to limit finance charges.
      </p>

      <h3 className="font-semibold text-ink pt-2">Home equity line or loan (HELOC / HELOAN)</h3>
      <p>
        Secured by your home, these often offer lower rates than unsecured credit. Closing costs
        and appraisal timelines apply. Best when you have equity and a firm project scope.
      </p>

      <h3 className="font-semibold text-ink pt-2">Personal loan</h3>
      <p>
        Unsecured personal loans fund quickly and do not use your home as collateral. Rates depend
        on credit score and income. Compare total interest over the full term, not just monthly
        payment.
      </p>

      <h3 className="font-semibold text-ink pt-2">Contractor financing</h3>
      <p>
        Many roofers partner with lenders for on-the-spot approval. Read deferred-interest language
        carefully. Ask for the standard APR if promotional terms expire.
      </p>

      <h3 className="font-semibold text-ink pt-2">Insurance proceeds</h3>
      <p>
        If damage is covered, your carrier may issue payment in stages. Understand deductible,
        depreciation, and supplement rules in our{" "}
        <a href="/guides/roof-insurance-claims" className="text-primary hover:underline">
          roof insurance claims guide
        </a>
        .
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">What to compare before signing</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Annual percentage rate (APR) and total interest over the loan term</li>
        <li>Origination fees, prepayment penalties, and late fees</li>
        <li>Whether the loan is secured by your home</li>
        <li>Payment timing relative to project milestones (avoid paying 100% upfront)</li>
        <li>Whether financing ties you to a single contractor without a competitive bid</li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Payment schedule best practices</h2>
      <p>
        Standard roofing contracts use progress payments: deposit, tear-off or dry-in, and final
        balance after completion. Deposits above 25% to 33% deserve scrutiny. Never finance or pay
        the full balance before materials are on site and work has started.
      </p>

      <p>
        For cost context by market, see{" "}
        <a href="/guides/roof-replacement-cost-by-state" className="text-primary hover:underline">
          roof replacement cost by state
        </a>{" "}
        and the main{" "}
        <a href="/guides/roof-replacement" className="text-primary hover:underline">
          roof replacement guide
        </a>
        .
      </p>
    </GuideArticle>
  );
}
