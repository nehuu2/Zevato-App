# Zevota Backend & Database Foundation

Production-grade REST API backend built with Express, TypeScript, Prisma ORM, and Clerk JWT verification.

## 🚀 Features

- **Express + TypeScript**: Strictly typed RESTful API architecture.
- **Prisma ORM**: 11 normalized database models with full relational integrity.
- **Clerk Authentication**: JWT validation, sub claim extraction, and automated database user synchronization.
- **Authoritative Calculations**: Server-side pricing, GST tax computation (CGST 9% + SGST 9%), and invoice numbering.
- **User Data Isolation**: 100% enforced database-level filtering ensuring zero multi-tenant data leakage.
- **Zero-Dependency Quickstart**: Built-in SQLite database engine with seamless PostgreSQL portability.

## 📁 Directory Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # 11 normalized database models
│   ├── seed.ts             # Canonical catalog and technician seed script
│   └── dev.db              # SQLite development database
├── src/
│   ├── config/             # Prisma client & Clerk configuration
│   ├── controllers/        # userController, catalogController, bookingController
│   ├── middleware/         # requireAuth (Clerk JWT), errorHandler
│   ├── routes/             # Express route modules
│   ├── types/              # DTOs and API interfaces
│   ├── server.ts           # Express application setup & middleware
│   └── index.ts            # Application entrypoint
├── test/
│   └── api-test.ts         # 12-stage integration and security test suite
├── .env.example
├── package.json
└── tsconfig.json
```

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your Clerk secret credentials:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CORS_ORIGIN=*
```

### 3. Generate Prisma Client & Push Schema
```bash
npm run prisma:generate
npm run prisma:push
```

### 4. Seed Database
Populate all categories, brands, products, services, and technicians:
```bash
npm run seed
```

### 5. Run Development Server
```bash
npm run dev
```
Server runs at `http://localhost:4000/api`.

### 6. Run Automated Test Suite
```bash
npm run test
```

## 📡 API Endpoints

### Health Check
- `GET /api/health` — Service health status

### User & Addresses (Authenticated)
- `GET /api/me` — Get user profile
- `PATCH /api/me` — Update user profile
- `GET /api/addresses` — List user saved addresses
- `POST /api/addresses` — Add new address
- `PATCH /api/addresses/:id` — Update address
- `DELETE /api/addresses/:id` — Delete address
- `PATCH /api/addresses/:id/default` — Set default address

### Catalog (Public)
- `GET /api/categories` — List all categories
- `GET /api/brands` — List all brands (optional `?categoryId=...`)
- `GET /api/products` — List all products (optional `?categoryId=&brandId=`)
- `GET /api/products/:id` — Get product details
- `GET /api/services` — List service packages (optional `?categoryId=`)
- `GET /api/services/:id` — Get service package details
- `GET /api/technicians` — List available technicians

### Bookings (Authenticated)
- `GET /api/bookings` — List user bookings (optional `?status=...`)
- `POST /api/bookings` — Create a booking (authoritative pricing & invoice)
- `GET /api/bookings/:id` — Get booking details & status history
- `PATCH /api/bookings/:id/status` — Update booking status
- `POST /api/bookings/:id/cancel` — Cancel booking with reason
- `GET /api/bookings/:id/invoice` — Get authoritative GST tax invoice
- `GET /api/bookings/:id/report` — Get service completion report
- `POST /api/bookings/:id/report` — Submit service rating and report
