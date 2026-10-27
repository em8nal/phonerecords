import type { MetadataRoute } from "next";

// Buscadores y asistentes de IA que citan y enlazan fuentes (no entrenan modelos).
// Cada crawler obedece solo su grupo más específico, así que cada grupo repite el
// bloqueo de /api/. Los crawlers de entrenamiento quedan en el grupo general, sin
// cambios: permitirlos o bloquearlos lo decide el equipo (X27).
const AI_SEARCH_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      ...AI_SEARCH_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: "https://phonerecords.cl/sitemap.xml",
    host: "https://phonerecords.cl",
  };
}
