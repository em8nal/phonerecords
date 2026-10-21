"use client";

// Time-aware bits of a release: the "Pre-save" -> "Escuchar" button and the
// "Próximamente" badge. The server decides the initial state (passed as a prop,
// which keeps hydration consistent even if the page is cached or prerendered)
// and the client re-checks the clock after hydration and once a minute. That way
// the label flips at 00:00 America/Santiago without needing a redeploy.

import { useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { formatReleaseLabel, isReleased } from "@/lib/release-date";

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (timer === undefined) {
    timer = setInterval(() => listeners.forEach((l) => l()), 60_000);
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/** `initialReleased` is the server-side answer; it is used during SSR and hydration. */
export function useReleased(releaseDate: string, initialReleased: boolean): boolean {
  return useSyncExternalStore(
    subscribe,
    () => isReleased(releaseDate),
    () => initialReleased,
  );
}

/** Primary button: "Pre-save" before the release date, "Escuchar" / "Listen" after it. */
export function ReleaseCta({
  href,
  releaseDate,
  initialReleased,
  lang,
}: {
  href: string;
  releaseDate: string;
  initialReleased: boolean;
  lang: string;
}) {
  const released = useReleased(releaseDate, initialReleased);
  const isEs = lang === "es";
  const label = released ? (isEs ? "Escuchar" : "Listen") : "Pre-save";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      data-state={released ? "released" : "presave"}
      className="inline-flex items-center justify-center gap-2 px-8 h-12 text-sm font-mono font-bold uppercase tracking-widest rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
    >
      {label}
      <span className="sr-only">{isEs ? " (se abre en pestaña nueva)" : " (opens in new tab)"}</span>
      <ArrowUpRight className="w-4 h-4" aria-hidden />
    </a>
  );
}

/**
 * "Próximamente · 22 de octubre" / "Coming soon · October 22". Partial dates keep their
 * precision: "Próximamente · marzo 2027" / "Coming soon · 2027". Renders nothing once
 * the release date is reached. Mount it only for releases that were still upcoming
 * when the page was generated (`initialReleased === false`).
 */
export function ComingSoonBadge({
  releaseDate,
  initialReleased,
  lang,
  variant = "inline",
  showDate = true,
}: {
  releaseDate: string;
  initialReleased: boolean;
  lang: string;
  /** "inline" for the release header / list rows, "overlay" for covers in the catalogue grid. */
  variant?: "inline" | "overlay";
  /** Append the formatted release date ("· 22 de octubre", "· marzo 2027", "· 2027"). */
  showDate?: boolean;
}) {
  const released = useReleased(releaseDate, initialReleased);
  if (released) return null;
  const isEs = lang === "es";
  const word = isEs ? "Próximamente" : "Coming soon";
  const text = showDate ? `${word} · ${formatReleaseLabel(releaseDate, lang)}` : word;
  const base =
    "inline-flex items-center h-7 px-3 text-[11px] font-mono font-bold uppercase tracking-widest rounded-full";
  return (
    <span
      data-coming-soon
      className={
        variant === "overlay"
          ? `${base} absolute top-3 left-3 z-10 bg-brand text-white shadow-sm`
          : `${base} border border-brand/60 text-brand`
      }
    >
      {text}
    </span>
  );
}
