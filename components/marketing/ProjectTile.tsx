"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { Project } from "@/lib/data/projects";

type ProjectTileProps = {
  project: Project;
  // 12-col grid placement classes applied to the outer <article>. Caller
  // controls layout (desktop col/row span); the tile internals are
  // layout-agnostic.
  span: string;
};

// One reusable tile. Used by both the home Projects grid (asymmetric)
// and the /projects index (repeating asymmetric pattern).
export function ProjectTile({ project, span }: ProjectTileProps) {
  const locale = useLocale();
  const name = locale === "ar" ? project.name_ar : project.name;
  const category =
    locale === "ar" ? project.category_label_ar : project.category_label;

  return (
    <article className={["group relative overflow-hidden rounded-[4px]", span].join(" ")}>
      <Link
        href={`/projects/${project.slug}`}
        className="block h-full w-full"
        aria-label={`${name} — ${category}`}
      >
        {/* Image — desaturated by default, full saturation on hover.
            Subtle scale on hover; tile itself stays put, only image moves. */}
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={project.coverImage}
            alt={`${name} — ${category}`}
            fill
            sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-[transform,filter] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] [filter:saturate(0.85)] group-hover:[filter:saturate(1)] group-hover:scale-[1.04]"
          />
        </div>

        {/* Bottom band — token-driven gradient ensures legibility regardless
            of image content. Sits above the image, ~80px tall. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,24,31,0) 0%, var(--color-overlay-on-image) 100%)",
          }}
        />

        {/* Tile copy — sits inside the dark band */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <p
            className="text-xs font-medium uppercase tracking-[0.22em]"
            style={{ color: "var(--color-fg-on-steel-muted)" }}
          >
            {category}
          </p>
          <h3
            className="relative mt-2 inline-block font-extrabold leading-[1.1]"
            style={{
              color: "var(--color-fg-on-steel)",
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h2)",
              letterSpacing: "-0.02em",
            }}
          >
            {name}
            {/* Red underline — slides in from the start side on hover.
                LTR: from the left. RTL: from the right (logical `start`). */}
            <span
              aria-hidden
              className="absolute bottom-[-6px] start-0 h-[2px] w-full origin-[var(--start)] scale-x-0 bg-accent transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              style={{ ["--start" as string]: locale === "ar" ? "right" : "left" }}
            />
          </h3>
        </div>
      </Link>
    </article>
  );
}
