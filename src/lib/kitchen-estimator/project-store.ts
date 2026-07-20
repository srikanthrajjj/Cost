import type { SavedProject } from "./types";

// ─── Storage Interface ───────────────────────────────────────────────────────
// Abstraction over localStorage for testability and graceful fallback.

export interface StorageBackend {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "costreno_kitchen_projects";

// ─── Project Store API ───────────────────────────────────────────────────────

export interface ProjectStoreAPI {
  save(project: SavedProject): void;
  load(id: string): SavedProject | null;
  list(): SavedProject[];
  remove(id: string): void;
  hasExisting(): boolean;
}

// ─── Error Types ─────────────────────────────────────────────────────────────

export class StorageUnavailableError extends Error {
  constructor() {
    super("Saving is not available in this browser mode.");
    this.name = "StorageUnavailableError";
  }
}

export class StorageQuotaExceededError extends Error {
  constructor() {
    super("Storage is full. Download your estimate as a PDF instead.");
    this.name = "StorageQuotaExceededError";
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isStorageAvailable(storage: StorageBackend): boolean {
  try {
    const testKey = "__costreno_storage_test__";
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function readProjects(storage: StorageBackend): SavedProject[] {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Validate each entry has at minimum an id and projectType
    return parsed.filter(
      (item: unknown) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "projectType" in item
    ) as SavedProject[];
  } catch {
    // Corrupted data — discard and return empty
    return [];
  }
}

function writeProjects(
  storage: StorageBackend,
  projects: SavedProject[]
): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error: unknown) {
    if (
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" ||
        error.code === 22 ||
        error.code === 1014)
    ) {
      throw new StorageQuotaExceededError();
    }
    // For non-DOMException quota errors (e.g. in test environments)
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("quota")
    ) {
      throw new StorageQuotaExceededError();
    }
    throw error;
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Creates a ProjectStore instance.
 * Accepts an optional storage backend for testing; defaults to window.localStorage.
 * Throws StorageUnavailableError on mutating operations if storage is not accessible.
 */
export function createProjectStore(storage?: StorageBackend): ProjectStoreAPI {
  const backend: StorageBackend | null = storage ?? getLocalStorage();

  function ensureAvailable(): StorageBackend {
    if (!backend || !isStorageAvailable(backend)) {
      throw new StorageUnavailableError();
    }
    return backend;
  }

  return {
    save(project: SavedProject): void {
      const store = ensureAvailable();
      const projects = readProjects(store);
      const existingIndex = projects.findIndex((p) => p.id === project.id);

      if (existingIndex >= 0) {
        projects[existingIndex] = project;
      } else {
        projects.push(project);
      }

      writeProjects(store, projects);
    },

    load(id: string): SavedProject | null {
      const store = ensureAvailable();
      const projects = readProjects(store);
      return projects.find((p) => p.id === id) ?? null;
    },

    list(): SavedProject[] {
      const store = ensureAvailable();
      return readProjects(store);
    },

    remove(id: string): void {
      const store = ensureAvailable();
      const projects = readProjects(store);
      const filtered = projects.filter((p) => p.id !== id);
      writeProjects(store, filtered);
    },

    hasExisting(): boolean {
      if (!backend || !isStorageAvailable(backend)) {
        return false;
      }
      const projects = readProjects(backend);
      return projects.length > 0;
    },
  };
}

// ─── Default localStorage accessor ──────────────────────────────────────────

function getLocalStorage(): StorageBackend | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // localStorage access can throw in certain contexts (e.g., iframe sandboxing)
  }
  return null;
}
