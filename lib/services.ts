// Contenido de /[lang]/servicios (pendiente 18, carril I): dirección creativa, diseño y prensa
// para lanzamientos discográficos, a partir de la propuesta de Cata (octubre 2026).
//
// Un solo módulo con los textos ES y EN completos: las correcciones de Cata tocan solo este
// archivo. Reglas del contenido: sin valores ni cifras de dinero, y el acompañamiento se arma
// a la medida de cada artista; los tres recorridos son puntos de partida, no ofertas cerradas.
// Lo vigila `pnpm test:servicios`.
//
// Imports relativos e `import type`: scripts/test-servicios.mjs importa este módulo desde Node
// sin el alias @/. Sin JSX.
import type { Language } from "./translations";
import type { Localized } from "./artist-media";
import { ARTIST_HERO } from "./artist-media";
import { releases } from "./releases";
import { LABEL_NAME, ORG_ID, SITE, WEBSITE_ID, toLang } from "./schema";

/** Ruta de la página tras el idioma. */
export const SERVICES_PATH = "/servicios";
/** Destino de los llamados de la página: el formulario con el motivo preseleccionado. */
export const SERVICES_CONTACT = "/contacto?topic=servicios";

export type StepId = "direccion" | "planificacion" | "ilustrador" | "diseno" | "prensa";
export type PieceId = "direccion" | "portada" | "sesion" | "prensa";
export type JourneyId = "esencial" | "desarrollado" | "full";

/** Ítem de "Incluye": con `name`, se pinta "<strong>name:</strong> text". */
export type IncludeItem = { name?: string; text: string };

export type ServicesCopy = {
  meta: { title: string; description: string; serviceType: string };
  hero: {
    eyebrow: string;
    /** Admite "\n". */
    title: string;
    lede: string;
    cta: string;
    indexLabel: string;
    stripLabel: string;
  };
  start: { title: string; body: string[]; quote: string };
  process: { title: string; lede: string; steps: { id: StepId; title: string; body: string }[] };
  pieces: {
    title: string;
    lede: string;
    includes: string;
    inquire: string;
    items: {
      id: PieceId;
      kicker: string;
      title: string;
      summary: string;
      includes: IncludeItem[];
      note?: string;
      /** Pie de la foto. La portada no lo lleva: su pie sale de lib/releases.ts. */
      caption?: string;
    }[];
  };
  journeys: {
    title: string;
    lede: string;
    base: string;
    /** "{n}" se reemplaza por "01", "02" o "03" al pintar: los textos de los recorridos no llevan cifras. */
    stepLabel: string;
    includes: string;
    /** "{name}" = nombre del recorrido anterior. */
    inherited: string;
    adds: string;
    items: { id: JourneyId; name: string; adds: string[]; note?: string }[];
    conditions: string[];
  };
  fund: { title: string; body: string };
  closing: { title: string; body: string; primary: string; secondary: string };
};

