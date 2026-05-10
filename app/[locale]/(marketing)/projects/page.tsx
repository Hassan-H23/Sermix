import { setRequestLocale, getTranslations } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import { ProjectTile } from "@/components/marketing/ProjectTile";
import { Reveal } from "@/components/motion/Reveal";
import { projects } from "@/lib/data/projects";
import { routing } from "@/lib/i18n/routing";
import type { Metadata } from "next";

// TODO(v2): category filter chips on this page (Residential, Commercial,
// Infrastructure, Institutional, Industrial). Out of scope for v1 — the list
// is short enough that filtering would feel like over-engineering.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return { title: t("indexTitle") };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// The same asymmetric pattern as the home grid, repeated for each block of
// six. Trailing items (when total isn't a multiple of 6) fall through to a
// 2-up row so they don't look orphaned.
const PATTERN_SPANS = [
  "sm:col-span-2 lg:col-span-8 lg:row-span-2 aspect-[4/5] sm:aspect-auto sm:min-h-[520px]",
  "lg:col-span-4 aspect-[4/3] lg:aspect-auto",
  "lg:col-span-4 aspect-[4/3] lg:aspect-auto",
  "lg:col-span-6 aspect-[3/2] lg:aspect-auto",
  "lg:col-span-6 aspect-[3/2] lg:aspect-auto",
  "sm:col-span-2 lg:col-span-12 aspect-[16/9] lg:aspect-auto",
];

const TRAILING_SPAN = "lg:col-span-6 aspect-[3/2] lg:aspect-auto";

export default async function ProjectsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main">
      <ProjectsIndex />
    </main>
  );
}

function ProjectsIndex() {
  const t = useTranslations("projects");
  const locale = useLocale();

  // Chunk projects into blocks of 6 so each block uses the asymmetric pattern.
  const blocks: (typeof projects)[number][][] = [];
  for (let i = 0; i < projects.length; i += 6) {
    blocks.push(projects.slice(i, i + 6) as (typeof projects)[number][]);
  }

  return (
    <section className="bg-bg pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        <Reveal>
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            {t("eyebrow")}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h1
            className="max-w-[20ch] text-fg font-extrabold leading-[1.05]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-display-lg)",
              letterSpacing: locale === "ar" ? "-0.01em" : "-0.02em",
            }}
          >
            {t("indexTitle")}
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-muted">
            {t("indexLede")}
          </p>
        </Reveal>

        <div className="mt-14 space-y-5">
          {blocks.map((block, blockIndex) => {
            const isFullBlock = block.length === 6;
            const rows = isFullBlock
              ? "lg:grid-rows-[320px_320px_360px_420px]"
              : "lg:auto-rows-[280px]";

            return (
              <div
                key={blockIndex}
                className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-12 ${rows}`}
              >
                {block.map((project, i) => (
                  <Reveal
                    key={project.slug}
                    delay={i * 0.08}
                    className={
                      isFullBlock ? PATTERN_SPANS[i] : TRAILING_SPAN
                    }
                  >
                    <ProjectTile project={project} span="h-full w-full" />
                  </Reveal>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
