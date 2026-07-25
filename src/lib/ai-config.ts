/**
 * Shared AI provider config (OpenRouter-compatible).
 * Server handlers should resolve credentials here so chat, quote, and kitchen
 * all use the same key, base URL, and model.
 */

const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";
/** Current OpenRouter DeepSeek chat slug; override with OPENROUTER_MODEL. */
const DEFAULT_MODEL = "deepseek/deepseek-chat-v3-0324";

function readEnv(name: string): string | undefined {
  // Prefer process.env on the server (works in Vite SSR + Nitro), then import.meta.env
  // (Vite only exposes names matching envPrefix, e.g. VITE_* and OPENROUTER_*).
  const fromProcess =
    typeof process !== "undefined" ? process.env?.[name] : undefined;
  const fromImportMeta =
    typeof import.meta !== "undefined"
      ? (import.meta.env as Record<string, string | undefined>)?.[name]
      : undefined;
  const value = fromProcess || fromImportMeta;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** OpenRouter (or compatible) API key. Prefers non-VITE server secrets. */
export function getAiApiKey(): string | undefined {
  return (
    readEnv("OPENROUTER_API_KEY") ||
    readEnv("SK_API_KEY") ||
    readEnv("VITE_SK_API_KEY")
  );
}

export function requireAiApiKey(): string {
  const key = getAiApiKey();
  if (!key) {
    throw new Error(
      "AI API key not configured. Set OPENROUTER_API_KEY (or VITE_SK_API_KEY) in your environment.",
    );
  }
  return key;
}

/** Base URL without trailing slash (…/api/v1). */
export function getAiBaseUrl(): string {
  const raw =
    readEnv("OPENROUTER_BASE_URL") ||
    readEnv("VITE_API_BASE_URL") ||
    DEFAULT_BASE_URL;
  return raw.replace(/\/$/, "");
}

export function getAiChatCompletionsUrl(): string {
  return `${getAiBaseUrl()}/chat/completions`;
}

export function getAiModel(): string {
  return (
    readEnv("OPENROUTER_MODEL") ||
    readEnv("VITE_OPENROUTER_MODEL") ||
    DEFAULT_MODEL
  );
}

/** Fallback models when the primary returns 404 (model retired / renamed). */
export function getAiModelFallbacks(): string[] {
  const primary = getAiModel();
  const defaults = [
    "deepseek/deepseek-chat-v3-0324",
    "deepseek/deepseek-chat",
    "deepseek/deepseek-chat-v3.1",
    "openai/gpt-4o-mini",
  ];
  return [primary, ...defaults.filter((m) => m !== primary)];
}
