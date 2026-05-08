import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { artistSlugs, getArtist } from "@/lib/artists";
import type { Language } from "@/lib/translations";
import { PrintButton } from "@/components/print-button";

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

  const t = isEs
    ? {
        pressKit: "PRESS KIT",
        download: "Descargar PDF",
        backToArtist: "Volver a la página del artista",
        downloadHint: "Usa el botón de tu navegador 'Guardar como PDF' al imprimir.",
        bio: "Biografía",
        discography: "Discografía",
        links: "Enlaces",
        about: "Sobre PHŌNÉ Records",
        aboutBlurb:
          "PHŌNÉ Records es un sello cultural independiente con dirección autoral, orientado a la producción integral de obras musicales situadas y al cuidado estratégico de trayectorias artísticas. Operamos en la intersección entre creación, gestión, circulación y memoria.",
        contact: "Contacto",
        booking: "Booking",
        press: "Prensa",
        general: "General",
        web: "Web",
        bookingEU: "Booking EU",
        managementInfo:
          "Para representación, booking y consultas editoriales, escribir a los contactos siguientes. Booking europeo gestionado por Ludwig Sound Booking Agency (Heidelberg, Alemania).",
        generated: "Documento generado",
      }
    : {
        pressKit: "PRESS KIT",
        download: "Download PDF",
        backToArtist: "Back to artist page",
        downloadHint: "Use your browser's 'Save as PDF' option when printing.",
        bio: "Biography",
        discography: "Discography",
        links: "Links",
        about: "About PHŌNÉ Records",
        aboutBlurb:
          "PHŌNÉ Records is an independent cultural label with strong authorial direction, oriented towards the integral production of situated musical works and the strategic care of artistic trajectories. We operate at the intersection of creation, management, circulation and memory.",
        contact: "Contact",
        booking: "Booking",
        press: "Press",
        general: "General",
        web: "Web",
        bookingEU: "EU Booking",
        managementInfo:
          "For representation, booking and editorial inquiries, please write to the contacts below. European booking handled by Ludwig Sound Booking Agency (Heidelberg, Germany).",
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
        {artist.releases && artist.releases.length > 0 && (
          <section className="press-section">
            <h2 className="press-section-title">{t.discography}</h2>
            <table className="press-discography">
              <tbody>
                {artist.releases.map((r, i) => (
                  <tr key={`${r.year}-${i}`}>
                    <td className="press-disc-year">{r.year}</td>
                    <td className="press-disc-title">
                      <span className="press-disc-name">{r.title}</span>
                      {r.format && <span className="press-disc-format">{r.format}</span>}
                    </td>
                    <td className="press-disc-label">
                      {r.label && <span>{r.label}</span>}
                      {r.notes && <span className="press-disc-notes">{r.notes}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <span className="press-contact-label">{t.press}</span>
                <span className="press-contact-value">press@phonerecords.cl</span>
              </div>
              <div className="press-contact-row">
                <span className="press-contact-label">{t.booking}</span>
                <span className="press-contact-value">booking@phonerecords.cl</span>
              </div>
              <div className="press-contact-row">
                <span className="press-contact-label">{t.general}</span>
                <span className="press-contact-value">contacto@phonerecords.cl</span>
              </div>
              <div className="press-contact-row">
                <span className="press-contact-label">{t.bookingEU}</span>
                <span className="press-contact-value">Ludwig Sound · info@ludwigsound.com</span>
              </div>
              <div className="press-contact-row">
                <span className="press-contact-label">{t.web}</span>
                <span className="press-contact-value">https://phonerecords.cl</span>
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
