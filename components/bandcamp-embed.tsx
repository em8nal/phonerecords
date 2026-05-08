/**
 * Bandcamp embed — best-effort renderer.
 *
 * Bandcamp's embed iframe needs a numeric album/track ID and the artist
 * subdomain. We don't always have the album ID handy, so this component
 * accepts either:
 *   - albumId + artist subdomain (renders inline player)
 *   - or just a fallback link if no albumId is available.
 */

type BandcampEmbedProps = {
  albumId?: number;
  artist: string; // bandcamp subdomain, e.g. "newenafrobeat"
  trackTitle?: string;
  fallbackHref?: string;
  height?: number;
  size?: "small" | "large";
};

export function BandcampEmbed({
  albumId,
  artist,
  trackTitle,
  fallbackHref,
  height,
  size = "large",
}: BandcampEmbedProps) {
  if (!albumId) {
    return (
      <a
        href={fallbackHref || `https://${artist}.bandcamp.com/music`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 h-10 text-sm rounded-full border border-foreground/20 hover:bg-foreground/5 transition-colors"
      >
        Bandcamp · {artist}.bandcamp.com
      </a>
    );
  }

  const h = height ?? (size === "large" ? 470 : 120);
  const layout = size === "large" ? "size=large/bgcol=ffffff/linkcol=0687f5/tracklist=true/transparent=true/" : "size=small/bgcol=ffffff/linkcol=0687f5/transparent=true/";
  const src = `https://bandcamp.com/EmbeddedPlayer/album=${albumId}/${layout}`;

  return (
    <div className="bandcamp-embed border border-foreground/10 bg-foreground/[0.02]">
      <iframe
        src={src}
        seamless
        loading="lazy"
        title={`Bandcamp player — ${trackTitle || artist}`}
        style={{ width: "100%", height: `${h}px`, border: 0, display: "block" }}
      />
    </div>
  );
}
