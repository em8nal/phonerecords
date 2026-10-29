// Índices generados de content/ (carril S del p19): un módulo por colección,
// content/generated/<colección>.ts, que importa cada content/<colección>/<slug>.json.
//
//   pnpm content:index                    (node scripts/content-index.mjs) regenera los 5 índices
//   node scripts/content-index.mjs --check   sale con 1 si alguno quedó viejo (no escribe)
//   node scripts/content-index.mjs --embed   plan B: el índice embebe el literal en vez de importar
//   node scripts/content-index.mjs --import  vuelve al modo por defecto (imports de JSON)
//
// Sin --embed ni --import, cada índice conserva el modo que ya tiene en disco (cabecera
// "// modo: embed"), y --check compara en ese mismo modo.
//
// Por qué un índice generado y no fs en tiempo de ejecución: el JSON entra al bundle del servidor
// por import estático, igual que antes el literal TS, así que una regeneración ISR no lee el disco
// (sin outputFileTracingIncludes). Por qué uno por colección: lib/events.ts no arrastra releases ni
// videos. Por qué "content/generated/<col>.ts" sin punto en el nombre base: scripts/ts-resolve-hook.mjs
// solo agrega ".ts" a especificadores que no terminan en /\.[a-z]+$/.
//
// El índice sale de la carpeta (nunca de una lista escrita a mano): Keystatic escribe y borra
// archivos sueltos, y el build regenera el índice antes de next build. `pnpm test:content` (C5)
// falla si el índice versionado no coincide con la carpeta.
import { existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Colecciones: carpeta, prefijo del identificador y nombre de la exportación. */
export const COLLECTIONS = [
  { name: "artists", prefix: "a", exportName: "artistEntries" },
  { name: "releases", prefix: "r", exportName: "releaseEntries" },
  { name: "videos", prefix: "v", exportName: "videoEntries" },
  { name: "events", prefix: "e", exportName: "eventEntries" },
  { name: "journal", prefix: "j", exportName: "journalEntries" },
];

/** Nombre válido de una entrada: el slug en kebab-case + ".json". */
export const ENTRY_FILE_RE = /^[a-z0-9]+(-[a-z0-9]+)*\.json$/;
/** Archivos que pueden vivir en una carpeta de colección sin ser entradas. */
export const IGNORED_FILES = new Set([".gitkeep", ".DS_Store"]);

const EMBED_MARK = "// modo: embed";

/** Ruta (relativa a la raíz del repo) del índice de una colección. */
export const indexPath = (name) => `content/generated/${name}.ts`;

/**
 * Entradas de una colección en disco, ordenadas por unidad de código (nunca localeCompare ni el
 * orden de readdirSync). Lanza un Error que nombra el archivo si sobra algo o un JSON no parsea.
 */
export function readCollection(root, name) {
  const dir = path.join(root, "content", name);
  if (!existsSync(dir)) throw new Error(`falta la carpeta content/${name}/`);
  const files = readdirSync(dir, { withFileTypes: true });
  const stray = files.filter((d) => !IGNORED_FILES.has(d.name) && (!d.isFile() || !ENTRY_FILE_RE.test(d.name)));
  if (stray.length) {
    throw new Error(`archivo inesperado en content/${name}/: ${stray.map((d) => d.name).join(", ")} (solo <slug>.json en kebab-case)`);
  }
  return files
    .filter((d) => !IGNORED_FILES.has(d.name))
    .map((d) => d.name)
    .sort()
    .map((file) => {
      const raw = readFileSync(path.join(dir, file), "utf8");
      let data;
      try {
        data = JSON.parse(raw);
      } catch (err) {
        throw new Error(`content/${name}/${file} no es JSON válido: ${err.message}`);
      }
      return { file, slug: file.slice(0, -".json".length), raw, data };
    });
}

/** Identificador de la entrada en el índice: prefijo + slug con "-" → "_" (inyectivo: los slugs no llevan "_"). */
const ident = (prefix, slug) => `${prefix}_${slug.replace(/-/g, "_")}`;

/**
 * Texto del índice de una colección. `entries`: [{ slug, data }] ya ordenadas. `mode`: "import"
 * (por defecto) o "embed".
 */
export function renderIndex(collection, entries, mode = "import") {
  const { name, prefix, exportName } = collection;
  const header = `// GENERADO por scripts/content-index.mjs desde content/${name}/*.json. No editar: pnpm content:index.\n`;
  if (mode === "embed") {
    const body = entries.map((e) => `  ${JSON.stringify(e.data, null, 2).replace(/\n/g, "\n  ")},\n`).join("");
    return `${header}${EMBED_MARK}\nexport const ${exportName}: unknown[] = [${entries.length ? `\n${body}` : ""}];\n`;
  }
  const imports = entries
    .map((e) => `import ${ident(prefix, e.slug)} from "../${name}/${e.slug}.json" with { type: "json" };\n`)
    .join("");
  const list = entries.map((e) => `  ${ident(prefix, e.slug)},\n`).join("");
  return `${header}${imports}${imports ? "\n" : ""}export const ${exportName}: unknown[] = [${entries.length ? `\n${list}` : ""}];\n`;
}

/** Modo del índice que ya está en disco ("embed" si su cabecera lo dice; si no, "import"). */
export function currentMode(root, name) {
  const file = path.join(root, indexPath(name));
  return existsSync(file) && readFileSync(file, "utf8").includes(`\n${EMBED_MARK}\n`) ? "embed" : "import";
}

/**
 * Los 5 índices como { "content/generated/<col>.ts": texto }. Sin `mode`, cada uno en el modo que
 * ya tiene en disco. No escribe nada.
 */
export function buildIndexes(root, { mode } = {}) {
  return Object.fromEntries(
    COLLECTIONS.map((c) => [indexPath(c.name), renderIndex(c, readCollection(root, c.name), mode ?? currentMode(root, c.name))]),
  );
}

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const argv = process.argv.slice(2);
  const check = argv.includes("--check");
  const mode = argv.includes("--embed") ? "embed" : argv.includes("--import") ? "import" : undefined;
  let indexes;
  try {
    indexes = buildIndexes(root, { mode });
  } catch (err) {
    console.error(`FAIL ${err.message}`);
    process.exit(1);
  }
  const stale = Object.entries(indexes).filter(([rel, text]) => {
    const file = path.join(root, rel);
    return !existsSync(file) || readFileSync(file, "utf8") !== text;
  });
  if (check) {
    if (stale.length) {
      console.error(`FAIL índice desactualizado: ${stale.map(([rel]) => rel).join(", ")} (corre pnpm content:index)`);
      process.exit(1);
    }
    console.log("OK   los 5 índices de content/generated/ están al día");
    return;
  }
  for (const [rel, text] of stale) {
    mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    writeFileSync(path.join(root, rel), text);
  }
  console.log(stale.length ? `escrito: ${stale.map(([rel]) => rel).join(", ")}` : "sin cambios: los 5 índices ya estaban al día");
}

// Solo escribe cuando se ejecuta directo (test-content.mjs importa buildIndexes). NFC en los dos
// lados: la ruta del repo lleva "É" y macOS la entrega descompuesta en import.meta.url.
// realpath en los dos lados: una ruta que pasa por un symlink (p. ej. /tmp en macOS) salía sin
// escribir nada y sin aviso, y con --check eso era un falso verde.
const real = (p) => {
  try {
    return realpathSync(p).normalize("NFC");
  } catch {
    return path.resolve(p).normalize("NFC");
  }
};
const isMain = (p) => Boolean(p) && real(p) === real(fileURLToPath(import.meta.url));
if (isMain(process.argv[1])) main();
