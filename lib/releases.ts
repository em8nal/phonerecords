// Standalone data for /catalogo and /releases/[slug] pages.
// Each release has its own slug for SEO-rich individual pages.
// Datos: un archivo por ficha en content/releases/<slug>.json (esquema en content/README.md), que
// llegan por el índice generado content/generated/releases.ts (pnpm content:index).
// Fuentes de los datos: informacion.md, Bandcamp y las listas de créditos.
import { releaseEntries } from "../content/generated/releases";

export type ReleaseCredit = { role: string; name: string };

export type Track = {
  n: number;
  title: string;
  duration?: string; // mm:ss
  composer?: string;
  guests?: string[];
};

export type Release = {
  slug: string;
  title: string;
  artistSlug: string;
  artistName: string;
  releaseDate: string; // ISO yyyy-mm-dd, yyyy-mm or yyyy (fecha parcial si no se conoce el día)
  year: number;
  type: "album" | "ep" | "single" | "live" | "mixtape" | "compilation";
  format: string; // human-readable (e.g. "LP · vinilo + digital")
  label?: string;
  description: { es: string; en: string };
  tracklist?: Track[];
  credits?: ReleaseCredit[];
  /** `label` en español o nombre de plataforma; /en la traduce con releaseLinkLabel (LINK_LABEL_EN). */
  links?: { label: string; href: string }[];
  cover?: string;
  /** Co-credited roster artists; release appears under their filter too. */
  featuredArtistSlugs?: string[];
  /** Pre-save / listen smart link (e.g. ONErpm). Drives the primary button on the release page. */
  smartLink?: string;
  // Sin campo `video`: el video de la ficha sale de lib/videos.ts (releaseVideo, 16c).
};

/** La entrada tal cual, sin el campo `order` de content/ (solo sirve para ordenar). */
function withoutOrder<T extends { order: number }>(e: T): Omit<T, "order"> {
  const c: Partial<T> = { ...e };
  delete c.order;
  return c as Omit<T, "order">;
}

/**
 * Fichas en el orden de `order` de content/releases/*.json. La posición importa: el sitemap las
 * recorre así y los sorts por fecha (catálogo, getReleasesByArtist, "Aparece en") desempatan por ella.
 */
export const releases: Release[] = (releaseEntries as (Release & { order: number })[])
  .slice()
  .sort((a, b) => a.order - b.order)
  .map(withoutOrder);

export const releaseSlugs = releases.map((r) => r.slug);

export function getRelease(slug: string): Release | undefined {
  return releases.find((r) => r.slug === slug);
}

export function getReleasesByArtist(artistSlug: string): Release[] {
  return releases
    .filter((r) => r.artistSlug === artistSlug)
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
}

export function getAllReleasesSorted(): Release[] {
  return [...releases].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
}

/** Recurso de Spotify que la ficha de lanzamiento puede embeber. */
export type SpotifyRef = { kind: "album" | "track" | "playlist"; id: string };

const SPOTIFY_REF_RE =
  /open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(album|track|playlist)\/([A-Za-z0-9]{22})(?![A-Za-z0-9])/;

/**
 * Primer enlace de `links` que apunta a un álbum, una canción o una lista de
 * Spotify (los perfiles /artist/ no cuentan). Vive en lib y no en
 * components/spotify-embed.tsx porque un server component no puede llamar
 * funciones de un módulo "use client".
 */
export function spotifyRefFromLinks(links?: { href: string }[]): SpotifyRef | null {
  for (const l of links ?? []) {
    const m = SPOTIFY_REF_RE.exec(l.href);
    if (m) return { kind: m[1] as SpotifyRef["kind"], id: m[2] };
  }
  return null;
}

/**
 * Etiquetas de `links` escritas en español que cambian en /en. Las demás son nombres de
 * plataforma ("Spotify", "Apple Music", "Qobuz (hi-res)"…) y se muestran igual en ambos idiomas.
 * "Todas las plataformas" nombra el smart link por su destino, no por una acción: "Pre-save" es
 * falso después del estreno y "Escuchar", antes. `pnpm test:releases` exige que cada etiqueta sea
 * una clave de este mapa o un nombre de plataforma conocido.
 */
export const LINK_LABEL_EN: Record<string, string> = {
  "Todas las plataformas": "All platforms",
  "Spotify (artista)": "Spotify (artist)",
};

/** Etiqueta de un enlace de la ficha en el idioma de la página. */
export function releaseLinkLabel(label: string, lang: string): string {
  if (lang === "es") return label;
  return Object.hasOwn(LINK_LABEL_EN, label) ? LINK_LABEL_EN[label] : label;
}

/** Nombre del sello tal como aparece en `label` cuando PHŌNÉ edita el lanzamiento. */
export const PHONE_LABEL = "PHŌNÉ Records";

/** True cuando el lanzamiento lo edita PHŌNÉ (`label === PHONE_LABEL`), no solo lo distribuye. */
export function isPhoneRelease(r: Pick<Release, "label">): boolean {
  return r.label === PHONE_LABEL;
}

/**
 * Sufijo que agrega la plantilla de título de lib/site-metadata.ts (`'%s — PHŌNÉ Records'`).
 * `pnpm test:releases` comprueba que ambos coincidan.
 */
export const TITLE_SUFFIX = " — PHŌNÉ Records";

/** Tope de caracteres del <title> de una ficha de lanzamiento. */
export const MAX_TITLE_LENGTH = 60;

const FEAT_RE = /\s+(?:feat\.|ft\.|featuring)\s.*$/i;

/**
 * Título de la ficha de lanzamiento, de ≤ 60 caracteres con el sufijo del sitio.
 * Con `full = "título — artista"`: si `full` + sufijo cabe, se usa la plantilla
 * (`absolute: false`). Si no, el primero que quepa SIN sufijo (`absolute: true`) entre
 * `full`, "título — artista" sin el " feat. …" del artista, y el título solo. Último
 * recurso: el título cortado a 59 caracteres + "…".
 */
export function releaseTitle(
  r: Pick<Release, "title" | "artistName">,
): { text: string; absolute: boolean } {
  const full = `${r.title} — ${r.artistName}`;
  if (full.length + TITLE_SUFFIX.length <= MAX_TITLE_LENGTH) return { text: full, absolute: false };
  const candidates = [full, `${r.title} — ${r.artistName.replace(FEAT_RE, "")}`, r.title];
  const fit = candidates.find((c) => c.length <= MAX_TITLE_LENGTH);
  if (fit) return { text: fit, absolute: true };
  return { text: `${r.title.slice(0, MAX_TITLE_LENGTH - 1).trimEnd()}…`, absolute: true };
}