export const SERVICES: Record<Language, ServicesCopy> = {
  es: {
    meta: {
      title: "Dirección creativa, diseño y prensa",
      description:
        "Dirección creativa, diseño, prensa y planificación para lanzamientos discográficos, a la medida de cada artista. Conversemos tu lanzamiento.",
      serviceType: "Dirección creativa, diseño y prensa para lanzamientos discográficos",
    },
    hero: {
      eyebrow: "Servicios · Dirección creativa, diseño y prensa",
      title: "Lanzar un disco\ncon dirección.",
      lede: "Dirección creativa, diseño y prensa a la medida de cada artista, según la etapa, el calendario y los fondos de tu proyecto.",
      cta: "Conversemos tu lanzamiento",
      indexLabel: "En esta página",
      stripLabel: "Portadas del sello",
    },
    start: {
      title: "Punto de partida",
      body: [
        "Un disco no termina en el master. Entre el estudio y el público hay una serie de decisiones —una portada, una fotografía, una nota de prensa, un orden de salida— que definen cómo será escuchado, leído y recordado. Cuando esas decisiones se toman por separado, el lanzamiento se fragmenta: la imagen dice una cosa, la prensa otra, las redes una tercera.",
        "Desde PHŌNÉ acompañamos ese tránsito con una dirección creativa que articula todas las piezas a partir de un principio: el lenguaje visual y narrativo de un proyecto debe emerger de su propia identidad.",
      ],
      quote: "Nada se pone encima.",
    },
    process: {
      title: "Del master al público",
      lede: "Lo mínimo necesario para lanzar un disco con coherencia.",
      steps: [
        {
          id: "direccion",
          title: "Dirección creativa",
          body: "Diagnóstico de identidad del proyecto y del disco, concepto y narrativa. Se entrega como manual de marca: el documento que ordena todas las decisiones posteriores.",
        },
        {
          id: "planificacion",
          title: "Planificación estratégica",
          body: "Calendario de lanzamiento de singles, disco, prensa y presentaciones en vivo, con hitos claros. Define cuándo y cómo aparece cada pieza.",
        },
        {
          id: "ilustrador",
          title: "Vínculo con el ilustrador",
          body: "Selección del ilustrador o diseñador según el lenguaje del disco, brief de portada y acompañamiento del proceso. La portada se construye en diálogo entre artista, ilustrador y dirección de arte.",
        },
        {
          id: "diseno",
          title: "Diseño gráfico",
          body: "Piezas derivadas de la portada para redes y difusión: adaptaciones, formatos y plantillas coherentes con la identidad del disco.",
        },
        {
          id: "prensa",
          title: "Prensa",
          body: "Biografía, nota de prensa y press kit, con una estrategia acotada de entrega a medios y redes.",
        },
      ],
    },
    pieces: {
      title: "Piezas que se combinan",
      lede: "Cada pieza puede sumarse por separado o combinarse con otras, según lo que tu proyecto necesite.",
      includes: "Incluye",
      inquire: "Consultar por esta pieza",
      items: [
        {
          id: "direccion",
          kicker: "Dirección creativa",
          title: "Dirección creativa y planificación estratégica",
          summary: "Diagnóstico de identidad, concepto y narrativa, manual de marca y calendario de lanzamiento.",
          includes: [
            { text: "Diagnóstico de identidad del proyecto y del disco." },
            { text: "Concepto y narrativa." },
            { text: "Manual de marca, el documento que ordena las decisiones posteriores." },
            { text: "Calendario de singles, disco, prensa y presentaciones en vivo, con hitos claros." },
          ],
          caption: "Klaus B · sesión de grabación",
        },
        {
          id: "portada",
          kicker: "Portadas, diseño gráfico y audiovisual",
          title: "Portada, kit gráfico y animaciones",
          summary:
            "Portada con ilustrador o diseñador, kit gráfico para redes y difusión, y animaciones para Canvas de Spotify y redes.",
          includes: [
            { name: "Portada", text: "vínculo y brief con ilustrador o diseñador, acompañamiento y arte final." },
            { name: "Kit gráfico", text: "piezas y adaptaciones para redes y difusión." },
            {
              name: "Animaciones",
              text: "movimientos leves de las piezas ilustradas y videos creados con el material gráfico y la música del disco, para Canvas de Spotify, redes y promoción.",
            },
          ],
        },
        {
          id: "sesion",
          kicker: "Fotografía, video de banda y press kit",
          title: "Dirección de arte de sesión, fotografía y video de banda",
          summary: "Concepto y dirección de arte de la sesión, fotografías para press kit y, como opción, cápsulas de video de la banda.",
          includes: [
            {
              name: "Dirección de arte de la sesión",
              text: "concepto, moodboard y brief de locación, vestuario y estilismo, con la coordinación de la producción.",
            },
            { name: "Fotografía", text: "sesión y edición de fotografías para press kit." },
            { name: "Video de banda (opcional)", text: "cápsulas cortas de presentación de la banda." },
          ],
          note: "La producción de la sesión (videógrafo, locación, vestuario, maquillaje y peinado, iluminación o equipos, transporte y alimentación) corresponde a costos de terceros que se estiman según cada proyecto; su coordinación va incluida en la dirección de arte.",
          caption: "Con.fusión · sesión en azotea, agosto 2026",
        },
        {
          id: "prensa",
          kicker: "Prensa",
          title: "Prensa base y prensa ampliada",
          summary: "Biografía, nota de prensa y press kit; en la versión ampliada, gestión de medios y pitch a playlists.",
          includes: [
            { name: "Prensa base", text: "biografía, nota de prensa, press kit y estrategia acotada de entrega." },
            {
              name: "Prensa ampliada",
              text: "la prensa base más gestión activa de medios, calendario de contenidos, pitch a playlists y seguimiento.",
            },
          ],
          caption: "Con.fusión e invitados · sesión La Banca",
        },
      ],
    },
    journeys: {
      title: "Tres recorridos de referencia",
      lede: "Son puntos de partida: los ajustamos a tu proyecto, tu calendario y tus fondos.",
      base: "Todos parten de la dirección creativa: es la base que da coherencia a cada pieza.",
      stepLabel: "Recorrido {n}",
      includes: "Incluye",
      inherited: "Todo lo de {name}",
      adds: "Suma",
      items: [
        {
          id: "esencial",
          name: "Esencial",
          adds: ["Dirección creativa y planificación estratégica", "Portada con ilustrador", "Kit gráfico", "Prensa base"],
        },
        {
          id: "desarrollado",
          name: "Desarrollado",
          adds: ["Animaciones con música", "Prensa ampliada"],
        },
        {
          id: "full",
          name: "Full",
          adds: ["Dirección de arte de la sesión fotográfica", "Fotógrafo y fotos para press kit", "Opción de video de banda"],
          note: "La producción de la sesión se estima según cada proyecto.",
        },
      ],
      conditions: ["Cada pieza de diseño incluye dos rondas de revisión."],
    },
    fund: {
      title: "Fondo de la Música",
      body: "Estos servicios pueden incluirse como gastos en una postulación al Fondo de la Música, y PHŌNÉ puede acompañar la formulación.",
    },
    closing: {
      title: "Cada lanzamiento se arma a la medida.",
      body: "Cuéntanos en qué etapa está tu proyecto y qué te gustaría lograr; desde ahí combinamos las piezas contigo.",
      primary: "Conversemos tu lanzamiento",
      secondary: "Ver trabajos del sello",
    },
  },
  en: {
    meta: {
      title: "Creative direction, design & press",
      description:
        "Creative direction, design, press and planning for record releases, tailored to each artist. Let's talk about your release.",
      serviceType: "Creative direction, design and press for record releases",
    },
    hero: {
      eyebrow: "Services · Creative direction, design & press",
      title: "Releasing a record\nwith direction.",
      lede: "Creative direction, design and press tailored to each artist, according to your project's stage, timeline and funding.",
      cta: "Let's talk about your release",
      indexLabel: "On this page",
      stripLabel: "Label covers",
    },
    start: {
      title: "Starting point",
      body: [
        "A record doesn't end at the master. Between the studio and the audience lies a series of decisions —a cover, a photograph, a press release, a release order— that define how it will be heard, read and remembered. When those decisions are made separately, the release fragments: the image says one thing, the press another, social media a third.",
        "At PHŌNÉ we guide that journey with creative direction that ties every piece together from one principle: a project's visual and narrative language must emerge from its own identity.",
      ],
      quote: "Nothing is superimposed.",
    },
    process: {
      title: "From master to audience",
      lede: "The minimum needed to release a record with coherence.",
      steps: [
        {
          id: "direccion",
          title: "Creative direction",
          body: "A diagnosis of the identity of the project and the record, its concept and narrative. Delivered as a brand manual: the document that guides every later decision.",
        },
        {
          id: "planificacion",
          title: "Strategic planning",
          body: "A release calendar for singles, album, press and live shows, with clear milestones. It defines when and how each piece appears.",
        },
        {
          id: "ilustrador",
          title: "Working with the illustrator",
          body: "Choosing the illustrator or designer to suit the record's language, writing the cover brief and supporting the process. The cover is built in dialogue between artist, illustrator and art direction.",
        },
        {
          id: "diseno",
          title: "Graphic design",
          body: "Pieces derived from the cover for social media and promotion: adaptations, formats and templates consistent with the record's identity.",
        },
        {
          id: "prensa",
          title: "Press",
          body: "Biography, press release and press kit, with a focused strategy for reaching media and social channels.",
        },
      ],
    },
    pieces: {
      title: "Pieces you can combine",
      lede: "Each piece can be added on its own or combined with others, depending on what your project needs.",
      includes: "Includes",
      inquire: "Ask about this piece",
      items: [
        {
          id: "direccion",
          kicker: "Creative direction",
          title: "Creative direction and strategic planning",
          summary: "Identity diagnosis, concept and narrative, brand manual and release calendar.",
          includes: [
            { text: "Identity diagnosis of the project and the record." },
            { text: "Concept and narrative." },
            { text: "Brand manual, the document that guides later decisions." },
            { text: "Calendar for singles, album, press and live shows, with clear milestones." },
          ],
          caption: "Klaus B · recording session",
        },
        {
          id: "portada",
          kicker: "Covers, graphic design & audiovisual",
          title: "Cover, graphic kit and animations",
          summary:
            "A cover with an illustrator or designer, a graphic kit for social media and promotion, and animations for Spotify Canvas and social media.",
          includes: [
            { name: "Cover", text: "connecting with and briefing an illustrator or designer, support and final artwork." },
            { name: "Graphic kit", text: "pieces and adaptations for social media and promotion." },
            {
              name: "Animations",
              text: "subtle motion for the illustrated pieces and videos made with the record's artwork and music, for Spotify Canvas, social media and promotion.",
            },
          ],
        },
        {
          id: "sesion",
          kicker: "Photography, band video & press kit",
          title: "Session art direction, photography and band video",
          summary: "Session concept and art direction, press-kit photos and, optionally, short band video capsules.",
          includes: [
            {
              name: "Session art direction",
              text: "concept, moodboard and brief for location, wardrobe and styling, including production coordination.",
            },
            { name: "Photography", text: "shoot and editing of press-kit photos." },
            { name: "Band video (optional)", text: "short capsules introducing the band." },
          ],
          note: "Session production (videographer, location, wardrobe, hair and make-up, lighting or equipment, transport and catering) involves third-party costs estimated for each project; its coordination is included in the art direction.",
          caption: "Con.fusión · rooftop session, August 2026",
        },
        {
          id: "prensa",
          kicker: "Press",
          title: "Core press and extended press",
          summary: "Biography, press release and press kit; in the extended version, media relations and playlist pitching.",
          includes: [
            { name: "Core press", text: "biography, press release, press kit and a focused outreach strategy." },
            {
              name: "Extended press",
              text: "core press plus active media relations, a content calendar, playlist pitching and follow-up.",
            },
          ],
          caption: "Con.fusión and guests · La Banca session",
        },
      ],
    },
    journeys: {
      title: "Three reference paths",
      lede: "They're starting points: we adjust them to your project, your timeline and your funding.",
      base: "All of them start from creative direction: it's the foundation that gives every piece coherence.",
      stepLabel: "Path {n}",
      includes: "Includes",
      inherited: "Everything in {name}",
      adds: "Adds",
      items: [
        {
          id: "esencial",
          name: "Essential",
          adds: ["Creative direction and strategic planning", "Cover with an illustrator", "Graphic kit", "Core press"],
        },
        {
          id: "desarrollado",
          name: "Developed",
          adds: ["Animations with music", "Extended press"],
        },
        {
          id: "full",
          name: "Full",
          adds: ["Art direction for the photo session", "Photographer and press-kit photos", "Optional band video"],
          note: "Session production is estimated for each project.",
        },
      ],
      conditions: ["Each design piece includes two rounds of revision."],
    },
    fund: {
      title: "Fondo de la Música (Music Fund)",
      body: "These services can be included as expenses in an application to Chile's Fondo de la Música (Music Fund), and PHŌNÉ can support you in preparing it.",
    },
    closing: {
      title: "Every release is made to measure.",
      body: "Tell us what stage your project is at and what you'd like to achieve; from there we combine the pieces with you.",
      primary: "Let's talk about your release",
      secondary: "See the label's work",
    },
  },
};

