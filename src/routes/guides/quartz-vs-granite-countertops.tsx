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
    q: "Is quartz more expensive than granite?",
    a: "Installed quartz often costs similar to mid or upper granite, depending on brand, thickness, and edge detail. Fabrication and install usually matter as much as the slab price.",
  },
  {
    q: "Which is more durable for a busy kitchen?",
    a: "Quartz is non-porous and resists staining with less sealing. Granite is highly durable but typically needs periodic sealing and can have more natural variation.",
  },
  {
    q: "Can either surface handle heat?",
    a: "Neither should be treated as a trivet. Hot pans can damage resins in quartz and can harm sealers or cause thermal shock risk on stone. Use protective pads for both.",
  },
];

const PATH = "/guides/quartz-vs-granite-countertops";

export const Route = createFileRoute("/guides/quartz-vs-granite-countertops")({
  component: QuartzVsGraniteGuide,
  head: () => ({
    meta: [
      { title: "Quartz vs granite countertops | CostReno" },
      {
        name: "description",
        content:
          "Compare quartz vs granite countertops for cost, maintenance, heat resistance, and kitchen remodel planning before you request contractor quotes.",
      },
      {
        property: "og:title",
        content: "Quartz vs granite countertops | CostReno",
      },
      {
        property: "og:description",
        content:
          "A practical comparison of quartz and granite for kitchen remodels, including cost drivers and maintenance differences.",
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
            headline: "Quartz vs granite countertops",
            description:
              "A practical comparison of quartz and granite for kitchen remodels, including cost drivers and maintenance differences.",
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
            { name: "Quartz vs granite", path: PATH },
          ]),
        ),
      },
    ],
  }),
});

function QuartzVsGraniteGuide() {
  return (
    <GuideArticle
      title="Quartz vs granite countertops"
      description="Choose based on maintenance, look, and total installed cost, not slab price alone."
      lastUpdated="July 22, 2026"
      cluster={{ label: "Kitchen costs", href: "/topics/kitchen" }}
      faqs={FAQS}
      related={[
        { title: "Kitchen remodel cost guide", href: "/guides/kitchen-remodel" },
        { title: "Kitchen remodel cost landing", href: "/kitchen-remodel-cost" },
        { title: "Metal vs asphalt roof", href: "/guides/metal-vs-asphalt-roof" },
      ]}
    >
      <p>
        Quartz and granite are two of the most common kitchen countertop choices. Both can look
        premium installed. The better option depends on how you cook, how much maintenance you want,
        and how your fabricator prices edges, cutouts, and install.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Cost drivers</h2>
      <p>
        Slab price is only part of the total. Edge profile, sink cutouts, seam placement, teardown
        of old counters, and plumbing disconnect/reconnect can add meaningful cost. Ask for an
        installed price with the same edge and sink details on every bid.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Maintenance and staining</h2>
      <p>
        Quartz is engineered and non-porous, so it generally resists stains without sealing. Granite
        is natural stone and usually needs periodic sealing. If you want lower day-to-day care,
        quartz often wins. If you want unique natural patterning, granite may be worth the upkeep.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Heat and durability</h2>
      <p>
        Granite typically handles incidental heat better than quartz, but both deserve trivets.
        Quartz resins can discolor or weaken with high heat. Granite can still chip at edges or
        suffer from poor seam work. Durability depends heavily on fabrication quality.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">How to decide</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Pick quartz for lower sealing needs and consistent patterns.</li>
        <li>Pick granite for natural variation and a classic stone look.</li>
        <li>Compare installed quotes with matching edge, sink, and removal scope.</li>
        <li>Include countertop choices in your full kitchen remodel budget early.</li>
      </ul>
    </GuideArticle>
  );
}
