// Peso de la imagen para redes de las fichas de lanzamiento, sin servidor (carril M, p19).
// Copiar a scripts/measure-og.mjs y correr desde la raíz del repo o del worktree:
//   node scripts/measure-og.mjs                      # las 33 fichas
//   node scripts/measure-og.mjs klaus-b-destellos-de-ti newen-afrobeat-grietas
//   OG_OUT=/ruta/carpeta node scripts/measure-og.mjs  # además guarda cada imagen
// Llama a la función por defecto de app/[lang]/releases/[slug]/opengraph-image.tsx tal cual
// (process.cwd() debe ser la raíz: de ahí lee public/releases). Necesita red: fuente
// Fraunces de Google y portadas remotas. Un solo proceso, en serie (~150 MB de RAM).
// FAIL si alguna pesa más de 300 000 B o no responde image/jpeg. Sale con código 1.
// Validado el 29-10 contra producción: con el código de e13fb5a da 492 949 B para
// Destellos de ti, el mismo byte a byte que https://phonerecords.cl/es/releases/klaus-b-destellos-de-ti/opengraph-image.
import { registerHooks, createRequire } from "node:module";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = process.cwd();
const LIMIT = 300_000;
const ts = createRequire(path.join(ROOT, "package.json"))("typescript");

const withExt = (href) => {
  for (const ext of ["", ".ts", ".tsx"]) {
    const p = fileURLToPath(href + ext);
    if (existsSync(p) && !p.endsWith(path.sep) && /\.[a-z]+$/i.test(p)) return pathToFileURL(p).href;
  }
  return null;
};

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const r = withExt(pathToFileURL(path.join(ROOT, specifier.slice(2))).href);
      if (r) return nextResolve(r, context);
    }
    // Solo para código del repo: los require relativos de node_modules (CJS) quedan intactos.
    if (specifier.startsWith(".") && context.parentURL && !context.parentURL.includes("/node_modules/")) {
      const r = withExt(new URL(specifier, context.parentURL).href);
      if (r) return nextResolve(r, context);
    }
    try {
      return nextResolve(specifier, context);
    } catch (err) {
      // "next/og" y similares: paquete sin mapa `exports`, ESM exige la extensión.
      if (!specifier.startsWith(".") && specifier.includes("/") && !/\.[a-z]+$/i.test(specifier)) {
        return nextResolve(`${specifier}.js`, context);
      }
      throw err;
    }
  },
  load(url, context, nextLoad) {
    if (!url.endsWith(".tsx")) return nextLoad(url, context);
    const src = readFileSync(fileURLToPath(url), "utf8");
    // JSX clásico: react/jsx-runtime es CJS y no expone `jsx` como export con nombre a ESM.
    const out = ts.transpileModule(src, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React },
    });
    return { format: "module", source: `import React from "react";\n${out.outputText}`, shortCircuit: true };
  },
});

const og = await import(pathToFileURL(path.join(ROOT, "app/[lang]/releases/[slug]/opengraph-image.tsx")).href);
const { releases } = await import(pathToFileURL(path.join(ROOT, "lib/releases.ts")).href);
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : releases.map((r) => r.slug);
const outDir = process.env.OG_OUT;
if (outDir) mkdirSync(outDir, { recursive: true });

let ok = true;
let max = 0;
for (const slug of slugs) {
  const res = await og.default({ params: Promise.resolve({ lang: "es", slug }) });
  const bytes = Buffer.from(await res.arrayBuffer());
  const type = res.headers.get("content-type") ?? "";
  const pass = bytes.length <= LIMIT && type === "image/jpeg";
  ok &&= pass;
  max = Math.max(max, bytes.length);
  if (outDir) writeFileSync(path.join(outDir, `${slug}.${type === "image/jpeg" ? "jpg" : "png"}`), bytes);
  console.log(`${pass ? "OK  " : "FAIL"} ${slug} ${bytes.length} B ${type}`);
}
console.log(`MAX ${max} B (límite ${LIMIT}; export contentType = ${og.contentType})`);
process.exit(ok ? 0 : 1);
