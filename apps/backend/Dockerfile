FROM node:22-alpine AS dependencies
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/storefront/package.json apps/storefront/package.json
COPY packages/schemas/package.json packages/schemas/package.json
RUN npm ci --include=dev

FROM dependencies AS builder
COPY apps/backend apps/backend
COPY packages/schemas packages/schemas
# Build does not contact these services; runtime values come from Compose.
ENV NODE_ENV=production DATABASE_URL=postgres://build:build@localhost/build REDIS_URL=redis://localhost:6379 JWT_SECRET=build-only-not-a-runtime-secret-000000000000000000 COOKIE_SECRET=build-only-not-a-runtime-cookie-000000000000000000 MEDUSA_DISABLE_TELEMETRY=1
RUN npm run build --workspace=@enterprise/schemas && npm run build --workspace=@enterprise/backend

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=9000
RUN apk add --no-cache libc6-compat curl && addgroup -g 1001 -S app && adduser -u 1001 -S app -G app
COPY --from=dependencies --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/packages/schemas ./packages/schemas
COPY --from=builder --chown=app:app /app/apps/backend/.medusa/server ./apps/backend
COPY --chown=app:app scripts/initialize-storage.cjs /app/scripts/initialize-storage.cjs
RUN mkdir -p /app/uploads /app/apps/backend/static && chown app:app /app/uploads /app/apps/backend/static
WORKDIR /app/apps/backend
USER app
EXPOSE 9000
HEALTHCHECK --interval=20s --timeout=10s --retries=3 --start-period=30s CMD curl -f http://127.0.0.1:9000/health || exit 1
CMD ["node", "../../node_modules/@medusajs/cli/cli.js", "start"]
