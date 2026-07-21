import type { Material, ScopeItem } from "@/types/knowledge";

export interface QuoteExtraction {
  projectType: string;
  contractor: string;
  materials: ExtractedMaterial[];
  scopeItems: ExtractedScopeItem[];
  permits: string[];
  warranties: string[];
  exclusions: string[];
  totalPrice: number;
  confidence: number;
}

export interface ExtractedMaterial {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface ExtractedScopeItem {
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  unitPrice?: number;
  totalPrice: number;
  notes?: string;
}

export interface MatchedMaterial {
  original: ExtractedMaterial;
  knowledge: Material;
  confidence: number;
  status: "matched" | "partial" | "unmatched";
}

export interface MatchedScopeItem {
  original: ExtractedScopeItem;
  knowledge: ScopeItem;
  confidence: number;
  status: "matched" | "partial" | "unmatched";
}

export interface Finding {
  id: string;
  severity: "high" | "medium" | "low";
  title: string;
  explanation: string;
  recommendation: string;
}

export interface MissingItem extends Finding {
  expectedItem?: string;
  location?: string;
}

export interface RedFlagFinding extends Finding {
  howToSpot?: string;
}

export interface BuildingCodeFinding extends Finding {
  codeReference?: string;
  inspectionRequired?: boolean;
}

export interface InsuranceFinding extends Finding {
  coverage?: boolean;
  note?: string;
}

export interface QuoteAnalysis {
  summary: {
    totalItems: number;
    matchedItems: number;
    unmatchedItems: number;
    completenessScore: number;
    quoteHealthScore?: number;
  };
  /** ✅ Items confirmed present in the quote */
  presentItems: { name: string; matchedAs: string; clarification?: string }[];
  /** ⚠ Items present but needing further detail */
  needsClarification: { name: string; matchedAs: string; question: string }[];
  /** ❌ Items genuinely missing from the quote */
  missingScope: MissingItem[];
  missingMaterials: MissingItem[];
  commonOmissions: Finding[];
  redFlags: RedFlagFinding[];
  buildingCodes: BuildingCodeFinding[];
  insuranceConsiderations: InsuranceFinding[];
  questionsToAsk: string[];
  recommendations: string[];
  confidence: number;
}
