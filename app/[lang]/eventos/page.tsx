import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { PageHero } from "@/components/phone/page-hero";
import { FooterSection } from "@/components/landing/footer-section";
import { getPastEvents, getUpcomingEvents, type Event } from "@/lib/events";
import { pageMetadata } from "@/lib/seo";

type LangParams = { lang: string };

// Las fechas pasan solas de "próximas" al archivo (getUpcomingEvents / getPastEvents comparan
// con el día de hoy en Santiago): la ruta es estática con ISR (H2) y se regenera cada hora, así
// el estado vacío y el archivo no quedan congelados.
export const revalidate = 3600;

// Solo el anillo de foco, sin `rounded-*`: con `rounded-full` en la misma lista, Tailwind 4
// emite `.rounded-sm` después y gana (--radius-sm = 0), y la píldora quedaba con esquinas rectas.
const LINK_FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

/** Estado vacío (M19): sin fechas próximas no se anuncia una gira que ya pasó. */
const EMPTY = {
  es: {
    eyebrow: "Eventos",
    headline: "Próximas fechas",
    body: "No hay fechas anunciadas por ahora.",
    booking: "Booking y conciertos",
    description:
      "Próximas fechas de los artistas de PHŌNÉ Records. No hay fechas anunciadas por ahora.",
  },
  en: {
    eyebrow: "Events",
    headline: "Upcoming dates",
    body: "No dates announced at the moment.",
    booking: "Booking and concerts",
    description: "Upcoming dates for PHŌNÉ Records artists. No dates announced at the moment.",
  },
} as const;

/** Textos con fechas próximas: genéricos, sin describir una gira concreta. */
const UPCOMING = {
  es: {
    intro: "Fechas confirmadas de los artistas de PHŌNÉ Records.",
    backHome: "Volver al inicio",
    booking: "Consultas de booking",
    addedDates: "Más fechas se sumarán al calendario.",
    cta: "Escríbenos",
  },
  en: {
    intro: "Confirmed dates for PHŌNÉ Records artists.",
    backHome: "Back to home",
    booking: "Booking inquiries",
    addedDates: "More dates will be added to the calendar.",
    cta: "Get in touch",
  },
} as const;

// Países de Europa (ISO 3166-1 alfa-2). Rusia y Turquía quedan fuera a propósito: con una fecha
// allí el título cae a "Archivo · <año>" en vez de afirmar "Europa".
const EUROPE = new Set([
  "AD", "AL", "AT", "BA", "BE", "BG", "BY", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR",
  "GB", "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MC", "MD", "ME", "MK", "MT",
  "NL", "NO", "PL", "PT", "RO", "RS", "SE", "SI", "SK", "SM", "UA", "VA", "XK",
]);

/**
 * Título del archivo de un año, a partir de los datos: "Archivo · Europa <año>" solo si todas sus
 * fechas son en Europa; si no, "Archivo · <año>". Así no queda un título fijo que deje de ser cierto
 * cuando lib/events.ts sume una fecha en otro continente.
 */
function archiveTitle(year: string, list: Event[], isEs: boolean): string {
  const inEurope = list.length > 0 && list.every((ev) => EUROPE.has(ev.countryCode.toUpperCase()));
  if (isEs) return inEurope ? `Archivo · Europa ${year}` : `Archivo · ${year}`;
  return inEurope ? `Archive · Europe ${year}` : `Archive · ${year}`;
}

// Hasta que lib/events.ts traiga la ciudad por idioma, las ciudades en español con nombre
// propio en inglés se traducen aquí. El resto (Innsbruck, Frick…) es igual en los dos idiomas.
const CITY_EN: Record<string, string> = {
  Ginebra: "Geneva",
  Viena: "Vienna",
  Londres: "London",
  Nápoles: "Naples",
};

function cityName(ev: Event, isEs: boolean): string {
  return isEs ? ev.city : (CITY_EN[ev.city] ?? ev.city);
}

/** País en el idioma de la página a partir del código ISO; si no se puede, la etiqueta de los datos. */
function countryName(ev: Event, lang: "es" | "en"): string {
  try {
    return new Intl.DisplayNames([lang], { type: "region" }).of(ev.countryCode) ?? ev.country;
  } catch {
    return ev.country;
  }
}

