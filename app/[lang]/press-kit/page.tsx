import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { PrintButton } from "@/components/print-button";
import { artists } from "@/lib/artists";
import { getArtistEntries } from "@/lib/catalog";

type LangParams = { lang: string };

const ARTISTS_WITH_PHOTO = new Set([
  "claudio-solis",
  "newen-afrobeat",
  "con-fusion",
  "klaus-brantmayer",
  "ecamhi",
]);

export async function generateMetadata(
  { params }: { params: Promise<LangParams> },
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  return {
    title: isEs ? "Press Kit" : "Press Kit",
    description: isEs
      ? "Press kit PHŌNÉ Records: bio del sello, roster, releases destacados, contacto."
      : "PHŌNÉ Records press kit: label bio, roster, featured releases, contact.",
    alternates: {
      canonical: `https://phonerecords.cl/${lang}/press-kit`,
      languages: {
        es: "https://phonerecords.cl/es/press-kit",
        en: "https://phonerecords.cl/en/press-kit",
        "x-default": "https://phonerecords.cl/es/press-kit",
      },
    },
  };
}

const copy = {
  es: {
    eyebrow: "Press kit",
    headline: "PHŌNÉ Records",
    intro:
      "Sello cultural independiente con dirección autoral. Producción integral, management y curaduría de música independiente latinoamericana en diálogo con circuitos europeos y globales.",
    backHome: "Volver al inicio",
    download: "Imprimir / Guardar PDF",
    sections: {
      label: "Sobre el sello",
      roster: "Roster",
      releases: "Releases destacados",
      contact: "Contacto",
    },
    labelBody:
      "Fundado en Santiago de Chile, PHŌNÉ Records produce condiciones de existencia para la música independiente: marco editorial, dirección de arte, prensaje en vinilo y distribución digital. El sello opera como infraestructura para un roster latinoamericano —Newen Afrobeat, Claudio Solís, Ecamhi, Con.fusión, Klaus Brantmayer y Andrés Abrigo— y construye puentes editoriales con sellos europeos (OfficeHome Records, Aquarians) y agencias de booking (Ludwig Sound, Heidelberg). El catálogo abarca afrobeat, dark minimal, nu-jazz, neo-soul y composición experimental.",
    contactBody:
      "Para consultas de prensa, booking o trabajo con el sello, contacto vía el formulario en phonerecords.cl/es/contacto · Ñuñoa, Santiago de Chile.",
    individualPress: "Press kit individual:",
    seeRelease: "Ver release",
    artistInside: "artistas en el ecosistema",
    releaseCount: (n: number) =>
      n === 1 ? `${n} release publicado` : `${n} releases publicados`,
  },
  en: {
    eyebrow: "Press kit",
    headline: "PHŌNÉ Records",
    intro:
      "Independent cultural label with strong authorial direction. Integral production, management and curation of independent Latin American music in dialogue with European and global circuits.",
    backHome: "Back to home",
    download: "Print / Save as PDF",
    sections: {
      label: "About the label",
      roster: "Roster",
      releases: "Featured releases",
      contact: "Contact",
    },
    labelBody:
      "Founded in Santiago de Chile, PHŌNÉ Records produces conditions of existence for independent music: editorial frame, art direction, vinyl pressing and digital distribution. The label operates as infrastructure for a Latin American roster —Newen Afrobeat, Claudio Solís, Ecamhi, Con.fusión, Klaus Brantmayer and Andrés Abrigo— and builds editorial bridges with European labels (OfficeHome Records, Aquarians) and booking agencies (Ludwig Sound, Heidelberg). The catalogue spans afrobeat, dark minimal, nu-jazz, neo-soul and experimental composition.",
    contactBody:
      "For press inquiries, booking or working with the label, contact us via the form at phonerecords.cl/en/contacto · Ñuñoa, Santiago de Chile.",
    individualPress: "Individual press kit:",
    seeRelease: "View release",
    artistInside: "artists in the ecosystem",
    releaseCount: (n: number) =>
      n === 1 ? `${n} release published` : `${n} releases published`,
  },
} as const;

