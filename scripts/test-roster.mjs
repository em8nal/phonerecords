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

// ── Carril N ──
const LANGS = ["es", "en"];
const list = (arr) => (arr.length ? arr.join(", ") : "");
/** Sin tildes y en minúsculas: "Chile" calza con "chileno" y con "Chilean". */
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// R1. Primera oración de cada bio: nombre, un lugar de `origin` y el año si `origin` lo trae.
// Misma regla de corte que firstSentence de app/llms.txt/route.ts (no corta en "Con.fusión").
{
  const firstSentence = (bio) => {
    const paragraph = bio.split(/\n{2,}/)[0].replace(/\s+/g, " ").trim();
    return paragraph.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? paragraph;
  };
  for (const a of artists) {
    const m = /^(.*\S)\s*·\s*(\d{4})$/.exec(a.origin);
    const place = m ? m[1] : a.origin;
    const year = m?.[2];
    const places = place.split(/[,·]/).map((p) => norm(p.trim())).filter(Boolean);
    for (const lang of LANGS) {
      const first = firstSentence(a.bio[lang]);
      const s = norm(first);
      const missing = [
        s.includes(norm(a.name)) ? null : "nombre",
        places.some((p) => s.includes(p)) ? null : "lugar",
        !year || s.includes(year) ? null : `año ${year}`,
      ].filter(Boolean);
      report(
        `R1 [${lang}] ${a.slug}: la primera oración dice quién es`,
        missing.length === 0,
        missing.length ? `falta ${list(missing)} en «${first}»` : "",
      );
    }
  }
}

process.exit(ok ? 0 : 1);
