import Link from "next/link";
import type { Language } from "@/lib/translations";
import type { VideoCardData } from "@/lib/videos";
import { VideoThumb } from "@/components/phone/video-thumb";

// La forma reducida (`VideoCardData`) y `toVideoCardData` viven en lib/videos.ts: este
// archivo entra al bundle del navegador por la grilla cliente de /videos y solo importa tipos.
export type { VideoCardData };

// Foco sobre fondo claro: anillo interior en el rojo PHŌNÉ (único acento), como ReleaseCardGrid.
const FOCUS_LIGHT =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand";

const CARD_CLASS = `group block bg-background hover:bg-foreground/[0.02] transition-colors ${FOCUS_LIGHT}`;

type Props = {
  video: VideoCardData;
  lang: Language;
  /** Etiqueta del tipo ya traducida (VIDEO_KIND_LABEL[lang][video.kind]); la calcula el padre. */
  kindLabel: string;
  /** h2 en /videos (las tarjetas son el contenido principal), h3 en grillas de cierre. */
  heading?: "h2" | "h3";
};

/**
 * Tarjeta de video: miniatura 16:9, título, artista, año · tipo. Sin hooks:
 * sirve en server components y dentro de la grilla cliente de /videos.
 * Enlaza a la ficha /videos/[slug]; la miniatura se carga diferida.
 */
export function VideoCard({ video, lang, kindLabel, heading = "h3" }: Props) {
  const Heading = heading;
  return (
    <Link href={`/${lang}/videos/${video.slug}`} className={CARD_CLASS}>
      <div className="relative aspect-video overflow-hidden bg-neutral-950">
        <VideoThumb
          youtubeId={video.youtubeId}
          alt=""
          sizes="(min-width: 1400px) 330px, (min-width: 1024px) 25vw, 50vw"
          initial={video.thumb}
        />
      </div>
      <div className="p-4 lg:p-6">
        <Heading className="font-display text-lg lg:text-xl tracking-tight">{video.title}</Heading>
        <p className="mt-1 text-xs text-muted-foreground">{video.artistName}</p>
        {/* Año de grabación si consta y difiere del de publicación (Live in Paris, 2015). */}
        <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {video.recordedYear ?? video.date.slice(0, 4)} · {kindLabel}
        </p>
      </div>
    </Link>
  );
}
