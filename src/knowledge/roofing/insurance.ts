import type { InsuranceRule } from "@/types/knowledge";

export const roofingInsuranceRules: InsuranceRule[] = [
  {
    rule: "Roof age 20+ years: Many insurers will not renew or will surcharge policies for roofs over 20 years old",
    coverage: false,
    note: "Some insurers have hard cutoffs at 20, 25, or 30 years",
  },
  {
    rule: "Roof age 10–20 years: Some insurers require a roof inspection or certification before issuing/renewing policy",
    coverage: false,
    note: "Inspection typically costs $150–$300",
  },
  {
    rule: "Storm/wind/hail damage: Most homeowners policies cover sudden storm damage, but deductibles are often $1,000–$5,000 or 1–2% of dwelling coverage for wind/hail",
    coverage: true,
    note: "Wind/hail deductibles are separate from standard deductible",
  },
  {
    rule: "Weight loss claims: If a roof is 50%+ damaged by a covered peril, insurers may pay full replacement cost instead of actual cash value",
    coverage: true,
    note: "Check your policy's 'weight loss' or 'total loss' threshold",
  },
  {
    rule: "Wear and tear / gradual leaks: NOT covered by homeowners insurance",
    coverage: false,
    note: "Insurance covers sudden, accidental damage — not maintenance issues",
  },
  {
    rule: "Metal roofs: Some insurers offer 5–15% premium discounts for Class A fire-rated metal roofs",
    coverage: true,
    note: "Savings of $200–$500/year can offset higher installation cost over time",
  },
  {
    rule: "Impact-resistant shingles: Some insurers offer 5–20% discounts for Class 4 impact-resistant roofing",
    coverage: true,
    note: "Available from most major manufacturers (Owens Corning, GAF, CertainTeed)",
  },
  {
    rule: "Older roof claims: If your roof is over 15 years old, expect an Actual Cash Value (ACV) payout minus depreciation, not full replacement cost",
    coverage: true,
    note: "Depreciation can be 2–4% per year of the roof's expected lifespan",
  },
  {
    rule: "Roof replacement after insurance claim: Most insurers require the work to be completed within 6–12 months of the claim payout",
    coverage: true,
    note: "Failure to complete may require returning the insurance funds",
  },
  {
    rule: "Secondary damage from roof leak: Water damage to interior (ceilings, walls, floors) IS covered, but the roof repair itself may not be if it's wear-related",
    coverage: true,
    note: "Document all interior damage with photos before starting repairs",
  },
];
