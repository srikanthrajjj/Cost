import { knowledgeProvider } from "../knowledge-provider";
import type { MatchedMaterial, MatchedScopeItem, QuoteExtraction } from "./types";
import type { ProjectType } from "../estimator-engine";
import type { Material, ScopeItem } from "@/types/knowledge";

export async function matchQuote(extracted: QuoteExtraction): Promise<{
  matchedMaterials: MatchedMaterial[];
  matchedScopeItems: MatchedScopeItem[];
  unmatchedMaterials: string[];
  unmatchedScopeItems: string[];
}> {
  const projectType = extracted.projectType as ProjectType;
  const knowledge = projectType ? await knowledgeProvider.getKnowledge(projectType) : null;

  const matchedMaterials: MatchedMaterial[] = [];
  const matchedScopeItems: MatchedScopeItem[] = [];
  const unmatchedMaterials: string[] = [];
  const unmatchedScopeItems: string[] = [];

  if (!knowledge) {
    return { matchedMaterials, matchedScopeItems, unmatchedMaterials, unmatchedScopeItems };
  }

  // Match materials
  for (const item of extracted.materials) {
    const matched = knowledge.materials.find(
      (m: Material) =>
        item.name.toLowerCase().includes(m.name.toLowerCase()) ||
        m.name.toLowerCase().includes(item.name.toLowerCase()),
    );

    if (matched) {
      matchedMaterials.push({
        original: item,
        knowledge: matched,
        confidence: 0.9,
        status: "matched",
      });
    } else {
      unmatchedMaterials.push(item.name);
    }
  }

  // Match scope items
  for (const item of extracted.scopeItems) {
    const matched = knowledge.scope.find(
      (s: ScopeItem) =>
        item.name.toLowerCase().includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(item.name.toLowerCase()),
    );

    if (matched) {
      matchedScopeItems.push({
        original: item,
        knowledge: matched,
        confidence: 0.9,
        status: "matched",
      });
    } else {
      unmatchedScopeItems.push(item.name);
    }
  }

  return { matchedMaterials, matchedScopeItems, unmatchedMaterials, unmatchedScopeItems };
}
