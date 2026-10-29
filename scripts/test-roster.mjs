// Prueba anti-desfase del roster: pnpm test:roster
//   (node --import ./scripts/ts-resolve-hook.mjs scripts/test-roster.mjs)
// Fuente de verdad: `artists` de lib/artists.ts. Comprueba que:
//   1. footer ES y EN (translations.footer.links.artists) enlazan exactamente a los mismos
//      artistas, con los mismos `name` y en la misma secuencia (una sola fuente de orden).
//   2. ES y EN del footer tienen la misma secuencia entre sí.
//   3. components/landing/integrations-section.tsx exporta `roster` y su secuencia
//      (slug + name) es exactamente la de `artists`.
// Carril N (p19): R1 primera oración de cada bio (nombre, lugar y año de `origin`); R2 `role`;
//   R3 enlaces https en el orden de ARTIST_PLATFORMS con su etiqueta; R4 rel="me" e íconos;
//   R5 `sameAs` (MusicBrainz y Wikidata); R6 press kit ES · EN (PDF, mapa de tamaños, nombre
//   de descarga); R7 "Datos clave" con relojes fijos.
// Los archivos TSX no se pueden importar desde Node (alias @/, JSX): se leen como texto.
import { readFileSync, existsSync, statSync } from "node:fs";
import { artists, getArtist, ARTIST_PLATFORMS, linkPlatform, artistLinkRel, artistSameAs } from "../lib/artists.ts";
import { artistKeyFacts, splitOrigin } from "../lib/artist-facts.ts";
import { PRESS_KIT_BYTES, pressKitHref, pressKitDownloadName, formatPdfSize } from "../lib/press-kits.ts";
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
    const { place, year } = splitOrigin(a.origin);
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

// R2. Formación o instrumento ("Datos clave"), en los dos idiomas.
for (const a of artists) {
  const empty = LANGS.filter((l) => !a.role?.[l]?.trim());
  report(`R2 ${a.slug}: role.es y role.en`, empty.length === 0, empty.length ? `vacío en ${list(empty)}` : "");
}

// R7. "Datos clave" de la ficha con relojes fijos (no depende del día en que corre la prueba).
{
  const OCT29 = Date.UTC(2026, 9, 29, 15);
  const NOV1 = Date.UTC(2026, 10, 1);
  const fact = (slug, lang, now, id) => artistKeyFacts(slug, lang, now).find((f) => f.id === id);
  const titles = (slug, lang, now) => (fact(slug, lang, now, "releases")?.items ?? []).map((i) => i.text);
  const sameList = (got, want) => JSON.stringify(got) === JSON.stringify(want);
  for (const lang of LANGS) {
    const formed = artists.filter((a) => fact(a.slug, lang, OCT29, "formed")).map((a) => a.slug);
    report(
      `R7 [${lang}] año de formación solo en Newen (2009)`,
      sameList(formed, ["newen-afrobeat"]) && fact("newen-afrobeat", lang, OCT29, "formed")?.value === "2009",
      list(formed),
    );
    const cases = [
      ["newen-afrobeat", OCT29, ['Newen Plays Fela (12" Vinyl)']],
      ["newen-afrobeat", NOV1, ["La Fuerza", 'Newen Plays Fela (12" Vinyl)']],
      ["klaus-b", OCT29, ["Destellos de ti"]],
      ["ecamhi", OCT29, ["Cuántas veces — Con.fusión"]],
    ];
    for (const [slug, now, want] of cases) {
      const got = titles(slug, lang, now);
      report(
        `R7 [${lang}] ${slug} al ${new Date(now).toISOString().slice(0, 10)}: lanzamientos con PHŌNÉ`,
        sameList(got, want),
        got.join(" | "),
      );
    }
    const releaseHrefs = artists.flatMap((a) => fact(a.slug, lang, OCT29, "releases")?.items ?? []).map((i) => i.href);
    const badRel = releaseHrefs.filter((h) => !new RegExp(`^/${lang}/releases/[a-z0-9-]+$`).test(h));
    report(`R7 [${lang}] lanzamientos enlazan a /${lang}/releases/<slug>`, releaseHrefs.length > 0 && badRel.length === 0, list(badRel));
    const tooMany = artists.filter((a) => (fact(a.slug, lang, NOV1, "releases")?.items.length ?? 0) > 3).map((a) => a.slug);
    report(`R7 [${lang}] máximo 3 lanzamientos`, tooMany.length === 0, list(tooMany));
    const badBooking = artists
      .filter((a) => fact(a.slug, lang, OCT29, "booking")?.href !== `/${lang}/contacto?topic=booking`)
      .map((a) => a.slug);
    report(`R7 [${lang}] booking → /${lang}/contacto?topic=booking`, badBooking.length === 0, list(badBooking));
    const badLabel = artists.filter((a) => fact(a.slug, lang, OCT29, "label")?.href !== `/${lang}/sello`).map((a) => a.slug);
    report(`R7 [${lang}] sello → /${lang}/sello`, badLabel.length === 0, list(badLabel));
    const order = artistKeyFacts("newen-afrobeat", lang, OCT29).map((f) => f.id).join(" > ");
    report(
      `R7 [${lang}] orden de las filas`,
      order === "origin > formed > role > genres > label > releases > booking",
      order,
    );
  }
}

