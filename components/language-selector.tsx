"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { Globe } from "lucide-react";

const LOCALES = ["en", "es"] as const;
type Locale = (typeof LOCALES)[number];
const COOKIE_NAME = "phone_lang";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function setLocaleCookie(locale: Locale) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${locale}; max-age=${COOKIE_MAX_AGE}; path=/; samesite=lax`;
}

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { language } = useLanguage();

  const handleChange = (next: Locale) => {
    if (next === language) return;
    setLocaleCookie(next);
    const prefixed = LOCALES.some(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
    );
    const newPath = prefixed
      ? pathname.replace(/^\/(en|es)/, `/${next}`)
      : `/${next}${pathname === "/" ? "" : pathname}`;
    router.push(newPath);
  };

  return (
    <div className="relative flex items-center gap-1">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <select
        value={language}
        onChange={(e) => handleChange(e.target.value as Locale)}
        className={`bg-transparent border-none cursor-pointer focus:outline-none focus:ring-0 appearance-none pr-4 ${
          compact ? "text-xs" : "text-sm"
        } text-foreground/70 hover:text-foreground transition-colors`}
        aria-label="Select language"
      >
        <option value="en" className="bg-background text-foreground">EN</option>
        <option value="es" className="bg-background text-foreground">ES</option>
      </select>
    </div>
  );
}
