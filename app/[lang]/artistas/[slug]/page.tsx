import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { artistLinkRel, artistSameAs, artistSlugs, getArtist, linkPlatform } from "@/lib/artists";
import { getArtistEntries } from "@/lib/catalog";
import { getRelease, isPhoneRelease } from "@/lib/releases";
import { isUpcoming } from "@/lib/release-date";
import { PageHero } from "@/components/phone/page-hero";
import { ArtistCardGrid } from "@/components/phone/artist-card-grid";
import { getArtistHero, getArtistPortrait } from "@/lib/artist-media";
import { ArtistVideosSection } from "@/components/phone/video-artist-section";
import { ArtistKeyFacts } from "@/components/phone/artist-key-facts";
import { ShareBar } from "@/components/share-bar";
import { PlatformIcon } from "@/components/phone/platform-icon";
import { PressKitDownloads } from "@/components/phone/press-kit-downloads";
import { splitOrigin } from "@/lib/artist-facts";

type ActionLink = { href: string; kind: "listen" | "buy" };

// El smart link del lanzamiento (ONErpm, The Orchard) manda como "Escuchar": antes del estreno es el
// pre-save y después lleva a todas las plataformas. Un perfil de Spotify (/artist/) no es el lanzamiento.
function pickReleaseActions(
  links: { label: string; href: string }[] | undefined,
  smartLink?: string,
): { listen?: ActionLink; buy?: ActionLink } {
  if (!links?.length && !smartLink) return {};
  let listen: ActionLink | undefined = smartLink ? { href: smartLink, kind: "listen" } : undefined;
  let buy: ActionLink | undefined;
  for (const l of links ?? []) {
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
      u.includes("onerpm.link") ||
      u.includes("orcd.co") ||
      u.includes("youtube.com");
    const isArtistProfile = u.includes("open.spotify.com/") && u.includes("/artist/");
    if (isBuy && !buy) buy = { href: l.href, kind: "buy" };
    else if (isListen && !isArtistProfile && !listen) listen = { href: l.href, kind: "listen" };
  }
  return { listen, buy };
}
import { SpotifyArtistEmbed } from "@/components/spotify-embed";
import type { Language } from "@/lib/translations";
import { SITE, ORG_ID, artistId as artistLdId, absUrl, toJsonLd, releaseId } from "@/lib/schema";

