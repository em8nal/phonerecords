import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { artistSlugs, getArtist } from "@/lib/artists";
import type { Language } from "@/lib/translations";

type ArtistParams = { lang: string; slug: string };

export function generateStaticParams() {
  const langs: Language[] = ["es", "en"];
  return langs.flatMap((lang) =>
    artistSlugs.map((slug) => ({ lang, slug }))
  );
}

export async function generateMetadata(
  { params }: { params: Promise<ArtistParams> }
): Promise<Metadata> {
  const { lang, slug } = await params;
  const artist = getArtist(slug);
  if (!artist) return { title: "Artista no encontrado" };
  const isEs = lang === "es";
  const desc = (isEs ? artist.bio.es : artist.bio.en).slice(0, 160);
  return {
    title: artist.name,
    description: desc,
    alternates: {
      canonical: `https://phonerecords.cl/${lang}/artistas/${slug}`,
      languages: {
        es: `https://phonerecords.cl/es/artistas/${slug}`,
        en: `https://phonerecords.cl/en/artistas/${slug}`,
        "x-default": `https://phonerecords.cl/es/artistas/${slug}`,
      },
    },
    openGraph: {
      title: `${artist.name} — PHŌNÉ Records`,
      description: desc,
      url: `https://phonerecords.cl/${lang}/artistas/${slug}`,
      locale: isEs ? "es_CL" : "en_US",
    },
  };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<ArtistParams>;
}) {
  const { lang, slug } = await params;
  const artist = getArtist(slug);
  if (!artist) notFound();

  const isEs = lang === "es";
  const bio = isEs ? artist.bio.es : artist.bio.en;
  const labels = isEs
    ? { back: "Volver al roster", releases: "Discografía", links: "Enlaces", origin: "Origen", genre: "Género", stats: "Métricas" }
    : { back: "Back to roster", releases: "Discography", links: "Links", origin: "Origin", genre: "Genre", stats: "Metrics" };
  const numberLocale = isEs ? "es-CL" : "en-US";

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />

      <article className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-24">
        {/* Back link */}
        <Link
          href={`/${lang}#integrations`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {labels.back}
        </Link>

        {/* Header */}
        <header className="mb-16 lg:mb-24">
          <div className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-6">
            {labels.genre} · {artist.genres.join(" · ")}
          </div>
          <h1 className="text-5xl lg:text-8xl font-display tracking-tight leading-[0.9] mb-8">
            {artist.name}
          </h1>
          <div className="font-mono text-sm text-muted-foreground">
            {labels.origin} · {artist.origin}
          </div>
        </header>

        {/* Bio */}
        <section className="grid lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          <div className="lg:col-span-8">
            <p className="text-lg lg:text-xl text-foreground/90 leading-relaxed whitespace-pre-line">
              {bio}
            </p>
          </div>

          {/* Sidebar: links + stats */}
          <aside className="lg:col-span-4 space-y-10">
            {artist.stats && (
              <div>
                <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
                  {labels.stats}
                </h3>
                <dl className="space-y-3">
                  {artist.stats.monthlyListeners != null && (
                    <div className="flex items-baseline justify-between border-b border-foreground/10 pb-2">
                      <dt className="text-sm text-muted-foreground">
                        {isEs ? "Oyentes mensuales" : "Monthly listeners"}
                      </dt>
                      <dd className="font-display text-xl">
                        {artist.stats.monthlyListeners.toLocaleString(numberLocale)}
                      </dd>
                    </div>
                  )}
                  {artist.stats.spotifyFollowers != null && (
                    <div className="flex items-baseline justify-between border-b border-foreground/10 pb-2">
                      <dt className="text-sm text-muted-foreground">Spotify</dt>
                      <dd className="font-display text-xl">
                        {artist.stats.spotifyFollowers.toLocaleString(numberLocale)}
                      </dd>
                    </div>
                  )}
                  {artist.stats.youtubeSubs != null && (
                    <div className="flex items-baseline justify-between border-b border-foreground/10 pb-2">
                      <dt className="text-sm text-muted-foreground">YouTube</dt>
                      <dd className="font-display text-xl">
                        {artist.stats.youtubeSubs.toLocaleString(numberLocale)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {artist.links.length > 0 && (
              <div>
                <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
                  {labels.links}
                </h3>
                <ul className="space-y-2">
                  {artist.links.map((link) => (
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
              </div>
            )}
          </aside>
        </section>

        {/* Releases */}
        {artist.releases && artist.releases.length > 0 && (
          <section>
            <h2 className="text-3xl lg:text-5xl font-display tracking-tight mb-12">
              {labels.releases}
            </h2>
            <div className="border-t border-foreground/10">
              {artist.releases.map((release, i) => (
                <div
                  key={`${release.year}-${release.title}-${i}`}
                  className="grid grid-cols-12 gap-4 py-6 border-b border-foreground/10 hover:bg-foreground/[0.02] transition-colors px-2"
                >
                  <div className="col-span-12 sm:col-span-2 font-mono text-sm text-muted-foreground">
                    {release.year}
                  </div>
                  <div className="col-span-12 sm:col-span-6">
                    <div className="font-display text-lg">{release.title}</div>
                    {release.format && (
                      <div className="text-sm text-muted-foreground mt-1">{release.format}</div>
                    )}
                  </div>
                  <div className="col-span-12 sm:col-span-4 text-sm text-muted-foreground">
                    {release.label && <div className="font-mono text-xs uppercase tracking-wider">{release.label}</div>}
                    {release.notes && <div className="mt-1">{release.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      <FooterSection />
    </main>
  );
}
