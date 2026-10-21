export const translations = {
  en: {
    // Navigation
    nav: {
      features: "Services",
      howItWorks: "Manifesto",
      developers: "Events",
      signIn: "Press",
      startCreating: "Booking",
    },
    // Release banner (portada). Los textos por lanzamiento viven en lib/banner.ts
    banner: {
      viewRelease: "View release",
      // {title} se reemplaza por el título del lanzamiento (aria-label del link)
      viewReleaseOf: "View release: {title}",
      opensInNewTab: "(opens in new tab)",
      viewArtist: "View artist",
      // {artist} se reemplaza por el nombre del artista (aria-label del link)
      viewArtistOf: "View artist: {artist}",
      regionLabel: "Featured releases",
      prev: "Previous banner",
      next: "Next banner",
      goTo: "Go to banner {n}",
      slide: "slide",
      pause: "Pause automatic rotation",
      play: "Resume automatic rotation",
    },
    // Hero
    hero: {
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
    // Features → Services
    features: {
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
    },
    // How it works → Manifesto / 3 segments
    howItWorks: {
      eyebrow: "Manifesto",
      headline1: "Three segments.",
      headline2: "One ecosystem.",
      steps: [
        {
          number: "I",
          title: "Audience",
          description:
            "Not passive listeners — an active community that participates, finances and validates the label's work through memberships, physical formats and expanded experiences.",
        },
        {
          number: "II",
          title: "Collaborators",
          description:
            "A network of creative and technical agents — producers, photographers, designers, sound engineers — who shape every release with us.",
        },
        {
          number: "III",
          title: "Artists",
          description:
            "Music projects accompanied with integral representation: creative, strategic, operational and symbolic. Long-term work, not one-off campaigns.",
        },
      ],
      ready: "Active",
    },
    // Developers → Events / Tour
    developers: {
      eyebrow: "On tour",
      headline1: "Newen Afrobeat.",
      headline2: "Europe 2026.",
      description:
        "From Santiago to Liverpool, Vienna and Frankfurt. The first Chilean afrobeat orchestra returns to Europe with a new live show built around the LP Grietas (OfficeHome Records, 2024).",
      features: [
        { title: "Aug 20 · Innsbruck", description: "Treibhaus · Austria" },
        { title: "Aug 23 · Frankfurt", description: "Jazzmontez · Germany" },
        { title: "Aug 30 · Vienna", description: "Porgy & Bess · Austria" },
        { title: "Sep 09 · London", description: "The Jazz Cafe · United Kingdom" },
      ],
      tabs: ["August", "September", "Tickets"],
      readDocs: "Full tour calendar",
      viewGithub: "Booking inquiries",
    },
    // Testimonials → Press / Voices
    testimonials: {
      eyebrow: "Voices",
      keyResult: "Highlight",
      trustedBy: "From the roster and its collaborators",
      items: [
        {
          quote:
            "Image and sound born from the same creative process. Each photograph captured on tour inspired a song.",
          author: "Ecamhi",
          role: "Trumpet · Composer · Producer",
          company: "PHŌNÉ ROSTER",
          metric: "EP en viaje · 2024",
        },
        {
          quote:
            "A vocal exploration that transits between hip hop, jazz and neo soul. Hosted on PHŌNÉ since the label's inaugural release.",
          author: "Con.fusión · Catalina Aguilera",
          role: "Voice · Composer",
          company: "PHŌNÉ ROSTER",
          metric: "Album Tulpa · in production",
        },
        {
          quote:
            "An intimate look at a personal musical exploration that unfolded over several years — between jazz, hip hop and organic recordings.",
          author: "Klaus B",
          role: "Saxophone · Flute · Producer",
          company: "PHŌNÉ ROSTER",
          metric: "Memorias mixtape · 2025",
        },
      ],
    },
    // CTA → Newsletter
    cta: {
      headline1: "Independent music",
      headline2: "as a long-term practice.",
      description:
        "Join the PHŌNÉ newsletter for new releases, tour dates, listening sessions and the occasional editorial drop.",
      ctaPrimary: "Subscribe to newsletter",
      noCreditCard: "We never share your email.",
    },
    // Footer
    footer: {
      tagline:
        "PHŌNÉ Records · independent cultural label · Santiago de Chile · in dialogue with European and Latin American circuits.",
      columns: {
        Roster: "Roster",
        Catalogue: "Catalogue",
        Label: "Label",
        Connect: "Connect",
      },
      links: {
        Roster: ["Newen Afrobeat", "Klaus B", "Ecamhi", "Con.fusión", "Andrés Abrigo"],
        Catalogue: ["Releases", "Vinyl", "Cassette"],
        Label: ["About", "Manifesto"],
        Connect: ["Contact", "Press kit", "Instagram"],
      },
      copyright: "© 2026 PHŌNÉ Records. All rights reserved.",
      systemStatus: "Active · Santiago de Chile",
    },
  },
  es: {
    // Navigation
    nav: {
      features: "Servicios",
      howItWorks: "Manifiesto",
      developers: "Eventos",
      signIn: "Prensa",
      startCreating: "Booking",
    },
    // Banner de lanzamiento (portada). Los textos por lanzamiento viven en lib/banner.ts
    banner: {
      viewRelease: "Ver ficha",
      // {title} se reemplaza por el título del lanzamiento (aria-label del link)
      viewReleaseOf: "Ver ficha de {title}",
      opensInNewTab: "(se abre en pestaña nueva)",
      viewArtist: "Ver artista",
      // {artist} se reemplaza por el nombre del artista (aria-label del link)
      viewArtistOf: "Ver artista: {artist}",
      regionLabel: "Lanzamientos destacados",
      prev: "Banner anterior",
      next: "Banner siguiente",
      goTo: "Ir al banner {n}",
      slide: "diapositiva",
      pause: "Pausar rotación automática",
      play: "Reanudar rotación automática",
    },
    // Hero
    hero: {
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
    // Features → Servicios
    features: {
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
    },
    // How it works → Manifiesto / 3 segmentos
    howItWorks: {
      eyebrow: "Manifiesto",
      headline1: "Tres segmentos.",
      headline2: "Un ecosistema.",
      steps: [
        {
          number: "I",
          title: "Audiencia",
          description:
            "No oyentes pasivos — comunidad activa que participa, financia y valida el trabajo del sello a través de membresías, formatos físicos y experiencias expandidas.",
        },
        {
          number: "II",
          title: "Colaboradores",
          description:
            "Red de agentes creativos y técnicos —productores, fotógrafos, diseñadores, sonidistas— que dan forma a cada lanzamiento junto a nosotros.",
        },
        {
          number: "III",
          title: "Artistas",
          description:
            "Proyectos musicales acompañados con representación integral: creativa, estratégica, operativa y simbólica. Trabajo de largo plazo, no campañas puntuales.",
        },
      ],
      ready: "Activo",
    },
    // Developers → Eventos / Gira
    developers: {
      eyebrow: "En gira",
      headline1: "Newen Afrobeat.",
      headline2: "Europa 2026.",
      description:
        "De Santiago a Liverpool, Viena y Frankfurt. La primera orquesta chilena de afrobeat vuelve a Europa con un nuevo show construido alrededor del LP Grietas (OfficeHome Records, 2024).",
      features: [
        { title: "20 ago · Innsbruck", description: "Treibhaus · Austria" },
        { title: "23 ago · Frankfurt", description: "Jazzmontez · Alemania" },
        { title: "30 ago · Viena", description: "Porgy & Bess · Austria" },
        { title: "09 sep · Londres", description: "The Jazz Cafe · Reino Unido" },
      ],
      tabs: ["Agosto", "Septiembre", "Entradas"],
      readDocs: "Calendario completo",
      viewGithub: "Consultas de booking",
    },
    // Testimonials → Voces del roster
    testimonials: {
      eyebrow: "Voces",
      keyResult: "Destacado",
      trustedBy: "Del roster y sus colaboradores",
      items: [
        {
          quote:
            "Imagen y sonido nacieron del mismo proceso creativo. Cada fotografía capturada en gira inspiró una canción.",
          author: "Ecamhi",
          role: "Trompeta · Compositor · Productor",
          company: "PHŌNÉ ROSTER",
          metric: "EP en viaje · 2024",
        },
        {
          quote:
            "Una exploración vocal que transita entre hip hop, jazz y neo soul. Albergada en PHŌNÉ desde el lanzamiento inaugural del sello.",
          author: "Con.fusión · Catalina Aguilera",
          role: "Voz · Compositora",
          company: "PHŌNÉ ROSTER",
          metric: "Álbum Tulpa · en producción",
        },
        {
          quote:
            "Una mirada íntima a una exploración musical personal que se desarrolló durante varios años — entre jazz, hip hop y grabaciones orgánicas.",
          author: "Klaus B",
          role: "Saxo · Flauta · Productor",
          company: "PHŌNÉ ROSTER",
          metric: "Mixtape Memorias · 2025",
        },
      ],
    },
    // CTA → Newsletter
    cta: {
      headline1: "Música independiente",
      headline2: "como práctica de largo plazo.",
      description:
        "Suscríbete al newsletter de PHŌNÉ para nuevos lanzamientos, fechas de gira, listening sessions y drops editoriales ocasionales.",
      ctaPrimary: "Suscribirme al newsletter",
      noCreditCard: "Nunca compartimos tu email.",
    },
    // Footer
    footer: {
      tagline:
        "PHŌNÉ Records · sello cultural independiente · Santiago de Chile · en diálogo con circuitos europeos y latinoamericanos.",
      columns: {
        Roster: "Roster",
        Catalogue: "Catálogo",
        Label: "Sello",
        Connect: "Conecta",
      },
      links: {
        Roster: ["Newen Afrobeat", "Klaus B", "Ecamhi", "Con.fusión", "Andrés Abrigo"],
        Catalogue: ["Releases", "Vinilo", "Cassette"],
        Label: ["Sobre PHŌNÉ", "Manifiesto"],
        Connect: ["Contacto", "Press kit", "Instagram"],
      },
      copyright: "© 2026 PHŌNÉ Records. Todos los derechos reservados.",
      systemStatus: "Activo · Santiago de Chile",
    },
  },
} as const;

export type Language = keyof typeof translations;
export type Translations = typeof translations.en;
