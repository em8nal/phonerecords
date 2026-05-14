import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";

type LangParams = { lang: string };

export async function generateMetadata(
  { params }: { params: Promise<LangParams> }
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  return {
    title: isEs ? "Sobre el sello" : "About the label",
    description: isEs
      ? "PHŌNÉ Records: sello cultural independiente con dirección autoral. Producción, management, booking y curaduría desde Santiago de Chile, en diálogo con Europa y Latinoamérica."
      : "PHŌNÉ Records: independent cultural label with authorial direction. Production, management, booking and curation from Santiago, Chile, in dialogue with Europe and Latin America.",
    alternates: {
      canonical: `https://phonerecords.cl/${lang}/sello`,
      languages: {
        es: "https://phonerecords.cl/es/sello",
        en: "https://phonerecords.cl/en/sello",
        "x-default": "https://phonerecords.cl/es/sello",
      },
    },
  };
}

const copy = {
  es: {
    eyebrow: "Sobre PHŌNÉ",
    headline: "Sello cultural\nindependiente.",
    intro:
      "PHŌNÉ Records produce condiciones de existencia para la música independiente: no sólo discos, sino contextos, archivo y trayectorias sostenidas en el tiempo. Operamos como empresa cultural con corazón de atelier desde Santiago de Chile, en diálogo con circuitos europeos vía Ludwig Sound Booking Agency (Heidelberg, Alemania).",
    backHome: "Volver al inicio",
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
        "Representante legal: Enrique Ariel Camhi Ibarlucea",
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
    headline: "Independent\ncultural label.",
    intro:
      "PHŌNÉ Records produces conditions of existence for independent music: not only records, but contexts, archive and trajectories sustained over time. We operate as a cultural enterprise with the heart of an atelier from Santiago de Chile, in dialogue with European circuits via Ludwig Sound Booking Agency (Heidelberg, Germany).",
    backHome: "Back to home",
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
        "Legal representative: Enrique Ariel Camhi Ibarlucea",
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

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicLabel",
        "@id": "https://phonerecords.cl/#organization",
        name: "PHŌNÉ Records",
        url: "https://phonerecords.cl",
        logo: "https://phonerecords.cl/phone-logo-dark.png",
        foundingLocation: { "@type": "Place", name: "Santiago, Chile" },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ñuñoa",
          addressRegion: "Región Metropolitana",
          addressCountry: "CL",
        },
        sameAs: [
          "https://www.instagram.com/phone_records/",
          "https://newenafrobeat.bandcamp.com/music",
          "https://open.spotify.com/artist/0PTJ848ulShbjTx2yqaAlb",
        ],
      },
      {
        "@type": "AboutPage",
        url: `https://phonerecords.cl/${lang}/sello`,
        name: isEs ? "Sobre el sello" : "About the label",
        inLanguage: isEs ? "es-CL" : "en-US",
        isPartOf: { "@id": "https://phonerecords.cl/#organization" },
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
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navigation />

      <article className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-24">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {c.backHome}
        </Link>

        <header className="mb-20 lg:mb-28">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            {c.eyebrow}
          </span>
          <h1 className="text-5xl lg:text-8xl font-display tracking-tight leading-[0.95] whitespace-pre-line">
            {c.headline}
          </h1>
          <p className="mt-12 text-xl lg:text-2xl text-foreground/85 leading-relaxed max-w-3xl">
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

      <FooterSection />
    </main>
  );
}
