import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getResendClient, getAudienceId } from "./resend";

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().email("Please enter a valid email address."),
      source: z.string().optional(),
    }),
  )
  .handler(async ({ data }): Promise<{ success: boolean; message: string }> => {
    const resend = getResendClient();
    const audienceId = getAudienceId();

    try {
      await resend.contacts.create({
        email: data.email,
        audienceId,
        unsubscribed: false,
      });

      try {
        await resend.emails.send({
          from: "CostReno <notifications@costreno.com>",
          to: data.email,
          subject: "You're on the CostReno waitlist!",
          html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#f7f8fa;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"><div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);"><div style="background:#082A4B;padding:32px;text-align:center;"><h1 style="color:#ffffff;font-size:20px;font-weight:700;margin:0;">CostReno</h1></div><div style="padding:32px;"><h2 style="color:#082A4B;font-size:18px;font-weight:700;margin:0 0 16px;">You're on the list!</h2><p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">Thanks for signing up for early access to CostReno. We'll let you know as soon as new tools and features launch.</p><div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-bottom:24px;"><p style="color:#166534;font-size:13px;margin:0;"><strong>What to expect:</strong> AI-powered quote analysis, cost estimates, and renovation guides to help you make confident decisions.</p></div><p style="color:#999;font-size:12px;margin:0;">Questions? Reply to this email or visit <a href="https://costreno.com" style="color:#03A44D;">costreno.com</a>.</p></div></div></body></html>`,
        });
      } catch (emailError) {
        console.error("Confirmation email failed (subscriber still added):", emailError);
      }

      return {
        success: true,
        message: "You're on the list! We'll notify you when we launch.",
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      if (errorMessage.includes("already exists")) {
        return {
          success: true,
          message: "You're already on the list! We'll notify you when we launch.",
        };
      }

      console.error("Subscribe error:", error);
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }
  });
