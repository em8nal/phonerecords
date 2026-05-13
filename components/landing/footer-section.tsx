"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { AnimatedWave } from "./animated-wave";
import { useLanguage } from "@/lib/language-context";

type FooterHref = { href: string; external?: boolean; hasBadge?: boolean };

function buildFooterLinks(lang: "es" | "en"): Record<string, FooterHref[]> {
  return {
    // Order matches translations.ts: Newen, Claudio, Ecamhi, Con.fusión
    Roster: [
      { href: `/${lang}/artistas/newen-afrobeat` },
      { href: `/${lang}/artistas/claudio-solis` },
      { href: `/${lang}/artistas/ecamhi` },
      { href: `/${lang}/artistas/con-fusion` },
    ],
    // Order matches: Releases, Vinilo/Vinyl, Cassette, Digital
    Catalogue: [
      { href: `/${lang}/catalogo` },
      { href: `/${lang}/catalogo` },
      { href: `/${lang}/catalogo` },
      { href: "https://newenafrobeat.bandcamp.com/album/grietas-2", external: true },
    ],
    // Order matches: About PHŌNÉ, Manifesto, Press kit, Contact
    Label: [
      { href: `/${lang}/sello` },
      { href: `/${lang}/manifiesto` },
      { href: `/${lang}/contacto`, hasBadge: true },
      { href: `/${lang}/contacto` },
    ],
    // Order matches: Instagram, Bandcamp, Spotify, YouTube
    Connect: [
      { href: "https://www.instagram.com/phone_records/", external: true },
      { href: "https://newenafrobeat.bandcamp.com/music", external: true },
      { href: "https://open.spotify.com/artist/0PTJ848ulShbjTx2yqaAlb", external: true },
      { href: "https://www.youtube.com/channel/UCTHMwr5NTvQ0MWbq0nbeP-w", external: true },
    ],
  };
}

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/phone_records/" },
  { name: "Bandcamp", href: "https://newenafrobeat.bandcamp.com/music" },
  { name: "YouTube", href: "https://www.youtube.com/channel/UCTHMwr5NTvQ0MWbq0nbeP-w" },
];

export function FooterSection() {
  const { t, language } = useLanguage();
  const footerLinksHref = buildFooterLinks(language);

  const footerCategories = [
    { title: "Roster", links: t.footer.links.Roster, hrefs: footerLinksHref.Roster },
    { title: "Catalogue", links: t.footer.links.Catalogue, hrefs: footerLinksHref.Catalogue },
    { title: "Label", links: t.footer.links.Label, hrefs: footerLinksHref.Label },
    { title: "Connect", links: t.footer.links.Connect, hrefs: footerLinksHref.Connect },
  ];

  return (
    <footer className="relative border-t border-foreground/10">
      {/* Animated wave background */}
      <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href={`/${language}`} className="inline-flex items-center mb-6" aria-label="PHŌNÉ Records">
                <Image
                  src="/phone-logo-dark.png"
                  alt="PHŌNÉ Records"
                  width={2000}
                  height={2000}
                  className="h-12 w-auto"
                />
              </a>

              <p className="text-muted-foreground leading-relaxed mb-8 max-w-xs">
                {t.footer.tagline}
              </p>

              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {footerCategories.map((category) => (
              <div key={category.title}>
                <h3 className="text-sm font-medium mb-6">{category.title}</h3>
                <ul className="space-y-4">
                  {category.links.map((linkName, idx) => {
                    const meta = category.hrefs[idx];
                    const external = meta?.external;
                    return (
                      <li key={linkName}>
                        <a
                          href={meta?.href || "#"}
                          {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                        >
                          {linkName}
                          {meta?.hasBadge && (
                            <span className="text-xs px-2 py-0.5 bg-foreground text-background rounded-full">
                              {t.footer.hiring}
                            </span>
                          )}
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
          <p className="text-sm text-muted-foreground">
            {t.footer.copyright}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {t.footer.systemStatus}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
