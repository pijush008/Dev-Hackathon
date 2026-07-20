import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.warn("Resend not configured — email not sent");
    return;
  }
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "noreply@example.com",
    to,
    subject,
    html,
  });
  if (error) console.error("Resend error:", error);
}
