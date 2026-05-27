import React from "react"
import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono, Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'
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
    'Sello cultural independiente, Santiago de Chile. Roster: Newen Afrobeat, Claudio Solís, Ecamhi, Con.fusión, Klaus B, Andrés Abrigo.',
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

  return (
    <html lang={locale}>
      <GoogleTagManager gtmId="GTM-NXRBTN9P" />
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${fraunces.variable} font-sans antialiased bg-background`}>
        {children}
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId="G-EG3K77X96Y" />
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="0TGL5CM0s/+asLNuWTfObw"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
