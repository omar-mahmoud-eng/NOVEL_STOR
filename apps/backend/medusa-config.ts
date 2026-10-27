import { defineConfig, loadEnv } from "@medusajs/framework/utils"
import { randomBytes } from "node:crypto"
import {databaseDriverOptions} from "./src/utils/database-options"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

function secret(name: string): string {
  const value = process.env[name]
  if (process.env.NODE_ENV === "production" && (!value || value.length < 32 || /supersecret|change.me|c2VjdXJlX2/i.test(value))) {
    throw new Error(`${name} must be a unique secret of at least 32 characters`)
  }
  return value || randomBytes(32).toString("hex")
}

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required")
if (!process.env.REDIS_URL) throw new Error("REDIS_URL is required")

// Native Medusa sessions require Secure cookies in production. The local
// production build is intentionally served on loopback HTTP during testing.
// Keep Secure enabled for every deployment other than an explicit loopback URL.
const publicUrl = process.env.MEDUSA_ADMIN_PUBLIC_URL || process.env.NEXT_PUBLIC_BASE_URL
let loopbackHttp = false
try { const url = new URL(publicUrl || "https://production.invalid"); loopbackHttp = url.protocol === "http:" && ["localhost","127.0.0.1","[::1]"].includes(url.hostname) } catch {}

export default defineConfig({
  projectConfig: {
    cookieOptions: { secure: !loopbackHttp, sameSite: "lax", httpOnly: true },
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions:databaseDriverOptions(process.env.DATABASE_URL,process.env.DATABASE_SSL),
    redisUrl: process.env.REDIS_URL,
    databaseLogging: process.env.NODE_ENV === "development",
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000,http://127.0.0.1:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000,http://127.0.0.1:9000,http://localhost:5173",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,http://localhost:9000,http://localhost:5173",
      jwtSecret: secret("JWT_SECRET"),
      cookieSecret: secret("COOKIE_SECRET"),
    },
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_ADMIN_BACKEND_URL || "",
    path: "/app",
    // Dashboard and first-party admin plugins must share one query context.
    // Workspace dependencies can otherwise resolve separate TanStack copies.
    vite: (config) => ({
      resolve: {
        // Medusa merges this override into its base configuration. Returning
        // the whole base would register Vite's plugins a second time.
        dedupe: [...new Set([...(config.resolve?.dedupe || []), "@tanstack/react-query", "@tanstack/query-core"])],
      },
    }),
  },
  modules: [
    ...(process.env.STRIPE_API_KEY && process.env.STRIPE_WEBHOOK_SECRET ? [{
      resolve: "@medusajs/medusa/payment",
      options: { providers: [{ resolve: "@medusajs/medusa/payment-stripe", id: "stripe", options: {
        apiKey: process.env.STRIPE_API_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      } }] },
    }] : []),
    {
      resolve: "@medusajs/medusa/locking",
      options: { providers: [{ resolve: "@medusajs/medusa/locking-redis", id: "locking-redis", is_default: true, options: { redisUrl: process.env.REDIS_URL } }] },
    },
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
      },
    },
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
      },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
        },
      },
    },
    {
      resolve: "./src/modules/fulfillment-tracker",
    },
    {
      resolve: "./src/modules/story",
    },
    {
      resolve: "./src/modules/subscription",
    },
  ],
})
