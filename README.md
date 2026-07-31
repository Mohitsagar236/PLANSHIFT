# PlanShift

PlanShift is a SaaS pricing and packaging change simulator for Product Managers. It helps teams simulate pricing-plan changes before launch by comparing ARR impact, customer disruption, churn risk, feature loss, grandfathering options, migration strategies, and affected customer segments.

## Why PlanShift Exists

Pricing changes are cross-functional decisions. Product, Growth, RevOps, Customer Success, and founders need to know which customers lose access, which accounts are near renewal, which contracts block migration, and which strategy balances revenue uplift with retention.

## Tech Stack

Next.js, TypeScript, React, Tailwind CSS, Prisma ORM, PostgreSQL, Zod, secure cookie auth, Recharts, Vitest, Playwright, Docker, ESLint, and Prettier.

## Setup

1. Copy `.env.example` to `.env`.
2. Start Postgres with `docker compose up -d`.
3. Install dependencies with `npm.cmd install`.
4. Generate Prisma client with `npm.cmd run db:generate`.
5. Run migrations with `npm.cmd run db:migrate`.
6. Seed demo data with `npm.cmd run db:seed`.
7. Start locally with `npm.cmd run dev`.

## Environment Variables

`DATABASE_URL` points to PostgreSQL. `AUTH_SECRET` signs session cookies. `NEXT_PUBLIC_APP_URL` is used for local app links.

## Demo Login

- Product Manager: `pm@planshift.dev` / `PlanShift123!`
- Admin: `admin@planshift.dev` / `PlanShift123!`

## Main Demo Flow

Log in, open `/dashboard`, inspect risk cards and charts, open `/simulations/new`, run the seeded SSO and Advanced Audit Logs migration scenario, review `/simulations/scenario-sso-audit-pro-to-enterprise/results`, compare strategies, then open the generated report.

## Commands

- `npm.cmd run dev`
- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run test:e2e`
- `npm.cmd run build`
- `npm.cmd run db:seed`
- `npm.cmd run db:reset-demo`

## Deployment Notes

Deploy as a standard Next.js app with a PostgreSQL database. Set `DATABASE_URL` and a strong `AUTH_SECRET`, then run Prisma migrations before starting the production server.
