import type { NextConfig } from "next";
// v2.1.1 - Triggering fresh production deployment
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
  },
  fallbacks: {
    document: "/~offline",
  }
});

const nextConfig: NextConfig = {
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withPWA(nextConfig);
