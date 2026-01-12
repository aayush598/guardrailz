# Database Layer

This directory contains the **shared database layer** for the Guardrailz platform.

It is the **single source of truth** for:

- Database schema (Drizzle ORM)
- Type-safe DB access
- Runtime DB client configuration

This layer is intentionally **framework-agnostic** and must remain usable by:

- API routes
- Background workers
- Future SDKs
- CLI tools

## Directory Structure

```

shared/db/
├── client.ts            # Database client (postgres-js + Drizzle)
├── schema/              # Table definitions split by domain
│   ├── users.ts
│   ├── profiles.ts
│   ├── api-keys.ts
│   ├── guardrail-executions.ts
│   ├── rate-limits.ts
│   ├── relations.ts
│   └── index.ts
├── types.ts             # DB-derived TypeScript types
└── README.md

```

> **Note:** Database migrations are managed by Drizzle and live in the root-level
> `drizzle/` directory. They are intentionally not part of this runtime module.

## Design Principles

### 1. Framework Agnostic

This layer **must not** import from:

- Next.js
- React
- Server-only APIs

It should be safe to import from **any Node.js environment**.

### 2. Schema-Only Responsibility

Schema files:

- Define tables, columns, indexes, and relations
- Do **not** contain business logic
- Do **not** perform queries

All queries must live in higher-level **repositories or services**.

### 3. Type Safety by Default

All database types are derived directly from the schema using Drizzle’s
`InferSelectModel` and `InferInsertModel`.

Do **not** redefine DB models manually.

### 4. Safe Runtime Configuration

- `DATABASE_URL` must be provided at runtime
- The DB client is configured for compatibility with transaction poolers
- Logging is enabled only in development

### 5. Migration Discipline

- Migrations are **append-only**
- Never edit an existing migration
- Never import or execute migration files at runtime
- Migrations are owned by the Drizzle CLI, not the application

## Usage

### Importing the DB client

```ts
import { db } from '@/shared/db/client';
```

### Importing schema objects

```ts
import { users, profiles } from '@/shared/db/schema';
```

### Importing DB types

```ts
import type { User, Profile } from '@/shared/db/types';
```

## What Does _Not_ Belong Here

The following **must not** be added to this layer:

- Business rules
- Authorization logic
- Request/response validation
- Feature-specific queries
- Next.js route handlers

Those belong in **domain modules or services**.

## Common Mistakes to Avoid

- Importing from `drizzle/`
- Adding query logic to schema files
- Editing generated migration files
- Coupling schema to application logic
- Using raw SQL when a typed query exists

## Summary

This database layer is intentionally:

- Minimal
- Explicit
- Stable

Treat it as **platform infrastructure**, not feature code.
