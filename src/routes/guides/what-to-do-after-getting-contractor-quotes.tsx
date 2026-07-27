import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { buildQuoteGuideHead } from "@/lib/guides/quote-guide-head";

const PATH = "/guides/what-to-do-after-getting-contractor-quotes";

const FAQS = [
  {
    q: "What should I do after getting contractor quotes?",
    a: "Align scopes, check credentials and insurance, review payment terms, analyze pricing context, then negotiate or choose in writing.",
  },
  {
    q: "How long should I wait before deciding?",
    a: "Take enough time to compare scopes and verify licenses. Pressure to sign the same day is a reason to pause, not a reason to rush.",
  },
  {
    q: "Do I need to tell contractors I am comparing bids?",
    a: "Yes. Transparent comparison helps them clarify scope. Share a checklist so every bidder prices the same job.",
  },
];

export const Route = createFileRoute("/guides/what-to-do-after-getting-contractor-quotes")({
  component: AfterQuotesGuide,
  head: () =>
    buildQuoteGuideHead({
      path: PATH,
      metaTitle: "What to do after getting contractor quotes",
      metaDescription:
        "A clear next-step checklist after you receive contractor quotes: compare scope, verify credentials, and decide with less stress.",
      headline: "What to do after getting contractor quotes",
      faqs: FAQS,
    }),
});

function AfterQuotesGuide() {
  return (
    <GuideArticle
      title="What to do after getting contractor quotes"
      description="Quotes are the start of a decision process, not the end. Follow these steps before you hire."
      lastUpdated="July 27, 2026"
      cluster={{ label: "Contractor quotes", href: "/topics/quotes" }}
      faqs={FAQS}
      related={[
        { title: "How to compare contractor quotes", href: "/guides/how-to-compare-contractor-quotes" },
        { title: "Questions before signing", href: "/guides/questions-before-signing" },
        { title: "Compare quotes in CostReno", href: "/compare-quotes" },
      ]}
    >
      <p>
        Once bids arrive, the risk is rushing to the lowest number or stalling without a process.
        Use a short sequence: clarify scope, verify the company, check terms, benchmark price, then
        decide in writing.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">1. Align every bid to one checklist</h2>
      <p>
        Send the same inclusion list back to each contractor and ask for confirmation or revised
        pricing. Do not compare totals until the scopes match.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">2. Verify license, insurance, and references</h2>
      <p>
        Confirm active license status where required, ask for insurance certificates, and call at
        least one recent customer. A polished PDF does not replace credential checks.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">3. Review payment and change-order rules</h2>
      <p>
        Read deposits, milestones, allowance overages, and how extras are approved. Weak terms can
        erase the value of a lower total.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">4. Benchmark pricing with CostReno</h2>
      <p>
        Run each bid through the quote analyzer or compare quotes tool. Pair that with a ZIP-based
        estimate so you know whether the range fits your market.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">5. Decide and document</h2>
      <p>
        Choose the clearest complete bid, request any final revisions in writing, and keep the
        signed scope with payment schedule. Tell other bidders you have selected someone so the
        process stays professional.
      </p>
    </GuideArticle>
  );
}
