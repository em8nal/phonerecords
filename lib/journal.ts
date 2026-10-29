// Journal (M11, carril R del p19): piezas editoriales del sello.
//
// Arriba, los tipos y los datos; abajo, los helpers. Los datos son serializables (texto, números
// y arreglos, sin funciones ni fechas) y viven en content/journal/<slug>.json (esquema en
// content/README.md; carril S). Imports relativos: app/sitemap.ts y scripts/test-journal.mjs
// cargan este módulo desde Node, sin el alias @/.
//
// Publicación: `publishAt` es un ISO con hora y el offset de Santiago ("2026-11-10T10:00:00-03:00";
// -03:00 de septiembre a abril, -04:00 de abril a septiembre). La pieza aparece sola a esa hora:
// las rutas son ISR de 300 s y el sitemap la suma en el acto. No se usa isReleased
// (lib/release-date.ts): solo entiende YYYY[-MM[-DD]] y devuelve true con cualquier otro texto, así
// que publicaría en el acto una pieza con hora. publishMs falla cerrado: un publishAt que no calza
// con el formato, o que no es una fecha y hora reales, deja la pieza sin publicar.
// `pnpm test:journal` (scripts/test-journal.mjs) valida el esquema, los offsets contra
// America/Santiago, las imágenes en public/journal/<slug>/ y las relaciones con artistas y fichas.
import { LABEL_NAME, ORG_ID, SITE, WEBSITE_ID, absUrl, artistId, releaseId, toLang } from "./schema";
import { formatReleaseLabel } from "./release-date";
import { getArtist } from "./artists";
import { getRelease } from "./releases";
import { videos } from "./videos";
import { journalEntries } from "../content/generated/journal";

export type Localized = { es: string; en: string };

/** Formatos de pieza. Las etiquetas van en español en los dos idiomas, como nombres propios. */
export const JOURNAL_FORMATS = ["cronica", "track-by-track", "entrevista", "archivo", "detras-del-disco"] as const;
export type JournalFormat = (typeof JOURNAL_FORMATS)[number];
export const JOURNAL_FORMAT_LABEL: Record<JournalFormat, string> = {
  cronica: "Crónica",
  "track-by-track": "Track by track",
  entrevista: "Entrevista",
  archivo: "Archivo",
  "detras-del-disco": "Detrás del disco",
};

export type JournalImage = {
  /** Archivo local en public/journal/<slug>/ (src "/journal/<slug>/<archivo>.jpg"). */
  src: string;
  width: number;
  height: number;
  /** Crédito de la foto, obligatorio ("Foto: …"). */
  credit: string;
};

/** Recorte 4:5 de la portada para el hero en móvil: mismo alt y crédito que la portada 16:9. */
export type JournalImageCrop = { src: string; width: number; height: number };

export const JOURNAL_BLOCK_TYPES = ["paragraph", "heading", "quote", "image", "video", "release"] as const;

/** Bloques del cuerpo. `heading` (h2) no estaba en el brief: lo necesita el track-by-track. */
export type JournalBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | ({ type: "image"; alt: string; caption?: string } & JournalImage)
  /**
   * Video de YouTube por id (11 caracteres), con la facade del sitio. `thumb: "hqdefault"` cuando
   * la subida no tiene maxresdefault (curl -I); si el video está en lib/videos.ts, vale su `thumb`.
   */
  | { type: "video"; youtubeId: string; title: string; thumb?: "hqdefault" }
  /** Tarjeta de un lanzamiento de lib/releases.ts por slug. */
  | { type: "release"; slug: string };

/** ISO con hora y offset de Santiago: "2026-11-10T10:00:00-03:00". */
export type SantiagoIso = `${string}T${string}-0${3 | 4}:00`;

export type JournalPiece = {
  /** Kebab-case, el mismo en ES y EN. */
  slug: string;
  /** ≤ 60 caracteres. */
  title: Localized;
  /** Bajada: 140–160 caracteres ideal, 200 como máximo. Es la meta description. */
  excerpt: Localized;
  body: { es: JournalBlock[]; en: JournalBlock[] };
  publishAt: SantiagoIso;
  /** Firma tal cual se muestra; "PHŌNÉ Records" firma como el sello (JSON-LD con ORG_ID). */
  author: string;
  /** Slugs de lib/artists.ts (al menos uno). */
  artists: string[];
  /** Slugs de lib/releases.ts. */
  releases: string[];
  /**
   * Portada 16:9 (1920×1080 o más). `position`: clases object-position de Tailwind para el hero
   * (solo `object-[X%_Y%]`, con `md:`/`lg:` opcional; Tailwind 4 las encuentra en lib/ y content/).
   * `mobile`: recorte 4:5 opcional (1200×1500 o más) para el hero en móvil; sin él, el hueco 4:5 de
   * PageHero recorta la 16:9 por los lados.
   */
  cover: JournalImage & { alt: Localized; position?: string; mobile?: JournalImageCrop };
  format: JournalFormat;
};

