# API

Auth: `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`.

Customers: `/api/customers`, `/api/customers/[id]`.

Plans: `/api/plans`, `/api/plans/[id]`.

Features: `/api/features`, `/api/features/[id]`.

Imports: `/api/imports/validate`, `/api/imports/reload-demo`, `/api/imports/reset`.

Simulations: `/api/simulations`, `/api/simulations/[id]/run`, `/api/simulations/[id]/strategies`, `/api/simulations/[id]/report`.

Settings: `/api/settings`.

Inputs are validated with Zod and authenticated database routes require a signed session cookie.
