// Prueba del journal (M11, carril R del p19): pnpm test:journal
//   (node --import ./scripts/ts-resolve-hook.mjs scripts/test-journal.mjs)
// Fuente de verdad: `journalPieces` de lib/journal.ts (hoy vacío). Las validaciones viven aquí y
// corren sobre los datos reales y sobre fixtures que se agregan a `journalPieces` y se quitan en
// un `finally` (nunca quedan en los datos). Comprueba (FAIL):
//   J1 esquema: slug kebab y único; ES y EN completos (título ≤ 60, bajada ≤ 200, cuerpo, alt de
//     portada); cada cuerpo con ≥ 1 párrafo y bloques conocidos; imágenes y portada locales en
//     public/journal/<slug>/, existentes, con alt y crédito, width/height enteros; youtubeId de 11
//     caracteres con título (y `thumb` solo "hqdefault"); lanzamientos y artistas existentes
//     (≥ 1 artista); formato de JOURNAL_FORMATS; autor; publishAt válido y con el offset real de
//     America/Santiago; recorte móvil de la portada (opcional) 4:5, local y existente; `position`
//     solo con clases object-[X%_Y%] (con md:/lg: opcional).
//   J2 negativos: una fixture por error (slug con mayúsculas, sin EN, sin offset, offset de verano
//     en julio, artista o lanzamiento inexistente, imagen sin crédito, video de 10 caracteres,
//     archivo de portada inexistente); la fixture válida pasa.
//   J3 publishAt: offsets de Santiago contra Intl en los cambios de hora de 2026; isPublished
//     cambia en el ms exacto; "mañana" y fechas imposibles no publican; getPublishedPieces excluye
//     las futuras y ordena de la más reciente a la más antigua.
//   J4 sitemap real (app/sitemap.ts): sin piezas publicadas, ninguna URL /journal; con una pieza
//     publicada y una futura, índice y pieza en ES/EN con alternates y lastmod verdadero, la futura
//     fuera, portada con el máximo y cada URL con su par; al quitar las fixtures no queda nada.
//   J5 JSON-LD: BlogPosting completo en ES y EN, autor del sello = ORG_ID, about/mentions =
//     artistId/releaseId, "<" escapado por toJsonLd, índice sin ItemList cuando no hay piezas.
//     journalVideoThumb: la del bloque, la de lib/videos.ts o maxresdefault.
//   J6 fuentes: las rutas con `revalidate = 300` y sin APIs de petición; /journal con noindex;
//     [slug] con notFound() y getPublishedPiece(; la imagen OG con revalidate y la misma guarda;
//     sin piezas publicadas, ni el menú ni el footer ni lib/translations.ts ni lib/i18n/** enlazan
//     a /journal; Tailwind 4 con detección automática (sin source(), lib/ y content/ fuera de
//     .gitignore), para que las clases de `cover.position` lleguen al CSS.
// Avisos (WARN, solo datos reales): bajada fuera de 140–160; cuerpo fuera de 300–700 palabras;
//   sin lanzamientos relacionados; secuencia de bloques no textuales distinta entre ES y EN.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  journalPieces,
  JOURNAL_FORMATS,
  JOURNAL_FORMAT_LABEL,
  JOURNAL_BLOCK_TYPES,
  publishMs,
  isPublished,
  getPublishedPieces,
  getPublishedPiece,
  publishedDay,
  formatPublishDate,
  journalTextFields,
  journalWordCount,
  journalArticleJsonLd,
  journalIndexJsonLd,
  journalVideoThumb,
} from "../lib/journal.ts";
import { videos } from "../lib/videos.ts";
import { artists } from "../lib/artists.ts";
import { releases } from "../lib/releases.ts";
import { SITE, ORG_ID, LABEL_NAME, artistId, releaseId, toJsonLd } from "../lib/schema.ts";
import { titleLength, exactPastDate, latestDate } from "../lib/seo.ts";
import * as sitemapModule from "../app/sitemap.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const src = (rel) => readFileSync(path.join(ROOT, rel), "utf8");
// Código sin comentarios de línea completa ni de bloque (los comentarios explican qué no se usa).
const code = (rel) => src(rel).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

