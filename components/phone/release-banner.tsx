import { getImageProps } from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActiveBanners, isReleased, type BannerEntry } from "@/lib/banner";
import { translations, type Language } from "@/lib/translations";
import { BannerCarousel } from "./banner-carousel";

type ReleaseBannerProps = {
  lang: Language;
  /** Solo para pruebas; por defecto, la hora actual del servidor. */
  now?: Date;
};

const DESKTOP = { width: 2560, height: 1440 } as const; // 16:9
const MOBILE = { width: 1200, height: 1500 } as const; // 4:5

// Foco visible sobre la foto (el anillo por defecto del Button es poco visible sobre imagen oscura).
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black";

// Altura fija del contenedor: igual con 1 banner o con carrusel (sin layout shift).
const FRAME_CLASS =
  "relative h-[85svh] md:h-[70svh] min-h-[480px] max-h-[820px] w-full overflow-hidden bg-neutral-950 text-white";

type BannerSlideProps = {
  banner: BannerEntry;
  lang: Language;
  now: Date;
  titleId: string;
  /** El primer slide es el LCP: eager + fetchPriority alta. Los demás, lazy. */
  first: boolean;
};

/** Contenido de un banner (imagen, overlay, textos y CTAs). Server component. */
function BannerSlide({ banner, lang, now, titleId, first }: BannerSlideProps) {
  const t = translations[lang].banner;
  const released = isReleased(banner, now);

  const absolute = /^https?:\/\//.test(banner.cta.href);
  const external = banner.cta.external ?? absolute;
  const ctaHref = absolute ? banner.cta.href : `/${lang}${banner.cta.href}`;
  const ctaLabel = (released ? banner.cta.afterRelease : banner.cta.beforeRelease)[lang];
  const secondaryHref = `/${lang}${banner.secondaryHref}`;
  // Texto del link secundario según el destino: ficha de artista o ficha de lanzamiento.
  const toArtist = banner.secondaryHref.startsWith("/artistas/");
  const secondaryLabel = toArtist ? t.viewArtist : t.viewRelease;
  const secondaryAria = toArtist
    ? t.viewArtistOf.replace("{artist}", banner.artist)
    : t.viewReleaseOf.replace("{title}", banner.title[lang]);

  const alt = banner.image.alt[lang];
  const common = {
    alt,
    sizes: "100vw",
    loading: first ? ("eager" as const) : ("lazy" as const),
    fetchPriority: first ? ("high" as const) : ("low" as const),
  };
  // Art direction: <source> solo para >= 768px (16:9); el <img> es la versión
  // 4:5 de móvil. El navegador descarga una sola.
  const { props: desktop } = getImageProps({ ...common, src: banner.image.desktop, ...DESKTOP });
  const { props: mobile } = getImageProps({ ...common, src: banner.image.mobile, ...MOBILE });

  return (
    <>
      <picture>
        <source media="(min-width: 768px)" srcSet={desktop.srcSet} sizes="100vw" />
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          {...mobile}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-[50%_30%] md:object-[50%_35%]"
        />
      </picture>

      {/* Overlay para legibilidad del texto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 md:bg-gradient-to-r md:from-black/75 md:via-black/30 md:to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 hidden h-1/2 bg-gradient-to-t from-black/60 to-transparent md:block"
      />

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] items-end px-6 pb-10 lg:px-12 lg:pb-16">
        <div className="max-w-3xl">
          {banner.eyebrow && (
            <p className="mb-4 inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.1em] text-white/85 md:text-base md:tracking-[0.18em]">
              <span className="h-px w-8 bg-white/50" aria-hidden="true" />
              {banner.eyebrow[lang]}
            </p>
          )}

          <h2
            id={titleId}
            className="font-display text-5xl leading-[0.95] tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {banner.title[lang]}
          </h2>
          <p className="mt-3 text-xl text-white/85 md:text-2xl">{banner.artist}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button
              asChild
              size="lg"
              className={`h-14 rounded-full bg-white px-8 text-base text-black hover:bg-white/90 ${FOCUS_RING}`}
            >
              <a href={ctaHref} {...(external && { target: "_blank", rel: "noopener" })}>
                {ctaLabel}
                {external && <span className="sr-only"> {t.opensInNewTab}</span>}
                {external ? <ArrowUpRight className="ml-1" /> : <ArrowRight className="ml-1" />}
              </a>
            </Button>

            <a
              href={secondaryHref}
              aria-label={secondaryAria}
              className={`rounded-sm text-base text-white underline underline-offset-8 decoration-white/40 transition-colors hover:decoration-white ${FOCUS_RING}`}
            >
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Banners de lanzamiento a todo el ancho, justo después del menú.
 * Server component: elige las entradas activas por fecha (lib/banner.ts) y el
 * estado del CTA (Pre-save antes del lanzamiento, Escuchar desde las 00:00
 * de Santiago del día de salida). Con 1 entrada se comporta como un banner
 * simple; con más, renderiza un carrusel (BannerCarousel, client component)
 * cuyo primer slide viene en el HTML del servidor igual que el banner simple.
 * Si no hay entradas activas, no renderiza nada.
 */
export function ReleaseBanner({ lang, now = new Date() }: ReleaseBannerProps) {
  const banners = getActiveBanners(now);
  if (banners.length === 0) return null;

  const t = translations[lang].banner;
  const titleId = (i: number) => (i === 0 ? "release-banner-title" : `release-banner-title-${i}`);

  if (banners.length === 1) {
    return (
      <section
        aria-labelledby="release-banner-title"
        // pt-20 = altura del menú fijo: el menú queda sobre el fondo claro y el banner empieza debajo.
        className="relative bg-background pt-20"
      >
        <div className={FRAME_CLASS}>
          <BannerSlide banner={banners[0]} lang={lang} now={now} titleId={titleId(0)} first />
        </div>
      </section>
    );
  }

  return (
    <BannerCarousel
      frameClassName={FRAME_CLASS}
      labels={{
        region: t.regionLabel,
        slide: t.slide,
        prev: t.prev,
        next: t.next,
        goTo: t.goTo,
        pause: t.pause,
        play: t.play,
      }}
      slides={banners.map((banner, i) => ({
        id: titleId(i),
        node: (
          <BannerSlide
            banner={banner}
            lang={lang}
            now={now}
            titleId={titleId(i)}
            first={i === 0}
          />
        ),
      }))}
    />
  );
}
