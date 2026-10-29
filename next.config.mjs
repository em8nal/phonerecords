/** @type {import('next').NextConfig} */
const nextConfig = {
  // A4 (17d/17i): bots que reciben la metadata bloqueante en <head>. Reemplaza la lista por defecto de
  // Next 16.4.2, así que empieza con la copia literal de next/dist/shared/lib/router/utils/html-bots.js
  // y suma los buscadores y crawlers de IA. Al subir Next, comparar el prefijo (test:seo lo vigila).
  htmlLimitedBots: /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|GPTBot|OAI-SearchBot|ChatGPT-User|PerplexityBot|Perplexity-User|ClaudeBot|Claude-SearchBot|Claude-User|CCBot/i,
  async redirects() {
    return [
      // Andrés Abrigo salió del roster (21-10-2026): sus URLs van al roster y al press kit.
      { source: "/:lang(es|en)/artistas/andres-abrigo", destination: "/:lang#roster", permanent: true },
      { source: "/press/:lang(es|en)/andres-abrigo", destination: "/:lang/press-kit", permanent: true },
      // Lote 4 (carril Q): su PDF viejo daba 404; va al press kit del sello.
      { source: "/press-kits/andres-abrigo-:lang(es|en).pdf", destination: "/press-kits/press-kit-:lang.pdf", permanent: true },
      // A9: Claudio Solís, retirado del roster; GA4 aún registra visitas a sus URLs.
      { source: "/:lang(es|en)/artistas/claudio-solis", destination: "/:lang#roster", permanent: true },
      { source: "/press/:lang(es|en)/claudio-solis", destination: "/:lang/press-kit", permanent: true },
      // 17a (24-10-2026): la ficha de Klaus B pasa a /artistas/klaus-b, en un solo salto desde cada
      // URL vieja: ficha, subrutas (la imagen OG que guardaron las redes), ruta sin idioma (los
      // redirects corren antes que proxy.ts), press kit web y PDF. Alias de ?artist= en
      // lib/artist-slugs.ts; `pnpm test:releases` exige estas 5 formas por cada slug viejo.
      { source: "/:lang(es|en)/artistas/klaus-brantmayer", destination: "/:lang/artistas/klaus-b", permanent: true },
      { source: "/:lang(es|en)/artistas/klaus-brantmayer/:path+", destination: "/:lang/artistas/klaus-b/:path+", permanent: true },
      { source: "/artistas/klaus-brantmayer", destination: "/es/artistas/klaus-b", permanent: true },
      { source: "/press/:lang(es|en)/klaus-brantmayer", destination: "/press/:lang/klaus-b", permanent: true },
      { source: "/press-kits/klaus-brantmayer-:lang(es|en).pdf", destination: "/press-kits/klaus-b-:lang.pdf", permanent: true },
    ];
  },
  // The release OG banner reads cover files from public/releases at request
  // time (fs), so make sure they are traced into that function's bundle.
  outputFileTracingIncludes: {
    "/[lang]/releases/[slug]/opengraph-image": ["./public/releases/*.jpg"],
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
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
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