function extractSpotifyArtistId(links: { href: string }[]): string | null {
  const sp = links.find((l) => l.href.includes("open.spotify.com/artist/"));
  if (!sp) return null;
  const m = sp.href.match(/artist\/([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}


type ArtistParams = { lang: string; slug: string };

/** Fecha ISO completa o parcial ("2026", "2026-06", "2026-06-12"); deja fuera "in production". */
const LD_DATE_RE = /^\d{4}(-\d{2}){0,2}$/;

/**
 * Sello que edita el lanzamiento, para `recordLabel`: PHŌNÉ con el @id de la
 * organización; otro sello solo con su nombre; sin sello o "Independent", nada.
 */
function recordLabelLd(label: string | undefined) {
  if (!label || label === "Independent") return undefined;
  return isPhoneRelease({ label })
    ? { "@id": ORG_ID, "@type": "Organization", name: label }
    : { "@type": "Organization", name: label };
}

// ISR (H2): la discografía marca "Próximamente" con isUpcoming y la sección de videos solo
// muestra los ya publicados. Se regenera con la primera visita después de 5 minutos.
export const revalidate = 300;

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
  if (!artist) return { title: lang === "en" ? "Artist not found" : "Artista no encontrado" };
  const isEs = lang === "es";
  const desc = trimToLength(isEs ? artist.bio.es : artist.bio.en, 158);
  // Same URL for og:image and twitter:image (the ./opengraph-image route of this
  // segment). Set explicitly on both so the two tags can't diverge.
  const ogImage = `https://phonerecords.cl/${lang}/artistas/${slug}/opengraph-image`;
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
      type: "profile",
      siteName: "PHŌNÉ Records",
      title: `${artist.name} — PHŌNÉ Records`,
      description: desc,
      url: `https://phonerecords.cl/${lang}/artistas/${slug}`,
      locale: isEs ? "es_CL" : "en_US",
      images: [
        { url: ogImage, width: 1200, height: 630, alt: `${artist.name} — PHŌNÉ Records` },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${artist.name} — PHŌNÉ Records`,
      description: desc,
      images: [ogImage],
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
    ? { back: "Volver al roster", releases: "Discografía", links: "Enlaces", origin: "Origen", genre: "Género", stats: "Métricas", listenSpotify: "Escuchar en Spotify", catalogue: "Catálogo", viewRelease: "Ver release", listen: "Escuchar", buy: "Comprar", newTab: " (se abre en pestaña nueva)" }
    : { back: "Back to roster", releases: "Discography", links: "Links", origin: "Origin", genre: "Genre", stats: "Metrics", listenSpotify: "Listen on Spotify", catalogue: "Catalogue", viewRelease: "View release", listen: "Listen", buy: "Buy", newTab: " (opens in new tab)" };
  const numberLocale = isEs ? "es-CL" : "en-US";
  const url = `https://phonerecords.cl/${lang}/artistas/${slug}`;
  const spotifyArtistId = extractSpotifyArtistId(artist.links);
  // Full discography for the profile (rich + lightweight unioned, no /catalogo curation).
  const allEntries = getArtistEntries(slug);
  const uiLang: Language = isEs ? "es" : "en";
  // Hero ancho (null para artistas sin foto de hero) y retrato cuadrado (null si no hay).
  const hero = getArtistHero(slug);
  const portrait = getArtistPortrait(slug);

  // Schema.org JSON-LD: MusicGroup + BreadcrumbList for rich snippets.
  // @id estable e igual en ES y EN (la url sí va por idioma); el mismo que usa el
  // `member` del sello en la portada y el `byArtist` de las fichas de lanzamiento.
  const artistId = artistLdId(slug);
  const origin = splitOrigin(artist.origin);
  // `album` solo con los lanzamientos propios: las colaboraciones (otro artista
  // principal) ya cuelgan del grafo de ese artista.
  const ownEntries = allEntries.filter((e) => e.artistSlug === slug);
  // Enlaces de la ficha + MusicBrainz y Wikidata (que no se muestran).
  const sameAs = artistSameAs(artist);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicGroup",
        "@id": artistId,
        name: artist.name,
        ...(artist.alternateName?.length ? { alternateName: artist.alternateName } : {}),
        description: bio,
        genre: artist.genres,
        url,
        ...(sameAs.length ? { sameAs } : {}),
        ...(portrait ? { image: absUrl(portrait) } : {}),
        // Un Place es un lugar: el año de "Santiago, Chile · 2009" va solo en foundingDate.
        location: { "@type": "Place", name: origin.place },
        ...(origin.year
          ? {
              foundingLocation: { "@type": "Place", name: origin.place },
              foundingDate: origin.year,
            }
          : {}),
        // Inverso del `member` de la organización. MusicGroup no tiene `recordLabel`.
        memberOf: { "@id": ORG_ID },
        ...(ownEntries.length
          ? {
              album: ownEntries.map((e) => {
                const date = e.releaseSlug ? e.releaseDate : e.year;
                const recordLabel = recordLabelLd(e.label);
                return {
                  "@type": "MusicAlbum",
                  ...(e.releaseSlug
                    ? {
                        "@id": releaseId(e.releaseSlug),
                        url: `${SITE}/${lang}/releases/${e.releaseSlug}`,
                      }
                    : {}),
                  name: e.title,
                  // `upcoming` se calcula en cada regeneración ISR (revalidate = 300).
                  ...(!e.upcoming && LD_DATE_RE.test(date) ? { datePublished: date } : {}),
                  ...(recordLabel ? { recordLabel } : {}),
                  ...(e.cover ? { image: absUrl(e.cover) } : {}),
                  // Las notas de las entradas livianas están escritas en español.
                  ...(isEs && e.notes ? { description: e.notes } : {}),
                  byArtist: { "@id": artistId },
                };
              }),
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isEs ? "Inicio" : "Home",
            item: `${SITE}/${lang}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: artist.name,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Navigation />
      <main id="contenido" tabIndex={-1} className="relative min-h-screen overflow-x-hidden noise-overlay">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }}
        />

        {/* Hero fotográfico ancho: contiene el h1 (nombre) y el eyebrow (géneros) */}
        {hero && (
          <PageHero image={hero} title={artist.name} eyebrow={artist.genres.join(" · ")} lang={uiLang} />
        )}

        <article
          className={`max-w-[1200px] mx-auto px-6 lg:px-12 pb-8 lg:pb-12 ${hero ? "pt-12 lg:pt-16" : "pt-32 lg:pt-40"}`}
        >
          {/* Back link */}
          <Link
            href={`/${lang}/artistas`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {labels.back}
          </Link>

          {/* Con hero, el nombre y los géneros ya van sobre la foto (h1 del PageHero) y la ficha
              abre con "Datos clave"; sin hero, "Datos clave" va justo después del header. */}
          {hero ? (
            <>
              <ShareBar
                className="mb-12"
                url={url}
                title={`${artist.name} — PHŌNÉ Records`}
                lang={uiLang}
                contentType="artist"
                itemId={artist.slug}
              />
              <ArtistKeyFacts slug={slug} lang={uiLang} className="mb-16 lg:mb-20" />
            </>
          ) : (
            <>
            <header className={`mb-16 lg:mb-24 ${portrait ? "grid lg:grid-cols-12 gap-8 lg:gap-12 items-end" : ""}`}>
              <div className={portrait ? "lg:col-span-7 order-2 lg:order-1" : ""}>
                <div className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-6">
                  {labels.genre} · {artist.genres.join(" · ")}
                </div>
                <h1 className="text-5xl lg:text-8xl font-display tracking-tight leading-[0.9] mb-8">
                  {artist.name}
                </h1>
                <div className="font-mono text-sm text-muted-foreground">
                  {labels.origin} · {artist.origin}
                </div>
                <ShareBar
                  className="mt-6"
                  url={url}
                  title={`${artist.name} — PHŌNÉ Records`}
                  lang={uiLang}
                  contentType="artist"
                  itemId={artist.slug}
                />
              </div>
              {portrait && (
                <div className="lg:col-span-5 order-1 lg:order-2">
                  <div className="relative aspect-square bg-foreground/5 rounded overflow-hidden">
                    {/* Sin hero, el retrato es el LCP de la página */}
                    <Image
                      src={portrait}
                      alt={artist.name}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              )}
            </header>
            <ArtistKeyFacts slug={slug} lang={uiLang} className="mb-16 lg:mb-20" />
            </>
          )}

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
              {/* Con hero, el retrato cuadrado baja al aside como ficha junto a métricas y enlaces
                  (en Newen es la única foto real de la banda: su hero es el arte del single). */}
              {hero && portrait && (
                <figure className="relative aspect-square w-full max-w-xs lg:max-w-none overflow-hidden rounded bg-foreground/5">
                  <Image
                    src={portrait}
                    alt={isEs ? `${artist.name}, retrato` : `${artist.name}, portrait`}
                    fill
                    sizes="(min-width: 1200px) 330px, (min-width: 1024px) 30vw, 320px"
                    className="object-cover"
                  />
                </figure>
              )}
              {artist.stats && (
                <div>
                  <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
                    {labels.stats}
                  </h2>
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
                  <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
                    {labels.links}
                  </h2>
                  {/* Orden y etiquetas: ARTIST_PLATFORMS (lib/artists.ts). rel="me" solo en los perfiles propios. */}
                  <ul className="space-y-1">
                    {artist.links.map((link) => {
                      const platform = linkPlatform(link.href);
                      return (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel={artistLinkRel(link.href)}
                            className="inline-flex min-h-8 items-center gap-2.5 text-sm hover:text-foreground/70 transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-brand"
                          >
                            {platform && <PlatformIcon platform={platform.id} />}
                            {link.label}
                            <span className="sr-only">{isEs ? " (se abre en pestaña nueva)" : " (opens in new tab)"}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Press kit: los PDF en español y en inglés desde cualquier idioma (11c) y la versión web */}
              <div>
                <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
                  Press kit
                </h2>
                <PressKitDownloads slug={slug} uiLang={uiLang} layout="stack" />
                <Link
                  href={`/press/${lang}/${slug}`}
                  className="mt-4 inline-flex min-h-8 items-center font-mono text-xs uppercase tracking-widest text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {isEs ? "Versión web" : "View online"}
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
              <SpotifyArtistEmbed
                artistId={spotifyArtistId}
                cover={portrait ?? undefined}
                coverAlt={artist.name}
                title={artist.name}
              />
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
                  const richActions = pickReleaseActions(release?.links, release?.smartLink);
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
                              <span aria-hidden="true">▶</span>
                              {listenAction.href.includes("onerpm.link") && isUpcoming(r.releaseDate) ? "Pre-save" : labels.listen}
                              <span className="sr-only">{` — ${r.title}${labels.newTab}`}</span>
                            </a>
                          )}
                          {buyAction && (
                            <a
                              href={buyAction.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 px-3.5 h-9 text-xs font-mono font-bold uppercase tracking-widest rounded-full border border-foreground/20 text-foreground hover:bg-foreground hover:text-background transition-colors w-full sm:w-auto"
                            >
                              {labels.buy}
                              <span className="sr-only">{` — ${r.title}${labels.newTab}`}</span>
                              <ExternalLink className="w-3 h-3" aria-hidden />
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

          {/* Videos del artista (hasta 6 facades), justo después de la discografía; null si no tiene */}
          <ArtistVideosSection artistSlug={slug} lang={uiLang} />
        </article>

        {/* Grilla de cierre: los demás artistas del roster (plan §5.7.5) */}
        <ArtistCardGrid lang={uiLang} excludeSlug={slug} />
      </main>
      <FooterSection />
    </>
  );
}
