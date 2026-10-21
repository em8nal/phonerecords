// Shared by the server layout (reads the cookie) and the client consent
// components (write it). No "use client" / "server-only": plain module.

export const CONSENT_COOKIE = "phone_consent";
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365; // one year
export const LEGACY_CONSENT_COOKIE = "phone_cookie_consent"; // old "Entendido" notice

export type ConsentDecision = "granted" | "denied";

export function parseConsent(value: string | undefined | null): ConsentDecision | null {
  return value === "granted" || value === "denied" ? value : null;
}

// `window.dataLayer` is already typed (Object[]) by @next/third-parties.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** "; secure" on https (production); omitted on http://localhost so dev still works. */
function secureAttr() {
  return window.location.protocol === "https:" ? "; secure" : "";
}

/** Persist the visitor's decision (client only). */
export function writeConsentCookie(decision: ConsentDecision) {
  document.cookie = `${CONSENT_COOKIE}=${decision}; max-age=${CONSENT_MAX_AGE}; path=/; samesite=lax${secureAttr()}`;
  // The old notice only recorded "seen it"; drop it so it can't be mistaken for a choice.
  document.cookie = `${LEGACY_CONSENT_COOKIE}=; max-age=0; path=/; samesite=lax`;
}

/** Forget the decision (client only) so the banner shows again on next load. */
export function clearConsentCookie() {
  document.cookie = `${CONSENT_COOKIE}=; max-age=0; path=/; samesite=lax${secureAttr()}`;
}

/** Push a gtag() command; falls back to dataLayer if the head snippet is missing. */
export function gtagCommand(...args: unknown[]) {
  if (typeof window.gtag === "function") {
    window.gtag(...args);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  // gtag.js / GTM only recognise `arguments` objects, not plain arrays.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}
