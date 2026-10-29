import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALES, LOCALE_COOKIE, pickLocale } from "./lib/locale";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year

// Redirige las URL sin idioma (/ y /artistas/x…) a /es/… o /en/…. El idioma lo elige
// pickLocale de lib/locale.ts, que documenta el orden: cookie phone_lang → Accept-Language
// con "es" antes que "en" → país hispanohablante (x-vercel-ip-country) → inglés.
//
// Ya no le pasa el idioma al layout en una cabecera: desde H2 <html lang> sale del segmento de
// la URL en los root layouts (app/[lang]/layout.tsx y app/press/[lang]/layout.tsx) y nadie lee
// cabeceras, así que las páginas con prefijo no necesitan pasar por aquí.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Guarda: el matcher ya deja fuera /press/… y /es, /en con sus subrutas. Si alguna llega
  // igual (otro matcher, pruebas), sigue sin cambios.
  if (pathname.startsWith("/press/")) return NextResponse.next();
  for (const l of LOCALES) {
    if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) return NextResponse.next();
  }

  // Otherwise redirect to /<locale><original-path>
  const locale = pickLocale({
    cookie: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
    country: request.headers.get("x-vercel-ip-country"),
  });
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    path: "/",
  });
  return response;
}

export const config = {
  // Skip static assets, Next.js internals, the Vercel API and route files
  // that already serve their own content (favicon, robots, sitemap, and the
  // unprefixed root /opengraph-image + /twitter-image metadata routes — they
  // must not be redirected to /<locale>/…, crawlers fetch them directly).
  // También quedan fuera /es, /en (con o sin subruta) y /press/…: ya traen el idioma y son
  // estáticas con ISR, así que la CDN las sirve sin invocar el proxy (H2). /espacio o
  // /english sí pasan: (?:es|en) tiene que ir seguido de "/" o del final. Un solo literal:
  // Next lo analiza en el build. scripts/test-locale.mjs lo prueba con
  // unstable_doesMiddlewareMatch de Next.
  matcher: [
    "/((?!_next/|api/|press/|(?:es|en)(?:/|$)|opengraph-image|twitter-image|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico|gif|pdf|txt|xml|json|woff|woff2|ttf|otf|mp4|webm)).*)",
  ],
};
