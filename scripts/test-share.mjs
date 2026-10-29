// Prueba de la ShareBar, la taxonomía de eventos y los enlaces de Discogs (pendiente 19 · carril O):
//   node --import ./scripts/ts-resolve-hook.mjs scripts/test-share.mjs
// Comprueba (FAIL):
//   shareLinks (lib/share.ts): orden fijo whatsapp · x · facebook · threads · bluesky · email,
//     hrefs exactos con encodeURIComponent (sin espacios ni "+"), caracteres especiales.
//   platformFromHref: host exacto o subdominio por plataforma, "other" para hosts parecidos,
//     rutas relativas y textos que no son URL; ningún href ni smartLink de lib/releases.ts es "other".
//   pdfParamsFromHref y releaseSlugFromPath: casos positivos y negativos; los PDF de cada artista.
//   track: empuja { event, ...params } a window.dataLayer, lo crea si falta y no lanza sin window.
//   EVENT_PARAMS: los 8 eventos del brief, snake_case ≤ 40, sin parámetros de datos personales.
//   Guardas de fuente: cada punto de medición llama a su evento; DownloadPdfButton sigue en el
//     servidor; la ShareBar no carga SDK ni scripts de terceros; las dos fichas siguen estáticas
//     (sin next/headers, cookies(), headers() ni searchParams; revalidate = 300); nadie más que
//     lib/analytics/events.ts, media-facade.tsx y consent/** empuja a dataLayer.
//   Discogs: URLs /release/<id> o /master/<id> sin ids repetidos; orden estándar de enlaces
//     (Bandcamp · Discogs · Apple Music · Spotify · YouTube) en las fichas de Newen Afrobeat.
// Avisos (WARN): orden estándar en las demás fichas (hoy klaus-b-memorias-mixtape).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { shareLinks, SHARE_METHODS } from "../lib/share.ts";
import {
  EVENT_PARAMS,
  track,
  platformFromHref,
  pdfParamsFromHref,
  releaseSlugFromPath,
} from "../lib/analytics/events.ts";
import { releases } from "../lib/releases.ts";
import { artists } from "../lib/artists.ts";

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

