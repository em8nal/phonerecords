import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { ContactForm } from "./contact-form";

type LangParams = { lang: string };

export async function generateMetadata(
  { params }: { params: Promise<LangParams> },
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  return {
    title: isEs ? "Contacto" : "Contact",
    description: isEs
      ? "Escríbenos para consultas generales, booking, prensa o trabajo con el sello PHŌNÉ Records."
      : "Write to us for general inquiries, booking, press or working with PHŌNÉ Records.",
    alternates: {
      canonical: `https://phonerecords.cl/${lang}/contacto`,
      languages: {
        es: "https://phonerecords.cl/es/contacto",
        en: "https://phonerecords.cl/en/contacto",
        "x-default": "https://phonerecords.cl/es/contacto",
      },
    },
  };
}

const copy = {
  es: {
    eyebrow: "Contacto",
    headline: "Conversemos.",
    intro:
      "Escríbenos para consultas generales, propuestas de booking, prensa o trabajo con el sello. Respondemos lo antes posible.",
    backHome: "Volver al inicio",
    partners: "Booking EU",
    partnersBody:
      "Para giras y fechas en Europa trabajamos con Ludwig Sound Booking Agency (Heidelberg, Alemania).",
  },
  en: {
    eyebrow: "Contact",
    headline: "Let's talk.",
    intro:
      "Write to us for general inquiries, booking proposals, press or working with the label. We reply as soon as we can.",
    backHome: "Back to home",
    partners: "EU Booking",
    partnersBody:
      "For tours and dates in Europe we work with Ludwig Sound Booking Agency (Heidelberg, Germany).",
  },
} as const;

export default async function ContactoPage({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang } = await params;
  const c = lang === "es" ? copy.es : copy.en;
  const formLang: "es" | "en" = lang === "en" ? "en" : "es";
  const isEs = lang === "es";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `https://phonerecords.cl/${lang}/contacto`,
        name: isEs ? "Contacto" : "Contact",
        inLanguage: isEs ? "es-CL" : "en-US",
        isPartOf: { "@id": "https://phonerecords.cl/#organization" },
        mainEntity: {
          "@type": "Organization",
          "@id": "https://phonerecords.cl/#organization",
          name: "PHŌNÉ Records",
          contactPoint: [
            { "@type": "ContactPoint", contactType: "general", url: `https://phonerecords.cl/${lang}/contacto` },
            { "@type": "ContactPoint", contactType: "booking", url: `https://phonerecords.cl/${lang}/contacto` },
            { "@type": "ContactPoint", contactType: "press", url: `https://phonerecords.cl/${lang}/contacto` },
          ],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "PHŌNÉ Records", item: `https://phonerecords.cl/${lang}` },
          { "@type": "ListItem", position: 2, name: isEs ? "Contacto" : "Contact", item: `https://phonerecords.cl/${lang}/contacto` },
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

      <article className="max-w-[1100px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-24">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {c.backHome}
        </Link>

        <header className="mb-16 lg:mb-24 max-w-3xl">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            {c.eyebrow}
          </span>
          <h1 className="text-5xl lg:text-8xl font-display tracking-tight leading-[0.95] mb-10">
            {c.headline}
          </h1>
          <p className="text-xl text-foreground/85 leading-relaxed">{c.intro}</p>
        </header>

        <section className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <ContactForm lang={formLang} />
          </div>

          <aside className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-foreground/10">
            <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
              {c.partners}
            </h2>
            <p className="text-base leading-relaxed text-foreground/85">
              {c.partnersBody}
            </p>
            <a
              href="mailto:info@ludwigsound.com"
              className="inline-flex items-center gap-2 mt-4 text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Ludwig Sound — info@ludwigsound.com
            </a>
          </aside>
        </section>
      </article>

      <FooterSection />
    </main>
  );
}
