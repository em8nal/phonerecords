"use client";

import { useLanguage } from "@/lib/language-context";
import { Logo } from "@/components/phone/logo";

type FooterHref = { href: string; external?: boolean };

function buildFooterLinks(lang: "es" | "en"): Record<string, FooterHref[]> {
  return {
    // Order matches translations.ts: Newen, Klaus B, ecamhi, Con.fusión, Rosario Lircay
    Roster: [
      { href: `/${lang}/artistas/newen-afrobeat` },
      { href: `/${lang}/artistas/klaus-brantmayer` },
      { href: `/${lang}/artistas/ecamhi` },
      { href: `/${lang}/artistas/con-fusion` },
      { href: `/${lang}/artistas/rosario-lircay` },
    ],
    // Order matches: Releases, Vinilo/Vinyl, Cassette
    Catalogue: [
      { href: `/${lang}/catalogo` },
      { href: `/${lang}/catalogo` },
      { href: `/${lang}/catalogo` },
    ],
    // Order matches: About PHŌNÉ, Manifesto, Events
    Label: [
      { href: `/${lang}/sello` },
      { href: `/${lang}/manifiesto` },
      { href: `/${lang}/eventos` },
    ],
    // Order matches: Contact, Booking, Press kit, Instagram, YouTube (del sello)
    Connect: [
      { href: `/${lang}/contacto` },
      { href: `/${lang}/contacto` },
      { href: `/${lang}/press-kit` },
      { href: "https://www.instagram.com/phone_records/", external: true },
      { href: "https://www.youtube.com/@phone_records", external: true },
    ],
  };
}

export function FooterSection() {
  const { t, language } = useLanguage();
  const footerLinksHref = buildFooterLinks(language);

  const footerCategories = [
    { title: t.footer.columns.Roster, links: t.footer.links.Roster, hrefs: footerLinksHref.Roster },
    { title: t.footer.columns.Catalogue, links: t.footer.links.Catalogue, hrefs: footerLinksHref.Catalogue },
    { title: t.footer.columns.Label, links: t.footer.links.Label, hrefs: footerLinksHref.Label },
    { title: t.footer.columns.Connect, links: t.footer.links.Connect, hrefs: footerLinksHref.Connect },
  ];

  return (
    <footer className="relative border-t border-foreground/10">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href={`/${language}`} className="inline-flex items-center mb-6 text-foreground">
                <Logo className="h-10 w-auto" />
              </a>

              <p className="text-base text-muted-foreground leading-relaxed max-w-xs">
                {t.footer.tagline}
              </p>
            </div>

            {/* Link Columns */}
            {footerCategories.map((category) => (
              <div key={category.title}>
                <h3 className="text-base font-medium mb-6">{category.title}</h3>
                <ul className="space-y-4">
                  {category.links.map((linkName, idx) => {
                    const meta = category.hrefs[idx];
                    const external = meta?.external;
                    return (
                      <li key={linkName}>
                        <a
                          href={meta?.href || "#"}
                          {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                          className="text-base text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                        >
                          {linkName}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
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
