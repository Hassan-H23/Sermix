import { useTranslations } from "next-intl";
import { CountUp } from "@/components/motion/CountUp";

// Stats band — two stat cards on the cream surface.
// Numbers count up on scroll-in (CountUp respects reduced motion).

type Stat = {
  value: number;
  suffix: string;
  labelKey: string;
};

const STATS: ReadonlyArray<Stat> = [
  { value: 16, suffix: "", labelKey: "stats.years" },
  { value: 24, suffix: "/7", labelKey: "stats.ops" },
];

export function Stats() {
  const t = useTranslations();

  return (
    <section
      aria-labelledby="stats-title"
      className="border-y border-border bg-bg"
    >
      <h2 id="stats-title" className="sr-only">
        {t("stats.title")}
      </h2>
      <div className="mx-auto grid max-w-[var(--container-max)] grid-cols-2 gap-4 px-6 py-16 sm:gap-6 md:px-10 md:py-20">
        {STATS.map((stat) => (
          <div
            key={stat.labelKey}
            className="flex flex-col items-center gap-3 rounded-[4px] border border-border bg-surface p-8 text-center md:p-10"
          >
            <div
              dir="ltr"
              className="text-fg font-extrabold leading-[0.95]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-display-md)",
                letterSpacing: "-0.03em",
              }}
            >
              <CountUp to={stat.value} />
              <span className="text-accent">
                {stat.suffix}
              </span>
            </div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-fg-muted">
              {t(stat.labelKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
