// Metadata y viewport del sitio, compartidos por los dos root layouts (app/[lang]/layout.tsx y
// app/press/[lang]/layout.tsx). Antes vivían en app/layout.tsx, que ya no existe (H2): cada
// root layout pinta su propio <html lang> desde el segmento y puede ser estático.
//
// Imports relativos: scripts/test-releases.mjs y scripts/test-seo.mjs leen este archivo.
import type { Metadata, Viewport } from "next";
import { TITLE_TEMPLATE } from "./seo";

export const SITE_VIEWPORT: Viewport = {
  themeColor: "#000000",
};

// Valores por defecto neutros: sin URL canónica, og:url ni og:locale para todo el sitio
// (cada página bajo /[lang] trae los suyos con pageMetadata de lib/seo.ts). Lo que no
// los defina (press kits, 404) hereda solo marca, tipo e imagen, y Next completa
// og:title y og:description con el título y la descripción de esa página.
export const SITE_METADATA: Metadata = {
  metadataBase: new URL("https://phonerecords.cl"),
  title: {
    default: "PHŌNÉ Records",
    template: TITLE_TEMPLATE,
  },
  description:
    "Sello cultural independiente, Santiago de Chile. Roster: Newen Afrobeat, Klaus B, ecamhi, Con.fusión y Rosario Lircay.",
  authors: [{ name: "PHŌNÉ Records", url: "https://phonerecords.cl" }],
  verification: {
    google: "mUTRTpRC44cVJL--psi4RCHRscBV4OGOV_UfIPHwRXU",
  },
  openGraph: {
    type: "website",
    siteName: "PHŌNÉ Records",
    // Tarjeta bilingüe de app/opengraph-image.tsx; las páginas de /es y /en usan la de su idioma.
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PHŌNÉ Records" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
};
