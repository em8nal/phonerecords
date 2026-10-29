import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { ConsentResetButton } from "@/components/consent/consent-reset-button";
import { pageMetadata } from "@/lib/seo";
import { LABEL_EMAIL } from "@/lib/schema";

type LangParams = { lang: string };

// Versión 2 (lote 4, carril Q): reescrita para lo que la Ley 21.719 exige informar desde el
// 01-12-2026. El integrador ajusta LAST_UPDATED al día en que se publica. Revisión legal
// recomendada antes del 01-12 (ver carrilQ-report.md: representante legal, menores, GA4).
const LAST_UPDATED = "2026-10-29";
const POLICY_VERSION = "2";

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
      ? "Qué datos tratamos, para qué y tus derechos según la Ley 19.628, con las modificaciones de la Ley 21.719 (rigen desde el 1 de diciembre de 2026)."
      : "What data PHŌNÉ Records processes, why, and your rights under Chile's Law 19.628 as amended by Law 21.719 (in force from 1 December 2026) and the GDPR.",
  });
}

const copy = {
  es: {
    eyebrow: "Política de privacidad",
    headline: "Datos personales,\nde forma transparente.",
    intro: `Esta política explica qué datos personales tratamos cuando visitas phonerecords.cl o nos escribes, para qué y con qué base, cuánto tiempo los guardamos y cómo ejercer tus derechos. Sigue la Ley 19.628 de Chile, con las modificaciones de la Ley 21.719 (rigen desde el 1 de diciembre de 2026), y el Reglamento General de Protección de Datos (RGPD) de la Unión Europea cuando aplique.`,
    backHome: "Volver al inicio",
    version: "Versión",
    lastUpdated: "Última actualización",
    sections: [
      {
        title: "1 · Responsable",
        body: `PHŌNÉ Records · Ñuñoa, Región Metropolitana, Chile.

Para cualquier asunto de privacidad o para ejercer tus derechos, escríbenos a ${LABEL_EMAIL} o usa el formulario de phonerecords.cl/es/contacto.`,
      },
      {
        title: "2 · Qué datos tratamos y de quién",
        body: `Tratamos datos de tres grupos de personas: quienes visitan el sitio, quienes nos escriben por el formulario de contacto y quienes se suscriben al newsletter.

— Visitantes: tu preferencia de idioma, tu decisión sobre cookies y datos técnicos de navegación (página visitada, origen del tráfico, tipo de dispositivo y navegador); solo si aceptas la analítica, también identificadores de analítica.
— Contacto: nombre, correo, asunto y mensaje. Con una propuesta de artista, también los enlaces y la ciudad que indiques; con una consulta por servicios de dirección creativa, diseño y prensa, los servicios que te interesan, el tipo de proyecto, la fecha estimada de lanzamiento y los enlaces que compartas.
— Newsletter: tu correo, tu idioma (ES o EN), el origen de la suscripción (portada, contacto, pie de página o formulario de contacto), la fecha y el texto exacto del consentimiento que aceptaste y un hash (huella irreversible) de tu dirección IP combinado con una sal que cambia cada día. No guardamos tu IP.

Origen de los datos: los entregas tú o los genera tu navegador al visitar el sitio. No obtenemos datos de fuentes de acceso público ni de terceros.`,
      },
      {
        title: "3 · Para qué los usamos y con qué base",
        body: `— Responder consultas de booking, propuestas de artista y consultas por servicios: lo hacemos porque nos pediste una respuesta antes de un posible acuerdo (medidas precontractuales a tu solicitud).
— Responder mensajes generales, de prensa o sobre el sello: nuestro interés legítimo en contestar lo que nos escribes.
— Enviarte el newsletter con novedades de PHŌNÉ Records (lanzamientos, conciertos y journal) y guardar el respaldo de tu suscripción: tu consentimiento.
— Analítica completa con cookies (Google Analytics 4) y Ahrefs Analytics: tu consentimiento.
— Analítica sin cookies (Vercel Web Analytics y Speed Insights), Google en modo de consentimiento denegado y las cookies técnicas "phone_lang" y "phone_consent": nuestro interés legítimo en medir el uso agregado y la velocidad del sitio, y en recordar tu idioma y tu decisión sobre cookies.

No vendemos ni alquilamos tus datos, no los usamos para publicidad ni los compartimos con terceros para marketing.`,
      },
      {
        title: "4 · Cookies y tu decisión",
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

Cómo cambiar tu decisión: puedes borrar las cookies de este sitio en tu navegador o usar el botón al final de esta sección, que elimina "phone_consent" y vuelve a mostrar el banner. Retirar el consentimiento no afecta lo que tratamos antes con tu consentimiento.`,
        consentButton: "Cambiar mi decisión de cookies",
      },
      {
        title: "5 · Con quién los compartimos",
        body: `Estos proveedores reciben datos del sitio, cada uno bajo sus propios términos:
— Vercel (vercel.com): aloja el sitio y sus funciones y presta Web Analytics y Speed Insights. Política: vercel.com/legal/privacy-policy.
— Neon (a través de Vercel): la base de datos Postgres donde se guardan las suscripciones al newsletter.
— Zoho: el correo por el que recibimos los mensajes del formulario de contacto y el respaldo de las suscripciones.
— Google: Google Tag Manager y Google Analytics 4 (con cookies solo si aceptas), y YouTube cuando cargas un video. Política: policies.google.com/privacy.
— Ahrefs: Ahrefs Analytics, solo si aceptas. Política: ahrefs.com/privacy.
— Spotify: los reproductores de las fichas de artista y de lanzamiento cargan contenido directamente desde Spotify cuando interactúas con ellos, y Spotify puede establecer sus propias cookies. Política: spotify.com/legal/privacy-policy.

Los videos de YouTube se insertan con el dominio de privacidad mejorada (youtube-nocookie.com) y el reproductor se carga solo cuando pulsas reproducir. Desde ese momento YouTube/Google recibe datos técnicos y, si reproduces el video, puede guardar cookies o almacenamiento local.

Envío del newsletter: hoy no usamos ningún proveedor externo de envío; cuando elijamos uno, actualizaremos esta sección antes de usarlo.

No utilizamos Meta Pixel ni publicidad de terceros.`,
      },
      {
        title: "6 · Transferencias internacionales",
        body: `Estos proveedores pueden tratar los datos fuera de Chile, principalmente en Estados Unidos; las funciones del sitio corren en São Paulo (Brasil).

Nos amparamos en los términos de tratamiento de datos de cada proveedor. Cuando la Agencia de Protección de Datos Personales publique su listado de países con un nivel adecuado de protección y sus cláusulas modelo, revisaremos esta sección.`,
      },
      {
        title: "7 · Cuánto tiempo los guardamos",
        // TODO(integrador): confirmar en GA4 (Administrar → Recopilación y conservación de datos)
        // el período de conservación (2 o 14 meses) y escribirlo en la línea de Google Analytics 4.
        body: `— Cookies técnicas ("phone_lang", "phone_consent"): 1 año desde que se establecen, salvo que borres las cookies de tu navegador.
— Cookies de analítica de Google (solo con consentimiento): la duración la define Google; puedes eliminarlas en cualquier momento borrando las cookies del sitio.
— Datos de Google Analytics 4: el período de conservación configurado en nuestra cuenta; después, Google los elimina.
— Datos de Vercel Web Analytics, Speed Insights y Ahrefs: según la política de cada proveedor; nosotros los usamos solo en conjunto.
— Mensajes del formulario de contacto: mientras tenga sentido para mantener la conversación; máximo 5 años.
— Newsletter: mientras estés suscrito. Si te das de baja, conservamos tu correo marcado como "dado de baja" para no volver a escribirte, hasta que pidas su eliminación.`,
      },
      {
        title: "8 · Tus derechos y cómo ejercerlos",
        body: `Tienes derecho de acceso, rectificación, supresión, oposición, portabilidad y bloqueo de tus datos personales:
— Acceso: saber si tratamos datos tuyos y obtener una copia.
— Rectificación: corregir datos inexactos, desactualizados o incompletos.
— Supresión: pedir que eliminemos tus datos.
— Oposición: oponerte a un tratamiento, por ejemplo al que hacemos por interés legítimo.
— Portabilidad: recibir tus datos en un formato estructurado y de uso común.
— Bloqueo: pedir que suspendamos temporalmente el tratamiento mientras resolvemos una solicitud de rectificación, supresión u oposición.
— Retirar el consentimiento: en cualquier momento y sin dar razones. Para la analítica, con el botón de la sección 4; para el newsletter, respondiendo a cualquier correo del newsletter o escribiéndonos (la baja con un enlace en cada correo llegará más adelante).

Cómo pedirlo: escríbenos a ${LABEL_EMAIL} o por el formulario de phonerecords.cl/es/contacto, indicando tu nombre, dónde quieres que te respondamos, a qué datos te refieres y qué derecho ejerces.

Plazos: acusamos recibo de tu solicitud y te respondemos dentro de 30 días corridos desde que la recibimos. Si hace falta, ese plazo puede prorrogarse una sola vez por otros 30 días corridos. Una solicitud de bloqueo la respondemos dentro de 2 días hábiles.

Gratuidad: la rectificación, la supresión y la oposición son siempre gratuitas; el acceso es gratuito al menos una vez por trimestre.`,
      },
      {
        title: "9 · Agencia de Protección de Datos Personales",
        body: `Si rechazamos tu solicitud o no te respondemos dentro del plazo, puedes reclamar ante la Agencia de Protección de Datos Personales dentro de 30 días hábiles desde que recibas nuestra respuesta negativa o desde que venza el plazo para responder.`,
      },
      {
        title: "10 · Seguridad",
        body: `El sitio se sirve por HTTPS (TLS 1.3). El acceso al hosting está protegido con autenticación de dos factores. No almacenamos información sensible (tarjetas de crédito, credenciales) en este sitio.

Tu dirección IP nunca se guarda: del newsletter solo conservamos el hash con sal diaria descrito en la sección 2. Los registros de errores del servidor no llevan tus mensajes ni tu correo completo, y tu navegador nunca recibe detalles internos de un error.`,
      },
      {
        title: "11 · Decisiones automatizadas y menores de edad",
        body: `No tomamos decisiones automatizadas ni elaboramos perfiles que produzcan efectos sobre ti.

El sitio no está dirigido a menores de 14 años. Si sabemos que recibimos datos de un menor de 14 años sin el consentimiento de su madre, padre o representante legal, los eliminaremos.`,
      },
      {
        title: "12 · Cambios a esta política",
        body: `Esta es la versión ${POLICY_VERSION} de la política, con la fecha de actualización indicada al inicio. Si la cambiamos, publicaremos la nueva versión en esta misma URL, con un número de versión y una fecha nuevos. Si un cambio requiere tu consentimiento, te lo pediremos antes de aplicarlo.`,
      },
    ],
  },
  en: {
    eyebrow: "Privacy policy",
    headline: "Personal data,\ntransparently.",
    intro: `This policy explains what personal data we process when you visit phonerecords.cl or write to us, why and on what legal basis, how long we keep it and how to exercise your rights. It follows Chile's Law 19.628, as amended by Law 21.719 (in force from 1 December 2026), and the European Union's General Data Protection Regulation (GDPR) where applicable.`,
    backHome: "Back to home",
    version: "Version",
    lastUpdated: "Last updated",
    sections: [
      {
        title: "1 · Data controller",
        body: `PHŌNÉ Records · Ñuñoa, Región Metropolitana, Chile.

For any privacy matter or to exercise your rights, write to ${LABEL_EMAIL} or use the form at phonerecords.cl/en/contacto.`,
      },
      {
        title: "2 · What data we process and whose",
        body: `We process data from three groups of people: those who visit the site, those who write to us through the contact form and those who subscribe to the newsletter.

— Visitors: your language preference, your cookie decision and technical browsing data (page visited, traffic source, device type and browser); only if you accept analytics, also analytics identifiers.
— Contact: name, email, topic and message. With an artist proposal, also the links and the city you provide; with an inquiry about creative direction, design and press services, the services you're interested in, the project type, the estimated release date and any links you share.
— Newsletter: your email, your language (ES or EN), the source of the subscription (home page, contact page, footer or contact form), the date and exact text of the consent you accepted, and a hash (irreversible fingerprint) of your IP address combined with a salt that changes daily. We do not store your IP.

Source of the data: you provide it or your browser generates it when you visit the site. We do not obtain data from publicly accessible sources or from third parties.`,
      },
      {
        title: "3 · Why we use it and on what basis",
        body: `— Answering booking inquiries, artist proposals and services inquiries: because you asked us for an answer before a possible agreement (pre-contractual steps at your request).
— Answering general, press or label messages: our legitimate interest in replying to what you write to us.
— Sending you the newsletter with PHŌNÉ Records news (releases, concerts and journal) and keeping the backup of your subscription: your consent.
— Full analytics with cookies (Google Analytics 4) and Ahrefs Analytics: your consent.
— Cookieless analytics (Vercel Web Analytics and Speed Insights), Google in denied consent mode and the technical cookies "phone_lang" and "phone_consent": our legitimate interest in measuring aggregate use and site speed, and in remembering your language and your cookie decision.

We do not sell or rent your data, use it for advertising or share it with third parties for marketing.`,
      },
      {
        title: "4 · Cookies and your choice",
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

How to change your decision: you can clear this site's cookies in your browser or use the button at the end of this section, which removes "phone_consent" and shows the banner again. Withdrawing consent does not affect what we processed earlier with your consent.`,
        consentButton: "Change my cookie choice",
      },
      {
        title: "5 · Who we share it with",
        body: `These providers receive data from the site, each under its own terms:
— Vercel (vercel.com): hosts the site and its functions and provides Web Analytics and Speed Insights. Policy: vercel.com/legal/privacy-policy.
— Neon (through Vercel): the Postgres database where newsletter subscriptions are stored.
— Zoho: the email service through which we receive contact form messages and the backup of subscriptions.
— Google: Google Tag Manager and Google Analytics 4 (with cookies only if you accept), and YouTube when you load a video. Policy: policies.google.com/privacy.
— Ahrefs: Ahrefs Analytics, only if you accept. Policy: ahrefs.com/privacy.
— Spotify: the players on artist and release pages load content directly from Spotify when you interact with them, and Spotify may set its own cookies. Policy: spotify.com/legal/privacy-policy.

YouTube videos are embedded using the privacy-enhanced domain (youtube-nocookie.com) and the player loads only when you press play. From then on YouTube/Google receives technical data and, if you play the video, may store cookies or local storage.

Newsletter delivery: today we do not use any external sending provider; when we choose one, we will update this section before using it.

We do not use Meta Pixel or third-party advertising.`,
      },
      {
        title: "6 · International transfers",
        body: `These providers may process data outside Chile, mainly in the United States; the site's functions run in São Paulo (Brazil).

We rely on each provider's data processing terms. When the Personal Data Protection Agency (Agencia de Protección de Datos Personales) publishes its list of countries with an adequate level of protection and its model clauses, we will review this section.`,
      },
      {
        title: "7 · How long we keep it",
        body: `— Technical cookies ("phone_lang", "phone_consent"): 1 year from being set, unless you clear your browser cookies.
— Google analytics cookies (only with consent): duration is set by Google; you can remove them at any time by clearing the site's cookies.
— Google Analytics 4 data: the retention period configured in our account; after that, Google deletes it.
— Vercel Web Analytics, Speed Insights and Ahrefs data: according to each provider's policy; we only use it in aggregate.
— Contact form messages: while it makes sense to keep the conversation going; maximum 5 years.
— Newsletter: while you remain subscribed. If you unsubscribe, we keep your email flagged as "unsubscribed" so we don't write to you again, until you ask for its deletion.`,
      },
      {
        title: "8 · Your rights and how to exercise them",
        body: `You have the right of access, rectification, erasure, objection, portability and blocking of your personal data:
— Access: to know whether we process your data and get a copy.
— Rectification: to correct inaccurate, outdated or incomplete data.
— Erasure: to ask us to delete your data.
— Objection: to object to a processing activity, for example one based on our legitimate interest.
— Portability: to receive your data in a structured, commonly used format.
— Blocking: to ask us to temporarily suspend processing while we resolve a rectification, erasure or objection request.
— Withdrawing consent: at any time and without giving reasons. For analytics, with the button in section 4; for the newsletter, by replying to any newsletter email or writing to us (unsubscribing with a link in every email will come later).

How to ask: write to ${LABEL_EMAIL} or use the form at phonerecords.cl/en/contacto, stating your name, where you want us to reply, which data you mean and which right you are exercising.

Deadlines: we acknowledge receipt of your request and reply within 30 calendar days of receiving it. If needed, that period may be extended once by another 30 calendar days. We reply to a blocking request within 2 business days.

No charge: rectification, erasure and objection are always free; access is free at least once per quarter.`,
      },
      {
        title: "9 · Personal Data Protection Agency",
        body: `If we reject your request or do not reply in time, you can file a complaint with the Personal Data Protection Agency (Agencia de Protección de Datos Personales) within 30 business days of receiving our negative answer or of the deadline to reply expiring.`,
      },
      {
        title: "10 · Security",
        body: `The site is served over HTTPS (TLS 1.3). Access to the hosting is protected with two-factor authentication. We do not store sensitive information (credit cards, credentials) on this site.

Your IP address is never stored: for the newsletter we only keep the daily-salted hash described in section 2. Server error logs do not include your messages or your full email address, and your browser never receives internal error details.`,
      },
      {
        title: "11 · Automated decisions and minors",
        body: `We do not make automated decisions or build profiles that produce effects on you.

The site is not aimed at children under 14. If we learn that we received data from a child under 14 without the consent of their parent or legal representative, we will delete it.`,
      },
      {
        title: "12 · Changes to this policy",
        body: `This is version ${POLICY_VERSION} of the policy, with the update date shown at the top. If we change it, we will publish the new version at this same URL, with a new version number and date. If a change requires your consent, we will ask for it before applying it.`,
      },
    ],
  },
};

