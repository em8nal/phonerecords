// Preguntas frecuentes de /sello y /press-kit (pendiente 17h, AEO): visibles en la página y,
// con los mismos textos, en el JSON-LD FAQPage. Google ya no muestra las FAQ enriquecidas a
// sitios comunes; el valor está en los motores de respuesta.
//
// Reglas del contenido: respuestas cortas (1 a 3 oraciones) sacadas solo de lo que el sitio
// ya publica en /sello, /press-kit, /servicios, /contacto y los datos; sin año de fundación
// del sello (X27), sin valores y sin correos personales. Lo vigila `pnpm test:seo`.
//
// Imports relativos e `import type`: scripts/test-seo.mjs importa este módulo desde Node. Sin JSX.
import { artists } from "./artists";
import { LABEL_EMAIL, toLang } from "./schema";
import type { Language } from "./translations";

/** Texto, o enlace interno con `href` sin idioma ("/contacto?topic=propuesta"). */
export type FaqSegment = string | { text: string; href: string };
export type FaqItem = { id: string; q: string; a: FaqSegment[] };
export type FaqPage = "sello" | "pressKit";

/** "A, B, C y D" / "A, B, C and D", con cada nombre enlazado a su ficha. */
function artistList(lang: Language): FaqSegment[] {
  const and = lang === "es" ? " y " : " and ";
  return artists.flatMap((a, i): FaqSegment[] => [
    ...(i === 0 ? [] : [i === artists.length - 1 ? and : ", "]),
    { text: a.name, href: `/artistas/${a.slug}` },
  ]);
}

const BOOKING_ES: FaqSegment[] = [
  "Por el ",
  { text: "formulario de contacto", href: "/contacto?topic=booking" },
  ', con el asunto "Booking". El booking en Europa lo gestiona Ludwig Sound Booking Agency (Heidelberg, Alemania); el de Latinoamérica y el resto del mundo, PHŌNÉ Records.',
];
const BOOKING_EN: FaqSegment[] = [
  "Through the ",
  { text: "contact form", href: "/contacto?topic=booking" },
  ', with the subject "Booking". European booking is handled by Ludwig Sound Booking Agency (Heidelberg, Germany); Latin America and the rest of the world, by PHŌNÉ Records.',
];