// ── Imágenes (todas ya en public/; nada nuevo ni procesado) ──

/** Portadas de la tira de apertura, en orden. La primera es la única con carga prioritaria. */
export const STRIP_SLUGS = ["klaus-b-destellos-de-ti", "newen-afrobeat-la-fuerza", "con-fusion-cuantas-veces"] as const;

/** Alt descriptivo de cada portada que usa la página (describe la imagen, no el archivo). */
export const COVER_ALT: Record<string, Localized> = {
  "klaus-b-destellos-de-ti": {
    es: "Portada de Destellos de ti, de Klaus B: anillos concéntricos verdes sobre fondo negro, con el nombre del artista en verde y el título en letras blancas",
    en: "Cover of Klaus B's Destellos de ti: concentric green rings on a black background, with the artist's name in green and the title in white letters",
  },
  "newen-afrobeat-la-fuerza": {
    es: "Portada de La Fuerza, de Newen Afrobeat: ilustración de una montaña nevada, un desierto rojo y una laguna con flamencos",
    en: "Cover of Newen Afrobeat's La Fuerza: illustration of a snow-capped mountain, a red desert and a lagoon with flamingos",
  },
  "con-fusion-cuantas-veces": {
    es: "Portada de Cuántas veces, de Con.fusión: un gato negro de ojos brillantes camina de noche hacia la cámara; foto en blanco y negro",
    en: "Cover of Con.fusión's Cuántas veces: a black cat with glowing eyes walks towards the camera at night; black-and-white photo",
  },
  "rosario-lircay-en-vela": {
    es: "Portada de En Vela, de Rosario Lircay: la cantante, agachada de noche en una calle, con vestido rojo y un ramo de flores bajo una luz roja",
    en: "Cover of Rosario Lircay's En Vela: the singer crouching on a street at night, in a red dress, holding a bunch of flowers under a red light",
  },
};

