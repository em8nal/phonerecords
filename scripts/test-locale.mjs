// Prueba del idioma del proxy (pendiente 19, carril L):
//   node --import ./scripts/ts-resolve-hook.mjs scripts/test-locale.mjs
//   (el integrador agrega "test:locale" a package.json con ese comando)
// Comprueba (FAIL):
//   pickLocale de lib/locale.ts: cookie phone_lang → Accept-Language con "es" antes que "en"
//     (q descendente, a igual q el orden de aparición, subetiqueta primaria, q=0 y "*"
//     ignorados) → país hispanohablante → inglés; los 20 países de la lista van a /es y
//     otros (US, BR, DE, FR, sin país) a /en.
//   matcher de proxy.ts (el literal, extraído con una regex: importar proxy.ts desde Node falla
//     porque `next/server` no resuelve sin extensión): con unstable_doesMiddlewareMatch de Next
//     corre en / y las rutas sin idioma, y no corre en /es, /en, /press/…, _next, api ni
//     archivos con extensión, para que la CDN sirva las páginas cacheadas sin invocar el proxy.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { AsyncLocalStorage } from "node:async_hooks";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { pickLocale, prefersSpanish, SPANISH_COUNTRIES, LOCALE_COOKIE } from "../lib/locale.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let ok = true;
const report = (label, pass, detail) => {
  ok &&= pass;
  console.log(`${pass ? "OK  " : "FAIL"} ${label}${detail ? " -> " + detail : ""}`);
};
const list = (arr) => (arr.length ? arr.join(", ") : "");

// --- pickLocale ---------------------------------------------------------------------------
// [cookie, Accept-Language, país, esperado]
const CASES = [
  ["en", "es-CL", "CL", "en"],
  ["es", "en-US", "US", "es"],
  ["fr", "", "", "en"],
  [undefined, "es-MX,es;q=0.9,en;q=0.8", "US", "es"],
  [undefined, "en-US,en;q=0.9,es;q=0.8", "MX", "es"],
  [undefined, "en-US,en;q=0.9", "US", "en"],
  [undefined, "en-GB", "CL", "es"],
  [undefined, "", "ar", "es"],
  [undefined, "pt-BR,pt;q=0.9", "BR", "en"],
  [undefined, "pt-BR,es;q=0.5", "BR", "es"],
  [undefined, "en;q=0.4,es;q=0.9", "DE", "es"],
  [undefined, "es;q=0,en", "DE", "en"],
  [undefined, "*", "", "en"],
  [undefined, "es;q=0.8,en;q=0.8", "US", "es"],
  [undefined, "ES-419", "", "es"],
  [undefined, null, null, "en"],
];
const badCases = CASES.filter(([cookie, acceptLanguage, country, want]) => {
  return pickLocale({ cookie, acceptLanguage, country }) !== want;
}).map(([c, a, k, want]) => `${c ?? "—"}|${a ?? "∅"}|${k ?? "∅"} ≠ ${want}`);
report(`pickLocale: ${CASES.length} casos de cookie, Accept-Language y país`, badCases.length === 0, list(badCases));

const EXPECTED_COUNTRIES = "CL AR BO CO CR CU DO EC ES GT HN MX NI PA PE PR PY SV UY VE".split(" ");
report(
  "SPANISH_COUNTRIES = Chile + los 19 países hispanohablantes del brief",
  SPANISH_COUNTRIES.size === EXPECTED_COUNTRIES.length && EXPECTED_COUNTRIES.every((c) => SPANISH_COUNTRIES.has(c)),
  [...SPANISH_COUNTRIES].join(" "),
);
const badSpanish = EXPECTED_COUNTRIES.filter((country) => pickLocale({ acceptLanguage: "", country }) !== "es");
report("sin Accept-Language, los 20 países van a /es", badSpanish.length === 0, list(badSpanish));
const badOther = ["US", "BR", "DE", "FR", ""].filter((country) => pickLocale({ acceptLanguage: "", country }) !== "en");
report("sin Accept-Language, US, BR, DE, FR y sin país van a /en", badOther.length === 0, list(badOther.map((c) => c || "∅")));
report(
  "prefersSpanish ignora q inválido y etiquetas vacías",
  prefersSpanish("es;q=abc, ,en") === false && prefersSpanish(" ES ; q=0.7 , en;q=0.6") === true,
);
report('LOCALE_COOKIE = "phone_lang" (lo escribe también components/language-selector.tsx)', LOCALE_COOKIE === "phone_lang");

// --- Matcher de proxy.ts ------------------------------------------------------------------
const proxySrc = readFileSync(path.join(ROOT, "proxy.ts"), "utf8");
const literal = /matcher:\s*\[\s*("(?:[^"\\]|\\.)*")\s*,?\s*\]/.exec(proxySrc)?.[1];
report("proxy.ts: matcher con un solo literal", Boolean(literal));
report("proxy.ts: ya no manda x-phone-locale", !proxySrc.includes("x-phone-locale"));
report('proxy.ts: importa ./lib/locale (ruta relativa)', /from\s+["']\.\/lib\/locale["']/.test(proxySrc));

if (literal) {
  const matcher = JSON.parse(literal);
  // La utilidad de Next carga módulos del servidor que esperan AsyncLocalStorage global.
  globalThis.AsyncLocalStorage = AsyncLocalStorage;
  const require = createRequire(import.meta.url);
  const { unstable_doesMiddlewareMatch } = require("next/experimental/testing/server.js");
  const matches = (url) => unstable_doesMiddlewareMatch({ config: { matcher: [matcher] }, url });

  const RUNS = ["/", "/artistas/klaus-b", "/press", "/press-kit", "/espacio", "/english", "/catalogo?artist=x"];
  const SKIPS = [
    "/es",
    "/es/",
    "/en",
    "/en/videos/x",
    "/es/catalogo?artist=x",
    "/press/es/klaus-b",
    "/_next/static/a.js",
    "/api/x",
    "/opengraph-image",
    "/robots.txt",
    "/sitemap.xml",
    "/llms.txt",
    "/favicon.ico",
    "/press-kits/klaus-b-es.pdf",
  ];
  const notRun = RUNS.filter((u) => !matches(u));
  const ran = SKIPS.filter((u) => matches(u));
  report(`matcher: el proxy corre en las ${RUNS.length} rutas sin idioma`, notRun.length === 0, list(notRun));
  report(`matcher: el proxy no corre en las ${SKIPS.length} rutas con idioma, internas o archivos`, ran.length === 0, list(ran));
}

console.log(ok ? "\nOK test:locale" : "\nFAIL test:locale");
process.exit(ok ? 0 : 1);
