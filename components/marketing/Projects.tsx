import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { projects } from "@/lib/data/projects";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectTile } from "./ProjectTile";

// Home Projects grid — first six projects in this exact desktop layout:
//
//   Row 1: [feature 8 cols × 2 rows] [tile 4 cols] [tile 4 cols]
//   Row 2:                            [tile 6 cols] [tile 6 cols]
//   Row 3: [feature 12 cols × 1 row, full width]
//
// Tablet collapses to 2-col, mobile to single column. Order is preserved.
//
// Tile spans are mapped here (not in the tile component) so the same tile
// can be reused on /projects with a different repeating pattern.

// Aspect ratios on mobile/tablet collapse, explicit row heights on desktop
// so the 8x2 feature reads as deliberately tall against its 4-col neighbors.
const HOME_SPANS = [
  // 1: feature, 8 cols × 2 rows
  "sm:col-span-2 lg:col-span-8 lg:row-span-2 aspect-[4/5] sm:aspect-auto sm:min-h-[520px]",
  // 2 + 3: top-end stack, each 4 cols × 1 row
  "lg:col-span-4 aspect-[4/3] lg:aspect-auto",
  "lg:col-span-4 aspect-[4/3] lg:aspect-auto",
  // 4 + 5: middle row, 6 cols each
  "lg:col-span-6 aspect-[3/2] lg:aspect-auto",
  "lg:col-span-6 aspect-[3/2] lg:aspect-auto",
  // 6: full-width feature closer
  "sm:col-span-2 lg:col-span-12 aspect-[16/9] lg:aspect-auto",
];

export function Projects() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const homeProjects = projects.slice(0, 6);

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="bg-bg py-24 md:py-32"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        <Reveal>
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            {t("eyebrow")}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2
            id="projects-title"
            className="max-w-[20ch] text-fg font-extrabold leading-[1.05]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-display-lg)",
              letterSpacing: locale === "ar" ? "-0.01em" : "-0.02em",
            }}
          >
            {t("title")}
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-muted">
            {t("lede")}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-12 lg:grid-rows-[320px_320px_360px_420px]">
          {homeProjects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.1} className={HOME_SPANS[i]}>
              <ProjectTile project={project} span="h-full w-full" />
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/projects"
            className="inline-flex h-12 items-center border-b border-fg/30 pb-1 text-sm font-medium tracking-tight text-fg hover:border-accent hover:text-accent transition-colors duration-200"
          >
            {t("viewAll")}
            <span aria-hidden className="ms-2 rtl:rotate-180">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
