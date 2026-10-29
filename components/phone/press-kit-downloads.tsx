// Botones "Press kit ES" y "Press kit EN" (pendiente 11c): los dos PDF desde cualquier idioma,
// con hreflang, nombre de archivo explícito y el tamaño aproximado (mapa de lib/press-kits.ts).
// El del idioma de la página va con relleno y el otro con contorno. Componente de servidor.
import { Download } from "lucide-react";
import { TrackedLink } from "@/components/tracked-link";
import {
  PRESS_KIT_LANGS,
  formatPdfSize,
  pressKitBytes,
  pressKitDownloadName,
  pressKitHref,
} from "@/lib/press-kits";
import type { Language } from "@/lib/translations";

/** Nombre del idioma del PDF, dicho en el idioma de la página (solo para lectores de pantalla). */
const LANG_NAME: Record<Language, Record<Language, string>> = {
  es: { es: "español", en: "inglés" },
  en: { es: "Spanish", en: "English" },
};

type Props = {
  /** Slug del artista, o null para el press kit del sello. */
  slug: string | null;
  uiLang: Language;
  /** "row": en línea (barra de /press-kit); "stack": uno bajo otro (aside de la ficha). */
  layout?: "row" | "stack";
  className?: string;
};

export function PressKitDownloads({ slug, uiLang, layout = "row", className = "" }: Props) {
  const flow = layout === "row" ? "flex flex-wrap gap-3" : "flex flex-col items-start gap-3";
  return (
    <ul className={`${flow} ${className}`}>
      {PRESS_KIT_LANGS.map((l) => {
        const bytes = pressKitBytes(slug, l);
        const current = l === uiLang;
        return (
          <li key={l}>
            <TrackedLink
              event="pdf_download"
              params={{ artist: slug ?? "phone-records", lang: l }}
              href={pressKitHref(slug, l)}
              hrefLang={l}
              type="application/pdf"
              download={pressKitDownloadName(slug, l)}
              className={`inline-flex h-11 items-center gap-2.5 px-5 text-sm rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                current
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "border border-foreground/20 text-foreground hover:bg-foreground/5"
              }`}
            >
              <Download className="w-4 h-4 shrink-0" aria-hidden />
              <span>
                Press kit {l.toUpperCase()}
                <span className="sr-only"> — {LANG_NAME[uiLang][l]}, </span>
              </span>{" "}
              <span className={`font-mono text-xs ${current ? "text-background/70" : "text-muted-foreground"}`}>
                {bytes != null ? formatPdfSize(bytes, uiLang) : "PDF"}
              </span>
            </TrackedLink>
          </li>
        );
      })}
    </ul>
  );
}
