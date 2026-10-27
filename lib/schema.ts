// Entidades schema.org del sitio en un solo módulo (pendiente 17, A7).
//
// Una sola definición de la organización (PHŌNÉ Records) con un `@id` que no
// cambia con el idioma; la portada y /sello la usan tal cual. Los miembros salen
// de lib/artists.ts, así que sumar o renombrar un artista no exige tocar este
// archivo. Tipo "Organization": schema.org no tiene un tipo propio para sellos
// discográficos (la URL de ese tipo responde 404; comprobado el 26-10-2026).
//
// Imports relativos e `import type`: scripts/test-seo.mjs importa este módulo
// desde Node sin el alias @/.
import { artists } from "./artists";
import type { Language } from "./translations";

export const SITE = "https://phonerecords.cl";
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;
export const LABEL_NAME = "PHŌNÉ Records";

/** Canales propios del sello (= LABEL_SOCIAL del footer). Bandcamp/Spotify son de Newen Afrobeat. */
export const LABEL_SAME_AS = [
  "https://www.instagram.com/phone_records/",
  "https://www.youtube.com/@phone_records",
] as const;

/** Buzón genérico que el sitio ya publica en /press-kit (contacto de prensa, booking y general). */
export const LABEL_EMAIL = "contacto@phonerecords.cl";

const LABEL_DESCRIPTION: Record<Language, string> = {
  es: "Sello cultural independiente con dirección autoral. Producción integral, management y curaduría de música independiente latinoamericana.",
  en: "Independent cultural label with strong authorial direction. Integral production, management and curation of independent Latin American music.",
};

export const toLang = (lang: string): Language => (lang === "en" ? "en" : "es");

/** URL absoluta para imágenes del grafo: deja igual las http(s) y antepone SITE a las rutas del sitio. */
export const absUrl = (src: string): string =>
  /^https?:\/\//.test(src) ? src : `${SITE}${src.startsWith("/") ? "" : "/"}${src}`;

/** `@id` estable de cada artista; las fichas de artista usan este mismo formato. */
export const artistId = (slug: string): string => `${SITE}/#artist-${slug}`;

/** La organización del sello. Sin `foundingDate` (año pendiente con el equipo, X27) ni calle. */
export function organizationJsonLd(lang: string) {
  const l = toLang(lang);
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: LABEL_NAME,
    url: SITE,
    logo: `${SITE}/brand/phone-logotipo.png`,
    description: LABEL_DESCRIPTION[l],
    email: LABEL_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ñuñoa",
      addressRegion: "Región Metropolitana",
      addressCountry: "CL",
    },
    sameAs: [...LABEL_SAME_AS],
    contactPoint: [
      { "@type": "ContactPoint", contactType: "press", url: `${SITE}/${l}/contacto?topic=prensa` },
      { "@type": "ContactPoint", contactType: "booking", url: `${SITE}/${l}/contacto?topic=booking` },
    ],
    member: artists.map((a) => ({
      "@type": "MusicGroup",
      "@id": artistId(a.slug),
      name: a.name,
      url: `${SITE}/${l}/artistas/${a.slug}`,
    })),
  };
}

/** El sitio. Sin SearchAction: phonerecords.cl no tiene búsqueda. */
export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE,
    name: LABEL_NAME,
    inLanguage: ["es-CL", "en"],
    publisher: { "@id": ORG_ID },
  };
}

/** JSON para <script type="application/ld+json">, sin "<" literal (no puede cerrar el script). */
export const toJsonLd = (data: object): string => JSON.stringify(data).replace(/</g, "\\u003c");
