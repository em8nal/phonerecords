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
};

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

  const activeArtist = searchParams.get("artist") ?? "";
  const [pending, setPending] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeArtist) return entries;
    return entries.filter((e) => e.matchArtistSlugs.includes(activeArtist));
  }, [entries, activeArtist]);

  function setArtist(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("artist", slug);
    else params.delete("artist");
    setPending(slug);
    startTransition(() => {
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      setPending(null);
    });
  }

  const totalAll = entries.length;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={labels.artist}>
        <Chip
          active={!activeArtist}
          loading={isPending && pending === ""}
          onClick={() => setArtist("")}
        >
          {labels.all} <span className="opacity-50 ml-1">({totalAll})</span>
        </Chip>
        {artistsList.map((a) => (
          <Chip
            key={a.slug}
            active={activeArtist === a.slug}
            loading={isPending && pending === a.slug}
            onClick={() => setArtist(a.slug)}
          >
            {a.name} <span className="opacity-50 ml-1">({a.count})</span>
          </Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground py-12">{labels.empty}</p>
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
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
