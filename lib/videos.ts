// Catálogo de videos del roster para /videos, /videos/[slug] y la sección
// "Videos" de cada ficha de artista. Módulo puro (sin React ni next): lo
// cargan server components, el sitemap y `pnpm test:videos` con Node
// (type-stripping: sin enum, con `import type`).
//
// Fuente de cada entrada: metadatos de yt-dlp (título oficial, upload_date,
// duración) + descripción oficial del video + fichas de lib/releases.ts y bios
// de lib/artists.ts. Los textos `description` son propios (no la descripción
// de YouTube) y solo afirman lo que consta en esas fuentes: pieza, tema, disco,
// participantes, lugar y fecha. `date` es la fecha de publicación en YouTube;
// las grabaciones anteriores se aclaran en el texto. Un video con fecha futura
// no aparece hasta las 00:00 America/Santiago de ese día (isReleased).
//
// Datos: un archivo por video en content/videos/<slug>.json (esquema en content/README.md), que
// llegan por el índice generado content/generated/videos.ts (pnpm content:index). El orden de los
// archivos no importa: `videos` se ordena abajo por fecha y título.

import type { Language } from "./translations";
import { formatReleaseLabel, isReleased } from "./release-date";
import { TITLE_MAX, templatedTitle, titleLength } from "./seo";
import { videoEntries } from "../content/generated/videos";

export type VideoKind =
  | "videoclip"
  | "sesion"
  | "en-vivo"
  | "lyric"
  | "visualizer"
  | "documental"
  | "entrevista";

export type VideoCredit = { role: string; name: string };

export type Video = {
  slug: string;
  /** Id de YouTube (11 caracteres). */
  youtubeId: string;
  /** Título oficial del video, tal como está en YouTube. */
  title: string;
  /**
   * Título limpio para tarjetas, h1, alt y facade (16a). Sin el artista de la entrada,
   * sin etiquetas ("Video Oficial", "Visualizer", "Prod by"…) ni mayúsculas sostenidas;
   * nombres como en `description`. Objeto solo si cambia por idioma ("con"/"with").
   * El oficial (`title`) sigue en el `name` del VideoObject y en el <title> si cabe.
   */
  displayTitle?: string | { es: string; en: string };
  /** Debe existir en lib/artists.ts. Dúo Gestosimple & Klaus B → "klaus-b". */
  artistSlug: string;
  artistName: string;
  kind: VideoKind;
  /** "YYYY-MM-DD" (fecha de publicación en YouTube); "YYYY-MM" solo tolerado. */
  date: string;
  /**
   * Año de grabación cuando consta en el título o la descripción oficial y
   * difiere del de publicación (p. ej. "Live in Paris, 2015" subido en 2025).
   * Lo usan los pies "tipo · año" de tarjetas y sección; `date` sigue siendo
   * la fecha de publicación (uploadDate).
   */
  recordedYear?: number;
  durationSec?: number;
  /** Slug de lib/releases.ts cuando el video corresponde a una ficha del catálogo. */
  releaseSlug?: string;
  /** Texto propio ES/EN, 80–160 palabras, párrafos separados por "\n\n". */
  description: { es: string; en: string };
  /** Solo créditos que constan en la descripción oficial o en la ficha. */
  credits?: VideoCredit[];
  /** Va primero en la sección de la ficha de artista (máx. 6 por artista). */
  featured?: boolean;
  /**
   * Mejor miniatura disponible en i.ytimg.com cuando NO existe `maxresdefault`
   * (subidas antiguas o de baja resolución; verificado con `curl -I`). La usan
   * OG, JSON-LD y el preload de la ficha; las facades caen a hq solas en cliente.
   */
  thumb?: "hqdefault";
};

/** Orden de los chips de tipo en /videos. */
export const VIDEO_KINDS: readonly VideoKind[] = [
  "videoclip",
  "sesion",
  "en-vivo",
  "lyric",
  "visualizer",
  "documental",
  "entrevista",
];

