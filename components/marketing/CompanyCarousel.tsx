import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

// Auto-scrolling client logo marquee. The track holds the list twice so the
// CSS animation can translate by -50% for a seamless loop. Hovering anywhere
// in the strip pauses the scroll so a visitor can read a specific mark; in
// RTL the direction reverses so motion still reads "forward" to the eye.
// Reduced motion is handled globally via the prefers-reduced-motion rule in
// app/styles/globals.css.

const LOGO_DIR = "/images/company%20coursel";

const LOGOS = [
  { file: "ASGC.png", alt: "ASGC" },
  { file: "emmar.png", alt: "Emaar" },
  { file: "sodic.png", alt: "SODIC" },
  { file: "talaat_mostafa.png", alt: "Talaat Moustafa Group" },
  { file: "orsascom.png", alt: "Orascom" },
  { file: "kharafi_national.png", alt: "Kharafi National" },
  { file: "memaar_al_morshedy.png", alt: "Memaar Al Morshedy" },
  { file: "tabarak.png", alt: "Tabarak" },
  { file: "al_jazi.png", alt: "Al Jazi" },
  { file: "el_hazzek.png", alt: "El Hazzek" },
  { file: "LSM_construction.png", alt: "LSM Construction" },
  { file: "talenco.png", alt: "Talenco" },
];

export function CompanyCarousel() {
  const t = useTranslations("companies");
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Duplicate the reel so the keyframe can translate by -50% and the second
  // half slides into the position the first half just vacated. Any joiner
  // suffix on the key keeps React happy about duplicate srcs.
  //
  // The marquee internals are forced to dir="ltr" below — the track is
  // `w-max` inside `overflow-hidden`, and in RTL the flex row reverses its
  // start edge so `translateX(-50%)` would launch the track entirely off
  // the left of the viewport, hiding every logo. Logos carry no reading
  // direction, so locking the marquee to LTR keeps the geometry identical
  // in both locales. The header text above still reads correctly because
  // it inherits dir from <html>.
  const reel = [...LOGOS, ...LOGOS];

  return (
    <section
      aria-labelledby="companies-title"
      className="border-y border-border bg-surface py-20 md:py-24"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        <div className="text-center">
          <Reveal delay={0.06}>
            <h2
              id="companies-title"
              className="mx-auto max-w-[24ch] text-fg font-extrabold leading-[1.05]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-display-md)",
                letterSpacing: isRtl ? "-0.01em" : "-0.02em",
              }}
            >
              {t("title")}
            </h2>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.12} className="mt-14 md:mt-16">
        <div
          dir="ltr"
          className="company-marquee relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <ul
            className="company-marquee-track flex w-max items-center"
            aria-label={t("ariaLabel")}
          >
            {reel.map((logo, i) => (
              <li
                key={`${logo.file}-${i}`}
                className="mx-5 flex-none md:mx-7"
              >
                <Image
                  src={`${LOGO_DIR}/${logo.file}`}
                  alt={logo.alt}
                  width={400}
                  height={120}
                  sizes="(min-width: 768px) 112px, 80px"
                  className="h-20 w-auto object-contain opacity-100 transition duration-300 ease-[var(--ease-out-quint)] hover:scale-105 md:h-28"
                />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
