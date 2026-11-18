import type { NextConfig } from "next";

const apiUrl = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
const mediaHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_MEDIA_URL ?? apiUrl);
  } catch {
    return new URL("http://localhost:8000");
  }
})();

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  cacheLife: {
    // Public CMS content: refreshed in the background every 5 minutes and
    // instantly on demand when Laravel calls POST /api/revalidate.
    content: { stale: 300, revalidate: 300, expire: 86_400 },
  },
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 430, 640, 768, 1024, 1280, 1440, 1920],
    remotePatterns: [
      {
        protocol: mediaHost.protocol.replace(":", "") as "http" | "https",
        hostname: mediaHost.hostname,
        port: mediaHost.port,
        pathname: "/storage/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/:all*(woff2|svg|png|jpg|webp|avif|glb)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
