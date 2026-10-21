/**
 * Banner de lanzamiento de la portada. Rota solo por fechas: `getActiveBanner()`
 * devuelve la primera entrada con `startsAt <= now < endsAt`.
 *
 * Para agregar un lanzamiento: añadir una entrada a BANNER_ENTRIES (el orden
 * importa solo si dos ventanas se solapan: gana la primera).
 *
 * Este módulo no importa nada, para poder probarse con `node` directamente.
 */

export type Localized = { es: string; en: string };

export type BannerEntry = {
  slug: string;
  artist: string;
  title: Localized;
  eyebrow?: Localized;
  /** Fecha de lanzamiento, "YYYY-MM-DD", en hora de Chile (America/Santiago). */
  releaseDate: string;
  /** Inicio de la ventana del banner (ISO con offset). */
  startsAt: string;
  /** Fin de la ventana (exclusivo). Sin valor = no expira. */
  endsAt?: string;
  image: {
    /** >= 768px, 16:9 */
    desktop: string;
    /** < 768px, 4:5 */
    mobile: string;
    alt: Localized;
  };
  cta: {
    /** Absoluto (https://...) o relativo sin idioma (se prefija /es o /en). */
    href: string;
    beforeRelease: Localized;
    afterRelease: Localized;
  };
  /** Ruta relativa sin prefijo de idioma, p. ej. "/releases/slug". */
  secondaryHref: string;
};

const IMAGE = {
  desktop: "/media/klaus-b/destellos-hero.jpg",
  mobile: "/media/klaus-b/destellos-hero-mobile.jpg",
  alt: {
    // Neutro a propósito: la foto desktop lleva flauta y la móvil saxofón.
    es: "Klaus B, retrato en blanco y negro",
    en: "Klaus B, black and white portrait",
  },
} as const;

export const BANNER_ENTRIES: BannerEntry[] = [
  {
    slug: "klaus-b-destellos-de-ti",
    artist: "Klaus B",
    title: { es: "Destellos de ti", en: "Destellos de ti" },
    eyebrow: { es: "Nuevo single · 22 de octubre", en: "New single · October 22" },
    releaseDate: "2026-10-22",
    startsAt: "2026-10-20T00:00:00-03:00",
    endsAt: "2026-11-05T00:00:00-03:00",
    image: IMAGE,
    cta: {
      href: "https://onerpm.link/102211016130",
      beforeRelease: { es: "Pre-save", en: "Pre-save" },
      afterRelease: { es: "Escuchar", en: "Listen" },
    },
    secondaryHref: "/releases/klaus-b-destellos-de-ti",
  },
  {
    slug: "klaus-b-un-rezo",
    artist: "Klaus B",
    title: { es: "Un Rezo", en: "Un Rezo" },
    eyebrow: { es: "Nuevo single · 5 de noviembre", en: "New single · November 5" },
    releaseDate: "2026-11-05",
    startsAt: "2026-11-05T00:00:00-03:00",
    endsAt: "2026-11-20T00:00:00-03:00",
    // No hay foto propia aún: se reutiliza la de Destellos de ti.
    image: IMAGE,
    cta: {
      href: "https://onerpm.link/106214256083",
      beforeRelease: { es: "Pre-save", en: "Pre-save" },
      afterRelease: { es: "Escuchar", en: "Listen" },
    },
    secondaryHref: "/releases/klaus-b-un-rezo",
  },
  {
    slug: "klaus-b-una-cuota-de-caos",
    artist: "Klaus B",
    title: { es: "Una Cuota De Caos", en: "Una Cuota De Caos" },
    eyebrow: { es: "Álbum · 20 de noviembre", en: "Album · November 20" },
    releaseDate: "2026-11-20",
    startsAt: "2026-11-20T00:00:00-03:00",
    image: IMAGE,
    cta: {
      // Relativo: el link final del álbum aún no existe; se prefija el idioma.
      href: "/artistas/klaus-brantmayer",
      beforeRelease: { es: "Ver artista", en: "View artist" },
      afterRelease: { es: "Ver artista", en: "View artist" },
    },
    secondaryHref: "/artistas/klaus-brantmayer",
  },
];

const SANTIAGO_TZ = "America/Santiago";

/** Fecha calendario ("YYYY-MM-DD") de `now` en hora de Chile. */
export function santiagoDate(now: Date): string {
  // en-CA formatea como YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SANTIAGO_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * El lanzamiento se considera cumplido desde las 00:00 (America/Santiago) del
 * `releaseDate`. Se compara la fecha calendario en Santiago, así el cambio de
 * horario de verano de Chile no desplaza el momento del cambio.
 */
export function isReleased(entry: Pick<BannerEntry, "releaseDate">, now: Date = new Date()): boolean {
  return santiagoDate(now) >= entry.releaseDate;
}

export function getActiveBanner(now: Date = new Date()): BannerEntry | null {
  const t = now.getTime();
  for (const entry of BANNER_ENTRIES) {
    const start = Date.parse(entry.startsAt);
    const end = entry.endsAt ? Date.parse(entry.endsAt) : Infinity;
    if (start <= t && t < end) return entry;
  }
  return null;
}
