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

export type SpotifyKind = "artist" | "album" | "track" | "playlist";

/**
 * Altos del reproductor de Spotify: 352 (normal) y 152 (compacto, para
 * singles). La tarjeta previa reserva exactamente ese alto: sin salto al clic.
 */
export type SpotifyHeight = 152 | 352;

/** Títulos del iframe para canción y lista (facadeCopy trae solo artista y álbum). */
const IFRAME_TITLES: Record<FacadeLang, { track: string; playlist: string }> = {
  es: { track: "Reproductor de Spotify: canción", playlist: "Reproductor de Spotify: lista" },
  en: { track: "Spotify player: track", playlist: "Spotify player: playlist" },
};

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
 *
 * Con height 152 usa la variante compacta en fila (portada de 120 px desde
 * `sm`, oculta en móvil): con la fuente por defecto y desde ~300 px de ancho
 * su alto natural es ≤ 146 px (16 + 16 + 8 + 44 + 8 + 8 + 2×15 + 16), dentro
 * de los 150 px que deja el borde, así que la tarjeta mide 152 px como el
 * iframe. Más angosta (el aviso pasa a 3 líneas) o con texto agrandado crece
 * (minHeight, no height) en vez de recortar, y al clic baja a los 152 px del
 * iframe: ese salto sigue a una interacción y no cuenta para CLS.
 *
 * Sin `coverAlt` la portada queda decorativa (alt vacío), que es lo correcto
 * cuando la página ya describe esa misma imagen.
 */
function SpotifyFacade({ kind, id, height, cover, coverAlt, title, lang }: SpotifyFacadeProps) {
  const facadeLang = useFacadeLang(lang);
  const copy = facadeCopy[facadeLang];
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const noticeId = useId();

  useEffect(() => {
    if (playing) iframeRef.current?.focus();
  }, [playing]);

  const src = `https://open.spotify.com/embed/${kind}/${id}?utm_source=phonerecords&theme=0`;
  const baseTitle =
    kind === "album"
      ? copy.spTitleAlbum
      : kind === "artist"
        ? copy.spTitleArtist
        : IFRAME_TITLES[facadeLang][kind];
  const iframeTitle = title ? `${baseTitle} — ${title}` : baseTitle;
  const compact = height === 152;

  const play = () => {
    trackPlayFacade("spotify", id);
    setPlaying(true);
  };

  if (playing) {
    return (
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
    );
  }

  if (compact) {
    return (
      <div
        className="spotify-embed flex items-stretch border border-foreground/10 bg-foreground/5"
        style={{ minHeight: height }}
      >
        {/* Sin márgenes verticales: 120 px centrados caben en los 150 px interiores. */}
        <div className="relative ml-4 hidden h-[120px] w-[120px] shrink-0 self-center overflow-hidden sm:block">
          {cover ? (
            <Image src={cover} alt={coverAlt ?? ""} fill sizes="120px" className="object-cover" />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center bg-neutral-950 font-display text-xl tracking-tight text-white"
            >
              {copy.spWordmark}
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-2 p-4">
          {title && (
            <p className="max-w-full truncate font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {title}
            </p>
          )}
          <button
            type="button"
            onClick={play}
            aria-describedby={noticeId}
            className={`inline-flex min-h-11 max-w-full cursor-pointer items-center gap-2 rounded-full bg-foreground px-4 py-2 text-left font-mono text-xs font-bold uppercase tracking-widest whitespace-normal text-background transition-colors hover:bg-foreground/90 ${FACADE_FOCUS}`}
          >
            <PlayGlyph className="h-4 w-4" />
            {copy.spListen}
          </button>
          <FacadeNotice id={noticeId}>{copy.spNotice}</FacadeNotice>
        </div>
      </div>
    );
  }

  return (
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

type SpotifyEmbedProps = SpotifyFacadeExtras & {
  kind: SpotifyKind;
  id: string;
  /** 352 por defecto; 152 para la variante compacta (singles). */
  height?: SpotifyHeight;
};

/** Spotify — cualquier tipo (artista, álbum, canción o lista), con alto normal o compacto. */
export function SpotifyEmbed({ kind, id, height = 352, ...rest }: SpotifyEmbedProps) {
  return <SpotifyFacade kind={kind} id={id} height={height} {...rest} />;
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
