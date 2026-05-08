"use client";

import { createContext, useContext, type ReactNode } from "react";
import { translations, type Language, type Translations } from "./translations";

interface LanguageContextType {
  language: Language;
  /** No-op kept for backwards compatibility. Language switching now happens
   *  via URL navigation in LanguageSelector. */
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLanguage = "es",
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  // The URL segment ([lang] in the route) is the source of truth for language.
  // The provider just exposes that to client components via useLanguage().
  const language = initialLanguage;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: () => undefined,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
