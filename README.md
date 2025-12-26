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
