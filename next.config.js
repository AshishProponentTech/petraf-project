/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  assetPrefix: isProd ? "/petraf-project/" : "", // ✅ assets load correctly in prod
};

module.exports = nextConfig;
