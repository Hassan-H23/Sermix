"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Full-bleed auto-rotating hero. Slide 0 is a self-hosted MP4 clip (concrete
// pour b-roll, trimmed to 0:13–1:16 of the source); the rest are stills with
// a slow Ken Burns zoom so they read as cinematic backdrop rather than static
// photos. Everything is lightly blurred — the foreground text is the lead.
// A dark token-driven overlay carries legibility for the cream copy on top.
//
// Rotation: video plays once (~63s) then advances; images advance every 6s.
// Reduced-motion users see only the first slide (poster frame for the video),
// no auto-advance, no zoom, no transitions.

// Each slide pairs a media source with a translation key under `hero.slides.*`,
// so the headline rotates with the imagery. Arabic slogans in messages/ar.json
// are working translations and should be reviewed by a native speaker before
// launch (CLAUDE.md flags Arabic copy as client-supplied).

type Slide =
  | {
      type: "video";
      src: string;
      poster: string;
      alt: string;
      headlineKey: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
      headlineKey: string;
    };

const SLIDES: ReadonlyArray<Slide> = [
  {
    type: "video",
    src: "/videos/hero.mp4",
    // Still frame extracted from the clip at t=2s. Visible while the MP4 loads
    // and remains if it fails to play.
    poster: "/videos/hero-poster.jpg",
    alt: "Sermix concrete pour in progress",
    headlineKey: "video",
  },
  {
    type: "image",
    src: "/images/slider/facility_image.jpeg",
    alt: "Sermix production facility",
    headlineKey: "foundation",
  },
  {
    type: "image",
    src: "/images/slider/image4.jpeg",
    alt: "Sermix concrete operations",
    headlineKey: "vision",
  },
  {
    type: "image",
    src: "/images/slider/workers_pouring.jpeg",
    alt: "Sermix crew placing concrete on site",
    headlineKey: "drafted",
  },
  {
    type: "image",
    src: "/images/slider/pouring_building.jpeg",
    alt: "Concrete being poured at a Sermix project",
    headlineKey: "blueprint",
  },
];

const IMAGE_ADVANCE_MS = 6000;
// Ken Burns runs slightly longer than the slide so the zoom is still moving
// when the crossfade starts — feels continuous rather than reset-on-change.
const KEN_BURNS_MS = 8000;

export function HeroSlider() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const reduce = useReducedMotion();

  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const current = SLIDES[index]!;

  // Auto-advance — only image slides advance on a timer; the video slide
  // loops via its `loop` attribute and stays put until the user clicks an
  // indicator dot. Reduced motion disables auto-advance entirely.
  useEffect(() => {
    if (reduce) return;
    if (SLIDES[index]!.type !== "image") return;
    const id = window.setTimeout(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      IMAGE_ADVANCE_MS,
    );
    return () => window.clearTimeout(id);
  }, [index, reduce]);

  // When the video slide mounts, kick it off from the start. Some browsers
  // hold the previous playhead when the element is reused, even though our
  // `key={current.src}` should remount it — belt and braces.
  useEffect(() => {
    if (current.type !== "video") return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    if (!reduce) {
      // Autoplay can reject (e.g., low-power mode). Swallow — poster stays
      // visible and the fallback timer still advances the slide.
      void v.play().catch(() => {});
    }
  }, [current, reduce]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      id="main"
      aria-labelledby="hero-headline"
      className="relative isolate overflow-hidden bg-[var(--color-steel)] min-h-[78dvh] sm:min-h-[80dvh] md:min-h-[86dvh] flex items-center"
    >
      {/* Slide media — crossfade. AnimatePresence with mode="sync" so the
          outgoing slide overlaps the incoming one for the duration of the
          transition. */}
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
          {current.type === "video" ? (
            <video
              ref={videoRef}
              src={current.src}
              poster={current.poster}
              autoPlay={!reduce}
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover scale-[1.08] [filter:blur(6px)_saturate(0.92)]"
            />
          ) : (
            // Ken Burns wrapper. Slow linear scale from 1.05 → 1.18 over
            // KEN_BURNS_MS; outer motion.div above handles the opacity fade.
            <motion.div
              key={`kb-${current.src}`}
              initial={{ scale: reduce ? 1.08 : 1.05 }}
              animate={{ scale: reduce ? 1.08 : 1.18 }}
              transition={{
                duration: reduce ? 0 : KEN_BURNS_MS / 1000,
                ease: "linear",
              }}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src={current.src}
                alt=""
                fill
                priority={index <= 1}
                fetchPriority={index === 0 ? "high" : undefined}
                sizes="100vw"
                className="object-cover [filter:blur(6px)_saturate(0.92)]"
              />
            </motion.div>
          )}
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
          // key on headlineKey forces a remount on slide change, so the new
          // headline runs its enter animation each time. No exit animation —
          // the background crossfade carries the eye across the transition.
          key={current.headlineKey}
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
          {t(`slides.${current.headlineKey}`)}
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

      {/* Indicator dots — click to jump. Sits centred at the bottom.
          The container offset compensates for the buttons' enlarged tap area
          so the visible line stays at roughly the same edge distance. */}
      <div
        className="absolute inset-x-0 bottom-2 z-10 flex items-center justify-center gap-3 md:bottom-4"
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
              // h-11 / px-2 give a 44×~40px hit area for iOS tap-target
              // minimums; the visible 2px line stays the same size inside.
              className="group flex h-11 items-center px-2"
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
