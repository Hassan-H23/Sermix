import { readFile } from "node:fs/promises";
import path from "node:path";

// Branded, RTL Arabic email shell for Sermix transactional mail (order + contact).
// Email clients ignore <style>/external CSS and custom fonts, so EVERYTHING is
// inline, table-based, and uses system Arabic-capable fonts (Tahoma/Arial).

export const LOGO_CID = "sermix-logo";

// Brand tokens, hardcoded here because tokens.css isn't reachable from an email.
const NAVY = "#1B2A6B";
const BG = "#F8F7F5";
const CARD = "#FFFFFF";
const BORDER = "#DEDAD2";
const INK = "#14110E";
const MUTED = "#5C5852";
const ON_DARK = "#F5F0E6";

const FONT = "Tahoma, Arial, 'Segoe UI', sans-serif";

// Loads the white Sermix logo as an inline attachment. Returns null if the file
// can't be read (e.g. not traced into a serverless bundle) so the email still
// sends — the shell then falls back to a text wordmark.
export async function loadLogoAttachment() {
  try {
    const file = path.join(
      process.cwd(),
      "public",
      "images",
      "sermix_logo_white.png",
    );
    const content = await readFile(file);
    return {
      filename: "sermix-logo.png",
      content,
      contentType: "image/png",
      contentId: LOGO_CID,
    };
  } catch {
    return null;
  }
}

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// One labelled row inside a section table. Values are escaped here.
export function emailRow(label: string, value: string) {
  return `<tr>
    <td style="padding:6px 0 6px 16px;font-family:${FONT};font-size:13px;color:${MUTED};white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:6px 0;font-family:${FONT};font-size:14px;color:${INK};font-weight:700;vertical-align:top">${escapeHtml(value)}</td>
  </tr>`;
}

// A titled section block (heading + its rows table).
export function emailSection(title: string, rowsHtml: string) {
  return `<div style="margin-top:24px">
    <div style="font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:0.04em;color:${NAVY};border-bottom:2px solid ${BORDER};padding-bottom:6px;margin-bottom:8px">${escapeHtml(title)}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" dir="rtl">${rowsHtml}</table>
  </div>`;
}

// A free-text block (for notes / message bodies). Preserves line breaks.
export function emailParagraph(title: string, body: string) {
  return `<div style="margin-top:24px">
    <div style="font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:0.04em;color:${NAVY};border-bottom:2px solid ${BORDER};padding-bottom:6px;margin-bottom:8px">${escapeHtml(title)}</div>
    <p style="font-family:${FONT};font-size:14px;color:${INK};line-height:1.7;margin:0;white-space:pre-wrap">${escapeHtml(body)}</p>
  </div>`;
}

type ShellArgs = {
  // Eyebrow shown above the heading inside the dark band.
  eyebrow: string;
  heading: string;
  contentHtml: string;
  footnote: string;
  // Whether the inline logo attachment is present; falls back to a wordmark.
  hasLogo: boolean;
};

export function brandedEmailShell({
  eyebrow,
  heading,
  contentHtml,
  footnote,
  hasLogo,
}: ShellArgs) {
  const logo = hasLogo
    ? `<img src="cid:${LOGO_CID}" width="150" alt="Sermix" style="display:block;border:0;height:auto;width:150px;max-width:150px" />`
    : `<span style="font-family:${FONT};font-size:30px;font-weight:800;color:${ON_DARK};letter-spacing:-0.02em">SERMIX</span>`;

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${BG}">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG}">
    <tr>
      <td align="center" style="padding:24px 16px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;background:${CARD};border:1px solid ${BORDER};border-radius:4px;overflow:hidden">
          <!-- Header band -->
          <tr>
            <td dir="rtl" style="background:${NAVY};padding:28px 32px">
              ${logo}
              <div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.08em;color:rgba(245,240,230,0.7);margin-top:16px">${escapeHtml(eyebrow)}</div>
              <div style="font-family:${FONT};font-size:22px;font-weight:800;color:${ON_DARK};margin-top:6px;letter-spacing:-0.01em">${escapeHtml(heading)}</div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td dir="rtl" style="padding:8px 32px 32px">
              ${contentHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td dir="rtl" style="padding:18px 32px;background:${BG};border-top:1px solid ${BORDER}">
              <div style="font-family:${FONT};font-size:12px;color:${MUTED};line-height:1.6">${escapeHtml(footnote)}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
