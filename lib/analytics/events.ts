// Taxonomía única de eventos de analítica (plan B3, pendiente 19 · carril O).
//
// Un solo lugar para los nombres y los parámetros de los eventos propios del sitio. `track()`
// solo empuja a `window.dataLayer`; GTM los recoge y Consent Mode v2 (components/consent/**)
// decide qué llega a GA4. Este módulo no lee ni decide el consentimiento, no escribe cookies
// y no carga scripts. Ningún parámetro lleva datos personales (correo, nombre, teléfono).
//
// Lo importa Node (scripts/test-share.mjs) sin el alias @/: sin imports de runtime y solo
// sintaxis que se puede borrar (tipos, `as const`, `satisfies`; sin `enum`).
// Ojo: lib/events.ts es otro módulo (las fechas de la gira), no tiene relación con este.
import type { Topic } from "../../app/[lang]/contacto/contact-schema";

/** Plataforma de destino de un enlace saliente (ver platformFromHref). */
export type Platform =
  | "smartlink"
  | "spotify"
  | "apple_music"
  | "youtube"
  | "bandcamp"
  | "soundcloud"
  | "tidal"
  | "deezer"
  | "qobuz"
  | "beatport"
  | "discogs"
  | "other";

/** Cómo se compartió: hoja nativa, copiar enlace o un enlace de intención de la ShareBar. */
export type ShareMethod = "native" | "copy" | "whatsapp" | "x" | "facebook" | "threads" | "bluesky" | "email";

/** Tipo de ficha que se comparte. */
export type ShareContentType = "release" | "video" | "artist";

/** Dónde está el formulario del newsletter. */
export type NewsletterSource = "contacto" | "home" | "footer" | "contacto-form" | `release:${string}`;

/** Idioma de un press kit en PDF. */
export type PdfLang = "es" | "en";

/** Parámetros de cada evento. Las claves van en snake_case, como las espera GA4. */
export type AnalyticsEventParams = {
  presave_click: { platform: Platform; release: string };
  listen_click: { platform: Platform; release: string };
  outbound_platform: { platform: Platform; release: string };
  pdf_download: { artist: string; lang: PdfLang };
  contact_submit_success: { topic: Topic };
  newsletter_signup: { source: NewsletterSource };
  share: { method: ShareMethod; content_type: ShareContentType; item_id: string };
  /** Ya lo empuja components/phone/media-facade.tsx (trackPlayFacade) con esta misma forma. */
  play_facade: { provider: "youtube" | "spotify"; id: string };
};

export type AnalyticsEventName = keyof AnalyticsEventParams;

/** Nombre → claves de sus parámetros (para la prueba y para configurar GTM). */
export const EVENT_PARAMS = {
  presave_click: ["platform", "release"],
  listen_click: ["platform", "release"],
  outbound_platform: ["platform", "release"],
  pdf_download: ["artist", "lang"],
  contact_submit_success: ["topic"],
  newsletter_signup: ["source"],
  share: ["method", "content_type", "item_id"],
  play_facade: ["provider", "id"],
} as const satisfies { readonly [E in AnalyticsEventName]: readonly (keyof AnalyticsEventParams[E])[] };

/**
 * Empuja `{ event, ...params }` a `window.dataLayer` (lo crea si no existe). En el servidor no
 * hace nada. Nunca lanza: un fallo de medición no puede romper el clic ni el envío.
 */
export function track<E extends AnalyticsEventName>(event: E, params: AnalyticsEventParams[E]): void {
  if (typeof window === "undefined") return;
  try {
    (window.dataLayer ||= []).push({ event, ...params });
  } catch {
    // Sin medición; la interacción sigue.
  }
}

// Host exacto o subdominio (".dominio"); nunca una subcadena (evilspotify.com no es Spotify).
const PLATFORM_HOSTS: readonly (readonly [string, Platform])[] = [
  ["orcd.co", "smartlink"],
  ["onerpm.link", "smartlink"],
  ["ffm.to", "smartlink"],
  ["lnk.to", "smartlink"],
  ["open.spotify.com", "spotify"],
  ["music.apple.com", "apple_music"],
  ["youtube.com", "youtube"],
  ["youtu.be", "youtube"],
  ["bandcamp.com", "bandcamp"],
  ["soundcloud.com", "soundcloud"],
  ["tidal.com", "tidal"],
  ["deezer.com", "deezer"],
  ["qobuz.com", "qobuz"],
  ["beatport.com", "beatport"],
  ["discogs.com", "discogs"],
];

/** Plataforma de un enlace absoluto; "other" si no se reconoce o el href no es una URL. */
export function platformFromHref(href: string): Platform {
  let host: string;
  try {
    host = new URL(href).hostname.toLowerCase();
  } catch {
    return "other";
  }
  for (const [domain, platform] of PLATFORM_HOSTS) {
    if (host === domain || host.endsWith(`.${domain}`)) return platform;
  }
  return "other";
}

/**
 * Artista e idioma de un press kit en PDF a partir de su ruta:
 * `/press-kits/klaus-b-es.pdf` → `{ artist: "klaus-b", lang: "es" }`; el del sello
 * (`/press-kits/press-kit-en.pdf`) → `{ artist: "phone-records", lang: "en" }`. Otra ruta → null.
 */
export function pdfParamsFromHref(href: string): AnalyticsEventParams["pdf_download"] | null {
  const m = /^\/press-kits\/(.+)-(es|en)\.pdf$/.exec(href);
  if (!m) return null;
  return { artist: m[1] === "press-kit" ? "phone-records" : m[1], lang: m[2] === "en" ? "en" : "es" };
}

/** Slug de lanzamiento de una ruta `/(es|en)/releases/<slug>`; si no lo es, undefined. */
export function releaseSlugFromPath(path: string): string | undefined {
  return /^\/(?:es|en)\/releases\/([^/?#]+)/.exec(path)?.[1];
}
