// Volcado canónico de los datos del sitio (carril S del p19): invariante "cero cambios de contenido"
// al pasar los datos de lib/*.ts a content/<colección>/<slug>.json.
//
//   node --import ./scripts/ts-resolve-hook.mjs scripts/content-snapshot.mjs [--root <dir>] [--out <archivo>]
//
// Vuelca todo lo que exportan lib/artists.ts, lib/releases.ts, lib/videos.ts, lib/events.ts y
// lib/journal.ts, la salida de sus helpers para todos los slugs y la de los módulos que recorren
// esos datos (catálogo, banners, datos clave, JSON-LD, sitemap, /llms.txt, servicios, FAQ), con
// relojes fijos. El JSON es canónico (claves ordenadas por unidad de código, funciones como
// "[function]", undefined omitido en objetos y null en arreglos) y se imprime su SHA-256: antes y
// después de mover los datos el hash tiene que ser idéntico. Cualquier diferencia es un error.
//
// --root: raíz del checkout que se vuelca (por defecto, la de este script). Sirve para correr el
// mismo script sobre otro árbol (git show p19-carril-s:scripts/content-snapshot.mjs > /tmp/snap.mjs).
// El hash depende de la versión de Node y su ICU (localeCompare, Intl): base y final se comparan en
// la misma máquina.
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const ROOT = path.resolve(argValue("--root") ?? path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));
const OUT = argValue("--out");

const load = (rel) => import(pathToFileURL(path.join(ROOT, rel)).href);

const MODULES = {
  artists: "lib/artists.ts",
  releases: "lib/releases.ts",
  videos: "lib/videos.ts",
  events: "lib/events.ts",
  journal: "lib/journal.ts",
};

const mods = {};
for (const [name, rel] of Object.entries(MODULES)) mods[name] = await load(rel);
const catalog = await load("lib/catalog.ts");
const banner = await load("lib/banner.ts");
const facts = await load("lib/artist-facts.ts");
const schema = await load("lib/schema.ts");
const faq = await load("lib/faq.ts");
const services = await load("lib/services.ts");
const rosterIndex = await load("app/[lang]/artistas/roster-index.ts");
const sitemapModule = await load("app/sitemap.ts");
const llms = await load("app/llms.txt/route.ts");

const LANGS = ["es", "en"];
const INSTANTS = [
  "2026-08-25T12:00:00-04:00", // gira a medias
  "2026-10-29T23:59:59-03:00",
  "2026-10-30T00:00:00-03:00", // La Fuerza
  "2026-11-05T00:00:00-03:00", // Un Rezo
  "2028-01-01T00:00:00-03:00", // "2027" ya cuenta como publicado
];
const MISSING = "no-existe-xyz";

/** JSON canónico: claves ordenadas, funciones marcadas, undefined fuera de objetos y null en arreglos. */
function canon(x, inArray = false) {
  if (x === undefined) return inArray ? null : undefined;
  if (typeof x === "function") return "[function]";
  if (typeof x === "bigint") return `${x}n`;
  if (typeof x === "number" && !Number.isFinite(x)) return String(x);
  if (x === null || typeof x !== "object") return x;
  if (x instanceof RegExp) return `/${x.source}/${x.flags}`;
  if (x instanceof Date) return x.toISOString();
  if (x instanceof Map) return [...x.entries()].map((e) => canon(e, true));
  if (x instanceof Set) return [...x].map((e) => canon(e, true));
  if (Array.isArray(x)) return x.map((e) => canon(e, true));
  const out = {};
  for (const k of Object.keys(x).sort()) {
    const v = canon(x[k]);
    if (v !== undefined) out[k] = v;
  }
  return out;
}

/** Corre fn con Date.now fijado en `ms` (para los helpers sin parámetro de reloj) y lo restaura. */
async function atInstant(ms, fn) {
  const realNow = Date.now;
  Date.now = () => ms;
  try {
    return await fn();
  } finally {
    Date.now = realNow;
  }
}

/** Orden de inserción de las claves, recursivo: canon() ordena las claves y no lo vería. */
function keyOrder(x) {
  if (Array.isArray(x)) return x.map(keyOrder);
  if (x && typeof x === "object") return Object.entries(x).map(([k, v]) => [k, keyOrder(v)]);
  return typeof x;
}

const slugs = (list) => list.map((e) => e.slug);

/** Todo el volcado corre con un reloj fijo: nada depende del día en que se ejecuta. */
const build = () => atInstant(Date.parse(INSTANTS[1]), buildDump);

