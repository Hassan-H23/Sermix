import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

// Numbered pillars per CLAUDE.md section intent — 01/02/03/04 as oversized
// typography, no icons. Type IS the design.

const PILLARS = ["01", "02", "03", "04"] as const;

export function WhyChooseUs() {
  const t = useTranslations("whyChooseUs");
  const locale = useLocale();

  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-choose-us-title"
      className="bg-surface py-24 md:py-32"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        <Reveal>
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            {t("eyebrow")}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2
            id="why-choose-us-title"
            className="max-w-[22ch] text-fg font-extrabold leading-[1.05]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-display-lg)",
              letterSpacing: locale === "ar" ? "-0.01em" : "-0.02em",
            }}
          >
            {t("title")}
          </h2>
        </Reveal>

        <ul className="mt-16 grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-2">
          {PILLARS.map((num, i) => (
            <Reveal key={num} delay={0.08 + i * 0.08}>
              <li className="border-t border-border pt-6">
                <div className="flex items-baseline gap-6">
                  <span
                    dir="ltr"
                    className="text-fg/30 font-extrabold leading-none"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-display-md)",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {num}
                  </span>
                  <h3
                    className="text-fg font-extrabold leading-[1.1]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-h2)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {t(`pillars.${num}.title`)}
                  </h3>
                </div>
                <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-fg-muted">
                  {t(`pillars.${num}.body`)}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