// ── shareLinks ──
{
  const url = "https://phonerecords.cl/es/releases/klaus-b-destellos-de-ti";
  const links = shareLinks({ url, title: "Destellos de ti — Klaus B" });
  const by = Object.fromEntries(links.map((l) => [l.method, l.href]));
  const ORDER = ["whatsapp", "x", "facebook", "threads", "bluesky", "email"];
  report("shareLinks: orden fijo de los 6 métodos", same(links.map((l) => l.method), ORDER) && same([...SHARE_METHODS], ORDER));
  const T = "Destellos%20de%20ti%20%E2%80%94%20Klaus%20B";
  const U = "https%3A%2F%2Fphonerecords.cl%2Fes%2Freleases%2Fklaus-b-destellos-de-ti";
  const expected = {
    whatsapp: `https://wa.me/?text=${T}%20${U}`,
    x: `https://x.com/intent/post?text=${T}&url=${U}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${U}`,
    threads: `https://www.threads.com/intent/post?text=${T}&url=${U}`,
    bluesky: `https://bsky.app/intent/compose?text=${T}%20${U}`,
    email: `mailto:?subject=${T}&body=${U}`,
  };
  for (const m of ORDER) report(`shareLinks: ${m} exacto`, by[m] === expected[m], by[m]);
  const labels = links.map((l) => l.label);
  report("shareLinks: nombres de red", same(labels, ["WhatsApp", "X (Twitter)", "Facebook", "Threads", "Bluesky", "Email"]), list(labels));
  const special = shareLinks({ url, title: "Rock & Roll #1? — Canción ñandú" });
  const enc = "Rock%20%26%20Roll%20%231%3F%20%E2%80%94%20Canci%C3%B3n%20%C3%B1and%C3%BA";
  const missing = special.filter((l) => !l.href.includes(enc) && l.method !== "facebook").map((l) => l.method);
  report("shareLinks: & # ? — tildes y ñ codificados (todos salvo Facebook, que solo lleva la URL)", missing.length === 0, list(missing));
  const bad = [...links, ...special].filter((l) => /[\s+]/.test(l.href)).map((l) => l.method);
  report("shareLinks: ningún href con espacios ni +", bad.length === 0, list(bad));
  report("lib/share.ts no arma enlaces con URLSearchParams (el espacio sería +)", !/URLSearchParams\s*\(/.test(src("lib/share.ts")));
}

// ── platformFromHref ──
{
  const cases = [
    ["https://orcd.co/npk70nb", "smartlink"],
    ["https://onerpm.link/102211016130", "smartlink"],
    ["https://ffm.to/algo", "smartlink"],
    ["https://umg.lnk.to/algo", "smartlink"],
    ["https://open.spotify.com/album/7eICxMxArdEHZdkQY40n0N", "spotify"],
    ["https://music.apple.com/us/album/x/1", "apple_music"],
    ["https://www.youtube.com/watch?v=yyKGWQ7RwKk", "youtube"],
    ["https://youtu.be/yyKGWQ7RwKk", "youtube"],
    ["https://music.youtube.com/watch?v=x", "youtube"],
    ["https://newenafrobeat.bandcamp.com/album/curiche", "bandcamp"],
    ["https://soundcloud.com/x", "soundcloud"],
    ["https://listen.tidal.com/album/1", "tidal"],
    ["https://www.deezer.com/album/1", "deezer"],
    ["https://www.qobuz.com/us-en/album/x/y", "qobuz"],
    ["https://www.beatport.com/release/x/1", "beatport"],
    ["https://www.discogs.com/release/1", "discogs"],
    ["https://evilspotify.com/x", "other"],
    ["https://open.spotify.com.evil.example/x", "other"],
    ["https://notbandcamp.com/x", "other"],
    ["/press-kits/klaus-b-es.pdf", "other"],
    ["no es url", "other"],
    ["", "other"],
  ];
  const wrong = cases.filter(([h, p]) => platformFromHref(h) !== p).map(([h, p]) => `${h || "«vacío»"} = ${platformFromHref(h)} (≠ ${p})`);
  report(`platformFromHref: ${cases.length} casos (11 plataformas, subdominios y parecidos)`, wrong.length === 0, list(wrong));
  const hrefs = releases.flatMap((r) => [...(r.links ?? []).map((l) => [r.slug, l.href]), ...(r.smartLink ? [[r.slug, r.smartLink]] : [])]);
  const unknown = hrefs.filter(([, h]) => platformFromHref(h) === "other").map(([s, h]) => `${s}: ${h}`);
  report(`platformFromHref: ningún href ni smartLink de lib/releases.ts es "other" (${hrefs.length})`, unknown.length === 0, list(unknown));
}

// ── pdfParamsFromHref / releaseSlugFromPath ──
{
  report("pdfParamsFromHref: PDF de artista", same(pdfParamsFromHref("/press-kits/klaus-b-es.pdf"), { artist: "klaus-b", lang: "es" }));
  report("pdfParamsFromHref: PDF del sello → phone-records", same(pdfParamsFromHref("/press-kits/press-kit-en.pdf"), { artist: "phone-records", lang: "en" }));
  report(
    "pdfParamsFromHref: otras rutas → null",
    pdfParamsFromHref("/x.pdf") === null && pdfParamsFromHref("/press-kits/klaus-b-fr.pdf") === null && pdfParamsFromHref("https://phonerecords.cl/press-kits/klaus-b-es.pdf") === null,
  );
  const off = artists.flatMap((a) =>
    ["es", "en"].filter((l) => !same(pdfParamsFromHref(`/press-kits/${a.slug}-${l}.pdf`), { artist: a.slug, lang: l })).map((l) => `${a.slug}-${l}`),
  );
  report("pdfParamsFromHref: el href de /press/<lang>/<slug> de cada artista da su slug e idioma", off.length === 0, list(off));
  report("releaseSlugFromPath: /en/releases/<slug>/", releaseSlugFromPath("/en/releases/klaus-b-un-rezo/") === "klaus-b-un-rezo");
  report(
    "releaseSlugFromPath: otras rutas → undefined",
    releaseSlugFromPath("/es/catalogo") === undefined && releaseSlugFromPath("/fr/releases/x") === undefined && releaseSlugFromPath("/es/releases/") === undefined,
  );
}

// ── track ──
{
  globalThis.window = { dataLayer: [] };
  track("share", { method: "copy", content_type: "release", item_id: "x" });
  report(
    "track: empuja exactamente { event, ...params }",
    globalThis.window.dataLayer.length === 1 && same(globalThis.window.dataLayer[0], { event: "share", method: "copy", content_type: "release", item_id: "x" }),
    JSON.stringify(globalThis.window.dataLayer),
  );
  globalThis.window = {};
  track("newsletter_signup", { source: "footer" });
  report("track: crea dataLayer si falta", Array.isArray(globalThis.window.dataLayer) && same(globalThis.window.dataLayer[0], { event: "newsletter_signup", source: "footer" }));
  globalThis.window = {
    get dataLayer() {
      throw new Error("bloqueado");
    },
  };
  let threw = false;
  try {
    track("share", { method: "copy", content_type: "video", item_id: "y" });
  } catch {
    threw = true;
  }
  report("track: un dataLayer que falla no lanza", !threw);
  delete globalThis.window;
  threw = false;
  try {
    track("share", { method: "copy", content_type: "video", item_id: "y" });
  } catch {
    threw = true;
  }
  report("track: sin window no lanza", !threw);
}

// ── EVENT_PARAMS ──
{
  const NAMES = [
    "presave_click",
    "listen_click",
    "outbound_platform",
    "pdf_download",
    "contact_submit_success",
    "newsletter_signup",
    "share",
    "play_facade",
  ];
  const names = Object.keys(EVENT_PARAMS);
  report("EVENT_PARAMS: los 8 eventos del brief, sin repetir", same([...names].sort(), [...NAMES].sort()) && new Set(names).size === names.length, list(names));
  const SNAKE = /^[a-z][a-z0-9_]{0,39}$/;
  const keys = names.flatMap((n) => [n, ...EVENT_PARAMS[n]]);
  const notSnake = keys.filter((k) => !SNAKE.test(k));
  report("EVENT_PARAMS: nombres y parámetros en snake_case de ≤ 40 caracteres (límite de GA4)", notSnake.length === 0, list(notSnake));
  const pii = names.flatMap((n) => EVENT_PARAMS[n].filter((k) => /email|name|phone|tel|rut/i.test(k)).map((k) => `${n}.${k}`));
  report("EVENT_PARAMS: ningún parámetro de datos personales", pii.length === 0, list(pii));
  report(
    "EVENT_PARAMS: forma pedida por el brief",
    EVENT_PARAMS.listen_click.includes("platform") &&
      same([...EVENT_PARAMS.outbound_platform].sort(), ["platform", "release"]) &&
      same([...EVENT_PARAMS.pdf_download].sort(), ["artist", "lang"]) &&
      same([...EVENT_PARAMS.contact_submit_success], ["topic"]) &&
      same([...EVENT_PARAMS.newsletter_signup], ["source"]) &&
      EVENT_PARAMS.share.includes("method") &&
      EVENT_PARAMS.share.includes("content_type") &&
      same([...EVENT_PARAMS.play_facade].sort(), ["id", "provider"]),
  );
  report(
    "play_facade de media-facade.tsx con la forma de EVENT_PARAMS",
    /push\(\{\s*event:\s*"play_facade",\s*provider,\s*id\s*\}\)/.test(src("components/phone/media-facade.tsx")),
  );
}

// ── Guardas de fuente ──
{
  const status = src("components/release-status.tsx");
  report("release-status.tsx: ReleaseCta registra presave_click y listen_click", status.includes("presave_click") && status.includes("listen_click"));
  const releasePage = src("app/[lang]/releases/[slug]/page.tsx");
  const videoPage = src("app/[lang]/videos/[slug]/page.tsx");
  report("ficha de lanzamiento: enlaces de plataforma con event=\"outbound_platform\"", releasePage.includes('event="outbound_platform"'));
  report(
    "ficha de lanzamiento y de video: ShareBar con su contentType",
    /<ShareBar[\s\S]*?contentType="release"/.test(releasePage) && /<ShareBar[\s\S]*?contentType="video"/.test(videoPage),
  );
  const pdf = src("components/download-pdf-button.tsx");
  report("download-pdf-button.tsx: pdf_download y sigue siendo server", pdf.includes("pdf_download") && !pdf.includes('"use client"'));
  report("contact-form.tsx: track(\"contact_submit_success\"", src("app/[lang]/contacto/contact-form.tsx").includes('track("contact_submit_success"'));
  report("newsletter-form.tsx: track(\"newsletter_signup\"", src("components/phone/newsletter-form.tsx").includes('track("newsletter_signup"'));
  const bar = src("components/share-bar.tsx");
  const barBad = ["<script", "connect.facebook", "platform.twitter", "useSearchParams", "window.location", "dangerouslySetInnerHTML"].filter((s) => bar.includes(s));
  report(
    'share-bar.tsx: track("share" y aria-live="polite", sin SDK, scripts ni lectura de la URL',
    bar.includes('track("share"') && bar.includes('aria-live="polite"') && bar.includes('role="status"') && barBad.length === 0,
    list(barBad),
  );
  const DYNAMIC = ["next/headers", "cookies(", "headers(", "searchParams"];
  const dyn = [
    ["releases/[slug]/page.tsx", releasePage],
    ["videos/[slug]/page.tsx", videoPage],
    ["share-bar.tsx", bar],
  ].flatMap(([f, s]) => DYNAMIC.filter((d) => s.includes(d)).map((d) => `${f}: ${d}`));
  report("las dos fichas y share-bar.tsx sin next/headers, cookies(), headers() ni searchParams", dyn.length === 0, list(dyn));
  const reval = [releasePage, videoPage].every((s) => /export const revalidate = 300;/.test(s));
  report("las dos fichas mantienen export const revalidate = 300", reval);

  // Nadie más empuja a dataLayer.
  const walk = (dir) =>
    readdirSync(path.join(ROOT, dir)).flatMap((name) => {
      const rel = path.join(dir, name);
      return statSync(path.join(ROOT, rel)).isDirectory() ? walk(rel) : /\.(ts|tsx)$/.test(name) ? [rel] : [];
    });
  const ALLOWED = (f) => f === path.join("lib", "analytics", "events.ts") || f === path.join("components", "phone", "media-facade.tsx") || f.startsWith(path.join("components", "consent") + path.sep);
  const pushers = ["app", "components", "lib"].flatMap(walk).filter((f) => !ALLOWED(f) && /dataLayer\??\.push/.test(src(f)));
  report("solo lib/analytics/events.ts, media-facade.tsx y consent/** empujan a dataLayer", pushers.length === 0, list(pushers));
}

// ── Discogs ──
{
  const DISCOGS = /^https:\/\/www\.discogs\.com\/(release|master)\/(\d+)/;
  const discogs = releases.flatMap((r) => (r.links ?? []).filter((l) => l.label === "Discogs").map((l) => ({ slug: r.slug, href: l.href })));
  const badUrl = discogs.filter((d) => !DISCOGS.test(d.href)).map((d) => `${d.slug}: ${d.href}`);
  report(`Discogs: URLs /release/<id> o /master/<id> (${discogs.length})`, badUrl.length === 0, list(badUrl));
  const ids = discogs.map((d) => DISCOGS.exec(d.href)?.slice(1, 3).join("/"));
  const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
  report("Discogs: sin ids repetidos entre fichas", dupIds.length === 0, list(dupIds));
  const EXPECTED = {
    "newen-afrobeat-grietas": "release/35010053",
    "newen-afrobeat-curiche": "release/22496618",
    "newen-afrobeat-newen-plays-fela": "release/10585070",
    "newen-afrobeat-newen-plays-fela-vinyl-2023": "release/29051536",
    "newen-afrobeat-debut": "release/8178920",
  };
  const off = Object.entries(EXPECTED).filter(([slug, id]) => ids[discogs.findIndex((d) => d.slug === slug)] !== id).map(([s]) => s);
  report("Discogs: las 5 fichas de Newen Afrobeat con su edición (Plays Fela digital ≠ vinilo 2023)", off.length === 0, list(off));

  const STANDARD = ["Bandcamp", "Discogs", "Apple Music", "Spotify", "YouTube"];
  const outOfOrder = (r) => {
    const idx = (r.links ?? []).map((l) => STANDARD.indexOf(l.label)).filter((i) => i >= 0);
    return idx.some((v, i) => i > 0 && v < idx[i - 1]);
  };
  const newen = releases.filter((r) => r.artistSlug === "newen-afrobeat" && outOfOrder(r)).map((r) => r.slug);
  report("orden estándar Bandcamp · Discogs · Apple Music · Spotify · YouTube en las fichas de Newen Afrobeat", newen.length === 0, list(newen));
  const rest = releases.filter((r) => r.artistSlug !== "newen-afrobeat" && outOfOrder(r)).map((r) => r.slug);
  if (rest.length) warn("orden estándar de enlaces en otras fichas (fuera del carril O)", list(rest));
}

process.exit(ok ? 0 : 1);
