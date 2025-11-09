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
  experimental: {
    optimizeCss: true,
    serverActions: true,
    serverComponentsExternalPackages: [],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, module: false };
    return config;
  },
};

export default nextConfig;