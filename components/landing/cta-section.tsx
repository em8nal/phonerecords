"use client";

import { useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import { NewsletterForm } from "@/components/phone/newsletter-form";
import { useLanguage } from "@/lib/language-context";

// Fondo decorativo del bloque Newsletter (regla de la portada: imagen CLARA → elementos OSCUROS).
// Azotea de Santiago de la sesión de Con.fusión (DSCF3702) en B/N: la artista queda a la derecha
// y el panel con el formulario a la izquierda. Archivos en public/media/home/.
const BG_DESKTOP = { src: "/media/home/newsletter-bg.jpg", width: 2560, height: 1440 } as const; // 16:9
const BG_MOBILE = { src: "/media/home/newsletter-bg-mobile.jpg", width: 1200, height: 1500 } as const; // 4:5

export function CtaSection() {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Art direction como en PageHero: <source> para >= 768px; el <img> es la versión móvil 4:5.
  // Decorativa (alt="") y bajo el pliegue: carga diferida (lazy), sin prioridad de carga.
  const { props: bgDesktop } = getImageProps({ ...BG_DESKTOP, alt: "", sizes: "100vw", loading: "lazy" });
  const { props: bgMobile } = getImageProps({ ...BG_MOBILE, alt: "", sizes: "100vw", loading: "lazy" });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-newsletter-heading"
      className="relative isolate overflow-hidden bg-background py-24 lg:py-32"
    >
      {/* Foto detrás de toda la sección + velo hueso 60 %. Si la imagen no carga queda bg-background. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <picture>
          <source media="(min-width: 768px)" srcSet={bgDesktop.srcSet} sizes="(min-width: 2560px) 2560px, 100vw" />
          { }
          <img
            {...bgMobile}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[50%_0%] md:object-[50%_65%]"
          />
        </picture>
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Móvil: franja de foto (cielo y azoteas) sobre el panel. Escritorio: panel a la izquierda, foto a la derecha. */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-40 md:pt-0">
        {/* Panel hueso 90 %: text-muted-foreground conserva AA aunque debajo haya negro puro (4,94:1). */}
        <div
          className={`relative border border-foreground bg-background/90 md:max-w-2xl 2xl:max-w-3xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
            <h2
              id="home-newsletter-heading"
              className="text-4xl lg:text-6xl font-display tracking-tight mb-8 leading-[0.95] text-balance"
            >
              {t.cta.headline1}
              <br />
              {t.cta.headline2}
            </h2>

            <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
              {t.cta.description}
            </p>

            <NewsletterForm
              lang={language === "en" ? "en" : "es"}
              source="home"
              className="max-w-xl"
            />

            <p className="text-sm text-muted-foreground mt-8 font-mono">
              {t.cta.noCreditCard}
            </p>
          </div>

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
        </div>
      </div>
    </section>
  );
}
