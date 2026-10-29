// Prueba de los textos de interfaz (D0, carril T del p19): pnpm test:i18n
//   (node --import ./scripts/ts-resolve-hook.mjs scripts/test-i18n.mjs)
// Fuente de verdad: lib/i18n/<sección>.ts (un objeto { en, es } por sección); lib/translations.ts es
// el barril que arma `translations` con la misma forma, claves y orden que antes de D0.
// Los idiomas salen de Object.keys(translations) y `es` es la referencia (un idioma nuevo, X18, entra
// en I1-I4 e I6 sin tocar este archivo; I5 pide actualizar LANG_ORDER y todos los hashes, y su
// lista blanca de I4 se revisa entonces).
// Comprueba (FAIL):
//   I1 forma: cada idioma tiene las mismas claves que `es` a cualquier profundidad, con índices de
//     arreglo, el mismo largo y el mismo tipo de hoja. Se informa la ruta (footer.links.artists.3.href).
//   I2 sin vacíos: ningún string vacío o solo con espacios, ninguna hoja null o undefined (I1 solo
//     compara tipos: si las dos son null, pasa), ningún arreglo u objeto vacío.
//   I3 marcadores: por hoja, el mismo conjunto de {x} y el mismo número de saltos de línea.
//   I4 traducido: ninguna hoja igual a la de `es`, salvo rutas y cifras (STRUCTURAL), nombres
//     propios (SAME_OK_PATHS) y préstamos (SAME_OK_VALUES). Una entrada de la lista blanca que no
//     explica ninguna hoja falla como "entrada muerta".
//   I5 hash por sección: SHA-256 de cada sección con todos los idiomas, en el orden del objeto; el
//     orden de los idiomas (LANG_ORDER) y el de las secciones. Si un texto cambia a propósito, se
//     actualiza SOLO la línea de esa sección en SECTION_SHA256 (el FAIL imprime el valor nuevo). Si
//     cambia el orden de los idiomas, cambian todos los hashes y el FAIL lo dice. INFO con el hash
//     completo.
//   I6 barril: cada lib/i18n/*.ts (salvo shape.ts) exporta una constante con su mismo nombre, con
//     claves exactamente los idiomas, y translations[idioma][sección] es esa misma referencia; cada
//     sección de translations tiene su archivo; sin comentarios, el barril no tiene más literales
//     que los importes "./i18n/…" (relativos y sin extensión: los resuelve ts-resolve-hook); shape
//     se importa con `import type`; no hay lib/i18n/index.ts.
//   Autocontrol: I1-I4 son funciones puras; cada una falla con su fixture y una fixture válida pasa.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { translations } from "../lib/translations.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const I18N_DIR = path.join(ROOT, "lib/i18n");
const BARREL = "lib/translations.ts";

let ok = true;
const report = (label, pass, detail) => {
  ok &&= pass;
  console.log(`${pass ? "OK  " : "FAIL"} ${label}${detail ? " -> " + detail : ""}`);
};
const info = (label, detail) => console.log(`INFO ${label}${detail ? " -> " + detail : ""}`);
const list = (arr) => (arr.length ? arr.join(", ") : "");
const sha256 = (text) => createHash("sha256").update(text).digest("hex");

const LANGS = Object.keys(translations);
const REF = "es";
// Orden de los idiomas en el barril con el que se calcularon los hashes de SECTION_SHA256. Si se
// invierte o entra un idioma (X18), cambian TODOS los hashes: no se arregla línea por línea.
const LANG_ORDER = ["en", "es"];

