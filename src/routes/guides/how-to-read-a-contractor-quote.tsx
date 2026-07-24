import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import {
  DEFAULT_OG_IMAGE,
  absoluteUrl,
  buildArticleSchema,
  buildBreadcrumbList,
  buildFaqSchema,
} from "@/lib/seo";

const FAQS = [
  {
    q: "What should every contractor quote include?",
    a: "At minimum: itemized labor and materials, allowances, exclusions, payment schedule, timeline, permit responsibility, cleanup, and warranty terms.",
  },
  {
    q: "Is a low quote always a bad sign?",
    a: "Not always. First check whether scope matches other bids. A lower price with missing underlayment, permits, or disposal is not a better deal.",
  },
  {
    q: "Should quotes use brand and model names?",
    a: "Yes for major materials and equipment. Vague terms like standard shingles or quality cabinets make apples-to-apples comparison difficult.",
  },
];

const PATH = "/guides/how-to-read-a-contractor-quote";

export const Route = createFileRoute("/guides/how-to-read-a-contractor-quote")({
  component: HowToReadQuoteGuide,
  head: () => ({
    meta: [
      { title: "How to read a contractor quote | CostReno" },
      {
        name: "description",
        content:
          "Learn how to read a contractor quote line by line. Check scope, allowances, exclusions, payment terms, and red flags before you sign.",
      },
      { property: "og:title", content: "How to read a contractor quote | CostReno" },
      {
        property: "og:description",
        content:
          "A practical checklist for reading renovation bids: scope, materials, allowances, exclusions, and payment schedules.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: absoluteUrl(PATH) },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl(PATH) }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          buildArticleSchema({
            headline: "How to read a contractor quote",
            description:
              "A practical checklist for reading renovation bids: scope, materials, allowances, exclusions, and payment schedules.",
            path: PATH,
            datePublished: "2026-07-22",
            dateModified: "2026-07-22",
          }),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(buildFaqSchema(FAQS)),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          buildBreadcrumbList([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: "How to read a contractor quote", path: PATH },
          ]),
        ),
      },
    ],
  }),
});

function HowToReadQuoteGuide() {
  return (
    <GuideArticle
      title="How to read a contractor quote"
      description="A clear quote protects your budget. Use this checklist to review scope, pricing, and terms before you commit."
      lastUpdated="July 22, 2026"
      cluster={{ label: "Contractor quotes", href: "/topics/quotes" }}
      faqs={FAQS}
      related={[
        { title: "Signs a contractor quote is inflated", href: "/guides/inflated-quote-signs" },
        { title: "Questions to ask before signing", href: "/guides/questions-before-signing" },
        { title: "Analyze a quote with CostReno", href: "/quote-analyzer" },
      ]}
    >
      <p>
        Most homeowners receive a quote as a PDF or email attachment and focus on the total. The
        total matters, but the structure of the bid tells you whether two contractors are proposing
        the same job.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">1. Confirm the project scope</h2>
      <p>
        Look for a written description of what is included and what is not. For roofing, that may
        mean tear-off layers, underlayment type, drip edge, ventilation, and disposal. For kitchens,
        it may mean cabinet package, countertops, plumbing relocates, and electrical updates.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">2. Check for itemization</h2>
      <p>
        A single lump sum makes comparison hard. Prefer line items for labor, materials, permits,
        and allowances. If a line is an allowance, confirm what happens if actual costs run higher.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">3. Read exclusions carefully</h2>
      <p>
        Exclusions are where surprise costs hide. Common examples: decking replacement, asbestos
        testing, electrical panel upgrades, furniture moving, or drywall repair. Ask for pricing
        contingencies in writing when exclusions are likely.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">4. Review payment and timeline</h2>
      <p>
        A reasonable schedule ties payments to milestones, not a large upfront demand. Confirm
        start window, expected duration, and who pulls permits. If weather or inspections can delay
        work, the quote should say how schedule changes are handled.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">5. Compare with a second bid</h2>
      <p>
        Once you can read one quote clearly, compare it with another using matching scope. If you
        already have two bids, use CostReno compare quotes for a side-by-side review. If you have
        one, start with the quote analyzer.
      </p>
    </GuideArticle>
  );
}
