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
      ? "PHŌNÉ Records — Sello cultural independiente · Santiago de Chile"
      : "PHŌNÉ Records — Independent cultural label · Santiago, Chile",
    description: isEs
      ? "Sello cultural independiente con dirección autoral. Producción integral, management y curaduría de música independiente latinoamericana en diálogo con circuitos globales."
      : "Independent cultural label with strong authorial direction. Integral production, management and curation of independent Latin American music in dialogue with global circuits.",
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

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
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
