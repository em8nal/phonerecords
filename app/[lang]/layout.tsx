import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteDocument } from "@/components/site-document";
import { LanguageProvider } from "@/lib/language-context";
import { SITE_METADATA, SITE_VIEWPORT } from "@/lib/site-metadata";
import type { Language } from "@/lib/translations";
import "../globals.css";

// Root layout de /es y /en (H2). No hay app/layout.tsx: este layout y el de
// app/press/[lang]/ son los dos root layouts del sitio (next/dist/docs/01-app/03-api-reference/
// 03-file-conventions/layout.md, "Root Layout": "Omitting app/layout.js… each become root
// layouts"; "The root layout can be under a dynamic segment… app/[lang]/layout.js").
// <html lang> sale de params.lang y nada lee headers() ni cookies(): con generateStaticParams
// las páginas se prerenderizan y cada una fija su `revalidate`. Pasar de /es a /en (o a
// /press/…) cambia de root layout y hace una carga completa, así que <html lang> nunca
// queda con el idioma anterior.
//
// Sin `dynamicParams = false`: Next lo combina con every() sobre todos los segmentos
// (next/dist/build/static-paths/app.js), y app/[lang]/[...missing] dejaría de renderizar la
// 404 localizada.

const LOCALES: readonly Language[] = ["es", "en"] as const;

export const metadata: Metadata = SITE_METADATA;
export const viewport: Viewport = SITE_VIEWPORT;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Language)) notFound();
  const language = lang as Language;

  return (
    <SiteDocument lang={language}>
      <LanguageProvider initialLanguage={language}>{children}</LanguageProvider>
    </SiteDocument>
  );
}
