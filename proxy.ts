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
  // that already serve their own content (favicon, robots, sitemap, etc).
  matcher: [
    "/((?!_next/|api/|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico|gif|pdf|txt|xml|json|woff|woff2|ttf|otf|mp4|webm)).*)",
  ],
};
