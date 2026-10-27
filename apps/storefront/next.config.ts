import type { NextConfig } from "next"

const configuredMedia = (process.env.NEXT_PUBLIC_MEDIA_ORIGINS || "http://localhost:9005").split(",").map((value) => {
  const origin = new URL(value.trim())
  if (!["http:", "https:"].includes(origin.protocol)) throw new Error("Invalid media origin")
  return origin
})
const mediaOrigins = configuredMedia.map(origin=>origin.origin).join(" ")

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      ...configuredMedia.map(origin=>({protocol:origin.protocol.slice(0,-1) as "http"|"https",hostname:origin.hostname,port:origin.port,pathname:"/**"})),
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/uploads/**",
      },
      {protocol:"http",hostname:"localhost",port:"9000",pathname:"/static/**"},
      {protocol:"http",hostname:"127.0.0.1",port:"9000",pathname:"/static/**"},
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "off",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "0",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              `img-src 'self' data: blob: https://images.unsplash.com https://lh3.googleusercontent.com https://*.googleusercontent.com https://*.digitaloceanspaces.com https://*.amazonaws.com http://localhost:9000 http://127.0.0.1:9000 ${mediaOrigins}`,
              "font-src 'self' data: https://fonts.gstatic.com",
              `connect-src 'self' ${mediaOrigins}${process.env.NODE_ENV === "development" ? " ws://localhost:3000 ws://127.0.0.1:3000" : ""}`,
              `media-src 'self' blob: data: https://www.soundhelix.com https://*.digitaloceanspaces.com https://*.amazonaws.com ${mediaOrigins}`,
              "frame-ancestors 'none'",
              "form-action 'self'",
              "base-uri 'self'",
              "object-src 'none'",
            ].join("; "),
          },
        ],
      },
    ]
  },
}

export default nextConfig
