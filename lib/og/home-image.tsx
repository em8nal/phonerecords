import { ImageResponse } from "next/og";

export const HOME_OG_SIZE = { width: 1200, height: 630 } as const;

export type HomeOgLang = "es" | "en";

/** Alt text of the site-wide OG/Twitter card, per locale. */
export const HOME_OG_ALT: Record<HomeOgLang, string> = {
  es: "PHŌNÉ Records — Sello cultural independiente · Santiago de Chile",
  en: "PHŌNÉ Records — Independent cultural label · Santiago de Chile",
};

/** Id used by generateImageMetadata in app/[lang]/{opengraph,twitter}-image.tsx. */
export const HOME_OG_ID = "home";

/** Image metadata (locale-specific alt) for generateImageMetadata. */
export function homeOgImageMetadata(lang: string) {
  const l: HomeOgLang = lang === "en" ? "en" : "es";
  return [
    {
      id: HOME_OG_ID,
      alt: HOME_OG_ALT[l],
      size: HOME_OG_SIZE,
      contentType: "image/png",
    },
  ];
}

const FOOTER: Record<HomeOgLang | "both", string> = {
  es: "Sello cultural independiente",
  en: "Independent cultural label",
  both: "Independent cultural label · Sello cultural independiente",
};

/**
 * Shared 1200x630 card for the site-wide Open Graph / Twitter image.
 * `lang` picks the footer line; without it the footer is bilingual (used by
 * the unprefixed root route, which serves pages outside /[lang]).
 */
export function renderHomeOg(lang?: HomeOgLang) {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 220,
            letterSpacing: 36,
            fontWeight: 600,
            display: "flex",
          }}
        >
          PHŌNÉ
        </div>
        <div
          style={{
            fontSize: 30,
            opacity: 0.55,
            letterSpacing: 12,
            marginTop: 24,
            textTransform: "uppercase",
          }}
        >
          Records · Santiago de Chile
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            fontSize: 18,
            opacity: 0.4,
            letterSpacing: 4,
            fontFamily: "monospace",
          }}
        >
          {FOOTER[lang ?? "both"]}
        </div>
      </div>
    ),
    HOME_OG_SIZE
  );
}
