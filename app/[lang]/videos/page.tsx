import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { PageHero } from "@/components/phone/page-hero";
import { FooterSection } from "@/components/landing/footer-section";
import { artists } from "@/lib/artists";
import { translations, type Language } from "@/lib/translations";
import { VIDEO_KINDS, VIDEO_KIND_LABEL, getPublishedVideos, toVideoCardData, youtubeThumb } from "@/lib/videos";
import { pageMetadata } from "@/lib/seo";
import { VideosGrid } from "./videos-grid";

type LangParams = { lang: string };

export async function generateMetadata(
  { params }: { params: Promise<LangParams> },
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  return pageMetadata({
    lang,
    path: "/videos",
    title: "Videos",
    description: isEs
      ? "Videoclips, sesiones y registros en vivo de los artistas de PHŌNÉ Records, con un texto propio por pieza."
      : "Music videos, sessions and live footage from PHŌNÉ Records artists, with an original text for each piece.",
  });
}

export default async function VideosPage({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang } = await params;
  const isEs = lang === "es";
  const uiLang: Language = isEs ? "es" : "en";
  const t = translations[uiLang].videos;

  // Solo videos ya publicados (00:00 America/Santiago), evaluado por petición.
  const published = getPublishedVideos();
  // Tarjetas con el título visible del idioma (displayTitle); el ItemList de abajo lleva el oficial.
  const entries = published.map((v) => toVideoCardData(v, uiLang));

  // Chips de artista en el orden del roster (no por conteo), solo con videos.
  const counts = new Map<string, number>();
  for (const v of published) counts.set(v.artistSlug, (counts.get(v.artistSlug) ?? 0) + 1);
  const artistsList = artists
    .filter((a) => (counts.get(a.slug) ?? 0) > 0)
    .map((a) => ({ slug: a.slug, name: a.name, count: counts.get(a.slug) ?? 0 }));
  const kinds = VIDEO_KINDS.filter((k) => published.some((v) => v.kind === k));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `https://phonerecords.cl/${lang}/videos`,
        name: isEs ? "Videos PHŌNÉ Records" : "PHŌNÉ Records Videos",
        inLanguage: isEs ? "es-CL" : "en-US",
        isPartOf: { "@id": "https://phonerecords.cl/#organization" },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: published.length,
          itemListElement: published.slice(0, 30).map((v, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "VideoObject",
              name: v.title,
              url: `https://phonerecords.cl/${lang}/videos/${v.slug}`,
              thumbnailUrl: youtubeThumb(v.youtubeId),
              uploadDate: v.date,
            },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "PHŌNÉ Records", item: `https://phonerecords.cl/${lang}` },
          { "@type": "ListItem", position: 2, name: "Videos", item: `https://phonerecords.cl/${lang}/videos` },
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
        {/* Foto B/N del archivo (saturación 0): la misma del carrusel y del hero de la ficha de
            Rosario Lircay (lib/artist-media.ts); /sello y /eventos usan otras fotos. */}
        <PageHero
          image={{
            desktop: "/media/rosario-lircay/en-vela-hero.jpg",
            mobile: "/media/rosario-lircay/en-vela-hero-mobile.jpg",
            alt: { es: "Rosario Lircay, retrato nocturno en la calle", en: "Rosario Lircay, night portrait on the street" },
          }}
          title={t.headline}
          eyebrow="Videos"
          lang={uiLang}
          size="short"
        />

        <article className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-24">
          <Link
            href={`/${lang}`}
            className="inline-flex min-h-6 items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t.backHome}
          </Link>

          <div className="mb-12 lg:mb-16 max-w-3xl">
            <p className="text-xl text-foreground/85 leading-relaxed">{t.intro}</p>
          </div>

          {/* useSearchParams exige un límite de Suspense; el render es por petición, así que no hay fallback visible. */}
          <Suspense fallback={null}>
            <VideosGrid
              lang={uiLang}
              entries={entries}
              artistsList={artistsList}
              kinds={kinds}
              labels={{
                filterArtist: t.filterArtist,
                filterKind: t.filterKind,
                all: t.all,
                count: t.count,
                countOne: t.countOne,
                empty: t.empty,
                clear: t.clear,
                kindLabels: VIDEO_KIND_LABEL[uiLang],
              }}
            />
          </Suspense>
        </article>
      </main>
      <FooterSection />
    </>
  );
}
