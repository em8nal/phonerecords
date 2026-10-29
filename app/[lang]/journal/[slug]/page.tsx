import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { PageHero } from "@/components/phone/page-hero";
import { JournalBody, READING_COLUMN } from "@/components/phone/journal-body";
import { JournalRelated } from "@/components/phone/journal-related";
import {
  JOURNAL_FORMAT_LABEL,
  formatPublishDate,
  getPublishedPiece,
  journalArticleJsonLd,
  journalPieces,
} from "@/lib/journal";
import { SITE, toJsonLd, toLang } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import type { Language } from "@/lib/translations";

type PieceParams = { lang: string; slug: string };

const LANGS: Language[] = ["es", "en"];

// ISR (como /videos/[slug]): una pieza con publishAt futuro responde 404 hasta esa hora y su
// <head> no adelanta nada. Se regenera con la primera visita después de 5 minutos.
export const revalidate = 300;

// Todas las piezas, también las futuras (se prerenderizan como 404 y se regeneran). Sin piezas da
// [] y las rutas se renderizan a demanda la primera vez (ISR). Sin dynamicParams.
export function generateStaticParams() {
  return LANGS.flatMap((lang) => journalPieces.map((p) => ({ lang, slug: p.slug })));
}

const copy = {
  es: { notFound: "Pieza no encontrada", by: "Por", coverPhoto: "Foto de portada", back: "Volver al journal" },
  en: { notFound: "Story not found", by: "By", coverPhoto: "Cover photo", back: "Back to the journal" },
} as const;

export async function generateMetadata(
  { params }: { params: Promise<PieceParams> }
): Promise<Metadata> {
  const { lang, slug } = await params;
  const l = toLang(lang);
  // Misma guarda que la página: desconocida o futura → sin título, bajada ni OG.
  const p = getPublishedPiece(slug);
  if (!p) return { title: copy[l].notFound };
  const base = pageMetadata({
    lang: l,
    path: `/journal/${slug}`,
    title: p.title[l],
    description: p.excerpt[l],
    image: { url: `${SITE}/${l}/journal/${slug}/opengraph-image`, width: 1200, height: 630, alt: p.title[l] },
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: p.publishAt,
      authors: [p.author],
      section: JOURNAL_FORMAT_LABEL[p.format],
    },
  };
}

export default async function JournalPiecePage({
  params,
}: {
  params: Promise<PieceParams>;
}) {
  const { lang, slug } = await params;
  const p = getPublishedPiece(slug);
  // Desconocida o con publishAt futuro = 404 (se evalúa en cada regeneración, sin redeploy).
  if (!p) notFound();

  const l = toLang(lang);
  const t = copy[l];
  const date = formatPublishDate(p, l);

  return (
    <>
      <Navigation />
      <main id="contenido" tabIndex={-1} className="relative min-h-screen overflow-x-hidden noise-overlay">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(journalArticleJsonLd(p, l)) }}
        />
        {/* El article envuelve el hero: su h1 (el título de la pieza) es el encabezado del article. */}
        <article>
          {/* La portada es el hero y el LCP (eager + prioridad alta en PageHero). En móvil, el recorte
              4:5 si la pieza lo trae; si no, la misma 16:9. */}
          <PageHero
            image={{ desktop: p.cover.src, mobile: p.cover.mobile?.src ?? p.cover.src, alt: p.cover.alt }}
            title={p.title[l]}
            eyebrow={
              <>
                {/* Las etiquetas de formato van en español en los dos idiomas (decisión editorial pendiente). */}
                <span lang={l === "en" ? "es" : undefined}>{JOURNAL_FORMAT_LABEL[p.format]}</span> · {date}
              </>
            }
            titleClassName="text-4xl lg:text-7xl"
            imagePosition={p.cover.position}
            lang={l}
          />

          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-16 lg:pb-24">
            <Link
              href={`/${l}/journal`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden />
              {t.back}
            </Link>

            <header className={`${READING_COLUMN} mb-12 lg:mb-16`}>
              <p className="text-xl lg:text-2xl text-foreground/85 leading-relaxed">{p.excerpt[l]}</p>
              <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {t.by} {p.author} · <time dateTime={p.publishAt}>{date}</time>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t.coverPhoto}: {p.cover.credit}
              </p>
            </header>

            <JournalBody blocks={p.body[l]} lang={l} />
          </div>
        </article>

        <JournalRelated piece={p} lang={l} />
      </main>
      <FooterSection />
    </>
  );
}
