/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow API routes and Route Handlers by disabling static export
  // output: "export",
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { unoptimized: true },
  // Exclude docs folder from Next.js compilation
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  experimental: {
    externalDir: true,
  },
  // Ensure correct workspace root selection when multiple lockfiles exist
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
