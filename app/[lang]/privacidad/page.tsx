import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { ConsentResetButton } from "@/components/consent/consent-reset-button";
import { pageMetadata } from "@/lib/seo";

type LangParams = { lang: string };

const LAST_UPDATED = "2026-10-26";

export async function generateMetadata(
  { params }: { params: Promise<LangParams> }
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  return pageMetadata({
    lang,
    path: "/privacidad",
    title: isEs ? "Política de privacidad" : "Privacy policy",
    description: isEs
      ? "Política de privacidad de PHŌNÉ Records: qué datos recolectamos, cómo los usamos, cookies y derechos del usuario bajo Ley 19.628 (Chile) y GDPR (UE)."
      : "PHŌNÉ Records privacy policy: what data we collect, how we use it, cookies and user rights under Ley 19.628 (Chile) and GDPR (EU).",
  });
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
        body: `PHŌNÉ Records · Ñuñoa, Región Metropolitana, Chile. Canal de contacto para asuntos de privacidad: formulario en phonerecords.cl/es/contacto.`,
      },
      {
        title: "2 · Datos que recolectamos",
        body: `Cuando visitas el sitio sin enviarnos formularios, no activamos cookies ni identificadores de analítica sin tu consentimiento.

Siempre, sin necesidad de consentimiento:
— Una cookie técnica llamada "phone_lang" para recordar tu preferencia de idioma (ES o EN). Esta cookie vive un año y se elimina cuando borras las cookies de tu navegador.
— Una cookie técnica llamada "phone_consent" que guarda tu decisión sobre la analítica ("granted" si aceptas, "denied" si rechazas) para no volver a preguntarte. Misma duración.
— Vercel Web Analytics, que cuenta visitas sin almacenar la dirección IP, sin huella digital, sin cookies de seguimiento. No usa cookies.
— Vercel Speed Insights, que mide rendimiento de carga (LCP, INP, CLS) sin cookies.

Sin tu consentimiento (si rechazas o aún no decides):
— Google Tag Manager y Google Analytics 4 se cargan igualmente, pero en modo de consentimiento (Consent Mode de Google) con el almacenamiento de analítica denegado: no guardan cookies ni identificadores de analítica y solo reciben datos técnicos, sin cookies ni identificadores persistentes; Google puede recibir datos técnicos como la página visitada.
— Ahrefs Analytics no se carga.

Solo con tu consentimiento (si aceptas en el banner de cookies):
— Google Analytics 4, cargado mediante Google Tag Manager, activa cookies e identificadores de analítica (por ejemplo "_ga" y "_ga_*") para medir cómo se usa el sitio (páginas vistas, origen del tráfico, tipo de dispositivo).
— Se carga Ahrefs Analytics (analytics.ahrefs.com), que mide visitas y fuentes de tráfico.

Cómo cambiar tu decisión: puedes borrar las cookies de este sitio en tu navegador o usar el botón al final de esta sección, que elimina "phone_consent" y vuelve a mostrar el banner.

Si nos escribes por el formulario de contacto (phonerecords.cl/es/contacto), conservamos tu nombre, email y mensaje para responderte. No lo usamos para nada más. Si envías una propuesta de artista, guardamos también los enlaces y la ciudad que indiques, solo para evaluarla. Si nos escribes por servicios de dirección creativa, diseño y prensa, guardamos también los servicios que te interesan, el tipo de proyecto, la fecha estimada de lanzamiento y los enlaces que compartas, solo para responder tu consulta.`,
        consentButton: "Cambiar mi decisión de cookies",
      },
      {
        title: "3 · Cómo usamos los datos",
        body: `— La preferencia de idioma se usa únicamente para servir el contenido en el idioma que elegiste.
— Tu decisión sobre cookies ("phone_consent") se usa solo para recordar si cargar o no la analítica con consentimiento.
— Si aceptas, la analítica completa (Google Analytics 4 y Ahrefs Analytics) nos ayuda a entender qué páginas funcionan y cuáles no, para mejorar el sitio. Sin consentimiento, Google solo recibe datos técnicos, sin cookies ni identificadores persistentes; Google puede recibir datos técnicos como la página visitada.
— Las analíticas de Vercel y los datos de Speed Insights se usan para medir el uso y optimizar la velocidad de carga.
— No vendemos, alquilamos ni compartimos tus datos con terceros para marketing.`,
      },
      {
        title: "4 · Compartición con terceros",
        body: `El sitio se aloja en Vercel (vercel.com). Sus servicios procesan las solicitudes que llegan al sitio para servir las páginas. Vercel actúa como encargado de tratamiento bajo sus propios términos de privacidad (https://vercel.com/legal/privacy-policy).

Google (Google Analytics 4 y Google Tag Manager; política en policies.google.com/privacy) está presente en el sitio aunque no aceptes la analítica, pero en ese caso opera en modo de consentimiento: solo recibe datos técnicos, sin cookies ni identificadores persistentes; Google puede recibir datos técnicos como la página visitada. Solo si aceptas, se activan las cookies e identificadores de analítica de Google Analytics 4 y se carga Ahrefs (Ahrefs Analytics; política en ahrefs.com/privacy), que recibe datos de navegación del sitio para generar estadísticas de uso.

Los embeds de Spotify (open.spotify.com) en las fichas de artista y de lanzamiento cargan contenido directamente desde Spotify cuando interactúas con ellos. Spotify puede establecer sus propias cookies; sus términos están en spotify.com/legal/privacy-policy.

Los videos de YouTube se insertan con el dominio de privacidad mejorada (youtube-nocookie.com). Al cargar el reproductor, YouTube/Google recibe datos técnicos y, si reproduces el video, puede guardar cookies o almacenamiento local. Más información en policies.google.com/privacy. Los reproductores se cargan solo cuando pulsas reproducir.

No utilizamos Meta Pixel ni publicidad de terceros.`,
      },
      {
        title: "5 · Tus derechos",
        body: `Bajo la Ley 19.628 y el GDPR (si te encuentras en la UE):

— Acceso: puedes pedir copia de los datos que tenemos sobre ti.
— Rectificación: puedes pedir que corrijamos datos inexactos.
— Cancelación / supresión: puedes pedir que eliminemos tus datos.
— Oposición: puedes oponerte al tratamiento.
— Portabilidad (GDPR): puedes pedir tus datos en formato estructurado.
— Retirar el consentimiento: puedes cambiar o retirar tu decisión sobre la analítica en cualquier momento (ver sección 2).

Para ejercer cualquiera de estos derechos, escríbenos por el formulario en phonerecords.cl/es/contacto. Te respondemos en un plazo máximo de 30 días.`,
      },
      {
        title: "6 · Retención",
        body: `— Cookies técnicas ("phone_lang", "phone_consent"): 1 año desde que se establecen, salvo que borres las cookies de tu navegador.
— Cookies de analítica de Google (solo con consentimiento): la duración la define Google; puedes eliminarlas en cualquier momento borrando las cookies del sitio.
— Correos recibidos: conservados mientras tenga sentido para mantener la conversación; máximo 5 años.
— Datos de analíticas (Google Analytics, Ahrefs, Vercel): se usan en conjunto; cada proveedor los retiene según sus políticas y la configuración de nuestras cuentas.`,
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
        title: "9 · Newsletter",
        body: `Si te suscribes al newsletter (desde el bloque "Newsletter" de phonerecords.cl/es/contacto, desde la portada o marcando la casilla opcional del formulario de contacto), guardamos:
— Tu correo electrónico.
— Tu idioma (ES o EN) y el origen de la suscripción (portada, contacto o formulario de contacto).
— La fecha de tu consentimiento y el texto exacto que aceptaste.
— Un hash (huella irreversible) de tu dirección IP combinado con una sal que cambia cada día. No guardamos tu IP.

Finalidad: enviarte novedades de PHŌNÉ Records (lanzamientos, conciertos, journal). No usamos estos datos para otra cosa ni los compartimos con terceros para marketing.

Base legal: tu consentimiento, que puedes retirar en cualquier momento.

Cómo darte de baja: responde a cualquier correo del newsletter pidiendo la baja, o escríbenos por el formulario de phonerecords.cl/es/contacto. La baja automática con un enlace en cada correo llegará más adelante.

Proveedor de envío: por definir. Hoy no enviamos newsletters con ningún proveedor externo; cuando elijamos uno, actualizaremos esta sección antes de usarlo. Los datos se almacenan en una base de datos Postgres alojada en Neon (a través de Vercel).

Retención: mientras estés suscrito. Si te das de baja, conservamos tu correo marcado como "dado de baja" para no volver a escribirte, hasta que pidas su eliminación.`,
      },
      {
        title: "10 · Contacto",
        body: `Para cualquier consulta sobre privacidad o protección de datos:

phonerecords.cl/es/contacto
PHŌNÉ Records
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
        body: `PHŌNÉ Records · Ñuñoa, Región Metropolitana, Chile. Contact channel for privacy matters: form at phonerecords.cl/en/contacto.`,
      },
      {
        title: "2 · Data we collect",
        body: `When you visit the site without sending us forms, we do not activate analytics cookies or identifiers without your consent.

Always, no consent needed:
— A technical cookie called "phone_lang" to remember your language preference (ES or EN). This cookie lives one year and is deleted when you clear your browser cookies.
— A technical cookie called "phone_consent" that stores your analytics decision ("granted" if you accept, "denied" if you reject) so we don't ask again. Same duration.
— Vercel Web Analytics, which counts visits without storing the IP address, without fingerprinting, without tracking cookies. It uses no cookies.
— Vercel Speed Insights, which measures load performance (LCP, INP, CLS) without cookies.

Without your consent (if you reject or haven't decided yet):
— Google Tag Manager and Google Analytics 4 still load, but in consent mode (Google Consent Mode) with analytics storage denied: they do not store analytics cookies or identifiers and only receive technical data, without cookies or persistent identifiers; Google may receive technical data such as the page visited.
— Ahrefs Analytics is not loaded.

Only with your consent (if you accept in the cookie banner):
— Google Analytics 4, loaded through Google Tag Manager, activates analytics cookies and identifiers (for example "_ga" and "_ga_*") to measure how the site is used (page views, traffic source, device type).
— Ahrefs Analytics (analytics.ahrefs.com) is loaded, which measures visits and traffic sources.

How to change your decision: you can clear this site's cookies in your browser or use the button at the end of this section, which removes "phone_consent" and shows the banner again.

If you write to us via the contact form (phonerecords.cl/en/contacto), we keep your name, email and message to respond. We don't use it for anything else. If you send an artist proposal, we also keep the links and the city you provide, only to evaluate it. If you write to us about creative direction, design and press services, we also keep the services you're interested in, the project type, the estimated release date and any links you share, only to answer your inquiry.`,
        consentButton: "Change my cookie choice",
      },
      {
        title: "3 · How we use the data",
        body: `— Language preference is used solely to serve content in the language you chose.
— Your cookie decision ("phone_consent") is used only to remember whether to load consent-based analytics.
— If you accept, full analytics (Google Analytics 4 and Ahrefs Analytics) help us understand which pages work and which don't, to improve the site. Without consent, Google only receives technical data, without cookies or persistent identifiers; Google may receive technical data such as the page visited.
— Vercel analytics and Speed Insights data are used to measure usage and optimise load speed.
— We do not sell, rent or share your data with third parties for marketing.`,
      },
      {
        title: "4 · Third-party sharing",
        body: `The site is hosted on Vercel (vercel.com). Their services process requests reaching the site to serve pages. Vercel acts as data processor under their own privacy terms (https://vercel.com/legal/privacy-policy).

Google (Google Analytics 4 and Google Tag Manager; policy at policies.google.com/privacy) is present on the site even if you do not accept analytics, but in that case it runs in consent mode: it only receives technical data, without cookies or persistent identifiers; Google may receive technical data such as the page visited. Only if you accept are Google Analytics 4's analytics cookies and identifiers activated and Ahrefs (Ahrefs Analytics; policy at ahrefs.com/privacy) loaded, which receives browsing data from the site to produce usage statistics.

Spotify embeds (open.spotify.com) on artist and release pages load content directly from Spotify when you interact with them. Spotify may set their own cookies; their terms are at spotify.com/legal/privacy-policy.

YouTube videos are embedded using the privacy-enhanced domain (youtube-nocookie.com). When the player loads, YouTube/Google receives technical data and, if you play the video, may store cookies or local storage. More information at policies.google.com/privacy. Players load only when you press play.

We do not use Meta Pixel or third-party advertising.`,
      },
      {
        title: "5 · Your rights",
        body: `Under Law 19.628 and GDPR (if you are in the EU):

— Access: you can request a copy of the data we hold about you.
— Rectification: you can request we correct inaccurate data.
— Erasure: you can request we delete your data.
— Objection: you can object to processing.
— Portability (GDPR): you can request your data in a structured format.
— Withdraw consent: you can change or withdraw your analytics decision at any time (see section 2).

To exercise any of these rights, write us via the form at phonerecords.cl/en/contacto. We respond within a maximum of 30 days.`,
      },
      {
        title: "6 · Retention",
        body: `— Technical cookies ("phone_lang", "phone_consent"): 1 year from being set, unless you clear your browser cookies.
— Google analytics cookies (only with consent): duration is set by Google; you can remove them at any time by clearing the site's cookies.
— Received emails: kept while it makes sense to maintain the conversation; maximum 5 years.
— Analytics data (Google Analytics, Ahrefs, Vercel): used in combined form; each provider retains it according to its own policies and our account settings.`,
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
        title: "9 · Newsletter",
        body: `If you subscribe to the newsletter (from the "Newsletter" block at phonerecords.cl/en/contacto, from the home page, or by ticking the optional box in the contact form), we store:
— Your email address.
— Your language (ES or EN) and the source of the subscription (home page, contact page or contact form).
— The date of your consent and the exact text you accepted.
— A hash (irreversible fingerprint) of your IP address combined with a salt that changes daily. We do not store your IP.

Purpose: sending you PHŌNÉ Records news (releases, concerts, journal). We do not use this data for anything else nor share it with third parties for marketing.

Legal basis: your consent, which you can withdraw at any time.

How to unsubscribe: reply to any newsletter email asking to be removed, or write to us via the form at phonerecords.cl/en/contacto. Automatic unsubscribe with a link in every email will come later.

Sending provider: to be decided. Today we do not send newsletters through any external provider; when we choose one, we will update this section before using it. The data is stored in a Postgres database hosted on Neon (through Vercel).

Retention: while you remain subscribed. If you unsubscribe, we keep your email flagged as "unsubscribed" so we don't write to you again, until you ask for its deletion.`,
      },
      {
        title: "10 · Contact",
        body: `For any inquiry about privacy or data protection:

phonerecords.cl/en/contacto
PHŌNÉ Records
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
  const isEs = lang === "es";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://phonerecords.cl/${lang}/privacidad`,
        name: isEs ? "Política de privacidad" : "Privacy policy",
        inLanguage: isEs ? "es-CL" : "en-US",
        isPartOf: { "@id": "https://phonerecords.cl/#organization" },
        dateModified: LAST_UPDATED,
        about: { "@type": "Organization", "@id": "https://phonerecords.cl/#organization" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "PHŌNÉ Records", item: `https://phonerecords.cl/${lang}` },
          { "@type": "ListItem", position: 2, name: isEs ? "Privacidad" : "Privacy", item: `https://phonerecords.cl/${lang}/privacidad` },
        ],
      },
    ],
  };

  return (
    <>
      <main id="contenido" tabIndex={-1} className="relative min-h-screen overflow-x-hidden noise-overlay">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
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
                  {section.consentButton && (
                    <ConsentResetButton label={section.consentButton} />
                  )}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
      <FooterSection />
    </>
  );
}
