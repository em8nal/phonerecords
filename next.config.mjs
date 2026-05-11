/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "f4.bcbits.com",
        pathname: "/img/**",
      },
    ],
  },
}

export default nextConfig
