// Prueba del SEO técnico (pendiente 17, carril H):
//   node --import ./scripts/ts-resolve-hook.mjs scripts/test-seo.mjs
// Comprueba (FAIL):
//   pageMetadata: canonical absoluta, hreflang es/en/x-default, og:url, og:locale y
//     alternateLocale por idioma, imagen OG y Twitter, noindex, títulos ≤ 60 con la
//     plantilla (y `absolute` cuando no caben o traen la marca).
//   Las 7 páginas (catalogo, contacto, eventos, manifiesto, privacidad, sello, videos):
//     usan pageMetadata( y no traen `alternates:`; títulos con plantilla ≤ 60.
//     lib/site-metadata.ts (metadata de los root layouts) sin es_CL, alternates ni canonical.
//   organizationJsonLd: un solo @id (= ORG_ID) en ES y EN, tipo Organization (sin
//     MusicLabel), miembros = lib/artists.ts en orden y con artistId(slug), sameAs con los
//     canales del sello, email publicado en /press-kit, sin calle ni foundingDate; sin
//     slugs literales en lib/schema.ts; WebSite sin potentialAction; portada y /sello
//     usan la entidad de lib/schema.ts.
//   robots: grupo general intacto y un grupo por buscador de IA que repite /api/; sin
//     bots de entrenamiento nombrados.
//   exactPastDate / latestDate: día completo, real y ya alcanzado (00:00 Santiago).
//   sitemap(): lastmod solo YYYY-MM-DD verdadero y no futuro, /eventos solo con fechas
//     próximas, portada con el máximo, lanzamientos y artistas con la fecha esperada.
//   GET /llms.txt: 200 text/plain, H1, resumen ">", "## English", secciones solo en H2
//     (las de inglés con "English · "), artistas en ES y EN,
//     solo lanzamientos ℗ PHŌNÉ publicados (todos), URLs absolutas.
//   htmlLimitedBots (si next.config.mjs lo define): lista por defecto de Next + 9 bots de IA.
// Avisos (WARN): htmlLimitedBots aún sin definir; /press-kit aún sin pageMetadata
//   (ambos los aplica el integrador).
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import {
  pageMetadata,
  exactPastDate,
  latestDate,
  templatedTitle,
  titleLength,
  TITLE_MAX,
} from "../lib/seo.ts";
import {
  SITE,
  ORG_ID,
  WEBSITE_ID,
  LABEL_SAME_AS,
  LABEL_EMAIL,
  artistId,
  organizationJsonLd,
  websiteJsonLd,
  toJsonLd,
} from "../lib/schema.ts";
import { artists } from "../lib/artists.ts";
import { releases } from "../lib/releases.ts";
import { isReleased, releaseStartMs } from "../lib/release-date.ts";
import { getPublishedVideos } from "../lib/videos.ts";
import { getUpcomingEvents } from "../lib/events.ts";
import { getArtistEntries } from "../lib/catalog.ts";
import * as robotsModule from "../app/robots.ts";
import * as sitemapModule from "../app/sitemap.ts";
import * as llmsModule from "../app/llms.txt/route.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const src = (rel) => readFileSync(path.join(ROOT, rel), "utf8");

let ok = true;
const report = (label, pass, detail) => {
  ok &&= pass;
  console.log(`${pass ? "OK  " : "FAIL"} ${label}${detail ? " -> " + detail : ""}`);
};
const warn = (label, detail) => console.log(`WARN ${label}${detail ? " -> " + detail : ""}`);
const list = (arr) => (arr.length ? arr.join(", ") : "");
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const LANGS = ["es", "en"];
const OG_LOCALE = { es: "es_CL", en: "en_US" };
const other = (l) => (l === "es" ? "en" : "es");

