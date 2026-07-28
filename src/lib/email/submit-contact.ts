import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getResendClient } from "./resend";

const SUBJECT_LABELS: Record<string, string> = {
  general: "General inquiry",
  support: "Technical support",
  estimate: "Question about an estimate",
  quote: "Quote analyzer help",
  feedback: "Feedback or suggestion",
  partnership: "Partnership / business",
};

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(254),
  subject: z
    .enum(["general", "support", "estimate", "quote", "feedback", "partnership"])
    .default("general"),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(5000),
});

export type ContactPayload = z.infer<typeof contactSchema>;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type RateBucket = { count: number; resetAt: number };

const rateBuckets = new Map<string, RateBucket>();
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 5;

function assertContactRateAllowed(email: string): { ok: true } | { ok: false; message: string } {
  const key = email.toLowerCase().slice(0, 254);
  const now = Date.now();
  const existing = rateBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true };
  }

  if (existing.count >= RATE_LIMIT) {
    return {
      ok: false,
      message: "Too many messages from this email. Please wait a bit and try again.",
    };
  }

  existing.count += 1;
  rateBuckets.set(key, existing);

  if (rateBuckets.size > 2000) {
    for (const [k, v] of rateBuckets) {
      if (v.resetAt <= now) rateBuckets.delete(k);
    }
  }

  return { ok: true };
}

function readEnv(name: string): string | undefined {
  const fromProcess = typeof process !== "undefined" ? process.env?.[name] : undefined;
  const fromImportMeta =
    typeof import.meta !== "undefined"
      ? (import.meta.env as Record<string, string | undefined>)?.[name]
      : undefined;
  const value = fromProcess || fromImportMeta;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getContactToEmail(): string {
  return readEnv("CONTACT_TO") || "srikanthrajj@gmail.com";
}

function getContactFromAddress(): string {
  return readEnv("RESEND_FROM") || "CostReno <notifications@costreno.com>";
}

function hasResendApiKey(): boolean {
  const key = readEnv("RESEND_API_KEY");
  if (!key) return false;
  // Treat common placeholders as unset so local setup fails clearly.
  if (/your_.*_here|changeme|placeholder/i.test(key)) return false;
  return true;
}

function userFacingSendError(errorMessage: string): string {
  const lower = errorMessage.toLowerCase();

  if (lower.includes("resend_api_key") || lower.includes("not configured")) {
    return "Email is temporarily unavailable. Please try again later.";
  }

  if (
    lower.includes("domain is not verified") ||
    lower.includes("not verified") ||
    lower.includes("from address") ||
    lower.includes("invalid `from`")
  ) {
    return "Email delivery is temporarily unavailable. Please try again later.";
  }

  if (lower.includes("invalid api key") || lower.includes("unauthorized") || lower.includes("401")) {
    return "Email is temporarily unavailable. Please try again later.";
  }

  return "Could not send your message. Please try again later.";
}

/** Extract a safe, user-facing message from server-fn / validation failures. */
export function getContactClientErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Something went wrong. Please try again.";
  }

  const message = error.message || "";

  // Zod / TanStack validation messages often appear in the thrown Error message.
  const knownValidation = [
    "Name is required.",
    "Please enter a valid email address.",
    "Message must be at least 10 characters.",
  ];
  for (const known of knownValidation) {
    if (message.includes(known)) return known;
  }

  if (/message.*at least|too (small|short)|min\(10\)/i.test(message)) {
    return "Message must be at least 10 characters.";
  }

  if (/invalid.*email|email/i.test(message) && /valid|invalid/i.test(message)) {
    return "Please enter a valid email address.";
  }

  if (/invalid_enum|subject/i.test(message)) {
    return "Please select a valid subject.";
  }

  // Avoid leaking stack traces or internal paths to the UI.
  if (message.length > 0 && message.length < 180 && !/[\\/]|\.ts\b|\.tsx\b|at\s+\w+/.test(message)) {
    if (/resend|api key|configur|not configured|unauthorized|verified domain/i.test(message)) {
      return userFacingSendError(message);
    }
  }

  return "Something went wrong. Please try again.";
}

export const submitContactMessage = createServerFn({ method: "POST" })
  .validator(contactSchema)
  .handler(async ({ data }): Promise<{ success: boolean; message: string }> => {
    const rate = assertContactRateAllowed(data.email);
    if (!rate.ok) {
      return { success: false, message: rate.message };
    }

    if (!hasResendApiKey()) {
      console.error("[contact] RESEND_API_KEY is not configured");
      return {
        success: false,
        message: "Email is temporarily unavailable. Please try again later.",
      };
    }

    const subjectLabel = SUBJECT_LABELS[data.subject] || SUBJECT_LABELS.general;
    const toEmail = getContactToEmail();
    const fromAddress = getContactFromAddress();

    try {
      const resend = getResendClient();
      const result = await resend.emails.send({
        from: fromAddress,
        to: toEmail,
        replyTo: data.email,
        subject: `Contact: ${subjectLabel} (${data.name})`,
        html: `<!DOCTYPE html>
<html>
  <body style="font-family:Inter,Arial,sans-serif;color:#082A4B;line-height:1.5;">
    <h2 style="margin:0 0 16px;">New contact form message</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subjectLabel)}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap;background:#f7f8fa;border-radius:8px;padding:12px;">${escapeHtml(data.message)}</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
    <p style="font-size:12px;color:#6b7280;">
      Received: ${new Date().toISOString()}
    </p>
  </body>
</html>`,
      });

      if (result.error) {
        console.error("[contact] Resend API error:", result.error.name, result.error.message);
        return {
          success: false,
          message: userFacingSendError(result.error.message || result.error.name || ""),
        };
      }

      console.info("[contact] message sent", {
        id: result.data?.id,
        subject: data.subject,
        // Do not log name, email, or message body (PII)
      });

      return {
        success: true,
        message: "Thanks for reaching out. We'll get back to you within 24 to 48 hours.",
      };
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "unknown";
      console.error("[contact] send failed:", errMessage);
      return {
        success: false,
        message: userFacingSendError(errMessage),
      };
    }
  });
