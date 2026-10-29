// Prueba de content/ (carril S del p19): pnpm test:content
//   (node --import ./scripts/ts-resolve-hook.mjs scripts/test-content.mjs)
// Los datos viven en content/<colección>/<slug>.json (una entrada por archivo) y llegan al sitio por
// los índices generados content/generated/<colección>.ts (scripts/content-index.mjs). La API de
// lib/artists.ts, releases.ts, videos.ts, events.ts y journal.ts no cambia. Comprueba (FAIL):
//   C1  cada JSON valida contra el esquema estricto de su colección (zod; el esquema es el tipo TS
//       de lib/*.ts, más `order` en artists y releases): strings no vacíos, opcionales sin null,
//       enteros, enums, fechas, youtubeId, countryCode, URLs https, displayTitle string | {es,en} y
//       bloques del journal por `type`.
//   C2  nombres kebab-case y ningún archivo extraño en las carpetas de colección.
//   C3  `slug` = nombre del archivo; sin duplicados (tampoco al pasar a minúsculas).
//   C4  `order` entero y único en artists y releases; no existe en videos, events ni journal.
//   C5  los índices versionados coinciden con buildIndexes() (y content/generated/ no tiene otros).
//   C6  formato canónico: JSON.stringify(JSON.parse(raw), null, 2) + "\n" === raw.
//   C7  ningún slug viejo de LEGACY_ARTIST_SLUGS en el texto de los JSON (la guardia de
//       test:releases solo lee lib/*.ts(x)).
//   C8  la API se arma desde content/: artists y releases en el orden de `order`, videos, events y
//       journal con los mismos slugs que los archivos; ninguna entrada exportada lleva `order`;
//       journalPieces es un arreglo no congelado; content/generated solo lo importan los 5 módulos.
//   C9  alarma de deriva: las claves de primer nivel de los tipos de lib/*.ts = las del esquema.
//   C10 autoprueba: fixtures negativas en memoria que las comprobaciones tienen que rechazar (y las
//       válidas de control, aceptar).
//   C11 ningún componente cliente ("use client") llega, por imports de valor, a los 5 módulos de
//       datos ni a content/: los datos no entran al bundle del navegador.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { COLLECTIONS, ENTRY_FILE_RE, IGNORED_FILES, buildIndexes, currentMode, indexPath, renderIndex } from "./content-index.mjs";
import { artists, LEGACY_ARTIST_SLUGS } from "../lib/artists.ts";
import { releases } from "../lib/releases.ts";
import { videos, VIDEO_KINDS } from "../lib/videos.ts";
import { events } from "../lib/events.ts";
import { journalPieces, publishMs, JOURNAL_FORMATS, JOURNAL_BLOCK_TYPES } from "../lib/journal.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let ok = true;
const report = (label, pass, detail) => {
  ok &&= pass;
  console.log(`${pass ? "OK  " : "FAIL"} ${label}${detail ? " -> " + detail : ""}`);
};
const info = (label, detail) => console.log(`INFO ${label}${detail ? " -> " + detail : ""}`);
const list = (arr, max = 8) => (arr.length ? arr.slice(0, max).join(" | ") + (arr.length > max ? ` (+${arr.length - max})` : "") : "");

// ── Esquemas (uno por tipo de lib/*.ts) ──────────────────────────────────────────────────────
const str = z.string().min(1);
const int = z.number().int();
const https = str.regex(/^https:\/\/\S+$/, "URL https:// sin espacios");
const localized = z.strictObject({ es: str, en: str });
const link = z.strictObject({ label: str, href: https });
const credit = z.strictObject({ role: str, name: str });
const youtubeId = z.string().regex(/^[A-Za-z0-9_-]{11}$/, "youtubeId de 11 caracteres");
const cover = str.regex(/^(\/|https:\/\/)\S+$/, "ruta local (/…) o URL https://");

