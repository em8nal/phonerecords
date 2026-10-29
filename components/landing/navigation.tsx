"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { LanguageSelector } from "@/components/language-selector";
import { Logo } from "@/components/phone/logo";

export function Navigation() {
  const { t, language } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Menú honesto (22-10): cada ítem va a su destino real. Eventos salió del menú
  // (sigue en el footer); Booking vive en Servicios, fichas y footer; el botón
  // destacado es la suscripción al newsletter.
  // Lote 4 (carril Q): enlaces internos con next/link sin precarga. El overlay
  // móvil está siempre montado (opacity-0), así que con la precarga por defecto el
  // IntersectionObserver pediría todas las rutas del menú en cada página vista en el
  // teléfono. Servicios va a su página propia, no a la sección de la portada.
  const home = `/${language}`;
  const isEs = language === "es";
  const navLinks = [
    { name: "Roster", href: `${home}/artistas` },
    { name: isEs ? "Catálogo" : "Catalogue", href: `${home}/catalogo` },
    { name: t.nav.videos, href: `${home}/videos` },
    { name: t.nav.features, href: `${home}/servicios` },
    { name: t.nav.howItWorks, href: `${home}/manifiesto` },
    { name: t.nav.label, href: `${home}/sello` },
  ];
  const pressHref = `${home}/press-kit`;
  const newsletterHref = `${home}/contacto#newsletter-heading`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled 
          ? "top-4 left-4 right-4" 
          : "top-0 left-0 right-0"
      }`}
    >
      <nav 
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div 
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <Link href={home} prefetch={false} className="flex items-center group text-foreground">
            <Logo
              className={`w-auto transition-all duration-500 ${isScrolled ? "h-7" : "h-8"}`}
            />
          </Link>

          {/* Desktop Navigation desde lg: con 6 ítems la fila no cabe en tablet (768–1023 px usa el menú móvil). */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSelector />
            <Link
              href={pressHref}
              prefetch={false}
              className={`text-foreground/70 hover:text-foreground transition-all duration-500 ${isScrolled ? "text-xs" : "text-sm"}`}
            >
              {t.nav.signIn}
            </Link>
            <Button
              asChild
              size="sm"
              className={`bg-foreground hover:bg-foreground/90 text-background rounded-full transition-all duration-500 ${isScrolled ? "px-4 h-8 text-xs" : "px-6"}`}
            >
              <Link href={newsletterHref} prefetch={false}>
                {t.nav.startCreating}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2"
            aria-expanded={isMobileMenuOpen}
            aria-controls="menu-movil"
            aria-label={
              isMobileMenuOpen
                ? isEs
                  ? "Cerrar menú"
                  : "Close menu"
                : isEs
                  ? "Abrir menú"
                  : "Open menu"
            }
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

      </nav>
      
      {/* Mobile Menu - Full Screen Overlay. Siempre montado para la transición; inert
          lo saca del orden de tabulación y del árbol de accesibilidad mientras está cerrado. */}
      <div
        id="menu-movil"
        inert={!isMobileMenuOpen}
        className={`lg:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          {/* Language Selector Mobile */}
          <div className="mb-8">
            <LanguageSelector />
          </div>
          
          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${
                  isMobileMenuOpen 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Bottom CTAs */}
          <div className={`flex gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${
            isMobileMenuOpen 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <Button
              asChild
              variant="outline"
              className="flex-1 rounded-full h-14 text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href={pressHref} prefetch={false}>
                {t.nav.signIn}
              </Link>
            </Button>
            <Button
              asChild
              className="flex-1 bg-foreground text-background rounded-full h-14 text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href={newsletterHref} prefetch={false}>
                {t.nav.startCreating}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
