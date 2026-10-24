"use client";

import Image from "next/image";
import { useState } from "react";

type Thumb = "maxresdefault" | "hqdefault";

type Props = {
  youtubeId: string;
  /** Alt descriptivo ("título — artista") o "" si el texto vecino ya nombra el video. */
  alt: string;
  sizes: string;
  /** Calidad inicial; "hqdefault" cuando la entrada sabe que no existe maxres (Video.thumb). */
  initial?: Thumb;
};

/**
 * Miniatura de YouTube para tarjetas (16:9), sin iframe ni nada de Google.
 * Misma técnica que la facade (components/youtube-embed.tsx): maxresdefault
 * vía next/image y caída a hqdefault cuando YouTube no la tiene (404).
 * hqdefault es 4:3 con bandas negras: object-cover las recorta, así que el
 * padre debe ser `relative aspect-video overflow-hidden bg-neutral-950`.
 * La URL se arma aquí (y no con youtubeThumb de lib/videos) para que el
 * catálogo completo de videos no entre al bundle del cliente.
 */
export function VideoThumb({ youtubeId, alt, sizes, initial = "maxresdefault" }: Props) {
  const [thumb, setThumb] = useState<Thumb>(initial);
  return (
    <Image
      src={`https://i.ytimg.com/vi/${youtubeId}/${thumb}.jpg`}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
      onError={() => {
        if (thumb === "maxresdefault") setThumb("hqdefault");
      }}
    />
  );
}