// R3. Enlaces del artista: https, plataforma conocida, etiqueta canónica y el orden del estándar
// del 21-10 (plan 11a), que vive solo en ARTIST_PLATFORMS de lib/artists.ts.
{
  const order = ARTIST_PLATFORMS.map((p) => p.id);
  for (const a of artists) {
    const problems = [];
    let last = -1;
    for (const l of a.links) {
      const p = linkPlatform(l.href);
      if (!l.href.startsWith("https://")) problems.push(`${l.label}: no es https`);
      if (!p) {
        problems.push(`${l.label}: plataforma desconocida (${l.href})`);
        continue;
      }
      if (l.label !== p.label) problems.push(`etiqueta «${l.label}» ≠ «${p.label}»`);
      const idx = order.indexOf(p.id);
      if (idx <= last) problems.push(`${p.label} fuera de orden o repetido`);
      last = Math.max(last, idx);
    }
    report(`R3 ${a.slug}: enlaces en orden (${a.links.map((l) => l.label).join(" · ")})`, problems.length === 0, list(problems));
  }
}

// R4. rel="me" solo en los perfiles propios (Discogs es una ficha de base de datos); la ficha
// usa artistLinkRel y dibuja el ícono de cada plataforma.
{
  report("R4 artistLinkRel(Spotify) = me noopener noreferrer", artistLinkRel("https://open.spotify.com/artist/x") === "me noopener noreferrer");
  report("R4 artistLinkRel(Discogs) = noopener noreferrer", artistLinkRel("https://www.discogs.com/artist/1") === "noopener noreferrer");
  report("R4 artistLinkRel(desconocido) sin me", artistLinkRel("https://example.com/") === "noopener noreferrer");
  const page = readFileSync(new URL("../app/[lang]/artistas/[slug]/page.tsx", import.meta.url), "utf8");
  report("R4 la ficha usa artistLinkRel( y <PlatformIcon", page.includes("artistLinkRel(") && page.includes("<PlatformIcon"));
  const icons = readFileSync(new URL("../components/phone/platform-icon.tsx", import.meta.url), "utf8");
  const noIcon = ARTIST_PLATFORMS.filter((p) => !new RegExp(`["']?${p.id}["']?\\s*:\\s*"M`).test(icons)).map((p) => p.id);
  report("R4 platform-icon.tsx trae un trazado por plataforma", noIcon.length === 0, list(noIcon));
  report(
    "R4 íconos monocromos y ocultos al lector",
    icons.includes('fill="currentColor"') && icons.includes('aria-hidden="true"') && !/#[0-9a-f]{3,6}\b/i.test(icons),
  );
}

