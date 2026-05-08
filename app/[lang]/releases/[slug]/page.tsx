import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { releaseSlugs, getRelease, getReleasesByArtist } from "@/lib/releases";
import { getArtist } from "@/lib/artists";
import type { Language } from "@/lib/translations";

type ReleaseParams = { lang: string; slug: string };

export function generateStaticParams() {
  const langs: Language[] = ["es", "en"];
  return langs.flatMap((lang) =>
    releaseSlugs.map((slug) => ({ lang, slug }))
  );
}

function trimToLength(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-—]+$/, "") + "…";
}

export async function generateMetadata(
  { params }: { params: Promise<ReleaseParams> }
): Promise<Metadata> {
  const { lang, slug } = await params;
  const release = getRelease(slug);
  if (!release) return { title: "Release no encontrado" };
  const isEs = lang === "es";
  const desc = trimToLength(isEs ? release.description.es : release.description.en, 158);
  return {
    title: `${release.title} — ${release.artistName}`,
    description: desc,
    alternates: {
      canonical: `https://phonerecords.cl/${lang}/releases/${slug}`,
      languages: {
        es: `https://phonerecords.cl/es/releases/${slug}`,
        en: `https://phonerecords.cl/en/releases/${slug}`,
        "x-default": `https://phonerecords.cl/es/releases/${slug}`,
      },
    },
    openGraph: {
      title: `${release.title} — ${release.artistName}`,
      description: desc,
      url: `https://phonerecords.cl/${lang}/releases/${slug}`,
      locale: isEs ? "es_CL" : "en_US",
    },
  };
}

export default async function ReleasePage({
  params,
}: {
  params: Promise<ReleaseParams>;
}) {
  const { lang, slug } = await params;
  const release = getRelease(slug);
  if (!release) notFound();

  const isEs = lang === "es";
  const description = isEs ? release.description.es : release.description.en;
  const artist = getArtist(release.artistSlug);
  const otherReleases = getReleasesByArtist(release.artistSlug)
    .filter((r) => r.slug !== release.slug)
    .slice(0, 3);

  const labels = isEs
    ? { back: "Volver al catálogo", tracklist: "Tracklist", credits: "Créditos", links: "Escuchar", releaseDate: "Fecha", format: "Formato", label: "Sello", more: "Más de", track: "Track" }
    : { back: "Back to catalogue", tracklist: "Tracklist", credits: "Credits", links: "Listen", releaseDate: "Released", format: "Format", label: "Label", more: "More from", track: "Track" };

  // JSON-LD MusicAlbum schema
  const url = `https://phonerecords.cl/${lang}/releases/${slug}`;
  const albumSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicAlbum",
        "@id": `${url}#album`,
        name: release.title,
        url,
        datePublished: release.releaseDate,
        albumReleaseType: release.type === "single"
          ? "https://schema.org/SingleRelease"
          : release.type === "ep"
          ? "https://schema.org/EPRelease"
          : "https://schema.org/AlbumRelease",
        ...(release.label ? { recordLabel: { "@type": "Organization", name: release.label } } : {}),
        byArtist: {
          "@type": "MusicGroup",
          name: release.artistName,
          url: `https://phonerecords.cl/${lang}/artistas/${release.artistSlug}`,
        },
        numTracks: release.tracklist?.length,
        ...(release.tracklist
          ? {
              track: release.tracklist.map((t) => ({
                "@type": "MusicRecording",
                name: t.title,
                ...(t.duration ? { duration: `PT${t.duration.split(":").reduce((acc, v, i, a) => acc + (i === a.length - 1 ? `${v}S` : `${v}M`), "")}` } : {}),
                ...(t.composer ? { composer: { "@type": "Person", name: t.composer } } : {}),
              })),
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "PHŌNÉ Records", item: `https://phonerecords.cl/${lang}` },
          { "@type": "ListItem", position: 2, name: isEs ? "Catálogo" : "Catalogue", item: `https://phonerecords.cl/${lang}/catalogo` },
          { "@type": "ListItem", position: 3, name: `${release.artistName} — ${release.title}`, item: url },
        ],
      },
    ],
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(albumSchema) }}
      />
      <Navigation />

      <article className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-24">
        <Link
          href={`/${lang}/catalogo`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {labels.back}
        </Link>

        {/* Header */}
        <header className="mb-16 lg:mb-24">
          <Link
            href={`/${lang}/artistas/${release.artistSlug}`}
            className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-6 inline-block hover:text-foreground transition-colors"
          >
            {release.artistName}
          </Link>
          <h1 className="text-5xl lg:text-8xl font-display tracking-tight leading-[0.9] mb-8">
            {release.title}
          </h1>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-mono text-muted-foreground uppercase tracking-widest">
            <span>{labels.releaseDate}: {release.releaseDate}</span>
            <span>{labels.format}: {release.format}</span>
            {release.label && <span>{labels.label}: {release.label}</span>}
          </div>
        </header>

        {/* Description */}
        <section className="grid lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          <div className="lg:col-span-8">
            <p className="text-lg lg:text-xl text-foreground/90 leading-relaxed">
              {description}
            </p>
          </div>

          {release.links && release.links.length > 0 && (
            <aside className="lg:col-span-4">
              <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
                {labels.links}
              </h3>
              <ul className="space-y-2">
                {release.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm hover:text-foreground/70 transition-colors group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </section>

        {/* Tracklist */}
        {release.tracklist && release.tracklist.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl lg:text-5xl font-display tracking-tight mb-12">
              {labels.tracklist}
            </h2>
            <div className="border-t border-foreground/10">
              {release.tracklist.map((t) => (
                <div
                  key={t.n}
                  className="grid grid-cols-12 gap-4 py-5 border-b border-foreground/10 items-baseline"
                >
                  <div className="col-span-1 font-mono text-xs text-muted-foreground">
                    {String(t.n).padStart(2, "0")}
                  </div>
                  <div className="col-span-9 lg:col-span-8">
                    <div className="text-base lg:text-lg">{t.title}</div>
                    {t.composer && (
                      <div className="text-xs text-muted-foreground mt-1">
                        comp. {t.composer}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 lg:col-span-3 text-right font-mono text-sm text-muted-foreground">
                    {t.duration}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Credits */}
        {release.credits && release.credits.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl lg:text-5xl font-display tracking-tight mb-12">
              {labels.credits}
            </h2>
            <div className="space-y-4">
              {release.credits.map((c, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 py-3 border-b border-foreground/10">
                  <div className="col-span-12 sm:col-span-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {c.role}
                  </div>
                  <div className="col-span-12 sm:col-span-8 text-base">{c.name}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* More from artist */}
        {otherReleases.length > 0 && artist && (
          <section className="pt-12 border-t border-foreground/10">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8">
              {labels.more} {artist.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
              {otherReleases.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${lang}/releases/${r.slug}`}
                  className="group bg-background p-6 hover:bg-foreground/[0.02] transition-colors"
                >
                  <div className="font-mono text-xs text-muted-foreground mb-3">{r.releaseDate.slice(0, 7)}</div>
                  <div className="text-lg font-display tracking-tight group-hover:translate-x-1 transition-transform">{r.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{r.format}</div>
                  <ArrowUpRight className="w-4 h-4 mt-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <FooterSection />
    </main>
  );
}
