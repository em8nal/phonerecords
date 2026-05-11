"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const COOKIE_NAME = "phone_cookie_consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year

function hasConsent(): boolean {
  if (typeof document === "undefined") return true; // SSR: skip banner
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_NAME}=`));
}

function setConsent() {
  document.cookie = `${COOKIE_NAME}=1; max-age=${COOKIE_MAX_AGE}; path=/; samesite=lax`;
}

export function CookieBanner() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Avoid SSR flicker: only show on client after we've checked the cookie.
    if (!hasConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  const isEs = language === "es";
  const c = isEs
    ? {
        text:
          "Usamos cookies estrictamente necesarias para recordar tu preferencia de idioma. Analíticas anónimas de Vercel ayudan a medir uso y rendimiento; no recopilamos datos personales identificables.",
        more: "Más en política de privacidad",
        accept: "Entendido",
        dismiss: "Cerrar",
      }
    : {
        text:
          "We use strictly necessary cookies to remember your language preference. Anonymous Vercel analytics help us measure usage and performance; we do not collect personally identifiable data.",
        more: "More in our privacy policy",
        accept: "Got it",
        dismiss: "Dismiss",
      };

  const dismiss = () => {
    setConsent();
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="cookie consent"
      className="fixed bottom-4 left-4 right-4 z-[60] md:left-auto md:right-4 md:max-w-md print:hidden"
    >
      <div className="bg-background/95 backdrop-blur-xl border border-foreground/15 rounded-2xl shadow-lg p-5 lg:p-6">
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={c.dismiss}
        >
          <X className="w-4 h-4" />
        </button>
        <p className="text-sm text-foreground/85 leading-relaxed pr-6">
          {c.text}{" "}
          <a
            href={`/${language}/privacidad`}
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            {c.more}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="mt-4 inline-flex items-center px-5 h-9 text-sm rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
        >
          {c.accept}
        </button>
      </div>
    </div>
  );
}
