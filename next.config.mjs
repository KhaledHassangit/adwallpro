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
    // The 'domains' property is deprecated in favor of 'remotePatterns'
    // You can remove it if you only use remotePatterns.
    domains: ["localhost"], // Kept localhost, removed the old one
    remotePatterns: [
      // This pattern allows images from your NEW local backend
      {
        protocol: "http",
        hostname: "72.60.178.180", // Your new backend's IP
        port: "8000",
        pathname: "/**", // Allows any path for images
      },
      // You can keep the old one if you still need to load images from there
      {
        protocol: "https",
        hostname: "adwallpro.com",
        pathname: "/brands/**",
      },
    ],
  },
};

export default nextConfig;