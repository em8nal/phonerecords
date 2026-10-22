import Link from "next/link";
import { getPublishedVideos, VIDEO_KIND_LABEL } from "@/lib/videos";
import { translations, type Language } from "@/lib/translations";
import { GridFillers } from "@/components/phone/grid-fillers";
import { VideoCard, toVideoCardData } from "@/components/phone/video-card";

type Props = {
  lang: Language;
  /** Video de la ficha actual: se excluye de la grilla. */
  currentSlug: string;
  /** Artista de la ficha: sus otros videos van primero. */
  artistSlug: string;
  limit?: number;
};

const LINK_FOCUS =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

/**
 * Grilla de cierre de la ficha de video (calco de ReleaseCardGrid): hasta
 * `limit` videos ya publicados, primero los del mismo artista y luego los más
 * recientes. Server component; miniaturas diferidas. Null si no hay otros.
 */
export function VideoCardGrid({ lang, currentSlug, artistSlug, limit = 4 }: Props) {
  const all = getPublishedVideos().filter((v) => v.slug !== currentSlug);
  const same = all.filter((v) => v.artistSlug === artistSlug);
  const rest = all.filter((v) => v.artistSlug !== artistSlug);
  const picks = [...same, ...rest].slice(0, limit);
  if (picks.length === 0) return null;
  const t = translations[lang].videos;
  const kindLabel = VIDEO_KIND_LABEL[lang];

  return (
    <section aria-labelledby="more-videos-heading" className="border-t border-foreground/10">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-24">
        <div className="flex items-baseline justify-between gap-6 mb-8 lg:mb-12">
          <h2 id="more-videos-heading" className="text-3xl lg:text-5xl font-display tracking-tight">
            {t.moreHeading}
          </h2>
          <Link
            href={`/${lang}/videos`}
            className={`inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors ${LINK_FOCUS}`}
          >
            {t.allVideos} →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
          {picks.map((v) => (
            <VideoCard key={v.slug} video={toVideoCardData(v)} lang={lang} kindLabel={kindLabel[v.kind]} />
          ))}
          <GridFillers count={picks.length} cols={4} />
        </div>
      </div>
    </section>
  );
}
