# Architecture

The app uses Next.js App Router with TypeScript. UI routes are under `app`, reusable UI is under `components`, domain logic is under `lib/simulation`, CSV validation is under `lib/csv`, demo data is under `lib/demo`, and persistence is modeled with Prisma in `prisma/schema.prisma`.

PostgreSQL is the target database. API routes use Zod validation and Prisma. Auth uses hashed passwords and signed HTTP-only cookies.
