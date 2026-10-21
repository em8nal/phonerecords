"use client";

import type { ReactElement, ReactNode } from "react";
import { Play } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export type FacadeLang = "es" | "en";
export type FacadeProvider = "youtube" | "spotify";

/**
 * Idioma de una facade: la prop gana; si no viene, el del LanguageProvider.
 * Llama a useLanguage() siempre (regla de hooks). Fuera del provider lanza,
 * igual que cualquier otro componente client del sitio: no se captura aquí.
 */
export function useFacadeLang(lang?: FacadeLang): FacadeLang {
  const { language } = useLanguage();
  return lang ?? language;
}

/**
 * Evento de medición al pulsar reproducir. Solo dataLayer (lo recoge GTM);
 * sin GA directo. `window.dataLayer` ya está tipado por @next/third-parties.
 */
export function trackPlayFacade(provider: FacadeProvider, id: string): void {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event: "play_facade", provider, id });
}

/** Anillo de foco: --ring (#C72A09, rojo PHŌNÉ) con offset del color de fondo. */
export const FACADE_FOCUS =
  "focus-visible:outline-2 focus-visible:outline-transparent focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Aviso de carga de terceros; el botón lo referencia con aria-describedby. */
export function FacadeNotice({ id, children }: { id: string; children: ReactNode }): ReactElement {
  return (
    <p id={id} className="mt-2 font-mono text-[11px] leading-snug text-muted-foreground">
      {children}
    </p>
  );
}

/** Triángulo de reproducir, relleno y decorativo (el botón ya nombra la acción). */
export function PlayGlyph({ className }: { className?: string }): ReactElement {
  return <Play aria-hidden="true" fill="currentColor" strokeWidth={0} className={className} />;
}

export const facadeCopy = {
  es: {
    ytPlay: (title: string) => `Reproducir ${title}`,
    ytNotice: "Al reproducir se carga YouTube (youtube-nocookie.com).",
    ytNoscript: "Ver en YouTube",
    spListen: "Escuchar en Spotify",
    spNotice: "Al reproducir se carga Spotify y puede guardar cookies.",
    spTitleArtist: "Reproductor de Spotify: canciones destacadas",
    spTitleAlbum: "Reproductor de Spotify: álbum",
    spWordmark: "Spotify",
  },
  en: {
    ytPlay: (title: string) => `Play ${title}`,
    ytNotice: "Playing loads YouTube (youtube-nocookie.com).",
    ytNoscript: "Watch on YouTube",
    spListen: "Listen on Spotify",
    spNotice: "Playing loads Spotify and may store cookies.",
    spTitleArtist: "Spotify player: top tracks",
    spTitleAlbum: "Spotify player: album",
    spWordmark: "Spotify",
  },
} as const;
