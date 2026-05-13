import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";

type LangParams = { lang: string };

const LAST_UPDATED = "2026-05-11";

export async function generateMetadata(
  { params }: { params: Promise<LangParams> }
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  return {
    title: isEs ? "Política de privacidad" : "Privacy policy",
    description: isEs
      ? "Política de privacidad de PHŌNÉ Records: qué datos recolectamos, cómo los usamos, cookies y derechos del usuario bajo Ley 19.628 (Chile) y GDPR (UE)."
      : "PHŌNÉ Records privacy policy: what data we collect, how we use it, cookies and user rights under Ley 19.628 (Chile) and GDPR (EU).",
    alternates: {
      canonical: `https://phonerecords.cl/${lang}/privacidad`,
      languages: {
        es: "https://phonerecords.cl/es/privacidad",
        en: "https://phonerecords.cl/en/privacidad",
        "x-default": "https://phonerecords.cl/es/privacidad",
      },
    },
    robots: { index: true, follow: true },
  };
}

const copy = {
  es: {
    eyebrow: "Política de privacidad",
    headline: "Datos personales,\nde forma transparente.",
    intro: `Esta política describe qué datos recolectamos cuando visitas phonerecords.cl, cómo los usamos y los derechos que te corresponden bajo la Ley 19.628 de Chile (Protección de la Vida Privada) y el Reglamento General de Protección de Datos (GDPR) de la Unión Europea cuando aplique.`,
    backHome: "Volver al inicio",
    lastUpdated: "Última actualización",
    sections: [
      {
        title: "1 · Responsable del tratamiento",
        body: `PHŌNÉ Records · representada por Enrique Ariel Camhi Ibarlucea · Eduardo Castillo Velasco 2325, depto A, Ñuñoa, Región Metropolitana, Chile. Canal de contacto para asuntos de privacidad: formulario en phonerecords.cl/es/contacto.`,
      },
      {
        title: "2 · Datos que recolectamos",
        body: `Cuando visitas el sitio sin enviarnos formularios, no recolectamos datos personales identificables.

Sí utilizamos:
— Una cookie técnica llamada "phone_lang" para recordar tu preferencia de idioma (ES o EN). Esta cookie vive un año y se elimina cuando borras las cookies de tu navegador.
— Una cookie técnica llamada "phone_cookie_consent" que registra que viste el banner y no necesitas verlo de nuevo. Misma duración.
— Vercel Web Analytics, que cuenta visitas sin recolectar dirección IP, sin huella digital, sin cookies de seguimiento. Es agregado y anónimo.
— Vercel Speed Insights, que mide rendimiento de carga (LCP, INP, CLS) de forma anónima.

Si nos escribes por el formulario de contacto (phonerecords.cl/es/contacto), conservamos tu nombre, email y mensaje para responderte. No lo usamos para nada más.`,
      },
      {
        title: "3 · Cómo usamos los datos",
        body: `— La preferencia de idioma se usa únicamente para servir el contenido en el idioma que elegiste.
— Las analíticas anónimas nos ayudan a entender qué páginas funcionan y cuáles no, para mejorar el sitio.
— Los datos de Speed Insights se usan para optimizar la velocidad de carga.
— No vendemos, alquilamos ni compartimos tus datos con terceros para marketing.`,
      },
      {
        title: "4 · Compartición con terceros",
        body: `El sitio se aloja en Vercel (vercel.com). Sus servicios procesan las solicitudes que llegan al sitio para servir las páginas. Vercel actúa como encargado de tratamiento bajo sus propios términos de privacidad (https://vercel.com/legal/privacy-policy).

Los embeds de Spotify (open.spotify.com) en las páginas de artista cargan contenido directamente desde Spotify cuando interactúas con ellos. Spotify puede establecer sus propias cookies; sus términos están en spotify.com/legal/privacy-policy.

No utilizamos Google Analytics, Meta Pixel, ni publicidad de terceros.`,
      },
      {
        title: "5 · Tus derechos",
        body: `Bajo la Ley 19.628 y el GDPR (si te encuentras en la UE):

— Acceso: puedes pedir copia de los datos que tenemos sobre ti.
— Rectificación: puedes pedir que corrijamos datos inexactos.
— Cancelación / supresión: puedes pedir que eliminemos tus datos.
— Oposición: puedes oponerte al tratamiento.
— Portabilidad (GDPR): puedes pedir tus datos en formato estructurado.

Para ejercer cualquiera de estos derechos, escríbenos por el formulario en phonerecords.cl/es/contacto. Te respondemos en un plazo máximo de 30 días.`,
      },
      {
        title: "6 · Retención",
        body: `— Cookies técnicas: 1 año desde que se establecen, salvo que borres las cookies de tu navegador.
— Correos recibidos: conservados mientras tenga sentido para mantener la conversación; máximo 5 años.
— Datos de analíticas: agregados y anónimos; Vercel los retiene según sus políticas.`,
      },
      {
        title: "7 · Seguridad",
        body: `El sitio se sirve por HTTPS (TLS 1.3). El acceso al hosting está protegido con autenticación de dos factores. No almacenamos información sensible (tarjetas de crédito, credenciales) en este sitio.`,
      },
      {
        title: "8 · Cambios a esta política",
        body: `Si actualizamos esta política, la nueva versión se publicará en esta misma URL con la fecha de "Última actualización" modificada. Cambios sustanciales se anunciarán en el aviso de cookies del sitio durante al menos 30 días.`,
      },
      {
        title: "9 · Contacto",
        body: `Para cualquier consulta sobre privacidad o protección de datos:

phonerecords.cl/es/contacto
PHŌNÉ Records
Eduardo Castillo Velasco 2325, depto A
Ñuñoa, Región Metropolitana, Chile`,
      },
    ],
  },
  en: {
    eyebrow: "Privacy policy",
    headline: "Personal data,\ntransparently.",
    intro: `This policy describes what data we collect when you visit phonerecords.cl, how we use it, and your rights under Chile's Law 19.628 (Protection of Private Life) and the European Union's General Data Protection Regulation (GDPR) when applicable.`,
    backHome: "Back to home",
    lastUpdated: "Last updated",
    sections: [
      {
        title: "1 · Data controller",
        body: `PHŌNÉ Records · represented by Enrique Ariel Camhi Ibarlucea · Eduardo Castillo Velasco 2325, apt A, Ñuñoa, Región Metropolitana, Chile. Contact channel for privacy matters: form at phonerecords.cl/en/contacto.`,
      },
      {
        title: "2 · Data we collect",
        body: `When you visit the site without sending us forms, we do not collect personally identifiable data.

We do use:
— A technical cookie called "phone_lang" to remember your language preference (ES or EN). This cookie lives one year and is deleted when you clear your browser cookies.
— A technical cookie called "phone_cookie_consent" that registers that you've seen the banner and don't need to see it again. Same duration.
— Vercel Web Analytics, which counts visits without collecting IP address, without fingerprinting, without tracking cookies. It is aggregate and anonymous.
— Vercel Speed Insights, which measures load performance (LCP, INP, CLS) anonymously.

If you write to us via the contact form (phonerecords.cl/en/contacto), we keep your name, email and message to respond. We don't use it for anything else.`,
      },
      {
        title: "3 · How we use the data",
        body: `— Language preference is used solely to serve content in the language you chose.
— Anonymous analytics help us understand which pages work and which don't, to improve the site.
— Speed Insights data is used to optimise load speed.
— We do not sell, rent or share your data with third parties for marketing.`,
      },
      {
        title: "4 · Third-party sharing",
        body: `The site is hosted on Vercel (vercel.com). Their services process requests reaching the site to serve pages. Vercel acts as data processor under their own privacy terms (https://vercel.com/legal/privacy-policy).

Spotify embeds (open.spotify.com) on artist pages load content directly from Spotify when you interact with them. Spotify may set their own cookies; their terms are at spotify.com/legal/privacy-policy.

We do not use Google Analytics, Meta Pixel, or third-party advertising.`,
      },
      {
        title: "5 · Your rights",
        body: `Under Law 19.628 and GDPR (if you are in the EU):

— Access: you can request a copy of the data we hold about you.
— Rectification: you can request we correct inaccurate data.
— Erasure: you can request we delete your data.
— Objection: you can object to processing.
— Portability (GDPR): you can request your data in a structured format.

To exercise any of these rights, write us via the form at phonerecords.cl/en/contacto. We respond within a maximum of 30 days.`,
      },
      {
        title: "6 · Retention",
        body: `— Technical cookies: 1 year from being set, unless you clear your browser cookies.
— Received emails: kept while it makes sense to maintain the conversation; maximum 5 years.
— Analytics data: aggregate and anonymous; Vercel retains them according to their policies.`,
      },
      {
        title: "7 · Security",
        body: `The site is served over HTTPS (TLS 1.3). Access to the hosting is protected with two-factor authentication. We do not store sensitive information (credit cards, credentials) on this site.`,
      },
      {
        title: "8 · Changes to this policy",
        body: `If we update this policy, the new version will be published at this same URL with the "Last updated" date modified. Substantial changes will be announced in the site's cookie notice for at least 30 days.`,
      },
      {
        title: "9 · Contact",
        body: `For any inquiry about privacy or data protection:

phonerecords.cl/en/contacto
PHŌNÉ Records
Eduardo Castillo Velasco 2325, apt A
Ñuñoa, Región Metropolitana, Chile`,
      },
    ],
  },
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang } = await params;
  const c = lang === "es" ? copy.es : copy.en;
  const dateFormatter = new Intl.DateTimeFormat(lang === "es" ? "es-CL" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const lastUpdatedFmt = dateFormatter.format(new Date(LAST_UPDATED));

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />

      <article className="max-w-[1000px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-24">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {c.backHome}
        </Link>

        <header className="mb-20 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            {c.eyebrow}
          </span>
          <h1 className="text-5xl lg:text-7xl font-display tracking-tight leading-[0.95] whitespace-pre-line mb-10">
            {c.headline}
          </h1>
          <p className="text-lg lg:text-xl text-foreground/85 leading-relaxed max-w-3xl">
            {c.intro}
          </p>
          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {c.lastUpdated}: {lastUpdatedFmt}
          </p>
        </header>

        <div className="space-y-16 lg:space-y-20">
          {c.sections.map((section) => (
            <section key={section.title} className="grid lg:grid-cols-12 gap-6 lg:gap-12">
              <h2 className="lg:col-span-4 text-xl lg:text-2xl font-display tracking-tight text-foreground/70">
                {section.title}
              </h2>
              <div className="lg:col-span-8 space-y-5 text-base leading-relaxed text-foreground/90">
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
