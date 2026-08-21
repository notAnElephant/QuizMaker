# QuizMaker

QuizMaker is a Vite, React, and TypeScript quiz-board application backed by a Fastify REST API and PostgreSQL.

## Stack

- React 19 and Vite
- Fastify with TypeBox request validation
- Prisma ORM and PostgreSQL
- TanStack Query for server state
- Firebase Authentication and Storage in production
- Local user switching when Firebase is not configured

## Local setup

1. Copy `.env.example` to `.env` and adjust values if needed.
2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Start PostgreSQL, apply migrations, and load sample data:

   ```sh
   docker compose up -d
   pnpm db:reset:local
   ```

4. Start the API and web app together:

   ```sh
   pnpm dev
   ```

The web app runs at `http://localhost:5173`, the API at `http://localhost:3001`, and Vite proxies `/api` requests to the API.

## Commands

- `pnpm dev`: run the API and Vite development servers.
- `pnpm dev:api`: run only Fastify with file watching.
- `pnpm dev:web`: run only Vite.
- `pnpm build`: generate Prisma Client, type-check the app and API, and build both.
- `pnpm lint`: run ESLint.
- `pnpm db:migrate`: apply Prisma migrations using `DATABASE_URL`.
- `pnpm db:migrate:local`: apply migrations to local Docker PostgreSQL.
- `pnpm db:reset:local`: recreate the local schema, apply migrations, and load sample data.
- `pnpm db:seed:local`: reload local sample data.

## Authentication

When Firebase variables are configured, the browser sends a Firebase ID token and the API verifies it with Firebase Admin. Set `FIREBASE_PROJECT_ID` on the API service and the matching `VITE_FIREBASE_PROJECT_ID` in the frontend build.

Without Firebase, non-production API instances allow the seeded local users. Set `ALLOW_LOCAL_AUTH=true` explicitly to enable this mode. Never enable local authentication in production.

## Production deployment

The connected Vercel project deploys the Vite frontend and Fastify API together. Requests under `/api/*` run in a Vercel Node function; all other routes use the SPA fallback.

Set `DATABASE_URL` and `FIREBASE_PROJECT_ID` in Vercel. `VITE_API_URL` should remain empty for the default same-origin deployment. Run `pnpm db:migrate` as a release step whenever new Prisma migrations are added.
