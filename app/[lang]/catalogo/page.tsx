import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { getAllReleasesSorted } from "@/lib/releases";

type LangParams = { lang: string };

export async function generateMetadata(
  { params }: { params: Promise<LangParams> }
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  return {
    title: isEs ? "Catálogo" : "Catalogue",
    description: isEs
      ? "Catálogo completo PHŌNÉ Records: discos, EPs, sesiones en vivo y singles del roster — Newen Afrobeat, Klaus B, Ecamhi y más."
      : "Complete PHŌNÉ Records catalogue: albums, EPs, live sessions and singles from the roster — Newen Afrobeat, Klaus B, Ecamhi and more.",
    alternates: {
      canonical: `https://phonerecords.cl/${lang}/catalogo`,
      languages: {
        es: "https://phonerecords.cl/es/catalogo",
        en: "https://phonerecords.cl/en/catalogo",
        "x-default": "https://phonerecords.cl/es/catalogo",
      },
    },
  };
}

export default async function CatalogoPage({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang } = await params;
  const isEs = lang === "es";
  const releases = getAllReleasesSorted();

  const t = isEs
    ? {
        eyebrow: "Catálogo",
        headline: "Discos, EPs\ny sesiones.",
        intro: "El catálogo completo de PHŌNÉ Records y su red de colaboradores. Todos los lanzamientos enlazan a su página de detalle con tracklist, créditos y enlaces de escucha.",
        backHome: "Volver al inicio",
        viewRelease: "Ver release",
        artist: "Artista",
        date: "Fecha",
        format: "Formato",
        label: "Sello",
      }
    : {
        eyebrow: "Catalogue",
        headline: "Albums, EPs\nand sessions.",
        intro: "The complete PHŌNÉ Records catalogue and its network of collaborators. Each release links to its detail page with tracklist, credits and listening links.",
        backHome: "Back to home",
        viewRelease: "View release",
        artist: "Artist",
        date: "Date",
        format: "Format",
        label: "Label",
      };

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />

      <article className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-24">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.backHome}
        </Link>

        {/* Header */}
        <header className="mb-16 lg:mb-24 max-w-3xl">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            {t.eyebrow}
          </span>
          <h1 className="text-5xl lg:text-8xl font-display tracking-tight leading-[0.95] whitespace-pre-line mb-10">
            {t.headline}
          </h1>
          <p className="text-xl text-foreground/85 leading-relaxed">{t.intro}</p>
        </header>

        {/* Releases grid with covers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
          {releases.map((r) => (
            <Link
              key={r.slug}
              href={`/${lang}/releases/${r.slug}`}
              className="group block bg-background hover:bg-foreground/[0.02] transition-colors"
            >
              <div className="relative aspect-square overflow-hidden bg-foreground/5">
                {r.cover ? (
                  <Image
                    src={r.cover}
                    alt={`${r.title} — ${r.artistName}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40 font-display text-5xl tracking-widest">
                    PHŌNÉ
                  </div>
                )}
              </div>
              <div className="p-6 lg:p-8">
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  {r.releaseDate.slice(0, 7)} · {r.format.split(" · ")[0]}
                </div>
                <h2 className="text-xl lg:text-2xl font-display tracking-tight mb-1 group-hover:translate-x-1 transition-transform">
                  {r.title}
                </h2>
                <p className="text-sm text-muted-foreground">{r.artistName}</p>
                {r.label && (
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground/70 mt-3">
                    {r.label}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </article>

      <FooterSection />
    </main>
  );
}
