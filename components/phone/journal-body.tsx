import Image from "next/image";
import Link from "next/link";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { getRelease } from "@/lib/releases";
import { journalVideoThumb, type JournalBlock } from "@/lib/journal";
import type { Language } from "@/lib/translations";

const copy = {
  es: { photo: "Foto", release: "Lanzamiento", by: "de", view: "Ver lanzamiento" },
  en: { photo: "Photo", release: "Release", by: "by", view: "View release" },
} as const;

const LINK_FOCUS =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4";

/**
 * Ancho de la columna de lectura: 33,75rem = 540 px con la raíz de 16 px. Con text-lg (18 px) e
 * Instrument Sans, la prosa del sitio promedia 0,45 em por carácter (≈ 8,1 px), así que una línea
 * llena tiene unos 66 caracteres (60–70). No se usa `ch`: mide el "0", que en esta fuente ocupa
 * 0,666 em, y 60ch daban unos 87 caracteres. En rem, el encabezado de la pieza (fuente base) y el
 * cuerpo (text-lg) quedan con el mismo ancho. Cada rem de más o de menos ≈ 2 caracteres por línea.
 */
export const READING_COLUMN = "max-w-[33.75rem]";

/** `sizes` de las imágenes y la facade: el ancho de la columna de lectura (540 px). */
const COLUMN_SIZES = "(min-width: 768px) 540px, calc(100vw - 48px)";

/**
 * Cuerpo de una pieza del journal: una sola columna de lectura (READING_COLUMN, unos 66
 * caracteres por línea con la tipografía del sitio), text-lg y leading-relaxed. Bloques: párrafo, subtítulo
 * (h2), cita (figure + blockquote), imagen con pie y crédito, video (facade de YouTube) y tarjeta
 * de lanzamiento. Server component; las imágenes se cargan diferidas (el LCP es el hero).
 */
export function JournalBody({ blocks, lang }: { blocks: readonly JournalBlock[]; lang: Language }) {
  const t = copy[lang];
  return (
    <div className={`${READING_COLUMN} space-y-6 text-lg leading-relaxed text-foreground/90`}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "paragraph":
            return <p key={i}>{b.text}</p>;
          case "heading":
            return (
              <h2 key={i} className="pt-6 font-display text-2xl lg:text-3xl tracking-tight text-foreground text-balance">
                {b.text}
              </h2>
            );
          case "quote":
            return (
              <figure key={i} className="my-10 border-l-2 border-foreground/30 pl-6">
                <blockquote className="font-display text-2xl lg:text-3xl leading-snug tracking-tight text-foreground">
                  <p>{b.text}</p>
                </blockquote>
                {b.cite && (
                  <figcaption className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    — {b.cite}
                  </figcaption>
                )}
              </figure>
            );
          case "image":
            return (
              <figure key={i} className="my-10">
                <Image
                  src={b.src}
                  alt={b.alt}
                  width={b.width}
                  height={b.height}
                  sizes={COLUMN_SIZES}
                  className="h-auto w-full bg-foreground/5"
                />
                <figcaption className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {b.caption && <>{b.caption} · </>}
                  {t.photo}: {b.credit}
                </figcaption>
              </figure>
            );
          case "video":
            return (
              <div key={i} className="my-10">
                <YouTubeEmbed
                  youtubeId={b.youtubeId}
                  title={b.title}
                  lang={lang}
                  sizes={COLUMN_SIZES}
                  initialThumb={journalVideoThumb(b)}
                />
              </div>
            );
          case "release": {
            const r = getRelease(b.slug);
            if (!r) return null;
            return (
              <div key={i} className="my-10 border-y border-foreground/10 py-4">
                <Link href={`/${lang}/releases/${r.slug}`} className={`group flex items-center gap-5 ${LINK_FOCUS}`}>
                  <span className="relative block h-24 w-24 shrink-0 overflow-hidden bg-foreground/5">
                    {r.cover && <Image src={r.cover} alt="" fill sizes="96px" className="object-cover" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {t.release}
                    </span>
                    <span className="mt-1 block font-display text-xl tracking-tight text-foreground group-hover:text-muted-foreground transition-colors">
                      {r.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {t.by} {r.artistName} · {r.year}
                    </span>
                    <span className="mt-2 block text-sm text-foreground/80">
                      {t.view} <span aria-hidden="true">→</span>
                    </span>
                  </span>
                </Link>
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
