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
      "Usamos analítica para entender cómo se usa el sitio: Google Analytics (vía Google Tag Manager) y Ahrefs solo si aceptas; Vercel mide rendimiento de forma anónima y sin cookies.",
    more: "Política de privacidad",
    accept: "Aceptar",
    reject: "Rechazar",
  },
  en: {
    label: "Cookie consent",
    text:
      "We use analytics to understand how the site is used: Google Analytics (via Google Tag Manager) and Ahrefs only if you accept; Vercel measures performance anonymously and without cookies.",
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