// ── pageMetadata ──
for (const lang of LANGS) {
  const m = pageMetadata({ lang, path: "/catalogo", title: "Catálogo", description: "Descripción." });
  const canonical = `${SITE}/${lang}/catalogo`;
  report(`[${lang}] canonical absoluta`, m.alternates?.canonical === canonical, m.alternates?.canonical);
  report(
    `[${lang}] hreflang es/en/x-default`,
    same(m.alternates?.languages, {
      es: `${SITE}/es/catalogo`,
      en: `${SITE}/en/catalogo`,
      "x-default": `${SITE}/es/catalogo`,
    }),
  );
  const og = m.openGraph ?? {};
  report(`[${lang}] og:url = canonical`, og.url === canonical, og.url);
  report(
    `[${lang}] og:locale ${OG_LOCALE[lang]} y alternateLocale ${OG_LOCALE[other(lang)]}`,
    og.locale === OG_LOCALE[lang] && same(og.alternateLocale, [OG_LOCALE[other(lang)]]),
    `${og.locale} / ${og.alternateLocale}`,
  );
  report(`[${lang}] og:type website y siteName`, og.type === "website" && og.siteName === "PHŌNÉ Records");
  const img = og.images?.[0];
  report(
    `[${lang}] imagen OG por idioma 1200×630`,
    img?.url === `${SITE}/${lang}/opengraph-image` && img?.width === 1200 && img?.height === 630 && Boolean(img?.alt),
    img?.url,
  );
  report(
    `[${lang}] og:title con la plantilla`,
    og.title === "Catálogo — PHŌNÉ Records" && og.description === "Descripción.",
    og.title,
  );
  const tw = m.twitter ?? {};
  report(
    `[${lang}] twitter summary_large_image con título, descripción e imagen`,
    tw.card === "summary_large_image" && tw.title === og.title && tw.description === "Descripción." && same(tw.images, [img?.url]),
  );
  report(`[${lang}] título corto usa la plantilla`, m.title === "Catálogo", JSON.stringify(m.title));
  report(`[${lang}] sin robots si no hay noindex`, !("robots" in m));
}
{
  const m = pageMetadata({ lang: "en", path: "/eventos", title: "Events", description: "d", noindex: true });
  report("noindex → robots { index: false, follow: true }", same(m.robots, { index: false, follow: true }));
  const home = pageMetadata({ lang: "es", path: "", title: "Inicio", description: "d" });
  report("portada: canonical /es", home.alternates?.canonical === `${SITE}/es`);
  const fr = pageMetadata({ lang: "fr", path: "/sello", title: "x", description: "d" });
  report("idioma desconocido → es", fr.alternates?.canonical === `${SITE}/es/sello` && fr.openGraph?.locale === "es_CL");
  const longTitle = "Un título bastante largo que no cabe con la plantilla";
  const long = pageMetadata({ lang: "es", path: "/x", title: longTitle, description: "d" });
  report(
    "título que no cabe con la plantilla → absolute",
    titleLength(templatedTitle(longTitle)) > TITLE_MAX && same(long.title, { absolute: longTitle }) && long.openGraph?.title === longTitle,
  );
  const branded = pageMetadata({ lang: "es", path: "/x", title: "PHŌNÉ Records en vivo", description: "d" });
  report("título con la marca → absolute (sin marca duplicada)", same(branded.title, { absolute: "PHŌNÉ Records en vivo" }));
  const own = { url: `${SITE}/es/x.jpg`, width: 800, height: 800, alt: "x" };
  const custom = pageMetadata({ lang: "es", path: "/x", title: "x", description: "d", image: own });
  report("imagen propia respetada en OG y Twitter", same(custom.openGraph?.images, [own]) && same(custom.twitter?.images, [own.url]));
  report('titleLength cuenta "Ō" y "É" como un carácter', titleLength("PHŌNÉ") === 5 && titleLength("PHŌNÉ".normalize("NFD")) === 5);
}

