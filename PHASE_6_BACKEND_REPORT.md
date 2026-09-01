# PHASE 6 — ZEVOTA BACKEND & DATABASE FOUNDATION REPORT

**Status**: Complete & Verified  
**Date**: September 2026  
**Environment**: Expo SDK 55 • React Native 0.83.10 • Node.js / Express • Prisma ORM • Clerk Authentication • TypeScript  

---

## 1. Executive Summary

Phase 6 transitioned the Zevota application from a local/mock-state application into a **real, persistent, authenticated, backend-driven architecture**.

All application data (User Profiles, Addresses, Categories, Brands, Products, Service Packages, Technicians, Bookings, Status Histories, Service Reports, and Tax Invoices) is now managed through a normalized relational schema backed by Prisma ORM and exposed via a REST API server.

Authentication is powered by **Clerk JWT verification** on the backend. Client user IDs, prices, and taxes sent in request payloads are **never trusted**; the server independently resolves the authenticated user from the verified Clerk session token and calculates authoritative prices and taxes directly from canonical database records.

---

## 2. Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                  Zevota Mobile App (Expo SDK 55)           │
│  - Expo Router (typed routes)                              │
│  - @clerk/expo (Authentication & Session Tokens)          │
│  - apiClient (services/api.ts with Bearer Token Injection) │
└─────────────────────────────┬──────────────────────────────┘
                              │ HTTP + Bearer <Clerk JWT>
                              ▼
┌────────────────────────────────────────────────────────────┐
│                  Zevota REST API Server                    │
│  - Express.js + TypeScript (Strict Mode)                   │
│  - @clerk/backend (JWT Verification & User Sync)          │
│  - Middleware: requireAuth, errorHandler, CORS             │
│  - Controllers: User, Catalog, Booking                     │
└─────────────────────────────┬──────────────────────────────┘
                              │ Prisma Client
                              ▼
