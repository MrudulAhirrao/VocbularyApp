import type { NextConfig } from "next";
import { config } from "process";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  compiler:{
    styledComponents: true,
  },
};

export default nextConfig;
