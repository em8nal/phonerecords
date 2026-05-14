import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { artistSlugs, getArtist } from "@/lib/artists";
import { getArtistEntries } from "@/lib/catalog";
import { getRelease } from "@/lib/releases";

type ActionLink = { href: string; kind: "listen" | "buy" };

function pickReleaseAction(links: { label: string; href: string }[] | undefined): ActionLink | null {
  if (!links?.length) return null;
  // Priority: explicit buy markers first (Discogs marketplace, Beatport), then listen (Bandcamp/Spotify/SoundCloud).
  for (const l of links) {
    const u = l.href.toLowerCase();
    if (u.includes("discogs.com/release") || u.includes("beatport.com")) {
      return { href: l.href, kind: "buy" };
    }
  }
  for (const l of links) {
    const u = l.href.toLowerCase();
    if (u.includes("bandcamp.com") || u.includes("open.spotify.com") || u.includes("soundcloud.com") || u.includes("music.apple.com")) {
      return { href: l.href, kind: "listen" };
    }
  }
  return { href: links[0].href, kind: "listen" };
}

/** Returns up to one listen action AND one buy action — both can render side by side. */
function pickReleaseActions(
  links: { label: string; href: string }[] | undefined,
): { listen?: ActionLink; buy?: ActionLink } {
  if (!links?.length) return {};
  let listen: ActionLink | undefined;
  let buy: ActionLink | undefined;
  for (const l of links) {
    const u = l.href.toLowerCase();
    const isBuy =
      u.includes("discogs.com/release") ||
      u.includes("beatport.com") ||
      u.includes("elasticstage.com");
    const isListen =
      u.includes("open.spotify.com") ||
      u.includes("music.apple.com") ||
      u.includes("bandcamp.com") ||
      u.includes("soundcloud.com") ||
      u.includes("tidal.com") ||
      u.includes("youtube.com");
    if (isBuy && !buy) buy = { href: l.href, kind: "buy" };
    else if (isListen && !listen) listen = { href: l.href, kind: "listen" };
  }
  return { listen, buy };
}
import { SpotifyArtistEmbed } from "@/components/spotify-embed";
import type { Language } from "@/lib/translations";