/** `Release` de lib/artists.ts: lanzamientos sin ficha (entrada liviana del catálogo). */
const artistRelease = z.strictObject({
  year: str,
  title: str,
  format: str.optional(),
  label: str.optional(),
  notes: str.optional(),
  href: https.optional(),
  hrefKind: z.enum(["buy", "listen"]).optional(),
  cover: cover.optional(),
});

const artistSchema = z.strictObject({
  slug: str,
  order: int,
  name: str,
  alternateName: z.array(str).optional(),
  genres: z.array(str).min(1),
  genresEn: z.array(str).optional(),
  origin: str,
  role: localized,
  bio: localized,
  links: z.array(link),
  sameAs: z.array(https).optional(),
  releases: z.array(artistRelease).optional(),
  stats: z
    .strictObject({ spotifyFollowers: int.nonnegative().optional(), monthlyListeners: int.nonnegative().optional(), youtubeSubs: int.nonnegative().optional() })
    .optional(),
});

const RELEASE_TYPES = ["album", "ep", "single", "live", "mixtape", "compilation"];
const track = z.strictObject({
  n: int.positive(),
  title: str,
  duration: str.regex(/^\d{1,2}:\d{2}(:\d{2})?$/, "duración m:ss").optional(),
  composer: str.optional(),
  guests: z.array(str).optional(),
});

const releaseSchema = z.strictObject({
  slug: str,
  order: int,
  title: str,
  artistSlug: str,
  artistName: str,
  releaseDate: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, "AAAA[-MM[-DD]]"),
  year: int,
  type: z.enum(RELEASE_TYPES),
  format: str,
  label: str.optional(),
  description: localized,
  tracklist: z.array(track).optional(),
  credits: z.array(credit).optional(),
  links: z.array(link).optional(),
  cover: cover.optional(),
  featuredArtistSlugs: z.array(str).optional(),
  smartLink: https.optional(),
});

const videoSchema = z.strictObject({
  slug: str,
  youtubeId,
  title: str,
  displayTitle: z.union([str, localized]).optional(),
  artistSlug: str,
  artistName: str,
  kind: z.enum([...VIDEO_KINDS]),
  date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "AAAA-MM-DD (AAAA-MM tolerado)"),
  recordedYear: int.optional(),
  durationSec: int.positive().optional(),
  releaseSlug: str.optional(),
  description: localized,
  credits: z.array(credit).optional(),
  featured: z.boolean().optional(),
  thumb: z.literal("hqdefault").optional(),
});

const EVENT_STATUS = ["scheduled", "tentative", "cancelled"];
const eventSchema = z.strictObject({
  slug: str,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "AAAA-MM-DD"),
  artistSlug: str,
  artistName: str,
  venue: str,
  city: str,
  country: str,
  countryCode: z.string().regex(/^[A-Z]{2}$/, "ISO-3166 alfa-2"),
  status: z.enum(EVENT_STATUS),
  ticketsUrl: https.optional(),
  notes: z.strictObject({ es: str.optional(), en: str.optional() }).optional(),
});

const journalImage = { src: str, width: int.positive(), height: int.positive(), credit: str };
const BLOCKS = [
  z.strictObject({ type: z.literal("paragraph"), text: str }),
  z.strictObject({ type: z.literal("heading"), text: str }),
  z.strictObject({ type: z.literal("quote"), text: str, cite: str.optional() }),
  z.strictObject({ type: z.literal("image"), alt: str, caption: str.optional(), ...journalImage }),
  z.strictObject({ type: z.literal("video"), youtubeId, title: str, thumb: z.literal("hqdefault").optional() }),
  z.strictObject({ type: z.literal("release"), slug: str }),
];
const journalBlock = z.discriminatedUnion("type", BLOCKS);
const journalSchema = z.strictObject({
  slug: str,
  title: localized,
  excerpt: localized,
  body: z.strictObject({ es: z.array(journalBlock), en: z.array(journalBlock) }),
  publishAt: z.string().refine((p) => publishMs({ publishAt: p }) !== null, "publishAt AAAA-MM-DDTHH:MM[:SS]-03:00|-04:00"),
  author: str,
  artists: z.array(str).min(1),
  releases: z.array(str),
  cover: z.strictObject({
    ...journalImage,
    alt: localized,
    position: str.optional(),
    mobile: z.strictObject({ src: str, width: int.positive(), height: int.positive() }).optional(),
  }),
  format: z.enum([...JOURNAL_FORMATS]),
});

