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
    q: "How many questions should I ask a contractor?",
    a: "Focus on 8 to 12 high-impact questions covering license, insurance, scope, timeline, payment, and change orders. Quality matters more than quantity.",
  },
  {
    q: "Should I ask for references?",
    a: "Yes. Ask for recent local projects similar to yours, then verify permit history and speak with at least two homeowners when possible.",
  },
  {
    q: "What if the contractor avoids written answers?",
    a: "Treat that as a warning sign. Major terms should be in the contract, not left as verbal promises.",
  },
];

const PATH = "/guides/questions-before-signing";

export const Route = createFileRoute("/guides/questions-before-signing")({
  component: QuestionsBeforeSigningGuide,
  head: () => ({
    meta: [
      { title: "Questions to ask a contractor before signing | CostReno" },
      {
        name: "description",
        content:
          "Key questions to ask a contractor before you sign. Cover licensing, insurance, scope, change orders, payment schedule, and timeline.",
      },
      { property: "og:title", content: "Questions to ask a contractor before signing | CostReno" },
      {
        property: "og:description",
        content:
          "A practical question list for homeowners reviewing renovation contracts and contractor bids.",
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
            headline: "Questions to ask a contractor before signing",
            description:
              "A practical question list for homeowners reviewing renovation contracts and contractor bids.",
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
            { name: "Questions before signing", path: PATH },
          ]),
        ),
      },
    ],
  }),
});

function QuestionsBeforeSigningGuide() {
  return (
    <GuideArticle
      title="Questions to ask a contractor before signing"
      description="Ask these questions before you commit. Clear answers reduce change orders, payment disputes, and scope surprises."
      lastUpdated="July 22, 2026"
      cluster={{ label: "Contractor quotes", href: "/topics/quotes" }}
      faqs={FAQS}
      related={[
        { title: "How to read a contractor quote", href: "/guides/how-to-read-a-contractor-quote" },
        { title: "Signs a contractor quote is inflated", href: "/guides/inflated-quote-signs" },
        { title: "Compare two quotes", href: "/compare-quotes" },
      ]}
    >
      <p>
        A polished quote is not enough. Before you sign, confirm the contractor can legally do the
        work, carry proper insurance, and stand behind the scope in writing.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Credentials and insurance</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Are you licensed for this project type in my city or state?</li>
        <li>Can you provide current general liability and workers compensation certificates?</li>
        <li>Will you pull required permits, and whose name will appear on them?</li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Scope and materials</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>What exact materials and brands are included?</li>
        <li>What is excluded, and how are exclusions priced if needed later?</li>
        <li>Who handles disposal, protection of existing finishes, and final cleanup?</li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Money and schedule</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>What is the payment schedule, and which milestones unlock each payment?</li>
        <li>How are change orders documented and approved?</li>
        <li>What is the expected start window and working duration?</li>
        <li>What warranty covers labor and materials, and who honors it?</li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">How to use the answers</h2>
      <p>
        Write the answers into the contract or an addendum. If two contractors give different
        answers on permits, materials, or exclusions, normalize the scope before comparing price.
        CostReno can help review one quote in depth or compare two bids side by side.
      </p>
    </GuideArticle>
  );
}
