import React from "react"
import type { Metadata } from 'next'
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/language-context'
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

export const metadata: Metadata = {
  metadataBase: new URL('https://phonerecords.cl'),
  title: {
    default: 'PHŌNÉ Records — Sello cultural independiente · Santiago de Chile',
    template: '%s — PHŌNÉ Records',
  },
  description:
    'Sello cultural independiente con dirección autoral. Roster: Newen Afrobeat, Claudio Solís, Ecamhi, Con.fusión, Klaus Brantmayer, Andrés Abrigo, Pau, Valentina Marinkovic.',
  keywords: [
    'PHŌNÉ Records', 'sello chileno', 'música independiente Chile',
    'Newen Afrobeat', 'Claudio Solís', 'Ecamhi', 'Con.fusión',
    'Klaus Brantmayer', 'afrobeat Chile', 'minimal techno Chile',
  ],
  authors: [{ name: 'PHŌNÉ Records', url: 'https://phonerecords.cl' }],
  alternates: { canonical: 'https://phonerecords.cl' },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
