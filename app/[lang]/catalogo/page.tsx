import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { getCatalogEntries, getCatalogArtists } from "@/lib/catalog";
import { CatalogGrid } from "./catalog-grid";

type LangParams = { lang: string };

export async function generateMetadata(
  { params }: { params: Promise<LangParams> },
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  return {
    title: isEs ? "Catálogo" : "Catalogue",
    description: isEs
      ? "Catálogo completo PHŌNÉ Records: discos, EPs, sesiones en vivo y singles del roster — Newen Afrobeat, Claudio Solís, Ecamhi, Con.fusión, Klaus B, Andrés Abrigo."
      : "Complete PHŌNÉ Records catalogue: albums, EPs, live sessions and singles from the roster — Newen Afrobeat, Claudio Solís, Ecamhi, Con.fusión, Klaus B, Andrés Abrigo.",
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
  const entries = getCatalogEntries();
  const artistsList = getCatalogArtists();

  const t = isEs
    ? {
        eyebrow: "Catálogo",
        headline: "Discos, EPs\ny sesiones.",
        intro:
          "El catálogo completo del roster PHŌNÉ Records y sus colaboradores. Filtra por artista para ver su discografía dentro del sello y de su carrera.",
        backHome: "Volver al inicio",
        labels: {
          all: "Todo",
          empty: "Sin resultados.",
          detail: "Ver release",
          artist: "Filtrar por artista",
        },
      }
    : {
        eyebrow: "Catalogue",
        headline: "Albums, EPs\nand sessions.",
        intro:
          "The complete PHŌNÉ Records roster catalogue and its collaborators. Filter by artist to see their discography on the label and across their career.",
        backHome: "Back to home",
        labels: {
          all: "All",
          empty: "No results.",
          detail: "View release",
          artist: "Filter by artist",
        },
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

        <header className="mb-12 lg:mb-16 max-w-3xl">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            {t.eyebrow}
          </span>
          <h1 className="text-5xl lg:text-8xl font-display tracking-tight leading-[0.95] whitespace-pre-line mb-10">
            {t.headline}
          </h1>
          <p className="text-xl text-foreground/85 leading-relaxed">{t.intro}</p>
        </header>

        <CatalogGrid
          lang={lang}
          entries={entries}
          artistsList={artistsList}
          labels={t.labels}
        />
      </article>

      <FooterSection />
    </main>
  );
}
