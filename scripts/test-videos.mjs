// Prueba del catálogo de videos: pnpm test:videos
//   (node --import ./scripts/ts-resolve-hook.mjs scripts/test-videos.mjs)
// Fuente de verdad: `videos` de lib/videos.ts. Comprueba (FAIL):
//   ≥15 videos; slugs únicos y en kebab-case; youtubeId de 11 caracteres y únicos;
//   artistSlug existente en lib/artists.ts y artistName igual al del roster;
//   releaseSlug existente en lib/releases.ts si viene; kind válido; fecha
//   "YYYY-MM" o "YYYY-MM-DD" válida; durationSec entero > 0 si viene;
//   description.es/.en con 60–200 palabras, distintas entre sí y sin URLs;
//   `videos` ordenado por fecha desc; ≤6 `featured` por artista; créditos con role y name;
//   `thumb` solo "hqdefault"; `recordedYear` entero entre 1990 y el año de `date`.
//   16a: `displayTitle` obligatorio si el oficial trae etiquetas ("Video Oficial",
//   "Visualizer", "Prod by"…), MAYÚSCULAS sostenidas, " - ", "|" o el artista; cada
//   displayTitle limpio (sin etiquetas, mayúsculas, separadores ni artista, 1–60
//   caracteres, ES ≠ EN si es objeto); <title> final (videoMetaTitle) ≤ TITLE_MAX en
//   ES y EN; casos exactos de videoDisplayTitle y videoMetaTitle.
// Avisos (WARN, no fallan): fecha futura; releaseSlug de otro artista; primeros
//   60 caracteres de description.es repetidos entre videos; frases autorreferenciales
//   que se vuelven falsas al crecer el catálogo ("en el sitio", "el único video"…);
//   notas internas o hedging en copy público ("por confirmar", "lo que sugiere"…).
import { videos, VIDEO_KINDS, getVideo, videoDisplayTitle, videoMetaTitle } from "../lib/videos.ts";
import { artists } from "../lib/artists.ts";
import { releaseSlugs, getRelease } from "../lib/releases.ts";
import { templatedTitle, titleLength, TITLE_MAX } from "../lib/seo.ts";

let ok = true;
const report = (label, pass, detail) => {
  ok &&= pass;
  console.log(`${pass ? "OK  " : "FAIL"} ${label}${detail ? " -> " + detail : ""}`);
};
const warn = (label, detail) => console.log(`WARN ${label}${detail ? " -> " + detail : ""}`);
const list = (arr) => (arr.length ? arr.join(", ") : "");

const words = (s) => String(s ?? "").trim().split(/\s+/).filter(Boolean).length;
const SLUG_RE = /^[a-z0-9-]+$/;
const YT_RE = /^[A-Za-z0-9_-]{11}$/;
const DATE_RE = /^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/;
const nameBySlug = new Map(artists.map((a) => [a.slug, a.name]));
const releaseSet = new Set(releaseSlugs);
const kindSet = new Set(VIDEO_KINDS);

report(`≥15 videos (hay ${videos.length})`, videos.length >= 15);

const slugs = videos.map((v) => v.slug);
report("slugs únicos", new Set(slugs).size === slugs.length);
report("slugs en kebab-case", videos.every((v) => SLUG_RE.test(v.slug)), list(slugs.filter((s) => !SLUG_RE.test(s))));

const ids = videos.map((v) => v.youtubeId);
report("youtubeId de 11 caracteres", ids.every((id) => YT_RE.test(id)), list(ids.filter((id) => !YT_RE.test(id))));
report("youtubeId únicos", new Set(ids).size === ids.length);

const badArtist = videos.filter((v) => !nameBySlug.has(v.artistSlug));
report("artistSlug existe en artists", badArtist.length === 0, list(badArtist.map((v) => `${v.slug}:${v.artistSlug}`)));
const badName = videos.filter((v) => nameBySlug.has(v.artistSlug) && nameBySlug.get(v.artistSlug) !== v.artistName);
report("artistName = artists[].name", badName.length === 0, list(badName.map((v) => `${v.slug}:${v.artistName}`)));

const badRelease = videos.filter((v) => v.releaseSlug && !releaseSet.has(v.releaseSlug));
report("releaseSlug existe en releases (si viene)", badRelease.length === 0, list(badRelease.map((v) => `${v.slug}:${v.releaseSlug}`)));

const badKind = videos.filter((v) => !kindSet.has(v.kind));
report("kind válido", badKind.length === 0, list(badKind.map((v) => `${v.slug}:${v.kind}`)));

const badDate = videos.filter((v) => !DATE_RE.test(v.date));
report("date con formato YYYY-MM[-DD]", badDate.length === 0, list(badDate.map((v) => `${v.slug}:${v.date}`)));

const badDur = videos.filter((v) => v.durationSec !== undefined && !(Number.isInteger(v.durationSec) && v.durationSec > 0));
report("durationSec entero > 0 (si viene)", badDur.length === 0, list(badDur.map((v) => `${v.slug}:${v.durationSec}`)));