┌────────────────────────────────────────────────────────────┐
│                  Relational Database Engine                │
│  - SQLite (Local Dev) / PostgreSQL (Production Compatible) │
│  - 11 Normalized Models with Foreign Keys & Indexes        │
└────────────────────────────────────────────────────────────┘
```

---

## 3. Database Architecture & Schema Design

The Prisma schema defines 11 normalized models:

| Model | Primary Key | Key Relations & Fields | Purpose |
| :--- | :--- | :--- | :--- |
| `User` | `cuid` | `clerkUserId` (Unique Index), `email`, `name`, `phone`, `memberSince` | Core user identity & profile |
| `Address` | `cuid` | `userId` -> `User.id`, `label`, `street`, `city`, `pincode`, `isDefault` | Multi-address storage per user |
| `Category` | `String` (slug) | `name`, `icon`, `popular`, `itemCount` | Appliance category catalog |
| `Brand` | `String` (slug) | `name`, `categories` (JSON) | Appliance brand catalog |
| `Product` | `String` (slug) | `categoryId` -> `Category`, `brandId` -> `Brand`, `model` | Appliance model catalog |
| `ServiceOption` | `String` (slug) | `categoryId` -> `Category`, `price`, `warrantyDays`, `features` | Service packages & pricing |
| `Technician` | `String` (id) | `name`, `phone`, `rating`, `completedJobs`, `specialization`, `coordinates` | Certified field technicians |
| `Booking` | `cuid` | `userId`, `serviceOptionId`, `addressId`, `technicianId`, `status`, `totalAmount` | Appliance service bookings |
| `BookingStatusHistory` | `cuid` | `bookingId` -> `Booking.id`, `status`, `note`, `timestamp` | Immutable status audit trail |
| `ServiceReport` | `cuid` | `bookingId` (Unique) -> `Booking.id`, `notes`, `parts`, `warrantyUntil`, `rating` | Completion reports & ratings |
| `Invoice` | `cuid` | `bookingId` (Unique) -> `Booking.id`, `invoiceNumber`, `taxableAmount`, `cgst`, `sgst`, `total` | Authoritative tax invoices |

---

## 4. Clerk Authentication & Security Model

1. **Client Bearer Token Injection**:
   - `app/_layout.tsx` registers Clerk's `getToken` hook with `services/api.ts`.
   - Every outgoing HTTP request dynamically resolves the active Clerk session JWT and includes `Authorization: Bearer <token>`.
2. **Backend JWT Verification (`backend/src/middleware/auth.ts`)**:
   - Backend calls `verifyToken(token, { secretKey })` from `@clerk/backend`.
   - Extracts the verified `sub` claim (`clerkUserId`).
3. **Automated User Synchronization**:
   - If the `clerkUserId` does not exist in the database, the backend creates a `User` record automatically, fetching metadata if available.
   - Attaches `req.user = { id: dbUser.id, clerkUserId: dbUser.clerkUserId, ... }`.
4. **Data Isolation & Multi-Tenancy**:
   - Every query (`findMany`, `findFirst`, `create`, `update`, `delete`) filters on `userId: req.user.id`.
   - Any attempt by User B to view, update, cancel, or delete User A's bookings, addresses, or invoices returns `404 Not Found` or `403 Forbidden`.

---

## 5. Authoritative Pricing & Tax Computation Engine

Client-provided prices are completely discarded during booking creation. Pricing and taxation are authoritatively determined server-side:

$$\text{Subtotal} = \text{ServiceOption.price}$$
$$\text{Taxable Amount} = \text{round}\left(\frac{\text{Subtotal}}{1.18}, 2\right)$$
$$\text{Total GST (18\%)} = \text{round}(\text{Subtotal} - \text{Taxable Amount}, 2)$$
$$\text{CGST (9\%)} = \text{round}\left(\frac{\text{Total GST}}{2}, 2\right), \quad \text{SGST (9\%)} = \text{round}\left(\frac{\text{Total GST}}{2}, 2\right)$$
$$\text{Total Paid} = \text{Subtotal}$$

The generated `Invoice` record stores these exact calculated figures, along with an official invoice number (e.g. `INV-37242`) and SAC code `998719` (Maintenance & Repair Services).

---

## 6. Backend API Endpoint Reference

### Health
- `GET /api/health` — Service health check

### User & Addresses (Protected)
- `GET /api/me` — Retrieve current authenticated user profile
- `PATCH /api/me` — Update user profile details
- `GET /api/addresses` — List user's saved addresses
- `POST /api/addresses` — Add a new address
- `PATCH /api/addresses/:id` — Update existing address
- `DELETE /api/addresses/:id` — Delete address
- `PATCH /api/addresses/:id/default` — Set default address

### Catalog (Public)
- `GET /api/categories` — List all categories
- `GET /api/brands` — List brands (`?categoryId=...`)
- `GET /api/products` — List products (`?categoryId=&brandId=`)
- `GET /api/products/:id` — Get product by ID
- `GET /api/services` — List service packages (`?categoryId=...`)
- `GET /api/services/:id` — Get service package details
- `GET /api/technicians` — List available technicians

### Bookings (Protected)
- `GET /api/bookings` — List authenticated user bookings (`?status=...`)
- `POST /api/bookings` — Create a new booking
- `GET /api/bookings/:id` — Retrieve booking details and status audit history
- `PATCH /api/bookings/:id/status` — Update booking status
- `POST /api/bookings/:id/cancel` — Cancel booking with recorded reason
- `GET /api/bookings/:id/invoice` — Retrieve official GST tax invoice
- `GET /api/bookings/:id/report` — Retrieve service completion report
- `POST /api/bookings/:id/report` — Submit service rating and technician report

---

## 7. Frontend Integration & Service Layer Migration

| Component / Screen | Before (Phase 5.5) | After (Phase 6) |
| :--- | :--- | :--- |
| `services/api.ts` | Mock delay with local mock objects | Real `fetch` HTTP client + Clerk JWT Bearer injection + Timeout |
| `services/bookings.ts` | Local memory array manipulation | REST API calls (`/api/bookings`, `/invoice`, `/cancel`, `/report`) |
| `services/users.ts` | Local memory storage | REST API calls (`/api/me`, `/api/addresses`) |
| `hooks/useUserProfile.ts` | Clerk unsafeMetadata only | Clerk auth + Backend database synchronization |
| `store/bookingStore.ts` | Hardcoded mock bookings array | Draft creation state + backend response caching |
| `app/(tabs)/requests.tsx` | Static mock bookings | Live backend bookings + Pull-to-refresh + Tab filtering |
| `app/bookings/[id].tsx` | Static mock lookup | Live API fetch + ownership protection + action triggers |
| `app/bookings/invoice.tsx` | Static client invoice | Authoritative backend GST tax invoice |
| `app/bookings/completed.tsx`| Static report | Live report from server + server-side rating submission |
| `app/bookings/tracking.tsx` | Simulated memory state | Live technician data + server-persisted status updates |
| `app/requests/cancel.tsx` | Local state reset | Server cancellation recording reasons and audit history |
| `app/services/payment.tsx` | Client random ID generator | Real server booking creation with database ID |
| `app/profile/invoices.tsx` | Static mock list | Live list of paid bookings with invoice navigation |

---

## 8. Test Suite & Verification Results

The automated integration test suite (`backend/test/api-test.ts`) executed 12 end-to-end stages:

```
🧪 Starting Zevota Backend API Comprehensive Test Suite...

