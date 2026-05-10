import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import {
  getNextProject,
  getProjectBySlug,
  projects,
  type Project,
} from "@/lib/data/projects";
import { services as allServices } from "@/lib/data/services";
import { routing } from "@/lib/i18n/routing";
import type { Metadata } from "next";

// TODO(post-launch): gallery click → lightbox. Out of scope for v1 — gallery
// images are displayed inline in the alternating-height grid only.

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const t = await getTranslations({ locale, namespace: "projectDetail" });
  const name = locale === "ar" ? project.name_ar : project.name;
  return {
    title: `${name} — ${t("metaSuffix")}`,
    description:
      locale === "ar" ? project.description_ar : project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  setRequestLocale(locale);

  return (
    <main id="main">
      <ProjectDetail project={project} />
    </main>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const t = useTranslations("projectDetail");
  const locale = useLocale();

  const name = locale === "ar" ? project.name_ar : project.name;
  const category =
    locale === "ar" ? project.category_label_ar : project.category_label;
  const description =
    locale === "ar" ? project.description_ar : project.description;

  const next = getNextProject(project.slug);
  const nextName = locale === "ar" ? next.name_ar : next.name;

  return (
    <article>
      {/* 1. Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-[var(--container-max)] px-6 pt-8 md:px-10"
      >
        <ol className="flex items-center gap-2 text-sm text-fg-muted">
          <li>
            <Link href="/projects" className="hover:text-fg transition-colors">
              {t("breadcrumbProjects")}
            </Link>
          </li>
          <li aria-hidden className="text-fg-subtle">
            /
          </li>
          <li className="text-fg-subtle">{category}</li>
          <li aria-hidden className="text-fg-subtle">
            /
          </li>
          <li className="text-fg" aria-current="page">
            {name}
          </li>
        </ol>
      </nav>

      {/* 2. Project hero — full-bleed, 65vh, with name overlay */}
      <header className="relative mt-6 h-[65vh] w-full overflow-hidden">
        <Image
          src={project.heroImage}
          alt={name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark gradient bottom-up so text reads */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,24,31,0) 40%, var(--color-overlay-on-image) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[var(--container-max)] px-6 pb-10 md:px-10 md:pb-14">
          <p
            className="text-xs font-medium uppercase tracking-[0.22em] text-accent"
            style={{ color: "var(--color-accent)" }}
          >
            {category}
          </p>
          <h1
            className="mt-3 max-w-[20ch] font-extrabold leading-[1.02]"
            style={{
              color: "var(--color-fg-on-steel)",
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-display-lg)",
              letterSpacing: locale === "ar" ? "-0.01em" : "-0.02em",
            }}
          >
            {name}
          </h1>
        </div>
      </header>

      {/* 3. Metadata strip — each cell centred so the four values sit as
          equal-weight stat blocks rather than start-aligned columns. */}
      <section className="border-y border-border bg-bg">
        <dl className="mx-auto grid max-w-[var(--container-max)] grid-cols-1 px-6 md:grid-cols-4 md:px-10">
          {[
            { label: t("meta.client"), value: project.client },
            { label: t("meta.location"), value: project.location },
            {
              label: t("meta.year"),
              value: <span dir="ltr">{project.year}</span>,
            },
            {
              label: t("meta.volume"),
              value: <span dir="ltr">{project.volume}</span>,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 border-b border-border px-6 py-8 text-center last:border-b-0 md:border-b-0 md:py-10 md:[&:not(:last-child)]:border-e"
            >
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-fg-subtle">
                {item.label}
              </dt>
              <dd
                className="text-fg font-extrabold leading-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-h2)",
                  letterSpacing: "-0.02em",
                }}
              >
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 4. Description + scope sidebar */}
      <section className="bg-bg py-20 md:py-28">
        <div className="mx-auto grid max-w-[var(--container-max)] grid-cols-1 gap-12 px-6 md:grid-cols-[3fr_2fr] md:gap-16 md:px-10">
          <Reveal>
            <div>
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-accent">
                {t("descriptionEyebrow")}
              </p>
              <p className="max-w-[60ch] text-lg leading-relaxed text-fg">
                {description}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <aside className="md:border-s md:border-border md:ps-12">
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-fg-subtle">
                {t("scopeLabel")}
              </p>
              <ul className="space-y-3">
                {project.scope.map((slug) => {
                  const service = allServices.find((s) => s.slug === slug);
                  if (!service) return null;
                  const serviceName =
                    locale === "ar" ? service.name_ar : service.name;
                  return (
                    <li
                      key={slug}
                      className="flex items-start gap-3 border-b border-border pb-3 text-base text-fg"
                    >
                      <span
                        aria-hidden
                        className="mt-2 inline-block h-px w-4 bg-accent"
                      />
                      {serviceName}
                    </li>
                  );
                })}
              </ul>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* 5. Gallery — alternating-height 2-col grid for visual rhythm */}
      {project.gallery.length > 0 && (
        <section className="bg-bg pb-24 md:pb-32">
          <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
            <p className="mb-8 text-sm font-medium uppercase tracking-[0.18em] text-accent">
              {t("galleryEyebrow")}
            </p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {project.gallery.map((src, i) => (
                <Reveal key={`${src}-${i}`} delay={i * 0.08}>
                  <div
                    className={`relative w-full overflow-hidden rounded-[4px] ${
                      i % 2 === 0 ? "aspect-[4/3]" : "aspect-[3/4]"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${name} — ${i + 1}`}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Next project navigation — full-width band on steel */}
      <section
        aria-label={t("nextProjectAria")}
        className="bg-[var(--color-steel)]"
      >
        <Link
          href={`/projects/${next.slug}`}
          className="group block"
        >
          <div className="mx-auto flex max-w-[var(--container-max)] flex-col gap-4 px-6 py-16 md:flex-row md:items-end md:justify-between md:px-10 md:py-24">
            <div>
              <p
                className="text-xs font-medium uppercase tracking-[0.22em]"
                style={{ color: "var(--color-fg-on-steel-muted)" }}
              >
                {t("nextProjectLabel")}
              </p>
              <h2
                className="mt-3 font-extrabold leading-[1.05]"
                style={{
                  color: "var(--color-fg-on-steel)",
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-display-md)",
                  letterSpacing: locale === "ar" ? "-0.01em" : "-0.02em",
                }}
              >
                {nextName}
              </h2>
            </div>
            <span
              aria-hidden
              className="inline-flex items-center text-sm font-medium uppercase tracking-[0.22em] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              style={{ color: "var(--color-fg-on-steel)" }}
            >
              {t("nextProjectCta")}
              <span aria-hidden className="ms-3 rtl:rotate-180">
                →
              </span>
            </span>
          </div>
        </Link>
      </section>
    </article>
  );
}
