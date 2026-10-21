"use client";

import { useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import { useLanguage } from "@/lib/language-context";

// Un visual por servicio, en el mismo orden que `t.features.items`:
// 01 Sello · Vinilo + Digital → vinilo girando + barras digitales
// 02 Management de artistas → núcleo (artista) con tres satélites en órbita
// 03 Producción · Sonido + Imagen → visor fotográfico con forma de onda
// 04 Giras & Booking → ruta entre ciudades con marcador en movimiento
const visuals = ["vinyl", "management", "production", "touring"];

// Fondo decorativo del bloque (regla de la portada: imagen OSCURA → elementos CLAROS).
// Escenario de la sesión La Banca de Con.fusión (26.JPEG: manos sobre la tornamesa, humo, sin caras),
// en B/N. Archivos en public/media/home/.
const BG_DESKTOP = { src: "/media/home/servicios-bg.jpg", width: 2560, height: 1440 } as const; // 16:9
const BG_MOBILE = { src: "/media/home/servicios-bg-mobile.jpg", width: 1200, height: 1500 } as const; // 4:5
// Relleno "hueco" de los visuales SVG (satélites, pin, marcador): debe ser el color del fondo del
// bloque, no el --background global (que es claro). #0a0a0a = bg-neutral-950.
const VISUAL_STYLE = { "--visual-bg": "#0a0a0a" } as React.CSSProperties;

/** true salvo que el sistema pida menos movimiento (prefers-reduced-motion). */
function usePrefersMotion() {
  const [motion, setMotion] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return motion;
}

type VisualProps = { motion: boolean };

const svgProps = {
  viewBox: "0 0 200 160",
  className: "w-full h-full",
  "aria-hidden": true,
  focusable: false,
} as const;

function VinylVisual({ motion }: VisualProps) {
  const grooves = [46, 40, 34, 28];
  const bars = [
    { x: 150, from: 92, to: 58, dur: "1.1s" },
    { x: 162, from: 84, to: 48, dur: "0.9s" },
    { x: 174, from: 96, to: 66, dur: "1.3s" },
    { x: 186, from: 88, to: 54, dur: "1.0s" },
  ];
  return (
    <svg {...svgProps}>
      {/* Vinilo */}
      <g transform="translate(78 80)">
        <circle r="56" fill="currentColor" opacity="0.06" />
        <circle r="56" fill="none" stroke="currentColor" strokeWidth="2" />
        <g>
          {motion && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              dur="6s"
              repeatCount="indefinite"
            />
          )}
          {grooves.map((r) => (
            <circle key={r} r={r} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
          ))}
          {/* Etiqueta central con agujero */}
          <circle r="17" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.9" />
          {/* Marca para percibir el giro */}
          <rect x="-1.5" y="-23" width="3" height="10" rx="1" fill="currentColor" opacity="0.6" />
        </g>
      </g>
      {/* Digital: barras de nivel */}
      {bars.map((b) => (
        <line
          key={b.x}
          x1={b.x}
          x2={b.x}
          y1={b.from}
          y2="112"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.8"
        >
          {motion && (
            <animate
              attributeName="y1"
              values={`${b.from};${b.to};${b.from}`}
              dur={b.dur}
              repeatCount="indefinite"
            />
          )}
        </line>
      ))}
    </svg>
  );
}

