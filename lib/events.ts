// Tour calendar / live event data for /eventos page and MusicEvent JSON-LD.
// All dates ISO yyyy-mm-dd. Status reflects publishing reality, not internal planning.

export type Event = {
  slug: string; // for stable keys
  date: string; // ISO yyyy-mm-dd
  artistSlug: string;
  artistName: string;
  venue: string;
  city: string;
  country: string; // human-readable label, e.g. "Austria"
  countryCode: string; // ISO-3166 alpha-2 (for schema)
  status: "scheduled" | "tentative" | "cancelled";
  ticketsUrl?: string;
  notes?: { es?: string; en?: string };
};

export const events: Event[] = [
  {
    slug: "newen-2026-08-20-innsbruck",
    date: "2026-08-20",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    venue: "Treibhaus",
    city: "Innsbruck",
    country: "Austria",
    countryCode: "AT",
    status: "scheduled",
    ticketsUrl:
      "https://www.treibhaus.at/karten/2026/08/20/15174-newen-afrobeat-kollektiv-upside-down-tribute-to-fela-kuti-fernweh-chile",
    notes: {
      es: "Upside Down — Tribute to Fela Kuti // Fernweh: Chile. 20:30 hrs.",
      en: "Upside Down — Tribute to Fela Kuti // Fernweh: Chile. Doors 20:30.",
    },
  },
  {
    slug: "newen-2026-08-22-frick",
    date: "2026-08-22",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    venue: "Marktfest Frick — Meck-Bühne",
    city: "Frick",
    country: "Suiza",
    countryCode: "CH",
    status: "scheduled",
    ticketsUrl: "https://marktfest.ch/programm/",
    notes: {
      es: "Marktfest Frick 2026 · Meck-Bühne · 22:30–00:15. Pase 3 días desde CHF 20.",
      en: "Marktfest Frick 2026 · Meck-Bühne · 22:30–00:15. 3-day pass from CHF 20.",
    },
  },
  {
    slug: "newen-2026-08-23-frankfurt",
    date: "2026-08-23",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    venue: "Jazzmontez",
    city: "Frankfurt",
    country: "Alemania",
    countryCode: "DE",
    status: "scheduled",
    ticketsUrl: "https://jazzmontez.de/events",
    notes: {
      es: "Programación del venue se publica más cerca de la fecha.",
      en: "Venue programme published closer to the date.",
    },
  },
  {
    slug: "newen-2026-08-28-geneva",
    date: "2026-08-28",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    venue: "La Jonquille",
    city: "Ginebra",
    country: "Suiza",
    countryCode: "CH",
    status: "scheduled",
    ticketsUrl: "https://www.lajonquille.ch/events",
    notes: {
      es: "Programación del venue se publica más cerca de la fecha.",
      en: "Venue programme published closer to the date.",
    },
  },
  {
    slug: "newen-2026-08-30-vienna",
    date: "2026-08-30",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    venue: "Porgy & Bess",
    city: "Viena",
    country: "Austria",
    countryCode: "AT",
    status: "scheduled",
    ticketsUrl: "https://www.porgy.at/en/events/upcoming",
    notes: {
      es: "Programación del venue se publica más cerca de la fecha.",
      en: "Venue programme published closer to the date.",
    },
  },
  {
    slug: "newen-2026-09-03-manchester",
    date: "2026-09-03",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    venue: "Band on the Wall",
    city: "Manchester",
    country: "Reino Unido",
    countryCode: "GB",
    status: "scheduled",
    ticketsUrl: "https://dice.fm/artist/newen-afrobeat-nvgn9",
    notes: {
      es: "Doors 19:30. Tickets desde £26.25 — venta el 15 de mayo de 2026 vía DICE.",
      en: "Doors 19:30. Tickets from £26.25 — on sale 15 May 2026 via DICE.",
    },
  },
  {
    slug: "newen-2026-09-09-london",
    date: "2026-09-09",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    venue: "The Jazz Cafe",
    city: "Londres",
    country: "Reino Unido",
    countryCode: "GB",
    status: "scheduled",
    ticketsUrl: "https://thejazzcafe.com/event/newen-afrobeat-3/",
    notes: {
      es: "Cuarta visita al Jazz Cafe · Doors 19:00–22:30 · Standing £22.50.",
      en: "Fourth visit to Jazz Cafe · Doors 19:00–22:30 · Standing £22.50.",
    },
  },
  {
    slug: "newen-2026-09-11-naples",
    date: "2026-09-11",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    venue: "Festival Ethnos",
    city: "Nápoles",
    country: "Italia",
    countryCode: "IT",
    status: "scheduled",
    notes: {
      es: "Festival Ethnos 2026 · Torre del Greco, Nápoles · dirección artística: Gigi D'Luca.",
      en: "Festival Ethnos 2026 · Torre del Greco, Naples · artistic direction: Gigi D'Luca.",
    },
  },
];

export function getUpcomingEvents(now: Date = new Date()): Event[] {
  const today = now.toISOString().slice(0, 10);
  return events
    .filter((e) => e.date >= today && e.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date));
}