// ─────────── Datos ───────────
// Un archivo por pieza en content/journal/<slug>.json, por el índice generado
// content/generated/journal.ts (pnpm content:index). Hoy vacío a propósito: no se inventan piezas.
// Copia mutable y sin Object.freeze: test:journal agrega fixtures y las quita en un finally. El
// ejemplo de pieza vive en el reporte del carril R, no aquí.
export const journalPieces: JournalPiece[] = (journalEntries as JournalPiece[]).slice();

// ─────────── Helpers ───────────

const PUBLISH_AT_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?-0([34]):00$/;

/**
 * Instante de publicación (ms UTC) o null. Exige el formato con offset -03:00 o -04:00 y una
 * fecha y hora reales: el instante, llevado de vuelta a la hora local de ese offset, tiene que
 * dar el mismo texto (así "2026-02-31T10:00-03:00" o "25:00" no publican nunca).
 */
export function publishMs(p: { publishAt: string }): number | null {
  const raw = p.publishAt;
  const m = typeof raw === "string" ? PUBLISH_AT_RE.exec(raw) : null;
  if (!m) return null;
  const ms = Date.parse(raw);
  if (!Number.isFinite(ms)) return null;
  const local = new Date(ms - Number(m[7]) * 3_600_000).toISOString(); // YYYY-MM-DDTHH:MM:SS.sssZ
  if (local.slice(0, 16) !== raw.slice(0, 16)) return null;
  if (m[6] !== undefined && local.slice(17, 19) !== m[6]) return null;
  return ms;
}

/** true desde el instante de `publishAt`; false antes y con un `publishAt` inválido. */
export function isPublished(p: { publishAt: string }, now: number = Date.now()): boolean {
  const ms = publishMs(p);
  return ms !== null && now >= ms;
}

/** Piezas ya publicadas, de la más reciente a la más antigua. */
export function getPublishedPieces(now: number = Date.now()): JournalPiece[] {
  return journalPieces
    .filter((p) => isPublished(p, now))
    .sort((a, b) => (publishMs(b) ?? 0) - (publishMs(a) ?? 0));
}

/** La pieza si existe y ya se publicó; undefined si no (la ruta responde 404). */
export function getPublishedPiece(slug: string, now: number = Date.now()): JournalPiece | undefined {
  return journalPieces.find((p) => p.slug === slug && isPublished(p, now));
}

/** Día de publicación en Santiago (YYYY-MM-DD): el texto antes de la "T", porque el offset es el de Santiago. */
export const publishedDay = (p: { publishAt: string }): string => p.publishAt.slice(0, 10);

/** "10 de noviembre de 2026" / "November 10, 2026" (misma voz que la fecha de las fichas). */
export function formatPublishDate(p: { publishAt: string }, lang: string): string {
  const day = publishedDay(p);
  const label = formatReleaseLabel(day, lang);
  const year = day.slice(0, 4);
  return lang === "es" ? `${label} de ${year}` : `${label}, ${year}`;
}

/**
 * Miniatura inicial de un bloque de video: la del bloque, la de lib/videos.ts si el video está en
 * el catálogo, o maxresdefault. Así una subida sin maxres no pide primero una imagen que da 404.
 */
export function journalVideoThumb(b: { youtubeId: string; thumb?: "hqdefault" }): "maxresdefault" | "hqdefault" {
  return b.thumb ?? videos.find((v) => v.youtubeId === b.youtubeId)?.thumb ?? "maxresdefault";
}

/** URL absoluta de la pieza en un idioma. */
export const journalPieceUrl = (slug: string, lang: string): string => `${SITE}/${toLang(lang)}/journal/${slug}`;

/** Textos visibles de un bloque (para la guardia TEMPORAL y el conteo de palabras). */
function blockTexts(b: JournalBlock): string[] {
  switch (b.type) {
    case "paragraph":
    case "heading":
      return [b.text];
    case "quote":
      return b.cite ? [b.text, b.cite] : [b.text];
    case "image":
      return b.caption ? [b.caption] : [];
    default:
      return [];
  }
}