let ok = true;
const report = (label, pass, detail) => {
  ok &&= pass;
  console.log(`${pass ? "OK  " : "FAIL"} ${label}${detail ? " -> " + detail : ""}`);
};
const warn = (label, detail) => console.log(`WARN ${label}${detail ? " -> " + detail : ""}`);
const info = (label, detail) => console.log(`INFO ${label}${detail ? " -> " + detail : ""}`);
const list = (arr) => (arr.length ? arr.join(", ") : "");
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const clone = (o) => JSON.parse(JSON.stringify(o));
const LANGS = ["es", "en"];
const other = (l) => (l === "es" ? "en" : "es");

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const YT_RE = /^[A-Za-z0-9_-]{11}$/;
const IMAGE_EXT_RE = /\.(jpe?g|png|webp)$/i;
// cover.position: una o más clases object-[X%_Y%], cada una con md: o lg: opcional.
const POSITION_RE = /^(?:(?:md:|lg:)?object-\[\d{1,3}%_\d{1,3}%\])(?: (?:md:|lg:)?object-\[\d{1,3}%_\d{1,3}%\])*$/;
const artistSet = new Set(artists.map((a) => a.slug));
const releaseSet = new Set(releases.map((r) => r.slug));
const words = (s) => String(s ?? "").trim().split(/\s+/).filter(Boolean).length;
const nonEmpty = (s) => typeof s === "string" && s.trim().length > 0;
const realFile = (src) => existsSync(path.join(ROOT, "public", src));

// ── Offset de America/Santiago en un instante, según Intl ("-03:00" / "-04:00") ──
const offsetFmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Santiago", timeZoneName: "longOffset" });
function santiagoOffset(ms) {
  const name = offsetFmt.formatToParts(new Date(ms)).find((p) => p.type === "timeZoneName")?.value ?? "";
  return name === "GMT" ? "+00:00" : name.replace("GMT", "");
}
/** ISO con hora de Santiago y su offset para un instante (al segundo). */
function santiagoIso(ms) {
  const off = santiagoOffset(ms);
  const sign = off.startsWith("-") ? -1 : 1;
  const [h, m] = off.slice(1).split(":").map(Number);
  const local = new Date(Math.floor(ms / 1000) * 1000 + sign * (h * 60 + m) * 60_000).toISOString().slice(0, 19);
  return `${local}${off}`;
}

// ── Validación de una pieza ──
// `fileExists` se inyecta: las fixtures no tienen fotos en public/ (no se inventan archivos).
function validatePiece(p, { fileExists = realFile } = {}) {
  const errors = [];
  const warns = [];
  const err = (m) => errors.push(m);
  if (typeof p.slug !== "string" || !SLUG_RE.test(p.slug)) err(`slug no kebab: «${p.slug}»`);
  const dir = `/journal/${p.slug}/`;

  for (const l of LANGS) {
    const title = p.title?.[l];
    if (!nonEmpty(title)) err(`title.${l} vacío`);
    else if (titleLength(title) > 60) err(`title.${l} de ${titleLength(title)} caracteres (> 60)`);
    const excerpt = p.excerpt?.[l];
    if (!nonEmpty(excerpt)) err(`excerpt.${l} vacío`);
    else {
      const n = [...excerpt].length;
      if (n > 200) err(`excerpt.${l} de ${n} caracteres (> 200)`);
      else if (n < 140 || n > 160) warns.push(`excerpt.${l} de ${n} caracteres (ideal 140–160)`);
    }
    if (!nonEmpty(p.cover?.alt?.[l])) err(`cover.alt.${l} vacío`);
    const body = p.body?.[l];
    if (!Array.isArray(body) || body.length === 0) {
      err(`body.${l} vacío`);
      continue;
    }
    if (!body.some((b) => b?.type === "paragraph")) err(`body.${l} sin párrafos`);
    body.forEach((b, i) => {
      const at = `body.${l}[${i}]`;
      if (!JOURNAL_BLOCK_TYPES.includes(b?.type)) return err(`${at}: tipo desconocido «${b?.type}»`);
      if (["paragraph", "heading", "quote"].includes(b.type) && !nonEmpty(b.text)) err(`${at}: ${b.type} sin texto`);
      if (b.type === "quote" && "cite" in b && !nonEmpty(b.cite)) err(`${at}: cite vacío`);
      if (b.type === "image") {
        checkImage(b, at, dir, fileExists, err);
        if (!nonEmpty(b.alt)) err(`${at}: imagen sin alt`);
      }
      if (b.type === "video") {
        if (!YT_RE.test(String(b.youtubeId))) err(`${at}: youtubeId inválido «${b.youtubeId}»`);
        if (!nonEmpty(b.title)) err(`${at}: video sin título`);
        if ("thumb" in b && b.thumb !== "hqdefault") err(`${at}: thumb «${b.thumb}» (solo "hqdefault")`);
      }
      if (b.type === "release" && !releaseSet.has(b.slug)) err(`${at}: lanzamiento inexistente «${b.slug}»`);
    });
    const n = words(
      body
        .filter((b) => ["paragraph", "heading", "quote"].includes(b.type))
        .map((b) => b.text)
        .join(" "),
    );
    if (n < 300 || n > 700) warns.push(`body.${l} con ${n} palabras (ideal 300–700)`);
  }
  if (p.cover) {
    checkImage(p.cover, "cover", dir, fileExists, err);
    if (p.cover.mobile !== undefined) {
      checkImage({ ...p.cover.mobile, credit: p.cover.credit }, "cover.mobile", dir, fileExists, err);
      const r = p.cover.mobile.width / p.cover.mobile.height;
      if (!(Math.abs(r - 0.8) <= 0.01)) err(`cover.mobile: ${p.cover.mobile.width}×${p.cover.mobile.height} no es 4:5`);
    }
    if (p.cover.position !== undefined && !POSITION_RE.test(String(p.cover.position))) {
      err(`cover.position «${p.cover.position}»: solo clases object-[X%_Y%] (md:/lg: opcional)`);
    }
  } else err("sin cover");

  if (!Array.isArray(p.artists) || p.artists.length === 0) err("sin artistas relacionados");
  else p.artists.filter((s) => !artistSet.has(s)).forEach((s) => err(`artista inexistente «${s}»`));
  if (!Array.isArray(p.releases)) err("releases no es un arreglo");
  else {
    p.releases.filter((s) => !releaseSet.has(s)).forEach((s) => err(`lanzamiento inexistente «${s}»`));
    if (p.releases.length === 0) warns.push("sin lanzamientos relacionados");
  }
  if (!JOURNAL_FORMATS.includes(p.format)) err(`formato desconocido «${p.format}»`);
  if (!nonEmpty(p.author)) err("sin autor");

  const ms = publishMs(p);
  if (ms === null) err(`publishAt inválido «${p.publishAt}» (YYYY-MM-DDTHH:MM[:SS]-03:00 o -04:00)`);
  else if (p.publishAt.slice(-6) !== santiagoOffset(ms)) {
    err(`publishAt «${p.publishAt}» con offset ${p.publishAt.slice(-6)}; Santiago está en ${santiagoOffset(ms)} ese día`);
  }

  // Misma secuencia de bloques no textuales en ES y EN (las imágenes, videos y fichas suelen ir igual).
  const seq = (l) => (p.body?.[l] ?? []).filter((b) => ["image", "video", "release"].includes(b?.type)).map((b) => b.type).join(",");
  if (Array.isArray(p.body?.es) && Array.isArray(p.body?.en) && seq("es") !== seq("en")) {
    warns.push(`bloques no textuales distintos entre ES (${seq("es") || "—"}) y EN (${seq("en") || "—"})`);
  }
  return { errors, warns };
}

