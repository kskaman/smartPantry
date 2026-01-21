import type { NextConfig } from "next";
import withPWA from "next-pwa";

const pwaConfig = withPWA({
  dest: "public", // Destination folder for the service worker and manifest
  register: true, // Auto-register the service worker
  skipWaiting: true, // Activate the new service worker as soon as it's finished installing
});

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {}, // Empty turbopack config to allow webpack-based PWA plugin
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.themealdb.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default pwaConfig(nextConfig);
