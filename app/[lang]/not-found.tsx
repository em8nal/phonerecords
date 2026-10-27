"use client";

// 404 localizada (A8). Next la muestra cuando una página de /[lang] llama a notFound()
// (ficha inexistente) y, gracias a app/[lang]/[...missing]/page.tsx, para cualquier
// URL sin ruta bajo /es o /en. not-found no recibe props: el idioma sale del
// LanguageProvider de app/[lang]/layout.tsx, que la envuelve. Sin metadata propia:
// Next responde 404 e inyecta <meta name="robots" content="noindex">.
import Link from "next/link";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { useLanguage } from "@/lib/language-context";

const LINK_FOCUS =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

const COPY = {
  es: {
    eyebrow: "Error 404",
    headline: "Página no encontrada",
    body: "La dirección no existe o cambió.",
    navLabel: "Seguir navegando",
    home: "Inicio",
    catalogue: "Catálogo",
    videos: "Videos",
    artists: "Artistas",
  },
  en: {
    eyebrow: "Error 404",
    headline: "Page not found",
    body: "This address doesn't exist or has moved.",
    navLabel: "Keep browsing",
    home: "Home",
    catalogue: "Catalogue",
    videos: "Videos",
    artists: "Artists",
  },
} as const;

export default function NotFound() {
  const { language, t } = useLanguage();
  const c = COPY[language];
  const base = `/${language}`;
  const pages = [
    { href: base, label: c.home },
    { href: `${base}/catalogo`, label: c.catalogue },
    { href: `${base}/videos`, label: c.videos },
  ];

  return (
    <>
      <main className="relative min-h-screen overflow-x-hidden noise-overlay">
        <Navigation />

        <article className="max-w-[1000px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-24">
          <header className="mb-16 lg:mb-20">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
              <span className="w-8 h-px bg-foreground/30" aria-hidden="true" />
              {c.eyebrow}
            </span>
            <h1 className="text-5xl lg:text-7xl font-display tracking-tight leading-[0.95] mb-10">
              {c.headline}
            </h1>
            <p className="text-lg lg:text-xl text-foreground/85 leading-relaxed max-w-3xl">{c.body}</p>
          </header>

          <nav aria-label={c.navLabel} className="grid gap-12 border-t border-foreground/10 pt-12 md:grid-cols-2">
            <ul className="space-y-2">
              {pages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className={`inline-flex min-h-11 items-center text-2xl lg:text-3xl font-display tracking-tight hover:text-muted-foreground transition-colors ${LINK_FOCUS}`}
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                {c.artists}
              </h2>
              {/* Misma lista que el footer (orden de lib/artists.ts, vigilado por test:roster). */}
              <ul className="space-y-1">
                {t.footer.links.artists.map((artist) => (
                  <li key={artist.href}>
                    <Link
                      href={`${base}${artist.href}`}
                      className={`inline-flex min-h-11 items-center text-lg text-foreground/85 hover:text-foreground transition-colors ${LINK_FOCUS}`}
                    >
                      {artist.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </article>
      </main>
      <FooterSection />
    </>
  );
}