async function buildDump() {
  const { artists: A, releases: R, videos: V, events: E, journal: J } = mods;
  const dump = {};

  // (a) Exportaciones de los 5 módulos: nombre, typeof y valor (salvo funciones).
  dump.a_exports = {};
  for (const [name, ns] of Object.entries(mods)) {
    dump.a_exports[name] = Object.fromEntries(
      Object.keys(ns)
        .sort()
        .map((k) => [k, typeof ns[k] === "function" ? { typeof: "function" } : { typeof: typeof ns[k], value: ns[k] }]),
    );
  }
  dump.a_keyOrder = {
    artists: keyOrder(A.artists),
    releases: keyOrder(R.releases),
    videos: keyOrder(V.videos),
    events: keyOrder(E.events),
    journalPieces: keyOrder(J.journalPieces),
  };

  // (b) Artistas.
  const rosterSlugs = slugs(A.artists);
  dump.b_artists = {
    getArtist: Object.fromEntries([...rosterSlugs, MISSING].map((s) => [s, A.getArtist(s) ?? "[undefined]"])),
    artistGenres: Object.fromEntries(A.artists.map((a) => [a.slug, Object.fromEntries(LANGS.map((l) => [l, A.artistGenres(a, l)]))])),
    artistSameAs: Object.fromEntries(A.artists.map((a) => [a.slug, A.artistSameAs(a)])),
    links: Object.fromEntries(
      A.artists.map((a) => [
        a.slug,
        a.links.map((l) => ({ href: l.href, platform: A.linkPlatform(l.href)?.id ?? "[undefined]", rel: A.artistLinkRel(l.href) })),
      ]),
    ),
    resolveArtistSlug: Object.fromEntries(
      [...Object.keys(A.LEGACY_ARTIST_SLUGS), ...rosterSlugs, MISSING, "__proto__", "constructor"].map((s) => [s, A.resolveArtistSlug(s)]),
    ),
  };

  // (c) Lanzamientos.
  const releaseArtistSlugs = [
    ...new Set([...rosterSlugs, ...R.releases.map((r) => r.artistSlug), ...R.releases.flatMap((r) => r.featuredArtistSlugs ?? []), MISSING]),
  ].sort();
  const linkLabels = [...new Set([...R.releases.flatMap((r) => (r.links ?? []).map((l) => l.label)), ...Object.keys(R.LINK_LABEL_EN)])].sort();
  dump.c_releases = {
    getRelease: Object.fromEntries([...slugs(R.releases), MISSING].map((s) => [s, R.getRelease(s) ?? "[undefined]"])),
    getReleasesByArtist: Object.fromEntries(releaseArtistSlugs.map((s) => [s, slugs(R.getReleasesByArtist(s))])),
    getAllReleasesSorted: slugs(R.getAllReleasesSorted()),
    perRelease: Object.fromEntries(
      R.releases.map((r) => [
        r.slug,
        { spotifyRef: R.spotifyRefFromLinks(r.links), isPhoneRelease: R.isPhoneRelease(r), releaseTitle: R.releaseTitle(r) },
      ]),
    ),
    releaseLinkLabel: Object.fromEntries(linkLabels.map((label) => [label, Object.fromEntries(LANGS.map((l) => [l, R.releaseLinkLabel(label, l)]))])),
  };

  // (d) Videos.
  const videoArtistSlugs = [...new Set([...rosterSlugs, ...V.videos.map((v) => v.artistSlug), MISSING])].sort();
  dump.d_videos = {
    getVideo: Object.fromEntries([...slugs(V.videos), MISSING].map((s) => [s, V.getVideo(s) ?? "[undefined]"])),
    perVideo: Object.fromEntries(
      V.videos.map((v) => [
        v.slug,
        {
          byLang: Object.fromEntries(
            LANGS.map((l) => [
              l,
              {
                videoDisplayTitle: V.videoDisplayTitle(v, l),
                videoMetaTitle: V.videoMetaTitle(v, l),
                toVideoCardData: V.toVideoCardData(v, l),
                videoExcerpt: V.videoExcerpt(v, l),
                formatVideoDate: V.formatVideoDate(v.date, l),
              },
            ]),
          ),
          videoThumb: V.videoThumb(v),
          videoThumbs: V.videoThumbs(v),
          videoThumbSize: V.videoThumbSize(v),
          ...(v.durationSec ? { formatDuration: V.formatDuration(v.durationSec), isoDuration: V.isoDuration(v.durationSec) } : {}),
        },
      ]),
    ),
    getVideosByArtist: Object.fromEntries(videoArtistSlugs.map((s) => [s, slugs(V.getVideosByArtist(s))])),
    atInstant: {},
  };

  dump.e_events_journal = { atInstant: {} };
  dump.f_catalog = { atInstant: {} };
  dump.g_banner = { atInstant: {} };
  dump.h_extra = {
    organizationJsonLd: Object.fromEntries(LANGS.map((l) => [l, schema.organizationJsonLd(l)])),
    faqMainEntity: Object.fromEntries(["sello", "pressKit"].map((p) => [p, Object.fromEntries(LANGS.map((l) => [l, faq.faqMainEntity(p, l)]))])),
    getAppearances: rosterIndex.getAppearances().map((a) => ({ artist: a.artist.slug, releases: slugs(a.releases) })),
    rosterJsonLd: Object.fromEntries(LANGS.map((l) => [l, rosterIndex.rosterJsonLd(l)])),
    rosterDescription: Object.fromEntries(LANGS.map((l) => [l, rosterIndex.rosterDescription(l)])),
    services: {
      exports: Object.fromEntries(Object.keys(services).sort().filter((k) => typeof services[k] !== "function").map((k) => [k, services[k]])),
      coverCredit: Object.fromEntries(services.STRIP_SLUGS.map((s) => [s, Object.fromEntries(LANGS.map((l) => [l, services.coverCredit(s, l)]))])),
      getStripCovers: Object.fromEntries(LANGS.map((l) => [l, services.getStripCovers(l)])),
      getJourneys: Object.fromEntries(LANGS.map((l) => [l, services.getJourneys(l)])),
      servicesJsonLd: Object.fromEntries(LANGS.map((l) => [l, services.servicesJsonLd(l)])),
    },
    faq: Object.fromEntries(Object.keys(faq).sort().filter((k) => typeof faq[k] !== "function").map((k) => [k, faq[k]])),
    atInstant: {},
  };

  for (const iso of INSTANTS) {
    const T = Date.parse(iso);
    await atInstant(T, async () => {
      dump.d_videos.atInstant[iso] = {
        getPublishedVideos: slugs(V.getPublishedVideos(T)),
        releaseVideo: Object.fromEntries(R.releases.map((r) => [r.slug, V.releaseVideo(r.slug, T)?.slug ?? "[undefined]"])),
        pickArtistVideos: Object.fromEntries(videoArtistSlugs.map((s) => [s, slugs(V.pickArtistVideos(s, 6, T))])),
      };
      const published = J.getPublishedPieces(T);
      dump.e_events_journal.atInstant[iso] = {
        getUpcomingEvents: slugs(E.getUpcomingEvents(new Date(T))),
        getPastEvents: slugs(E.getPastEvents(new Date(T))),
        getPublishedPieces: slugs(published),
        journalIndexJsonLd: Object.fromEntries(LANGS.map((l) => [l, J.journalIndexJsonLd(l, published)])),
      };
      dump.f_catalog.atInstant[iso] = {
        getCatalogEntries: catalog.getCatalogEntries(),
        getCatalogArtists: catalog.getCatalogArtists(),
        getArtistEntries: Object.fromEntries([...rosterSlugs, MISSING].map((s) => [s, catalog.getArtistEntries(s)])),
      };
      dump.g_banner.atInstant[iso] = {
        getActiveBanners: banner.getActiveBanners(new Date(T)),
        getActiveBanner: banner.getActiveBanner(new Date(T))?.slug ?? "[null]",
      };
      dump.h_extra.atInstant[iso] = {
        artistKeyFacts: Object.fromEntries(rosterSlugs.map((s) => [s, Object.fromEntries(LANGS.map((l) => [l, facts.artistKeyFacts(s, l, T)]))])),
        appearanceDate: rosterIndex
          .getAppearances()
          .flatMap((a) => a.releases)
          .map((r) => ({ slug: r.slug, ...Object.fromEntries(LANGS.map((l) => [l, rosterIndex.appearanceDate(r, l, T)])) })),
        sitemap: sitemapModule.default(),
        llmsTxt: await llms.GET().text(),
      };
    });
  }

  return JSON.stringify(canon(dump), null, 2) + "\n";
}

const first = await build();
const second = await build();
if (first !== second) {
  console.error("FAIL el volcado cambia entre dos corridas en el mismo proceso (¿un sort o una mutación sobre los datos?)");
  process.exit(1);
}
if (OUT) writeFileSync(OUT, first);
const sha = createHash("sha256").update(first).digest("hex");
console.log(`sha256=${sha} bytes=${Buffer.byteLength(first)}`);
