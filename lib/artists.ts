// Static data for /artistas/[slug] pages.
// Datos: un archivo por artista en content/artists/<slug>.json (esquema en content/README.md),
// que llegan por el índice generado content/generated/artists.ts (pnpm content:index).
// Fuentes de los datos: informacion.md, spotify_manual.yaml y Bandcamp.

// Alias de slugs viejos (?artist= y enlaces guardados). Viven en un módulo puro
// para que los componentes cliente no carguen este archivo completo.
export { LEGACY_ARTIST_SLUGS, resolveArtistSlug } from "./artist-slugs";
import { artistEntries } from "../content/generated/artists";

export type ArtistLink = {
  label: string;
  href: string;
};

export type ArtistPlatform =
  | "spotify"
  | "apple-music"
  | "youtube"
  | "bandcamp"
  | "soundcloud"
  | "instagram"
  | "tiktok"
  | "discogs";

const hostIs = (...domains: string[]) => (host: string) =>
  domains.some((d) => host === d || host.endsWith(`.${d}`));

/**
 * Plataformas de los enlaces del artista, en el orden del estándar del 21-10 (plan 11a):
 * Spotify · Apple Music · YouTube · Bandcamp · SoundCloud · Instagram · TikTok, y Discogs al
 * final. `links` sigue este orden y usa estas etiquetas (lo vigila `pnpm test:roster`).
 * `official`: perfil propio del artista, que lleva `rel="me"`. Discogs no lo es: es una ficha
 * de base de datos que cualquiera edita, y `rel="me"` afirma identidad.
 */
export const ARTIST_PLATFORMS: readonly {
  id: ArtistPlatform;
  label: string;
  matchHost: (host: string) => boolean;
  official: boolean;
}[] = [
  { id: "spotify", label: "Spotify", matchHost: hostIs("spotify.com"), official: true },
  { id: "apple-music", label: "Apple Music", matchHost: hostIs("music.apple.com"), official: true },
  { id: "youtube", label: "YouTube", matchHost: hostIs("youtube.com", "youtu.be"), official: true },
  { id: "bandcamp", label: "Bandcamp", matchHost: hostIs("bandcamp.com"), official: true },
  { id: "soundcloud", label: "SoundCloud", matchHost: hostIs("soundcloud.com"), official: true },
  { id: "instagram", label: "Instagram", matchHost: hostIs("instagram.com"), official: true },
  { id: "tiktok", label: "TikTok", matchHost: hostIs("tiktok.com"), official: true },
  { id: "discogs", label: "Discogs", matchHost: hostIs("discogs.com"), official: false },
];

/** Plataforma de un enlace según su hostname; undefined si no es una de ARTIST_PLATFORMS. */
export function linkPlatform(href: string): (typeof ARTIST_PLATFORMS)[number] | undefined {
  let host: string;
  try {
    host = new URL(href).hostname.toLowerCase();
  } catch {
    return undefined;
  }
  return ARTIST_PLATFORMS.find((p) => p.matchHost(host));
}

/** `rel` del enlace en la ficha: "me" solo en los perfiles propios (no en Discogs ni en uno desconocido). */
export function artistLinkRel(href: string): string {
  return linkPlatform(href)?.official ? "me noopener noreferrer" : "noopener noreferrer";
}

export type Release = {
  year: string;
  title: string;
  format?: string;
  label?: string;
  notes?: string;
  /** Storefront URL for "Comprar" button on artist page / catalog. */
  href?: string;
  /** Action label preference if explicitly set. Defaults to "buy" when href is a storefront. */
  hrefKind?: "buy" | "listen";
  /** Cover image URL for the catalog grid. */
  cover?: string;
};

export type Artist = {
  slug: string;
  name: string;
  /** Otros nombres con que se le conoce o busca (JSON-LD `alternateName`). */
  alternateName?: string[];
  genres: string[];
  /** Géneros en inglés, solo si alguno se escribe distinto que en español. */
  genresEn?: string[];
  origin: string;
  /**
   * Formación o instrumento principal, tal como lo dice la bio ("Datos clave" de la ficha,
   * lib/artist-facts.ts). Obligatorio: un artista nuevo no compila sin él.
   */
  role: { es: string; en: string };
  bio: { es: string; en: string };
  links: ArtistLink[];
  /**
   * Identificadores en bases de datos públicas (MusicBrainz, Wikidata) que van al `sameAs`
   * del JSON-LD junto con `links` (artistSameAs) y no se muestran en la ficha. Solo
   * coincidencias inequívocas: mismo nombre, país y género o miembros, con la evidencia en
   * el reporte del carril N (p19). Si hay duda, no se agrega.
   */
  sameAs?: string[];
  /**
   * Solo lanzamientos SIN ficha en lib/releases.ts (singles de otros sellos, discos
   * en producción…). Lo que ya tiene ficha no se repite aquí: la discografía de la
   * ficha de artista y del press kit sale de getArtistEntries (lib/catalog.ts).
   */
  releases?: Release[];
  stats?: {
    spotifyFollowers?: number;
    monthlyListeners?: number;
    youtubeSubs?: number;
  };
};

/** La entrada tal cual, sin el campo `order` de content/ (solo sirve para ordenar). */
function withoutOrder<T extends { order: number }>(e: T): Omit<T, "order"> {
  const c: Partial<T> = { ...e };
  delete c.order;
  return c as Omit<T, "order">;
}

/** El roster, en el orden de `order` de content/artists/*.json (la secuencia que exige test:roster). */
export const artists: Artist[] = (artistEntries as (Artist & { order: number })[])
  .slice()
  .sort((a, b) => a.order - b.order)
  .map(withoutOrder);

export const artistSlugs = artists.map((a) => a.slug);

/** Géneros en el idioma de la página (los de `genres` sirven para los dos si no hay `genresEn`). */
export function artistGenres(artist: Pick<Artist, "genres" | "genresEn">, lang: string): string[] {
  return lang === "en" && artist.genresEn ? artist.genresEn : artist.genres;
}

export function getArtist(slug: string): Artist | undefined {
  return artists.find((a) => a.slug === slug);
}

/** `sameAs` del JSON-LD del artista: `links` + `sameAs`, sin duplicados. */
export function artistSameAs(artist: Pick<Artist, "links" | "sameAs">): string[] {
  return [...new Set([...artist.links.map((l) => l.href), ...(artist.sameAs ?? [])])];
}
