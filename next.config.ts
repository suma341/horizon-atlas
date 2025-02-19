import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output:"export",
  images: {
    domains: ["cdn.discordapp.com",'prod-files-secure.s3.us-west-2.amazonaws.com'],
    unoptimized: true,
  },
  reactStrictMode: true,
  basePath: "/horizon-atlas", // GitHub Pages 用の Base Path（リポジトリ名にする）
  assetPrefix: "/horizon-atlas/",
};

export default nextConfig;
