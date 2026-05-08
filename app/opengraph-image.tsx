import { ImageResponse } from "next/og";

export const alt = "PHŌNÉ Records — Sello cultural independiente · Santiago de Chile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
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
          Independent cultural label · Sello cultural independiente
        </div>
      </div>
    ),
    size
  );
}
