// PDF del press kit (pendiente 11c): los botones "Press kit ES" y "Press kit EN" se ofrecen
// en los dos idiomas desde cualquier página, con el tamaño aproximado del archivo.
//
// El tamaño sale de este mapa y no de leer el disco al generar la página: con ISR la página
// se regenera en una función de Vercel, donde public/ no está garantizado. Al regenerar los
// PDF (scripts/generate-press-pdfs.sh) se actualiza con `stat -f%z public/press-kits/*.pdf`;
// `pnpm test:roster` (R6) falla si el tamaño redondeado deja de coincidir con el archivo.
//
// Imports relativos e `import type`: scripts/test-roster.mjs importa este módulo desde Node.
import type { Language } from "./translations";

/** Idiomas en que existe cada press kit, en el orden de los botones. */
export const PRESS_KIT_LANGS: readonly Language[] = ["es", "en"];

/** Bytes de public/press-kits/<clave>-<idioma>.pdf; la clave del sello es "press-kit". */
export const PRESS_KIT_BYTES: Record<string, Record<Language, number>> = {
  "press-kit": { es: 1023385, en: 1022357 },
  "newen-afrobeat": { es: 320485, en: 318835 },
  "klaus-b": { es: 326162, en: 327557 },
  ecamhi: { es: 330266, en: 329125 },
  "con-fusion": { es: 308720, en: 310879 },
  "rosario-lircay": { es: 304492, en: 306155 },
};

/** `slug` del artista, o null para el press kit del sello. */
const fileKey = (slug: string | null): string => slug ?? "press-kit";

/** Ruta pública del PDF: /press-kits/<slug|press-kit>-<idioma>.pdf. */
export const pressKitHref = (slug: string | null, lang: Language): string =>
  `/press-kits/${fileKey(slug)}-${lang}.pdf`;

/** Nombre con que se guarda el PDF: phone-records-<slug|press-kit>-<idioma>.pdf. */
export const pressKitDownloadName = (slug: string | null, lang: Language): string =>
  `phone-records-${fileKey(slug)}-${lang}.pdf`;

/** Bytes del PDF según el mapa; undefined si el archivo no está registrado. */
export const pressKitBytes = (slug: string | null, lang: Language): number | undefined =>
  PRESS_KIT_BYTES[fileKey(slug)]?.[lang];

/**
 * "PDF · 0,3 MB" (es) o "PDF · 0.3 MB" (en): MB de 1024², un decimal. Redondeado así, el
 * texto casi no cambia cuando se regeneran los PDF.
 */
export function formatPdfSize(bytes: number, uiLang: Language): string {
  const mb = new Intl.NumberFormat(uiLang === "es" ? "es-CL" : "en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(bytes / (1024 * 1024));
  return `PDF · ${mb} MB`;
}
