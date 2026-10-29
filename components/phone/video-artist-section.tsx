import Link from "next/link";
import { YouTubeEmbed, YouTubeSectionNotice } from "@/components/youtube-embed";
import { pickArtistVideos, videoDisplayTitle, VIDEO_KIND_LABEL } from "@/lib/videos";
import { translations, type Language } from "@/lib/translations";

type Props = {
  artistSlug: string;
  lang: Language;
};

const LINK_FOCUS =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

/** Aviso de YouTube común a todas las facades de la sección (16d): uno solo, no uno por video. */
const NOTICE_ID = "artist-videos-notice";

/**
 * Sección "Videos" de la ficha de artista, justo después de la discografía:
 * hasta 6 videos ya publicados (destacados primero), cada uno como facade de
 * YouTube (sin iframe hasta el clic) con título enlazado a su ficha y un pie
 * "tipo · año", más el enlace "Ver más videos" al catálogo filtrado por artista.
 * Un solo aviso de YouTube bajo el encabezado; cada facade lo referencia con
 * `sharedNoticeId` en vez de repetirlo bajo su miniatura (16d).
 * Server component. No se renderiza si el artista no tiene videos. Sin `priority`:
 * el LCP de la ficha es el hero o el retrato.
 */
export function ArtistVideosSection({ artistSlug, lang }: Props) {
  const picks = pickArtistVideos(artistSlug);
  if (picks.length === 0) return null;
  const t = translations[lang].videos;
  const kindLabel = VIDEO_KIND_LABEL[lang];

  return (
    <section aria-labelledby="videos-heading" className="mb-20">
      <div className="flex items-baseline justify-between">
        <h2 id="videos-heading" className="text-3xl lg:text-5xl font-display tracking-tight">
          Videos
        </h2>
        <Link
          href={`/${lang}/videos?artist=${artistSlug}`}
          className={`inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors ${LINK_FOCUS}`}
        >
          {t.more} →
        </Link>
      </div>
      {/* Aviso compacto: con su mt-2 y este mb-8, encabezado y grilla quedan a ~50 px, como antes. */}
      <div className="mb-8">
        <YouTubeSectionNotice id={NOTICE_ID} lang={lang} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {picks.map((v) => (
          <div key={v.slug}>
            <YouTubeEmbed
              youtubeId={v.youtubeId}
              title={videoDisplayTitle(v, lang)}
              lang={lang}
              sizes="(min-width: 1200px) 370px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              initialThumb={v.thumb ?? "maxresdefault"}
              sharedNoticeId={NOTICE_ID}
            />
            <h3 className="mt-3 font-display text-lg tracking-tight">
              <Link
                href={`/${lang}/videos/${v.slug}`}
                className={`hover:text-muted-foreground transition-colors ${LINK_FOCUS}`}
              >
                {videoDisplayTitle(v, lang)}
              </Link>
            </h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {kindLabel[v.kind]} · {v.recordedYear ?? v.date.slice(0, 4)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
