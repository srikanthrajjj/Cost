import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getResendClient } from "@/lib/email/resend";
import { saveQuoteFeedback } from "@/lib/db/store";

const feedbackSchema = z.object({
  accuracy: z.enum(["accurate", "somewhat", "not_accurate"]).optional(),
  understandable: z.enum(["yes", "somewhat", "no"]).optional(),
  useAgain: z.enum(["yes", "maybe", "no"]).optional(),
  comment: z.string().max(1000).optional(),
  projectType: z.string().optional(),
  contractor: z.string().optional(),
  completenessScore: z.number().optional(),
  quoteUploadId: z.string().optional(),
});

export type QuoteFeedbackPayload = z.infer<typeof feedbackSchema>;

function labelAccuracy(v?: string) {
  if (v === "accurate") return "Accurate";
  if (v === "somewhat") return "Somewhat accurate";
  if (v === "not_accurate") return "Not accurate";
  return "Skipped";
}

function labelYesSomewhatNo(v?: string) {
  if (v === "yes") return "Yes";
  if (v === "somewhat") return "Somewhat";
  if (v === "maybe") return "Maybe";
  if (v === "no") return "No";
  return "Skipped";
}

export const submitQuoteFeedback = createServerFn({ method: "POST" })
  .validator(feedbackSchema)
  .handler(async ({ data }): Promise<{ success: boolean; message: string; id?: string }> => {
    const answered =
      Boolean(data.accuracy) ||
      Boolean(data.understandable) ||
      Boolean(data.useAgain) ||
      Boolean(data.comment?.trim());

    if (!answered) {
      return { success: false, message: "Please answer at least one question." };
    }

    const summary = {
      accuracy: labelAccuracy(data.accuracy),
      understandable: labelYesSomewhatNo(data.understandable),
      useAgain: labelYesSomewhatNo(data.useAgain),
      comment: data.comment?.trim() || "",
      projectType: data.projectType || "",
      contractor: data.contractor || "",
      completenessScore: data.completenessScore ?? null,
      quoteUploadId: data.quoteUploadId || "",
      receivedAt: new Date().toISOString(),
    };

    let feedbackId: string | undefined;
    try {
      const saved = await saveQuoteFeedback({
        quoteUploadId: data.quoteUploadId,
        accuracy: data.accuracy,
        understandable: data.understandable,
        useAgain: data.useAgain,
        comment: data.comment,
        projectType: data.projectType,
        contractor: data.contractor,
        completenessScore: data.completenessScore,
      });
      feedbackId = saved.id;
      console.info("[quote-feedback] saved", { id: saved.id, storage: saved.storage });
    } catch (error) {
      console.error("[quote-feedback] failed to persist:", error);
      return {
        success: false,
        message: "Could not save your feedback. Please try again.",
      };
    }

    const toEmail =
      import.meta.env.FEEDBACK_TO_EMAIL ||
      process.env.FEEDBACK_TO_EMAIL ||
      "notifications@costreno.com";

    try {
      const resend = getResendClient();
      await resend.emails.send({
        from: "CostReno <notifications@costreno.com>",
        to: toEmail,
        subject: `Quote analyzer feedback: ${summary.accuracy} / use again: ${summary.useAgain}`,
        html: `<!DOCTYPE html>
<html>
  <body style="font-family:Inter,Arial,sans-serif;color:#082A4B;line-height:1.5;">
    <h2 style="margin:0 0 16px;">Quote analyzer feedback</h2>
    <p><strong>Accurate?</strong> ${summary.accuracy}</p>
    <p><strong>Easy to understand?</strong> ${summary.understandable}</p>
    <p><strong>Would use again?</strong> ${summary.useAgain}</p>
    ${summary.comment ? `<p><strong>Comment:</strong> ${summary.comment}</p>` : ""}
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
    <p style="font-size:12px;color:#6b7280;">
      Feedback ID: ${feedbackId || "—"}<br />
      Quote upload ID: ${summary.quoteUploadId || "—"}<br />
      Project type: ${summary.projectType || "—"}<br />
      Contractor: ${summary.contractor || "—"}<br />
      Completeness score: ${summary.completenessScore ?? "—"}<br />
      Received: ${summary.receivedAt}
    </p>
  </body>
</html>`,
      });
    } catch (error) {
      // Persistence already succeeded; email is best-effort
      console.error("[quote-feedback] email send failed:", error);
    }

    return {
      success: true,
      message: "Thanks. Your feedback helps us improve CostReno.",
      id: feedbackId,
    };
  });
