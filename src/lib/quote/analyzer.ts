import { knowledgeProvider } from "../knowledge-provider";
import type {
  MatchedMaterial,
  MatchedScopeItem,
  QuoteAnalysis,
  MissingItem,
  RedFlagFinding,
  BuildingCodeFinding,
  InsuranceFinding,
  Finding,
  QuoteExtraction,
} from "./types";
import type { ProjectType } from "../estimator-engine";

export async function analyzeQuote(
  extracted: QuoteExtraction,
  matchedMaterials: MatchedMaterial[],
  matchedScopeItems: MatchedScopeItem[],
  unmatchedMaterials: string[],
  unmatchedScopeItems: string[],
): Promise<QuoteAnalysis> {
  const projectType = extracted.projectType as ProjectType;
  const knowledge = projectType ? await knowledgeProvider.getKnowledge(projectType) : null;

  const missingScope: MissingItem[] = [];
  const missingMaterials: MissingItem[] = [];
  const commonOmissions: Finding[] = [];
  const redFlags: RedFlagFinding[] = [];
  const buildingCodes: BuildingCodeFinding[] = [];
  const insuranceConsiderations: InsuranceFinding[] = [];
  const questionsToAsk: string[] = [];

  if (!knowledge) {
    return {
      summary: { totalItems: 0, matchedItems: 0, unmatchedItems: 0, completenessScore: 0 },
      missingScope,
      missingMaterials,
      commonOmissions,
      redFlags,
      buildingCodes,
      insuranceConsiderations,
      questionsToAsk,
      recommendations: [],
      confidence: 0,
    };
  }

  // Check for missing required scope items
  for (const scopeItem of knowledge.scope) {
    if (scopeItem.required) {
      const matched = matchedScopeItems.find((m) => m.knowledge.id === scopeItem.id);
      if (!matched) {
        missingScope.push({
          id: `missing-scope-${scopeItem.id}`,
          severity: "high",
          title: `Missing Required Scope: ${scopeItem.name}`,
          explanation: scopeItem.description,
          recommendation: `Ensure ${scopeItem.name} is included in the quote`,
        });
      } else if (matched.original.quantity === 0) {
        commonOmissions.push({
          id: `omission-${scopeItem.id}`,
          severity: "medium",
          title: `Potential Omission: ${scopeItem.name}`,
          explanation: `Quantity is zero but ${scopeItem.name} is required`,
          recommendation: "Verify if this item should be included",
        });
      }
    }
  }

  // Check for missing required materials
  for (const material of knowledge.materials) {
    const matched = matchedMaterials.find((m) => m.knowledge.name === material.name);
    if (!matched && material.name.toLowerCase().includes("underlayment")) {
      missingMaterials.push({
        id: `missing-material-${material.name}`,
        severity: "medium",
        title: `Potential Missing Material: ${material.name}`,
        explanation: "Underlayment is typically required",
        recommendation: "Verify underlayment is included in the quote",
      });
    }
  }

  // Add common omissions from knowledge
  for (const scopeItem of knowledge.scope) {
    if (scopeItem.commonOmissions) {
      for (const omission of scopeItem.commonOmissions) {
        commonOmissions.push({
          id: `omission-${omission}`,
          severity: "medium",
          title: `Common Omission: ${omission}`,
          explanation: `Contractors may skip ${omission}`,
          recommendation: "Verify this is included in the quote",
        });
      }
    }
  }

  // Add red flags
  for (const flag of knowledge.redFlags) {
    redFlags.push({
      id: `redflag-${flag.flag.substring(0, 10)}`,
      severity: flag.severity,
      title: flag.flag,
      explanation: flag.explanation,
      howToSpot: flag.howToSpot,
      recommendation: "Verify with contractor",
    });
  }

  // Add building codes
  for (const code of knowledge.buildingCodes) {
    buildingCodes.push({
      id: `code-${code.code.substring(0, 10)}`,
      severity: "medium",
      title: code.code,
      explanation: code.requirement,
      codeReference: code.code,
      inspectionRequired: code.inspection,
      recommendation: "Verify compliance with local building department",
    });
  }

  // Add insurance considerations
  for (const rule of knowledge.insurance) {
    insuranceConsiderations.push({
      id: `insurance-${rule.rule.substring(0, 10)}`,
      severity: "low",
      title: rule.rule,
      explanation: rule.note,
      coverage: rule.coverage,
      recommendation: rule.coverage ? "Document for insurance claim" : "Not covered",
    });
  }

  // Add contractor questions
  for (const question of knowledge.questions) {
    questionsToAsk.push(`${question.question} (${question.category})`);
  }

  // Calculate completeness score
  const totalRequired = knowledge.scope.filter((s) => s.required).length;
  const matchedRequired = knowledge.scope.filter(
    (s) => s.required && matchedScopeItems.some((m) => m.knowledge.id === s.id),
  ).length;
  const completenessScore = totalRequired > 0 ? (matchedRequired / totalRequired) * 100 : 100;

  return {
    summary: {
      totalItems:
        matchedMaterials.length +
        matchedScopeItems.length +
        unmatchedMaterials.length +
        unmatchedScopeItems.length,
      matchedItems: matchedMaterials.length + matchedScopeItems.length,
      unmatchedItems: unmatchedMaterials.length + unmatchedScopeItems.length,
      completenessScore: Math.round(completenessScore),
    },
    missingScope,
    missingMaterials,
    commonOmissions,
    redFlags,
    buildingCodes,
    insuranceConsiderations,
    questionsToAsk,
    recommendations: [
      "Verify all required scope items are included",
      "Check materials match specified quality standards",
      "Confirm building code compliance",
      "Review warranty terms in writing",
      "Get multiple contractor quotes for comparison",
    ],
    confidence: extracted.confidence || 0.8,
  };
}
