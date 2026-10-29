import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { PageHero } from "@/components/phone/page-hero";
import { FooterSection } from "@/components/landing/footer-section";
import { ORG_ID, WEBSITE_ID, organizationJsonLd, toJsonLd, toLang } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { FAQ, faqMainEntity } from "@/lib/faq";
import { FaqList } from "@/components/phone/faq-list";

type LangParams = { lang: string };

export async function generateMetadata(
  { params }: { params: Promise<LangParams> }
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  return pageMetadata({
    lang,
    path: "/sello",
    title: isEs ? "Sobre el sello" : "About the label",
    description: isEs
      ? "PHŌNÉ Records: sello discográfico, management y producción musical en Santiago de Chile. Cinco artistas, ediciones en vinilo y digital, giras entre Chile y Europa."
      : "PHŌNÉ Records: record label, management and music production in Santiago, Chile. Five artists, vinyl and digital releases, tours between Chile and Europe.",
  });
}

const copy = {
  es: {
    eyebrow: "Sobre PHŌNÉ",
    headline: "Un lugar donde\nla música queda.",
    intro:
      "PHŌNÉ Records es un sello discográfico, una oficina de management y una productora musical con base en Ñuñoa, Santiago de Chile. Trabajamos con cinco artistas: Newen Afrobeat, Klaus B, ecamhi, Con.fusión y Rosario Lircay. Editamos en vinilo y digital, y gestionamos giras entre Chile y Europa.",
    backHome: "Volver al inicio",
    figures: {
      klaus: {
        alt: "Klaus B toca la flauta traversa con audífonos y los ojos cerrados frente a un micrófono de estudio; foto en blanco y negro",
        caption: "Klaus B · sesión de grabación",
      },
      confusion: {
        alt: "Con.fusión (Catalina Aguilera) sonríe con la mano alzada en una azotea de Santiago, edificios al fondo; foto en blanco y negro",
        caption: "Con.fusión · sesión en azotea, agosto 2026",
      },
    },
    modes: {
      title: "Modos de producción",
      lede:
        "PHŌNÉ no activa todas sus áreas en todos los proyectos. Cada obra prioriza uno de tres modos —catálogo, experiencias o memoria— según contexto, escala y sentido.",
      items: [
        {
          name: "Catálogo",
          subtitle: "Lo que queda",
          body: "Desarrollo de un corpus fonográfico coherente y duradero —vinilo y digital— con gestión de derechos, narrativa editorial y valor acumulativo.",
        },
        {
          name: "Experiencias",
          subtitle: "Lo que activa cuerpo y comunidad",
          body: "Creación de acontecimientos musicales —giras, conciertos, residencias, showcases— donde el contexto, el cuerpo y la presencia son centrales.",
        },
        {
          name: "Memoria",
          subtitle: "Lo que legitima y permanece",
          body: "Archivo, documentación y recontextualización de obras y procesos. Reediciones, relato histórico y permanencia cultural.",
        },
      ],
    },
    position: {
      title: "Posicionamiento",
      lede:
        "Tres criterios sostienen la curaduría —de género no importa, importa el criterio— y atraviesan cada decisión de catálogo, arte y gira.",
      items: [
        {
          name: "Territorio",
          body: "Origen, desplazamiento y contexto de circulación. No internacionalizamos la música chilena: desplazamos el centro, produciendo música del mundo desde el sur para el mundo.",
        },
        {
          name: "Cuerpo",
          body: "Ritmo, energía, presencia, performatividad. El cuerpo es infraestructura crítica: ninguna gira ni lanzamiento se planifica sin cuidar quién paga el costo invisible.",
        },
        {
          name: "Tiempo",
          body: "Memoria, proceso, archivo, duración. PHŌNÉ no crece por acumulación: crece por densidad. Nunca sacrificamos tiempo largo por urgencias de tiempo corto.",
        },
      ],
    },
    services: {
      title: "Servicios",
      items: [
        { name: "Sello discográfico", body: "Curaduría, producción ejecutiva, dirección de arte, prensaje en vinilo, distribución digital y físico." },
        { name: "Management de artistas", body: "Booking y negociación de shows, gestión de oportunidades (festivales, circuitos, alianzas), planificación estratégica de la carrera, coordinación general (agenda, equipo, hitos), facturación y administración financiera de la banda." },
        { name: "Producción musical", body: "Producción fonográfica, dirección de sesiones, sesiones en vivo, mezcla y máster en partnership con técnicos del circuito." },
        { name: "Dirección creativa", body: "Identidad visual, dirección de arte para release y campaña, dirección fotográfica, dirección de video y documentación." },
        { name: "Booking y tour management", body: "Conciertos, showcases, giras nacionales e internacionales. Booking EU vía Ludwig Sound Booking Agency (Heidelberg, Alemania)." },
        { name: "PR y prensa", body: "Estrategia de comunicación, press kit, campañas de prensa, gestión de medios y relaciones con curadurías." },
      ],
    },
    contact: {
      title: "Contacto",
      items: [
        { label: "General · Prensa · Booking", value: "Escríbenos por el formulario", href: "/es/contacto" },
        { label: "Booking EU", value: "Ludwig Sound — info@ludwigsound.com", href: "mailto:info@ludwigsound.com" },
      ],
    },
    legal: {
      title: "Datos legales",
      lines: [
        "Domicilio: Ñuñoa, Región Metropolitana, Chile",
      ],
    },
    cta: {
      manifesto: "Leer el manifiesto",
      roster: "Ver el roster",
    },
  },
  en: {
    eyebrow: "About PHŌNÉ",
    headline: "A place where\nmusic stays.",
    intro:
      "PHŌNÉ Records is a record label, a management office and a music production company based in Ñuñoa, Santiago, Chile. We work with five artists: Newen Afrobeat, Klaus B, ecamhi, Con.fusión and Rosario Lircay. We release on vinyl and digital, and we manage tours between Chile and Europe.",
    backHome: "Back to home",
    figures: {
      klaus: {
        alt: "Klaus B plays the flute wearing headphones, eyes closed, in front of a studio microphone; black-and-white photo",
        caption: "Klaus B · recording session",
      },
      confusion: {
        alt: "Con.fusión (Catalina Aguilera) smiles with her hand raised on a Santiago rooftop, buildings behind; black-and-white photo",
        caption: "Con.fusión · rooftop session, August 2026",
      },
    },
    modes: {
      title: "Modes of production",
      lede:
        "PHŌNÉ does not activate all its areas in every project. Each work prioritises one of three modes —catalogue, experiences or memory— according to context, scale and sense.",
      items: [
        {
          name: "Catalogue",
          subtitle: "What stays",
          body: "Building a coherent, lasting phonographic corpus —vinyl and digital— with rights management, editorial narrative and cumulative value.",
        },
        {
          name: "Experiences",
          subtitle: "What activates body and community",
          body: "Creating musical events —tours, concerts, residencies, showcases— where context, body and presence are central.",
        },
        {
          name: "Memory",
          subtitle: "What legitimises and persists",
          body: "Archive, documentation and recontextualisation of works and processes. Reissues, historical narrative and cultural permanence.",
        },
      ],
    },
    position: {
      title: "Position",
      lede:
        "Three criteria sustain the curation —genre is not the point, criterion is— and run through every decision of catalogue, art and tour.",
      items: [
        {
          name: "Territory",
          body: "Origin, displacement and context of circulation. We don't internationalise Chilean music: we displace the centre, producing world music from the south for the world.",
        },
        {
          name: "Body",
          body: "Rhythm, energy, presence, performativity. The body is critical infrastructure: no tour or release is planned without caring for who pays the invisible cost.",
        },
        {
          name: "Time",
          body: "Memory, process, archive, duration. PHŌNÉ does not grow by accumulation: it grows by density. We never sacrifice long time for short-time urgencies.",
        },
      ],
    },
    services: {
      title: "Services",
      items: [
        { name: "Record label", body: "Curation, executive production, art direction, vinyl pressing, digital and physical distribution." },
        { name: "Artist management", body: "Booking and show negotiation, opportunity management (festivals, circuits, alliances), career strategic planning, general coordination (calendar, team, milestones), invoicing and financial administration." },
        { name: "Music production", body: "Phonographic production, session direction, live sessions, mixing and mastering in partnership with circuit engineers." },
        { name: "Creative direction", body: "Visual identity, art direction for release and campaign, photographic direction, video direction and documentation." },
        { name: "Booking and tour management", body: "Concerts, showcases, national and international tours. EU booking via Ludwig Sound Booking Agency (Heidelberg, Germany)." },
        { name: "PR and press", body: "Communication strategy, press kit, press campaigns, media management and curation relationships." },
      ],
    },
    contact: {
      title: "Contact",
      items: [
        { label: "General · Press · Booking", value: "Write us via the contact form", href: "/en/contacto" },
        { label: "EU Booking", value: "Ludwig Sound — info@ludwigsound.com", href: "mailto:info@ludwigsound.com" },
      ],
    },
    legal: {
      title: "Legal information",
      lines: [
        "Address: Ñuñoa, Región Metropolitana, Chile",
      ],
    },
    cta: {
      manifesto: "Read the manifesto",
      roster: "See the roster",
    },
  },
};

