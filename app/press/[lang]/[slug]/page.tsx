import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { artistSlugs, getArtist } from "@/lib/artists";
import { getArtistEntries } from "@/lib/catalog";
import type { Language } from "@/lib/translations";
import { PrintButton } from "@/components/print-button";

// Max releases to print in the discography section (keeps press kit ≤ 2 pages).
// Beyond this we show a tail line directing readers to the full catalog page.
const MAX_DISCOGRAPHY_ENTRIES = 18;

type PressParams = { lang: string; slug: string };

export function generateStaticParams() {
  const langs: Language[] = ["es", "en"];
  return langs.flatMap((lang) =>
    artistSlugs.map((slug) => ({ lang, slug }))
  );
}

export async function generateMetadata(
  { params }: { params: Promise<PressParams> }
): Promise<Metadata> {
  const { lang, slug } = await params;
  const artist = getArtist(slug);
  if (!artist) return { title: "Press kit" };
  const isEs = lang === "es";
  return {
    title: `${artist.name} — Press Kit`,
    description: isEs
      ? `Press kit oficial de ${artist.name} para uso editorial, prensa y booking. PHŌNÉ Records.`
      : `Official press kit for ${artist.name} — editorial, press and booking use. PHŌNÉ Records.`,
    alternates: {
      canonical: `https://phonerecords.cl/press/${lang}/${slug}`,
      languages: {
        es: `https://phonerecords.cl/press/es/${slug}`,
        en: `https://phonerecords.cl/press/en/${slug}`,
      },
    },
    robots: { index: false, follow: true }, // press kit pages: not indexed but linkable
  };
}