const SCHEMAS = { artists: artistSchema, releases: releaseSchema, videos: videoSchema, events: eventSchema, journal: journalSchema };
const HAS_ORDER = new Set(["artists", "releases"]);

// ── Comprobaciones puras (sirven para el disco y para las fixtures de C10) ──────────────────
// Una "entrada" es { file, raw, data } (data = JSON.parse(raw), o undefined si no parsea).

const issueText = (e) => e.issues.map((i) => `${i.path.join(".") || "(raíz)"}: ${i.message}`).join("; ");

/** C1: errores de esquema de una colección. */
function schemaErrors(name, entries) {
  return entries.flatMap((e) => {
    if (e.data === undefined) return [`${e.file}: no es JSON válido`];
    const r = SCHEMAS[name].safeParse(e.data);
    return r.success ? [] : [`${e.file}: ${issueText(r.error)}`];
  });
}

/** C2: archivos que no pueden estar en una carpeta de colección. */
const nameErrors = (files) => files.filter((f) => !IGNORED_FILES.has(f) && !ENTRY_FILE_RE.test(f));

/** C3: slug distinto del nombre del archivo o repetido (también en minúsculas). */
function slugErrors(entries) {
  const errors = [];
  const seen = new Map();
  for (const e of entries) {
    const base = e.file.replace(/\.json$/, "");
    if (e.data?.slug !== base) errors.push(`${e.file}: slug "${e.data?.slug}"`);
    const key = String(e.data?.slug ?? base).toLowerCase();
    if (seen.has(key)) errors.push(`${e.file}: slug repetido con ${seen.get(key)}`);
    else seen.set(key, e.file);
  }
  return errors;
}

/** C4: `order` entero y único donde va; ausente donde no. */
function orderErrors(name, entries) {
  const errors = [];
  const seen = new Map();
  for (const e of entries) {
    const has = e.data && Object.hasOwn(e.data, "order");
    if (!HAS_ORDER.has(name)) {
      if (has) errors.push(`${e.file}: ${name} no lleva order`);
      continue;
    }
    if (!has || !Number.isInteger(e.data.order)) {
      errors.push(`${e.file}: order no entero`);
      continue;
    }
    if (seen.has(e.data.order)) errors.push(`${e.file}: order ${e.data.order} repetido con ${seen.get(e.data.order)}`);
    else seen.set(e.data.order, e.file);
  }
  return errors;
}

/** C6: archivos fuera del formato canónico. */
const canonicalErrors = (entries) =>
  entries.filter((e) => e.data === undefined || JSON.stringify(e.data, null, 2) + "\n" !== e.raw).map((e) => e.file);

/** C7: slugs viejos en el texto de los JSON. */
const legacyErrors = (entries) =>
  entries.flatMap((e) =>
    Object.keys(LEGACY_ARTIST_SLUGS)
      .filter((from) => e.raw.toLowerCase().includes(from.toLowerCase()))
      .map((from) => `${e.file}: ${from}`),
  );

/** C5 (unidad): el índice que corresponde a estas entradas, comparado con un texto en disco. */
const indexMatches = (collection, entries, diskText, mode) =>
  renderIndex(collection, entries.map((e) => ({ slug: e.file.replace(/\.json$/, ""), data: e.data })), mode) === diskText;

// ── Lectura del disco ────────────────────────────────────────────────────────────────────────
const disk = {};
for (const { name } of COLLECTIONS) {
  const dir = path.join(ROOT, "content", name);
  const files = existsSync(dir) ? readdirSync(dir).sort() : null;
  const entryFiles = (files ?? []).filter((f) => ENTRY_FILE_RE.test(f) && statSync(path.join(dir, f)).isFile());
  const entries = entryFiles.map((file) => {
    const raw = readFileSync(path.join(dir, file), "utf8");
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = undefined;
    }
    return { file, raw, data };
  });
  disk[name] = { dir, files, entries };
}

