// Prueba de fichas, slugs y redirects: pnpm test:releases
//   (node --import ./scripts/ts-resolve-hook.mjs scripts/test-releases.mjs)
// Comprueba (FAIL):
//   todo artistSlug / featuredArtistSlugs de lib/releases.ts y todo /artistas/<x> de
//   BANNER_ENTRIES existe en lib/artists.ts; ningún .ts(x) de lib/ contiene un slug viejo
//   de LEGACY_ARTIST_SLUGS salvo lib/artist-slugs.ts (las claves se leen del módulo); los
//   destinos de los alias existen y no son a su vez slugs viejos; spotifyRefFromLinks lee
//   todo enlace de Spotify que no sea un perfil /artist/; ninguna descripción ES/EN de
//   lib/releases.ts o lib/videos.ts, bio de lib/artists.ts ni etiqueta de enlace contiene una
//   frase relativa al momento ("sale el", "saldrá el", "out Friday", "out November 20", "will be
//   released", "pre-save"…: lista TEMPORAL documentada abajo, con casos positivos y negativos);
//   cada etiqueta de enlace es una clave de LINK_LABEL_EN o un nombre de plataforma;
//   releaseTitle ≤ 60 caracteres con el sufijo de la plantilla de lib/site-metadata.ts;
//   getArtistEntries sin duplicados y ninguna entrada liviana de lib/artists.ts repite una
//   ficha; redirects de next.config.mjs: todos permanentes, las 5 formas por slug viejo y las
//   2 de claudio-solis, en un solo salto (probado con getPathMatch y compile de Next, como los
//   aplica el servidor); render estático (H2): no existe app/layout.tsx, ningún root layout ni
//   components/site-document.tsx importa next/headers, y la ficha de lanzamiento declara
//   `export const revalidate` entre 1 y 300 s (sin force-dynamic), porque corta el reproductor
//   y datePublished con isReleased().
// Avisos (WARN, no fallan): ficha ya publicada (isReleased de lib/release-date.ts) sin Spotify
//   reproducible (spotifyRefFromLinks nulo), con un aviso distinto si además falta Apple Music;
//   RELEASES_NOW=<ISO> simula la fecha; artista sin public/press-kits/<slug>-{es,en}.pdf.
// INFO: entradas de discografía por artista (ficha de artista = press kit).
// `fs` solo vive aquí: el sitio no lee archivos en tiempo de ejecución para esto.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  releases,
  spotifyRefFromLinks,
  releaseTitle,
  TITLE_SUFFIX,
  MAX_TITLE_LENGTH,
  LINK_LABEL_EN,
  releaseLinkLabel,
} from "../lib/releases.ts";
import { TITLE_TEMPLATE } from "../lib/seo.ts";
import { artists, LEGACY_ARTIST_SLUGS, resolveArtistSlug } from "../lib/artists.ts";
import { BANNER_ENTRIES } from "../lib/banner.ts";
import { getArtistEntries } from "../lib/catalog.ts";
import { videos } from "../lib/videos.ts";
import { isReleased } from "../lib/release-date.ts";
import nextConfig from "../next.config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { getPathMatch } = require("next/dist/shared/lib/router/utils/path-match");
const { compile } = require("next/dist/compiled/path-to-regexp");

let ok = true;
const report = (label, pass, detail) => {
  ok &&= pass;
  console.log(`${pass ? "OK  " : "FAIL"} ${label}${detail ? " -> " + detail : ""}`);
};
const warn = (label, detail) => console.log(`WARN ${label}${detail ? " -> " + detail : ""}`);
const info = (label, detail) => console.log(`INFO ${label}${detail ? " -> " + detail : ""}`);
const list = (arr) => (arr.length ? arr.join(", ") : "");

const artistSet = new Set(artists.map((a) => a.slug));
const legacy = Object.entries(LEGACY_ARTIST_SLUGS);

// --- Slugs de artista en fichas y banners -------------------------------------------------
const badPrimary = releases.filter((r) => !artistSet.has(r.artistSlug));
report("artistSlug de cada ficha existe en artists", badPrimary.length === 0, list(badPrimary.map((r) => `${r.slug}:${r.artistSlug}`)));
const badFeatured = releases.flatMap((r) => (r.featuredArtistSlugs ?? []).filter((s) => !artistSet.has(s)).map((s) => `${r.slug}:${s}`));
report("featuredArtistSlugs existen en artists", badFeatured.length === 0, list(badFeatured));

