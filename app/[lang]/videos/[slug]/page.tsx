import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { preload } from "react-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { VideoCardGrid } from "@/components/phone/video-card-grid";
import { getRelease } from "@/lib/releases";
import { isReleased } from "@/lib/release-date";
import { translations, type Language } from "@/lib/translations";
import {
  VIDEO_KIND_LABEL,
  formatDuration,
  formatVideoDate,
  getVideo,
  isoDuration,
  videoDisplayTitle,
  videoExcerpt,
  videoMetaTitle,
  videoSlugs,
  videoThumb,
  videoThumbSize,
  videoThumbs,
  youtubeWatchUrl,
} from "@/lib/videos";

type VideoParams = { lang: string; slug: string };

const LANGS: Language[] = ["es", "en"];

const LINK_FOCUS =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

/** `sizes` de la facade grande (columna de 1104 px desde 1200 px); también lo usa el preload. */
const FACADE_SIZES = "(min-width: 1200px) 1104px, 100vw";

export function generateStaticParams() {
  return LANGS.flatMap((lang) => videoSlugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata(
  { params }: { params: Promise<VideoParams> }
): Promise<Metadata> {
  const { lang, slug } = await params;
  const v = getVideo(slug);
  const isEs = lang === "es";
  // Misma guarda que la página: un video con fecha futura responde 404 y su <head>
  // no debe adelantar título, description ni OG.
  if (!v || !isReleased(v.date)) return { title: isEs ? "Video no encontrado" : "Video not found" };
  const uiLang: Language = isEs ? "es" : "en";
  // <title> ≤ 60 con la plantilla: el oficial si cabe; si no, el visible (16a, videoMetaTitle).
  const { title, absolute } = videoMetaTitle(v, uiLang);
  const description = videoExcerpt(v, uiLang);
  const url = `https://phonerecords.cl/${lang}/videos/${slug}`;
  const thumb = videoThumb(v);
  const { width, height } = videoThumbSize(v);
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        es: `https://phonerecords.cl/es/videos/${slug}`,
        en: `https://phonerecords.cl/en/videos/${slug}`,
        "x-default": `https://phonerecords.cl/es/videos/${slug}`,
      },
    },
    openGraph: {
      type: "video.other",
      siteName: "PHŌNÉ Records",
      title,
      description,
      url,
      locale: isEs ? "es_CL" : "en_US",
      images: [{ url: thumb, width, height, alt: videoDisplayTitle(v, uiLang) }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [thumb],
    },
  };
}

