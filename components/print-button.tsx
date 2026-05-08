"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-6 h-12 text-sm rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
    >
      <Printer className="w-4 h-4" />
      {label}
    </button>
  );
}