Test 1: GET /api/health -> 200 OK (Server online)
Test 2: GET /api/me without token -> 401 Unauthorized
Test 3: GET /api/me with User A token -> 200 OK (User A provisioned)
Test 4: PATCH /api/me -> 200 OK (Profile updated)
Test 5: POST /api/addresses -> 201 Created (Address created)
Test 5b: GET /api/addresses -> 200 OK (Addresses listed)
Test 6: GET /api/categories -> 200 OK (8 categories loaded)
Test 6b: GET /api/services?categoryId=ac -> 200 OK (4 AC services)
Test 7: POST /api/bookings -> 201 Created (Booking created with server pricing)
Test 8: PATCH /api/bookings/:id/status -> 200 OK (Status history recorded)
Test 9: GET /api/bookings/:id/invoice -> 200 OK (Tax invoice calculated)
Test 10: POST /api/bookings/:id/report -> 200 OK (Service report saved)
Test 11: POST /api/bookings/:id/cancel -> 200 OK (Cancellation persisted)
Test 12: SECURITY ISOLATION CHECK: User B attempts to access User A data
  - GET /api/bookings/ZEV-... -> 404 (Blocked)
  - GET /api/bookings/ZEV-.../invoice -> 404 (Blocked)
  - DELETE /api/addresses/... -> 404 (Blocked)

🎉 ALL 12 BACKEND INTEGRATION & SECURITY TESTS PASSED!
```

### TypeScript Validation
- **Frontend**: `npx tsc --noEmit` -> **0 errors** (Exit Code: 0)
- **Backend**: `tsc --noEmit` -> **0 errors** (Exit Code: 0)
- **Expo Config**: `npx expo config --type public` -> **Valid SDK 55 Configuration** (Exit Code: 0)

---

## 9. Diagnostic Checklist

| Diagnostic Item | Status | Notes |
| :--- | :---: | :--- |
| Normalized Database Models Created | ✅ PASS | 11 models with foreign key constraints and indexes |
| Database Seeding | ✅ PASS | 8 Categories, 12 Brands, 29 Products, 13 Services, 3 Technicians |
| Clerk Authentication & JWT Verification | ✅ PASS | sub claim verified, automated user sync |
| Authoritative Calculations | ✅ PASS | Server calculates price, 18% GST (CGST/SGST), and invoice numbers |
| Multi-Tenancy Data Isolation | ✅ PASS | User B blocked from accessing User A records |
| Real Frontend HTTP Client | ✅ PASS | services/api.ts with token injection and error handling |
| Booking Flow Backend Integration | ✅ PASS | Create, track, invoice, report, cancel connected |
| Frontend TypeScript Compilation | ✅ PASS | 0 errors |
| Backend TypeScript Compilation | ✅ PASS | 0 errors |
| Overall Phase 6 Status | **GREEN** | **Ready for Next Phase** |