// R5. sameAs: solo identificadores de MusicBrainz y Wikidata (no se muestran en la UI), sin
// repetir `links`; Newen Afrobeat trae los tres que confirmó la búsqueda del 29-10.
{
  const SAME_AS_RE = /^https:\/\/(?:musicbrainz\.org\/artist\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|www\.wikidata\.org\/wiki\/Q\d+)$/;
  for (const a of artists) {
    const ids = a.sameAs ?? [];
    const bad = ids.filter((u) => !SAME_AS_RE.test(u));
    const dup = ids.filter((u) => a.links.some((l) => l.href === u));
    report(`R5 ${a.slug}: sameAs (${ids.length})`, bad.length === 0 && dup.length === 0, list([...bad, ...dup]));
  }
  const newen = artistSameAs(getArtist("newen-afrobeat"));
  const want = ["e9f34d84-4b44-43d2-a2a2-00f5c235a2c1", "Q56879388", "discogs.com/artist/4910686"];
  const miss = want.filter((w) => !newen.some((u) => u.includes(w)));
  report("R5 artistSameAs(newen) con MusicBrainz, Wikidata y Discogs", miss.length === 0, list(miss));
  report("R5 artistSameAs sin duplicados", new Set(newen).size === newen.length);
  const page = readFileSync(new URL("../app/[lang]/artistas/[slug]/page.tsx", import.meta.url), "utf8");
  report("R5 el JSON-LD de la ficha usa artistSameAs(", page.includes("artistSameAs("));
}

// R6. Press kit ES · EN: cada PDF existe, el mapa de tamaños tiene su entrada y redondea igual
// que el archivo real (si no, actualizar PRESS_KIT_BYTES con `stat -f%z public/press-kits/*.pdf`),
// y el nombre de descarga es explícito. La ficha y /press-kit usan los botones.
{
  for (const slug of [...artists.map((a) => a.slug), null]) {
    const key = slug ?? "press-kit";
    for (const lang of LANGS) {
      const href = pressKitHref(slug, lang);
      const file = new URL(`../public${href}`, import.meta.url);
      const exists = existsSync(file);
      const mapped = PRESS_KIT_BYTES[key]?.[lang];
      const real = exists ? statSync(file).size : undefined;
      const sameSize = exists && mapped != null && LANGS.every((ui) => formatPdfSize(mapped, ui) === formatPdfSize(real, ui));
      const name = pressKitDownloadName(slug, lang);
      report(
        `R6 ${key}-${lang}: PDF, tamaño y nombre de descarga`,
        exists && sameSize && /^phone-records-[a-z0-9-]+-(es|en)\.pdf$/.test(name) && name.endsWith(`-${key}-${lang}.pdf`),
        `${href} · mapa ${mapped ?? "—"} · disco ${real ?? "no existe"} · ${mapped != null ? formatPdfSize(mapped, "es") : ""} · ${name}`,
      );
    }
  }
  report("R6 formatPdfSize: «PDF · 0,3 MB» / «PDF · 0.3 MB»", formatPdfSize(320485, "es") === "PDF · 0,3 MB" && formatPdfSize(320485, "en") === "PDF · 0.3 MB");
  const page = readFileSync(new URL("../app/[lang]/artistas/[slug]/page.tsx", import.meta.url), "utf8");
  const kit = readFileSync(new URL("../app/[lang]/press-kit/page.tsx", import.meta.url), "utf8");
  report("R6 la ficha y /press-kit usan <PressKitDownloads", page.includes("<PressKitDownloads") && kit.includes("<PressKitDownloads"));
  const comp = readFileSync(new URL("../components/phone/press-kit-downloads.tsx", import.meta.url), "utf8");
  report(
    "R6 los botones llevan hrefLang, type=application/pdf y download",
    comp.includes("hrefLang={") && comp.includes('type="application/pdf"') && comp.includes("download={pressKitDownloadName("),
  );
}

process.exit(ok ? 0 : 1);