function ManagementVisual({ motion }: VisualProps) {
  const radius = 48;
  const sats = [0, 120, 240].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return { x: Math.cos(a) * radius, y: Math.sin(a) * radius };
  });
  return (
    <svg {...svgProps}>
      <g transform="translate(100 80)">
        {/* Órbita */}
        <circle r={radius} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" opacity="0.5" />
        {/* Núcleo: el proyecto artístico */}
        <circle r="11" fill="currentColor" />
        <circle r="11" fill="none" stroke="currentColor" strokeWidth="1" opacity="0">
          {motion && <animate attributeName="r" values="11;30" dur="2.4s" repeatCount="indefinite" />}
          {motion && <animate attributeName="opacity" values="0.5;0" dur="2.4s" repeatCount="indefinite" />}
        </circle>
        {/* Satélites: booking, estrategia, finanzas */}
        <g>
          {motion && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              dur="14s"
              repeatCount="indefinite"
            />
          )}
          {sats.map((s, i) => (
            <g key={i}>
              <line x1="0" y1="0" x2={s.x} y2={s.y} stroke="currentColor" strokeWidth="1" opacity="0.25" />
              <circle cx={s.x} cy={s.y} r="7" fill="var(--visual-bg, #fff)" stroke="currentColor" strokeWidth="2" />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

function ProductionVisual({ motion }: VisualProps) {
  const bars = [52, 68, 84, 100, 116, 132, 148].map((x, i) => ({
    x,
    base: [14, 26, 40, 54, 40, 26, 14][i],
    peak: [30, 48, 64, 78, 60, 44, 28][i],
    dur: `${1 + (i % 3) * 0.25}s`,
  }));
  return (
    <svg {...svgProps}>
      {/* Visor: cuatro esquinas */}
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M 34 44 L 34 26 L 52 26" />
        <path d="M 148 26 L 166 26 L 166 44" />
        <path d="M 166 116 L 166 134 L 148 134" />
        <path d="M 52 134 L 34 134 L 34 116" />
      </g>
      {/* Punto de grabación */}
      <circle cx="154" cy="40" r="3.5" fill="currentColor">
        {motion && <animate attributeName="opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite" />}
      </circle>
      {/* Forma de onda */}
      {bars.map((b) => (
        <line
          key={b.x}
          x1={b.x}
          x2={b.x}
          y1={80 - b.base / 2}
          y2={80 + b.base / 2}
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
        >
          {motion && (
            <>
              <animate attributeName="y1" values={`${80 - b.base / 2};${80 - b.peak / 2};${80 - b.base / 2}`} dur={b.dur} repeatCount="indefinite" />
              <animate attributeName="y2" values={`${80 + b.base / 2};${80 + b.peak / 2};${80 + b.base / 2}`} dur={b.dur} repeatCount="indefinite" />
            </>
          )}
        </line>
      ))}
    </svg>
  );
}

function TouringVisual({ motion }: VisualProps) {
  const route = "M 28 112 C 50 50, 82 130, 110 72 S 150 36, 172 54";
  const cities = [
    { x: 28, y: 112 },
    { x: 72, y: 92 },
    { x: 110, y: 72 },
    { x: 172, y: 54 },
  ];
  return (
    <svg {...svgProps}>
      {/* Ruta */}
      <path d={route} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5" opacity="0.45" />
      {/* Ciudades */}
      {cities.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r="4" fill="currentColor" />
          <circle cx={c.x} cy={c.y} r="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0">
            {motion && (
              <>
                <animate attributeName="r" values="4;14" dur="2.8s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0" dur="2.8s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
              </>
            )}
          </circle>
        </g>
      ))}
      {/* Pin de destino */}
      <g transform="translate(172 54)">
        <path d="M 0 -30 C -9 -30, -13 -22, -13 -16 C -13 -8, 0 0, 0 0 C 0 0, 13 -8, 13 -16 C 13 -22, 9 -30, 0 -30 Z" fill="currentColor" />
        <circle cy="-17" r="4" fill="var(--visual-bg, #fff)" />
      </g>
      {/* Marcador en movimiento */}
      {motion ? (
        <circle r="5" fill="currentColor" stroke="var(--visual-bg, #fff)" strokeWidth="2">
          <animateMotion dur="5s" repeatCount="indefinite" path={route} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
        </circle>
      ) : (
        <circle cx="72" cy="92" r="5" fill="currentColor" stroke="var(--visual-bg, #fff)" strokeWidth="2" />
      )}
    </svg>
  );
}

function AnimatedVisual({ type }: { type: string }) {
  const motion = usePrefersMotion();
  switch (type) {
    case "vinyl":
      return <VinylVisual motion={motion} />;
    case "management":
      return <ManagementVisual motion={motion} />;
    case "production":
      return <ProductionVisual motion={motion} />;
    case "touring":
      return <TouringVisual motion={motion} />;
    default:
      return <VinylVisual motion={motion} />;
  }
}

function FeatureCard({ feature, index, visual }: { feature: { number: string; title: string; description: string }; index: number; visual: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 py-12 lg:py-20 border-b border-white/10">
        {/* Number */}
        <div className="shrink-0">
          <span className="font-mono text-sm text-white/80">{feature.number}</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl lg:text-4xl font-display mb-4 group-hover:translate-x-2 transition-transform duration-500">
              {feature.title}
            </h3>
            <p className="text-lg text-white/80 leading-relaxed">
              {feature.description}
            </p>
          </div>

          {/* Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-48 h-40 text-white" style={VISUAL_STYLE}>
              <AnimatedVisual type={visual} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
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
      id="features"
      ref={sectionRef}
      aria-labelledby="features-heading"
      className="relative isolate overflow-hidden bg-neutral-950 text-white py-24 lg:py-32 print:bg-white print:text-black"
    >
      {/* Fondo decorativo: foto B/N + velo negro + fundido a neutral-950. Cubre la cabecera y la primera
          tarjeta (≤ 120svh / 1100 px); las demás tarjetas van sobre negro sólido. Si la imagen no carga
          queda bg-neutral-950 (blanco 19,8:1; blanco/70 9,7:1). */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-reach max-h-[1100px] print:hidden"
      >
        <picture>
          <source media="(min-width: 768px)" srcSet={bgDesktop.srcSet} sizes="(min-width: 2560px) 2560px, 100vw" />
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img
            {...bgMobile}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[50%_50%] md:object-left"
          />
        </picture>
        {/* Velo negro 65 %: con 60 % el blanco/70 baja a 4,1:1 sobre los brillos del plato (gris 0,93);
            con 65 % queda en 4,76:1 en el peor bloque medido y ≈9,5:1 sobre el gris medio. */}
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-neutral-950" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-white/80 mb-6">
            <span className="w-8 h-px bg-white/30" />
            {t.features.eyebrow}
          </span>
          <h2
            id="features-heading"
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t.features.headline1}
            <br />
            <span className="text-white/80">{t.features.headline2}</span>
          </h2>
        </div>

        {/* Features List */}
        <div>
          {t.features.items.map((feature, index) => (
            <FeatureCard key={feature.number} feature={feature} index={index} visual={visuals[index]} />
          ))}
        </div>
      </div>
    </section>
  );
}
