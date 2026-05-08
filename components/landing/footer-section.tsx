"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatedWave } from "./animated-wave";
import { useLanguage } from "@/lib/language-context";

const footerLinksHref = {
  Product: [
    { href: "#features" },
    { href: "#how-it-works" },
    { href: "#pricing" },
    { href: "#integrations" },
  ],
  Developers: [
    { href: "#developers" },
    { href: "#" },
    { href: "#developers" },
    { href: "#" },
  ],
  Company: [
    { href: "#" },
    { href: "#" },
    { href: "#", hasBadge: true },
    { href: "#" },
  ],
  Legal: [
    { href: "#" },
    { href: "#" },
    { href: "#security" },
  ],
};

const socialLinks = [
  { name: "Twitter", href: "#" },
  { name: "GitHub", href: "#" },
  { name: "LinkedIn", href: "#" },
];

export function FooterSection() {
  const { t } = useLanguage();

  const footerCategories = [
    { title: "Product", links: t.footer.links.Product, hrefs: footerLinksHref.Product },
    { title: "Developers", links: t.footer.links.Developers, hrefs: footerLinksHref.Developers },
    { title: "Company", links: t.footer.links.Company, hrefs: footerLinksHref.Company },
    { title: "Legal", links: t.footer.links.Legal, hrefs: footerLinksHref.Legal },
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
              <a href="#" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display">Optimus</span>
                <span className="text-xs text-muted-foreground font-mono">TM</span>
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
                  {category.links.map((linkName, idx) => (
                    <li key={linkName}>
                      <a
                        href={category.hrefs[idx]?.href || "#"}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                      >
                        {linkName}
                        {category.hrefs[idx]?.hasBadge && (
                          <span className="text-xs px-2 py-0.5 bg-foreground text-background rounded-full">
                            {t.footer.hiring}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
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
