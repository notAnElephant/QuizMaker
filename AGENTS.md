# Repository Guidelines

## Project Structure & Module Organization
The app is a Vite + React + TypeScript project. Main application code lives in `src/`. Route entrypoints are in `src/main.tsx` and `src/App.tsx`. UI components live in `src/components/`, shared state is in `src/context/`, GraphQL client setup is in `src/client.ts`, operations are in `src/queries/`, and generated types are in `src/gql/`. Static assets live in `public/` and `src/assets/`. Hasura local config and metadata live in `hasura/`, with Docker services defined in `docker-compose.yaml`.

## Build, Test, and Development Commands
- `pnpm dev`: start the Vite dev server.
- `pnpm build`: run TypeScript compilation and produce a production build.
- `pnpm lint`: run ESLint across the repository.
- `pnpm graphql-codegen`: regenerate `src/gql/` after schema or `.graphql` changes.
- `docker compose up -d`: start Postgres, Hasura, and the data connector locally.

## Coding Style & Naming Conventions
Use TypeScript with 2-space indentation and keep formatting Prettier-compatible. Components, context providers, and model classes use PascalCase files such as `Board.tsx` and `Question.ts`. Utility modules use lower-case names such as `utils.ts`. Prefer named imports, keep React components functional, and avoid editing generated GraphQL files manually. Run `pnpm lint` before opening a PR.

## Testing Guidelines
There is currently no test runner configured. Until tests are added, treat `pnpm lint`, `pnpm build`, and a manual UI check as the minimum verification bar. If you add tests, place them near the feature or under `src/__tests__/` and use `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines
Prefer Conventional Commits: `feat:`, `fix:`, `chore:`. Recent history contains a few `wip` commits; do not use that pattern for final commits. Keep messages imperative and specific, for example `fix: handle empty questions response`. PRs should include a short summary, note schema or env changes, link related issues, and add screenshots for UI changes.

## Security & Configuration Tips
Do not commit real secrets. Keep backend-only values such as `HASURA_GRAPHQL_ADMIN_SECRET` and `HASURA_APP_DATABASE_URL` in local `.env`, and keep browser-exposed values under `VITE_*` such as `VITE_HASURA_GRAPHQL_ENDPOINT`. If GraphQL schema changes, update Hasura metadata first, then regenerate types.
