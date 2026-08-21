import cors from "@fastify/cors";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";
import { prisma } from "./database.js";
import { playSessionRoutes } from "./routes/playSessions.js";
import { quizRoutes } from "./routes/quizzes.js";
import { userRoutes } from "./routes/users.js";

export async function buildApp() {
  const app = Fastify({
    logger: process.env.NODE_ENV !== "test",
  }).withTypeProvider<TypeBoxTypeProvider>();
  const configuredOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) =>
    origin.trim(),
  );

  await app.register(cors, {
    origin: configuredOrigins?.length
      ? configuredOrigins
      : process.env.NODE_ENV !== "production",
  });

  app.get("/api/health", async () => ({ status: "ok" }));
  await app.register(userRoutes, { prefix: "/api" });
  await app.register(quizRoutes, { prefix: "/api" });
  await app.register(playSessionRoutes, { prefix: "/api" });

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  return app;
}
