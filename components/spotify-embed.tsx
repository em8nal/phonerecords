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

type SpotifyKind = "artist" | "album";

type SpotifyFacadeExtras = {
  /**
   * Portada de la tarjeta previa al clic. Ruta local (`/releases/*.jpg`,
   * `/artists/*.jpg`) o un host de `images.remotePatterns`; otro host hace
   * lanzar a next/image. Sin portada se muestra un bloque neutro "Spotify".
   */
  cover?: string;
  coverAlt?: string;
  /** Nombre del artista o del disco: se ve en la tarjeta y en el title del iframe. */
  title?: string;
  /** Opcional: si no viene, sale de useLanguage() (requiere LanguageProvider). */
  lang?: FacadeLang;
};

type SpotifyFacadeProps = SpotifyFacadeExtras & {
  kind: SpotifyKind;
  id: string;
  height: number;
};

/**
 * Facade de Spotify. Hasta el clic no se carga nada de open.spotify.com:
 * tarjeta con portada (o bloque neutro), botón "Escuchar en Spotify" y aviso.
 * Al clic se monta el iframe de siempre y el foco pasa al reproductor.
 * La tarjeta reserva `minHeight: height`, así el iframe no provoca salto.
 */
function SpotifyFacade({ kind, id, height, cover, coverAlt, title, lang }: SpotifyFacadeProps) {
  const copy = facadeCopy[useFacadeLang(lang)];
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const noticeId = useId();

  useEffect(() => {
    if (playing) iframeRef.current?.focus();
  }, [playing]);

  const src = `https://open.spotify.com/embed/${kind}/${id}?utm_source=phonerecords&theme=0`;
  const baseTitle = kind === "album" ? copy.spTitleAlbum : copy.spTitleArtist;
  const iframeTitle = title ? `${baseTitle} — ${title}` : baseTitle;

  const play = () => {
    trackPlayFacade("spotify", id);
    setPlaying(true);
  };

  return playing ? (
    <div className="spotify-embed">
      <iframe
        ref={iframeRef}
        src={src}
        width="100%"
        height={height}
        loading="lazy"
        title={iframeTitle}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        style={{ border: 0, borderRadius: 12, display: "block" }}
      />
    </div>
  ) : (
    <div
      className="spotify-embed flex flex-col border border-foreground/10 bg-foreground/5 sm:flex-row sm:items-stretch"
      style={{ minHeight: height }}
    >
      <div className="relative m-6 mb-0 h-32 w-32 shrink-0 overflow-hidden sm:my-0 sm:mr-0 sm:self-center">
        {cover ? (
          <Image src={cover} alt={coverAlt ?? ""} fill sizes="128px" className="object-cover" />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-32 w-32 items-center justify-center bg-neutral-950 font-display text-2xl tracking-tight text-white"
          >
            {copy.spWordmark}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col items-start justify-center gap-3 p-6 lg:p-8">
        {title && (
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{title}</p>
        )}
        <button
          type="button"
          onClick={play}
          aria-describedby={noticeId}
          className={`inline-flex min-h-12 max-w-full cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 py-2 text-left font-mono text-sm font-bold uppercase tracking-widest whitespace-normal text-background transition-colors hover:bg-foreground/90 sm:px-6 ${FACADE_FOCUS}`}
        >
          <PlayGlyph className="h-4 w-4" />
          {copy.spListen}
        </button>
        <FacadeNotice id={noticeId}>{copy.spNotice}</FacadeNotice>
      </div>
    </div>
  );
}

type SpotifyArtistEmbedProps = SpotifyFacadeExtras & {
  artistId: string;
  height?: number;
};

/** Spotify — canciones destacadas de un artista. Mismas props de antes + portada/título opcionales. */
export function SpotifyArtistEmbed({ artistId, height = 352, ...rest }: SpotifyArtistEmbedProps) {
  return <SpotifyFacade kind="artist" id={artistId} height={height} {...rest} />;
}

type SpotifyAlbumEmbedProps = SpotifyFacadeExtras & {
  albumId: string;
  height?: number;
};

/** Spotify — álbum. Mismas props de antes + portada/título opcionales. */
export function SpotifyAlbumEmbed({ albumId, height = 352, ...rest }: SpotifyAlbumEmbedProps) {
  return <SpotifyFacade kind="album" id={albumId} height={height} {...rest} />;
}
