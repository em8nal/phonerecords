import React from "react"
import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono, Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
    'Sello cultural independiente con dirección autoral. Roster: Newen Afrobeat, Claudio Solís, Ecamhi, Con.fusión, Klaus Brantmayer, Andrés Abrigo.',
  keywords: [
    'PHŌNÉ Records', 'sello chileno', 'música independiente Chile',
    'Newen Afrobeat', 'Claudio Solís', 'Ecamhi', 'Con.fusión',
    'Klaus Brantmayer', 'Andrés Abrigo',
    'afrobeat Chile', 'minimal techno Chile',
  ],
  authors: [{ name: 'PHŌNÉ Records', url: 'https://phonerecords.cl' }],
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PHŌNÉ Records',
    description: 'Sello cultural independiente · Santiago de Chile',
  },
  generator: 'v0.app',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // The locale is propagated from middleware via the x-phone-locale header so
  // <html lang> always matches the URL segment. Middleware also redirects
  // any unprefixed request to /es or /en before reaching here.
  const h = await headers()
  const locale = h.get('x-phone-locale') === 'en' ? 'en' : 'es'

  return (
    <html lang={locale}>
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${fraunces.variable} font-sans antialiased bg-background`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
