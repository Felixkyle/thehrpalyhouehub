import { Resend } from "resend";
import { env } from "../config/env.js";

let client: Resend | null = null;

function getClient(): Resend | null {
  if (!env.resendApiKey) return null;
  if (!client) client = new Resend(env.resendApiKey);
  return client;
}

interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Send an email via Resend. If RESEND_API_KEY is not configured the email is
 * logged to the console instead of sent, so local/dev never blocks on email.
 * Never throws — email failures must not break the request that triggered them.
 */
export async function sendEmail({ to, subject, html, replyTo }: SendArgs): Promise<void> {
  const resend = getClient();
  if (!resend) {
    console.log(`[email:stub] to=${Array.isArray(to) ? to.join(",") : to} subject="${subject}"`);
    return;
  }
  try {
    await resend.emails.send({
      from: env.emailFrom,
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
  } catch (err) {
    console.error(`[email] failed to send "${subject}":`, err);
  }
}

const FORM_INBOX = "contact@thehrplayhousehub.org";

function layout(body: string): string {
  return `<div style="font-family:system-ui,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;line-height:1.6">${body}<hr style="border:none;border-top:1px solid #eee;margin:24px 0"><p style="font-size:12px;color:#888">The HR Playhouse Hub</p></div>`;
}

// ── Transactional ──────────────────────────────────────────────────

export function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  return sendEmail({
    to,
    subject: "Reset your password",
    html: layout(
      `<h2>Reset your password</h2><p>We received a request to reset your password. Click the link below — it expires in 1 hour.</p><p><a href="${resetUrl}" style="display:inline-block;background:#0b6b3a;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Reset password</a></p><p style="font-size:13px;color:#666">If you didn't request this, you can safely ignore this email.</p>`,
    ),
  });
}

export function sendSignupConfirmationEmail(to: string, firstName: string): Promise<void> {
  return sendEmail({
    to,
    subject: "Welcome to The HR Playhouse Hub",
    html: layout(
      `<h2>Welcome, ${firstName}!</h2><p>Your account is ready. You can now sign in and start exploring courses, the case-study vault, and the community.</p>`,
    ),
  });
}

export function sendWebinarConfirmationEmail(
  to: string,
  firstName: string,
  webinarTitle: string,
  scheduledAt?: string | null,
): Promise<void> {
  const when = scheduledAt ? `<p><strong>When:</strong> ${new Date(scheduledAt).toUTCString()}</p>` : "";
  return sendEmail({
    to,
    subject: `You're registered: ${webinarTitle}`,
    html: layout(
      `<h2>You're registered, ${firstName}</h2><p>You've successfully registered for <strong>${webinarTitle}</strong>.</p>${when}<p>We'll send you the joining details before the session.</p>`,
    ),
  });
}

// ── Form submissions → contact inbox ───────────────────────────────

export function sendEnquiryNotification(
  kind: string,
  fields: Record<string, string | null | undefined>,
): Promise<void> {
  const rows = Object.entries(fields)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:600;vertical-align:top">${k}</td><td style="padding:4px 0">${String(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");
  return sendEmail({
    to: FORM_INBOX,
    replyTo: fields.email ?? undefined,
    subject: `New ${kind} enquiry`,
    html: layout(`<h2>New ${kind} enquiry</h2><table>${rows}</table>`),
  });
}
