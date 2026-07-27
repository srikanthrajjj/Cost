import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { ROOF_CLUSTER_RELATED, ROOF_TOPIC } from "@/lib/guides/roof-cluster";
import { buildRoofGuideHead } from "@/lib/guides/roof-guide-head";

const PATH = "/guides/roof-permits";

const FAQS = [
  {
    q: "Do I always need a permit to replace my roof?",
    a: "Most full tear-off replacements require a permit, but rules vary by city and county. Re-roofing over existing layers may be treated differently. Always check your local building department.",
  },
  {
    q: "Who should pull the roof permit?",
    a: "The licensed contractor doing the work should pull the permit in their name. If a homeowner pulls it, they may assume liability for inspections and code compliance.",
  },
  {
    q: "What happens if work starts without a permit?",
    a: "You risk fines, stop-work orders, failed insurance claims, and problems at resale. Some jurisdictions charge double fees for after-the-fact permits.",
  },
];

export const Route = createFileRoute("/guides/roof-permits")({
  component: RoofPermitsGuide,
  head: () =>
    buildRoofGuideHead({
      path: PATH,
      metaTitle: "Roof permits guide",
      metaDescription:
        "Learn when roof replacement permits are required, who should pull them, typical fees, and what inspections to expect before and after install.",
      headline: "Roof permits guide",
      breadcrumbTitle: "Roof permits",
      faqs: FAQS,
    }),
});

function RoofPermitsGuide() {
  return (
    <GuideArticle
      title="Roof permits"
      description="Permits protect you from code violations and resale headaches. Here is what to verify before tear-off starts."
      lastUpdated="July 27, 2026"
      cluster={ROOF_TOPIC}
      faqs={FAQS}
      related={ROOF_CLUSTER_RELATED.filter((g) => g.href !== PATH).slice(0, 6)}
    >
      <p>
        Permits are one of the most overlooked line items on roof quotes. A bid that omits permit
        fees or assumes you will handle paperwork is a scope gap, not a discount. Most municipalities
        treat full roof replacements as structural work that requires review and inspection.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-2">When a permit is usually required</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Full tear-off and replacement of roofing material</li>
        <li>Structural repairs to decking, trusses, or rafters</li>
        <li>Changes to roof pitch, ventilation layout, or penetrations</li>
        <li>Installations in high-wind or wildfire zones with enhanced code requirements</li>
      </ul>
      <p>
        Partial repairs, like replacing a few damaged shingles, may not need a permit in some areas.
        Overlay installs (new shingles over old) are increasingly restricted. Confirm locally rather
        than assuming.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Who pulls the permit</h2>
      <p>
        Reputable roofing contractors pull permits in their company name, pay fees, and schedule
        inspections. You should receive a permit number or copy of the application before work begins.
        Be cautious if a contractor asks you to pull the permit to save money. That can shift
        liability to you if work fails inspection.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Typical permit process</h2>
      <ol className="list-decimal pl-5 space-y-2">
        <li>Contractor submits application with scope, address, and license information</li>
        <li>Building department reviews (same day to 2 weeks depending on jurisdiction)</li>
        <li>Permit posted on site before work starts</li>
        <li>Mid-roof or final inspection after dry-in or completion</li>
        <li>Certificate of completion or signed inspection card for your records</li>
      </ol>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Fees and timeline</h2>
      <p>
        Permit fees often run from $100 to $500 for residential roofs, but high-cost metros can
        charge more. Fees may be flat or based on project valuation. Ask your contractor to list
        permit costs as a separate line item on the quote. Inspection scheduling can add 1 to 3 days
        to the overall{" "}
        <a href="/guides/roof-replacement-timeline" className="text-primary hover:underline">
          project timeline
        </a>
        .
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">What to check on your quote</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Permit fees listed explicitly (not buried in overhead)</li>
        <li>Contractor name matches permit holder</li>
        <li>Inspections included and who schedules them</li>
        <li>Code upgrades (decking, ventilation) addressed if required locally</li>
      </ul>

      <p>
        City pages on CostReno often name the local permit office. Browse{" "}
        <a href="/guides/roof-replacement-cost-by-city" className="text-primary hover:underline">
          roof costs by city
        </a>{" "}
        or{" "}
        <a href="/locations" className="text-primary hover:underline">
          location hubs
        </a>{" "}
        for metro-specific starting points.
      </p>
    </GuideArticle>
  );
}
