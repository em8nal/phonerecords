// "Datos clave" de la ficha de artista (pendiente 17h, AEO): una ficha técnica corta con
// hechos que ya están en lib/artists.ts y lib/releases.ts. Nada se escribe aquí a mano.
//
// Vive fuera de lib/artists.ts porque usa lib/catalog.ts, que importa lib/artists.ts (sería
// un import circular). Módulo puro, sin JSX, con imports relativos e `import type`:
// scripts/test-roster.mjs lo importa desde Node sin el alias @/.
import { getArtist } from "./artists";
import { getArtistEntries } from "./catalog";
import { PHONE_LABEL, isPhoneRelease } from "./releases";
import { isUpcoming } from "./release-date";
import type { Language } from "./translations";

/** Origen con año de formación: "Santiago, Chile · 2009" → lugar + año. */
const ORIGIN_YEAR_RE = /^(.*\S)\s*·\s*(\d{4})$/;

/** "Santiago, Chile · 2009" → { place: "Santiago, Chile", year: "2009" }; sin año, solo el lugar. */
export function splitOrigin(origin: string): { place: string; year?: string } {
  const m = ORIGIN_YEAR_RE.exec(origin);
  return m ? { place: m[1], year: m[2] } : { place: origin };
}

/** Tope de lanzamientos en la fila "Lanzamientos con PHŌNÉ". */
export const KEY_FACT_RELEASES_MAX = 3;

export type KeyFactId = "origin" | "formed" | "role" | "genres" | "label" | "releases" | "booking";

/** Un lanzamiento de la fila: título (con "— artista" si es de otro artista), año y ficha. */
export type KeyFactRelease = { text: string; year: string; href: string };

export type KeyFact = {
  id: KeyFactId;
  label: string;
  /** Texto de la fila; la de lanzamientos usa `items`. */
  value?: string;
  /** Enlace interno con idioma (`/es/sello`, `/en/contacto?topic=booking`). */
  href?: string;
  items?: KeyFactRelease[];
};

const LABELS: Record<Language, Record<KeyFactId, string>> = {
  es: {
    origin: "Origen",
    formed: "Año de formación",
    role: "Formación · instrumento",
    genres: "Géneros",
    label: "Sello",
    releases: "Lanzamientos con PHŌNÉ",
    booking: "Booking",
  },
  en: {
    origin: "Origin",
    formed: "Formed",
    role: "Line-up · instrument",
    genres: "Genres",
    label: "Label",
    releases: "Releases with PHŌNÉ",
    booking: "Booking",
  },
};

const BOOKING_VALUE: Record<Language, string> = {
  es: "Formulario de contacto · Booking",
  en: "Contact form · Booking",
};

/**
 * Filas de "Datos clave", en orden: origen, año de formación (solo si `origin` lo trae),
 * formación o instrumento, géneros, sello, lanzamientos con PHŌNÉ y booking.
 *
 * Los lanzamientos son los editados por PHŌNÉ (`isPhoneRelease`) cuya fecha ya llegó a
 * `nowMs` (no se usa `entry.upcoming`, que se calcula con el reloj del proceso, para que la
 * prueba sea determinista), del más reciente al más antiguo y hasta 3. En una colaboración
 * encabezada por otro artista se agrega "— <artista>". Sin lanzamientos, la fila no sale.
 * El booking va al formulario del sello: el sitio presenta a Ludwig Sound a nivel del sello.
 */
export function artistKeyFacts(slug: string, lang: Language, nowMs: number = Date.now()): KeyFact[] {
  const artist = getArtist(slug);
  if (!artist) return [];
  const t = LABELS[lang];
  const { place, year } = splitOrigin(artist.origin);

  const releases: KeyFactRelease[] = getArtistEntries(slug)
    .filter((e) => e.releaseSlug && isPhoneRelease(e) && !isUpcoming(e.releaseDate, nowMs))
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    .slice(0, KEY_FACT_RELEASES_MAX)
    .map((e) => ({
      text: e.artistSlug === slug ? e.title : `${e.title} — ${e.artistName}`,
      year: e.releaseDate.slice(0, 4),
      href: `/${lang}/releases/${e.releaseSlug}`,
    }));

  const facts: KeyFact[] = [{ id: "origin", label: t.origin, value: place }];
  if (year) facts.push({ id: "formed", label: t.formed, value: year });
  facts.push(
    { id: "role", label: t.role, value: artist.role[lang] },
    { id: "genres", label: t.genres, value: artist.genres.join(" · ") },
    { id: "label", label: t.label, value: PHONE_LABEL, href: `/${lang}/sello` },
  );
  if (releases.length) facts.push({ id: "releases", label: t.releases, items: releases });
  facts.push({ id: "booking", label: t.booking, value: BOOKING_VALUE[lang], href: `/${lang}/contacto?topic=booking` });
  return facts;
}
