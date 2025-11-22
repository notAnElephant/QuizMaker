# Description of the project

TODO

# Tech stack

The project is built with:

- React (TypeScript)
- Hasura v2 (graphql-engine)
- Tailwind
- Vite

## Hasura

This project now uses Hasura v2 (graphql-engine) instead of Hasura DDN.

### Start Hasura v2 locally

1. Copy/create a `.env` file for the frontend (Vite), for example:
   - VITE_HASURA_GRAPHQL_ENDPOINT=http://localhost:3280/v1/graphql
   - VITE_HASURA_ADMIN_SECRET=your-secret (optional)

2. Start Postgres and Hasura v2 with Docker Compose:
   - docker compose up -d

   This exposes the Hasura console at http://localhost:3280/ and the GraphQL endpoint at http://localhost:3280/v1/graphql.

3. Optional: secure the Hasura console and endpoint by exporting an admin secret before starting or by setting it in your environment:
   - export HASURA_GRAPHQL_ADMIN_SECRET=your-secret
   - Then restart docker compose if already running.

4. Start the frontend (Vite):
   - pnpm dev (or npm run dev / yarn dev)

5. In the Hasura console, create your tables (e.g., a `questions` table) and track them. The Editor page expects a `questions` table with fields like id, content, type, points, category, source, list. Adjust the query in `src/components/Editor.tsx` if your schema differs.
