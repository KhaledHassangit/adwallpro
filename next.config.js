/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "72.60.178.180",
        pathname: "/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  // Add these critical settings for Netlify deployment
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  // Disable static generation for problematic routes
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;