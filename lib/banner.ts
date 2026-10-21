/**
 * Banners de la portada (carrusel). Se eligen por fechas: `getActiveBanners()`
 * devuelve todas las entradas con `startsAt <= now < endsAt`, ordenadas por
 * `priority` ascendente y luego por `startsAt` descendente. `getActiveBanner()`
 * devuelve la primera (compatibilidad).
 *
 * Para agregar un lanzamiento: añadir una entrada a BANNER_ENTRIES con su
 * `priority` (1 = primero en el carrusel).
 *
 * Prueba: `pnpm test:banners` (usa scripts/ts-resolve-hook.mjs para resolver `./release-date`).
 */

import { isReleased as isReleasedOn } from "./release-date";

export type Localized = { es: string; en: string };

export type BannerEntry = {
  slug: string;
  /** Orden en el carrusel: menor = antes. */
  priority: number;
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
    /** Si es true, se abre en pestaña nueva. Por defecto se infiere (href absoluto = externo). */
    external?: boolean;
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

// Portada provisional como hero (la banda aún no envía foto; X17). Arte oficial del single.
const LA_FUERZA_IMAGE = {
  desktop: "/media/newen-afrobeat/la-fuerza-hero.jpg",
  mobile: "/media/newen-afrobeat/la-fuerza-hero-mobile.jpg",
  alt: {
    es: "Portada de La Fuerza: ilustración de una montaña nevada, un desierto rojo y una laguna con flamencos",
    en: "La Fuerza cover art: illustration of a snow-capped mountain, a red desert and a lagoon with flamingos",
  },
};

const EN_VELA_IMAGE = {
  desktop: "/media/rosario-lircay/en-vela-hero.jpg",
  mobile: "/media/rosario-lircay/en-vela-hero-mobile.jpg",
  alt: {
    es: "Rosario Lircay, retrato nocturno en la calle",
    en: "Rosario Lircay, night portrait on the street",
  },
};

export const BANNER_ENTRIES: BannerEntry[] = [
  {
    // En Vela (Rosario Lircay) · segundo tras Destellos hasta su salida (va antes que La Fuerza por orden de estreno)
    slug: "rosario-lircay-en-vela",
    priority: 2,
    artist: "Rosario Lircay",
    title: { es: "En Vela", en: "En Vela" },
    eyebrow: { es: "Nuevo single · 23 de octubre", en: "New single · 23 October" },
    releaseDate: "2026-10-23",
    startsAt: "2026-10-21T00:00:00-03:00",
    endsAt: "2026-10-23T00:00:00-03:00",
    image: EN_VELA_IMAGE,
    cta: {
      href: "https://onerpm.link/105010589210",
      beforeRelease: { es: "Pre-save", en: "Pre-save" },
      afterRelease: { es: "Escuchar", en: "Listen" },
    },
    secondaryHref: "/releases/rosario-lircay-en-vela",
  },
  {
    // En Vela (Rosario Lircay) · recién publicado: tras La Fuerza y Destellos
    slug: "rosario-lircay-en-vela",
    priority: 2,
    artist: "Rosario Lircay",
    title: { es: "En Vela", en: "En Vela" },
    eyebrow: { es: "Nuevo single · 23 de octubre", en: "New single · 23 October" },
    releaseDate: "2026-10-23",
    startsAt: "2026-10-23T00:00:00-03:00",
    endsAt: "2026-11-05T00:00:00-03:00",
    image: EN_VELA_IMAGE,
    cta: {
      href: "https://onerpm.link/105010589210",
      beforeRelease: { es: "Pre-save", en: "Pre-save" },
      afterRelease: { es: "Escuchar", en: "Listen" },
    },
    secondaryHref: "/releases/rosario-lircay-en-vela",
  },
  {
    // La Fuerza (Newen) · hasta el estreno de Destellos va segundo
    slug: "newen-afrobeat-la-fuerza",
    priority: 2,
    artist: "Newen Afrobeat",
    title: { es: "La Fuerza", en: "La Fuerza" },
    eyebrow: { es: "Nuevo single · 30 de octubre", en: "New single · 30 October" },
    releaseDate: "2026-10-30",
    startsAt: "2026-10-21T00:00:00-03:00",
    endsAt: "2026-10-23T00:00:00-03:00",
    image: LA_FUERZA_IMAGE,
    cta: {
      href: "https://orcd.co/npk70nb",
      beforeRelease: { es: "Pre-save", en: "Pre-save" },
      afterRelease: { es: "Escuchar", en: "Listen" },
    },
    secondaryHref: "/releases/newen-afrobeat-la-fuerza",
  },
  {
    // La Fuerza (Newen) · primero hasta que salga Un Rezo (el estreno más próximo manda)
    slug: "newen-afrobeat-la-fuerza",
    priority: 1,
    artist: "Newen Afrobeat",
    title: { es: "La Fuerza", en: "La Fuerza" },
    eyebrow: { es: "Nuevo single · 30 de octubre", en: "New single · 30 October" },
    releaseDate: "2026-10-30",
    startsAt: "2026-10-23T00:00:00-03:00",
    endsAt: "2026-11-05T00:00:00-03:00",
    image: LA_FUERZA_IMAGE,
    cta: {
      href: "https://orcd.co/npk70nb",
      beforeRelease: { es: "Pre-save", en: "Pre-save" },
      afterRelease: { es: "Escuchar", en: "Listen" },
    },
    secondaryHref: "/releases/newen-afrobeat-la-fuerza",
  },
  {
    // La Fuerza (Newen) · ya publicado: segundo tras Klaus B
    slug: "newen-afrobeat-la-fuerza",
    priority: 2,
    artist: "Newen Afrobeat",
    title: { es: "La Fuerza", en: "La Fuerza" },
    eyebrow: { es: "Nuevo single · 30 de octubre", en: "New single · 30 October" },
    releaseDate: "2026-10-30",
    startsAt: "2026-11-05T00:00:00-03:00",
    endsAt: "2026-11-30T00:00:00-03:00",
    image: LA_FUERZA_IMAGE,
    cta: {
      href: "https://orcd.co/npk70nb",
      beforeRelease: { es: "Pre-save", en: "Pre-save" },
      afterRelease: { es: "Escuchar", en: "Listen" },
    },
    secondaryHref: "/releases/newen-afrobeat-la-fuerza",
  },
  {
    slug: "klaus-b-destellos-de-ti",
    priority: 1,
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
    priority: 1,
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
    priority: 1,
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
  {
    slug: "con-fusion-cuantas-veces",
    priority: 3, // 21-10: baja un puesto para dejar primero lo que está por salir
    artist: "Con.fusión",
    title: { es: "Cuántas veces", en: "Cuántas veces" },
    eyebrow: {
      es: "Nuevo single · feat. NuVee · prod. ecamhi",
      en: "New single · feat. NuVee · prod. ecamhi",
    },
    releaseDate: "2026-10-01",
    startsAt: "2026-10-20T00:00:00-03:00",
    endsAt: "2026-12-01T00:00:00-03:00",
    image: {
      desktop: "/media/con-fusion/cuantas-veces-hero.jpg",
      mobile: "/media/con-fusion/cuantas-veces-hero-mobile.jpg",
      alt: {
        es: "Con.fusión, retrato en blanco y negro",
        en: "Con.fusión, black and white portrait",
      },
    },
    cta: {
      href: "https://www.youtube.com/watch?v=lPXsqrH4SU4",
      external: true,
      beforeRelease: { es: "Ver video", en: "Watch video" },
      afterRelease: { es: "Ver video", en: "Watch video" },
    },
    secondaryHref: "/releases/con-fusion-cuantas-veces",
  },
  {
    slug: "con-fusion-la-banca",
    priority: 3,
    artist: "Con.fusión",
    title: { es: "La Banca · Oído Alterno", en: "La Banca · Oído Alterno" },
    eyebrow: {
      es: "Sesión en vivo · con Matiah Chinaski, Búfalo Dit y DJ Pérez",
      en: "Live session · with Matiah Chinaski, Búfalo Dit & DJ Pérez",
    },
    releaseDate: "2026-09-12",
    startsAt: "2026-10-20T00:00:00-03:00",
    endsAt: "2026-10-21T00:00:00-03:00", // retirado del carrusel el 21-10 (máx. 4 slides); sigue en el catálogo
    image: {
      desktop: "/media/con-fusion/la-banca-hero.jpg",
      mobile: "/media/con-fusion/la-banca-hero-mobile.jpg",
      alt: {
        es: "Con.fusión cantando en la sesión La Banca",
        en: "Con.fusión singing at the La Banca session",
      },
    },
    cta: {
      href: "https://www.youtube.com/watch?v=QZ4IAyPVfP0",
      external: true,
      beforeRelease: { es: "Ver sesión", en: "Watch session" },
      afterRelease: { es: "Ver sesión", en: "Watch session" },
    },
    secondaryHref: "/artistas/con-fusion",
  },
];

/**
 * El lanzamiento se considera cumplido desde las 00:00 (America/Santiago) del
 * `releaseDate`. Delegado a `lib/release-date.ts` (única fuente de la regla).
 */
export function isReleased(entry: Pick<BannerEntry, "releaseDate">, now: Date = new Date()): boolean {
  return isReleasedOn(entry.releaseDate, now.getTime());
}

/** Todas las entradas activas en `now`, por prioridad y luego la más reciente primero. */
export function getActiveBanners(now: Date = new Date()): BannerEntry[] {
  const t = now.getTime();
  return BANNER_ENTRIES.filter((entry) => {
    const start = Date.parse(entry.startsAt);
    const end = entry.endsAt ? Date.parse(entry.endsAt) : Infinity;
    return start <= t && t < end;
  }).sort(
    (a, b) => a.priority - b.priority || Date.parse(b.startsAt) - Date.parse(a.startsAt),
  );
}

export function getActiveBanner(now: Date = new Date()): BannerEntry | null {
  return getActiveBanners(now)[0] ?? null;
}
