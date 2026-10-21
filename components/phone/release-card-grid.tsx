import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCatalogEntries } from "@/lib/catalog";
import { ComingSoonBadge } from "@/components/release-status";
import type { Language } from "@/lib/translations";

type Props = {
  lang: Language;
  /** Release de la ficha actual: se excluye de la grilla. */
  currentSlug: string;
  /** Artista principal de la ficha: sus otros lanzamientos van primero. */
  artistSlug: string;
  limit?: number;
};

const copy = {
  es: { heading: "Más lanzamientos", all: "Catálogo", newTab: "(se abre en pestaña nueva)" },
  en: { heading: "More releases", all: "Catalogue", newTab: "(opens in new tab)" },
} as const;

// Foco sobre fondo claro: anillo interior en el rojo PHŌNÉ (único acento).
const FOCUS_LIGHT =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand";

const CARD_CLASS = `group block bg-background hover:bg-foreground/[0.02] transition-colors ${FOCUS_LIGHT}`;

/**
 * Grilla de cierre de la ficha de release: hasta `limit` lanzamientos del
 * catálogo público (solo entradas con portada), primero los del mismo artista
 * y luego los más recientes. Las entradas con ficha enlazan a /releases/[slug];
 * las ligeras, a su tienda externa (pestaña nueva) o a la ficha del artista.
 * Server component; la portada va a color (arte de lanzamiento) y se carga diferida.
 */
export function ReleaseCardGrid({ lang, currentSlug, artistSlug, limit = 4 }: Props) {
  const all = getCatalogEntries().filter((e) => e.releaseSlug !== currentSlug);
  const same = all.filter((e) => e.matchArtistSlugs.includes(artistSlug));
  const rest = all.filter((e) => !e.matchArtistSlugs.includes(artistSlug));
  const picks = [...same, ...rest].slice(0, limit);
  if (picks.length === 0) return null;
  const t = copy[lang];

  return (
    <section aria-labelledby="more-releases-heading" className="border-t border-foreground/10">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-24">
        <div className="flex items-baseline justify-between gap-6 mb-8 lg:mb-12">
          <h2 id="more-releases-heading" className="text-3xl lg:text-5xl font-display tracking-tight">
            {t.heading}
          </h2>
          <Link
            href={`/${lang}/catalogo`}
            className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.all} →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
          {picks.map((e) => {
            const href = e.releaseSlug
              ? `/${lang}/releases/${e.releaseSlug}`
              : (e.externalHref ?? `/${lang}/artistas/${e.artistSlug}`);
            const external = !e.releaseSlug && Boolean(e.externalHref);

            const body = (
              <>
                <div className="relative aspect-square overflow-hidden bg-foreground/5">
                  {e.upcoming && (
                    <ComingSoonBadge
                      releaseDate={e.releaseDate}
                      initialReleased={!e.upcoming}
                      lang={lang}
                      variant="overlay"
                      showDate={false}
                    />
                  )}
                  {e.cover ? (
                    <Image
                      src={e.cover}
                      alt={`${e.title} — ${e.artistName}`}
                      fill
                      sizes="(min-width: 1400px) 330px, (min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/40"
                      role="img"
                      aria-label={`${e.title} — ${e.artistName} · ${lang === "es" ? "portada pendiente" : "cover pending"}`}
                    >
                      <span className="font-display text-4xl tracking-widest">PHŌNÉ</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest">{e.artistName}</span>
                    </div>
                  )}
                </div>
                <div className="p-4 lg:p-6">
                  <h3 className="font-display text-lg lg:text-xl tracking-tight">
                    {e.title}
                    {external && (
                      <ArrowUpRight className="ml-1 inline-block w-3 h-3 align-baseline opacity-60" aria-hidden />
                    )}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{e.artistName}</p>
                  <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">{e.year}</p>
                  {/* Fuera del h3: entra en el nombre accesible del enlace sin ensuciar la lista de encabezados */}
                  {external && <span className="sr-only"> {t.newTab}</span>}
                </div>
              </>
            );

            return external ? (
              <a key={e.key} href={href} target="_blank" rel="noopener noreferrer" className={CARD_CLASS}>
                {body}
              </a>
            ) : (
              <Link key={e.key} href={href} className={CARD_CLASS}>
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