function extractSpotifyArtistId(links: { href: string }[]): string | null {
  const sp = links.find((l) => l.href.includes("open.spotify.com/artist/"));
  if (!sp) return null;
  const m = sp.href.match(/artist\/([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}


type ArtistParams = { lang: string; slug: string };

export function generateStaticParams() {
  const langs: Language[] = ["es", "en"];
  return langs.flatMap((lang) =>
    artistSlugs.map((slug) => ({ lang, slug }))
  );
}

function trimToLength(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-—]+$/, "") + "…";
}

export async function generateMetadata(
  { params }: { params: Promise<ArtistParams> }
): Promise<Metadata> {
  const { lang, slug } = await params;
  const artist = getArtist(slug);
  if (!artist) return { title: "Artista no encontrado" };
  const isEs = lang === "es";
  const desc = trimToLength(isEs ? artist.bio.es : artist.bio.en, 158);
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
    ? { back: "Volver al roster", releases: "Discografía", links: "Enlaces", origin: "Origen", genre: "Género", stats: "Métricas", roster: "Roster", listenSpotify: "Escuchar en Spotify", catalogue: "Catálogo", viewRelease: "Ver release", listen: "Escuchar", buy: "Comprar" }
    : { back: "Back to roster", releases: "Discography", links: "Links", origin: "Origin", genre: "Genre", stats: "Metrics", roster: "Roster", listenSpotify: "Listen on Spotify", catalogue: "Catalogue", viewRelease: "View release", listen: "Listen", buy: "Buy" };
  const numberLocale = isEs ? "es-CL" : "en-US";
  const url = `https://phonerecords.cl/${lang}/artistas/${slug}`;
  const spotifyArtistId = extractSpotifyArtistId(artist.links);
  // Full discography for the profile (rich + lightweight unioned, no /catalogo curation).
  const allEntries = getArtistEntries(slug);

  // Schema.org JSON-LD: MusicGroup + BreadcrumbList for rich snippets.
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicGroup",
        "@id": `${url}#artist`,
        name: artist.name,
        description: bio,
        genre: artist.genres,
        url,
        sameAs: artist.links.map((l) => l.href),
        location: {
          "@type": "Place",
          name: artist.origin,
        },
        recordLabel: {
          "@type": "MusicLabel",
          "@id": "https://phonerecords.cl/#organization",
          name: "PHŌNÉ Records",
        },
        ...(allEntries.length
          ? {
              album: allEntries.map((r) => ({
                "@type": "MusicAlbum",
                name: r.title,
                ...(r.year ? { datePublished: r.year } : {}),
                ...(r.label ? { recordLabel: { "@type": "Organization", name: r.label } } : {}),
                ...(r.notes ? { description: r.notes } : {}),
                byArtist: { "@id": `${url}#artist` },
              })),
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "PHŌNÉ Records",
            item: `https://phonerecords.cl/${lang}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: labels.roster,
            item: `https://phonerecords.cl/${lang}#roster`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: artist.name,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navigation />

      <article className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-24">
        {/* Back link */}
        <Link
          href={`/${lang}#roster`}
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
          <div className="lg:col-span-8 space-y-6 text-lg lg:text-xl text-foreground/90 leading-relaxed">
            {bio.split(/\n{2,}/).map((paragraph, i) => (
              <p key={i} className={i === 0 ? "text-xl lg:text-2xl text-foreground" : ""}>
                {paragraph}
              </p>
            ))}
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

            {/* Press kit */}
            <div>
              <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
                {isEs ? "Press kit" : "Press kit"}
              </h3>
              <Link
                href={`/press/${lang}/${slug}`}
                className="inline-flex items-center gap-2 px-4 h-10 text-sm rounded-full border border-foreground/20 hover:bg-foreground/5 transition-colors"
              >
                <FileText className="w-4 h-4" />
                {isEs ? "Descargar PDF" : "Download PDF"}
              </Link>
            </div>
          </aside>
        </section>

        {/* Spotify embed (top tracks) */}
        {spotifyArtistId && (
          <section className="mb-20">
            <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-6">
              {labels.listenSpotify}
            </h2>
            <SpotifyArtistEmbed artistId={spotifyArtistId} />
          </section>
        )}

        {/* Full discography — rich entries link to detail pages, lightweight ones don't */}
        {allEntries.length > 0 ? (
          <section className="mb-20">
            <div className="flex items-baseline justify-between mb-12">
              <h2 className="text-3xl lg:text-5xl font-display tracking-tight">
                {labels.releases}
              </h2>
              <Link
                href={`/${lang}/catalogo`}
                className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                {labels.catalogue} →
              </Link>
            </div>
            <div className="border-t border-foreground/10">
              {allEntries.map((r) => {
                const release = r.releaseSlug ? getRelease(r.releaseSlug) : undefined;
                const richActions = pickReleaseActions(release?.links);
                // Compose final listen + buy. Lightweight entries (no rich record) fall back to externalHref.
                let listenAction: ActionLink | undefined = richActions.listen;
                let buyAction: ActionLink | undefined = richActions.buy;
                if (!buyAction && r.externalHref && (r.externalKind ?? "buy") === "buy") {
                  buyAction = { href: r.externalHref, kind: "buy" };
                }
                if (!listenAction && r.externalHref && r.externalKind === "listen") {
                  listenAction = { href: r.externalHref, kind: "listen" };
                }
                const titleNode = (
                  <span className="font-display text-lg group-hover:translate-x-1 transition-transform inline-block">
                    {r.title}
                  </span>
                );
                return (
                  <div
                    key={r.key}
                    className="group grid grid-cols-12 gap-4 py-6 border-b border-foreground/10 hover:bg-foreground/[0.02] transition-colors px-2 -mx-2"
                  >
                    <div className="col-span-6 sm:col-span-2 font-mono text-sm text-muted-foreground self-center">
                      {r.year || r.releaseDate.slice(0, 7)}
                    </div>
                    <div className="col-span-12 sm:col-span-5 order-3 sm:order-none">
                      {r.releaseSlug ? (
                        <Link href={`/${lang}/releases/${r.releaseSlug}`}>{titleNode}</Link>
                      ) : (
                        titleNode
                      )}
                      {r.format && r.format !== "—" && (
                        <div className="text-sm text-muted-foreground mt-1">{r.format}</div>
                      )}
                    </div>
                    <div className="col-span-12 sm:col-span-3 text-sm text-muted-foreground self-center order-4 sm:order-none">
                      {r.label && <div className="font-mono text-xs uppercase tracking-wider">{r.label}</div>}
                      {r.notes && <div className="mt-1">{r.notes}</div>}
                    </div>
                    <div className="col-span-6 sm:col-span-2 self-center order-2 sm:order-none">
                      <div className="flex flex-col sm:items-end gap-1.5">
                        {listenAction && (
                          <a
                            href={listenAction.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 h-9 text-xs font-mono font-bold uppercase tracking-widest rounded-full bg-foreground text-background hover:bg-foreground/85 transition-colors w-full sm:w-auto"
                          >
                            ▶ {labels.listen}
                          </a>
                        )}
                        {buyAction && (
                          <a
                            href={buyAction.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 h-9 text-xs font-mono font-bold uppercase tracking-widest rounded-full border border-foreground/20 text-foreground hover:bg-foreground hover:text-background transition-colors w-full sm:w-auto"
                          >
                            {labels.buy} <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}
      </article>

      <FooterSection />
    </main>
  );
}
