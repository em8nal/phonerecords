import { renderHomeOg } from "@/lib/og/home-image";

// Fallback card for routes outside /[lang] (e.g. /press/..., not-found).
// Pages under /es and /en use app/[lang]/opengraph-image.tsx instead.
export const alt = "PHŌNÉ Records — Sello cultural independiente · Santiago de Chile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return renderHomeOg();
}
