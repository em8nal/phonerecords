import Link from "next/link";

type Props = {
  lang: "es" | "en";
  onAccept: () => void;
  onReject: () => void;
};

// Texts live here (ES/EN by `lang`), not in lib/translations.ts.
const COPY = {
  es: {
    label: "Consentimiento de cookies",
    text:
      "Usamos analítica (Google, Ahrefs y Vercel) para saber qué se escucha y se lee aquí. Si rechazas, no se guardan cookies de medición.",
    more: "Privacidad",
    accept: "Aceptar",
    reject: "Rechazar",
  },
  en: {
    label: "Cookie consent",
    text:
      "We use analytics (Google, Ahrefs and Vercel) to learn what gets played and read here. If you decline, no measurement cookies are stored.",
    more: "Privacy",
    accept: "Accept",
    reject: "Reject",
  },
} as const;

/**
 * Presentational consent banner. Rendered by ConsentManager only while the
 * visitor has no phone_consent decision (se monta en el cliente, después de leer
 * la cookie: no viaja en el HTML; es fijo, así que no mueve el contenido). Accept and Reject carry the same
 * size/weight on purpose (refusing must be as easy as accepting).
 */
export function CookieBanner({ lang, onAccept, onReject }: Props) {
  const c = COPY[lang];

  return (
    <div
      role="region"
      aria-label={c.label}
      className="fixed bottom-2 left-2 right-2 z-[60] md:bottom-4 md:left-auto md:right-4 md:max-w-sm print:hidden"
    >
      {/* Compacto a propósito (≈20 palabras): en móvil no debe tapar el CTA del hero. */}
      <div className="bg-background/95 backdrop-blur-xl border border-foreground/15 rounded-xl shadow-lg px-4 py-3 md:p-4">
        <p className="text-xs md:text-sm text-foreground/85 leading-snug">
          {c.text}{" "}
          <Link
            href={`/${lang}/privacidad`}
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            {c.more}
          </Link>
          .
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onAccept}
            className="inline-flex items-center px-4 h-8 text-xs md:text-sm rounded-full border border-foreground bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            {c.accept}
          </button>
          <button
            type="button"
            onClick={onReject}
            className="inline-flex items-center px-4 h-8 text-xs md:text-sm rounded-full border border-foreground/40 text-foreground hover:bg-foreground/10 transition-colors"
          >
            {c.reject}
          </button>
        </div>
      </div>
    </div>
  );
}
