/**
 * YouTube embed (privacy-enhanced domain, lazy-loaded, responsive 16:9).
 */
export function YouTubeEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
  return (
    <div className="relative w-full aspect-video overflow-hidden border border-foreground/10 bg-foreground/5">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title={title}
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
