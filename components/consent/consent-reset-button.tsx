"use client";

import { clearConsentCookie } from "./consent-cookie";

/**
 * Lets visitors withdraw/change their cookie decision (privacy page).
 * Clears phone_consent and reloads: al montar, el cliente vuelve a leer la cookie
 * (ya sin decisión) y muestra el banner, y no queda cargado ningún script de
 * analítica de la elección anterior.
 */
export function ConsentResetButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        clearConsentCookie();
        window.location.reload();
      }}
      className="inline-flex items-center px-5 h-9 text-sm rounded-full border border-foreground/30 text-foreground hover:bg-foreground/10 transition-colors"
    >
      {label}
    </button>
  );
}
