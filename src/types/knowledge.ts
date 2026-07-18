// ─── Knowledge Provider Types ──────────────────────────────────────────────

import type { ProjectType } from "@/lib/estimator-engine";

export interface Material {
  name: string;
  pros: string[];
  cons: string[];
  cost: string;
  durability: string;
  maintenance: string;
  roi: string;
}

export interface ScopeItem {
  id?: string;
  name: string;
  category?: string;
  description: string;
  required?: boolean;
  typicalUnit?: string;
  typicalCost?: string;
  commonContractorNames?: string[];
  requiredMaterials?: string[];
  commonOmissions?: string[];
  relatedRedFlags?: string[];
  contractorQuestions?: string[];
  timeframe?: string;
  included?: boolean;
  optional?: boolean;
}

export interface PricingInfo {
  avgCost: number;
  lowEnd: number;
  highEnd: number;
  breakdown: { category: string; percent: number; amount: number }[];
  costDrivers: string[];
}

export interface RedFlag {
  flag: string;
  severity: "high" | "medium" | "low";
  explanation: string;
  howToSpot: string;
}

export interface ContractorQuestion {
  question: string;
  category: "warranty" | "licensing" | "scope" | "process" | "payment" | "protection";
}

export interface InsuranceRule {
  rule: string;
  coverage: boolean;
  note: string;
}

export interface BuildingCode {
  code: string;
  requirement: string;
  inspection: boolean;
}

export interface ProjectKnowledge {
  projectType: ProjectType;
  materials: Material[];
  scope: ScopeItem[];
  pricing: PricingInfo;
  redFlags: RedFlag[];
  questions: ContractorQuestion[];
  insurance: InsuranceRule[];
  buildingCodes: BuildingCode[];
  synonyms: string[];
}
