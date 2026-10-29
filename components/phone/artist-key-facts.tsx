// "Datos clave" de la ficha de artista (pendiente 17h, AEO): ficha técnica en <dl>, solo
// con filetes (sin fondos, sin bordes redondeados, sin color). Componente de servidor: las
// filas salen de lib/artist-facts.ts al generar la página (ISR, revalidate = 300).
import Link from "next/link";
import { artistKeyFacts, type KeyFact } from "@/lib/artist-facts";
import type { Language } from "@/lib/translations";

/** Filas que piden dos columnas: textos largos o listas. */
const WIDE: ReadonlySet<KeyFact["id"]> = new Set(["role", "genres", "releases"]);

// Clases literales para que Tailwind las encuentre al escanear el archivo.
const SPAN: Record<number, string> = { 1: "col-span-1", 2: "col-span-2" };
const LG_SPAN: Record<number, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
};

/**
 * Columnas de cada fila en una grilla de `cols`, en el orden del DOM y sin huecos: cuando
 * la siguiente fila no cabe, la última de la línea se estira hasta el borde (y la última de
 * todas, también). Así los filetes quedan continuos y el orden visual es el de lectura.
 */
function packSpans(widths: number[], cols: number): number[] {
  const spans = widths.map((w) => Math.min(w, cols));
  let used = 0;
  for (let i = 0; i < spans.length; i++) {
    if (used + spans[i] > cols) {
      spans[i - 1] += cols - used;
      used = 0;
    }
    used = (used + spans[i]) % cols;
  }
  if (used > 0) spans[spans.length - 1] += cols - used;
  return spans;
}

const LINK =
  "underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

type Props = { slug: string; lang: Language; className?: string };

export function ArtistKeyFacts({ slug, lang, className }: Props) {
  const facts = artistKeyFacts(slug, lang);
  if (!facts.length) return null;
  const widths = facts.map((f) => (WIDE.has(f.id) ? 2 : 1));
  const spans = packSpans(widths, 2);
  const lgSpans = packSpans(widths, 4);

  return (
    <section aria-labelledby="datos-clave" className={className}>
      <h2 id="datos-clave" className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
        {lang === "es" ? "Datos clave" : "Key facts"}
      </h2>
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-10 border-t border-foreground/15">
        {facts.map((f, i) => (
          <div key={f.id} className={`min-w-0 py-4 border-b border-foreground/10 ${SPAN[spans[i]]} ${LG_SPAN[lgSpans[i]]}`}>
            <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5">
              {f.label}
            </dt>
            <dd className="text-base text-foreground leading-snug">
              {f.items ? (
                <ul className="space-y-1">
                  {f.items.map((item) => (
                    <li key={item.href} className="flex items-baseline gap-3">
                      <Link href={item.href} className={LINK}>
                        {item.text}
                      </Link>
                      <span className="font-mono text-xs text-muted-foreground">{item.year}</span>
                    </li>
                  ))}
                </ul>
              ) : f.href ? (
                <Link href={f.href} className={LINK}>
                  {f.value}
                </Link>
              ) : (
                f.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
