import React from "react"
import type { Metadata, Viewport } from 'next'
import { cookies, headers } from 'next/headers'
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono, Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'
import { ConsentDefaultScript } from '@/components/consent/consent-default-script'
import { ConsentManager } from '@/components/consent/consent-manager'
import { CONSENT_COOKIE, parseConsent } from '@/components/consent/consent-cookie'
import { TITLE_TEMPLATE } from '@/lib/seo'
import './globals.css'

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: '--font-instrument'
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: '--font-instrument-serif'
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-jetbrains'
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600"],
  variable: '--font-fraunces',
});

export const viewport: Viewport = {
  themeColor: '#000000',
};

// Valores por defecto neutros: sin canonical, og:url ni og:locale para todo el sitio
// (cada página bajo /[lang] trae los suyos con pageMetadata de lib/seo.ts). Lo que no
// los defina (press kits, 404) hereda solo marca, tipo e imagen, y Next completa
// og:title y og:description con el título y la descripción de esa página.
export const metadata: Metadata = {
  metadataBase: new URL('https://phonerecords.cl'),
  title: {
    default: 'PHŌNÉ Records',
    template: TITLE_TEMPLATE,
  },
  description:
    'Sello cultural independiente, Santiago de Chile. Roster: Newen Afrobeat, Klaus B, ecamhi, Con.fusión y Rosario Lircay.',
  authors: [{ name: 'PHŌNÉ Records', url: 'https://phonerecords.cl' }],
  verification: {
    google: 'mUTRTpRC44cVJL--psi4RCHRscBV4OGOV_UfIPHwRXU',
  },
  openGraph: {
    type: 'website',
    siteName: 'PHŌNÉ Records',
    // Tarjeta bilingüe de app/opengraph-image.tsx; las páginas de /es y /en usan la de su idioma.
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PHŌNÉ Records' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // The locale is propagated from the proxy via the x-phone-locale header so
  // <html lang> always matches the URL segment. The proxy also redirects
  // any unprefixed request to /es or /en before reaching here.
  const h = await headers()
  const locale = h.get('x-phone-locale') === 'en' ? 'en' : 'es'

  // Consent decision (phone_consent=granted|denied). Read on the server so the
  // banner is never rendered when a decision already exists (no flicker, and it
  // can't become the LCP element for returning visitors).
  const consent = parseConsent((await cookies()).get(CONSENT_COOKIE)?.value)

  return (
    <html lang={locale}>
      <head>
        {/* Consent Mode v2 defaults: must be the first script, before GTM/GA4. */}
        <ConsentDefaultScript />
      </head>
      <GoogleTagManager gtmId="GTM-NXRBTN9P" />
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${fraunces.variable} font-sans antialiased bg-background`}>
        {children}
        {/* Vercel Analytics / Speed Insights are cookieless: no consent needed. */}
        <Analytics />
        <SpeedInsights />
        {/* GTM + GA4 stay (team decision) but are governed by Consent Mode above. */}
        <GoogleAnalytics gaId="G-EG3K77X96Y" />
        {/* Banner (only while undecided) + Ahrefs Analytics (only after "granted"). */}
        <ConsentManager lang={locale} initialDecision={consent} />
      </body>
    </html>
  )
}
