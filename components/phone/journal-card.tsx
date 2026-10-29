import Image from "next/image";
import Link from "next/link";
import type { Language } from "@/lib/translations";
import { JOURNAL_FORMAT_LABEL, formatPublishDate, type JournalPiece } from "@/lib/journal";

// Foco sobre fondo claro: anillo en el rojo PHŌNÉ (único acento), separado de la portada.
const FOCUS =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4";

/**
 * Tarjeta de pieza del índice /journal: portada 16:9, formato, fecha y título (el enlace), con la
 * bajada fuera del enlace para que su nombre accesible sea corto y empiece por el título. Server component; la portada
 * se carga diferida (el LCP del índice es el hero). El formato va en español en los dos idiomas.
 */
export function JournalCard({ piece, lang }: { piece: JournalPiece; lang: Language }) {
  const href = `/${lang}/journal/${piece.slug}`;
  return (
    <article className="flex flex-col">
      <Link href={href} className={`group block ${FOCUS}`}>
        <div className="relative aspect-video overflow-hidden bg-foreground/5">
          <Image
            src={piece.cover.src}
            alt=""
            fill
            sizes="(min-width: 1400px) 420px, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
          />
        </div>
        {/* El título va primero en el DOM (el nombre accesible del enlace empieza por él); la meta
            queda arriba solo a la vista (flex-col-reverse). */}
        <div className="mt-5 flex flex-col-reverse gap-3">
          <h2 className="font-display text-2xl lg:text-3xl tracking-tight text-balance group-hover:text-muted-foreground transition-colors">
            {piece.title[lang]}
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span lang={lang === "en" ? "es" : undefined}>{JOURNAL_FORMAT_LABEL[piece.format]}</span>
            {" · "}
            <time dateTime={piece.publishAt}>{formatPublishDate(piece, lang)}</time>
          </p>
        </div>
      </Link>
      <p className="mt-3 text-base text-foreground/75 leading-relaxed">{piece.excerpt[lang]}</p>
    </article>
  );
}
