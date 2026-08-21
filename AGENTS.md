# Repository Guidelines

## Project Structure & Module Organization

The app uses Vite + React + TypeScript with a Fastify REST API. Frontend code lives in `src/`, API code in `server/`, and Prisma schema/migrations in `prisma/`. UI components live in `src/components/`, shared state is in `src/context/`, and the typed API client is in `src/api/`. Static assets live in `public/` and `src/assets/`. Docker Compose provides local PostgreSQL.

## Build, Test, and Development Commands

- `pnpm dev`: start Fastify and Vite together.
- `pnpm build`: generate Prisma Client, type-check the frontend and API, and produce production builds.
- `pnpm lint`: run ESLint across the repository.
- `pnpm db:migrate:local`: apply Prisma migrations to local PostgreSQL.
- `docker compose up -d`: start PostgreSQL locally.

## Coding Style & Naming Conventions

Use TypeScript with 2-space indentation and keep formatting Prettier-compatible. Components, context providers, and model classes use PascalCase files such as `Board.tsx` and `Question.ts`. Utility modules use lower-case names such as `utils.ts`. Prefer named imports, keep React components functional, and avoid editing generated Prisma Client files manually. Run `pnpm lint` before opening a PR.

## Testing Guidelines

There is currently no test runner configured. Until tests are added, treat `pnpm lint`, `pnpm build`, and a manual UI check as the minimum verification bar. If you add tests, place them near the feature or under `src/__tests__/` and use `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines

Prefer Conventional Commits: `feat:`, `fix:`, `chore:`. Recent history contains a few `wip` commits; do not use that pattern for final commits. Keep messages imperative and specific, for example `fix: handle empty questions response`. PRs should include a short summary, note schema or env changes, link related issues, and add screenshots for UI changes.

## Security & Configuration Tips

Do not commit real secrets. Local development uses Docker PostgreSQL by default. Keep `DATABASE_URL` server-only and use `LOCAL_DATABASE_URL` only to override the local connection. Browser-exposed values must be limited to `VITE_*`. Apply schema changes through Prisma migrations and keep ownership checks in authenticated API queries.