function checkImage(img, at, dir, fileExists, err) {
  if (typeof img.src !== "string" || !img.src.startsWith(dir) || !IMAGE_EXT_RE.test(img.src)) {
    err(`${at}: src «${img.src}» fuera de public${dir} o sin extensión de imagen`);
  } else if (!fileExists(img.src)) err(`${at}: no existe public${img.src}`);
  if (!nonEmpty(img.credit)) err(`${at}: sin crédito`);
  for (const k of ["width", "height"]) if (!Number.isInteger(img[k]) || img[k] <= 0) err(`${at}: ${k} no es un entero > 0`);
}

// ── Fixture válida (solo vive en esta prueba) ──
const FIXTURE_SLUG = "fixture-carril-r";
const DAY = 86_400_000;
const NOW = Date.now();
function fixture(slug, publishAt, overrides = {}) {
  const dir = `/journal/${slug}`;
  const p = {
    slug,
    title: { es: "Destellos de ti, track by track", en: "Destellos de ti, track by track" },
    excerpt: {
      es: "Klaus B repasa el single que abre el ciclo de su álbum con PHŌNÉ Records: la flauta, la banda y la sala donde se grabó, contado tema a tema.",
      en: "Klaus B walks through the single that opens his album cycle with PHŌNÉ Records: the flute, the band and the room where it was recorded, track by track.",
    },
    body: {
      es: [
        { type: "paragraph", text: "Un párrafo de prueba con texto neutro sobre la grabación." },
        { type: "heading", text: "La flauta" },
        { type: "quote", text: "La sala sonaba sola.", cite: "Klaus B" },
        { type: "image", src: `${dir}/sesion.jpg`, width: 1600, height: 1067, alt: "Klaus B toca la flauta en el estudio", credit: "Fotógrafa de prueba", caption: "Sesión de grabación" },
        { type: "video", youtubeId: "abcdefghijk", title: "Destellos de ti" },
        { type: "release", slug: "klaus-b-destellos-de-ti" },
      ],
      en: [
        { type: "paragraph", text: "A test paragraph with neutral text about the recording." },
        { type: "heading", text: "The flute" },
        { type: "quote", text: "The room played itself.", cite: "Klaus B" },
        { type: "image", src: `${dir}/sesion.jpg`, width: 1600, height: 1067, alt: "Klaus B plays the flute in the studio", credit: "Test photographer", caption: "Recording session" },
        { type: "video", youtubeId: "abcdefghijk", title: "Destellos de ti" },
        { type: "release", slug: "klaus-b-destellos-de-ti" },
      ],
    },
    publishAt,
    author: "Autora de prueba",
    artists: ["klaus-b"],
    releases: ["klaus-b-destellos-de-ti"],
    cover: {
      src: `${dir}/portada.jpg`,
      width: 1920,
      height: 1080,
      credit: "Fotógrafa de prueba",
      alt: { es: "Klaus B con la flauta en la sala de grabación", en: "Klaus B with the flute in the recording room" },
      position: "object-[50%_40%] md:object-[50%_35%]",
      mobile: { src: `${dir}/portada-movil.jpg`, width: 1200, height: 1500 },
    },
    format: "track-by-track",
    ...overrides,
  };
  return p;
}
const fixtureFiles = (slug) => (src) => src.startsWith(`/journal/${slug}/`);
const baseLength = journalPieces.length;
const baseSlugs = journalPieces.map((p) => p.slug);

