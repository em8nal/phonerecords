import { getImageProps } from "next/image";
import type { Language } from "@/lib/translations";

type PageHeroProps = {
  image: {
    desktop: string;
    mobile: string;
    alt: { es: string; en: string };
  };
  /** Es el h1 de la página (el único). Admite saltos de línea ("\n"). */
  title: string;
  eyebrow?: string;
  lang: Language;
  /** "default" = 42svh (máx. 520px); "short" = 28svh. */
  size?: "default" | "short";
  /** Clases extra para la sección (p. ej. "print:hidden"). */
  className?: string;
  /** Tamaño del h1; por defecto el de las demás páginas (text-5xl / lg:text-8xl). */
  titleClassName?: string;
  /** object-position de la foto (clases Tailwind). Por defecto 30 % móvil / 35 % escritorio. */
  imagePosition?: string;
};

const DESKTOP = { width: 2560, height: 1440 } as const; // 16:9
const MOBILE = { width: 1200, height: 1500 } as const; // 4:5

const HEIGHT = {
  default: "h-[42svh] min-h-[320px] max-h-[520px]",
  short: "h-[28svh] min-h-[240px] max-h-[520px]",
} as const;

/**
 * Cabecera fotográfica a todo el ancho para las páginas interiores, justo
 * después del menú. Server component. Contiene el h1 de la página, así que la
 * página no debe renderizar otro. La imagen es el LCP: eager + prioridad alta.
 */
export function PageHero({
  image,
  title,
  eyebrow,
  lang,
  size = "default",
  className = "",
  titleClassName = "text-5xl lg:text-8xl",
  imagePosition = "object-[50%_30%] md:object-[50%_35%]",
}: PageHeroProps) {
  const alt = image.alt[lang];
  const common = {
    alt,
    sizes: "100vw",
    loading: "eager" as const,
    fetchPriority: "high" as const,
  };
  // Art direction: <source> para >= 768px; el <img> es la versión móvil 4:5.
  const { props: desktop } = getImageProps({ ...common, src: image.desktop, ...DESKTOP });
  const { props: mobile } = getImageProps({ ...common, src: image.mobile, ...MOBILE });

  return (
    // pt-20 = altura del menú fijo: el menú queda sobre el fondo claro y la foto empieza debajo.
    <section className={`relative bg-background pt-20 print:pt-0 ${className}`}>
      <div className={`relative w-full overflow-hidden bg-neutral-950 text-white print:h-auto print:min-h-0 print:bg-white print:text-black ${HEIGHT[size]}`}>
        <picture className="print:hidden">
          <source media="(min-width: 768px)" srcSet={desktop.srcSet} sizes="100vw" />
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img
            {...mobile}
            alt={alt}
            className={`absolute inset-0 h-full w-full object-cover ${imagePosition}`}
          />
        </picture>

        {/* Degradado para contraste AA del texto blanco sobre cualquier foto */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15 md:from-black/80 md:via-black/35 print:hidden"
        />

        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] items-end px-6 pb-8 lg:px-12 lg:pb-12 print:h-auto print:px-0 print:pb-6 print:pt-4">
          <div className="max-w-4xl">
            {eyebrow && (
              <p className="mb-4 inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.1em] text-white/90 md:tracking-[0.18em] print:text-black">
                <span className="h-px w-8 bg-white/50" aria-hidden="true" />
                {eyebrow}
              </p>
            )}
            <h1
              className={`font-display leading-[0.95] tracking-tight text-balance whitespace-pre-line ${titleClassName}`}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
