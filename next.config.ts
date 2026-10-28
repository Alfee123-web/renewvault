import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase Server Actions body size limit to 10MB to support receipt image uploads
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;