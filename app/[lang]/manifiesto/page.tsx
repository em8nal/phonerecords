import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";

type LangParams = { lang: string };

export async function generateMetadata(
  { params }: { params: Promise<LangParams> }
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  return {
    title: isEs ? "Manifiesto" : "Manifesto",
    description: isEs
      ? "PHŌNÉ Records produce condiciones de existencia para la música independiente: marco, circulación y dirección autoral. Un sello, un atelier creativo, un dispositivo cultural."
      : "PHŌNÉ Records produces conditions of existence for independent music: framework, circulation and authorial direction. A label, a creative atelier, a cultural device.",
    alternates: {
      canonical: `https://phonerecords.cl/${lang}/manifiesto`,
      languages: {
        es: "https://phonerecords.cl/es/manifiesto",
        en: "https://phonerecords.cl/en/manifiesto",
        "x-default": "https://phonerecords.cl/es/manifiesto",
      },
    },
  };
}

const copy = {
  es: {
    eyebrow: "Manifiesto",
    headline: "Producir condiciones,\nno sólo contenidos.",
    intro:
      "PHŌNÉ Records es una empresa cultural independiente con dirección autoral, orientada a la producción integral de obras musicales situadas, la construcción de archivo vivo y el cuidado estratégico de trayectorias artísticas.",
    backHome: "Volver al inicio",
    sections: [
      {
        title: "I · Naturaleza",
        body: `Operamos en la intersección entre creación, gestión, circulación y memoria, articulando prácticas del sello discográfico, el atelier creativo y el dispositivo cultural.

PHŌNÉ no es un sello tradicional ni una productora de servicios. Es un agente productor y articulador de procesos artísticos integrales, organizado en torno a tres lógicas:

— Empresa cultural — gestión, profesionalización, sostenibilidad, estándar.
— Atelier creativo — dirección creativa fuerte, firma estética, cuidado extremo del proceso.
— Dispositivo cultural — produce condiciones de existencia, no sólo resultados.`,
      },
      {
        title: "II · Misión",
        body: `Interrumpir la precariedad estructural del ecosistema musical independiente mediante un modelo profesional, ético y estéticamente coherente que sostenga procesos creativos en el tiempo.

No producimos artistas para el mercado del momento: acompañamos trayectorias en el largo plazo, con representación creativa, estratégica, operativa y simbólica.`,
      },
      {
        title: "III · Visión",
        body: `Posicionarse como referente de curaduría musical independiente latinoamericana, con una identidad estética reconocible y una línea editorial coherente, en diálogo con circuitos globales.

El sur del mundo no como periferia, sino como punto de partida.`,
      },
      {
        title: "IV · Los tres segmentos",
        body: `Audiencia — no oyentes pasivos, comunidad activa que participa, financia y valida el trabajo del sello a través de membresías, formatos físicos y experiencias expandidas.

Colaboradores — red de agentes creativos y técnicos —productores, fotógrafos, diseñadores, sonidistas— que dan forma a cada lanzamiento junto a nosotros.

Artistas — proyectos musicales acompañados con representación integral. Trabajo de largo plazo, no campañas puntuales.`,
      },
      {
        title: "V · Lo memorable",
        body: `Curaduría visible. Línea editorial coherente. Producción que privilegia la narrativa sobre la inmediatez, la atmósfera sobre el impacto, la transformación sobre el clímax.

Música independiente como práctica de largo plazo.`,
      },
    ],
  },
  en: {
    eyebrow: "Manifesto",
    headline: "Producing conditions,\nnot just content.",
    intro:
      "PHŌNÉ Records is an independent cultural enterprise with authorial direction, oriented towards the integral production of situated musical works, the construction of living archive and the strategic care of artistic trajectories.",
    backHome: "Back to home",
    sections: [
      {
        title: "I · Nature",
        body: `We operate at the intersection of creation, management, circulation and memory, articulating practices from the record label, the creative atelier and the cultural device.

PHŌNÉ is not a traditional label nor a service production company. It is a producing agent and articulator of integral artistic processes, organised around three logics:

— Cultural enterprise — management, professionalisation, sustainability, standard.
— Creative atelier — strong creative direction, aesthetic signature, extreme process care.
— Cultural device — produces conditions of existence, not just results.`,
      },
      {
        title: "II · Mission",
        body: `To interrupt the structural precariousness of the independent music ecosystem through a professional, ethical and aesthetically coherent model that sustains creative processes over time.

We don't produce artists for the market of the moment: we accompany trajectories in the long term, with creative, strategic, operational and symbolic representation.`,
      },
      {
        title: "III · Vision",
        body: `To position ourselves as a reference for independent Latin American music curation, with a recognisable aesthetic identity and a coherent editorial line, in dialogue with global circuits.

The southern hemisphere not as periphery, but as starting point.`,
      },
      {
        title: "IV · The three segments",
        body: `Audience — not passive listeners, an active community that participates, finances and validates the label's work through memberships, physical formats and expanded experiences.

Collaborators — a network of creative and technical agents —producers, photographers, designers, sound engineers— who shape every release with us.

Artists — music projects accompanied with integral representation. Long-term work, not one-off campaigns.`,
      },
      {
        title: "V · What is memorable",
        body: `Visible curation. Coherent editorial line. Production that privileges narrative over immediacy, atmosphere over impact, transformation over climax.

Independent music as a long-term practice.`,
      },
    ],
  },
};

export default async function ManifestoPage({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang } = await params;
  const c = lang === "es" ? copy.es : copy.en;

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />

      <article className="max-w-[1100px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-24">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {c.backHome}
        </Link>

        {/* Header */}
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

        {/* Sections */}
        <div className="space-y-20 lg:space-y-28">
          {c.sections.map((section) => (
            <section key={section.title} className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              <h2 className="lg:col-span-4 text-2xl lg:text-3xl font-display tracking-tight text-foreground/70">
                {section.title}
              </h2>
              <div className="lg:col-span-8 space-y-6 text-lg leading-relaxed text-foreground/90">
                {section.body.split(/\n{2,}/).map((p, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>

      <FooterSection />
    </main>
  );
}
