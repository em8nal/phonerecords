"use client";

import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Language } from "@/lib/translations";
import type { VideoKind } from "@/lib/videos";
import { VideoCard, type VideoCardData } from "@/components/phone/video-card";
import { GridFillers } from "@/components/phone/grid-fillers";

type ArtistChip = { slug: string; name: string; count: number };

export type VideosGridLabels = {
  filterArtist: string;
  filterKind: string;
  all: string;
  count: string;
  empty: string;
  clear: string;
  /** Etiquetas de tipo ya en el idioma de la página (VIDEO_KIND_LABEL[lang]). */
  kindLabels: Record<VideoKind, string>;
};

type Props = {
  lang: Language;
  /** Solo videos ya publicados, ordenados por fecha desc (lo decide el servidor). */
  entries: VideoCardData[];
  /** Artistas con al menos un video, en el orden del roster. */
  artistsList: ArtistChip[];
  /** Tipos presentes, en el orden de VIDEO_KINDS. */
  kinds: VideoKind[];
  labels: VideosGridLabels;
};

const CHIP_FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

/**
 * Filtros por artista (?artist=) y por tipo (?kind=) con la misma mecánica que
 * /catalogo: los params viven en la URL (router.replace sin scroll), así una
 * URL filtrada llega ya filtrada desde el servidor y se puede compartir.
 * Valores desconocidos se ignoran (= Todos). Grilla 2/4 columnas con rellenos.
 */
export function VideosGrid({ lang, entries, artistsList, kinds, labels }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const rawArtist = searchParams.get("artist") ?? "";
  const activeArtist = artistsList.some((a) => a.slug === rawArtist) ? rawArtist : "";
  const rawKind = searchParams.get("kind") ?? "";
  const activeKind = (kinds as string[]).includes(rawKind) ? (rawKind as VideoKind) : "";

  // Conteo por tipo dentro del artista activo (los chips de artista cuentan sobre el total).
  const kindCounts = useMemo(() => {
    const pool = activeArtist ? entries.filter((e) => e.artistSlug === activeArtist) : entries;
    const counts = new Map<VideoKind, number>();
    for (const e of pool) counts.set(e.kind, (counts.get(e.kind) ?? 0) + 1);
    return counts;
  }, [entries, activeArtist]);

  const filtered = useMemo(
    () =>
      entries.filter(
        (e) => (!activeArtist || e.artistSlug === activeArtist) && (!activeKind || e.kind === activeKind),
      ),
    [entries, activeArtist, activeKind],
  );

  function navigate(params: URLSearchParams) {
    startTransition(() => {
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  function updateParam(key: "artist" | "kind", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    navigate(params);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("artist");
    params.delete("kind");
    navigate(params);
  }

  return (
    <div className="space-y-6">
      {/* Filtro por artista */}
      <div role="group" aria-label={labels.filterArtist} className="flex flex-wrap gap-2">
        <Chip active={!activeArtist} onClick={() => updateParam("artist", "")}>
          {labels.all} <span className="opacity-50 ml-1">({entries.length})</span>
        </Chip>
        {artistsList.map((a) => (
          <Chip key={a.slug} active={activeArtist === a.slug} onClick={() => updateParam("artist", a.slug)}>
            {a.name} <span className="opacity-50 ml-1">({a.count})</span>
          </Chip>
        ))}
      </div>

      {/* Filtro por tipo */}
      <div role="group" aria-label={labels.filterKind} className="flex flex-wrap gap-2">
        <KindChip active={!activeKind} onClick={() => updateParam("kind", "")}>
          {labels.all}
        </KindChip>
        {kinds.map((k) => (
          <KindChip key={k} active={activeKind === k} onClick={() => updateParam("kind", k)}>
            {labels.kindLabels[k]} <span className="opacity-50 ml-1">({kindCounts.get(k) ?? 0})</span>
          </KindChip>
        ))}
      </div>

      <p role="status" className="sr-only">
        {filtered.length} {labels.count}
      </p>

      {filtered.length === 0 ? (
        <div className="py-12 space-y-4">
          <p className="text-muted-foreground">{labels.empty}</p>
          <button
            type="button"
            onClick={clearFilters}
            className={`inline-flex min-h-11 items-center rounded-full border border-foreground/20 px-5 text-sm hover:bg-foreground/5 transition-colors ${CHIP_FOCUS}`}
          >
            {labels.clear}
          </button>
        </div>
      ) : (
        <div
          aria-busy={isPending || undefined}
          className={`grid grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10 transition-opacity ${isPending ? "opacity-70" : ""}`}
        >
          {filtered.map((v) => (
            <VideoCard key={v.slug} video={v} lang={lang} kindLabel={labels.kindLabels[v.kind]} heading="h2" />
          ))}
          <GridFillers count={filtered.length} cols={4} />
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-11 items-center px-4 text-sm rounded-full border transition-colors ${CHIP_FOCUS} ${
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-transparent text-foreground/70 border-foreground/15 hover:border-foreground/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function KindChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-11 items-center px-4 text-xs font-mono uppercase tracking-widest rounded-full border transition-colors ${CHIP_FOCUS} ${
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-transparent text-muted-foreground border-foreground/10 hover:border-foreground/30 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
