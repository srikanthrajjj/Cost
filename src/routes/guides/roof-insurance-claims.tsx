import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { ROOF_CLUSTER_RELATED, ROOF_TOPIC } from "@/lib/guides/roof-cluster";
import { buildRoofGuideHead } from "@/lib/guides/roof-guide-head";

const PATH = "/guides/roof-insurance-claims";

const FAQS = [
  {
    q: "Does homeowners insurance cover a full roof replacement?",
    a: "Insurance covers sudden, accidental damage from covered perils like hail, wind, or fallen trees. It generally does not cover age, wear, or lack of maintenance.",
  },
  {
    q: "Should I file a claim before calling a roofer?",
    a: "Document damage with photos first, then contact your insurer to open a claim. You can also get an independent inspection, but avoid starting permanent repairs before the adjuster documents the loss.",
  },
  {
    q: "What is a supplement in a roof claim?",
    a: "A supplement is a request for additional payment when the adjuster's estimate misses code-required items, hidden deck damage, or scope the initial inspection did not capture.",
  },
];

export const Route = createFileRoute("/guides/roof-insurance-claims")({
  component: RoofInsuranceClaimsGuide,
  head: () =>
    buildRoofGuideHead({
      path: PATH,
      metaTitle: "Roof insurance claims guide",
      metaDescription:
        "Learn how roof insurance claims work after storm damage. Document losses, work with adjusters, understand deductibles, and review contractor bids before you settle.",
      headline: "Roof insurance claims guide",
      breadcrumbTitle: "Roof insurance claims",
      faqs: FAQS,
    }),
});

function RoofInsuranceClaimsGuide() {
  return (
    <GuideArticle
      title="Roof insurance claims"
      description="Storm damage can turn a roof project into an insurance claim. Know what is covered, how to document damage, and when to push back on a low settlement."
      lastUpdated="July 27, 2026"
      cluster={ROOF_TOPIC}
      faqs={FAQS}
      related={ROOF_CLUSTER_RELATED.filter((g) => g.href !== PATH).slice(0, 6)}
    >
      <p>
        Insurance and a planned replacement follow different paths. If hail or wind damaged your
        roof, your policy may pay for repairs or replacement minus your deductible. If the roof
        simply reached end of life, you will likely pay out of pocket or through{" "}
        <a href="/guides/roof-financing" className="text-primary hover:underline">
          financing
        </a>
        .
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-2">What is usually covered</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Wind, hail, lightning, and fallen tree damage (subject to policy terms)</li>
        <li>Sudden leaks caused by a covered event</li>
        <li>Code-required upgrades when local law mandates them during repair</li>
      </ul>
      <p>
        Normal aging, curling shingles from sun exposure, and deferred maintenance are typically
        excluded. Read your declarations page for wind and hail sub-limits in high-risk regions.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Step-by-step after damage</h2>
      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong className="text-ink">Document:</strong> Photo and video all slopes, gutters, siding,
          and interior stains. Note the date of the storm.
        </li>
        <li>
          <strong className="text-ink">Mitigate:</strong> Use tarps or temporary patches to prevent
          further interior damage. Keep receipts for emergency work.
        </li>
        <li>
          <strong className="text-ink">File the claim:</strong> Call your carrier or use their app.
          You will receive a claim number and adjuster assignment.
        </li>
        <li>
          <strong className="text-ink">Meet the adjuster:</strong> Walk the roof together if safe.
          Point out soft spots, granule loss, and lifted flashing.
        </li>
        <li>
          <strong className="text-ink">Review the estimate:</strong> Compare scope to contractor bids.
          Look for missing line items like drip edge, ice barrier, or deck replacement.
        </li>
        <li>
          <strong className="text-ink">Choose a contractor:</strong> You are not required to use the
          insurer&apos;s preferred vendor, but verify licensing and warranty terms yourself.
        </li>
      </ol>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Actual cash value vs replacement cost</h2>
      <p>
        Some policies pay replacement cost value (RCV) after work is complete, while others start
        with actual cash value (ACV) minus depreciation. Understand whether depreciation is
        recoverable after install and what documentation the carrier needs for final payment.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">When estimates disagree</h2>
      <p>
        It is common for a contractor bid to exceed the adjuster&apos;s first estimate. Missing
        code items, steep pitch charges, or hidden deck rot are valid reasons to file a supplement.
        Provide photos, measurements, and itemized quotes. Keep communication in writing.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Red flags to avoid</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Contractors who offer to waive your deductible (often illegal)</li>
        <li>Pressure to sign an assignment of benefits without understanding it</li>
        <li>Starting full replacement before the claim is documented</li>
        <li>Quotes that do not separate homeowner portion from insurance scope</li>
      </ul>

      <p>
        Before you accept any bid, run it through our{" "}
        <a href="/quote-analyzer" className="text-primary hover:underline">
          quote analyzer
        </a>{" "}
        or use the{" "}
        <a href="/guides/roof-quote-review" className="text-primary hover:underline">
          roof quote review checklist
        </a>
        . For general pricing context, see the{" "}
        <a href="/guides/roof-replacement" className="text-primary hover:underline">
          roof replacement cost guide
        </a>
        .
      </p>

      <p className="text-sm">
        CostReno is building an AI insurance claims tool.{" "}
        <a href="/insurance-claims" className="text-primary hover:underline">
          Join the waitlist
        </a>{" "}
        for early access.
      </p>
    </GuideArticle>
  );
}
