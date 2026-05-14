import { ImageResponse } from "next/og";
import { getRelease } from "@/lib/releases";

export const alt = "PHŌNÉ Records — Release";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = { lang: string; slug: string };

// Load a subset of Fraunces (only the glyphs needed for this image) from
// Google Fonts at OG-generation time. Keeps the rendered text in the same
// typographic family as the site.
async function loadFraunces(text: string): Promise<ArrayBuffer | null> {
  const url = `https://fonts.googleapis.com/css2?family=Fraunces:wght@500&text=${encodeURIComponent(text)}`;
  const css = await fetch(url, {
    headers: {
      // Google Fonts only returns TTF urls when the UA looks like a system that
      // can't parse woff2. Otherwise it serves woff2 which next/og can't use.
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36",
    },
    cache: "force-cache",
  }).then((r) => r.text());
  const match = css.match(/src:\s*url\((.+?)\)\s*format\('(?:truetype|opentype)'\)/);
  if (!match) return null;
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

export default async function OG({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const release = getRelease(slug);

  const title = release?.title ?? "PHŌNÉ Records";
  const artist = release?.artistName ?? "";
  const label = release?.label ?? "";
  const year = release?.year ? String(release.year) : "";
  const cover = release?.cover;

  // Glyph subsetting: gather every character that will be rendered so Google
  // Fonts can return a slim TTF.
  const renderedText = `${title}${artist}${label}${year} ·`;
  const fraunces = await loadFraunces(renderedText).catch(() => null);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          color: "#ffffff",
          fontFamily: "Fraunces, Georgia, 'Times New Roman', serif",
          position: "relative",
        }}
      >
        {/* Cover panel */}
        <div
          style={{
            width: 630,
            height: 630,
            display: "flex",
            background: "#111",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt=""
              width={630}
              height={630}
              style={{ objectFit: "cover", width: 630, height: 630 }}
            />
          ) : (
            <div
              style={{
                fontSize: 160,
                letterSpacing: 28,
                fontWeight: 600,
                opacity: 0.4,
                display: "flex",
              }}
            >
              PHŌNÉ
            </div>
          )}
        </div>

        {/* Text panel */}
        <div
          style={{
            flex: 1,
            padding: "70px 60px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 18,
                letterSpacing: 8,
                textTransform: "uppercase",
                opacity: 0.55,
                fontFamily: "monospace",
                marginBottom: 28,
                display: "flex",
              }}
            >
              {year && <span>{year}</span>}
              {year && label && <span style={{ margin: "0 12px" }}>·</span>}
              {label && <span>{label}</span>}
            </div>
            <div
              style={{
                fontSize: 72,
                lineHeight: 1.02,
                fontWeight: 500,
                letterSpacing: -2,
                marginBottom: 28,
                display: "flex",
              }}
            >
              {title}
            </div>
            {artist && (
              <div
                style={{
                  fontSize: 30,
                  opacity: 0.75,
                  display: "flex",
                }}
              >
                {artist}
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: 16,
              opacity: 0.4,
              letterSpacing: 4,
              fontFamily: "monospace",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            PHŌNÉ Records
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fraunces
        ? [{ name: "Fraunces", data: fraunces, style: "normal", weight: 500 }]
        : [],
    },
  );
}
