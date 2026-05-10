import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/forms/schemas";
import { sendEmail } from "@/lib/email/send";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const o = parsed.data;

  const text = [
    "New Sermix concrete order",
    "",
    "── PROJECT ──",
    `Name:        ${o.projectName}`,
    `Location:    ${o.projectLocation}`,
    `Contractor:  ${o.contractor || "—"}`,
    "",
    "── SPEC ──",
    `Grade:       ${o.grade}`,
    `Volume:      ${o.volumeM3} m³`,
    `Slump:       ${o.slump || "—"}`,
    "",
    "── SCHEDULE ──",
    `Date:        ${o.date}`,
    `Time:        ${o.timeWindow || "—"}`,
    "",
    "── SITE CONTACT ──",
    `Name:        ${o.contactName}`,
    `Phone:       ${o.contactPhone}`,
    `Email:       ${o.contactEmail}`,
    "",
    "── NOTES ──",
    o.notes || "—",
  ].join("\n");

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0"><b>${label}</b></td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`;

  const html = `
    <h2 style="font-family:sans-serif">New Sermix concrete order</h2>
    <h3 style="font-family:sans-serif;border-bottom:1px solid #ddd;padding-bottom:4px">Project</h3>
    <table style="font-family:sans-serif;font-size:14px">
      ${row("Name", o.projectName)}
      ${row("Location", o.projectLocation)}
      ${row("Contractor", o.contractor || "—")}
    </table>
    <h3 style="font-family:sans-serif;border-bottom:1px solid #ddd;padding-bottom:4px">Spec</h3>
    <table style="font-family:sans-serif;font-size:14px">
      ${row("Grade", o.grade)}
      ${row("Volume", `${o.volumeM3} m³`)}
      ${row("Slump", o.slump || "—")}
    </table>
    <h3 style="font-family:sans-serif;border-bottom:1px solid #ddd;padding-bottom:4px">Schedule</h3>
    <table style="font-family:sans-serif;font-size:14px">
      ${row("Date", o.date)}
      ${row("Time window", o.timeWindow || "—")}
    </table>
    <h3 style="font-family:sans-serif;border-bottom:1px solid #ddd;padding-bottom:4px">Site contact</h3>
    <table style="font-family:sans-serif;font-size:14px">
      ${row("Name", o.contactName)}
      ${row("Phone", o.contactPhone)}
      ${row("Email", o.contactEmail)}
    </table>
    ${o.notes ? `<h3 style="font-family:sans-serif">Notes</h3><p style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(o.notes)}</p>` : ""}
  `;

  const result = await sendEmail({
    subject: `Concrete order — ${o.projectName} (${o.grade}, ${o.volumeM3} m³)`,
    text,
    html,
    replyTo: o.contactEmail,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
