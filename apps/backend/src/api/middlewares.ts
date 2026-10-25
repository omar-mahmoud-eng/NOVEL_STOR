import { defineMiddlewares } from "@medusajs/medusa"
import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework/http"
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
    setInterval(() => this.cleanup(), 300000)
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

/**
 * Production Security Headers Middleware
 * Protects against Clickjacking, MIME-sniffing, XSS, and Cross-Site leaks.
 */
export const securityHeadersMiddleware = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  res.setHeader("X-DNS-Prefetch-Control", "off")
  res.setHeader("X-Frame-Options", "DENY")
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("X-XSS-Protection", "0")
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self)")
  
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    )
  }

  // Cross-Origin Resource Policy
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin")

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
  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "127.0.0.1"
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
  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "127.0.0.1"
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
          errors: error.errors.map((err) => ({
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
    {
      matcher: "/store/*",
      middlewares: [securityHeadersMiddleware],
    },
    {
      matcher: "/admin/*",
      middlewares: [securityHeadersMiddleware],
    },
    {
      matcher: "/auth/*",
      middlewares: [authRateLimitMiddleware],
    },
    {
      matcher: "/store/carts/*/complete",
      middlewares: [checkoutRateLimitMiddleware],
    },
  ],
})
