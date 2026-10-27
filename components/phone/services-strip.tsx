import Image from "next/image";
import Link from "next/link";
import type { CoverCard } from "@/lib/services";
import type { Language } from "@/lib/translations";

// Tira de portadas de la apertura de /servicios, como una hoja de contactos.
// Móvil: fila con scroll-snap horizontal que sangra hasta el borde de la pantalla (-mx-6 px-6,
// con scroll-px-6 para que el snap respete el margen).
// Tablet (≥768): mosaico de tres, la del medio un poco más abajo.
// Escritorio (≥1024): columna vertical a la derecha, pie al costado y la del medio corrida
// hacia adentro; sin rotaciones. Server component.
//
// Cada portada enlaza a la ficha de su lanzamiento. Así la fila de móvil se recorre con el
// teclado (el foco en cada enlace la desplaza) sin tabIndex ni role="region" en el contenedor,
// que desde 768 px, donde ya no hay scroll, serían una parada de tabulación y un landmark vacíos.
// El pt-1 deja sitio al anillo de foco, que el overflow del scroll recortaría arriba.
//
// Solo la primera portada carga con prioridad; las demás son diferidas. `sizes` según el ancho
// real de la imagen: 68 % de la fila menos el marco a 390 (≈ 56vw), un tercio del mosaico en
// tablet y el marco de 13,5rem como máximo en escritorio.
const STRIP_SIZES = "(min-width: 1024px) 216px, (min-width: 768px) 28vw, 58vw";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

type Props = { covers: CoverCard[]; label: string; lang: Language };

export function ServicesStrip({ covers, label, lang }: Props) {
  return (
    <div className="-mx-6 snap-x snap-mandatory scroll-px-6 overflow-x-auto px-6 pb-2 pt-1 md:mx-0 md:overflow-visible md:px-0 md:pb-0 md:pt-0">
      {/* role="list": con list-style none, Safari y VoiceOver le quitan la semántica de lista */}
      <ol
        role="list"
        aria-label={label}
        className="flex gap-4 md:grid md:grid-cols-3 md:gap-6 lg:flex lg:flex-col lg:items-end lg:gap-6"
      >
        {covers.map((cover, i) => (
          <li
            key={cover.slug}
            className={`w-[68%] shrink-0 snap-start md:w-auto ${i === 1 ? "md:mt-10 lg:mr-8 lg:mt-0 xl:mr-14" : ""}`}
          >
            <figure className="flex flex-col gap-3 lg:flex-row-reverse lg:items-end lg:gap-4">
              <Link
                href={`/${lang}/releases/${cover.slug}`}
                className={`relative block aspect-square w-full shrink-0 border border-foreground/15 bg-neutral-950 transition-colors hover:border-foreground/40 lg:w-[clamp(10rem,15vw,13.5rem)] ${FOCUS}`}
              >
                <span className="absolute inset-1.5">
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes={STRIP_SIZES}
                    preload={i === 0}
                    className="object-cover"
                  />
                </span>
              </Link>
              <figcaption className="font-mono text-xs uppercase leading-relaxed tracking-widest text-muted-foreground lg:w-32 lg:text-right xl:w-40">
                <span className="block text-foreground/80">
                  <span aria-hidden="true">{String(i + 1).padStart(2, "0")} — </span>
                  {cover.title}
                </span>
                <span className="block">{cover.artist}</span>
                {cover.credit && (
                  <span className="mt-1 block normal-case tracking-normal">{cover.credit}</span>
                )}
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </div>
  );
}
