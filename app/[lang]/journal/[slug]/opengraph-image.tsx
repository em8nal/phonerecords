import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { JOURNAL_FORMAT_LABEL, formatPublishDate, getPublishedPiece } from "@/lib/journal";
import { SITE, toLang } from "@/lib/schema";

// Tarjeta para redes de una pieza del journal: el mismo patrón que la de lanzamiento
// (app/[lang]/releases/[slug]/opengraph-image.tsx): portada recortada a 630×630 a la izquierda,
// texto a la derecha y JPEG re-codificado con sharp (PNG si sharp falla).
export const alt = "PHŌNÉ Records — Journal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";
// Sin revalidate, la imagen de una pieza futura quedaría congelada como tarjeta genérica hasta el
// siguiente deploy. Con 300 s sigue a la página (misma guarda getPublishedPiece).
export const revalidate = 300;

type Params = { lang: string; slug: string };

// Subconjunto de Fraunces (solo los glifos de la tarjeta) desde Google Fonts, como en la de lanzamiento.
async function loadFraunces(text: string): Promise<ArrayBuffer | null> {
  const url = `https://fonts.googleapis.com/css2?family=Fraunces:wght@500&text=${encodeURIComponent(text)}`;
  const css = await fetch(url, {
    headers: {
      // Google Fonts solo da URLs TTF a un UA que no entiende woff2 (next/og no lee woff2).
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36",
    },
    cache: "force-cache",
  }).then((r) => r.text());
  const match = css.match(/src:\s*url\((.+?)\)\s*format\('(?:truetype|opentype)'\)/);
  if (!match) return null;
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

const IMAGE_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

// next/og solo descarga URLs absolutas: la portada local (/journal/<slug>/…) va como data URI.
//   1. se lee de public/ (el integrador suma "./public/journal/**/*" a outputFileTracingIncludes);
//   2. si falla, se descarga de SITE (dominio público; VERCEL_URL puede estar protegido);
//   3. si también falla, undefined y la tarjeta muestra el isotipo de texto en vez de un 500.
async function resolveCover(cover: string | undefined): Promise<string | undefined> {
  if (!cover || !cover.startsWith("/")) return cover;

  const publicDir = path.join(process.cwd(), "public");
  const filePath = path.join(publicDir, cover);
  const mime = IMAGE_MIME[path.extname(cover).toLowerCase()];

  if (mime && filePath.startsWith(publicDir + path.sep)) {
    try {
      const data = await readFile(filePath);
      return `data:${mime};base64,${data.toString("base64")}`;
    } catch {
      // sigue con la descarga
    }
  }

  try {
    const res = await fetch(new URL(cover, SITE), { signal: AbortSignal.timeout(3000) });
    const type = res.headers.get("content-type")?.split(";")[0].trim() ?? "";
    if (!res.ok || !type.startsWith("image/")) return undefined;
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return undefined;
  }
}

export default async function OG({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  const l = toLang(lang);
  // Desconocida o futura: tarjeta genérica, sin título ni portada (no adelanta la pieza).
  const piece = getPublishedPiece(slug);

  const title = piece?.title[l] ?? "";
  const kicker = piece ? `${JOURNAL_FORMAT_LABEL[piece.format]} · ${formatPublishDate(piece, l)}` : "Journal";
  const footer = "PHŌNÉ Records · Journal";
  const cover = await resolveCover(piece?.cover.src);
  const titleSize = [...title].length > 40 ? 48 : 60;

  const fraunces = await loadFraunces(`${title}${kicker}${footer}PHŌNÉ ·`).catch(() => null);

  const card = (
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
      {/* Portada */}
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
          <img src={cover} alt="" width={630} height={630} style={{ objectFit: "cover", width: 630, height: 630 }} />
        ) : (
          <div style={{ fontSize: 160, letterSpacing: 28, fontWeight: 600, opacity: 0.4, display: "flex" }}>PHŌNÉ</div>
        )}
      </div>

      {/* Texto */}
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
              letterSpacing: 6,
              textTransform: "uppercase",
              opacity: 0.55,
              fontFamily: "monospace",
              marginBottom: 28,
              display: "flex",
            }}
          >
            {kicker}
          </div>
          {title && (
            <div
              style={{
                fontSize: titleSize,
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: -1.5,
                display: "flex",
              }}
            >
              {title}
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
          {footer}
        </div>
      </div>
    </div>
  );
  const fonts = fraunces ? [{ name: "Fraunces", data: fraunces, style: "normal" as const, weight: 500 as const }] : [];

  const png = Buffer.from(await new ImageResponse(card, { ...size, fonts }).arrayBuffer());
  // Mismo cache-control que ImageResponse en next 16.4.2 (server/og/image-response.js).
  const headers = (type: string) => ({
    "content-type": type,
    "cache-control":
      process.env.NODE_ENV === "development" ? "no-cache, no-store" : "public, max-age=0, must-revalidate",
  });
  try {
    // Import literal: Turbopack lo traza (sharp está en serverExternalPackages por defecto).
    const { default: sharp } = await import("sharp");
    const jpg = await sharp(png).jpeg({ quality: 85, chromaSubsampling: "4:4:4" }).toBuffer();
    return new Response(new Uint8Array(jpg), { headers: headers("image/jpeg") });
  } catch {
    // Nunca un 500 por el codificador: sin sharp, el PNG (más pesado).
    return new Response(new Uint8Array(png), { headers: headers("image/png") });
  }
}
