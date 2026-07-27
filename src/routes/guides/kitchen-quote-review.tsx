import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { buildQuoteGuideHead } from "@/lib/guides/quote-guide-head";

const PATH = "/guides/kitchen-quote-review";

const FAQS = [
  {
    q: "What should a kitchen remodel quote include?",
    a: "Cabinet package, countertops, appliances if included, plumbing and electrical work, demolition, protection, disposal, permits, allowances, timeline, and warranty terms.",
  },
  {
    q: "Why do kitchen quotes vary so much?",
    a: "Cabinets, layout changes, and appliance packages create large swings. Two bids may look similar until you compare whether walls or plumbing move.",
  },
  {
    q: "What kitchen quote details get missed most often?",
    a: "Electrical capacity upgrades, ventilation ducting, floor leveling, plumbing relocates, and finish hardware allowances are common gaps.",
  },
];

export const Route = createFileRoute("/guides/kitchen-quote-review")({
  component: KitchenQuoteReviewGuide,
  head: () =>
    buildQuoteGuideHead({
      path: PATH,
      metaTitle: "Kitchen remodel quote review",
      metaDescription:
        "Review a kitchen remodel quote line by line. Check cabinets, layout work, allowances, and common missing scope before you sign.",
      headline: "Kitchen remodel quote review",
      faqs: FAQS,
    }),
});

function KitchenQuoteReviewGuide() {
  return (
    <GuideArticle
      title="Kitchen remodel quote review"
      description="Kitchen bids hide cost in cabinets, layout work, and soft allowances. Use this checklist before you hire."
      lastUpdated="July 27, 2026"
      cluster={{ label: "Contractor quotes", href: "/topics/quotes" }}
      faqs={FAQS}
      related={[
        { title: "Kitchen remodel cost guide", href: "/guides/kitchen-remodel" },
        { title: "How to compare contractor quotes", href: "/guides/how-to-compare-contractor-quotes" },
        { title: "Analyze a quote with CostReno", href: "/quote-analyzer" },
      ]}
    >
      <p>
        A kitchen quote can look complete as a total and still omit the work that makes the room
        usable. Review cabinets, counters, mechanicals, and allowances as separate decisions before
        you compare prices.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Confirm cabinet and counter specs</h2>
      <p>
        Ask for stock, semi-custom, or custom language, door style, box construction, and
        countertop material with edge profile. If those details are missing, the total is not ready
        for comparison.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Separate cosmetic work from layout work</h2>
      <p>
        Keeping the layout is usually cheaper than moving sinks, ranges, or walls. If a bid assumes
        a layout change you did not request, ask for a keep-layout alternate. If you do want moves,
        make sure plumbing, electrical, and patching are priced.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Check appliance and electrical scope</h2>
      <p>
        Note whether appliances are owner-supplied or contractor-supplied. Confirm new circuits,
        dedicated outlets, and ventilation ducting. Older homes often need panel or wiring work that
        never appears in a cosmetic-only quote.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Pressure-test allowances</h2>
      <p>
        Lighting, tile, hardware, and faucet allowances are easy to understate. Ask what product
        tier each allowance funds and what happens if you upgrade. Undersized allowances are a
        common reason kitchen budgets overrun.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Analyze the bid, then estimate locally</h2>
      <p>
        Upload the kitchen quote to the CostReno quote analyzer, then run a kitchen estimate for
        your ZIP to see whether the total sits in a realistic local band. For city-specific
        context, open your market page under kitchen costs.
      </p>
    </GuideArticle>
  );
}