// ── C1–C7 sobre content/ ─────────────────────────────────────────────────────────────────────
for (const { name } of COLLECTIONS) {
  const { files, entries } = disk[name];
  report(`C2 content/${name}/ existe`, files !== null);
  if (files === null) continue;
  info(`content/${name}/`, `${entries.length} entradas`);
  report(`C1 ${name}: ${entries.length} JSON validan contra el esquema`, schemaErrors(name, entries).length === 0, list(schemaErrors(name, entries)));
  report(`C2 ${name}: nombres kebab-case y sin archivos extraños`, nameErrors(files).length === 0, list(nameErrors(files)));
  report(`C3 ${name}: slug = nombre del archivo, sin duplicados`, slugErrors(entries).length === 0, list(slugErrors(entries)));
  report(
    `C4 ${name}: ${HAS_ORDER.has(name) ? "order entero y único" : "sin order"}`,
    orderErrors(name, entries).length === 0,
    list(orderErrors(name, entries)),
  );
  report(`C6 ${name}: formato canónico (2 espacios, salto final, sin escapar tildes)`, canonicalErrors(entries).length === 0, list(canonicalErrors(entries)));
  report(`C7 ${name}: ningún slug viejo de artista`, legacyErrors(entries).length === 0, list(legacyErrors(entries)));
}

// ── C5 índices ───────────────────────────────────────────────────────────────────────────────
{
  let built = null;
  let error = "";
  try {
    built = buildIndexes(ROOT);
  } catch (err) {
    error = err.message;
  }
  const stale = built ? Object.entries(built).filter(([rel, text]) => !existsSync(path.join(ROOT, rel)) || readFileSync(path.join(ROOT, rel), "utf8") !== text) : [];
  report("C5 los 5 índices de content/generated/ están al día (pnpm content:index)", built !== null && stale.length === 0, error || list(stale.map(([rel]) => rel)));
  const genDir = path.join(ROOT, "content/generated");
  const expected = COLLECTIONS.map((c) => path.basename(indexPath(c.name))).sort();
  const actual = existsSync(genDir) ? readdirSync(genDir).filter((f) => f !== ".DS_Store").sort() : [];
  report("C5 content/generated/ solo tiene los 5 índices", JSON.stringify(actual) === JSON.stringify(expected), actual.join(", "));
  const modes = COLLECTIONS.map((c) => `${c.name}:${currentMode(ROOT, c.name)}`);
  info("modo de los índices", modes.join(" "));
}

