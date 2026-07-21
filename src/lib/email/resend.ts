import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (resendClient) return resendClient;

  const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured. Add it to your .env file.");
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

export function getAudienceId(): string {
  const audienceId = import.meta.env.RESEND_AUDIENCE_ID || process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    throw new Error(
      "RESEND_AUDIENCE_ID is not configured. Create an audience at https://resend.com/audiences and add the ID to your .env file.",
    );
  }
  return audienceId;
}

export { getResendClient };