export default async function VideoPage({
  params,
}: {
  params: Promise<VideoParams>;
}) {
  const { lang, slug } = await params;
  const v = getVideo(slug);
  // Fecha futura = 404 hasta las 00:00 America/Santiago (se evalúa por petición, sin redeploy).
  if (!v || !isReleased(v.date)) notFound();

  const isEs = lang === "es";
  const uiLang: Language = isEs ? "es" : "en";
  const t = translations[uiLang].videos;
  const kindLabel = VIDEO_KIND_LABEL[uiLang][v.kind];
  // Título visible (h1, facade, migas); el oficial queda en VideoObject.name.
  const displayTitle = videoDisplayTitle(v, uiLang);
  const paragraphs = v.description[uiLang]
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const release = v.releaseSlug ? getRelease(v.releaseSlug) : undefined;
  const url = `https://phonerecords.cl/${lang}/videos/${v.slug}`;
  const artistUrl = `https://phonerecords.cl/${lang}/artistas/${v.artistSlug}`;

  // LCP: la facade (YouTubeEmbed, carril ajeno) carga su miniatura lazy y no admite
  // `priority`. getImageProps genera el mismo src/srcSet/sizes que su <Image fill> interna
  // (misma quality por defecto) y preload() hoista un <link rel="preload" as="image"
  // fetchpriority="high"> al <head>, así los bytes del LCP llegan antes de la hidratación.
  // Es el único preload de la página (regla: un solo priority por página).
  const { props: thumbProps } = getImageProps({ src: videoThumb(v), alt: "", fill: true, sizes: FACADE_SIZES });
  preload(thumbProps.src, {
    as: "image",
    imageSrcSet: thumbProps.srcSet,
    imageSizes: thumbProps.sizes,
    fetchPriority: "high",
  });

  // JSON-LD: VideoObject (texto propio del idioma como description) + BreadcrumbList.
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoObject",
        "@id": `${url}#video`,
        name: v.title,
        description: paragraphs.join(" "),
        thumbnailUrl: videoThumbs(v),
        uploadDate: v.date,
        ...(v.durationSec ? { duration: isoDuration(v.durationSec) } : {}),
        embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtubeId}`,
        url,
        inLanguage: isEs ? "es-CL" : "en-US",
        publisher: {
          "@type": "Organization",
          "@id": "https://phonerecords.cl/#organization",
          name: "PHŌNÉ Records",
          logo: { "@type": "ImageObject", url: "https://phonerecords.cl/brand/phone-logotipo.png" },
        },
        creator: { "@type": "MusicGroup", name: v.artistName, url: artistUrl },
        ...(release
          ? {
              about: {
                "@type": "MusicAlbum",
                "@id": `https://phonerecords.cl/${lang}/releases/${release.slug}#album`,
                name: release.title,
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "PHŌNÉ Records", item: `https://phonerecords.cl/${lang}` },
          { "@type": "ListItem", position: 2, name: "Videos", item: `https://phonerecords.cl/${lang}/videos` },
          { "@type": "ListItem", position: 3, name: displayTitle, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <main className="relative min-h-screen overflow-x-hidden noise-overlay">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <Navigation />

        {/* Sin PageHero: la facade del video es el hero. pt-32 deja libre el menú fijo. */}
        <article className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-8 lg:pb-12">
          <Link
            href={`/${lang}/videos`}
            className="inline-flex min-h-6 items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t.back}
          </Link>

          {/* Facade grande: miniatura + botón; el iframe de youtube-nocookie solo se monta al clic. */}
          <div className="mb-8 lg:mb-12">
            <YouTubeEmbed
              youtubeId={v.youtubeId}
              title={displayTitle}
              lang={uiLang}
              sizes={FACADE_SIZES}
              priority
              initialThumb={v.thumb ?? "maxresdefault"}
            />
          </div>

          <header className="mb-12 lg:mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">{kindLabel}</p>
            <h1 className="text-4xl lg:text-6xl font-display tracking-tight leading-[0.95] text-balance mb-6">
              {displayTitle}
            </h1>
            <dl className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm uppercase tracking-widest text-muted-foreground">
              <div>
                <dt className="sr-only">{t.artist}</dt>
                <dd>
                  <Link
                    href={`/${lang}/artistas/${v.artistSlug}`}
                    className={`inline-flex min-h-6 items-center text-foreground underline-offset-4 hover:underline ${LINK_FOCUS}`}
                  >
                    {v.artistName}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="sr-only">{t.date}</dt>
                <dd>
                  <time dateTime={v.date}>{formatVideoDate(v.date, uiLang)}</time>
                </dd>
              </div>
              {v.durationSec ? (
                <div>
                  <dt className="sr-only">{t.duration}</dt>
                  <dd>{formatDuration(v.durationSec)}</dd>
                </div>
              ) : null}
            </dl>
          </header>

          <section className="grid lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
            {/* Texto propio (no la descripción de YouTube) */}
            <div className="lg:col-span-8 space-y-6">
              {paragraphs.map((text, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-lg lg:text-xl text-foreground/90 leading-relaxed"
                      : "text-base lg:text-lg text-foreground/80 leading-relaxed"
                  }
                >
                  {text}
                </p>
              ))}
            </div>

            <aside className="lg:col-span-4 space-y-10">
              {release && (
                <div>
                  <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                    {t.release}
                  </h2>
                  <Link
                    href={`/${lang}/releases/${release.slug}`}
                    className={`group flex items-center gap-4 ${LINK_FOCUS}`}
                  >
                    {release.cover && (
                      <span className="relative block h-16 w-16 shrink-0 overflow-hidden bg-foreground/5">
                        <Image
                          src={release.cover}
                          alt={`${release.title} — ${release.artistName}`}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block font-display text-lg tracking-tight group-hover:text-muted-foreground transition-colors">
                        {release.title}
                      </span>
                      <span className="block mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {release.artistName} · {release.year}
                      </span>
                    </span>
                  </Link>
                </div>
              )}

              {v.credits && v.credits.length > 0 && (
                <div>
                  <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                    {t.credits}
                  </h2>
                  <dl>
                    {v.credits.map((c, i) => (
                      <div key={i} className="grid grid-cols-12 gap-4 py-3 border-b border-foreground/10">
                        <dt className="col-span-12 sm:col-span-5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                          {c.role}
                        </dt>
                        <dd className="col-span-12 sm:col-span-7 text-sm">{c.name}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <div>
                <a
                  href={youtubeWatchUrl(v.youtubeId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex min-h-11 items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors ${LINK_FOCUS}`}
                >
                  {t.watchOnYouTube}
                  <ArrowUpRight className="w-4 h-4" aria-hidden />
                  <span className="sr-only"> {t.newTab}</span>
                </a>
              </div>
            </aside>
          </section>
        </article>

        {/* Grilla de cierre: mismo artista primero, luego los más recientes */}
        <VideoCardGrid lang={uiLang} currentSlug={v.slug} artistSlug={v.artistSlug} />
      </main>
      <FooterSection />
    </>
  );
}