const counts = videos.map((v) => ({ slug: v.slug, es: words(v.description?.es), en: words(v.description?.en) }));
const outOfRange = counts.filter((c) => c.es < 60 || c.es > 200 || c.en < 60 || c.en > 200);
report(
  "description.es/.en entre 60 y 200 palabras",
  outOfRange.length === 0,
  outOfRange.length ? list(outOfRange.map((c) => `${c.slug} (es ${c.es}, en ${c.en})`)) : `min ${Math.min(...counts.flatMap((c) => [c.es, c.en]))} · max ${Math.max(...counts.flatMap((c) => [c.es, c.en]))}`,
);
const sameText = videos.filter((v) => v.description?.es?.trim() === v.description?.en?.trim());
report("description.es ≠ description.en", sameText.length === 0, list(sameText.map((v) => v.slug)));
const withUrl = videos.filter((v) => /https?:\/\/|www\./i.test(`${v.description?.es} ${v.description?.en}`));
report("descriptions sin URLs", withUrl.length === 0, list(withUrl.map((v) => v.slug)));

const sorted = videos.every((v, i) => i === 0 || videos[i - 1].date.localeCompare(v.date) >= 0);
report("videos ordenado por fecha desc", sorted);

const featuredBy = new Map();
for (const v of videos) if (v.featured) featuredBy.set(v.artistSlug, (featuredBy.get(v.artistSlug) ?? 0) + 1);
const tooMany = [...featuredBy.entries()].filter(([, n]) => n > 6);
report("≤6 featured por artista", tooMany.length === 0, list(tooMany.map(([s, n]) => `${s}:${n}`)));

const badCredits = videos.filter((v) => v.credits && !v.credits.every((c) => c && typeof c.role === "string" && c.role.trim() && typeof c.name === "string" && c.name.trim()));
report("credits[] con role y name", badCredits.length === 0, list(badCredits.map((v) => v.slug)));

const badThumb = videos.filter((v) => v.thumb !== undefined && v.thumb !== "hqdefault");
report('thumb solo "hqdefault" (si viene)', badThumb.length === 0, list(badThumb.map((v) => `${v.slug}:${v.thumb}`)));

const badRec = videos.filter((v) => v.recordedYear !== undefined && !(Number.isInteger(v.recordedYear) && v.recordedYear >= 1990 && v.recordedYear <= Number(v.date.slice(0, 4))));
report("recordedYear entero entre 1990 y el año de date (si viene)", badRec.length === 0, list(badRec.map((v) => `${v.slug}:${v.recordedYear}`)));

// ── 16a: displayTitle y <title> ≤ 60 ──
// Etiquetas de YouTube y mayúsculas sostenidas (dos o más palabras en mayúsculas seguidas).
// `\b` no sirve con tildes: los bordes se miran con \p{L}.
const TAGS = /prod\.?\s*by|visuali[sz]er|lyric video|video\s*oficial|videoclip\s*oficial|official video|live session/i;
const SHOUT = /(?<!\p{L})\p{Lu}{3,}(?:[\s.&\/-]+\p{Lu}{2,})+(?!\p{L})/u;
const LANGS = ["es", "en"];
const needsDisplay = (v) =>
  TAGS.test(v.title) || SHOUT.test(v.title) || v.title.includes(" - ") || v.title.includes("|") ||
  v.title.toLowerCase().includes(v.artistName.toLowerCase());
const missingDisplay = videos.filter((v) => needsDisplay(v) && !v.displayTitle);
report(
  `displayTitle donde el oficial trae etiquetas, MAYÚSCULAS, " - ", "|" o el artista (${videos.filter(needsDisplay).length} videos)`,
  missingDisplay.length === 0,
  list(missingDisplay.map((v) => v.slug)),
);

const badDisplay = [];
for (const v of videos) {
  if (v.displayTitle === undefined) continue;
  const d = v.displayTitle;
  if (typeof d !== "string" && !(d && typeof d.es === "string" && typeof d.en === "string")) {
    badDisplay.push(`${v.slug}: forma inválida`);
    continue;
  }
  if (typeof d !== "string" && d.es === d.en) badDisplay.push(`${v.slug}: es = en (usar string)`);
  for (const lang of LANGS) {
    const t = typeof d === "string" ? d : d[lang];
    const problems = [];
    if (t !== t.trim() || /\s{2,}/.test(t)) problems.push("espacios");
    if (titleLength(t) < 1 || titleLength(t) > 60) problems.push(`largo ${titleLength(t)}`);
    if (TAGS.test(t)) problems.push("etiqueta");
    if (SHOUT.test(t)) problems.push("mayúsculas");
    if (t.includes(" - ") || t.includes("|")) problems.push("separador");
    if (t.toLowerCase().includes(v.artistName.toLowerCase())) problems.push("nombra al artista");
    if (problems.length) badDisplay.push(`${v.slug} [${lang}] "${t}": ${problems.join(", ")}`);
  }
}
report("displayTitle limpio: sin etiquetas, MAYÚSCULAS, separadores ni artista; 1–60; ES ≠ EN si es objeto", badDisplay.length === 0, list(badDisplay));

