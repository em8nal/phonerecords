// Preguntas frecuentes visibles (pendiente 17h): un <details> por pregunta, sin JS ni estado.
// El <summary> abre y cierra con Enter y Espacio y muestra el foco en el rojo de marca. Los
// textos salen de lib/faq.ts, los mismos del JSON-LD FAQPage. Componente de servidor.
import { Fragment } from "react";
import Link from "next/link";
import type { FaqItem } from "@/lib/faq";
import type { Language } from "@/lib/translations";

type Props = { items: FaqItem[]; lang: Language; className?: string };

export function FaqList({ items, lang, className = "" }: Props) {
  return (
    <div className={`border-t border-foreground/10 ${className}`}>
      {items.map((item) => (
        <details key={item.id} id={`faq-${item.id}`} className="group border-b border-foreground/10">
          <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-6 py-5 font-display text-lg lg:text-xl tracking-tight [&::-webkit-details-marker]:hidden rounded-sm focus-visible:outline-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <span>{item.q}</span>
            <span
              aria-hidden="true"
              className="font-mono text-xl leading-7 text-muted-foreground transition-transform motion-reduce:transition-none group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="pb-6 max-w-3xl text-base leading-relaxed text-foreground/80">
            {item.a.map((seg, i) => (
              <Fragment key={i}>
                {typeof seg === "string" ? (
                  seg
                ) : (
                  <Link
                    href={`/${lang}${seg.href}`}
                    className="underline decoration-foreground/50 underline-offset-4 hover:decoration-foreground transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    {seg.text}
                  </Link>
                )}
              </Fragment>
            ))}
          </p>
        </details>
      ))}
    </div>
  );
}
