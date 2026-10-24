// Alias de slugs de artista que cambiaron de URL (pendiente 17a, 24-10-2026).
// Módulo puro y sin imports: lo usan los filtros cliente de /videos y /catalogo
// al leer ?artist= sin arrastrar las bios de lib/artists.ts al bundle del
// navegador. lib/artists.ts lo reexporta. Los redirects HTTP de las URLs viejas
// viven en next.config.mjs; `pnpm test:releases` vigila que ambos coincidan.

/** Slug viejo → slug vigente. Cada destino debe existir en lib/artists.ts. */
export const LEGACY_ARTIST_SLUGS: Readonly<Record<string, string>> = {
  "klaus-brantmayer": "klaus-b",
};

/**
 * Slug vigente para un slug que llega de un enlace guardado; cualquier otro valor
 * pasa tal cual. Usa hasOwnProperty para que `?artist=__proto__` (o `constructor`)
 * no devuelva un objeto heredado.
 */
export function resolveArtistSlug(slug: string): string {
  return Object.prototype.hasOwnProperty.call(LEGACY_ARTIST_SLUGS, slug)
    ? LEGACY_ARTIST_SLUGS[slug]
    : slug;
}
