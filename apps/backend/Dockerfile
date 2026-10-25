# ==============================================================================
# MULTI-STAGE DOCKERFILE FOR MEDUSA V2 BACKEND & ADMIN DASHBOARD
# Designed for Zero-Vulnerability, Least Privilege (Non-Root), and Small Attack Surface
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Base Environment
# ------------------------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++ curl
ENV NODE_ENV=production

# ------------------------------------------------------------------------------
# Stage 2: Dependencies Installation
# ------------------------------------------------------------------------------
FROM base AS dependencies
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --include=dev

# ------------------------------------------------------------------------------
# Stage 3: Builder
# ------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 4: Production Runner (Least Privilege)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9000

# Install runtime utilities required for health checks
RUN apk add --no-cache curl wget

# Create non-root group and user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S medusajs -u 1001 -G nodejs

# Create uploads directory and assign ownership
RUN mkdir -p /app/uploads && chown -R medusajs:nodejs /app

# Copy production artifacts and dependencies
COPY --from=dependencies --chown=medusajs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=medusajs:nodejs /app/.medusa ./.medusa
COPY --from=builder --chown=medusajs:nodejs /app/medusa-config.ts ./medusa-config.ts
COPY --from=builder --chown=medusajs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER medusajs

EXPOSE 9000

HEALTHCHECK --interval=20s --timeout=10s --retries=3 --start-period=30s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:9000/health || exit 1

CMD ["npm", "run", "start"]