// ── Las 7 páginas y el layout ──
const PAGES = ["catalogo", "contacto", "eventos", "manifiesto", "privacidad", "sello", "videos"];
// Todos los literales de la línea `title:` de la llamada (también el título condicional de /eventos).
const titlesOf = (call) => {
  const line = /title:[^\n]*/.exec(call)?.[0] ?? "";
  return [...line.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
};
for (const p of PAGES) {
  const file = `app/[lang]/${p}/page.tsx`;
  const s = src(file);
  report(`${p}: usa pageMetadata(`, s.includes("pageMetadata("));
  report(`${p}: sin alternates:`, !s.includes("alternates:"));
  const call = s.slice(s.indexOf("pageMetadata("));
  const titles = titlesOf(call);
  const tooLong = titles.filter((t) => titleLength(templatedTitle(t)) > TITLE_MAX);
  report(
    `${p}: títulos ≤ ${TITLE_MAX} con la plantilla`,
    titles.length > 0 && tooLong.length === 0,
    titles.map((t) => `${templatedTitle(t)} (${titleLength(templatedTitle(t))})`).join(" | "),
  );
}
{
  const layout = src("lib/site-metadata.ts");
  const bad = ["es_CL", "alternates", "canonical", "alternateLocale"].filter((k) => layout.includes(k));
  report("lib/site-metadata.ts sin es_CL, alternates ni canonical", bad.length === 0, list(bad));
  const ev = src("app/[lang]/eventos/page.tsx");
  report(
    "eventos: noindex, título sin gira y estado vacío ES/EN con booking",
    ev.includes("noindex: !hasDates") &&
      same(titlesOf(ev.slice(ev.indexOf("pageMetadata("))), ["Eventos · Gira", "Events · Tour", "Eventos", "Events"]) &&
      ev.includes("No hay fechas anunciadas por ahora.") &&
      ev.includes("No dates announced at the moment.") &&
      ev.includes("contacto?topic=booking"),
  );
  const pk = src("app/[lang]/press-kit/page.tsx");
  if (!pk.includes("pageMetadata(")) warn("press-kit aún sin pageMetadata (fragmento en carrilH-report.md, lo aplica el integrador)");
}

// ── Entidad del sello ──
const schemaSrc = src("lib/schema.ts");
for (const lang of LANGS) {
  const org = organizationJsonLd(lang);
  const json = JSON.stringify(org);
  report(`[${lang}] Organization con @id ORG_ID`, org["@type"] === "Organization" && org["@id"] === ORG_ID);
  report(`[${lang}] sin MusicLabel, foundingDate ni calle`, !json.includes("MusicLabel") && !("foundingDate" in org) && !("streetAddress" in (org.address ?? {})));
  report(
    `[${lang}] dirección Ñuñoa · Región Metropolitana · CL`,
    org.address?.addressLocality === "Ñuñoa" && org.address?.addressRegion === "Región Metropolitana" && org.address?.addressCountry === "CL",
  );
  const missingSameAs = LABEL_SAME_AS.filter((u) => !org.sameAs?.includes(u));
  report(`[${lang}] sameAs con Instagram y YouTube del sello`, missingSameAs.length === 0, list(missingSameAs));
  const members = org.member ?? [];
  const badMembers = artists.filter(
    (a, i) =>
      members[i]?.["@type"] !== "MusicGroup" ||
      members[i]?.["@id"] !== artistId(a.slug) ||
      members[i]?.name !== a.name ||
      members[i]?.url !== `${SITE}/${lang}/artistas/${a.slug}`,
  );
  report(
    `[${lang}] miembros = lib/artists.ts (orden, @id, nombre y URL)`,
    members.length === artists.length && badMembers.length === 0,
    list(badMembers.map((a) => a.slug)),
  );
}
{
  const es = organizationJsonLd("es");
  const en = organizationJsonLd("en");
  report("@id de la organización y de los miembros no cambia con el idioma", es["@id"] === en["@id"] && same(es.member.map((m) => m["@id"]), en.member.map((m) => m["@id"])));
  report("email del sello ya publicado en /press-kit", es.email === LABEL_EMAIL && src("app/[lang]/press-kit/page.tsx").includes(LABEL_EMAIL));
  const literal = artists.map((a) => a.slug).filter((s) => schemaSrc.includes(s));
  report("lib/schema.ts sin slugs de artista literales", literal.length === 0 && !/brantmayer/i.test(schemaSrc), list(literal));
  const site = websiteJsonLd();
  report(
    "WebSite con publisher ORG_ID y sin potentialAction",
    site["@type"] === "WebSite" && site["@id"] === WEBSITE_ID && site.publisher?.["@id"] === ORG_ID && !("potentialAction" in site),
  );
  report("toJsonLd escapa <", !toJsonLd({ a: "</script>" }).includes("<"));
  const ids = [es, site].map((n) => n["@id"]);
  report("grafo de portada con @id distintos", new Set(ids).size === ids.length);
  for (const file of ["app/[lang]/page.tsx", "app/[lang]/sello/page.tsx"]) {
    const s = src(file);
    report(
      `${file}: organización de lib/schema.ts (sin #organization ni MusicLabel literales)`,
      s.includes("organizationJsonLd(lang)") && !s.includes("/#organization") && !s.includes("MusicLabel"),
    );
  }
}

// ── @id de lanzamiento sin idioma (17i, carril O) ──
// Importes dinámicos para no tocar la cabecera (la comparte el carril N). Sin build: el @id se
// comprueba en lib/schema.ts y en el código de las fichas; el curl del integrador lo confirma
// en el HTML de ES y EN.
{
  const { releaseId } = await import("../lib/schema.ts");
  const { readdirSync, statSync } = await import("node:fs");
  report("releaseId recibe solo el slug (no puede variar con el idioma)", typeof releaseId === "function" && releaseId.length === 1);
  const rids = releases.map((r) => releaseId(r.slug));
  const badRid = releases.filter((r, i) => rids[i] !== `${SITE}/#release-${r.slug}` || /\/(es|en)\//.test(rids[i])).map((r) => r.slug);
  report(`releaseId(slug) = ${SITE}/#release-<slug>, sin /es/ ni /en/ (${rids.length} fichas)`, badRid.length === 0, list(badRid));
  report("releaseId único por ficha", new Set(rids).size === rids.length);
  const clash = rids.filter((id) => id === ORG_ID || id === WEBSITE_ID || artists.some((a) => artistId(a.slug) === id));
  report("releaseId distinto de ORG_ID, WEBSITE_ID y de todo artistId", clash.length === 0, list(clash));
  for (const file of ["app/[lang]/releases/[slug]/page.tsx", "app/[lang]/videos/[slug]/page.tsx"]) {
    const s = src(file);
    const uses = [...s.matchAll(/"@id":\s*releaseId\(([^)]*)\)/g)].map((m) => m[1]);
    report(
      `${file}: un "@id": releaseId(<slug>) sin lang y sin #album`,
      uses.length === 1 && !/lang/i.test(uses[0]) && !s.includes("#album"),
      uses.length === 1 ? `releaseId(${uses[0]})` : `${uses.length} usos`,
    );
  }
  const walk = (dir) =>
    readdirSync(path.join(ROOT, dir)).flatMap((name) => {
      const rel = path.join(dir, name);
      return statSync(path.join(ROOT, rel)).isDirectory() ? walk(rel) : /\.(ts|tsx)$/.test(name) ? [rel] : [];
    });
  const ARTIST_PAGE = path.join("app", "[lang]", "artistas", "[slug]", "page.tsx");
  const album = ["app", "components"].flatMap(walk).filter((f) => src(f).includes("#album"));
  report("ningún #album en app/ ni components/ (salvo la ficha de artista)", album.every((f) => f === ARTIST_PAGE), list(album.filter((f) => f !== ARTIST_PAGE)));
  if (album.includes(ARTIST_PAGE)) warn(`${ARTIST_PAGE} aún usa #album`, "lo cambia el integrador por releaseId(e.releaseSlug)");
}

// ── robots ──
{
  report("app/robots.ts solo exporta default", same(Object.keys(robotsModule).sort(), ["default"]));
  const r = robotsModule.default();
  const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
  const uas = (g) => (Array.isArray(g.userAgent) ? g.userAgent : [g.userAgent]);
  const dis = (g) => (Array.isArray(g.disallow) ? g.disallow : [g.disallow]);
  const star = rules.filter((g) => uas(g).includes("*"));
  report("grupo general: allow / y disallow /api/", star.length === 1 && star[0].allow === "/" && dis(star[0]).includes("/api/"));
  const AI_SEARCH = ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "Claude-SearchBot", "Claude-User"];
  for (const bot of AI_SEARCH) {
    const groups = rules.filter((g) => uas(g).includes(bot));
    report(`${bot}: grupo propio con allow / y disallow /api/`, groups.length === 1 && groups[0].allow === "/" && dis(groups[0]).includes("/api/"));
  }
  const TRAINING = ["GPTBot", "ClaudeBot", "CCBot", "Google-Extended"];
  const named = TRAINING.filter((b) => rules.some((g) => uas(g).includes(b)));
  report("bots de entrenamiento sin grupo propio (X27)", named.length === 0, list(named));
  report("7 grupos, sitemap y host", rules.length === 7 && r.sitemap === `${SITE}/sitemap.xml` && r.host === SITE, `${rules.length} grupos`);
}

