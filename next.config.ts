import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output:"export",
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      }
    }
    return config;
  },
  images: {
    domains: ["cdn.discordapp.com",'prod-files-secure.s3.us-west-2.amazonaws.com'],
    unoptimized: true,
  },
  reactStrictMode: true,
  basePath: "/horizon-atlas", 
  assetPrefix: "/horizon-atlas/",
};

export default nextConfig;