/** Descripción con fechas próximas: las ciudades, sin repetir, en orden de fecha. */
function upcomingDescription(events: Event[], isEs: boolean): string {
  const cities = [...new Set(events.map((ev) => cityName(ev, isEs)))];
  const list = new Intl.ListFormat(isEs ? "es" : "en", { type: "conjunction" }).format(cities);
  const full = isEs
    ? `Próximas fechas de los artistas de PHŌNÉ Records: ${list}.`
    : `Upcoming dates for PHŌNÉ Records artists: ${list}.`;
  if (full.length <= 160) return full;
  return isEs ? "Próximas fechas de los artistas de PHŌNÉ Records." : "Upcoming dates for PHŌNÉ Records artists.";
}

export async function generateMetadata(
  { params }: { params: Promise<LangParams> }
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  const upcoming = getUpcomingEvents();
  const hasDates = upcoming.length > 0;
  return pageMetadata({
    lang,
    path: "/eventos",
    // Sin fechas, ni el título anuncia una gira: es lo primero que lee un lector de pantalla.
    title: hasDates ? (isEs ? "Eventos · Gira" : "Events · Tour") : isEs ? "Eventos" : "Events",
    description: hasDates ? upcomingDescription(upcoming, isEs) : EMPTY[isEs ? "es" : "en"].description,
    // Sin fechas próximas la página no se indexa (y sale del sitemap, app/sitemap.ts). El archivo
    // de fechas pasadas no cambia esa regla: son pocas filas y la función de la página es anunciar
    // lo que viene (decisión del carril Q, lote 4).
    noindex: !hasDates,
  });
}