export type PieceImage = {
  src: string;
  /** "photo": foto B/N recortada a 3:2. "cover": portada cuadrada completa sobre negro. */
  kind: "photo" | "cover";
  alt: Localized;
  /** object-position de la foto (clase Tailwind). */
  position?: string;
  /** Portadas: ficha de la que salen la ruta, el pie y el crédito. */
  releaseSlug?: string;
};

const coverOf = (slug: string): string => releases.find((r) => r.slug === slug)?.cover ?? "";

export const PIECE_IMAGE: Record<PieceId, PieceImage> = {
  direccion: {
    src: ARTIST_HERO["klaus-b"].desktop,
    kind: "photo",
    alt: ARTIST_HERO["klaus-b"].alt,
    position: "object-[45%_50%]",
  },
  portada: {
    src: coverOf("rosario-lircay-en-vela"),
    kind: "cover",
    alt: COVER_ALT["rosario-lircay-en-vela"],
    releaseSlug: "rosario-lircay-en-vela",
  },
  sesion: {
    src: ARTIST_HERO["con-fusion"].desktop,
    kind: "photo",
    alt: ARTIST_HERO["con-fusion"].alt,
    position: "object-[55%_50%]",
  },
  prensa: {
    src: "/media/sello/sello-hero.jpg",
    kind: "photo",
    // Aquí la foto se ve casi entera (a diferencia del hero recortado de /sello), así que el alt
    // describe la escena completa (revisado con capturas a 1280 y 390, 29-10).
    alt: {
      es: "Con.fusión e invitados en la sesión La Banca: delante, sentados en bancas de plaza, un hombre con jockey que canta al micrófono y una mujer de pelo largo y rizado con otro micrófono; detrás, un DJ de pie con gorro de lana junto a la tornamesa; escenario oscuro, foto en blanco y negro",
      en: "Con.fusión and guests at the La Banca session: in front, seated on park benches, a man in a baseball cap singing into a microphone and a woman with long curly hair holding another microphone; behind them, a DJ in a beanie standing at the turntable; dark stage, black-and-white photo",
    },
  },
};