// ── J1: datos reales ──
{
  info(`piezas en lib/journal.ts`, `${journalPieces.length} (${getPublishedPieces(NOW).length} publicadas)`);
  const slugs = journalPieces.map((p) => p.slug);
  const dup = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  report("J1 slugs únicos", dup.length === 0, list(dup));
  const bad = [];
  for (const p of journalPieces) {
    const { errors, warns } = validatePiece(p);
    errors.forEach((e) => bad.push(`${p.slug}: ${e}`));
    warns.forEach((w) => warn(`J1 ${p.slug}`, w));
  }
  report(`J1 esquema de las ${journalPieces.length} piezas reales`, bad.length === 0, list(bad));
  report("J1 JOURNAL_FORMATS = los 5 formatos con etiqueta en español", same([...JOURNAL_FORMATS], ["cronica", "track-by-track", "entrevista", "archivo", "detras-del-disco"]) && JOURNAL_FORMATS.every((f) => nonEmpty(JOURNAL_FORMAT_LABEL[f])));
}

// ── J2: fixture válida y negativos ──
{
  const valid = fixture(FIXTURE_SLUG, "2026-11-10T10:00:00-03:00");
  const v = validatePiece(valid, { fileExists: fixtureFiles(FIXTURE_SLUG) });
  report("J2 la fixture válida pasa", v.errors.length === 0, list(v.errors));

  const NEGATIVE = [
    ["slug con mayúsculas", (p) => (p.slug = "Fixture-Carril-R")],
    ["sin título EN", (p) => delete p.title.en],
    ["sin cuerpo EN", (p) => delete p.body.en],
    ["publishAt sin offset", (p) => (p.publishAt = "2026-11-10T10:00")],
    ["publishAt de julio con -03:00 (en julio Santiago está en -04:00)", (p) => (p.publishAt = "2026-07-10T10:00:00-03:00")],
    ["artista inexistente", (p) => (p.artists = ["klaus-b", "no-existe"])],
    ["lanzamiento inexistente", (p) => (p.releases = ["no-existe"])],
    ["bloque de lanzamiento inexistente", (p) => (p.body.es[5] = { type: "release", slug: "no-existe" })],
    ["imagen sin crédito", (p) => (p.body.es[3].credit = "")],
    ["portada sin crédito", (p) => (p.cover.credit = " ")],
    ["video de 10 caracteres", (p) => (p.body.en[4].youtubeId = "abcdefghij")],
    ["imagen fuera de public/journal/<slug>/", (p) => (p.cover.src = "/media/sello/sello-hero.jpg")],
    ["tipo de bloque desconocido", (p) => p.body.es.push({ type: "embed", html: "<iframe>" })],
    ["formato desconocido", (p) => (p.format = "noticia")],
    ["sin artistas", (p) => (p.artists = [])],
    ["recorte móvil 16:9 (no 4:5)", (p) => (p.cover.mobile = { ...p.cover.mobile, width: 1920, height: 1080 })],
    ["recorte móvil fuera de public/journal/<slug>/", (p) => (p.cover.mobile.src = "/media/sello/sello-hero-mobile.jpg")],
    ["position con una clase que no es object-[X%_Y%]", (p) => (p.cover.position = "object-[50%_40%] scale-150")],
    ["video con thumb distinto de hqdefault", (p) => (p.body.es[4].thumb = "sddefault")],
  ];
  const missed = NEGATIVE.filter(([, mutate]) => {
    const p = clone(valid);
    mutate(p);
    return validatePiece(p, { fileExists: fixtureFiles(FIXTURE_SLUG) }).errors.length === 0;
  }).map(([label]) => label);
  report(`J2 se rechaza cada una de las ${NEGATIVE.length} fixtures inválidas`, missed.length === 0, list(missed));
  const noFiles = validatePiece(valid).errors.filter((e) => e.includes("no existe public"));
  report("J2 portada, recorte móvil e imágenes (ES y EN) sin archivo en public/ se rechazan", noFiles.length === 4, list(noFiles));
  const noMobile = clone(valid);
  delete noMobile.cover.mobile;
  delete noMobile.cover.position;
  report("J2 recorte móvil y position son opcionales", validatePiece(noMobile, { fileExists: fixtureFiles(FIXTURE_SLUG) }).errors.length === 0);
}

