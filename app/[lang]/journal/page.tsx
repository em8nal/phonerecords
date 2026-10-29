import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { PageHero } from "@/components/phone/page-hero";
import { JournalCard } from "@/components/phone/journal-card";
import { JournalEmpty } from "@/components/phone/journal-empty";
import { getPublishedPieces, journalIndexJsonLd } from "@/lib/journal";
import { toJsonLd, toLang } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

type LangParams = { lang: string };

// ISR: una pieza aparece sola a la hora de su publishAt. La página se regenera con la primera
// visita después de 5 minutos (stale-while-revalidate), igual que las fichas de lanzamiento.
// Sin headers(), cookies() ni searchParams: seguiría siendo estática con revalidate.
export const revalidate = 300;

export async function generateMetadata(
  { params }: { params: Promise<LangParams> }
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  const pieces = getPublishedPieces();
  return pageMetadata({
    lang,
    path: "/journal",
    title: "Journal",
    description: isEs
      ? "Journal de PHŌNÉ Records: crónicas, entrevistas, track by track y notas detrás de los discos del sello y de sus artistas, con fotos y créditos."
      : "PHŌNÉ Records journal: chronicles, interviews, track-by-track notes and stories behind the label's records and artists, with photos and credits.",
    // Mientras no haya piezas publicadas, el índice no se indexa (y no está en el sitemap).
    noindex: pieces.length === 0,
  });
}

// Alt propio: en la portada esta foto va con alt="" (fondo decorativo); aquí es el hero.
const HERO_ALT = {
  es: "Manos de un DJ sobre una tornamesa y un mezclador en una sesión con humo; foto en blanco y negro",
  en: "A DJ's hands on a turntable and mixer during a smoky session; black-and-white photo",
};

const copy = {
  es: {
    eyebrow: "PHŌNÉ Records",
    backHome: "Volver al inicio",
    intro:
      "Crónicas, entrevistas, track by track y notas de archivo sobre los discos y los artistas del sello, con fotos y créditos completos.",
    listLabel: "Piezas del journal",
  },
  en: {
    eyebrow: "PHŌNÉ Records",
    backHome: "Back to home",
    intro:
      "Chronicles, interviews, track-by-track notes and archive pieces on the label's records and artists, with photos and full credits.",
    listLabel: "Journal stories",
  },
} as const;

export default async function JournalPage({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang } = await params;
  const l = toLang(lang);
  const c = copy[l];
  const pieces = getPublishedPieces();

  return (
    <>
      <Navigation />
      <main id="contenido" tabIndex={-1} className="relative min-h-screen overflow-x-hidden noise-overlay">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(journalIndexJsonLd(l, pieces)) }}
        />
        {/* Tornamesa B/N (la misma foto del bloque Servicios de la portada, allí decorativa). En la
            altura "short" el recorte baja a las manos y al tocadiscos. */}
        <PageHero
          image={{
            desktop: "/media/home/servicios-bg.jpg",
            mobile: "/media/home/servicios-bg-mobile.jpg",
            alt: HERO_ALT,
          }}
          title="Journal"
          eyebrow={c.eyebrow}
          size="short"
          imagePosition="object-[50%_75%] md:object-[50%_70%]"
          lang={l}
        />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-24">
          <Link
            href={`/${l}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden />
            {c.backHome}
          </Link>
          <p className="mb-12 lg:mb-16 text-xl lg:text-2xl text-foreground/85 leading-relaxed max-w-3xl">{c.intro}</p>

          {pieces.length > 0 ? (
            <section aria-label={c.listLabel}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 lg:gap-x-10 lg:gap-y-16">
                {pieces.map((p) => (
                  <JournalCard key={p.slug} piece={p} lang={l} />
                ))}
              </div>
            </section>
          ) : (
            <JournalEmpty lang={l} />
          )}
        </div>
      </main>
      <FooterSection />
    </>
  );
}
