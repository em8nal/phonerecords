// Portada: bloque Servicios (components/landing/features-section.tsx). Lo revisa también test:servicios.
export const features = {
  en: {
    eyebrow: "Services",
    headline1: "More than a label.",
    headline2: "An ecosystem.",
    items: [
      {
        number: "01",
        title: "Label · Vinyl + Digital",
        description:
          "Curated catalogue with strong art direction. Editorial line that combines memory, ritual and contemporary tension.",
      },
      {
        number: "02",
        title: "Artist Management",
        description:
          "Integrated representation: bookings, strategic planning, finance and key-decision support. From small clubs to international festival circuits.",
      },
      {
        number: "03",
        title: "Production · Sound + Vision",
        description:
          "Music production and creative direction for albums, live sessions and interdisciplinary releases linking sound, photography and printed matter.",
      },
      {
        number: "04",
        title: "Touring & Booking",
        description:
          "Concerts, showcases and tour management. International booking through partners (Ludwig Sound · Heidelberg).",
      },
    ],
    // Enlace del bloque `item` a la página de servicios (href sin /${lang}: lo antepone FeaturesSection).
    servicesLink: { item: "03", label: "See services", href: "/servicios" },
  },
  es: {
    eyebrow: "Servicios",
    headline1: "Más que un sello.",
    headline2: "Un ecosistema.",
    items: [
      {
        number: "01",
        title: "Sello · Vinilo + Digital",
        description:
          "Catálogo curado con dirección de arte fuerte. Línea editorial que cruza memoria, rito y tensión contemporánea.",
      },
      {
        number: "02",
        title: "Management de artistas",
        description:
          "Representación integral: booking, planificación estratégica, administración financiera y acompañamiento en decisiones clave. Desde clubs hasta circuitos internacionales.",
      },
      {
        number: "03",
        title: "Producción · Sonido + Imagen",
        description:
          "Producción musical y dirección creativa para álbumes, sesiones en vivo y lanzamientos interdisciplinares que enlazan sonido, fotografía y materia impresa.",
      },
      {
        number: "04",
        title: "Tour & Booking",
        description:
          "Conciertos, showcases y tour management. Booking internacional vía Ludwig Sound (Heidelberg, Alemania).",
      },
    ],
    servicesLink: { item: "03", label: "Ver servicios", href: "/servicios" },
  },
} as const;