// ── J3: publishAt ──
{
  const cases = [
    [Date.UTC(2026, 3, 4, 15), "-03:00"],
    [Date.UTC(2026, 3, 5, 15), "-04:00"],
    [Date.UTC(2026, 8, 5, 15), "-04:00"],
    [Date.UTC(2026, 8, 6, 15), "-03:00"],
  ];
  const badOff = cases.filter(([ms, off]) => santiagoOffset(ms) !== off).map(([ms, off]) => `${new Date(ms).toISOString().slice(0, 10)} ${santiagoOffset(ms)}≠${off}`);
  report("J3 Intl: 04-04 -03, 05-04 -04, 05-09 -04, 06-09 -03 (2026)", badOff.length === 0, list(badOff));
  const sept6 = validatePiece(fixture(FIXTURE_SLUG, "2026-09-06T10:00:00-03:00"), { fileExists: fixtureFiles(FIXTURE_SLUG) }).errors;
  const sept5 = validatePiece(fixture(FIXTURE_SLUG, "2026-09-05T10:00:00-03:00"), { fileExists: fixtureFiles(FIXTURE_SLUG) }).errors;
  report('J3 "2026-09-06T10:00:00-03:00" pasa y "2026-09-05T10:00:00-03:00" falla', sept6.length === 0 && sept5.some((e) => e.includes("offset")), list([...sept6, ...sept5]));

  const p = fixture(FIXTURE_SLUG, "2026-11-10T10:00:00-03:00");
  const ms = publishMs(p);
  report("J3 publishMs = instante UTC (10:00 -03:00 = 13:00Z)", ms === Date.UTC(2026, 10, 10, 13), String(ms));
  report("J3 isPublished: false un ms antes, true en el ms exacto", isPublished(p, ms - 1) === false && isPublished(p, ms) === true);
  const never = ["mañana", "", "2026-11-10", "2026-11-10T10:00", "2026-02-31T10:00:00-03:00", "2026-11-10T24:30:00-03:00", "2026-11-10T10:00:00Z", "2026-11-10T10:00:00+03:00"].filter(
    (s) => publishMs({ publishAt: s }) !== null || isPublished({ publishAt: s }, Date.UTC(2100, 0, 1)),
  );
  report('J3 "mañana", sin offset, fechas imposibles u offsets ajenos nunca publican', never.length === 0, list(never.map((s) => `«${s}»`)));
  report("J3 offset -04:00 también se lee", publishMs({ publishAt: "2026-07-10T10:00:00-04:00" }) === Date.UTC(2026, 6, 10, 14));
  report(
    "J3 fecha visible desde el día de Santiago",
    formatPublishDate(p, "es") === "10 de noviembre de 2026" && formatPublishDate(p, "en") === "November 10, 2026" && publishedDay(p) === "2026-11-10",
    `${formatPublishDate(p, "es")} | ${formatPublishDate(p, "en")}`,
  );
  report("J3 santiagoIso (helper de la prueba) vuelve al mismo instante", publishMs({ publishAt: santiagoIso(NOW) }) === Math.floor(NOW / 1000) * 1000, santiagoIso(NOW));

  const older = fixture(`${FIXTURE_SLUG}-a`, santiagoIso(NOW - 3 * DAY));
  const newer = fixture(`${FIXTURE_SLUG}-b`, santiagoIso(NOW - 1 * DAY));
  const future = fixture(`${FIXTURE_SLUG}-c`, santiagoIso(NOW + 2 * DAY));
  journalPieces.push(older, future, newer);
  try {
    const got = getPublishedPieces(NOW).map((x) => x.slug).filter((s) => s.startsWith(FIXTURE_SLUG));
    report("J3 getPublishedPieces excluye la futura y ordena de la más reciente a la más antigua", same(got, [newer.slug, older.slug]), list(got));
    report(
      "J3 getPublishedPiece: la publicada sí, la futura y la desconocida no",
      getPublishedPiece(older.slug, NOW)?.slug === older.slug && getPublishedPiece(future.slug, NOW) === undefined && getPublishedPiece("no-existe", NOW) === undefined,
    );
    report("J3 la futura aparece en su instante", getPublishedPiece(future.slug, publishMs(future))?.slug === future.slug);
  } finally {
    for (const s of [older.slug, newer.slug, future.slug]) {
      const i = journalPieces.findIndex((x) => x.slug === s);
      if (i >= 0) journalPieces.splice(i, 1);
    }
  }
}

