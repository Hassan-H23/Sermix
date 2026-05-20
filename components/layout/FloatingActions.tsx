"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { company } from "@/lib/data/company";

// Two channel-branded FABs anchored to the trailing bottom corner (flips to
// the leading corner under RTL via the logical `end-` utility). WhatsApp sits
// closest to the thumb on mobile because it's Sermix's primary contact channel
// (CLAUDE.md gotchas). Messenger stacks above as the secondary option.
//
// Brand colors are hardcoded rather than tokenised: they belong to WhatsApp
// and Meta, not the Sermix design system, and recognisability is the whole
// point of using them here. The FABs sit at z-40, below the header (z-50)
// and the mobile nav drawer (z-60+) so neither is overlapped.

const MESSENGER_GRADIENT =
  "linear-gradient(135deg, #00B2FF 0%, #006AFF 35%, #9326FF 70%, #FF0080 100%)";

const WHATSAPP_GREEN = "#25D366";

export function FloatingActions() {
  const t = useTranslations("floatingActions");
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  const baseClasses =
    "flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg shadow-fg/30 transition-[box-shadow,filter] duration-200 hover:shadow-xl hover:shadow-fg/40 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

  return (
    <div
      role="group"
      aria-label={t("label")}
      // iOS home-indicator safe area: max() with a 20px floor keeps the FABs
      // off the bottom gesture bar on iPhones without pushing them too high on
      // browsers that report a zero inset.
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
      }}
      className="fixed end-5 z-40 flex flex-col items-end gap-3 md:end-6"
    >
      <motion.a
        href={company.messenger.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("messenger")}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: reduce ? 0.2 : 0.5,
          delay: reduce ? 0 : 0.6,
          ease,
        }}
        whileHover={reduce ? undefined : { scale: 1.06 }}
        whileTap={reduce ? undefined : { scale: 0.94 }}
        className={baseClasses}
        style={{ background: MESSENGER_GRADIENT }}
      >
        <MessengerIcon />
      </motion.a>

      <motion.a
        href={company.whatsapp.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("whatsapp")}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: reduce ? 0.2 : 0.5,
          delay: reduce ? 0 : 0.4,
          ease,
        }}
        whileHover={reduce ? undefined : { scale: 1.06 }}
        whileTap={reduce ? undefined : { scale: 0.94 }}
        className={baseClasses}
        style={{ background: WHATSAPP_GREEN }}
      >
        <WhatsAppIcon />
      </motion.a>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  );
}

function MessengerIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M.001 11.639C.001 4.95 5.24 0 12 0s11.999 4.95 11.999 11.639c0 6.689-5.24 11.638-11.999 11.638a13.21 13.21 0 0 1-3.46-.46.96.96 0 0 0-.64.05l-2.38 1.05a.96.96 0 0 1-1.35-.85l-.07-2.13a.97.97 0 0 0-.32-.68A11.39 11.39 0 0 1 .001 11.639zm8.32-2.13l-3.52 5.59c-.34.54.32 1.14.83.77l3.79-2.88a.71.71 0 0 1 .86.01l2.8 2.09c.84.63 2.04.41 2.6-.48l3.52-5.58c.34-.54-.32-1.15-.83-.77l-3.79 2.88a.71.71 0 0 1-.86 0L10.921 9c-.84-.63-2.04-.41-2.6.48z" />
    </svg>
  );
}
