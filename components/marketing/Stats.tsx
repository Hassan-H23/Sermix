import { useTranslations } from "next-intl";
import { CountUp } from "@/components/motion/CountUp";

// Stats band — full-width strip on cream surface, four numbers.
// Numbers count up on scroll-in (CountUp respects reduced motion).
//
// TODO: figures (volume poured, project count) are placeholders agreed with
// the brief. Validate against client records before launch.

type Stat = {
  value: number;
  suffix: string;
  labelKey: string;
};

const STATS: ReadonlyArray<Stat> = [
  { value: 16, suffix: "", labelKey: "stats.years" },
  { value: 1500, suffix: "+", labelKey: "stats.projects" },
  { value: 350, suffix: "K m³", labelKey: "stats.volume" },
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
      <div className="mx-auto grid max-w-[var(--container-max)] grid-cols-2 gap-y-10 px-6 py-16 md:grid-cols-4 md:gap-y-0 md:px-10 md:py-20">
        {STATS.map((stat) => (
          <div key={stat.labelKey} className="flex flex-col gap-3">
            <div
              className="text-fg font-extrabold leading-[0.95]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-display-md)",
                letterSpacing: "-0.03em",
              }}
            >
              <CountUp to={stat.value} />
              <span dir="ltr" className="text-accent">
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