const bannerArtistHrefs = BANNER_ENTRIES.flatMap((b) =>
  [b.cta.href, b.secondaryHref]
    .map((h) => /^\/artistas\/([^/?#]+)/.exec(h)?.[1])
    .filter(Boolean)
    .map((s) => ({ banner: b.slug, slug: s })),
);
const badBanner = bannerArtistHrefs.filter((h) => !artistSet.has(h.slug));
report(
  `/artistas/<x> de BANNER_ENTRIES existe (${bannerArtistHrefs.length} enlaces)`,
  badBanner.length === 0,
  list(badBanner.map((h) => `${h.banner}:${h.slug}`)),
);

// --- Alias de slugs viejos ---------------------------------------------------------------
report(`LEGACY_ARTIST_SLUGS no vacío (${legacy.length})`, legacy.length > 0);
const liveKeys = legacy.filter(([from]) => artistSet.has(from));
report("ningún slug viejo sigue vivo en artists", liveKeys.length === 0, list(liveKeys.map(([f]) => f)));
const badTargets = legacy.filter(([, to]) => !artistSet.has(to) || to in LEGACY_ARTIST_SLUGS);
report("destinos de los alias existen y no son slugs viejos", badTargets.length === 0, list(badTargets.map(([f, t]) => `${f}→${t}`)));
const resolveOk =
  legacy.every(([from, to]) => resolveArtistSlug(from) === to) &&
  resolveArtistSlug("__proto__") === "__proto__" &&
  resolveArtistSlug("constructor") === "constructor" &&
  artists.every((a) => resolveArtistSlug(a.slug) === a.slug);
report("resolveArtistSlug: alias → destino; vivos y __proto__ pasan tal cual", resolveOk);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return /\.tsx?$/.test(d.name) ? [p] : [];
  });
}
const libFiles = walk(path.join(ROOT, "lib")).filter((f) => path.basename(f) !== "artist-slugs.ts");
const leaks = libFiles.flatMap((f) => {
  const text = readFileSync(f, "utf8").toLowerCase();
  return legacy.filter(([from]) => text.includes(from.toLowerCase())).map(([from]) => `${path.relative(ROOT, f)}:${from}`);
});
report(`ningún .ts(x) de lib/ (${libFiles.length}) contiene un slug viejo, salvo artist-slugs.ts`, leaks.length === 0, list(leaks));

