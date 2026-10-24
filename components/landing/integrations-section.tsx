"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { getArtistPortrait } from "@/lib/artist-media";

// Mismo orden y nombres que lib/artists.ts (lo vigila `pnpm test:roster`).
export const roster = [
  { slug: "newen-afrobeat", name: "Newen Afrobeat", genre: "Afrobeat · Afrofunk", country: "Chile / international" },
  { slug: "ecamhi", name: "ecamhi", genre: "Instrumental · Interdisciplinary", country: "Santiago, Chile" },
  { slug: "con-fusion", name: "Con.fusión", genre: "Hip hop · Jazz · Neo soul", country: "Santiago, Chile" },
  { slug: "klaus-b", name: "Klaus B", genre: "Nu-jazz · Hip-hop jazz", country: "Santiago, Chile" },
  { slug: "rosario-lircay", name: "Rosario Lircay", genre: "R&B · Pop alternativo", country: "Ñuble · Santiago, Chile" },
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
        headline1: "Cinco proyectos.",
        headline2: "Una línea editorial.",
        description: "Artistas acompañados con representación integral en Chile y en circuitos europeos y latinoamericanos.",
        tile: { eyebrow: "Catálogo PHŌNÉ", headline: "Discos, sesiones en vivo y archivo del sello.", cta: "Ver el catálogo" },
      }
    : {
        eyebrow: "Roster",
        headline1: "Five projects.",
        headline2: "One editorial line.",
        description: "Artists supported with integral representation across Chile and European / Latin American circuits.",
        tile: { eyebrow: "PHŌNÉ catalogue", headline: "Records, live sessions and the label's archive.", cta: "View the catalogue" },
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

        {/* Grid: retrato en B/N (regla institucional) o inicial si no hay foto; textos y orden sin cambios */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
          {roster.map((artist, i) => {
            const portrait = getArtistPortrait(artist.slug);
            return (
              <Link
                key={artist.slug}
                href={`/${language}/artistas/${artist.slug}`}
                className={`group block bg-background p-4 md:p-8 lg:p-10 hover:bg-foreground/[0.02] transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isVisible ? `${i * 60}ms` : "0ms" }}
              >
                <div className="relative mb-4 md:mb-6 aspect-square overflow-hidden bg-foreground/5">
                  {portrait ? (
                    <Image
                      src={portrait}
                      alt=""
                      fill
                      sizes="(min-width: 1400px) 360px, (min-width: 768px) 33vw, 50vw"
                      className="object-cover grayscale"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center font-display text-6xl text-muted-foreground/40"
                    >
                      {artist.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="font-mono text-xs text-muted-foreground mb-6">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl md:text-2xl font-display tracking-tight mb-3 motion-safe:group-hover:translate-x-1 transition-transform">
                  {artist.name}
                </h3>
                <p className="text-sm text-foreground/70 mb-2">{artist.genre}</p>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {artist.country}
                </p>
              </Link>
            );
          })}
          {/* Celda final: tarjeta del sello hacia el catálogo. Con 5 artistas completa la grilla
              (6 = 2×3 en móvil = 3×2 desde md); con otro número, los rellenos de abajo cierran la fila. */}
          <Link
            href={`/${language}/catalogo`}
            className={`group flex flex-col justify-between gap-10 bg-foreground p-4 text-background transition-all duration-500 md:p-8 lg:p-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isVisible ? `${roster.length * 60}ms` : "0ms" }}
          >
            <span className="font-mono text-xs uppercase tracking-wider text-background/60">{copy.tile.eyebrow}</span>
            <span className="block">
              <span className="mb-6 block font-display text-xl tracking-tight text-balance md:text-2xl lg:text-3xl">
                {copy.tile.headline}
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
                {copy.tile.cta}
                <span aria-hidden="true" className="text-brand motion-safe:transition-transform motion-safe:group-hover:translate-x-1">
                  →
                </span>
              </span>
            </span>
          </Link>
          {/* Rellenos (solo si artistas + tarjeta no completan la última fila: 2 columnas en móvil, 3 desde md) */}
          {Array.from({ length: (2 - ((roster.length + 1) % 2)) % 2 }, (_, i) => (
            <div key={`m${i}`} aria-hidden="true" className="bg-background md:hidden" />
          ))}
          {Array.from({ length: (3 - ((roster.length + 1) % 3)) % 3 }, (_, i) => (
            <div key={`d${i}`} aria-hidden="true" className="hidden bg-background md:block" />
          ))}
        </div>
      </div>
    </section>
  );
}
