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
};

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
 * Imágenes diferidas (el LCP de la página es el hero). Renderiza null si no hay otros.
 */
export function ArtistCardGrid({ lang, excludeSlug }: Props) {
  const others = artists.filter((a) => a.slug !== excludeSlug);
  if (others.length === 0) return null;
  const t = copy[lang];
  const cols = pickLgCols(others.length);

  return (
    <section aria-labelledby="other-artists-heading" className="border-t border-foreground/10">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-24">
        <div className="flex items-baseline justify-between gap-6 mb-8 lg:mb-12">
          <h2 id="other-artists-heading" className="text-3xl lg:text-5xl font-display tracking-tight">
            {t.heading}
          </h2>
          <Link
            href={`/${lang}#roster`}
            className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.all} →
          </Link>
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
                      sizes="(min-width: 1400px) 330px, (min-width: 1024px) 25vw, 50vw"
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
          <GridFillers count={others.length} cols={cols} />
        </div>
      </div>
    </section>
  );
}