export default async function SelloPage({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang } = await params;
  const c = lang === "es" ? copy.es : copy.en;
  const isEs = lang === "es";

  // La organización sale de lib/schema.ts (misma entidad que la portada). La página
  // trata sobre ella (`about`) y es parte del sitio (`isPartOf`, un CreativeWork). También es
  // un FAQPage: `mainEntity` lleva las preguntas frecuentes visibles (lib/faq.ts).
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(lang),
      {
        "@type": ["AboutPage", "FAQPage"],
        "@id": `https://phonerecords.cl/${lang}/sello`,
        url: `https://phonerecords.cl/${lang}/sello`,
        name: isEs ? "Sobre el sello" : "About the label",
        inLanguage: isEs ? "es-CL" : "en-US",
        about: { "@id": ORG_ID },
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: faqMainEntity("sello", lang),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "PHŌNÉ Records", item: `https://phonerecords.cl/${lang}` },
          { "@type": "ListItem", position: 2, name: isEs ? "Sobre el sello" : "About the label", item: `https://phonerecords.cl/${lang}/sello` },
        ],
      },
    ],
  };

  return (
    <>
      <Navigation />
      <main id="contenido" tabIndex={-1} className="relative min-h-screen overflow-x-hidden noise-overlay">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }}
        />
        <PageHero
          image={{
            desktop: "/media/sello/sello-hero.jpg",
            mobile: "/media/sello/sello-hero-mobile.jpg",
            // Un solo alt para los dos recortes (PageHero pinta un único <img>). En escritorio (42svh,
            // md:object-[50%_5%]) solo se ve el 36-47 % superior de la foto: el DJ con gorro y bufanda,
            // la cabeza de la mujer y apenas el jockey del hombre. Los micrófonos, la tornamesa y la
            // banca quedan bajo el borde, así que el alt no los nombra. En móvil el DJ sale a medias.
            alt: {
              es: "Con.fusión e invitados en la sesión La Banca: detrás, un DJ de pie con gorro de lana y bufanda; delante, un hombre con jockey y una mujer de pelo largo y rizado; escenario oscuro, foto en blanco y negro",
              en: "Con.fusión and guests at the La Banca session: behind, a DJ in a beanie and scarf standing; in front, a man in a baseball cap and a woman with long curly hair; dark stage, black-and-white photo",
            },
          }}
          title={c.headline}
          eyebrow={c.eyebrow}
          imagePosition="object-[50%_30%] md:object-[50%_5%]"
          lang={lang === "es" ? "es" : "en"}
        />

        <article className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-24">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {c.backHome}
          </Link>

          <header className="mb-20 lg:mb-28">
            <p className="text-xl lg:text-2xl text-foreground/85 leading-relaxed max-w-3xl">
              {c.intro}
            </p>
          </header>

          {/* Modes of production */}
          <section className="mb-20 lg:mb-28">
            <h2 className="text-3xl lg:text-5xl font-display tracking-tight mb-6">
              {c.modes.title}
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed max-w-3xl mb-12">
              {c.modes.lede}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
              {c.modes.items.map((mode, i) => (
                <div key={mode.name} className="bg-background p-8 lg:p-10 flex flex-col">
                  <div className="font-mono text-xs text-muted-foreground mb-4">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-2xl font-display tracking-tight mb-1">{mode.name}</h3>
                  <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                    {mode.subtitle}
                  </div>
                  <p className="text-base text-foreground/75 leading-relaxed">{mode.body}</p>
                </div>
              ))}
            </div>
          </section>

          <figure className="mb-20 lg:mb-28">
            <div className="relative aspect-video overflow-hidden border border-foreground/10 bg-foreground/5">
              <Image
                src="/media/klaus-b/destellos-hero.jpg"
                alt={c.figures.klaus.alt}
                fill
                sizes="(min-width: 1200px) 1104px, (min-width: 1024px) calc(100vw - 96px), calc(100vw - 48px)"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {c.figures.klaus.caption}
            </figcaption>
          </figure>

          {/* Position / criteria */}
          <section className="mb-20 lg:mb-28">
            <h2 className="text-3xl lg:text-5xl font-display tracking-tight mb-6">
              {c.position.title}
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed max-w-3xl mb-12">
              {c.position.lede}
            </p>
            <div className="space-y-px bg-foreground/10 border border-foreground/10">
              {c.position.items.map((item, i) => (
                <div
                  key={item.name}
                  className="bg-background grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 p-8 lg:p-10"
                >
                  <div className="md:col-span-3">
                    <div className="font-mono text-xs text-muted-foreground mb-2">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="text-2xl font-display tracking-tight">{item.name}</h3>
                  </div>
                  <p className="md:col-span-9 text-base text-foreground/80 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <figure className="mb-20 lg:mb-28">
            <div className="relative aspect-video overflow-hidden border border-foreground/10 bg-foreground/5">
              <Image
                src="/media/con-fusion/cuantas-veces-hero.jpg"
                alt={c.figures.confusion.alt}
                fill
                sizes="(min-width: 1200px) 1104px, (min-width: 1024px) calc(100vw - 96px), calc(100vw - 48px)"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {c.figures.confusion.caption}
            </figcaption>
          </figure>

          {/* Services */}
          <section className="mb-20 lg:mb-28">
            <h2 className="text-3xl lg:text-5xl font-display tracking-tight mb-12">
              {c.services.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10">
              {c.services.items.map((service, i) => (
                <div key={service.name} className="bg-background p-8 lg:p-10">
                  <div className="font-mono text-xs text-muted-foreground mb-4">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-xl font-display tracking-tight mb-3">{service.name}</h3>
                  <p className="text-base text-foreground/75 leading-relaxed">{service.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="mb-20 lg:mb-28">
            <h2 className="text-3xl lg:text-5xl font-display tracking-tight mb-12">
              {c.contact.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {c.contact.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-baseline justify-between border-b border-foreground/10 pb-4 hover:border-foreground/30 transition-colors"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-base flex items-center gap-2">
                    {item.value}
                    <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* Preguntas frecuentes: los mismos textos van al FAQPage del JSON-LD */}
          <section aria-labelledby="faq-heading" className="mb-20 lg:mb-28">
            <h2 id="faq-heading" className="text-3xl lg:text-5xl font-display tracking-tight mb-12">
              {isEs ? "Preguntas frecuentes" : "Frequently asked questions"}
            </h2>
            <FaqList items={FAQ.sello[toLang(lang)]} lang={toLang(lang)} />
          </section>

          {/* Legal */}
          <section className="mb-16 pb-12 border-t border-foreground/10 pt-12">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
              {c.legal.title}
            </h2>
            <div className="text-sm text-foreground/70 space-y-1">
              {c.legal.lines.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </section>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/${lang}/manifiesto`}
              className="inline-flex items-center justify-center px-8 h-14 text-base rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              {c.cta.manifesto}
            </Link>
            <Link
              href={`/${lang}#roster`}
              className="inline-flex items-center justify-center px-8 h-14 text-base rounded-full border border-foreground/20 hover:bg-foreground/5 transition-colors"
            >
              {c.cta.roster}
            </Link>
          </div>
        </article>
      </main>
      <FooterSection />
    </>
  );
}
