import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ant Design ikonlarını sadece kullanılanlarla paketler
  experimental: {
    optimizePackageImports: ["antd", "@ant-design/icons"],
  },
  async headers() {
    return [
      {
        // Service worker her zaman güncel çekilsin
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
