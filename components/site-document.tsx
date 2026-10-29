import type { ReactNode } from "react";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { ConsentDefaultScript } from "@/components/consent/consent-default-script";
import { ConsentManager } from "@/components/consent/consent-manager";

// Esqueleto <html>/<body> de los dos root layouts (H2): app/[lang]/layout.tsx y
// app/press/[lang]/layout.tsx. El idioma llega por props desde el segmento de la URL, sin
// headers() ni cookies(), así que las páginas pueden prerenderizarse y servirse desde la
// caché (ISR). Server component. Las tres fuentes base se precargan en todo el sitio;
// Fraunces no está aquí: vive en lib/fraunces.ts y solo la cargan la portada y los press kits.

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

// "Saltar al contenido" (WCAG 2.4.1): primer elemento enfocable del <body>, oculto hasta
// recibir foco. Lleva al <main id="contenido" tabIndex={-1}> de cada página (y de la 404).
// z-[70]: por encima del banner de cookies (z-[60]) y del menú fijo (z-50).
const SKIP_LABEL = { es: "Saltar al contenido", en: "Skip to content" } as const;
const SKIP_CLASS =
  "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-full focus:bg-foreground focus:px-5 focus:text-sm focus:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background print:hidden";

export function SiteDocument({
  lang,
  className,
  children,
}: {
  lang: "es" | "en";
  /** Clases extra del <body> (p. ej. la variable de una fuente que solo usa esa sección). */
  className?: string;
  children: ReactNode;
}) {
  const bodyClass = [
    instrumentSans.variable,
    instrumentSerif.variable,
    jetbrainsMono.variable,
    "font-sans antialiased bg-background",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html lang={lang}>
      {/* La regla apunta al router de pages/ y solo exime archivos bajo app/: este esqueleto lo
          usan únicamente los root layouts de app/, como el <head> que antes vivía en app/layout.tsx. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/* Consent Mode v2 defaults: must be the first script, before GTM/GA4. */}
        <ConsentDefaultScript />
      </head>
      <GoogleTagManager gtmId="GTM-NXRBTN9P" />
      <body className={bodyClass}>
        <a href="#contenido" className={SKIP_CLASS}>
          {SKIP_LABEL[lang]}
        </a>
        {children}
        {/* Vercel Analytics / Speed Insights are cookieless: no consent needed. */}
        <Analytics />
        <SpeedInsights />
        {/* GTM + GA4 stay (team decision) but are governed by Consent Mode above. */}
        <GoogleAnalytics gaId="G-EG3K77X96Y" />
        {/* Banner (only while undecided) + Ahrefs Analytics (only after "granted"). */}
        <ConsentManager lang={lang} />
      </body>
    </html>
  );
}
