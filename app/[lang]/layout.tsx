import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/lib/language-context";
import { CookieBanner } from "@/components/cookie-banner";
import type { Language } from "@/lib/translations";

const LOCALES: readonly Language[] = ["es", "en"] as const;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Language)) notFound();

  return (
    <LanguageProvider initialLanguage={lang as Language}>
      {children}
      <CookieBanner />
    </LanguageProvider>
  );
}
