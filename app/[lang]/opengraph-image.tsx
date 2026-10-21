import { renderHomeOg } from "@/lib/og/home-image";

// `alt` is a static export (bilingual): it can't vary per locale without
// generateImageMetadata, which would move the image to /<lang>/opengraph-image/<id>.
export const alt = "PHŌNÉ Records — sello discográfico independiente · independent record label";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Only /es and /en exist; anything else 404s instead of rendering.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}

export default async function OG({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return renderHomeOg(lang === "en" ? "en" : "es");
}
