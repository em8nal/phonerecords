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

export const metadata: Metadata = {
  metadataBase: new URL('https://phonerecords.cl'),
  title: {
    default: 'PHŌNÉ Records — Sello cultural independiente · Santiago de Chile',
    template: '%s — PHŌNÉ Records',
  },
  description:
    'Sello cultural independiente, Santiago de Chile. Roster: Newen Afrobeat, Klaus B, ecamhi, Con.fusión y Rosario Lircay.',
  authors: [{ name: 'PHŌNÉ Records', url: 'https://phonerecords.cl' }],
  verification: {
    google: 'mUTRTpRC44cVJL--psi4RCHRscBV4OGOV_UfIPHwRXU',
  },
  alternates: {
    canonical: 'https://phonerecords.cl/es',
    languages: {
      es: 'https://phonerecords.cl/es',
      en: 'https://phonerecords.cl/en',
      'x-default': 'https://phonerecords.cl/es',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    alternateLocale: 'en_US',
    url: 'https://phonerecords.cl',
    siteName: 'PHŌNÉ Records',
    title: 'PHŌNÉ Records — Sello cultural independiente',
    description:
      'Producción integral de obras musicales situadas. En diálogo con circuitos europeos y latinoamericanos.',
    // Safety net: /es/opengraph-image exists (app/[lang]/opengraph-image.tsx).
    // Pages under /[lang] get their own locale-specific file-based image.
    images: [{ url: 'https://phonerecords.cl/es/opengraph-image', width: 1200, height: 630, alt: 'PHŌNÉ Records' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PHŌNÉ Records',
    description: 'Sello cultural independiente · Santiago de Chile',
    images: ['https://phonerecords.cl/es/opengraph-image'],
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
