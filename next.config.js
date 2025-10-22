/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { unoptimized: true },
  // Exclude docs folder from Next.js compilation
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
