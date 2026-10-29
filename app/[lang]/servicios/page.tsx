import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { ServicesStrip } from "@/components/phone/services-strip";
import { ServicesProcess } from "@/components/phone/services-process";
import { ServicesPieces } from "@/components/phone/services-pieces";
import { ServicesJourneys } from "@/components/phone/services-journeys";
import { ServicesClosing } from "@/components/phone/services-closing";
import {
  SERVICES,
  SERVICES_CONTACT,
  SERVICES_PATH,
  getJourneys,
  getStripCovers,
  servicesJsonLd,
} from "@/lib/services";
import { toJsonLd, toLang } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import type { Language } from "@/lib/translations";

// /servicios (pendiente 18): dirección creativa, diseño y prensa para lanzamientos, a la medida
// de cada artista. Los textos viven en lib/services.ts. Diagramación propia, armónica con el
// sitio pero distinta: apertura asimétrica 7/5 con tira de portadas (sin PageHero), línea de
// proceso, filas en zigzag, escalera de recorridos y cierre oscuro; nada de grillas de tarjetas.
// 100 % servidor y sin animaciones.

type LangParams = { lang: string };

export async function generateMetadata(
  { params }: { params: Promise<LangParams> },
): Promise<Metadata> {
  const { lang } = await params;
  const c = SERVICES[toLang(lang)];
  return pageMetadata({
    lang,
    path: SERVICES_PATH,
    title: c.meta.title,
    description: c.meta.description,
  });
}

const CONTAINER = "mx-auto max-w-[1400px] px-6 lg:px-12";
const SECTION = "scroll-mt-24 border-t border-foreground/10 py-20 lg:py-28";
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const SECTION_TITLE = "font-display text-4xl leading-[1.05] tracking-tight text-balance lg:text-6xl";
const SECTION_LEDE = "mt-6 max-w-[60ch] text-lg leading-relaxed text-foreground/80";
// Tamaño del h1 por idioma: "Releasing a record" es ~20 % más ancho que "Lanzar un disco" y a
// text-8xl no cabe en la columna 7/12 (dejaba "record" sola en una línea a 1024 y 1280).
const H1_SIZE: Record<Language, string> = {
  es: "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl",
  en: "text-4xl sm:text-6xl xl:text-7xl",
};

