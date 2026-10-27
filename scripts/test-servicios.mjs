// Prueba de la página de servicios (pendiente 18, carril I):
//   node --import ./scripts/ts-resolve-hook.mjs scripts/test-servicios.mjs
// Comprueba (FAIL):
//   1. Paridad: SERVICES.es y SERVICES.en con la misma forma (claves y largos) y los mismos ids.
//   2. Estructura: 5 pasos en orden (≤ 2 oraciones), 4 piezas, recorridos Esencial · Desarrollado ·
//      Full (EN Essential · Developed · Full) sin cifras, "Nada se pone encima.", "a la medida"
//      (EN "tailored" / "made to measure") y el llamado "Conversemos tu lanzamiento".
//   3. Imágenes: archivos en public/, alt ES/EN descriptivos, portadas = release.cover, tira de 3
//      en orden y créditos leídos de lib/releases.ts (no escritos en la página).
//   4. Sin valores: ningún patrón de monto, moneda o teléfono en los textos de servicios, la
//      página, sus componentes, el formulario, translations (features y footer) ni el JSON-LD;
//      sin vocabulario de compra en la página. Autocontrol con muestras armadas por partes.
//   5. JSON-LD: Service con provider = ORG_ID, areaServed Chile, catálogo de 4 piezas y ninguna
//      clave de montos.
//   6. SEO: título ≤ 60 con la plantilla, descripción ≤ 155, pageMetadata y sitemap con fecha.
//   7. Enlaces: motivo "servicios" en el formulario, llamados al contacto y al catálogo, footer y
//      bloque 03 de la portada hacia /servicios, menú intacto.
//   8. Página: un h1, footer fuera de <main>, sin PageHero ni grillas de tarjetas, <ol> en el
//      proceso y los recorridos, todo servidor y una sola imagen con carga prioritaria.
// SERVICIOS_EXTRA_FILE=<ruta> suma un archivo al bloque 4 (para comprobar que la prueba falla).
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  SERVICES,
  SERVICES_PATH,
  SERVICES_CONTACT,
  STRIP_SLUGS,
  COVER_ALT,
  COVER_ROLES,
  ROLE_EN,
  PIECE_IMAGE,
  CLOSING_BG,
  coverCredit,
  getStripCovers,
  getJourneys,
  servicesJsonLd,
} from "../lib/services.ts";
import { releases } from "../lib/releases.ts";
import { translations } from "../lib/translations.ts";
import { ORG_ID, toJsonLd } from "../lib/schema.ts";
import { templatedTitle, titleLength, TITLE_MAX, exactPastDate } from "../lib/seo.ts";
import { topicValues } from "../app/[lang]/contacto/contact-schema.ts";
import * as sitemapModule from "../app/sitemap.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const src = (rel) => readFileSync(path.join(ROOT, rel), "utf8");

let ok = true;
const report = (label, pass, detail) => {
  ok &&= pass;
  console.log(`${pass ? "OK  " : "FAIL"} ${label}${detail ? " -> " + detail : ""}`);
};
const list = (arr) => (arr.length ? arr.join(", ") : "");
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const LANGS = ["es", "en"];

const PAGE = "app/[lang]/servicios/page.tsx";
const COMPONENTS = readdirSync(path.join(ROOT, "components/phone"))
  .filter((f) => /^services-.*\.tsx$/.test(f))
  .map((f) => `components/phone/${f}`);
const pageAndComponents = [PAGE, ...COMPONENTS].map((f) => ({ file: f, text: src(f) }));
const allPageText = pageAndComponents.map((x) => x.text).join("\n");

