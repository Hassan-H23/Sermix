import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { PrecastSlider } from "@/components/marketing/PrecastSlider";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/lib/i18n/navigation";
import { services, type Service } from "@/lib/data/services";
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
  const t = await getTranslations({ locale, namespace: "servicesPage" });
  return { title: t("metaTitle") };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <PageHeroSlot />
      <ServicesOverview />
      <ServiceSections />
      <CtaStrip />
    </main>
  );
}

function PageHeroSlot() {
  const t = useTranslations("servicesPage");
  return (
    <PageHero
      eyebrow={t("hero.eyebrow")}
      title={t("hero.title")}
      lede={t("hero.lede")}
    />
  );
}

// ── Overview ────────────────────────────────────────────────────────────────
// Compact list of all services with anchor links into the deep sections
// below. Differs from the home bento — this is a directory, not a feature
// pitch.
function ServicesOverview() {
  const locale = useLocale();
  const t = useTranslations("servicesPage.overview");

  return (
    <section className="border-y border-border bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        <Reveal>
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            {t("eyebrow")}
          </p>
        </Reveal>
        <ul className="mt-8 grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const name = locale === "ar" ? s.name_ar : s.name;
            const desc =
              locale === "ar" ? s.shortDescription_ar : s.shortDescription;
            // Precast links out to its project case study rather than
            // scrolling to the in-page section.
            const isPrecast = s.slug === "precast-concrete";
            const inner = (
              <>
                <div className="flex items-baseline justify-between gap-4">
                  <span
                    dir="ltr"
                    className="text-xs font-medium tracking-[0.22em] text-fg-subtle"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="block h-px w-10 bg-fg/15 transition-[width,background-color] duration-300 group-hover:w-16 group-hover:bg-accent"
                  />
                </div>
                <h3
                  className="mt-5 text-fg font-extrabold leading-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-h2)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {name}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-fg-muted">
                  {desc}
                </p>
              </>
            );
            return (
              <Reveal key={s.slug} delay={0.04 + i * 0.05}>
                <li className="border-t border-border pt-5">
                  {isPrecast ? (
                    <Link href="/projects/pre-cast" className="group block">
                      {inner}
                    </Link>
                  ) : (
                    <a href={`#${s.slug}`} className="group block">
                      {inner}
                    </a>
                  )}
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ── Deep sections ───────────────────────────────────────────────────────────
// One section per service. Alternates start/end image placement for visual
// rhythm (even indices: image on end; odd indices: image on start). Each
// section has copy + key-fact list + anchor target for /services#slug.
function ServiceSections() {
  return (
    <>
      {services.map((service, i) => (
        <ServiceBlock key={service.slug} service={service} index={i} />
      ))}
    </>
  );
}

function ServiceBlock({ service, index }: { service: Service; index: number }) {
  const locale = useLocale();
  const tFacts = useTranslations("servicesPage.facts");

  const name = locale === "ar" ? service.name_ar : service.name;
  const desc =
    locale === "ar" ? service.longDescription_ar : service.longDescription;
  const imageAlt = locale === "ar" ? service.imageAlt_ar : service.imageAlt;

  const imageOnEnd = index % 2 === 0;
  const isPrecast = service.slug === "precast-concrete";

  // Shared copy column — rendered inside the 2-up grid for normal services,
  // and as a full-width block above the slider for precast.
  const copy = (
    <>
      <Reveal>
        <p
          dir="ltr"
          className="mb-5 text-xs font-medium tracking-[0.22em] text-fg-subtle"
        >
          {String(index + 1).padStart(2, "0")} · {tFacts("eyebrow")}
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2
          id={`${service.slug}-title`}
          className="max-w-[18ch] text-fg font-extrabold leading-[1.05]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display-md)",
            letterSpacing: locale === "ar" ? "-0.01em" : "-0.02em",
          }}
        >
          {name}
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-fg-muted">
          {desc}
        </p>
      </Reveal>
      {service.keyFacts.length > 0 && (
        <Reveal delay={0.18}>
          <dl className="mt-10 border-t border-border">
            {service.keyFacts.map((fact, fi) => {
              const label = locale === "ar" ? fact.label_ar : fact.label;
              const value = locale === "ar" ? fact.value_ar : fact.value;
              return (
                <div
                  key={fi}
                  className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border py-4"
                >
                  <dt className="text-xs font-medium uppercase tracking-[0.18em] text-fg-subtle">
                    {label}
                  </dt>
                  <dd
                    className="text-fg font-extrabold leading-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-h2)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    <span dir="ltr">{value}</span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </Reveal>
      )}
    </>
  );

  // Precast gets a full-bleed horizontal slider (current image, then
  // pre_cast_9, then pre_cast_8) below its copy instead of the side image.
  if (isPrecast) {
    const galleryImages = [
      { src: "/images/projects/pre-cast/pre_cast_slider_image_1.jpeg", alt: imageAlt },
      { src: "/images/projects/pre-cast/pre_cast_slider_image_2.jpeg", alt: imageAlt },
      { src: "/images/projects/pre-cast/pre_cast_slider_image_3.jpeg", alt: imageAlt },
    ];
    return (
      <section
        id={service.slug}
        aria-labelledby={`${service.slug}-title`}
        className="scroll-mt-24 bg-bg py-24 md:py-32"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
          {copy}
        </div>
        <Reveal delay={0.12} className="mt-12 md:mt-16">
          <div className="mx-auto max-w-[var(--content-max)] px-6 md:px-10">
            <PrecastSlider images={galleryImages} />
          </div>
        </Reveal>
      </section>
    );
  }

  return (
    <section
      id={service.slug}
      aria-labelledby={`${service.slug}-title`}
      className="scroll-mt-24 bg-bg py-24 md:py-32"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Copy column */}
          <div className={imageOnEnd ? "md:order-1" : "md:order-2"}>{copy}</div>

          {/* Image column */}
          <Reveal
            delay={0.12}
            className={imageOnEnd ? "md:order-2" : "md:order-1"}
          >
            <div className="relative aspect-[3/2] overflow-hidden rounded-[4px]">
              <Image
                src={service.image}
                alt={imageAlt}
                fill
                sizes="(min-width: 768px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── CTA strip ───────────────────────────────────────────────────────────────
function CtaStrip() {
  const t = useTranslations("servicesPage.cta");
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
            className="mt-3 max-w-[20ch] font-extrabold leading-[1.05]"
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
