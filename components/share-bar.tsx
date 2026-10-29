"use client";

// Barra para compartir una ficha (pendiente 17g · carril O), sin scripts de terceros:
// - "Copiar enlace" con navigator.clipboard y aviso en una región aria-live;
// - "Más opciones" (hoja nativa, navigator.share) solo donde existe; aparece al hidratar al
//   final de la primera fila, así que no mueve nada;
// - enlaces de intención (WhatsApp, X, Facebook, Threads, Bluesky y correo) como <a> simples,
//   armados por lib/share.ts con la canónica absoluta y el título que le pasa la página.
// Cada acción registra el evento `share` (lib/analytics/events.ts). La página la renderiza en el
// servidor con props serializables; nada aquí lee window ni navigator durante el render, salvo
// el snapshot de cliente de useSyncExternalStore (false en el SSR y en la hidratación).

import { useId, useRef, useState, useSyncExternalStore, type ReactElement } from "react";
import { Check, Link2, Mail, Share2 } from "lucide-react";
import { shareLinks, type ShareLinkMethod } from "@/lib/share";
import { track, type ShareContentType, type ShareMethod } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

type Lang = "es" | "en";

const COPY = {
  es: {
    heading: { release: "Compartir este lanzamiento", video: "Compartir este video", artist: "Compartir este artista" },
    copy: "Copiar enlace",
    more: "Más opciones",
    copied: "Enlace copiado",
    failed: (url: string) => `No se pudo copiar. Enlace: ${url}`,
    email: "Enviar por correo",
    newTab: " (se abre en pestaña nueva)",
  },
  en: {
    heading: { release: "Share this release", video: "Share this video", artist: "Share this artist" },
    copy: "Copy link",
    more: "More options",
    copied: "Link copied",
    failed: (url: string) => `Couldn't copy. Link: ${url}`,
    email: "Send by email",
    newTab: " (opens in new tab)",
  },
} as const;

// Íconos de marca: paths de simple-icons 13.0.0 (CC0), viewBox 24 × 24. El correo usa lucide.
const BRAND_PATHS: Record<Exclude<ShareLinkMethod, "email">, string> = {
  whatsapp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  facebook:
    "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  threads:
    "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z",
  bluesky:
    "M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z",
};

/** Ícono decorativo (el nombre accesible va en sr-only); `<title>` solo da el tooltip al pasar el mouse. */
function ShareIcon({ method, name }: { method: ShareLinkMethod; name: string }): ReactElement {
  if (method === "email") {
    return (
      // lucide agrega los hijos en un arreglo junto a sus paths: el <title> necesita key.
      <Mail className="h-[18px] w-[18px]" aria-hidden="true" focusable="false">
        <title key="title">{name}</title>
      </Mail>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true" focusable="false">
      <title>{name}</title>
      <path d={BRAND_PATHS[method]} />
    </svg>
  );
}

// Contorno transparente y no `outline-none`: en modo de colores forzados (alto contraste de
// Windows) la box-shadow del anillo desaparece y el contorno toma el color del sistema, así
// que el foco se sigue viendo. Mismo patrón que FACADE_FOCUS (components/phone/media-facade.tsx).
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const BUTTON = `inline-flex h-10 items-center gap-2 rounded-full border border-foreground/15 px-4 text-sm text-foreground/85 hover:border-foreground/40 hover:text-foreground transition-colors ${FOCUS}`;
const ICON_LINK = `inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 text-foreground/80 hover:border-foreground/40 hover:text-foreground transition-colors ${FOCUS}`;

/** Aviso visible: el de éxito se borra a los 4 s; el de error queda con la URL para copiarla a mano. */
type Status = { kind: "idle" } | { kind: "copied" } | { kind: "failed" };

const subscribeNoop = () => () => {};
const canShareOnClient = () => typeof navigator !== "undefined" && typeof navigator.share === "function";
const canShareOnServer = () => false;

export function ShareBar({
  url,
  title,
  lang,
  contentType,
  itemId,
  className,
}: {
  /** Canónica absoluta de la página (la misma de `alternates.canonical`). */
  url: string;
  /** Título que se comparte (= og:title de la ficha). */
  title: string;
  lang: Lang;
  contentType: ShareContentType;
  /** Slug de la ficha; va como `item_id` en el evento `share`. */
  itemId: string;
  className?: string;
}) {
  const t = COPY[lang];
  const headingId = useId();
  const canShare = useSyncExternalStore(subscribeNoop, canShareOnClient, canShareOnServer);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // Cada aviso nuevo invalida el temporizador del anterior (sin efectos ni limpieza al desmontar).
  const seq = useRef(0);

  const announce = (next: Status) => {
    const n = ++seq.current;
    setStatus(next);
    if (next.kind === "copied") {
      setTimeout(() => {
        if (seq.current === n) setStatus({ kind: "idle" });
      }, 4000);
    }
  };

  const trackShare = (method: ShareMethod) => track("share", { method, content_type: contentType, item_id: itemId });

  const copyLink = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard");
      await navigator.clipboard.writeText(url);
      announce({ kind: "copied" });
      trackShare("copy");
    } catch {
      announce({ kind: "failed" });
    }
  };

  const shareNative = async () => {
    try {
      await navigator.share({ title, url });
      trackShare("native");
    } catch (err) {
      // Cerrar la hoja no es un error. Cualquier otro fallo cae a copiar el enlace.
      if ((err as { name?: string } | null)?.name === "AbortError") return;
      await copyLink();
    }
  };

  const links = shareLinks({ url, title });
  const copied = status.kind === "copied";

  return (
    <div role="group" aria-labelledby={headingId} className={cn("max-w-full", className)}>
      <p id={headingId} className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {t.heading[contentType]}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={copyLink} className={BUTTON}>
          {copied ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Link2 className="h-4 w-4" aria-hidden="true" />
          )}
          {t.copy}
        </button>
        {canShare && (
          <button type="button" onClick={shareNative} className={BUTTON}>
            <Share2 className="h-4 w-4" aria-hidden="true" />
            {t.more}
          </button>
        )}
      </div>

      {/* role="list": con list-style none, Safari/VoiceOver le quita la semántica de lista al <ul>. */}
      <ul role="list" className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => {
          const name = link.method === "email" ? t.email : link.label;
          const external = link.href.startsWith("https://");
          return (
            <li key={link.method}>
              <a
                href={link.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                onClick={() => trackShare(link.method)}
                className={ICON_LINK}
              >
                <ShareIcon method={link.method} name={name} />
                <span className="sr-only">
                  {name}
                  {external ? t.newTab : ""}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <p role="status" aria-live="polite" className="mt-2 min-h-5 text-sm text-foreground/85 break-words">
        {status.kind === "copied" ? t.copied : status.kind === "failed" ? t.failed(url) : ""}
      </p>
    </div>
  );
}