/**
 * Campos de texto de la pieza en ES y EN: título, bajada, párrafos, subtítulos, citas (con su
 * `cite`) y pies de foto. Lo recorre la guardia TEMPORAL de scripts/test-releases.mjs.
 */
export function journalTextFields(p: JournalPiece): { field: string; text: string }[] {
  return (["es", "en"] as const).flatMap((l) => [
    { field: `title.${l}`, text: p.title[l] },
    { field: `excerpt.${l}`, text: p.excerpt[l] },
    ...p.body[l].flatMap((b, i) => blockTexts(b).map((text) => ({ field: `body.${l}[${i}].${b.type}`, text }))),
  ]);
}

/** Palabras del cuerpo en un idioma (párrafos, subtítulos y citas; sin pies de foto). */
export function journalWordCount(p: JournalPiece, lang: string): number {
  const l = toLang(lang);
  return p.body[l]
    .filter((b) => b.type === "paragraph" || b.type === "heading" || b.type === "quote")
    .flatMap((b) => blockTexts(b).slice(0, 1))
    .reduce((n, text) => n + text.trim().split(/\s+/).filter(Boolean).length, 0);
}

const IN_LANGUAGE = { es: "es-CL", en: "en-US" } as const;
const LOGO = `${SITE}/brand/phone-logotipo.png`;

/** Firma del sello → la organización (ORG_ID); cualquier otra → Person. */
function authorLd(author: string) {
  return author.trim() === LABEL_NAME
    ? { "@type": "Organization", "@id": ORG_ID, name: LABEL_NAME }
    : { "@type": "Person", name: author.trim() };
}

/**
 * JSON-LD de la pieza: BlogPosting (`@id` = URL del idioma + "#article", fechas desde publishAt,
 * autor, publisher = ORG_ID, `about` = artistId de sus artistas, `mentions` = releaseId de sus
 * lanzamientos) y BreadcrumbList Inicio → Journal → título.
 */
export function journalArticleJsonLd(p: JournalPiece, lang: string) {
  const l = toLang(lang);
  const isEs = l === "es";
  const url = journalPieceUrl(p.slug, l);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: IN_LANGUAGE[l],
        headline: p.title[l],
        description: p.excerpt[l],
        image: [absUrl(p.cover.src)],
        datePublished: p.publishAt,
        dateModified: p.publishAt,
        author: authorLd(p.author),
        publisher: {
          "@type": "Organization",
          "@id": ORG_ID,
          name: LABEL_NAME,
          logo: { "@type": "ImageObject", url: LOGO },
        },
        articleSection: JOURNAL_FORMAT_LABEL[p.format],
        about: p.artists.map((slug) => {
          const name = getArtist(slug)?.name;
          return { "@type": "MusicGroup", "@id": artistId(slug), ...(name ? { name } : {}) };
        }),
        mentions: p.releases.map((slug) => {
          const name = getRelease(slug)?.title;
          return { "@type": "MusicAlbum", "@id": releaseId(slug), ...(name ? { name } : {}) };
        }),
        wordCount: journalWordCount(p, l),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: isEs ? "Inicio" : "Home", item: `${SITE}/${l}` },
          { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE}/${l}/journal` },
          { "@type": "ListItem", position: 3, name: p.title[l], item: url },
        ],
      },
    ],
  };
}

/**
 * JSON-LD del índice: CollectionPage + ItemList de BlogPosting solo si hay piezas publicadas;
 * sin piezas, solo la miga Inicio → Journal (la página lleva noindex).
 */
export function journalIndexJsonLd(lang: string, pieces: readonly JournalPiece[]) {
  const l = toLang(lang);
  const isEs = l === "es";
  const url = `${SITE}/${l}/journal`;
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: isEs ? "Inicio" : "Home", item: `${SITE}/${l}` },
      { "@type": "ListItem", position: 2, name: "Journal", item: url },
    ],
  };
  if (pieces.length === 0) return { "@context": "https://schema.org", "@graph": [breadcrumb] };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": url,
        url,
        name: "Journal",
        inLanguage: IN_LANGUAGE[l],
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORG_ID },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: pieces.length,
          itemListElement: pieces.map((p, i) => {
            const pieceUrl = journalPieceUrl(p.slug, l);
            return {
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "BlogPosting",
                "@id": `${pieceUrl}#article`,
                url: pieceUrl,
                headline: p.title[l],
                datePublished: p.publishAt,
                image: [absUrl(p.cover.src)],
              },
            };
          }),
        },
      },
      breadcrumb,
    ],
  };
}
