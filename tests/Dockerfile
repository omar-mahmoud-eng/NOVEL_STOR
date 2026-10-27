FROM mcr.microsoft.com/playwright:v1.64.1-noble@sha256:47b510dd9230bf0b9bfc9b20102241e577ea7a99334ab4c3ca19f19770e9b8ea
WORKDIR /app
COPY --from=storyverse-backend:local /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY apps apps
COPY packages packages
COPY scripts scripts
COPY tests tests
ENV TEST_BROWSER_CHANNEL=chromium TEST_STOREFRONT_URL=http://medusa-storefront:3000 TEST_BACKEND_URL=http://medusa-backend:9000
CMD ["node", "tests/docker-operational.cjs"]
