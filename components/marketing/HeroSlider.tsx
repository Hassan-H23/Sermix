"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Full-bleed auto-rotating hero slider. Each slide is one image, lightly
// blurred so it reads as atmospheric backdrop rather than a sharp photo —
// the foreground text is the lead. Dark token-driven overlay carries
// legibility for the cream copy on top.
//
// Auto-advance every 6s, crossfade transition (1.2s). Reduced-motion users
// see only the first slide with no transitions and no auto-advance.

const SLIDES: ReadonlyArray<{ src: string; alt: string }> = [
  { src: "/images/slider/image1.png", alt: "Sermix batching plant silos and aggregate stockpiles" },
  { src: "/images/slider/image2.jpg", alt: "Aggregate conveyor discharging at the plant" },
  { src: "/images/slider/image3.png", alt: "Sermix-stamped concrete panel — building better futures" },
];

const ADVANCE_MS = 6000;

export function HeroSlider() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const reduce = useReducedMotion();

  const [index, setIndex] = useState(0);

  // Auto-advance — paused entirely under reduced motion.
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      ADVANCE_MS,
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  const ease = [0.22, 1, 0.36, 1] as const;
  const current = SLIDES[index]!;

  return (
    <section
      id="main"
      aria-labelledby="hero-headline"
      className="relative isolate overflow-hidden bg-[var(--color-steel)] min-h-[78vh] sm:min-h-[80vh] md:min-h-[86vh] flex items-center"
    >
      {/* Slide images — crossfade. AnimatePresence with mode="sync" so an
          outgoing slide overlaps the incoming one for the duration of the
          transition. Each image carries a baseline scale so the blur edge
          never exposes the section boundary. */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={current.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 1.2, ease }}
          className="absolute inset-0"
          aria-hidden
        >
          <Image
            src={current.src}
            alt=""
            fill
            priority={index === 0}
            fetchPriority={index === 0 ? "high" : undefined}
            sizes="100vw"
            className="object-cover scale-[1.08] [filter:blur(6px)_saturate(0.92)]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay for legibility. Diagonal gradient — denser on the
          start side where the headline sits. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(20,24,31,0.82) 0%, rgba(20,24,31,0.62) 60%, rgba(20,24,31,0.74) 100%)",
        }}
      />

      {/* Foreground content — same hero strings, recoloured for the dark
          slider surface. */}
      <div className="relative z-10 mx-auto w-full max-w-[var(--container-max)] px-6 py-16 md:px-10 md:py-20">
        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.6, ease }}
          className="mb-6 text-sm font-medium uppercase tracking-[0.22em]"
          style={{ color: "var(--color-fg-on-steel-muted)" }}
        >
          <span dir="ltr">{t("eyebrow")}</span>
        </motion.p>

        <motion.h1
          id="hero-headline"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.6, delay: 0.08, ease }}
          className="max-w-[18ch] font-extrabold leading-[0.95]"
          style={{
            color: "var(--color-fg-on-steel)",
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display-xl)",
            letterSpacing: locale === "ar" ? "-0.01em" : "-0.03em",
          }}
        >
          {t("headline")}
        </motion.h1>

        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.6, delay: 0.16, ease }}
          className="mt-8 max-w-[58ch] text-lg leading-relaxed md:text-xl"
          style={{ color: "var(--color-fg-on-steel-muted)" }}
        >
          {t("subhead")}
        </motion.p>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.6, delay: 0.24, ease }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href={`/${locale}/order`}
            className="inline-flex h-14 items-center justify-center bg-accent px-8 text-base font-medium text-bg hover:bg-accent-hover transition-colors duration-200"
          >
            {t("ctaPrimary")}
          </Link>
          <Link
            href={`/${locale}/services`}
            className="inline-flex h-14 items-center justify-center border px-8 text-base font-medium transition-colors duration-200"
            style={{
              borderColor: "var(--color-fg-on-steel-muted)",
              color: "var(--color-fg-on-steel)",
            }}
          >
            {t("ctaSecondary")}
          </Link>
        </motion.div>
      </div>

      {/* Indicator dots — click to jump. Sits centred at the bottom. */}
      <div
        className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-3 md:bottom-8"
        role="tablist"
        aria-label={t("sliderLabel")}
      >
        {SLIDES.map((slide, i) => {
          const active = i === index;
          return (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={t("slide", { n: i + 1 })}
              onClick={() => setIndex(i)}
              className="group flex h-3 items-center"
            >
              <span
                aria-hidden
                className={[
                  "block h-[2px] transition-[width,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  active ? "w-12 bg-accent" : "w-6 bg-white/40 group-hover:bg-white/70",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