/** Fondo del cierre: la foto B/N de La Banca que ya usa el bloque Servicios de la portada. */
export const CLOSING_BG = {
  desktop: { src: "/media/home/servicios-bg.jpg", width: 2560, height: 1440 },
  mobile: { src: "/media/home/servicios-bg-mobile.jpg", width: 1200, height: 1500 },
} as const;

// ── Créditos de portada, leídos de lib/releases.ts (nunca escritos a mano) ──

/** Roles de crédito que corresponden al arte de portada, por prioridad. */
export const COVER_ROLES = ["Ilustración de portada", "Cover art", "Diseño", "Diseño gráfico", "Dirección de arte"] as const;

export const ROLE_EN: Record<(typeof COVER_ROLES)[number], string> = {
  "Ilustración de portada": "Cover illustration",
  "Cover art": "Cover art",
  Diseño: "Design",
  "Diseño gráfico": "Graphic design",
  "Dirección de arte": "Art direction",
};

/** "Rol: Nombre" del arte de portada de un lanzamiento, o null si la ficha no lo trae. */
export function coverCredit(slug: string, lang: string): string | null {
  const credits = releases.find((r) => r.slug === slug)?.credits ?? [];
  for (const role of COVER_ROLES) {
    const credit = credits.find((c) => c.role === role);
    if (credit) return `${toLang(lang) === "en" ? ROLE_EN[role] : role}: ${credit.name}`;
  }
  return null;
}

