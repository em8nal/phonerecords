// Portada: hero (components/landing/hero-section.tsx).
// `stats` no tiene lectores hoy; se conserva para no cambiar el objeto (lo vigila test:i18n).
export const hero = {
  en: {
    eyebrow: "An independent cultural label · Santiago, Chile",
    headline1: "Sound as",
    headline2: "an act of",
    words: ["memory", "presence", "tension", "rite"],
    description:
      "PHŌNÉ Records is an independent cultural label that produces conditions of existence for music: framework, circulation and authorial direction for a roster of Latin American artists in dialogue with global circuits.",
    ctaPrimary: "Explore the roster",
    ctaSecondary: "Read the manifesto",
    stats: [
      { value: "66.199", label: "followers · spotify", company: "NEWEN AFROBEAT" },
      { value: "44.200", label: "subscribers · youtube", company: "NEWEN AFROBEAT" },
      { value: "5", label: "albums · catalogue", company: "NEWEN AFROBEAT" },
      { value: "8", label: "releases · catalogue", company: "KLAUS B" },
    ],
  },
  es: {
    eyebrow: "Sello cultural independiente · Santiago de Chile",
    headline1: "Sonido como",
    headline2: "un acto de",
    words: ["memoria", "presencia", "tensión", "rito"],
    description:
      "PHŌNÉ Records es un sello cultural independiente que produce condiciones de existencia para la música: marco, circulación y dirección autoral para un roster latinoamericano en diálogo con circuitos globales.",
    ctaPrimary: "Explorar el roster",
    ctaSecondary: "Leer el manifiesto",
    stats: [
      { value: "66.199", label: "seguidores · spotify", company: "NEWEN AFROBEAT" },
      { value: "44.200", label: "suscriptores · youtube", company: "NEWEN AFROBEAT" },
      { value: "5", label: "álbumes · catálogo", company: "NEWEN AFROBEAT" },
      { value: "8", label: "releases · catálogo", company: "KLAUS B" },
    ],
  },
} as const;
