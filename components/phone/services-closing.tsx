import Link from "next/link";
import { getImageProps } from "next/image";
import { ArrowRight } from "lucide-react";
import { CLOSING_BG, type ServicesCopy } from "@/lib/services";

// Cierre de /servicios: banda oscura sobre la foto B/N de La Banca (la misma del bloque
// Servicios de la portada). Regla de contraste: imagen oscura → texto claro, con velo negro
// 65 % (blanco/70 queda en ≥ 4,76:1 en el peor bloque medido; ver features-section.tsx).
// Decorativa (alt="") y bajo el pliegue: carga diferida. Server component.
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950";

type Props = {
  copy: ServicesCopy["closing"];
  contactHref: string;
  catalogHref: string;
};

export function ServicesClosing({ copy, contactHref, catalogHref }: Props) {
  // Art direction como en PageHero: <source> para ≥ 768 px; el <img> es la versión 4:5.
  const { props: bgDesktop } = getImageProps({ ...CLOSING_BG.desktop, alt: "", sizes: "100vw", loading: "lazy" });
  const { props: bgMobile } = getImageProps({ ...CLOSING_BG.mobile, alt: "", sizes: "100vw", loading: "lazy" });

  return (
    <section
      aria-labelledby="cierre-title"
      className="relative isolate overflow-hidden bg-neutral-950 py-24 text-white lg:py-36"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <picture>
          <source media="(min-width: 768px)" srcSet={bgDesktop.srcSet} sizes="(min-width: 2560px) 2560px, 100vw" />
          <img {...bgMobile} alt="" className="absolute inset-0 h-full w-full object-cover md:object-left" />
        </picture>
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <h2
          id="cierre-title"
          className="max-w-4xl font-display text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-7xl"
        >
          {copy.title}
        </h2>
        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-white/80">{copy.body}</p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href={contactHref}
            className={`inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-base text-neutral-950 transition-colors hover:bg-white/90 ${FOCUS}`}
          >
            {copy.primary}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <Link
            href={catalogHref}
            className={`inline-flex h-14 items-center justify-center rounded-full border border-white/40 px-8 text-base text-white transition-colors hover:bg-white/10 ${FOCUS}`}
          >
            {copy.secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
