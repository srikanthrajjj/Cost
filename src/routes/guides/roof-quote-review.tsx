import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { ROOF_CLUSTER_RELATED, ROOF_TOPIC } from "@/lib/guides/roof-cluster";
import { buildRoofGuideHead } from "@/lib/guides/roof-guide-head";

const PATH = "/guides/roof-quote-review";

const FAQS = [
  {
    q: "What should a roofing quote include?",
    a: "Squares or area, tear-off layers, deck repair allowance, underlayment type, shingle brand and line, flashing, ventilation, permits, disposal, warranty terms, and payment schedule.",
  },
  {
    q: "How many roof quotes should I compare?",
    a: "Three written quotes from licensed contractors is a common benchmark. Compare scope first, then price. The lowest total can be missing dry-in, pipe boots, or permit fees.",
  },
  {
    q: "Can CostReno review my roofing quote?",
    a: "Yes. Upload your PDF to the quote analyzer for line-item checks, scope gaps, and flags that often appear on roofing bids.",
  },
];

export const Route = createFileRoute("/guides/roof-quote-review")({
  component: RoofQuoteReviewGuide,
  head: () =>
    buildRoofGuideHead({
      path: PATH,
      metaTitle: "Roof quote review checklist",
      metaDescription:
        "Review a roofing contractor quote line by line. Check tear-off, materials, permits, warranties, and red flags before you sign.",
      headline: "Roof quote review checklist",
      breadcrumbTitle: "Roof quote review",
      faqs: FAQS,
    }),
});

function RoofQuoteReviewGuide() {
  return (
    <GuideArticle
      title="Roof quote review"
      description="Roof quotes hide expensive gaps in a single total. Use this checklist to compare bids fairly and spot missing scope."
      lastUpdated="July 27, 2026"
      cluster={ROOF_TOPIC}
      faqs={FAQS}
      related={[
        { title: "Analyze a quote with CostReno", href: "/quote-analyzer" },
        { title: "Signs a contractor quote is inflated", href: "/guides/inflated-quote-signs" },
        { title: "How to read a contractor quote", href: "/guides/how-to-read-a-contractor-quote" },
        ...ROOF_CLUSTER_RELATED.filter((g) => g.href !== PATH).slice(0, 4),
      ]}
    >
      <p>
        Roofing bids look simple: tear-off, shingles, labor. The difference between a fair price and
        a problem quote is usually scope, not the headline total. Two contractors can be thousands
        apart because one includes ice and water shield, pipe boots, and permits while another
        does not.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-2">Core scope checklist</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong className="text-ink">Roof size:</strong> Quoted in squares (100 sq ft) or measured
          area with pitch factor explained
        </li>
        <li>
          <strong className="text-ink">Tear-off:</strong> Number of existing layers removed and
          disposal included
        </li>
        <li>
          <strong className="text-ink">Decking:</strong> Allowance for rotten deck replacement (per
          sheet or per hour)
        </li>
        <li>
          <strong className="text-ink">Underlayment:</strong> Synthetic or felt, ice and water shield
          in valleys and eaves if code requires
        </li>
        <li>
          <strong className="text-ink">Shingles or panels:</strong> Brand, product line, wind rating,
          and color
        </li>
        <li>
          <strong className="text-ink">Metal details:</strong> Drip edge, valley metal, step flashing,
          pipe boots, chimney saddles
        </li>
        <li>
          <strong className="text-ink">Ventilation:</strong> Ridge vent, box vents, or static vents
          with linear feet specified
        </li>
        <li>
          <strong className="text-ink">Permits and inspections:</strong> See our{" "}
          <a href="/guides/roof-permits" className="text-primary hover:underline">
            roof permits guide
          </a>
        </li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Pricing and terms</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Labor and materials split or clear line items</li>
        <li>Change-order process for hidden deck damage</li>
        <li>Start date and estimated duration (see{" "}
          <a href="/guides/roof-replacement-timeline" className="text-primary hover:underline">
            timeline guide
          </a>
          )
        </li>
        <li>Manufacturer warranty vs workmanship warranty (length and transferability)</li>
        <li>Payment schedule tied to milestones, not 100% upfront</li>
        <li>Cleanup, magnetic nail sweep, and landscaping protection</li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Compare against local context</h2>
      <p>
        Before you judge a total, check what similar projects cost in your market. Use our{" "}
        <a href="/guides/roof-replacement-cost-by-city" className="text-primary hover:underline">
          city roof cost pages
        </a>
        ,{" "}
        <a href="/estimate?project=roof" className="text-primary hover:underline">
          roof estimator
        </a>
        , or{" "}
        <a href="/guides/metal-vs-asphalt-roof" className="text-primary hover:underline">
          material comparison guide
        </a>{" "}
        if you are choosing between asphalt and metal.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Red flags</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Cash-only discount with no written warranty</li>
        <li>Vague terms like premium shingles without a model name</li>
        <li>No permit line on a full tear-off in a regulated city</li>
        <li>Pressure to sign before insurance adjuster visit (storm work)</li>
        <li>Price far below other scoped bids (often missing dry-in or flashings)</li>
      </ul>

      <div className="rounded-xl border border-border bg-muted/20 p-5 not-prose">
        <p className="font-semibold text-ink mb-2">Review your quote with CostReno</p>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a roofing PDF for AI-assisted line-item review, scope gaps, and comparison with
          typical market patterns.
        </p>
        <a
          href="/quote-analyzer"
          className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
        >
          Analyze my roofing quote
        </a>
      </div>
    </GuideArticle>
  );
}