export type CoverCard = {
  slug: string;
  src: string;
  alt: string;
  title: string;
  artist: string;
  credit: string | null;
};

/** Datos de una portada para pintarla con su pie (título · artista) y su crédito. */
export function getCover(slug: string, lang: string): CoverCard | null {
  const l = toLang(lang);
  const release = releases.find((r) => r.slug === slug);
  if (!release?.cover) return null;
  return {
    slug,
    src: release.cover,
    alt: COVER_ALT[slug]?.[l] ?? `${release.title} — ${release.artistName}`,
    title: release.title,
    artist: release.artistName,
    credit: coverCredit(slug, l),
  };
}

/** Las tres portadas de la apertura, en el orden de STRIP_SLUGS. */
export function getStripCovers(lang: string): CoverCard[] {
  return STRIP_SLUGS.map((slug) => getCover(slug, lang)).filter((c): c is CoverCard => c !== null);
}

// ── Recorridos: lo heredado del anterior y lo que suma cada uno ──

export type JourneyView = {
  id: JourneyId;
  name: string;
  /** Nombre del recorrido anterior (null en el primero). */
  previous: string | null;
  inherited: string[];
  adds: string[];
  note?: string;
};

/** Cada recorrido con todo lo que trae del anterior: la lista crece de uno a otro. */
export function getJourneys(lang: string): JourneyView[] {
  const items = SERVICES[toLang(lang)].journeys.items;
  return items.map((item, i) => ({
    id: item.id,
    name: item.name,
    previous: i > 0 ? items[i - 1].name : null,
    inherited: items.slice(0, i).flatMap((prev) => prev.adds),
    adds: item.adds,
    ...(item.note ? { note: item.note } : {}),
  }));
}

// ── JSON-LD ──

/** Service + WebPage + BreadcrumbList. El catálogo nombra las piezas; ninguna oferta lleva montos. */
export function servicesJsonLd(lang: string) {
  const l = toLang(lang);
  const c = SERVICES[l];
  const url = `${SITE}/${l}${SERVICES_PATH}`;
  const serviceId = `${url}#service`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": serviceId,
        name: c.meta.title,
        serviceType: c.meta.serviceType,
        description: c.meta.description,
        url,
        provider: { "@type": "Organization", "@id": ORG_ID, name: LABEL_NAME },
        areaServed: { "@type": "Country", name: "Chile" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: c.pieces.title,
          itemListElement: c.pieces.items.map((p) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: p.title, description: p.summary },
          })),
        },
      },
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: c.meta.title,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": serviceId },
        inLanguage: l === "es" ? "es-CL" : "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: LABEL_NAME, item: `${SITE}/${l}` },
          { "@type": "ListItem", position: 2, name: c.meta.title, item: url },
        ],
      },
    ],
  };
}
