// Footer (components/landing/footer-section.tsx y la 404 localizada).
// Los href van sin /${lang}: footer-section.tsx antepone el idioma.
// links.artists debe coincidir con lib/artists.ts (lo vigila `pnpm test:roster`).
export const footer = {
  en: {
    tagline:
      "PHŌNÉ Records · independent cultural label · Santiago de Chile · in dialogue with European and Latin American circuits.",
    columns: {
      artists: "Artists",
      label: "Label",
      contact: "Contact",
      newsletter: "Newsletter",
    },
    links: {
      artists: [
        { label: "Newen Afrobeat", href: "/artistas/newen-afrobeat" },
        { label: "ecamhi", href: "/artistas/ecamhi" },
        { label: "Con.fusión", href: "/artistas/con-fusion" },
        { label: "Klaus B", href: "/artistas/klaus-b" },
        { label: "Rosario Lircay", href: "/artistas/rosario-lircay" },
      ],
      label: [
        { label: "About PHŌNÉ", href: "/sello" },
        { label: "Manifesto", href: "/manifiesto" },
        { label: "Services", href: "/servicios" },
        { label: "Releases", href: "/catalogo" },
        { label: "Videos", href: "/videos" },
        { label: "Events", href: "/eventos" },
      ],
      contact: [
        { label: "Contact", href: "/contacto" },
        { label: "Booking", href: "/contacto?topic=booking" },
        { label: "Press kit", href: "/press-kit" },
      ],
    },
    newsletterBlurb: "Releases and shows, before anyone else.",
    socialLabel: "Label social media",
    opensInNewTab: "(opens in new tab)",
    copyright: "© 2026 PHŌNÉ Records. All rights reserved.",
  },
  // Misma forma que `en` (lo exigen TranslationsShapeCheck y test:i18n).
  es: {
    tagline:
      "PHŌNÉ Records · sello cultural independiente · Santiago de Chile · en diálogo con circuitos europeos y latinoamericanos.",
    columns: {
      artists: "Artistas",
      label: "Sello",
      contact: "Contacto",
      newsletter: "Newsletter",
    },
    links: {
      artists: [
        { label: "Newen Afrobeat", href: "/artistas/newen-afrobeat" },
        { label: "ecamhi", href: "/artistas/ecamhi" },
        { label: "Con.fusión", href: "/artistas/con-fusion" },
        { label: "Klaus B", href: "/artistas/klaus-b" },
        { label: "Rosario Lircay", href: "/artistas/rosario-lircay" },
      ],
      label: [
        { label: "Sobre PHŌNÉ", href: "/sello" },
        { label: "Manifiesto", href: "/manifiesto" },
        { label: "Servicios", href: "/servicios" },
        { label: "Lanzamientos", href: "/catalogo" },
        { label: "Videos", href: "/videos" },
        { label: "Eventos", href: "/eventos" },
      ],
      contact: [
        { label: "Contacto", href: "/contacto" },
        { label: "Booking", href: "/contacto?topic=booking" },
        { label: "Press kit", href: "/press-kit" },
      ],
    },
    newsletterBlurb: "Lanzamientos y conciertos, antes que nadie.",
    socialLabel: "Redes del sello",
    opensInNewTab: "(se abre en pestaña nueva)",
    copyright: "© 2026 PHŌNÉ Records. Todos los derechos reservados.",
  },
} as const;
