import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.discordapp.com",'prod-files-secure.s3.us-west-2.amazonaws.com'],
  },
  reactStrictMode: true,
};

export default nextConfig;
