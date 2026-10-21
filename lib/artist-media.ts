// Imágenes de los artistas del roster: hero ancho (art direction 16:9 / 4:5)
// y retrato cuadrado. Módulo puro, sin imports: lo cargan server components,
// el bundle cliente (roster de portada) y los scripts de verificación con node.
//
// Heros: public/media/<artista>/*-hero.jpg (2560×1440) y *-hero-mobile.jpg (1200×1500).
// Retratos: public/artists/<slug>.jpg (640 px de alto; con-fusion es 535×640 y
// `object-cover` recorta al cuadrado). B/N vía CSS donde la regla lo pide.

export type Localized = { es: string; en: string };

export type ArtistHero = {
  desktop: string;
  mobile: string;
  /** Alt descriptivo (describe la escena, no el tipo de archivo), igual que en lib/banner.ts y press-kit. */
  alt: Localized;
  /** Nota interna; no se renderiza. */
  note?: string;
};

/** Hero por artista. Compatible con `PageHeroProps["image"]`. */
export const ARTIST_HERO: Record<string, ArtistHero> = {
  "klaus-brantmayer": {
    desktop: "/media/klaus-b/destellos-hero.jpg",
    mobile: "/media/klaus-b/destellos-hero-mobile.jpg",
    alt: {
      es: "Klaus B toca la flauta traversa con audífonos y los ojos cerrados frente a un micrófono de estudio; foto en blanco y negro",
      en: "Klaus B plays the flute wearing headphones, eyes closed, in front of a studio microphone; black-and-white photo",
    },
  },
  "con-fusion": {
    desktop: "/media/con-fusion/cuantas-veces-hero.jpg",
    mobile: "/media/con-fusion/cuantas-veces-hero-mobile.jpg",
    alt: {
      es: "Con.fusión (Catalina Aguilera) con los ojos cerrados en la sesión de Cuántas veces; foto en blanco y negro",
      en: "Con.fusión (Catalina Aguilera) with her eyes closed at the Cuántas veces session; black-and-white photo",
    },
  },
  ecamhi: {
    desktop: "/media/ecamhi/ecamhi-hero.jpg",
    mobile: "/media/ecamhi/ecamhi-hero-mobile.jpg",
    alt: {
      es: "ecamhi tocando trompeta frente a una proyección",
      en: "ecamhi playing trumpet in front of a projection",
    },
  },
  "rosario-lircay": {
    desktop: "/media/rosario-lircay/en-vela-hero.jpg",
    mobile: "/media/rosario-lircay/en-vela-hero-mobile.jpg",
    alt: { es: "Rosario Lircay, retrato nocturno en la calle", en: "Rosario Lircay, night portrait on the street" },
  },
  "newen-afrobeat": {
    desktop: "/media/newen-afrobeat/la-fuerza-hero.jpg",
    mobile: "/media/newen-afrobeat/la-fuerza-hero-mobile.jpg",
    alt: {
      es: "Portada de La Fuerza: ilustración de una montaña nevada, un desierto rojo y una laguna con flamencos",
      en: "La Fuerza cover art: illustration of a snow-capped mountain, a red desert and a lagoon with flamingos",
    },
    note: "provisional: arte del single La Fuerza sobre fondo desenfocado; reemplazar por foto de la banda",
  },
};

/** Hero del artista o `null` si no tiene. */
export function getArtistHero(slug: string): ArtistHero | null {
  return ARTIST_HERO[slug] ?? null;
}

/**
 * Slugs con retrato en public/artists/<slug>.jpg. Reemplaza los dos sets que
 * estaban duplicados en la ficha de artista y en el press kit.
 * Actualizar al agregar una foto nueva.
 */
export const ARTIST_PORTRAIT: ReadonlySet<string> = new Set([
  "newen-afrobeat",
  "con-fusion",
  "klaus-brantmayer",
  "ecamhi",
  "rosario-lircay",
]);

/** Ruta pública del retrato o `null` si el artista no tiene foto. */
export function getArtistPortrait(slug: string): string | null {
  return ARTIST_PORTRAIT.has(slug) ? `/artists/${slug}.jpg` : null;
}