// ── J4: sitemap real ──
{
  const isJournal = (e) => /\/(es|en)\/journal(\/|$)/.test(e.url);
  const realPublished = getPublishedPieces(Date.now());
  const sm0 = sitemapModule.default();
  const j0 = sm0.filter(isJournal);
  if (realPublished.length === 0) {
    report("J4 sin piezas publicadas: ninguna URL /journal en el sitemap", j0.length === 0, list(j0.map((e) => e.url)));
  } else {
    report(`J4 ${realPublished.length} piezas publicadas: índice + piezas en ES y EN`, j0.length === 2 + 2 * realPublished.length, String(j0.length));
  }

  const pub = fixture(`${FIXTURE_SLUG}-pub`, santiagoIso(Date.now() - 2 * DAY));
  const fut = fixture(`${FIXTURE_SLUG}-fut`, santiagoIso(Date.now() + 2 * DAY));
  journalPieces.push(pub, fut);
  try {
    const now = Date.now();
    const sm = sitemapModule.default();
    const byUrl = new Map(sm.map((e) => [e.url, e]));
    const day = publishedDay(pub);
    const expectedIndex = latestDate(getPublishedPieces(now).map((p) => exactPastDate(publishedDay(p), now)));
    report(
      "J4 /es/journal y /en/journal con el día de la pieza más reciente",
      LANGS.every((l) => byUrl.get(`${SITE}/${l}/journal`)?.lastModified === expectedIndex) && expectedIndex >= day,
      `${expectedIndex} (pieza ${day})`,
    );
    const pieceOk = LANGS.every((l) => {
      const e = byUrl.get(`${SITE}/${l}/journal/${pub.slug}`);
      return (
        e?.lastModified === day &&
        same(e?.alternates?.languages, {
          es: `${SITE}/es/journal/${pub.slug}`,
          en: `${SITE}/en/journal/${pub.slug}`,
          "x-default": `${SITE}/es/journal/${pub.slug}`,
        })
      );
    });
    report("J4 la pieza publicada en ES y EN, con su día y alternates es/en/x-default", pieceOk);
    const futUrls = sm.filter((e) => e.url.includes(fut.slug)).map((e) => e.url);
    report("J4 la pieza futura no aparece", futUrls.length === 0, list(futUrls));
    const badLm = sm.filter((e) => e.lastModified !== undefined && exactPastDate(e.lastModified, now) !== e.lastModified);
    report("J4 todo lastmod pasa exactPastDate", badLm.length === 0, list(badLm.map((e) => `${e.url}:${e.lastModified}`)));
    const max = latestDate(sm.map((e) => e.lastModified));
    report("J4 la portada mantiene el lastmod máximo", LANGS.every((l) => byUrl.get(`${SITE}/${l}`)?.lastModified === max), max);
    const unpaired = sm.filter((e) => !byUrl.has(e.url.replace(/^(https:\/\/[^/]+\/)(es|en)/, (_, h, l) => `${h}${other(l)}`)));
    report("J4 cada URL tiene su par en el otro idioma", unpaired.length === 0, list(unpaired.map((e) => e.url)));
  } finally {
    for (const s of [pub.slug, fut.slug]) {
      const i = journalPieces.findIndex((x) => x.slug === s);
      if (i >= 0) journalPieces.splice(i, 1);
    }
  }
  const after = sitemapModule.default().filter((e) => e.url.includes(FIXTURE_SLUG));
  report(
    "J4 tras el finally: journalPieces como al inicio y ninguna fixture en el sitemap",
    journalPieces.length === baseLength && same(journalPieces.map((p) => p.slug), baseSlugs) && after.length === 0,
    `${journalPieces.length} piezas`,
  );
}

