import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { Stats } from "@/components/marketing/Stats";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/lib/i18n/navigation";
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
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return { title: t("metaTitle") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <PageHeroSlot />
      <FoundingStory />
      <Stats />
      <Leadership />
      <ManagementHierarchy />
      <Facilities />
      <CtaStrip />
    </main>
  );
}

function PageHeroSlot() {
  const t = useTranslations("aboutPage");
  return (
    <PageHero
      eyebrow={t("hero.eyebrow")}
      title={t("hero.title")}
      lede={t("hero.lede")}
    />
  );
}

// ── Founding story ──────────────────────────────────────────────────────────
function FoundingStory() {
  const t = useTranslations("aboutPage.story");
  const locale = useLocale();

  return (
    <section className="bg-bg py-20 md:py-28">
      <div className="mx-auto grid max-w-[var(--container-max)] grid-cols-1 items-start gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-10">
        <Reveal>
          <div>
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-accent">
              {t("eyebrow")}
            </p>
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
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-fg-muted">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
              <p>{t("p3")}</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="relative aspect-[3/2] overflow-hidden rounded-[4px] bg-surface-2">
            {/* Looping, muted, inline autoplay so it behaves like a moving
                image (no controls, plays on mobile). Poster paints instantly
                and is the fallback if the video can't load. */}
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/videos/about_us_video.mp4"
              poster="/images/sermix_truck_employee.png"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label={t("imageAlt")}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Leadership ──────────────────────────────────────────────────────────────
const FOUNDERS = [
  { key: "founder1", image: "/images/team/founder-1.png" },
  { key: "founder2", image: "/images/team/founder-2.png" },
  { key: "founder3", image: "/images/team/founder-3.png" },
] as const;

function Leadership() {
  const t = useTranslations("aboutPage.leadership");
  const locale = useLocale();

  return (
    <section className="bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
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

        <ul className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {FOUNDERS.map((f, i) => (
            <Reveal key={f.key} delay={0.08 + i * 0.08}>
              <li>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-surface-2">
                  <Image
                    src={f.image}
                    alt={t(`${f.key}.name`)}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover [filter:saturate(0.88)]"
                  />
                </div>
                <h3
                  className="mt-6 text-fg font-extrabold leading-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-h2)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {t(`${f.key}.name`)}
                </h3>
                <p className="mt-3 max-w-[36ch] text-sm font-medium uppercase tracking-[0.18em] text-accent">
                  {t(`${f.key}.role`)}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── Management system hierarchy ─────────────────────────────────────────────
// Standalone section showing the org/management-system chart. The asset is a
// wide diagram, so it's rendered object-contain at its natural ratio (never
// cropped) on a contrasting card.
function ManagementHierarchy() {
  const t = useTranslations("aboutPage.hierarchy");
  const locale = useLocale();

  return (
    <section className="border-y border-border bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
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
          <div className="mt-12 overflow-hidden rounded-[4px] border border-border bg-surface p-4 md:p-8">
            <Image
              src="/images/management-system-hierarchy.png"
              alt={t("imageAlt")}
              width={1403}
              height={752}
              sizes="(min-width: 1200px) 1136px, (min-width: 768px) 90vw, 92vw"
              className="h-auto w-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Facilities (3-tile grid) ────────────────────────────────────────────────
const FACILITIES = [
  { key: "plant", image: "/images/facility_3.jpeg" },
  { key: "lab", image: "/images/lab_1.jpeg" },
  { key: "fleet", image: "/images/fleet_1.jpeg" },
] as const;

function Facilities() {
  const t = useTranslations("aboutPage.facilities");
  const locale = useLocale();

  return (
    <section className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        <Reveal>
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            {t("eyebrow")}
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
            {t("title")}
          </h2>
        </Reveal>

        <ul className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {FACILITIES.map((facility, i) => (
            <Reveal key={facility.key} delay={0.08 + i * 0.08} className="h-full">
              <li className="flex h-full flex-col border border-border bg-bg">
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
                  <Image
                    src={facility.image}
                    alt={t(`${facility.key}.title`)}
                    fill
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <span
                    dir="ltr"
                    className="text-xs font-medium tracking-[0.22em] text-fg-subtle"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="mt-8 text-fg font-extrabold leading-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-h2)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {t(`${facility.key}.title`)}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-fg-muted">
                    {t(`${facility.key}.body`)}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── CTA strip ───────────────────────────────────────────────────────────────
function CtaStrip() {
  const t = useTranslations("aboutPage.cta");
  const locale = useLocale();

  return (
    <section className="bg-[var(--color-steel)] py-20 md:py-24">
      <div className="mx-auto flex max-w-[var(--container-max)] flex-col items-start gap-8 px-6 md:flex-row md:items-end md:justify-between md:px-10">
        <h2
          className="max-w-[18ch] font-extrabold leading-[1.05]"
          style={{
            color: "var(--color-fg-on-steel)",
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display-md)",
            letterSpacing: locale === "ar" ? "-0.01em" : "-0.02em",
          }}
        >
          {t("title")}
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/order"
            className="inline-flex h-14 items-center justify-center bg-accent px-8 text-base font-medium text-bg hover:bg-accent-hover transition-colors duration-200"
          >
            {t("primary")}
          </Link>
          <a
            href={company.whatsapp.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-14 items-center justify-center border px-8 text-base font-medium transition-colors duration-200"
            style={{
              borderColor: "var(--color-fg-on-steel-muted)",
              color: "var(--color-fg-on-steel)",
            }}
          >
            {t("secondary")}
          </a>
        </div>
      </div>
    </section>
  );
}
