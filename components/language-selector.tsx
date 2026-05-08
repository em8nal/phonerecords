"use client";

import { useLanguage } from "@/lib/language-context";
import { Globe } from "lucide-react";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative flex items-center gap-1">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as "en" | "es")}
        className={`bg-transparent border-none text-sm cursor-pointer focus:outline-none focus:ring-0 appearance-none pr-4 ${
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