// SHA-256 de JSON.stringify(Object.fromEntries(LANGS.map((l) => [l, translations[l][sección]]))),
// en el orden de las secciones del objeto. Calculados en cc266a8 (antes de D0); se actualiza a
// propósito, línea por línea, cuando cambian los textos de una sección.
const SECTION_SHA256 = {
  nav: "01f24c3e299b5a094f5f70a696235c31c9cfcbdc3b4aa630a4fecce54a5fa6e8",
  banner: "f14b8b7302df8eaa6325ec27be223df83c3b94054b5928d4ed835f19e1c2d08c",
  hero: "847208b8fd2d7017ca68677411493c53e3ac7f7851bf56202e67535f2c618073",
  features: "45edaf71ac6f986dbf567074b5883a5a724443d38305ce132de631621a9705e8",
  cta: "d5ec6e7b3efbf76b5b40cb24562b5b4a667916c7cc14f39e7fbe31bf00e3cfb9",
  newsletter: "f3f936ac3dec48425a2177a66f59e65c19632f4d5cbdf0a8c38108f8e7989313",
  videos: "f2a5ed3fbeb38e8aa524020eeffee2f54dfc329031e2dc875f5aa5b7af4b370a",
  footer: "d8084dc27ba2d509e6f444c8ebf1e25d6011b216c4f13d5dc67bb3d3d0f5d684",
};

// Lista blanca de I4: hojas que pueden ser iguales en los dos idiomas.
const STRUCTURAL = (p, v) => /(^|\.)href$/.test(p) || /^[\d.,]+$/.test(v); // rutas y cifras o códigos
const SAME_OK_PATHS = [/^footer\.links\.artists\.\d+\.label$/, /^hero\.stats\.\d+\.company$/]; // nombres de artistas
const SAME_OK_VALUES = ["Videos", "videos", "video", "Newsletter", "Email", "Booking", "Press kit"]; // préstamos
const ALLOW = { structural: STRUCTURAL, paths: SAME_OK_PATHS, values: SAME_OK_VALUES };

// ── Funciones puras (I1-I4) ──
const kind = (v) => (Array.isArray(v) ? "arreglo" : v === null ? "null" : typeof v === "object" ? "objeto" : typeof v);
const join = (at, k) => (at ? `${at}.${k}` : String(k));

/** Hojas (valores que no son objeto ni arreglo) como [ruta, valor]. */
function leaves(v, at = "") {
  if (Array.isArray(v)) return v.flatMap((x, i) => leaves(x, join(at, i)));
  if (v && typeof v === "object") return Object.entries(v).flatMap(([k, x]) => leaves(x, join(at, k)));
  return [[at, v]];
}

/** I1: diferencias de forma de `other` respecto de `ref`. */
function shapeDiffs(ref, other, at = "") {
  const a = kind(ref);
  const b = kind(other);
  if (a !== b) return [`${at || "(raíz)"}: ${a} ≠ ${b}`];
  if (a === "arreglo") {
    const out = ref.length === other.length ? [] : [`${at}: largo ${ref.length} ≠ ${other.length}`];
    for (let i = 0; i < Math.min(ref.length, other.length); i++) out.push(...shapeDiffs(ref[i], other[i], join(at, i)));
    return out;
  }
  if (a === "objeto") {
    const out = [];
    for (const k of Object.keys(ref)) if (!Object.hasOwn(other, k)) out.push(`${join(at, k)}: falta`);
    for (const k of Object.keys(other)) if (!Object.hasOwn(ref, k)) out.push(`${join(at, k)}: sobra`);
    for (const k of Object.keys(ref)) if (Object.hasOwn(other, k)) out.push(...shapeDiffs(ref[k], other[k], join(at, k)));
    return out;
  }
  return [];
}

/** I2: strings vacíos o solo con espacios, hojas null o undefined, arreglos y objetos vacíos. */
function emptyIssues(v, at = "") {
  if (v === null || v === undefined) return [`${at || "(raíz)"}: ${v === null ? "null" : "undefined"}`];
  if (Array.isArray(v)) return v.length === 0 ? [`${at}: arreglo vacío`] : v.flatMap((x, i) => emptyIssues(x, join(at, i)));
  if (v && typeof v === "object") {
    const entries = Object.entries(v);
    return entries.length === 0 ? [`${at || "(raíz)"}: objeto vacío`] : entries.flatMap(([k, x]) => emptyIssues(x, join(at, k)));
  }
  if (typeof v === "string" && v.trim() === "") return [`${at}: vacío`];
  return [];
}

