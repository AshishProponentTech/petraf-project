/** @type {import('next').NextConfig} */

// Detect environment
const isProd = process.env.NODE_ENV === "production";

/**
 * Next.js Configuration
 * ---------------------
 * - Disables strict ESLint blocking during builds
 * - Prevents image optimization issues for static exports
 * - Handles asset prefixing for GitHub Pages / production
 * - Adds an API proxy (only in development) to bypass CORS
 */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true,
  },

  // ✅ Ensure static assets load correctly in production
  assetPrefix: isProd ? "/petraf-project/" : "",

  // ✅ API proxy configuration (development only)
  async rewrites() {
    if (!isProd) {
      return [
        {
          source: "/api/:path*",
          destination: "https://thctil8puin2q-api.prod1a.defang.dev/api/:path*",
        },
      ];
    }
    // No rewrites in production (calls real API directly)
    return [];
  },
};

module.exports = nextConfig;
