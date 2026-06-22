import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const HASURA_ENDPOINT = import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT || "/v1/graphql";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: HASURA_ENDPOINT,
  }),
  cache: new InMemoryCache(),
});