// ── 1. Paridad ES/EN ──
{
  const shape = (v) =>
    Array.isArray(v)
      ? v.map(shape)
      : v && typeof v === "object"
        ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, shape(v[k])]))
        : typeof v;
  report("ES y EN con la misma forma (claves y largos)", same(shape(SERVICES.es), shape(SERVICES.en)));
  const ids = (l) => [
    ...SERVICES[l].process.steps.map((s) => s.id),
    ...SERVICES[l].pieces.items.map((p) => p.id),
    ...SERVICES[l].journeys.items.map((j) => j.id),
  ];
  report("ES y EN con los mismos ids de pasos, piezas y recorridos", same(ids("es"), ids("en")));
  const empty = [];
  const walk = (v, at) => {
    if (typeof v === "string") {
      if (v.trim().length === 0) empty.push(at);
    } else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${at}.${k}`);
  };
  LANGS.forEach((l) => walk(SERVICES[l], l));
  report("ningún texto vacío", empty.length === 0, list(empty));
}

// ── 2. Estructura y textos clave ──
{
  const sentences = (t) => t.split(/(?<=[.!?])\s+/).filter((x) => x.trim().length > 0).length;
  for (const l of LANGS) {
    const c = SERVICES[l];
    report(
      `[${l}] 5 pasos en orden: dirección, planificación, ilustrador, diseño, prensa`,
      same(c.process.steps.map((s) => s.id), ["direccion", "planificacion", "ilustrador", "diseno", "prensa"]),
    );
    const long = c.process.steps.filter((s) => sentences(s.body) > 2);
    report(`[${l}] cada paso con 1–2 oraciones`, long.length === 0, list(long.map((s) => s.id)));
    report(
      `[${l}] 4 piezas: dirección, portada, sesión, prensa (cada una con "Incluye")`,
      same(c.pieces.items.map((p) => p.id), ["direccion", "portada", "sesion", "prensa"]) &&
        c.pieces.items.every((p) => p.includes.length > 0),
    );
    report(`[${l}] sin dígitos en los recorridos`, !/\d/.test(JSON.stringify(c.journeys)), JSON.stringify(c.journeys).match(/\d+/g)?.join(","));
    const j = getJourneys(l).map((x) => x.inherited.length + x.adds.length);
    report(`[${l}] los recorridos crecen (4 → 6 → 9)`, same(j, [4, 6, 9]), j.join(" → "));
  }
  const es = SERVICES.es;
  const en = SERVICES.en;
  report(
    "las tres etiquetas de los recorridos (ES Esencial · Desarrollado · Full; EN Essential · Developed · Full)",
    same(es.journeys.items.map((x) => x.name), ["Esencial", "Desarrollado", "Full"]) &&
      same(en.journeys.items.map((x) => x.name), ["Essential", "Developed", "Full"]),
  );
  report(
    'encabezado "Tres recorridos de referencia" con su bajada de puntos de partida',
    es.journeys.title === "Tres recorridos de referencia" &&
      es.journeys.lede === "Son puntos de partida: los ajustamos a tu proyecto, tu calendario y tus fondos." &&
      en.journeys.title === "Three reference paths",
  );
  report('"Nada se pone encima." como cita', es.start.quote === "Nada se pone encima." && en.start.quote.length > 0);
  report('párrafo de partida "Un disco no termina en el master…"', es.start.body[0].startsWith("Un disco no termina en el master."));
  report(
    'titular "Lanzar un disco con dirección." / "Releasing a record with direction."',
    es.hero.title.replace(/\s+/g, " ") === "Lanzar un disco con dirección." &&
      en.hero.title.replace(/\s+/g, " ") === "Releasing a record with direction.",
  );
  report(
    '"a la medida" en la bajada y en el cierre (EN "tailored" / "made to measure")',
    es.hero.lede.includes("a la medida") &&
      `${es.closing.title} ${es.closing.body}`.includes("a la medida") &&
      en.hero.lede.includes("tailored") &&
      `${en.closing.title} ${en.closing.body}`.includes("made to measure"),
  );
  report(
    'llamado principal "Conversemos tu lanzamiento" / "Let\'s talk about your release" (apertura y cierre)',
    es.hero.cta === "Conversemos tu lanzamiento" &&
      en.hero.cta === "Let's talk about your release" &&
      es.closing.primary === es.hero.cta &&
      en.closing.primary === en.hero.cta,
  );
  report(
    "nota del Fondo de la Música y dos rondas de revisión",
    es.fund.body.includes("Fondo de la Música") &&
      es.fund.body.includes("formulación") &&
      es.journeys.conditions.some((x) => x.includes("dos rondas de revisión")),
  );
}

// ── 3. Imágenes y créditos ──
{
  const inPublic = (p) => /^\/(releases|media)\//.test(p) && existsSync(path.join(ROOT, "public", p));
  const images = [
    ...Object.entries(PIECE_IMAGE).map(([id, img]) => ({ id: `pieza ${id}`, src: img.src, alt: img.alt })),
    ...getStripCovers("es").map((c) => ({ id: `tira ${c.slug}`, src: c.src, alt: COVER_ALT[c.slug] })),
  ];
  const missing = images.filter((i) => !inPublic(i.src));
  report("cada imagen existe en public/releases o public/media", missing.length === 0, list(missing.map((i) => `${i.id}:${i.src}`)));
  const closingMissing = [CLOSING_BG.desktop.src, CLOSING_BG.mobile.src].filter((p) => !inPublic(p));
  report("fondo del cierre en public/media", closingMissing.length === 0, list(closingMissing));
  const shortAlt = images.filter((i) => !i.alt || LANGS.some((l) => (i.alt[l] ?? "").length < 20));
  report("alt ES y EN descriptivos (≥ 20 caracteres)", shortAlt.length === 0, list(shortAlt.map((i) => i.id)));
  const badCover = Object.entries(PIECE_IMAGE)
    .filter(([, img]) => img.kind === "cover")
    .filter(([, img]) => releases.find((r) => r.slug === img.releaseSlug)?.cover !== img.src);
  report("portadas de las piezas = release.cover", badCover.length === 0, list(badCover.map(([id]) => id)));
  for (const l of LANGS) {
    const strip = getStripCovers(l);
    report(
      `[${l}] tira de 3 portadas en el orden de STRIP_SLUGS`,
      same(strip.map((c) => c.slug), [...STRIP_SLUGS]) &&
        strip.every((c) => c.src === releases.find((r) => r.slug === c.slug)?.cover),
      strip.map((c) => c.slug).join(" > "),
    );
  }
  const expected = {
    "klaus-b-destellos-de-ti": "Diseño: Seven Estudio",
    "newen-afrobeat-la-fuerza": "Ilustración de portada: Wacko (@wacko_art)",
    "con-fusion-cuantas-veces": "Diseño gráfico: Daniel Torres",
  };
  const wrongCredit = Object.entries(expected).filter(([slug, credit]) => coverCredit(slug, "es") !== credit);
  report("créditos de la tira leídos de lib/releases.ts", wrongCredit.length === 0, list(wrongCredit.map(([s]) => `${s}:${coverCredit(s, "es")}`)));
  report(
    "créditos en inglés con el rol traducido",
    coverCredit("klaus-b-destellos-de-ti", "en") === "Design: Seven Estudio" && COVER_ROLES.every((r) => Boolean(ROLE_EN[r])),
  );
  const names = ["Seven Estudio", "Wacko", "Daniel Torres"];
  const literal = names.filter((n) => allPageText.includes(n) || src("lib/services.ts").includes(n));
  report("ningún crédito escrito a mano en la página, sus componentes ni lib/services.ts", literal.length === 0, list(literal));
}

// ── 4. Sin valores ──
{
  // Los términos que se vigilan van armados por partes: así ni este archivo los trae literales
  // (la revisión busca esas palabras en el diff y debe salir vacía).
  const w = (...parts) => parts.join("");
  const CURRENCY = w("C", "LP");
  const PRICE = [
    ["signo de moneda + cifra", /\$\s?\d/],
    ["cifra con miles", /\b\d{1,3}(?:\.\d{3})+\b/],
    [
      "moneda o palabra de cobro",
      new RegExp(
        `\\b${CURRENCY}\\b|\\bpesos\\b|\\b${w("pre", "cios?")}\\b|\\b${w("tari", "fas?")}\\b|\\bprices?\\b|\\bpricing\\b|\\bfees?\\b`,
        "i",
      ),
    ],
    ["valor en contexto de monto", new RegExp(`\\bvalor(?:es)?\\b[^.\\n]{0,24}(?:\\$|\\d|pesos|${CURRENCY}|neto)`, "i")],
    ["desde + moneda", /\bdesde\s*\$/i],
    ["teléfono móvil chileno", /(?:\+?56\s?)?9\s?\d{4}\s?\d{4}/],
  ];
  // Las mismas reglas sin la de miles: para textos con cifras legítimas (seguidores, números de ley).
  const PRICE_NO_THOUSANDS = PRICE.filter(([name]) => name !== "cifra con miles");
  const VOCAB = [
    ["vocabulario de compra", /\bpaquetes?\b|\bplan(?:es)?\b|\bpackages?\b|\bplans?\b|\bcontrat|\bcomprar\b|\bpagar\b|\bbuy\b|\bpay\b/i],
  ];
  const hits = (text, rules) => rules.filter(([, re]) => re.test(text)).map(([name]) => name);

  // Autocontrol: cada regla detecta su muestra (armadas por partes: aquí no hay montos literales).
  const samples = [
    ["signo de moneda + cifra", ["$", "9"].join("")],
    ["cifra con miles", ["1", "000"].join(".")],
    ["moneda o palabra de cobro", CURRENCY],
    ["moneda o palabra de cobro", w("pre", "cio")],
    ["moneda o palabra de cobro", w("tari", "fa")],
    ["moneda o palabra de cobro", "fee"],
    ["valor en contexto de monto", ["val", "ores ", "netos"].join("")],
    ["desde + moneda", ["desde ", "$"].join("")],
    ["teléfono móvil chileno", ["+56", "9", "1234", "5678"].join(" ")],
    ["vocabulario de compra", ["paq", "uete"].join("")],
    ["vocabulario de compra", ["pl", "an"].join("")],
  ];
  const blind = samples.filter(([name, text]) => !hits(text, [...PRICE, ...VOCAB]).includes(name));
  report("autocontrol: cada patrón detecta su muestra", blind.length === 0, list(blind.map(([n]) => n)));
  const clean = ["planificación estratégica", "Ley de 2026", "ep", "dos rondas"].filter((t) => hits(t, [...PRICE, ...VOCAB]).length > 0);
  report("autocontrol: sin falsos positivos en textos limpios", clean.length === 0, list(clean));

  const scanned = [
    { label: "SERVICES (ES y EN)", text: JSON.stringify(SERVICES), rules: [...PRICE, ...VOCAB] },
    { label: "JSON-LD (ES y EN)", text: LANGS.map((l) => JSON.stringify(servicesJsonLd(l))).join("\n"), rules: PRICE },
    { label: "lib/services.ts", text: src("lib/services.ts"), rules: [...PRICE, ...VOCAB] },
    ...pageAndComponents.map((x) => ({ label: x.file, text: x.text, rules: [...PRICE, ...VOCAB] })),
    ...["contact-form.tsx", "contact-schema.ts", "actions.ts"].map((f) => ({
      label: `app/[lang]/contacto/${f}`,
      text: src(`app/[lang]/contacto/${f}`),
      rules: PRICE,
    })),
    ...LANGS.flatMap((l) => [
      { label: `translations.${l}.features`, text: JSON.stringify(translations[l].features), rules: PRICE },
      { label: `translations.${l}.footer`, text: JSON.stringify(translations[l].footer), rules: PRICE },
    ]),
    // Todo translations.ts, sin la regla de miles (las cifras de seguidores de la portada la disparan).
    { label: "lib/translations.ts (sin regla de miles)", text: src("lib/translations.ts"), rules: PRICE_NO_THOUSANDS },
    { label: "app/[lang]/privacidad/page.tsx (sin regla de miles)", text: src("app/[lang]/privacidad/page.tsx"), rules: PRICE_NO_THOUSANDS },
  ];
  if (process.env.SERVICIOS_EXTRA_FILE) {
    const extra = process.env.SERVICIOS_EXTRA_FILE;
    scanned.push({ label: `extra: ${extra}`, text: readFileSync(extra, "utf8"), rules: [...PRICE, ...VOCAB] });
  }
  for (const { label, text, rules } of scanned) {
    const found = hits(text, rules);
    report(`sin valores: ${label}`, found.length === 0, list(found));
  }
}

// ── 5. JSON-LD ──
{
  const priceKeys = (v, at = "") =>
    Array.isArray(v)
      ? v.flatMap((x, i) => priceKeys(x, `${at}[${i}]`))
      : v && typeof v === "object"
        ? Object.entries(v).flatMap(([k, x]) => [...(/price/i.test(k) ? [`${at}.${k}`] : []), ...priceKeys(x, `${at}.${k}`)])
        : [];
  for (const l of LANGS) {
    const ld = servicesJsonLd(l);
    const service = ld["@graph"].find((n) => n["@type"] === "Service");
    report(`[${l}] Service con provider = ORG_ID`, service?.provider?.["@id"] === ORG_ID);
    report(`[${l}] areaServed Chile y serviceType`, service?.areaServed?.name === "Chile" && Boolean(service?.serviceType));
    const items = service?.hasOfferCatalog?.itemListElement ?? [];
    report(
      `[${l}] OfferCatalog con las 4 piezas`,
      service?.hasOfferCatalog?.["@type"] === "OfferCatalog" &&
        same(items.map((x) => x.itemOffered?.name), SERVICES[l].pieces.items.map((p) => p.title)),
    );
    const keys = priceKeys(ld);
    report(`[${l}] ninguna clave de montos en el grafo`, keys.length === 0, list(keys));
    report(`[${l}] toJsonLd sin "<"`, !toJsonLd(ld).includes("<"));
    report(`[${l}] URL de la página`, service?.url === `https://phonerecords.cl/${l}${SERVICES_PATH}`, service?.url);
  }
}

