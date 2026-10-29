import Image from "next/image";
import Link from "next/link";
import type { Release } from "@/lib/releases";
import type { Language } from "@/lib/translations";
import type { Localized } from "@/lib/artist-media";
import { ReleaseCta, ComingSoonBadge } from "@/components/release-status";

type Props = {
  release: Release;
  lang: Language;
  /** Respuesta del servidor a isReleased(); los componentes cliente re-chequean el reloj. */
  initialReleased: boolean;
};

const TYPE_LABEL: Record<Release["type"], Localized> = {
  album: { es: "Álbum", en: "Album" },
  ep: { es: "EP", en: "EP" },
  single: { es: "Single", en: "Single" },
  live: { es: "En vivo", en: "Live" },
  mixtape: { es: "Mixtape", en: "Mixtape" },
  compilation: { es: "Compilado", en: "Compilation" },
};

// Fondo desenfocado y portada nítida comparten `src` y `sizes`: el navegador
// elige el mismo candidato del srcset y descarga la imagen una sola vez.
const COVER_SIZES = "(min-width: 1024px) 320px, (min-width: 768px) 280px, 220px";

// Plataformas de escucha (mismo criterio que pickReleaseActions en la ficha de
// artista); Discogs, Beatport o Qobuz son tiendas y no sirven como CTA "Escuchar".
const LISTEN_HOSTS = [
  "open.spotify.com",
  "music.apple.com",
  "bandcamp.com",
  "soundcloud.com",
  "tidal.com",
  "youtube.com",
  "onerpm.link",
  "orcd.co",
];

/** Primer enlace de escucha del release, o `undefined` si solo hay tiendas. */
function pickListenHref(links: Release["links"]): string | undefined {
  return links?.find((l) => {
    const u = l.href.toLowerCase();
    return LISTEN_HOSTS.some((host) => u.includes(host));
  })?.href;
}

// Foco visible sobre la foto (igual que release-banner.tsx).
const FOCUS_DARK =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black";

/**
 * Cabecera de la ficha de release, justo después del menú: la portada ampliada
 * y desenfocada de fondo (CSS, sin archivos nuevos), la portada nítida al
 * frente y, al lado, artista · tipo · año, el h1 (único de la página), el
 * badge "Próximamente" mientras no salga y el CTA primario (informe §3.2).
 * Server component; la portada nítida es el LCP y la única imagen prioritaria de la página.
 */
export function ReleaseHero({ release, lang, initialReleased }: Props) {
  const isEs = lang === "es";
  const coverAlt = `${release.title} — ${release.artistName}`;
  // Smart link si existe; si no, el primer enlace de escucha (nunca una tienda:
  // "Escuchar" no debe mandar a Discogs) y solo cuando ya salió, para no
  // etiquetar "Pre-save" una plataforma. Por salir y sin smart link → sin CTA.
  // Ojo: `initialReleased` sale del render ISR (revalidate = 300 en la ficha). El
  // label Pre-save → Escuchar y el badge vuelven a mirar el reloj en el cliente a
  // las 00:00 de Santiago. Un release SIN smartLink muestra el CTA desde la primera
  // regeneración posterior al estreno: 300 s más el tiempo hasta la siguiente visita
  // (stale-while-revalidate).
  const ctaHref = release.smartLink ?? (initialReleased ? pickListenHref(release.links) : undefined);

  return (
    // pt-20 = altura del menú fijo: el menú queda sobre el fondo claro y el hero empieza debajo.
    <section aria-labelledby="release-hero-title" className="relative bg-background pt-20">
      <div className="relative overflow-hidden bg-neutral-950 text-white">
        {release.cover && (
          <Image
            src={release.cover}
            alt=""
            aria-hidden="true"
            fill
            sizes={COVER_SIZES}
            className="object-cover scale-125 blur-2xl brightness-50 saturate-50"
          />
        )}
        {/* Degradado para contraste AA del texto blanco sobre cualquier portada */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20"
        />

        <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-12 md:flex-row md:items-end lg:gap-12 lg:px-12 lg:py-16">
          <div className="relative aspect-square w-[220px] shrink-0 overflow-hidden shadow-2xl md:w-[280px] lg:w-[320px]">
            {release.cover ? (
              <Image src={release.cover} alt={coverAlt} fill sizes={COVER_SIZES} priority className="object-cover" />
            ) : (
              <div
                role="img"
                aria-label={`${coverAlt} · ${isEs ? "portada pendiente" : "cover pending"}`}
                className="absolute inset-0 flex items-center justify-center border border-white/10 bg-white/5 font-display text-4xl tracking-widest text-white/40"
              >
                PHŌNÉ
              </div>
            )}
          </div>

          <div className="min-w-0 max-w-3xl">
            <p className="mb-4 inline-flex flex-wrap items-center gap-3 font-mono text-sm uppercase tracking-[0.1em] text-white/90 md:tracking-[0.18em]">
              <span className="h-px w-8 bg-white/50" aria-hidden="true" />
              <Link
                href={`/${lang}/artistas/${release.artistSlug}`}
                className={`inline-flex min-h-6 items-center rounded-sm underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white ${FOCUS_DARK}`}
              >
                {release.artistName}
              </Link>
              <span aria-hidden="true">·</span>
              <span>{TYPE_LABEL[release.type][lang]}</span>
              <span aria-hidden="true">·</span>
              <span>{release.year}</span>
            </p>

            <h1
              id="release-hero-title"
              className="font-display text-5xl leading-[0.95] tracking-tight text-balance lg:text-7xl"
            >
              {release.title}
            </h1>

            {/* Badge con relleno --brand y texto blanco (5,58:1, AA): no depende de lo clara que sea la
                portada desenfocada de fondo y mantiene el rojo PHŌNÉ como único acento (X16). */}
            {!initialReleased && (
              <div className="mt-5 [&_[data-coming-soon]]:border-transparent [&_[data-coming-soon]]:bg-brand [&_[data-coming-soon]]:text-white">
                <ComingSoonBadge releaseDate={release.releaseDate} initialReleased={initialReleased} lang={lang} />
              </div>
            )}

            {/* CTA blanco sobre foto (§3.2); ReleaseCta trae target, rel, sr-only y el flip Pre-save → Escuchar. */}
            {ctaHref && (
              <div className="mt-8">
                <ReleaseCta
                  href={ctaHref}
                  releaseDate={release.releaseDate}
                  initialReleased={initialReleased}
                  lang={lang}
                  release={release.slug}
                  className={`bg-white text-black hover:bg-white/90 ${FOCUS_DARK}`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
