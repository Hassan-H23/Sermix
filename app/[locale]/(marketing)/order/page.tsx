import { setRequestLocale, getTranslations } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { OrderForm } from "@/components/forms/OrderForm";
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
  const t = await getTranslations({ locale, namespace: "orderPage" });
  return { title: t("metaTitle") };
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <PageHeroSlot />
      <ProcessStrip />
      <OrderFormSection />
      <UrgentBand />
    </main>
  );
}

function PageHeroSlot() {
  const t = useTranslations("orderPage");
  return (
    <PageHero
      eyebrow={t("hero.eyebrow")}
      title={t("hero.title")}
      lede={t("hero.lede")}
    />
  );
}

// ── Process strip ───────────────────────────────────────────────────────────
const PROCESS_STEPS = ["submit", "confirm", "design", "schedule"] as const;

function ProcessStrip() {
  const t = useTranslations("orderPage.process");

  return (
    <section className="border-y border-border bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        <Reveal>
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            {t("eyebrow")}
          </p>
        </Reveal>
        <ol className="mt-8 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step} delay={0.06 + i * 0.06}>
              <li className="border-t border-border pt-5">
                <span
                  dir="ltr"
                  className="text-fg/30 font-extrabold leading-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-display-md)",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="mt-5 text-fg font-extrabold leading-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-h2)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {t(`${step}.title`)}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-fg-muted">
                  {t(`${step}.body`)}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ── Order form section ──────────────────────────────────────────────────────
function OrderFormSection() {
  const t = useTranslations("orderPage.formSection");
  const locale = useLocale();

  return (
    <section className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_3fr] md:gap-16">
          <div>
            <Reveal>
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-accent">
                {t("eyebrow")}
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                className="max-w-[20ch] text-fg font-extrabold leading-[1.05]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-display-md)",
                  letterSpacing: locale === "ar" ? "-0.01em" : "-0.02em",
                }}
              >
                {t("title")}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-[44ch] text-base leading-relaxed text-fg-muted">
                {t("body")}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <dl className="mt-10 space-y-5">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-[0.18em] text-fg-subtle">
                    {t("hints.required.label")}
                  </dt>
                  <dd className="mt-2 text-sm text-fg-muted">
                    {t("hints.required.body")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-[0.18em] text-fg-subtle">
                    {t("hints.response.label")}
                  </dt>
                  <dd className="mt-2 text-sm text-fg-muted">
                    {t("hints.response.body")}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <OrderForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Urgent contact band ─────────────────────────────────────────────────────
function UrgentBand() {
  const t = useTranslations("orderPage.urgent");
  const locale = useLocale();

  return (
    <section className="bg-[var(--color-steel)] py-20 md:py-24">
      <div className="mx-auto flex max-w-[var(--container-max)] flex-col items-start gap-8 px-6 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p
            className="text-xs font-medium uppercase tracking-[0.22em]"
            style={{ color: "var(--color-fg-on-steel-muted)" }}
          >
            {t("eyebrow")}
          </p>
          <h2
            className="mt-3 max-w-[22ch] font-extrabold leading-[1.05]"
            style={{
              color: "var(--color-fg-on-steel)",
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-display-md)",
              letterSpacing: locale === "ar" ? "-0.01em" : "-0.02em",
            }}
          >
            {t("title")}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={company.whatsapp.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-14 items-center justify-center bg-accent px-8 text-base font-medium text-bg hover:bg-accent-hover transition-colors duration-200"
          >
            {t("whatsappCta")}
            <span dir="ltr" className="ms-3">
              {company.whatsapp.display}
            </span>
          </a>
          <a
            href={`tel:${company.phone.href}`}
            className="inline-flex h-14 items-center justify-center border px-8 text-base font-medium transition-colors duration-200"
            style={{
              borderColor: "var(--color-fg-on-steel-muted)",
              color: "var(--color-fg-on-steel)",
            }}
          >
            {t("phoneCta")}
            <span dir="ltr" className="ms-3">
              {company.phone.display}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
