import { setRequestLocale, getTranslations } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { MapEmbed } from "@/components/marketing/MapEmbed";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { routing } from "@/lib/i18n/routing";
import { company } from "@/lib/data/company";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return { title: t("metaTitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <PageHeroSlot />
      <ContactMethods />
      <FormAndMap />
      <HoursBand />
    </main>
  );
}

function PageHeroSlot() {
  const t = useTranslations("contactPage");
  return (
    <PageHero
      eyebrow={t("hero.eyebrow")}
      title={t("hero.title")}
      lede={t("hero.lede")}
    />
  );
}

// ── Three contact-method tiles ──────────────────────────────────────────────
function ContactMethods() {
  const t = useTranslations("contactPage.methods");

  // Each tile is a clickable card linking to its channel. WhatsApp first
  // because CLAUDE.md flags it as a primary channel on mobile.
  const methods: Array<{
    key: "whatsapp" | "phone" | "email";
    href: string;
    value: string;
    external?: boolean;
  }> = [
    { key: "whatsapp", href: company.whatsapp.href, value: company.whatsapp.display, external: true },
    { key: "phone", href: `tel:${company.phone.href}`, value: company.phone.display },
    { key: "email", href: company.email.href, value: company.email.display },
  ];

  return (
    <section className="bg-bg pb-16 md:pb-20">
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {methods.map((m, i) => (
            // h-full chains: grid item (Reveal) → <li> → <a>. Without the
            // explicit h-full on each link in the chain, the helper-text
            // length differences leave shorter cards visibly shorter.
            <Reveal key={m.key} delay={0.08 + i * 0.06} className="h-full">
              <li className="h-full">
                <a
                  href={m.href}
                  {...(m.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="group flex h-full flex-col justify-between gap-8 border border-border bg-surface p-7 transition-colors duration-300 hover:bg-surface-2 md:p-8"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      dir="ltr"
                      className="text-xs font-medium tracking-[0.22em] text-fg-subtle"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden
                      className="block h-px w-12 bg-fg/15 transition-[width,background-color] duration-300 group-hover:w-20 group-hover:bg-accent"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-fg-subtle">
                      {t(`${m.key}.label`)}
                    </p>
                    <p
                      dir="ltr"
                      className="mt-3 text-fg font-extrabold leading-tight"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-h2)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {m.value}
                    </p>
                    <p className="mt-3 text-sm text-fg-muted">
                      {t(`${m.key}.helper`)}
                    </p>
                  </div>
                </a>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── Form + Map split ────────────────────────────────────────────────────────
function FormAndMap() {
  const t = useTranslations("contactPage");
  const locale = useLocale();

  return (
    <section className="bg-bg py-20 md:py-28">
      <div className="mx-auto grid max-w-[var(--container-max)] grid-cols-1 gap-12 px-6 md:grid-cols-[3fr_2fr] md:gap-16 md:px-10">
        <div>
          <Reveal>
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-accent">
              {t("form.eyebrow")}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              className="max-w-[22ch] text-fg font-extrabold leading-[1.05]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-display-md)",
                letterSpacing: locale === "ar" ? "-0.01em" : "-0.02em",
              }}
            >
              {t("form.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-fg-muted">
              {t("form.lede")}
            </p>
          </Reveal>

          <div className="mt-10">
            <ContactForm />
          </div>
        </div>

        <div className="md:sticky md:top-24">
          <Reveal delay={0.1}>
            <div>
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-accent">
                {t("map.eyebrow")}
              </p>
              <h3
                className="text-fg font-extrabold leading-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-h2)",
                  letterSpacing: "-0.02em",
                }}
              >
                {t("map.title")}
              </h3>
              <address className="mt-4 not-italic text-base leading-relaxed text-fg-muted">
                {company.address.line1}
                <br />
                {company.address.line2}
              </address>

              <div className="mt-6 h-[360px]">
                <MapEmbed label={t("map.embedLabel")} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Hours band ──────────────────────────────────────────────────────────────
function HoursBand() {
  const t = useTranslations("contactPage.hours");
  const locale = useLocale();

  return (
    <section className="bg-surface border-y border-border">
      <div className="mx-auto grid max-w-[var(--container-max)] grid-cols-1 gap-10 px-6 py-14 md:grid-cols-3 md:px-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-fg-subtle">
            {t("operations.label")}
          </p>
          <p
            className="mt-3 text-fg font-extrabold leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h2)",
              letterSpacing: "-0.02em",
            }}
          >
            <span dir="ltr">24 / 7</span>
          </p>
          <p className="mt-2 text-sm text-fg-muted">{t("operations.body")}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-fg-subtle">
            {t("office.label")}
          </p>
          <p
            className="mt-3 text-fg font-extrabold leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h2)",
              letterSpacing: "-0.02em",
            }}
          >
            {locale === "ar" ? company.hours.officeWindow_ar : company.hours.officeWindow}
          </p>
          <p className="mt-2 text-sm text-fg-muted">{t("office.body")}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-fg-subtle">
            {t("response.label")}
          </p>
          <p
            className="mt-3 text-fg font-extrabold leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h2)",
              letterSpacing: "-0.02em",
            }}
          >
            <span dir="ltr">{"< 2h"}</span>
          </p>
          <p className="mt-2 text-sm text-fg-muted">{t("response.body")}</p>
        </div>
      </div>
    </section>
  );
}
