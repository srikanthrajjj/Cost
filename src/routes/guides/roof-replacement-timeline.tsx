import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { ROOF_CLUSTER_RELATED, ROOF_TOPIC } from "@/lib/guides/roof-cluster";
import { buildRoofGuideHead } from "@/lib/guides/roof-guide-head";

const PATH = "/guides/roof-replacement-timeline";

const FAQS = [
  {
    q: "How long does a typical roof replacement take?",
    a: "Most asphalt shingle roofs on an average home take 1 to 3 days of active work. Larger homes, steep pitches, tile or metal systems, or weather delays can extend the schedule to a week or more.",
  },
  {
    q: "Can I stay in my home during a roof replacement?",
    a: "Usually yes, but expect noise, vibration, and brief access restrictions around the property. Plan parking and protect attic valuables from dust.",
  },
  {
    q: "What causes timeline delays?",
    a: "Rain, material backorders, hidden deck damage, permit inspection timing, and crew scheduling are the most common delays.",
  },
];

export const Route = createFileRoute("/guides/roof-replacement-timeline")({
  component: RoofTimelineGuide,
  head: () =>
    buildRoofGuideHead({
      path: PATH,
      metaTitle: "Roof replacement timeline",
      metaDescription:
        "Plan a roof replacement timeline from inspection through final cleanup. See typical durations, weather contingencies, and inspection milestones.",
      headline: "Roof replacement timeline",
      breadcrumbTitle: "Roof replacement timeline",
      faqs: FAQS,
    }),
});

function RoofTimelineGuide() {
  return (
    <GuideArticle
      title="Roof replacement timeline"
      description="Know what happens before, during, and after tear-off so you can schedule crews, inspections, and interior prep with fewer surprises."
      lastUpdated="July 27, 2026"
      cluster={ROOF_TOPIC}
      faqs={FAQS}
      related={ROOF_CLUSTER_RELATED.filter((g) => g.href !== PATH).slice(0, 6)}
    >
      <p>
        Roof replacements look like a single project, but they move through distinct phases:
        planning, permitting, tear-off, install, inspection, and cleanup. Understanding the
        sequence helps you compare contractor timelines and spot bids that skip important steps.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-2">Typical phase overview</h2>
      <ol className="list-decimal pl-5 space-y-4">
        <li>
          <strong className="text-ink">Inspection and scoping (1 to 2 weeks):</strong> A roofer
          measures the roof, checks deck condition, notes penetrations, and confirms material
          choices. Get this in writing before you sign.
        </li>
        <li>
          <strong className="text-ink">Permits and scheduling (1 to 3 weeks):</strong> Many cities
          require permits before work starts. Crew availability often drives the calendar as much
          as paperwork. See our{" "}
          <a href="/guides/roof-permits" className="text-primary hover:underline">
            roof permits guide
          </a>
          .
        </li>
        <li>
          <strong className="text-ink">Material delivery (2 to 7 days before start):</strong> Shingles
          or panels may arrive on a separate truck. Confirm where materials will sit and who
          protects landscaping and driveways.
        </li>
        <li>
          <strong className="text-ink">Tear-off and dry-in (day 1):</strong> Old roofing comes off,
          damaged decking is replaced, ice and water shield and underlayment go down. This is the
          noisiest day.
        </li>
        <li>
          <strong className="text-ink">Install and flashings (day 1 to 3):</strong> Field material,
          ridge vents, pipe boots, and wall flashings are installed. Steep or complex roofs take
          longer.
        </li>
        <li>
          <strong className="text-ink">Inspection and punch list (1 to 5 days after):</strong> The
          city may inspect before or after completion depending on local rules. Walk the property
          with your contractor for final cleanup.
        </li>
      </ol>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Duration by roof type</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong className="text-ink">Asphalt shingles:</strong> Often 1 to 3 days for a typical
          home.
        </li>
        <li>
          <strong className="text-ink">Metal standing seam:</strong> Commonly 3 to 7 days depending
          on complexity and custom trim.
        </li>
        <li>
          <strong className="text-ink">Tile or slate:</strong> Can run 1 to 2 weeks because of weight,
          underlayment requirements, and slower placement.
        </li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Weather and contingency planning</h2>
      <p>
        Roofers cannot safely dry-in during active rain or high wind. Build a buffer of 2 to 3 days
        beyond the quoted schedule, especially in shoulder seasons. Ask how the crew protects open
        decking overnight if weather turns.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Questions to ask about timeline</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Who pulls permits and books inspections?</li>
        <li>What happens if hidden deck rot is found during tear-off?</li>
        <li>Will the same crew stay on the job start to finish?</li>
        <li>How do you handle weather delays and overnight dry-in?</li>
      </ul>

      <p>
        Pair this timeline with cost planning in our{" "}
        <a href="/guides/roof-replacement" className="text-primary hover:underline">
          roof replacement cost guide
        </a>{" "}
        and{" "}
        <a href="/estimate?project=roof" className="text-primary hover:underline">
          roof estimator
        </a>
        .
      </p>
    </GuideArticle>
  );
}
