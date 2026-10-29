import { Fraunces } from "next/font/google";

// Fraunces solo donde se usa (17e): la palabra en cursiva del hero de la portada
// (components/landing/hero-section.tsx) y los press kits /press/<lang>/<slug>
// (.press-artist-name y .press-label-title de app/globals.css, vía la variable del <body> que
// pone app/press/[lang]/layout.tsx). Los tres usos son cursiva 400: no se cargan la normal ni
// las 500/600. Va en un módulo propio porque Next precarga la fuente en las rutas cuyo
// layout o página la importan (doc instalada: font.md, "Preloading"); importada desde un
// módulo compartido viajaría a todo el sitio. La imagen OG de lanzamiento carga su propia
// Fraunces desde Google y no depende de esto.
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: "italic",
  weight: "400",
  variable: "--font-fraunces",
});
