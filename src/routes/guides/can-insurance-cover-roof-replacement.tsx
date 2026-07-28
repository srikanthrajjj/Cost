import { createFileRoute } from "@tanstack/react-router";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { ROOF_CLUSTER_RELATED, ROOF_TOPIC } from "@/lib/guides/roof-cluster";
import { buildRoofGuideHead } from "@/lib/guides/roof-guide-head";

const PATH = "/guides/can-insurance-cover-roof-replacement";

const FAQS = [
  {
    q: "Does homeowners insurance cover roof replacement?",
    a: "Only for covered perils (typically wind, hail, fire, falling objects, and sudden accidental damage). Wear and tear, age-related deterioration, poor maintenance, and gradual leaks are excluded. Most policies require the roof to be damaged by a sudden event, not just old.",
  },
  {
    q: "What is the difference between ACV and RCV coverage?",
    a: "ACV (Actual Cash Value) pays depreciated value (roof age and condition reduce the payout). RCV (Replacement Cost Value) pays full replacement cost minus deductible, often in two payments: ACV upfront, recoverable depreciation after completion. RCV is strongly preferred for roof claims.",
  },
  {
    q: "Will insurance cover a 20-year-old roof?",
    a: "Possibly, but many carriers switch to ACV-only after 15-20 years, or exclude roofs past a certain age. Some offer a roof endorsement for RCV on older roofs. If the roof is near end-of-life, insurers may deny the claim as maintenance-related rather than storm damage.",
  },
  {
    q: "How does the insurance claim process work for roof damage?",
    a: "1) Document damage (photos/video). 2) File claim. 3) Adjuster inspects. 4) Insurer issues scope/estimate (often Xactimate). 5) You hire a roofer. 6) Roofer supplements if scope is low. 7) Work completes. 8) Submit final invoice for recoverable depreciation (RCV policies).",
  },
  {
    q: "Can I choose my own roofing contractor?",
    a: "Yes. You are not required to use the insurer's preferred vendor. A local, licensed, insured roofer who works with insurance supplements daily will often get you a better scope and warranty than a national preferred vendor.",
  },
  {
    q: "What if the insurance estimate is too low?",
    a: "Your roofer writes a supplement with photos, measurements, and code/manufacturer requirements. Most supplements are approved. If the adjuster and roofer disagree, you can request a re-inspection, appraisal clause, or public adjuster (fee: 10-20% of additional recovery).",
  },
];

export const Route = createFileRoute("/guides/can-insurance-cover-roof-replacement")({
  component: InsuranceRoofGuide,
  head: () =>
    buildRoofGuideHead({
      path: PATH,
      metaTitle: "Can insurance cover roof replacement? (2026 guide)",
      metaDescription:
        "When homeowners insurance pays for a new roof: covered perils, ACV vs RCV, claim process, supplements, contractor choice, and common denials.",
      headline: "Can insurance cover roof replacement?",
      breadcrumbTitle: "Insurance and roof replacement",
      faqs: FAQS,
    }),
});

