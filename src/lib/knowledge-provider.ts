// ─── KnowledgeProvider: Single source of truth for all project knowledge ──────
// Responsibilities: Load, merge, and expose project data
// Used by: Chatbot, Quote Analyzer, Cost Calculator, Material Comparison, etc.
// No UI coupling — pure data service
//
// Architecture:
//   Consumers → KnowledgeProvider → [loaders (JSON)] → [future: Supabase adapter]
//
// To add a new project:
//   1. Create a loader function that returns ProjectKnowledge
//   2. Register it: knowledgeProvider.register("project_type", loader)
//   3. Done — auto-available to all consumers

import type { ProjectType } from "./estimator-engine";
import type {
  ProjectKnowledge,
  Material,
  ScopeItem,
  PricingInfo,
  RedFlag,
  ContractorQuestion,
  InsuranceRule,
  BuildingCode,
} from "@/types/knowledge";
import {
  roofingMaterials,
  roofingScopeItems,
  roofingPricing,
  roofingRedFlags,
  roofingContractorQuestions,
  roofingInsuranceRules,
  roofingBuildingCodes,
  roofingSynonyms,
} from "../knowledge/roofing/index";
import { kitchenKnowledge } from "../knowledge/kitchen/index";
import { bathroomKnowledge } from "../knowledge/bathroom/index";

// ─── Supabase Adapter Interface ───────────────────────────────────────────────
// Implement this adapter to migrate from JSON loaders to Supabase.
// Only this interface changes — consumers and chat remain untouched.

export interface KnowledgeAdapter {
  /**
   * Fetch knowledge for a project type.
   * Return null if not found.
   */
  fetch(projectType: ProjectType): Promise<ProjectKnowledge | null>;

  /**
   * Optional: search across all projects.
   */
  search(keyword: string): Promise<ProjectKnowledge[]>;
}

// ─── JSON Loader Adapter (current implementation) ─────────────────────────────

class JsonLoaderAdapter implements KnowledgeAdapter {
  constructor(private loaders: Map<ProjectType, () => ProjectKnowledge>) {}

  async fetch(projectType: ProjectType): Promise<ProjectKnowledge | null> {
    const loader = this.loaders.get(projectType);
    if (!loader) return null;
    return loader();
  }

  async search(keyword: string): Promise<ProjectKnowledge[]> {
    const results: ProjectKnowledge[] = [];
    for (const loader of this.loaders.values()) {
      const knowledge = loader();
      const match =
        knowledge.materials.some((m) => m.name.toLowerCase().includes(keyword)) ||
        knowledge.redFlags.some((f) => f.flag.toLowerCase().includes(keyword)) ||
        knowledge.questions.some((q) => q.question.toLowerCase().includes(keyword));
      if (match) results.push(knowledge);
    }
    return results;
  }
}

// ─── Project Data Loaders ─────────────────────────────────────────────────────

function loadRoofingKnowledge(): ProjectKnowledge {
  return {
    projectType: "roof",
    materials: roofingMaterials,
    scope: roofingScopeItems,
    pricing: roofingPricing,
    redFlags: roofingRedFlags,
    questions: roofingContractorQuestions,
    insurance: roofingInsuranceRules,
    buildingCodes: roofingBuildingCodes,
    synonyms: roofingSynonyms,
  };
}

function loadKitchenKnowledge(): ProjectKnowledge {
  return {
    projectType: "kitchen",
    materials: kitchenKnowledge.materials,
    scope: kitchenKnowledge.scope,
    pricing: kitchenKnowledge.pricing,
    redFlags: kitchenKnowledge.redFlags,
    questions: kitchenKnowledge.questions,
    insurance: kitchenKnowledge.insurance,
    buildingCodes: kitchenKnowledge.buildingCodes,
    synonyms: kitchenKnowledge.synonyms,
  };
}

function loadBathroomKnowledge(): ProjectKnowledge {
  return {
    projectType: "bathroom",
    materials: bathroomKnowledge.materials,
    scope: bathroomKnowledge.scope,
    pricing: bathroomKnowledge.pricing,
    redFlags: bathroomKnowledge.redFlags,
    questions: bathroomKnowledge.questions,
    insurance: bathroomKnowledge.insurance,
    buildingCodes: bathroomKnowledge.buildingCodes,
    synonyms: bathroomKnowledge.synonyms,
  };
}

// ─── Knowledge Provider: Unified Service ─────────────────────────────────────