const markers = (s) => [...new Set(s.match(/\{\w+\}/g) ?? [])].sort().join(" ");
const newlines = (s) => (s.match(/\n/g) ?? []).length;

/** I3: hojas comunes con distinto conjunto de {x} o distinto número de saltos de línea. */
function markerDiffs(ref, other) {
  const theirs = new Map(leaves(other));
  const out = [];
  for (const [p, v] of leaves(ref)) {
    const w = theirs.get(p);
    if (typeof v !== "string" || typeof w !== "string") continue;
    if (markers(v) !== markers(w)) out.push(`${p}: ${markers(v) || "sin marcadores"} ≠ ${markers(w) || "sin marcadores"}`);
    if (newlines(v) !== newlines(w)) out.push(`${p}: ${newlines(v)} ≠ ${newlines(w)} saltos de línea`);
  }
  return out;
}

/** I4: hojas iguales a la referencia sin explicación; `used` registra qué entradas de la lista sirvieron. */
function sameIssues(ref, other, allow) {
  const theirs = new Map(leaves(other));
  const issues = [];
  const used = { structural: 0, paths: new Map(), values: new Map() };
  const bump = (m, k) => m.set(k, (m.get(k) ?? 0) + 1);
  for (const [p, v] of leaves(ref)) {
    if (!theirs.has(p) || theirs.get(p) !== v) continue;
    if (allow.structural(p, String(v))) used.structural++;
    else if (allow.paths.some((re) => re.test(p))) bump(used.paths, String(allow.paths.find((re) => re.test(p))));
    else if (allow.values.includes(v)) bump(used.values, v);
    else issues.push(`${p}: "${v}"`);
  }
  const dead = [
    ...allow.paths.map(String).filter((re) => !used.paths.has(re)),
    ...allow.values.filter((v) => !used.values.has(v)).map((v) => JSON.stringify(v)),
  ];
  return { issues, used, dead };
}

// ── Autocontrol ──
{
  const valid = {
    es: { a: "Hola {name}", b: ["uno", "dos\ntres"], c: { d: "Booking", href: "/x" }, n: "01" },
    en: { a: "Hi {name}", b: ["one", "two\nthree"], c: { d: "Booking", href: "/x" }, n: "01" },
  };
  const allow = { structural: STRUCTURAL, paths: [], values: ["Booking"] };
  const variant = (edit) => {
    const en = structuredClone(valid.en);
    edit(en);
    return en;
  };
  const clean =
    shapeDiffs(valid.es, valid.en).length === 0 &&
    emptyIssues(valid.en).length === 0 &&
    markerDiffs(valid.es, valid.en).length === 0 &&
    sameIssues(valid.es, valid.en, allow).issues.length === 0 &&
    sameIssues(valid.es, valid.en, allow).dead.length === 0;
  report("autocontrol: la fixture válida pasa I1-I4", clean);

  const cases = [
    ["I1 clave que falta", shapeDiffs(valid.es, variant((en) => delete en.c.d)), "c.d: falta"],
    ["I1 clave que sobra", shapeDiffs(valid.es, variant((en) => (en.extra = "x"))), "extra: sobra"],
    ["I1 largo distinto", shapeDiffs(valid.es, variant((en) => en.b.push("three"))), "b: largo 2 ≠ 3"],
    ["I1 tipo distinto", shapeDiffs(valid.es, variant((en) => (en.c = "x"))), "c: objeto ≠ string"],
    ["I2 solo espacios", emptyIssues(variant((en) => (en.a = "  "))), "a: vacío"],
    ["I2 arreglo vacío", emptyIssues(variant((en) => (en.b = []))), "b: arreglo vacío"],
    ["I2 null", emptyIssues(variant((en) => (en.c.d = null))), "c.d: null"],
    ["I2 undefined", emptyIssues(variant((en) => (en.b[0] = undefined))), "b.0: undefined"],
    ["I3 {title} → {titulo}", markerDiffs({ a: "Ver {title}" }, { a: "View {titulo}" }), "a: {title} ≠ {titulo}"],
    ["I3 saltos de línea", markerDiffs(valid.es, variant((en) => (en.b[1] = "two three"))), "b.1: 1 ≠ 0 saltos de línea"],
    ["I4 en = es fuera de la lista", sameIssues(valid.es, variant((en) => (en.a = "Hola {name}")), allow).issues, 'a: "Hola {name}"'],
    ["I4 entrada muerta", sameIssues(valid.es, valid.en, { ...allow, values: ["Booking", "Nunca"] }).dead, '"Nunca"'],
  ];
  const blind = cases.filter(([, got, want]) => !got.includes(want)).map(([name, got]) => `${name} (${list(got) || "nada"})`);
  report(`autocontrol: I1-I4 fallan con sus ${cases.length} fixtures`, blind.length === 0, list(blind));
}

