# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — runs the dev server via `nodemon` + `ts-node` (`src/index.ts`), watching `src/`. There is no build/compile step or production start script.
- There is no test runner, linter, or formatter configured. `npm test` is a placeholder that exits with an error.
- Run TypeScript type-checking with `npx tsc --noEmit` (note: `tsconfig.json` has no `outDir`, so don't run a plain `tsc`).

## Required environment

Loaded via `dotenv` from a `.env` file (not committed). Server expects:
- `CONNECTION_STRING` — MongoDB connection URI (Mongoose).
- `JWT_SECRET` — secret for signing/verifying JWTs. Login falls back to `'secret-key'` if unset, but the auth middleware returns a 500 when it is missing.
- `PORT` (default `8080`), `NODE_ENV` (default `development`; controls whether the error handler leaks `err.message`).

Note: `src/db/connection.ts` overrides DNS servers to `8.8.8.8`/`1.1.1.1` to work around router-level DNS-over-TCP blocks for MongoDB SRV lookups.

## Architecture

REST API for an inventory management system. The server (`src/index.ts`) mounts five route groups under `/api`: `auth`, `products`, `categories`, `users`, `log`. Swagger UI is served at `/api-docs`.

Each domain follows the same layered flow: **route → middleware → controller → Mongoose model**.

- **Routes** (`src/routes/*.routes.ts`) wire HTTP verbs to controller methods and attach middleware. The full OpenAPI spec lives in `@swagger` JSDoc comments above each route — `swagger-jsdoc` reads these (configured in `src/config/swagger.config.ts` to scan `./src/routes/*.ts`). Keep these comments in sync when changing endpoints.
- **Controllers** (`src/controllers/*.controller.ts`) are classes instantiated once per route file. Methods take `(req: AuthRequest, res: Response)` and handle their own try/catch, returning JSON error objects rather than calling `next(err)`. The top-level error handler in `index.ts` is effectively a fallback only.
- **Models** (`src/models/*.model.ts`) are Mongoose schemas exporting both an `I*` interface and the model. `Product`, `User`, and `Category` use `{ timestamps: true }`; `Log` stores its own `timestamp` field instead.
- **DTOs** (`src/dto/`) are two different styles: plain classes with `Object.assign` (e.g. `ProductDto`, `UserDto`) for shaping responses, and Zod schemas (e.g. `LogSearchDtoSchema`, `RegisterDtoSchema`, `LoginDtoSchema`) for request validation.

### Auth & roles

Two roles exist (`UserRole` in `src/types/user.ts`): `ADMIN` and `OPERATOR` (new users default to `ADMIN` in the schema).

- `auth.middleware.ts` — verifies the JWT and attaches the decoded payload to `req.user`. Used for endpoints any authenticated user may call.
- `admin.middleware.ts` — same verification plus a `role === 'ADMIN'` check (403 otherwise). Used for destructive endpoints (e.g. delete product, delete user).

JWTs are signed in `auth.controller.ts` with payload `{ id, email, role }` and a 30-day expiry. `AuthRequest` (`src/types/authRequest.ts`) extends Express `Request` with the typed `user` field used throughout controllers.

### Validation conventions

Two coexisting input-validation styles — match whichever the surrounding file uses:
- **Zod**: `Schema.safeParse(req.body)`, then on failure return 400 with the joined `error.errors` messages (see `auth.controller.ts`, `log.controller.ts`).
- **Manual**: inline `typeof`/range checks returning 400 (see `createProduct`/`updateQuantity` in `products.controller.ts`).

Note several write endpoints take input from `req.query` rather than the body (e.g. product create/update), even though the body is also parsed elsewhere.

### Audit logging

Most mutating actions write a `Log` document (`LogEvent` enum in `src/types/log.ts`: user login/register/delete, category create/delete, product create/update/delete). Logs are created **fire-and-forget after the response is sent** — `Log.create(...).catch(...)` is intentionally not awaited so logging failures never affect the request. Preserve this pattern when adding new audited actions. `log.controller.ts` queries logs with dynamic filters and populates the referencing user's email (showing `User deleted` when the user no longer exists).

## Code style

`.editorconfig` enforces tabs (size 2), LF line endings, trailing-whitespace trimming, and a final newline. There is no autoformatter, so follow these manually.
