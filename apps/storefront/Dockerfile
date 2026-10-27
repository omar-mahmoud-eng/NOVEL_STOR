FROM node:22-alpine AS dependencies
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/storefront/package.json apps/storefront/package.json
COPY packages/schemas/package.json packages/schemas/package.json
RUN npm ci --include=dev

FROM dependencies AS builder
COPY apps/storefront apps/storefront
COPY packages/schemas packages/schemas
ARG NEXT_PUBLIC_BASE_URL=http://localhost:3000
ARG NEXT_PUBLIC_ENABLE_DEMO_MODE=false
ARG NEXT_PUBLIC_MANUAL_PAYMENT_ENABLED=false
ARG NEXT_PUBLIC_MEDIA_ORIGINS=http://localhost:9005
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL NEXT_PUBLIC_ENABLE_DEMO_MODE=$NEXT_PUBLIC_ENABLE_DEMO_MODE NEXT_PUBLIC_MANUAL_PAYMENT_ENABLED=$NEXT_PUBLIC_MANUAL_PAYMENT_ENABLED NEXT_PUBLIC_MEDIA_ORIGINS=$NEXT_PUBLIC_MEDIA_ORIGINS NEXT_TELEMETRY_DISABLED=1
RUN npm run build --workspace=@enterprise/schemas && npm run build --workspace=@enterprise/storefront

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat curl && addgroup -g 1001 -S app && adduser -u 1001 -S app -G app
COPY --from=dependencies --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/packages/schemas ./packages/schemas
COPY --from=builder --chown=app:app /app/apps/storefront ./apps/storefront
WORKDIR /app/apps/storefront
USER app
EXPOSE 3000
HEALTHCHECK --interval=20s --timeout=10s --retries=3 --start-period=30s CMD curl -f http://127.0.0.1:3000/ar || exit 1
CMD ["node", "../../node_modules/next/dist/bin/next", "start", "--hostname", "0.0.0.0", "--port", "3000"]