export default async function ServiciosPage({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang: rawLang } = await params;
  const lang = toLang(rawLang);
  const c = SERVICES[lang];
  const contactHref = `/${lang}${SERVICES_CONTACT}`;
  const catalogHref = `/${lang}/catalogo`;

  const index = [
    { id: "punto-de-partida", label: c.start.title },
    { id: "del-master-al-publico", label: c.process.title },
    { id: "piezas", label: c.pieces.title },
    { id: "recorridos", label: c.journeys.title },
    { id: "fondo", label: c.fund.title },
  ] as const;

  return (
    <>
      <Navigation />
      <main id="contenido" tabIndex={-1} className="relative min-h-screen overflow-x-hidden noise-overlay">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(servicesJsonLd(lang)) }}
        />

        {/* 1 · Apertura asimétrica: titular a la izquierda (7/12), tira de portadas a la derecha (5/12) */}
        <section aria-labelledby="servicios-title" className="pb-20 pt-28 lg:pb-28 lg:pt-36">
          <div className={`${CONTAINER} grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8`}>
            <div className="lg:col-span-7">
              <p className="mb-6 inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.1em] text-muted-foreground md:tracking-[0.18em]">
                <span aria-hidden="true" className="h-px w-8 bg-brand" />
                {c.hero.eyebrow}
              </p>
              <h1
                id="servicios-title"
                className={`whitespace-pre-line font-display leading-[0.95] tracking-tight ${H1_SIZE[lang]}`}
              >
                {c.hero.title}
              </h1>
              <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-foreground/80 lg:text-xl">
                {c.hero.lede}
              </p>
              <Link
                href={contactHref}
                className={`mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm text-background transition-colors hover:bg-foreground/90 ${FOCUS}`}
              >
                {c.hero.cta}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <nav aria-label={c.hero.indexLabel} className="mt-12 hidden lg:block">
                <ol className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-widest">
                  {index.map((item, i) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`inline-flex min-h-6 items-center gap-2 rounded-sm text-muted-foreground transition-colors hover:text-foreground ${FOCUS}`}
                      >
                        <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
            <div className="lg:col-span-5">
              <ServicesStrip covers={getStripCovers(lang)} label={c.hero.stripLabel} lang={lang} />
            </div>
          </div>
        </section>

        {/* 2 · Punto de partida: columna estrecha y la cita con la línea roja */}
        <section id="punto-de-partida" aria-labelledby="punto-de-partida-title" className={SECTION}>
          <div className={`${CONTAINER} grid gap-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-16`}>
            <h2
              id="punto-de-partida-title"
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground lg:col-span-3 lg:pt-2"
            >
              {c.start.title}
            </h2>
            <div className="space-y-6 lg:col-span-6">
              {c.start.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="max-w-[60ch] text-lg leading-relaxed text-foreground/85 lg:text-xl">
                  {paragraph}
                </p>
              ))}
            </div>
            <blockquote className="border-l-2 border-brand pl-6 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:col-span-9 lg:col-start-4 lg:text-7xl">
              <p>{c.start.quote}</p>
            </blockquote>
          </div>
        </section>

        {/* 3 · Del master al público: lista ordenada, vertical en móvil y horizontal desde lg */}
        <section id="del-master-al-publico" aria-labelledby="del-master-al-publico-title" className={SECTION}>
          <div className={CONTAINER}>
            <header className="mb-12 lg:mb-16">
              <h2 id="del-master-al-publico-title" className={SECTION_TITLE}>
                {c.process.title}
              </h2>
              <p className={SECTION_LEDE}>{c.process.lede}</p>
            </header>
            <ServicesProcess steps={c.process.steps} />
          </div>
        </section>

        {/* 4 · Piezas que se combinan: filas en zigzag */}
        <section id="piezas" aria-labelledby="piezas-title" className={SECTION}>
          <div className={CONTAINER}>
            <header className="mb-16 lg:mb-20">
              <h2 id="piezas-title" className={SECTION_TITLE}>
                {c.pieces.title}
              </h2>
              <p className={SECTION_LEDE}>{c.pieces.lede}</p>
            </header>
            <ServicesPieces pieces={c.pieces} lang={lang} contactHref={contactHref} />
          </div>
        </section>

        {/* 5 · Recorridos de referencia: escalera de bandas a lo ancho */}
        <section id="recorridos" aria-labelledby="recorridos-title" className={SECTION}>
          <div className={CONTAINER}>
            <header className="mb-12 lg:mb-16">
              <h2 id="recorridos-title" className={SECTION_TITLE}>
                {c.journeys.title}
              </h2>
              <p className={SECTION_LEDE}>{c.journeys.lede}</p>
              <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-muted-foreground">{c.journeys.base}</p>
            </header>
            <ServicesJourneys copy={c.journeys} journeys={getJourneys(lang)} />
          </div>
        </section>

        {/* 6 · Fondo de la Música: banda breve */}
        <section
          id="fondo"
          aria-labelledby="fondo-title"
          className="scroll-mt-24 border-y border-foreground/10 bg-foreground/[0.03] py-16 lg:py-20"
        >
          <div className={`${CONTAINER} grid gap-6 lg:grid-cols-12 lg:gap-8`}>
            <h2
              id="fondo-title"
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground lg:col-span-4 lg:pt-2"
            >
              {c.fund.title}
            </h2>
            <p className="max-w-[48ch] font-display text-2xl leading-snug tracking-tight sm:text-3xl lg:col-span-8 lg:text-4xl">
              {c.fund.body}
            </p>
          </div>
        </section>

        {/* 7 · Cierre oscuro con los dos llamados */}
        <ServicesClosing copy={c.closing} contactHref={contactHref} catalogHref={catalogHref} />
      </main>
      {/* Fuera de <main>: así el <footer> es un landmark contentinfo real */}
      <FooterSection />
    </>
  );
}
