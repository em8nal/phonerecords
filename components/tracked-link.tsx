"use client";

// Enlace que registra un evento de la taxonomía (lib/analytics/events.ts) al hacer clic.
// Permite medir desde un server component sin volverlo cliente: la página le pasa el nombre
// del evento y sus parámetros (props serializables) y el resto de atributos del <a> tal cual.

import type { AnchorHTMLAttributes } from "react";
import { track, type AnalyticsEventName, type AnalyticsEventParams } from "@/lib/analytics/events";

type Props<E extends AnalyticsEventName> = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "onClick"> & {
  event: E;
  params: AnalyticsEventParams[E];
};

export function TrackedLink<E extends AnalyticsEventName>({ event, params, children, ...anchor }: Props<E>) {
  return (
    <a {...anchor} onClick={() => track(event, params)}>
      {children}
    </a>
  );
}
