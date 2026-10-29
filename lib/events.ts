// Tour calendar / live event data for /eventos page and MusicEvent JSON-LD.
// All dates ISO yyyy-mm-dd. Status reflects publishing reality, not internal planning.
// Datos: un archivo por fecha en content/events/<slug>.json (esquema en content/README.md), que
// llegan por el índice generado content/generated/events.ts (pnpm content:index). El orden del
// arreglo es el de los nombres de archivo; los helpers ordenan por fecha.
import { eventEntries } from "../content/generated/events";

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

export const events: Event[] = (eventEntries as Event[]).slice();

/**
 * Fecha de hoy en Santiago como "YYYY-MM-DD" (en-CA formatea así). Con toISOString(), desde
 * las 21:00 de Santiago (00:00 UTC) la fecha del día ya figuraba como pasada.
 */
function santiagoToday(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(now);
}

/** Fechas de hoy en adelante (hora de Santiago), sin las canceladas, en orden ascendente. */
export function getUpcomingEvents(now: Date = new Date()): Event[] {
  const today = santiagoToday(now);
  return events
    .filter((e) => e.date >= today && e.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Fechas ya pasadas (antes de hoy en Santiago) que llegaron a confirmarse, en orden ascendente:
 * el archivo de /eventos. No se solapa con getUpcomingEvents (date < hoy frente a date >= hoy).
 */
export function getPastEvents(now: Date = new Date()): Event[] {
  const today = santiagoToday(now);
  return events
    .filter((e) => e.date < today && e.status === "scheduled")
    .sort((a, b) => a.date.localeCompare(b.date));
}