// ── C8 la API sale de content/ ───────────────────────────────────────────────────────────────
// Migración en curso (un commit por colección): las que faltan se saltan con INFO.
const PENDING = new Set(["releases", "videos", "journal"]);
{
  const fileSlugs = (name) => disk[name].entries.map((e) => e.data?.slug);
  const byOrder = (name) =>
    disk[name].entries
      .slice()
      .sort((a, b) => a.data.order - b.data.order)
      .map((e) => e.data.slug);
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const slugsOf = (arr) => arr.map((e) => e.slug);
  const MODULE_OF = { artists: "lib/artists.ts", releases: "lib/releases.ts", videos: "lib/videos.ts", events: "lib/events.ts", journal: "lib/journal.ts" };
  const API = {
    artists: () => ["artists = archivos ordenados por order", same(slugsOf(artists), byOrder("artists")), slugsOf(artists).join(" > ")],
    releases: () => [`releases = archivos ordenados por order (${releases.length})`, same(slugsOf(releases), byOrder("releases"))],
    videos: () => [`videos = archivos (${videos.length})`, same(slugsOf(videos).slice().sort(), fileSlugs("videos"))],
    events: () => [`events = archivos en orden de nombre (${events.length})`, same(slugsOf(events), fileSlugs("events"))],
    journal: () => [`journalPieces = archivos (${journalPieces.length})`, same(slugsOf(journalPieces), fileSlugs("journal"))],
  };
  for (const { name } of COLLECTIONS) {
    if (PENDING.has(name)) {
      info(`C8 ${name}: migración pendiente, sigue en ${MODULE_OF[name]}`);
      continue;
    }
    const [label, pass, detail] = API[name]();
    report(`C8 ${label}`, pass, detail);
    const wired = readFileSync(path.join(ROOT, MODULE_OF[name]), "utf8").includes(`from "../content/generated/${name}"`);
    report(`C8 ${MODULE_OF[name]} importa content/generated/${name}`, wired);
  }
  const withOrder = [artists, releases, videos, events, journalPieces].flat().filter((e) => "order" in e).map((e) => e.slug);
  report("C8 ninguna entrada exportada lleva order", withOrder.length === 0, list(withOrder));
  report("C8 journalPieces es un arreglo sin congelar (test:journal le agrega fixtures)", Array.isArray(journalPieces) && !Object.isFrozen(journalPieces));

  const walk = (dir) =>
    readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((d) => {
      const rel = path.join(dir, d.name);
      if (d.isDirectory()) return d.name === "node_modules" || d.name.startsWith(".") ? [] : walk(rel);
      return /\.(ts|tsx|mjs|js)$/.test(d.name) ? [rel] : [];
    });
  const importers = ["app", "components", "lib"]
    .flatMap(walk)
    .filter((f) => readFileSync(path.join(ROOT, f), "utf8").includes("content/generated"))
    .sort();
  const allowed = COLLECTIONS.filter((c) => !PENDING.has(c.name)).map((c) => MODULE_OF[c.name]).sort();
  report("C8 content/generated solo lo importan los módulos de lib/ de cada colección", same(importers, allowed), importers.join(", "));
}

// ── C9 deriva entre los tipos TS y los esquemas ──────────────────────────────────────────────
{
  /** Claves de primer nivel de `export type <name> = {` … `};` (líneas "  clave:" o "  clave?:"). */
  const typeKeys = (rel, name) => {
    const text = readFileSync(path.join(ROOT, rel), "utf8");
    const start = text.indexOf(`export type ${name} = {\n`);
    if (start < 0) return null;
    const block = text.slice(start, text.indexOf("\n};", start));
    return [...block.matchAll(/^ {2}(\w+)\??:/gm)].map((m) => m[1]).sort();
  };
  const shapeKeys = (schema, extra = []) => Object.keys(schema.shape).filter((k) => !extra.includes(k)).sort();
  const PAIRS = [
    ["lib/artists.ts", "Artist", artistSchema, ["order"]],
    ["lib/artists.ts", "ArtistLink", link, []],
    ["lib/artists.ts", "Release", artistRelease, []],
    ["lib/releases.ts", "Release", releaseSchema, ["order"]],
    ["lib/releases.ts", "Track", track, []],
    ["lib/videos.ts", "Video", videoSchema, []],
    ["lib/events.ts", "Event", eventSchema, []],
    ["lib/journal.ts", "JournalPiece", journalSchema, []],
    ["lib/journal.ts", "JournalImage", z.strictObject(journalImage), []],
  ];
  for (const [rel, name, schema, extra] of PAIRS) {
    const ts = typeKeys(rel, name);
    const zs = shapeKeys(schema, extra);
    report(`C9 ${rel} ${name}: mismas claves que el esquema`, ts !== null && JSON.stringify(ts) === JSON.stringify(zs), ts ? `TS ${ts.join(",")} | zod ${zs.join(",")}` : "tipo no encontrado");
  }
  const blockTypes = BLOCKS.map((b) => b.shape.type.value);
  report("C9 bloques del journal = JOURNAL_BLOCK_TYPES", JSON.stringify(blockTypes) === JSON.stringify([...JOURNAL_BLOCK_TYPES]), blockTypes.join(","));
}