export const FAQ: Record<FaqPage, Record<Language, FaqItem[]>> = {
  sello: {
    es: [
      {
        id: "que-es",
        q: "¿Qué es PHŌNÉ Records?",
        a: [
          "Un sello discográfico, una oficina de management y una productora musical. Edita en vinilo y digital, y acompaña a sus artistas en el catálogo, los conciertos y las giras.",
        ],
      },
      {
        id: "donde",
        q: "¿Dónde está PHŌNÉ Records?",
        a: ["En Ñuñoa, Santiago de Chile. Desde ahí gestiona giras entre Chile y Europa."],
      },
      {
        id: "artistas",
        q: "¿Con qué artistas trabaja?",
        a: [
          "Con ",
          ...artistList("es"),
          ". Cada artista tiene su ficha con biografía, discografía y press kit.",
        ],
      },
      {
        id: "propuesta",
        q: "¿Cómo envío una propuesta de artista?",
        a: [
          "Por el ",
          { text: "formulario de contacto", href: "/contacto?topic=propuesta" },
          ', con el asunto "Propuesta de artista". Incluye al menos un enlace completo a tu música (https://…) y tu ciudad.',
        ],
      },
      { id: "booking", q: "¿Cómo pido booking para un artista del sello?", a: BOOKING_ES },
      {
        id: "servicios",
        q: "¿PHŌNÉ Records ofrece dirección creativa, diseño y prensa?",
        a: [
          "Sí, para lanzamientos discográficos y a la medida de cada artista. El detalle está en ",
          { text: "Servicios", href: "/servicios" },
          ', y se consulta con el asunto "Dirección creativa, diseño y prensa" del ',
          { text: "formulario de contacto", href: "/contacto?topic=servicios" },
          ".",
        ],
      },
      {
        id: "press-kit",
        q: "¿Dónde descargo el press kit?",
        a: [
          "En la página ",
          { text: "Press kit", href: "/press-kit" },
          ", en PDF, en español y en inglés. El press kit de cada artista está en su ficha.",
        ],
      },
    ],
    en: [
      {
        id: "que-es",
        q: "What is PHŌNÉ Records?",
        a: [
          "A record label, a management office and a music production company. It releases on vinyl and digital, and supports its artists across catalogue, concerts and tours.",
        ],
      },
      {
        id: "donde",
        q: "Where is PHŌNÉ Records based?",
        a: ["In Ñuñoa, Santiago, Chile. From there it manages tours between Chile and Europe."],
      },
      {
        id: "artistas",
        q: "Which artists does it work with?",
        a: [
          "With ",
          ...artistList("en"),
          ". Each artist has a page with biography, discography and press kit.",
        ],
      },
      {
        id: "propuesta",
        q: "How do I send an artist proposal?",
        a: [
          "Through the ",
          { text: "contact form", href: "/contacto?topic=propuesta" },
          ', with the subject "Artist proposal". Include at least one full link to your music (https://…) and your city.',
        ],
      },
      { id: "booking", q: "How do I book an artist from the label?", a: BOOKING_EN },
      {
        id: "servicios",
        q: "Does PHŌNÉ Records offer creative direction, design and press?",
        a: [
          "Yes, for record releases and tailored to each artist. Details are on the ",
          { text: "Services", href: "/servicios" },
          ' page; to ask about it, use the "Creative direction, design & press" subject of the ',
          { text: "contact form", href: "/contacto?topic=servicios" },
          ".",
        ],
      },
      {
        id: "press-kit",
        q: "Where can I download the press kit?",
        a: [
          "On the ",
          { text: "Press kit", href: "/press-kit" },
          " page, as a PDF in Spanish and in English. Each artist's press kit is on their page.",
        ],
      },
    ],
  },
  pressKit: {
    es: [
      {
        id: "que-es",
        q: "¿Qué es PHŌNÉ Records?",
        a: [
          "Un sello cultural independiente con dirección autoral y base en Ñuñoa, Santiago de Chile: producción integral, management y curaduría de música independiente latinoamericana en diálogo con circuitos europeos y globales.",
        ],
      },
      {
        id: "artistas",
        q: "¿Qué artistas forman parte del roster?",
        a: [
          ...artistList("es"),
          ". Cada artista tiene su propio press kit en PDF, en español y en inglés, en su ficha.",
        ],
      },
      {
        id: "descargar",
        q: "¿Puedo descargar el press kit en el otro idioma?",
        a: [
          'Sí. Los botones "Press kit ES" y "Press kit EN" descargan el PDF en español o en inglés desde cualquier versión del sitio, en esta página y en la ficha de cada artista.',
        ],
      },
      {
        id: "prensa",
        q: "¿Cómo contacto al sello para prensa?",
        a: [
          "Por el ",
          { text: "formulario de contacto", href: "/contacto?topic=prensa" },
          `, con el asunto "Prensa", o escribiendo a ${LABEL_EMAIL}.`,
        ],
      },
      { id: "booking", q: "¿Cómo pido booking para un artista?", a: BOOKING_ES },
      {
        id: "lanzamientos",
        q: "¿Dónde encuentro los lanzamientos y los videos del sello?",
        a: [
          "En el ",
          { text: "catálogo", href: "/catalogo" },
          ", con cada lanzamiento y sus enlaces para escuchar, y en ",
          { text: "Videos", href: "/videos" },
          ".",
        ],
      },
    ],
    en: [
      {
        id: "que-es",
        q: "What is PHŌNÉ Records?",
        a: [
          "An independent cultural label with strong authorial direction, based in Ñuñoa, Santiago, Chile: integral production, management and curation of independent Latin American music in dialogue with European and global circuits.",
        ],
      },
      {
        id: "artistas",
        q: "Which artists are on the roster?",
        a: [
          ...artistList("en"),
          ". Each artist has their own press kit as a PDF, in Spanish and in English, on their page.",
        ],
      },
      {
        id: "descargar",
        q: "Can I download the press kit in the other language?",
        a: [
          'Yes. The "Press kit ES" and "Press kit EN" buttons download the PDF in Spanish or in English from either version of the site, on this page and on each artist\'s page.',
        ],
      },
      {
        id: "prensa",
        q: "How do I contact the label for press?",
        a: [
          "Through the ",
          { text: "contact form", href: "/contacto?topic=prensa" },
          `, with the subject "Press", or by writing to ${LABEL_EMAIL}.`,
        ],
      },
      { id: "booking", q: "How do I request booking for an artist?", a: BOOKING_EN },
      {
        id: "lanzamientos",
        q: "Where can I find the label's releases and videos?",
        a: [
          "In the ",
          { text: "catalogue", href: "/catalogo" },
          ", with each release and its listening links, and on the ",
          { text: "Videos", href: "/videos" },
          " page.",
        ],
      },
    ],
  },
};

/** Respuesta en texto plano (para el JSON-LD): los enlaces quedan como su texto. */
export function faqPlainAnswer(a: FaqSegment[]): string {
  return a.map((s) => (typeof s === "string" ? s : s.text)).join("");
}

/** `mainEntity` del FAQPage: las mismas preguntas y respuestas de la página, en su idioma. */
export function faqMainEntity(page: FaqPage, lang: string) {
  return FAQ[page][toLang(lang)].map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: faqPlainAnswer(item.a) },
  }));
}
