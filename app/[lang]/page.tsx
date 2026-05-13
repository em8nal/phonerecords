import type { Metadata } from "next";
import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { DevelopersSection } from "@/components/landing/developers-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

type LangParams = { lang: string };

export async function generateMetadata(
  { params }: { params: Promise<LangParams> }
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  return {
    title: isEs
      ? "PHŌNÉ Records — Sello cultural independiente · Santiago"
      : "PHŌNÉ Records — Independent cultural label · Santiago, Chile",
    description: isEs
      ? "Sello cultural independiente con dirección autoral. Roster latinoamericano en diálogo con circuitos globales: Newen Afrobeat, Claudio Solís, Ecamhi, Klaus B."
      : "Independent cultural label from Santiago, Chile. Latin American roster in dialogue with global circuits: Newen Afrobeat, Claudio Solís, Ecamhi, Klaus B.",
    alternates: {
      canonical: `https://phonerecords.cl/${lang}`,
      languages: {
        es: "https://phonerecords.cl/es",
        en: "https://phonerecords.cl/en",
        "x-default": "https://phonerecords.cl/es",
      },
    },
    openGraph: {
      url: `https://phonerecords.cl/${lang}`,
      locale: isEs ? "es_CL" : "en_US",
      alternateLocale: isEs ? ["en_US"] : ["es_CL"],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang } = await params;
  const isEs = lang === "es";

  // Schema.org JSON-LD: Organization that is also a MusicLabel.
  // Helps Google Knowledge Graph render the label brand and its artists.
  const labelSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "MusicLabel"],
        "@id": "https://phonerecords.cl/#organization",
        name: "PHŌNÉ Records",
        url: "https://phonerecords.cl",
        logo: "https://phonerecords.cl/phone-logo-dark.png",
        description: isEs
          ? "Sello cultural independiente con dirección autoral. Producción integral, management y curaduría de música independiente latinoamericana."
          : "Independent cultural label with strong authorial direction. Integral production, management and curation of independent Latin American music.",
        foundingLocation: {
          "@type": "Place",
          name: "Santiago, Chile",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Santiago",
            addressRegion: "Región Metropolitana",
            addressCountry: "CL",
          },
        },
        sameAs: [
          "https://www.instagram.com/phone_records/",
          "https://newenafrobeat.bandcamp.com/music",
          "https://open.spotify.com/artist/0PTJ848ulShbjTx2yqaAlb",
          "https://www.youtube.com/channel/UCTHMwr5NTvQ0MWbq0nbeP-w",
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "press",
            url: `https://phonerecords.cl/${lang}/contacto`,
          },
          {
            "@type": "ContactPoint",
            contactType: "booking",
            url: `https://phonerecords.cl/${lang}/contacto`,
          },
        ],
        member: [
          { "@type": "MusicGroup", name: "Newen Afrobeat", url: `https://phonerecords.cl/${lang}/artistas/newen-afrobeat` },
          { "@type": "MusicGroup", name: "Claudio Solís", url: `https://phonerecords.cl/${lang}/artistas/claudio-solis` },
          { "@type": "MusicGroup", name: "Ecamhi", url: `https://phonerecords.cl/${lang}/artistas/ecamhi` },
          { "@type": "MusicGroup", name: "Con.fusión", url: `https://phonerecords.cl/${lang}/artistas/con-fusion` },
          { "@type": "MusicGroup", name: "Klaus Brantmayer", url: `https://phonerecords.cl/${lang}/artistas/klaus-brantmayer` },
          { "@type": "MusicGroup", name: "Andrés Abrigo", url: `https://phonerecords.cl/${lang}/artistas/andres-abrigo` },
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://phonerecords.cl/#website",
        url: "https://phonerecords.cl",
        name: "PHŌNÉ Records",
        publisher: { "@id": "https://phonerecords.cl/#organization" },
        inLanguage: ["es-CL", "en"],
      },
    ],
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(labelSchema) }}
      />
      <Navigation />
      <HeroSection />
      <IntegrationsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <MetricsSection />
      <DevelopersSection />
      <PricingSection />
      <TestimonialsSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
