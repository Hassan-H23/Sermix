"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { services } from "@/lib/data/services";
import { Reveal } from "@/components/motion/Reveal";

// Bento grid per CLAUDE.md: differentiators (Truck Scale, Cube Crushing Lab,
// Ready-Mix Concrete) get larger tiles. Each tile carries a blurred photo
// background tied to the service, sitting beneath a dark token-driven
// overlay so the cream-on-steel text holds legibility.
//
// Layout (12-col):
//   Row 1: feature 1 (8 cols × 2 rows)  | feature 2 (4 cols)
//                                        | feature 3 (4 cols)
//   Row 2: regular 1 (6 cols)            | regular 2 (6 cols)
//
// Tablet collapses to 2-col, mobile to 1-col.

export function Services() {
  const t = useTranslations("services");
  const locale = useLocale();

  const featureTiles = services.filter((s) => s.feature);
  const regularTiles = services.filter((s) => !s.feature);

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="bg-bg pt-24 pb-32 md:pt-28 md:pb-40"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        <Reveal>
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            {t("eyebrow")}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2
            id="services-title"
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

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-12 lg:grid-rows-[230px_230px_260px]">
          {featureTiles[0] && (
            <ServiceTile service={featureTiles[0]} index={1} variant="hero" />
          )}
          {featureTiles[1] && (
            <ServiceTile service={featureTiles[1]} index={2} variant="standard" />
          )}
          {featureTiles[2] && (
            <ServiceTile service={featureTiles[2]} index={3} variant="standard" />
          )}
          {regularTiles[0] && (
            <ServiceTile service={regularTiles[0]} index={4} variant="wide" />
          )}
          {regularTiles[1] && (
            <ServiceTile service={regularTiles[1]} index={5} variant="wide" />
          )}
        </div>
      </div>
    </section>
  );
}

type ServiceTileProps = {
  service: (typeof services)[number];
  index: number;
  variant: "hero" | "standard" | "wide";
};

function ServiceTile({ service, index, variant }: ServiceTileProps) {
  const locale = useLocale();
  const name = locale === "ar" ? service.name_ar : service.name;
  const description =
    locale === "ar" ? service.shortDescription_ar : service.shortDescription;

  // Visual weight per variant. Hero tile spans 8 cols × 2 rows; others fit
  // into the 12-col rhythm so the bento reads as deliberately uneven.
  // NOTE: span classes go on the Reveal wrapper (the actual grid item),
  // not on the inner <article> — otherwise the grid placement is ignored.
  const spanClass = {
    hero: "sm:col-span-2 lg:col-span-8 lg:row-span-2 min-h-[300px] sm:min-h-[400px] lg:min-h-0",
    standard: "lg:col-span-4 min-h-[200px] lg:min-h-0",
    wide: "lg:col-span-6 min-h-[220px] lg:min-h-0",
  }[variant];

  const indexLabel = String(index).padStart(2, "0");

  // Sizing hint for the bg image: feature tile is wide (8 of 12 cols), the
  // standards take ~33% of container, wides ~50%. Imprecise but good enough
  // to keep next/image from over-fetching for small tiles.
  const sizes =
    variant === "hero"
      ? "(min-width: 1024px) 66vw, (min-width: 640px) 100vw, 100vw"
      : variant === "wide"
        ? "(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
        : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

  return (
    <Reveal delay={index * 0.06} className={spanClass}>
      <article className="group relative h-full w-full overflow-hidden rounded-[4px]">
        {/* Blurred photographic background. scale-110 baseline so blur edges
            never expose the tile boundary. Slight zoom + de-blur on hover
            for interactivity. */}
        <Image
          src={service.image}
          alt=""
          aria-hidden
          fill
          sizes={sizes}
          className="object-cover scale-110 [filter:blur(8px)_saturate(0.92)] transition-[transform,filter] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.16] group-hover:[filter:blur(5px)_saturate(1.05)]"
        />
        {/* Dark overlay for legibility. Uses --color-overlay-on-image at full
            strength; a gradient subtly darkens the bottom where the title
            sits, giving the text extra contrast without flattening the photo. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(20,24,31,0.74) 0%, rgba(20,24,31,0.86) 100%)",
          }}
        />

        {/* Tile content */}
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-7 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <span
              dir="ltr"
              className="text-xs font-medium tracking-[0.22em]"
              style={{ color: "var(--color-fg-on-steel-muted)" }}
            >
              {indexLabel}
            </span>
            <span
              aria-hidden
              className="block h-px w-12 self-center bg-white/25 transition-[width,background-color] duration-300 group-hover:w-20 group-hover:bg-accent"
            />
          </div>

          <div>
            <h3
              className="font-extrabold leading-[1.05]"
              style={{
                color: "var(--color-fg-on-steel)",
                fontFamily: "var(--font-display)",
                fontSize:
                  variant === "hero"
                    ? "var(--text-display-md)"
                    : "var(--text-h2)",
                letterSpacing: "-0.02em",
              }}
            >
              {name}
            </h3>
            <p
              className={[
                "mt-3 leading-relaxed",
                variant === "hero" ? "max-w-[44ch] text-base" : "text-[0.95rem]",
              ].join(" ")}
              style={{ color: "var(--color-fg-on-steel-muted)" }}
            >
              {description}
            </p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
