"use client";

import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/lib/language-context";

function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div ref={ref} className="text-6xl lg:text-8xl font-display tracking-tight">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

const metricsData = {
  es: {
    eyebrow: "El sello en cifras",
    headline1: "Música independiente",
    headline2: "que viaja.",
    liveLabel: "Activo",
    items: [
      { value: 8, suffix: "", prefix: "", label: "Artistas en el roster" },
      { value: 35, suffix: "+", prefix: "", label: "Releases entre Newen y Klaus B" },
      { value: 7, suffix: "", prefix: "", label: "Países en gira Europa 2026" },
      { value: 13, suffix: "", prefix: "", label: "Años desde el primer LP del catálogo" },
    ],
  },
  en: {
    eyebrow: "The label in numbers",
    headline1: "Independent music",
    headline2: "that travels.",
    liveLabel: "Active",
    items: [
      { value: 8, suffix: "", prefix: "", label: "Artists on the roster" },
      { value: 35, suffix: "+", prefix: "", label: "Releases between Newen and Klaus B" },
      { value: 7, suffix: "", prefix: "", label: "Countries on Europe 2026 tour" },
      { value: 13, suffix: "", prefix: "", label: "Years since the catalogue's first LP" },
    ],
  },
};

export function MetricsSection() {
  const { language } = useLanguage();
  const copy = metricsData[language];
  const [time, setTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <section id="studio" ref={sectionRef} className="relative py-24 lg:py-32 border-y border-foreground/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-24">
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              {copy.eyebrow}
            </span>
            <h2
              className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {copy.headline1}
              <br />
              {copy.headline2}
            </h2>
          </div>
          <div className="flex items-center gap-4 font-mono text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {copy.liveLabel}
            </span>
            <span className="text-foreground/30">|</span>
            <span suppressHydrationWarning>{time.toLocaleTimeString(language === "es" ? "es-CL" : "en-GB")}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10">
          {copy.items.map((metric, index) => (
            <div
              key={metric.label}
              className={`bg-background p-8 lg:p-12 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <AnimatedCounter 
                end={typeof metric.value === 'number' ? metric.value : 0} 
                suffix={metric.suffix} 
                prefix={metric.prefix}
              />
              <div className="mt-4 text-lg text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
