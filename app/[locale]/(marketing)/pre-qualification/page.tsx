import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/marketing/PageHero";
import { routing } from "@/lib/i18n/routing";

// Static PDF reference. The file is ~56MB so the iframe uses loading="lazy"
// to defer the fetch until the viewer scrolls into view — page hero stays
// snappy and visitors who only land on the page don't pay the cost.
//
// `#view=FitH` is an Adobe PDF open parameter: fit to width on initial load.
// Respected by Chrome's built-in viewer and most Chromium derivatives, ignored
// by Safari (which falls back to its default zoom). Either way the PDF renders.
const PDF_PATH = "/pre-qualification.pdf";
const PDF_VIEW_PARAMS = "#view=FitH&toolbar=1&navpanes=0";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "preQualificationPage" });
  return { title: t("metaTitle") };
}

export default async function PreQualificationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <PageHeroSlot />
      <ViewerSection />
    </main>
  );
}

function PageHeroSlot() {
  const t = useTranslations("preQualificationPage");
  return (
    <PageHero
      eyebrow={t("hero.eyebrow")}
      title={t("hero.title")}
      lede={t("hero.lede")}
    />
  );
}

function ViewerSection() {
  const t = useTranslations("preQualificationPage.viewer");

  return (
    <section className="bg-bg pb-24 md:pb-32">
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-10">
        {/* Toolbar — download + open-in-new-tab. Use logical start/end so the
            buttons hug the start edge in both LTR and AR. */}
        <div className="mb-6 flex flex-wrap items-center gap-3 md:mb-8">
          <a
            href={PDF_PATH}
            download={t("fileName")}
            className="inline-flex h-12 items-center justify-center bg-accent px-6 text-sm font-medium text-bg hover:bg-accent-hover transition-colors duration-200"
          >
            {t("downloadCta")}
          </a>
          <a
            href={PDF_PATH}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center border border-border bg-bg px-6 text-sm font-medium text-fg hover:bg-surface transition-colors duration-200"
          >
            {t("openCta")}
          </a>
          <p className="ms-auto text-xs text-fg-subtle">{t("sizeNote")}</p>
        </div>

        {/* Viewer frame. `loading="lazy"` defers the 56MB fetch until the
            iframe enters the viewport. min-height keeps the frame useful even
            when the viewport is short; 80vh keeps it generous on desktop. */}
        <div className="overflow-hidden rounded-[4px] border border-border bg-surface-2">
          <iframe
            src={`${PDF_PATH}${PDF_VIEW_PARAMS}`}
            title={t("iframeLabel")}
            loading="lazy"
            className="block h-[80vh] min-h-[560px] w-full"
          />
        </div>

        <p className="mt-4 text-sm text-fg-muted">{t("fallback")}</p>
      </div>
    </section>
  );
}
