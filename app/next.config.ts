import type { NextConfig } from "next";
import { config } from "process";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler:{
    styledComponents: true,
  },
};

export default nextConfig;