export default async function EventosPage({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang } = await params;
  const isEs = lang === "es";
  const locale = isEs ? "es" : "en";
  const events = getUpcomingEvents();
  const hasDates = events.length > 0;
  const empty = EMPTY[locale];
  const t = UPCOMING[locale];

  // Archivo: fechas pasadas agrupadas por año (el más reciente primero), filas en orden de fecha.
  const past = getPastEvents();
  const archive = [...new Set(past.map((ev) => ev.date.slice(0, 4)))]
    .sort((a, b) => b.localeCompare(a))
    .map((year) => {
      const list = past.filter((ev) => ev.date.startsWith(year));
      return {
        year,
        title: archiveTitle(year, list, isEs),
        artists: [...new Set(list.map((ev) => ev.artistName))].join(" · "),
        list,
      };
    });

  // JSON-LD: un MusicEvent por fecha próxima + BreadcrumbList. Las fechas del archivo no llevan
  // MusicEvent (ya pasaron).
  const eventsSchema = {
    "@context": "https://schema.org",
    "@graph": [
      ...events.map((ev) => ({
        "@type": "MusicEvent",
        name: `${ev.artistName} · ${ev.venue}`,
        startDate: ev.date,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: ev.venue,
          address: {
            "@type": "PostalAddress",
            addressLocality: ev.city,
            addressCountry: ev.countryCode,
          },
        },
        performer: {
          "@type": "MusicGroup",
          name: ev.artistName,
          url: `https://phonerecords.cl/${lang}/artistas/${ev.artistSlug}`,
        },
        organizer: {
          "@type": "Organization",
          name: "PHŌNÉ Records",
          url: "https://phonerecords.cl",
        },
        ...(ev.ticketsUrl
          ? {
              offers: {
                "@type": "Offer",
                url: ev.ticketsUrl,
                availability: "https://schema.org/InStock",
              },
            }
          : {}),
      })),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "PHŌNÉ Records", item: `https://phonerecords.cl/${lang}` },
          { "@type": "ListItem", position: 2, name: isEs ? "Eventos" : "Events", item: `https://phonerecords.cl/${lang}/eventos` },
        ],
      },
    ],
  };

  // Las fechas "YYYY-MM-DD" se leen como medianoche UTC: se formatean en UTC para no mostrar
  // el día anterior con la hora de Santiago.
  const dateFormatter = new Intl.DateTimeFormat(isEs ? "es-CL" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const archiveDateFormatter = new Intl.DateTimeFormat(isEs ? "es-CL" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <>
      <Navigation />
      <main id="contenido" tabIndex={-1} className="relative min-h-screen overflow-x-hidden noise-overlay">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsSchema) }}
        />
        <PageHero
          image={{
            desktop: "/media/con-fusion/la-banca-hero.jpg",
            mobile: "/media/con-fusion/la-banca-hero-mobile.jpg",
            alt: { es: "Con.fusión y artistas invitados en la sesión La Banca", en: "Con.fusión and guest artists at the La Banca session" },
          }}
          title={empty.headline}
          eyebrow={empty.eyebrow}
          lang={locale}
        />

        <article className="max-w-[1100px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-24">
          <Link
            href={`/${lang}`}
            className={`inline-flex min-h-6 items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group ${LINK_FOCUS}`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t.backHome}
          </Link>

          {hasDates ? (
            <>
              <header className="mb-16 lg:mb-24 max-w-3xl">
                <p className="text-xl text-foreground/85 leading-relaxed">{t.intro}</p>
              </header>

              {/* Próximas fechas */}
              <section className="mb-16">
                <div className="border-t border-foreground/10">
                  {events.map((ev) => (
                    <div
                      key={ev.slug}
                      className="grid grid-cols-12 gap-4 lg:gap-8 py-8 border-b border-foreground/10"
                    >
                      <div className="col-span-12 sm:col-span-3">
                        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">
                          <time dateTime={ev.date}>{dateFormatter.format(new Date(ev.date))}</time>
                        </div>
                        <div className="text-lg font-display">{cityName(ev, isEs)}</div>
                        <div className="text-sm text-muted-foreground">{countryName(ev, locale)}</div>
                      </div>
                      <div className="col-span-12 sm:col-span-6">
                        <div className="text-2xl font-display tracking-tight">{ev.venue}</div>
                        <Link
                          href={`/${lang}/artistas/${ev.artistSlug}`}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-1 inline-block"
                        >
                          {ev.artistName}
                        </Link>
                        {ev.notes?.[locale] && (
                          <p className="text-xs text-muted-foreground/80 mt-2 leading-relaxed">
                            {ev.notes[locale]}
                          </p>
                        )}
                      </div>
                      <div className="col-span-12 sm:col-span-3 self-center text-right">
                        {ev.ticketsUrl ? (
                          <a
                            href={ev.ticketsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 h-10 text-sm rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
                          >
                            Tickets
                          </a>
                        ) : (
                          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                            {ev.status === "scheduled" ? (isEs ? "Confirmado" : "Confirmed") : ev.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-sm text-muted-foreground italic">{t.addedDates}</p>
              </section>

              {/* Booking CTA */}
              <section className="pt-12 border-t border-foreground/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-display tracking-tight mb-2">
                      {t.booking}
                    </h2>
                    {/* Ludwig Sound es el booking europeo de todo el sello (/sello, /contacto, /press-kit,
                        lib/faq.ts), no el de una gira concreta: vale para cualquier fecha próxima. */}
                    <p className="text-sm text-muted-foreground">PHŌNÉ Records · Ludwig Sound (EU)</p>
                  </div>
                  <Link
                    href={`/${lang}/contacto?topic=booking`}
                    className={`inline-flex items-center justify-center px-8 h-12 text-sm rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors ${LINK_FOCUS}`}
                  >
                    {t.cta}
                  </Link>
                </div>
              </section>
            </>
          ) : (
            /* Sin fechas próximas: estado vacío corto, con salida a booking. */
            <div className="max-w-3xl">
              <p className="text-xl text-foreground/85 leading-relaxed mb-10">{empty.body}</p>
              <Link
                href={`/${lang}/contacto?topic=booking`}
                className={`inline-flex items-center justify-center px-8 h-12 text-sm rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors ${LINK_FOCUS}`}
              >
                {empty.booking}
              </Link>
            </div>
          )}

          {/* Archivo: fechas ya tocadas. Lista compacta con fecha, ciudad y sala; sin notas (traen
              precios y textos de venta vencidos), sin entradas y sin estado. */}
          {archive.map((group) => (
            <section
              key={group.year}
              aria-labelledby={`archivo-${group.year}`}
              className="mt-20 pt-12 border-t border-foreground/10"
            >
              <h2
                id={`archivo-${group.year}`}
                className="text-2xl lg:text-3xl font-display tracking-tight mb-2"
              >
                {group.title}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">{group.artists}</p>
              <ol className="border-t border-foreground/10">
                {group.list.map((ev) => (
                  <li
                    key={ev.slug}
                    className="grid grid-cols-[7rem_1fr] sm:grid-cols-[8rem_1fr_1fr] gap-x-4 gap-y-0.5 py-3 border-b border-foreground/10 text-sm"
                  >
                    <time
                      dateTime={ev.date}
                      className="font-mono text-xs uppercase tracking-widest text-muted-foreground pt-0.5"
                    >
                      {archiveDateFormatter.format(new Date(ev.date))}
                    </time>
                    <span>
                      {cityName(ev, isEs)}, {countryName(ev, locale)}
                    </span>
                    <span className="col-start-2 sm:col-start-auto text-muted-foreground">{ev.venue}</span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </article>
      </main>
      <FooterSection />
    </>
  );
}
