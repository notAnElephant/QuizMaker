import { CodegenConfig } from "@graphql-codegen/cli";

const hasuraAdminSecret = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

const config: CodegenConfig = {
  schema: {
    "http://localhost:8080/v1/graphql": {
      headers: hasuraAdminSecret
        ? { "x-hasura-admin-secret": hasuraAdminSecret }
        : {},
    },
  },
  documents: ["src/**/*.{ts,tsx}", "src/**/*.graphql"],
  generates: {
    "./src/gql/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
