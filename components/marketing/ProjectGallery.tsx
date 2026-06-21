"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

// Project gallery + lightbox. The grid keeps the alternating-height rhythm the
// detail page used inline; each tile is a button that opens a fullscreen
// lightbox of the selected image. The lightbox is a client-side modal —
// Escape / backdrop / close button dismiss it, arrow keys (and on-screen
// controls) step through, and body scroll is locked while it is open.

type ProjectGalleryProps = {
  images: readonly string[];
  /** Project name, used to build per-image alt text. */
  name: string;
  /** Localised "Gallery" eyebrow, supplied by the server component. */
  eyebrow: string;
};

export function ProjectGallery({ images, name, eyebrow }: ProjectGalleryProps) {
  const t = useTranslations("projectDetail.gallery");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((i) =>
        i === null ? i : (i + delta + images.length) % images.length,
      ),
    [images.length],
  );

  // Keyboard control + body scroll lock while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, step]);

  return (
    <section className="bg-bg pb-24 md:pb-32">
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        <p className="mb-8 text-sm font-medium uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
        {/* Uniform grid — every tile is the same square so rows align with no
            ragged gaps; object-cover crops each image to fit (no need to resize
            the source files). A small consistent gutter separates the tiles. */}
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
          {images.map((src, i) => (
            <Reveal key={`${src}-${i}`} delay={i * 0.06}>
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={t("viewLarger")}
                className="group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Image
                  src={src}
                  alt={`${name} — ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={name}
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(20,24,31,0.92)] p-4 md:p-8"
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
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

          {images.length > 1 && (
            <>
              {/* Previous */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label={t("previous")}
                className="absolute start-2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full text-[var(--color-fg-on-steel)] transition-colors hover:bg-white/10 md:start-6"
              >
                <span aria-hidden className="text-2xl rtl:rotate-180">
                  ←
                </span>
              </button>
              {/* Next */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
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

          {/* The enlarged image. object-contain so any aspect ratio fits the
              viewport without cropping. stopPropagation keeps a click on the
              image itself from closing the modal. */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-[82vh] w-[90vw] max-w-[1100px]"
          >
            <Image
              src={images[openIndex]!}
              alt={`${name} — ${openIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
}