// ── C10 autoprueba con fixtures en memoria ───────────────────────────────────────────────────
{
  const clone = (x) => structuredClone(x);
  const entry = (file, data) => ({ file, raw: JSON.stringify(data, null, 2) + "\n", data });
  // Fixtures válidas de control: la primera entrada exportada de cada módulo (con order donde va)
  // y una pieza del journal mínima (la colección está vacía).
  const withOrderFirst = (e, order) => {
    const { slug, ...others } = e;
    return { slug, order, ...others };
  };
  const base = {
    artists: withOrderFirst(clone(artists[0]), 10),
    releases: withOrderFirst(clone(releases[0]), 10),
    videos: clone(videos[0]),
    events: clone(events[0]),
    journal: {
      slug: "pieza-de-control",
      title: { es: "Título", en: "Title" },
      excerpt: { es: "Bajada.", en: "Excerpt." },
      body: { es: [{ type: "paragraph", text: "Texto." }], en: [{ type: "paragraph", text: "Text." }] },
      publishAt: "2026-11-10T10:00:00-03:00",
      author: "PHŌNÉ Records",
      artists: [artists[0].slug],
      releases: [],
      cover: { src: "/journal/pieza-de-control/portada.jpg", width: 1920, height: 1080, credit: "Foto: control", alt: { es: "Portada", en: "Cover" } },
      format: JOURNAL_FORMATS[0],
    },
  };
  for (const name of Object.keys(base)) {
    const errs = schemaErrors(name, [entry(`${base[name].slug}.json`, base[name])]);
    report(`C10 control: la fixture válida de ${name} pasa el esquema`, errs.length === 0, list(errs));
  }

  const mutate = (name, fn) => {
    const d = clone(base[name]);
    fn(d);
    return schemaErrors(name, [entry(`${d.slug}.json`, d)]);
  };
  const NEGATIVE = [
    ["clave desconocida relaseDate", "releases", (d) => (d.relaseDate = d.releaseDate)],
    ["falta title", "releases", (d) => delete d.title],
    ['label: ""', "releases", (d) => (d.label = "")],
    ["thumb: null", "videos", (d) => (d.thumb = null)],
    ['type: "lp"', "releases", (d) => (d.type = "lp")],
    ['releaseDate: "30-10-2026"', "releases", (d) => (d.releaseDate = "30-10-2026")],
    ['publishAt: "2026-11-10T10:00:00Z"', "journal", (d) => (d.publishAt = "2026-11-10T10:00:00Z")],
    ["order en un video", "videos", (d) => (d.order = 10)],
    ["artista sin order", "artists", (d) => delete d.order],
    ['displayTitle: { es } sin en', "videos", (d) => (d.displayTitle = { es: "Solo ES" })],
    ['bloque { type: "lista" }', "journal", (d) => d.body.es.push({ type: "lista", text: "x" })],
  ];
  for (const [label, name, fn] of NEGATIVE) {
    const errs = mutate(name, fn);
    report(`C10 rechaza ${label} (${name})`, errs.length > 0, errs[0] ?? "aceptada");
  }

  const a = base.artists;
  const b = { ...clone(a), slug: "otro-artista" };
  report("C10 control: order distinto pasa", orderErrors("artists", [entry(`${a.slug}.json`, a), entry("otro-artista.json", { ...b, order: 20 })]).length === 0);
  report("C10 rechaza order repetido", orderErrors("artists", [entry(`${a.slug}.json`, a), entry("otro-artista.json", b)]).length > 0);
  report("C10 control: nombre kebab pasa", nameErrors(["newen-afrobeat.json", ".gitkeep"]).length === 0);
  report("C10 rechaza el archivo Foo.json", nameErrors(["Foo.json"]).length > 0);
  report("C10 rechaza un archivo que no es JSON (notas.txt)", nameErrors(["notas.txt"]).length > 0);
  report("C10 rechaza slug distinto del nombre del archivo", slugErrors([entry("otro-slug.json", a)]).length > 0);
  report("C10 rechaza slugs que solo difieren en mayúsculas", slugErrors([entry("ab.json", { slug: "ab" }), entry("AB.json", { slug: "AB" })]).length > 0);
  report("C10 rechaza JSON con 4 espacios", canonicalErrors([{ file: "x.json", raw: JSON.stringify(a, null, 4) + "\n", data: a }]).length > 0);
  report("C10 rechaza un slug viejo en el texto", Object.keys(LEGACY_ARTIST_SLUGS).length > 0 && legacyErrors([entry("x.json", { slug: "x", notes: `ver ${Object.keys(LEGACY_ARTIST_SLUGS)[0]}` })]).length > 0);

  const videosCol = COLLECTIONS.find((c) => c.name === "videos");
  const diskIndex = readFileSync(path.join(ROOT, indexPath("videos")), "utf8");
  const mode = currentMode(ROOT, "videos");
  report("C10 control: los archivos de videos calzan con su índice", indexMatches(videosCol, disk.videos.entries, diskIndex, mode));
  report(
    "C10 rechaza una lista de archivos que no coincide con el índice (un video de más)",
    !indexMatches(videosCol, [...disk.videos.entries, entry("zz-video-nuevo.json", { slug: "zz-video-nuevo" })], diskIndex, mode),
  );
  report("C10 rechaza una lista de archivos que no coincide con el índice (uno de menos)", disk.videos.entries.length === 0 || !indexMatches(videosCol, disk.videos.entries.slice(1), diskIndex, mode));
}

