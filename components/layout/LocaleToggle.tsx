"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { useTransition } from "react";
import type { Locale } from "@/lib/i18n/routing";

export function LocaleToggle() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("header.localeToggle");
  const [isPending, startTransition] = useTransition();

  const otherLocale: Locale = locale === "en" ? "ar" : "en";
  const label =
    otherLocale === "ar" ? t("switchToArabic") : t("switchToEnglish");

  return (
    <button
      type="button"
      aria-label={`${t("label")}: ${label}`}
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          router.replace(pathname, { locale: otherLocale });
        });
      }}
      className="text-sm font-medium tracking-tight text-fg/80 hover:text-fg transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-50"
    >
      {label}
    </button>
  );
}