export const VIDEO_KIND_LABEL: Record<Language, Record<VideoKind, string>> = {
  es: {
    videoclip: "Videoclip",
    sesion: "Sesión",
    "en-vivo": "En vivo",
    lyric: "Lyric video",
    visualizer: "Visualizer",
    documental: "Documental",
    entrevista: "Entrevista",
  },
  en: {
    videoclip: "Music video",
    sesion: "Session",
    "en-vivo": "Live",
    lyric: "Lyric video",
    visualizer: "Visualizer",
    documental: "Documentary",
    entrevista: "Interview",
  },
};

const RAW: Video[] = videoEntries as Video[];

/** Catálogo ordenado: fecha de publicación desc, luego título. */
export const videos: Video[] = [...RAW].sort(
  (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
);

export const videoSlugs = videos.map((v) => v.slug);

export function getVideo(slug: string): Video | undefined {
  return videos.find((v) => v.slug === slug);
}

/** Título visible (tarjetas, h1, alt, facade): `displayTitle` del idioma o, si falta, el oficial. */
export function videoDisplayTitle(v: Pick<Video, "title" | "displayTitle">, lang: Language): string {
  const d = v.displayTitle;
  if (!d) return v.title;
  return typeof d === "string" ? d : d[lang];
}

/** El título más el artista si no lo nombra ya (minúsculas, sin plegar tildes). */
export function withArtist(title: string, artistName: string): string {
  return title.toLowerCase().includes(artistName.toLowerCase()) ? title : `${title} — ${artistName}`;
}

/**
 * <title> de la ficha de video, ≤ TITLE_MAX contando la plantilla del layout. Primera
 * opción que cabe: 1) oficial (+ artista) con plantilla; 2) visible + artista con
 * plantilla; 3) visible + artista sin plantilla; 4) visible con plantilla; 5) visible
 * sin plantilla. El oficial solo queda si cabe; si no, el artista gana a la marca.
 * `absolute: true` = va sin plantilla ({ absolute } en Metadata).
 */
export function videoMetaTitle(
  v: Pick<Video, "title" | "displayTitle" | "artistName">,
  lang: Language,
): { title: string; absolute: boolean } {
  const display = videoDisplayTitle(v, lang);
  const options: { title: string; absolute: boolean }[] = [
    { title: withArtist(v.title, v.artistName), absolute: false },
    { title: withArtist(display, v.artistName), absolute: false },
    { title: withArtist(display, v.artistName), absolute: true },
    { title: display, absolute: false },
    { title: display, absolute: true },
  ];
  const fits = (o: { title: string; absolute: boolean }) =>
    titleLength(o.absolute ? o.title : templatedTitle(o.title)) <= TITLE_MAX;
  return options.find(fits) ?? options[options.length - 1];
}

/**
 * Lo que una tarjeta de video necesita, con `title` ya resuelto al visible del idioma.
 * /videos pasa esta forma reducida a su grilla cliente: los textos largos ES/EN no
 * viajan en el payload RSC. Vive aquí (no en video-card.tsx, que entra al bundle del
 * navegador por la grilla) para que ese archivo solo importe tipos de este módulo.
 */
export type VideoCardData = Pick<
  Video,
  "slug" | "youtubeId" | "title" | "artistSlug" | "artistName" | "kind" | "date" | "recordedYear" | "thumb"
>;

export function toVideoCardData(v: Video, lang: Language): VideoCardData {
  return {
    slug: v.slug,
    youtubeId: v.youtubeId,
    title: videoDisplayTitle(v, lang),
    artistSlug: v.artistSlug,
    artistName: v.artistName,
    kind: v.kind,
    date: v.date,
    recordedYear: v.recordedYear,
    thumb: v.thumb,
  };
}

export function getVideosByArtist(artistSlug: string): Video[] {
  return videos.filter((v) => v.artistSlug === artistSlug);
}

/** Solo videos cuya fecha ya llegó (00:00 America/Santiago); se evalúa por petición. */
export function getPublishedVideos(nowMs: number = Date.now()): Video[] {
  return videos.filter((v) => isReleased(v.date, nowMs));
}

/** Prioridad de tipo para el video de una ficha de lanzamiento (menor gana). */
const RELEASE_VIDEO_RANK: Record<VideoKind, number> = {
  videoclip: 0,
  lyric: 1,
  visualizer: 2,
  sesion: 3,
  "en-vivo": 4,
  documental: 5,
  entrevista: 6,
};

/**
 * Video principal de la ficha de lanzamiento `releaseSlug` (16c): entre los videos ya
 * publicados (isReleased, 00:00 America/Santiago) con ese `releaseSlug`, gana el tipo
 * (videoclip > lyric > visualizer > sesión > en vivo > documental > entrevista); a igual
 * tipo, `featured`; luego la fecha más reciente; al final el slug (determinista).
 * Sin override manual: un videoclip nuevo cargado aquí aparece solo en su ficha.
 */
export function releaseVideo(
  releaseSlug: string,
  nowMs: number = Date.now(),
  list: readonly Video[] = videos,
): Video | undefined {
  return list
    .filter((v) => v.releaseSlug === releaseSlug && isReleased(v.date, nowMs))
    .sort(
      (a, b) =>
        RELEASE_VIDEO_RANK[a.kind] - RELEASE_VIDEO_RANK[b.kind] ||
        Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
        b.date.localeCompare(a.date) ||
        a.slug.localeCompare(b.slug),
    )[0];
}

/** Videos de un artista para su ficha: publicados, destacados primero, hasta `limit`. */
export function pickArtistVideos(artistSlug: string, limit = 6, nowMs: number = Date.now()): Video[] {
  const mine = getPublishedVideos(nowMs).filter((v) => v.artistSlug === artistSlug);
  return [...mine.filter((v) => v.featured), ...mine.filter((v) => !v.featured)].slice(0, limit);
}

export function youtubeThumb(id: string, q: "maxresdefault" | "hqdefault" = "maxresdefault"): string {
  return `https://i.ytimg.com/vi/${id}/${q}.jpg`;
}

/** Mejor miniatura existente del video: maxres salvo que `thumb` diga que no la hay. */
export function videoThumb(v: Pick<Video, "youtubeId" | "thumb">): string {
  return youtubeThumb(v.youtubeId, v.thumb ?? "maxresdefault");
}

/** Miniaturas existentes para `thumbnailUrl` de schema.org (maxres si existe, y hq). */
export function videoThumbs(v: Pick<Video, "youtubeId" | "thumb">): string[] {
  const hq = youtubeThumb(v.youtubeId, "hqdefault");
  return v.thumb ? [hq] : [youtubeThumb(v.youtubeId), hq];
}

/** Dimensiones reales de la miniatura para Open Graph: maxres 1280×720, hq 480×360. */
export function videoThumbSize(v: Pick<Video, "thumb">): { width: number; height: number } {
  return v.thumb ? { width: 480, height: 360 } : { width: 1280, height: 720 };
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/** "22 de octubre de 2026" / "October 22, 2026"; "YYYY-MM" → "octubre 2026" / "October 2026". */
export function formatVideoDate(date: string, lang: Language): string {
  const label = formatReleaseLabel(date, lang);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return label;
  const year = date.slice(0, 4);
  return lang === "es" ? `${label} de ${year}` : `${label}, ${year}`;
}

/** "4:29", "1:02:03". */
export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return `${h ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}

/** ISO 8601 para schema.org: "PT4M29S", "PT1H2M3S". */
export function isoDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s || (!h && !m) ? `${s}S` : ""}`;
}

/** Primer párrafo del texto propio, cortado en un espacio y con "…" (meta description). */
export function videoExcerpt(v: Video, lang: Language, max = 158): string {
  const first = v.description[lang].split(/\n{2,}/)[0].replace(/\s+/g, " ").trim();
  if (first.length <= max) return first;
  const cut = first.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-—]+$/, "") + "…";
}
