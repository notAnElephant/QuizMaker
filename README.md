# Description of the project

TODO

# Tech stack

The project is built with:

- React (TypeScript)
- Hasura v2 (graphql-engine)
- Tailwind
- Vite

## Hasura

This project uses Hasura v2 (graphql-engine).

### Start Hasura v2 locally

1. Start Postgres and Hasura v2 with Docker Compose:
   ```bash
   docker compose up -d
   ```

   This exposes the Hasura console at [http://localhost:8080/console](http://localhost:8080/console) and the GraphQL endpoint at `http://localhost:8080/v1/graphql`.

2. Start the frontend (Vite):
   ```bash
   pnpm dev
   ```

Before starting Docker for the first time, create a local `.env` file from `.env.example`.

- Local backend / Docker Compose variables: `POSTGRES_PASSWORD`, `HASURA_GRAPHQL_ADMIN_SECRET`
- Frontend / Vite variables: `VITE_HASURA_GRAPHQL_ENDPOINT`
- Optional Google login / Firebase variables: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MEASUREMENT_ID`

Local development uses the Docker Postgres service for both Hasura metadata and app data by default. The Vite dev server proxies `/v1/graphql` to local Hasura and injects the admin secret server-side, so keep backend-only values out of `VITE_*` variables.

Google login is optional. If the Firebase `VITE_FIREBASE_*` values are present, the app uses Google sign-in and creates or updates the matching `users` row in Hasura on login. If they are absent, the app falls back to the local seeded user switcher for self-hosted development.

### Production environment

Use a separate production environment configuration instead of reusing local `.env`.

- Local development: `.env`
- Production example values: `.env.production.example`

Set `HASURA_APP_DATABASE_URL` only in production or shared environments where Hasura should point at a remote Postgres instance such as Neon.

### Hasura migrations and local seed

The repository now tracks Hasura metadata in `hasura/metadata/` and expects SQL migrations under `hasura/migrations/default/`.

Typical workflow:

```bash
hasura migrate create "describe_change" --database-name default --from-server --project hasura
pnpm hasura:migrate:apply
pnpm hasura:metadata:apply
```

To rebuild the local database from the committed schema and seed snapshot:

```bash
pnpm db:reset:local
```

This resets the local `public` schema, reapplies Hasura migrations and metadata, then loads `db/seeds/local.sql`, which mirrors the current quiz data snapshot copied from Neon. Use:

```bash
pnpm db:seed:local
```

if the schema already exists and you only want to reload the local data set.

Commit migrations, metadata, and seed changes together when the data model changes. If the Hasura CLI is not installed locally yet, install it before using the migration scripts.

## GraphQL Workflow

This project uses **GraphQL Codegen** to generate TypeScript types automatically from the Hasura schema.

### How it works
1. **Introspection:** The codegen connects to the Hasura endpoint and downloads the schema.
2. **Type Generation:** It generates TypeScript types for all your tables and specific GraphQL operations.
3. **Usage:** Always import `gql` or specific document nodes (like `GetQuestionsDocument`) from the `./src/gql` directory to get full IntelliSense and type safety.

### Regenerate Types
Whenever you change the database schema in Hasura or update a `.graphql` file, run:
```bash
pnpm graphql-codegen
```
This will update the files in `src/gql/` to match the latest server state.

### Tips for Development
- **Exploring Fields:** Don't browse the generated `graphql.ts` file. Instead, use the **Hasura Console (GraphiQL)** at [http://localhost:8080/console](http://localhost:8080/console). Use the "Explorer" sidebar to discover available fields and test your queries before copy-pasting them into your code.
- **Typed Data:** Always rely on IDE IntelliSense. Hover over variables in your `.tsx` files to see their types, and use "Go to Definition" (Cmd/Ctrl + Click) to jump to specific type definitions if needed.
