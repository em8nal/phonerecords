"use client";

import { useLanguage } from "@/lib/language-context";
import { Logo } from "@/components/phone/logo";
import { NewsletterForm } from "@/components/phone/newsletter-form";
import type { Language } from "@/lib/translations";

type FooterLink = { readonly label: string; readonly href: string };

// Redes del sello (no de los artistas). Canal de YouTube creado el 23-09 (bitácora).
const LABEL_SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/phone_records/" },
  { label: "YouTube", href: "https://www.youtube.com/@phone_records" },
] as const;

// Los href de translations.footer van sin idioma; aquí se antepone el segmento de la URL
// ("/sello" → "/es/sello", "#features" → "/es#features").
const localize = (lang: Language, href: string) => `/${lang}${href}`;

// Foco visible en el rojo PHŌNÉ (único acento). Enlaces: ≥24 px de alto táctil.
const FOCUS =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-background";
const LINK_CLASS = `inline-flex min-h-6 items-center py-1 text-base text-muted-foreground transition-colors hover:text-foreground ${FOCUS} focus-visible:ring-offset-2`;

export function FooterSection() {
  const { t, language } = useLanguage();

  const columns: ReadonlyArray<{ key: string; title: string; links: ReadonlyArray<FooterLink> }> = [
    { key: "artists", title: t.footer.columns.artists, links: t.footer.links.artists },
    { key: "label", title: t.footer.columns.label, links: t.footer.links.label },
    { key: "contact", title: t.footer.columns.contact, links: t.footer.links.contact },
  ];

  return (
    <footer className="relative border-t border-foreground/10">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/*
          Marca | Artistas · Sello · Catálogo | Newsletter.
          Desktop (≥1024): 3 | 2·2·2 | 3 de 12 columnas. Tablet: 2 columnas (marca a lo ancho,
          luego 2×2). Móvil: 2 columnas; marca y newsletter a lo ancho (sin desbordes a 360 px).
        */}
        <div className="py-16 lg:py-24 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-12 lg:gap-8">
          {/* Marca */}
          <div className="col-span-2 lg:col-span-3">
            <a
              href={`/${language}`}
              className={`inline-flex items-center mb-6 text-foreground ${FOCUS} focus-visible:ring-offset-4`}
            >
              <Logo className="h-10 w-auto" />
            </a>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xs">
              {t.footer.tagline}
            </p>
          </div>

          {/* Columnas de enlaces: un <nav> por columna, etiquetado por su propio h3 */}
          {columns.map((column) => {
            const headingId = `footer-${column.key}`;
            return (
              <nav key={column.key} aria-labelledby={headingId} className="lg:col-span-2">
                <h3 id={headingId} className="text-base font-medium mb-5">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a href={localize(language, link.href)} className={LINK_CLASS}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            );
          })}

          {/* Newsletter: formulario compacto + redes del sello */}
          <section aria-labelledby="footer-newsletter" className="col-span-2 md:col-span-1 lg:col-span-3">
            <h3 id="footer-newsletter" className="text-base font-medium mb-3">
              {t.footer.columns.newsletter}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{t.footer.newsletterBlurb}</p>
            <NewsletterForm lang={language} source="footer" variant="compact" />
            <ul aria-label={t.footer.socialLabel} className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {LABEL_SOCIAL.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK_CLASS}
                  >
                    {social.label}
                    <span className="sr-only"> {t.footer.opensInNewTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Barra inferior */}
        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-base text-muted-foreground">
            {t.footer.copyright}
          </p>

          <p className="text-base text-muted-foreground">Santiago de Chile</p>
        </div>
      </div>
    </footer>
  );
}
