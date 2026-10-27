import type { MetadataRoute } from "next";
// Imports relativos: scripts/test-seo.mjs llama a sitemap() desde Node, sin el alias @/.
import { artists as roster } from "../lib/artists";
import { releases as releaseList } from "../lib/releases";
import { getPublishedVideos } from "../lib/videos";
import { getArtistEntries, getCatalogEntries } from "../lib/catalog";
import { getUpcomingEvents } from "../lib/events";
import { SITE } from "../lib/schema";
import { exactPastDate, latestDate } from "../lib/seo";

const LOCALES = ["es", "en"] as const;

// Por petición, no congelado en el build: así un video con fecha futura entra al sitemap
// a las 00:00 America/Santiago de ese día, en paridad con su ficha (404 hasta entonces,
// evaluada por petición). Sin esto, `getPublishedVideos()` y `now` quedarían fijados en
// el momento del deploy y el video aparecería recién en el siguiente.
// Decisión (revisión del pendiente 17): se mantiene por petición y no `revalidate = 3600`
// como /llms.txt. El cálculo extra (fichas, catálogo, eventos) recorre arreglos en memoria
// de unas 150 entradas, y con ISR un video o el fin de la última fecha de /eventos llegarían
// al sitemap con hasta 1 h de atraso respecto de su página.
export const dynamic = "force-dynamic";

function withAlternates(path: string) {
  return {
    es: `${SITE}/es${path}`,
    en: `${SITE}/en${path}`,
    "x-default": `${SITE}/es${path}`,
  };
}

const STATIC_PAGES = ["/manifiesto", "/sello", "/servicios", "/catalogo", "/videos", "/eventos", "/contacto", "/privacidad", "/press-kit"] as const;
type StaticPath = "" | (typeof STATIC_PAGES)[number];

/**
 * Último cambio real de cada página fija (lastmod). Fuente: `git log -1 --format=%cs 6f5e127 --
 * <page.tsx y archivos de su carpeta>`, anclado a la base del pendiente 17 para que el propio
 * cambio de metadata no cuente como cambio de contenido: todas dan 2026-10-24 (8dbb7d2).
 * /eventos va sin fecha: su contenido depende de lib/events.ts y del día. Al tocar el texto de
 * una página, actualizar su fecha aquí (/press-kit, después de integrar el carril G).
 */
const STATIC_LASTMOD: Record<StaticPath, string | undefined> = {
  "": "2026-10-26",
  "/manifiesto": "2026-10-26",
  "/sello": "2026-10-26",
  "/servicios": "2026-10-26", // pendiente 18: fecha del commit que crea la página
  "/catalogo": "2026-10-26",
  "/videos": "2026-10-26",
  "/eventos": undefined,
  "/contacto": "2026-10-26",
  "/privacidad": "2026-10-26",
  "/press-kit": "2026-10-26",
};

type Entry = MetadataRoute.Sitemap[number];

/** Una entrada por idioma; `lastModified` solo si hay una fecha verdadera. */
function entries(
  path: string,
  lastModified: string | undefined,
  changeFrequency: Entry["changeFrequency"],
  priority: number,
): Entry[] {
  return LOCALES.map((lang) => ({
    url: `${SITE}/${lang}${path}`,
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
    alternates: { languages: withAlternates(path) },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = Date.now();
  const published = getPublishedVideos(now);

  // Lanzamientos: su fecha si ya salió y es un día completo; futuros o parciales, sin fecha.
  const releases = releaseList.flatMap((r) =>
    entries(`/releases/${r.slug}`, exactPastDate(r.releaseDate, now), "yearly", 0.6),
  );

  // Solo videos ya publicados: uno con fecha futura responde 404 hasta las 00:00 Santiago.
  const videos = published.flatMap((v) =>
    entries(`/videos/${v.slug}`, exactPastDate(v.date, now), "yearly", 0.5),
  );

  // Ficha de artista: lo más reciente entre su discografía (con colaboraciones) y sus videos.
  const artists = roster.flatMap((a) =>
    entries(
      `/artistas/${a.slug}`,
      latestDate([
        ...getArtistEntries(a.slug).map((e) => exactPastDate(e.releaseDate, now)),
        ...published.filter((v) => v.artistSlug === a.slug).map((v) => exactPastDate(v.date, now)),
      ]),
      "monthly",
      0.8,
    ),
  );

  // Catálogo y videos listan datos: su fecha es la mayor entre el texto y el último dato.
  const dataLastmod: Partial<Record<StaticPath, string | undefined>> = {
    "/catalogo": latestDate(getCatalogEntries().map((e) => exactPastDate(e.releaseDate, now))),
    "/videos": latestDate(published.map((v) => exactPastDate(v.date, now))),
  };

  // /eventos sale del sitemap mientras no haya fechas próximas (mismo filtro que la página,
  // que en ese caso lleva noindex).
  const hasUpcomingEvents = getUpcomingEvents(new Date(now)).length > 0;
  const editorial = STATIC_PAGES.filter((path) => path !== "/eventos" || hasUpcomingEvents).flatMap(
    (path) => entries(path, latestDate([STATIC_LASTMOD[path], dataLastmod[path]]), "monthly", 0.7),
  );

  const rest = [...editorial, ...artists, ...releases, ...videos];

  // Portada: el último cambio de todo el sitio.
  const home = entries(
    "",
    latestDate([STATIC_LASTMOD[""], ...rest.map((e) => e.lastModified as string | undefined)]),
    "weekly",
    1.0,
  );

  return [...home, ...rest];
}