// ── C11 bundle del navegador ─────────────────────────────────────────────────────────────────
{
  const DATA = new Set(["lib/artists.ts", "lib/releases.ts", "lib/videos.ts", "lib/events.ts", "lib/journal.ts"]);
  const resolveLocal = (from, spec) => {
    let base;
    if (spec.startsWith("@/")) base = path.join(ROOT, spec.slice(2));
    else if (spec.startsWith(".")) base = path.resolve(path.dirname(path.join(ROOT, from)), spec);
    else return null;
    for (const cand of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
      if (existsSync(cand) && statSync(cand).isFile()) return path.relative(ROOT, cand);
    }
    return null;
  };
  /** Imports y re-exports de valor (los `import type` y los que solo traen tipos no llegan al bundle). */
  const valueImports = (rel) => {
    const code = readFileSync(path.join(ROOT, rel), "utf8");
    const out = [];
    for (const m of code.matchAll(/^(?:import|export)\s+([^;]*?)\s+from\s+["']([^"']+)["']/gm)) {
      const clause = m[1].trim();
      if (/^type\s/.test(clause)) continue;
      const named = /^\{([^}]*)\}$/.exec(clause);
      if (named && named[1].split(",").map((s) => s.trim()).filter(Boolean).every((s) => s.startsWith("type "))) continue;
      out.push(m[2]);
    }
    for (const m of code.matchAll(/^import\s+["']([^"']+)["']/gm)) out.push(m[1]);
    return out;
  };
  const walk = (dir) =>
    readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((d) => {
      const rel = path.join(dir, d.name);
      if (d.isDirectory()) return d.name.startsWith(".") ? [] : walk(rel);
      return /\.(ts|tsx)$/.test(d.name) ? [rel] : [];
    });
  const clients = ["app", "components", "lib"].flatMap(walk).filter((f) => /^\s*["']use client["']/.test(readFileSync(path.join(ROOT, f), "utf8")));
  const leaks = [];
  for (const entryFile of clients) {
    const seen = new Set([entryFile]);
    const queue = [[entryFile, [entryFile]]];
    while (queue.length) {
      const [file, chain] = queue.shift();
      for (const spec of valueImports(file)) {
        const target = resolveLocal(file, spec);
        if (!target || seen.has(target)) continue;
        seen.add(target);
        if (DATA.has(target) || target.startsWith("content/")) {
          leaks.push([...chain, target].join(" → "));
          continue;
        }
        queue.push([target, [...chain, target]]);
      }
    }
  }
  report(`C11 ningún componente cliente (${clients.length}) importa datos de lib/ ni content/`, clients.length > 0 && leaks.length === 0, list(leaks, 4));
}

console.log(ok ? "OK   test:content" : "FAIL test:content");
process.exit(ok ? 0 : 1);
