"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { LocaleToggle } from "./LocaleToggle";
import { company } from "@/lib/data/company";

// Full-height mobile nav drawer. Both backdrop and panel are direct fixed
// elements (not nested inside a positioned parent), so the panel height is
// computed against the viewport reliably on iOS Safari. `h-dvh` uses the
// dynamic viewport unit, which adjusts for the URL bar.

const NAV_LINKS = [
  { href: "/services", key: "services" },
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
  { href: "/certification", key: "preQualification" },
  { href: "/contact", key: "contact" },
] as const;

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const t = useTranslations("header");
  const locale = useLocale();
  const reduce = useReducedMotion();

  // In LTR the panel is anchored to the right (end-0) and slides in from
  // off-screen-right. In RTL it's anchored to the left and slides in from
  // off-screen-left.
  const offX = locale === "ar" ? "-100%" : "100%";

  // Esc closes. Body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — separate fixed sibling so the panel doesn't depend
              on a nested positioned ancestor for its height. */}
          <motion.button
            key="mobilenav-backdrop"
            type="button"
            onClick={onClose}
            aria-label={t("mobileNav.close")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.3 }}
            className="fixed inset-0 z-[60] bg-fg/40 backdrop-blur-sm md:hidden"
          />

          {/* Panel — fixed to viewport, h-dvh handles iOS URL bar correctly. */}
          <motion.div
            key="mobilenav-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t("mobileNav.label")}
            initial={reduce ? { opacity: 0 } : { x: offX }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: offX }}
            transition={{ duration: reduce ? 0.15 : 0.35, ease }}
            className="fixed end-0 top-0 z-[61] flex h-dvh w-full max-w-[420px] flex-col bg-bg shadow-2xl md:hidden"
          >
            <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border px-6">
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-fg-subtle">
                {t("mobileNav.menu")}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("mobileNav.close")}
                className="-me-2 flex h-11 w-11 items-center justify-center rounded text-fg hover:text-accent transition-colors duration-200"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M4 4L16 16M16 4L4 16"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="square"
                  />
                </svg>
              </button>
            </div>

            <nav
              aria-label={t("mobileNav.label")}
              className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-8"
            >
              <ul>
                {NAV_LINKS.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block border-b border-border py-5 text-fg transition-colors duration-200 hover:text-accent"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-h2)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {t(`nav.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href="/order"
                onClick={onClose}
                className="mt-10 inline-flex h-14 items-center justify-center bg-accent px-8 text-base font-medium text-bg hover:bg-accent-hover transition-colors duration-200"
              >
                {t("cta")}
              </Link>

              {/* Contact shortcuts */}
              <div className="mt-10 space-y-4 border-t border-border pt-8">
                <a
                  href={company.whatsapp.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onClose}
                  className="block"
                >
                  <span className="block text-xs font-medium uppercase tracking-[0.18em] text-fg-subtle">
                    {t("mobileNav.whatsapp")}
                  </span>
                  <span dir="ltr" className="mt-1 block text-base text-fg">
                    {company.whatsapp.display}
                  </span>
                </a>
                <div>
                  <span className="block text-xs font-medium uppercase tracking-[0.18em] text-fg-subtle">
                    {t("mobileNav.phone")}
                  </span>
                  {/* Both client lines listed under one label, primary first. */}
                  <span className="mt-1 flex flex-col gap-1">
                    {[company.phone, company.phone2].map((p) => (
                      <a
                        key={p.href}
                        href={`tel:${p.href}`}
                        onClick={onClose}
                        dir="ltr"
                        className="block text-base text-fg transition-colors duration-200 hover:text-accent"
                      >
                        {p.display}
                      </a>
                    ))}
                  </span>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-fg-subtle">
                  {t("localeToggle.label")}
                </span>
                <LocaleToggle />
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
