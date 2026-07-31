# PlanShift Agent Guide

## Project Overview

PlanShift is a B2B SaaS pricing-change simulation product. It is not a billing app. The core value is helping Product Managers compare revenue impact, customer disruption, churn risk, feature loss, grandfathering options, and migration strategy before launch.

## Coding Standards

Use TypeScript, keep business logic out of UI files, validate inputs with Zod, keep secrets in environment variables, and avoid real customer data. Preserve the professional B2B SaaS UI style.

## Commands

Install with `npm.cmd install`. Run `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test`, `npm.cmd run test:e2e`, and `npm.cmd run build`. Database commands are `npm.cmd run db:generate`, `npm.cmd run db:migrate`, and `npm.cmd run db:seed`.

## Architecture Notes

Business logic lives in `lib/simulation`. CSV validation lives in `lib/csv`. Synthetic product data lives in `lib/demo`. Prisma models live in `prisma/schema.prisma`. App routes live in `app`.

## Adding Simulation Rules

Add explainable scoring functions in `lib/simulation/engine.ts`, include a human-readable reason in `explainImpact`, and cover the rule with unit tests.

## Adding Tests

Put logic tests in `tests/unit`, workflow tests in `tests/integration`, and browser flows in `tests/e2e`.

## Guardrails

Do not hardcode secrets, remove auth hashing, introduce real customer data, or turn this into a generic billing dashboard. Keep the PM case-study positioning intact.
