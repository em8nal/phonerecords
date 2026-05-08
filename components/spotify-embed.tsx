/**
 * Spotify embed — artist top-tracks widget.
 * Requires only the Spotify artist ID (we have those for Newen and Klaus
 * in lib/artists.ts via the artist page metadata or hardcoded slug→id map).
 */

type SpotifyArtistEmbedProps = {
  artistId: string;
  height?: number;
};

export function SpotifyArtistEmbed({ artistId, height = 352 }: SpotifyArtistEmbedProps) {
  const src = `https://open.spotify.com/embed/artist/${artistId}?utm_source=phonerecords&theme=0`;
  return (
    <div className="spotify-embed">
      <iframe
        src={src}
        width="100%"
        height={height}
        loading="lazy"
        title="Spotify embed — top tracks"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        style={{ border: 0, borderRadius: 12, display: "block" }}
      />
    </div>
  );
}

export function SpotifyAlbumEmbed({ albumId, height = 352 }: { albumId: string; height?: number }) {
  const src = `https://open.spotify.com/embed/album/${albumId}?utm_source=phonerecords&theme=0`;
  return (
    <div className="spotify-embed">
      <iframe
        src={src}
        width="100%"
        height={height}
        loading="lazy"
        title="Spotify embed — album"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        style={{ border: 0, borderRadius: 12, display: "block" }}
      />
    </div>
  );
}
