import { defineConfig, loadEnv } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    databaseLogging: process.env.NODE_ENV === "development",
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000,http://127.0.0.1:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000,http://127.0.0.1:9000,http://localhost:5173",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,http://localhost:9000,http://localhost:5173",
      jwtSecret: process.env.JWT_SECRET || "supersecret-jwt-key-minimum-32-chars-long",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret-cookie-key-minimum-32-chars-long",
    },
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
    path: "/app",
  },
  modules: [
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
          url: process.env.REDIS_URL || "redis://localhost:6379",
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