const longTitles = [];
let maxTitle = 0;
let absCount = { es: 0, en: 0 };
for (const v of videos) {
  for (const lang of LANGS) {
    const { title, absolute } = videoMetaTitle(v, lang);
    const n = titleLength(absolute ? title : templatedTitle(title));
    maxTitle = Math.max(maxTitle, n);
    if (absolute) absCount[lang]++;
    if (n > TITLE_MAX) longTitles.push(`${v.slug} [${lang}] ${n}`);
  }
}
report(
  `<title> de la ficha de video ≤ ${TITLE_MAX} con la plantilla (${videos.length} × es/en)`,
  longTitles.length === 0,
  longTitles.length ? list(longTitles) : `máx ${maxTitle} · sin plantilla: es ${absCount.es}, en ${absCount.en}`,
);

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const vid = (slug) => {
  const v = getVideo(slug);
  if (!v) throw new Error(`falta el video ${slug}`);
  return v;
};
const displayCases = [
  [videoDisplayTitle(vid("klaus-b-destellos-de-ti"), "es"), "Destellos de ti", "videoDisplayTitle(destellos, es)"],
  [videoDisplayTitle(vid("newen-afrobeat-grietas-lyric-video"), "en"), "Grietas (with Lido Pimienta)", "videoDisplayTitle(grietas-lyric, en)"],
  [videoDisplayTitle({ title: "X" }, "es"), "X", "videoDisplayTitle sin displayTitle → oficial"],
  [videoMetaTitle(vid("klaus-b-destellos-de-ti"), "es"), { title: "Destellos de ti — Klaus B", absolute: false }, "videoMetaTitle(destellos, es)"],
  [videoMetaTitle(vid("klaus-b-el-secreto-visualizer"), "es"), { title: "Klaus B - El Secreto (Visualizer)", absolute: false }, "videoMetaTitle(el-secreto, es): el oficial cabe"],
  [videoMetaTitle(vid("con-fusion-cuantas-veces"), "es"), { title: "Cuántas veces (feat. NuVee) — Con.fusión", absolute: false }, "videoMetaTitle(cuantas-veces, es)"],
  [videoMetaTitle(vid("klaus-b-quisiera-entender"), "es"), { title: "Quisiera Entender (feat. Fran Ri & Newen Afrobeat) — Klaus B", absolute: true }, "videoMetaTitle(quisiera-entender, es): sin plantilla"],
  [videoMetaTitle(vid("con-fusion-sesiones-bugambilia"), "es"), { title: "Sesiones Bugambilia (feat. Simon Squalo & DJ Eseté)", absolute: true }, "videoMetaTitle(sesiones-bugambilia, es): sin artista ni plantilla"],
];
for (const [got, want, label] of displayCases) report(label, eq(got, want), eq(got, want) ? "" : `${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`);

// ── Avisos ──
const today = new Date().toISOString().slice(0, 10);
const future = videos.filter((v) => v.date.localeCompare(today) > 0);
if (future.length) warn("fecha posterior a hoy (quedan ocultos hasta esa fecha)", list(future.map((v) => `${v.slug}:${v.date}`)));

const foreign = videos.filter((v) => {
  if (!v.releaseSlug) return false;
  const r = getRelease(v.releaseSlug);
  return r && r.artistSlug !== v.artistSlug && !(r.featuredArtistSlugs ?? []).includes(v.artistSlug);
});
if (foreign.length) warn("releaseSlug de otro artista", list(foreign.map((v) => `${v.slug}:${v.releaseSlug}`)));

// Frases que se vuelven falsas cuando el catálogo crece (nadie las vuelve a leer) y
// notas internas que no deben salir en copy público. Avisan; se arreglan redactando.
const SELF_REF = /\b(en el sitio|en este sitio|del catálogo de videos|en este catálogo|on this site|in the video catalogue|in this catalogue|los dos únicos|las dos únicas|el único video|la única pieza|the only two|the only video|the only piece)\b/i;
const INTERNAL = /\b(por confirmar|se completarán|queda pendiente|to be confirmed|will be completed|lo que sugiere|which suggests)\b/i;
for (const v of videos) {
  const text = `${v.description?.es ?? ""} ${v.description?.en ?? ""}`;
  const m1 = text.match(SELF_REF);
  if (m1) warn("frase autorreferencial frágil", `${v.slug}: "${m1[0]}"`);
  const m2 = text.match(INTERNAL);
  if (m2) warn("nota interna o hedging en copy público", `${v.slug}: "${m2[0]}"`);
}

const seenStart = new Map();
for (const v of videos) {
  const key = (v.description?.es ?? "").slice(0, 60);
  if (seenStart.has(key)) warn("inicio de description.es repetido", `${v.slug} = ${seenStart.get(key)}`);
  else seenStart.set(key, v.slug);
}

// Resumen por artista
const perArtist = new Map();
for (const v of videos) perArtist.set(v.artistSlug, (perArtist.get(v.artistSlug) ?? 0) + 1);
console.log(`INFO videos por artista: ${[...perArtist.entries()].map(([s, n]) => `${s}=${n}`).join(" · ")}`);

process.exit(ok ? 0 : 1);
