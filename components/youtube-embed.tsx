"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import {
  FACADE_FOCUS,
  FacadeNotice,
  PlayGlyph,
  facadeCopy,
  trackPlayFacade,
  useFacadeLang,
  type FacadeLang,
} from "@/components/phone/media-facade";

type Thumb = "maxresdefault" | "hqdefault";

type YouTubeEmbedProps = {
  youtubeId: string;
  title: string;
  /** Opcional: si no viene, sale de useLanguage() (requiere LanguageProvider). */
  lang?: FacadeLang;
  /** `sizes` de la miniatura; por defecto la columna de 8/12 de la ficha de release (≈700 px desde 1200 px). */
  sizes?: string;
  /** Miniatura con carga inmediata y prioridad alta: solo cuando la facade es el LCP de la página (ficha de video). */
  priority?: boolean;
  /** Calidad inicial de la miniatura; "hqdefault" para las subidas sin maxresdefault (evita un 404). */
  initialThumb?: Thumb;
};

/**
 * Facade de YouTube (16:9). Hasta el clic no se carga ningún iframe ni nada
 * de Google: solo la miniatura vía /_next/image, un botón de reproducir y el
 * aviso. Al clic se monta el iframe de youtube-nocookie.com con autoplay y el
 * foco pasa al reproductor.
 */
export function YouTubeEmbed({
  youtubeId,
  title,
  lang,
  sizes = "(min-width: 1200px) 700px, (min-width: 1024px) 62vw, 100vw",
  priority = false,
  initialThumb = "maxresdefault",
}: YouTubeEmbedProps) {
  const copy = facadeCopy[useFacadeLang(lang)];
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState<Thumb>(initialThumb);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const noticeId = useId();

  useEffect(() => {
    if (playing) iframeRef.current?.focus();
  }, [playing]);

  const play = () => {
    trackPlayFacade("youtube", youtubeId);
    setPlaying(true);
  };

  return playing ? (
    <div className="relative w-full aspect-video overflow-hidden border border-foreground/10 bg-foreground/5">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={title}
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        allow="autoplay; encrypted-media; picture-in-picture"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  ) : (
    <div className="w-full">
      <button
        type="button"
        onClick={play}
        aria-label={copy.ytPlay(title)}
        aria-describedby={noticeId}
        className={`group relative block w-full aspect-video cursor-pointer overflow-hidden border border-foreground/10 bg-neutral-950 text-white ${FACADE_FOCUS}`}
      >
        <Image
          src={`https://i.ytimg.com/vi/${youtubeId}/${thumb}.jpg`}
          alt=""
          fill
          sizes={sizes}
          loading={priority ? "eager" : undefined}
          fetchPriority={priority ? "high" : undefined}
          className="object-cover"
          onError={() => {
            if (thumb === "maxresdefault") setThumb("hqdefault");
          }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30"
        />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black motion-safe:transition-transform group-hover:scale-105"
        >
          <PlayGlyph className="h-7 w-7 translate-x-0.5" />
        </span>
      </button>
      <FacadeNotice id={noticeId}>{copy.ytNotice}</FacadeNotice>
      <noscript>
        <a href={`https://www.youtube.com/watch?v=${youtubeId}`} rel="noopener noreferrer">
          {copy.ytNoscript}
        </a>
      </noscript>
    </div>
  );
}
