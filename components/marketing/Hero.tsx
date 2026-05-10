"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

// TODO: Replace `/images/truck_fleet.png` with commissioned Sermix
// photography before launch. The replacement should keep the same
// compositional rule: subject fills the frame, visual mass weighted
// toward the start side so it points back at the headline.
const HERO_IMAGE = "/images/truck_fleet.png";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const reduce = useReducedMotion();

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      id="main"
      className="relative overflow-hidden bg-bg min-h-[70vh] md:min-h-[78vh] flex items-center"
      aria-labelledby="hero-headline"
    >
      <div className="mx-auto grid w-full max-w-[var(--container-max)] grid-cols-1 items-center gap-10 px-6 py-12 md:grid-cols-[38fr_62fr] md:gap-12 md:px-10 md:py-16">
        {/* Text — start side, 45% on md+ */}
        <div>
          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.2 : 0.6, ease }}
            className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-fg-muted"
          >
            <span dir="ltr">{t("eyebrow")}</span>
          </motion.p>

          <motion.h1
            id="hero-headline"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.2 : 0.6, delay: 0.08, ease }}
            className="text-fg font-extrabold leading-[0.95]"
            style={{
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
            className="mt-8 max-w-[58ch] text-lg leading-relaxed text-fg-muted md:text-xl"
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
              className="inline-flex h-14 items-center justify-center border border-fg/25 bg-transparent px-8 text-base font-medium text-fg hover:bg-fg hover:text-bg transition-colors duration-200"
            >
              {t("ctaSecondary")}
            </Link>
          </motion.div>
        </div>

        {/* Image — end side, 55% on md+. Fade-in only on load, no slide,
            no Ken Burns. The image holds still once it lands. Reduced motion
            shortens the fade. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0.2 : 1.0, delay: 0.2, ease }}
          className="relative aspect-[3/2] overflow-hidden rounded-[4px]"
        >
          <Image
            src={HERO_IMAGE}
            alt={t("imageAlt")}
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 768px) 62vw, 100vw"
            className="object-cover"
          />
          {/* Subtle overlay to bind the image to the whiteish surface */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-multiply"
            style={{
              background:
                "linear-gradient(135deg, rgba(248,247,245,0.0) 0%, rgba(248,247,245,0.18) 100%)",
            }}
          />
        </motion.div>
      </div>

      {/* Scroll affordance — subtle, not decorative. Sits at the bottom-center
          of the hero section to signal the page continues below. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-3"
      >
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-fg-subtle">
          {t("scrollLabel")}
        </span>
        <span className="block h-8 w-px bg-concrete/70" />
      </div>
    </section>
  );
}
