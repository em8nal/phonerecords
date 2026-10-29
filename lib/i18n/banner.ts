// Banner de lanzamientos de la portada (components/phone/release-banner.tsx).
// Los textos por lanzamiento viven en lib/banner.ts.
export const banner = {
  en: {
    viewRelease: "View release",
    // {title} se reemplaza por el título del lanzamiento (aria-label del link)
    viewReleaseOf: "View release: {title}",
    opensInNewTab: "(opens in new tab)",
    viewArtist: "View artist",
    // {artist} se reemplaza por el nombre del artista (aria-label del link)
    viewArtistOf: "View artist: {artist}",
    regionLabel: "Featured releases",
    prev: "Previous banner",
    next: "Next banner",
    goTo: "Go to banner {n}",
    slide: "slide",
    pause: "Pause automatic rotation",
    play: "Resume automatic rotation",
  },
  es: {
    viewRelease: "Ver ficha",
    // {title} se reemplaza por el título del lanzamiento (aria-label del link)
    viewReleaseOf: "Ver ficha de {title}",
    opensInNewTab: "(se abre en pestaña nueva)",
    viewArtist: "Ver artista",
    // {artist} se reemplaza por el nombre del artista (aria-label del link)
    viewArtistOf: "Ver artista: {artist}",
    regionLabel: "Lanzamientos destacados",
    prev: "Banner anterior",
    next: "Banner siguiente",
    goTo: "Ir al banner {n}",
    slide: "diapositiva",
    pause: "Pausar rotación automática",
    play: "Reanudar rotación automática",
  },
} as const;
