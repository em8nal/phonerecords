"use client";

import { useState } from "react";
import Script from "next/script";
import { CookieBanner } from "@/components/cookie-banner";
import {
  gtagCommand,
  writeConsentCookie,
  type ConsentDecision,
} from "./consent-cookie";

type Props = {
  lang: "es" | "en";
  /** Decision read from the phone_consent cookie on the server (null = none yet). */
  initialDecision: ConsentDecision | null;
};

/**
 * Owns the consent UI state:
 * - banner only mounts while there is no decision (never when the cookie exists),
 * - Ahrefs Analytics (which ignores Consent Mode) only loads after "granted".
 */
export function ConsentManager({ lang, initialDecision }: Props) {
  const [decision, setDecision] = useState<ConsentDecision | null>(initialDecision);

  const accept = () => {
    writeConsentCookie("granted");
    gtagCommand("consent", "update", { analytics_storage: "granted" });
    setDecision("granted");
  };

  const reject = () => {
    // Consent Mode stays at the "denied" default; Ahrefs is never loaded.
    writeConsentCookie("denied");
    setDecision("denied");
  };

  return (
    <>
      {decision === "granted" && (
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="0TGL5CM0s/+asLNuWTfObw"
          strategy="afterInteractive"
        />
      )}
      {decision === null && (
        <CookieBanner lang={lang} onAccept={accept} onReject={reject} />
      )}
    </>
  );
}
