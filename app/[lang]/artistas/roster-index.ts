// Datos del índice /[lang]/artistas (M13, carril R del p19): "Aparece en", JSON-LD y description.
//
// Módulo puro junto a la página. Imports relativos e `import type`: lo cargan app/sitemap.ts
// (lastmod de /artistas) y scripts/test-seo.mjs desde Node, sin el alias @/.
import { artists, type Artist } from "../../../lib/artists";
import { releases, type Release } from "../../../lib/releases";
import { getArtistPortrait } from "../../../lib/artist-media";
import { SITE, WEBSITE_ID, ORG_ID, LABEL_NAME, absUrl, artistId, toLang } from "../../../lib/schema";

export type Appearance = { artist: Artist; releases: Release[] };

/**
 * "Aparece en": por artista del roster (en el orden de `artists`), los lanzamientos de otros
 * artistas donde figura en `featuredArtistSlugs`, del más reciente al más antiguo. Un artista
 * nunca "aparece" en un lanzamiento propio, y los artistas sin apariciones no se listan.
 */
export function getAppearances(): Appearance[] {
  return artists
    .map((artist) => ({
      artist,
      releases: releases
        .filter((r) => r.artistSlug !== artist.slug && (r.featuredArtistSlugs ?? []).includes(artist.slug))
        // ISO (también parcial: "2023", "2026-04") ordena bien como texto; empate → orden de los datos.
        .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)),
    }))
    .filter((a) => a.releases.length > 0);
}

const DESCRIPTION_MAX = 160;

/**
 * Meta description del índice: el roster completo desde `artists` (sumar un artista no exige
 * tocar el texto). Si con la segunda oración pasa de 160 caracteres, queda solo la primera.
 */
export function rosterDescription(lang: string): string {
  const l = toLang(lang);
  const names = new Intl.ListFormat(l, { style: "long", type: "conjunction" }).format(artists.map((a) => a.name));
  const lead = l === "es" ? `Roster de ${LABEL_NAME}: ${names}.` : `${LABEL_NAME} roster: ${names}.`;
  const tail =
    l === "es"
      ? " Fichas, discografía y colaboraciones entre los artistas del sello."
      : " Profiles, discography and collaborations between the label's artists.";
  return [...(lead + tail)].length <= DESCRIPTION_MAX ? lead + tail : lead;
}

/**
 * JSON-LD del índice: CollectionPage cuyo `mainEntity` es un ItemList de MusicGroup con el mismo
 * `@id` que las fichas y que los `member` de la organización (artistId, sin idioma), más la miga
 * de 2 niveles. La `url` de cada artista sí va por idioma.
 */
export function rosterJsonLd(lang: string) {
  const l = toLang(lang);
  const isEs = l === "es";
  const url = `${SITE}/${l}/artistas`;
  const name = isEs ? "Artistas" : "Artists";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": url,
        url,
        name,
        description: rosterDescription(l),
        inLanguage: isEs ? "es-CL" : "en-US",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: artists.length,
          itemListElement: artists.map((a, i) => {
            const portrait = getArtistPortrait(a.slug);
            return {
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "MusicGroup",
                "@id": artistId(a.slug),
                name: a.name,
                url: `${SITE}/${l}/artistas/${a.slug}`,
                ...(portrait ? { image: absUrl(portrait) } : {}),
              },
            };
          }),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: isEs ? "Inicio" : "Home", item: `${SITE}/${l}` },
          { "@type": "ListItem", position: 2, name, item: url },
        ],
      },
    ],
  };
}