export default async function PressKitPage({
  params,
}: {
  params: Promise<PressParams>;
}) {
  const { lang, slug } = await params;
  const artist = getArtist(slug);
  if (!artist) notFound();

  const isEs = lang === "es";
  const bio = isEs ? artist.bio.es : artist.bio.en;

  // Build discography: prefer curated inline `artist.releases`; fall back to
  // catalog entries (rich + lightweight) so Solis/Ecamhi also have a section.
  type DiscoRow = {
    year: string;
    title: string;
    format?: string;
    label?: string;
    notes?: string;
  };
  const inlineReleases: DiscoRow[] = (artist.releases ?? []).map((r) => ({
    year: r.year,
    title: r.title,
    format: r.format,
    label: r.label,
    notes: r.notes,
  }));
  const fallbackReleases: DiscoRow[] = inlineReleases.length
    ? []
    : getArtistEntries(slug).map((e) => ({
        year: e.year,
        title: e.title,
        format: e.format,
        label: e.label,
        notes: e.notes,
      }));
  const allReleases = inlineReleases.length ? inlineReleases : fallbackReleases;
  const discography = allReleases.slice(0, MAX_DISCOGRAPHY_ENTRIES);
  const extraReleases = Math.max(0, allReleases.length - discography.length);
  const useTwoColumnDisco = discography.length > 10;

  const t = isEs
    ? {
        pressKit: "PRESS KIT",
        download: "Descargar PDF",
        backToArtist: "Volver a la página del artista",
        downloadHint: "Usa el botón de tu navegador 'Guardar como PDF' al imprimir.",
        bio: "Biografía",
        discography: "Discografía",
        moreReleases: (n: number) =>
          `+${n} releases adicionales · catálogo completo en phonerecords.cl/es/artistas/${slug}`,
        links: "Enlaces",
        about: "Sobre PHŌNÉ Records",
        aboutBlurb:
          "PHŌNÉ Records es un sello cultural independiente con dirección autoral, orientado a la producción integral de obras musicales situadas y al cuidado estratégico de trayectorias artísticas. Operamos en la intersección entre creación, gestión, circulación y memoria.",
        contact: "Contacto",
        booking: "Booking",
        press: "Prensa",
        general: "Prensa · Booking · General",
        web: "Web",
        instagram: "Instagram",
        bookingEU: "Booking EU",
        location: "Sede",
        managementInfo:
          "Booking europeo gestionado por Ludwig Sound Booking Agency (Heidelberg, Alemania). Para Latinoamérica y resto del mundo: PHŌNÉ Records.",
        generated: "Documento generado",
      }
    : {
        pressKit: "PRESS KIT",
        download: "Download PDF",
        backToArtist: "Back to artist page",
        downloadHint: "Use your browser's 'Save as PDF' option when printing.",
        bio: "Biography",
        discography: "Discography",
        moreReleases: (n: number) =>
          `+${n} more releases · full catalogue at phonerecords.cl/en/artistas/${slug}`,
        links: "Links",
        about: "About PHŌNÉ Records",
        aboutBlurb:
          "PHŌNÉ Records is an independent cultural label with strong authorial direction, oriented towards the integral production of situated musical works and the strategic care of artistic trajectories. We operate at the intersection of creation, management, circulation and memory.",
        contact: "Contact",
        booking: "Booking",
        press: "Press",
        general: "Press · Booking · General",
        web: "Web",
        instagram: "Instagram",
        bookingEU: "EU Booking",
        location: "Based in",
        managementInfo:
          "European booking handled by Ludwig Sound Booking Agency (Heidelberg, Germany). For Latin America and the rest of the world: PHŌNÉ Records.",
        generated: "Document generated",
      };

  const today = new Date().toLocaleDateString(isEs ? "es-CL" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="press-page bg-white text-black min-h-screen">
      {/* Toolbar — hidden when printing */}
      <div className="press-toolbar print:hidden sticky top-0 z-50 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between gap-4">
        <Link
          href={`/${lang}/artistas/${slug}`}
          className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToArtist}
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-black/50 hidden sm:block">{t.downloadHint}</span>
          <PrintButton label={t.download} />
        </div>
      </div>

      {/* Document — A4 layout */}
      <div className="press-document mx-auto bg-white">
        {/* Header */}
        <header className="press-header">
          <div className="press-logo">
            <Image
              src="/phone-logo-dark.png"
              alt="PHŌNÉ Records"
              width={2000}
              height={2000}
              className="press-logo-img"
            />
          </div>
          <div className="press-header-meta">
            <div className="press-kit-label">{t.pressKit}</div>
            <div className="press-kit-date">{today}</div>
          </div>
        </header>

        {/* Artist title */}
        <section className="press-artist-block">
          <div className="press-eyebrow">
            {artist.genres.join(" · ")} · {artist.origin}
          </div>
          <h1 className="press-artist-name">{artist.name}</h1>
        </section>

        {/* Bio */}
        <section className="press-section">
          <h2 className="press-section-title">{t.bio}</h2>
          <div className="press-bio">
            {bio.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* Discography */}
        {discography.length > 0 && (
          <section className="press-section">
            <h2 className="press-section-title">{t.discography}</h2>
            <ul
              className={
                useTwoColumnDisco
                  ? "press-disco-list press-disco-two-col"
                  : "press-disco-list"
              }
            >
              {discography.map((r, i) => (
                <li key={`${r.year}-${i}`} className="press-disco-item">
                  <span className="press-disco-year">{r.year}</span>
                  <span className="press-disco-body">
                    <span className="press-disco-name">{r.title}</span>
                    {(r.format || r.label) && (
                      <span className="press-disco-meta">
                        {[r.format, r.label].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            {extraReleases > 0 && (
              <p className="press-disco-tail">{t.moreReleases(extraReleases)}</p>
            )}
          </section>
        )}

        {/* Links */}
        {artist.links.length > 0 && (
          <section className="press-section">
            <h2 className="press-section-title">{t.links}</h2>
            <ul className="press-links-list">
              {artist.links.map((l) => (
                <li key={l.href}>
                  <span className="press-link-label">{l.label}</span>
                  <span className="press-link-href">{l.href}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* PHŌNÉ block at the bottom — generic press kit footer */}
        <section className="press-label-block" aria-label="PHŌNÉ Records contact">
          <div className="press-label-header">
            <Image
              src="/phone-logo-dark.png"
              alt="PHŌNÉ Records"
              width={2000}
              height={2000}
              className="press-label-logo"
            />
            <div className="press-label-title-block">
              <div className="press-label-title">{t.about}</div>
              <div className="press-label-subtitle">phonerecords.cl</div>
            </div>
          </div>

          <p className="press-label-blurb">{t.aboutBlurb}</p>

          <div className="press-label-contact">
            <div className="press-contact-grid">
              <div className="press-contact-row">
                <span className="press-contact-label">{t.general}</span>
                <span className="press-contact-value">contacto@phonerecords.cl</span>
              </div>
              <div className="press-contact-row">
                <span className="press-contact-label">{t.bookingEU}</span>
                <span className="press-contact-value">Ludwig Sound · info@ludwigsound.com</span>
              </div>
              <div className="press-contact-row">
                <span className="press-contact-label">{t.instagram}</span>
                <span className="press-contact-value">@phone_records</span>
              </div>
              <div className="press-contact-row">
                <span className="press-contact-label">{t.web}</span>
                <span className="press-contact-value">phonerecords.cl</span>
              </div>
              <div className="press-contact-row">
                <span className="press-contact-label">{t.location}</span>
                <span className="press-contact-value">Ñuñoa · Santiago de Chile</span>
              </div>
            </div>
            <p className="press-mgmt-note">{t.managementInfo}</p>
          </div>

          <div className="press-footnote">
            PHŌNÉ Records · Santiago de Chile · {t.generated}: {today}
          </div>
        </section>
      </div>
    </div>
  );
}
