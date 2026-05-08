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
