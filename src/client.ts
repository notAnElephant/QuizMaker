import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { firebaseAuth } from "./firebase";

const HASURA_ENDPOINT =
  import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT || "/v1/graphql";
const httpLink = new HttpLink({ uri: HASURA_ENDPOINT });
const authLink = new SetContextLink(async (previousContext) => {
  const token = await firebaseAuth?.currentUser?.getIdToken();

  return {
    headers: {
      ...previousContext.headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
