// Enlaces de intención de la ShareBar (pendiente 17g · carril O): `<a>` simples, sin SDK ni
// scripts de terceros. Función pura, sin JSX ni alias @/, para que Node la pruebe
// (scripts/test-share.mjs).
//
// Todo se codifica con encodeURIComponent: URLSearchParams convierte el espacio en "+", que
// `mailto:` no decodifica. Se comparte la URL canónica tal cual, sin UTM.

export type ShareLinkMethod = "whatsapp" | "x" | "facebook" | "threads" | "bluesky" | "email";

export type ShareLink = {
  method: ShareLinkMethod;
  /** Nombre de la red; el del correo lo traduce la ShareBar ("Enviar por correo" / "Send by email"). */
  label: string;
  href: string;
};

/** Orden fijo de los enlaces en la barra. */
export const SHARE_METHODS: readonly ShareLinkMethod[] = ["whatsapp", "x", "facebook", "threads", "bluesky", "email"];

// Nombre accesible (sr-only) y tooltip. "X" a secas el lector de pantalla lo lee "equis".
const LABEL: Record<ShareLinkMethod, string> = {
  whatsapp: "WhatsApp",
  x: "X (Twitter)",
  facebook: "Facebook",
  threads: "Threads",
  bluesky: "Bluesky",
  email: "Email",
};

/** `url`: canónica absoluta de la página; `title`: el mismo título que og:title. */
export function shareLinks({ url, title }: { url: string; title: string }): ShareLink[] {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const tu = encodeURIComponent(`${title} ${url}`);
  const href: Record<ShareLinkMethod, string> = {
    whatsapp: `https://wa.me/?text=${tu}`,
    x: `https://x.com/intent/post?text=${t}&url=${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    threads: `https://www.threads.com/intent/post?text=${t}&url=${u}`,
    bluesky: `https://bsky.app/intent/compose?text=${tu}`,
    email: `mailto:?subject=${t}&body=${u}`,
  };
  return SHARE_METHODS.map((method) => ({ method, label: LABEL[method], href: href[method] }));
}
