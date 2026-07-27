import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { buildQuoteGuideHead } from "@/lib/guides/quote-guide-head";

const PATH = "/guides/is-contractor-quote-fair";

const FAQS = [
  {
    q: "How do I know if a contractor quote is fair?",
    a: "A fair quote matches the written scope, uses clear material specs, and lands near other comparable bids and local market ranges for the same work.",
  },
  {
    q: "Is the lowest bid ever fair?",
    a: "It can be, if scope matches the other bids. A low total with missing permits, disposal, or material grades is usually incomplete, not fair.",
  },
  {
    q: "What should I compare besides the total?",
    a: "Compare line items, allowances, exclusions, warranties, payment schedule, and who pulls permits. Those details decide whether prices are truly comparable.",
  },
];

export const Route = createFileRoute("/guides/is-contractor-quote-fair")({
  component: IsQuoteFairGuide,
  head: () =>
    buildQuoteGuideHead({
      path: PATH,
      metaTitle: "Is this contractor quote fair?",
      metaDescription:
        "Check whether a contractor quote is fair by comparing scope, materials, allowances, and local pricing before you hire.",
      headline: "Is this contractor quote fair?",
      faqs: FAQS,
    }),
});

function IsQuoteFairGuide() {
  return (
    <GuideArticle
      title="Is this contractor quote fair?"
      description="Fair is not the same as cheapest. Use scope match, itemization, and local context to judge a bid."
      lastUpdated="July 27, 2026"
      cluster={{ label: "Contractor quotes", href: "/topics/quotes" }}
      faqs={FAQS}
      related={[
        { title: "Contractor quote too high", href: "/guides/contractor-quote-too-high" },
        { title: "How to compare contractor quotes", href: "/guides/how-to-compare-contractor-quotes" },
        { title: "Analyze a quote with CostReno", href: "/quote-analyzer" },
      ]}
    >
      <p>
        Homeowners usually ask whether a quote is fair after seeing a total that feels high or after
        receiving two bids that differ by thousands. The total alone cannot answer the question. A
        fair quote is one that prices a clear, complete scope at a market-realistic level for your
        area.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">1. Match the scope first</h2>
      <p>
        Two quotes are only comparable when they describe the same work. If one includes tear-off,
        disposal, underlayment, and permits and the other does not, the lower number is not a better
        deal. Rewrite the scope into a checklist and mark what each bid includes.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">2. Check material specificity</h2>
      <p>
        Fair quotes name brands, grades, or model series for major materials. Vague labels like
        standard cabinets or quality shingles hide downgrades. Ask for product names in writing so
        you can compare like with like.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">3. Review allowances and exclusions</h2>
      <p>
        Allowances shift risk to you when actual costs run higher. Exclusions create change orders.
        A fair bid states both clearly and explains how overages are approved. Hidden exclusions are
        a common reason a low quote becomes expensive later.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">4. Benchmark against local ranges</h2>
      <p>
        Labor and material pricing vary by metro. Use a ZIP-based CostReno estimate and local city
        pages as a planning band, then compare the quote line by line. A bid above the band can
        still be fair if scope is premium. A bid below the band needs a scope check.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">5. Run the quote through an analyzer</h2>
      <p>
        Upload the PDF or photo to the CostReno quote analyzer for a faster read on missing scope
        and pricing context. If you have two or more bids, use compare quotes for a side-by-side
        review before you sign.
      </p>
    </GuideArticle>
  );
}
