// Metadata por página y fechas verdaderas para el sitemap (pendiente 17, A3 y A5).
//
// Imports relativos e `import type`: scripts/test-seo.mjs importa este módulo
// desde Node sin el alias @/.
import type { Metadata } from "next";
import { LABEL_NAME, SITE, toLang } from "./schema";
import { isReleased } from "./release-date";

/** Plantilla de títulos de app/layout.tsx. */
export const TITLE_TEMPLATE = `%s — ${LABEL_NAME}`;
/** Largo máximo del <title> final, contando la plantilla. */
export const TITLE_MAX = 60;

export type OgImage = { url: string; width: number; height: number; alt: string };

export type PageMetadataInput = {
  lang: string;
  /** Ruta tras el idioma, con "/" inicial ("/catalogo"); "" para la portada. */
  path: string;
  title: string;
  description: string;
  /** Imagen OG propia; por defecto, la tarjeta del idioma (app/[lang]/opengraph-image.tsx). */
  image?: OgImage;
  noindex?: boolean;
};

const OG_LOCALE = { es: "es_CL", en: "en_US" } as const;

/** Largo en caracteres visibles (NFC, por punto de código: "Ō" y "É" cuentan uno). */
export const titleLength = (s: string): number => [...s.normalize("NFC")].length;

/** Título tal como lo arma la plantilla del layout. */
export const templatedTitle = (title: string): string => TITLE_TEMPLATE.replace("%s", title);

/**
 * Metadata completa de una página bajo /[lang]: canonical absoluta, hreflang con
 * x-default, Open Graph y Twitter por idioma. El `openGraph` de una página
 * reemplaza entero al heredado, así que la imagen va siempre (sin ella se pierde).
 */
export function pageMetadata({ lang, path, title, description, image, noindex }: PageMetadataInput): Metadata {
  const l = toLang(lang);
  const other = l === "es" ? "en" : "es";
  const url = `${SITE}/${l}${path}`;
  const full = templatedTitle(title);
  // La plantilla solo se usa si el resultado cabe y el título no trae ya la marca.
  const useTemplate = titleLength(full) <= TITLE_MAX && !title.includes(LABEL_NAME);
  const shown = useTemplate ? full : title;
  const ogImage: OgImage = image ?? {
    url: `${SITE}/${l}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: LABEL_NAME,
  };

  return {
    title: useTemplate ? title : { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        es: `${SITE}/es${path}`,
        en: `${SITE}/en${path}`,
        "x-default": `${SITE}/es${path}`,
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: LABEL_NAME,
      title: shown,
      description,
      locale: OG_LOCALE[l],
      alternateLocale: [OG_LOCALE[other]],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: shown,
      description,
      images: [ogImage.url],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

const EXACT_DATE_RE = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/**
 * La fecha solo si es un día completo y real (YYYY-MM-DD, sin 02-31) que ya llegó
 * (00:00 America/Santiago, `isReleased`). Fechas parciales ("2027", "2025-11"),
 * texto ("in production"), los "-00" de getArtistEntries y fechas futuras → undefined.
 */
export function exactPastDate(raw: string, nowMs: number = Date.now()): string | undefined {
  const m = EXACT_DATE_RE.exec(raw);
  if (!m) return undefined;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (probe.getUTCFullYear() !== year || probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) {
    return undefined;
  }
  return isReleased(raw, nowMs) ? raw : undefined;
}

/** La más reciente de una lista de fechas YYYY-MM-DD (ignora undefined). */
export function latestDate(dates: ReadonlyArray<string | undefined>): string | undefined {
  let latest: string | undefined;
  for (const d of dates) if (d && (!latest || d > latest)) latest = d;
  return latest;
}
