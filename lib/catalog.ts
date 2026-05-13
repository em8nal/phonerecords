// Unified catalog view: rich releases (lib/releases.ts) + lightweight artist
// release entries declared inline in lib/artists.ts.
//
// Lightweight entries don't have detail pages; the catalog card links to the
// artist page instead.

import { releases } from "./releases";
import { artists } from "./artists";

export type CatalogEntry = {
  key: string;
  title: string;
  artistSlug: string;
  artistName: string;
  /** Artist slugs the entry should match when filtering (primary + featured). */
  matchArtistSlugs: string[];
  releaseDate: string; // YYYY[-MM[-DD]] — used for sorting
  year: string; // display label ("2026", "in production", etc.)
  format: string;
  label?: string;
  notes?: string;
  cover?: string;
  /** Slug if the entry has a /releases/[slug] detail page; otherwise undefined. */
  releaseSlug?: string;
  /** External storefront/streaming URL for lightweight entries (no detail page). */
  externalHref?: string;
  externalKind?: "buy" | "listen";
};

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeDateForSort(raw: string): string {
  // Accept "YYYY", "YYYY-MM", "YYYY-MM-DD", "in production", "2026 (in process)"
  const m = raw.match(/(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  if (!m) return "0000-00-00"; // "in production", "TBA" → sort to bottom
  const y = m[1];
  const mo = m[2] ?? "00";
  const d = m[3] ?? "00";
  return `${y}-${mo}-${d}`;
}

function isVinyl(format: string): boolean {
  return /(vinilo|vinyl|\bLP\b|\bEP\b|12"|7"|10")/i.test(format);
}

// Per-artist curation for /catalogo. Solis publishes prolifically; on PHŌNÉ
// catalog we only surface vinyls + roster collabs (with Ecamhi). Full digital
// catalog stays on his /artistas/claudio-solis page.
type CatalogRule = {
  /** Keep entry only if it matches one of these predicates. */
  keep?: (entry: CatalogEntry) => boolean;
};

const CATALOG_RULES: Record<string, CatalogRule> = {
  "claudio-solis": {
    keep: (e) =>
      isVinyl(e.format) || e.matchArtistSlugs.includes("ecamhi"),
  },
};

function applyCatalogRules(entries: CatalogEntry[]): CatalogEntry[] {
  return entries.filter((e) => {
    // Apply the rule of the PRIMARY artist only — featured collabs ride along
    // with the rule of the primary artist.
    const rule = CATALOG_RULES[e.artistSlug];
    if (!rule?.keep) return true;
    return rule.keep(e);
  });
}

function buildAllEntries(): CatalogEntry[] {
  const rich: CatalogEntry[] = releases.map((r) => ({
    key: r.slug,
    title: r.title,
    artistSlug: r.artistSlug,
    artistName: r.artistName,
    matchArtistSlugs: [r.artistSlug, ...(r.featuredArtistSlugs ?? [])],
    releaseDate: r.releaseDate,
    year: String(r.year),
    format: r.format,
    label: r.label,
    cover: r.cover,
    releaseSlug: r.slug,
  }));

  const seen = new Set(rich.map((r) => `${r.artistSlug}::${r.title.toLowerCase()}`));

  const lightweight: CatalogEntry[] = artists.flatMap((a) =>
    (a.releases ?? [])
      .filter((r) => !seen.has(`${a.slug}::${r.title.toLowerCase()}`))
      .map((r) => ({
        key: `${a.slug}-${slugify(r.title)}-${slugify(r.year)}`,
        title: r.title,
        artistSlug: a.slug,
        artistName: a.name,
        matchArtistSlugs: [a.slug],
        releaseDate: normalizeDateForSort(r.year),
        year: r.year,
        format: r.format ?? "—",
        label: r.label,
        notes: r.notes,
        cover: undefined,
        releaseSlug: undefined,
        externalHref: r.href,
        externalKind: r.hrefKind ?? (r.href ? "buy" : undefined),
      })),
  );

  return [...rich, ...lightweight].sort((a, b) =>
    b.releaseDate.localeCompare(a.releaseDate),
  );
}

/** Entries shown on the public /catalogo page — per-artist curation applied. */
export function getCatalogEntries(): CatalogEntry[] {
  return applyCatalogRules(buildAllEntries());
}

/** Entries shown on an artist profile page — no curation, full discography. */
export function getArtistEntries(slug: string): CatalogEntry[] {
  return buildAllEntries().filter((e) => e.matchArtistSlugs.includes(slug));
}

export function getCatalogArtists() {
  const nameBySlug = new Map<string, string>();
  for (const a of artists) nameBySlug.set(a.slug, a.name);

  // Counts reflect what's actually visible in /catalogo (post-rule).
  const counts = new Map<string, number>();
  for (const entry of getCatalogEntries()) {
    for (const slug of entry.matchArtistSlugs) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([slug, count]) => ({ slug, name: nameBySlug.get(slug) ?? slug, count }))
    .sort((a, b) => b.count - a.count);
}
