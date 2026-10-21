// Prueba anti-desfase del roster: pnpm test:roster
//   (node --import ./scripts/ts-resolve-hook.mjs scripts/test-roster.mjs)
// Fuente de verdad: `artists` de lib/artists.ts. Comprueba que:
//   1. footer ES y EN (translations.footer.links.artists) enlazan exactamente a los mismos
//      artistas, con los mismos `name` y en la misma secuencia (una sola fuente de orden).
//   2. ES y EN del footer tienen la misma secuencia entre sí.
//   3. components/landing/integrations-section.tsx exporta `roster` y su secuencia
//      (slug + name) es exactamente la de `artists`.
// El archivo TSX no se puede importar desde Node (alias @/, JSX): se lee como texto.
import { readFileSync } from "node:fs";
import { artists } from "../lib/artists.ts";
import { translations } from "../lib/translations.ts";

const expected = artists.map(({ slug, name }) => ({ slug, name }));
const nameBySlug = new Map(expected.map((e) => [e.slug, e.name]));

let ok = true;
const report = (label, pass, detail) => {
  ok &&= pass;
  console.log(`${pass ? "OK  " : "FAIL"} ${label}${detail ? " -> " + detail : ""}`);
};

const sameSet = (got) =>
  got.length === expected.length &&
  new Set(got.map((g) => g.slug)).size === got.length &&
  got.every((g) => nameBySlug.get(g.slug) === g.name);

const footer = {};
for (const lang of ["es", "en"]) {
  const links = translations[lang].footer?.links?.artists;
  if (!Array.isArray(links)) {
    report(`footer ${lang}`, false, "translations.footer.links.artists no existe");
    continue;
  }
  footer[lang] = links.map((l) => ({
    slug: String(l.href).replace(/^\/artistas\//, ""),
    name: l.label,
  }));
  report(
    `footer ${lang} = artists (misma secuencia de slugs y mismos nombres)`,
    sameSet(footer[lang]) && JSON.stringify(footer[lang]) === JSON.stringify(expected),
    footer[lang].map((g) => g.slug).join(" > "),
  );
}
report(
  "footer es/en misma secuencia",
  Boolean(footer.es && footer.en) && JSON.stringify(footer.es) === JSON.stringify(footer.en),
);

const src = readFileSync(
  new URL("../components/landing/integrations-section.tsx", import.meta.url),
  "utf8",
);
report("export const roster en integrations-section.tsx", /export const roster\b/.test(src));
const portada = [...src.matchAll(/\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g)].map((m) => ({
  slug: m[1],
  name: m[2],
}));
report(
  "roster de portada = artists (secuencia exacta)",
  JSON.stringify(portada) === JSON.stringify(expected),
  portada.map((g) => g.slug).join(" > "),
);

process.exit(ok ? 0 : 1);
