# Enterprise Headless E-Commerce Platform

Production-ready, zero-vulnerability headless e-commerce architecture powered by **Medusa.js v2**, **Next.js 15 (App Router)**, **TypeScript**, **PostgreSQL 16**, and **Redis 7**, featuring native **Arabic (RTL)** and **English (LTR)** localization.

---

## 1. System Architecture

```text
                                  +---------------------------------------+
                                  |   Next.js 15 App Router Storefront    |
                                  |   (Bilingual: Arabic RTL / LTR)       |
                                  +---------------------------------------+
                                                     |
                                   Zero Price Tamper (variant_id + quantity)
                                                     |
                                                     v
                                  +---------------------------------------+
                                  |         Medusa.js v2 Backend          |
                                  | - Custom Modules (Fulfillment Tracker)|
                                  | - Workflows SDK (Atomic Reservations) |
                                  | - Pre-built Admin + Custom Extensions |
                                  +---------------------------------------+
                                            /                  \
                       ACID Persistence    /                    \   Event Bus & Cache
                                          v                      v
                             +--------------------+     +-------------------+
                             | PostgreSQL 16      |     | Redis 7 (BullMQ)  |
                             | (Atomic Locks)     |     | (Worker Queue)    |
                             +--------------------+     +-------------------+
```

---

## 2. Zero-Vulnerability Security Architecture

1. **Zero Price Manipulation:** The Storefront only transmits `variant_id` and positive integer `quantity`. The Medusa backend strictly calculates unit prices, discounts, and regional VAT (15% in KSA) via `secureCheckoutWorkflow` pulling directly from database price tables.
2. **Atomic Inventory Reservation:** Uses the Medusa v2 Inventory & Reservation module with database row locking to prevent race-condition overselling. On checkout failure, automatic compensation logic releases locked items.
3. **Cryptographic Webhook Verification:** Payment webhooks (Stripe / Mada) enforce HMAC-SHA256 signature verification with constant-time buffer comparison (`crypto.timingSafeEqual`) and a 300-second replay attack tolerance window.
4. **Hardened HTTP Middlewares:** Sliding-window rate limiting on `/auth/*` and checkout routes, strict Content Security Policy (CSP), HSTS (2-year preload), `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff`.
5. **Least-Privilege Dockerization:** Both the Backend and Storefront run under isolated non-root system users (`medusajs` and `nextjs`).

---

## 3. Directory Layout

```text
├── apps/
│   ├── backend/                              # Medusa v2 Core & Admin Extensions
│   │   ├── src/
│   │   │   ├── admin/                        # Admin Widget & Analytics UI Route
│   │   │   ├── api/                          # Rate-limiting middlewares & Webhooks
│   │   │   ├── modules/fulfillment-tracker/  # Custom Medusa v2 Data Module
│   │   │   ├── scripts/seed.ts               # Production database seed script
│   │   │   ├── subscribers/order-placed.ts   # Redis background PDF invoice generator
│   │   │   └── workflows/checkout-workflow.ts# Server-side price & reservation workflow
│   │   ├── Dockerfile
│   │   └── medusa-config.ts
│   │
│   └── storefront/                           # Next.js 15 Bilingual Storefront
│       ├── src/
│       │   ├── app/[locale]/                 # Dynamic locale routing ('ar' & 'en')
│       │   ├── components/                   # Shadcn UI, Slide-Over Cart, PDP
│       │   ├── context/cart-context.tsx      # Cart state provider
│       │   ├── messages/                     # ar.json & en.json translation catalogs
│       │   └── middleware.ts                 # Next.js i18n detection
│       └── Dockerfile
│
├── packages/
│   └── schemas/                              # Shared Zod validation schemas
├── docker-compose.yml                        # Full container stack orchestration
└── .env.template                             # Comprehensive secrets template
```

---

## 4. Quick Start & Setup

### Prerequisites
- Node.js >= 20.0.0
- Docker & Docker Compose
- npm >= 10.0.0

### Step 1: Environment Configuration
```bash
cp .env.template .env
```

### Step 2: Launch Databases with Docker Compose
```bash
docker compose up -d postgres redis
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Run Medusa v2 Database Migrations
```bash
cd apps/backend
npx medusa db:migrate
```

### Step 5: Provision Administrator User
```bash
npx medusa user --email admin@enterprise-ecommerce.com --password "AdminP@ssw0rd2026!EnterpriseSecure"
```

### Step 6: Seed Production Catalog & Multi-Warehouse Stock
```bash
npx medusa exec ./src/scripts/seed.ts
```

### Step 7: Start Development Servers
From the root directory:
```bash
npm run dev
```

* **Storefront (Bilingual Next.js):** [http://localhost:3000](http://localhost:3000)
  * Arabic (RTL): [http://localhost:3000/ar](http://localhost:3000/ar)
  * English (LTR): [http://localhost:3000/en](http://localhost:3000/en)
* **Medusa Core API:** [http://localhost:9000](http://localhost:9000)
* **Medusa Admin Dashboard:** [http://localhost:9000/app](http://localhost:9000/app)
* **Custom Admin Analytics:** [http://localhost:9000/app/analytics](http://localhost:9000/app/analytics)

---

## 5. Production Docker Deployment

To build and run the entire unified stack in production containers:
```bash
docker compose up -d --build
```

To monitor logs:
```bash
docker compose logs -f
```
