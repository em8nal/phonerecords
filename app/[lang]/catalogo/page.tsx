import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
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

        {/* Releases list */}
        <div className="border-t border-foreground/10">
          {releases.map((r) => (
            <Link
              key={r.slug}
              href={`/${lang}/releases/${r.slug}`}
              className="group grid grid-cols-12 gap-4 lg:gap-8 py-8 lg:py-10 border-b border-foreground/10 hover:bg-foreground/[0.02] transition-colors px-2 lg:px-4 -mx-2 lg:-mx-4"
            >
              <div className="col-span-12 sm:col-span-2 font-mono text-xs uppercase tracking-widest text-muted-foreground self-center">
                {r.releaseDate.slice(0, 7)}
              </div>
              <div className="col-span-12 sm:col-span-7 lg:col-span-6">
                <h2 className="text-2xl lg:text-3xl font-display tracking-tight group-hover:translate-x-1 transition-transform">
                  {r.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{r.artistName}</p>
              </div>
              <div className="col-span-8 sm:col-span-2 lg:col-span-3 text-sm text-foreground/70 self-center">
                {r.format}
                {r.label && <span className="block text-xs text-muted-foreground mt-1">{r.label}</span>}
              </div>
              <div className="col-span-4 sm:col-span-1 self-center text-right">
                <ArrowUpRight className="w-5 h-5 ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </article>

      <FooterSection />
    </main>
  );
}
