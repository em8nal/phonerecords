// Idioma de destino para las URL sin prefijo (/, /artistas/x…), que proxy.ts redirige a
// /es/… o /en/…. Módulo puro, sin imports de `next` ni del alias @/: scripts/test-locale.mjs
// lo importa desde Node.
//
// Orden (pendiente 19, carril L):
//   1. La cookie phone_lang, si vale "es" o "en" (la deja el selector de idioma o la
//      redirección de una visita anterior).
//   2. Accept-Language: "es" si el navegador pone el español antes que el inglés. Las
//      entradas se ordenan por q descendente y, a igual q, por orden de aparición; se compara
//      la subetiqueta primaria sin distinguir mayúsculas (es-MX, es-419 y ES cuentan como es);
//      q=0 y "*" se ignoran; "es" sin "en" también cuenta. Si el inglés va antes, o no hay
//      ninguno de los dos, se pasa al paso 3 (no decide "en" por sí solo).
//   3. El país (cabecera x-vercel-ip-country de Vercel): Chile y los países hispanohablantes
//      de SPANISH_COUNTRIES van a "es".
//   4. "en".
// Antes el país mandaba sobre Accept-Language y todo visitante de fuera de Chile iba a /en.

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Cookie con la preferencia de idioma (proxy.ts y components/language-selector.tsx). */
export const LOCALE_COOKIE = "phone_lang";

/** Chile y los países hispanohablantes (ISO 3166-1 alfa-2): sin otra señal, van a /es. */
export const SPANISH_COUNTRIES: ReadonlySet<string> = new Set([
  "CL",
  "AR",
  "BO",
  "CO",
  "CR",
  "CU",
  "DO",
  "EC",
  "ES",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  "PE",
  "PR",
  "PY",
  "SV",
  "UY",
  "VE",
]);

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "es" || value === "en";
}

/** true si Accept-Language pone "es" antes que "en" (ver el orden arriba). */
export function prefersSpanish(acceptLanguage: string | null | undefined): boolean {
  if (!acceptLanguage) return false;
  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag = "", ...params] = part.split(";");
      let q = 1;
      for (const param of params) {
        const [key = "", value = ""] = param.split("=");
        if (key.trim().toLowerCase() === "q") {
          const n = Number(value.trim());
          q = Number.isFinite(n) ? n : 0;
        }
      }
      return { lang: tag.trim().toLowerCase().split("-")[0], q, index };
    })
    .filter((entry) => entry.lang !== "" && entry.lang !== "*" && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  for (const entry of ranked) {
    if (entry.lang === "es") return true;
    if (entry.lang === "en") return false;
  }
  return false;
}

export function pickLocale({
  cookie,
  acceptLanguage,
  country,
}: {
  cookie?: string | null;
  acceptLanguage?: string | null;
  country?: string | null;
}): Locale {
  if (isLocale(cookie)) return cookie;
  if (prefersSpanish(acceptLanguage)) return "es";
  if (country && SPANISH_COUNTRIES.has(country.trim().toUpperCase())) return "es";
  return "en";
}