export default async function PressKitPage({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang } = await params;
  const isEs = lang === "es";
  const c = isEs ? copy.es : copy.en;

  // For each artist, compute counts and pick a representative release (with cover if any).
  const rosterRows = artists.map((a) => {
    const entries = getArtistEntries(a.slug);
    const sample = entries.find((e) => e.cover) ?? entries[0];
    return {
      slug: a.slug,
      name: a.name,
      genres: a.genres,
      origin: a.origin,
      bio: isEs ? a.bio.es : a.bio.en,
      links: a.links,
      releaseCount: entries.length,
      sampleCover: sample?.cover,
      sampleTitle: sample?.title,
    };
  });

  const totalReleases = rosterRows.reduce((s, r) => s + r.releaseCount, 0);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `https://phonerecords.cl/${lang}/press-kit`,
        name: "Press Kit — PHŌNÉ Records",
        inLanguage: isEs ? "es-CL" : "en-US",
        isPartOf: { "@id": "https://phonerecords.cl/#organization" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "PHŌNÉ Records", item: `https://phonerecords.cl/${lang}` },
          { "@type": "ListItem", position: 2, name: "Press kit", item: `https://phonerecords.cl/${lang}/press-kit` },
        ],
      },
    ],
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay print:noise-overlay-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navigation />

      <article className="max-w-[1100px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-24 print:pt-8">
        <div className="flex items-center justify-between mb-12 print:hidden">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {c.backHome}
          </Link>
          <PrintButton label={c.download} />
        </div>

        {/* Header */}
        <header className="mb-16 lg:mb-20 max-w-3xl">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            {c.eyebrow}
          </span>
          <h1 className="text-5xl lg:text-7xl font-display tracking-tight leading-[0.95] mb-10">
            {c.headline}
          </h1>
          <p className="text-lg lg:text-xl text-foreground/85 leading-relaxed">
            {c.intro}
          </p>
        </header>

        {/* Section: label */}
        <section className="mb-16 grid lg:grid-cols-12 gap-6 lg:gap-12">
          <h2 className="lg:col-span-4 text-2xl lg:text-3xl font-display tracking-tight text-foreground/70">
            {c.sections.label}
          </h2>
          <div className="lg:col-span-8 text-base leading-relaxed text-foreground/90">
            {c.labelBody}
          </div>
        </section>

        {/* Section: roster */}
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-2xl lg:text-3xl font-display tracking-tight">
              {c.sections.roster}
            </h2>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {rosterRows.length} {c.artistInside}
            </span>
          </div>
          <div className="space-y-12">
            {rosterRows.map((r) => {
              const introLine =
                r.bio.split("\n").find((line) => line.trim().length > 0) ?? "";
              return (
                <div
                  key={r.slug}
                  className="grid lg:grid-cols-12 gap-6 lg:gap-10 pb-12 border-b border-foreground/10 last:border-0"
                >
                  <div className="lg:col-span-3">
                    <div className="relative aspect-square bg-foreground/5 overflow-hidden rounded">
                      {ARTISTS_WITH_PHOTO.has(r.slug) ? (
                        <Image
                          src={`/artists/${r.slug}.jpg`}
                          alt={r.name}
                          fill
                          sizes="(min-width: 1024px) 25vw, 100vw"
                          className="object-cover"
                        />
                      ) : r.sampleCover ? (
                        <Image
                          src={r.sampleCover}
                          alt={`${r.name} — ${r.sampleTitle}`}
                          fill
                          sizes="(min-width: 1024px) 25vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40 font-display text-3xl tracking-widest">
                          PHŌNÉ
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="lg:col-span-9 space-y-3">
                    <div className="flex items-baseline gap-4 flex-wrap">
                      <h3 className="text-2xl lg:text-3xl font-display tracking-tight">
                        <Link
                          href={`/${lang}/artistas/${r.slug}`}
                          className="hover:text-foreground/70 transition-colors"
                        >
                          {r.name}
                        </Link>
                      </h3>
                      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {r.origin}
                      </span>
                    </div>
                    <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {r.genres.join(" · ")} · {c.releaseCount(r.releaseCount)}
                    </div>
                    <p className="text-sm lg:text-base leading-relaxed text-foreground/90">
                      {introLine}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                      <span>{c.individualPress}</span>
                      <Link
                        href={`/press/${lang}/${r.slug}`}
                        className="text-foreground/80 hover:text-foreground transition-colors underline underline-offset-4"
                      >
                        /press/{lang}/{r.slug}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: contact */}
        <section className="mb-16 grid lg:grid-cols-12 gap-6 lg:gap-12">
          <h2 className="lg:col-span-4 text-2xl lg:text-3xl font-display tracking-tight text-foreground/70">
            {c.sections.contact}
          </h2>
          <div className="lg:col-span-8 text-base leading-relaxed text-foreground/90">
            {c.contactBody}
          </div>
        </section>

        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground/60 pt-8 border-t border-foreground/10">
          phonerecords.cl · {totalReleases} releases · {new Date().getFullYear()}
        </div>
      </article>

      <FooterSection />
    </main>
  );
}
