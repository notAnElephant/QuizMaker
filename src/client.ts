import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://musical-oarfish-5654-91e4faa442.ddn.hasura.app/graphql",
  }),
  cache: new InMemoryCache(),
});