// ── J5: JSON-LD ──
{
  const p = fixture(FIXTURE_SLUG, "2026-11-10T10:00:00-03:00");
  for (const l of LANGS) {
    const doc = journalArticleJsonLd(p, l);
    const graph = doc["@graph"] ?? [];
    const post = graph.find((n) => n["@type"] === "BlogPosting") ?? {};
    const url = `${SITE}/${l}/journal/${p.slug}`;
    const problems = [];
    const expect = (k, cond) => cond || problems.push(k);
    expect("@context", doc["@context"] === "https://schema.org");
    expect("@id", post["@id"] === `${url}#article`);
    expect("url", post.url === url);
    expect("mainEntityOfPage", post.mainEntityOfPage?.["@id"] === url);
    expect("inLanguage", post.inLanguage === (l === "es" ? "es-CL" : "en-US"));
    expect("headline", post.headline === p.title[l]);
    expect("description", post.description === p.excerpt[l]);
    expect("image", same(post.image, [`${SITE}${p.cover.src}`]));
    expect("datePublished/dateModified", post.datePublished === p.publishAt && post.dateModified === p.publishAt);
    expect("author Person", post.author?.["@type"] === "Person" && post.author?.name === p.author);
    expect("publisher ORG_ID", post.publisher?.["@id"] === ORG_ID);
    expect("articleSection", post.articleSection === JOURNAL_FORMAT_LABEL[p.format]);
    expect("about = artistId", same(post.about?.map((a) => a["@id"]), p.artists.map(artistId)));
    expect("mentions = releaseId", same(post.mentions?.map((m) => m["@id"]), p.releases.map(releaseId)));
    expect("wordCount", post.wordCount === journalWordCount(p, l) && post.wordCount > 0);
    expect("sin /es/ ni /en/ en about/mentions", ![...(post.about ?? []), ...(post.mentions ?? [])].some((x) => /\/(es|en)\//.test(x["@id"])));
    const crumbs = graph.find((n) => n["@type"] === "BreadcrumbList")?.itemListElement ?? [];
    expect(
      "BreadcrumbList Inicio → Journal → título",
      crumbs.length === 3 &&
        crumbs[0].item === `${SITE}/${l}` &&
        crumbs[1].item === `${SITE}/${l}/journal` &&
        crumbs[2].item === url &&
        crumbs[2].name === p.title[l] &&
        crumbs.every((c, i) => c.position === i + 1),
    );
    report(`J5 [${l}] BlogPosting y migas completos`, problems.length === 0, list(problems));
  }
  const label = journalArticleJsonLd({ ...p, author: LABEL_NAME }, "es")["@graph"][0].author;
  report("J5 autor = PHŌNÉ Records → la organización (ORG_ID)", label?.["@id"] === ORG_ID);
  const xss = { ...p, title: { es: "<b>", en: "</script>" } };
  const json = toJsonLd(journalArticleJsonLd(xss, "es"));
  report('J5 título "<b>" escapado por toJsonLd (sin "<" literal) y legible de vuelta', !json.includes("<") && JSON.parse(json)["@graph"][0].headline === "<b>");
  for (const l of LANGS) {
    const empty = journalIndexJsonLd(l, []);
    const full = journalIndexJsonLd(l, [p]);
    const list1 = full["@graph"].find((n) => n["@type"] === "CollectionPage")?.mainEntity;
    report(
      `J5 [${l}] índice: sin piezas solo la miga; con piezas CollectionPage + ItemList de BlogPosting`,
      !JSON.stringify(empty).includes("ItemList") &&
        empty["@graph"].length === 1 &&
        empty["@graph"][0]["@type"] === "BreadcrumbList" &&
        list1?.["@type"] === "ItemList" &&
        list1.numberOfItems === 1 &&
        list1.itemListElement[0].item["@type"] === "BlogPosting" &&
        list1.itemListElement[0].item.url === `${SITE}/${l}/journal/${p.slug}`,
    );
  }
  const hq = videos.find((v) => v.thumb === "hqdefault");
  const maxres = videos.find((v) => !v.thumb);
  report(
    "J5 journalVideoThumb: la del bloque, la de lib/videos.ts o maxresdefault",
    journalVideoThumb({ youtubeId: "abcdefghijk", thumb: "hqdefault" }) === "hqdefault" &&
      journalVideoThumb({ youtubeId: "abcdefghijk" }) === "maxresdefault" &&
      (!hq || journalVideoThumb({ youtubeId: hq.youtubeId }) === "hqdefault") &&
      (!maxres || journalVideoThumb({ youtubeId: maxres.youtubeId }) === "maxresdefault"),
    hq ? `hq: ${hq.slug}` : "sin videos hqdefault en lib/videos.ts",
  );
  const fields = journalTextFields(p).map((f) => f.field);
  report(
    "J5 journalTextFields cubre título, bajada, párrafo, subtítulo, cita, cite y pie de foto en ES y EN",
    LANGS.every((l) => ["title", "excerpt"].every((k) => fields.includes(`${k}.${l}`))) &&
      ["paragraph", "heading", "quote", "image"].every((t) => LANGS.every((l) => fields.some((f) => f.startsWith(`body.${l}`) && f.endsWith(`.${t}`)))) &&
      journalTextFields(p).some((f) => f.text === "Klaus B") &&
      journalTextFields(p).some((f) => f.text === "Sesión de grabación"),
    list(fields),
  );
}

// ── J6: fuentes ──
{
  const INDEX = "app/[lang]/journal/page.tsx";
  const PIECE = "app/[lang]/journal/[slug]/page.tsx";
  const OG = "app/[lang]/journal/[slug]/opengraph-image.tsx";
  const DYNAMIC = ["headers(", "cookies(", "searchParams", "useSearchParams", "force-dynamic", "next/headers"];
  for (const file of [INDEX, PIECE]) {
    const s = code(file);
    const dyn = DYNAMIC.filter((d) => s.includes(d));
    report(`J6 ${file}: revalidate = 300 y sin APIs de petición`, /export const revalidate = 300;/.test(s) && dyn.length === 0, list(dyn));
  }
  const components = ["journal-card", "journal-body", "journal-related", "journal-empty"].map((n) => `components/phone/${n}.tsx`);
  const dynComp = components.flatMap((f) => DYNAMIC.filter((d) => code(f).includes(d)).map((d) => `${f}: ${d}`));
  report("J6 componentes journal-* sin APIs de petición", dynComp.length === 0, list(dynComp));
  report("J6 /journal con noindex: (sin piezas publicadas)", code(INDEX).includes("noindex: pieces.length === 0"));
  const piece = code(PIECE);
  report("J6 [slug] con notFound() y getPublishedPiece( (404 si es desconocida o futura)", piece.includes("notFound()") && piece.includes("getPublishedPiece("));
  report("J6 [slug] sin dynamicParams (ISR a demanda)", !piece.includes("dynamicParams"));
  const og = code(OG);
  report("J6 imagen OG con revalidate = 300 y getPublishedPiece(", /export const revalidate = 300;/.test(og) && og.includes("getPublishedPiece("));
  if (getPublishedPieces(Date.now()).length === 0) {
    // lib/i18n/** llega con el carril T (lib/translations.ts pasa a barril): se recorre si existe.
    const walk = (rel) =>
      readdirSync(path.join(ROOT, rel), { withFileTypes: true }).flatMap((d) =>
        d.isDirectory() ? walk(`${rel}/${d.name}`) : /\.(ts|tsx)$/.test(d.name) ? [`${rel}/${d.name}`] : [],
      );
    const i18n = existsSync(path.join(ROOT, "lib/i18n")) ? walk("lib/i18n") : [];
    const linked = ["components/landing/navigation.tsx", "components/landing/footer-section.tsx", "lib/translations.ts", ...i18n].filter((f) => src(f).includes("/journal"));
    report(
      `J6 sin piezas publicadas: ni el menú, ni el footer, ni lib/translations.ts, ni lib/i18n/** (${i18n.length} archivos) enlazan a /journal`,
      linked.length === 0,
      list(linked),
    );
  } else {
    info("J6 hay piezas publicadas: enlazar /journal desde el menú y el footer lo decide el equipo");
  }
}

// Tailwind 4 (app/globals.css con @import "tailwindcss") genera las clases que encuentra en los
// archivos del repo que no ignora git. cover.position vive en los datos (lib/journal.ts y, desde el
// carril S, content/journal/*.json): si la detección se restringe con source(...) sin un @source que
// cubra esas carpetas, o si git las ignora, el object-position de la portada se pierde sin aviso.
{
  const css = src("app/globals.css");
  const restricted = /@import\s+["']tailwindcss["'][^;]*\bsource\(/.test(css);
  const covers = (dir) => new RegExp(`@source\\s+["'][^"']*${dir}`).test(css);
  const ignored = src(".gitignore")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^\/?(lib|content)(\/|$)/.test(l));
  report(
    "J6 Tailwind ve lib/ y content/ (detección automática o @source) y git no los ignora",
    (!restricted || (covers("lib") && covers("content"))) && ignored.length === 0,
    restricted ? "source(...) restringido" : list(ignored),
  );
}

process.exit(ok ? 0 : 1);
