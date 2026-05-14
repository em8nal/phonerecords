import { ImageResponse } from "next/og";
import { getRelease } from "@/lib/releases";

export const alt = "PHŌNÉ Records — Release";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = { lang: string; slug: string };

export default async function OG({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const release = getRelease(slug);

  const title = release?.title ?? "PHŌNÉ Records";
  const artist = release?.artistName ?? "";
  const label = release?.label ?? "";
  const year = release?.year ? String(release.year) : "";
  const cover = release?.cover;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          color: "#ffffff",
          fontFamily: "Georgia, 'Times New Roman', serif",
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
                fontSize: 64,
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: -1,
                marginBottom: 28,
                display: "flex",
              }}
            >
              {title}
            </div>
            {artist && (
              <div
                style={{
                  fontSize: 28,
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
    size,
  );
}
