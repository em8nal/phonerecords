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
  },
  {
    slug: "newen-2026-08-21-frick",
    date: "2026-08-21",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    venue: "Marktfest Frick",
    city: "Frick",
    country: "Suiza",
    countryCode: "CH",
    status: "scheduled",
  },
  {
    slug: "newen-2026-08-22-basel",
    date: "2026-08-22",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    venue: "MECK à FRICK",
    city: "Basel / Frick",
    country: "Suiza",
    countryCode: "CH",
    status: "scheduled",
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
  },
];

export function getUpcomingEvents(now: Date = new Date()): Event[] {
  const today = now.toISOString().slice(0, 10);
  return events
    .filter((e) => e.date >= today && e.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date));
}
