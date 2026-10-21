import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["es", "en"] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = "es";
const COOKIE_NAME = "phone_lang";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year

function pickLocale(request: NextRequest): Locale {
  // Cookie-set preference (from a previous LanguageSelector click) wins.
  const cookieLang = request.cookies.get(COOKIE_NAME)?.value as Locale | undefined;
  if (cookieLang && LOCALES.includes(cookieLang)) return cookieLang;

  // Vercel edge geo: Chile → Spanish, anywhere else → English.
  const country = (
    request.headers.get("x-vercel-ip-country") || ""
  ).toUpperCase();
  if (country === "CL") return "es";
  if (country) return "en";

  // Local dev / non-Vercel runtime: honour Accept-Language.
  const acceptLang = request.headers.get("accept-language") || "";
  if (/\bes(-|;|,|$)/i.test(acceptLang)) return "es";
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Press kit routes carry their own /<lang>/ segment after /press → no redirect,
  // but still hand the locale to the root layout (<html lang>, cookie banner).
  if (pathname.startsWith("/press/")) {
    const pressLang = pathname.split("/")[2] as Locale | undefined;
    if (pressLang && LOCALES.includes(pressLang)) {
      const headers = new Headers(request.headers);
      headers.set("x-phone-locale", pressLang);
      return NextResponse.next({ request: { headers } });
    }
    return NextResponse.next();
  }

  // /<lang>/opengraph-image and /<lang>/twitter-image use generateImageMetadata
  // (locale-specific alt), so Next serves them at .../<name>/home (HOME_OG_ID in
  // lib/og/home-image.tsx; not imported here to keep next/og out of the proxy
  // bundle). Keep the plain URLs (hardcoded in metadata) working with an
  // internal rewrite, no redirect.
  if (/^\/(es|en)\/(opengraph-image|twitter-image)$/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `${pathname}/home`;
    return NextResponse.rewrite(url);
  }

  // Already prefixed with a known locale → propagate the locale to layout via header
  for (const l of LOCALES) {
    if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) {
      const headers = new Headers(request.headers);
      headers.set("x-phone-locale", l);
      return NextResponse.next({ request: { headers } });
    }
  }

  // Otherwise redirect to /<locale><original-path>
  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set(COOKIE_NAME, locale, {
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
  matcher: [
    "/((?!_next/|api/|opengraph-image|twitter-image|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico|gif|pdf|txt|xml|json|woff|woff2|ttf|otf|mp4|webm)).*)",
  ],
};
