import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { company } from "@/lib/data/company";

// Global footer — appears on every marketing page via (marketing)/layout.tsx.
//
// Background is --color-steel (the same dark band token used by the CTA strips
// and the project-detail "Next project" footer). Text uses the on-steel pair
// (--color-fg-on-steel, --color-fg-on-steel-muted).
//
// TODO: the brand wordmark below is rendered as type because the supplied
// sermix_logo.png is navy + red on white — invisible on a dark surface.
// Request a cream/white variant from the client and swap in <Image>.

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
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          {/* Brand + address — wide column */}
          <div className="md:col-span-5">
            <p
              className="font-extrabold leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-display-md)",
                letterSpacing: "-0.03em",
              }}
            >
              Sermix
            </p>
            <p
              className="mt-6 max-w-[36ch] text-base leading-relaxed"
              style={{ color: "var(--color-fg-on-steel-muted)" }}
            >
              {t("tagline")}
            </p>

            <address
              className="mt-10 not-italic text-base leading-relaxed"
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
              className="mt-4 inline-flex items-center text-sm font-medium tracking-tight transition-colors duration-200 hover:text-accent"
              style={{ color: "var(--color-fg-on-steel-muted)" }}
            >
              {t("viewOnMap")}
              <span aria-hidden className="ms-2 rtl:rotate-180">
                ↗
              </span>
            </a>
          </div>

          {/* Site nav */}
          <div className="md:col-span-2">
            <p
              className="text-xs font-medium uppercase tracking-[0.22em]"
              style={{ color: "var(--color-fg-on-steel-muted)" }}
            >
              {t("columns.site")}
            </p>
            <ul className="mt-6 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-base transition-colors duration-200 hover:text-accent"
                    style={{ color: "var(--color-fg-on-steel)" }}
                  >
                    {link.key === "order" ? t("orderLink") : tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact methods — label on top, value below, so the WhatsApp
              tag never collides with the number inline. Same shape as Hours. */}
          <div className="md:col-span-3">
            <p
              className="text-xs font-medium uppercase tracking-[0.22em]"
              style={{ color: "var(--color-fg-on-steel-muted)" }}
            >
              {t("columns.contact")}
            </p>
            <ul className="mt-6 space-y-5">
              <li>
                <a
                  href={`tel:${company.phone.href}`}
                  className="group block transition-colors duration-200"
                >
                  <span
                    className="block text-xs font-medium uppercase tracking-[0.18em]"
                    style={{ color: "var(--color-fg-on-steel-muted)" }}
                  >
                    {t("contactItems.phone")}
                  </span>
                  <span
                    dir="ltr"
                    className="mt-1 block text-base group-hover:text-accent"
                    style={{ color: "var(--color-fg-on-steel)" }}
                  >
                    {company.phone.display}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={company.whatsapp.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group block transition-colors duration-200"
                >
                  <span
                    className="block text-xs font-medium uppercase tracking-[0.18em]"
                    style={{ color: "var(--color-fg-on-steel-muted)" }}
                  >
                    {t("contactItems.whatsapp")}
                  </span>
                  <span
                    dir="ltr"
                    className="mt-1 block text-base group-hover:text-accent"
                    style={{ color: "var(--color-fg-on-steel)" }}
                  >
                    {company.whatsapp.display}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={company.email.href}
                  className="group block transition-colors duration-200"
                >
                  <span
                    className="block text-xs font-medium uppercase tracking-[0.18em]"
                    style={{ color: "var(--color-fg-on-steel-muted)" }}
                  >
                    {t("contactItems.email")}
                  </span>
                  <span
                    dir="ltr"
                    className="mt-1 block break-all text-base group-hover:text-accent"
                    style={{ color: "var(--color-fg-on-steel)" }}
                  >
                    {company.email.display}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Hours — Operations and Office side by side instead of stacked. */}
          <div className="md:col-span-2">
            <p
              className="text-xs font-medium uppercase tracking-[0.22em]"
              style={{ color: "var(--color-fg-on-steel-muted)" }}
            >
              {t("columns.hours")}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2">
              <dt
                className="text-xs font-medium uppercase tracking-[0.18em]"
                style={{ color: "var(--color-fg-on-steel-muted)" }}
              >
                {t("hours.operations.label")}
              </dt>
              <dt
                className="text-xs font-medium uppercase tracking-[0.18em]"
                style={{ color: "var(--color-fg-on-steel-muted)" }}
              >
                {t("hours.office.label")}
              </dt>
              <dd
                className="font-extrabold leading-tight"
                style={{
                  color: "var(--color-fg-on-steel)",
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-h2)",
                  letterSpacing: "-0.02em",
                }}
              >
                <span dir="ltr">24 / 7</span>
              </dd>
              <dd
                className="text-base leading-snug"
                style={{ color: "var(--color-fg-on-steel)" }}
              >
                {locale === "ar"
                  ? company.hours.officeWindow_ar
                  : company.hours.officeWindow}
              </dd>
            </dl>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 flex flex-col items-start justify-between gap-4 border-t pt-8 md:flex-row md:items-center md:gap-8"
          style={{ borderColor: "rgba(245,240,230,0.18)" }}
        >
          <p
            className="text-sm"
            style={{ color: "var(--color-fg-on-steel-muted)" }}
          >
            {t("copyright", { year, name: company.legalName })}
          </p>
          <p
            className="text-xs uppercase tracking-[0.22em]"
            style={{ color: "var(--color-fg-on-steel-muted)" }}
          >
            <span dir="ltr">{t("origin")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
