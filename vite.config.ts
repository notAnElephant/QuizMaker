import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const hasuraTarget = env.HASURA_SERVER_URL || "http://localhost:8080";
  const hasuraAdminSecret = env.HASURA_GRAPHQL_ADMIN_SECRET;

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/v1/graphql": {
          target: hasuraTarget,
          changeOrigin: true,
          headers: hasuraAdminSecret
            ? { "x-hasura-admin-secret": hasuraAdminSecret }
            : undefined,
        },
      },
    },
  };
});
