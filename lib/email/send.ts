import { Resend } from "resend";

// Resend wrapper. If RESEND_API_KEY isn't set, sendEmail is a no-op that
// logs to the server console and returns success — so the whole submission
// pipeline (validation → API → response → success screen) works end-to-end
// against a stub today, and goes live the moment env vars are added.
//
// Required env vars in production:
//   RESEND_API_KEY      — Resend account key
//   CONTACT_EMAIL_TO    — inbox that receives Sermix enquiries
//   CONTACT_EMAIL_FROM  — sender (must be a verified domain in Resend)

type SendArgs = {
  subject: string;
  // Plain text or HTML; we send both.
  text: string;
  html: string;
  // Optional reply-to so the recipient can hit Reply and reach the submitter.
  replyTo?: string;
};

export async function sendEmail({ subject, text, html, replyTo }: SendArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO ?? "info@sermix.com.eg";
  const from =
    process.env.CONTACT_EMAIL_FROM ?? "Sermix Website <noreply@sermix.com.eg>";

  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY not set — running in stub mode. Submission logged:",
      { to, from, subject, replyTo },
    );
    console.warn(text);
    return { ok: true, stub: true } as const;
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    to,
    from,
    subject,
    text,
    html,
    ...(replyTo ? { replyTo } : {}),
  });

  if (result.error) {
    console.error("[email] Resend error:", result.error);
    return { ok: false, error: result.error.message } as const;
  }

  return { ok: true, id: result.data?.id } as const;
}