function InsuranceRoofGuide() {
  return (
    <GuideArticle
      title="Can insurance cover roof replacement?"
      description="Homeowners insurance covers roof replacement only for sudden, accidental damage from covered perils (wind, hail, fire, falling objects). Age, maintenance, and policy type (ACV vs RCV) determine how much you actually receive."
      lastUpdated="July 28, 2026"
      cluster={ROOF_TOPIC}
      faqs={FAQS}
      related={[
        ...ROOF_CLUSTER_RELATED.filter((g) => g.href !== PATH).slice(0, 5),
        { title: "Analyze a roofing quote", href: "/quote-analyzer" },
      ]}
    >
      <p className="mb-6">
        The short answer:{" "}
        <strong>yes, but only for covered perils and subject to your policy terms.</strong> Insurance
        does not pay for old roofs that simply wore out. It pays when a sudden event (hail, wind,
        fire, a tree limb) damages the roof. Even then, your payout depends on ACV vs RCV coverage,
        your deductible, the adjuster&apos;s scope, and whether your roofer can successfully
        supplement the claim.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">
        Covered perils vs maintenance exclusions
      </h2>
      <table className="w-full text-sm mb-6 border border-border rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-muted/30 border-b border-border">
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Typically covered (sudden/accidental)
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
              Typically excluded (gradual/maintenance)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 text-ink">Hail damage (bruising, granule loss, fractures)</td>
            <td className="px-4 py-3 text-muted-foreground">
              Age-related granule loss, cracking, curling
            </td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 text-ink">Wind damage (torn/lifted shingles, creasing)</td>
            <td className="px-4 py-3 text-muted-foreground">
              Poor installation, inadequate fastening
            </td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 text-ink">Falling objects (tree limbs, debris)</td>
            <td className="px-4 py-3 text-muted-foreground">
              Moss/algae, rot from lack of ventilation
            </td>
          </tr>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 text-ink">Fire, lightning, explosion</td>
            <td className="px-4 py-3 text-muted-foreground">Gradual leaks from flashing failure</td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-ink">Vandalism</td>
            <td className="px-4 py-3 text-muted-foreground">
              Manufacturer defects (warranty issue)
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="font-display text-xl font-bold text-ink pt-4">
        ACV vs RCV: the policy detail that changes everything
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-border bg-white p-5">
          <h3 className="font-display text-base font-bold text-ink mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold">
              ACV
            </span>
            Actual Cash Value
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pays <strong>depreciated value</strong> at time of loss. A 15-year-old 30-year shingle
            roof = 50% life used = 50% of replacement cost. You pay the rest out of pocket. Common on
            older roofs or lower-tier policies.
          </p>
        </div>
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
          <h3 className="font-display text-base font-bold text-ink mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
              RCV
            </span>
            Replacement Cost Value
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pays <strong>full replacement cost</strong> minus deductible. Usually paid in two checks:
            (1) ACV upfront, (2) recoverable depreciation after work is complete and final invoice
            submitted. <strong>Preferred.</strong>
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 mb-6">
        <p className="text-xs font-semibold text-amber-800 mb-2">Check your declarations page</p>
        <p className="text-sm text-amber-900 leading-relaxed">
          Look for &quot;Roof Coverage&quot; or &quot;Roof Settlement&quot; endorsement. Many
          carriers now default to ACV for roofs over 15-20 years. An RCV endorsement (often
          $50-$150/year) restores full replacement coverage. If you are unsure, call your agent and
          ask: &quot;Do I have RCV on my roof, and is there an age limitation?&quot;
        </p>
      </div>

      <h2 className="font-display text-xl font-bold text-ink pt-4">
        The claim process: what actually happens
      </h2>
      <ol className="space-y-3 text-sm text-muted-foreground mb-6 list-decimal list-inside">
        <li>
          <strong>Document immediately:</strong> Photos/video of damage, date-stamped. Include wide
          shots and close-ups of hail dents, wind creases, missing shingles.
        </li>
        <li>
          <strong>File the claim:</strong> Call your carrier or use their app. Get a claim number and
          adjuster assignment.
        </li>
        <li>
          <strong>Adjuster inspection:</strong> Be present. Have your roofer attend if possible.
          Point out all damage (adjusters miss things).
        </li>
        <li>
          <strong>Receive the scope/estimate:</strong> Usually an Xactimate report with line items,
          quantities, and prices.{" "}
          <strong>This is a starting point, not a final offer.</strong>
        </li>
        <li>
          <strong>Hire your roofer:</strong> Choose a local, licensed, insured contractor experienced
          with insurance supplements.
        </li>
        <li>
          <strong>Supplement the claim:</strong> Your roofer compares the adjuster&apos;s scope to
          actual code/manufacturer requirements (drip edge, ice and water, valley metal, step
          flashing, ridge vent, permits). Submits supplement with photos and measurements.
        </li>
        <li>
          <strong>Approval and scheduling:</strong> Most supplements are approved within 1-2 weeks.
          Then work is scheduled.
        </li>
        <li>
          <strong>Completion and depreciation recovery (RCV only):</strong> Submit final signed
          invoice to carrier. They release the holdback (recoverable depreciation).
        </li>
      </ol>

      <h2 className="font-display text-xl font-bold text-ink pt-4">
        Common reasons claims are denied or underpaid
      </h2>
      <ul className="space-y-3 text-sm text-muted-foreground mb-6 list-disc list-inside">
        <li>
          <strong>Wear and tear / age exclusion:</strong> Adjuster determines damage is from aging,
          not the storm.
        </li>
        <li>
          <strong>Pre-existing damage:</strong> Evidence of prior leaks, patches, or deterioration.
        </li>
        <li>
          <strong>Improper installation:</strong> Manufacturer specs not followed (nail pattern,
          exposure, ventilation).
        </li>
        <li>
          <strong>Missing code upgrades:</strong> Adjuster omits required ice and water shield, drip
          edge, or ventilation. Your roofer must supplement.
        </li>
        <li>
          <strong>Cosmetic damage only:</strong> Some policies (especially in TX/CO) exclude cosmetic
          hail damage on metal roofs.
        </li>
        <li>
          <strong>Deductible exceeds damage:</strong> Low-severity hail may not meet your deductible
          threshold.
        </li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">Your contractor choice matters</h2>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        You are <strong>not required</strong> to use the insurance company&apos;s &quot;preferred
        vendor.&quot; A local roofer who supplements daily will often:
      </p>
      <ul className="space-y-2 text-sm text-muted-foreground mb-6 list-disc list-inside">
        <li>Identify 15-30% more legitimate line items than the adjuster&apos;s scope</li>
        <li>Ensure code upgrades (ice and water, ventilation) are included</li>
        <li>Handle supplement negotiations directly with the desk adjuster</li>
        <li>Provide a workmanship warranty (5-10 years) vs vendor&apos;s 1-2 years</li>
        <li>Coordinate the depreciation recovery paperwork for RCV policies</li>
      </ul>

      <h2 className="font-display text-xl font-bold text-ink pt-4">
        Supplements: the normal part of the process
      </h2>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        <strong>Expect supplements.</strong> The adjuster&apos;s first estimate is rarely complete.
        Common supplement items: ice and water shield (code), drip edge (code), valley metal, step
        flashing, chimney/skylight flashing, ridge vent, pipe boots, permit fees, disposal, sales tax
        on materials. A good roofer submits one comprehensive supplement with photos and code
        references. Multiple small supplements slow the process.
      </p>

      <h2 className="font-display text-xl font-bold text-ink pt-4">
        When to involve a public adjuster or attorney
      </h2>
      <ul className="space-y-2 text-sm text-muted-foreground mb-6 list-disc list-inside">
        <li>Carrier denies a clearly covered peril (hail/wind) without valid basis</li>
        <li>Supplement negotiations stall after 2+ rounds</li>
        <li>Claim value is high ($30k+) and carrier engages in delay tactics</li>
        <li>
          You are uncomfortable negotiating (public adjuster fees 10-20% of{" "}
          <em>additional</em> recovery)
        </li>
      </ul>

      <div className="flex flex-wrap gap-3 mb-6">
        <a
          href="/guides/roof-insurance-claims"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition shadow-sm"
        >
          Full roof insurance claims guide
        </a>
        <a
          href="/quote-analyzer"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-muted transition"
        >
          Analyze roofer&apos;s supplement estimate
        </a>
        <a
          href="/guides/roof-quote-review"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-muted transition"
        >
          Roof quote review checklist
        </a>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Have a roofing estimate from your contractor or the adjuster? Upload it to the{" "}
        <a href="/quote-analyzer" className="text-primary underline">
          quote analyzer
        </a>{" "}
        for a line-by-line review against local market rates and code requirements, or use the{" "}
        <a href="/guides/roof-quote-review" className="text-primary underline">
          roof quote review checklist
        </a>{" "}
        to verify scope completeness before you sign.
      </p>
    </GuideArticle>
  );
}