// ── I1-I4 sobre translations ──
info(`idiomas: ${LANGS.join(", ")} (referencia ${REF})`, LANGS.map((l) => `${l} ${leaves(translations[l]).length} hojas`).join(", "));
report(`I0 la referencia "${REF}" es uno de los idiomas`, LANGS.includes(REF), LANGS.join(", "));
for (const l of LANGS) {
  const empty = emptyIssues(translations[l]);
  report(`I2 [${l}] sin textos vacíos`, empty.length === 0, list(empty));
  if (l === REF) continue;
  const shape = shapeDiffs(translations[REF], translations[l]);
  report(`I1 [${l}] misma forma que ${REF}`, shape.length === 0, list(shape));
  const marks = markerDiffs(translations[REF], translations[l]);
  report(`I3 [${l}] mismos marcadores {x} y saltos de línea que ${REF}`, marks.length === 0, list(marks));
}
{
  const issues = [];
  let structural = 0;
  const paths = new Map();
  const values = new Map();
  for (const l of LANGS.filter((x) => x !== REF)) {
    const r = sameIssues(translations[REF], translations[l], ALLOW);
    issues.push(...r.issues.map((x) => `[${l}] ${x}`));
    structural += r.used.structural;
    for (const [k, n] of r.used.paths) paths.set(k, (paths.get(k) ?? 0) + n);
    for (const [k, n] of r.used.values) values.set(k, (values.get(k) ?? 0) + n);
  }
  report(`I4 ninguna hoja igual a ${REF} fuera de la lista blanca`, issues.length === 0, list(issues));
  const dead = [
    ...SAME_OK_PATHS.map(String).filter((re) => !paths.has(re)),
    ...SAME_OK_VALUES.filter((v) => !values.has(v)).map((v) => JSON.stringify(v)),
  ];
  report("I4 sin entradas muertas en la lista blanca", dead.length === 0, dead.length ? `entrada muerta: ${list(dead)}` : "");
  const sum = (m) => [...m.values()].reduce((a, b) => a + b, 0);
  info(
    `I4 hojas iguales explicadas: ${structural + sum(paths) + sum(values)}`,
    `rutas y cifras ${structural} · nombres ${sum(paths)} · préstamos ${sum(values)}`,
  );
}

// ── I5 hash por sección ──
{
  const langsOk = JSON.stringify(LANGS) === JSON.stringify(LANG_ORDER);
  report(
    `I5 idiomas en el orden registrado (${LANG_ORDER.join(", ")})`,
    langsOk,
    langsOk
      ? ""
      : `${LANGS.join(", ")}: cambian todos los hashes; restaura el orden en ${BARREL} o, si es a propósito (X18), actualiza LANG_ORDER y todo SECTION_SHA256`,
  );
  const expected = Object.keys(SECTION_SHA256);
  const badOrder = LANGS.filter((l) => JSON.stringify(Object.keys(translations[l])) !== JSON.stringify(expected));
  report(
    `I5 secciones en el orden registrado (${expected.join(", ")})`,
    badOrder.length === 0,
    badOrder.map((l) => `${l}: ${Object.keys(translations[l]).join(", ")}`).join(" · "),
  );
  for (const k of expected) {
    const got = sha256(JSON.stringify(Object.fromEntries(LANGS.map((l) => [l, translations[l][k]]))));
    const hint = langsOk
      ? `si el cambio de texto es a propósito, actualiza solo la línea "${k}" de SECTION_SHA256`
      : `cambió el orden de los idiomas (ver "I5 idiomas"): no actualices esta línea sola`;
    report(`I5 hash de ${k}`, got === SECTION_SHA256[k], got === SECTION_SHA256[k] ? "" : `nuevo ${got}: ${hint}`);
  }
  const full = JSON.stringify(translations);
  info("hash completo de JSON.stringify(translations)", `${sha256(full)} (${Buffer.byteLength(full)} bytes)`);
}

