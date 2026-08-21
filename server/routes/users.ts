import { type Static, Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticate, isLocalAuthEnabled } from "../auth.js";
import { prisma } from "../database.js";

const userBodySchema = Type.Object({
  display_name: Type.Union([Type.Null(), Type.String()]),
  email: Type.Union([Type.Null(), Type.String()]),
});

export const userRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get("/users", async (_request, reply) => {
    if (!isLocalAuthEnabled) {
      return reply.code(403).send({ message: "Local users are disabled" });
    }

    const users = await prisma.user.findMany({
      orderBy: [{ display_name: "asc" }, { created_at: "asc" }],
      select: { display_name: true, email: true, user_id: true },
    });

    return { users };
  });

  app.put(
    "/users/me",
    { preHandler: authenticate, schema: { body: userBodySchema } },
    async (request) => {
      const body = request.body as Static<typeof userBodySchema>;
      const user = await prisma.user.upsert({
        create: {
          display_name: body.display_name,
          email: body.email,
          user_id: request.currentUserId,
        },
        update: {
          display_name: body.display_name,
          email: body.email,
        },
        where: { user_id: request.currentUserId },
        select: { display_name: true, email: true, user_id: true },
      });

      return { user };
    },
  );
};
