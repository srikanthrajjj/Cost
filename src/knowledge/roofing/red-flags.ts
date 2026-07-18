import type { RedFlag } from "@/types/knowledge";

export const roofingRedFlags: RedFlag[] = [
  {
    flag: "Roofer quotes price per-layer removal instead of total project price",
    severity: "high",
    explanation:
      "Legitimate roofers quote by square foot or total roof area. Per-layer removal fees are a common upsell tactic that inflates final cost. A full tear-off should be a single line item.",
    howToSpot: "Quote says '2-layer removal fee: $500 extra' instead of a total project price",
  },
  {
    flag: "Pressure washing before inspection — 'storm damage restoration' company approach",
    severity: "high",
    explanation:
      "This is a hallmark of insurance scam operations. They pressure wash to make the roof look older, then push for a full replacement via insurance. Legitimate roofers inspect first, clean last.",
    howToSpot:
      "Company calls about 'storm damage in your area,' offers free inspection, pressure washes the roof before assessing",
  },
  {
    flag: "No written warranty — verbal promises only",
    severity: "high",
    explanation:
      "Without a written warranty, you have no recourse if the roof fails in year 3. Reputable roofers provide both manufacturer warranty (materials, 20–50 years) and workmanship warranty (labor, 5–10 years minimum).",
    howToSpot:
      "Contractor says 'we've been doing this for 20 years, we stand behind our work' but won't put warranty terms in writing",
  },
  {
    flag: "Full payment demanded before work begins",
    severity: "high",
    explanation:
      "Industry standard is 10–30% deposit at signing, progress payments during the job, and final payment only after inspection and cleanup. Large upfront payments are a common scam indicator.",
    howToSpot:
      "Contractor demands 50%+ before showing up, refuses itemized payment schedule, asks for cash payment only",
  },
  {
    flag: "No license, insurance, or bonding documentation",
    severity: "high",
    explanation:
      "If a roofer causes damage or a worker gets injured on your property, you could be liable. Always verify general liability insurance and workers' compensation coverage.",
    howToSpot:
      "Contractor can't provide a certificate of insurance, business license number, or references",
  },
  {
    flag: "Same-day 'inspection' and quote after storm damage",
    severity: "high",
    explanation:
      "Reputable roofers need time to properly inspect, measure, and prepare a detailed quote. Same-day quotes are typical of storm-chasing insurance fraud operations.",
    howToSpot:
      "Driver shows up right after a storm offering immediate inspection and insurance claim help",
  },
  {
    flag: "Contractor says 'we'll handle the insurance claim' as the homeowner",
    severity: "high",
    explanation:
      "Insurance claims must be filed by the homeowner. Contractors can accompany the adjuster but cannot file or manage the claim on your behalf. This is a common scam tactic.",
    howToSpot:
      "Contractor says 'don't worry about the insurance, we'll handle it all' or 'we know the adjusters'",
  },
  {
    flag: "Below-market pricing (30%+ under local average)",
    severity: "medium",
    explanation:
      "Extremely low bids often indicate: using substandard materials (3-tab instead of architectural), skipping underlayment/ice shield, no permit pulled, untrained crew, or planning to upsell heavily during the job.",
    howToSpot:
      "Quote is $12,000 when 3 other quotes are $17,000–$22,000 for the same material and scope",
  },
  {
    flag: "No permit pulled — 'roofing doesn't need a permit'",
    severity: "medium",
    explanation:
      "Most jurisdictions require a permit for re-roofing (especially if changing materials or adding layers). Unpermitted work can void homeowners insurance, fail home inspection when selling, and result in fines.",
    howToSpot:
      "Contractor says permits aren't needed or offers to skip permits to 'save you money'",
  },
  {
    flag: "Refuses to provide 3+ local references from projects 1+ year old",
    severity: "medium",
    explanation:
      "A roofer with 5+ years in business should easily provide recent references. Refusal suggests they may be newly formed (possibly after complaints elsewhere) or have quality issues.",
    howToSpot:
      "Contractor says 'I can't give references right now' or only provides references from friends/family",
  },
  {
    flag: "Uses 15-lb felt instead of synthetic underlayment in warm climates",
    severity: "medium",
    explanation:
      "15-lb felt absorbs moisture and can wrinkle during installation. Synthetic underlayment is stronger, more slip-resistant, and moisture-proof. Many manufacturers require synthetic to validate warranty.",
    howToSpot:
      "Contractor mentions 'felt paper' or '15-pound' instead of synthetic underlayment, especially in humid or warm climates",
  },
  {
    flag: "Nails into old shingles instead of tearing off to deck",
    severity: "high",
    explanation:
      "Over-roofing (adding shingles over existing layers) traps moisture, adds unnecessary weight, hides deck damage, and voids most manufacturer warranties. Most codes limit to 2 layers maximum.",
    howToSpot:
      "Contractor says 'we can just shingle over it to save money' without inspecting the deck first",
  },
];