// ── exactPastDate / latestDate ──
{
  const start = releaseStartMs("2026-10-22");
  report("exactPastDate: el día de salida desde 00:00 Santiago", exactPastDate("2026-10-22", start) === "2026-10-22");
  report("exactPastDate: un ms antes → undefined", exactPastDate("2026-10-22", start - 1) === undefined);
  const now = Date.UTC(2026, 9, 26);
  const rejected = ["2027", "2025-11", "in production", "2026-06-00", "0000-00-00", "2025-02-31", "2025-02-29", "2026-13-01", "2099-01-01"].filter(
    (d) => exactPastDate(d, now) !== undefined,
  );
  report("exactPastDate rechaza parciales, texto, -00, días imposibles y futuras", rejected.length === 0, list(rejected));
  report("exactPastDate acepta 29 de febrero bisiesto", exactPastDate("2024-02-29", now) === "2024-02-29");
  report("latestDate", latestDate(["2025-01-01", undefined, "2026-10-01", "2024-12-31"]) === "2026-10-01" && latestDate([]) === undefined);
}

// ── sitemap ──
{
  report("app/sitemap.ts exporta default y dynamic", same(Object.keys(sitemapModule).sort(), ["default", "dynamic"]));
  const now = Date.now();
  const sm = sitemapModule.default();
  const byUrl = new Map(sm.map((e) => [e.url, e]));
  const badUrl = sm.filter((e) => !e.url.startsWith(`${SITE}/`));
  report("URLs absolutas", badUrl.length === 0, list(badUrl.map((e) => e.url)));
  const badLm = sm.filter((e) => e.lastModified !== undefined && (typeof e.lastModified !== "string" || exactPastDate(e.lastModified, now) !== e.lastModified));
  report("lastmod solo YYYY-MM-DD verdadero y no futuro", badLm.length === 0, list(badLm.map((e) => `${e.url}:${e.lastModified}`)));
  const hasEvents = getUpcomingEvents(new Date(now)).length > 0;
  const eventos = sm.filter((e) => e.url.endsWith("/eventos"));
  report(`/eventos ${hasEvents ? "presente (hay fechas)" : "fuera (sin fechas próximas)"}`, hasEvents ? eventos.length === 2 : eventos.length === 0);
  const max = latestDate(sm.map((e) => e.lastModified));
  report("portada con el lastmod máximo", LANGS.every((l) => byUrl.get(`${SITE}/${l}`)?.lastModified === max), max);
  const badRel = releases.filter((r) =>
    LANGS.some((l) => byUrl.get(`${SITE}/${l}/releases/${r.slug}`)?.lastModified !== exactPastDate(r.releaseDate, now)),
  );
  report("lanzamientos: su fecha si ya salió; futuros o parciales sin lastmod", badRel.length === 0, list(badRel.map((r) => r.slug)));
  const published = getPublishedVideos(now);
  const badArtist = artists.filter((a) => {
    const expected = latestDate([
      ...getArtistEntries(a.slug).map((e) => exactPastDate(e.releaseDate, now)),
      ...published.filter((v) => v.artistSlug === a.slug).map((v) => exactPastDate(v.date, now)),
    ]);
    return LANGS.some((l) => byUrl.get(`${SITE}/${l}/artistas/${a.slug}`)?.lastModified !== expected);
  });
  report("artistas: lo más reciente entre discografía y videos publicados", badArtist.length === 0, list(badArtist.map((a) => a.slug)));
  const unpaired = sm.filter((e) => !byUrl.has(e.url.replace(/^(https:\/\/[^/]+\/)(es|en)/, (_, h, l) => `${h}${other(l)}`)));
  report("cada URL tiene su par en el otro idioma", unpaired.length === 0, list(unpaired.map((e) => e.url)));
}

