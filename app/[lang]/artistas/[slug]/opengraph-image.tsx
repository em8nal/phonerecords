import { ImageResponse } from "next/og";
import { getArtist } from "@/lib/artists";

export const alt = "PHŌNÉ Records artist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const artist = getArtist(slug);

  if (!artist) {
    return new ImageResponse(
      <div style={{ background: "#0a0a0a", color: "#fff", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>
        PHŌNÉ Records
      </div>,
      size
    );
  }

  const isEs = lang === "es";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#ffffff",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "80px",
        }}
      >
        {/* Top — eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: 8,
            opacity: 0.6,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <span>PHŌNÉ Records</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{isEs ? "Roster" : "Roster"}</span>
        </div>

        {/* Center — artist name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              fontSize: artist.name.length > 18 ? 96 : 132,
              lineHeight: 1.0,
              letterSpacing: -2,
              fontWeight: 400,
              fontStyle: "italic",
              display: "flex",
            }}
          >
            {artist.name}
          </div>
          <div
            style={{
              fontSize: 28,
              opacity: 0.65,
              letterSpacing: 4,
              fontFamily: "monospace",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {artist.genres.join(" · ")}
          </div>
        </div>

        {/* Bottom — origin */}
        <div
          style={{
            fontSize: 22,
            opacity: 0.5,
            letterSpacing: 3,
            fontFamily: "monospace",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span>{artist.origin}</span>
          <span>phonerecords.cl/{lang}/artistas/{slug}</span>
        </div>
      </div>
    ),
    size
  );
}
