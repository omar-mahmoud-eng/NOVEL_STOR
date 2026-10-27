import { defineMiddlewares } from "@medusajs/medusa"
import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework/http"
import { authenticate } from "@medusajs/framework/http"
import { z, ZodError } from "zod"

/**
 * In-memory sliding window rate limiter
 * Tracks request timestamps per client IP.
 */
class SlidingWindowRateLimiter {
  private hits: Map<string, number[]> = new Map()
  private readonly windowMs: number
  private readonly maxHits: number

  constructor(windowMs = 60000, maxHits = 30) {
    this.windowMs = windowMs
    this.maxHits = maxHits

    // Periodic cleanup of stale IP records every 5 minutes
    setInterval(() => this.cleanup(), 300000).unref()
  }

  public check(ip: string): { allowed: boolean; remaining: number; retryAfterSec: number } {
    const now = Date.now()
    const windowStart = now - this.windowMs

    let timestamps = this.hits.get(ip) || []
    timestamps = timestamps.filter((t) => t > windowStart)

    if (timestamps.length >= this.maxHits) {
      const oldestInWindow = timestamps[0]
      const retryAfterSec = Math.ceil((oldestInWindow + this.windowMs - now) / 1000)
      return { allowed: false, remaining: 0, retryAfterSec: Math.max(1, retryAfterSec) }
    }

    timestamps.push(now)
    this.hits.set(ip, timestamps)
    return {
      allowed: true,
      remaining: this.maxHits - timestamps.length,
      retryAfterSec: 0,
    }
  }

  private cleanup(): void {
    const now = Date.now()
    const windowStart = now - this.windowMs
    for (const [ip, timestamps] of this.hits.entries()) {
      const active = timestamps.filter((t) => t > windowStart)
      if (active.length === 0) {
        this.hits.delete(ip)
      } else {
        this.hits.set(ip, active)
      }
    }
  }
}

const authRateLimiter = new SlidingWindowRateLimiter(60000, 15) // 15 req/min for auth
const checkoutRateLimiter = new SlidingWindowRateLimiter(60000, 20) // 20 req/min for checkout
const storeGeneralRateLimiter = new SlidingWindowRateLimiter(60000, 150) // 150 req/min for public store API to prevent DoS
// Reading links are prefetched by the storefront and offline downloads can
// fetch several chapters at once. Keep their read-only allowance separate
// from checkout, account, library-license and other store operations.
const readingContentRateLimiter = new SlidingWindowRateLimiter(60000, 600)

/**
 * Production Security Headers Middleware
 * Protects against Clickjacking, MIME-sniffing, XSS, and Cross-Site leaks.
 */
export const securityHeadersMiddleware = (
  _req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  if (process.env.TRUST_GATEWAY_HEADERS === "true") _req.app.set("trust proxy", 1)
  res.setHeader("X-DNS-Prefetch-Control", "off")
  res.setHeader("X-Frame-Options", "DENY")
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("X-XSS-Protection", "0")
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self)")
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin")
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin")

  next()
}

/**
 * Rate Limiting Middleware for Authentication Routes
 */
export const authRateLimitMiddleware = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  const clientIp = req.ip || req.socket?.remoteAddress || "unknown"
  const result = authRateLimiter.check(clientIp)

  res.setHeader("X-RateLimit-Limit", "15")
  res.setHeader("X-RateLimit-Remaining", result.remaining.toString())

  if (!result.allowed) {
    res.setHeader("Retry-After", result.retryAfterSec.toString())
    return res.status(429).json({
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many authentication attempts. Please try again later.",
      retry_after_seconds: result.retryAfterSec,
    })
  }

  next()
}

/**
 * Rate Limiting Middleware for Checkout Operations
 */
export const checkoutRateLimitMiddleware = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  const clientIp = req.ip || req.socket?.remoteAddress || "unknown"
  const result = checkoutRateLimiter.check(clientIp)

  res.setHeader("X-RateLimit-Limit", "20")
  res.setHeader("X-RateLimit-Remaining", result.remaining.toString())

  if (!result.allowed) {
    res.setHeader("Retry-After", result.retryAfterSec.toString())
    return res.status(429).json({
      code: "CHECKOUT_RATE_LIMIT_EXCEEDED",
      message: "Too many checkout transactions requested. Please wait before retrying.",
      retry_after_seconds: result.retryAfterSec,
    })
  }

  next()
}

/**
 * Rate Limiting Middleware for General Store API
 */
export const storeGeneralRateLimitMiddleware = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  const clientIp = req.ip || req.socket?.remoteAddress || "unknown"
  const readingRequest=req.method==="GET"&&/^\/store\/reading-stories(?:\/[^/?]+)?\/?$/.test(req.originalUrl.split("?")[0])
  const result = (readingRequest?readingContentRateLimiter:storeGeneralRateLimiter).check(clientIp)

  res.setHeader("X-RateLimit-Limit", readingRequest?"600":"150")
  res.setHeader("X-RateLimit-Remaining", result.remaining.toString())

  if (!result.allowed) {
    res.setHeader("Retry-After", result.retryAfterSec.toString())
    return res.status(429).json({
      code: "STORE_RATE_LIMIT_EXCEEDED",
      message: "Too many store requests from this IP. Please slow down.",
      retry_after_seconds: result.retryAfterSec,
    })
  }

  next()
}

/**
 * Generic Zod Schema Validation Middleware Generator
 */
export function validateRequestBody(schema: z.ZodSchema) {
  return (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          code: "INVALID_REQUEST_BODY",
          message: "Request validation failed against strict schema constraints",
          errors: error.issues.map((err) => ({
            field: err.path.join("."),
            issue: err.message,
          })),
        })
      }
      return res.status(500).json({
        code: "VALIDATION_INTERNAL_ERROR",
        message: "An unexpected error occurred during request payload validation",
      })
    }
  }
}

export default defineMiddlewares({
  routes: [
    {matcher:"/store/support*",middlewares:[authenticate("customer",["session","bearer"])]},
    {matcher:"/admin/story-media/upload",bodyParser:false,middlewares:[securityHeadersMiddleware]},
    {matcher:"/admin/reading-stories*",bodyParser:{sizeLimit:"3mb"},middlewares:[securityHeadersMiddleware]},
    {
      matcher: /^\/store\/library\/?$/,
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
    {
      matcher: "/store/library/stream/*",
      middlewares: [authenticate("customer", ["session", "bearer"], { allowUnauthenticated: true })],
    },
    {
      matcher: "/store/loyalty/*",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
    {
      matcher: "/store/tracking/*",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
    {
      matcher: "/storefront/webhooks/payment",
      bodyParser: { preserveRawBody: true, sizeLimit: "256kb" },
      middlewares: [securityHeadersMiddleware],
    },
    {
      matcher: "/store/*",
      middlewares: [securityHeadersMiddleware, storeGeneralRateLimitMiddleware],
    },
    {
      matcher: "/admin/*",
      middlewares: [securityHeadersMiddleware],
    },
    {
      matcher: "/auth/*",
      middlewares: [securityHeadersMiddleware, authRateLimitMiddleware],
    },
    {
      matcher: "/store/carts/*/complete",
      middlewares: [checkoutRateLimitMiddleware],
    },
  ],
})
