"use client";

import { useLocale } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

// Compact page hero used by About / Contact / Order / Services pages.
// Smaller than the home Hero (no image, no scroll affordance) — just
// eyebrow + headline + lede on cream surface. Sets the page in tone
// without competing with the full home hero.

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lede?: string;
};

export function PageHero({ eyebrow, title, lede }: PageHeroProps) {
  const locale = useLocale();
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      id="main"
      className="relative bg-bg pt-28 pb-16 md:pt-36 md:pb-20"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.6, ease }}
          className="mb-5 text-sm font-medium uppercase tracking-[0.22em] text-accent"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.6, delay: 0.08, ease }}
          className="max-w-[22ch] text-fg font-extrabold leading-[1.02]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display-lg)",
            letterSpacing: locale === "ar" ? "-0.01em" : "-0.02em",
          }}
        >
          {title}
        </motion.h1>
        {lede && (
          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.2 : 0.6, delay: 0.16, ease }}
            className="mt-8 max-w-[60ch] text-lg leading-relaxed text-fg-muted md:text-xl"
          >
            {lede}
          </motion.p>
        )}
      </div>
    </section>
  );
}
