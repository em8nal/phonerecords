import { renderHomeOg, homeOgImageMetadata } from "@/lib/og/home-image";

// `alt` depends on the locale, so it can't be a static export. Next then serves
// the image at /<lang>/opengraph-image/<id>; proxy.ts rewrites the plain
// /<lang>/opengraph-image URL to it (referenced from the layout and the home page).
// Only /es and /en reach this route: proxy.ts redirects other first segments.
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return homeOgImageMetadata(lang);
}

export default async function OG({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return renderHomeOg(lang === "en" ? "en" : "es");
}
