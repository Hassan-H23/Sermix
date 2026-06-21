"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { LocaleToggle } from "./LocaleToggle";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const t = useTranslations("header");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-bg/85 backdrop-blur-md transition-[border-color] duration-200",
        "border-b",
        scrolled ? "border-border" : "border-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-bg"
      >
        {t("skipToContent")}
      </a>

      <div className="mx-auto flex h-16 max-w-[var(--container-max)] items-center px-6 md:px-10">
        {/* Logo — supplied PNG. TODO: request SVG from client before launch (current
            asset is 588x424 raster, will not scale crisply on hi-DPI). */}
        <Link href="/" aria-label={t("logoAlt")} className="block">
          <Image
            src="/images/sermix_logo.png"
            alt={t("logoAlt")}
            width={148}
            height={107}
            priority
            className="h-9 w-auto"
          />
        </Link>

        {/* Nav — start-aligned with margin from logo */}
        <nav
          aria-label="Primary"
          className="ms-10 hidden items-center gap-8 md:flex"
        >
          <Link
            href="/services"
            className="text-sm font-medium text-fg/80 hover:text-fg transition-colors duration-200"
          >
            {t("nav.services")}
          </Link>
          <Link
            href="/projects"
            className="text-sm font-medium text-fg/80 hover:text-fg transition-colors duration-200"
          >
            {t("nav.projects")}
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-fg/80 hover:text-fg transition-colors duration-200"
          >
            {t("nav.about")}
          </Link>
          <Link
            href="/certification"
            className="text-sm font-medium text-fg/80 hover:text-fg transition-colors duration-200"
          >
            {t("nav.preQualification")}
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-fg/80 hover:text-fg transition-colors duration-200"
          >
            {t("nav.contact")}
          </Link>
        </nav>

        <div className="ms-auto flex items-center gap-3 sm:gap-5">
          <div className="hidden sm:block">
            <LocaleToggle />
          </div>
          <Link
            href="/order"
            className="inline-flex h-11 items-center justify-center rounded-none bg-accent px-4 text-sm font-medium text-bg hover:bg-accent-hover transition-colors duration-200 sm:px-5"
          >
            {t("cta")}
          </Link>

          {/* Hamburger — visible only below md, where the nav links are
              hidden. Tap target is 44×44 (iOS minimum). */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label={t("mobileNav.open")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="flex h-11 w-11 items-center justify-center text-fg transition-colors duration-200 hover:text-accent md:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
              <path
                d="M2 6h18M2 11h18M2 16h18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="square"
              />
            </svg>
          </button>
        </div>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
