// Release-date helpers shared by the release page and the catalogue grid.
//
// A release "goes live" at 00:00 America/Santiago on its `releaseDate`.
// Partial dates are supported: "YYYY" goes live on January 1st and "YYYY-MM" on
// the 1st of that month (also at 00:00 America/Santiago). Month "00" / day "00"
// (used by the lightweight catalogue entries) count as "unknown" and fall back
// to the coarser precision.
//
// Kept in its own tiny module (no data imports) so client components can use
// it without pulling lib/releases.ts into the browser bundle.

const TZ = "America/Santiago";
const DATE_RE = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;

const santiagoParts = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** Offset (ms) of Santiago wall-clock time relative to UTC at the given instant. */
function santiagoOffsetMs(utcMs: number): number {
  const parts = santiagoParts.formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

type ParsedDate = { year: number; month?: number; day?: number };

/** Parses "YYYY", "YYYY-MM" or "YYYY-MM-DD". Returns null for anything else ("in production"…). */
function parseReleaseDate(raw: string): ParsedDate | null {
  const m = DATE_RE.exec(raw);
  if (!m) return null;
  const year = Number(m[1]);
  const month = m[2] ? Number(m[2]) : 0;
  const day = m[3] ? Number(m[3]) : 0;
  if (year < 1900 || month > 12 || day > 31) return null;
  if (month === 0) return { year };
  if (day === 0) return { year, month };
  return { year, month, day };
}

/**
 * UTC timestamp (ms) at which the release goes live: 00:00 America/Santiago on the
 * release day (or on the first day of the month / year for partial dates).
 * Returns null when the string is not a date at all.
 */
export function releaseStartMs(releaseDate: string): number | null {
  const p = parseReleaseDate(releaseDate);
  if (!p) return null;
  const localAsUtc = Date.UTC(p.year, (p.month ?? 1) - 1, p.day ?? 1);
  // Two passes so the result is right even when a DST change falls on that day.
  let t = localAsUtc - santiagoOffsetMs(localAsUtc);
  t = localAsUtc - santiagoOffsetMs(t);
  return t;
}

/** True when the release date has been reached (>= 00:00 Santiago) or is not a date. */
export function isReleased(releaseDate: string, nowMs: number = Date.now()): boolean {
  const start = releaseStartMs(releaseDate);
  return start === null ? true : nowMs >= start;
}

/** True only for a (full or partial) date that is still in the future. */
export function isUpcoming(releaseDate: string, nowMs: number = Date.now()): boolean {
  return !isReleased(releaseDate, nowMs);
}

const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Human label that never invents precision:
 * "22 de octubre" / "October 22" (full date), "marzo 2027" / "March 2027" (YYYY-MM),
 * "2027" (YYYY). Falls back to the raw string when it is not a date.
 */
export function formatReleaseLabel(releaseDate: string, lang: string): string {
  const p = parseReleaseDate(releaseDate);
  if (!p) return releaseDate;
  const isEs = lang === "es";
  if (p.month === undefined) return String(p.year);
  const monthName = (isEs ? MONTHS_ES : MONTHS_EN)[p.month - 1];
  if (p.day === undefined) return `${monthName} ${p.year}`;
  return isEs ? `${p.day} de ${monthName}` : `${monthName} ${p.day}`;
}
