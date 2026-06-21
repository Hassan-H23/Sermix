import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/marketing/PageHero";
import { routing } from "@/lib/i18n/routing";

// The certificate is shown as rasterised images of each page so it previews
// inline on every browser and device. Native PDF viewers are inconsistent —
// many (especially on mobile, or with "download PDFs" enabled) force a download
// instead of rendering. The full PDF stays one click away via the download /
// open-in-new-tab buttons.
const PDF_PATH = "/sermix-certificates-2026.pdf";
const PDF_DOWNLOAD_NAME = "Sermix Certificates 2026.pdf";
// One rasterised A4 page per certificate, in order. All pages share dimensions.
const CERT_PAGES = [
  "/images/certificates-2026/page-1.jpg",
  "/images/certificates-2026/page-2.jpg",
  "/images/certificates-2026/page-3.jpg",
  "/images/certificates-2026/page-4.jpg",
  "/images/certificates-2026/page-5.jpg",
];
const CERT_IMAGE_W = 1241;
const CERT_IMAGE_H = 1754;

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
            download={PDF_DOWNLOAD_NAME}
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

        {/* Inline preview — one rasterised page per certificate. Renders on
            every browser and device (no native PDF viewer required), so
            visitors are never forced to download just to see them. */}
        <div className="flex flex-col gap-4 overflow-hidden rounded-[4px] border border-border bg-surface-2 p-3 md:gap-6 md:p-6">
          {CERT_PAGES.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`${t("iframeLabel")} — ${i + 1}`}
              width={CERT_IMAGE_W}
              height={CERT_IMAGE_H}
              sizes="(min-width: 1024px) 800px, 92vw"
              className="mx-auto h-auto w-full max-w-[800px]"
              priority={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