// ── I6 barril ──
{
  report("I6 lib/i18n/ existe", existsSync(I18N_DIR));
  const files = existsSync(I18N_DIR) ? readdirSync(I18N_DIR).filter((f) => f.endsWith(".ts")) : [];
  report("I6 sin lib/i18n/index.ts (el hook de pruebas no resuelve carpetas)", !files.includes("index.ts"));
  // Solo .ts de primer nivel: un archivo en una subcarpeta o con otra extensión escaparía a I1-I6
  // (J6 de test:journal y test:servicios sí recorren subcarpetas). Si algún día se adopta
  // lib/i18n/<sub>/, este FAIL obliga a ajustar I6 a conciencia.
  const walk = (rel) =>
    readdirSync(path.join(I18N_DIR, rel), { withFileTypes: true }).flatMap((d) =>
      d.isDirectory() ? walk(path.join(rel, d.name)) : [path.join(rel, d.name)],
    );
  const extra = existsSync(I18N_DIR) ? walk("").filter((f) => !/^[a-z][a-z0-9-]*\.ts$/.test(f)) : [];
  report("I6 lib/i18n solo tiene archivos .ts de primer nivel", extra.length === 0, list(extra));
  const sections = files.filter((f) => f !== "shape.ts" && f !== "index.ts").map((f) => f.replace(/\.ts$/, ""));
  const keys = Object.keys(translations[REF]);
  const missing = keys.filter((k) => !sections.includes(k));
  report("I6 cada sección de translations tiene su lib/i18n/<sección>.ts", missing.length === 0, list(missing));
  const bad = [];
  for (const k of sections) {
    const mod = await import(pathToFileURL(path.join(I18N_DIR, `${k}.ts`)).href);
    const section = mod[k];
    if (!section || typeof section !== "object") {
      bad.push(`${k}.ts no exporta \`${k}\``);
      continue;
    }
    const langs = Object.keys(section);
    if (JSON.stringify([...langs].sort()) !== JSON.stringify([...LANGS].sort())) bad.push(`${k}: idiomas ${langs.join(", ")}`);
    for (const l of LANGS) if (translations[l]?.[k] !== section[l]) bad.push(`translations.${l}.${k} no es ${k}.${l}`);
  }
  report(`I6 el barril reexporta las ${sections.length} secciones (misma referencia por idioma)`, bad.length === 0, list(bad));

  const barrel = readFileSync(path.join(ROOT, BARREL), "utf8");
  const code = barrel.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");
  const literals = [...code.matchAll(/(["'`])((?:\\.|(?!\1)[^\\])*)\1/g)].map((m) => m[2]);
  const strays = literals.filter((s) => !/^\.\/i18n\/[a-z][a-z0-9-]*$/.test(s));
  report(`I6 ${BARREL} sin textos: solo importes "./i18n/…" relativos y sin extensión`, strays.length === 0 && literals.length > 0, list(strays.map((s) => JSON.stringify(s))));
  report(`I6 ${BARREL} sin alias @/`, !code.includes("@/"));
  report(`I6 ${BARREL} importa shape con \`import type\``, /import type \{[^}]*\} from "\.\/i18n\/shape";/.test(code));
}

process.exit(ok ? 0 : 1);
