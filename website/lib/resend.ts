import "server-only";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
    from: process.env.EMAIL_FROM ?? "noreply@carecompass.app",
    to,
    subject,
    html,
  });
  if (error) console.error("Resend error:", error);
}

export const emailTemplates = {
  medicationReminder: (medName: string, dose: string, time: string) => ({
    subject: `Time for ${escapeHtml(medName)}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Medication Reminder</h2>
        <p>It's time to take your medication:</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <strong>${escapeHtml(medName)}</strong> - ${escapeHtml(dose)}
        </div>
        <p style="color: #6b7280; font-size: 14px;">Scheduled for: ${escapeHtml(time)}</p>
        <p>Open the CareCompass app to log your dose.</p>
      </div>
    `,
  }),

  appointmentReminder: (provider: string, date: string, time: string, type: string) => ({
    subject: `Upcoming Appointment: ${escapeHtml(provider)}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Appointment Reminder</h2>
        <p>You have an upcoming appointment:</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Provider:</strong> ${escapeHtml(provider)}</p>
          <p><strong>Date:</strong> ${escapeHtml(date)}</p>
          <p><strong>Time:</strong> ${escapeHtml(time)}</p>
          <p><strong>Type:</strong> ${escapeHtml(type)}</p>
        </div>
        <p>Open the CareCompass app for details and telehealth link.</p>
      </div>
    `,
  }),

  crisisFollowUp: (patientName: string) => ({
    subject: `Checking in on you`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">We're thinking of you</h2>
        <p>Hi ${escapeHtml(patientName)},</p>
        <p>We noticed you were having a difficult time recently. We want you to know that support is available 24/7.</p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin-top: 0; color: #dc2626;">Crisis Resources</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>988</strong> - National Suicide Prevention Lifeline (call or text)</li>
            <li><strong>Text HOME to 741741</strong> - Crisis Text Line</li>
            <li><strong>911</strong> - Emergency services</li>
          </ul>
        </div>
        <p>Your care team has been notified and will follow up with you.</p>
      </div>
    `,
  }),

  visitPrepReady: (appointmentDate: string, provider: string) => ({
    subject: `Your visit prep is ready for ${escapeHtml(provider)}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Visit Preparation Complete</h2>
        <p>Your AI-generated visit summary for your appointment with <strong>${escapeHtml(provider)}</strong> on <strong>${escapeHtml(appointmentDate)}</strong> is ready.</p>
        <p>Open the CareCompass app to review your personalized summary, including:</p>
        <ul>
          <li>Recent health trends</li>
          <li>Medication changes</li>
          <li>Key concerns to discuss</li>
          <li>Questions for your provider</li>
        </ul>
      </div>
    `,
  }),
};