import type { Metadata } from "next";
import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";
import { ReleaseBanner } from "@/components/phone/release-banner";
import { organizationJsonLd, toJsonLd, websiteJsonLd } from "@/lib/schema";

// El banner de lanzamiento rota por fecha (Pre-save → Escuchar a las 00:00 de
// Santiago y relevo entre lanzamientos) sin redeploy. Hoy el root layout lee
// headers() y la ruta se renderiza por request (fecha siempre exacta); si algún
// día pasa a estática, este revalidate la regenera cada 5 minutos.
export const revalidate = 300;

type LangParams = { lang: string };

export async function generateMetadata(
  { params }: { params: Promise<LangParams> }
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  const title = isEs
    ? "PHŌNÉ Records — Sello cultural independiente · Santiago"
    : "PHŌNÉ Records — Independent cultural label · Santiago, Chile";
  const description = isEs
    ? "Sello cultural independiente con dirección autoral. Roster latinoamericano en diálogo con circuitos globales: Newen Afrobeat, Klaus B, ecamhi, Con.fusión y Rosario Lircay."
    : "Independent cultural label from Santiago, Chile. Latin American roster in dialogue with global circuits: Newen Afrobeat, Klaus B, ecamhi, Con.fusión and Rosario Lircay.";
  return {
    // Use `absolute` so the layout-level title template doesn't append "— PHŌNÉ Records" twice on the home page.
    title: { absolute: title },
    description,
    alternates: {
      canonical: `https://phonerecords.cl/${lang}`,
      languages: {
        es: "https://phonerecords.cl/es",
        en: "https://phonerecords.cl/en",
        "x-default": "https://phonerecords.cl/es",
      },
    },
    openGraph: {
      type: "website",
      url: `https://phonerecords.cl/${lang}`,
      siteName: "PHŌNÉ Records",
      title,
      description,
      locale: isEs ? "es_CL" : "en_US",
      alternateLocale: isEs ? ["en_US"] : ["es_CL"],
      images: [
        {
          url: `https://phonerecords.cl/${lang}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "PHŌNÉ Records",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "PHŌNÉ Records",
      description,
      images: [`https://phonerecords.cl/${lang}/opengraph-image`],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang } = await params;

  // Schema.org JSON-LD: la organización del sello (única definición, lib/schema.ts,
  // con sus artistas como miembros) y el sitio que publica.
  const labelSchema = {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(lang), websiteJsonLd()],
  };

  return (
    <>
      <main className="relative min-h-screen overflow-x-hidden noise-overlay">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(labelSchema) }}
        />
        <Navigation />
        <ReleaseBanner lang={lang === "en" ? "en" : "es"} />
        <HeroSection />
        <IntegrationsSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <FooterSection />
    </>
  );
}
