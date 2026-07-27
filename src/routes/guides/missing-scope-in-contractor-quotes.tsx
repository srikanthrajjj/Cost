import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { buildQuoteGuideHead } from "@/lib/guides/quote-guide-head";

const PATH = "/guides/missing-scope-in-contractor-quotes";

const FAQS = [
  {
    q: "What does missing scope mean on a quote?",
    a: "Missing scope is work that is required for a complete job but not listed or clearly excluded. It often becomes a change order later.",
  },
  {
    q: "What is commonly missing from renovation quotes?",
    a: "Permits, disposal, protection, underlayment or waterproofing details, electrical capacity upgrades, and finish trim are frequent gaps.",
  },
  {
    q: "How do I fix a quote with missing scope?",
    a: "Send a written checklist and ask the contractor to price or exclude each item before you compare totals or sign.",
  },
];

export const Route = createFileRoute("/guides/missing-scope-in-contractor-quotes")({
  component: MissingScopeGuide,
  head: () =>
    buildQuoteGuideHead({
      path: PATH,
      metaTitle: "Missing scope in contractor quotes",
      metaDescription:
        "Spot missing scope in contractor quotes before you sign. Common gaps that turn a cheap bid into expensive change orders.",
      headline: "Missing scope in contractor quotes",
      faqs: FAQS,
    }),
});

function MissingScopeGuide() {
  return (
    <GuideArticle
      title="Missing scope in contractor quotes"
      description="Incomplete scope is the quiet way a low bid becomes expensive. Use this checklist before you hire."
      lastUpdated="July 27, 2026"
      cluster={{ label: "Contractor quotes", href: "/topics/quotes" }}
      faqs={FAQS}
      related={[
        { title: "How to read a contractor quote", href: "/guides/how-to-read-a-contractor-quote" },
        { title: "Contractor quote too high", href: "/guides/contractor-quote-too-high" },
        { title: "Analyze a quote with CostReno", href: "/quote-analyzer" },
      ]}
    >
      <p>
        Missing scope is not always intentional. Busy contractors reuse templates, and walkthrough
        assumptions never make it into the PDF. You still pay for the gap later. Catch it while
        bids are still competing.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Build a completeness checklist</h2>
      <p>
        For every project type, list the work that must happen for a finished result. Roofing needs
        tear-off, underlayment, flashing, ventilation, disposal, and permits. Kitchens need
        cabinets, counters, plumbing, electrical, protection, and cleanup. If a line is absent, ask
        why.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Read exclusions as scope decisions</h2>
      <p>
        An exclusion is a deliberate no. That can be fine when you understand it. It is dangerous
        when the excluded work is required and unpriced. Ask for a contingency price on likely
        exclusions such as decking repair or electrical panel upgrades.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Compare the quiet lines across bids</h2>
      <p>
        Disposal, protection, haul-away, patching, and final cleaning often separate a complete bid
        from a thin one. If only one contractor includes them, adjust the other totals before you
        decide.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Ask for a revised quote in writing</h2>
      <p>
        Do not accept verbal promises that missing items are included. Request an updated PDF. The
        written version is what you can enforce.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Let CostReno flag gaps fast</h2>
      <p>
        Upload the quote to the quote analyzer to surface likely missing scope and vague language.
        Use that list as your follow-up email to the contractor.
      </p>
    </GuideArticle>
  );
}
