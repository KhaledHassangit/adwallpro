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
};

export default nextConfig;