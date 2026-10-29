import Image from "next/image";
import Link from "next/link";
import { artists } from "@/lib/artists";
import { getArtistPortrait } from "@/lib/artist-media";
import type { Language } from "@/lib/translations";
import { GridFillers, lgColsClass, pickLgCols } from "@/components/phone/grid-fillers";

type Props = {
  lang: Language;
  /** Artista de la ficha actual: se excluye de la grilla. */
  excludeSlug?: string;
  /** Título de la sección; por defecto "Otros artistas" / "Other artists" (ficha de artista). */
  heading?: string;
  /** id del h2 (aria-labelledby de la sección); por defecto "other-artists-heading". */
  headingId?: string;
  /** Enlace "Ver roster" junto al título; el índice /artistas lo apaga (ya es el roster). */
  showAllLink?: boolean;
  /**
   * Tarjeta oscura de cierre, como la de la portada ("Catálogo PHŌNÉ"): con 2 columnas (hasta lg)
   * y un número impar de artistas ocupa la celda libre en lugar del relleno. Sin la prop, la grilla
   * queda como en la ficha de artista.
   */
  closingTile?: ClosingTile;
};

export type ClosingTile = { href: string; eyebrow: string; headline: string; cta: string };

const copy = {
  es: { heading: "Otros artistas", all: "Ver roster" },
  en: { heading: "Other artists", all: "View roster" },
} as const;

// Foco sobre fondo claro: anillo interior en el rojo PHŌNÉ (único acento).
const FOCUS_LIGHT =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand";

/**
 * Grilla de cierre de la ficha de artista: los demás artistas del roster con
 * retrato en B/N (regla institucional), nombre y géneros. Server component.
 * El índice /artistas la usa con todo el roster, su propio título, sin "Ver roster" y con la
 * tarjeta de cierre hacia el catálogo (sin celdas vacías a 2 columnas).
 * Imágenes diferidas (el LCP de la página es el hero). Renderiza null si no hay otros.
 */
export function ArtistCardGrid({
  lang,
  excludeSlug,
  heading,
  headingId = "other-artists-heading",
  showAllLink = true,
  closingTile,
}: Props) {
  const others = artists.filter((a) => a.slug !== excludeSlug);
  if (others.length === 0) return null;
  const t = copy[lang];
  const cols = pickLgCols(others.length);
  // La tarjeta de cierre solo existe hasta lg (2 columnas) y solo si la última fila queda impar.
  const showTile = closingTile !== undefined && others.length % 2 === 1;
  // Celdas libres de la última fila desde lg (los mismos rellenos que GridFillers).
  const desktopFillers = (cols - (others.length % cols)) % cols;
  // Retrato: 1/cols del contenedor desde lg (1320 px útiles a 1400 px), media pantalla antes.
  const sizes = `(min-width: 1400px) ${Math.round(1320 / cols)}px, (min-width: 1024px) ${Math.round(100 / cols)}vw, 50vw`;

  return (
    <section aria-labelledby={headingId} className="border-t border-foreground/10">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-24">
        <div className="flex items-baseline justify-between gap-6 mb-8 lg:mb-12">
          <h2 id={headingId} className="text-3xl lg:text-5xl font-display tracking-tight">
            {heading ?? t.heading}
          </h2>
          {showAllLink && (
            <Link
              href={`/${lang}#roster`}
              className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.all} →
            </Link>
          )}
        </div>

        <div className={`grid grid-cols-2 ${lgColsClass(cols)} gap-px bg-foreground/10 border border-foreground/10`}>
          {others.map((a) => {
            const portrait = getArtistPortrait(a.slug);
            return (
              <Link
                key={a.slug}
                href={`/${lang}/artistas/${a.slug}`}
                className={`group block bg-background hover:bg-foreground/[0.02] transition-colors ${FOCUS_LIGHT}`}
              >
                <div className="relative aspect-square overflow-hidden bg-foreground/5">
                  {portrait ? (
                    <Image
                      src={portrait}
                      alt=""
                      fill
                      sizes={sizes}
                      className="object-cover grayscale transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center font-display text-6xl text-muted-foreground/40"
                    >
                      {a.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-4 lg:p-6">
                  <h3 className="font-display text-xl lg:text-2xl tracking-tight">{a.name}</h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {a.genres.slice(0, 3).join(" · ")}
                  </p>
                </div>
              </Link>
            );
          })}
          {showTile ? (
            <>
              <Link
                href={closingTile.href}
                className="group flex flex-col justify-between gap-10 bg-foreground p-4 text-background md:p-8 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
              >
                <span className="font-mono text-xs uppercase tracking-wider text-background/60">{closingTile.eyebrow}</span>
                <span className="block">
                  <span className="mb-6 block font-display text-xl tracking-tight text-balance md:text-2xl">
                    {closingTile.headline}
                  </span>
                  <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
                    {closingTile.cta}
                    <span aria-hidden="true" className="text-brand motion-safe:transition-transform motion-safe:group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </span>
              </Link>
              {Array.from({ length: desktopFillers }, (_, i) => (
                <div key={`d${i}`} aria-hidden="true" className="hidden bg-background lg:block" />
              ))}
            </>
          ) : (
            <GridFillers count={others.length} cols={cols} />
          )}
        </div>
      </div>
    </section>
  );
}
