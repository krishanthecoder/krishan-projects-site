import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets phones on the same Wi‑Fi load JS/HMR from `npm run dev` via your LAN IP.
  allowedDevOrigins: ["192.168.86.232"],
  experimental: {
    optimizePackageImports: ["sanity", "@sanity/ui", "@sanity/icons", "lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
