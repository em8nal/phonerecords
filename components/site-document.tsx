import type { ReactNode } from "react";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { ConsentDefaultScript } from "@/components/consent/consent-default-script";
import { ConsentManager } from "@/components/consent/consent-manager";

// Esqueleto <html>/<body> de los dos root layouts (H2): app/[lang]/layout.tsx y
// app/press/[lang]/layout.tsx. El idioma llega por props desde el segmento de la URL, sin
// headers() ni cookies(), así que las páginas pueden prerenderizarse y servirse desde la
// caché (ISR). Server component.

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

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
});

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
    fraunces.variable,
    "font-sans antialiased bg-background",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html lang={lang}>
      <head>
        {/* Consent Mode v2 defaults: must be the first script, before GTM/GA4. */}
        <ConsentDefaultScript />
      </head>
      <GoogleTagManager gtmId="GTM-NXRBTN9P" />
      <body className={bodyClass}>
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