// El correo del sello y la URL del formulario se vuelven enlaces dentro del texto.
const EMAIL_PATTERN = LABEL_EMAIL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const INLINE_LINK_RE = new RegExp(`(${EMAIL_PATTERN}|phonerecords\\.cl/(?:es|en)/contacto)`, "g");
const INLINE_LINK_CLASS = "underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground";

function withLinks(text: string, lang: string): ReactNode[] {
  return text.split(INLINE_LINK_RE).map((part, i) => {
    if (part === LABEL_EMAIL) {
      return (
        <a key={i} href={`mailto:${LABEL_EMAIL}`} className={INLINE_LINK_CLASS}>
          {part}
        </a>
      );
    }
    if (/^phonerecords\.cl\/(?:es|en)\/contacto$/.test(part)) {
      return (
        <Link key={i} href={`/${lang === "es" ? "es" : "en"}/contacto`} prefetch={false} className={INLINE_LINK_CLASS}>
          {part}
        </Link>
      );
    }
    return part;
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang } = await params;
  const c = lang === "es" ? copy.es : copy.en;
  // LAST_UPDATED es medianoche UTC: sin timeZone, con la hora de Santiago se mostraba el día anterior.
  const dateFormatter = new Intl.DateTimeFormat(lang === "es" ? "es-CL" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
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
        version: POLICY_VERSION,
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
      <Navigation />
      <main id="contenido" tabIndex={-1} className="relative min-h-screen overflow-x-hidden noise-overlay">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

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
              {c.version} {POLICY_VERSION} · {c.lastUpdated}:{" "}
              <time dateTime={LAST_UPDATED}>{lastUpdatedFmt}</time>
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
                      {withLinks(p, lang)}
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
