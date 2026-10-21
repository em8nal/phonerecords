// Release-date helpers shared by the release page and the catalogue grid.
//
// A release "goes live" at 00:00 America/Santiago on its `releaseDate`.
// Kept in its own tiny module (no data imports) so client components can use
// it without pulling lib/releases.ts into the browser bundle.

const TZ = "America/Santiago";
const FULL_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

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

/**
 * UTC timestamp (ms) of 00:00 America/Santiago on `releaseDate` (YYYY-MM-DD).
 * Returns null when the date is partial or invalid ("2026", "2026-10",
 * "2026-10-00", "in production"…): those never count as upcoming.
 */
export function releaseStartMs(releaseDate: string): number | null {
  const m = FULL_DATE.exec(releaseDate);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const localAsUtc = Date.UTC(y, mo - 1, d);
  // Two passes so the result is right even when a DST change falls on that day.
  let t = localAsUtc - santiagoOffsetMs(localAsUtc);
  t = localAsUtc - santiagoOffsetMs(t);
  return t;
}

/** True when the release date has been reached (>= 00:00 Santiago) or is not a full date. */
export function isReleased(releaseDate: string, nowMs: number = Date.now()): boolean {
  const start = releaseStartMs(releaseDate);
  return start === null ? true : nowMs >= start;
}

/** True only for a full date that is still in the future. */
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

/** "22 de octubre" (es) / "October 22" (en). Falls back to the raw string for partial dates. */
export function formatReleaseDay(releaseDate: string, lang: string): string {
  const m = FULL_DATE.exec(releaseDate);
  if (!m) return releaseDate;
  const month = Number(m[2]) - 1;
  const day = Number(m[3]);
  if (month < 0 || month > 11) return releaseDate;
  return lang === "es" ? `${day} de ${MONTHS_ES[month]}` : `${MONTHS_EN[month]} ${day}`;
}
