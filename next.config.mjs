/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Vercel image proxy serves WebP/AVIF on supported browsers and falls back
    // to the original format. Bandcamp/Apple/Discogs/elasticstage URLs are
    // whitelisted below and pass through unchanged at the source — only the
    // delivery is reformatted.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "f4.bcbits.com",
        pathname: "/img/**",
      },
      {
        protocol: "https",
        hostname: "i.discogs.com",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
      {
        protocol: "https",
        hostname: "is1-ssl.mzstatic.com",
      },
      {
        protocol: "https",
        hostname: "is2-ssl.mzstatic.com",
      },
      {
        protocol: "https",
        hostname: "is3-ssl.mzstatic.com",
      },
      {
        protocol: "https",
        hostname: "is4-ssl.mzstatic.com",
      },
      {
        protocol: "https",
        hostname: "is5-ssl.mzstatic.com",
      },
      {
        protocol: "https",
        hostname: "es-ew1-prod-assets.s3.eu-west-1.amazonaws.com",
      },
    ],
  },
}

export default nextConfig
