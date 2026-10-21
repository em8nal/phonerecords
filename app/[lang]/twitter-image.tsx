import { renderHomeOg } from "@/lib/og/home-image";

// Same card as ./opengraph-image so twitter:image matches og:image per locale.
export const alt = "PHŌNÉ Records — Sello cultural independiente · Santiago de Chile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}

export default async function TwitterImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return renderHomeOg(lang === "en" ? "en" : "es");
}
