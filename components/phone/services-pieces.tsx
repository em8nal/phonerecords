import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PIECE_IMAGE, getCover, type ServicesCopy } from "@/lib/services";
import type { Language } from "@/lib/translations";

// "Piezas que se combinan": una fila por pieza, imagen grande y texto en zigzag.
// Móvil: apiladas (imagen y luego texto). Tablet (≥768): 6 + 6 columnas. Escritorio (≥1024):
// 7 + 5. En la 2.ª y la 4.ª fila la imagen pasa a la derecha. Server component.
//
// Fotos B/N recortadas a 3:2; la portada va completa y cuadrada sobre negro (el color vive
// solo en el arte de lanzamiento). El pie y el crédito de la portada salen de lib/releases.ts.
const PHOTO_SIZES = "(min-width: 1400px) 740px, (min-width: 1024px) 55vw, (min-width: 768px) 48vw, 100vw";
const COVER_SIZES = "(min-width: 1400px) 420px, (min-width: 1024px) 30vw, (min-width: 768px) 26vw, 67vw";

const FOCUS =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

type Props = {
  pieces: ServicesCopy["pieces"];
  lang: Language;
  /** Formulario con el motivo "servicios" preseleccionado, ya con el idioma. */
  contactHref: string;
};

export function ServicesPieces({ pieces, lang, contactHref }: Props) {
  return (
    <div className="space-y-20 lg:space-y-28">
      {pieces.items.map((piece, i) => {
        const image = PIECE_IMAGE[piece.id];
        const cover = image.releaseSlug ? getCover(image.releaseSlug, lang) : null;
        const caption = cover
          ? [`${cover.title} · ${cover.artist}`, cover.credit].filter(Boolean).join(" · ")
          : piece.caption;
        const headingId = `pieza-${piece.id}`;
        return (
          <article
            key={piece.id}
            aria-labelledby={headingId}
            className="grid items-center gap-8 md:grid-cols-12 md:gap-10 lg:gap-16"
          >
            <figure className={`md:col-span-6 lg:col-span-7 ${i % 2 === 1 ? "md:order-2" : ""}`}>
              {image.kind === "photo" ? (
                <div className="relative aspect-[3/2] overflow-hidden bg-neutral-950">
                  <Image
                    src={image.src}
                    alt={image.alt[lang]}
                    fill
                    sizes={PHOTO_SIZES}
                    className={`object-cover ${image.position ?? ""}`}
                  />
                </div>
              ) : (
                <div className="flex aspect-[3/2] items-center justify-center bg-neutral-950">
                  {/* Cuadrado = alto del marco menos el margen (2/3 del ancho − 2 × margen) */}
                  <div className="relative aspect-square w-[calc(200%/3_-_3rem)] lg:w-[calc(200%/3_-_5rem)]">
                    <Image src={image.src} alt={image.alt[lang]} fill sizes={COVER_SIZES} className="object-cover" />
                  </div>
                </div>
              )}
              {caption && (
                <figcaption className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {caption}
                </figcaption>
              )}
            </figure>

            <div className="md:col-span-6 lg:col-span-5">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")} · </span>
                {piece.kicker}
              </p>
              <h3 id={headingId} className="mt-4 font-display text-3xl leading-tight tracking-tight lg:text-4xl">
                {piece.title}
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-foreground/80">{piece.summary}</p>

              <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {pieces.includes}
              </p>
              <ul className="mt-3 space-y-2 text-base leading-relaxed text-foreground/85">
                {piece.includes.map((item) => (
                  <li key={item.name ?? item.text} className="flex gap-3">
                    <span aria-hidden="true" className="text-muted-foreground">
                      —
                    </span>
                    <span>
                      {item.name && <strong className="font-medium text-foreground">{item.name}: </strong>}
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>

              {piece.note && (
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{piece.note}</p>
              )}

              <Link
                href={contactHref}
                className={`mt-8 inline-flex min-h-6 items-center gap-2 text-sm underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground ${FOCUS}`}
              >
                {pieces.inquire}
                <span className="sr-only">: {piece.title}</span>
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