// --- Spotify -----------------------------------------------------------------------------
const spotifyLinks = releases.flatMap((r) =>
  (r.links ?? []).filter((l) => /open\.spotify\.com\//.test(l.href) && !/\/artist\//.test(l.href)).map((l) => ({ slug: r.slug, href: l.href })),
);
const unread = spotifyLinks.filter((l) => !spotifyRefFromLinks([l]));
report(`spotifyRefFromLinks lee todo enlace de Spotify no-artista (${spotifyLinks.length})`, unread.length === 0, list(unread.map((l) => `${l.slug}:${l.href}`)));
const artistOnly = spotifyRefFromLinks([{ href: "https://open.spotify.com/artist/0PTJ848ulShbjTx2yqaAlb" }]);
report("spotifyRefFromLinks ignora perfiles /artist/", artistOnly === null);

// --- Frases relativas al momento ----------------------------------------------------------
// La ficha cambia sola a las 00:00 del estreno (CTA Pre-save → Escuchar, reproductor), pero los
// textos no: "sale el viernes 23" o "el pre-save ya está disponible" dejan de ser ciertos al día
// siguiente. Cada familia de TEMPORAL es un tipo de frase que caduca al pasar la fecha. Se aplica a
// description.es, description.en y links[].label de todas las fichas, a description.es y
// description.en de todos los videos de lib/videos.ts y a bio.es y bio.en de lib/artists.ts; una
// coincidencia es FAIL.
// Redacción neutra que pasa: "con fecha de lanzamiento el jueves 5 de noviembre de 2026" / "with a
// release date of Thursday, November 5, 2026"; si ya salió, el pasado vale para siempre: "publicado
// el viernes 23 de octubre de 2026" / "released on Friday, October 23, 2026"; 'el enlace de la
// sección "Escuchar" lleva a todas las plataformas', "Qobuz (hi-res)".
// - \b de JS solo reconoce ASCII: ninguna regex termina en una vocal con tilde seguida de \b.
// - Fuera a propósito: "próximo", "upcoming", "prepara" y "actualmente". Describen proyectos sin
//   fecha ("en viaje", 2027; "los próximos conciertos") que no caducan en un día conocido.
// - "llegará", "se lanzará", "se publicará" y "se estrenará" se exigen con tilde: sin ella son el
//   pretérito de subjuntivo ("un día después de que la canción llegara a plataformas el 22 de
//   octubre"), que narra algo ya pasado. "saldrá" y "estará" no tienen ese doble: van con o sin tilde.
// - "May" y "March" también son palabras comunes del inglés ("what they worked out may surprise"):
//   en MONTH_EN solo cuentan seguidas de un número ("out May 8").
// - Si una frase nueva calza sin ser temporal, agrégala a NEUTRAL y ajusta la familia; no la borres.
const DAY_ES = "(?:lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo)";
const DAY_EN = "(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)";
const MONTH_EN =
  "(?:January|February|March(?=\\s+\\d)|April|May(?=\\s+\\d)|June|July|August|September|October|November|December)";
const MONTH_EN_ANY = "(?:January|February|March|April|May|June|July|August|September|October|November|December)";
// Hasta 5 palabras sin puntuación entre el verbo y la fecha: "llega a plataformas digitales el 20 de",
// "estará disponible en todas las plataformas el 20 de", "hits streaming platforms on November 20".
const GAP = "(?:[^\\s.,;:()\"«»]+\\s+){0,5}?";
const FECHA_ES = `(?:(?:el|este)\\s+)?(?:pr[oó]ximo\\s+)?(?:${DAY_ES}|\\d{1,2}\\s+de\\b)`;
const FECHA_EN = `(?:on\\s+)?(?:(?:this|next)\\s+)?(?:${DAY_EN}|${MONTH_EN}|\\d{1,2}\\s+${MONTH_EN_ANY}\\b|tomorrow)`;
const TEMPORAL = [
  // Generalización de la re-revisión del 29-10: verbo de estreno + hueco corto + fecha, con
  // "el próximo", "verá la luz", "desde" y el formato inglés "30 October". "out" no lleva hueco:
  // con hueco calzaría "came out in June 2026" (videos de Rosario Lircay y Grietas).
  [
    "es-verbo-fecha",
    new RegExp(
      `\\b(?:saldr[aá]|llegará|sale|llega|se\\s+(?:lanza|lanzará|publica|publicará|estrena|estrenará)|estar[aá]\\s+disponible|ver[aá]\\s+la\\s+luz|disponible)\\s+${GAP}(?:desde\\s+|a\\s+partir\\s+del?\\s+)?${FECHA_ES}`,
      "i",
    ),
  ],
  [
    "en-verbo-fecha",
    new RegExp(
      `\\b(?:available|streaming|releases|arrives|arriving|drops|lands|hits)\\s+${GAP}${FECHA_EN}\\b|\\bout\\s+(?:on\\s+)?(?:\\d{1,2}\\s+${MONTH_EN_ANY}\\b|tomorrow\\b)`,
      "i",
    ),
  ],
  // Futuro o presente con fecha: "sale el viernes 23", "saldrá el viernes 20 de", "llegará a
  // plataformas el 20 de", "llega a todas las plataformas el viernes 30", "se lanza / se lanzará el
  // 20 de", "se publica el viernes", "estará disponible el 30 de".
  [
    "es-sale-llega",
    new RegExp(
      `\\b(?:saldr[aá]|llegará|sale|llega|se\\s+(?:lanza|lanzará|publica|publicará|estrena|estrenará)|estar[aá]\\s+disponible)` +
        `\\s+(?:(?:a\\s+(?:todas\\s+las\\s+)?plataformas|a\\s+la\\s+venta)\\s+)?(?:este\\s+|el\\s+)?(?:${DAY_ES}|\\d{1,2}\\s+de\\b)`,
      "i",
    ),
  ],
  // "disponible desde el viernes 30", "disponible a partir del 30 de octubre": promesa con fecha.
  ["es-disponible-desde", new RegExp(`\\bdisponible\\s+(?:desde|a\\s+partir\\s+del?)\\s+(?:el\\s+)?(?:${DAY_ES}|\\d{1,2}\\s+de\\b)`, "i")],
  // "pre-save" en cualquier idioma: el enlace sigue, pero después del estreno ya no es pre-save.
  ["pre-save", /\bpre-?saves?\b/i],
  // "puede reservarse", "reservarlo", "reserva ya", "(reserva · hi-res)" (Qobuz): solo valen antes de
  // la salida. El sustantivo suelto no cuenta ("Reserva Nacional Los Flamencos", "Gran Reserva").
  ["es-reserva", /\breserv(?:ar|arse|arl[oa]s?|able)\b|\(\s*reserva\b|\breserva\s*·|\breserva\s+(?:ya|ahora|tu|tus)\b/i],
  // "ya está disponible", "ya puede": afirma el estado de hoy.
  ["es-ya", /\bya\s+(?:est[aá]\s+)?disponible\b|\bya\s+(?:se\s+)?puede\b/i],
  // "desde la fecha de salida", "desde el estreno": promete algo que todavía no pasa.
  ["es-desde-salida", /\bdesde\s+(?:la\s+fecha\s+de\s+salida|el\s+estreno|el\s+d[ií]a\s+del?\s+(?:estreno|lanzamiento))\b/i],
  // "próximamente", "muy pronto", "acaba de salir", "recién lanzado".
  ["es-pronto", /\b(?:pr[oó]ximamente|muy\s+pronto|acaba\s+de\s+(?:salir|publicarse|lanzarse)|reci[eé]n\s+(?:salid|lanzad|publicad)[oa])\b/i],
  // "el nuevo single", "su nuevo álbum": deja de ser nuevo con el siguiente lanzamiento.
  ["es-nuevo", /\b(?:el|su)\s+nuev[oa]\s+(?:single|sencillo|[aá]lbum|EP|disco)\b/i],
  // "out Friday", "out on November 20", "out October 30", "out now", "out this Friday", "out next
  // week". "out this" y "out next" sueltos no bastan: "stands out next to", "carved out this".
  [
    "en-out",
    new RegExp(
      `\\bout\\s+(?:on\\s+)?(?:${DAY_EN}|${MONTH_EN})\\b|\\bout\\s+now\\b|\\bout\\s+(?:this|next)\\s+(?:${DAY_EN}|week|month)\\b`,
      "i",
    ),
  ],
  // "will be released", "will be out", "will be available": futuro del lanzamiento. "will be
  // published once the band confirms" (créditos) no depende de la fecha y no calza.
  ["en-will-be", /\bwill\s+be\s+(?:released|out|available)\b/i],
  // "available from October 30", "streaming on Friday": promesa con fecha.
  ["en-available-from", new RegExp(`\\b(?:available|streaming)\\s+(?:from|on)\\s+(?:${DAY_EN}|${MONTH_EN})\\b`, "i")],
  // "releases this Friday", "arrives on November 5", "drops next Friday", "lands October 30".
  [
    "en-releases-on",
    new RegExp(`\\b(?:releases|arrives|drops|lands)\\s+(?:on\\s+)?(?:this\\s+|next\\s+)?(?:${DAY_EN}|${MONTH_EN})\\b`, "i"),
  ],
  // "coming out on", "comes out", "coming soon".
  ["en-coming", /\b(?:coming|comes)\s+out\b|\bcoming\s+soon\b/i],
  // "pre-order", "can be pre-ordered".
  ["en-preorder", /\bpre-?order(?:s|ed|ing)?\b/i],
  // "can already", "is now available", "available now", "out now".
  ["en-already", /\b(?:can|may)\s+already\b|\bis\s+now\s+(?:available|out|live)\b|\b(?:available|out)\s+now\b/i],
  // "from release day", "on release day".
  ["en-release-day", /\b(?:from|on)\s+release\s+day\b/i],
  // "just released", "just dropped", "just out".
  ["en-just", /\bjust\s+(?:released|dropped|out)\b/i],
  // "the new single", "his new album".
  ["en-new", /\b(?:the|its|their|his|her)\s+new\s+(?:single|album|EP|record)\b/i],
];
/** Familias de TEMPORAL que calzan con `text`, con un extracto de cada coincidencia. */
function temporalHits(text) {
  return TEMPORAL.flatMap(([id, re]) => {
    const m = re.exec(text);
    if (!m) return [];
    const from = Math.max(0, m.index - 25);
    const to = Math.min(text.length, m.index + m[0].length + 25);
    return [{ id, excerpt: text.slice(from, to).replace(/\s+/g, " ").trim() }];
  });
}

// Frases que caducaron o iban a caducar (base 1c95229): la guardia tiene que detectarlas todas.
const KNOWN_BAD = [
  "su primer lanzamiento con PHŌNÉ Records: sale el viernes 23 de octubre de 2026 en todas las plataformas, con pre-save disponible desde esta ficha.",
  "and her first release with PHŌNÉ Records: out Friday, October 23, 2026 on all platforms, with pre-save available from this page.",
  '"La Fuerza" es el nuevo single de Newen Afrobeat y llega el viernes 30 de octubre de 2026, editado con PHŌNÉ Records.',
  "se publica como single digital; en Qobuz ya puede reservarse en alta resolución (24 bits / 48 kHz) y el streaming queda disponible desde la fecha de salida.",
  'El pre-save ya está disponible desde el enlace de la sección "Escuchar", donde también puede reservarse en Qobuz en alta resolución.',
  '"La Fuerza" ("The Force") is the new single by Newen Afrobeat, out Friday, October 30, 2026 on PHŌNÉ Records.',
  "is released as a digital single; on Qobuz it can already be pre-ordered in high resolution (24-bit / 48 kHz), with streaming available from release day.",
  'The pre-save is now available through the link in the "Listen" section, where it can also be pre-ordered on Qobuz in high resolution.',
  'Es el segundo adelanto de "Una Cuota De Caos", el álbum que se publica el viernes 20 de noviembre de 2026, y cuenta con videoclip oficial.',
  'It is the second single from "Una Cuota De Caos", the album coming out on Friday, November 20, 2026, and it has an official music video.',
  '"Destellos de ti" es el nuevo single de Klaus B, con fecha de lanzamiento el jueves 22 de octubre de 2026.',
  '"Destellos de ti" is the new single from Klaus B, with release date Thursday, October 22, 2026.',
  "Pre-save / Escuchar",
  "Qobuz (reserva · hi-res)",
  // Formas probables de la próxima ficha (Una Cuota De Caos, 20-11) que la primera versión dejaba
  // pasar: futuro, fecha con mes y sin nombre del día, "a (todas las) plataformas" en medio.
  "el álbum saldrá el viernes 20 de noviembre de 2026",
  "llegará a plataformas el 20 de noviembre",
  "se lanza el 20 de noviembre",
  "se lanzará el 20 de noviembre",
  "llega a todas las plataformas el viernes 30",
  "disponible a partir del 30 de octubre",
  "Reserva ya el vinilo en Qobuz.",
  "The album will be released on Friday, November 20, 2026.",
  "out on November 20",
  "out October 30 on all platforms",
  "out May 8",
  "available from October 30",
  "The single releases this Friday.",
  // Re-revisión del 29-10: con palabras entre el verbo y la fecha, "el próximo", "verá la luz" y "30 October".
  "El álbum sale el próximo viernes 20 de noviembre.",
  "El single llega el próximo 30 de octubre.",
  "estará disponible en todas las plataformas el 20 de noviembre",
  "llega a plataformas digitales el 20 de noviembre",
  "llegará a plataformas digitales el viernes 20",
  "disponible en todas las plataformas desde el 20 de noviembre",
  "verá la luz el 20 de noviembre",
  "the single, out 30 October on PHŌNÉ Records",
  "available from 30 October",
  "available on all platforms from November 20",
  "hits streaming platforms on November 20",
  "out tomorrow",
];
const missed = KNOWN_BAD.filter((s) => temporalHits(s).length === 0);
report(`TEMPORAL detecta las ${KNOWN_BAD.length} frases y etiquetas viejas o probables`, missed.length === 0, list(missed.map((s) => `«${s.slice(0, 60)}»`)));

// Frases neutras o ya corregidas: ninguna familia puede calzar (sin falsos positivos).
const NEUTRAL = [
  'dos semanas después, el jueves 5 de noviembre de 2026, llega el segundo single, "Un Rezo";',
  "es música de hoy, con la vista puesta en el futuro.",
  'El álbum llega después de "Viaje Sin Tiempo" (2024), disco hecho junto a Gestosimple',
  'el viernes 20 de noviembre de 2026, se publica el álbum completo, "Una Cuota De Caos".',
  "El single se publicó el 1 de octubre de 2026 y su videoclip oficial",
  "Newen Afrobeat is one of the most influential bands of the Latin American afrobeat scene.",
  'the full album, "Una Cuota De Caos", is released.',
  '"Destellos de ti" llega tres semanas después de "Cuántas veces"',
  'the video asks for whom and for what water is "reserved".',
  'It is the band\'s first new song since "Liverpool Session" (2025)',
  // Idiomáticos que no caducan, y falsos positivos de la primera versión de en-out y es-reserva.
  "Full composition, recording, mixing and mastering credits will be published once the band confirms them.",
  '"En Vela" was released on Friday, October 23, 2026.',
  "a horn line that stands out next to the drums",
  "the space the band has carved out this year",
  "What the band worked out may surprise longtime listeners.",
  "La portada evoca la Reserva Nacional Los Flamencos.",
  "un vino Gran Reserva",
  "un día después de que la canción llegara a plataformas el 22 de octubre de 2026",
];
// Textos actuales de los estrenos de 2026 (lib/releases.ts y lib/videos.ts, corrección del 29-10):
// tienen que existir tal cual en los datos (se comprueba abajo, con temporalFields) y pasar limpios.
const NEUTRAL_DATA = [
  'y su primer lanzamiento con PHŌNÉ Records, publicado el viernes 23 de octubre de 2026; el enlace de la sección "Escuchar" lleva a todas las plataformas.',
  'and her first release with PHŌNÉ Records, published on Friday, October 23, 2026; the link in the "Listen" section takes you to all platforms.',
  '"La Fuerza" es un single de Newen Afrobeat editado con PHŌNÉ Records, con fecha de lanzamiento el viernes 30 de octubre de 2026.',
  "El tema dura 4:44 y se publica como single digital, también en alta resolución (24 bits / 48 kHz) en Qobuz.",
  'El enlace de la sección "Escuchar" lleva a todas las plataformas.',
  '"La Fuerza" ("The Force") is a single by Newen Afrobeat on PHŌNÉ Records, with a release date of Friday, October 30, 2026.',
  "The track runs 4:44 and is released as a digital single, also in high resolution (24-bit / 48 kHz) on Qobuz.",
  'The link in the "Listen" section takes you to all platforms.',
  '"Un Rezo" es un single de Klaus B con fecha de lanzamiento el jueves 5 de noviembre de 2026, dos semanas después de "Destellos de ti".',
  'Es el segundo adelanto del álbum "Una Cuota De Caos" (viernes 20 de noviembre de 2026) y cuenta con videoclip oficial.',
  '"Un Rezo" is a single by Klaus B with a release date of Thursday, November 5, 2026, two weeks after "Destellos de ti".',
  'It is the second preview from the album "Una Cuota De Caos" (Friday, November 20, 2026), and it has an official music video.',
  '"Destellos de ti" es un single de Klaus B publicado el jueves 22 de octubre de 2026.',
  '"Destellos de ti" is a single by Klaus B, released on Thursday, October 22, 2026.',
  'el single con el que Klaus B abre el ciclo de "Una Cuota De Caos" (20 de noviembre de 2026), su álbum con PHŌNÉ Records.',
  'the single with which Klaus B opens the cycle of "Una Cuota De Caos" (November 20, 2026), his album with PHŌNÉ Records.',
  "Todas las plataformas",
  "Qobuz (hi-res)",
];
const neutralAll = [...NEUTRAL, ...NEUTRAL_DATA];
const falsePos = neutralAll.flatMap((s) => temporalHits(s).map((h) => `${h.id} «${h.excerpt}»`));
report(
  `TEMPORAL sin falsos positivos en ${neutralAll.length} frases neutras (${NEUTRAL_DATA.length} tomadas de los datos)`,
  falsePos.length === 0,
  list(falsePos),
);

const temporalFields = [
  ...releases.flatMap((r) => [
    { slug: r.slug, field: "es", text: r.description.es },
    { slug: r.slug, field: "en", text: r.description.en },
    ...(r.links ?? []).map((l) => ({ slug: r.slug, field: "label", text: l.label })),
  ]),
  ...videos.flatMap((v) => [
    { slug: `video:${v.slug}`, field: "es", text: v.description.es },
    { slug: `video:${v.slug}`, field: "en", text: v.description.en },
  ]),
  ...artists.flatMap((a) => [
    { slug: `artista:${a.slug}`, field: "bio.es", text: a.bio.es },
    { slug: `artista:${a.slug}`, field: "bio.en", text: a.bio.en },
  ]),
];
const temporalFound = temporalFields.flatMap((f) => temporalHits(f.text).map((h) => ({ ...f, ...h })));
report(
  `ninguna descripción (fichas, videos, bios) ni etiqueta de enlace con frases relativas al momento (${temporalFields.length} campos: ${releases.length} fichas, ${videos.length} videos, ${artists.length} bios; ${TEMPORAL.length} familias)`,
  temporalFound.length === 0,
  temporalFound.length ? `${temporalFound.length} coincidencias en ${new Set(temporalFound.map((h) => h.slug)).size} fichas, videos o bios` : "",
);
for (const h of temporalFound) console.log(`       ${h.slug} [${h.field}] ${h.id} «${h.excerpt}»`);
// NEUTRAL_DATA no puede quedar desfasada: si se reescribe un texto, la frase nueva va a la lista.
const flat = (t) => t.replace(/\s+/g, " ");
const notInData = NEUTRAL_DATA.filter((s) => !temporalFields.some((f) => flat(f.text).includes(s)));
report(
  `las ${NEUTRAL_DATA.length} frases de NEUTRAL_DATA existen tal cual en fichas, videos o etiquetas`,
  notInData.length === 0,
  list(notInData.map((s) => `«${s.slice(0, 60)}»`)),
);

// --- Journal (carril R, p19): la misma guardia TEMPORAL sobre las piezas ---------------------
// Título, bajada, párrafos, subtítulos, citas (con su cite) y pies de foto de lib/journal.ts en ES y
// EN (journalTextFields). Una coincidencia es FAIL, como en fichas, videos y bios. Import dinámico
// para no tocar la cabecera (la comparte el carril Q).
{
  const { journalPieces, journalTextFields } = await import("../lib/journal.ts");
  const journalFound = journalPieces.flatMap((p) =>
    journalTextFields(p).flatMap((f) => temporalHits(f.text).map((h) => ({ slug: `journal:${p.slug}`, field: f.field, ...h }))),
  );
  report(
    `ninguna pieza del journal con frases relativas al momento (${journalPieces.length} piezas)`,
    journalFound.length === 0,
    journalFound.length ? `${journalFound.length} coincidencias` : "",
  );
  for (const h of journalFound) console.log(`       ${h.slug} [${h.field}] ${h.id} «${h.excerpt}»`);
  // Fixture (no entra a los datos): una cita en ES y un párrafo en EN con fecha relativa.
  const fixture = {
    slug: "fixture-temporal",
    title: { es: "Pieza de prueba", en: "Test story" },
    excerpt: { es: "Bajada neutra de la pieza de prueba.", en: "Neutral standfirst of the test story." },
    body: {
      es: [
        { type: "paragraph", text: "Un párrafo neutro." },
        { type: "quote", text: "El disco sale el viernes 23 de octubre de 2026.", cite: "Klaus B" },
      ],
      en: [{ type: "paragraph", text: "The record is out Friday, October 23, 2026." }],
    },
  };
  const fixtureHits = journalTextFields(fixture).flatMap((f) => temporalHits(f.text).map((h) => `${f.field}:${h.id}`));
  report(
    "TEMPORAL detecta en el journal una cita ES y un párrafo EN con fecha (fixture, ≥ 2 coincidencias)",
    fixtureHits.length >= 2 &&
      fixtureHits.some((h) => h.startsWith("body.es[1].quote:")) &&
      fixtureHits.some((h) => h.startsWith("body.en[0].paragraph:")) &&
      !fixtureHits.some((h) => /^(title|excerpt)\./.test(h) || h.startsWith("body.es[0]")),
    list(fixtureHits),
  );
}

// --- Etiquetas de enlace -------------------------------------------------------------------
// Cada etiqueta es una clave de LINK_LABEL_EN (texto en español que /en traduce) o un nombre de
// plataforma, que se lee igual en ambos idiomas. Una etiqueta nueva en español va a LINK_LABEL_EN.
const PLATFORM_LABEL_RE = /^(?:Apple Music|Bandcamp|Beatport|Discogs|Qobuz \(hi-res\)|SoundCloud|Spotify|Tidal|YouTube)$/;
const allLabels = releases.flatMap((r) => (r.links ?? []).map((l) => ({ slug: r.slug, label: l.label })));
const unknownLabels = allLabels.filter((l) => !Object.hasOwn(LINK_LABEL_EN, l.label) && !PLATFORM_LABEL_RE.test(l.label));
report(
  `etiquetas de enlace: clave de LINK_LABEL_EN o plataforma conocida (${allLabels.length})`,
  unknownLabels.length === 0,
  list(unknownLabels.map((l) => `${l.slug}:«${l.label}»`)),
);
const labelI18nOk =
  releaseLinkLabel("Todas las plataformas", "en") === "All platforms" &&
  releaseLinkLabel("Todas las plataformas", "es") === "Todas las plataformas" &&
  releaseLinkLabel("Spotify (artista)", "en") === "Spotify (artist)" &&
  releaseLinkLabel("Spotify", "en") === "Spotify" &&
  releaseLinkLabel("Spotify", "es") === "Spotify" &&
  releaseLinkLabel("constructor", "en") === "constructor" &&
  Object.values(LINK_LABEL_EN).every((en) => temporalHits(en).length === 0);
report("releaseLinkLabel: traduce en /en, deja igual en /es y los nombres de plataforma", labelI18nOk);

// --- Títulos -----------------------------------------------------------------------------
// La plantilla vive en lib/seo.ts (TITLE_TEMPLATE) y lib/site-metadata.ts (metadata de los dos
// root layouts) la usa tal cual.
const siteMetadataSrc = readFileSync(path.join(ROOT, "lib/site-metadata.ts"), "utf8");
const template = TITLE_TEMPLATE.replace("%s", "");
report("lib/site-metadata.ts usa TITLE_TEMPLATE de lib/seo.ts", /template:\s*TITLE_TEMPLATE/.test(siteMetadataSrc));
report("TITLE_SUFFIX coincide con la plantilla de lib/seo.ts", template === TITLE_SUFFIX, `plantilla "%s${template}"`);
const titles = releases.map((r) => {
  const t = releaseTitle(r);
  return { slug: r.slug, absolute: t.absolute, shown: t.absolute ? t.text : t.text + TITLE_SUFFIX };
});
const longTitles = titles.filter((t) => t.shown.length > MAX_TITLE_LENGTH);
const nAbs = titles.filter((t) => t.absolute).length;
report(
  `releaseTitle ≤ ${MAX_TITLE_LENGTH} caracteres (${titles.length - nAbs} con plantilla, ${nAbs} absolutos)`,
  longTitles.length === 0,
  list(longTitles.map((t) => `${t.slug} (${t.shown.length})`)),
);

// --- Corte de estreno ---------------------------------------------------------------------
// La ficha de lanzamiento muestra el reproductor y datePublished solo si isReleased(). Desde H2
// las páginas son estáticas con ISR: el layout ya no lee headers() ni cookies(), y el corte
// llega con la regeneración (revalidate ≤ 300 s; stale-while-revalidate: 300 s más el tiempo
// hasta la siguiente visita). Los componentes cliente vuelven a mirar el reloj.
report("no existe app/layout.tsx (root layouts por segmento)", !existsSync(path.join(ROOT, "app/layout.tsx")));
const shellFiles = ["app/[lang]/layout.tsx", "app/press/[lang]/layout.tsx", "components/site-document.tsx"];
const shellWithHeaders = shellFiles.filter((f) => {
  const file = path.join(ROOT, f);
  return !existsSync(file) || /from\s+["']next\/headers["']/.test(readFileSync(file, "utf8"));
});
report(
  "root layouts y SiteDocument existen y no importan next/headers",
  shellWithHeaders.length === 0,
  list(shellWithHeaders),
);
const releasePageSrc = readFileSync(path.join(ROOT, "app/[lang]/releases/[slug]/page.tsx"), "utf8");
const revalidateMatch = /export\s+const\s+revalidate\s*=\s*(\d+)/.exec(releasePageSrc);
const releaseRevalidate = revalidateMatch ? Number(revalidateMatch[1]) : null;
const forceDynamic = /export\s+const\s+dynamic\s*=\s*["']force-dynamic["']/.test(releasePageSrc);
report(
  "ficha de lanzamiento con revalidate entre 1 y 300 s (corte de isReleased)",
  releaseRevalidate !== null && releaseRevalidate >= 1 && releaseRevalidate <= 300 && !forceDynamic,
  forceDynamic
    ? "quita `dynamic = \"force-dynamic\"` de app/[lang]/releases/[slug]/page.tsx"
    : releaseRevalidate === null
      ? "agrega `export const revalidate = 300` a app/[lang]/releases/[slug]/page.tsx"
      : `revalidate = ${releaseRevalidate}`,
);

// --- Discografía -------------------------------------------------------------------------
const dupEntries = artists.flatMap((a) => {
  const keys = getArtistEntries(a.slug).map((e) => e.key);
  return keys.filter((k, i) => keys.indexOf(k) !== i).map((k) => `${a.slug}:${k}`);
});
report("getArtistEntries sin claves duplicadas", dupEntries.length === 0, list(dupEntries));
const fichaTitles = new Set(releases.map((r) => `${r.artistSlug}::${r.title.toLowerCase()}`));
const lightDup = artists.flatMap((a) =>
  (a.releases ?? []).filter((r) => fichaTitles.has(`${a.slug}::${r.title.toLowerCase()}`)).map((r) => `${a.slug}:${r.title}`),
);
report("ninguna entrada liviana de artists repite una ficha", lightDup.length === 0, list(lightDup));

// --- Redirects ---------------------------------------------------------------------------
const redirects = await nextConfig.redirects();
const rules = redirects.map((r) => ({
  ...r,
  match: getPathMatch(r.source, { strict: true, removeUnnamedParams: true }),
  toPath: compile(r.destination, { validate: false }),
}));
const notPermanent = redirects.filter((r) => r.permanent !== true);
report(`redirects permanentes (${redirects.length})`, notPermanent.length === 0, list(notPermanent.map((r) => r.source)));

/** Destino de una ruta según la primera regla que calza (como el servidor), o null. */
function resolveRedirect(pathname) {
  for (const r of rules) {
    const params = r.match(pathname);
    if (params) return r.toPath(params);
  }
  return null;
}

const expected = [
  ["/es/artistas/claudio-solis", "/es#roster"],
  ["/en/artistas/claudio-solis", "/en#roster"],
  ["/press/es/claudio-solis", "/es/press-kit"],
  ["/press/en/claudio-solis", "/en/press-kit"],
  ...legacy.flatMap(([from, to]) => [
    [`/es/artistas/${from}`, `/es/artistas/${to}`],
    [`/en/artistas/${from}`, `/en/artistas/${to}`],
    [`/es/artistas/${from}/opengraph-image`, `/es/artistas/${to}/opengraph-image`],
    [`/en/artistas/${from}/opengraph-image`, `/en/artistas/${to}/opengraph-image`],
    [`/artistas/${from}`, `/es/artistas/${to}`],
    [`/press/es/${from}`, `/press/es/${to}`],
    [`/press/en/${from}`, `/press/en/${to}`],
    [`/press-kits/${from}-es.pdf`, `/press-kits/${to}-es.pdf`],
    [`/press-kits/${from}-en.pdf`, `/press-kits/${to}-en.pdf`],
  ]),
];
const wrong = expected.filter(([from, to]) => resolveRedirect(from) !== to);
report(
  `redirects: las 5 formas por slug viejo (ES/EN) y las 2 de claudio-solis (${expected.length} rutas)`,
  wrong.length === 0,
  list(wrong.map(([from, to]) => `${from} → ${resolveRedirect(from)} (esperado ${to})`)),
);
const mustNotMatch = legacy.flatMap(([from]) => [`/press-kits/${from}-fr.pdf`, `/fr/artistas/${from}`]);
const overMatch = mustNotMatch.filter((p) => resolveRedirect(p) !== null);
report("redirects: idiomas desconocidos no calzan", overMatch.length === 0, list(overMatch));

const legacyInDest = redirects.filter((r) => legacy.some(([from]) => r.destination.includes(from)));
report("ningún destino de redirect lleva un slug viejo", legacyInDest.length === 0, list(legacyInDest.map((r) => r.destination)));
const chained = expected
  .map(([from]) => resolveRedirect(from))
  .filter(Boolean)
  .filter((dest) => resolveRedirect(dest.split("#")[0]) !== null);
report("redirects en un solo salto (ningún destino calza con otro source)", chained.length === 0, list(chained));

// --- Avisos ------------------------------------------------------------------------------
// Toda ficha ya publicada sin Spotify reproducible (spotifyRefFromLinks nulo: la ficha no muestra
// reproductor) da un aviso, aunque tenga Apple Music. RELEASES_NOW (ISO, opcional) simula la fecha:
//   RELEASES_NOW=2026-11-05T00:00:00-03:00 pnpm test:releases
const nowEnv = process.env.RELEASES_NOW;
const nowMs = nowEnv ? Date.parse(nowEnv) : Date.now();
if (nowEnv) report(`RELEASES_NOW es una fecha válida (${nowEnv})`, !Number.isNaN(nowMs));
const APPLE_RE = /music\.apple\.com\//;
const noPlayer = releases.filter((r) => isReleased(r.releaseDate, nowMs) && !spotifyRefFromLinks(r.links));
for (const r of noPlayer) {
  const labels = (r.links ?? []).map((l) => l.label).join(" · ") || "sin enlaces";
  if ((r.links ?? []).some((l) => APPLE_RE.test(l.href))) warn(`ficha publicada sin Spotify reproducible (sí Apple Music): ${r.slug}`, labels);
  else warn(`ficha publicada sin Spotify ni Apple Music: ${r.slug}`, labels);
}

for (const a of artists) {
  const missing = ["es", "en"].filter((l) => !existsSync(path.join(ROOT, "public/press-kits", `${a.slug}-${l}.pdf`)));
  if (missing.length) warn(`press kit PDF ausente: ${a.slug}`, missing.map((l) => `${a.slug}-${l}.pdf`).join(", "));
}

info("entradas de discografía por artista (ficha = press kit)", artists.map((a) => `${a.slug} ${getArtistEntries(a.slug).length}`).join(" · "));

process.exit(ok ? 0 : 1);
