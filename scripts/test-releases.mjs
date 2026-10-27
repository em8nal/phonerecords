// Prueba de fichas, slugs y redirects: pnpm test:releases
//   (node --import ./scripts/ts-resolve-hook.mjs scripts/test-releases.mjs)
// Comprueba (FAIL):
//   todo artistSlug / featuredArtistSlugs de lib/releases.ts y todo /artistas/<x> de
//   BANNER_ENTRIES existe en lib/artists.ts; ningún .ts(x) de lib/ contiene un slug viejo
//   de LEGACY_ARTIST_SLUGS salvo lib/artist-slugs.ts (las claves se leen del módulo); los
//   destinos de los alias existen y no son a su vez slugs viejos; spotifyRefFromLinks lee
//   todo enlace de Spotify que no sea un perfil /artist/; releaseTitle ≤ 60 caracteres con
//   el sufijo de la plantilla de app/layout.tsx; getArtistEntries sin duplicados y ninguna
//   entrada liviana de lib/artists.ts repite una ficha; redirects de next.config.mjs: todos
//   permanentes, las 5 formas por slug viejo y las 2 de claudio-solis, en un solo salto
//   (probado con getPathMatch y compile de Next, como los aplica el servidor); la ficha de
//   lanzamiento se renderiza por petición (app/layout.tsx lee headers() o cookies()) o
//   declara revalidate/dynamic, porque corta el reproductor y datePublished con isReleased().
// Avisos (WARN, no fallan): ficha ya publicada (isReleased de lib/release-date.ts) sin
//   enlace de Spotify ni de Apple Music; artista sin public/press-kits/<slug>-{es,en}.pdf.
// INFO: entradas de discografía por artista (ficha de artista = press kit).
// `fs` solo vive aquí: el sitio no lee archivos en tiempo de ejecución para esto.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { releases, spotifyRefFromLinks, releaseTitle, TITLE_SUFFIX, MAX_TITLE_LENGTH } from "../lib/releases.ts";
import { artists, LEGACY_ARTIST_SLUGS, resolveArtistSlug } from "../lib/artists.ts";
import { BANNER_ENTRIES } from "../lib/banner.ts";
import { getArtistEntries } from "../lib/catalog.ts";
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

// --- Títulos -----------------------------------------------------------------------------
const layoutSrc = readFileSync(path.join(ROOT, "app/layout.tsx"), "utf8");
const template = /template:\s*(['"`])%s(.*?)\1/.exec(layoutSrc)?.[2];
report("TITLE_SUFFIX coincide con la plantilla de app/layout.tsx", template === TITLE_SUFFIX, `plantilla "%s${template ?? "?"}"`);
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
// La ficha de lanzamiento muestra el reproductor y datePublished solo si isReleased(). Es exacto
// a las 00:00 de Santiago mientras la ruta se renderice por petición: hoy lo fuerza el layout raíz.
// Si H2 quita headers()/cookies() del layout, la ruta pasa a estática y el corte se congela en el
// build; entonces la página tiene que declarar `export const revalidate = 3600` (o dynamic).
const releasePageSrc = readFileSync(path.join(ROOT, "app/[lang]/releases/[slug]/page.tsx"), "utf8");
const layoutPerRequest = /\bawait\s+(?:headers|cookies)\(\)/.test(layoutSrc);
const pageRevalidates = /export\s+const\s+(?:revalidate|dynamic)\s*=/.test(releasePageSrc);
report(
  "ficha de lanzamiento por petición o con revalidate (corte de isReleased)",
  layoutPerRequest || pageRevalidates,
  layoutPerRequest
    ? "app/layout.tsx lee headers()/cookies()"
    : pageRevalidates
      ? "la página declara revalidate/dynamic"
      : "app/layout.tsx ya no lee headers()/cookies(): agrega `export const revalidate = 3600` a app/[lang]/releases/[slug]/page.tsx",
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
const LISTEN_RE = /open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(?:album|track|playlist)\/|music\.apple\.com\//;
const noListen = releases.filter((r) => isReleased(r.releaseDate) && !(r.links ?? []).some((l) => LISTEN_RE.test(l.href)));
for (const r of noListen) warn(`ficha publicada sin Spotify ni Apple Music: ${r.slug}`, (r.links ?? []).map((l) => l.label).join(" · ") || "sin enlaces");

for (const a of artists) {
  const missing = ["es", "en"].filter((l) => !existsSync(path.join(ROOT, "public/press-kits", `${a.slug}-${l}.pdf`)));
  if (missing.length) warn(`press kit PDF ausente: ${a.slug}`, missing.map((l) => `${a.slug}-${l}.pdf`).join(", "));
}

info("entradas de discografía por artista (ficha = press kit)", artists.map((a) => `${a.slug} ${getArtistEntries(a.slug).length}`).join(" · "));

process.exit(ok ? 0 : 1);
