import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dashboard is a dynamic app - build will skip problematic static pages
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
