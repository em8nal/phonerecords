import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { PageHero } from "@/components/phone/page-hero";
import { ArtistCardGrid } from "@/components/phone/artist-card-grid";
import { toJsonLd, toLang } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { getAppearances, rosterDescription, rosterJsonLd } from "./roster-index";

// Índice del roster (M13). Estática, como /sello: nada aquí depende de la fecha ni de la
// petición (sin revalidate, headers(), cookies() ni searchParams). Cambia solo con un deploy.

type LangParams = { lang: string };

export async function generateMetadata(
  { params }: { params: Promise<LangParams> }
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  return pageMetadata({
    lang,
    path: "/artistas",
    title: isEs ? "Artistas" : "Artists",
    description: rosterDescription(lang),
  });
}

const copy = {
  es: {
    eyebrow: "Roster",
    title: "Artistas",
    backHome: "Volver al inicio",
    intro:
      "Los artistas con los que PHŌNÉ Records edita, produce y gestiona giras. En cada ficha, la biografía, la discografía, los enlaces oficiales y el press kit; más abajo, los discos donde se cruzan.",
    appears: {
      title: "Aparece en",
      intro: "Lanzamientos de otros artistas del sello que también los acreditan.",
      by: "de",
    },
  },
  en: {
    eyebrow: "Roster",
    title: "Artists",
    backHome: "Back to home",
    intro:
      "The artists PHŌNÉ Records releases, produces and tours with. Each profile has the biography, discography, official links and press kit; further down, the records where their paths cross.",
    appears: {
      title: "Appears on",
      intro: "Releases by other artists on the label that also credit them.",
      by: "by",
    },
  },
} as const;

// Foco sobre fondo claro: anillo en el rojo PHŌNÉ (único acento), como en las fichas.
const LINK_FOCUS =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

export default async function ArtistasPage({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang } = await params;
  const l = toLang(lang);
  const c = copy[l];
  const appearances = getAppearances();

  return (
    <>
      <Navigation />
      <main id="contenido" tabIndex={-1} className="relative min-h-screen overflow-x-hidden noise-overlay">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(rosterJsonLd(l)) }}
        />
        {/* La foto colectiva B/N de /sello (La Banca). En la altura "short" el recorte de escritorio
            baja a los dos de adelante; el móvil 4:5 entra casi entero. */}
        <PageHero
          image={{
            desktop: "/media/sello/sello-hero.jpg",
            mobile: "/media/sello/sello-hero-mobile.jpg",
            alt: {
              es: "Con.fusión e invitados en la sesión La Banca: delante, un hombre con jockey y una mujer de pelo rizado, sentados con micrófonos; detrás, un DJ de pie junto a la tornamesa; escenario oscuro, foto en blanco y negro",
              en: "Con.fusión and guests at the La Banca session: in front, a man in a baseball cap and a woman with curly hair, seated with microphones; behind, a DJ standing at the turntable; dark stage, black-and-white photo",
            },
          }}
          title={c.title}
          eyebrow={c.eyebrow}
          size="short"
          imagePosition="object-[50%_30%] md:object-[50%_38%]"
          lang={l}
        />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16">
          <Link
            href={`/${l}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden />
            {c.backHome}
          </Link>
          <p className="text-xl lg:text-2xl text-foreground/85 leading-relaxed max-w-3xl">{c.intro}</p>
        </div>

        {/* Retratos B/N del roster completo: 2 columnas hasta lg y pickLgCols desde lg, con rellenos. */}
        <div className="mt-12 lg:mt-16">
          <ArtistCardGrid lang={l} heading="Roster" headingId="roster-heading" showAllLink={false} />
        </div>

        {appearances.length > 0 && (
          <section aria-labelledby="appears-heading" className="border-t border-foreground/10">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-24">
              <h2 id="appears-heading" className="text-3xl lg:text-5xl font-display tracking-tight">
                {c.appears.title}
              </h2>
              <p className="mt-4 mb-10 lg:mb-14 text-base lg:text-lg text-foreground/75 leading-relaxed max-w-2xl">
                {c.appears.intro}
              </p>

              <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
                {appearances.map(({ artist, releases }) => (
                  <div key={artist.slug}>
                    <h3 className="font-display text-2xl lg:text-3xl tracking-tight">
                      <Link
                        href={`/${l}/artistas/${artist.slug}`}
                        className={`inline-flex min-h-11 items-center hover:text-muted-foreground transition-colors ${LINK_FOCUS}`}
                      >
                        {artist.name}
                      </Link>
                    </h3>
                    <ul className="mt-4 border-t border-foreground/10">
                      {releases.map((r) => (
                        <li key={r.slug} className="border-b border-foreground/10">
                          <Link
                            href={`/${l}/releases/${r.slug}`}
                            className={`group flex items-center gap-4 py-3 ${LINK_FOCUS}`}
                          >
                            <span className="relative block h-16 w-16 shrink-0 overflow-hidden bg-foreground/5">
                              {r.cover && (
                                <Image src={r.cover} alt="" fill sizes="64px" className="object-cover" />
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block font-display text-lg tracking-tight group-hover:text-muted-foreground transition-colors">
                                {r.title}
                              </span>
                              <span className="block mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                                {c.appears.by} {r.artistName} · {r.year}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <FooterSection />
    </>
  );
}
