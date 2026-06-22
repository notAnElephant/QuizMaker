import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

// Configure the browser client from Vite-exposed env vars only.
// For Vite, define these in a .env file as:
//   VITE_HASURA_GRAPHQL_ENDPOINT=/v1/graphql
//   VITE_HASURA_ADMIN_SECRET=your-secret   (optional)
const HASURA_ENDPOINT =
  (import.meta as any)?.env?.VITE_HASURA_GRAPHQL_ENDPOINT ||
  "/v1/graphql";

const HASURA_ADMIN_SECRET = (import.meta as any)?.env?.VITE_HASURA_ADMIN_SECRET;

export const client = new ApolloClient({
  link: new HttpLink({
    uri: HASURA_ENDPOINT,
    headers: HASURA_ADMIN_SECRET
      ? { "x-hasura-admin-secret": HASURA_ADMIN_SECRET }
      : undefined,
  }),
  cache: new InMemoryCache(),
});