class KnowledgeProvider {
  private cache: Map<ProjectType, ProjectKnowledge> = new Map();
  private loaders: Map<ProjectType, () => ProjectKnowledge> = new Map();
  private adapter: KnowledgeAdapter | null = null;
  private synonymMap: Map<ProjectType, string[]> = new Map();

  constructor() {
    // Register all data loaders
    this.register("roof", loadRoofingKnowledge);
    this.register("kitchen", loadKitchenKnowledge);
    this.register("bathroom", loadBathroomKnowledge);
  }

  /**
   * Register a project knowledge loader.
   * Auto-extracts synonyms for project detection.
   */
  register(projectType: ProjectType, loader: () => ProjectKnowledge): void {
    this.loaders.set(projectType, loader);
    // Pre-extract synonyms for fast project detection
    const knowledge = loader();
    this.synonymMap.set(projectType, knowledge.synonyms);
  }

  /**
   * Switch to a Supabase (or other) adapter.
   * Call this once at startup when ready to migrate from JSON.
   */
  setAdapter(adapter: KnowledgeAdapter): void {
    this.adapter = adapter;
    this.clearCache();
  }

  /**
   * Get complete knowledge for a project.
   * Checks adapter first (if set), then falls back to local loaders with caching.
   */
  async getKnowledge(projectType: ProjectType): Promise<ProjectKnowledge | null> {
    // Try adapter first (Supabase, CMS, etc.)
    if (this.adapter) {
      return this.adapter.fetch(projectType);
    }

    // Fall back to cached local data
    if (this.cache.has(projectType)) {
      return this.cache.get(projectType)!;
    }

    const loader = this.loaders.get(projectType);
    if (!loader) {
      return null;
    }

    const knowledge = loader();
    this.cache.set(projectType, knowledge);
    return knowledge;
  }

  /**
   * Get specific section of knowledge
   */
  async getMaterials(projectType: ProjectType): Promise<Material[] | null> {
    return (await this.getKnowledge(projectType))?.materials ?? null;
  }

  async getScope(projectType: ProjectType): Promise<ScopeItem[] | null> {
    return (await this.getKnowledge(projectType))?.scope ?? null;
  }

  async getPricing(projectType: ProjectType): Promise<PricingInfo | null> {
    return (await this.getKnowledge(projectType))?.pricing ?? null;
  }

  async getRedFlags(projectType: ProjectType): Promise<RedFlag[] | null> {
    return (await this.getKnowledge(projectType))?.redFlags ?? null;
  }

  async getContractorQuestions(projectType: ProjectType): Promise<ContractorQuestion[] | null> {
    return (await this.getKnowledge(projectType))?.questions ?? null;
  }

  async getInsuranceRules(projectType: ProjectType): Promise<InsuranceRule[] | null> {
    return (await this.getKnowledge(projectType))?.insurance ?? null;
  }

  async getBuildingCodes(projectType: ProjectType): Promise<BuildingCode[] | null> {
    return (await this.getKnowledge(projectType))?.buildingCodes ?? null;
  }

  async getSynonyms(projectType: ProjectType): Promise<string[] | null> {
    return (await this.getKnowledge(projectType))?.synonyms ?? null;
  }

  /**
   * Detect project type from a query string using registered synonyms.
   * Single source of truth — no duplicate detection logic anywhere else.
   */
  detectProjectType(query: string): ProjectType | null {
    const lower = query.toLowerCase();

    for (const [projectType, synonyms] of this.synonymMap.entries()) {
      for (const synonym of synonyms) {
        if (lower.includes(synonym)) {
          return projectType;
        }
      }
    }

    return null;
  }

  /**
   * Search across all loaded projects by keyword
   */
  async search(keyword: string): Promise<ProjectKnowledge[]> {
    // Use adapter if available, otherwise search local cache
    if (this.adapter) {
      return this.adapter.search(keyword);
    }

    const results: ProjectKnowledge[] = [];
    for (const [, knowledge] of this.cache) {
      const match =
        knowledge.materials.some((m) => m.name.toLowerCase().includes(keyword)) ||
        knowledge.redFlags.some((f) => f.flag.toLowerCase().includes(keyword)) ||
        knowledge.questions.some((q) => q.question.toLowerCase().includes(keyword));
      if (match) results.push(knowledge);
    }
    return results;
  }

  /**
   * Clear cache (for testing or refresh)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get all loaded project types
   */
  getAvailableProjects(): ProjectType[] {
    return Array.from(this.loaders.keys());
  }
}

// ─── SINGLETON INSTANCE ───────────────────────────────────────────────────────
export const knowledgeProvider = new KnowledgeProvider();

export default knowledgeProvider;
