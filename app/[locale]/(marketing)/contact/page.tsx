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

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
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
  return <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} lede={t("hero.lede")} />;
}

// ── Contact-method tiles ────────────────────────────────────────────────────
// Phone leads in one wide hero container (both lines under a single label),
// with WhatsApp and Email as two narrower tiles beneath it.
function ContactMethods() {
  const t = useTranslations("contactPage.methods");

  const phones = [company.phone, company.phone2];

  const secondary: Array<{
    id: "whatsapp" | "email";
    href: string;
    value: string;
    external?: boolean;
  }> = [
    {
      id: "whatsapp",
      href: company.whatsapp.href,
      value: company.whatsapp.display,
      external: true,
    },
    { id: "email", href: company.email.href, value: company.email.display },
  ];

  return (
    <section className="bg-bg pb-16 md:pb-20">
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        {/* Phone — one big container holding both lines. */}
        <Reveal delay={0.08}>
          <div className="border-border bg-surface border p-7 md:p-10">
            <div className="flex items-center gap-4">
              <p className="text-fg-subtle text-sm font-medium tracking-[0.18em] uppercase">
                {t("phone.label")}
              </p>
              <span aria-hidden className="bg-fg/15 h-px flex-1" />
            </div>
            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-x-16 sm:gap-y-6">
              {phones.map((p) => (
                <a key={p.href} href={`tel:${p.href}`} className="group block">
                  <span
                    dir="ltr"
                    className="text-fg group-hover:text-accent leading-none font-extrabold transition-colors duration-200"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-display-md)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {p.display}
                  </span>
                </a>
              ))}
            </div>
            <p className="text-fg-muted mt-6 max-w-[52ch] text-sm">{t("phone.helper")}</p>
          </div>
        </Reveal>

        {/* WhatsApp + Email — two separate containers. */}
        <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {secondary.map((m, i) => (
            <Reveal key={m.id} delay={0.14 + i * 0.06} className="h-full">
              <li className="h-full">
                <a
                  href={m.href}
                  {...(m.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="group border-border bg-surface hover:bg-surface-2 flex h-full flex-col justify-between gap-8 border p-7 transition-colors duration-300 md:p-8"
                >
                  <div className="flex items-center gap-4">
                    <p className="text-fg-subtle text-sm font-medium tracking-[0.18em] uppercase">
                      {t(`${m.id}.label`)}
                    </p>
                    <span
                      aria-hidden
                      className="bg-fg/15 group-hover:bg-accent block h-px w-12 transition-[width,background-color] duration-300 group-hover:w-20"
                    />
                  </div>
                  <div>
                    <p
                      dir="ltr"
                      className="text-fg leading-tight font-extrabold"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-h2)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {m.value}
                    </p>
                    <p className="text-fg-muted mt-3 text-sm">{t(`${m.id}.helper`)}</p>
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
            <p className="text-accent mb-5 text-sm font-medium tracking-[0.18em] uppercase">
              {t("form.eyebrow")}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              className="text-fg max-w-[22ch] leading-[1.05] font-extrabold"
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
            <p className="text-fg-muted mt-6 max-w-[58ch] text-base leading-relaxed">
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
              <p className="text-accent mb-5 text-sm font-medium tracking-[0.18em] uppercase">
                {t("map.eyebrow")}
              </p>
              <h3
                className="text-fg leading-tight font-extrabold"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-h2)",
                  letterSpacing: "-0.02em",
                }}
              >
                {t("map.title")}
              </h3>
              <address className="text-fg-muted mt-4 text-base leading-relaxed not-italic">
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
    <section className="bg-surface border-border border-y">
      <div className="mx-auto grid max-w-[var(--container-max)] grid-cols-1 gap-10 px-6 py-14 md:grid-cols-3 md:px-10">
        <div>
          <p className="text-fg-subtle text-xs font-medium tracking-[0.22em] uppercase">
            {t("operations.label")}
          </p>
          <p
            className="text-fg mt-3 leading-tight font-extrabold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h2)",
              letterSpacing: "-0.02em",
            }}
          >
            <span dir="ltr">24 / 7</span>
          </p>
          <p className="text-fg-muted mt-2 text-sm">{t("operations.body")}</p>
        </div>
        <div>
          <p className="text-fg-subtle text-xs font-medium tracking-[0.22em] uppercase">
            {t("office.label")}
          </p>
          <p
            className="text-fg mt-3 leading-tight font-extrabold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h2)",
              letterSpacing: "-0.02em",
            }}
          >
            {locale === "ar" ? company.hours.officeWindow_ar : company.hours.officeWindow}
          </p>
          <p className="text-fg-muted mt-2 text-sm">{t("office.body")}</p>
        </div>
        <div>
          <p className="text-fg-subtle text-xs font-medium tracking-[0.22em] uppercase">
            {t("response.label")}
          </p>
          <p
            className="text-fg mt-3 leading-tight font-extrabold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h2)",
              letterSpacing: "-0.02em",
            }}
          >
            <span dir="ltr">{"< 2h"}</span>
          </p>
          <p className="text-fg-muted mt-2 text-sm">{t("response.body")}</p>
        </div>
      </div>
    </section>
  );
}
