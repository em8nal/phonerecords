// /llms.txt (propuesta llmstxt.org) para motores de respuesta: qué es el sello, sus
// artistas, sus lanzamientos ya publicados, prensa y contacto, con enlaces absolutos.
// Todo sale de los datos (lib/artists.ts, lib/releases.ts, lib/videos.ts) o de textos
// que el sitio ya publica (/sello, metadata de cada página): nada inventado.
// proxy.ts no intercepta /llms.txt (su matcher excluye los .txt).
//
// Imports relativos: scripts/test-seo.mjs llama a GET() desde Node, sin el alias @/.
// Una ruta solo puede exportar handlers y configuración de segmento.
import { artists } from "../../lib/artists";
import { releases, type Release } from "../../lib/releases";
import { getPublishedVideos } from "../../lib/videos";
import { isReleased, releaseStartMs } from "../../lib/release-date";
import { LABEL_NAME, LABEL_SAME_AS, SITE } from "../../lib/schema";
import type { Language } from "../../lib/translations";

export const revalidate = 3600;

const TYPE_LABEL: Record<Language, Record<Release["type"], string>> = {
  es: { album: "álbum", ep: "EP", single: "single", live: "en vivo", mixtape: "mixtape", compilation: "compilado" },
  en: { album: "album", ep: "EP", single: "single", live: "live", mixtape: "mixtape", compilation: "compilation" },
};

const COPY = {
  es: {
    summary:
      "Sello discográfico, oficina de management y productora musical con base en Ñuñoa, Santiago de Chile. Edita en vinilo y digital y gestiona giras entre Chile y Europa.",
    label: "El sello",
    about: ["Sobre el sello", "sello discográfico, management y producción musical en Santiago de Chile; ediciones en vinilo y digital, giras entre Chile y Europa."],
    manifesto: ["Manifiesto", "marco, circulación y dirección autoral para la música independiente."],
    catalogue: ["Catálogo", "discos, EPs, sesiones en vivo y singles del roster."],
    artists: "Artistas",
    releases: `Lanzamientos ℗ ${LABEL_NAME}`,
    videos: "Videos",
    videosNote: (n: number) =>
      `${n} videos publicados: videoclips, sesiones y registros en vivo de los artistas del sello, con un texto propio por pieza.`,
    press: "Prensa",
    pressKit: ["Press kit", "bio del sello, roster, lanzamientos destacados y contacto."],
    contact: "Contacto",
    contactPage: ["Contacto", "consultas generales, booking, prensa, propuestas de artista o trabajo con el sello."],
    booking: ["Booking y conciertos", "formulario de contacto con el asunto booking."],
  },
  en: {
    summary:
      "Record label, management office and music production company based in Ñuñoa, Santiago, Chile. Releases on vinyl and digital and manages tours between Chile and Europe.",
    label: "About",
    about: ["About the label", "record label, management and music production in Santiago, Chile; vinyl and digital releases, tours between Chile and Europe."],
    manifesto: ["Manifesto", "framework, circulation and authorial direction for independent music."],
    catalogue: ["Catalogue", "albums, EPs, live sessions and singles from the roster."],
    artists: "Artists",
    releases: `Releases ℗ ${LABEL_NAME}`,
    videos: "Videos",
    videosNote: (n: number) =>
      `${n} published videos: music videos, sessions and live footage from the label's artists, with an original text for each piece.`,
    press: "Press",
    pressKit: ["Press kit", "label bio, roster, featured releases and contact."],
    contact: "Contact",
    contactPage: ["Contact", "general inquiries, booking, press, artist proposals or working with the label."],
    booking: ["Booking and concerts", "contact form with the booking topic."],
  },
} as const;

/** Texto de enlace markdown con corchetes escapados. */
const linkText = (s: string): string => s.replace(/[[\]]/g, (ch) => `\\${ch}`);
const item = (text: string, url: string, note?: string): string =>
  `- [${linkText(text)}](${url})${note ? `: ${note}` : ""}`;

/** Nombre visible de un canal del sello (sameAs). */
function socialName(url: string): string {
  if (url.includes("instagram.com")) return "Instagram";
  if (url.includes("youtube.com")) return "YouTube";
  return new URL(url).hostname;
}

/** Primera oración del primer párrafo de la bio (no corta en "Con.fusión"). */
function firstSentence(bio: string): string {
  const paragraph = bio.split(/\n{2,}/)[0].replace(/\s+/g, " ").trim();
  return paragraph.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? paragraph;
}

/** Lanzamientos ℗ PHŌNÉ ya publicados (fecha real alcanzada), del más reciente al más antiguo. */
function labelReleases(nowMs: number): Release[] {
  return releases
    .filter(
      (r) => r.label === LABEL_NAME && releaseStartMs(r.releaseDate) !== null && isReleased(r.releaseDate, nowMs),
    )
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate) || a.title.localeCompare(b.title));
}

function sections(lang: Language, nowMs: number, heading: "##" | "###"): string[] {
  const c = COPY[lang];
  const base = `${SITE}/${lang}`;
  const videoCount = getPublishedVideos(nowMs).length;
  return [
    `${heading} ${c.label}`,
    "",
    item(c.about[0], `${base}/sello`, c.about[1]),
    item(c.manifesto[0], `${base}/manifiesto`, c.manifesto[1]),
    item(c.catalogue[0], `${base}/catalogo`, c.catalogue[1]),
    "",
    `${heading} ${c.artists}`,
    "",
    ...artists.map((a) => item(a.name, `${base}/artistas/${a.slug}`, firstSentence(a.bio[lang]))),
    "",
    `${heading} ${c.releases}`,
    "",
    ...labelReleases(nowMs).map((r) =>
      item(`${r.title} — ${r.artistName}`, `${base}/releases/${r.slug}`, `${r.releaseDate} · ${TYPE_LABEL[lang][r.type]}`),
    ),
    "",
    `${heading} ${c.videos}`,
    "",
    item(c.videos, `${base}/videos`, c.videosNote(videoCount)),
    "",
    `${heading} ${c.press}`,
    "",
    item(c.pressKit[0], `${base}/press-kit`, c.pressKit[1]),
    "",
    `${heading} ${c.contact}`,
    "",
    item(c.contactPage[0], `${base}/contacto`, c.contactPage[1]),
    item(c.booking[0], `${base}/contacto?topic=booking`, c.booking[1]),
    ...LABEL_SAME_AS.map((url) => item(socialName(url), url)),
    "",
  ];
}

export function GET(): Response {
  const now = Date.now();
  const body = [
    `# ${LABEL_NAME}`,
    "",
    `> ${COPY.es.summary}`,
    "",
    `Artistas: ${artists.map((a) => a.name).join(", ")}.`,
    "",
    ...sections("es", now, "##"),
    "## English",
    "",
    `${COPY.en.summary} Artists: ${artists.map((a) => a.name).join(", ")}.`,
    "",
    ...sections("en", now, "###"),
  ].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
