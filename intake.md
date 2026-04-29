# new_intake

Production intake and support operations app for INSEAD IT.

This application centralizes:
- Student check-in and issue intake
- Live technician queue handling
- Manager analytics dashboards
- Admin/maintenance tooling (configuration, exports, reference data)

It is built as a standalone Next.js 15 App Router project in this monorepo.

## Table of Contents

- [1. Product Overview](#1-product-overview)
- [2. Main User Flows](#2-main-user-flows)
- [3. Tech Stack](#3-tech-stack)
- [4. Project Structure](#4-project-structure)
- [5. Authentication and Authorization](#5-authentication-and-authorization)
- [6. API Overview](#6-api-overview)
- [7. Data Model (Prisma)](#7-data-model-prisma)
- [8. Environment Variables](#8-environment-variables)
- [9. Local Development Setup](#9-local-development-setup)
- [10. Database and Seeding Workflows](#10-database-and-seeding-workflows)
- [11. Testing](#11-testing)
- [12. Deployment (Vercel and Supabase)](#12-deployment-vercel-and-supabase)
- [13. Operational Notes](#13-operational-notes)
- [14. Troubleshooting](#14-troubleshooting)

## 1. Product Overview

`new_intake` is the current operational app for IT support intake.

Compared to older iterations, this version consolidates intake, ticket operations, and reporting into one codebase with:
- A modern Next.js + TypeScript architecture
- Prisma data layer
- Campus-aware role-based access
- Interactive analytics (Recharts) and optional embedded Power BI report page

## 2. Main User Flows

### Student intake flow

Typical path:
1. Student starts at `/intake` (badge/email check-in)
2. Student answers issue/program/device questions in `/intake/questions`
3. Student sees queue decision in `/intake/queue-decision`
4. Student can either:
   - Stay in queue and continue to `/intake/thanks`
   - Book slot in `/intake/book-slot`
5. Student submits post-support feedback in `/intake/feedback`

### Technician flow

1. Technician opens `/technician`
2. Sees queue scoped to allowed campus/role
3. Assigns a ticket to self (`assign` endpoint)
4. Works ticket and closes/reopens as needed

### Manager flow

1. Manager opens `/manager`
2. Uses date range and campus filtering
3. Reviews KPIs, trends, breakdowns, and word insights
4. Optional Power BI page at `/manager/powerbi` (if configured)

### Maintenance/Admin flow

From `/maintenance`, admins can:
- Manage programmes/issues/devices/students/technicians
- Manage app settings and operational toggles
- Export tickets and feedback data as CSV

## 3. Tech Stack

### Core

- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 3

### Data and auth

- Prisma 6
- MySQL (local/default)
- Optional PostgreSQL/Supabase schema path for hosted environments
- NextAuth v5 beta (Credentials + optional Microsoft Entra ID)

### Validation, UI, analytics, monitoring

- Zod (API input validation)
- Framer Motion (UI interactions)
- Recharts (manager dashboards)
- Sentry (`@sentry/nextjs`)
- Playwright (E2E)

## 4. Project Structure

High-level structure:

```text
new_intake/
  app/                  # App Router pages + API routes
    api/                # Route handlers
    intake/             # Student journey screens
    technician/         # Technician UI
    manager/            # Manager dashboards
    maintenance/        # Admin/maintenance UI
    auth/               # Sign-in pages
  components/           # Shared UI components
  lib/                  # Auth, Prisma, domain helpers, utilities
  prisma/               # Prisma schemas (MySQL + PostgreSQL variant)
  scripts/              # DB reset/seed/migration/build scripts
  tests/e2e/            # Playwright tests
```

Important folders:
- `app/api/*`: all server endpoints
- `src/repositories`, `src/services`, `src/actions`: application/service layers
- `config/*.json`: maintained options (issues, devices, programmes)

## 5. Authentication and Authorization

Authentication is handled with NextAuth (JWT session strategy).

Supported providers:
- Credentials (email/password)
- Optional Microsoft Entra ID SSO

Primary roles:
- `STUDENT`
- `TECHNICIAN`
- `ADMIN`

Route protection is enforced in middleware and APIs.

Typical access policy:
- Public: intake and auth entry points
- Technician/Admin: technician operations
- Admin only: maintenance and manager sections

## 6. API Overview

Main API domains under `app/api`:

### Intake and queue
- `GET /api/intake/wait-estimate`
- `POST /api/intake/book-slot`
- `POST /api/intake/feedback`
- `POST /api/intake/self-resolve`
- `POST /api/intake/slot-checkin`
- `POST /api/intake/transcribe`

### Queue and technician ticket lifecycle
- `GET /api/queue`
- `POST /api/technician/ticket/[id]/assign`
- `POST /api/technician/ticket/[id]/close`
- `POST /api/technician/ticket/[id]/reopen`

### Manager analytics
- `GET /api/manager/kpis`
- `GET /api/manager/analytics`
- `GET /api/word-cloud`

### Maintenance/admin
- `GET/POST /api/maintenance/settings`
- `GET/POST /api/maintenance/issues`
- `GET/POST /api/maintenance/devices`
- `GET/POST /api/maintenance/slots`
- `GET /api/maintenance/export/tickets`
- `GET /api/maintenance/export/feedback`

### Auth
- NextAuth handler: `app/api/auth/[...nextauth]/route.ts`

## 7. Data Model (Prisma)

Canonical schema file:
- `prisma/schema.prisma`

Key entities:
- `User`
- `Ticket`
- `Feedback`
- `AuditLog`
- `Config`

Important enums include:
- `Role`
- `CampusCode`
- `TicketStatus`
- rating/emotion and issue/device related enums

Data model highlights:
- Ticket lifecycle with queue and technician assignment fields
- Separate feedback record linked to ticket
- Audit trail for operational changes
- Indexed fields for queue and analytics performance

## 8. Environment Variables

Use `.env.example` as the template.

Minimum local variables:

```env
DATABASE_URL=mysql://root:password@localhost:3307/newIntake
AUTH_SECRET=replace-with-openssl-rand-base64-32
AUTH_TRUST_HOST=true
CAMPUS=FBL
```

Common optional variables:
- `LOW_RATING_ALERT_EMAIL`
- `AZURE_AD_CLIENT_ID`
- `AZURE_AD_CLIENT_SECRET`
- `AZURE_AD_TENANT_ID`
- `AZURE_AD_ALLOWED_DOMAINS`
- `POWERBI_EMBED_URL`
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`

For Supabase/PostgreSQL deployments:
- `DATABASE_URL` (runtime/pool connection)
- `DIRECT_URL` (direct connection for migration/seed operations)

## 9. Local Development Setup

### Prerequisites

- Node.js 20+
- npm
- MySQL running and reachable by `DATABASE_URL`

### Install and run

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```

Dev server:
- `http://localhost:3000`

## 10. Database and Seeding Workflows

Available scripts:

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:migrate

npm run db:reset
npm run db:seed-analytics
npm run db:seed-supabase
npm run db:seed-supabase-local
npm run db:seed-supabase-http
npm run db:migrate-to-supabase
```

Notes:
- `db:reset` is destructive (drop/recreate and reseed behavior)
- Use with caution in shared environments
- After schema changes, always regenerate Prisma client

## 11. Testing

Playwright is configured for end-to-end tests.

Commands:

```bash
npm run test:e2e
npm run test:e2e:ui
```

Linting:

```bash
npm run lint
```

## 12. Deployment (Vercel and Supabase)

Deployment is configured via:
- `vercel.json`
- `scripts/vercel-build.js`

Build strategy:
- MySQL environments: regular Next.js build
- PostgreSQL/Supabase environments: schema switch to `schema.postgresql.prisma`, Prisma generate, optional push/seed gates, then Next build

Helpful flags used by build script:
- `PRISMA_PUSH=true` to force Prisma push during build
- `SEED_DB=true` to trigger seed script
- `ALLOW_PROD_SEED=true` required to seed in production mode

## 13. Operational Notes

- Queue visibility and mutating actions are role/campus-aware
- Technician assignment includes safeguards (for example active workload limits)
- Maintenance settings are persisted and audited
- CSV export is provided for ticket and feedback operations
- Manager workspace provides interactive analytics and can coexist with embedded Power BI pages

## 14. Troubleshooting

### Prisma client errors after schema update

Run:

```bash
npm run prisma:generate
```

### Build fails due to wrong DB dialect

Check `DATABASE_URL` format and deployment variables.
- `mysql://...` for local MySQL flow
- `postgresql://...` for Supabase/PostgreSQL flow

### No analytics displayed

- Ensure ticket/feedback data exists
- Verify date range and campus filters
- Confirm `/api/manager/analytics` responds successfully

### Power BI page shows placeholder

Set:

```env
POWERBI_EMBED_URL=...
```

## License / Internal Use

This project supports internal IT support operations. Align reuse and distribution with your organization's internal policy.
