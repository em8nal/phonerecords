// Prueba de ventanas del carrusel: pnpm test:banners  (node --import ./scripts/ts-resolve-hook.mjs scripts/test-banners.mjs)
// Comprueba (FAIL):
//   1. el orden exacto de slides en instantes clave (hora de Santiago: -03:00 de octubre a diciembre);
//   2. el CTA de La Fuerza y Un Rezo: Pre-save hasta el último segundo antes del estreno y Escuchar
//      desde las 00:00;
//   3. invariantes con barrido horario del 20-10 al 31-12 más ±1 s en cada borde (ventanas y
//      estrenos): entre 1 y 4 slides, sin slug repetido y, desde el 21-10, una entrada por artista;
//   4. por entrada: ventana no vacía; las ventanas de pre-save (endsAt ≤ estreno) empiezan antes del
//      estreno y dicen "Pre-save"; las ventanas de un mismo slug son contiguas (sin huecos ni
//      solapes); si secondaryHref es /releases/<slug>, la ficha existe y es la del mismo slug, y si
//      la ficha tiene smartLink y el CTA no es YouTube, cta.href === smartLink.
// Con --dias imprime el carrusel de cada día del 29-10 al 02-12 (a las 12:00) para el reporte:
//   node --import ./scripts/ts-resolve-hook.mjs scripts/test-banners.mjs --dias
import { BANNER_ENTRIES, getActiveBanners, isReleased } from "../lib/banner.ts";
import { releases } from "../lib/releases.ts";
import { releaseStartMs } from "../lib/release-date.ts";

let ok = true;
const report = (label, pass, detail) => {
  ok &&= pass;
  console.log(`${pass ? "OK  " : "FAIL"} ${label}${detail ? " -> " + detail : ""}`);
};

const LF = "newen-afrobeat-la-fuerza";
const DT = "klaus-b-destellos-de-ti";
const EV = "rosario-lircay-en-vela";
const CV = "con-fusion-cuantas-veces";
const UR = "klaus-b-un-rezo";
const UC = "klaus-b-una-cuota-de-caos";

// --- 1. Orden por instante ---------------------------------------------------------------
const cases = [
  ["2026-10-21T12:00:00-03:00", [DT, EV, LF, CV]],
  ["2026-10-22T12:00:00-03:00", [DT, EV, LF, CV]],
  ["2026-10-23T12:00:00-03:00", [LF, DT, EV, CV]],
  ["2026-10-30T12:00:00-03:00", [LF, DT, EV, CV]],
  ["2026-11-05T12:00:00-03:00", [UR, LF, CV]],
  ["2026-11-20T12:00:00-03:00", [UC, LF, CV]],
  ["2026-11-30T12:00:00-03:00", [UC, CV]],
  ["2026-12-01T12:00:00-03:00", [UC]],
  // P19: Destellos de ti deja su lugar al pre-save de Un Rezo el 31-10; La Fuerza sigue primera.
  ["2026-10-29T12:00:00-03:00", [LF, DT, EV, CV]],
  ["2026-10-30T00:00:00-03:00", [LF, DT, EV, CV]],
  ["2026-10-30T23:59:59-03:00", [LF, DT, EV, CV]],
  ["2026-10-31T00:00:00-03:00", [LF, UR, EV, CV]],
  ["2026-10-31T12:00:00-03:00", [LF, UR, EV, CV]],
  ["2026-11-04T12:00:00-03:00", [LF, UR, EV, CV]],
  ["2026-11-04T23:59:59-03:00", [LF, UR, EV, CV]],
  ["2026-11-05T00:00:00-03:00", [UR, LF, CV]],
];
for (const [iso, expected] of cases) {
  const got = getActiveBanners(new Date(iso)).map((b) => b.slug);
  report(iso, JSON.stringify(got) === JSON.stringify(expected), got.join(" > "));
}

// --- 2. Estado del CTA -------------------------------------------------------------------
/** Texto del CTA de `slug` en `iso` (es/en), o null si no está en el carrusel. */
function ctaAt(slug, iso) {
  const now = new Date(iso);
  const b = getActiveBanners(now).find((x) => x.slug === slug);
  if (!b) return null;
  return isReleased(b, now) ? b.cta.afterRelease : b.cta.beforeRelease;
}
const PRE = { es: "Pre-save", en: "Pre-save" };
const LISTEN = { es: "Escuchar", en: "Listen" };
const ctaCases = [
  [LF, "2026-10-29T12:00:00-03:00", PRE],
  [LF, "2026-10-29T23:59:59-03:00", PRE],
  [LF, "2026-10-30T00:00:00-03:00", LISTEN],
  [UR, "2026-10-31T00:00:00-03:00", PRE],
  [UR, "2026-11-04T23:59:59-03:00", PRE],
  [UR, "2026-11-05T00:00:00-03:00", LISTEN],
];
for (const [slug, iso, expected] of ctaCases) {
  const got = ctaAt(slug, iso);
  report(`CTA ${slug} ${iso}`, JSON.stringify(got) === JSON.stringify(expected), got ? `${got.es} / ${got.en}` : "no está en el carrusel");
}

