import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { getUpcomingEvents } from "@/lib/events";

type LangParams = { lang: string };

export async function generateMetadata(
  { params }: { params: Promise<LangParams> }
): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";
  return {
    title: isEs ? "Eventos · Gira" : "Events · Tour",
    description: isEs
      ? "Calendario de gira PHŌNÉ Records. Newen Afrobeat — Europa 2026: Innsbruck, Frankfurt, Viena, Londres y más fechas."
      : "PHŌNÉ Records tour calendar. Newen Afrobeat — Europe 2026: Innsbruck, Frankfurt, Vienna, London and more dates.",
    alternates: {
      canonical: `https://phonerecords.cl/${lang}/eventos`,
      languages: {
        es: "https://phonerecords.cl/es/eventos",
        en: "https://phonerecords.cl/en/eventos",
        "x-default": "https://phonerecords.cl/es/eventos",
      },
    },
  };
}

export default async function EventosPage({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang } = await params;
  const isEs = lang === "es";
  const events = getUpcomingEvents();

  const t = isEs
    ? {
        eyebrow: "En gira",
        headline: "Newen Afrobeat\nEuropa 2026.",
        intro: "Agosto y septiembre 2026: la primera orquesta chilena de afrobeat regresa a Europa con un nuevo show construido en torno al LP Grietas (OfficeHome Records, 2024). Booking europeo gestionado por Ludwig Sound Booking Agency (Heidelberg).",
        backHome: "Volver al inicio",
        booking: "Consultas de booking",
        addedDates: "Más fechas se sumarán al calendario.",
        venueLabel: "Venue",
      }
    : {
        eyebrow: "On tour",
        headline: "Newen Afrobeat\nEurope 2026.",
        intro: "August and September 2026: the first Chilean afrobeat orchestra returns to Europe with a new show built around the LP Grietas (OfficeHome Records, 2024). European booking handled by Ludwig Sound Booking Agency (Heidelberg).",
        backHome: "Back to home",
        booking: "Booking inquiries",
        addedDates: "More dates will be added to the calendar.",
        venueLabel: "Venue",
      };

  // JSON-LD: one MusicEvent per scheduled date + BreadcrumbList
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

  const dateFormatter = new Intl.DateTimeFormat(isEs ? "es-CL" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsSchema) }}
      />
      <Navigation />

      <article className="max-w-[1100px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-24">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.backHome}
        </Link>

        <header className="mb-16 lg:mb-24 max-w-3xl">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            {t.eyebrow}
          </span>
          <h1 className="text-5xl lg:text-8xl font-display tracking-tight leading-[0.95] whitespace-pre-line mb-10">
            {t.headline}
          </h1>
          <p className="text-xl text-foreground/85 leading-relaxed">{t.intro}</p>
        </header>

        {/* Tour dates */}
        <section className="mb-16">
          <div className="border-t border-foreground/10">
            {events.map((ev) => (
              <div
                key={ev.slug}
                className="grid grid-cols-12 gap-4 lg:gap-8 py-8 border-b border-foreground/10"
              >
                <div className="col-span-12 sm:col-span-3">
                  <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    {dateFormatter.format(new Date(ev.date))}
                  </div>
                  <div className="text-lg font-display">{ev.city}</div>
                  <div className="text-sm text-muted-foreground">{ev.country}</div>
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <div className="text-2xl font-display tracking-tight">{ev.venue}</div>
                  <Link
                    href={`/${lang}/artistas/${ev.artistSlug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-1 inline-block"
                  >
                    {ev.artistName}
                  </Link>
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
              <p className="text-sm text-muted-foreground">
                {isEs ? "PHŌNÉ Records" : "PHŌNÉ Records"} · Ludwig Sound (EU)
              </p>
            </div>
            <Link
              href={`/${lang}/contacto`}
              className="inline-flex items-center justify-center px-8 h-12 text-sm rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              {isEs ? "Escríbenos" : "Get in touch"}
            </Link>
          </div>
        </section>
      </article>

      <FooterSection />
    </main>
  );
}
