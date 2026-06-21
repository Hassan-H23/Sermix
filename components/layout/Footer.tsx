import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { company } from "@/lib/data/company";

// Global footer — appears on every marketing page via (marketing)/layout.tsx.
//
// Structure:
//   1. Top band — white logo + tagline (brand statement)
//   2. Four info columns — Plant / Site / Contact / Hours, all aligned to
//      the same baseline (their eyebrow labels share a grid row top edge,
//      so nothing reads as visually shifted).
//   3. Bottom bar — copyright on start, origin tag on end.

const NAV_LINKS = [
  { href: "/services", key: "services" },
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
  { href: "/order", key: "order" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("header.nav");
  const locale = useLocale();
  const year = new Date().getFullYear();

  const mapHref = `https://www.openstreetmap.org/?mlat=${company.map.lat}&mlon=${company.map.lng}#map=${company.map.zoom}/${company.map.lat}/${company.map.lng}`;

  return (
    <footer
      className="bg-[var(--color-steel)] pt-20 pb-10 md:pt-24 md:pb-12"
      style={{ color: "var(--color-fg-on-steel)" }}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        {/* ── Top band: logo + tagline ─────────────────────────────────── */}
        <div className="flex flex-col items-start gap-6">
          <Image
            src="/images/sermix_logo_white.png"
            alt={t("logoAlt")}
            width={148}
            height={107}
            className="h-12 w-auto"
          />
          <p
            className="max-w-[58ch] text-base leading-relaxed md:text-lg"
            style={{ color: "var(--color-fg-on-steel-muted)" }}
          >
            {t("tagline")}
          </p>
        </div>

        {/* ── 4 info columns ───────────────────────────────────────────── */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {/* Plant / address */}
          <FooterColumn label={t("columns.plant")}>
            <address
              className="text-base leading-relaxed not-italic"
              style={{ color: "var(--color-fg-on-steel)" }}
            >
              {company.address.line1}
              <br />
              {company.address.line2}
            </address>
            <a
              href={mapHref}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent mt-4 inline-flex items-center text-sm font-medium tracking-tight transition-colors duration-200"
              style={{ color: "var(--color-fg-on-steel-muted)" }}
            >
              {t("viewOnMap")}
              <span aria-hidden className="ms-2 rtl:rotate-180">
                ↗
              </span>
            </a>
          </FooterColumn>

          {/* Site nav */}
          <FooterColumn label={t("columns.site")}>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="hover:text-accent text-base transition-colors duration-200"
                    style={{ color: "var(--color-fg-on-steel)" }}
                  >
                    {link.key === "order" ? t("orderLink") : tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Contact methods */}
          <FooterColumn label={t("columns.contact")}>
            <ul className="space-y-5">
              {/* Both phone lines share a single "Phone" label. */}
              <li>
                <span
                  className="block text-xs font-medium tracking-[0.18em] uppercase"
                  style={{ color: "var(--color-fg-on-steel-muted)" }}
                >
                  {t("contactItems.phone")}
                </span>
                <span className="mt-1 flex flex-col gap-1">
                  {[company.phone, company.phone2].map((p) => (
                    <a
                      key={p.href}
                      href={`tel:${p.href}`}
                      className="group block transition-colors duration-200"
                    >
                      <span
                        dir="ltr"
                        className="group-hover:text-accent block text-base"
                        style={{ color: "var(--color-fg-on-steel)" }}
                      >
                        {p.display}
                      </span>
                    </a>
                  ))}
                </span>
              </li>
              <ContactItem
                label={t("contactItems.whatsapp")}
                value={company.whatsapp.display}
                href={company.whatsapp.href}
                external
              />
              <ContactItem
                label={t("contactItems.email")}
                value={company.email.display}
                href={company.email.href}
                breakAll
              />
            </ul>
          </FooterColumn>

          {/* Hours — two stats side by side */}
          <FooterColumn label={t("columns.hours")}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2">
              <dt
                className="text-xs font-medium tracking-[0.18em] uppercase"
                style={{ color: "var(--color-fg-on-steel-muted)" }}
              >
                {t("hours.operations.label")}
              </dt>
              <dt
                className="text-xs font-medium tracking-[0.18em] uppercase"
                style={{ color: "var(--color-fg-on-steel-muted)" }}
              >
                {t("hours.office.label")}
              </dt>
              <dd
                className="leading-tight font-extrabold"
                style={{
                  color: "var(--color-fg-on-steel)",
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-h2)",
                  letterSpacing: "-0.02em",
                }}
              >
                <span dir="ltr">24 / 7</span>
              </dd>
              <dd className="text-base leading-snug" style={{ color: "var(--color-fg-on-steel)" }}>
                {locale === "ar" ? company.hours.officeWindow_ar : company.hours.officeWindow}
              </dd>
            </dl>
          </FooterColumn>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────── */}
        <div
          className="mt-16 flex flex-col items-start justify-between gap-4 border-t pt-8 md:flex-row md:items-center md:gap-8"
          style={{ borderColor: "rgba(245,240,230,0.18)" }}
        >
          <p className="text-sm" style={{ color: "var(--color-fg-on-steel-muted)" }}>
            {t("copyright", { year, name: company.legalName })}
          </p>
          <p
            className="text-xs tracking-[0.22em] uppercase"
            style={{ color: "var(--color-fg-on-steel-muted)" }}
          >
            <span dir="ltr">{t("origin")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Internal helpers — keep column markup uniform so the eyebrow labels
//    line up on the same baseline across all four columns. ─────────────────

function FooterColumn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="h-full rounded-[4px] border p-6"
      style={{
        borderColor: "rgba(245,240,230,0.18)",
        backgroundColor: "rgba(245,240,230,0.03)",
      }}
    >
      <p
        className="text-xs font-medium tracking-[0.22em] uppercase"
        style={{ color: "var(--color-fg-on-steel-muted)" }}
      >
        {label}
      </p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function ContactItem({
  label,
  value,
  href,
  external,
  breakAll,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
  breakAll?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="group block transition-colors duration-200"
      >
        <span
          className="block text-xs font-medium tracking-[0.18em] uppercase"
          style={{ color: "var(--color-fg-on-steel-muted)" }}
        >
          {label}
        </span>
        <span
          dir="ltr"
          className={`group-hover:text-accent mt-1 block text-base ${breakAll ? "break-all" : ""}`}
          style={{ color: "var(--color-fg-on-steel)" }}
        >
          {value}
        </span>
      </a>
    </li>
  );
}
