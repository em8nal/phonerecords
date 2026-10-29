import Link from "next/link";
import type { Language } from "@/lib/translations";

const copy = {
  es: {
    title: "Todavía no hay piezas publicadas",
    body: "Mientras tanto, el catálogo y los videos reúnen lo que el sello ha publicado, y el newsletter avisa por correo cuando hay novedades.",
    newsletter: "Suscribirse al newsletter",
    catalogue: "Ver el catálogo",
    videos: "Ver los videos",
  },
  en: {
    title: "No stories published yet",
    body: "In the meantime, the catalogue and the videos gather what the label has released, and the newsletter lets you know by email when there is something new.",
    newsletter: "Subscribe to the newsletter",
    catalogue: "Browse the catalogue",
    videos: "Watch the videos",
  },
} as const;

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

/**
 * Estado vacío del índice /journal (sin piezas publicadas; la página lleva noindex). Texto neutro
 * que no promete fechas, y salidas al newsletter, al catálogo y a los videos. Sin formulario:
 * `source` de NewsletterForm no admite "journal". Server component.
 */
export function JournalEmpty({ lang }: { lang: Language }) {
  const t = copy[lang];
  return (
    <section aria-labelledby="journal-empty-heading" className="border border-foreground/10 bg-background p-8 lg:p-12">
      <h2 id="journal-empty-heading" className="text-3xl lg:text-4xl font-display tracking-tight">
        {t.title}
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-foreground/80 leading-relaxed">{t.body}</p>
      <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-4">
        <Link
          href={`/${lang}/contacto#newsletter-heading`}
          className={`inline-flex items-center justify-center px-8 h-14 text-base rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors ${FOCUS}`}
        >
          {t.newsletter}
        </Link>
        <Link
          href={`/${lang}/catalogo`}
          className={`inline-flex items-center justify-center px-8 h-14 text-base rounded-full border border-foreground/20 hover:bg-foreground/5 transition-colors ${FOCUS}`}
        >
          {t.catalogue}
        </Link>
        <Link
          href={`/${lang}/videos`}
          className={`inline-flex items-center justify-center px-8 h-14 text-base rounded-full border border-foreground/20 hover:bg-foreground/5 transition-colors ${FOCUS}`}
        >
          {t.videos}
        </Link>
      </div>
    </section>
  );
}
