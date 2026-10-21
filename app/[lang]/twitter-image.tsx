import { renderHomeOg, homeOgImageMetadata } from "@/lib/og/home-image";

// Same card as ./opengraph-image so twitter:image matches og:image per locale.
// Locale-specific alt via generateImageMetadata; served at /<lang>/twitter-image/<id>
// (the plain /<lang>/twitter-image URL is rewritten to it in proxy.ts).
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return homeOgImageMetadata(lang);
}

export default async function TwitterImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return renderHomeOg(lang === "en" ? "en" : "es");
}