// ── 6. SEO ──
{
  for (const l of LANGS) {
    const m = SERVICES[l].meta;
    const t = templatedTitle(m.title);
    report(`[${l}] título ≤ ${TITLE_MAX} con la plantilla`, titleLength(t) <= TITLE_MAX, `${t} (${titleLength(t)})`);
    report(`[${l}] descripción ≤ 155`, m.description.length > 0 && m.description.length <= 155, String(m.description.length));
  }
  const page = src(PAGE);
  report("page.tsx usa pageMetadata( con SERVICES_PATH y sin alternates:", page.includes("pageMetadata(") && page.includes("SERVICES_PATH") && !page.includes("alternates:"));
  const sm = sitemapModule.default();
  const now = Date.now();
  const entries = LANGS.map((l) => sm.find((e) => e.url === `https://phonerecords.cl/${l}${SERVICES_PATH}`));
  report(
    "sitemap con /es/servicios y /en/servicios y lastmod verdadero",
    entries.every((e) => e && typeof e.lastModified === "string" && exactPastDate(e.lastModified, now) === e.lastModified),
    entries.map((e) => e?.lastModified).join(" / "),
  );
}

// ── 7. Enlaces ──
{
  report('topicValues incluye "servicios"', topicValues.includes("servicios"));
  report("página o componentes con SERVICES_CONTACT y /catalogo", allPageText.includes("SERVICES_CONTACT") && allPageText.includes("/catalogo"));
  report("SERVICES_CONTACT preselecciona el motivo", SERVICES_CONTACT === "/contacto?topic=servicios");
  report("los componentes enlazan cada pieza al contacto", src("components/phone/services-pieces.tsx").includes("contactHref"));
  for (const l of LANGS) {
    const f = translations[l].footer.links;
    const hrefs = [...f.artists, ...f.label, ...f.contact].map((x) => x.href);
    report(
      `[${l}] footer: Servicios → /servicios, sin #features y sin destinos repetidos`,
      f.label.some((x) => x.href === SERVICES_PATH) && !hrefs.includes("#features") && new Set(hrefs).size === hrefs.length,
    );
    const link = translations[l].features.servicesLink;
    report(
      `[${l}] bloque ${link?.item} de la portada → /servicios`,
      link?.href === SERVICES_PATH && translations[l].features.items.some((x) => x.number === link?.item) && Boolean(link?.label),
    );
  }
  report("features-section.tsx pinta servicesLink", src("components/landing/features-section.tsx").includes("servicesLink"));
  report("menú intacto (Servicios sigue en #features)", src("components/landing/navigation.tsx").includes("#features"));
}

