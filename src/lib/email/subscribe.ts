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
