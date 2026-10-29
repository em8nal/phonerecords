import Image from "next/image";
import Link from "next/link";
import { ComingSoonBadge } from "@/components/release-status";
import { artistGenres, getArtist, type Artist } from "@/lib/artists";
import { getArtistPortrait } from "@/lib/artist-media";
import { getRelease, type Release } from "@/lib/releases";
import { isReleased } from "@/lib/release-date";
import type { JournalPiece } from "@/lib/journal";
import type { Language } from "@/lib/translations";

const copy = {
  es: { heading: "Relacionados", release: "Lanzamiento", artist: "Artista" },
  en: { heading: "Related", release: "Release", artist: "Artist" },
} as const;

// Foco sobre fondo claro: anillo en el rojo PHŌNÉ (único acento), separado de la imagen.
const FOCUS =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4";

/**
 * Cierre de la pieza: sus lanzamientos (portada a color, "Próximamente" si aún no salen) y sus
 * artistas (retrato en B/N), cada uno enlazado a su ficha. Grilla con separación y sin líneas de
 * 1 px, así no necesita rellenos. Server component; la página es ISR (300 s), y el badge se
 * re-chequea en el cliente. Renderiza null si la pieza no tiene relaciones válidas.
 */
export function JournalRelated({ piece, lang }: { piece: JournalPiece; lang: Language }) {
  const t = copy[lang];
  const releases = piece.releases.map((s) => getRelease(s)).filter((r): r is Release => Boolean(r));
  const artists = piece.artists.map((s) => getArtist(s)).filter((a): a is Artist => Boolean(a));
  if (releases.length === 0 && artists.length === 0) return null;

  return (
    <section aria-labelledby="journal-related-heading" className="border-t border-foreground/10">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-24">
        <h2 id="journal-related-heading" className="mb-8 lg:mb-12 text-3xl lg:text-5xl font-display tracking-tight">
          {t.heading}
        </h2>
        <ul role="list" className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {releases.map((r) => {
            const released = isReleased(r.releaseDate);
            return (
              <li key={`r-${r.slug}`}>
                <Link href={`/${lang}/releases/${r.slug}`} className={`group block ${FOCUS}`}>
                  <div className="relative aspect-square overflow-hidden bg-foreground/5">
                    {!released && (
                      <ComingSoonBadge
                        releaseDate={r.releaseDate}
                        initialReleased={false}
                        lang={lang}
                        variant="overlay"
                        showDate={false}
                      />
                    )}
                    {r.cover && (
                      <Image
                        src={r.cover}
                        alt=""
                        fill
                        sizes="(min-width: 1400px) 310px, (min-width: 1024px) 22vw, 45vw"
                        className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
                      />
                    )}
                  </div>
                  <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">{t.release}</p>
                  <h3 className="mt-1 font-display text-lg lg:text-xl tracking-tight group-hover:text-muted-foreground transition-colors">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {r.artistName} · {r.year}
                  </p>
                </Link>
              </li>
            );
          })}
          {artists.map((a) => {
            const portrait = getArtistPortrait(a.slug);
            return (
              <li key={`a-${a.slug}`}>
                <Link href={`/${lang}/artistas/${a.slug}`} className={`group block ${FOCUS}`}>
                  <div className="relative aspect-square overflow-hidden bg-foreground/5">
                    {portrait ? (
                      <Image
                        src={portrait}
                        alt=""
                        fill
                        sizes="(min-width: 1400px) 310px, (min-width: 1024px) 22vw, 45vw"
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
                  <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">{t.artist}</p>
                  <h3 className="mt-1 font-display text-lg lg:text-xl tracking-tight group-hover:text-muted-foreground transition-colors">
                    {a.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{artistGenres(a, lang).slice(0, 3).join(" · ")}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
