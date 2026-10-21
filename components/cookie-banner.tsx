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
      "Usamos analítica (Google Analytics vía Tag Manager, Ahrefs y Vercel) para entender cómo se usa el sitio. Si rechazas, no se guardan cookies ni identificadores de analítica; Google puede recibir datos técnicos como la página visitada, sin cookies ni identificadores persistentes. La medición de Vercel no usa cookies y funciona siempre.",
    more: "Política de privacidad",
    accept: "Aceptar",
    reject: "Rechazar",
  },
  en: {
    label: "Cookie consent",
    text:
      "We use analytics (Google Analytics via Tag Manager, Ahrefs and Vercel) to understand how the site is used. If you reject, no analytics cookies or identifiers are stored; Google may receive technical data such as the page visited, without cookies or persistent identifiers. Vercel measurement uses no cookies and always runs.",
    more: "Privacy policy",
    accept: "Accept",
    reject: "Reject",
  },
} as const;

/**
 * Presentational consent banner. Rendered by ConsentManager only while the
 * visitor has no phone_consent decision. Accept and Reject carry the same
 * size/weight on purpose (refusing must be as easy as accepting).
 */
export function CookieBanner({ lang, onAccept, onReject }: Props) {
  const c = COPY[lang];

  return (
    <div
      role="region"
      aria-label={c.label}
      className="fixed bottom-4 left-4 right-4 z-[60] md:left-auto md:right-4 md:max-w-md print:hidden"
    >
      <div className="bg-background/95 backdrop-blur-xl border border-foreground/15 rounded-2xl shadow-lg p-5 lg:p-6">
        <p className="text-sm text-foreground/85 leading-relaxed">
          {c.text}{" "}
          <Link
            href={`/${lang}/privacidad`}
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            {c.more}
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onAccept}
            className="inline-flex items-center px-5 h-9 text-sm rounded-full border border-foreground bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            {c.accept}
          </button>
          <button
            type="button"
            onClick={onReject}
            className="inline-flex items-center px-5 h-9 text-sm rounded-full border border-foreground/40 text-foreground hover:bg-foreground/10 transition-colors"
          >
            {c.reject}
          </button>
        </div>
      </div>
    </div>
  );
}