// --- 3. Invariantes en el tiempo -----------------------------------------------------------
const SWEEP_FROM = Date.parse("2026-10-20T00:00:00-03:00");
const SWEEP_TO = Date.parse("2026-12-31T23:00:00-03:00");
const ONE_ARTIST_FROM = Date.parse("2026-10-21T00:00:00-03:00");
const instants = new Set();
for (let t = SWEEP_FROM; t <= SWEEP_TO; t += 3_600_000) instants.add(t);
const borders = BANNER_ENTRIES.flatMap((b) => [Date.parse(b.startsAt), b.endsAt ? Date.parse(b.endsAt) : null, releaseStartMs(b.releaseDate)]);
for (const t of borders) {
  if (t === null) continue;
  for (const d of [-1000, 0, 1000]) if (t + d >= SWEEP_FROM && t + d <= SWEEP_TO) instants.add(t + d);
}
const violations = [];
for (const t of [...instants].sort((a, b) => a - b)) {
  const active = getActiveBanners(new Date(t));
  const at = new Date(t).toISOString();
  if (active.length < 1 || active.length > 4) violations.push(`${at}: ${active.length} slides`);
  const slugs = active.map((b) => b.slug);
  if (new Set(slugs).size !== slugs.length) violations.push(`${at}: slug repetido (${slugs.join(", ")})`);
  const artistsNow = active.map((b) => b.artist);
  if (t >= ONE_ARTIST_FROM && new Set(artistsNow).size !== artistsNow.length) violations.push(`${at}: artista repetido (${artistsNow.join(", ")})`);
}
report(
  `invariantes en ${instants.size} instantes (20-10 → 31-12, cada hora y ±1 s en cada borde): 1–4 slides, sin slug repetido, una entrada por artista desde el 21-10`,
  violations.length === 0,
  violations.slice(0, 5).join(" · ") + (violations.length > 5 ? ` (+${violations.length - 5})` : ""),
);

// --- 4. Reglas por entrada ---------------------------------------------------------------
const releaseBySlug = new Map(releases.map((r) => [r.slug, r]));
const entryProblems = [];
for (const b of BANNER_ENTRIES) {
  const id = `${b.slug}@${b.startsAt}`;
  const start = Date.parse(b.startsAt);
  const end = b.endsAt ? Date.parse(b.endsAt) : Infinity;
  if (!(start < end)) entryProblems.push(`${id}: ventana vacía`);
  const releaseAt = releaseStartMs(b.releaseDate);
  if (releaseAt !== null && end <= releaseAt) {
    if (!(start < releaseAt)) entryProblems.push(`${id}: ventana de pre-save que no empieza antes del estreno`);
    if (b.cta.beforeRelease.es !== "Pre-save" || b.cta.beforeRelease.en !== "Pre-save") entryProblems.push(`${id}: ventana de pre-save sin CTA "Pre-save"`);
  }
  const m = /^\/releases\/([^/?#]+)$/.exec(b.secondaryHref);
  if (m) {
    const r = releaseBySlug.get(m[1]);
    if (!r) entryProblems.push(`${id}: secondaryHref a una ficha que no existe (${m[1]})`);
    else {
      if (m[1] !== b.slug) entryProblems.push(`${id}: secondaryHref a otra ficha (${m[1]})`);
      if (r.smartLink && !/youtube\.com|youtu\.be/.test(b.cta.href) && b.cta.href !== r.smartLink) {
        entryProblems.push(`${id}: cta.href ${b.cta.href} ≠ smartLink ${r.smartLink}`);
      }
    }
  }
}
const bySlug = new Map();
for (const b of BANNER_ENTRIES) bySlug.set(b.slug, [...(bySlug.get(b.slug) ?? []), b]);
for (const [slug, entries] of bySlug) {
  const sorted = [...entries].sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  for (let i = 1; i < sorted.length; i++) {
    const prevEnd = sorted[i - 1].endsAt ? Date.parse(sorted[i - 1].endsAt) : Infinity;
    const nextStart = Date.parse(sorted[i].startsAt);
    if (prevEnd !== nextStart) entryProblems.push(`${slug}: ${sorted[i - 1].endsAt ?? "sin fin"} → ${sorted[i].startsAt} (${prevEnd < nextStart ? "hueco" : "solape"})`);
  }
}
report(
  `reglas por entrada (${BANNER_ENTRIES.length}): ventanas no vacías, pre-save antes del estreno, ventanas contiguas por slug, ficha y smart link`,
  entryProblems.length === 0,
  entryProblems.join(" · "),
);

// --- Tabla por día (--dias) --------------------------------------------------------------
if (process.argv.includes("--dias")) {
  const first = Date.parse("2026-10-29T12:00:00-03:00");
  const last = Date.parse("2026-12-02T12:00:00-03:00");
  console.log("\nCarrusel por día (12:00, hora de Santiago):");
  for (let t = first; t <= last; t += 86_400_000) {
    const now = new Date(t);
    // dd-mm del día en Santiago (-03:00 en todo el rango).
    const label = new Date(t - 3 * 3_600_000).toISOString().slice(5, 10).split("-").reverse().join("-");
    const row = getActiveBanners(now)
      .map((b) => `${b.title.es} [${(isReleased(b, now) ? b.cta.afterRelease : b.cta.beforeRelease).es}]`)
      .join(" > ");
    console.log(`  ${label}  ${row}`);
  }
}

process.exit(ok ? 0 : 1);
