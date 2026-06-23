import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/forms/schemas";
import { sendEmail } from "@/lib/email/send";
import {
  brandedEmailShell,
  emailSection,
  emailRow,
  emailParagraph,
  loadLogoAttachment,
} from "@/lib/email/template";

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

  const NA = "—";

  // Plain-text fallback (Egyptian Arabic), for clients that don't render HTML.
  const text = [
    "طلب خرسانة جديد من موقع سيرميكس",
    "",
    "── المشروع ──",
    `اسم المشروع:   ${o.projectName}`,
    `الموقع:        ${o.projectLocation}`,
    `المقاول:       ${o.contractor || NA}`,
    "",
    "── المواصفات ──",
    `درجة الخرسانة: ${o.grade}`,
    `الكمية:        ${o.volumeM3} m³`,
    `الهبوط:        ${o.slump || NA}`,
    "",
    "── المواعيد ──",
    `التاريخ:       ${o.date}`,
    `الميعاد:       ${o.timeWindow || NA}`,
    "",
    "── بيانات التواصل في الموقع ──",
    `الاسم:         ${o.contactName}`,
    `التليفون:      ${o.contactPhone}`,
    `الإيميل:       ${o.contactEmail}`,
    "",
    "── ملاحظات ──",
    o.notes || NA,
  ].join("\n");

  const logo = await loadLogoAttachment();

  const contentHtml =
    emailSection(
      "تفاصيل المشروع",
      emailRow("اسم المشروع", o.projectName) +
        emailRow("الموقع", o.projectLocation) +
        emailRow("المقاول", o.contractor || NA),
    ) +
    emailSection(
      "مواصفات الخرسانة",
      emailRow("الدرجة", o.grade) +
        emailRow("الكمية", `${o.volumeM3} m³`) +
        emailRow("الهبوط (Slump)", o.slump || NA),
    ) +
    emailSection(
      "مواعيد الصب",
      emailRow("التاريخ", o.date) + emailRow("الميعاد", o.timeWindow || NA),
    ) +
    emailSection(
      "بيانات التواصل في الموقع",
      emailRow("الاسم", o.contactName) +
        emailRow("التليفون", o.contactPhone) +
        emailRow("الإيميل", o.contactEmail),
    ) +
    (o.notes ? emailParagraph("ملاحظات إضافية", o.notes) : "");

  const html = brandedEmailShell({
    eyebrow: "طلب خرسانة جديد",
    heading: o.projectName,
    contentHtml,
    footnote:
      "وصلك الطلب ده من فورم الطلب على موقع سيرميكس. تقدر ترد على الإيميل ده علطول عشان توصل للعميل.",
    hasLogo: !!logo,
  });

  const result = await sendEmail({
    subject: `طلب خرسانة — ${o.projectName} (${o.grade}، ${o.volumeM3} m³)`,
    text,
    html,
    replyTo: o.contactEmail,
    attachments: logo ? [logo] : undefined,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
