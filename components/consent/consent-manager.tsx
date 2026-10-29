"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { CookieBanner } from "@/components/cookie-banner";
import {
  gtagCommand,
  readConsentCookie,
  writeConsentCookie,
  type ConsentDecision,
} from "./consent-cookie";

type Props = {
  lang: "es" | "en";
};

/**
 * "unknown": render del servidor e hidratación (todavía no se sabe: no se pinta nada).
 * "none": el cliente ya leyó la cookie y no hay decisión (se muestra el banner).
 */
type ConsentState = ConsentDecision | "none" | "unknown";

// La decisión vive en la cookie phone_consent y se lee en el cliente: el HTML es el mismo
// para todos y la página puede servirse desde la caché (H2). `remembered` guarda lo elegido
// en esta pestaña, así el banner se cierra aunque el navegador bloquee la cookie.
let remembered: ConsentDecision | null = null;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): ConsentState {
  return readConsentCookie() ?? remembered ?? "none";
}

function getServerSnapshot(): ConsentState {
  return "unknown";
}

function decide(decision: ConsentDecision) {
  try {
    writeConsentCookie(decision);
  } catch {
    // Cookie bloqueada: la decisión queda en memoria hasta recargar.
  }
  remembered = decision;
  listeners.forEach((l) => l());
}

/**
 * Owns the consent UI state:
 * - nada en el HTML ni durante la hidratación; después, el banner solo si no hay decisión
 *   (quien ya decidió no lo ve en ningún cuadro),
 * - Ahrefs Analytics (which ignores Consent Mode) only loads after "granted".
 * useSyncExternalStore en vez de un efecto con setState (regla react-hooks/set-state-in-effect).
 */
export function ConsentManager({ lang }: Props) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const accept = () => {
    gtagCommand("consent", "update", { analytics_storage: "granted" });
    decide("granted");
  };

  const reject = () => {
    // Consent Mode stays at the "denied" default; Ahrefs is never loaded.
    decide("denied");
  };

  return (
    <>
      {state === "granted" && (
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="0TGL5CM0s/+asLNuWTfObw"
          strategy="afterInteractive"
        />
      )}
      {state === "none" && (
        <CookieBanner lang={lang} onAccept={accept} onReject={reject} />
      )}
    </>
  );
}