// ── /llms.txt ──
{
  report("app/llms.txt/route.ts solo exporta GET y revalidate", same(Object.keys(llmsModule).sort(), ["GET", "revalidate"]) && llmsModule.revalidate === 3600);
  const now = Date.now();
  const res = llmsModule.GET();
  report("GET /llms.txt → 200", res.status === 200, String(res.status));
  report("content-type text/plain; charset=utf-8", res.headers.get("content-type") === "text/plain; charset=utf-8", res.headers.get("content-type"));
  const text = await res.text();
  report("H1 # PHŌNÉ Records, resumen > y ## English", text.startsWith("# PHŌNÉ Records\n") && /^> \S.+$/m.test(text) && /^## English$/m.test(text));
  const h3 = text.match(/^#{3,} .*$/gm) ?? [];
  report("secciones en H2, sin ### (llmstxt.org)", h3.length === 0, list(h3));
  report("secciones de inglés con el prefijo English ·", /^## English · About$/m.test(text) && /^## English · Artists$/m.test(text));
  const [esPart = "", enPart = ""] = text.split(/^## English$/m);
  const missingEs = artists.filter((a) => !esPart.includes(`](${SITE}/es/artistas/${a.slug}):`));
  const missingEn = artists.filter((a) => !enPart.includes(`](${SITE}/en/artistas/${a.slug}):`));
  report("todos los artistas en ES y EN", missingEs.length === 0 && missingEn.length === 0, list([...missingEs, ...missingEn].map((a) => a.slug)));
  const listed = [...text.matchAll(/\/releases\/([a-z0-9-]+)\)/g)].map((m) => m[1]);
  const isLabelReleased = (r) => r.label === "PHŌNÉ Records" && releaseStartMs(r.releaseDate) !== null && isReleased(r.releaseDate, now);
  const wrong = listed.filter((slug) => {
    const r = releases.find((x) => x.slug === slug);
    return !r || !isLabelReleased(r);
  });
  report("solo lanzamientos ℗ PHŌNÉ ya publicados", wrong.length === 0, list(wrong));
  const expected = releases.filter(isLabelReleased);
  const missingRel = expected.filter((r) => !esPart.includes(`/es/releases/${r.slug})`) || !enPart.includes(`/en/releases/${r.slug})`));
  report(`todos los lanzamientos ℗ PHŌNÉ publicados (${expected.length}) en ES y EN`, missingRel.length === 0, list(missingRel.map((r) => r.slug)));
  const relative = [...text.matchAll(/\]\((?!https:\/\/)([^)]*)\)/g)].map((m) => m[1]);
  report("URLs absolutas https", relative.length === 0, list(relative));
  report("enlace a /videos con la cantidad publicada", text.includes(`](${SITE}/es/videos): ${getPublishedVideos(now).length} `));
  report(
    "/servicios y su motivo de contacto en ES y EN (pendiente 18)",
    ["es", "en"].every((l) => text.includes(`](${SITE}/${l}/servicios):`) && text.includes(`](${SITE}/${l}/contacto?topic=servicios):`)),
  );
}

// ── htmlLimitedBots (next.config.mjs, lo aplica el integrador) ──
{
  const require = createRequire(import.meta.url);
  const { HTML_LIMITED_BOT_UA_RE } = require("next/dist/shared/lib/router/utils/html-bots.js");
  const cfgPath = path.join(ROOT, "next.config.mjs");
  const cfg = existsSync(cfgPath) ? (await import(pathToFileURL(cfgPath).href)).default : {};
  const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "CCBot"];
  const re = cfg.htmlLimitedBots;
  if (!re) {
    warn("htmlLimitedBots sin definir en next.config.mjs (fragmento en carrilH-report.md, lo aplica el integrador)");
  } else {
    const defaults = HTML_LIMITED_BOT_UA_RE.source.split("|");
    const mine = re instanceof RegExp ? re.source.split("|") : [];
    const lost = defaults.filter((d) => !mine.includes(d));
    report("htmlLimitedBots conserva la lista por defecto de Next", re instanceof RegExp && lost.length === 0, list(lost));
    const missing = AI_BOTS.filter((b) => !(re instanceof RegExp) || !re.test(`Mozilla/5.0 (compatible; ${b}/1.0; +https://example.com/bot)`));
    report("htmlLimitedBots incluye los 9 bots de IA", missing.length === 0, list(missing));
    if (re instanceof RegExp && !re.flags.includes("i")) warn("htmlLimitedBots sin flag i (Next igual la evalúa sin distinguir mayúsculas)");
  }
}

process.exit(ok ? 0 : 1);
