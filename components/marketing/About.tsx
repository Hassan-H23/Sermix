import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

// About split — copy on the start side, paired imagery on the end side.
// Two stacked photographs offset to give material weight (mirrors the
// reference site's "two stacked images" pattern but with our cropping).
//
// TODO: replace stacked photos with commissioned plant + crew portraits
// before launch. Current images are real Sermix material but were shot for
// general use, not for this composition.

export function About() {
  const t = useTranslations("about");
  const locale = useLocale();

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="bg-bg py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-[var(--container-max)] grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-10">
        <div>
          <Reveal>
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-accent">
              {t("eyebrow")}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              id="about-title"
              className="max-w-[18ch] text-fg font-extrabold leading-[1.05]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-display-lg)",
                letterSpacing: locale === "ar" ? "-0.01em" : "-0.02em",
              }}
            >
              {t("title")}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-fg-muted">
              {t("body")}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <li className="border-t border-border pt-4">
                <span className="block text-xs font-medium uppercase tracking-[0.18em] text-fg-subtle">
                  {t("pillars.reliability.label")}
                </span>
                <span className="mt-2 block text-base text-fg">
                  {t("pillars.reliability.value")}
                </span>
              </li>
              <li className="border-t border-border pt-4">
                <span className="block text-xs font-medium uppercase tracking-[0.18em] text-fg-subtle">
                  {t("pillars.experience.label")}
                </span>
                <span className="mt-2 block text-base text-fg">
                  {t("pillars.experience.value")}
                </span>
              </li>
            </ul>
          </Reveal>
          <Reveal delay={0.24}>
            <Link
              href={`/${locale}/about`}
              className="mt-10 inline-flex h-12 items-center border-b border-fg/30 pb-1 text-sm font-medium tracking-tight text-fg hover:border-accent hover:text-accent transition-colors duration-200"
            >
              {t("cta")}
              <span aria-hidden className="ms-2 rtl:rotate-180">
                →
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="relative">
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[4px]">
              <Image
                src="/images/hero-truck.jpg"
                alt={t("imageAlt.primary")}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="absolute -bottom-10 end-0 hidden aspect-[4/3] w-2/3 overflow-hidden rounded-[4px] border-4 border-bg sm:block">
              <Image
                src="/images/steel_beam.jpeg"
                alt={t("imageAlt.secondary")}
                fill
                sizes="(min-width: 768px) 28vw, 60vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