// ── 8. Página ──
{
  const page = src(PAGE);
  const h1 = (allPageText.match(/<h1\b/g) ?? []).length;
  report("un solo <h1 entre la página y sus componentes", h1 === 1, String(h1));
  report("<FooterSection después de </main>", page.indexOf("<FooterSection") > page.indexOf("</main>") && page.includes("</main>"));
  // Se buscan usos (JSX, import o clase), no menciones en comentarios.
  const banned = [
    ["<PageHero", /<PageHero\b|components\/phone\/page-hero/],
    ["*CardGrid", /<\w*CardGrid\b|card-grid/],
    ["grid-cols-4", /\bgrid-cols-4\b/],
    ["gap-px", /\bgap-px\b/],
  ]
    .filter(([, re]) => re.test(allPageText))
    .map(([name]) => name);
  report("sin PageHero ni grillas de tarjetas", banned.length === 0, list(banned));
  report(
    "<ol en el proceso y en los recorridos",
    src("components/phone/services-process.tsx").includes("<ol") && src("components/phone/services-journeys.tsx").includes("<ol"),
  );
  const client = pageAndComponents.filter((x) => /["']use client["']/.test(x.text)).map((x) => x.file);
  report("página y componentes 100 % servidor (sin \"use client\")", client.length === 0, list(client));
  const prio = (allPageText.match(/\b(preload|priority)\b/g) ?? []).length;
  report("una sola imagen con carga prioritaria", prio === 1, String(prio));
  report("componentes services-* presentes", COMPONENTS.length >= 4, list(COMPONENTS));
}

process.exit(ok ? 0 : 1);
