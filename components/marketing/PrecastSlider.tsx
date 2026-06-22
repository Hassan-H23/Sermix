"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

// Full-bleed horizontal slider for the precast service section. One image at a
// time, sliding horizontally, spanning the full page width. Tapping the active
// image opens a fullscreen lightbox (object-contain) so the user can see the
// uncropped image — the "zoom in" interaction. Reuses the generic
// `projectDetail.gallery` labels rather than introducing new message keys.
//
// Reduced motion: slides cross-fade instead of translating; the lightbox still
// works, just without the entrance animation.

type SliderImage = { src: string; alt: string };

export function PrecastSlider({ images }: { images: ReadonlyArray<SliderImage> }) {
  const t = useTranslations("projectDetail.gallery");
  const reduce = useReducedMotion();
  const count = images.length;

  // [index, direction] — direction drives the slide-in/out x offset.
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [zoomed, setZoomed] = useState(false);

  const paginate = useCallback(
    (delta: number) => setState(([i]) => [(i + delta + count) % count, delta]),
    [count],
  );
  const goTo = useCallback(
    (target: number) =>
      setState(([i]) => [target, target === i ? 0 : target > i ? 1 : -1]),
    [],
  );

  // Arrow keys step through; Escape closes the lightbox.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1);
      else if (e.key === "ArrowLeft") paginate(-1);
      else if (e.key === "Escape") setZoomed(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [paginate]);

  // Lock body scroll while the lightbox is open.
  useEffect(() => {
    if (!zoomed) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [zoomed]);

  const current = images[index]!;
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="w-full">
      {/* Slider viewport — full page width, fixed responsive aspect ratio. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-steel)] sm:aspect-[16/9] md:aspect-[21/9]">
        <AnimatePresence custom={dir} mode="sync" initial={false}>
          <motion.button
            type="button"
            key={index}
            custom={dir}
            variants={{
              enter: (d: number) => ({
                x: reduce ? 0 : `${d * 100}%`,
                opacity: reduce ? 0 : 1,
              }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({
                x: reduce ? 0 : `${-d * 100}%`,
                opacity: reduce ? 0 : 1,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0 : 0.6, ease }}
            onClick={() => setZoomed(true)}
            aria-label={t("viewLarger")}
            className="absolute inset-0 cursor-zoom-in"
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover"
            />
          </motion.button>
        </AnimatePresence>

        {/* Prev / Next */}
        <button
          type="button"
          onClick={() => paginate(-1)}
          aria-label={t("previous")}
          className="absolute start-3 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(20,24,31,0.5)] text-[var(--color-fg-on-steel)] backdrop-blur transition-colors hover:bg-[rgba(20,24,31,0.75)] md:start-6"
        >
          <span aria-hidden className="text-2xl rtl:rotate-180">
            ←
          </span>
        </button>
        <button
          type="button"
          onClick={() => paginate(1)}
          aria-label={t("next")}
          className="absolute end-3 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(20,24,31,0.5)] text-[var(--color-fg-on-steel)] backdrop-blur transition-colors hover:bg-[rgba(20,24,31,0.75)] md:end-6"
        >
          <span aria-hidden className="text-2xl rtl:rotate-180">
            →
          </span>
        </button>
      </div>

      {/* Indicator dots */}
      <div className="mt-5 flex items-center justify-center gap-3">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            aria-label={t("viewLarger")}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className="group flex h-6 items-center px-1"
          >
            <span
              aria-hidden
              className={[
                "block h-[3px] transition-[width,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                i === index
                  ? "w-10 bg-accent"
                  : "w-5 bg-fg/25 group-hover:bg-fg/50",
              ].join(" ")}
            />
          </button>
        ))}
      </div>

      {/* Zoom lightbox — object-contain so the uncropped image fits the
          viewport. Backdrop / close / Escape dismiss; arrows step through. */}
      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(20,24,31,0.92)] p-4 md:p-8"
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label={t("close")}
            className="absolute end-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-fg-on-steel)] transition-colors hover:bg-white/10 md:end-6 md:top-6"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(-1);
                }}
                aria-label={t("previous")}
                className="absolute start-2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full text-[var(--color-fg-on-steel)] transition-colors hover:bg-white/10 md:start-6"
              >
                <span aria-hidden className="text-2xl rtl:rotate-180">
                  ←
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(1);
                }}
                aria-label={t("next")}
                className="absolute end-2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full text-[var(--color-fg-on-steel)] transition-colors hover:bg-white/10 md:end-6"
              >
                <span aria-hidden className="text-2xl rtl:rotate-180">
                  →
                </span>
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-[82vh] w-[90vw] max-w-[1100px]"
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
