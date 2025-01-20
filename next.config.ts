import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [], // Leave this empty for no specific domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow images from all HTTPS domains
      },
      {
        protocol: 'http',
        hostname: '**', // Allow images from all HTTP domains (optional, less secure)
      },
    ],
    unoptimized: true, // Disables image optimization to allow images from all sources
  },
};

export default nextConfig;
