"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

// About section — a full-bleed concrete-pour video as the backdrop, blurred so
// it reads as material texture rather than literal footage, under a dark
// token-driven overlay so the cream-on-steel copy holds legibility. The copy
// sits above the video.
//
// The video is muted + autoPlay + loop + playsInline (all required for mobile
// autoplay) and poster-first via preload="none", so the first paint is the
// lightweight poster, not a video download.

export function About() {
  const t = useTranslations("about");
  const locale = useLocale();

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative overflow-hidden py-28 md:py-40"
    >
      {/* Blurred video backdrop. scale-110 hides the soft edges the blur would
          otherwise expose at the section boundary. */}
      <video
        className="absolute inset-0 h-full w-full scale-110 object-cover [filter:blur(5px)_saturate(0.95)]"
        src="/videos/pouring.mp4"
        poster="/videos/pouring-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        tabIndex={-1}
      />
      {/* Legibility overlay — dark enough to carry cream text, light enough that
          the pour still reads through. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(20,24,31,0.66) 0%, rgba(20,24,31,0.82) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        <div className="max-w-[640px]">
          <Reveal>
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-fg-on-steel-muted)]">
              {t("eyebrow")}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              id="about-title"
              className="max-w-[18ch] font-extrabold leading-[1.05] text-[var(--color-fg-on-steel)]"
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
            <p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-[var(--color-fg-on-steel-muted)]">
              {t("body")}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <li className="border-t border-[var(--color-fg-on-steel-muted)] pt-4">
                <span className="block text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-fg-on-steel-muted)]">
                  {t("pillars.reliability.label")}
                </span>
                <span className="mt-2 block text-base text-[var(--color-fg-on-steel)]">
                  {t("pillars.reliability.value")}
                </span>
              </li>
              <li className="border-t border-[var(--color-fg-on-steel-muted)] pt-4">
                <span className="block text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-fg-on-steel-muted)]">
                  {t("pillars.experience.label")}
                </span>
                <span className="mt-2 block text-base text-[var(--color-fg-on-steel)]">
                  {t("pillars.experience.value")}
                </span>
              </li>
            </ul>
          </Reveal>
          <Reveal delay={0.24}>
            <Link
              href={`/${locale}/about`}
              className="mt-10 inline-flex h-12 items-center border-b border-[var(--color-fg-on-steel-muted)] pb-1 text-sm font-medium tracking-tight text-[var(--color-fg-on-steel)] transition-colors duration-200 hover:border-[var(--color-fg-on-steel)]"
            >
              {t("cta")}
              <span aria-hidden className="ms-2 rtl:rotate-180">
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
