"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { CatalogEntry } from "@/lib/catalog";

type ArtistChip = { slug: string; name: string; count: number };

type Labels = {
  all: string;
  empty: string;
  detail: string;
  artist: string;
  year: string;
  sort: string;
  sortRecent: string;
  sortAZ: string;
  sortZA: string;
  viewGrid: string;
  viewList: string;
};

type Sort = "recent" | "az" | "za";
type View = "grid" | "list";

export function CatalogGrid({
  lang,
  entries,
  artistsList,
  labels,
}: {
  lang: string;
  entries: CatalogEntry[];
  artistsList: ArtistChip[];
  labels: Labels;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [pending, setPending] = useState<string | null>(null);

  const activeArtist = searchParams.get("artist") ?? "";
  const activeYear = searchParams.get("year") ?? "";
  const activeSort = (searchParams.get("sort") as Sort) || "recent";
  const activeView = (searchParams.get("view") as View) || "grid";

  // Compute year chips from the entries (after artist filter, before year filter).
  const yearList = useMemo(() => {
    const counts = new Map<string, number>();
    const pool = activeArtist
      ? entries.filter((e) => e.matchArtistSlugs.includes(activeArtist))
      : entries;
    for (const e of pool) {
      const m = e.year.match(/(\d{4})/);
      const key = m ? m[1] : "—";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => {
        const na = /^\d{4}$/.test(a.year) ? Number(a.year) : -1;
        const nb = /^\d{4}$/.test(b.year) ? Number(b.year) : -1;
        if (na === -1 && nb === -1) return a.year.localeCompare(b.year);
        if (na === -1) return 1;
        if (nb === -1) return -1;
        return nb - na;
      });
  }, [entries, activeArtist]);

  const filtered = useMemo(() => {
    let pool = entries;
    if (activeArtist) pool = pool.filter((e) => e.matchArtistSlugs.includes(activeArtist));
    if (activeYear) pool = pool.filter((e) => e.year.match(/(\d{4})/)?.[1] === activeYear);
    const arr = [...pool];
    if (activeSort === "az") {
      arr.sort((a, b) => a.title.localeCompare(b.title, lang === "es" ? "es" : "en", { sensitivity: "base" }));
    } else if (activeSort === "za") {
      arr.sort((a, b) => b.title.localeCompare(a.title, lang === "es" ? "es" : "en", { sensitivity: "base" }));
    } else {
      arr.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    }
    return arr;
  }, [entries, activeArtist, activeYear, activeSort, lang]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    setPending(`${key}:${value}`);
    startTransition(() => {
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      setPending(null);
    });
  }

  const totalAll = entries.length;

  return (
    <div className="space-y-6">
      {/* Artist filter */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={labels.artist}>
        <Chip
          active={!activeArtist}
          loading={isPending && pending === "artist:"}
          onClick={() => updateParam("artist", "")}
        >
          {labels.all} <span className="opacity-50 ml-1">({totalAll})</span>
        </Chip>
        {artistsList.map((a) => (
          <Chip
            key={a.slug}
            active={activeArtist === a.slug}
            loading={isPending && pending === `artist:${a.slug}`}
            onClick={() => updateParam("artist", a.slug)}
          >
            {a.name} <span className="opacity-50 ml-1">({a.count})</span>
          </Chip>
        ))}
      </div>

      {/* Year + sort row */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={labels.year}>
          <YearChip
            active={!activeYear}
            loading={isPending && pending === "year:"}
            onClick={() => updateParam("year", "")}
          >
            {labels.year}
          </YearChip>
          {yearList.map((y) => (
            <YearChip
              key={y.year}
              active={activeYear === y.year}
              loading={isPending && pending === `year:${y.year}`}
              onClick={() => updateParam("year", y.year)}
            >
              {y.year} <span className="opacity-50 ml-1">({y.count})</span>
            </YearChip>
          ))}
        </div>

        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex gap-1.5" role="radiogroup" aria-label={labels.sort}>
            {(
              [
                ["recent", labels.sortRecent],
                ["az", labels.sortAZ],
                ["za", labels.sortZA],
              ] as const
            ).map(([key, label]) => (
              <SortBtn
                key={key}
                active={activeSort === key}
                loading={isPending && pending === `sort:${key}`}
                onClick={() => updateParam("sort", key === "recent" ? "" : key)}
              >
                {label}
              </SortBtn>
            ))}
          </div>
          <div className="flex gap-1.5" role="radiogroup">
            <SortBtn
              active={activeView === "grid"}
              loading={isPending && pending === "view:"}
              onClick={() => updateParam("view", "")}
            >
              <GridIcon /> {labels.viewGrid}
            </SortBtn>
            <SortBtn
              active={activeView === "list"}
              loading={isPending && pending === "view:list"}
              onClick={() => updateParam("view", "list")}
            >
              <ListIcon /> {labels.viewList}
            </SortBtn>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground py-12">{labels.empty}</p>
      ) : activeView === "list" ? (
        <div className="border-t border-foreground/10">
          {filtered.map((r) => {
            const href = r.releaseSlug
              ? `/${lang}/releases/${r.releaseSlug}`
              : `/${lang}/artistas/${r.artistSlug}`;
            const dateLabel = r.year || r.releaseDate.slice(0, 7);
            return (
              <Link
                key={r.key}
                href={href}
                className="group grid grid-cols-12 gap-4 items-center py-3 border-b border-foreground/10 hover:bg-foreground/[0.02] transition-colors px-2 -mx-2"
              >
                <div className="col-span-2 sm:col-span-1 relative aspect-square overflow-hidden bg-foreground/5 rounded">
                  {r.cover ? (
                    <Image
                      src={r.cover}
                      alt={`${r.title} — ${r.artistName} · portada`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center text-muted-foreground/40 font-display text-[10px] tracking-widest"
                      role="img"
                      aria-label={`${r.title} — ${r.artistName} · portada pendiente`}
                    >
                      PHŌNÉ
                    </div>
                  )}
                </div>
                <div className="col-span-7 sm:col-span-6 min-w-0">
                  <div className="font-display text-base lg:text-lg truncate group-hover:translate-x-1 transition-transform">
                    {r.title}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {r.artistName}
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-2 font-mono text-xs uppercase tracking-widest text-muted-foreground truncate">
                  {dateLabel}
                </div>
                <div className="hidden sm:block sm:col-span-3 font-mono text-xs uppercase tracking-wider text-muted-foreground/70 truncate">
                  {r.label || r.format.split(" · ")[0]}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
          {filtered.map((r) => {
            const href = r.releaseSlug
              ? `/${lang}/releases/${r.releaseSlug}`
              : `/${lang}/artistas/${r.artistSlug}`;
            const dateLabel = r.year || r.releaseDate.slice(0, 7);
            return (
              <Link
                key={r.key}
                href={href}
                className="group block bg-background hover:bg-foreground/[0.02] transition-colors"
              >
                <div className="relative aspect-square overflow-hidden bg-foreground/5">
                  {r.cover ? (
                    <Image
                      src={r.cover}
                      alt={`${r.title} — ${r.artistName}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/40"
                      role="img"
                      aria-label={`${r.title} — ${r.artistName} · portada pendiente`}
                    >
                      <span className="font-display text-5xl tracking-widest">PHŌNÉ</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest">
                        {r.artistName}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 lg:p-8">
                  <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    {dateLabel} · {r.format.split(" · ")[0]}
                  </div>
                  <h2 className="text-xl lg:text-2xl font-display tracking-tight mb-1 group-hover:translate-x-1 transition-transform">
                    {r.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{r.artistName}</p>
                  {r.label && (
                    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground/70 mt-3">
                      {r.label}
                    </p>
                  )}
                  {r.notes && (
                    <p className="text-xs text-muted-foreground mt-2">{r.notes}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  loading,
  onClick,
  children,
}: {
  active: boolean;
  loading?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-loading={loading || undefined}
      className={`inline-flex items-center px-4 h-10 text-sm rounded-full border transition-colors ${
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-transparent text-foreground/70 border-foreground/15 hover:border-foreground/40 hover:text-foreground"
      } ${loading ? "opacity-60" : ""}`}
    >
      {children}
    </button>
  );
}

function YearChip({
  active,
  loading,
  onClick,
  children,
}: {
  active: boolean;
  loading?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-loading={loading || undefined}
      className={`inline-flex items-center px-3 h-7 text-xs font-mono uppercase tracking-widest rounded-full border transition-colors ${
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-transparent text-muted-foreground border-foreground/10 hover:border-foreground/30 hover:text-foreground"
      } ${loading ? "opacity-60" : ""}`}
    >
      {children}
    </button>
  );
}

function GridIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <rect x="1" y="2" width="14" height="2" rx="1" />
      <rect x="1" y="7" width="14" height="2" rx="1" />
      <rect x="1" y="12" width="14" height="2" rx="1" />
    </svg>
  );
}

function SortBtn({
  active,
  loading,
  onClick,
  children,
}: {
  active: boolean;
  loading?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-checked={active}
      role="radio"
      data-loading={loading || undefined}
      className={`inline-flex items-center gap-1.5 px-3 h-8 text-xs font-mono uppercase tracking-widest rounded-full border transition-colors ${
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-transparent text-foreground/70 border-foreground/15 hover:border-foreground/40 hover:text-foreground"
      } ${loading ? "opacity-60" : ""}`}
    >
      {children}
    </button>
  );
}
