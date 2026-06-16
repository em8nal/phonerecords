"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

const roster = [
  { slug: "newen-afrobeat", name: "Newen Afrobeat", genre: "Afrobeat · Afrofunk", country: "Chile / international" },
  { slug: "ecamhi", name: "Ecamhi", genre: "Instrumental · Interdisciplinary", country: "Santiago, Chile" },
  { slug: "con-fusion", name: "Con.fusión", genre: "Hip hop · Jazz · Neo soul", country: "Santiago, Chile" },
  { slug: "klaus-brantmayer", name: "Klaus Brantmayer", genre: "Nu-jazz · Hip-hop jazz", country: "Santiago, Chile" },
  { slug: "andres-abrigo", name: "Andrés Abrigo", genre: "Ambient · Post-tempo", country: "Chile" },
];

export function IntegrationsSection() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const copy = language === "es"
    ? {
        eyebrow: "Roster",
        headline1: "Seis proyectos.",
        headline2: "Una línea editorial.",
        description: "Artistas acompañados con representación integral en Chile y en circuitos europeos y latinoamericanos.",
      }
    : {
        eyebrow: "Roster",
        headline1: "Six projects.",
        headline2: "One editorial line.",
        description: "Artists supported with integral representation across Chile and European / Latin American circuits.",
      };

  return (
    <section id="roster" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 lg:mb-24 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            {copy.eyebrow}
            <span className="w-8 h-px bg-foreground/30" />
          </span>
          <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6">
            {copy.headline1}
            <br />
            {copy.headline2}
          </h2>
          <p className="text-xl text-muted-foreground">{copy.description}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
          {roster.map((artist, i) => (
            <Link
              key={artist.slug}
              href={`/${language}/artistas/${artist.slug}`}
              className={`block bg-background p-8 lg:p-10 hover:bg-foreground/[0.02] transition-all duration-500 group ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: isVisible ? `${i * 60}ms` : "0ms" }}
            >
              <div className="font-mono text-xs text-muted-foreground mb-6">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-2xl font-display tracking-tight mb-3 group-hover:translate-x-1 transition-transform">
                {artist.name}
              </h3>
              <p className="text-sm text-foreground/70 mb-2">{artist.genre}</p>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                {artist.country}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
