/**
 * Shared OpenRouter chat-completion client for the quote analysis pipeline.
 *
 * Wraps `fetch` with:
 *  - a per-request timeout (so a stalled request can't hang the UI forever)
 *  - automatic retries with backoff for transient failures (timeouts, network
 *    errors, 429 rate limits, 5xx server errors)
 *  - support for an external AbortSignal so the user can cancel in-flight work
 *  - categorized errors (`OpenRouterError.code`) so callers can show accurate,
 *    friendly messages instead of a raw error string
 */

export type OpenRouterErrorCode =
  | "cancelled"
  | "timeout"
  | "rate_limit"
  | "auth"
  | "not_found"
  | "server"
  | "network"
  | "invalid_response";

export class OpenRouterError extends Error {
  code: OpenRouterErrorCode;
  retryAfterMs?: number;

  constructor(code: OpenRouterErrorCode, message: string, retryAfterMs?: number) {
    super(message);
    this.name = "OpenRouterError";
    this.code = code;
    this.retryAfterMs = retryAfterMs;
  }
}

const RETRYABLE_CODES: OpenRouterErrorCode[] = ["timeout", "rate_limit", "server", "network"];

export interface OpenRouterCallOptions {
  apiKey: string;
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  /** Aborts the call (and any pending retry) immediately, e.g. user clicked Cancel. */
  signal?: AbortSignal;
  /** Per-attempt timeout in ms. Defaults to 25s. */
  timeoutMs?: number;
  /** Number of retries after the first attempt. Defaults to 2 (3 attempts total). */
  maxRetries?: number;
  /** Called before each retry attempt so the UI can show "Retrying..." feedback. */
  onRetry?: (info: { attempt: number; maxAttempts: number; reason: OpenRouterErrorCode }) => void;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    if (signal) {
      const onAbort = () => {
        clearTimeout(timer);
        reject(new OpenRouterError("cancelled", "Cancelled by user"));
      };
      if (signal.aborted) {
        onAbort();
        return;
      }
      signal.addEventListener("abort", onAbort, { once: true });
    }
  });
}

async function attemptOnce(options: OpenRouterCallOptions): Promise<string> {
  const {
    apiKey,
    systemPrompt,
    userPrompt,
    model = "deepseek/deepseek-chat",
    temperature = 0.2,
    maxTokens = 2000,
    signal: externalSignal,
    timeoutMs = 25000,
  } = options;

  if (externalSignal?.aborted) {
    throw new OpenRouterError("cancelled", "Cancelled by user");
  }

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  const onExternalAbort = () => controller.abort();
  externalSignal?.addEventListener("abort", onExternalAbort);

  let response: Response;
  try {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://costreno.com",
        "X-Title": "CostReno AI",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });
  } catch (err) {
    if (externalSignal?.aborted) {
      throw new OpenRouterError("cancelled", "Cancelled by user");
    }
    if (timedOut) {
      throw new OpenRouterError(
        "timeout",
        `Request timed out after ${Math.round(timeoutMs / 1000)}s`,
      );
    }
    throw new OpenRouterError(
      "network",
      `Network error: ${err instanceof Error ? err.message : String(err)}`,
    );
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener("abort", onExternalAbort);
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");

    if (response.status === 401) {
      throw new OpenRouterError(
        "auth",
        "API key invalid or expired. Please check your VITE_SK_API_KEY.",
      );
    }
    if (response.status === 404) {
      throw new OpenRouterError(
        "not_found",
        "AI model not found. Please check the model configuration.",
      );
    }
    if (response.status === 429) {
      const retryAfterHeader = response.headers.get("retry-after");
      const retryAfterMs = retryAfterHeader ? parseFloat(retryAfterHeader) * 1000 : undefined;
      throw new OpenRouterError(
        "rate_limit",
        "Rate limit exceeded on the AI provider.",
        retryAfterMs && Number.isFinite(retryAfterMs) ? retryAfterMs : undefined,
      );
    }
    if (response.status >= 500) {
      throw new OpenRouterError("server", `AI provider server error: ${response.status}`);
    }
    throw new OpenRouterError(
      "invalid_response",
      `AI API error: ${response.status} - ${errorBody.slice(0, 300)}`,
    );
  }

  const data = await response.json().catch(() => null);
  if (!data || !data.choices || data.choices.length === 0) {
    throw new OpenRouterError("invalid_response", "No response from AI - empty choices");
  }

  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string" || content.trim().length === 0) {
    throw new OpenRouterError("invalid_response", "AI returned an empty response");
  }

  return content;
}

/**
 * Calls OpenRouter chat completions with automatic timeout + retry handling.
 * Resolves with the raw message content string, or throws an `OpenRouterError`.
 */
export async function callOpenRouter(options: OpenRouterCallOptions): Promise<string> {
  const { maxRetries = 2, signal, onRetry } = options;
  const maxAttempts = maxRetries + 1;

  let lastError: OpenRouterError | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await attemptOnce(options);
    } catch (err) {
      const error =
        err instanceof OpenRouterError
          ? err
          : new OpenRouterError("network", err instanceof Error ? err.message : String(err));

      lastError = error;

      const isLastAttempt = attempt >= maxAttempts;
      const isRetryable = RETRYABLE_CODES.includes(error.code);

      if (error.code === "cancelled" || !isRetryable || isLastAttempt) {
        throw error;
      }

      onRetry?.({ attempt: attempt + 1, maxAttempts, reason: error.code });

      // Exponential-ish backoff, honoring Retry-After for 429s when provided.
      const backoffMs = error.retryAfterMs ?? Math.min(1500 * attempt, 6000);
      await sleep(backoffMs, signal);
    }
  }

  // Unreachable in practice, but keeps TypeScript happy.
  throw lastError ?? new OpenRouterError("network", "Unknown error calling AI provider");
}

/** Maps an OpenRouterError (or unknown error) to a friendly, user-facing message. */
export function friendlyOpenRouterMessage(error: unknown): string {
  if (error instanceof OpenRouterError) {
    switch (error.code) {
      case "cancelled":
        return "Analysis cancelled.";
      case "timeout":
        return "The AI took too long to respond. This can happen when the service is busy — please try again in a moment.";
      case "rate_limit":
        return "The AI provider is rate-limiting requests right now. Please wait a moment and try again.";
      case "auth":
        return "AI service is misconfigured (invalid API key). Please contact support.";
      case "not_found":
        return "AI model is unavailable right now. Please try again shortly.";
      case "server":
        return "The AI provider is having issues right now. Please try again in a moment.";
      case "network":
        return "Network error while contacting the AI service. Please check your connection and try again.";
      case "invalid_response":
        return "The AI returned an unexpected response. Please try again.";
    }
  }
  const message = error instanceof Error ? error.message : String(error);
  return `Something went wrong: ${message}`;
}
