import Image from "next/image";
import type { CoverCard } from "@/lib/services";

// Tira de portadas de la apertura de /servicios, como una hoja de contactos.
// Móvil: fila con scroll-snap horizontal (región con foco para recorrerla con teclado).
// Tablet (≥768): mosaico de tres, la del medio un poco más abajo.
// Escritorio (≥1024): columna vertical a la derecha, pie al costado y la del medio corrida
// hacia adentro; sin rotaciones. Server component.
//
// Solo la primera portada carga con prioridad; las demás son diferidas.
const STRIP_SIZES = "(min-width: 1024px) 216px, (min-width: 768px) 30vw, 68vw";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function ServicesStrip({ covers, label }: { covers: CoverCard[]; label: string }) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={`snap-x snap-mandatory overflow-x-auto pb-2 md:overflow-visible md:pb-0 ${FOCUS}`}
    >
      <ol className="flex gap-4 md:grid md:grid-cols-3 md:gap-6 lg:flex lg:flex-col lg:items-end lg:gap-6">
        {covers.map((cover, i) => (
          <li
            key={cover.slug}
            className={`w-[68%] shrink-0 snap-start md:w-auto ${i === 1 ? "md:mt-10 lg:mr-8 lg:mt-0 xl:mr-14" : ""}`}
          >
            <figure className="flex flex-col gap-3 lg:flex-row-reverse lg:items-end lg:gap-4">
              <div className="relative aspect-square w-full shrink-0 border border-foreground/15 bg-neutral-950 lg:w-[clamp(10rem,15vw,13.5rem)]">
                <div className="absolute inset-1.5">
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes={STRIP_SIZES}
                    preload={i === 0}
                    className="object-cover"
                  />
                </div>
              </div>
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
