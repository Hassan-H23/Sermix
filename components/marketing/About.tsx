"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";

// About split — copy on the start side, paired imagery on the end side.
// Two stacked photographs offset to give material weight (mirrors the
// reference site's "two stacked images" pattern but with our cropping).
//
// TODO: replace stacked photos with commissioned plant + crew portraits
// before launch. Current images are real Sermix material but were shot for
// general use, not for this composition.

// One-time mixer-truck intro. The (animated GIF) truck drives the whole way
// across the section from right to left WITHOUT stopping. The content is wiped
// in behind it — revealed in the truck's wake from right to left — with a
// glowing "pour seam" riding the reveal edge. When the truck exits the left
// side, the content is fully laid down and stays put.
//
// A single `progress` motion value (0 → 1) drives the truck position, the
// content wipe, and the seam together, so they stay locked regardless of
// easing.
//
// Module-level flag (NOT sessionStorage): a module variable stays resident for
// as long as the JS bundle is loaded, so it survives client-side navigation
// away-and-back to the home page — the intro plays once per visit and never
// again while browsing. A full page reload re-executes the bundle, resetting
// the flag, so a hard refresh plays it again. That's the requested behaviour.
let truckIntroPlayed = false;

// Seconds for the truck to cross the full width. Bump this to slow the intro.
const CROSS_DURATION = 5;

export function About() {
  const t = useTranslations("about");
  const locale = useLocale();

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3, once: true });

  const [armed, setArmed] = useState(false);
  const [showTruck, setShowTruck] = useState(false);

  // A single progress value drives the truck. The reveal cover and the pour
  // seam are children of the truck wrapper, so they inherit its exact motion —
  // they move with the truck at the truck's speed, by construction, with no
  // separate mapping that could drift.
  const progress = useMotionValue(0);
  // Truck crosses from fully off the right edge to fully off the left edge.
  const truckX = useTransform(progress, [0, 1], ["115vw", "-60vw"]);

  // Decide before first paint whether the intro should run. The server markup
  // is fully visible (so no-JS / already-played / reduced-motion all render
  // correctly); arming here mounts the cover synchronously before the browser
  // paints, avoiding a flash of un-laid content.
  useLayoutEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (truckIntroPlayed || prefersReduced) return;

    setArmed(true);
    setShowTruck(true);
  }, []);

  useEffect(() => {
    if (!armed || !inView) return;

    truckIntroPlayed = true;
    let cancelled = false;

    const controls = animate(progress, 1, {
      duration: CROSS_DURATION,
      ease: "linear",
    });
    controls.then(() => {
      if (!cancelled) setShowTruck(false); // truck has exited; drop it + the seam
    });

    return () => {
      cancelled = true;
      controls.stop();
    };
  }, [armed, inView, progress]);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-title"
      className="relative overflow-hidden bg-bg pt-32 pb-24 md:pt-44 md:pb-32"
    >
      {showTruck && (
        // The truck drives across the TOP lane (above the copy, so it never
        // overlaps content). The cover and seam are its CHILDREN, so they share
        // its transform exactly — locked to the truck's position and speed.
        // The truck is a transparent PNG (its background was color-keyed out),
        // so it floats on the page over any background. The source GIF was ~99%
        // static, so a single still loses nothing and avoids alpha-video issues.
        <motion.div
          aria-hidden
          style={{ x: truckX }}
          className="pointer-events-none absolute top-[16px] left-0 z-30 w-[160px] md:top-[20px] md:w-[240px]"
        >
          {/* Cream cover anchored to the truck's REAR edge, extending far to
              the left and down over the copy: it hides everything the truck
              hasn't passed yet. As the truck advances left, the cover follows,
              laying the content down in its wake. Starts below the truck so it
              never sits on the truck itself. Section overflow-hidden clips it. */}
          <div className="absolute top-[94px] right-0 h-[200vh] w-[200vw] bg-bg md:top-[140px]" />

          {/* The pour seam: a glowing line at the reveal edge (the truck's rear),
              starting just below the truck so it does not overlap the truck. */}
          <div
            className="absolute top-[94px] right-0 h-[200vh] w-[3px] md:top-[140px]"
            style={{
              background: "var(--color-accent)",
              boxShadow: "0 0 22px 3px var(--color-accent)",
            }}
          />

          <Image
            src="/images/cement_truck.png"
            alt=""
            width={800}
            height={450}
            className="relative h-auto w-full"
          />
        </motion.div>
      )}

      <div className="relative">
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
      </div>
    </section>
  );
}
