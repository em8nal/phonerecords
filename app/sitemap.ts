import type { MetadataRoute } from "next";
import { artistSlugs } from "@/lib/artists";
import { releaseSlugs } from "@/lib/releases";

const BASE = "https://phonerecords.cl";
const LOCALES = ["es", "en"] as const;

function withAlternates(path: string) {
  return {
    es: `${BASE}/es${path}`,
    en: `${BASE}/en${path}`,
    "x-default": `${BASE}/es${path}`,
  };
}

const STATIC_PAGES = ["/manifiesto", "/sello", "/catalogo", "/eventos", "/contacto", "/privacidad", "/press-kit"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home = LOCALES.map((lang) => ({
    url: `${BASE}/${lang}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 1.0,
    alternates: { languages: withAlternates("") },
  }));

  const editorial = LOCALES.flatMap((lang) =>
    STATIC_PAGES.map((path) => ({
      url: `${BASE}/${lang}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: withAlternates(path) },
    }))
  );

  const artists = LOCALES.flatMap((lang) =>
    artistSlugs.map((slug) => ({
      url: `${BASE}/${lang}/artistas/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages: withAlternates(`/artistas/${slug}`) },
    }))
  );

  const releases = LOCALES.flatMap((lang) =>
    releaseSlugs.map((slug) => ({
      url: `${BASE}/${lang}/releases/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      alternates: { languages: withAlternates(`/releases/${slug}`) },
    }))
  );

  return [...home, ...editorial, ...artists, ...releases];
}
