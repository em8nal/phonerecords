import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteDocument } from "@/components/site-document";
import { SITE_METADATA, SITE_VIEWPORT } from "@/lib/site-metadata";
import "../../globals.css";

// Root layout de los press kits /press/<lang>/<slug> (H2): segundo root layout del sitio, junto
// con app/[lang]/layout.tsx (ver el comentario de ese archivo). <html lang> sale del segmento.
//
// dynamicParams = false: el generateStaticParams de la página ya cubre idioma × slug, así que
// cualquier otra combinación responde 404 (antes /press/fr/<slug> pintaba la página en inglés
// con lang="es").
export const dynamicParams = false;

export const metadata: Metadata = SITE_METADATA;
export const viewport: Viewport = SITE_VIEWPORT;

export default async function PressLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <SiteDocument lang={lang === "en" ? "en" : "es"}>{children}</SiteDocument>;
}
